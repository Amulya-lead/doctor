-- ==============================================================================
-- HOSPITAL OS DATABASE SCHEMA (SUPABASE POSTGRESQL)
-- Project: vydwcfekefpptjcrfija (https://wydwcfekefpptjcrfija.supabase.co)
-- Execute this script directly in Supabase SQL Editor:
-- https://supabase.com/dashboard/project/wydwcfekefpptjcrfija/sql/new
-- ==============================================================================

-- 1. Create Tenants Table (Multi-Hospital Hierarchy)
CREATE TABLE IF NOT EXISTS public.tenants (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    type TEXT NOT NULL DEFAULT 'hospital',
    logo TEXT DEFAULT '',
    tagline TEXT DEFAULT '',
    license_number TEXT DEFAULT '',
    abdm_facility_id TEXT DEFAULT '',
    nabh_accredited BOOLEAN DEFAULT true,
    theme_color TEXT DEFAULT '#0284c7',
    branches JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Create Staff Table (Doctors, Nurses, Receptionists, HR, Admins)
CREATE TABLE IF NOT EXISTS public.staff (
    id TEXT PRIMARY KEY,
    tenant_id TEXT DEFAULT 'hosp-default',
    name TEXT NOT NULL,
    designation TEXT NOT NULL,
    department TEXT NOT NULL,
    role TEXT NOT NULL,
    phone TEXT DEFAULT '',
    email TEXT DEFAULT '',
    joining_date TEXT DEFAULT '',
    shift TEXT DEFAULT 'Morning (08:00 - 16:00)',
    attendance_status TEXT DEFAULT 'Present',
    base_salary NUMERIC(12,2) DEFAULT 0,
    incentives NUMERIC(12,2) DEFAULT 0,
    bonuses NUMERIC(12,2) DEFAULT 0,
    deductions NUMERIC(12,2) DEFAULT 0,
    salary_status TEXT DEFAULT 'Pending',
    last_disbursed_date TEXT DEFAULT '',
    bonus_reason TEXT DEFAULT '',
    deduction_reason TEXT DEFAULT '',
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Create Doctors Table (Consultants & Specialty Clinicians)
CREATE TABLE IF NOT EXISTS public.doctors (
    id TEXT PRIMARY KEY,
    tenant_id TEXT DEFAULT 'hosp-default',
    name TEXT NOT NULL,
    specialization TEXT NOT NULL,
    department TEXT NOT NULL,
    qualification TEXT DEFAULT '',
    experience_years INTEGER DEFAULT 0,
    hpr_id TEXT DEFAULT '',
    consultation_fee NUMERIC(10,2) DEFAULT 500,
    available_days JSONB DEFAULT '["Mon", "Tue", "Wed", "Thu", "Fri"]'::jsonb,
    timing TEXT DEFAULT '09:00 - 17:00',
    current_room TEXT DEFAULT 'OPD Suite 1',
    today_appointments_count INTEGER DEFAULT 0,
    rating NUMERIC(3,2) DEFAULT 4.9,
    avatar TEXT DEFAULT '👨‍⚕️',
    status TEXT DEFAULT 'Available',
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Create Patients Table (EMR, ABHA, Vitals & Insurance)
CREATE TABLE IF NOT EXISTS public.patients (
    id TEXT PRIMARY KEY,
    tenant_id TEXT DEFAULT 'hosp-default',
    abha_id TEXT DEFAULT '',
    abha_address TEXT DEFAULT '',
    name TEXT NOT NULL,
    age INTEGER DEFAULT 0,
    gender TEXT DEFAULT 'Other',
    blood_group TEXT DEFAULT '',
    phone TEXT DEFAULT '',
    email TEXT DEFAULT '',
    emergency_contact JSONB DEFAULT '{"name": "", "relationship": "", "phone": ""}'::jsonb,
    allergies JSONB DEFAULT '[]'::jsonb,
    chronic_conditions JSONB DEFAULT '[]'::jsonb,
    status TEXT DEFAULT 'Outpatient',
    assigned_doctor_id TEXT DEFAULT '',
    assigned_doctor_name TEXT DEFAULT '',
    assigned_bed TEXT DEFAULT '',
    ward TEXT DEFAULT '',
    vitals JSONB DEFAULT '{}'::jsonb,
    registration_date TEXT DEFAULT '',
    recent_diagnosis TEXT DEFAULT '',
    insurance_provider TEXT DEFAULT '',
    insurance_policy_no TEXT DEFAULT '',
    total_billed NUMERIC(12,2) DEFAULT 0,
    pending_balance NUMERIC(12,2) DEFAULT 0,
    discharge_date TEXT DEFAULT '',
    discharge_summary TEXT DEFAULT '',
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Create Beds Table (Wards, ICU, Triage, Status)
CREATE TABLE IF NOT EXISTS public.beds (
    id TEXT PRIMARY KEY,
    tenant_id TEXT DEFAULT 'hosp-default',
    bed_number TEXT NOT NULL,
    ward_type TEXT NOT NULL,
    floor TEXT DEFAULT '',
    status TEXT DEFAULT 'Available',
    patient_id TEXT DEFAULT NULL,
    patient_name TEXT DEFAULT NULL,
    admitted_at TEXT DEFAULT NULL,
    nurse_in_charge TEXT DEFAULT NULL,
    oxygen_equipped BOOLEAN DEFAULT true,
    ventilator_equipped BOOLEAN DEFAULT false,
    daily_rate NUMERIC(10,2) DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. Create Pharmacy Inventory Table
CREATE TABLE IF NOT EXISTS public.pharmacy_items (
    id TEXT PRIMARY KEY,
    tenant_id TEXT DEFAULT 'hosp-default',
    name TEXT NOT NULL,
    generic_name TEXT DEFAULT '',
    category TEXT NOT NULL,
    batch_no TEXT DEFAULT '',
    stock_qty INTEGER DEFAULT 0,
    reorder_level INTEGER DEFAULT 10,
    unit_price NUMERIC(10,2) DEFAULT 0,
    mrp NUMERIC(10,2) DEFAULT 0,
    expiry_date TEXT DEFAULT '',
    supplier TEXT DEFAULT '',
    rack_location TEXT DEFAULT '',
    requires_prescription BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. Create Invoices Table (Billing, Cashier, TPA Claims)
CREATE TABLE IF NOT EXISTS public.invoices (
    id TEXT PRIMARY KEY,
    tenant_id TEXT DEFAULT 'hosp-default',
    patient_id TEXT NOT NULL,
    patient_name TEXT NOT NULL,
    abha_id TEXT DEFAULT '',
    invoice_date TEXT NOT NULL,
    type TEXT NOT NULL,
    items JSONB DEFAULT '[]'::jsonb,
    subtotal NUMERIC(12,2) DEFAULT 0,
    tax_amount NUMERIC(12,2) DEFAULT 0,
    discount NUMERIC(12,2) DEFAULT 0,
    total_amount NUMERIC(12,2) DEFAULT 0,
    paid_amount NUMERIC(12,2) DEFAULT 0,
    payment_method TEXT DEFAULT 'Pending',
    status TEXT DEFAULT 'Unpaid',
    insurance_claim_status TEXT DEFAULT NULL,
    transaction_ref TEXT DEFAULT NULL,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 8. Create Lab Tests Table (LIMS Pathology & Diagnostics)
CREATE TABLE IF NOT EXISTS public.lab_tests (
    id TEXT PRIMARY KEY,
    tenant_id TEXT DEFAULT 'hosp-default',
    barcode TEXT DEFAULT '',
    patient_id TEXT NOT NULL,
    patient_name TEXT NOT NULL,
    patient_age INTEGER DEFAULT 0,
    patient_gender TEXT DEFAULT '',
    test_name TEXT NOT NULL,
    category TEXT NOT NULL,
    ordered_by_doctor TEXT DEFAULT '',
    ordered_at TEXT NOT NULL,
    sample_type TEXT DEFAULT '',
    status TEXT DEFAULT 'Ordered',
    technician_name TEXT DEFAULT '',
    parameters JSONB DEFAULT '[]'::jsonb,
    critical_alert BOOLEAN DEFAULT false,
    doctor_approved_at TEXT DEFAULT NULL,
    approved_by TEXT DEFAULT NULL,
    cost NUMERIC(10,2) DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 9. Create System Event Logs Table
CREATE TABLE IF NOT EXISTS public.system_events (
    id TEXT PRIMARY KEY,
    tenant_id TEXT DEFAULT 'hosp-default',
    module TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    severity TEXT NOT NULL,
    actor TEXT NOT NULL,
    patient_id TEXT DEFAULT NULL,
    timestamp TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==============================================================================
-- INDEXES FOR FAST MILLISECOND O(1) LOOKUPS
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_patients_tenant ON public.patients(tenant_id);
CREATE INDEX IF NOT EXISTS idx_staff_tenant ON public.staff(tenant_id);
CREATE INDEX IF NOT EXISTS idx_beds_tenant ON public.beds(tenant_id);
CREATE INDEX IF NOT EXISTS idx_pharmacy_tenant ON public.pharmacy_items(tenant_id);
CREATE INDEX IF NOT EXISTS idx_invoices_tenant ON public.invoices(tenant_id);
CREATE INDEX IF NOT EXISTS idx_doctors_tenant ON public.doctors(tenant_id);
CREATE INDEX IF NOT EXISTS idx_system_events_created ON public.system_events(created_at DESC);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- Enables safe public access using anon key for Hospital OS frontend
-- ==============================================================================
ALTER TABLE public.tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.doctors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.beds ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pharmacy_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lab_tests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_events ENABLE ROW LEVEL SECURITY;

-- Allow unrestricted anonymous read/write access for application operations
DO $$ 
BEGIN
    DROP POLICY IF EXISTS "Allow public all on tenants" ON public.tenants;
    DROP POLICY IF EXISTS "Allow public all on staff" ON public.staff;
    DROP POLICY IF EXISTS "Allow public all on doctors" ON public.doctors;
    DROP POLICY IF EXISTS "Allow public all on patients" ON public.patients;
    DROP POLICY IF EXISTS "Allow public all on beds" ON public.beds;
    DROP POLICY IF EXISTS "Allow public all on pharmacy_items" ON public.pharmacy_items;
    DROP POLICY IF EXISTS "Allow public all on invoices" ON public.invoices;
    DROP POLICY IF EXISTS "Allow public all on lab_tests" ON public.lab_tests;
    DROP POLICY IF EXISTS "Allow public all on system_events" ON public.system_events;
END $$;

CREATE POLICY "Allow public all on tenants" ON public.tenants FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public all on staff" ON public.staff FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public all on doctors" ON public.doctors FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public all on patients" ON public.patients FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public all on beds" ON public.beds FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public all on pharmacy_items" ON public.pharmacy_items FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public all on invoices" ON public.invoices FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public all on lab_tests" ON public.lab_tests FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public all on system_events" ON public.system_events FOR ALL USING (true) WITH CHECK (true);

