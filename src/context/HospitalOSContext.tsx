import React, { createContext, useContext, useState, useEffect, useMemo, useRef } from 'react';
import { 
  Tenant, 
  Patient, 
  Doctor, 
  LabTestOrder, 
  PharmacyItem, 
  Bed, 
  BillingInvoice, 
  StaffEmployee, 
  SystemEventLog, 
  UserRole,
  OperationalMetrics,
  LabTestStatus
} from '../types';
import { 
  INITIAL_TENANTS, 
  INITIAL_PATIENTS, 
  INITIAL_LAB_TESTS, 
  INITIAL_PHARMACY_ITEMS, 
  INITIAL_BEDS, 
  INITIAL_INVOICES, 
  INITIAL_STAFF, 
  DEFAULT_20_STAFF_MEMBERS,
  INITIAL_SYSTEM_EVENTS 
} from '../data/mockData';
import { 
  getSupabaseConfig, 
  testSupabaseConnection, 
  setSupabaseAnonKey,
  fetchPatientsFromDb,
  upsertPatientInDb,
  deletePatientInDb,
  fetchStaffFromDb,
  upsertStaffInDb,
  deleteStaffInDb,
  fetchBedsFromDb,
  upsertBedInDb,
  deleteBedInDb,
  fetchPharmacyFromDb,
  upsertPharmacyInDb,
  deletePharmacyInDb,
  fetchInvoicesFromDb,
  upsertInvoiceInDb,
  fetchTenantsFromDb,
  upsertTenantInDb,
  deleteTenantFromDb,
  recordSystemEventInDb
} from '../lib/supabase';

export type NavigationModule = 
  | 'doctors'
  | 'patients'
  | 'operations'
  | 'lims'
  | 'pharmacy'
  | 'billing'
  | 'admin_payroll'
  | 'insurance'
  | 'patient_portal';

export interface UserSession {
  id: string;
  name: string;
  role: UserRole;
  title: string;
  department: string;
  avatar: string;
  hprId?: string;
  email: string;
}

interface SimulationStep {
  step: number;
  title: string;
  department: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed';
  timestamp: string;
}

interface HospitalOSContextType {
  // Authentication & Session
  isAuthenticated: boolean;
  currentUser: UserSession;
  loginAsRole: (role: UserRole, customTenantId?: string) => void;
  loginAsPatient: (patientInfo: { name: string; phone?: string; email?: string; bloodGroup?: string; age?: number }) => void;
  logout: () => void;

  // Tenant & Organization
  tenants: Tenant[];
  currentTenant: Tenant;
  currentBranchId: string;
  setCurrentTenantId: (id: string) => void;
  setCurrentBranchId: (id: string) => void;
  addTenant: (tenant: Partial<Tenant>) => void;
  removeTenant: (tenantId: string) => void;

  // Active Role & User
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;

  // Role permissions
  getAllowedModulesForRole: (role: UserRole) => NavigationModule[];

  // Active Module
  activeModule: NavigationModule;
  setActiveModule: (module: NavigationModule) => void;

  // Data
  patients: Patient[];
  doctors: Doctor[];
  labTests: LabTestOrder[];
  pharmacyItems: PharmacyItem[];
  beds: Bed[];
  invoices: BillingInvoice[];
  staff: StaffEmployee[];
  events: SystemEventLog[];
  metrics: OperationalMetrics;

  // Actions
  addPatient: (patient: Partial<Patient>) => void;
  updatePatient: (patientId: string, updates: Partial<Patient>) => void;
  dischargePatient: (patientId: string, summary?: string) => void;
  removePatient: (patientId: string) => void;
  updateLabStatus: (labId: string, status: LabTestStatus) => void;
  addLabTest: (test: Partial<LabTestOrder>) => void;
  updateLabTestParameters: (labId: string, parameters: LabTestOrder['parameters']) => void;
  seedSampleLabTests: () => void;
  dispenseMedicine: (medicineId: string, qty: number) => void;
  addPharmacyItem: (item: Partial<PharmacyItem>) => void;
  removePharmacyItem: (itemId: string) => void;
  addBed: (bed: Partial<Bed>) => void;
  removeBed: (bedId: string) => void;
  updateBedStatus: (bedId: string, status: Bed['status'], patientId?: string, patientName?: string) => void;
  payInvoice: (invoiceId: string, method: BillingInvoice['paymentMethod']) => void;
  createInvoice: (invoiceData: Partial<BillingInvoice>) => BillingInvoice;
  bookAppointment: (booking: {
    patientId: string;
    patientName: string;
    doctorId: string;
    doctorName: string;
    department: string;
    date: string;
    timeSlot: string;
    consultationType: 'OPD Consultation' | 'IPD Admission' | 'Diagnostics' | 'Pharmacy';
    fee: number;
    payNow?: boolean;
    paymentMethod?: BillingInvoice['paymentMethod'];
  }) => BillingInvoice;
  addSystemEvent: (event: Omit<SystemEventLog, 'id' | 'timestamp'>) => void;

  // Staff & Admin Payroll
  addStaffMember: (staffData: Partial<StaffEmployee>) => void;
  removeStaffMember: (staffId: string) => void;
  giveBonus: (staffId: string, amount: number, reason: string) => void;
  deductSalary: (staffId: string, amount: number, reason: string) => void;
  disburseSalary: (staffId: string) => void;
  disburseAllSalaries: () => void;
  resetPayrollCycle: () => void;
  populateDefaultStaffRoster: () => void;

  // Emergency Alert trigger
  emergencyAlert: string | null;
  triggerEmergencyAlert: (msg: string) => void;
  clearEmergencyAlert: () => void;

  // Supabase Cloud Connection & Sync
  isSupabaseConnected: boolean;
  supabaseStatus: 'connected' | 'checking' | 'disconnected' | 'needs_key';
  supabaseMessage: string;
  connectSupabaseKey: (key: string, url?: string) => Promise<boolean>;
  syncAllToSupabase: () => Promise<void>;
  clearAllMockData: () => void;

  // Simulation
  isSimulating: boolean;
  simulationSteps: SimulationStep[];
  currentSimulationStep: number;
  startSimulation: () => void;
  resetSimulation: () => void;
}

const HospitalOSContext = createContext<HospitalOSContextType | undefined>(undefined);

export const DEFAULT_ROLE_USERS: Record<UserRole, UserSession> = {
  admin: {
    id: 'USR-ADMIN',
    name: 'Dr. Arvind Swamy',
    role: 'admin',
    title: 'Hospital Director & Medical Superintendent',
    department: 'Hospital Administration & HR',
    avatar: '👑',
    email: 'admin@citycare.in',
    hprId: 'HPR-IN-2002-00012'
  },
  doctor: {
    id: 'USR-DOC',
    name: 'Dr. Priya Iyer, MD',
    role: 'doctor',
    title: 'Chief Physician & Consultant',
    department: 'General Medicine & OPD',
    avatar: '👨‍⚕️',
    email: 'doctor@citycare.in',
    hprId: 'HPR-IN-2010-09882'
  },
  nurse: {
    id: 'USR-NURSE',
    name: 'Sr. Ancy Varghese',
    role: 'nurse',
    title: 'Nursing Superintendent',
    department: 'Hospital Inpatient & ICU Wards',
    avatar: '💉',
    email: 'nurse@citycare.in'
  },
  receptionist: {
    id: 'USR-RECEP',
    name: 'Devika Pillai',
    role: 'receptionist',
    title: 'Front-Desk Officer',
    department: 'Patient Check-in & Triage',
    avatar: '📋',
    email: 'reception@citycare.in'
  },
  lab_tech: {
    id: 'USR-LAB',
    name: 'Suresh Menon',
    role: 'lab_tech',
    title: 'Senior Medical Laboratory Technologist',
    department: 'Pathology & Diagnostic Lab',
    avatar: '🔬',
    email: 'lab@citycare.in'
  },
  pharmacist: {
    id: 'USR-PHARM',
    name: 'Pooja Kulkarni',
    role: 'pharmacist',
    title: 'Hospital Pharmacist',
    department: 'Central Pharmacy',
    avatar: '💊',
    email: 'pharmacy@citycare.in'
  },
  accountant: {
    id: 'USR-ACC',
    name: 'Karan Mehra',
    role: 'accountant',
    title: 'Billing & Cashier Lead',
    department: 'Finance & Accounts',
    avatar: '💰',
    email: 'accounts@citycare.in'
  },
  hr_manager: {
    id: 'USR-HR',
    name: 'Meenakshi Sundaram',
    role: 'hr_manager',
    title: 'Staff & HR Lead',
    department: 'Human Resources & Staff Roster',
    avatar: '👥',
    email: 'hr@citycare.in'
  },
  patient: {
    id: 'USR-PT',
    name: 'Patient Account',
    role: 'patient',
    title: 'Patient Account',
    department: 'Patient Portal',
    avatar: '👤',
    email: 'patient@hospital.in'
  }
};

