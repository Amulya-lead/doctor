import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { 
  Patient, 
  StaffEmployee, 
  Bed, 
  PharmacyItem, 
  BillingInvoice, 
  Tenant, 
  SystemEventLog,
  Doctor 
} from '../types';

export const DEFAULT_SUPABASE_URL = 'https://wydwcfekefpptjcrfija.supabase.co';

export const getSupabaseConfig = () => {
  const metaEnv = (import.meta as any).env || {};
  const envUrl = metaEnv.VITE_SUPABASE_URL as string | undefined;
  const envKey = metaEnv.VITE_SUPABASE_ANON_KEY as string | undefined;

  const storedUrl = localStorage.getItem('hospital_supabase_url');
  const storedKey = localStorage.getItem('hospital_supabase_key');

  const url = storedUrl || envUrl || DEFAULT_SUPABASE_URL;
  const anonKey = storedKey || envKey || '';

  return { url, anonKey, isConfigured: Boolean(url && anonKey) };
};

export const setSupabaseAnonKey = (key: string, url?: string) => {
  if (key) {
    localStorage.setItem('hospital_supabase_key', key.trim());
  } else {
    localStorage.removeItem('hospital_supabase_key');
  }
  if (url) {
    localStorage.setItem('hospital_supabase_url', url.trim());
  }
};

let cachedClient: SupabaseClient | null = null;
let lastClientKey = '';

export const getSupabaseClient = (): SupabaseClient | null => {
  const { url, anonKey, isConfigured } = getSupabaseConfig();
  if (!isConfigured) return null;

  const currentSignature = `${url}:${anonKey}`;
  if (cachedClient && lastClientKey === currentSignature) {
    return cachedClient;
  }

  try {
    cachedClient = createClient(url, anonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true
      }
    });
    lastClientKey = currentSignature;
    return cachedClient;
  } catch (err) {
    console.error('Failed to initialize Supabase client:', err);
    return null;
  }
};

// ============================================================================
// Scalability & Performance Engine:
// 1. In-Memory TTL Cache (prevents duplicate network roundtrips)
// 2. Request Queue & Concurrency Limiter (prevents 429 / 503 Server Busy)
// 3. Non-blocking Background Sync (UI never gets stuck in the middle)
// ============================================================================

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

const memoryCache = new Map<string, CacheEntry<any>>();
const inFlightRequests = new Map<string, Promise<any>>();
const CACHE_TTL_MS = 60 * 1000; // 60 seconds fresh cache
const CACHE_STALE_TTL_MS = 120 * 1000; // Up to 120 seconds for Stale-While-Revalidate

function getFromCache<T>(key: string): { data: T; isStale: boolean } | null {
  const entry = memoryCache.get(key);
  if (!entry) return null;
  const age = Date.now() - entry.timestamp;
  if (age > CACHE_STALE_TTL_MS) {
    memoryCache.delete(key);
    return null;
  }
  return {
    data: entry.data,
    isStale: age > CACHE_TTL_MS
  };
}

function setInCache<T>(key: string, data: T): void {
  memoryCache.set(key, { data, timestamp: Date.now() });
}

// Enterprise Write Buffer & Backpressure Queue (Max 2 concurrent, auto-retry with exponential backoff)
interface QueuedTask {
  fn: () => Promise<void>;
  retries: number;
  maxRetries: number;
}

class BackgroundSyncQueue {
  private queue: QueuedTask[] = [];
  private activeCount = 0;
  private readonly maxConcurrent = 2;

  enqueue(fn: () => Promise<void>, maxRetries = 3) {
    this.queue.push({ fn, retries: 0, maxRetries });
    this.processNext();
  }

  private async processNext() {
    if (this.activeCount >= this.maxConcurrent || this.queue.length === 0) {
      return;
    }

    const item = this.queue.shift();
    if (!item) return;

    this.activeCount++;
    try {
      await item.fn();
    } catch (err: any) {
      const isRateLimitOrNetwork = 
        err?.status === 429 || 
        err?.status === 503 || 
        err?.message?.includes('Failed to fetch') ||
        err?.message?.includes('network');

      if (isRateLimitOrNetwork && item.retries < item.maxRetries) {
        item.retries++;
        const backoffDelay = Math.min(1000 * Math.pow(2, item.retries), 6000) + Math.random() * 200;
        console.warn(`[SyncQueue] Rate-limit/network backpressure. Retrying in ${Math.round(backoffDelay)}ms (Attempt ${item.retries}/${item.maxRetries})...`);
        setTimeout(() => {
          this.queue.push(item);
          this.processNext();
        }, backoffDelay);
      } else {
        console.warn('[SyncQueue] Gracefully absorbed sync error (optimistic local state preserved):', err?.message || err);
      }
    } finally {
      this.activeCount--;
      // 80ms rate smoothing delay between tasks prevents bursts that trigger HTTP 429
      setTimeout(() => this.processNext(), 80);
    }
  }
}

