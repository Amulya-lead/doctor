import React, { useState } from 'react';
import { 
  ShieldAlert, 
  ShieldCheck, 
  Plus, 
  CheckCircle2, 
  Clock, 
  Search, 
  FileText, 
  X,
  Send
} from 'lucide-react';
import { useHospitalOS } from '../../context/HospitalOSContext';

export const InsuranceClaims: React.FC = () => {
  const { patients, addSystemEvent } = useHospitalOS();

  const [claims, setClaims] = useState([
    {
      id: 'CLM-2026-901',
      patientName: 'Aarav Sharma',
      provider: 'Star Health & Allied Insurance',
      policyNo: 'SH-POL-2026-99238',
      claimType: 'Emergency Inpatient (ICU)',
      requestedAmount: 18500,
      approvedAmount: 14500,
      status: 'Pre-Authorized',
      submittedAt: 'Today 16:50'
    }
  ]);

  const [newClaimModal, setNewClaimModal] = useState(false);
  const [patientName, setPatientName] = useState(patients[0]?.name || '');
  const [provider, setProvider] = useState('Star Health Insurance');
  const [policyNo, setPolicyNo] = useState('');
  const [amount, setAmount] = useState('15000');

  const handleCreateClaim = (e: React.FormEvent) => {
    e.preventDefault();
    const newClaim = {
      id: `CLM-${Date.now().toString().slice(-4)}`,
      patientName: patientName || 'Patient',
      provider,
      policyNo: policyNo || `POL-${Date.now().toString().slice(-5)}`,
      claimType: 'Inpatient Hospitalization',
      requestedAmount: parseFloat(amount) || 10000,
      approvedAmount: parseFloat(amount) || 10000,
      status: 'Pre-Authorized',
      submittedAt: 'Just Now'
    };

    setClaims([newClaim, ...claims]);
    setNewClaimModal(false);
    setPolicyNo('');

    addSystemEvent({
      module: 'BILLING',
      title: `TPA Insurance Pre-Auth Dispatched`,
      description: `Dispatched pre-authorization request for ${newClaim.patientName} (${newClaim.provider}) for ₹${newClaim.requestedAmount}`,
      severity: 'info',
      actor: 'TPA Desk'
    });
  };

  return (
    <div className="space-y-6">
      {/* Architectural Workspace Banner */}
      <div className="workspace-banner workspace-banner-insurance p-6 sm:p-7 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-white/15 backdrop-blur-md border border-lavender-300/35 text-[11px] font-bold uppercase tracking-wider text-lavender-200">
            <span>Cashless TPA Pre-Authorization</span>
          </div>
          <h2 className="font-display text-2xl font-extrabold text-white flex items-center gap-2.5 tracking-tight">
            <ShieldAlert className="w-6 h-6 text-lavender-300" />
            <span>Insurance &amp; Cashless TPA Claims Desk</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-100 max-w-2xl">
            File cashless insurance claims, manage TPA pre-authorizations, and track settlement disbursements.
          </p>
        </div>

        <button
          onClick={() => setNewClaimModal(true)}
          className="px-4 py-2.5 rounded-xl bg-white hover:bg-lavender-50 text-[#1C103B] font-bold text-xs flex items-center gap-2 shadow-lg transition active:scale-[0.98] flex-shrink-0"
        >
          <Plus className="w-4 h-4 text-[#4C1D95]" />
          <span>File New Cashless Claim</span>
        </button>
      </div>

      {/* Claims Table */}
      <div className="lavish-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gradient-to-r from-[#F7F5FF] to-[#F1ECFE] border-b border-slate-200/90 text-slate-800 font-bold uppercase text-[11px] tracking-wider">
              <tr>
                <th className="py-3.5 px-4 whitespace-nowrap">Claim ID &amp; Patient</th>
                <th className="py-3.5 px-4 whitespace-nowrap">Insurance Provider</th>
                <th className="py-3.5 px-4 whitespace-nowrap">Policy No</th>
                <th className="py-3.5 px-4 text-right whitespace-nowrap">Requested</th>
                <th className="py-3.5 px-4 text-right whitespace-nowrap">Approved</th>
                <th className="py-3.5 px-4 text-center whitespace-nowrap">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {claims.map(c => (
                <tr key={c.id} className="hover:bg-lavender-50/50 transition-colors">
                  <td className="py-3.5 px-4">
                    <p className="font-display font-bold text-slate-950 text-[13px]">{c.patientName}</p>
                    <p className="text-[11px] text-slate-700 font-medium mt-0.5">
                      <span className="font-mono text-[#4C1D95] font-semibold">{c.id}</span> &bull; {c.claimType}
                    </p>
                  </td>
                  <td className="py-3.5 px-4 text-slate-800 font-semibold">{c.provider}</td>
                  <td className="py-3.5 px-4 font-mono font-medium text-slate-700">{c.policyNo}</td>
                  <td className="py-3.5 px-4 text-right font-mono font-semibold text-slate-800 tabular-nums">₹{c.requestedAmount.toLocaleString('en-IN')}</td>
                  <td className="py-3.5 px-4 text-right font-mono font-bold text-emerald-700 tabular-nums">₹{c.approvedAmount.toLocaleString('en-IN')}</td>
                  <td className="py-3.5 px-4 text-center">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      <span>{c.status}</span>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* New Claim Modal */}
      {newClaimModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-md rounded-2xl bg-white border border-slate-200 shadow-2xl overflow-hidden">
            <div className="h-1.5 w-full bg-gradient-to-r from-[#2D1B69] via-[#6D28D9] to-[#0D9488]" />
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-lavender-50 text-[#4C1D95] border border-lavender-200/80">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-slate-950 text-base">File Cashless TPA Claim</h3>
                    <p className="text-xs font-medium text-slate-700">Submit electronic pre-auth to insurance provider</p>
                  </div>
                </div>
                <button onClick={() => setNewClaimModal(false)} className="text-slate-600 hover:text-slate-950 hover:bg-slate-100 rounded-lg p-1.5">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateClaim} className="space-y-3.5">
                <div>
                  <label className="text-xs font-bold text-slate-800 block mb-1">Patient Name *</label>
                  {patients.length > 0 ? (
                    <select
                      value={patientName}
                      onChange={e => setPatientName(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-300/80 text-xs font-medium text-slate-950 focus:outline-none focus:border-[#5B21B6] focus:bg-white transition"
                    >
                      {patients.map(p => (
                        <option key={p.id} value={p.name}>{p.name}</option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type="text"
                      required
                      placeholder="Patient Name"
                      value={patientName}
                      onChange={e => setPatientName(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-300/80 text-xs font-medium text-slate-950 focus:outline-none focus:border-[#5B21B6] focus:bg-white transition"
                    />
                  )}
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-800 block mb-1">Insurance Company *</label>
                  <select
                    value={provider}
                    onChange={e => setProvider(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-300/80 text-xs font-medium text-slate-950 focus:outline-none focus:border-[#5B21B6] focus:bg-white transition"
                  >
                    <option value="Star Health & Allied Insurance">Star Health & Allied Insurance</option>
                    <option value="HDFC ERGO Health">HDFC ERGO Health</option>
                    <option value="Care Health Insurance">Care Health Insurance</option>
                    <option value="ICICI Lombard">ICICI Lombard</option>
                    <option value="PMJAY Ayushman Bharat">PMJAY Ayushman Bharat</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-800 block mb-1">Policy / Card Number *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. SH-POL-2026-99"
                    value={policyNo}
                    onChange={e => setPolicyNo(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-300/80 text-xs font-medium text-slate-950 focus:outline-none focus:border-[#5B21B6] focus:bg-white transition"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-800 block mb-1">Estimated Hospitalization Expense (₹) *</label>
                  <input
                    type="number"
                    required
                    value={amount}
                    onChange={e => setAmount(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-300/80 text-xs font-mono font-bold text-slate-950 focus:outline-none focus:border-[#5B21B6] focus:bg-white transition"
                  />
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl btn-zoho-primary text-white font-bold text-xs transition active:scale-[0.98]"
                  >
                    Submit Pre-Authorization
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