export const ROLE_DEFAULT_MODULES: Record<UserRole, NavigationModule> = {
  admin: 'admin_payroll',
  doctor: 'doctors',
  nurse: 'operations',
  receptionist: 'patients',
  lab_tech: 'lims',
  pharmacist: 'pharmacy',
  accountant: 'billing',
  hr_manager: 'admin_payroll',
  patient: 'patient_portal'
};

export const ROLE_ALLOWED_MODULES: Record<UserRole, NavigationModule[]> = {
  admin: ['admin_payroll', 'operations', 'insurance'],
  doctor: ['doctors', 'patients'],
  nurse: ['operations', 'patients'],
  receptionist: ['patients'],
  lab_tech: ['lims'],
  pharmacist: ['pharmacy'],
  accountant: ['billing', 'insurance'],
  hr_manager: ['admin_payroll'],
  patient: []
};

export const HospitalOSProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Session & Auth state
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('hospital_auth') === 'true';
  });

  const [currentRole, setCurrentRole] = useState<UserRole>(() => {
    return (localStorage.getItem('hospital_role') as UserRole) || 'admin';
  });

  const [currentUser, setCurrentUser] = useState<UserSession>(() => {
    return DEFAULT_ROLE_USERS[currentRole] || DEFAULT_ROLE_USERS.admin;
  });

  const [activeModule, setActiveModule] = useState<NavigationModule>(() => {
    return ROLE_DEFAULT_MODULES[currentRole] || 'admin_payroll';
  });

  // Persistent Hospitals state (merges stored custom hospitals with defaults)
  const [tenants, setTenants] = useState<Tenant[]>(() => {
    try {
      const stored = localStorage.getItem('hospital_tenants');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const byId = new Map<string, Tenant>();
          for (const t of INITIAL_TENANTS) byId.set(t.id, t);
          for (const t of parsed) byId.set(t.id, t);
          return Array.from(byId.values());
        }
      }
      return INITIAL_TENANTS;
    } catch {
      return INITIAL_TENANTS;
    }
  });

  const [currentTenantId, setCurrentTenantId] = useState<string>(() => {
    return localStorage.getItem('hospital_tenant_id') || tenants[0]?.id || 'hosp-default';
  });

  const [currentBranchId, setCurrentBranchId] = useState<string>('branch-main');

  // Persistent Staff state
  const [staff, setStaff] = useState<StaffEmployee[]>(() => {
    try {
      const stored = localStorage.getItem('hospital_staff');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
      return INITIAL_STAFF;
    } catch {
      return INITIAL_STAFF;
    }
  });

  // Persistent Beds state
  const [beds, setBeds] = useState<Bed[]>(() => {
    try {
      const stored = localStorage.getItem('hospital_beds');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
      return INITIAL_BEDS;
    } catch {
      return INITIAL_BEDS;
    }
  });

  // Persistent Patients state
  const [patients, setPatients] = useState<Patient[]>(() => {
    try {
      const stored = localStorage.getItem('hospital_patients');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
      return INITIAL_PATIENTS;
    } catch {
      return INITIAL_PATIENTS;
    }
  });

  // Persistent Pharmacy state
  const [pharmacyItems, setPharmacyItems] = useState<PharmacyItem[]>(() => {
    try {
      const stored = localStorage.getItem('hospital_pharmacy');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
      return INITIAL_PHARMACY_ITEMS;
    } catch {
      return INITIAL_PHARMACY_ITEMS;
    }
  });

  const [labTests, setLabTests] = useState<LabTestOrder[]>(INITIAL_LAB_TESTS);
  const [invoices, setInvoices] = useState<BillingInvoice[]>(() => {
    try {
      const stored = localStorage.getItem('hospital_invoices');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
      return INITIAL_INVOICES;
    } catch {
      return INITIAL_INVOICES;
    }
  });
  const [events, setEvents] = useState<SystemEventLog[]>(INITIAL_SYSTEM_EVENTS);
  const [emergencyAlert, setEmergencyAlert] = useState<string | null>(null);

  // Supabase State
  const [isSupabaseConnected, setIsSupabaseConnected] = useState<boolean>(false);
  const [supabaseStatus, setSupabaseStatus] = useState<'connected' | 'checking' | 'disconnected' | 'needs_key'>('checking');
  const [supabaseMessage, setSupabaseMessage] = useState<string>('Initializing cloud connection...');
  const hydratedTablesRef = useRef<Set<string>>(new Set());

  // 1. Lightweight Startup Sync: Only fetch hospital directory (`tenants`) on public load (0-1 query instead of 7!)
  useEffect(() => {
    let isMounted = true;
    const initPublicDirectory = async () => {
      const config = getSupabaseConfig();
      if (!config.anonKey) {
        if (isMounted) {
          setIsSupabaseConnected(false);
          setSupabaseStatus('needs_key');
          setSupabaseMessage('Supabase anon public key needed to connect to wydwcfekefpptjcrfija.');
        }
        return;
      }

      // Skip redundant network ping if tenants were synced recently within 2 minutes
      const lastTenantsSync = Number(localStorage.getItem('hospital_sync_ts_tenants') || 0);
      if (Date.now() - lastTenantsSync < 120_000 && tenants.length > 0) {
        if (isMounted) {
          setIsSupabaseConnected(true);
          setSupabaseStatus('connected');
          setSupabaseMessage('Cloud cache active (0-latency mode)');
          hydratedTablesRef.current.add('tenants');
        }
        return;
      }

      setSupabaseStatus('checking');
      try {
        const dbTenants = await fetchTenantsFromDb();
        if (!isMounted) return;

        setIsSupabaseConnected(true);
        setSupabaseStatus('connected');
        setSupabaseMessage('Connected to cloud database (low-request mode)');
        hydratedTablesRef.current.add('tenants');
        localStorage.setItem('hospital_sync_ts_tenants', String(Date.now()));

        if (dbTenants && dbTenants.length > 0) {
          setTenants(prev => {
            const merged = new Map<string, Tenant>();
            for (const t of prev) merged.set(t.id, t);
            for (const t of dbTenants) merged.set(t.id, t);
            return Array.from(merged.values());
          });
        }
      } catch (err: any) {
        if (isMounted) {
          setIsSupabaseConnected(false);
          setSupabaseStatus('disconnected');
          setSupabaseMessage(`Offline cache active (${err?.message || 'Network unreachable'})`);
        }
      }
    };

    initPublicDirectory();
    return () => { isMounted = false; };
  }, []);

  // 2. Role-Aware Staggered Cloud Hydration (Only loads tables required for active role, max 2 concurrent)
  useEffect(() => {
    if (!isAuthenticated || !isSupabaseConnected) return;
    let isMounted = true;

    const hydrateForRole = async () => {
      try {
        const neededTables: string[] =
          currentRole === 'patient'
            ? ['staff', 'patients', 'invoices']
            : ['patients', 'staff', 'invoices', 'beds', 'pharmacy'];

        const toFetch = neededTables.filter(t => !hydratedTablesRef.current.has(t));
        if (toFetch.length === 0) return;

        // Fetch smoothly in pairs (max 2 concurrent requests to protect free-tier concurrency)
        for (let i = 0; i < toFetch.length; i += 2) {
          if (!isMounted) return;
          const batch = toFetch.slice(i, i + 2);
          await Promise.all(
            batch.map(async (table) => {
              if (table === 'patients') {
                const res = await fetchPatientsFromDb();
                if (isMounted && res && res.length > 0) setPatients(res);
              } else if (table === 'staff') {
                const res = await fetchStaffFromDb();
                if (isMounted && res && res.length > 0) setStaff(res);
              } else if (table === 'invoices') {
                const res = await fetchInvoicesFromDb();
                if (isMounted && res && res.length > 0) setInvoices(res);
              } else if (table === 'beds') {
                const res = await fetchBedsFromDb();
                if (isMounted && res && res.length > 0) setBeds(res);
              } else if (table === 'pharmacy') {
                const res = await fetchPharmacyFromDb();
                if (isMounted && res && res.length > 0) setPharmacyItems(res);
              }
              hydratedTablesRef.current.add(table);
            })
          );
        }
      } catch (e) {
        console.warn('Background role hydration warning (using local cache):', e);
      }
    };

    hydrateForRole();
    return () => { isMounted = false; };
  }, [isAuthenticated, currentRole, isSupabaseConnected]);

  const connectSupabaseKey = async (key: string, url?: string): Promise<boolean> => {
    setSupabaseAnonKey(key, url);
    setSupabaseStatus('checking');
    const test = await testSupabaseConnection();
    if (test.success) {
      setIsSupabaseConnected(true);
      setSupabaseStatus('connected');
      setSupabaseMessage(test.message);
      hydratedTablesRef.current.clear();
      return true;
    } else {
      setIsSupabaseConnected(false);
      setSupabaseStatus('disconnected');
      setSupabaseMessage(test.message);
      return false;
    }
  };

  const syncAllToSupabase = async () => {
    for (const t of tenants) upsertTenantInDb(t);
    for (const s of staff) upsertStaffInDb(s, currentTenantId);
    for (const b of beds) upsertBedInDb(b, currentTenantId);
    for (const p of patients) upsertPatientInDb(p, currentTenantId);
    for (const item of pharmacyItems) upsertPharmacyInDb(item, currentTenantId);
    for (const inv of invoices) upsertInvoiceInDb(inv, currentTenantId);
  };

  const clearAllMockData = () => {
    setPatients([]);
    setStaff([]);
    setBeds([]);
    setPharmacyItems([]);
    setInvoices([]);
    setLabTests([]);
    setEvents([]);
    localStorage.removeItem('hospital_patients');
    localStorage.removeItem('hospital_staff');
    localStorage.removeItem('hospital_beds');
    localStorage.removeItem('hospital_pharmacy');
    localStorage.removeItem('hospital_invoices');
    addSystemEvent({
      module: 'SECURITY',
      title: 'Database Reset to Zero Mock Data',
      description: 'Hospital OS workspace cleared of sample data. Ready for live clinic input.',
      severity: 'info',
      actor: 'Hospital Admin'
    });
  };

  // Per-slice Debounced LocalStorage Persistence (Avoids blocking UI thread & JSON thrashing)
  useEffect(() => {
    localStorage.setItem('hospital_auth', isAuthenticated ? 'true' : 'false');
    localStorage.setItem('hospital_role', currentRole);
    localStorage.setItem('hospital_tenant_id', currentTenantId);
  }, [isAuthenticated, currentRole, currentTenantId]);

  useEffect(() => {
    const t = setTimeout(() => {
      try { localStorage.setItem('hospital_tenants', JSON.stringify(tenants)); } catch {}
    }, 600);
    return () => clearTimeout(t);
  }, [tenants]);

  useEffect(() => {
    const t = setTimeout(() => {
      try { localStorage.setItem('hospital_staff', JSON.stringify(staff)); } catch {}
    }, 600);
    return () => clearTimeout(t);
  }, [staff]);

  useEffect(() => {
    const t = setTimeout(() => {
      try { localStorage.setItem('hospital_beds', JSON.stringify(beds)); } catch {}
    }, 600);
    return () => clearTimeout(t);
  }, [beds]);

  useEffect(() => {
    const t = setTimeout(() => {
      try { localStorage.setItem('hospital_patients', JSON.stringify(patients)); } catch {}
    }, 600);
    return () => clearTimeout(t);
  }, [patients]);

  useEffect(() => {
    const t = setTimeout(() => {
      try { localStorage.setItem('hospital_pharmacy', JSON.stringify(pharmacyItems)); } catch {}
    }, 600);
    return () => clearTimeout(t);
  }, [pharmacyItems]);

  useEffect(() => {
    const t = setTimeout(() => {
      try { localStorage.setItem('hospital_invoices', JSON.stringify(invoices)); } catch {}
    }, 600);
    return () => clearTimeout(t);
  }, [invoices]);

  // Memoized doctors derived cleanly from staff & patients (zero duplicate state or extra render passes)
  const doctors: Doctor[] = useMemo(() => {
    const patientCountByDoc = new Map<string, number>();
    for (const p of patients) {
      if (p.assignedDoctorName) {
        patientCountByDoc.set(p.assignedDoctorName, (patientCountByDoc.get(p.assignedDoctorName) || 0) + 1);
      }
    }
    const doctorStaff = staff.filter(s => s.role === 'doctor');
    return doctorStaff.map(s => ({
      id: s.id,
      name: s.name,
      specialization: s.designation,
      department: s.department,
      qualification: 'MBBS, Specialist',
      experienceYears: 6,
      hprId: `HPR-${s.id}`,
      consultationFee: 500,
      availableDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
      timing: s.shift,
      currentRoom: 'OPD Suite 1',
      todayAppointmentsCount: patientCountByDoc.get(s.name) || 0,
      rating: 4.9,
      avatar: '👨‍⚕️',
      status: 'Available'
    }));
  }, [staff, patients]);

  const currentTenant = tenants.find(t => t.id === currentTenantId) || tenants[0] || INITIAL_TENANTS[0];

  const getAllowedModulesForRole = (role: UserRole): NavigationModule[] => {
    return ROLE_ALLOWED_MODULES[role] || ['patients'];
  };

  const loginAsRole = (role: UserRole, customTenantId?: string) => {
    setCurrentRole(role);
    setCurrentUser(DEFAULT_ROLE_USERS[role] || DEFAULT_ROLE_USERS.admin);
    if (customTenantId) {
      setCurrentTenantId(customTenantId);
    }
    setActiveModule(ROLE_DEFAULT_MODULES[role] || 'patients');
    setIsAuthenticated(true);
  };

  const loginAsPatient = (patientInfo: { name: string; phone?: string; email?: string; bloodGroup?: string; age?: number }) => {
    const cleanName = patientInfo.name.trim() || 'Patient User';
    const cleanPhone = patientInfo.phone?.trim() || '';
    const cleanEmail = patientInfo.email?.trim() || `${cleanName.toLowerCase().replace(/[^a-z0-9]/g, '')}@patient.in`;

    const userPt: UserSession = {
      id: `USR-PT-${Date.now().toString().slice(-4)}`,
      name: cleanName,
      role: 'patient',
      title: 'Registered Patient',
      department: 'Patient Care Portal',
      avatar: '👤',
      email: cleanEmail
    };

    setCurrentUser(userPt);
    setCurrentRole('patient');
    setActiveModule('patient_portal');
    setIsAuthenticated(true);

    // Ensure matching patient record exists in hospital patient roster
    setPatients(prev => {
      const exists = prev.find(p => p.name.toLowerCase() === cleanName.toLowerCase());
      if (exists) return prev;
      const newPt: Patient = {
        id: `PT-${Date.now().toString().slice(-4)}`,
        name: cleanName,
        age: patientInfo.age || 32,
        gender: 'Male',
        phone: cleanPhone,
        email: cleanEmail,
        bloodGroup: patientInfo.bloodGroup || 'B+ Positive',
        status: 'Outpatient',
        assignedDoctorId: doctors[0]?.id || 'DOC-GEN',
        assignedDoctorName: doctors[0]?.name || 'Dr. Priya Iyer',
        registrationDate: new Date().toISOString().slice(0, 10),
        recentDiagnosis: 'General OPD Consultation',
        vitals: {
          temperature: '98.6 °F',
          bloodPressure: '120/80 mmHg',
          pulseRate: 74,
          spO2: 99,
          respiratoryRate: 16,
          bmi: '22.5',
          recordedAt: 'Profile Setup'
        },
        abhaId: `91-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}`,
        abhaAddress: `${cleanName.toLowerCase().replace(/[^a-z0-9]/g, '')}@abdm`,
        allergies: ['None Reported'],
        chronicConditions: ['None'],
        emergencyContact: {
          name: 'Emergency Contact',
          relationship: 'Family',
          phone: cleanPhone
        },
        totalBilled: 0,
        pendingBalance: 0
      };
      upsertPatientInDb(newPt, currentTenantId);
      return [newPt, ...prev];
    });

    addSystemEvent({
      module: 'SECURITY',
      title: `Patient Login: ${cleanName}`,
      description: `Patient logged into self-service consultation portal.`,
      severity: 'info',
      actor: cleanName
    });
  };

  const logout = () => {
    setIsAuthenticated(false);
  };

  // Derived Operational Metrics (Memoized single-pass loops for low CPU & memory overhead)
  const metrics: OperationalMetrics = useMemo(() => {
    let opdCount = 0;
    let ipdAdmissions = 0;
    for (const p of patients) {
      if (p.status === 'Outpatient') opdCount++;
      else if (p.status === 'Admitted' || p.status === 'In Emergency') ipdAdmissions++;
    }

    let occupiedBeds = 0;
    let availableBeds = 0;
    for (const b of beds) {
      if (b.status === 'Occupied') occupiedBeds++;
      else if (b.status === 'Available') availableBeds++;
    }

    let totalRevenueToday = 0;
    let pendingClaimsAmount = 0;
    for (const inv of invoices) {
      const paid = Number(inv.paidAmount) || 0;
      const total = Number(inv.totalAmount) || 0;
      totalRevenueToday += paid;
      if (inv.status !== 'Paid') pendingClaimsAmount += Math.max(0, total - paid);
    }

    return {
      totalPatientsToday: patients.length,
      opdCount,
      ipdAdmissions,
      activeDoctors: staff.filter(s => s.role === 'doctor').length,
      bedOccupancyRate: beds.length > 0 ? Math.round((occupiedBeds / beds.length) * 100) : 0,
      availableBeds,
      totalBeds: beds.length,
      totalRevenueToday,
      pendingClaimsAmount,
      criticalLabAlerts: labTests.filter(l => l.criticalAlert).length,
      pendingPrescriptions: pharmacyItems.filter(p => p.stockQty <= p.reorderLevel).length,
      activeOtSurgeries: 0
    };
  }, [patients, staff, beds, invoices, labTests, pharmacyItems]);

  const addSystemEvent = (eventData: Omit<SystemEventLog, 'id' | 'timestamp'>) => {
    const timeStr = new Date().toTimeString().split(' ')[0];
    const newEvent: SystemEventLog = {
      id: `EVT-${Date.now().toString().slice(-4)}`,
      timestamp: timeStr,
      ...eventData
    };
    setEvents(prev => [newEvent, ...prev.slice(0, 19)]);
    recordSystemEventInDb(newEvent, currentTenantId);
  };

  // Hospital actions
  const addTenant = (tenantData: Partial<Tenant>) => {
    const newId = `hosp-${Date.now().toString().slice(-4)}`;
    const newTenant: Tenant = {
      id: newId,
      name: tenantData.name || 'New Medical Facility',
      type: tenantData.type || 'hospital',
      logo: tenantData.logo || '🏥',
      tagline: tenantData.tagline || 'Healthcare Facility',
      licenseNumber: tenantData.licenseNumber || `REG-${Date.now().toString().slice(-6)}`,
      abdmFacilityId: tenantData.abdmFacilityId || `IN-HFR-${Date.now().toString().slice(-6)}`,
      nabhAccredited: tenantData.nabhAccredited ?? true,
      themeColor: '#39786B',
      branches:
        tenantData.branches && tenantData.branches.length > 0
          ? tenantData.branches
          : [
              { id: `br-${newId}`, name: `${tenantData.name || 'Main'} Medical Center`, city: 'City Center', beds: 0, activeDoctors: 0 }
            ],
      currentBranchId:
        tenantData.branches && tenantData.branches.length > 0
          ? tenantData.branches[0].id
          : `br-${newId}`
    };
    setTenants(prev => {
      const next = [...prev, newTenant];
      try {
        localStorage.setItem('hospital_tenants', JSON.stringify(next));
        localStorage.removeItem('hospital_sync_ts_tenants');
      } catch {}
      return next;
    });
    setCurrentTenantId(newId);
    upsertTenantInDb(newTenant);
    addSystemEvent({
      module: 'SECURITY',
      title: `Hospital Facility Added: ${newTenant.name}`,
      description: `New ${newTenant.type} registered with License ${newTenant.licenseNumber}.`,
      severity: 'success',
      actor: 'Hospital Admin'
    });
  };

  const removeTenant = (tenantId: string) => {
    if (tenants.length <= 1) return;
    setTenants(prev => {
      const next = prev.filter(t => t.id !== tenantId);
      try {
        localStorage.setItem('hospital_tenants', JSON.stringify(next));
        localStorage.removeItem('hospital_sync_ts_tenants');
      } catch {}
      return next;
    });
    deleteTenantFromDb(tenantId);
    if (currentTenantId === tenantId) {
      const remaining = tenants.filter(t => t.id !== tenantId);
      if (remaining.length > 0) setCurrentTenantId(remaining[0].id);
    }
  };

  // Staff actions
  const addStaffMember = (staffData: Partial<StaffEmployee>) => {
    const newId = `EMP-${Date.now().toString().slice(-4)}`;
    const newStaff: StaffEmployee = {
      id: newId,
      name: staffData.name || 'Staff Member',
      designation: staffData.designation || 'Specialist',
      department: staffData.department || 'General Medicine',
      role: staffData.role || 'doctor',
      phone: staffData.phone || '+91 98000 12345',
      email: staffData.email || `${(staffData.name || 'staff').toLowerCase().replace(/\s+/g, '')}@citycare.in`,
      joiningDate: new Date().toISOString().slice(0, 10),
      shift: staffData.shift || 'General (09:00 - 18:00)',
      attendanceStatus: 'Present',
      baseSalary: Number(staffData.baseSalary) || 50000,
      incentives: Number(staffData.incentives) || 0,
      bonuses: 0,
      deductions: 0,
      salaryStatus: 'Pending'
    };

    setStaff(prev => [...prev, newStaff]);
    upsertStaffInDb(newStaff, currentTenantId);
    addSystemEvent({
      module: 'SECURITY',
      title: `Staff Member Added: ${newStaff.name}`,
      description: `Role: ${newStaff.role} (${newStaff.designation}), Dept: ${newStaff.department}, Base Pay: ₹${newStaff.baseSalary.toLocaleString('en-IN')}`,
      severity: 'success',
      actor: 'Hospital Admin'
    });
  };

  const removeStaffMember = (staffId: string) => {
    const member = staff.find(s => s.id === staffId);
    setStaff(prev => prev.filter(s => s.id !== staffId));
    deleteStaffInDb(staffId);
    if (member) {
      addSystemEvent({
        module: 'SECURITY',
        title: `Staff Member Removed: ${member.name}`,
        description: `Removed from ${member.department} records.`,
        severity: 'warning',
        actor: 'Hospital Admin'
      });
    }
  };

  // Bed actions
  const addBed = (bedData: Partial<Bed>) => {
    const newId = `BED-${Date.now().toString().slice(-4)}`;
    const newBed: Bed = {
      id: newId,
      bedNumber: bedData.bedNumber || `Bed-${beds.length + 1}`,
      wardType: bedData.wardType || 'General Male',
      floor: bedData.floor || 'Floor 1',
      status: bedData.status || 'Available',
      oxygenEquipped: bedData.oxygenEquipped ?? true,
      ventilatorEquipped: bedData.ventilatorEquipped ?? false,
      dailyRate: Number(bedData.dailyRate) || 1500
    };

    setBeds(prev => [...prev, newBed]);
    upsertBedInDb(newBed, currentTenantId);
    addSystemEvent({
      module: 'BEDS',
      title: `Bed Added: ${newBed.bedNumber}`,
      description: `Added to ${newBed.wardType} (${newBed.floor}). Daily Rate: ₹${newBed.dailyRate}`,
      severity: 'success',
      actor: 'Nursing Supervisor'
    });
  };

  const removeBed = (bedId: string) => {
    const bed = beds.find(b => b.id === bedId);
    setBeds(prev => prev.filter(b => b.id !== bedId));
    deleteBedInDb(bedId);
    if (bed) {
      addSystemEvent({
        module: 'BEDS',
        title: `Bed Removed: ${bed.bedNumber}`,
        description: `Removed from ${bed.wardType}.`,
        severity: 'warning',
        actor: 'Nursing Supervisor'
      });
    }
  };

  const updateBedStatus = (bedId: string, status: Bed['status'], patientId?: string, patientName?: string) => {
    // If bed is released/discharged, retain the patient record by marking them Discharged!
    if (status === 'Cleaning' || status === 'Available') {
      const existingBed = beds.find(b => b.id === bedId);
      if (existingBed && (existingBed.patientId || existingBed.patientName)) {
        setPatients(prev => prev.map(p => {
          if ((existingBed.patientId && p.id === existingBed.patientId) || 
              (existingBed.patientName && p.name.toLowerCase() === existingBed.patientName.toLowerCase())) {
            const discharged: Patient = {
              ...p,
              status: 'Discharged',
              assignedBed: undefined,
              ward: undefined,
              dischargeDate: p.dischargeDate || new Date().toISOString().replace('T', ' ').slice(0, 16),
              dischargeSummary: p.dischargeSummary || 'Patient discharged from bed. Inpatient stay completed with stable vitals.'
            };
            upsertPatientInDb(discharged, currentTenantId);
            return discharged;
          }
          return p;
        }));
      }
    }

    setBeds(prev => prev.map(bed => {
      if (bed.id === bedId) {
        const updated = {
          ...bed,
          status,
          patientId: status === 'Occupied' ? (patientId || bed.patientId) : undefined,
          patientName: status === 'Occupied' ? (patientName || bed.patientName) : undefined,
          admittedAt: status === 'Occupied' ? (bed.admittedAt || 'Just Now') : undefined
        };
        upsertBedInDb(updated, currentTenantId);
        return updated;
      }
      return bed;
    }));
  };

  // Patient actions
  const addPatient = (patientData: Partial<Patient>) => {
    const newId = `PT-${Date.now().toString().slice(-4)}`;
    const newPt: Patient = {
      id: newId,
      abhaId: patientData.abhaId || `91-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}`,
      abhaAddress: patientData.abhaAddress || `${(patientData.name || 'patient').toLowerCase().replace(/\s+/g, '')}@abdm`,
      name: patientData.name || 'Patient Name',
      age: Number(patientData.age) || 30,
      gender: patientData.gender || 'Male',
      bloodGroup: patientData.bloodGroup || 'B+ Positive',
      phone: patientData.phone || '+91 98000 00000',
      email: patientData.email || 'patient@hospital.in',
      emergencyContact: patientData.emergencyContact || {
        name: 'Family Contact',
        relationship: 'Family',
        phone: '+91 98000 00001'
      },
      allergies: patientData.allergies || ['None Reported'],
      chronicConditions: patientData.chronicConditions || ['None'],
      status: patientData.status || 'Outpatient',
      assignedDoctorId: patientData.assignedDoctorId || 'DOC-1',
      assignedDoctorName: patientData.assignedDoctorName || 'Duty Doctor',
      assignedBed: patientData.assignedBed,
      ward: patientData.ward,
      vitals: patientData.vitals || {
        temperature: '98.6 °F',
        bloodPressure: '120/80 mmHg',
        pulseRate: 75,
        spO2: 99,
        respiratoryRate: 16,
        bmi: '22.0',
        recordedAt: 'Just now'
      },
      registrationDate: new Date().toISOString().replace('T', ' ').slice(0, 16),
      recentDiagnosis: patientData.recentDiagnosis || 'General Clinical Evaluation',
      insuranceProvider: patientData.insuranceProvider || 'Self-Pay / Cash',
      totalBilled: 500,
      pendingBalance: 0
    };

    setPatients(prev => [newPt, ...prev]);
    upsertPatientInDb(newPt, currentTenantId);

    // If patient is admitted to a bed, update the bed status
    if (newPt.assignedBed) {
      updateBedStatus(newPt.assignedBed, 'Occupied', newPt.id, newPt.name);
    }

    addSystemEvent({
      module: 'PATIENT',
      title: `Patient Registered: ${newPt.name}`,
      description: `Patient ID ${newPt.id} assigned to ${newPt.assignedDoctorName}.`,
      severity: 'success',
      actor: 'Front Desk'
    });
  };

  const updatePatient = (patientId: string, updates: Partial<Patient>) => {
    let matched = false;
    setPatients(prev => {
      const exists = prev.some(p => p.id === patientId || p.name.toLowerCase() === (updates.name || '').toLowerCase());
      if (exists) {
        matched = true;
        return prev.map(p => {
          if (p.id === patientId || p.name.toLowerCase() === (updates.name || '').toLowerCase()) {
            const updated: Patient = {
              ...p,
              ...updates,
              emergencyContact: updates.emergencyContact || p.emergencyContact,
              vitals: updates.vitals || p.vitals
            };
            upsertPatientInDb(updated, currentTenantId);
            return updated;
          }
          return p;
        });
      }
      return prev;
    });

    // If patient didn't exist in roster yet, register them
    if (!matched && updates.name) {
      addPatient(updates);
    }

    addSystemEvent({
      module: 'PATIENT',
      title: `Patient Profile Updated: ${updates.name || patientId}`,
      description: `Updated demographic, contact, and ABHA clinical details.`,
      severity: 'info',
      actor: 'Patient Portal'
    });
  };

  const dischargePatient = (patientId: string, summary?: string) => {
    let patientName = '';
    setPatients(prev => prev.map(p => {
      if (p.id === patientId) {
        patientName = p.name;
        // Release bed if assigned
        if (p.assignedBed) {
          updateBedStatus(p.assignedBed, 'Cleaning');
        }
        const dischargedPt: Patient = {
          ...p,
          status: 'Discharged',
          assignedBed: undefined,
          ward: undefined,
          dischargeDate: new Date().toISOString().replace('T', ' ').slice(0, 16),
          dischargeSummary: summary || 'Patient clinically stable. Discharged with home medication advice and 7-day follow-up.'
        };
        upsertPatientInDb(dischargedPt, currentTenantId);
        return dischargedPt;
      }
      return p;
    }));

    addSystemEvent({
      module: 'PATIENT',
      title: `Patient Discharged: ${patientName || patientId}`,
      description: `Discharged from inpatient care. All clinical records, vitals, and billing history archived safely.`,
      severity: 'success',
      actor: 'Clinical Desk'
    });
  };

  const removePatient = (patientId: string) => {
    const pt = patients.find(p => p.id === patientId);
    if (pt?.assignedBed) {
      updateBedStatus(pt.assignedBed, 'Available');
    }
    setPatients(prev => prev.filter(p => p.id !== patientId));
    deletePatientInDb(patientId);
    if (pt) {
      addSystemEvent({
        module: 'PATIENT',
        title: `Patient Record Purged: ${pt.name}`,
        description: `Permanently deleted test record ${pt.id}.`,
        severity: 'warning',
        actor: 'Clinical Desk'
      });
    }
  };

  // Pharmacy actions
  const addPharmacyItem = (itemData: Partial<PharmacyItem>) => {
    const newItem: PharmacyItem = {
      id: `MED-${Date.now().toString().slice(-4)}`,
      name: itemData.name || 'New Medicine',
      genericName: itemData.genericName || 'Standard Chemical Formula',
      category: itemData.category || 'Antibiotic',
      batchNo: itemData.batchNo || `BAT-${Date.now().toString().slice(-5)}`,
      stockQty: Number(itemData.stockQty) || 100,
      reorderLevel: Number(itemData.reorderLevel) || 20,
      unitPrice: Number(itemData.unitPrice) || 10.0,
      mrp: Number(itemData.mrp) || 15.0,
      expiryDate: itemData.expiryDate || '2028-12-31',
      supplier: itemData.supplier || 'Standard Distributor',
      rackLocation: itemData.rackLocation || 'Shelf A-1',
      requiresPrescription: itemData.requiresPrescription ?? false
    };

    setPharmacyItems(prev => [newItem, ...prev]);
    upsertPharmacyInDb(newItem, currentTenantId);
    addSystemEvent({
      module: 'PHARMACY',
      title: `Medicine Added: ${newItem.name}`,
      description: `Stock: ${newItem.stockQty} units, Batch: ${newItem.batchNo}`,
      severity: 'success',
      actor: 'Pharmacist'
    });
  };

  const removePharmacyItem = (itemId: string) => {
    const item = pharmacyItems.find(p => p.id === itemId);
    setPharmacyItems(prev => prev.filter(p => p.id !== itemId));
    deletePharmacyInDb(itemId);
    if (item) {
      addSystemEvent({
        module: 'PHARMACY',
        title: `Medicine Removed: ${item.name}`,
        description: `Removed from formulary inventory.`,
        severity: 'warning',
        actor: 'Pharmacist'
      });
    }
  };

  const dispenseMedicine = (medicineId: string, qty: number) => {
    setPharmacyItems(prev => prev.map(item => {
      if (item.id === medicineId) {
        const updated = { ...item, stockQty: Math.max(0, item.stockQty - qty) };
        upsertPharmacyInDb(updated, currentTenantId);
        return updated;
      }
      return item;
    }));
  };

  const updateLabStatus = (labId: string, status: LabTestStatus) => {
    setLabTests(prev => prev.map(lab => {
      if (lab.id === labId) {
        return { ...lab, status };
      }
      return lab;
    }));
  };

  const addLabTest = (testData: Partial<LabTestOrder>) => {
    const id = `LAB-${Date.now().toString().slice(-4)}`;
    const barcode = `BAR-${Math.floor(100000 + Math.random() * 900000)}`;
    const newTest: LabTestOrder = {
      id,
      barcode,
      patientId: testData.patientId || `PT-${Date.now().toString().slice(-4)}`,
      patientName: testData.patientName || 'Walk-in Patient',
      patientAge: testData.patientAge || 35,
      patientGender: testData.patientGender || 'Male',
      testName: testData.testName || 'Complete Blood Count (CBC)',
      category: testData.category || 'Hematology',
      orderedByDoctor: testData.orderedByDoctor || 'Dr. Priya Iyer, MD',
      orderedAt: new Date().toISOString().slice(0, 16).replace('T', ' '),
      sampleType: testData.sampleType || 'Whole Blood (EDTA - Lavender)',
      status: testData.status || 'Ordered',
      technicianName: 'Rajesh Nair, DMLT',
      parameters: testData.parameters || [
        { name: 'Hemoglobin', value: '13.8', unit: 'g/dL', normalRange: '13.0 - 17.0', isAbnormal: false },
        { name: 'RBC Count', value: '4.8', unit: 'million/mcL', normalRange: '4.5 - 5.5', isAbnormal: false },
        { name: 'Total WBC', value: '7,200', unit: '/mcL', normalRange: '4,000 - 11,000', isAbnormal: false },
        { name: 'Platelets', value: '250,000', unit: '/mcL', normalRange: '150,000 - 450,000', isAbnormal: false }
      ],
      criticalAlert: testData.criticalAlert || false,
      cost: testData.cost || 450
    };

    setLabTests(prev => [newTest, ...prev]);

    addSystemEvent({
      module: 'LIMS',
      title: `Lab Order Created: ${newTest.testName}`,
      description: `Specimen barcode ${newTest.barcode} generated for ${newTest.patientName}.`,
      severity: 'info',
      actor: 'Lab Reception'
    });
  };

  const updateLabTestParameters = (labId: string, parameters: LabTestOrder['parameters']) => {
    setLabTests(prev => prev.map(lab => {
      if (lab.id === labId) {
        const hasAbnormal = parameters.some(p => p.isAbnormal);
        return { 
          ...lab, 
          parameters, 
          criticalAlert: hasAbnormal,
          status: lab.status === 'Ordered' || lab.status === 'Sample Collected' ? 'Analyzing' : lab.status
        };
      }
      return lab;
    }));
  };

  const seedSampleLabTests = () => {
    const demoSamples: LabTestOrder[] = [
      {
        id: `LAB-101`,
        barcode: `BAR-882194`,
        patientId: `PT-5508`,
        patientName: `Suresh Kumar`,
        patientAge: 34,
        patientGender: 'Male',
        testName: 'Complete Blood Count (CBC)',
        category: 'Hematology',
        orderedByDoctor: 'Dr. Priya Iyer, MD',
        orderedAt: 'Today, 09:30 AM',
        sampleType: 'Whole Blood (EDTA - Lavender)',
        status: 'Analyzing',
        technicianName: 'Rajesh Nair, DMLT',
        parameters: [
          { name: 'Hemoglobin', value: '14.2', unit: 'g/dL', normalRange: '13.0 - 17.0', isAbnormal: false },
          { name: 'RBC Count', value: '4.9', unit: 'million/mcL', normalRange: '4.5 - 5.5', isAbnormal: false },
          { name: 'Total WBC', value: '12,400', unit: '/mcL', normalRange: '4,000 - 11,000', isAbnormal: true },
          { name: 'Platelets', value: '210,000', unit: '/mcL', normalRange: '150,000 - 450,000', isAbnormal: false }
        ],
        criticalAlert: true,
        cost: 450
      },
      {
        id: `LAB-102`,
        barcode: `BAR-543219`,
        patientId: `PT-5509`,
        patientName: `Ananya Rao`,
        patientAge: 29,
        patientGender: 'Female',
        testName: 'Comprehensive Lipid Profile',
        category: 'Biochemistry',
        orderedByDoctor: 'Dr. Priya Iyer, MD',
        orderedAt: 'Today, 10:15 AM',
        sampleType: 'Serum (Gold / SST)',
        status: 'Sample Collected',
        technicianName: 'Kavita Sundaram',
        parameters: [
          { name: 'Total Cholesterol', value: '185', unit: 'mg/dL', normalRange: '< 200', isAbnormal: false },
          { name: 'Triglycerides', value: '142', unit: 'mg/dL', normalRange: '< 150', isAbnormal: false },
          { name: 'HDL Good Cholesterol', value: '54', unit: 'mg/dL', normalRange: '> 45', isAbnormal: false },
          { name: 'LDL Bad Cholesterol', value: '102', unit: 'mg/dL', normalRange: '< 100', isAbnormal: true }
        ],
        criticalAlert: false,
        cost: 850
      },
      {
        id: `LAB-103`,
        barcode: `BAR-991204`,
        patientId: `PT-5510`,
        patientName: `Vikram Patel`,
        patientAge: 52,
        patientGender: 'Male',
        testName: 'HbA1c & Fasting Blood Glucose',
        category: 'Biochemistry',
        orderedByDoctor: 'Dr. Rajesh Nair, MS',
        orderedAt: 'Today, 08:00 AM',
        sampleType: 'Fluoride Plasma (Grey)',
        status: 'Approved',
        technicianName: 'Rajesh Nair, DMLT',
        approvedBy: 'Dr. Sunita Sen, Pathologist (MD)',
        parameters: [
          { name: 'Fasting Plasma Glucose', value: '112', unit: 'mg/dL', normalRange: '70 - 100', isAbnormal: true },
          { name: 'Glycated Hemoglobin (HbA1c)', value: '6.4', unit: '%', normalRange: '< 5.7', isAbnormal: true }
        ],
        criticalAlert: true,
        cost: 650
      }
    ];

    setLabTests(demoSamples);
    addSystemEvent({
      module: 'LIMS',
      title: 'Demo Specimen Orders Seeded',
      description: 'Loaded 3 diagnostic specimens across Hematology & Biochemistry.',
      severity: 'info',
      actor: 'LIMS Engine'
    });
  };

  const payInvoice = (invoiceId: string, method: BillingInvoice['paymentMethod']) => {
    setInvoices(prev => prev.map(inv => {
      if (inv.id === invoiceId) {
        const updated: BillingInvoice = { ...inv, status: 'Paid', paidAmount: inv.totalAmount, paymentMethod: method };
        upsertInvoiceInDb(updated, currentTenantId);
        return updated;
      }
      return inv;
    }));
  };

  const createInvoice = (invData: Partial<BillingInvoice>): BillingInvoice => {
    const invId = `INV-${Date.now().toString().slice(-5)}`;
    const amt = invData.totalAmount || 800;
    const newInv: BillingInvoice = {
      id: invId,
      patientId: invData.patientId || `PT-${Date.now().toString().slice(-4)}`,
      patientName: invData.patientName || 'Registered Patient',
      abhaId: invData.abhaId || '91-1002-3948-2831',
      invoiceDate: invData.invoiceDate || new Date().toISOString().slice(0, 10),
      type: invData.type || 'OPD Consultation',
      items: invData.items || [
        {
          description: 'OPD Doctor Consultation Fee',
          quantity: 1,
          unitPrice: amt,
          taxRate: 0,
          total: amt
        }
      ],
      subtotal: amt,
      taxAmount: 0,
      discount: 0,
      totalAmount: amt,
      paidAmount: invData.status === 'Paid' ? amt : (invData.paidAmount || 0),
      paymentMethod: invData.paymentMethod || 'UPI',
      status: invData.status || 'Unpaid'
    };

    setInvoices(prev => [newInv, ...prev]);
    upsertInvoiceInDb(newInv, currentTenantId);
    addSystemEvent({
      module: 'BILLING',
      title: `Invoice Generated: ${newInv.id}`,
      description: `Created for ${newInv.patientName}. Total: ₹${amt.toLocaleString('en-IN')}`,
      severity: 'success',
      actor: 'Cashier Desk'
    });
    return newInv;
  };

  const bookAppointment = (booking: {
    patientId: string;
    patientName: string;
    doctorId: string;
    doctorName: string;
    department: string;
    date: string;
    timeSlot: string;
    consultationType: 'OPD Consultation' | 'IPD Admission' | 'Diagnostics' | 'Pharmacy';
    fee: number;
    payNow?: boolean;
    paymentMethod?: BillingInvoice['paymentMethod'];
  }): BillingInvoice => {
    const invId = `INV-${Date.now().toString().slice(-5)}`;
    const newInv: BillingInvoice = {
      id: invId,
      patientId: booking.patientId,
      patientName: booking.patientName,
      abhaId: `91-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}`,
      invoiceDate: booking.date || new Date().toISOString().slice(0, 10),
      type: booking.consultationType || 'OPD Consultation',
      items: [
        {
          description: `${booking.consultationType || 'OPD Consultation'} with ${booking.doctorName} (${booking.department}) - Slot: ${booking.timeSlot}`,
          quantity: 1,
          unitPrice: booking.fee,
          taxRate: 0,
          total: booking.fee
        }
      ],
      subtotal: booking.fee,
      taxAmount: 0,
      discount: 0,
      totalAmount: booking.fee,
      paidAmount: booking.payNow ? booking.fee : 0,
      paymentMethod: booking.payNow ? (booking.paymentMethod || 'UPI') : 'Pending',
      status: booking.payNow ? 'Paid' : 'Unpaid'
    };

    setInvoices(prev => [newInv, ...prev]);
    upsertInvoiceInDb(newInv, currentTenantId);

    // Update patient record or register new patient if not present
    setPatients(prev => {
      const exists = prev.find(p => p.id === booking.patientId || p.name.toLowerCase() === booking.patientName.toLowerCase());
      if (exists) {
        const updatedPt = {
          ...exists,
          assignedDoctorName: booking.doctorName,
          assignedDoctorId: booking.doctorId,
          totalBilled: (exists.totalBilled || 0) + booking.fee,
          pendingBalance: (exists.pendingBalance || 0) + (booking.payNow ? 0 : booking.fee)
        };
        upsertPatientInDb(updatedPt, currentTenantId);
        return prev.map(p => p.id === exists.id ? updatedPt : p);
      } else {
        const newPtId = `PT-${Date.now().toString().slice(-4)}`;
        const createdPt: Patient = {
          id: newPtId,
          name: booking.patientName,
          age: 32,
          gender: 'Other',
          phone: '+91 98765 00000',
          email: `${booking.patientName.toLowerCase().replace(/[^a-z0-9]/g, '')}@patient.in`,
          abhaId: newInv.abhaId,
          abhaAddress: `${booking.patientName.toLowerCase().replace(/[^a-z0-9]/g, '')}@abdm`,
          bloodGroup: 'B+ Positive',
          status: 'Outpatient',
          assignedDoctorId: booking.doctorId,
          assignedDoctorName: booking.doctorName,
          registrationDate: new Date().toISOString().replace('T', ' ').slice(0, 16),
          recentDiagnosis: `${booking.consultationType} with ${booking.doctorName}`,
          vitals: {
            temperature: '98.6 °F',
            bloodPressure: '120/80 mmHg',
            pulseRate: 72,
            spO2: 99,
            respiratoryRate: 16,
            bmi: '22.4',
            recordedAt: 'Registration'
          },
          insuranceProvider: 'Self-Pay / Cash',
          totalBilled: booking.fee,
          pendingBalance: booking.payNow ? 0 : booking.fee,
          emergencyContact: {
            name: 'Family Contact',
            relationship: 'Family',
            phone: '+91 98765 00001'
          },
          allergies: ['None Reported'],
          chronicConditions: ['None']
        };
        upsertPatientInDb(createdPt, currentTenantId);
        return [createdPt, ...prev];
      }
    });

    addSystemEvent({
      module: 'BILLING',
      title: `Consultation Booked: ${booking.patientName}`,
      description: `Booked with ${booking.doctorName} (${booking.timeSlot}). Invoice ${newInv.id} created for ₹${booking.fee}.`,
      severity: 'success',
      actor: 'Front Desk / Cashier'
    });

    return newInv;
  };

  // Staff compensation actions
  const giveBonus = (staffId: string, amount: number, reason: string) => {
    let updatedStaff: StaffEmployee | undefined;
    setStaff(prev => prev.map(s => {
      if (s.id === staffId) {
        updatedStaff = {
          ...s,
          bonuses: (s.bonuses || 0) + amount,
          bonusReason: reason
        };
        return updatedStaff;
      }
      return s;
    }));
    if (updatedStaff) {
      upsertStaffInDb(updatedStaff, currentTenantId);
      addSystemEvent({
        module: 'BILLING',
        title: `Bonus Granted: +₹${amount.toLocaleString('en-IN')}`,
        description: `Awarded to ${updatedStaff.name} (${updatedStaff.designation}). Reason: ${reason}`,
        severity: 'success',
        actor: 'Hospital Admin'
      });
    }
  };

  const deductSalary = (staffId: string, amount: number, reason: string) => {
    let updatedStaff: StaffEmployee | undefined;
    setStaff(prev => prev.map(s => {
      if (s.id === staffId) {
        updatedStaff = {
          ...s,
          deductions: (s.deductions || 0) + amount,
          deductionReason: reason
        };
        return updatedStaff;
      }
      return s;
    }));
    if (updatedStaff) {
      upsertStaffInDb(updatedStaff, currentTenantId);
      addSystemEvent({
        module: 'BILLING',
        title: `Salary Deduction Applied: -₹${amount.toLocaleString('en-IN')}`,
        description: `Deduction from ${updatedStaff.name}. Reason: ${reason}`,
        severity: 'warning',
        actor: 'Hospital Admin'
      });
    }
  };

  const disburseSalary = (staffId: string) => {
    const today = new Date().toISOString().slice(0, 10);
    let updatedStaff: StaffEmployee | undefined;
    setStaff(prev => prev.map(s => {
      if (s.id === staffId) {
        updatedStaff = { ...s, salaryStatus: 'Paid', lastDisbursedDate: today };
        return updatedStaff;
      }
      return s;
    }));
    if (updatedStaff) {
      upsertStaffInDb(updatedStaff, currentTenantId);
      addSystemEvent({
        module: 'BILLING',
        title: `Salary Disbursed to ${updatedStaff.name}`,
        description: `Monthly payment transferred to ${updatedStaff.name} (${updatedStaff.designation}).`,
        severity: 'success',
        actor: 'Hospital Admin'
      });
    }
  };

  const disburseAllSalaries = () => {
    const today = new Date().toISOString().slice(0, 10);
    setStaff(prev => {
      const updated = prev.map(s => ({
        ...s,
        salaryStatus: 'Paid' as const,
        lastDisbursedDate: today
      }));
      for (const s of updated) {
        upsertStaffInDb(s, currentTenantId);
      }
      return updated;
    });
    addSystemEvent({
      module: 'BILLING',
      title: 'Batch Hospital Payroll Disbursed',
      description: `All hospital staff salaries credited successfully.`,
      severity: 'success',
      actor: 'Hospital Admin'
    });
  };

  const resetPayrollCycle = () => {
    setStaff(prev => prev.map(s => ({
      ...s,
      salaryStatus: 'Pending',
      lastDisbursedDate: undefined
    })));
    addSystemEvent({
      module: 'BILLING',
      title: 'Monthly Payroll Cycle Reset',
      description: 'All staff salaries marked as Pending for a fresh disbursement cycle.',
      severity: 'info',
      actor: 'Hospital Admin'
    });
  };

  const populateDefaultStaffRoster = () => {
    setStaff(DEFAULT_20_STAFF_MEMBERS);
    addSystemEvent({
      module: 'BILLING',
      title: 'Full 20-Staff Hospital Roster Loaded',
      description: 'Loaded 20 verified medical doctors, nursing supervisors, pharmacists, and staff.',
      severity: 'success',
      actor: 'Hospital Admin'
    });
  };

  const triggerEmergencyAlert = (msg: string) => {
    setEmergencyAlert(msg);
    addSystemEvent({
      module: 'SECURITY',
      title: '🚨 CODE BLUE ALERT TRIGGERED',
      description: msg,
      severity: 'critical',
      actor: 'Emergency Rapid Response Team'
    });
  };

  const clearEmergencyAlert = () => setEmergencyAlert(null);

  // Simplified simulator stubs
  const [isSimulating, setIsSimulating] = useState(false);
  const [currentSimulationStep, setCurrentSimulationStep] = useState(0);
  const [simulationSteps, setSimulationSteps] = useState<SimulationStep[]>([]);
  const startSimulation = () => {};
  const resetSimulation = () => {};

  return (
    <HospitalOSContext.Provider
      value={{
        isAuthenticated,
        currentUser,
        loginAsRole,
        loginAsPatient,
        logout,
        tenants,
        currentTenant,
        currentBranchId,
        setCurrentTenantId,
        setCurrentBranchId,
        addTenant,
        removeTenant,
        currentRole,
        setCurrentRole,
        getAllowedModulesForRole,
        activeModule,
        setActiveModule,
        patients,
        doctors,
        labTests,
        pharmacyItems,
        beds,
        invoices,
        staff,
        events,
        metrics,
        addPatient,
        updatePatient,
        dischargePatient,
        removePatient,
        updateLabStatus,
        addLabTest,
        updateLabTestParameters,
        seedSampleLabTests,
        dispenseMedicine,
        addPharmacyItem,
        removePharmacyItem,
        addBed,
        removeBed,
        updateBedStatus,
        payInvoice,
        createInvoice,
        bookAppointment,
        addSystemEvent,
        addStaffMember,
        removeStaffMember,
        giveBonus,
        deductSalary,
        disburseSalary,
        disburseAllSalaries,
        resetPayrollCycle,
        populateDefaultStaffRoster,
        emergencyAlert,
        triggerEmergencyAlert,
        clearEmergencyAlert,
        isSupabaseConnected,
        supabaseStatus,
        supabaseMessage,
        connectSupabaseKey,
        syncAllToSupabase,
        clearAllMockData,
        isSimulating,
        simulationSteps,
        currentSimulationStep,
        startSimulation,
        resetSimulation
      }}
    >
      {children}
    </HospitalOSContext.Provider>
  );
};

export const useHospitalOS = () => {
  const context = useContext(HospitalOSContext);
  if (!context) {
    throw new Error('useHospitalOS must be used within a HospitalOSProvider');
  }
  return context;
};