const backgroundQueue = new BackgroundSyncQueue();

// Execute read requests with Stale-While-Revalidate (SWR) caching & in-flight deduplication
async function executeCachedFetch<T>(
  cacheKey: string,
  fetcher: () => Promise<T | null>
): Promise<T | null> {
  const cached = getFromCache<T>(cacheKey);
  
  // If we have a fresh or stale cache entry, return it immediately to avoid UI blocking
  if (cached !== null) {
    // If it's stale (older than 60s), revalidate silently in the background
    if (cached.isStale && !inFlightRequests.has(cacheKey)) {
      const refreshPromise = (async () => {
        try {
          const freshData = await fetcher();
          if (freshData !== null) {
            setInCache(cacheKey, freshData);
          }
        } catch {
          // Keep using cached data on failure
        } finally {
          inFlightRequests.delete(cacheKey);
        }
      })();
      inFlightRequests.set(cacheKey, refreshPromise);
    }
    return cached.data;
  }

  // If already in flight, reuse the pending promise
  if (inFlightRequests.has(cacheKey)) {
    return inFlightRequests.get(cacheKey) as Promise<T | null>;
  }

  const promise = (async () => {
    try {
      const result = await fetcher();
      if (result !== null) {
        setInCache(cacheKey, result);
      }
      return result;
    } catch (err) {
      console.warn(`Query failed for ${cacheKey} (fallback to local data):`, err);
      return null;
    } finally {
      inFlightRequests.delete(cacheKey);
    }
  })();

  inFlightRequests.set(cacheKey, promise);
  return promise;
}

// ============================================================================
// Connectivity Test
// ============================================================================
export const testSupabaseConnection = async (): Promise<{ success: boolean; message: string }> => {
  const client = getSupabaseClient();
  if (!client) {
    return { 
      success: false, 
      message: 'Supabase anon public key is missing. Add your anon key to connect.' 
    };
  }

  try {
    const { error } = await client.from('tenants').select('id').limit(1);
    if (error) {
      return { 
        success: false, 
        message: `Connected to Supabase, but query returned: ${error.message}` 
      };
    }
    return { success: true, message: 'Connected to Supabase database (wydwcfekefpptjcrfija)!' };
  } catch (err: any) {
    return { success: false, message: `Connection error: ${err?.message || 'Network unreachable'}` };
  }
};

// ============================================================================
// High-Performance Data Handlers (Scoped, Cached & Non-Blocking)
// ============================================================================

// --- Patients ---
export const fetchPatientsFromDb = async (tenantId?: string): Promise<Patient[] | null> => {
  const cacheKey = `patients_${tenantId || 'all'}`;

  return executeCachedFetch(cacheKey, async () => {
    const client = getSupabaseClient();
    if (!client) return null;

    let query = client
      .from('patients')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100);

    if (tenantId && tenantId !== 'all') {
      query = query.eq('tenant_id', tenantId);
    }

    const { data, error } = await query;
    if (error) throw error;
    if (!data) return [];

    return data.map((row: any): Patient => ({
      id: row.id,
      abhaId: row.abha_id || '',
      abhaAddress: row.abha_address || '',
      name: row.name,
      age: Number(row.age) || 0,
      gender: row.gender || 'Other',
      bloodGroup: row.blood_group || '',
      phone: row.phone || '',
      email: row.email || '',
      emergencyContact: row.emergency_contact || { name: '', relationship: '', phone: '' },
      allergies: Array.isArray(row.allergies) ? row.allergies : [],
      chronicConditions: Array.isArray(row.chronic_conditions) ? row.chronic_conditions : [],
      status: row.status || 'Outpatient',
      assignedDoctorId: row.assigned_doctor_id || '',
      assignedDoctorName: row.assigned_doctor_name || '',
      assignedBed: row.assigned_bed || '',
      ward: row.ward || '',
      vitals: row.vitals || {
        temperature: '98.6 °F',
        bloodPressure: '120/80 mmHg',
        pulseRate: 72,
        spO2: 99,
        respiratoryRate: 16,
        bmi: '22.4',
        recordedAt: 'Registration'
      },
      registrationDate: row.registration_date || '',
      recentDiagnosis: row.recent_diagnosis || '',
      insuranceProvider: row.insurance_provider || '',
      insurancePolicyNo: row.insurance_policy_no || '',
      totalBilled: Number(row.total_billed) || 0,
      pendingBalance: Number(row.pending_balance) || 0,
      dischargeDate: row.discharge_date || '',
      dischargeSummary: row.discharge_summary || ''
    }));
  });
};

