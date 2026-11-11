import { 
  Tenant, 
  Patient, 
  Doctor, 
  LabTestOrder, 
  PharmacyItem, 
  Bed, 
  BillingInvoice, 
  StaffEmployee, 
  SystemEventLog 
} from '../types';

// Standard Hospital Defaults that exist in all hospitals
export const STANDARD_WARDS = [
  'ICU (Intensive Care Unit)',
  'Emergency & Trauma',
  'General Ward Male',
  'General Ward Female',
  'Deluxe Private Room',
  'Semi-Private Ward',
  'Pediatric Ward',
  'Maternity & Labor Ward',
  'Post-Op Recovery',
  'Operation Theatre (OT)'
] as const;

export const STANDARD_DEPARTMENTS = [
  'General Medicine',
  'Emergency & Trauma Care',
  'Critical Care (ICU)',
  'General Surgery',
  'Cardiology',
  'Orthopedics',
  'Pediatrics',
  'Obstetrics & Gynecology',
  'Pathology & Laboratory',
  'Hospital Pharmacy',
  'Nursing Administration',
  'Hospital Administration & HR',
  'Billing & Accounts'
] as const;

export const STANDARD_STAFF_ROLES = [
  { role: 'doctor', title: 'Consultant Doctor / Physician' },
  { role: 'nurse', title: 'Staff Nurse / Nursing Supervisor' },
  { role: 'admin', title: 'Hospital Administrator / Medical Director' },
  { role: 'receptionist', title: 'Front Desk / Patient Triage' },
  { role: 'pharmacist', title: 'Hospital Pharmacist' },
  { role: 'lab_tech', title: 'Laboratory Technologist / Pathologist' },
  { role: 'accountant', title: 'Billing Officer / Cashier' },
  { role: 'hr_manager', title: 'HR & Staff Coordinator' }
] as const;

// Accredited Hospital Network (Users can select which hospital to consult at)
export const INITIAL_TENANTS: Tenant[] = [
  {
    id: 'hosp-default',
    name: 'City Care Multi-Specialty Hospital',
    type: 'hospital',
    logo: '🏥',
    tagline: '24x7 Multi-Specialty Healthcare & Emergency Center',
    licenseNumber: 'HOSP-REG-2026-001',
    abdmFacilityId: 'IN-HFR-2026-101',
    nabhAccredited: true,
    themeColor: '#39786B',
    branches: [
      { id: 'branch-main', name: 'Main Hospital Campus', city: 'Metro Center', beds: 45, activeDoctors: 7 }
    ],
    currentBranchId: 'branch-main'
  },
  {
    id: 'hosp-lifecare',
    name: 'LifeCare Super-Speciality Hospital',
    type: 'hospital',
    logo: '🩺',
    tagline: 'Advanced Tertiary Care, Neurology & Pediatric Center',
    licenseNumber: 'HOSP-REG-2026-002',
    abdmFacilityId: 'IN-HFR-2026-102',
    nabhAccredited: true,
    themeColor: '#39786B',
    branches: [
      { id: 'branch-lifecare', name: 'LifeCare Medical City', city: 'South Zone', beds: 60, activeDoctors: 5 }
    ],
    currentBranchId: 'branch-lifecare'
  },
  {
    id: 'hosp-metrocare',
    name: 'MetroCare Trauma & Emergency Institute',
    type: 'hospital',
    logo: '🚑',
    tagline: 'Level-1 Emergency, Trauma Triage & Critical Care ICU',
    licenseNumber: 'HOSP-REG-2026-003',
    abdmFacilityId: 'IN-HFR-2026-103',
    nabhAccredited: true,
    themeColor: '#dc2626',
    branches: [
      { id: 'branch-metro', name: 'Metro Trauma Campus', city: 'Central Express', beds: 50, activeDoctors: 6 }
    ],
    currentBranchId: 'branch-metro'
  }
];

