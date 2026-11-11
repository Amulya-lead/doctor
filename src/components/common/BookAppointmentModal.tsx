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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-hospital-950/55 backdrop-blur-md p-4">
      <div className="w-full max-w-lg rounded-2xl bg-white border border-hospital-300 shadow-2xl overflow-hidden glide-enter max-h-[90vh] flex flex-col">
        <div className="h-1.5 bg-gradient-to-r from-[#1D4840] via-[#39786B] to-[#39786B]" />
        <div className="p-6 space-y-4 overflow-y-auto">
          {/* Modal Header */}
          <div className="flex items-center justify-between pb-3 border-b border-hospital-50">
            <div className="flex items-center gap-2.5">
              <div className="p-2.5 rounded-xl bg-hospital-50 text-[#39786B] border border-hospital-200">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold font-display text-hospital-950 text-base">Book Doctor Consultation</h3>
                <p className="text-xs text-hospital-800">Schedules appointment and automatically generates billing invoice</p>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="text-hospital-700 hover:text-hospital-900 p-1.5 rounded-lg hover:bg-hospital-50 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Patient Selection */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-hospital-900">Patient Details *</label>
                <div className="flex items-center gap-1.5 text-xs bg-hospital-50 p-0.5 rounded-lg border border-hospital-300">
                  <button
                    type="button"
                    onClick={() => setPatientMode('existing')}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition ${
                      patientMode === 'existing' 
                        ? 'bg-white text-[#39786B] shadow-xs' 
                        : 'text-hospital-800 hover:text-hospital-950'
                    }`}
                  >
                    Existing Patient
                  </button>
                  <button
                    type="button"
                    onClick={() => setPatientMode('new')}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition ${
                      patientMode === 'new' 
                        ? 'bg-white text-[#39786B] shadow-xs' 
                        : 'text-hospital-800 hover:text-hospital-950'
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
                  className="w-full px-3.5 py-2.5 rounded-xl bg-hospital-50 border border-hospital-300 text-xs font-medium text-hospital-950 focus:outline-none focus:border-[#39786B] focus:ring-4 focus:ring-[#39786B]/10 focus:bg-white transition"
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
                    className="px-3.5 py-2.5 rounded-xl bg-hospital-50 border border-hospital-300 text-xs font-medium text-hospital-950 focus:outline-none focus:border-[#39786B] focus:bg-white transition"
                  />
                  <input
                    type="text"
                    placeholder="Phone: +91 98000 00000"
                    value={newPatientPhone}
                    onChange={e => setNewPatientPhone(e.target.value)}
                    className="px-3.5 py-2.5 rounded-xl bg-hospital-50 border border-hospital-300 text-xs font-medium text-hospital-950 focus:outline-none focus:border-[#39786B] focus:bg-white transition"
                  />
                </div>
              )}
            </div>

            {/* Attending Doctor */}
            <div>
              <label className="text-xs font-bold text-hospital-900 block mb-1.5">
                Select Attending Doctor &amp; Department *
              </label>
              {doctorList.length > 0 ? (
                <select
                  value={selectedDoctorId}
                  onChange={e => setSelectedDoctorId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-hospital-50 border border-hospital-300 text-xs font-medium text-hospital-950 focus:outline-none focus:border-[#39786B] focus:bg-white transition"
                >
                  {doctorList.map(doc => (
                    <option key={doc.id} value={doc.id}>
                      {doc.name} — {doc.department} ({doc.designation})
                    </option>
                  ))}
                </select>
              ) : (
                <div className="p-3 rounded-xl bg-hospital-50 border border-hospital-200 text-hospital-800 text-xs font-medium">
                  No doctors registered yet. Defaulting to Duty Medical Officer.
                </div>
              )}
            </div>

            {/* Date & Time Slot */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-hospital-900 block mb-1">
                  Appointment Date
                </label>
                <input
                  type="date"
                  required
                  value={appointmentDate}
                  onChange={e => setAppointmentDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-hospital-50 border border-hospital-300 text-xs font-medium text-hospital-950 focus:outline-none focus:border-[#39786B] focus:bg-white transition"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-hospital-900 block mb-1">
                  OPD Time Slot
                </label>
                <select
                  value={timeSlot}
                  onChange={e => setTimeSlot(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-hospital-50 border border-hospital-300 text-xs font-medium text-hospital-950 focus:outline-none focus:border-[#39786B] focus:bg-white transition"
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
              <label className="text-xs font-bold text-hospital-900 block mb-1.5">
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
                        ? 'bg-hospital-50 border-[#39786B] text-[#10221F] shadow-xs font-bold'
                        : 'bg-hospital-50 border-hospital-300 text-hospital-900 hover:bg-hospital-50'
                    }`}
                  >
                    <p className="text-xs font-bold truncate">{opt.type}</p>
                    <p className="text-xs font-mono text-hospital-700 font-extrabold mt-0.5">₹{opt.fee}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Payment & Invoice Settlement */}
            <div className="p-4 rounded-xl bg-hospital-50 border border-hospital-300 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-hospital-950 block">Collect Payment Now?</span>
                  <span className="text-[11px] text-hospital-800">Mark invoice as Paid immediately or leave as Pending</span>
                </div>
                <input
                  type="checkbox"
                  checked={payNow}
                  onChange={e => setPayNow(e.target.checked)}
                  className="w-4 h-4 text-[#39786B] accent-[#39786B] rounded border-hospital-300 focus:ring-[#39786B]"
                />
              </div>

              {payNow && (
                <div className="pt-2.5 border-t border-hospital-300 flex items-center justify-between gap-3">
                  <span className="text-xs text-hospital-900 font-bold">Payment Mode:</span>
                  <div className="flex items-center gap-1.5">
                    {(['UPI', 'Cash', 'Credit/Debit Card'] as const).map(method => (
                      <button
                        key={method}
                        type="button"
                        onClick={() => setPaymentMethod(method)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold transition ${
                          paymentMethod === method
                            ? 'bg-hospital-600 text-white shadow-xs'
                            : 'bg-white border border-hospital-300 text-hospital-900 hover:bg-hospital-50'
                        }`}
                      >
                        {method}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between text-xs pt-2.5 border-t border-hospital-300 font-mono">
                <span className="text-hospital-800 font-semibold">Total Invoice Amount:</span>
                <span className="text-base font-extrabold text-hospital-950">₹{fee.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex justify-end border-t border-hospital-50">
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

