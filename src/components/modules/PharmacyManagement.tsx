import React, { useState, useMemo } from 'react';
import {
  Pill,
  Search,
  AlertTriangle,
  Plus,
  Trash2,
  X,
  CheckCircle2,
  Send
} from 'lucide-react';
import { useHospitalOS } from '../../context/HospitalOSContext';
import { PharmacyItem } from '../../types';

export const PharmacyManagement: React.FC = () => {
  const { pharmacyItems, dispenseMedicine, addPharmacyItem, removePharmacyItem } = useHospitalOS();

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [dispenseModalItem, setDispenseModalItem] = useState<PharmacyItem | null>(null);
  const [dispenseQty, setDispenseQty] = useState<number>(10);
  const [patientNameInput, setPatientNameInput] = useState('');

  // Add Med Form
  const [newMedForm, setNewMedForm] = useState({
    name: '',
    genericName: '',
    category: 'Antibiotic' as PharmacyItem['category'],
    batchNo: '',
    stockQty: 200,
    reorderLevel: 30,
    unitPrice: 15.0,
    mrp: 20.0,
    expiryDate: '2028-12-31',
    supplier: 'Standard Pharma Ltd',
    rackLocation: 'Shelf A-1',
    requiresPrescription: false
  });

  const filteredItems = useMemo(() => {
    const q = search.trim().toLowerCase();
    return pharmacyItems.filter(item => {
      const matchesSearch = !q ||
        item.name.toLowerCase().includes(q) ||
        item.genericName.toLowerCase().includes(q) ||
        item.batchNo.toLowerCase().includes(q);
      const matchesCat = selectedCategory === 'ALL' || item.category === selectedCategory;
      return matchesSearch && matchesCat;
    });
  }, [pharmacyItems, search, selectedCategory]);

  const { lowStockCount, totalStockUnits } = useMemo(() => {
    let low = 0;
    let totalUnits = 0;
    for (const p of pharmacyItems) {
      if (p.stockQty <= p.reorderLevel) low++;
      totalUnits += p.stockQty;
    }
    return { lowStockCount: low, totalStockUnits: totalUnits };
  }, [pharmacyItems]);

  const handleAddMedSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMedForm.name.trim()) return;

    addPharmacyItem({
      name: newMedForm.name.trim(),
      genericName: newMedForm.genericName.trim() || newMedForm.name.trim(),
      category: newMedForm.category,
      batchNo: newMedForm.batchNo || `BAT-${Date.now().toString().slice(-5)}`,
      stockQty: Number(newMedForm.stockQty) || 100,
      reorderLevel: Number(newMedForm.reorderLevel) || 20,
      unitPrice: Number(newMedForm.unitPrice) || 10,
      mrp: Number(newMedForm.mrp) || 15,
      expiryDate: newMedForm.expiryDate,
      supplier: newMedForm.supplier,
      rackLocation: newMedForm.rackLocation,
      requiresPrescription: newMedForm.requiresPrescription
    });

    setNewMedForm({
      name: '',
      genericName: '',
      category: 'Antibiotic',
      batchNo: '',
      stockQty: 200,
      reorderLevel: 30,
      unitPrice: 15.0,
      mrp: 20.0,
      expiryDate: '2028-12-31',
      supplier: 'Standard Pharma Ltd',
      rackLocation: 'Shelf A-1',
      requiresPrescription: false
    });
    setIsAddModalOpen(false);
  };

  const handleDispenseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dispenseModalItem) return;
    dispenseMedicine(dispenseModalItem.id, dispenseQty);
    setDispenseModalItem(null);
    setDispenseQty(10);
  };

  return (
    <div className="space-y-6">
      {/* Architectural Workspace Banner */}
      <div className="workspace-banner workspace-banner-pharmacy p-6 sm:p-7 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-white/15 backdrop-blur-md border border-sky-300/30 text-[11px] font-bold uppercase tracking-wider text-lavender-200">
            <span>Dispensary &amp; Inventory &bull; {pharmacyItems.length} SKUs</span>
          </div>
          <h2 className="font-display text-2xl font-extrabold text-white flex items-center gap-2.5 tracking-tight">
            <Pill className="w-6 h-6 text-lavender-300" />
            <span>Hospital Pharmacy &amp; Formulary</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-100 max-w-2xl">
            Manage hospital drug formulary, add or remove medicines, track batch numbers, and dispense to patients.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-white hover:bg-lavender-50 text-[#1C103B] font-bold text-xs flex items-center gap-2 shadow-lg transition active:scale-[0.98] flex-shrink-0"
        >
          <Plus className="w-4 h-4 text-[#4C1D95]" />
          <span>Add New Medicine</span>
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="relative overflow-hidden lavish-card lavish-card-hover p-4">
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#2D1B69] to-[#6D28D9]" />
          <span className="text-xs font-bold uppercase tracking-wider text-slate-700 block">Formulary Medicines</span>
          <span className="font-display text-2xl font-extrabold text-slate-950 font-mono mt-1 block">{pharmacyItems.length} SKUs</span>
        </div>

        <div className="relative overflow-hidden lavish-card lavish-card-hover p-4">
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#5B21B6] to-[#0D9488]" />
          <span className="text-xs font-bold uppercase tracking-wider text-[#4C1D95] block">Total Units in Stock</span>
          <span className="font-display text-2xl font-extrabold text-[#4C1D95] font-mono mt-1 block">{totalStockUnits.toLocaleString()}</span>
        </div>

        <div className="relative overflow-hidden lavish-card lavish-card-hover p-4">
          <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${lowStockCount > 0 ? 'from-amber-500 to-orange-500' : 'from-emerald-500 to-teal-500'}`} />
          <span className="text-xs font-bold uppercase tracking-wider text-slate-700 block">Low Stock Alerts</span>
          <span className={`font-display text-2xl font-extrabold font-mono mt-1 block ${lowStockCount > 0 ? 'text-amber-700' : 'text-emerald-700'}`}>
            {lowStockCount} {lowStockCount > 0 ? 'Need Reorder' : 'All Sufficient'}
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-3 rounded-xl bg-white border border-slate-200/95 flex flex-wrap items-center justify-between gap-3 shadow-xs">
        <div className="relative flex-1 min-w-[240px] max-w-sm">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search medicine name, generic formula, batch..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-slate-50 border border-slate-300/80 text-xs font-medium text-slate-950 placeholder-slate-500 focus:outline-none focus:border-[#5B21B6] focus:bg-white transition"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {['ALL', 'Antibiotic', 'Analgesic', 'Emergency IV', 'Respiratory'].map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition ${selectedCategory === cat
                ? 'btn-zoho-primary text-white'
                : 'bg-slate-100 text-slate-800 hover:bg-lavender-50/80 hover:text-[#4C1D95]'
                }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Medicines Table */}
      <div className="lavish-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gradient-to-r from-[#F6F9FE] to-[#EEF4FB] border-b border-slate-200/90 text-slate-800 font-bold uppercase text-[11px] tracking-wider">
              <tr>
                <th className="py-3.5 px-4 whitespace-nowrap">Medicine &amp; Generic Name</th>
                <th className="py-3.5 px-4 whitespace-nowrap">Category</th>
                <th className="py-3.5 px-4 whitespace-nowrap">Batch &amp; Expiry</th>
                <th className="py-3.5 px-4 text-right whitespace-nowrap">Available Stock</th>
                <th className="py-3.5 px-4 text-right whitespace-nowrap">Unit Price</th>
                <th className="py-3.5 px-4 text-right whitespace-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredItems.map(item => {
                const isLowStock = item.stockQty <= item.reorderLevel;

                return (
                  <tr key={item.id} className="hover:bg-lavender-50/50 transition-colors">
                    <td className="py-3.5 px-4">
                      <p className="font-display font-bold text-slate-950 text-[13px]">{item.name}</p>
                      <p className="text-[11px] font-medium text-slate-700 mt-0.5">{item.genericName}</p>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200/90 text-slate-800 text-[11px] font-bold">
                        {item.category}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 font-mono text-slate-800 text-[11px]">
                      <p className="font-semibold">{item.batchNo}</p>
                      <p className="text-[10px] text-slate-600 font-medium">Exp: {item.expiryDate}</p>
                    </td>

                    <td className="py-3.5 px-4 text-right tabular-nums">
                      <span className={`font-mono font-bold ${isLowStock ? 'text-amber-700' : 'text-slate-950'}`}>
                        {item.stockQty} units
                      </span>
                      {isLowStock && (
                        <span className="block text-[10px] text-amber-700 font-bold">Low Stock</span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-right font-mono text-slate-950 font-bold tabular-nums">
                      ₹{item.unitPrice.toFixed(2)}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => {
                            setDispenseModalItem(item);
                            setDispenseQty(Math.min(item.stockQty, 10));
                          }}
                          disabled={item.stockQty === 0}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${item.stockQty === 0
                            ? 'bg-slate-100 text-slate-500 cursor-not-allowed'
                            : 'btn-zoho-primary text-white'
                            }`}
                        >
                          Dispense
                        </button>

                        <button
                          onClick={() => removePharmacyItem(item.id)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-rose-700 hover:bg-rose-50 transition"
                          title="Remove Medicine from Formulary"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Medicine Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-md rounded-2xl bg-white border border-slate-200 shadow-2xl overflow-hidden">
            <div className="h-1.5 w-full bg-gradient-to-r from-[#2D1B69] via-[#6D28D9] to-[#0D9488]" />
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200/70">
                    <Pill className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-slate-950 text-base">Add New Medicine</h3>
                    <p className="text-xs font-medium text-slate-700">Register pharmaceutical to hospital inventory</p>
                  </div>
                </div>
                <button onClick={() => setIsAddModalOpen(false)} className="text-slate-600 hover:text-slate-950 hover:bg-slate-100 rounded-lg p-1.5">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAddMedSubmit} className="space-y-3.5">
                <div>
                  <label className="text-xs font-bold text-slate-800 block mb-1">Brand Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Augmentin 625 Duo"
                    value={newMedForm.name}
                    onChange={e => setNewMedForm({ ...newMedForm, name: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-300/80 text-xs font-medium text-slate-950 focus:outline-none focus:border-[#5B21B6] focus:bg-white transition"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-800 block mb-1">Generic Formula</label>
                  <input
                    type="text"
                    placeholder="e.g. Amoxicillin 500mg + Clavulanic Acid 125mg"
                    value={newMedForm.genericName}
                    onChange={e => setNewMedForm({ ...newMedForm, genericName: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-300/80 text-xs font-medium text-slate-950 focus:outline-none focus:border-[#5B21B6] focus:bg-white transition"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-800 block mb-1">Category</label>
                    <select
                      value={newMedForm.category}
                      onChange={e => setNewMedForm({ ...newMedForm, category: e.target.value as any })}
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-300/80 text-xs font-medium text-slate-950 focus:outline-none focus:border-[#5B21B6] focus:bg-white transition"
                    >
                      <option value="Antibiotic">Antibiotic</option>
                      <option value="Analgesic">Analgesic</option>
                      <option value="Cardiovascular">Cardiovascular</option>
                      <option value="Antidiabetic">Antidiabetic</option>
                      <option value="Respiratory">Respiratory</option>
                      <option value="Emergency IV">Emergency IV</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-800 block mb-1">Batch Number</label>
                    <input
                      type="text"
                      placeholder="e.g. BAT-2026-09"
                      value={newMedForm.batchNo}
                      onChange={e => setNewMedForm({ ...newMedForm, batchNo: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-300/80 text-xs font-medium text-slate-950 focus:outline-none focus:border-[#5B21B6] focus:bg-white transition"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-800 block mb-1">Initial Stock Units *</label>
                    <input
                      type="number"
                      min="1"
                      required
                      value={newMedForm.stockQty}
                      onChange={e => setNewMedForm({ ...newMedForm, stockQty: parseInt(e.target.value) || 0 })}
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-300/80 text-xs font-mono font-bold text-slate-950 focus:outline-none focus:border-[#5B21B6] focus:bg-white transition"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-800 block mb-1">Unit Price (₹) *</label>
                    <input
                      type="number"
                      step="0.5"
                      min="0"
                      required
                      value={newMedForm.unitPrice}
                      onChange={e => setNewMedForm({ ...newMedForm, unitPrice: parseFloat(e.target.value) || 0 })}
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-300/80 text-xs font-mono font-bold text-slate-950 focus:outline-none focus:border-[#5B21B6] focus:bg-white transition"
                    />
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl btn-zoho-primary text-white font-bold text-xs transition active:scale-[0.98]"
                  >
                    Save to Formulary
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Dispense Modal */}
      {dispenseModalItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-md rounded-2xl bg-white border border-slate-200 shadow-2xl overflow-hidden">
            <div className="h-1.5 w-full bg-gradient-to-r from-[#2D1B69] via-[#6D28D9] to-[#0D9488]" />
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-lavender-50 text-[#4C1D95] border border-lavender-200/80">
                    <Pill className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-slate-950 text-base">Dispense Medicine</h3>
                    <p className="text-xs font-medium text-slate-700">{dispenseModalItem.name} ({dispenseModalItem.stockQty} available)</p>
                  </div>
                </div>
                <button onClick={() => setDispenseModalItem(null)} className="text-slate-600 hover:text-slate-950 hover:bg-slate-100 rounded-lg p-1.5">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleDispenseSubmit} className="space-y-3.5">
                <div>
                  <label className="text-xs font-bold text-slate-800 block mb-1">Quantity to Dispense</label>
                  <input
                    type="number"
                    min="1"
                    max={dispenseModalItem.stockQty}
                    required
                    value={dispenseQty}
                    onChange={e => setDispenseQty(parseInt(e.target.value) || 1)}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-300/80 text-xs font-mono font-bold text-slate-950 focus:outline-none focus:border-[#5B21B6] focus:bg-white transition"
                  />
                </div>

                <div className="p-3.5 rounded-xl bg-gradient-to-br from-slate-50 to-blue-50/40 border border-slate-200 text-xs space-y-1.5">
                  <div className="flex justify-between text-slate-700 font-semibold">
                    <span>Unit Price:</span>
                    <span className="font-mono text-slate-950">₹{dispenseModalItem.unitPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-slate-950 pt-1.5 border-t border-slate-200">
                    <span>Total Bill Amount:</span>
                    <span className="font-mono text-emerald-700">₹{(dispenseModalItem.unitPrice * dispenseQty).toFixed(2)}</span>
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl btn-zoho-primary text-white font-bold text-xs transition active:scale-[0.98]"
                  >
                    Confirm &amp; Deduct Stock
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
