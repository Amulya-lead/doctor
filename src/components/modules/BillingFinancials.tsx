import React, { useState, useMemo } from 'react';
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

  const filteredInvoices = useMemo(() => {
    const q = search.trim().toLowerCase();
    return invoices.filter(inv => {
      const matchesSearch = !q ||
        inv.patientName.toLowerCase().includes(q) ||
        inv.id.toLowerCase().includes(q) ||
        inv.type.toLowerCase().includes(q);
      const matchesStatus =
        selectedStatus === 'ALL' ||
        (selectedStatus === 'Paid' && inv.status === 'Paid') ||
        (selectedStatus === 'Unpaid' && inv.status !== 'Paid');
      return matchesSearch && matchesStatus;
    });
  }, [invoices, search, selectedStatus]);

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

  const { totalInvoiced, settledRevenue, pendingDues, paidCount, unpaidCount } = useMemo(() => {
    let invoiced = 0;
    let settled = 0;
    let dues = 0;
    let paid = 0;
    let unpaid = 0;
    for (const curr of invoices) {
      const total = Number(curr.totalAmount) || 0;
      const paidAmt = Number(curr.paidAmount) || 0;
      invoiced += total;
      settled += paidAmt;
      if (curr.status === 'Paid') {
        paid++;
      } else {
        unpaid++;
        dues += Math.max(0, total - paidAmt);
      }
    }
    return {
      totalInvoiced: invoiced,
      settledRevenue: settled,
      pendingDues: dues,
      paidCount: paid,
      unpaidCount: unpaid
    };
  }, [invoices]);

  return (
    <div className="space-y-6">
      {/* Architectural Workspace Banner */}
      <div className="workspace-banner workspace-banner-billing p-6 sm:p-7 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-white/15 backdrop-blur-md border border-hospital-300/35 text-[11px] font-bold uppercase tracking-wider text-hospital-200">
            <span>Hospital Accounts &amp; Cashier Desk</span>
          </div>
          <h2 className="font-display text-2xl font-extrabold text-white flex items-center gap-2.5 tracking-tight">
            <CreditCard className="w-6 h-6 text-hospital-300" />
            <span>Billing, Invoicing &amp; Cashier Desk</span>
          </h2>
          <p className="text-xs sm:text-sm text-hospital-50 max-w-2xl">
            Real-time billing ledger, payment receipts via UPI / Cash / Card, and outstanding collection tracking.
          </p>
        </div>

        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-white hover:bg-hospital-50 text-[#10221F] font-bold text-xs flex items-center gap-1.5 shadow-lg transition active:scale-[0.98] flex-shrink-0"
        >
          <Plus className="w-4 h-4 text-[#39786B]" />
          <span>Generate Bill / Invoice</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono">
        <div className="relative overflow-hidden lavish-card lavish-card-hover p-4">
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#1D4840] to-[#39786B]" />
          <span className="text-[11px] font-bold text-hospital-900 uppercase font-sans tracking-wide">Total Bills Generated</span>
          <p className="font-display text-2xl font-extrabold text-hospital-950 mt-1">₹{totalInvoiced.toLocaleString('en-IN')}</p>
          <span className="text-[11px] text-hospital-800 font-sans font-medium">{invoices.length} total hospital invoices</span>
        </div>

        <div className="relative overflow-hidden lavish-card lavish-card-hover p-4">
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-hospital-500 to-hospital-500" />
          <span className="text-[11px] font-bold text-hospital-800 uppercase font-sans tracking-wide">Settled Collections (Paid)</span>
          <p className="font-display text-2xl font-extrabold text-hospital-700 mt-1">₹{settledRevenue.toLocaleString('en-IN')}</p>
          <span className="text-[11px] text-hospital-800 font-sans font-medium">
            {paidCount} paid receipts credited
          </span>
        </div>

        <div className="relative overflow-hidden lavish-card lavish-card-hover p-4">
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-hospital-500 to-hospital-500" />
          <span className="text-[11px] font-bold text-hospital-800 uppercase font-sans tracking-wide">Outstanding Balance Due</span>
          <p className="font-display text-2xl font-extrabold text-hospital-700 mt-1">₹{pendingDues.toLocaleString('en-IN')}</p>
          <span className="text-[11px] text-hospital-800 font-sans font-medium">
            {unpaidCount} pending patient accounts
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="lavish-card p-3.5 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-hospital-700 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search invoice number, patient name, service..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-hospital-50 border border-hospital-300/80 rounded-xl pl-9 pr-3 py-2 text-xs font-medium text-hospital-950 placeholder-hospital-500 focus:outline-none focus:border-[#39786B] focus:bg-white transition"
          />
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          {['ALL', 'Paid', 'Unpaid'].map((status) => (
            <button
              key={status}
              onClick={() => setSelectedStatus(status)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                selectedStatus === status
                  ? 'btn-zoho-primary text-white shadow-xs'
                  : 'bg-hospital-50 hover:bg-hospital-50/80 text-hospital-900 hover:text-[#39786B] border border-hospital-300/90'
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
            <div className="p-12 lavish-card text-center space-y-2.5">
              <div className="w-12 h-12 rounded-xl bg-hospital-50 text-[#39786B] border border-hospital-200/80 flex items-center justify-center mx-auto">
                <Receipt className="w-6 h-6" />
              </div>
              <p className="font-display font-bold text-hospital-950 text-sm">No Invoices Found</p>
              <p className="text-xs text-hospital-900">
                {search || selectedStatus !== 'ALL'
                  ? 'No records match your search filter.'
                  : 'Invoices appear automatically when consultations are booked, or click "Generate Bill / Invoice" in the header above.'}
              </p>
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
                    className={`p-4 rounded-xl border cursor-pointer transition-all duration-150 ${
                      isSelected
                        ? 'bg-gradient-to-r from-hospital-50/90 to-hospital-100/50 border-[#39786B]/50 shadow-sm'
                        : 'bg-white border-hospital-300/95 hover:border-hospital-300 hover:shadow-xs'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-display font-bold text-sm text-hospital-950 capitalize">{inv.patientName}</span>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                            isPaid
                              ? 'bg-hospital-50 text-hospital-800 border-hospital-200'
                              : 'bg-hospital-50 text-hospital-800 border-hospital-200'
                          }`}>
                            {inv.status}
                          </span>
                        </div>
                        <p className="text-[11px] text-hospital-900 mt-1 font-mono font-semibold">{inv.id} &bull; {inv.type}</p>
                      </div>

                      <div className="text-right">
                        <span className="font-mono font-extrabold text-hospital-950 text-sm block tabular-nums">
                          ₹{inv.totalAmount.toLocaleString('en-IN')}
                        </span>
                        <span className="text-[10px] text-hospital-800 font-semibold capitalize">{inv.paymentMethod}</span>
                      </div>
                    </div>

                    <div className="mt-2.5 pt-2 border-t border-hospital-50 flex items-center justify-between text-[11px] text-hospital-900 font-mono">
                      <span>Date: {inv.invoiceDate}</span>
                      {!isPaid ? (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedInvoiceId(inv.id);
                            setSettleModalOpen(true);
                          }}
                          className="px-2.5 py-1 rounded-lg bg-gradient-to-r from-hospital-600 to-hospital-600 hover:brightness-105 text-white font-sans font-bold text-[10px] shadow-xs transition"
                        >
                          Collect Payment
                        </button>
                      ) : (
                        <span className="text-hospital-700 font-sans font-bold flex items-center gap-1">
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
            <div className="relative overflow-hidden lavish-card">
              <div className="h-1.5 w-full bg-gradient-to-r from-[#1D4840] via-[#39786B] to-[#39786B]" />
              <div className="p-6 space-y-5">
                <div className="flex items-center justify-between pb-4 border-b border-hospital-50">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#39786B]">Official Hospital Tax Invoice</span>
                    <h3 className="font-display text-lg font-extrabold text-hospital-950 font-mono mt-0.5">#{activeInvoice.id}</h3>
                    <p className="text-xs font-medium text-hospital-900">Issued on {activeInvoice.invoiceDate}</p>
                  </div>

                  <div className="text-right">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold border inline-block ${
                      activeInvoice.status === 'Paid'
                        ? 'bg-hospital-50 text-hospital-800 border-hospital-200'
                        : 'bg-hospital-50 text-hospital-800 border-hospital-200'
                    }`}>
                      {activeInvoice.status}
                    </span>
                    <p className="text-[11px] font-mono font-semibold text-hospital-900 mt-1">Payment: {activeInvoice.paymentMethod}</p>
                  </div>
                </div>

                {/* Patient & Billing Info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs p-4 rounded-xl bg-gradient-to-br from-hospital-50 to-hospital-50/40 border border-hospital-300/80">
                  <div>
                    <span className="text-[10px] text-hospital-800 uppercase font-bold tracking-wider block">Billed To Patient</span>
                    <p className="font-display font-bold text-hospital-950 text-sm mt-0.5 capitalize">{activeInvoice.patientName}</p>
                    <p className="text-hospital-900 font-mono text-[11px] mt-0.5">Health ID: {activeInvoice.abhaId || '91-1000-0000-0000'}</p>
                  </div>

                  <div>
                    <span className="text-[10px] text-hospital-800 uppercase font-bold tracking-wider block">Invoice Classification</span>
                    <p className="font-display font-bold text-hospital-950 text-sm mt-0.5">{activeInvoice.type}</p>
                    <p className="text-hospital-900 font-mono text-[11px] mt-0.5">Mode: {activeInvoice.paymentMethod}</p>
                  </div>
                </div>

                {/* Itemized Table */}
                <div className="overflow-x-auto rounded-xl border border-hospital-300/90">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-gradient-to-r from-[#E7F0E9] to-[#F1ECFE] border-b border-hospital-300 text-hospital-900 font-bold uppercase text-[11px]">
                      <tr>
                        <th className="p-3">Service &amp; Clinical Item Description</th>
                        <th className="p-3 text-center">Qty</th>
                        <th className="p-3 text-right">Unit Price</th>
                        <th className="p-3 text-right">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-hospital-50">
                      {activeInvoice.items.map((it, idx) => (
                        <tr key={idx} className="hover:bg-hospital-50/45">
                          <td className="p-3 font-semibold text-hospital-950">{it.description}</td>
                          <td className="p-3 text-center font-mono text-hospital-900">{it.quantity}</td>
                          <td className="p-3 text-right font-mono text-hospital-900">₹{it.unitPrice.toLocaleString('en-IN')}</td>
                          <td className="p-3 text-right font-mono font-bold text-hospital-950">₹{it.total.toLocaleString('en-IN')}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Total Calculation */}
                <div className="p-4 rounded-xl bg-gradient-to-br from-hospital-50 to-hospital-50/40 border border-hospital-300 space-y-1.5 text-xs font-mono">
                  <div className="flex justify-between text-hospital-900 font-medium">
                    <span>Subtotal:</span>
                    <span>₹{activeInvoice.subtotal.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-hospital-900 font-medium">
                    <span>Taxes &amp; GST (0% Exempt Medical):</span>
                    <span>₹{activeInvoice.taxAmount.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-base font-extrabold text-hospital-950 pt-2 border-t border-hospital-300 font-mono">
                    <span>Total Bill Amount:</span>
                    <span className="text-hospital-700">₹{activeInvoice.totalAmount.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-xs text-hospital-900 pt-1 font-mono">
                    <span>Amount Paid:</span>
                    <span className="text-hospital-950 font-bold">₹{activeInvoice.paidAmount.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                {/* Settlement Button */}
                {activeInvoice.status !== 'Paid' ? (
                  <button
                    onClick={() => setSettleModalOpen(true)}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-hospital-600 to-hospital-600 hover:brightness-105 text-white font-bold text-xs shadow-sm transition active:scale-[0.98] flex items-center justify-center gap-2"
                  >
                    <CreditCard className="w-4 h-4" />
                    <span>Collect Payment &amp; Settle Bill (₹{activeInvoice.totalAmount.toLocaleString('en-IN')})</span>
                  </button>
                ) : (
                  <div className="p-3.5 rounded-xl bg-hospital-50 border border-hospital-200 text-hospital-800 text-xs font-bold flex items-center justify-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-hospital-600" />
                    <span>Invoice Fully Settled via {activeInvoice.paymentMethod}</span>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="p-12 lavish-card text-center text-hospital-800 font-semibold text-xs">
              Select an invoice from the list to view itemized charges
            </div>
          )}
        </div>
      </div>

      {/* Settle Modal */}
      {settleModalOpen && activeInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-hospital-950/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-md rounded-2xl bg-white border border-hospital-300 shadow-2xl overflow-hidden">
            <div className="h-1.5 w-full bg-gradient-to-r from-hospital-500 to-hospital-500" />
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-hospital-50">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-hospital-50 text-hospital-700 border border-hospital-200/70">
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-hospital-950 text-base">Collect Bill Payment</h3>
                    <p className="text-xs font-medium text-hospital-900">Invoice #{activeInvoice.id} &bull; Patient: {activeInvoice.patientName}</p>
                  </div>
                </div>
                <button onClick={() => setSettleModalOpen(false)} className="text-hospital-800 hover:text-hospital-950 hover:bg-hospital-50 rounded-lg p-1.5">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSettleSubmit} className="space-y-3.5">
                <div>
                  <label className="text-xs font-bold text-hospital-900 block mb-1">Select Payment Mode</label>
                  <select
                    value={paymentMethod}
                    onChange={e => setPaymentMethod(e.target.value as any)}
                    className="w-full px-3.5 py-2 rounded-xl bg-hospital-50 border border-hospital-300/80 text-xs font-medium text-hospital-950 focus:outline-none focus:border-[#39786B] focus:bg-white transition"
                  >
                    <option value="UPI">UPI / QR Code (Instant Settlement)</option>
                    <option value="Cash">Cash at Counter</option>
                    <option value="Credit/Debit Card">Credit / Debit Card POS</option>
                    <option value="Insurance Cashless (TPA)">Insurance Cashless (TPA)</option>
                  </select>
                </div>

                <div className="p-3.5 rounded-xl bg-hospital-50 border border-hospital-300 text-xs font-mono space-y-1.5">
                  <div className="flex justify-between text-hospital-900 font-semibold">
                    <span>Amount Due:</span>
                    <span>₹{activeInvoice.totalAmount.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between font-bold text-hospital-950 pt-1.5 border-t border-hospital-300">
                    <span>Receivable Amount:</span>
                    <span className="text-hospital-700">₹{activeInvoice.totalAmount.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-gradient-to-r from-hospital-600 to-hospital-600 hover:brightness-105 text-white font-bold text-xs shadow-sm transition"
                  >
                    Confirm Receipt of ₹{activeInvoice.totalAmount.toLocaleString('en-IN')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Manual Generate Bill Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-hospital-950/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-lg rounded-2xl bg-white border border-hospital-300 shadow-2xl overflow-hidden">
            <div className="h-1.5 w-full bg-gradient-to-r from-[#1D4840] via-[#39786B] to-[#39786B]" />
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-hospital-50">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-hospital-50 text-[#39786B] border border-hospital-200/80">
                    <Receipt className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-hospital-950 text-base">Generate Hospital Bill</h3>
                    <p className="text-xs font-medium text-hospital-900">Create tax invoice for clinical or diagnostic services</p>
                  </div>
                </div>
                <button onClick={() => setIsCreateModalOpen(false)} className="text-hospital-800 hover:text-hospital-950 hover:bg-hospital-50 rounded-lg p-1.5">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateSubmit} className="space-y-3.5">
                <div>
                  <label className="text-xs font-bold text-hospital-900 block mb-1">Select Patient *</label>
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
                    className="w-full px-3.5 py-2 rounded-xl bg-hospital-50 border border-hospital-300/80 text-xs font-medium text-hospital-950 focus:outline-none focus:border-[#39786B] focus:bg-white transition"
                  >
                    {patients.map(p => (
                      <option key={p.id} value={p.id}>{p.name} ({p.id} &bull; {p.status})</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-hospital-900 block mb-1">Invoice Type</label>
                    <select
                      value={newInvForm.type}
                      onChange={e => setNewInvForm({ ...newInvForm, type: e.target.value as any })}
                      className="w-full px-3.5 py-2 rounded-xl bg-hospital-50 border border-hospital-300/80 text-xs font-medium text-hospital-950 focus:outline-none focus:border-[#39786B] focus:bg-white transition"
                    >
                      <option value="OPD Consultation">OPD Consultation</option>
                      <option value="IPD Admission">IPD Admission</option>
                      <option value="Diagnostics">Diagnostics / Lab Test</option>
                      <option value="Pharmacy">Pharmacy Dispensation</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-hospital-900 block mb-1">Total Bill Amount (₹) *</label>
                    <input
                      type="number"
                      required
                      value={newInvForm.amount}
                      onChange={e => setNewInvForm({ ...newInvForm, amount: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl bg-hospital-50 border border-hospital-300/80 text-xs text-hospital-950 font-mono font-bold focus:outline-none focus:border-[#39786B] focus:bg-white transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-hospital-900 block mb-1">Service Description</label>
                  <input
                    type="text"
                    value={newInvForm.description}
                    onChange={e => setNewInvForm({ ...newInvForm, description: e.target.value })}
                    placeholder="e.g. OPD Consultation Fee"
                    className="w-full px-3.5 py-2 rounded-xl bg-hospital-50 border border-hospital-300/80 text-xs font-medium text-hospital-950 focus:outline-none focus:border-[#39786B] focus:bg-white transition"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-hospital-900 block mb-1">Initial Status</label>
                    <select
                      value={newInvForm.paymentStatus}
                      onChange={e => setNewInvForm({ ...newInvForm, paymentStatus: e.target.value as any })}
                      className="w-full px-3.5 py-2 rounded-xl bg-hospital-50 border border-hospital-300/80 text-xs font-medium text-hospital-950 focus:outline-none focus:border-[#39786B] focus:bg-white transition"
                    >
                      <option value="Paid">Mark Paid (Settled)</option>
                      <option value="Unpaid">Unpaid (Pending Collection)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-hospital-900 block mb-1">Payment Method</label>
                    <select
                      value={newInvForm.paymentMethod}
                      onChange={e => setNewInvForm({ ...newInvForm, paymentMethod: e.target.value as any })}
                      className="w-full px-3.5 py-2 rounded-xl bg-hospital-50 border border-hospital-300/80 text-xs font-medium text-hospital-950 focus:outline-none focus:border-[#39786B] focus:bg-white transition"
                    >
                      <option value="UPI">UPI</option>
                      <option value="Cash">Cash</option>
                      <option value="Credit/Debit Card">Card</option>
                    </select>
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl btn-zoho-primary text-white font-bold text-xs transition active:scale-[0.98]"
                  >
                    Create Invoice
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