// Comprehensive 20-Staff Hospital Roster (Used for quick 1-click seeding up to 20 hospital personnel)
export const DEFAULT_20_STAFF_MEMBERS: StaffEmployee[] = [
  {
    id: 'EMP-1001',
    name: 'Dr. Arvind Swamy',
    role: 'admin',
    designation: 'Medical Director & Chief Administrator',
    department: 'Hospital Administration & HR',
    baseSalary: 120000,
    incentives: 15000,
    bonuses: 0,
    deductions: 0,
    salaryStatus: 'Pending',
    shift: 'General (09:00 - 18:00)',
    phone: '+91 98765 43210',
    email: 'arvind.swamy@hospital.in',
    joiningDate: '2026-01-01',
    attendanceStatus: 'Present'
  },
  {
    id: 'EMP-1002',
    name: 'Dr. Priya Iyer',
    role: 'doctor',
    designation: 'Chief of Cardiology & Interventional Lead',
    department: 'Cardiology',
    baseSalary: 95000,
    incentives: 12000,
    bonuses: 0,
    deductions: 0,
    salaryStatus: 'Pending',
    shift: 'Morning (08:00 - 16:00)',
    phone: '+91 98765 43211',
    email: 'priya.iyer@hospital.in',
    joiningDate: '2026-01-10',
    attendanceStatus: 'Present'
  },
  {
    id: 'EMP-1003',
    name: 'Dr. Rajesh Verma',
    role: 'doctor',
    designation: 'Senior Orthopedic Surgeon & Trauma Specialist',
    department: 'Orthopedics',
    baseSalary: 90000,
    incentives: 10000,
    bonuses: 0,
    deductions: 0,
    salaryStatus: 'Pending',
    shift: 'General (09:00 - 18:00)',
    phone: '+91 98765 43212',
    email: 'rajesh.verma@hospital.in',
    joiningDate: '2026-01-15',
    attendanceStatus: 'Present'
  },
  {
    id: 'EMP-1004',
    name: 'Dr. Ananya Sen',
    role: 'doctor',
    designation: 'Head of Pediatrics & Neonatology',
    department: 'Pediatrics',
    baseSalary: 85000,
    incentives: 9000,
    bonuses: 0,
    deductions: 0,
    salaryStatus: 'Pending',
    shift: 'Morning (08:00 - 16:00)',
    phone: '+91 98765 43213',
    email: 'ananya.sen@hospital.in',
    joiningDate: '2026-02-01',
    attendanceStatus: 'Present'
  },
  {
    id: 'EMP-1005',
    name: 'Dr. Karthik Raman',
    role: 'doctor',
    designation: 'Consultant Neurologist',
    department: 'Neurology',
    baseSalary: 92000,
    incentives: 11000,
    bonuses: 0,
    deductions: 0,
    salaryStatus: 'Pending',
    shift: 'Evening (16:00 - 00:00)',
    phone: '+91 98765 43214',
    email: 'karthik.raman@hospital.in',
    joiningDate: '2026-02-10',
    attendanceStatus: 'Present'
  },
  {
    id: 'EMP-1006',
    name: 'Dr. Meera Deshmukh',
    role: 'doctor',
    designation: 'Emergency Medicine Specialist & In-Charge',
    department: 'Emergency & Trauma',
    baseSalary: 88000,
    incentives: 14000,
    bonuses: 0,
    deductions: 0,
    salaryStatus: 'Pending',
    shift: 'Night (00:00 - 08:00)',
    phone: '+91 98765 43215',
    email: 'meera.deshmukh@hospital.in',
    joiningDate: '2026-02-15',
    attendanceStatus: 'Present'
  },
  {
    id: 'EMP-1007',
    name: 'Dr. Vikram Joshi',
    role: 'doctor',
    designation: 'Lead Anesthesiologist & Critical Care',
    department: 'Critical Care (ICU)',
    baseSalary: 89000,
    incentives: 10500,
    bonuses: 0,
    deductions: 0,
    salaryStatus: 'Pending',
    shift: 'Morning (08:00 - 16:00)',
    phone: '+91 98765 43216',
    email: 'vikram.joshi@hospital.in',
    joiningDate: '2026-03-01',
    attendanceStatus: 'Present'
  },
  {
    id: 'EMP-1008',
    name: 'Dr. Sunita Nair',
    role: 'doctor',
    designation: 'Senior Pulmonologist & Chest Physician',
    department: 'Pulmonology',
    baseSalary: 87000,
    incentives: 8500,
    bonuses: 0,
    deductions: 0,
    salaryStatus: 'Pending',
    shift: 'General (09:00 - 18:00)',
    phone: '+91 98765 43217',
    email: 'sunita.nair@hospital.in',
    joiningDate: '2026-03-05',
    attendanceStatus: 'Present'
  },
  {
    id: 'EMP-1009',
    name: 'Sister Mary Thomas',
    role: 'nurse',
    designation: 'Nursing Superintendent & ICU Charge',
    department: 'Critical Care (ICU)',
    baseSalary: 48000,
    incentives: 6000,
    bonuses: 0,
    deductions: 0,
    salaryStatus: 'Pending',
    shift: 'Morning (08:00 - 16:00)',
    phone: '+91 98765 43218',
    email: 'mary.thomas@hospital.in',
    joiningDate: '2026-01-10',
    attendanceStatus: 'Present'
  },
  {
    id: 'EMP-1010',
    name: 'Sister Deepa Nair',
    role: 'nurse',
    designation: 'Senior Ward In-Charge Nurse',
    department: 'Nursing & Inpatient Wards',
    baseSalary: 42000,
    incentives: 5000,
    bonuses: 0,
    deductions: 0,
    salaryStatus: 'Pending',
    shift: 'General (09:00 - 18:00)',
    phone: '+91 98765 43219',
    email: 'deepa.nair@hospital.in',
    joiningDate: '2026-01-20',
    attendanceStatus: 'Present'
  },
  {
    id: 'EMP-1011',
    name: 'Staff Nurse Sneha Patil',
    role: 'nurse',
    designation: 'Emergency & Triage Staff Nurse',
    department: 'Emergency & Trauma',
    baseSalary: 38000,
    incentives: 4500,
    bonuses: 0,
    deductions: 0,
    salaryStatus: 'Pending',
    shift: 'Night (00:00 - 08:00)',
    phone: '+91 98765 43220',
    email: 'sneha.patil@hospital.in',
    joiningDate: '2026-02-01',
    attendanceStatus: 'Present'
  },
  {
    id: 'EMP-1012',
    name: 'Staff Nurse Rahul Sharma',
    role: 'nurse',
    designation: 'Operation Theatre (OT) Scrub Nurse',
    department: 'General Surgery',
    baseSalary: 39000,
    incentives: 4800,
    bonuses: 0,
    deductions: 0,
    salaryStatus: 'Pending',
    shift: 'Morning (08:00 - 16:00)',
    phone: '+91 98765 43221',
    email: 'rahul.sharma@hospital.in',
    joiningDate: '2026-02-15',
    attendanceStatus: 'Present'
  },
  {
    id: 'EMP-1013',
    name: 'Staff Nurse Kavita Rao',
    role: 'nurse',
    designation: 'Pediatric Care & NICU Nurse',
    department: 'Pediatrics',
    baseSalary: 37500,
    incentives: 4200,
    bonuses: 0,
    deductions: 0,
    salaryStatus: 'Pending',
    shift: 'Evening (16:00 - 00:00)',
    phone: '+91 98765 43222',
    email: 'kavita.rao@hospital.in',
    joiningDate: '2026-03-01',
    attendanceStatus: 'Present'
  },
  {
    id: 'EMP-1014',
    name: 'Arun Kumar',
    role: 'pharmacist',
    designation: 'Chief Pharmacist & Formulary Manager',
    department: 'Hospital Pharmacy',
    baseSalary: 45000,
    incentives: 5000,
    bonuses: 0,
    deductions: 0,
    salaryStatus: 'Pending',
    shift: 'General (09:00 - 18:00)',
    phone: '+91 98765 43223',
    email: 'arun.kumar@hospital.in',
    joiningDate: '2026-01-15',
    attendanceStatus: 'Present'
  },
  {
    id: 'EMP-1015',
    name: 'Pooja Mehta',
    role: 'pharmacist',
    designation: 'Dispensing & Cold-Chain Pharmacist',
    department: 'Hospital Pharmacy',
    baseSalary: 35000,
    incentives: 3500,
    bonuses: 0,
    deductions: 0,
    salaryStatus: 'Pending',
    shift: 'Evening (16:00 - 00:00)',
    phone: '+91 98765 43224',
    email: 'pooja.mehta@hospital.in',
    joiningDate: '2026-02-10',
    attendanceStatus: 'Present'
  },
  {
    id: 'EMP-1016',
    name: 'Ramesh Patil',
    role: 'lab_tech',
    designation: 'Senior Clinical Pathologist & Lab Supervisor',
    department: 'Pathology & Laboratory',
    baseSalary: 46000,
    incentives: 5200,
    bonuses: 0,
    deductions: 0,
    salaryStatus: 'Pending',
    shift: 'Morning (08:00 - 16:00)',
    phone: '+91 98765 43225',
    email: 'ramesh.patil@hospital.in',
    joiningDate: '2026-01-20',
    attendanceStatus: 'Present'
  },
  {
    id: 'EMP-1017',
    name: 'Suresh Pillai',
    role: 'lab_tech',
    designation: 'CT / MRI Senior Radiographer',
    department: 'Pathology & Laboratory',
    baseSalary: 44000,
    incentives: 4800,
    bonuses: 0,
    deductions: 0,
    salaryStatus: 'Pending',
    shift: 'General (09:00 - 18:00)',
    phone: '+91 98765 43226',
    email: 'suresh.pillai@hospital.in',
    joiningDate: '2026-02-05',
    attendanceStatus: 'Present'
  },
  {
    id: 'EMP-1018',
    name: 'Lakshmi Sundaram',
    role: 'accountant',
    designation: 'Lead Hospital Billing & Insurance Officer',
    department: 'Billing & Accounts',
    baseSalary: 52000,
    incentives: 6000,
    bonuses: 0,
    deductions: 0,
    salaryStatus: 'Pending',
    shift: 'General (09:00 - 18:00)',
    phone: '+91 98765 43227',
    email: 'lakshmi.sundaram@hospital.in',
    joiningDate: '2026-01-12',
    attendanceStatus: 'Present'
  },
  {
    id: 'EMP-1019',
    name: 'Manoj Trivedi',
    role: 'admin',
    designation: 'Hospital Facilities & Operations In-Charge',
    department: 'Hospital Administration & HR',
    baseSalary: 50000,
    incentives: 5500,
    bonuses: 0,
    deductions: 0,
    salaryStatus: 'Pending',
    shift: 'General (09:00 - 18:00)',
    phone: '+91 98765 43228',
    email: 'manoj.trivedi@hospital.in',
    joiningDate: '2026-02-15',
    attendanceStatus: 'Present'
  },
  {
    id: 'EMP-1020',
    name: 'Neha Kapoor',
    role: 'receptionist',
    designation: 'Senior Patient Registration & Triage Coordinator',
    department: 'Hospital Administration & HR',
    baseSalary: 32000,
    incentives: 3000,
    bonuses: 0,
    deductions: 0,
    salaryStatus: 'Pending',
    shift: 'Morning (08:00 - 16:00)',
    phone: '+91 98765 43229',
    email: 'neha.kapoor@hospital.in',
    joiningDate: '2026-02-20',
    attendanceStatus: 'Present'
  }
];

