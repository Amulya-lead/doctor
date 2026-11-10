import React, { useState } from 'react';
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
  ShieldAlert
} from 'lucide-react';
import { useHospitalOS } from '../../context/HospitalOSContext';
import { Patient } from '../../types';

export const PatientManagement: React.FC = () => {
  const { patients, addPatient, removePatient, staff, beds, currentRole, currentUser } = useHospitalOS();

  const [search, setSearch] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [careFilter, setCareFilter] = useState<'ALL' | 'MY'>('ALL');
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [selectedDossierPatient, setSelectedDossierPatient] = useState<Patient | null>(null);

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

  const filteredPatients = patients.filter(p => {
    // Care filter (All Patients vs My Queue)
    if (careFilter === 'MY' && !isAssignedToCurrentDoctor(p)) {
      return false;
    }
    // Search query
    const matchesSearch = 
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.id.toLowerCase().includes(search.toLowerCase()) ||
      p.phone.includes(search) ||
      p.assignedDoctorName.toLowerCase().includes(search.toLowerCase());
    
    // Status filter
    const matchesStatus = selectedStatus === 'ALL' || p.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

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

  const totalPatients = patients.length;
  const admittedCount = patients.filter(p => p.status === 'Admitted' || p.status === 'In Emergency').length;
  const outpatientCount = patients.filter(p => p.status === 'Outpatient').length;
  const myPatientsCount = patients.filter(isAssignedToCurrentDoctor).length;

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-sky-100 text-sky-800">
              Clinical Patients Directory & Vitals
            </span>
            {currentRole === 'doctor' && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-100 text-slate-600">
                Logged in as {currentUser.name}
              </span>
            )}
          </div>
          <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Users className="w-6 h-6 text-sky-600" />
            <span>Hospital Patients & Bedside Care</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Complete clinical directory showing bedside vitals, assigned clinicians, ward beds, and diagnostic records in one unified display.
          </p>
        </div>

        <button
          onClick={() => setIsRegisterModalOpen(true)}
          className="px-4 py-2 rounded-lg bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs flex items-center gap-2 shadow-sm transition active:scale-95"
        >
          <UserPlus className="w-4 h-4" />
          <span>+ Register New Patient</span>
        </button>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Total Patients</span>
          <p className="text-2xl font-bold text-slate-900 mt-1">{totalPatients}</p>
          <span className="text-[10px] text-slate-400">Registered in hospital</span>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
          <span className="text-[11px] font-semibold text-emerald-700 uppercase tracking-wide">Active Outpatients</span>
          <p className="text-2xl font-bold text-emerald-700 mt-1">{outpatientCount}</p>
          <span className="text-[10px] text-slate-400">OPD consultations</span>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
          <span className="text-[11px] font-semibold text-indigo-700 uppercase tracking-wide">Inpatient Admissions</span>
          <p className="text-2xl font-bold text-indigo-700 mt-1">{admittedCount}</p>
          <span className="text-[10px] text-slate-400">IPD & Emergency beds</span>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
          <span className="text-[11px] font-semibold text-sky-700 uppercase tracking-wide">
            {currentRole === 'doctor' ? 'My Care Queue' : 'Assigned to Doctors'}
          </span>
          <p className="text-2xl font-bold text-sky-700 mt-1">
            {currentRole === 'doctor' ? myPatientsCount : totalPatients}
          </p>
          <span className="text-[10px] text-slate-400">Active medical coverage</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-2 flex-1 max-w-lg">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by patient name, ID, phone, or doctor..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:bg-white transition"
            />
          </div>

          {currentRole === 'doctor' && (
            <div className="flex items-center bg-slate-100 p-1 rounded-lg text-xs font-semibold">
              <button
                onClick={() => setCareFilter('ALL')}
                className={`px-2.5 py-1 rounded-md transition ${
                  careFilter === 'ALL' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                All Patients ({totalPatients})
              </button>
              <button
                onClick={() => setCareFilter('MY')}
                className={`px-2.5 py-1 rounded-md transition ${
                  careFilter === 'MY' ? 'bg-white text-sky-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                My Care ({myPatientsCount})
              </button>
            </div>
          )}
        </div>

        {/* Status Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          {['ALL', 'Outpatient', 'Admitted', 'In Emergency', 'Consulting'].map((status) => (
            <button
              key={status}
              onClick={() => setSelectedStatus(status)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition ${
                selectedStatus === status
                  ? 'bg-slate-900 text-white font-bold'
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200'
              }`}
            >
              {status === 'ALL' ? 'All Status' : status}
            </button>
          ))}
        </div>
      </div>

      {/* ALL IN ONE UNIFIED PATIENTS DISPLAY */}
      {filteredPatients.length === 0 ? (
        <div className="p-12 rounded-xl bg-white border border-slate-200 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-sky-50 text-sky-600 flex items-center justify-center mx-auto">
            <Users className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-slate-900 text-base">No Patients Matching Query</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            {search || selectedStatus !== 'ALL'
              ? 'Try resetting the search filters or status selection above.'
              : 'Click "+ Register New Patient" to admit or register a patient.'}
          </p>
          <div className="flex items-center justify-center gap-2 pt-2">
            {(search || selectedStatus !== 'ALL' || careFilter !== 'ALL') && (
              <button
                onClick={() => { setSearch(''); setSelectedStatus('ALL'); setCareFilter('ALL'); }}
                className="px-3.5 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition"
              >
                Reset Filters
              </button>
            )}
            <button
              onClick={() => setIsRegisterModalOpen(true)}
              className="px-4 py-2 rounded-lg bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs transition shadow-sm"
            >
              + Register Patient
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredPatients.map((pt) => {
            const statusColor = 
              pt.status === 'In Emergency' ? 'bg-rose-100 text-rose-800 border-rose-200' :
              pt.status === 'Admitted' ? 'bg-indigo-100 text-indigo-800 border-indigo-200' :
              pt.status === 'Consulting' ? 'bg-amber-100 text-amber-800 border-amber-200' :
              'bg-emerald-100 text-emerald-800 border-emerald-200';

            return (
              <div
                key={pt.id}
                className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs hover:border-sky-300 transition-all flex flex-col xl:flex-row xl:items-center justify-between gap-4"
              >
                {/* 1. Patient Demographics & Identification */}
                <div className="flex items-start sm:items-center gap-3.5 min-w-[280px]">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-sky-500 to-sky-700 text-white flex items-center justify-center font-bold text-lg shadow-xs flex-shrink-0">
                    {pt.name[0]?.toUpperCase() || 'P'}
                  </div>

                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="font-bold text-base text-slate-900 capitalize">{pt.name}</h4>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${statusColor}`}>
                        {pt.status}
                      </span>
                      <span className="text-[10px] font-mono text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                        {pt.id}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-slate-500 mt-1 flex-wrap">
                      <span>{pt.gender}, {pt.age} yrs</span>
                      <span>•</span>
                      <span>Blood: <strong className="text-rose-600 font-semibold">{pt.bloodGroup}</strong></span>
                      <span>•</span>
                      <span className="flex items-center gap-1 font-mono text-slate-600">
                        <Phone className="w-3 h-3 text-slate-400" />
                        {pt.phone}
                      </span>
                    </div>
                  </div>
                </div>

                {/* 2. All-in-One Recorded Bedside Vitals Strip */}
                <div className="bg-slate-50/80 p-2.5 rounded-xl border border-slate-200 grid grid-cols-2 sm:grid-cols-4 gap-2 flex-1 max-w-xl">
                  <div className="px-2.5 py-1.5 rounded-lg bg-white border border-slate-100 flex items-center gap-2 shadow-2xs">
                    <Thermometer className="w-3.5 h-3.5 text-rose-500 flex-shrink-0" />
                    <div>
                      <span className="text-[9px] uppercase tracking-wider text-slate-400 block font-semibold">Temp</span>
                      <span className="text-xs font-bold text-slate-800 font-mono">{pt.vitals.temperature}</span>
                    </div>
                  </div>

                  <div className="px-2.5 py-1.5 rounded-lg bg-white border border-slate-100 flex items-center gap-2 shadow-2xs">
                    <Heart className="w-3.5 h-3.5 text-rose-500 flex-shrink-0" />
                    <div>
                      <span className="text-[9px] uppercase tracking-wider text-slate-400 block font-semibold">BP</span>
                      <span className="text-xs font-bold text-slate-800 font-mono">{pt.vitals.bloodPressure}</span>
                    </div>
                  </div>

                  <div className="px-2.5 py-1.5 rounded-lg bg-white border border-slate-100 flex items-center gap-2 shadow-2xs">
                    <Activity className="w-3.5 h-3.5 text-sky-500 flex-shrink-0" />
                    <div>
                      <span className="text-[9px] uppercase tracking-wider text-slate-400 block font-semibold">Pulse</span>
                      <span className="text-xs font-bold text-slate-800 font-mono">{pt.vitals.pulseRate} bpm</span>
                    </div>
                  </div>

                  <div className="px-2.5 py-1.5 rounded-lg bg-white border border-slate-100 flex items-center gap-2 shadow-2xs">
                    <Wind className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                    <div>
                      <span className="text-[9px] uppercase tracking-wider text-slate-400 block font-semibold">SpO2</span>
                      <span className="text-xs font-bold text-slate-800 font-mono">{pt.vitals.spO2}%</span>
                    </div>
                  </div>
                </div>

                {/* 3. Clinical Assignment: Doctor & Ward Bed */}
                <div className="flex flex-col sm:flex-row xl:flex-col justify-center text-xs space-y-1 min-w-[190px]">
                  <div className="flex items-center gap-1.5 text-slate-700">
                    <Stethoscope className="w-3.5 h-3.5 text-sky-600 flex-shrink-0" />
                    <span className="text-slate-500">Doctor:</span>
                    <strong className="text-slate-900 truncate">{pt.assignedDoctorName}</strong>
                  </div>

                  <div className="flex items-center gap-1.5 text-slate-700">
                    <BedDouble className="w-3.5 h-3.5 text-indigo-600 flex-shrink-0" />
                    <span className="text-slate-500">Bed:</span>
                    <span className="font-semibold text-indigo-700">{pt.assignedBed || 'None (Outpatient)'}</span>
                  </div>

                  <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                    <Clock className="w-3 h-3 text-slate-400 flex-shrink-0" />
                    <span>{pt.registrationDate}</span>
                  </div>
                </div>

                {/* 4. Actions: View Dossier & Remove */}
                <div className="flex items-center gap-2 flex-shrink-0 pt-2 xl:pt-0 border-t xl:border-t-0 border-slate-100">
                  <button
                    onClick={() => setSelectedDossierPatient(pt)}
                    className="px-3 py-1.5 rounded-lg bg-sky-50 hover:bg-sky-100 text-sky-700 text-xs font-bold flex items-center gap-1.5 transition active:scale-95 border border-sky-200"
                    title="View Full Clinical Notes & Dossier"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>Clinical Dossier</span>
                  </button>

                  <button
                    onClick={() => {
                      if (window.confirm(`Discharge / remove patient record for ${pt.name}?`)) {
                        removePatient(pt.id);
                      }
                    }}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition border border-transparent hover:border-rose-200"
                    title="Discharge / Remove Patient Record"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Patient Detailed Clinical Dossier Modal */}
      {selectedDossierPatient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="w-full max-w-2xl rounded-2xl bg-white border border-slate-200 shadow-2xl p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-sky-600 text-white flex items-center justify-center font-bold text-base">
                  {selectedDossierPatient.name[0]?.toUpperCase() || 'P'}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-slate-900 text-base">{selectedDossierPatient.name}</h3>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">
                      {selectedDossierPatient.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">
                    ID: {selectedDossierPatient.id} • {selectedDossierPatient.gender}, {selectedDossierPatient.age} yrs • Blood: {selectedDossierPatient.bloodGroup}
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedDossierPatient(null)} 
                className="text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Bedside Vitals */}
            <div>
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">
                Recorded Bedside Vitals
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] text-slate-500 flex items-center gap-1 font-semibold">
                    <Thermometer className="w-3.5 h-3.5 text-rose-500" /> Temperature
                  </span>
                  <p className="text-base font-bold text-slate-900 mt-1 font-mono">{selectedDossierPatient.vitals.temperature}</p>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] text-slate-500 flex items-center gap-1 font-semibold">
                    <Heart className="w-3.5 h-3.5 text-rose-500" /> Blood Pressure
                  </span>
                  <p className="text-base font-bold text-slate-900 mt-1 font-mono">{selectedDossierPatient.vitals.bloodPressure}</p>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] text-slate-500 flex items-center gap-1 font-semibold">
                    <Activity className="w-3.5 h-3.5 text-sky-500" /> Pulse Rate
                  </span>
                  <p className="text-base font-bold text-slate-900 mt-1 font-mono">{selectedDossierPatient.vitals.pulseRate} bpm</p>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] text-slate-500 flex items-center gap-1 font-semibold">
                    <Wind className="w-3.5 h-3.5 text-emerald-500" /> SpO2 Oxygen
                  </span>
                  <p className="text-base font-bold text-slate-900 mt-1 font-mono">{selectedDossierPatient.vitals.spO2}%</p>
                </div>
              </div>
            </div>

            {/* Clinical Assignment & Contacts */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Clinical Assignment</span>
                <p className="text-slate-800">Doctor: <strong className="text-slate-900">{selectedDossierPatient.assignedDoctorName}</strong></p>
                <p className="text-slate-800">Assigned Bed: <strong className="text-indigo-700">{selectedDossierPatient.assignedBed || 'None (Outpatient)'}</strong></p>
                {selectedDossierPatient.ward && <p className="text-slate-800">Ward: {selectedDossierPatient.ward}</p>}
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Contact & Registration</span>
                <p className="text-slate-800">Phone: <strong className="font-mono text-slate-900">{selectedDossierPatient.phone}</strong></p>
                <p className="text-slate-800">Email: {selectedDossierPatient.email}</p>
                <p className="text-slate-800">Registered: {selectedDossierPatient.registrationDate}</p>
              </div>
            </div>

            {/* ABHA & Health ID */}
            {selectedDossierPatient.abhaAddress && (
              <div className="p-3 rounded-xl bg-sky-50/70 border border-sky-100 text-xs">
                <span className="text-[10px] text-sky-800 uppercase font-bold tracking-wider">ABDM Ayushman Bharat Health Account</span>
                <p className="text-sky-950 font-mono mt-0.5">{selectedDossierPatient.abhaAddress}</p>
              </div>
            )}

            {/* Allergies & Chronic Conditions */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2">
              <div>
                <span className="font-bold text-rose-700 block mb-0.5">Known Allergies:</span>
                <p className="text-slate-700">{selectedDossierPatient.allergies.join(', ') || 'None Reported'}</p>
              </div>
              <div>
                <span className="font-bold text-slate-900 block mb-0.5">Chronic Medical Conditions:</span>
                <p className="text-slate-700">{selectedDossierPatient.chronicConditions.join(', ') || 'None'}</p>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedDossierPatient(null)}
                className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition"
              >
                Close Dossier
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Register New Patient Modal */}
      {isRegisterModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="w-full max-w-lg rounded-2xl bg-white border border-slate-200 shadow-2xl p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-sky-50 text-sky-600">
                  <UserPlus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">Register New Patient</h3>
                  <p className="text-xs text-slate-500">Enter patient demographic and admission details</p>
                </div>
              </div>
              <button onClick={() => setIsRegisterModalOpen(false)} className="text-slate-400 hover:text-slate-700 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleRegisterSubmit} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Patient Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Suresh Nair"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-sky-500 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Age *</label>
                  <input
                    type="number"
                    required
                    placeholder="35"
                    value={formData.age}
                    onChange={e => setFormData({ ...formData, age: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-sky-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Gender</label>
                  <select
                    value={formData.gender}
                    onChange={e => setFormData({ ...formData, gender: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-sky-500 focus:bg-white"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Blood Group</label>
                  <select
                    value={formData.bloodGroup}
                    onChange={e => setFormData({ ...formData, bloodGroup: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-sky-500 focus:bg-white"
                  >
                    {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => (
                      <option key={bg} value={bg}>{bg}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Phone Number</label>
                  <input
                    type="text"
                    placeholder="+91 98765 43210"
                    value={formData.phone}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-sky-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Admission Status</label>
                  <select
                    value={formData.status}
                    onChange={e => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-sky-500 focus:bg-white"
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
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Assign Doctor</label>
                  <select
                    value={formData.assignedDoctorName}
                    onChange={e => setFormData({ ...formData, assignedDoctorName: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-sky-500 focus:bg-white"
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
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Assign Bed (Optional)</label>
                  <select
                    value={formData.assignedBed}
                    onChange={e => setFormData({ ...formData, assignedBed: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-sky-500 focus:bg-white"
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
                  <label className="text-[10px] font-semibold text-slate-500 block mb-1">Temp</label>
                  <input
                    type="text"
                    value={formData.temperature}
                    onChange={e => setFormData({ ...formData, temperature: e.target.value })}
                    className="w-full px-2 py-1.5 rounded bg-slate-50 border border-slate-200 text-xs text-slate-900 font-mono"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-semibold text-slate-500 block mb-1">BP</label>
                  <input
                    type="text"
                    value={formData.bloodPressure}
                    onChange={e => setFormData({ ...formData, bloodPressure: e.target.value })}
                    className="w-full px-2 py-1.5 rounded bg-slate-50 border border-slate-200 text-xs text-slate-900 font-mono"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-semibold text-slate-500 block mb-1">Pulse</label>
                  <input
                    type="text"
                    value={formData.pulseRate}
                    onChange={e => setFormData({ ...formData, pulseRate: e.target.value })}
                    className="w-full px-2 py-1.5 rounded bg-slate-50 border border-slate-200 text-xs text-slate-900 font-mono"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-semibold text-slate-500 block mb-1">SpO2 %</label>
                  <input
                    type="text"
                    value={formData.spO2}
                    onChange={e => setFormData({ ...formData, spO2: e.target.value })}
                    className="w-full px-2 py-1.5 rounded bg-slate-50 border border-slate-200 text-xs text-slate-900 font-mono"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsRegisterModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-xs font-medium text-slate-600 hover:text-slate-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs shadow-sm transition"
                >
                  Register Patient Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