export const upsertPatientInDb = (patient: Patient, tenantId = 'hosp-default') => {
  // Invalidate cache immediately so new patient appears
  memoryCache.delete(`patients_${tenantId}`);
  memoryCache.delete('patients_all');

  backgroundQueue.enqueue(async () => {
    const client = getSupabaseClient();
    if (!client) return;

    await client.from('patients').upsert({
      id: patient.id,
      tenant_id: tenantId,
      abha_id: patient.abhaId,
      abha_address: patient.abhaAddress,
      name: patient.name,
      age: patient.age,
      gender: patient.gender,
      blood_group: patient.bloodGroup,
      phone: patient.phone,
      email: patient.email,
      emergency_contact: patient.emergencyContact,
      allergies: patient.allergies,
      chronic_conditions: patient.chronicConditions,
      status: patient.status,
      assigned_doctor_id: patient.assignedDoctorId,
      assigned_doctor_name: patient.assignedDoctorName,
      assigned_bed: patient.assignedBed,
      ward: patient.ward,
      vitals: patient.vitals,
      registration_date: patient.registrationDate,
      recent_diagnosis: patient.recentDiagnosis,
      insurance_provider: patient.insuranceProvider,
      insurance_policy_no: patient.insurancePolicyNo,
      total_billed: patient.totalBilled,
      pending_balance: patient.pendingBalance
    });
  });
};

export const deletePatientInDb = (patientId: string) => {
  memoryCache.clear();
  backgroundQueue.enqueue(async () => {
    const client = getSupabaseClient();
    if (!client) return;
    await client.from('patients').delete().eq('id', patientId);
  });
};

// --- Staff ---
export const fetchStaffFromDb = async (tenantId?: string): Promise<StaffEmployee[] | null> => {
  const cacheKey = `staff_${tenantId || 'all'}`;

  return executeCachedFetch(cacheKey, async () => {
    const client = getSupabaseClient();
    if (!client) return null;

    let query = client
      .from('staff')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100);

    if (tenantId && tenantId !== 'all') {
      query = query.eq('tenant_id', tenantId);
    }

    const { data, error } = await query;
    if (error) throw error;
    if (!data) return [];

    return data.map((row: any): StaffEmployee => ({
      id: row.id,
      name: row.name,
      designation: row.designation,
      department: row.department,
      role: row.role,
      phone: row.phone || '',
      email: row.email || '',
      joiningDate: row.joining_date || '',
      shift: row.shift || 'Morning (08:00 - 16:00)',
      attendanceStatus: row.attendance_status || 'Present',
      baseSalary: Number(row.base_salary) || 0,
      incentives: Number(row.incentives) || 0,
      bonuses: Number(row.bonuses) || 0,
      deductions: Number(row.deductions) || 0,
      salaryStatus: row.salary_status || 'Pending',
      lastDisbursedDate: row.last_disbursed_date || '',
      bonusReason: row.bonus_reason || '',
      deductionReason: row.deduction_reason || ''
    }));
  });
};

export const upsertStaffInDb = (staff: StaffEmployee, tenantId = 'hosp-default') => {
  memoryCache.delete(`staff_${tenantId}`);
  memoryCache.delete('staff_all');

  backgroundQueue.enqueue(async () => {
    const client = getSupabaseClient();
    if (!client) return;

    await client.from('staff').upsert({
      id: staff.id,
      tenant_id: tenantId,
      name: staff.name,
      designation: staff.designation,
      department: staff.department,
      role: staff.role,
      phone: staff.phone,
      email: staff.email,
      joining_date: staff.joiningDate,
      shift: staff.shift,
      attendance_status: staff.attendanceStatus,
      base_salary: staff.baseSalary,
      incentives: staff.incentives,
      bonuses: staff.bonuses,
      deductions: staff.deductions,
      salary_status: staff.salaryStatus,
      last_disbursed_date: staff.lastDisbursedDate,
      bonus_reason: staff.bonusReason,
      deduction_reason: staff.deductionReason
    });
  });
};

