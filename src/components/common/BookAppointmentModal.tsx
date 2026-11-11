import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Clock, 
  User, 
  Stethoscope, 
  CreditCard, 
  CheckCircle2, 
  X, 
  Plus,
  Building2,
  FileText
} from 'lucide-react';
import { useHospitalOS } from '../../context/HospitalOSContext';
import { BillingInvoice } from '../../types';

interface BookAppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedDoctorId?: string;
  preselectedPatientId?: string;
  onSuccess?: (invoice: BillingInvoice) => void;
}

export const BookAppointmentModal: React.FC<BookAppointmentModalProps> = ({
  isOpen,
  onClose,
  preselectedDoctorId,
  preselectedPatientId,
  onSuccess
}) => {
  const { staff, patients, bookAppointment } = useHospitalOS();

  // Doctors list from staff
  const doctorList = staff.filter(s => s.role === 'doctor');

  // Form states
  const [patientMode, setPatientMode] = useState<'existing' | 'new'>(
    patients.length > 0 ? 'existing' : 'new'
  );
  const [selectedPatientId, setSelectedPatientId] = useState(
    preselectedPatientId || patients[0]?.id || ''
  );
  const [newPatientName, setNewPatientName] = useState('');
  const [newPatientPhone, setNewPatientPhone] = useState('');

  const [selectedDoctorId, setSelectedDoctorId] = useState(
    preselectedDoctorId || doctorList[0]?.id || ''
  );

  useEffect(() => {
    if (preselectedDoctorId) {
      setSelectedDoctorId(preselectedDoctorId);
    }
  }, [preselectedDoctorId]);

  const [appointmentDate, setAppointmentDate] = useState(
    new Date().toISOString().slice(0, 10)
  );
  const [timeSlot, setTimeSlot] = useState('10:30 AM');

  const [consultationType, setConsultationType] = useState<
    'OPD Consultation' | 'Specialist Second Opinion' | 'Follow-up Consultation' | 'Emergency / Trauma Triage'
  >('OPD Consultation');

  const [fee, setFee] = useState<number>(800);
  const [payNow, setPayNow] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<BillingInvoice['paymentMethod']>('UPI');

  if (!isOpen) return null;

  const activeDoc = doctorList.find(d => d.id === selectedDoctorId) || doctorList[0];
  const activePt = patients.find(p => p.id === selectedPatientId) || patients[0];

  const handleConsultationTypeChange = (type: any) => {
    setConsultationType(type);
    if (type === 'OPD Consultation') setFee(800);
    else if (type === 'Specialist Second Opinion') setFee(1200);
    else if (type === 'Follow-up Consultation') setFee(400);
    else if (type === 'Emergency / Trauma Triage') setFee(1500);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const patientName = patientMode === 'new' 
      ? (newPatientName.trim() || 'Walk-in Patient')
      : (activePt?.name || 'Registered Patient');

    const patientId = patientMode === 'new'
      ? `PT-${Date.now().toString().slice(-4)}`
      : (activePt?.id || `PT-${Date.now().toString().slice(-4)}`);

    const doctorName = activeDoc ? activeDoc.name : 'Duty Medical Officer';
    const department = activeDoc ? activeDoc.department : 'General Medicine';

    const generatedInvoice = bookAppointment({
      patientId,
      patientName,
      doctorId: activeDoc?.id || 'DOC-GEN',
      doctorName,
      department,
      date: appointmentDate,
      timeSlot,
      consultationType: 'OPD Consultation',
      fee,
      payNow,
      paymentMethod: payNow ? paymentMethod : 'Pending'
    });

    if (onSuccess) {
      onSuccess(generatedInvoice);
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/55 backdrop-blur-md p-4">
      <div className="w-full max-w-lg rounded-2xl bg-white border border-slate-200 shadow-2xl overflow-hidden glide-enter max-h-[90vh] flex flex-col">
        <div className="h-1.5 bg-gradient-to-r from-[#2D1B69] via-[#6D28D9] to-[#0D9488]" />
        <div className="p-6 space-y-4 overflow-y-auto">
          {/* Modal Header */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="p-2.5 rounded-xl bg-lavender-50 text-[#5B21B6] border border-lavender-200">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold font-display text-slate-900 text-base">Book Doctor Consultation</h3>
                <p className="text-xs text-slate-600">Schedules appointment and automatically generates billing invoice</p>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Patient Selection */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-slate-700">Patient Details *</label>
                <div className="flex items-center gap-1.5 text-xs bg-slate-100 p-0.5 rounded-lg border border-slate-200">
                  <button
                    type="button"
                    onClick={() => setPatientMode('existing')}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition ${
                      patientMode === 'existing' 
                        ? 'bg-white text-[#4C1D95] shadow-xs' 
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Existing Patient
                  </button>
                  <button
                    type="button"
                    onClick={() => setPatientMode('new')}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition ${
                      patientMode === 'new' 
                        ? 'bg-white text-[#4C1D95] shadow-xs' 
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    + New Patient
                  </button>
                </div>
              </div>

              {patientMode === 'existing' && patients.length > 0 ? (
                <select
                  value={selectedPatientId}
                  onChange={e => setSelectedPatientId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:border-[#5B21B6] focus:ring-4 focus:ring-[#5B21B6]/10 focus:bg-white transition"
                >
                  {patients.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.id}) — {p.gender}, {p.age}y • {p.phone}
                    </option>
                  ))}
                </select>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    required
                    placeholder="Patient Full Name"
                    value={newPatientName}
                    onChange={e => setNewPatientName(e.target.value)}
                    className="px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:border-[#5B21B6] focus:bg-white transition"
                  />
                  <input
                    type="text"
                    placeholder="Phone: +91 98000 00000"
                    value={newPatientPhone}
                    onChange={e => setNewPatientPhone(e.target.value)}
                    className="px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:border-[#5B21B6] focus:bg-white transition"
                  />
                </div>
              )}
            </div>

            {/* Attending Doctor */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1.5">
                Select Attending Doctor &amp; Department *
              </label>
              {doctorList.length > 0 ? (
                <select
                  value={selectedDoctorId}
                  onChange={e => setSelectedDoctorId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:border-[#5B21B6] focus:bg-white transition"
                >
                  {doctorList.map(doc => (
                    <option key={doc.id} value={doc.id}>
                      {doc.name} — {doc.department} ({doc.designation})
                    </option>
                  ))}
                </select>
              ) : (
                <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-medium">
                  No doctors registered yet. Defaulting to Duty Medical Officer.
                </div>
              )}
            </div>

            {/* Date & Time Slot */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Appointment Date
                </label>
                <input
                  type="date"
                  required
                  value={appointmentDate}
                  onChange={e => setAppointmentDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:border-[#5B21B6] focus:bg-white transition"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  OPD Time Slot
                </label>
                <select
                  value={timeSlot}
                  onChange={e => setTimeSlot(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:border-[#5B21B6] focus:bg-white transition"
                >
                  <option value="09:30 AM">09:30 AM (Morning)</option>
                  <option value="10:30 AM">10:30 AM (Morning)</option>
                  <option value="11:45 AM">11:45 AM (Morning)</option>
                  <option value="02:30 PM">02:30 PM (Afternoon)</option>
                  <option value="04:00 PM">04:00 PM (Evening)</option>
                  <option value="05:30 PM">05:30 PM (Evening)</option>
                  <option value="07:00 PM">07:00 PM (Night Duty)</option>
                </select>
              </div>
            </div>

            {/* Consultation Type & Fee */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1.5">
                Consultation Service &amp; Standard Fee
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { type: 'OPD Consultation', fee: 800 },
                  { type: 'Specialist Second Opinion', fee: 1200 },
                  { type: 'Follow-up Consultation', fee: 400 },
                  { type: 'Emergency / Trauma Triage', fee: 1500 }
                ].map(opt => (
                  <button
                    key={opt.type}
                    type="button"
                    onClick={() => handleConsultationTypeChange(opt.type)}
                    className={`p-3 rounded-xl border text-left transition ${
                      consultationType === opt.type
                        ? 'bg-lavender-50 border-[#5B21B6] text-[#1C103B] shadow-xs font-bold'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <p className="text-xs font-bold truncate">{opt.type}</p>
                    <p className="text-xs font-mono text-emerald-700 font-extrabold mt-0.5">₹{opt.fee}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Payment & Invoice Settlement */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-900 block">Collect Payment Now?</span>
                  <span className="text-[11px] text-slate-600">Mark invoice as Paid immediately or leave as Pending</span>
                </div>
                <input
                  type="checkbox"
                  checked={payNow}
                  onChange={e => setPayNow(e.target.checked)}
                  className="w-4 h-4 text-[#5B21B6] accent-[#5B21B6] rounded border-slate-300 focus:ring-[#5B21B6]"
                />
              </div>

              {payNow && (
                <div className="pt-2.5 border-t border-slate-200 flex items-center justify-between gap-3">
                  <span className="text-xs text-slate-700 font-bold">Payment Mode:</span>
                  <div className="flex items-center gap-1.5">
                    {(['UPI', 'Cash', 'Credit/Debit Card'] as const).map(method => (
                      <button
                        key={method}
                        type="button"
                        onClick={() => setPaymentMethod(method)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold transition ${
                          paymentMethod === method
                            ? 'bg-emerald-600 text-white shadow-xs'
                            : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        {method}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between text-xs pt-2.5 border-t border-slate-200 font-mono">
                <span className="text-slate-600 font-semibold">Total Invoice Amount:</span>
                <span className="text-base font-extrabold text-slate-900">₹{fee.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex justify-end border-t border-slate-100">
              <button
                type="submit"
                className="btn-zoho-primary px-5 py-2.5 rounded-xl text-white font-bold text-xs flex items-center gap-2 shadow-sm transition active:scale-[0.98]"
              >
                <FileText className="w-4 h-4" />
                <span>Confirm &amp; Generate Invoice (₹{fee})</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

