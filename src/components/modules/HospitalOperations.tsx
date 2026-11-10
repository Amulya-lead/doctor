import React, { useState } from 'react';
import { 
  BedDouble, 
  Plus, 
  Wind, 
  Activity, 
  Trash2, 
  CheckCircle2, 
  AlertCircle, 
  X,
  UserCheck
} from 'lucide-react';
import { useHospitalOS } from '../../context/HospitalOSContext';
import { Bed } from '../../types';
import { STANDARD_WARDS } from '../../data/mockData';

export const HospitalOperations: React.FC = () => {
  const { beds, addBed, removeBed, updateBedStatus, patients } = useHospitalOS();

  const [selectedWardFilter, setSelectedWardFilter] = useState<string>('ALL');
  const [isAddBedModalOpen, setIsAddBedModalOpen] = useState(false);
  const [assignBedModal, setAssignBedModal] = useState<Bed | null>(null);
  const [selectedPatientForBed, setSelectedPatientForBed] = useState('');

  // Form for New Bed
  const [bedForm, setBedForm] = useState({
    bedNumber: '',
    wardType: 'ICU (Intensive Care Unit)',
    floor: 'Floor 1',
    dailyRate: '2500',
    oxygenEquipped: true,
    ventilatorEquipped: false
  });

  const filteredBeds = beds.filter(b => {
    return selectedWardFilter === 'ALL' || b.wardType.includes(selectedWardFilter) || b.wardType === selectedWardFilter;
  });

  const availableCount = beds.filter(b => b.status === 'Available').length;
  const occupiedCount = beds.filter(b => b.status === 'Occupied').length;
  const cleaningCount = beds.filter(b => b.status === 'Cleaning' || b.status === 'Maintenance').length;
  const occupancyRate = beds.length > 0 ? Math.round((occupiedCount / beds.length) * 100) : 0;

  const handleAddBedSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bedForm.bedNumber.trim()) return;

    addBed({
      bedNumber: bedForm.bedNumber.trim(),
      wardType: bedForm.wardType as any,
      floor: bedForm.floor,
      dailyRate: parseFloat(bedForm.dailyRate) || 1500,
      oxygenEquipped: bedForm.oxygenEquipped,
      ventilatorEquipped: bedForm.ventilatorEquipped,
      status: 'Available'
    });

    setBedForm({
      bedNumber: '',
      wardType: 'ICU (Intensive Care Unit)',
      floor: 'Floor 1',
      dailyRate: '2500',
      oxygenEquipped: true,
      ventilatorEquipped: false
    });
    setIsAddBedModalOpen(false);
  };

  const handleAssignPatientSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!assignBedModal || !selectedPatientForBed.trim()) return;

    updateBedStatus(assignBedModal.id, 'Occupied', `PT-${Date.now().toString().slice(-4)}`, selectedPatientForBed.trim());
    setAssignBedModal(null);
    setSelectedPatientForBed('');
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <BedDouble className="w-6 h-6 text-sky-600" />
            <span>Hospital Bed Allocation & Ward Matrix</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Add beds, name and number your hospital wards, allocate patients, and manage occupancy.
          </p>
        </div>

        <button
          onClick={() => setIsAddBedModalOpen(true)}
          className="px-4 py-2 rounded-lg bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs flex items-center gap-2 shadow-sm transition"
        >
          <Plus className="w-4 h-4" />
          <span>+ Add New Bed</span>
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
          <span className="text-xs font-medium text-slate-500 block">Total Hospital Beds</span>
          <span className="text-2xl font-bold text-slate-900 font-mono mt-1 block">{beds.length}</span>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
          <span className="text-xs font-medium text-slate-500 block">Available Beds</span>
          <span className="text-2xl font-bold text-emerald-600 font-mono mt-1 block">{availableCount}</span>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
          <span className="text-xs font-medium text-slate-500 block">Occupied Beds</span>
          <span className="text-2xl font-bold text-rose-600 font-mono mt-1 block">{occupiedCount}</span>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
          <span className="text-xs font-medium text-slate-500 block">Bed Occupancy Rate</span>
          <span className="text-2xl font-bold text-sky-600 font-mono mt-1 block">{occupancyRate}%</span>
        </div>
      </div>

      {/* Ward Filters */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
        {['ALL', 'ICU', 'Emergency', 'General', 'Deluxe', 'Pediatric', 'Maternity'].map(ward => (
          <button
            key={ward}
            onClick={() => setSelectedWardFilter(ward)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition ${
              selectedWardFilter === ward
                ? 'bg-sky-600 text-white font-bold'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            {ward === 'ALL' ? 'All Wards' : ward}
          </button>
        ))}
      </div>

      {/* Bed Matrix Grid */}
      {filteredBeds.length === 0 ? (
        <div className="p-12 rounded-xl bg-white border border-slate-200 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-sky-50 text-sky-600 flex items-center justify-center mx-auto">
            <BedDouble className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-slate-900 text-base">No Beds Added Yet</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Click "+ Add New Bed" to name and create beds for ICU, General Ward, Emergency, or Private Rooms.
          </p>
          <button
            onClick={() => setIsAddBedModalOpen(true)}
            className="px-4 py-2 rounded-lg bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs inline-flex items-center gap-1.5 shadow-sm transition"
          >
            <Plus className="w-4 h-4" />
            <span>+ Add First Bed</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredBeds.map(bed => {
            const isOccupied = bed.status === 'Occupied';
            const isAvailable = bed.status === 'Available';
            const isCleaning = bed.status === 'Cleaning' || bed.status === 'Maintenance';

            return (
              <div
                key={bed.id}
                className={`p-4 rounded-xl border transition flex flex-col justify-between bg-white shadow-xs ${
                  isOccupied 
                    ? 'border-rose-200 hover:border-rose-300' 
                    : isAvailable 
                    ? 'border-emerald-200 hover:border-emerald-300' 
                    : 'border-amber-200 hover:border-amber-300'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-bold text-base text-slate-900">{bed.bedNumber}</span>
                      <p className="text-[11px] text-slate-500">{bed.wardType} • {bed.floor}</p>
                    </div>

                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      isOccupied 
                        ? 'bg-rose-100 text-rose-800' 
                        : isAvailable 
                        ? 'bg-emerald-100 text-emerald-800' 
                        : 'bg-amber-100 text-amber-800'
                    }`}>
                      {bed.status}
                    </span>
                  </div>

                  <div className="mt-3 p-2.5 rounded-lg bg-slate-50 border border-slate-100 space-y-1">
                    {isOccupied ? (
                      <div>
                        <p className="text-[10px] text-slate-500 uppercase font-semibold">Admitted Patient</p>
                        <p className="font-bold text-xs text-slate-900">{bed.patientName || 'Patient Admitted'}</p>
                      </div>
                    ) : (
                      <div>
                        <p className="text-[10px] text-slate-500 uppercase font-semibold">Ready for Admission</p>
                        <p className="text-xs text-emerald-700 font-medium">Clean & Sanitized</p>
                      </div>
                    )}

                    <div className="pt-1 flex items-center justify-between text-[11px] text-slate-500 border-t border-slate-200 font-mono">
                      <span>Rate: ₹{bed.dailyRate}/day</span>
                      <div className="flex items-center gap-1 text-[10px]">
                        {bed.oxygenEquipped && <span className="text-sky-700 font-semibold">O2</span>}
                        {bed.ventilatorEquipped && <span className="text-indigo-700 font-semibold">• Vent</span>}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between gap-1">
                  {isAvailable && (
                    <button
                      onClick={() => setAssignBedModal(bed)}
                      className="flex-1 py-1 px-2 rounded-lg bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold transition"
                    >
                      Admit Patient
                    </button>
                  )}

                  {isOccupied && (
                    <button
                      onClick={() => updateBedStatus(bed.id, 'Cleaning')}
                      className="flex-1 py-1 px-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold transition"
                    >
                      Discharge & Sanitize
                    </button>
                  )}

                  {isCleaning && (
                    <button
                      onClick={() => updateBedStatus(bed.id, 'Available')}
                      className="flex-1 py-1 px-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition"
                    >
                      Mark Available
                    </button>
                  )}

                  <button
                    onClick={() => removeBed(bed.id)}
                    className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                    title="Delete Bed"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Bed Modal */}
      {isAddBedModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-2xl bg-white border border-slate-200 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-sky-50 text-sky-600">
                  <BedDouble className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">Add Hospital Bed</h3>
                  <p className="text-xs text-slate-500">Name bed and assign to a ward</p>
                </div>
              </div>
              <button onClick={() => setIsAddBedModalOpen(false)} className="text-slate-400 hover:text-slate-700 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddBedSubmit} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Bed Name / Number *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. ICU-01, Deluxe-204, Ward A-Bed 3"
                  value={bedForm.bedNumber}
                  onChange={e => setBedForm({ ...bedForm, bedNumber: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-sky-500 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Ward Type *
                  </label>
                  <select
                    value={bedForm.wardType}
                    onChange={e => setBedForm({ ...bedForm, wardType: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-sky-500 focus:bg-white"
                  >
                    {STANDARD_WARDS.map(w => (
                      <option key={w} value={w}>{w}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Floor / Room
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Floor 2, Room 204"
                    value={bedForm.floor}
                    onChange={e => setBedForm({ ...bedForm, floor: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-sky-500 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Daily Charge (₹/Day) *
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  step="100"
                  placeholder="e.g. 2500"
                  value={bedForm.dailyRate}
                  onChange={e => setBedForm({ ...bedForm, dailyRate: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-xs font-mono text-slate-900 focus:outline-none focus:border-sky-500 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3 pt-1">
                <label className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={bedForm.oxygenEquipped}
                    onChange={e => setBedForm({ ...bedForm, oxygenEquipped: e.target.checked })}
                    className="rounded text-sky-600 focus:ring-0"
                  />
                  <span>Central O2 Pipeline</span>
                </label>

                <label className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={bedForm.ventilatorEquipped}
                    onChange={e => setBedForm({ ...bedForm, ventilatorEquipped: e.target.checked })}
                    className="rounded text-sky-600 focus:ring-0"
                  />
                  <span>Ventilator Hookup</span>
                </label>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddBedModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-xs font-medium text-slate-600 hover:text-slate-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs shadow-sm transition"
                >
                  Save & Add Bed
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Assign Patient to Bed Modal */}
      {assignBedModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-2xl bg-white border border-slate-200 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-sky-50 text-sky-600">
                  <UserCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">Admit Patient to {assignBedModal.bedNumber}</h3>
                  <p className="text-xs text-slate-500">{assignBedModal.wardType}</p>
                </div>
              </div>
              <button onClick={() => setAssignBedModal(null)} className="text-slate-400 hover:text-slate-700 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAssignPatientSubmit} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Patient Name *
                </label>
                {patients.length > 0 ? (
                  <div className="space-y-2">
                    <select
                      value={selectedPatientForBed}
                      onChange={e => setSelectedPatientForBed(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-sky-500 focus:bg-white"
                    >
                      <option value="">-- Choose Registered Patient --</option>
                      {patients.map(p => (
                        <option key={p.id} value={p.name}>{p.name} ({p.gender}, {p.age}y)</option>
                      ))}
                    </select>
                    <p className="text-[11px] text-slate-400">or type a new patient name below:</p>
                    <input
                      type="text"
                      placeholder="Type patient name..."
                      value={selectedPatientForBed}
                      onChange={e => setSelectedPatientForBed(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-sky-500 focus:bg-white"
                    />
                  </div>
                ) : (
                  <input
                    type="text"
                    required
                    placeholder="Enter patient name for admission"
                    value={selectedPatientForBed}
                    onChange={e => setSelectedPatientForBed(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-sky-500 focus:bg-white"
                  />
                )}
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setAssignBedModal(null)}
                  className="px-4 py-2 rounded-lg text-xs font-medium text-slate-600 hover:text-slate-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs shadow-sm transition"
                >
                  Confirm Bed Admission
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
