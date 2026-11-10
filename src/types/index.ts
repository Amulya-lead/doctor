export type TenantType = 'hospital' | 'clinic' | 'diagnostic' | 'network';

export interface Branch {
  id: string;
  name: string;
  city: string;
  beds: number;
  activeDoctors: number;
}

export interface Tenant {
  id: string;
  name: string;
  type: TenantType;
  logo: string;
  tagline: string;
  licenseNumber: string;
  branches: Branch[];
  currentBranchId: string;
  abdmFacilityId: string;
  nabhAccredited: boolean;
  themeColor: string;
}

export type UserRole = 
  | 'admin'
  | 'doctor'
  | 'nurse'
  | 'receptionist'
  | 'lab_tech'
  | 'pharmacist'
  | 'hr_manager'
  | 'accountant'
  | 'patient';

export interface UserProfile {
  id: string;
  name: string;
  role: UserRole;
  title: string;
  department: string;
  avatar: string;
  hprId?: string; // Healthcare Professional Registry
  specialization?: string;
}

export interface PatientVital {
  temperature: string; // e.g., "98.6 °F"
  bloodPressure: string; // e.g., "120/80 mmHg"
  pulseRate: number; // bpm
  spO2: number; // %
  respiratoryRate: number;
  bmi: string;
  recordedAt: string;
}

export interface Patient {
  id: string; // e.g. "PT-2026-0891"
  abhaId: string; // Ayushman Bharat Health Account
  abhaAddress: string; // e.g. "aarav.sharma@abdm"
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  bloodGroup: string;
  phone: string;
  email: string;
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
  };
  allergies: string[];
  chronicConditions: string[];
  status: 'Outpatient' | 'Admitted' | 'Discharged' | 'In Emergency' | 'Consulting';
  assignedDoctorId: string;
  assignedDoctorName: string;
  assignedBed?: string;
  ward?: string;
  vitals: PatientVital;
  registrationDate: string;
  recentDiagnosis?: string;
  insuranceProvider?: string;
  insurancePolicyNo?: string;
  totalBilled: number;
  pendingBalance: number;
  dischargeDate?: string;
  dischargeSummary?: string;
}

export interface Doctor {
  id: string;
  name: string;
  specialization: string;
  department: string;
  qualification: string;
  experienceYears: number;
  hprId: string;
  consultationFee: number;
  availableDays: string[];
  timing: string;
  currentRoom: string;
  todayAppointmentsCount: number;
  rating: number;
  avatar: string;
  status: 'In Consultation' | 'Available' | 'On Round' | 'In Surgery' | 'Offline';
}

export interface ConsultationRecord {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  department?: string;
  hospitalId?: string;
  hospitalName?: string;
  timestamp: string;
  date?: string;
  timeSlot?: string;
  symptoms: string[];
  diagnosis: string;
  icd10Code: string;
  clinicalNotes: string;
  prescriptions: PrescribedMedicine[];
  orderedLabTests: string[];
  followUpDays: number;
  vitalsAtConsultation: PatientVital;
  signedDigitally: boolean;
  fee?: number;
  invoiceId?: string;
  paymentStatus?: 'Paid' | 'Unpaid';
}

export interface PrescribedMedicine {
  id: string;
  medicineName: string;
  dosage: string; // "500 mg"
  frequency: string; // "1-0-1 (After Food)"
  duration: string; // "5 Days"
  instructions: string;
  dispensed: boolean;
}

export type LabTestStatus = 'Ordered' | 'Sample Collected' | 'Analyzing' | 'Pending Review' | 'Approved' | 'Delivered';

