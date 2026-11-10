import React, { useState } from 'react';
import { 
  Building2, 
  Stethoscope, 
  Calendar, 
  Clock, 
  User, 
  Receipt, 
  Settings as SettingsIcon, 
  LogOut, 
  Search, 
  CheckCircle2, 
  Star, 
  MapPin, 
  CreditCard, 
  Phone, 
  Mail, 
  ShieldCheck, 
  Heart, 
  ArrowRight, 
  X, 
  Check, 
  FileText, 
  AlertCircle,
  Activity,
  Download,
  Filter,
  Plus,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useHospitalOS } from '../../context/HospitalOSContext';
import { Doctor, BillingInvoice, Patient } from '../../types';

interface PatientPortalProps {
  onNavigateHome?: () => void;
}

export const PatientPortal: React.FC<PatientPortalProps> = ({ onNavigateHome }) => {
  const { 
    tenants, 
    currentTenant, 
    setCurrentTenantId, 
    doctors, 
    patients, 
    invoices, 
    payInvoice, 
    bookAppointment, 
    currentUser, 
    logout,
    updatePatient 
  } = useHospitalOS();

  // Active Navigation Tab: 'book' | 'history' | 'profile' | 'settings'
  const [activeTab, setActiveTab] = useState<'book' | 'history' | 'profile' | 'settings'>('book');

  // Doctor Search & Filters
  const [searchDoctor, setSearchDoctor] = useState('');
  const [selectedDept, setSelectedDept] = useState('ALL');

  // Booking Modal State
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [selectedDoctorForBooking, setSelectedDoctorForBooking] = useState<Doctor | null>(null);
  const [appointmentDate, setAppointmentDate] = useState(new Date().toISOString().slice(0, 10));
  const [appointmentSlot, setAppointmentSlot] = useState('10:30 AM');
  const [consultationType, setConsultationType] = useState('OPD Consultation');
  const [healthSymptoms, setHealthSymptoms] = useState('');
  const [payNow, setPayNow] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState<BillingInvoice['paymentMethod']>('UPI');
  const [confirmedBookingInvoice, setConfirmedBookingInvoice] = useState<BillingInvoice | null>(null);

  // Digital Pass & Receipt Modal State
  const [viewPassInvoice, setViewPassInvoice] = useState<BillingInvoice | null>(null);

  // Profile Edit State (Dynamic for whichever user logs in)
  const currentPatientRecord = patients.find(
    p => p.name.toLowerCase() === (currentUser.name || '').toLowerCase()
  ) || {
    id: currentUser.id || `PT-${Date.now().toString().slice(-4)}`,
    name: currentUser.name || 'Patient User',
    age: 28,
    gender: 'Male',
    bloodGroup: 'B+ Positive',
    phone: '',
    email: currentUser.email || '',
    abhaId: `91-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}`,
    abhaAddress: `${(currentUser.name || 'patient').toLowerCase().replace(/[^a-z0-9]/g, '')}@abdm`,
    emergencyContact: { name: 'Emergency Family', relationship: 'Relative', phone: '' },
    allergies: ['None Reported'],
    chronicConditions: ['None']
  };

  const [profileForm, setProfileForm] = useState({
    name: currentPatientRecord.name,
    age: currentPatientRecord.age.toString(),
    gender: currentPatientRecord.gender,
    bloodGroup: currentPatientRecord.bloodGroup,
    phone: currentPatientRecord.phone || '',
    email: currentPatientRecord.email || '',
    allergies: currentPatientRecord.allergies ? currentPatientRecord.allergies.join(', ') : 'None Reported',
    emergencyContactName: currentPatientRecord.emergencyContact?.name || '',
    emergencyContactPhone: currentPatientRecord.emergencyContact?.phone || ''
  });
  const [profileSavedToast, setProfileSavedToast] = useState(false);

  // Settings State
  const [settings, setSettings] = useState({
    smsAlerts: true,
    whatsappPass: true,
    emailReceipts: true,
    abhaSync: true
  });

  // Departments list
  const departments = ['ALL', ...Array.from(new Set(doctors.map(d => d.department)))];

  // Hospital Search & Sliced Virtual Pagination (Scalable for 1,000 hospitals)
  const [hospitalSearch, setHospitalSearch] = useState('');
  const [hospitalPage, setHospitalPage] = useState(1);
  const HOSPITALS_PER_PAGE = 6;

  const filteredHospitals = tenants.filter(t => 
    t.name.toLowerCase().includes(hospitalSearch.toLowerCase()) ||
    t.tagline.toLowerCase().includes(hospitalSearch.toLowerCase()) ||
    t.licenseNumber.toLowerCase().includes(hospitalSearch.toLowerCase())
  );
  const totalHospitalPages = Math.max(1, Math.ceil(filteredHospitals.length / HOSPITALS_PER_PAGE));
  const paginatedHospitals = filteredHospitals.slice(
    (hospitalPage - 1) * HOSPITALS_PER_PAGE,
    hospitalPage * HOSPITALS_PER_PAGE
  );

  const filteredDoctors = doctors.filter(doc => {
    const matchesDept = selectedDept === 'ALL' || doc.department === selectedDept;
    const matchesSearch = 
      doc.name.toLowerCase().includes(searchDoctor.toLowerCase()) ||
      doc.specialization.toLowerCase().includes(searchDoctor.toLowerCase()) ||
      doc.department.toLowerCase().includes(searchDoctor.toLowerCase());
    return matchesDept && matchesSearch;
  });

  // Doctor Sliced Virtual Pagination
  const [doctorPage, setDoctorPage] = useState(1);
  const DOCTORS_PER_PAGE = 6;
  const totalDoctorPages = Math.max(1, Math.ceil(filteredDoctors.length / DOCTORS_PER_PAGE));
  const paginatedDoctors = filteredDoctors.slice(
    (doctorPage - 1) * DOCTORS_PER_PAGE,
    doctorPage * DOCTORS_PER_PAGE
  );

  // Filter consultations ("What all consulted so far") strictly for the logged-in user
  const patientConsultations = invoices.filter(inv => {
    const ptNameLower = (currentUser.name || '').toLowerCase().trim();
    const invNameLower = (inv.patientName || '').toLowerCase().trim();
    if (!ptNameLower) return false;
    return (
      invNameLower === ptNameLower || 
      inv.patientId === currentUser.id ||
      (ptNameLower.length > 2 && invNameLower.includes(ptNameLower)) ||
      (invNameLower.length > 2 && ptNameLower.includes(invNameLower))
    );
  });

  // Consultations Sliced Virtual Pagination
  const [consultationPage, setConsultationPage] = useState(1);
  const CONSULTATIONS_PER_PAGE = 6;
  const totalConsultationPages = Math.max(1, Math.ceil(patientConsultations.length / CONSULTATIONS_PER_PAGE));
  const paginatedConsultations = patientConsultations.slice(
    (consultationPage - 1) * CONSULTATIONS_PER_PAGE,
    consultationPage * CONSULTATIONS_PER_PAGE
  );

  const handleOpenBookingModal = (doc: Doctor) => {
    setSelectedDoctorForBooking(doc);
    setHealthSymptoms('');
    setIsBookingModalOpen(true);
  };

  const handleConfirmBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDoctorForBooking) return;

    const fee = selectedDoctorForBooking.consultationFee || 500;
    const patientName = currentUser.name || currentPatientRecord.name || 'Registered Patient';
    const patientId = currentPatientRecord.id || currentUser.id || `PT-${Date.now().toString().slice(-4)}`;

    const generatedInv = bookAppointment({
      patientId,
      patientName,
      doctorId: selectedDoctorForBooking.id,
      doctorName: selectedDoctorForBooking.name,
      department: selectedDoctorForBooking.department,
      date: appointmentDate,
      timeSlot: appointmentSlot,
      consultationType: 'OPD Consultation',
      fee,
      payNow,
      paymentMethod: payNow ? paymentMethod : 'Pending'
    });

    setIsBookingModalOpen(false);
    setConfirmedBookingInvoice(generatedInv);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updatePatient(currentPatientRecord.id, {
      name: profileForm.name || currentPatientRecord.name,
      age: Number(profileForm.age) || currentPatientRecord.age,
      gender: profileForm.gender as any,
      bloodGroup: profileForm.bloodGroup,
      phone: profileForm.phone,
      email: profileForm.email,
      allergies: profileForm.allergies ? profileForm.allergies.split(',').map(s => s.trim()).filter(Boolean) : ['None Reported'],
      emergencyContact: {
        name: profileForm.emergencyContactName || 'Family Contact',
        relationship: 'Family',
        phone: profileForm.emergencyContactPhone || profileForm.phone
      }
    });
    setProfileSavedToast(true);
    setTimeout(() => setProfileSavedToast(false), 3000);
  };

  const handleLogout = () => {
    logout();
    if (onNavigateHome) {
      onNavigateHome();
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col justify-between">
      {/* 1. Patient Portal Top Navigation Bar */}
      <header className="sticky top-0 z-40 w-full bg-white border-b border-slate-200 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Logo & Facility */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-sky-600 flex items-center justify-center text-white shadow-xs">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg text-slate-900 tracking-tight">
                  Hospital<span className="text-sky-600">OS</span>
                </span>
                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                  Patient Portal
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden md:block">
                Active Hospital: <span className="font-semibold text-slate-700">{currentTenant.name}</span>
              </p>
            </div>
          </div>

          {/* User Badge & Sign Out */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 border border-slate-200 text-xs">
              <div className="w-6 h-6 rounded-lg bg-sky-600 text-white flex items-center justify-center font-bold text-xs">
                {currentUser.name[0] || 'P'}
              </div>
              <div className="text-left">
                <p className="font-bold text-slate-900 text-xs leading-none">{currentUser.name}</p>
                <p className="text-[10px] text-slate-500 leading-none mt-0.5">Patient ID: {currentPatientRecord.id}</p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-rose-50 hover:text-rose-600 text-slate-600 font-semibold text-xs flex items-center gap-1.5 transition active:scale-95 shadow-xs"
              title="Sign Out to Public View"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </div>

        {/* 2. Portal Navigation Tabs Bar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-slate-100 flex items-center gap-1 sm:gap-4 overflow-x-auto">
          <button
            onClick={() => setActiveTab('book')}
            className={`py-3 px-3 sm:px-4 text-xs font-bold flex items-center gap-2 border-b-2 transition whitespace-nowrap ${
              activeTab === 'book'
                ? 'border-sky-600 text-sky-700 bg-sky-50/50'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Stethoscope className="w-4 h-4 text-sky-600" />
            <span>1. Book Consultation (Hospitals &amp; Doctors)</span>
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className={`py-3 px-3 sm:px-4 text-xs font-bold flex items-center gap-2 border-b-2 transition whitespace-nowrap ${
              activeTab === 'history'
                ? 'border-sky-600 text-sky-700 bg-sky-50/50'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Receipt className="w-4 h-4 text-sky-600" />
            <span>2. My Consultations ({patientConsultations.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`py-3 px-3 sm:px-4 text-xs font-bold flex items-center gap-2 border-b-2 transition whitespace-nowrap ${
              activeTab === 'profile'
                ? 'border-sky-600 text-sky-700 bg-sky-50/50'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <User className="w-4 h-4 text-sky-600" />
            <span>3. My Profile &amp; ABHA Health Card</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`py-3 px-3 sm:px-4 text-xs font-bold flex items-center gap-2 border-b-2 transition whitespace-nowrap ${
              activeTab === 'settings'
                ? 'border-sky-600 text-sky-700 bg-sky-50/50'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <SettingsIcon className="w-4 h-4 text-sky-600" />
            <span>4. Settings</span>
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Booking Success Banner */}
        {confirmedBookingInvoice && (
          <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-950 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-in fade-in">
            <div className="flex items-start sm:items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-emerald-600 text-white flex items-center justify-center flex-shrink-0">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-base text-emerald-950">Consultation Booked Successfully!</h3>
                  <span className="px-2 py-0.5 rounded font-mono font-bold text-xs bg-emerald-200/70 text-emerald-900">
                    Token: {confirmedBookingInvoice.id}
                  </span>
                </div>
                <p className="text-xs text-emerald-800 mt-1">
                  Hospital: <span className="font-bold text-emerald-950">{currentTenant.name}</span> &bull; 
                  Patient: <span className="font-bold text-emerald-950">{confirmedBookingInvoice.patientName}</span> &bull; 
                  Status: <span className="font-semibold">{confirmedBookingInvoice.status === 'Paid' ? 'Paid via UPI' : 'Pay at Cashier Desk'}</span>
                </p>
                <p className="text-[11px] text-emerald-700 mt-0.5 font-medium">
                  ✓ This consultation is now live and fetched in the Hospital Admin Portal for attending clinicians.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-auto">
              <button
                onClick={() => {
                  setViewPassInvoice(confirmedBookingInvoice);
                  setConfirmedBookingInvoice(null);
                }}
                className="px-3.5 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center gap-1.5 transition"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>View Digital Pass</span>
              </button>
              <button
                onClick={() => setConfirmedBookingInvoice(null)}
                className="px-3 py-1.5 rounded-lg bg-white border border-emerald-300 text-emerald-800 font-bold text-xs hover:bg-emerald-100 transition"
              >
                Dismiss
              </button>
            </div>
          </div>
        )}

        {/* ================= TAB 1: BOOK CONSULTATION ================= */}
        {activeTab === 'book' && (
          <div className="space-y-8 animate-in fade-in duration-150">
            {/* Step 1: Hospital Selection (Scalable for 1,000 Hospitals) */}
            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-sky-100 text-sky-800 flex items-center justify-center text-xs font-bold">1</span>
                    <span>Select Hospital Facility</span>
                  </h3>
                  <p className="text-xs text-slate-500">
                    Choose the hospital campus where you wish to book your clinical consultation.
                  </p>
                </div>

                {/* Instant Hospital Search (Handles 1,000 hospitals at <1ms) */}
                <div className="relative w-full sm:w-80">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={hospitalSearch}
                    onChange={(e) => {
                      setHospitalSearch(e.target.value);
                      setHospitalPage(1);
                    }}
                    placeholder={`Search across ${tenants.length} hospitals by name or license...`}
                    className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-sky-500 shadow-2xs"
                  />
                  {hospitalSearch && (
                    <button
                      onClick={() => setHospitalSearch('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 font-bold"
                    >
                      &times;
                    </button>
                  )}
                </div>
              </div>

              {paginatedHospitals.length === 0 ? (
                <div className="p-8 rounded-2xl bg-white border border-slate-200 text-center space-y-2">
                  <p className="text-xs font-bold text-slate-700">No matching hospital found</p>
                  <p className="text-xs text-slate-400">Try searching with a different name or license number.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {paginatedHospitals.map(t => {
                    const isSelected = currentTenant.id === t.id;
                    return (
                      <div
                        key={t.id}
                        onClick={() => setCurrentTenantId(t.id)}
                        className={`p-4 rounded-2xl border-2 cursor-pointer transition flex flex-col justify-between space-y-3 ${
                          isSelected
                            ? 'bg-sky-50/60 border-sky-600 shadow-xs'
                            : 'bg-white border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-2.5 truncate">
                            <span className="text-2xl flex-shrink-0">{t.logo}</span>
                            <div className="truncate">
                              <h4 className="font-bold text-slate-900 text-sm leading-tight truncate">{t.name}</h4>
                              <p className="text-[11px] text-slate-500 capitalize">{t.type} Campus</p>
                            </div>
                          </div>
                          {isSelected && (
                            <span className="w-5 h-5 rounded-full bg-sky-600 text-white flex items-center justify-center flex-shrink-0">
                              <Check className="w-3.5 h-3.5" />
                            </span>
                          )}
                        </div>

                        <p className="text-xs text-slate-600 line-clamp-2">{t.tagline}</p>

                        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-mono">
                          <span>Lic: {t.licenseNumber}</span>
                          <span className={`font-sans font-bold ${isSelected ? 'text-sky-700' : 'text-slate-400'}`}>
                            {isSelected ? '✓ Selected' : 'Click to Select'}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Sliced Pagination Controls for 1,000 Hospitals */}
              {totalHospitalPages > 1 && (
                <div className="flex items-center justify-between pt-2 text-xs text-slate-500">
                  <span>
                    Showing {((hospitalPage - 1) * HOSPITALS_PER_PAGE) + 1}–{Math.min(hospitalPage * HOSPITALS_PER_PAGE, filteredHospitals.length)} of {filteredHospitals.length} hospitals
                  </span>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => setHospitalPage(p => Math.max(1, p - 1))}
                      disabled={hospitalPage === 1}
                      className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 transition"
                      title="Previous Page"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <span className="px-2 font-semibold text-slate-700">
                      Page {hospitalPage} of {totalHospitalPages}
                    </span>
                    <button
                      onClick={() => setHospitalPage(p => Math.min(totalHospitalPages, p + 1))}
                      disabled={hospitalPage === totalHospitalPages}
                      className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 transition"
                      title="Next Page"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Step 2: Doctor Selection According to Medical Requirement */}
            <div className="space-y-4 pt-4 border-t border-slate-200">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-sky-100 text-sky-800 flex items-center justify-center text-xs font-bold">2</span>
                    <span>Select Doctor According to Requirement</span>
                  </h3>
                  <p className="text-xs text-slate-500">
                    Viewing attending specialists available at <span className="font-semibold text-slate-800">{currentTenant.name}</span>.
                  </p>
                </div>

                {/* Search Doctor */}
                <div className="relative w-full sm:w-72">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchDoctor}
                    onChange={(e) => setSearchDoctor(e.target.value)}
                    placeholder="Search doctor or specialty..."
                    className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-sky-500 shadow-2xs"
                  />
                </div>
              </div>

              {/* Department / Specialty Filter Pills */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {departments.map(dept => (
                  <button
                    key={dept}
                    onClick={() => setSelectedDept(dept)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition ${
                      selectedDept === dept
                        ? 'bg-sky-600 text-white shadow-2xs'
                        : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200'
                    }`}
                  >
                    {dept === 'ALL' ? 'All Specialties' : dept}
                  </button>
                ))}
              </div>

              {/* Doctors Grid (Sliced Pagination for large rosters) */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {paginatedDoctors.map(doc => (
                  <div
                    key={doc.id}
                    className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:shadow-md transition flex flex-col justify-between space-y-4"
                  >
                    <div className="flex items-start gap-3.5">
                      <div className="relative">
                        <div className="w-13 h-13 rounded-2xl bg-sky-50 text-sky-700 flex items-center justify-center text-2xl border border-sky-100 flex-shrink-0">
                          {doc.avatar || '👨‍⚕️'}
                        </div>
                        <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-slate-900 text-sm truncate">{doc.name}</h4>
                        <p className="text-xs font-semibold text-sky-700 truncate">{doc.specialization}</p>
                        <p className="text-[11px] text-slate-500 truncate">{doc.qualification}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded">
                            <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                            <span>{doc.rating}</span>
                          </span>
                          <span className="text-[10px] text-slate-400 font-medium">
                            &bull; {doc.department}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1 text-xs text-slate-600">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400 font-medium">OPD Timing:</span>
                        <span className="font-semibold text-slate-800">{doc.timing}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400 font-medium">Chamber:</span>
                        <span className="font-semibold text-slate-800">{doc.currentRoom}</span>
                      </div>
                      <div className="flex items-center justify-between pt-1 border-t border-slate-200/60">
                        <span className="text-slate-500 font-medium">Consultation Fee:</span>
                        <span className="font-bold text-sm text-slate-900 font-mono">₹{doc.consultationFee}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleOpenBookingModal(doc)}
                      className="w-full py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition active:scale-95"
                    >
                      <Calendar className="w-3.5 h-3.5" />
                      <span>Book Consultation (₹{doc.consultationFee})</span>
                    </button>
                  </div>
                ))}
              </div>

              {/* Sliced Doctor Pagination */}
              {totalDoctorPages > 1 && (
                <div className="flex items-center justify-between pt-2 text-xs text-slate-500">
                  <span>
                    Showing {((doctorPage - 1) * DOCTORS_PER_PAGE) + 1}–{Math.min(doctorPage * DOCTORS_PER_PAGE, filteredDoctors.length)} of {filteredDoctors.length} doctors
                  </span>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => setDoctorPage(p => Math.max(1, p - 1))}
                      disabled={doctorPage === 1}
                      className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 transition"
                      title="Previous Page"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <span className="px-2 font-semibold text-slate-700">
                      Page {doctorPage} of {totalDoctorPages}
                    </span>
                    <button
                      onClick={() => setDoctorPage(p => Math.min(totalDoctorPages, p + 1))}
                      disabled={doctorPage === totalDoctorPages}
                      className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 transition"
                      title="Next Page"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ================= TAB 2: MY CONSULTATIONS ("What all consulted so far") ================= */}
        {activeTab === 'history' && (
          <div className="space-y-5 animate-in fade-in duration-150">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
              <div>
                <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <Receipt className="w-5 h-5 text-sky-600" />
                  <span>My Consultations &amp; Medical History</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Complete record of all doctor consultations booked by {currentUser.name} across our hospital network.
                </p>
              </div>

              <button
                onClick={() => setActiveTab('book')}
                className="px-3.5 py-2 rounded-lg bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs flex items-center gap-1.5 transition active:scale-95 shadow-xs self-start sm:self-auto"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Book New Consultation</span>
              </button>
            </div>

            {patientConsultations.length === 0 ? (
              <div className="p-12 rounded-2xl bg-white border border-slate-200 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-sky-50 text-sky-600 flex items-center justify-center mx-auto">
                  <Stethoscope className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-slate-900 text-sm">No Consultations Booked Yet</h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  You haven't booked any doctor consultations so far. Pick a hospital and specialist to book your first appointment.
                </p>
                <button
                  onClick={() => setActiveTab('book')}
                  className="px-4 py-2 rounded-lg bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs shadow-xs transition"
                >
                  Book Your First Consultation
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {paginatedConsultations.map(inv => {
                    const isPaid = inv.status === 'Paid';
                    return (
                      <div
                        key={inv.id}
                        className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:shadow-md transition space-y-3.5 flex flex-col justify-between"
                      >
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="font-mono font-bold text-xs text-sky-700 bg-sky-50 px-2 py-0.5 rounded border border-sky-100">
                              {inv.id}
                            </span>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              isPaid
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : 'bg-amber-50 text-amber-700 border border-amber-200'
                            }`}>
                              {isPaid ? `✓ Paid (${inv.paymentMethod})` : 'Pending at Cashier Desk'}
                            </span>
                          </div>

                          <div>
                            <h4 className="font-bold text-slate-900 text-base">{inv.patientName}</h4>
                            <p className="text-xs font-semibold text-sky-700 mt-0.5">
                              {inv.items[0]?.description || inv.type}
                            </p>
                            <p className="text-[11px] text-slate-500 mt-0.5">
                              Hospital: <span className="font-semibold text-slate-700">{currentTenant.name}</span>
                            </p>
                          </div>

                          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs space-y-1 text-slate-600">
                            <div className="flex items-center justify-between">
                              <span className="text-slate-400 font-medium">Consultation Date:</span>
                              <span className="font-mono font-semibold text-slate-800">{inv.invoiceDate}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-slate-400 font-medium">Total Billed:</span>
                              <span className="font-mono font-bold text-slate-900">₹{inv.totalAmount.toLocaleString('en-IN')}</span>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-2 pt-2 border-t border-slate-100">
                          {!isPaid && (
                            <button
                              onClick={() => payInvoice(inv.id, 'UPI')}
                              className="w-full py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition active:scale-95"
                            >
                              <Check className="w-3.5 h-3.5" />
                              <span>Pay Now via UPI (₹{inv.totalAmount})</span>
                            </button>
                          )}

                          <button
                            onClick={() => setViewPassInvoice(inv)}
                            className="w-full py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs flex items-center justify-center gap-1.5 transition active:scale-95 shadow-2xs"
                          >
                            <FileText className="w-3.5 h-3.5 text-sky-600" />
                            <span>View Digital Pass &amp; Receipt</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Consultations Pagination */}
                {totalConsultationPages > 1 && (
                  <div className="flex items-center justify-between pt-2 text-xs text-slate-500">
                    <span>
                      Showing {((consultationPage - 1) * CONSULTATIONS_PER_PAGE) + 1}–{Math.min(consultationPage * CONSULTATIONS_PER_PAGE, patientConsultations.length)} of {patientConsultations.length} records
                    </span>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => setConsultationPage(p => Math.max(1, p - 1))}
                        disabled={consultationPage === 1}
                        className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 transition"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <span className="px-2 font-semibold text-slate-700">
                        Page {consultationPage} of {totalConsultationPages}
                      </span>
                      <button
                        onClick={() => setConsultationPage(p => Math.min(totalConsultationPages, p + 1))}
                        disabled={consultationPage === totalConsultationPages}
                        className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 transition"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ================= TAB 3: MY PROFILE ================= */}
        {activeTab === 'profile' && (
          <div className="space-y-6 max-w-4xl mx-auto animate-in fade-in duration-150">
            {profileSavedToast && (
              <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Patient profile updated successfully in hospital records.</span>
              </div>
            )}

            {/* ABHA Digital Health Card Banner */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-sky-600 via-sky-700 to-sky-900 text-white shadow-md space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-widest text-sky-200 block">
                    Ayushman Bharat Digital Health Card
                  </span>
                  <h3 className="text-xl font-bold mt-0.5">{profileForm.name}</h3>
                </div>
                <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-xs flex items-center justify-center text-white border border-white/20">
                  <ShieldCheck className="w-6 h-6" />
                </div>
              </div>

              <div className="pt-2 border-t border-white/20 font-mono space-y-1">
                <span className="text-[10px] text-sky-200 uppercase tracking-widest">14-Digit ABHA ID</span>
                <p className="text-lg font-bold tracking-widest">{currentPatientRecord.abhaId || '91-4521-8890-1234'}</p>
                <p className="text-xs text-sky-200">{currentPatientRecord.abhaAddress || 'patient@abdm'}</p>
              </div>

              <div className="pt-2 border-t border-white/20 grid grid-cols-3 gap-2 text-xs">
                <div>
                  <span className="text-[10px] text-sky-200 uppercase block">Gender / Age</span>
                  <span className="font-bold">{profileForm.gender} &bull; {profileForm.age} Yrs</span>
                </div>
                <div>
                  <span className="text-[10px] text-sky-200 uppercase block">Blood Group</span>
                  <span className="font-bold">{profileForm.bloodGroup}</span>
                </div>
                <div>
                  <span className="text-[10px] text-sky-200 uppercase block">Facility</span>
                  <span className="font-bold truncate">{currentTenant.name}</span>
                </div>
              </div>
            </div>

            {/* Profile Form */}
            <form onSubmit={handleSaveProfile} className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-xs">
              <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider pb-2 border-b border-slate-100">
                Edit Patient Personal Details
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Full Name</label>
                  <input
                    type="text"
                    required
                    value={profileForm.name}
                    onChange={e => setProfileForm({ ...profileForm, name: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-sky-500 focus:bg-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Phone Number</label>
                  <input
                    type="tel"
                    required
                    value={profileForm.phone}
                    onChange={e => setProfileForm({ ...profileForm, phone: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-sky-500 focus:bg-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Email Address</label>
                  <input
                    type="email"
                    required
                    value={profileForm.email}
                    onChange={e => setProfileForm({ ...profileForm, email: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-sky-500 focus:bg-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Age</label>
                    <input
                      type="number"
                      value={profileForm.age}
                      onChange={e => setProfileForm({ ...profileForm, age: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-sky-500 focus:bg-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Blood Group</label>
                    <select
                      value={profileForm.bloodGroup}
                      onChange={e => setProfileForm({ ...profileForm, bloodGroup: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-sky-500 focus:bg-white"
                    >
                      {['A+ Positive', 'A- Negative', 'B+ Positive', 'B- Negative', 'O+ Positive', 'O- Negative', 'AB+ Positive', 'AB- Negative'].map(b => (
                        <option key={b} value={b}>{b}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Emergency Contact Name</label>
                  <input
                    type="text"
                    value={profileForm.emergencyContactName}
                    onChange={e => setProfileForm({ ...profileForm, emergencyContactName: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-sky-500 focus:bg-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Emergency Contact Phone</label>
                  <input
                    type="tel"
                    value={profileForm.emergencyContactPhone}
                    onChange={e => setProfileForm({ ...profileForm, emergencyContactPhone: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-sky-500 focus:bg-white"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs uppercase tracking-wider shadow-xs transition active:scale-95"
                >
                  Save Profile Changes
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ================= TAB 4: SETTINGS ================= */}
        {activeTab === 'settings' && (
          <div className="space-y-6 max-w-3xl mx-auto animate-in fade-in duration-150">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-5 shadow-xs">
              <h3 className="text-base font-bold text-slate-900 pb-2 border-b border-slate-100 flex items-center gap-2">
                <SettingsIcon className="w-4 h-4 text-sky-600" />
                <span>Patient Account &amp; Notification Settings</span>
              </h3>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <div>
                    <h5 className="font-bold text-slate-900 text-xs">SMS Appointment Reminders</h5>
                    <p className="text-[11px] text-slate-500">Receive SMS token alerts on your phone prior to consultation slot.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.smsAlerts}
                    onChange={e => setSettings({ ...settings, smsAlerts: e.target.checked })}
                    className="w-4 h-4 text-sky-600 rounded border-slate-300"
                  />
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <div>
                    <h5 className="font-bold text-slate-900 text-xs">WhatsApp Digital Consultation Pass</h5>
                    <p className="text-[11px] text-slate-500">Receive instant digital QR token pass on WhatsApp after booking.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.whatsappPass}
                    onChange={e => setSettings({ ...settings, whatsappPass: e.target.checked })}
                    className="w-4 h-4 text-sky-600 rounded border-slate-300"
                  />
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <div>
                    <h5 className="font-bold text-slate-900 text-xs">ABHA Digital Health Record Sync</h5>
                    <p className="text-[11px] text-slate-500">Automatically sync hospital doctor consultations to your official ABHA locker.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.abhaSync}
                    onChange={e => setSettings({ ...settings, abhaSync: e.target.checked })}
                    className="w-4 h-4 text-sky-600 rounded border-slate-300"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs text-slate-500">Logged in as {currentUser.name} ({currentUser.email})</span>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 rounded-xl bg-rose-50 text-rose-700 hover:bg-rose-100 font-bold text-xs flex items-center gap-1.5 transition"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Log Out of Patient Portal</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Booking Modal */}
      {isBookingModalOpen && selectedDoctorForBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-lg rounded-2xl bg-white border border-slate-200 shadow-2xl p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-sky-50 text-sky-600">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">Confirm Doctor Consultation</h3>
                  <p className="text-xs text-slate-500">{currentTenant.name}</p>
                </div>
              </div>
              <button 
                onClick={() => setIsBookingModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Doctor Info Chip */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-3">
              <span className="text-2xl">{selectedDoctorForBooking.avatar || '👨‍⚕️'}</span>
              <div>
                <h4 className="font-bold text-slate-900 text-xs">{selectedDoctorForBooking.name}</h4>
                <p className="text-[11px] text-sky-700">{selectedDoctorForBooking.specialization} &bull; {selectedDoctorForBooking.department}</p>
                <p className="text-[10px] text-slate-500">Chamber: {selectedDoctorForBooking.currentRoom}</p>
              </div>
            </div>

            <form onSubmit={handleConfirmBooking} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 block">Consultation Date *</label>
                  <input
                    type="date"
                    required
                    value={appointmentDate}
                    onChange={e => setAppointmentDate(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-sky-500 focus:bg-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 block">Preferred Time Slot *</label>
                  <select
                    value={appointmentSlot}
                    onChange={e => setAppointmentSlot(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-sky-500 focus:bg-white"
                  >
                    <option value="09:30 AM">09:30 AM (Morning)</option>
                    <option value="10:30 AM">10:30 AM (Morning)</option>
                    <option value="11:45 AM">11:45 AM (Morning)</option>
                    <option value="02:30 PM">02:30 PM (Afternoon)</option>
                    <option value="04:00 PM">04:00 PM (Evening)</option>
                    <option value="05:30 PM">05:30 PM (Evening)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 block">Symptoms / Reason for Consultation</label>
                <input
                  type="text"
                  value={healthSymptoms}
                  onChange={e => setHealthSymptoms(e.target.value)}
                  placeholder="e.g. Chest discomfort, high blood pressure, routine checkup..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-sky-500 focus:bg-white"
                />
              </div>

              {/* Payment Section */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">Pay Consultation Fee Now?</span>
                    <span className="text-[11px] text-slate-500">Pay via UPI or settle later at hospital cashier desk</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={payNow}
                    onChange={e => setPayNow(e.target.checked)}
                    className="w-4 h-4 text-sky-600 rounded border-slate-300"
                  />
                </div>

                {payNow && (
                  <div className="pt-2 border-t border-slate-200 flex items-center justify-between gap-2">
                    <span className="text-xs text-slate-600 font-medium">Payment Mode:</span>
                    <div className="flex items-center gap-1.5">
                      {(['UPI', 'Cash', 'Credit/Debit Card'] as const).map(mode => (
                        <button
                          key={mode}
                          type="button"
                          onClick={() => setPaymentMethod(mode)}
                          className={`px-2.5 py-1 rounded-lg text-xs font-bold transition ${
                            paymentMethod === mode
                              ? 'bg-emerald-600 text-white'
                              : 'bg-white border border-slate-200 text-slate-600'
                          }`}
                        >
                          {mode}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between pt-2 border-t border-slate-200 font-mono text-xs">
                  <span className="text-slate-600">Total Consultation Fee:</span>
                  <span className="text-base font-bold text-slate-900">₹{selectedDoctorForBooking.consultationFee}</span>
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsBookingModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-xs transition active:scale-95"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Confirm Consultation Booking</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Digital Pass & Receipt Modal */}
      {viewPassInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-md rounded-2xl bg-white border border-slate-200 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-sky-600 text-white flex items-center justify-center font-bold text-xs">
                  <Activity className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">Official Consultation Pass</h4>
                  <p className="text-[10px] text-slate-500">{currentTenant.name}</p>
                </div>
              </div>
              <button
                onClick={() => setViewPassInvoice(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3 font-mono text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <span className="text-slate-500 font-sans">Token / Invoice:</span>
                <span className="font-bold text-sky-800">{viewPassInvoice.id}</span>
              </div>

              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <span className="text-slate-500 font-sans">Patient Name:</span>
                <span className="font-bold text-slate-900 font-sans">{viewPassInvoice.patientName}</span>
              </div>

              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <span className="text-slate-500 font-sans">Service:</span>
                <span className="font-semibold text-slate-800 font-sans text-right">{viewPassInvoice.items[0]?.description || viewPassInvoice.type}</span>
              </div>

              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <span className="text-slate-500 font-sans">Date:</span>
                <span className="text-slate-800">{viewPassInvoice.invoiceDate}</span>
              </div>

              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <span className="text-slate-500 font-sans">Status:</span>
                <span className={`font-sans font-bold px-2 py-0.5 rounded text-[10px] ${
                  viewPassInvoice.status === 'Paid' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                }`}>
                  {viewPassInvoice.status === 'Paid' ? `PAID (${viewPassInvoice.paymentMethod})` : 'PENDING AT CASHIER'}
                </span>
              </div>

              <div className="flex items-center justify-between pt-1 text-sm font-bold">
                <span className="text-slate-700 font-sans">Total Fee:</span>
                <span className="text-slate-900">₹{viewPassInvoice.totalAmount.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                onClick={() => setViewPassInvoice(null)}
                className="w-full py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs uppercase tracking-wider"
              >
                Close Pass
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="w-full bg-white border-t border-slate-200 py-4 mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <p>{currentTenant.name} &bull; License: {currentTenant.licenseNumber}</p>
          <p className="text-[11px] text-slate-400">All consultations automatically synchronized with Hospital Admin Desks</p>
        </div>
      </footer>
    </div>
  );
};