// Initial Staff: Clean setup with 1 admin user, ready for user to add all doctors, nurses, etc.
export const INITIAL_STAFF: StaffEmployee[] = [
  {
    id: 'EMP-1001',
    name: 'Dr. Arvind Swamy',
    designation: 'Medical Director & Chief Administrator',
    department: 'Hospital Administration & HR',
    role: 'admin',
    phone: '+91 98765 43210',
    email: 'admin@citycare.in',
    joiningDate: '2026-01-01',
    shift: 'General (09:00 - 18:00)',
    attendanceStatus: 'Present',
    baseSalary: 120000,
    incentives: 15000,
    bonuses: 0,
    deductions: 0,
    salaryStatus: 'Paid',
    lastDisbursedDate: '2026-11-01'
  }
];

// Initial Doctors list derived from staff with role 'doctor'
export const INITIAL_DOCTORS: Doctor[] = [];

// Initial Beds: Starts clean - user adds and names their own beds
export const INITIAL_BEDS: Bed[] = [
  {
    id: 'BED-101',
    bedNumber: 'ICU-01',
    wardType: 'ICU',
    floor: 'Floor 1',
    status: 'Available',
    oxygenEquipped: true,
    ventilatorEquipped: true,
    dailyRate: 6500
  },
  {
    id: 'BED-102',
    bedNumber: 'GEN-101',
    wardType: 'General Male',
    floor: 'Floor 2',
    status: 'Available',
    oxygenEquipped: true,
    ventilatorEquipped: false,
    dailyRate: 1500
  }
];

