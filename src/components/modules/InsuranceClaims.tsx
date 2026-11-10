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
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <ShieldAlert className="w-6 h-6 text-sky-600" />
            <span>Insurance & Cashless TPA Claims Desk</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            File cashless insurance claims, manage TPA pre-authorizations, and track settlement disbursements.
          </p>
        </div>

        <button
          onClick={() => setNewClaimModal(true)}
          className="px-4 py-2 rounded-lg bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs flex items-center gap-2 shadow-sm transition"
        >
          <Plus className="w-4 h-4" />
          <span>+ File New Cashless Claim</span>
        </button>
      </div>

      {/* Claims Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-xs">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase text-[10px] tracking-wider">
            <tr>
              <th className="p-3">Claim ID & Patient</th>
              <th className="p-3">Insurance Provider</th>
              <th className="p-3">Policy No</th>
              <th className="p-3 text-right">Requested</th>
              <th className="p-3 text-right">Approved</th>
              <th className="p-3 text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {claims.map(c => (
              <tr key={c.id} className="hover:bg-slate-50">
                <td className="p-3">
                  <p className="font-bold text-slate-900">{c.patientName}</p>
                  <p className="text-[10px] text-slate-500 font-mono">{c.id} • {c.claimType}</p>
                </td>
                <td className="p-3 text-slate-700 font-medium">{c.provider}</td>
                <td className="p-3 font-mono text-slate-600">{c.policyNo}</td>
                <td className="p-3 text-right font-mono font-medium text-slate-700">₹{c.requestedAmount.toLocaleString('en-IN')}</td>
                <td className="p-3 text-right font-mono font-bold text-emerald-700">₹{c.approvedAmount.toLocaleString('en-IN')}</td>
                <td className="p-3 text-center">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                    {c.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* New Claim Modal */}
      {newClaimModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-2xl bg-white border border-slate-200 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-sky-50 text-sky-600">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">File Cashless TPA Claim</h3>
                  <p className="text-xs text-slate-500">Submit electronic pre-auth to insurance provider</p>
                </div>
              </div>
              <button onClick={() => setNewClaimModal(false)} className="text-slate-400 hover:text-slate-700 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateClaim} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Patient Name *</label>
                {patients.length > 0 ? (
                  <select
                    value={patientName}
                    onChange={e => setPatientName(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-sky-500 focus:bg-white"
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
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-sky-500 focus:bg-white"
                  />
                )}
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Insurance Company *</label>
                <select
                  value={provider}
                  onChange={e => setProvider(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-sky-500 focus:bg-white"
                >
                  <option value="Star Health & Allied Insurance">Star Health & Allied Insurance</option>
                  <option value="HDFC ERGO Health">HDFC ERGO Health</option>
                  <option value="Care Health Insurance">Care Health Insurance</option>
                  <option value="ICICI Lombard">ICICI Lombard</option>
                  <option value="PMJAY Ayushman Bharat">PMJAY Ayushman Bharat</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Policy / Card Number *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. SH-POL-2026-99"
                  value={policyNo}
                  onChange={e => setPolicyNo(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-sky-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Estimated Hospitalization Expense (₹) *</label>
                <input
                  type="number"
                  required
                  value={amount}
                  onChange={e => setAmount(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-xs font-mono text-slate-900 focus:outline-none focus:border-sky-500 focus:bg-white"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setNewClaimModal(false)}
                  className="px-4 py-2 rounded-lg text-xs font-medium text-slate-600 hover:text-slate-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs shadow-sm transition"
                >
                  Submit Pre-Authorization
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