export interface LabTestOrder {
  id: string;
  barcode: string;
  patientId: string;
  patientName: string;
  patientAge: number;
  patientGender: string;
  testName: string;
  category: 'Hematology' | 'Biochemistry' | 'Radiology' | 'Microbiology' | 'Cardiology';
  orderedByDoctor: string;
  orderedAt: string;
  sampleType: string; // Blood, Urine, Serum, Swab, Sputum
  status: LabTestStatus;
  technicianName?: string;
  parameters: {
    name: string;
    value: string;
    unit: string;
    normalRange: string;
    isAbnormal: boolean;
  }[];
  criticalAlert: boolean;
  doctorApprovedAt?: string;
  approvedBy?: string;
  reportUrl?: string;
  cost: number;
}

export interface PharmacyItem {
  id: string;
  name: string;
  genericName: string;
  category: 'Antibiotic' | 'Analgesic' | 'Cardiovascular' | 'Antidiabetic' | 'Respiratory' | 'Emergency IV';
  batchNo: string;
  stockQty: number;
  reorderLevel: number;
  unitPrice: number;
  mrp: number;
  expiryDate: string;
  supplier: string;
  rackLocation: string;
  requiresPrescription: boolean;
}

export interface Bed {
  id: string;
  bedNumber: string;
  wardType: 'ICU' | 'Emergency Triage' | 'Deluxe Private' | 'Semi-Private' | 'General Male' | 'General Female';
  floor: string;
  status: 'Occupied' | 'Available' | 'Cleaning' | 'Maintenance' | 'Reserved';
  patientId?: string;
  patientName?: string;
  admittedAt?: string;
  nurseInCharge?: string;
  oxygenEquipped: boolean;
  ventilatorEquipped: boolean;
  dailyRate: number;
}

export interface BillingInvoice {
  id: string;
  patientId: string;
  patientName: string;
  abhaId: string;
  invoiceDate: string;
  type: 'OPD Consultation' | 'IPD Admission' | 'Diagnostics' | 'Pharmacy' | 'Comprehensive Package';
  items: {
    description: string;
    quantity: number;
    unitPrice: number;
    taxRate: number; // 0, 5, 12, 18%
    total: number;
  }[];
  subtotal: number;
  taxAmount: number;
  discount: number;
  totalAmount: number;
  paidAmount: number;
  paymentMethod: 'UPI' | 'Credit/Debit Card' | 'Cash' | 'Insurance Cashless (TPA)' | 'PMJAY' | 'Pending';
  status: 'Paid' | 'Partially Paid' | 'Unpaid' | 'Claim Processing';
  insuranceClaimStatus?: 'Submitted' | 'Pre-Authorized' | 'Approved' | 'Disputed' | 'Reimbursed';
  transactionRef?: string;
}

export interface SystemEventLog {
  id: string;
  timestamp: string;
  module: 'PATIENT' | 'DOCTOR' | 'LIMS' | 'PHARMACY' | 'BILLING' | 'BEDS' | 'NOTIFICATIONS' | 'ABDM' | 'SECURITY';
  title: string;
  description: string;
  severity: 'info' | 'success' | 'warning' | 'critical';
  actor: string;
  patientId?: string;
}

export interface StaffEmployee {
  id: string;
  name: string;
  designation: string;
  department: string;
  role: UserRole;
  phone: string;
  email: string;
  joiningDate: string;
  shift: 'Morning (08:00 - 16:00)' | 'Evening (16:00 - 00:00)' | 'Night (00:00 - 08:00)' | 'General (09:00 - 18:00)';
  attendanceStatus: 'Present' | 'On Duty' | 'On Leave' | 'In OT';
  baseSalary: number;
  incentives: number;
  bonuses: number;
  deductions: number;
  salaryStatus: 'Paid' | 'Pending';
  lastDisbursedDate?: string;
  bonusReason?: string;
  deductionReason?: string;
}

export interface OperationalMetrics {
  totalPatientsToday: number;
  opdCount: number;
  ipdAdmissions: number;
  activeDoctors: number;
  bedOccupancyRate: number; // percentage
  availableBeds: number;
  totalBeds: number;
  totalRevenueToday: number;
  pendingClaimsAmount: number;
  criticalLabAlerts: number;
  pendingPrescriptions: number;
  activeOtSurgeries: number;
}