// Initial Patients: Clean start - user registers patients
export const INITIAL_PATIENTS: Patient[] = [];

// Essential Hospital Medicines (Standard formulary that exists in almost all hospitals)
export const INITIAL_PHARMACY: PharmacyItem[] = [
  {
    id: 'MED-101',
    name: 'Paracetamol 500mg Tablets',
    genericName: 'Acetaminophen 500mg',
    category: 'Analgesic',
    batchNo: 'PCM-2026-88',
    stockQty: 500,
    reorderLevel: 50,
    unitPrice: 2.50,
    mrp: 3.50,
    expiryDate: '2027-12-31',
    supplier: 'Cipla Healthcare Ltd',
    rackLocation: 'Shelf A-01',
    requiresPrescription: false
  },
  {
    id: 'MED-102',
    name: 'Amoxicillin + Clavulanate 625mg',
    genericName: 'Amoxicillin 500mg + Potassium Clavulanate 125mg',
    category: 'Antibiotic',
    batchNo: 'AMX-2026-14',
    stockQty: 250,
    reorderLevel: 30,
    unitPrice: 22.00,
    mrp: 28.00,
    expiryDate: '2027-08-31',
    supplier: 'GlaxoSmithKline Pharmaceuticals',
    rackLocation: 'Shelf B-03',
    requiresPrescription: true
  },
  {
    id: 'MED-103',
    name: 'Pantoprazole 40mg Tablets',
    genericName: 'Pantoprazole Sodium 40mg',
    category: 'Analgesic',
    batchNo: 'PAN-2026-92',
    stockQty: 400,
    reorderLevel: 40,
    unitPrice: 9.50,
    mrp: 14.00,
    expiryDate: '2028-02-28',
    supplier: 'Sun Pharma Ltd',
    rackLocation: 'Shelf A-04',
    requiresPrescription: false
  },
  {
    id: 'MED-104',
    name: 'Normal Saline IV 500ml Infusion',
    genericName: 'Sodium Chloride 0.9% w/v',
    category: 'Emergency IV',
    batchNo: 'NS-2026-551',
    stockQty: 120,
    reorderLevel: 25,
    unitPrice: 42.00,
    mrp: 55.00,
    expiryDate: '2028-06-30',
    supplier: 'Baxter Healthcare',
    rackLocation: 'IV Storage Room',
    requiresPrescription: true
  },
  {
    id: 'MED-105',
    name: 'Cetirizine 10mg Tablets',
    genericName: 'Cetirizine Hydrochloride 10mg',
    category: 'Respiratory',
    batchNo: 'CET-2026-30',
    stockQty: 300,
    reorderLevel: 30,
    unitPrice: 3.50,
    mrp: 5.00,
    expiryDate: '2027-11-30',
    supplier: 'Dr. Reddy Laboratories',
    rackLocation: 'Shelf C-01',
    requiresPrescription: false
  }
];

