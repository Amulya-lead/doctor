import React, { useState } from 'react';
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

  const filteredItems = pharmacyItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase()) ||
                          item.genericName.toLowerCase().includes(search.toLowerCase()) ||
                          item.batchNo.toLowerCase().includes(search.toLowerCase());
    const matchesCat = selectedCategory === 'ALL' || item.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const lowStockCount = pharmacyItems.filter(p => p.stockQty <= p.reorderLevel).length;
  const totalStockUnits = pharmacyItems.reduce((acc, p) => acc + p.stockQty, 0);

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
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Pill className="w-6 h-6 text-sky-600" />
            <span>Hospital Pharmacy & Formulary</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage hospital drug formulary, add or remove medicines, track batch numbers, and dispense to patients.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2 rounded-lg bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs flex items-center gap-2 shadow-sm transition"
        >
          <Plus className="w-4 h-4" />
          <span>+ Add New Medicine</span>
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
          <span className="text-xs font-medium text-slate-500 block">Formulary Medicines</span>
          <span className="text-2xl font-bold text-slate-900 font-mono mt-1 block">{pharmacyItems.length} SKUs</span>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
          <span className="text-xs font-medium text-slate-500 block">Total Units in Stock</span>
          <span className="text-2xl font-bold text-sky-600 font-mono mt-1 block">{totalStockUnits.toLocaleString()}</span>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
          <span className="text-xs font-medium text-slate-500 block">Low Stock Alerts</span>
          <span className={`text-2xl font-bold font-mono mt-1 block ${lowStockCount > 0 ? 'text-amber-600' : 'text-emerald-600'}`}>
            {lowStockCount} {lowStockCount > 0 ? 'Need Reorder' : 'All Sufficient'}
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-3 rounded-xl bg-white border border-slate-200 flex flex-wrap items-center justify-between gap-3 shadow-xs">
        <div className="relative flex-1 min-w-[240px] max-w-sm">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search medicine name, generic formula, batch..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:bg-white"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {['ALL', 'Antibiotic', 'Analgesic', 'Emergency IV', 'Respiratory'].map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition ${
                selectedCategory === cat
                  ? 'bg-sky-600 text-white font-bold'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Medicines Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-xs">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase text-[10px] tracking-wider">
            <tr>
              <th className="p-3">Medicine & Generic Name</th>
              <th className="p-3">Category</th>
              <th className="p-3">Batch & Expiry</th>
              <th className="p-3 text-right">Available Stock</th>
              <th className="p-3 text-right">Unit Price</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredItems.map(item => {
              const isLowStock = item.stockQty <= item.reorderLevel;

              return (
                <tr key={item.id} className="hover:bg-slate-50 transition">
                  <td className="p-3">
                    <p className="font-bold text-slate-900 text-xs">{item.name}</p>
                    <p className="text-[11px] text-slate-500">{item.genericName}</p>
                  </td>

                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-medium">
                      {item.category}
                    </span>
                  </td>

                  <td className="p-3 font-mono text-slate-600 text-[11px]">
                    <p>{item.batchNo}</p>
                    <p className="text-[10px] text-slate-400">Exp: {item.expiryDate}</p>
                  </td>

                  <td className="p-3 text-right">
                    <span className={`font-mono font-bold ${isLowStock ? 'text-amber-600' : 'text-slate-900'}`}>
                      {item.stockQty} units
                    </span>
                    {isLowStock && (
                      <span className="block text-[10px] text-amber-600 font-semibold">Low Stock</span>
                    )}
                  </td>

                  <td className="p-3 text-right font-mono text-slate-800 font-medium">
                    ₹{item.unitPrice.toFixed(2)}
                  </td>

                  <td className="p-3 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => {
                          setDispenseModalItem(item);
                          setDispenseQty(Math.min(item.stockQty, 10));
                        }}
                        disabled={item.stockQty === 0}
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold transition ${
                          item.stockQty === 0
                            ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                            : 'bg-sky-600 hover:bg-sky-700 text-white'
                        }`}
                      >
                        Dispense
                      </button>

                      <button
                        onClick={() => removePharmacyItem(item.id)}
                        className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
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

      {/* Add Medicine Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-2xl bg-white border border-slate-200 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-sky-50 text-sky-600">
                  <Pill className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">Add New Medicine</h3>
                  <p className="text-xs text-slate-500">Register pharmaceutical to hospital inventory</p>
                </div>
              </div>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-slate-700 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddMedSubmit} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Brand Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Augmentin 625 Duo"
                  value={newMedForm.name}
                  onChange={e => setNewMedForm({ ...newMedForm, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-sky-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Generic Formula</label>
                <input
                  type="text"
                  placeholder="e.g. Amoxicillin 500mg + Clavulanic Acid 125mg"
                  value={newMedForm.genericName}
                  onChange={e => setNewMedForm({ ...newMedForm, genericName: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-sky-500 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Category</label>
                  <select
                    value={newMedForm.category}
                    onChange={e => setNewMedForm({ ...newMedForm, category: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-sky-500 focus:bg-white"
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
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Batch Number</label>
                  <input
                    type="text"
                    placeholder="e.g. BAT-2026-09"
                    value={newMedForm.batchNo}
                    onChange={e => setNewMedForm({ ...newMedForm, batchNo: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-sky-500 focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Initial Stock Units *</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={newMedForm.stockQty}
                    onChange={e => setNewMedForm({ ...newMedForm, stockQty: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-xs font-mono text-slate-900 focus:outline-none focus:border-sky-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Unit Price (₹) *</label>
                  <input
                    type="number"
                    step="0.5"
                    min="0"
                    required
                    value={newMedForm.unitPrice}
                    onChange={e => setNewMedForm({ ...newMedForm, unitPrice: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-xs font-mono text-slate-900 focus:outline-none focus:border-sky-500 focus:bg-white"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-xs font-medium text-slate-600 hover:text-slate-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs shadow-sm transition"
                >
                  Save to Formulary
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Dispense Modal */}
      {dispenseModalItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-2xl bg-white border border-slate-200 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-sky-50 text-sky-600">
                  <Pill className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">Dispense Medicine</h3>
                  <p className="text-xs text-slate-500">{dispenseModalItem.name} ({dispenseModalItem.stockQty} available)</p>
                </div>
              </div>
              <button onClick={() => setDispenseModalItem(null)} className="text-slate-400 hover:text-slate-700 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleDispenseSubmit} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Quantity to Dispense</label>
                <input
                  type="number"
                  min="1"
                  max={dispenseModalItem.stockQty}
                  required
                  value={dispenseQty}
                  onChange={e => setDispenseQty(parseInt(e.target.value) || 1)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-xs font-mono text-slate-900 focus:outline-none focus:border-sky-500 focus:bg-white"
                />
              </div>

              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs space-y-1">
                <div className="flex justify-between text-slate-600">
                  <span>Unit Price:</span>
                  <span className="font-mono">₹{dispenseModalItem.unitPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-slate-900 pt-1 border-t border-slate-200">
                  <span>Total Bill Amount:</span>
                  <span className="font-mono text-emerald-700">₹{(dispenseModalItem.unitPrice * dispenseQty).toFixed(2)}</span>
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setDispenseModalItem(null)}
                  className="px-4 py-2 rounded-lg text-xs font-medium text-slate-600 hover:text-slate-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs shadow-sm transition"
                >
                  Confirm & Deduct Stock
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