export const deleteStaffInDb = (staffId: string) => {
  memoryCache.clear();
  backgroundQueue.enqueue(async () => {
    const client = getSupabaseClient();
    if (!client) return;
    await client.from('staff').delete().eq('id', staffId);
  });
};

// --- Beds ---
export const fetchBedsFromDb = async (tenantId?: string): Promise<Bed[] | null> => {
  const cacheKey = `beds_${tenantId || 'all'}`;

  return executeCachedFetch(cacheKey, async () => {
    const client = getSupabaseClient();
    if (!client) return null;

    let query = client
      .from('beds')
      .select('*')
      .order('bed_number', { ascending: true })
      .limit(100);

    if (tenantId && tenantId !== 'all') {
      query = query.eq('tenant_id', tenantId);
    }

    const { data, error } = await query;
    if (error) throw error;
    if (!data) return [];

    return data.map((row: any): Bed => ({
      id: row.id,
      bedNumber: row.bed_number,
      wardType: row.ward_type,
      floor: row.floor || 'Floor 1',
      status: row.status,
      patientId: row.patient_id || undefined,
      patientName: row.patient_name || undefined,
      admittedAt: row.admitted_at || undefined,
      oxygenEquipped: Boolean(row.oxygen_equipped),
      ventilatorEquipped: Boolean(row.ventilator_equipped),
      dailyRate: Number(row.daily_rate) || 1500
    }));
  });
};

export const upsertBedInDb = (bed: Bed, tenantId = 'hosp-default') => {
  memoryCache.delete(`beds_${tenantId}`);
  memoryCache.delete('beds_all');

  backgroundQueue.enqueue(async () => {
    const client = getSupabaseClient();
    if (!client) return;

    await client.from('beds').upsert({
      id: bed.id,
      tenant_id: tenantId,
      bed_number: bed.bedNumber,
      ward_type: bed.wardType,
      floor: bed.floor,
      status: bed.status,
      patient_id: bed.patientId || null,
      patient_name: bed.patientName || null,
      admitted_at: bed.admittedAt || null,
      oxygen_equipped: bed.oxygenEquipped,
      ventilator_equipped: bed.ventilatorEquipped,
      daily_rate: bed.dailyRate
    });
  });
};

export const deleteBedInDb = (bedId: string) => {
  memoryCache.clear();
  backgroundQueue.enqueue(async () => {
    const client = getSupabaseClient();
    if (!client) return;
    await client.from('beds').delete().eq('id', bedId);
  });
};

// --- Pharmacy ---
export const fetchPharmacyFromDb = async (): Promise<PharmacyItem[] | null> => {
  return executeCachedFetch('pharmacy_all', async () => {
    const client = getSupabaseClient();
    if (!client) return null;

    const { data, error } = await client
      .from('pharmacy_items')
      .select('*')
      .order('name', { ascending: true })
      .limit(100);

    if (error) throw error;
    if (!data) return [];

    return data.map((row: any): PharmacyItem => ({
      id: row.id,
      name: row.name,
      genericName: row.generic_name || '',
      category: row.category,
      batchNo: row.batch_no || '',
      stockQty: Number(row.stock_qty) || 0,
      reorderLevel: Number(row.reorder_level) || 10,
      unitPrice: Number(row.unit_price) || 0,
      mrp: Number(row.mrp) || 0,
      expiryDate: row.expiry_date || '',
      supplier: row.supplier || '',
      rackLocation: row.rack_location || '',
      requiresPrescription: Boolean(row.requires_prescription)
    }));
  });
};

export const upsertPharmacyInDb = (item: PharmacyItem, tenantId = 'hosp-default') => {
  memoryCache.delete('pharmacy_all');
  backgroundQueue.enqueue(async () => {
    const client = getSupabaseClient();
    if (!client) return;

    await client.from('pharmacy_items').upsert({
      id: item.id,
      tenant_id: tenantId,
      name: item.name,
      generic_name: item.genericName,
      category: item.category,
      batch_no: item.batchNo,
      stock_qty: item.stockQty,
      reorder_level: item.reorderLevel,
      unit_price: item.unitPrice,
      mrp: item.mrp,
      expiry_date: item.expiryDate,
      supplier: item.supplier,
      rack_location: item.rackLocation,
      requires_prescription: item.requiresPrescription
    });
  });
};

export const deletePharmacyInDb = (itemId: string) => {
  memoryCache.delete('pharmacy_all');
  backgroundQueue.enqueue(async () => {
    const client = getSupabaseClient();
    if (!client) return;
    await client.from('pharmacy_items').delete().eq('id', itemId);
  });
};