// Initial Lab Orders
export const INITIAL_LAB_TESTS: LabTestOrder[] = [];

// Initial Invoices
export const INITIAL_INVOICES: BillingInvoice[] = [
  {
    id: 'INV-1001',
    patientId: 'PT-5508',
    patientName: 'suresh',
    abhaId: '91-8170-7392-2265',
    invoiceDate: '2026-11-10',
    type: 'OPD Consultation',
    items: [
      {
        description: 'OPD Cardiology Consultation with Dr. Priya Iyer',
        quantity: 1,
        unitPrice: 500,
        taxRate: 0,
        total: 500
      }
    ],
    subtotal: 500,
    taxAmount: 0,
    discount: 0,
    totalAmount: 500,
    paidAmount: 500,
    paymentMethod: 'UPI',
    status: 'Paid'
  },
  {
    id: 'INV-1002',
    patientId: 'PT-4576',
    patientName: 'arjun',
    abhaId: '91-4759-2393-8687',
    invoiceDate: '2026-11-09',
    type: 'OPD Consultation',
    items: [
      {
        description: 'OPD Consultation & Diagnostic Evaluation',
        quantity: 1,
        unitPrice: 2100,
        taxRate: 0,
        total: 2100
      }
    ],
    subtotal: 2100,
    taxAmount: 0,
    discount: 0,
    totalAmount: 2100,
    paidAmount: 500,
    paymentMethod: 'Cash',
    status: 'Partially Paid'
  }
];

// Initial System Events
export const INITIAL_EVENTS: SystemEventLog[] = [
  {
    id: 'EVT-1',
    timestamp: 'Just Now',
    module: 'SECURITY',
    title: 'Hospital OS Initialized',
    description: 'System online. Ready for hospital facility and staff registration.',
    severity: 'info',
    actor: 'System Kernel'
  }
];

export const INITIAL_PHARMACY_ITEMS = INITIAL_PHARMACY;
export const INITIAL_SYSTEM_EVENTS = INITIAL_EVENTS;
