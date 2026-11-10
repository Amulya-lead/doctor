import React, { useState } from 'react';
import { 
  CreditCard, 
  Search, 
  CheckCircle2, 
  FileText, 
  X, 
  Plus, 
  Clock, 
  DollarSign, 
  Check, 
  User, 
  Receipt,
  Download,
  AlertTriangle
} from 'lucide-react';
import { useHospitalOS } from '../../context/HospitalOSContext';
import { BillingInvoice } from '../../types';

export const BillingFinancials: React.FC = () => {
  const { invoices, payInvoice, createInvoice, metrics, patients } = useHospitalOS();

  const [search, setSearch] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [selectedInvoiceId, setSelectedInvoiceId] = useState<string | null>(null);
  const [settleModalOpen, setSettleModalOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<BillingInvoice['paymentMethod']>('UPI');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // New Invoice Form state
  const [newInvForm, setNewInvForm] = useState({
    patientId: patients[0]?.id || '',
    patientName: patients[0]?.name || '',
    type: 'OPD Consultation' as BillingInvoice['type'],
    amount: '800',
    description: 'Specialist Clinical Consultation Fee',
    paymentStatus: 'Unpaid' as BillingInvoice['status'],
    paymentMethod: 'UPI' as BillingInvoice['paymentMethod']
  });

  const filteredInvoices = invoices.filter(inv => {
    const matchesSearch = 
      inv.patientName.toLowerCase().includes(search.toLowerCase()) ||
      inv.id.toLowerCase().includes(search.toLowerCase()) ||
      inv.type.toLowerCase().includes(search.toLowerCase());
    
    const matchesStatus = 
      selectedStatus === 'ALL' || 
      (selectedStatus === 'Paid' && inv.status === 'Paid') ||
      (selectedStatus === 'Unpaid' && inv.status !== 'Paid');

    return matchesSearch && matchesStatus;
  });

  const activeInvoice = 
    (selectedInvoiceId && invoices.find(i => i.id === selectedInvoiceId)) ||
    filteredInvoices[0] ||
    invoices[0] ||
    null;

  const handleSettleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeInvoice) return;
    payInvoice(activeInvoice.id, paymentMethod);
    setSettleModalOpen(false);
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(newInvForm.amount) || 500;
    const pt = patients.find(p => p.id === newInvForm.patientId) || patients[0];
    
    const created = createInvoice({
      patientId: pt ? pt.id : `PT-${Date.now().toString().slice(-4)}`,
      patientName: pt ? pt.name : (newInvForm.patientName || 'Registered Patient'),
      abhaId: pt ? pt.abhaId : '91-1002-3948-2831',
      type: newInvForm.type,
      totalAmount: amt,
      status: newInvForm.paymentStatus,
      paidAmount: newInvForm.paymentStatus === 'Paid' ? amt : 0,
      paymentMethod: newInvForm.paymentStatus === 'Paid' ? newInvForm.paymentMethod : 'Pending',
      items: [
        {
          description: newInvForm.description || 'Hospital Healthcare Service',
          quantity: 1,
          unitPrice: amt,
          taxRate: 0,
          total: amt
        }
      ]
    });

    setSelectedInvoiceId(created.id);
    setIsCreateModalOpen(false);
  };

  const totalInvoiced = invoices.reduce((acc, curr) => acc + (Number(curr.totalAmount) || 0), 0);
  const settledRevenue = invoices.reduce((acc, curr) => acc + (Number(curr.paidAmount) || 0), 0);
  const pendingDues = invoices.filter(i => i.status !== 'Paid').reduce((acc, curr) => acc + ((Number(curr.totalAmount) || 0) - (Number(curr.paidAmount) || 0)), 0);

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800">
              Hospital Accounts & Cashier Desk
            </span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <CreditCard className="w-6 h-6 text-sky-600" />
            <span>Billing, Invoicing & Cashier Desk</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time billing ledger, payment receipts via UPI / Cash / Card, and outstanding collection tracking.
          </p>
        </div>

        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="px-4 py-2 rounded-lg bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>+ Generate Bill / Invoice</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono">
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-500 uppercase font-sans tracking-wide">Total Bills Generated</span>
          <p className="text-2xl font-bold text-slate-900 mt-1">₹{totalInvoiced.toLocaleString('en-IN')}</p>
          <span className="text-[10px] text-slate-400 font-sans">{invoices.length} total hospital invoices</span>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
          <span className="text-[11px] font-semibold text-emerald-700 uppercase font-sans tracking-wide">Settled Collections (Paid)</span>
          <p className="text-2xl font-bold text-emerald-700 mt-1">₹{settledRevenue.toLocaleString('en-IN')}</p>
          <span className="text-[10px] text-slate-400 font-sans">
            {invoices.filter(i => i.status === 'Paid').length} paid receipts credited
          </span>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
          <span className="text-[11px] font-semibold text-amber-700 uppercase font-sans tracking-wide">Outstanding Balance Due</span>
          <p className="text-2xl font-bold text-amber-700 mt-1">₹{pendingDues.toLocaleString('en-IN')}</p>
          <span className="text-[10px] text-slate-400 font-sans">
            {invoices.filter(i => i.status !== 'Paid').length} pending patient accounts
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search invoice number, patient name, service..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:bg-white transition"
          />
        </div>

        <div className="flex items-center gap-1.5">
          {['ALL', 'Paid', 'Unpaid'].map((status) => (
            <button
              key={status}
              onClick={() => setSelectedStatus(status)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition ${
                selectedStatus === status
                  ? 'bg-slate-900 text-white font-bold'
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200'
              }`}
            >
              {status === 'ALL' ? `All Invoices (${invoices.length})` : status === 'Paid' ? `Settled (${invoices.filter(i => i.status === 'Paid').length})` : `Pending (${invoices.filter(i => i.status !== 'Paid').length})`}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Invoices List & Itemized Dossier */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 5 cols: Invoice Directory */}
        <div className="lg:col-span-5 space-y-3">
          {filteredInvoices.length === 0 ? (
            <div className="p-12 rounded-xl bg-white border border-slate-200 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-sky-50 text-sky-600 flex items-center justify-center mx-auto">
                <Receipt className="w-6 h-6" />
              </div>
              <p className="font-bold text-slate-800 text-sm">No Invoices Found</p>
              <p className="text-xs text-slate-500">
                {search || selectedStatus !== 'ALL'
                  ? 'No records match your search filter.'
                  : 'Invoices will appear here automatically when consultations are booked or bills generated.'}
              </p>
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="px-4 py-2 rounded-lg bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs shadow-sm transition"
              >
                + Generate First Bill
              </button>
            </div>
          ) : (
            <div className="space-y-2.5 max-h-[640px] overflow-y-auto pr-1">
              {filteredInvoices.map(inv => {
                const isSelected = activeInvoice?.id === inv.id;
                const isPaid = inv.status === 'Paid';

                return (
                  <div
                    key={inv.id}
                    onClick={() => setSelectedInvoiceId(inv.id)}
                    className={`p-4 rounded-xl border cursor-pointer transition ${
                      isSelected
                        ? 'bg-sky-50/70 border-sky-400 shadow-xs'
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-slate-900 capitalize">{inv.patientName}</span>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                            isPaid 
                              ? 'bg-emerald-100 text-emerald-800 border-emerald-200' 
                              : 'bg-amber-100 text-amber-800 border-amber-200'
                          }`}>
                            {inv.status}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-1 font-mono">{inv.id} • {inv.type}</p>
                      </div>

                      <div className="text-right">
                        <span className="font-mono font-bold text-slate-900 text-sm block">
                          ₹{inv.totalAmount.toLocaleString('en-IN')}
                        </span>
                        <span className="text-[10px] text-slate-400 capitalize">{inv.paymentMethod}</span>
                      </div>
                    </div>

                    <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-mono">
                      <span>Date: {inv.invoiceDate}</span>
                      {!isPaid ? (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedInvoiceId(inv.id);
                            setSettleModalOpen(true);
                          }}
                          className="px-2 py-0.5 rounded bg-emerald-600 hover:bg-emerald-700 text-white font-sans font-bold text-[10px] shadow-2xs transition"
                        >
                          Collect Payment
                        </button>
                      ) : (
                        <span className="text-emerald-700 font-sans font-semibold flex items-center gap-1">
                          <Check className="w-3 h-3" /> Settled
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right 7 cols: Detailed Invoice */}
        <div className="lg:col-span-7">
          {activeInvoice ? (
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-5">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Official Hospital Tax Invoice</span>
                  <h3 className="text-lg font-bold text-slate-900 font-mono mt-0.5">#{activeInvoice.id}</h3>
                  <p className="text-xs text-slate-500">Issued on {activeInvoice.invoiceDate}</p>
                </div>

                <div className="text-right">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold border inline-block ${
                    activeInvoice.status === 'Paid'
                      ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                      : 'bg-amber-100 text-amber-800 border-amber-200'
                  }`}>
                    {activeInvoice.status}
                  </span>
                  <p className="text-[11px] font-mono text-slate-500 mt-1">Payment: {activeInvoice.paymentMethod}</p>
                </div>
              </div>

              {/* Patient & Billing Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-semibold block">Billed To Patient</span>
                  <p className="font-bold text-slate-900 text-sm mt-0.5 capitalize">{activeInvoice.patientName}</p>
                  <p className="text-slate-500 font-mono text-[11px] mt-0.5">ABHA: {activeInvoice.abhaId || '91-1000-0000-0000'}</p>
                </div>

                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-semibold block">Invoice Classification</span>
                  <p className="font-bold text-slate-900 text-sm mt-0.5">{activeInvoice.type}</p>
                  <p className="text-slate-500 font-mono text-[11px] mt-0.5">Mode: {activeInvoice.paymentMethod}</p>
                </div>
              </div>

              {/* Itemized Table */}
              <div className="overflow-x-auto rounded-xl border border-slate-200">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase text-[10px]">
                    <tr>
                      <th className="p-3">Service & Clinical Item Description</th>
                      <th className="p-3 text-center">Qty</th>
                      <th className="p-3 text-right">Unit Price</th>
                      <th className="p-3 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {activeInvoice.items.map((it, idx) => (
                      <tr key={idx} className="hover:bg-slate-50">
                        <td className="p-3 font-medium text-slate-800">{it.description}</td>
                        <td className="p-3 text-center font-mono text-slate-600">{it.quantity}</td>
                        <td className="p-3 text-right font-mono text-slate-600">₹{it.unitPrice.toLocaleString('en-IN')}</td>
                        <td className="p-3 text-right font-mono font-bold text-slate-900">₹{it.total.toLocaleString('en-IN')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Total Calculation */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5 text-xs font-mono">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal:</span>
                  <span>₹{activeInvoice.subtotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Taxes & GST (0% Exempt Medical):</span>
                  <span>₹{activeInvoice.taxAmount.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-base font-bold text-slate-900 pt-2 border-t border-slate-200 font-mono">
                  <span>Total Bill Amount:</span>
                  <span className="text-emerald-700">₹{activeInvoice.totalAmount.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-xs text-slate-500 pt-1 font-mono">
                  <span>Amount Paid:</span>
                  <span className="text-slate-800 font-bold">₹{activeInvoice.paidAmount.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* Settlement Button */}
              {activeInvoice.status !== 'Paid' ? (
                <button
                  onClick={() => setSettleModalOpen(true)}
                  className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition active:scale-95 flex items-center justify-center gap-2"
                >
                  <CreditCard className="w-4 h-4" />
                  <span>Collect Payment & Settle Bill (₹{activeInvoice.totalAmount.toLocaleString('en-IN')})</span>
                </button>
              ) : (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center justify-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Invoice Fully Settled via {activeInvoice.paymentMethod}</span>
                </div>
              )}
            </div>
          ) : (
            <div className="p-12 rounded-xl bg-white border border-slate-200 text-center text-slate-400 text-xs">
              Select an invoice from the list to view itemized charges
            </div>
          )}
        </div>
      </div>

      {/* Settle Modal */}
      {settleModalOpen && activeInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="w-full max-w-md rounded-2xl bg-white border border-slate-200 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-emerald-50 text-emerald-700">
                  <CreditCard className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">Collect Bill Payment</h3>
                  <p className="text-xs text-slate-500">Invoice #{activeInvoice.id} • Patient: {activeInvoice.patientName}</p>
                </div>
              </div>
              <button onClick={() => setSettleModalOpen(false)} className="text-slate-400 hover:text-slate-700 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSettleSubmit} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Select Payment Mode</label>
                <select
                  value={paymentMethod}
                  onChange={e => setPaymentMethod(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-sky-500 focus:bg-white"
                >
                  <option value="UPI">UPI / QR Code (Instant Settlement)</option>
                  <option value="Cash">Cash at Counter</option>
                  <option value="Credit/Debit Card">Credit / Debit Card POS</option>
                  <option value="Insurance Cashless (TPA)">Insurance Cashless (TPA)</option>
                </select>
              </div>

              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs font-mono space-y-1">
                <div className="flex justify-between text-slate-600">
                  <span>Amount Due:</span>
                  <span>₹{activeInvoice.totalAmount.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between font-bold text-slate-900 pt-1 border-t border-slate-200">
                  <span>Receivable Amount:</span>
                  <span className="text-emerald-700">₹{activeInvoice.totalAmount.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setSettleModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-xs font-medium text-slate-600 hover:text-slate-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition"
                >
                  Confirm Receipt of ₹{activeInvoice.totalAmount.toLocaleString('en-IN')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Manual Generate Bill Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="w-full max-w-lg rounded-2xl bg-white border border-slate-200 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-sky-50 text-sky-600">
                  <Receipt className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">Generate Hospital Bill</h3>
                  <p className="text-xs text-slate-500">Create tax invoice for clinical or diagnostic services</p>
                </div>
              </div>
              <button onClick={() => setIsCreateModalOpen(false)} className="text-slate-400 hover:text-slate-700 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Select Patient *</label>
                <select
                  value={newInvForm.patientId}
                  onChange={e => {
                    const pt = patients.find(p => p.id === e.target.value);
                    setNewInvForm({
                      ...newInvForm,
                      patientId: e.target.value,
                      patientName: pt?.name || ''
                    });
                  }}
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-sky-500 focus:bg-white"
                >
                  {patients.map(p => (
                    <option key={p.id} value={p.id}>{p.name} ({p.id} • {p.status})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Invoice Type</label>
                  <select
                    value={newInvForm.type}
                    onChange={e => setNewInvForm({ ...newInvForm, type: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-sky-500 focus:bg-white"
                  >
                    <option value="OPD Consultation">OPD Consultation</option>
                    <option value="IPD Admission">IPD Admission</option>
                    <option value="Diagnostics">Diagnostics / Lab Test</option>
                    <option value="Pharmacy">Pharmacy Dispensation</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Total Bill Amount (₹) *</label>
                  <input
                    type="number"
                    required
                    value={newInvForm.amount}
                    onChange={e => setNewInvForm({ ...newInvForm, amount: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-900 font-mono focus:outline-none focus:border-sky-500 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Service Description</label>
                <input
                  type="text"
                  value={newInvForm.description}
                  onChange={e => setNewInvForm({ ...newInvForm, description: e.target.value })}
                  placeholder="e.g. OPD Consultation Fee"
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-sky-500 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Initial Status</label>
                  <select
                    value={newInvForm.paymentStatus}
                    onChange={e => setNewInvForm({ ...newInvForm, paymentStatus: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-sky-500 focus:bg-white"
                  >
                    <option value="Paid">Mark Paid (Settled)</option>
                    <option value="Unpaid">Unpaid (Pending Collection)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Payment Method</label>
                  <select
                    value={newInvForm.paymentMethod}
                    onChange={e => setNewInvForm({ ...newInvForm, paymentMethod: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-sky-500 focus:bg-white"
                  >
                    <option value="UPI">UPI</option>
                    <option value="Cash">Cash</option>
                    <option value="Credit/Debit Card">Card</option>
                  </select>
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-xs font-medium text-slate-600 hover:text-slate-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs shadow-sm transition"
                >
                  Create Invoice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