// --- Invoices ---
export const fetchInvoicesFromDb = async (tenantId?: string): Promise<BillingInvoice[] | null> => {
  const cacheKey = `invoices_${tenantId || 'all'}`;

  return executeCachedFetch(cacheKey, async () => {
    const client = getSupabaseClient();
    if (!client) return null;

    let query = client
      .from('invoices')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100);

    if (tenantId && tenantId !== 'all') {
      query = query.eq('tenant_id', tenantId);
    }

    const { data, error } = await query;
    if (error) throw error;
    if (!data) return [];

    return data.map((row: any): BillingInvoice => ({
      id: row.id,
      patientId: row.patient_id,
      patientName: row.patient_name,
      abhaId: row.abha_id || '',
      invoiceDate: row.invoice_date,
      type: row.type,
      items: Array.isArray(row.items) ? row.items : [],
      subtotal: Number(row.subtotal) || 0,
      taxAmount: Number(row.tax_amount) || 0,
      discount: Number(row.discount) || 0,
      totalAmount: Number(row.total_amount) || 0,
      paidAmount: Number(row.paid_amount) || 0,
      paymentMethod: row.payment_method,
      status: row.status,
      insuranceClaimStatus: row.insurance_claim_status || undefined,
      transactionRef: row.transaction_ref || undefined
    }));
  });
};

export const upsertInvoiceInDb = (invoice: BillingInvoice, tenantId = 'hosp-default') => {
  memoryCache.delete(`invoices_${tenantId}`);
  memoryCache.delete('invoices_all');

  backgroundQueue.enqueue(async () => {
    const client = getSupabaseClient();
    if (!client) return;

    await client.from('invoices').upsert({
      id: invoice.id,
      tenant_id: tenantId,
      patient_id: invoice.patientId,
      patient_name: invoice.patientName,
      abha_id: invoice.abhaId,
      invoice_date: invoice.invoiceDate,
      type: invoice.type,
      items: invoice.items,
      subtotal: invoice.subtotal,
      tax_amount: invoice.taxAmount,
      discount: invoice.discount,
      total_amount: invoice.totalAmount,
      paid_amount: invoice.paidAmount,
      payment_method: invoice.paymentMethod,
      status: invoice.status,
      insurance_claim_status: invoice.insuranceClaimStatus || null,
      transaction_ref: invoice.transactionRef || null
    });
  });
};

// --- Tenants ---
export const fetchTenantsFromDb = async (): Promise<Tenant[] | null> => {
  return executeCachedFetch('tenants_all', async () => {
    const client = getSupabaseClient();
    if (!client) return null;

    const { data, error } = await client
      .from('tenants')
      .select('*')
      .order('created_at', { ascending: true })
      .limit(100);

    if (error) throw error;
    if (!data || data.length === 0) return null;

    return data.map((row: any): Tenant => ({
      id: row.id,
      name: row.name,
      type: row.type || 'hospital',
      logo: row.logo || '',
      tagline: row.tagline || '',
      licenseNumber: row.license_number || '',
      abdmFacilityId: row.abdm_facility_id || '',
      nabhAccredited: Boolean(row.nabh_accredited),
      themeColor: row.theme_color || '#0284c7',
      branches: Array.isArray(row.branches) ? row.branches : [],
      currentBranchId: row.branches?.[0]?.id || 'branch-main'
    }));
  });
};

export const upsertTenantInDb = (tenant: Tenant) => {
  memoryCache.delete('tenants_all');
  backgroundQueue.enqueue(async () => {
    const client = getSupabaseClient();
    if (!client) return;

    await client.from('tenants').upsert({
      id: tenant.id,
      name: tenant.name,
      type: tenant.type,
      logo: tenant.logo,
      tagline: tenant.tagline,
      license_number: tenant.licenseNumber,
      abdm_facility_id: tenant.abdmFacilityId,
      nabh_accredited: tenant.nabhAccredited,
      theme_color: tenant.themeColor,
      branches: tenant.branches
    });
  });
};

// --- System Events ---
export const recordSystemEventInDb = (event: SystemEventLog, tenantId = 'hosp-default') => {
  backgroundQueue.enqueue(async () => {
    const client = getSupabaseClient();
    if (!client) return;

    await client.from('system_events').insert({
      id: event.id,
      tenant_id: tenantId,
      module: event.module,
      title: event.title,
      description: event.description,
      severity: event.severity,
      actor: event.actor,
      patient_id: event.patientId || null,
      timestamp: event.timestamp
    });
  });
};
