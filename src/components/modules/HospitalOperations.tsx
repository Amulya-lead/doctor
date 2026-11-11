import React, { useState, useMemo } from 'react';
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

  const filteredBeds = useMemo(
    () => beds.filter(b => selectedWardFilter === 'ALL' || b.wardType.includes(selectedWardFilter) || b.wardType === selectedWardFilter),
    [beds, selectedWardFilter]
  );

  const { availableCount, occupiedCount, cleaningCount, occupancyRate } = useMemo(() => {
    let available = 0;
    let occupied = 0;
    let cleaning = 0;
    for (const b of beds) {
      if (b.status === 'Available') available++;
      else if (b.status === 'Occupied') occupied++;
      else if (b.status === 'Cleaning' || b.status === 'Maintenance') cleaning++;
    }
    return {
      availableCount: available,
      occupiedCount: occupied,
      cleaningCount: cleaning,
      occupancyRate: beds.length > 0 ? Math.round((occupied / beds.length) * 100) : 0
    };
  }, [beds]);

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
      {/* Architectural Workspace Banner */}
      <div className="workspace-banner workspace-banner-wards p-6 sm:p-7 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-white/15 backdrop-blur-md border border-hospital-300/35 text-[11px] font-bold uppercase tracking-wider text-hospital-200">
            <span>Ward &amp; ICU Operations &bull; {occupancyRate}% Occupancy</span>
          </div>
          <h2 className="font-display text-2xl font-extrabold text-white flex items-center gap-2.5 tracking-tight">
            <BedDouble className="w-6 h-6 text-hospital-300" />
            <span>Hospital Bed Allocation &amp; Ward Matrix</span>
          </h2>
          <p className="text-xs sm:text-sm text-hospital-50 max-w-2xl">
            Add beds, name and number your hospital wards, allocate patients, and manage occupancy.
          </p>
        </div>

        <button
          onClick={() => setIsAddBedModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-white hover:bg-hospital-50 text-[#10221F] font-bold text-xs flex items-center gap-2 shadow-lg transition active:scale-[0.98] flex-shrink-0"
        >
          <Plus className="w-4 h-4 text-[#39786B]" />
          <span>Add New Bed</span>
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="relative overflow-hidden lavish-card lavish-card-hover p-4">
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#1D4840] to-[#39786B]" />
          <span className="text-xs font-bold uppercase tracking-wider text-hospital-900 block">Total Hospital Beds</span>
          <span className="font-display text-2xl font-extrabold text-hospital-950 font-mono mt-1 block">{beds.length}</span>
        </div>

        <div className="relative overflow-hidden lavish-card lavish-card-hover p-4">
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-hospital-500 to-hospital-500" />
          <span className="text-xs font-bold uppercase tracking-wider text-hospital-800 block">Available Beds</span>
          <span className="font-display text-2xl font-extrabold text-hospital-700 font-mono mt-1 block">{availableCount}</span>
        </div>

        <div className="relative overflow-hidden lavish-card lavish-card-hover p-4">
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-hospital-500 to-hospital-500" />
          <span className="text-xs font-bold uppercase tracking-wider text-hospital-800 block">Occupied Beds</span>
          <span className="font-display text-2xl font-extrabold text-hospital-700 font-mono mt-1 block">{occupiedCount}</span>
        </div>

        <div className="relative overflow-hidden lavish-card lavish-card-hover p-4">
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#1D4840] to-[#39786B]" />
          <span className="text-xs font-bold uppercase tracking-wider text-[#39786B] block">Bed Occupancy Rate</span>
          <span className="font-display text-2xl font-extrabold text-[#39786B] font-mono mt-1 block">{occupancyRate}%</span>
        </div>
      </div>

      {/* Ward Filters */}
      <div className="flex flex-wrap items-center gap-1.5 pb-1">
        {['ALL', 'ICU', 'Emergency', 'General', 'Deluxe', 'Pediatric', 'Maternity'].map(ward => (
          <button
            key={ward}
            onClick={() => setSelectedWardFilter(ward)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition ${
              selectedWardFilter === ward
                ? 'btn-zoho-primary text-white shadow-xs'
                : 'bg-white border border-hospital-300/90 text-hospital-900 hover:text-[#39786B] hover:border-hospital-200 hover:bg-hospital-50/50'
            }`}
          >
            {ward === 'ALL' ? 'All Wards' : ward}
          </button>
        ))}
      </div>

      {/* Bed Matrix Grid */}
      {filteredBeds.length === 0 ? (
        <div className="p-12 lavish-card text-center space-y-2.5">
          <div className="w-12 h-12 rounded-xl bg-hospital-50 text-[#39786B] border border-hospital-200/80 flex items-center justify-center mx-auto">
            <BedDouble className="w-6 h-6" />
          </div>
          <h3 className="font-display font-bold text-hospital-950 text-base">No Beds Added Yet</h3>
          <p className="text-xs text-hospital-900 max-w-sm mx-auto">
            Click &quot;Add New Bed&quot; in the header banner above to create beds for ICU, General Ward, Emergency, or Private Rooms.
          </p>
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
                className={`relative overflow-hidden lavish-card lavish-card-hover p-4 flex flex-col justify-between ${
                  isOccupied
                    ? 'border-hospital-200/90'
                    : isAvailable
                    ? 'border-hospital-200/90'
                    : 'border-hospital-200/90'
                }`}
              >
                <div
                  className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${
                    isOccupied
                      ? 'from-hospital-500 to-hospital-400'
                      : isAvailable
                      ? 'from-hospital-500 to-hospital-400'
                      : 'from-hospital-400 to-hospital-400'
                  }`}
                />
                <div className="pt-1">
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <span className="font-display font-bold text-base text-hospital-950">{bed.bedNumber}</span>
                      <p className="text-[11px] font-medium text-hospital-900">{bed.wardType} &bull; {bed.floor}</p>
                    </div>

                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${
                      isOccupied
                        ? 'bg-hospital-50 text-hospital-800 border-hospital-200'
                        : isAvailable
                        ? 'bg-hospital-50 text-hospital-800 border-hospital-200'
                        : 'bg-hospital-50 text-hospital-800 border-hospital-200'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${isOccupied ? 'bg-hospital-500' : isAvailable ? 'bg-hospital-500' : 'bg-hospital-500'}`} />
                      <span>{bed.status}</span>
                    </span>
                  </div>

                  <div className="mt-3 p-3 rounded-xl bg-gradient-to-br from-hospital-50 to-hospital-50/35 border border-hospital-300/75 space-y-1.5">
                    {isOccupied ? (
                      <div>
                        <p className="text-[10px] text-hospital-800 uppercase font-bold tracking-wider">Admitted Patient</p>
                        <p className="font-display font-bold text-xs text-hospital-950 mt-0.5">{bed.patientName || 'Patient Admitted'}</p>
                      </div>
                    ) : (
                      <div>
                        <p className="text-[10px] text-hospital-800 uppercase font-bold tracking-wider">Ready for Admission</p>
                        <p className="text-xs text-hospital-800 font-bold mt-0.5">Clean &amp; Sanitized</p>
                      </div>
                    )}

                    <div className="pt-1.5 flex items-center justify-between text-[11px] text-hospital-900 border-t border-hospital-300/80 font-mono">
                      <span className="font-semibold">Rate: ₹{bed.dailyRate}/day</span>
                      <div className="flex items-center gap-1 text-[10px]">
                        {bed.oxygenEquipped && <span className="text-[#39786B] font-bold">O2</span>}
                        {bed.ventilatorEquipped && <span className="text-hospital-700 font-bold">&bull; Vent</span>}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-3.5 pt-2.5 border-t border-hospital-50 flex items-center justify-between gap-1.5">
                  {isAvailable && (
                    <button
                      onClick={() => setAssignBedModal(bed)}
                      className="flex-1 py-1.5 px-2.5 rounded-xl btn-zoho-primary text-white text-xs font-bold transition"
                    >
                      Admit Patient
                    </button>
                  )}

                  {isOccupied && (
                    <button
                      onClick={() => updateBedStatus(bed.id, 'Cleaning')}
                      className="flex-1 py-1.5 px-2.5 rounded-xl bg-hospital-50 hover:bg-hospital-300 text-hospital-950 text-xs font-bold transition"
                    >
                      Discharge &amp; Sanitize
                    </button>
                  )}

                  {isCleaning && (
                    <button
                      onClick={() => updateBedStatus(bed.id, 'Available')}
                      className="flex-1 py-1.5 px-2.5 rounded-xl bg-gradient-to-r from-hospital-600 to-hospital-600 hover:brightness-105 text-white text-xs font-bold transition"
                    >
                      Mark Available
                    </button>
                  )}

                  <button
                    onClick={() => removeBed(bed.id)}
                    className="p-1.5 rounded-lg text-hospital-700 hover:text-hospital-700 hover:bg-hospital-50 transition"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-hospital-950/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-md rounded-2xl bg-white border border-hospital-300 shadow-2xl overflow-hidden">
            <div className="h-1.5 w-full bg-gradient-to-r from-[#1D4840] via-[#39786B] to-[#39786B]" />
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-hospital-50">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-hospital-50 text-[#39786B] border border-hospital-200/80">
                    <BedDouble className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-hospital-950 text-base">Add Hospital Bed</h3>
                    <p className="text-xs font-medium text-hospital-900">Name bed and assign to a ward</p>
                  </div>
                </div>
                <button onClick={() => setIsAddBedModalOpen(false)} className="text-hospital-800 hover:text-hospital-950 hover:bg-hospital-50 rounded-lg p-1.5">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAddBedSubmit} className="space-y-3.5">
                <div>
                  <label className="text-xs font-bold text-hospital-900 block mb-1">
                    Bed Name / Number *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. ICU-01, Deluxe-204, Ward A-Bed 3"
                    value={bedForm.bedNumber}
                    onChange={e => setBedForm({ ...bedForm, bedNumber: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-hospital-50 border border-hospital-300/80 text-xs font-medium text-hospital-950 focus:outline-none focus:border-[#39786B] focus:bg-white transition"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-hospital-900 block mb-1">
                      Ward Type *
                    </label>
                    <select
                      value={bedForm.wardType}
                      onChange={e => setBedForm({ ...bedForm, wardType: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl bg-hospital-50 border border-hospital-300/80 text-xs font-medium text-hospital-950 focus:outline-none focus:border-[#39786B] focus:bg-white transition"
                    >
                      {STANDARD_WARDS.map(w => (
                        <option key={w} value={w}>{w}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-hospital-900 block mb-1">
                      Floor / Room
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Floor 2, Room 204"
                      value={bedForm.floor}
                      onChange={e => setBedForm({ ...bedForm, floor: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl bg-hospital-50 border border-hospital-300/80 text-xs font-medium text-hospital-950 focus:outline-none focus:border-[#39786B] focus:bg-white transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-hospital-900 block mb-1">
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
                    className="w-full px-3.5 py-2 rounded-xl bg-hospital-50 border border-hospital-300/80 text-xs font-mono font-bold text-hospital-950 focus:outline-none focus:border-[#39786B] focus:bg-white transition"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3 pt-1">
                  <label className="flex items-center gap-2 p-2.5 rounded-xl bg-hospital-50 border border-hospital-300 text-xs font-semibold text-hospital-950 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={bedForm.oxygenEquipped}
                      onChange={e => setBedForm({ ...bedForm, oxygenEquipped: e.target.checked })}
                      className="rounded accent-[#39786B]"
                    />
                    <span>Central O2 Pipeline</span>
                  </label>

                  <label className="flex items-center gap-2 p-2.5 rounded-xl bg-hospital-50 border border-hospital-300 text-xs font-semibold text-hospital-950 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={bedForm.ventilatorEquipped}
                      onChange={e => setBedForm({ ...bedForm, ventilatorEquipped: e.target.checked })}
                      className="rounded accent-[#39786B]"
                    />
                    <span>Ventilator Hookup</span>
                  </label>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl btn-zoho-primary text-white font-bold text-xs transition active:scale-[0.98]"
                  >
                    Save &amp; Add Bed
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Assign Patient to Bed Modal */}
      {assignBedModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-hospital-950/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-md rounded-2xl bg-white border border-hospital-300 shadow-2xl overflow-hidden">
            <div className="h-1.5 w-full bg-gradient-to-r from-[#1D4840] via-[#39786B] to-[#39786B]" />
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-hospital-50">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-hospital-50 text-[#39786B] border border-hospital-200/80">
                    <UserCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-hospital-950 text-base">Admit Patient to {assignBedModal.bedNumber}</h3>
                    <p className="text-xs font-medium text-hospital-900">{assignBedModal.wardType}</p>
                  </div>
                </div>
                <button onClick={() => setAssignBedModal(null)} className="text-hospital-800 hover:text-hospital-950 hover:bg-hospital-50 rounded-lg p-1.5">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAssignPatientSubmit} className="space-y-3.5">
                <div>
                  <label className="text-xs font-bold text-hospital-900 block mb-1">
                    Patient Name *
                  </label>
                  {patients.length > 0 ? (
                    <div className="space-y-2">
                      <select
                        value={selectedPatientForBed}
                        onChange={e => setSelectedPatientForBed(e.target.value)}
                        className="w-full px-3.5 py-2 rounded-xl bg-hospital-50 border border-hospital-300/80 text-xs font-medium text-hospital-950 focus:outline-none focus:border-[#39786B] focus:bg-white transition"
                      >
                        <option value="">-- Choose Registered Patient --</option>
                        {patients.map(p => (
                          <option key={p.id} value={p.name}>{p.name} ({p.gender}, {p.age}y)</option>
                        ))}
                      </select>
                      <p className="text-[11px] font-medium text-hospital-800">or type a new patient name below:</p>
                      <input
                        type="text"
                        placeholder="Type patient name..."
                        value={selectedPatientForBed}
                        onChange={e => setSelectedPatientForBed(e.target.value)}
                        className="w-full px-3.5 py-2 rounded-xl bg-hospital-50 border border-hospital-300/80 text-xs font-medium text-hospital-950 focus:outline-none focus:border-[#39786B] focus:bg-white transition"
                      />
                    </div>
                  ) : (
                    <input
                      type="text"
                      required
                      placeholder="Enter patient name for admission"
                      value={selectedPatientForBed}
                      onChange={e => setSelectedPatientForBed(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl bg-hospital-50 border border-hospital-300/80 text-xs font-medium text-hospital-950 focus:outline-none focus:border-[#39786B] focus:bg-white transition"
                    />
                  )}
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl btn-zoho-primary text-white font-bold text-xs transition active:scale-[0.98]"
                  >
                    Confirm Bed Admission
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
