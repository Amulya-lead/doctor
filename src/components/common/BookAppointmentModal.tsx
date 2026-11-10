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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="w-full max-w-lg rounded-2xl bg-white border border-slate-200 shadow-2xl p-6 space-y-4 max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-xl bg-sky-50 text-sky-600">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">Book Doctor Consultation</h3>
              <p className="text-xs text-slate-500">Schedules appointment and automatically generates billing invoice</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Patient Selection */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-slate-700">Patient Details *</label>
              <div className="flex items-center gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setPatientMode('existing')}
                  className={`px-2 py-0.5 rounded text-[11px] font-bold transition ${
                    patientMode === 'existing' 
                      ? 'bg-sky-100 text-sky-800' 
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Existing Patient
                </button>
                <button
                  type="button"
                  onClick={() => setPatientMode('new')}
                  className={`px-2 py-0.5 rounded text-[11px] font-bold transition ${
                    patientMode === 'new' 
                      ? 'bg-sky-100 text-sky-800' 
                      : 'text-slate-500 hover:text-slate-800'
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
                className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-sky-500 focus:bg-white"
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
                  className="px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-sky-500 focus:bg-white"
                />
                <input
                  type="text"
                  placeholder="Phone: +91 98000 00000"
                  value={newPatientPhone}
                  onChange={e => setNewPatientPhone(e.target.value)}
                  className="px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-sky-500 focus:bg-white"
                />
              </div>
            )}
          </div>

          {/* Attending Doctor */}
          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1.5">
              Select Attending Doctor & Department *
            </label>
            {doctorList.length > 0 ? (
              <select
                value={selectedDoctorId}
                onChange={e => setSelectedDoctorId(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-sky-500 focus:bg-white"
              >
                {doctorList.map(doc => (
                  <option key={doc.id} value={doc.id}>
                    {doc.name} — {doc.department} ({doc.designation})
                  </option>
                ))}
              </select>
            ) : (
              <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-xs">
                No doctors registered yet. Defaulting to Duty Medical Officer.
              </div>
            )}
          </div>

          {/* Date & Time Slot */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Appointment Date
              </label>
              <input
                type="date"
                required
                value={appointmentDate}
                onChange={e => setAppointmentDate(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-sky-500 focus:bg-white"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                OPD Time Slot
              </label>
              <select
                value={timeSlot}
                onChange={e => setTimeSlot(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-sky-500 focus:bg-white"
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
            <label className="text-xs font-semibold text-slate-700 block mb-1.5">
              Consultation Service & Standard Fee
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
                  className={`p-2.5 rounded-lg border text-left transition ${
                    consultationType === opt.type
                      ? 'bg-sky-50 border-sky-400 text-sky-900 shadow-2xs font-bold'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <p className="text-xs font-semibold truncate">{opt.type}</p>
                  <p className="text-xs font-mono text-emerald-700 font-bold mt-0.5">₹{opt.fee}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Payment & Invoice Settlement */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-900 block">Collect Payment Now?</span>
                <span className="text-[11px] text-slate-500">Mark invoice as Paid immediately or leave as Pending</span>
              </div>
              <input
                type="checkbox"
                checked={payNow}
                onChange={e => setPayNow(e.target.checked)}
                className="w-4 h-4 text-sky-600 rounded border-slate-300 focus:ring-sky-500"
              />
            </div>

            {payNow && (
              <div className="pt-2 border-t border-slate-200 flex items-center justify-between gap-3">
                <span className="text-xs text-slate-600 font-medium">Payment Mode:</span>
                <div className="flex items-center gap-1.5">
                  {(['UPI', 'Cash', 'Credit/Debit Card'] as const).map(method => (
                    <button
                      key={method}
                      type="button"
                      onClick={() => setPaymentMethod(method)}
                      className={`px-2.5 py-1 rounded text-xs font-bold transition ${
                        paymentMethod === method
                          ? 'bg-emerald-600 text-white'
                          : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      {method}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-200 font-mono">
              <span className="text-slate-600">Total Invoice Amount:</span>
              <span className="text-base font-bold text-slate-900">₹{fee.toLocaleString('en-IN')}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-lg bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs flex items-center gap-2 shadow-xs transition active:scale-95"
            >
              <FileText className="w-4 h-4" />
              <span>Confirm & Generate Invoice (₹{fee})</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

