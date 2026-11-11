import React, { useState, useMemo } from 'react';
import { 
  Users, 
  Search, 
  Plus, 
  Heart, 
  Thermometer, 
  Wind, 
  Activity, 
  Phone, 
  UserPlus, 
  Trash2, 
  X,
  BedDouble,
  Stethoscope,
  Calendar,
  AlertCircle,
  FileText,
  Clock,
  ShieldAlert,
  CheckCircle2
} from 'lucide-react';
import { useHospitalOS } from '../../context/HospitalOSContext';
import { Patient } from '../../types';

export const PatientManagement: React.FC = () => {
  const { patients, addPatient, updatePatient, dischargePatient, removePatient, staff, beds, currentRole, currentUser } = useHospitalOS();

  const [search, setSearch] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [careFilter, setCareFilter] = useState<'ALL' | 'MY'>('ALL');
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [selectedDossierPatient, setSelectedDossierPatient] = useState<Patient | null>(null);
  const [dischargeModalPatient, setDischargeModalPatient] = useState<Patient | null>(null);
  const [dischargeSummaryText, setDischargeSummaryText] = useState('');
  const [visibleLimit, setVisibleLimit] = useState(25);

  // Doctors list from staff
  const doctorList = staff.filter(s => s.role === 'doctor');
  const availableBeds = beds.filter(b => b.status === 'Available');

  // New Patient Form State
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: 'Male',
    bloodGroup: 'B+ Positive',
    phone: '',
    email: '',
    allergies: '',
    chronicConditions: '',
    status: 'Outpatient' as Patient['status'],
    assignedDoctorName: doctorList[0]?.name || (currentUser.role === 'doctor' ? currentUser.name : 'Duty Doctor'),
    assignedBed: '',
    temperature: '98.6 °F',
    bloodPressure: '120/80 mmHg',
    pulseRate: '75',
    spO2: '99',
    abhaAddress: ''
  });

  const isAssignedToCurrentDoctor = (p: Patient) => {
    if (!currentUser || currentUser.role !== 'doctor') return true;
    const currentNameLower = currentUser.name.toLowerCase().replace(/[^a-z0-9]/g, '');
    const patientDoctorLower = (p.assignedDoctorName || '').toLowerCase().replace(/[^a-z0-9]/g, '');
    return (
      p.assignedDoctorId === currentUser.id ||
      patientDoctorLower.includes(currentNameLower) ||
      currentNameLower.includes(patientDoctorLower)
    );
  };

  const filteredPatients = useMemo(() => {
    const q = search.trim().toLowerCase();
    return patients.filter(p => {
      if (careFilter === 'MY' && !isAssignedToCurrentDoctor(p)) {
        return false;
      }
      const matchesSearch = !q ||
        p.name.toLowerCase().includes(q) ||
        p.id.toLowerCase().includes(q) ||
        p.phone.includes(search) ||
        p.assignedDoctorName.toLowerCase().includes(q);
      const matchesStatus = selectedStatus === 'ALL' || p.status === selectedStatus;
      return matchesSearch && matchesStatus;
    });
  }, [patients, careFilter, search, selectedStatus, currentUser.id, currentUser.name]);

  const visiblePatients = useMemo(
    () => filteredPatients.slice(0, visibleLimit),
    [filteredPatients, visibleLimit]
  );

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    addPatient({
      name: formData.name.trim(),
      age: parseInt(formData.age) || 30,
      gender: formData.gender as any,
      bloodGroup: formData.bloodGroup,
      phone: formData.phone || '+91 98000 12345',
      email: formData.email || `${formData.name.toLowerCase().replace(/\s+/g, '')}@gmail.com`,
      allergies: formData.allergies ? formData.allergies.split(',').map(s => s.trim()) : ['None Reported'],
      chronicConditions: formData.chronicConditions ? formData.chronicConditions.split(',').map(s => s.trim()) : ['None'],
      status: formData.status,
      assignedDoctorName: formData.assignedDoctorName,
      assignedBed: formData.assignedBed || undefined,
      abhaAddress: formData.abhaAddress || `${formData.name.toLowerCase().replace(/\s+/g, '')}@abdm`,
      vitals: {
        temperature: formData.temperature || '98.6 °F',
        bloodPressure: formData.bloodPressure || '120/80 mmHg',
        pulseRate: parseInt(formData.pulseRate) || 75,
        spO2: parseInt(formData.spO2) || 98,
        respiratoryRate: 18,
        bmi: '22.8',
        recordedAt: 'Just Now'
      }
    });

    setIsRegisterModalOpen(false);
    setFormData({
      name: '',
      age: '',
      gender: 'Male',
      bloodGroup: 'B+ Positive',
      phone: '',
      email: '',
      allergies: '',
      chronicConditions: '',
      status: 'Outpatient',
      assignedDoctorName: doctorList[0]?.name || (currentUser.role === 'doctor' ? currentUser.name : 'Duty Doctor'),
      assignedBed: '',
      temperature: '98.6 °F',
      bloodPressure: '120/80 mmHg',
      pulseRate: '75',
      spO2: '99',
      abhaAddress: ''
    });
  };

  const {
    totalPatients,
    admittedCount,
    outpatientCount,
    myPatientsCount
  } = useMemo(() => {
    let admitted = 0;
    let outpatient = 0;
    let mine = 0;
    for (const p of patients) {
      if (p.status === 'Admitted' || p.status === 'In Emergency') admitted++;
      else if (p.status === 'Outpatient') outpatient++;
      if (isAssignedToCurrentDoctor(p)) mine++;
    }
    return {
      totalPatients: patients.length,
      admittedCount: admitted,
      outpatientCount: outpatient,
      myPatientsCount: mine
    };
  }, [patients, currentUser.id, currentUser.name]);

  return (
    <div className="space-y-6">
      {/* Architectural Workspace Banner */}
      <div className="workspace-banner workspace-banner-patients p-6 sm:p-7 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-1.5">
            <span className="px-3 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-white/15 backdrop-blur-md border border-hospital-300/30 text-hospital-100">
              Clinical Patients Directory &amp; Vitals
            </span>
            {currentRole === 'doctor' && (
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-white/10 text-hospital-50 border border-white/15">
                Logged in as {currentUser.name}
              </span>
            )}
          </div>
          <h2 className="font-display text-2xl font-extrabold text-white flex items-center gap-2.5 tracking-tight">
            <Users className="w-6 h-6 text-hospital-300" />
            <span>Hospital Patients &amp; Bedside Care</span>
          </h2>
          <p className="text-xs sm:text-sm text-hospital-50 mt-0.5 max-w-2xl">
            Complete clinical directory showing bedside vitals, assigned clinicians, ward beds, and diagnostic records in one unified display.
          </p>
        </div>

        <button
          onClick={() => setIsRegisterModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-white hover:bg-hospital-50 text-[#10221F] font-bold text-xs flex items-center gap-2 shadow-lg transition active:scale-[0.98] flex-shrink-0"
        >
          <UserPlus className="w-4 h-4 text-[#39786B]" />
          <span>Register New Patient</span>
        </button>
      </div>

      {/* Colorful KPI Tiles */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="relative overflow-hidden lavish-card lavish-card-hover p-4">
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#1D4840] to-[#39786B]" />
          <span className="text-[11px] font-bold text-hospital-900 uppercase tracking-wide">Total Patients</span>
          <p className="font-display text-2xl font-extrabold text-hospital-950 mt-1">{totalPatients}</p>
          <span className="text-[11px] font-medium text-hospital-800">Registered in hospital</span>
        </div>

        <div className="relative overflow-hidden lavish-card lavish-card-hover p-4">
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-hospital-500 to-hospital-500" />
          <span className="text-[11px] font-bold text-hospital-800 uppercase tracking-wide">Active Outpatients</span>
          <p className="font-display text-2xl font-extrabold text-hospital-700 mt-1">{outpatientCount}</p>
          <span className="text-[11px] font-medium text-hospital-800">OPD consultations</span>
        </div>

        <div className="relative overflow-hidden lavish-card lavish-card-hover p-4">
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-hospital-500 to-hospital-500" />
          <span className="text-[11px] font-bold text-hospital-800 uppercase tracking-wide">Inpatient Admissions</span>
          <p className="font-display text-2xl font-extrabold text-hospital-700 mt-1">{admittedCount}</p>
          <span className="text-[11px] font-medium text-hospital-800">IPD &amp; Emergency beds</span>
        </div>

        <div className="relative overflow-hidden lavish-card lavish-card-hover p-4">
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#39786B] to-[#39786B]" />
          <span className="text-[11px] font-bold text-[#39786B] uppercase tracking-wide">
            {currentRole === 'doctor' ? 'My Care Queue' : 'Assigned to Doctors'}
          </span>
          <p className="font-display text-2xl font-extrabold text-[#39786B] mt-1">
            {currentRole === 'doctor' ? myPatientsCount : totalPatients}
          </p>
          <span className="text-[11px] font-medium text-hospital-800">Active medical coverage</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="lavish-card p-4 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 flex-1 max-w-xl">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-hospital-700 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by patient name, ID, phone, or doctor..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-hospital-50/90 border border-hospital-300 rounded-xl pl-10 pr-9 py-2.5 text-xs font-medium text-hospital-950 placeholder-hospital-500 focus:outline-none focus:border-[#39786B] focus:ring-4 focus:ring-[#39786B]/10 focus:bg-white transition"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 rounded-md text-hospital-700 hover:text-hospital-900 hover:bg-hospital-300/70 transition"
                title="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {currentRole === 'doctor' && (
            <div className="flex items-center bg-hospital-50 p-1 rounded-xl text-xs font-bold border border-hospital-300/80">
              <button
                onClick={() => setCareFilter('ALL')}
                className={`px-3 py-1.5 rounded-lg transition ${
                  careFilter === 'ALL' ? 'bg-white text-hospital-950 shadow-sm' : 'text-hospital-800 hover:text-hospital-950'
                }`}
              >
                All ({totalPatients})
              </button>
              <button
                onClick={() => setCareFilter('MY')}
                className={`px-3 py-1.5 rounded-lg transition ${
                  careFilter === 'MY' ? 'bg-white text-[#39786B] shadow-sm' : 'text-hospital-800 hover:text-hospital-950'
                }`}
              >
                My Care ({myPatientsCount})
              </button>
            </div>
          )}
        </div>

        {/* Status Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          {['ALL', 'Admitted', 'Outpatient', 'In Emergency', 'Discharged'].map((status) => (
            <button
              key={status}
              onClick={() => setSelectedStatus(status)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                selectedStatus === status
                  ? 'btn-zoho-primary text-white shadow-sm'
                  : 'bg-hospital-50 hover:bg-hospital-50 text-hospital-900 border border-hospital-300'
              }`}
            >
              {status === 'ALL' ? 'All Status' : status}
            </button>
          ))}
        </div>
      </div>

      {/* ALL IN ONE UNIFIED PATIENTS DISPLAY */}
      {filteredPatients.length === 0 ? (
        <div className="lavish-card p-12 rounded-2xl text-center space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-hospital-50 text-[#39786B] border border-hospital-200 flex items-center justify-center mx-auto">
            <Users className="w-7 h-7" />
          </div>
          <h3 className="font-extrabold font-display text-hospital-950 text-lg">No Patients Matching Query</h3>
          <p className="text-xs text-hospital-800 max-w-sm mx-auto leading-relaxed">
            {search || selectedStatus !== 'ALL'
              ? 'Try resetting the search filters or status selection above.'
              : 'Click "+ Register New Patient" to admit or register a patient.'}
          </p>
          <div className="flex items-center justify-center gap-2.5 pt-2">
            {(search || selectedStatus !== 'ALL' || careFilter !== 'ALL') && (
              <button
                onClick={() => { setSearch(''); setSelectedStatus('ALL'); setCareFilter('ALL'); }}
                className="px-4 py-2 rounded-xl bg-hospital-50 hover:bg-hospital-300 text-hospital-900 font-bold text-xs transition"
              >
                Reset Filters
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-3.5">
          {visiblePatients.map((pt) => {
            const statusColor = 
              pt.status === 'In Emergency' ? 'bg-hospital-50 text-hospital-700 border-hospital-200' :
              pt.status === 'Admitted' ? 'bg-hospital-50 text-hospital-700 border-hospital-200' :
              pt.status === 'Consulting' ? 'bg-hospital-50 text-hospital-800 border-hospital-200' :
              pt.status === 'Discharged' ? 'bg-hospital-50 text-hospital-900 border-hospital-300' :
              'bg-hospital-50 text-hospital-700 border-hospital-200';

            const initials = pt.name
              .split(/\s+/)
              .filter(Boolean)
              .slice(0, 2)
              .map(part => part[0]?.toUpperCase() || '')
              .join('') || 'PT';

            const lowOxygen = Number(pt.vitals.spO2) > 0 && Number(pt.vitals.spO2) < 94;

            return (
              <div
                key={pt.id}
                className="p-5 lavish-card lavish-card-hover stagger-item flex flex-col xl:flex-row xl:items-center justify-between gap-4"
              >
                {/* 1. Patient Demographics & Identification */}
                <div className="flex items-start sm:items-center gap-3.5 min-w-[270px]">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#1D4840] to-[#39786B] text-white flex items-center justify-center font-display font-extrabold text-sm shadow-sm flex-shrink-0">
                    {initials}
                  </div>

                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="font-extrabold font-display text-base text-hospital-950 capitalize">{pt.name}</h4>
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${statusColor}`}>
                        {pt.status}
                      </span>
                      <span className="text-[10px] font-mono font-semibold text-hospital-800 bg-hospital-50 px-2 py-0.5 rounded-md border border-hospital-300/80">
                        {pt.id}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-hospital-800 mt-1 flex-wrap font-medium">
                      <span>{pt.gender}, {pt.age} yrs</span>
                      <span className="text-hospital-200">•</span>
                      <span>Blood: <strong className="text-hospital-700 font-bold">{pt.bloodGroup}</strong></span>
                      <span className="text-hospital-200">•</span>
                      <span className="flex items-center gap-1 font-mono text-hospital-900">
                        <Phone className="w-3 h-3 text-[#39786B]" />
                        {pt.phone}
                      </span>
                    </div>
                  </div>
                </div>

                {/* 2. All-in-One Recorded Bedside Vitals Strip */}
                <div className="bg-gradient-to-br from-hospital-50 to-hospital-50/40 p-2.5 rounded-2xl border border-hospital-300/80 grid grid-cols-2 sm:grid-cols-4 gap-2 flex-1 max-w-xl">
                  <div className="px-2.5 py-2 rounded-xl bg-white border border-hospital-300/70 flex items-center gap-2 shadow-sm">
                    <Thermometer className="w-3.5 h-3.5 text-hospital-500 flex-shrink-0" />
                    <div>
                      <span className="text-[9px] uppercase tracking-wider text-hospital-700 block font-bold">Temp</span>
                      <span className="text-xs font-extrabold text-hospital-950 font-mono">{pt.vitals.temperature}</span>
                    </div>
                  </div>

                  <div className="px-2.5 py-2 rounded-xl bg-white border border-hospital-300/70 flex items-center gap-2 shadow-sm">
                    <Heart className="w-3.5 h-3.5 text-hospital-500 flex-shrink-0" />
                    <div>
                      <span className="text-[9px] uppercase tracking-wider text-hospital-700 block font-bold">BP</span>
                      <span className="text-xs font-extrabold text-hospital-950 font-mono">{pt.vitals.bloodPressure}</span>
                    </div>
                  </div>

                  <div className="px-2.5 py-2 rounded-xl bg-white border border-hospital-300/70 flex items-center gap-2 shadow-sm">
                    <Activity className="w-3.5 h-3.5 text-[#39786B] flex-shrink-0" />
                    <div>
                      <span className="text-[9px] uppercase tracking-wider text-hospital-700 block font-bold">Pulse</span>
                      <span className="text-xs font-extrabold text-hospital-950 font-mono">{pt.vitals.pulseRate} bpm</span>
                    </div>
                  </div>

                  <div className={`px-2.5 py-2 rounded-xl border flex items-center gap-2 shadow-sm ${
                    lowOxygen ? 'bg-hospital-50 border-hospital-300' : 'bg-white border-hospital-300/70'
                  }`}>
                    <Wind className={`w-3.5 h-3.5 flex-shrink-0 ${lowOxygen ? 'text-hospital-600' : 'text-hospital-600'}`} />
                    <div>
                      <span className="text-[9px] uppercase tracking-wider text-hospital-700 block font-bold">SpO2</span>
                      <span className={`text-xs font-extrabold font-mono ${lowOxygen ? 'text-hospital-700' : 'text-hospital-950'}`}>{pt.vitals.spO2}%</span>
                    </div>
                  </div>
                </div>

                {/* 3. Clinical Assignment: Doctor & Ward Bed */}
                <div className="flex flex-col sm:flex-row xl:flex-col justify-center text-xs space-y-1 min-w-[190px]">
                  <div className="flex items-center gap-1.5 text-hospital-900">
                    <Stethoscope className="w-3.5 h-3.5 text-[#39786B] flex-shrink-0" />
                    <span className="text-hospital-800">Doctor:</span>
                    <strong className="text-hospital-950 truncate">{pt.assignedDoctorName}</strong>
                  </div>

                  <div className="flex items-center gap-1.5 text-hospital-900">
                    <BedDouble className="w-3.5 h-3.5 text-hospital-600 flex-shrink-0" />
                    <span className="text-hospital-800">Bed:</span>
                    <span className="font-bold text-hospital-700">{pt.assignedBed || 'None (Outpatient)'}</span>
                  </div>

                  <div className="flex items-center gap-1.5 text-[11px] text-hospital-800 font-mono">
                    <Clock className="w-3 h-3 text-hospital-700 flex-shrink-0" />
                    <span>{pt.registrationDate}</span>
                  </div>
                </div>

                {/* 4. Actions: View Dossier & Discharge / Re-Admit */}
                <div className="flex items-center gap-2 flex-shrink-0 pt-2 xl:pt-0 border-t xl:border-t-0 border-hospital-50">
                  <button
                    onClick={() => setSelectedDossierPatient(pt)}
                    className="btn-zoho-primary px-3.5 py-2 rounded-xl text-white text-xs font-bold flex items-center gap-1.5 shadow-sm"
                    title="View Full Clinical Notes & Dossier"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>Clinical Dossier</span>
                  </button>

                  {/* If Inpatient / Admitted -> Provide 1-click Discharge button (frees bed, preserves records) */}
                  {(pt.status === 'Admitted' || pt.status === 'In Emergency') && (
                    <button
                      onClick={() => {
                        setDischargeModalPatient(pt);
                        setDischargeSummaryText(`Patient ${pt.name} clinically recovered and stable. Discharged on ${new Date().toISOString().slice(0, 10)}. Inpatient records archived.`);
                      }}
                      className="px-3 py-2 rounded-xl bg-hospital-50 hover:bg-hospital-100 text-hospital-800 text-xs font-bold flex items-center gap-1 transition active:scale-95 border border-hospital-200"
                      title="Discharge patient: bed released, full medical records permanently preserved"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-hospital-600" />
                      <span>Discharge</span>
                    </button>
                  )}

                  {/* If Discharged -> Provide Re-Admit option */}
                  {pt.status === 'Discharged' && (
                    <button
                      onClick={() => {
                        updatePatient(pt.id, { status: 'Admitted' });
                      }}
                      className="px-3 py-2 rounded-xl bg-hospital-50 hover:bg-hospital-300 text-hospital-900 text-xs font-bold transition border border-hospital-300"
                      title="Re-Admit patient for clinical follow-up"
                    >
                      <span>Re-Admit</span>
                    </button>
                  )}

                  <button
                    onClick={() => {
                      if (window.confirm(`Permanently purge test record for ${pt.name}? Note: For discharged patients, use "Discharge" to keep full history.`)) {
                        removePatient(pt.id);
                      }
                    }}
                    className="p-2 rounded-xl text-hospital-700 hover:text-hospital-600 hover:bg-hospital-50 transition border border-transparent hover:border-hospital-200"
                    title="Purge Test Record"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}

          {filteredPatients.length > visiblePatients.length && (
            <div className="flex justify-center pt-2">
              <button
                onClick={() => setVisibleLimit(v => v + 25)}
                className="px-6 py-2.5 rounded-xl bg-white hover:bg-hospital-50 border border-hospital-300 text-xs font-bold text-hospital-900 shadow-sm transition active:scale-95"
              >
                Show More Patients ({filteredPatients.length - visiblePatients.length} remaining)
              </button>
            </div>
          )}
        </div>
      )}

      {/* Patient Detailed Clinical Dossier Modal */}
      {selectedDossierPatient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-hospital-950/55 backdrop-blur-md p-4">
          <div className="w-full max-w-2xl rounded-2xl bg-white border border-hospital-300 shadow-2xl overflow-hidden glide-enter max-h-[90vh] flex flex-col">
            <div className="h-1.5 bg-gradient-to-r from-[#1D4840] via-[#39786B] to-[#39786B]" />
            <div className="p-6 space-y-4 overflow-y-auto">
              <div className="flex items-center justify-between pb-3.5 border-b border-hospital-50">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#1D4840] to-[#39786B] text-white flex items-center justify-center font-display font-extrabold text-sm shadow-sm">
                    {selectedDossierPatient.name.split(/\s+/).filter(Boolean).slice(0, 2).map(p => p[0]?.toUpperCase() || '').join('') || 'PT'}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-extrabold font-display text-hospital-950 text-lg">{selectedDossierPatient.name}</h3>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-hospital-50 text-[#39786B] border border-hospital-200">
                        {selectedDossierPatient.status}
                      </span>
                    </div>
                    <p className="text-xs text-hospital-800 mt-0.5 font-medium">
                      ID: <span className="font-mono font-bold text-hospital-900">{selectedDossierPatient.id}</span> • {selectedDossierPatient.gender}, {selectedDossierPatient.age} yrs • Blood: <strong className="text-hospital-700">{selectedDossierPatient.bloodGroup}</strong>
                    </p>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedDossierPatient(null)} 
                  className="text-hospital-700 hover:text-hospital-900 p-1.5 rounded-xl hover:bg-hospital-50 transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Bedside Vitals */}
              <div>
                <span className="text-xs font-extrabold font-display text-hospital-900 uppercase tracking-wider block mb-2.5">
                  Recorded Bedside Vitals
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3.5 rounded-xl bg-hospital-50 border border-hospital-300">
                    <span className="text-[10px] text-hospital-800 flex items-center gap-1 font-bold uppercase">
                      <Thermometer className="w-3.5 h-3.5 text-hospital-500" /> Temperature
                    </span>
                    <p className="text-base font-extrabold text-hospital-950 mt-1 font-mono">{selectedDossierPatient.vitals.temperature}</p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-hospital-50 border border-hospital-300">
                    <span className="text-[10px] text-hospital-800 flex items-center gap-1 font-bold uppercase">
                      <Heart className="w-3.5 h-3.5 text-hospital-500" /> Blood Pressure
                    </span>
                    <p className="text-base font-extrabold text-hospital-950 mt-1 font-mono">{selectedDossierPatient.vitals.bloodPressure}</p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-hospital-50 border border-hospital-300">
                    <span className="text-[10px] text-hospital-800 flex items-center gap-1 font-bold uppercase">
                      <Activity className="w-3.5 h-3.5 text-[#39786B]" /> Pulse Rate
                    </span>
                    <p className="text-base font-extrabold text-hospital-950 mt-1 font-mono">{selectedDossierPatient.vitals.pulseRate} bpm</p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-hospital-50 border border-hospital-300">
                    <span className="text-[10px] text-hospital-800 flex items-center gap-1 font-bold uppercase">
                      <Wind className="w-3.5 h-3.5 text-hospital-600" /> SpO2 Oxygen
                    </span>
                    <p className="text-base font-extrabold text-hospital-950 mt-1 font-mono">{selectedDossierPatient.vitals.spO2}%</p>
                  </div>
                </div>
              </div>

              {/* Clinical Assignment & Contacts */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 rounded-xl bg-hospital-50 border border-hospital-300 space-y-1.5">
                  <span className="text-[10px] text-hospital-800 uppercase font-extrabold tracking-wider">Clinical Assignment</span>
                  <p className="text-hospital-900">Doctor: <strong className="text-hospital-950">{selectedDossierPatient.assignedDoctorName}</strong></p>
                  <p className="text-hospital-900">Assigned Bed: <strong className="text-hospital-700">{selectedDossierPatient.assignedBed || 'None (Outpatient)'}</strong></p>
                  {selectedDossierPatient.ward && <p className="text-hospital-900">Ward: <strong>{selectedDossierPatient.ward}</strong></p>}
                </div>

                <div className="p-3.5 rounded-xl bg-hospital-50 border border-hospital-300 space-y-1.5">
                  <span className="text-[10px] text-hospital-800 uppercase font-extrabold tracking-wider">Contact & Registration</span>
                  <p className="text-hospital-900">Phone: <strong className="font-mono text-hospital-950">{selectedDossierPatient.phone}</strong></p>
                  <p className="text-hospital-900">Email: <strong>{selectedDossierPatient.email}</strong></p>
                  <p className="text-hospital-900">Registered: <strong className="font-mono">{selectedDossierPatient.registrationDate}</strong></p>
                </div>
              </div>

              {/* Quick Care Status Transition */}
              <div className="p-3.5 rounded-xl bg-hospital-50/50 border border-hospital-200/80 flex flex-wrap items-center justify-between gap-2 text-xs">
                <span className="font-bold text-hospital-950 uppercase tracking-wider text-[10px]">Quick Care Stage Switch</span>
                <div className="flex flex-wrap items-center gap-1.5">
                  {(['Outpatient', 'Consulting', 'Admitted', 'In Emergency'] as const).map(st => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => {
                        updatePatient(selectedDossierPatient.id, { status: st });
                        setSelectedDossierPatient({ ...selectedDossierPatient, status: st });
                      }}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition border ${
                        selectedDossierPatient.status === st
                          ? 'btn-zoho-primary text-white border-transparent shadow-xs'
                          : 'bg-white text-hospital-900 border-hospital-300 hover:border-hospital-300'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              {/* ABHA & Health ID */}
              {selectedDossierPatient.abhaAddress && (
                <div className="p-3.5 rounded-xl bg-hospital-50/85 border border-hospital-200 text-xs">
                  <span className="text-[10px] text-[#1D4840] uppercase font-extrabold tracking-wider">Digital Health ID</span>
                  <p className="text-[#10221F] font-mono font-semibold mt-0.5">{selectedDossierPatient.abhaAddress}</p>
                </div>
              )}

              {/* Allergies & Chronic Conditions */}
              <div className="p-3.5 rounded-xl bg-hospital-50 border border-hospital-300 text-xs space-y-2">
                <div>
                  <span className="font-bold text-hospital-700 block mb-0.5">Known Allergies:</span>
                  <p className="text-hospital-900 font-medium">{selectedDossierPatient.allergies.join(', ') || 'None Reported'}</p>
                </div>
                <div>
                  <span className="font-bold text-hospital-950 block mb-0.5">Chronic Medical Conditions:</span>
                  <p className="text-hospital-900 font-medium">{selectedDossierPatient.chronicConditions.join(', ') || 'None'}</p>
                </div>
              </div>

              {/* If Discharged -> Display Discharge Summary Protocol */}
              {selectedDossierPatient.status === 'Discharged' && (
                <div className="p-4 rounded-xl bg-hospital-50/70 border border-hospital-200 text-xs space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase font-extrabold text-hospital-900 tracking-wider flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-hospital-600" />
                      <span>Discharge Protocol & Medical Summary</span>
                    </span>
                    <span className="text-[11px] font-mono font-bold text-hospital-800">
                      Discharged: {selectedDossierPatient.dischargeDate || 'Recorded'}
                    </span>
                  </div>
                  <p className="text-hospital-900 leading-relaxed font-medium mt-1">
                    {selectedDossierPatient.dischargeSummary || 'Patient clinically stable. Discharged with home medication advice and 7-day OPD follow-up.'}
                  </p>
                </div>
              )}

              <div className="pt-2 flex justify-end border-t border-hospital-50">
                <button
                  type="button"
                  onClick={() => setSelectedDossierPatient(null)}
                  className="px-5 py-2 rounded-xl bg-hospital-50 hover:bg-hospital-300 text-hospital-900 text-xs font-bold transition"
                >
                  Close Dossier
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Discharge Patient Modal */}
      {dischargeModalPatient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-hospital-950/55 backdrop-blur-md p-4">
          <div className="w-full max-w-md rounded-2xl bg-white border border-hospital-300 shadow-2xl overflow-hidden glide-enter">
            <div className="h-1.5 bg-gradient-to-r from-hospital-500 to-hospital-500" />
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-hospital-50">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-hospital-50 text-hospital-600 border border-hospital-200 flex items-center justify-center">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-extrabold font-display text-hospital-950 text-sm">Discharge Inpatient</h3>
                    <p className="text-[11px] text-hospital-800 font-medium">{dischargeModalPatient.name} ({dischargeModalPatient.id})</p>
                  </div>
                </div>
                <button onClick={() => setDischargeModalPatient(null)} className="text-hospital-700 hover:text-hospital-900 p-1 rounded-lg hover:bg-hospital-50">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-3.5 rounded-xl bg-hospital-50/60 border border-hospital-200 text-xs text-hospital-900 space-y-1">
                <p>✓ Patient's bed (<strong>{dischargeModalPatient.assignedBed || 'Ward'}</strong>) will be released and marked for sanitization.</p>
                <p>✓ All medical records, bedside vitals, diagnoses, and invoices will be <strong>permanently stored &amp; archived</strong>.</p>
              </div>

              <div>
                <label className="text-xs font-bold text-hospital-900 block mb-1.5">Clinical Discharge Summary &amp; Advice</label>
                <textarea
                  rows={3}
                  value={dischargeSummaryText}
                  onChange={(e) => setDischargeSummaryText(e.target.value)}
                  className="w-full p-3 rounded-xl bg-hospital-50 border border-hospital-300 text-xs text-hospital-950 focus:outline-none focus:border-hospital-500 focus:ring-4 focus:ring-hospital-500/10 focus:bg-white transition"
                  placeholder="Enter clinical notes, home prescription advice, follow-up schedule..."
                />
              </div>

              <div className="flex justify-end pt-2 border-t border-hospital-50">
                <button
                  type="button"
                  onClick={() => {
                    dischargePatient(dischargeModalPatient.id, dischargeSummaryText);
                    setDischargeModalPatient(null);
                  }}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-hospital-600 to-hospital-600 hover:brightness-105 text-white font-bold text-xs shadow-sm transition"
                >
                  Confirm Discharge &amp; Retain Records
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Register New Patient Modal */}
      {isRegisterModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-hospital-950/55 backdrop-blur-md p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white border border-hospital-300 shadow-2xl overflow-hidden glide-enter max-h-[90vh] flex flex-col">
            <div className="h-1.5 bg-gradient-to-r from-[#1D4840] via-[#39786B] to-[#39786B]" />
            <div className="p-6 space-y-4 overflow-y-auto">
              <div className="flex items-center justify-between pb-3 border-b border-hospital-50">
                <div className="flex items-center gap-2.5">
                  <div className="p-2.5 rounded-xl bg-hospital-50 text-[#39786B] border border-hospital-200">
                    <UserPlus className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-extrabold font-display text-hospital-950 text-base">Register New Patient</h3>
                    <p className="text-xs text-hospital-800">Enter patient demographic and admission details</p>
                  </div>
                </div>
                <button onClick={() => setIsRegisterModalOpen(false)} className="text-hospital-700 hover:text-hospital-900 p-1.5 rounded-lg hover:bg-hospital-50">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleRegisterSubmit} className="space-y-3">
                <div>
                  <label className="text-xs font-bold text-hospital-900 block mb-1">Patient Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Suresh Nair"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-hospital-50 border border-hospital-300 text-xs font-medium text-hospital-950 focus:outline-none focus:border-[#39786B] focus:ring-4 focus:ring-[#39786B]/10 focus:bg-white transition"
                  />
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="text-xs font-bold text-hospital-900 block mb-1">Age *</label>
                    <input
                      type="number"
                      required
                      placeholder="35"
                      value={formData.age}
                      onChange={e => setFormData({ ...formData, age: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-hospital-50 border border-hospital-300 text-xs font-medium text-hospital-950 focus:outline-none focus:border-[#39786B] focus:bg-white transition"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-hospital-900 block mb-1">Gender</label>
                    <select
                      value={formData.gender}
                      onChange={e => setFormData({ ...formData, gender: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-hospital-50 border border-hospital-300 text-xs font-medium text-hospital-950 focus:outline-none focus:border-[#39786B] focus:bg-white transition"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-hospital-900 block mb-1">Blood Group</label>
                    <select
                      value={formData.bloodGroup}
                      onChange={e => setFormData({ ...formData, bloodGroup: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-hospital-50 border border-hospital-300 text-xs font-medium text-hospital-950 focus:outline-none focus:border-[#39786B] focus:bg-white transition"
                    >
                      {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => (
                        <option key={bg} value={bg}>{bg}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-hospital-900 block mb-1">Phone Number</label>
                    <input
                      type="text"
                      placeholder="+91 98765 43210"
                      value={formData.phone}
                      onChange={e => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-hospital-50 border border-hospital-300 text-xs font-medium text-hospital-950 focus:outline-none focus:border-[#39786B] focus:bg-white transition"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-hospital-900 block mb-1">Admission Status</label>
                    <select
                      value={formData.status}
                      onChange={e => setFormData({ ...formData, status: e.target.value as any })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-hospital-50 border border-hospital-300 text-xs font-medium text-hospital-950 focus:outline-none focus:border-[#39786B] focus:bg-white transition"
                    >
                      <option value="Outpatient">Outpatient (OPD)</option>
                      <option value="Admitted">Admitted (IPD)</option>
                      <option value="In Emergency">In Emergency</option>
                      <option value="Consulting">Consulting</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-hospital-900 block mb-1">Assign Doctor</label>
                    <select
                      value={formData.assignedDoctorName}
                      onChange={e => setFormData({ ...formData, assignedDoctorName: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-hospital-50 border border-hospital-300 text-xs font-medium text-hospital-950 focus:outline-none focus:border-[#39786B] focus:bg-white transition"
                    >
                      {doctorList.length > 0 ? (
                        doctorList.map(d => (
                          <option key={d.id} value={d.name}>{d.name} ({d.department})</option>
                        ))
                      ) : (
                        <option value="Duty Doctor">Duty Doctor (Add doctor in Staff Portal)</option>
                      )}
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-hospital-900 block mb-1">Assign Bed (Optional)</label>
                    <select
                      value={formData.assignedBed}
                      onChange={e => setFormData({ ...formData, assignedBed: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-hospital-50 border border-hospital-300 text-xs font-medium text-hospital-950 focus:outline-none focus:border-[#39786B] focus:bg-white transition"
                    >
                      <option value="">None / Outpatient</option>
                      {availableBeds.map(b => (
                        <option key={b.id} value={b.bedNumber}>{b.bedNumber} ({b.wardType})</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-2 pt-1">
                  <div>
                    <label className="text-[10px] font-bold text-hospital-800 block mb-1 uppercase">Temp</label>
                    <input
                      type="text"
                      value={formData.temperature}
                      onChange={e => setFormData({ ...formData, temperature: e.target.value })}
                      className="w-full px-2.5 py-2 rounded-xl bg-hospital-50 border border-hospital-300 text-xs text-hospital-950 font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-hospital-800 block mb-1 uppercase">BP</label>
                    <input
                      type="text"
                      value={formData.bloodPressure}
                      onChange={e => setFormData({ ...formData, bloodPressure: e.target.value })}
                      className="w-full px-2.5 py-2 rounded-xl bg-hospital-50 border border-hospital-300 text-xs text-hospital-950 font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-hospital-800 block mb-1 uppercase">Pulse</label>
                    <input
                      type="text"
                      value={formData.pulseRate}
                      onChange={e => setFormData({ ...formData, pulseRate: e.target.value })}
                      className="w-full px-2.5 py-2 rounded-xl bg-hospital-50 border border-hospital-300 text-xs text-hospital-950 font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-hospital-800 block mb-1 uppercase">SpO2 %</label>
                    <input
                      type="text"
                      value={formData.spO2}
                      onChange={e => setFormData({ ...formData, spO2: e.target.value })}
                      className="w-full px-2.5 py-2 rounded-xl bg-hospital-50 border border-hospital-300 text-xs text-hospital-950 font-mono"
                    />
                  </div>
                </div>

                <div className="pt-3 flex justify-end border-t border-hospital-50">
                  <button
                    type="submit"
                    className="btn-zoho-primary px-5 py-2.5 rounded-xl text-white font-bold text-xs shadow-sm transition"
                  >
                    Register Patient Record
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
