import React, { useState, useEffect, useMemo } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  Plus,
  CheckCircle2,
  Clock,
  Search,
  FileText,
  X,
  Send,
  TrendingUp,
  Download,
  Printer,
  Sparkles,
  ArrowUpRight,
  Filter,
  Building2,
  BadgeCheck,
  Eye
} from 'lucide-react';
import { useHospitalOS } from '../../context/HospitalOSContext';

const STORAGE_KEY = 'hospital_os_insurance_claims';

interface InsuranceClaimItem {
  id: string;
  patientName: string;
  provider: string;
  policyNo: string;
  claimType: string;
  requestedAmount: number;
  approvedAmount: number;
  status: 'Pre-Authorized' | 'Under Review' | 'Settled' | 'Dispatched';
  submittedAt: string;
}

const INITIAL_MOCK_CLAIMS: InsuranceClaimItem[] = [
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
  },
  {
    id: 'CLM-2026-884',
    patientName: 'Meera Nambiar',
    provider: 'HDFC ERGO Health',
    policyNo: 'HE-2026-00412',
    claimType: 'Cardiology Diagnostics & Angio',
    requestedAmount: 32000,
    approvedAmount: 30000,
    status: 'Settled',
    submittedAt: 'Yesterday 11:20'
  },
  {
    id: 'CLM-2026-872',
    patientName: 'Rohan Deshmukh',
    provider: 'Care Health Insurance',
    policyNo: 'CHI-902-8411',
    claimType: 'Orthopedic Daycare Surgery',
    requestedAmount: 45000,
    approvedAmount: 40000,
    status: 'Under Review',
    submittedAt: '2 days ago'
  }
];

export const InsuranceClaims: React.FC = () => {
  const { patients, addSystemEvent, currentTenant } = useHospitalOS();

  // 1. Storage persistence
  const [claims, setClaims] = useState<InsuranceClaimItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.warn('Failed to load insurance claims from localStorage', e);
    }
    return INITIAL_MOCK_CLAIMS;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(claims));
    } catch (e) {
      console.error('Failed to save insurance claims to localStorage', e);
    }
  }, [claims]);

  // UI state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatusTab, setSelectedStatusTab] = useState<'ALL' | 'Pre-Authorized' | 'Under Review' | 'Settled'>('ALL');
  const [providerFilter, setProviderFilter] = useState('ALL');
  const [newClaimModal, setNewClaimModal] = useState(false);
  const [viewVoucherClaim, setViewVoucherClaim] = useState<InsuranceClaimItem | null>(null);

  // Form state
  const [patientName, setPatientName] = useState(patients[0]?.name || '');
  const [provider, setProvider] = useState('Star Health & Allied Insurance');
  const [policyNo, setPolicyNo] = useState('');
  const [amount, setAmount] = useState('25000');
  const [claimType, setClaimType] = useState('Inpatient Hospitalization');

  // KPI Calculations
  const stats = useMemo(() => {
    const totalRequested = claims.reduce((acc, c) => acc + (c.requestedAmount || 0), 0);
    const totalApproved = claims.reduce((acc, c) => acc + (c.approvedAmount || 0), 0);
    const preAuthCount = claims.filter(c => c.status === 'Pre-Authorized').length;
    const approvalRate = totalRequested > 0 ? Math.round((totalApproved / totalRequested) * 100) : 92;
    return { totalRequested, totalApproved, preAuthCount, approvalRate };
  }, [claims]);

  // Filtered claims
  const filteredClaims = useMemo(() => {
    return claims.filter(c => {
      const matchesSearch =
        c.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.policyNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.id.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = selectedStatusTab === 'ALL' || c.status === selectedStatusTab;
      const matchesProvider = providerFilter === 'ALL' || c.provider === providerFilter;

      return matchesSearch && matchesStatus && matchesProvider;
    });
  }, [claims, searchQuery, selectedStatusTab, providerFilter]);

  const handleCreateClaim = (e: React.FormEvent) => {
    e.preventDefault();
    const reqAmt = parseFloat(amount) || 15000;
    // Approves 85-95% by default for instant cashless pre-authorization
    const appAmt = Math.round(reqAmt * 0.90);

    const newClaim: InsuranceClaimItem = {
      id: `CLM-${Date.now().toString().slice(-4)}`,
      patientName: patientName || 'Patient',
      provider,
      policyNo: policyNo || `POL-${Date.now().toString().slice(-5)}`,
      claimType,
      requestedAmount: reqAmt,
      approvedAmount: appAmt,
      status: 'Pre-Authorized',
      submittedAt: 'Just Now'
    };

    setClaims(prev => [newClaim, ...prev]);
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
    <div className="space-y-6 font-sans">
      {/* 1. Header Hero Banner with Zoho-styled gradient */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#10221F] via-[#1D4840] to-[#10221F] p-6 sm:p-8 text-white shadow-xl border border-[#39786B]/30">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-80 h-80 bg-[#39786B]/25 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-5">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-[#B7D3C6]/30 text-xs font-semibold uppercase tracking-wider text-[#B7D3C6]">
              <Sparkles className="w-3.5 h-3.5 text-[#B7D3C6]" />
              <span>Cashless TPA Fast-Track Desk</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-3">
              <ShieldAlert className="w-7 h-7 text-[#B7D3C6]" />
              <span>Insurance &amp; Cashless TPA Claims</span>
            </h2>
            <p className="text-xs sm:text-sm text-[#E7F0E9]/90 max-w-2xl font-normal leading-relaxed">
              Instant electronic pre-authorization, real-time TPA cashless approvals, and automated billing reconciliations.
            </p>
          </div>

          <button
            onClick={() => setNewClaimModal(true)}
            className="px-5 py-3 rounded-xl bg-gradient-to-r from-[#39786B] to-[#1D4840] hover:from-[#1D4840] hover:to-[#39786B] border border-[#B7D3C6]/40 text-white font-bold text-xs flex items-center gap-2.5 shadow-lg shadow-[#10221F]/30 transition-all duration-200 hover:-translate-y-0.5 active:scale-[0.98] flex-shrink-0 cursor-pointer"
          >
            <Plus className="w-4 h-4 text-[#B7D3C6]" />
            <span>File New Cashless Claim</span>
          </button>
        </div>
      </div>

      {/* 2. KPI Metrics Bar with Mouse Hover Elevation */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="group rounded-2xl bg-white p-5 border border-[#B7D3C6]/70 shadow-xs hover:border-[#39786B] hover:shadow-md hover:-translate-y-1 transition-all duration-200 cursor-pointer">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#1D4840]/70">Total Requested</span>
            <div className="w-8 h-8 rounded-lg bg-[#E7F0E9] text-[#1D4840] flex items-center justify-center group-hover:bg-[#39786B] group-hover:text-white transition-colors duration-200">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <p className="mt-3 text-2xl font-extrabold text-[#10221F] font-mono tabular-nums">
            ₹{stats.totalRequested.toLocaleString('en-IN')}
          </p>
          <div className="mt-1 flex items-center gap-1.5 text-[11px] text-[#39786B] font-medium">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>{claims.length} claims submitted</span>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="group rounded-2xl bg-white p-5 border border-[#B7D3C6]/70 shadow-xs hover:border-[#39786B] hover:shadow-md hover:-translate-y-1 transition-all duration-200 cursor-pointer">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#1D4840]/70">Approved Cashless</span>
            <div className="w-8 h-8 rounded-lg bg-[#E7F0E9] text-[#39786B] flex items-center justify-center group-hover:bg-[#39786B] group-hover:text-white transition-colors duration-200">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <p className="mt-3 text-2xl font-extrabold text-[#39786B] font-mono tabular-nums">
            ₹{stats.totalApproved.toLocaleString('en-IN')}
          </p>
          <div className="mt-1 flex items-center gap-1.5 text-[11px] text-[#1D4840] font-medium">
            <span>Disbursed direct to hospital ledger</span>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="group rounded-2xl bg-white p-5 border border-[#B7D3C6]/70 shadow-xs hover:border-[#39786B] hover:shadow-md hover:-translate-y-1 transition-all duration-200 cursor-pointer">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#1D4840]/70">Pre-Authorized</span>
            <div className="w-8 h-8 rounded-lg bg-[#E7F0E9] text-[#1D4840] flex items-center justify-center group-hover:bg-[#39786B] group-hover:text-white transition-colors duration-200">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <p className="mt-3 text-2xl font-extrabold text-[#10221F] font-mono tabular-nums">
            {stats.preAuthCount} Active
          </p>
          <div className="mt-1 flex items-center gap-1.5 text-[11px] text-[#39786B] font-medium">
            <span className="w-2 h-2 rounded-full bg-[#39786B] animate-pulse" />
            <span>Ready for bed discharge</span>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="group rounded-2xl bg-white p-5 border border-[#B7D3C6]/70 shadow-xs hover:border-[#39786B] hover:shadow-md hover:-translate-y-1 transition-all duration-200 cursor-pointer">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#1D4840]/70">Settlement Ratio</span>
            <div className="w-8 h-8 rounded-lg bg-[#E7F0E9] text-[#39786B] flex items-center justify-center group-hover:bg-[#39786B] group-hover:text-white transition-colors duration-200">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <p className="mt-3 text-2xl font-extrabold text-[#10221F] font-mono tabular-nums">
            {stats.approvalRate}%
          </p>
          <div className="mt-1 flex items-center gap-1.5 text-[11px] text-[#39786B] font-medium">
            <span>Avg turnaround: ~35 mins</span>
          </div>
        </div>
      </div>

      {/* 3. Filter Bar & Search Toolbar */}
      <div className="rounded-2xl bg-white p-4 border border-[#B7D3C6]/80 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Status Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          {(['ALL', 'Pre-Authorized', 'Under Review', 'Settled'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setSelectedStatusTab(tab)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all duration-150 cursor-pointer whitespace-nowrap ${selectedStatusTab === tab
                ? 'bg-[#1D4840] text-white shadow-xs'
                : 'bg-[#E7F0E9] text-[#1D4840] hover:bg-[#B7D3C6]/60'
                }`}
            >
              {tab === 'ALL' ? `All Claims (${claims.length})` : tab}
            </button>
          ))}
        </div>

        {/* Search & Provider Filter */}
        <div className="flex items-center gap-2.5">
          <div className="relative flex-1 md:w-64">
            <Search className="w-3.5 h-3.5 text-[#1D4840]/60 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search patient, policy or ID..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-[#E7F0E9]/60 border border-[#B7D3C6] text-xs font-medium text-[#10221F] placeholder-[#1D4840]/50 focus:outline-none focus:bg-white focus:border-[#39786B] transition-all duration-150"
            />
          </div>

          <select
            value={providerFilter}
            onChange={e => setProviderFilter(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-[#E7F0E9]/60 border border-[#B7D3C6] text-xs font-bold text-[#1D4840] focus:outline-none focus:bg-white focus:border-[#39786B] transition cursor-pointer"
          >
            <option value="ALL">All Insurers</option>
            <option value="Star Health & Allied Insurance">Star Health</option>
            <option value="HDFC ERGO Health">HDFC ERGO</option>
            <option value="Care Health Insurance">Care Health</option>
            <option value="ICICI Lombard">ICICI Lombard</option>
            <option value="PMJAY Ayushman Bharat">PMJAY</option>
          </select>
        </div>
      </div>

      {/* 4. Claims Table with Hover Gliding */}
      <div className="rounded-2xl bg-white border border-[#B7D3C6]/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#E7F0E9] border-b border-[#B7D3C6] text-[#10221F] font-bold uppercase text-[11px] tracking-wider">
              <tr>
                <th className="py-3.5 px-4 whitespace-nowrap">Claim ID &amp; Patient</th>
                <th className="py-3.5 px-4 whitespace-nowrap">Insurance Provider</th>
                <th className="py-3.5 px-4 whitespace-nowrap">Policy Number</th>
                <th className="py-3.5 px-4 text-right whitespace-nowrap">Requested</th>
                <th className="py-3.5 px-4 text-right whitespace-nowrap">Approved Limit</th>
                <th className="py-3.5 px-4 text-center whitespace-nowrap">TPA Status</th>
                <th className="py-3.5 px-4 text-center whitespace-nowrap">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E7F0E9]">
              {filteredClaims.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-xs text-[#1D4840]/70 font-medium">
                    No claims match your filter criteria.
                  </td>
                </tr>
              ) : (
                filteredClaims.map(c => (
                  <tr
                    key={c.id}
                    onClick={() => setViewVoucherClaim(c)}
                    className="hover:bg-[#E7F0E9]/60 transition-colors duration-150 cursor-pointer group"
                  >
                    <td className="py-3.5 px-4">
                      <p className="font-bold text-[#10221F] text-[13px] group-hover:text-[#39786B] transition-colors duration-150">
                        {c.patientName}
                      </p>
                      <p className="text-[11px] text-[#1D4840]/80 font-medium mt-0.5">
                        <span className="font-mono text-[#39786B] font-bold">{c.id}</span> &bull; {c.claimType}
                      </p>
                    </td>
                    <td className="py-3.5 px-4 text-[#10221F] font-semibold">{c.provider}</td>
                    <td className="py-3.5 px-4 font-mono font-medium text-[#1D4840]">{c.policyNo}</td>
                    <td className="py-3.5 px-4 text-right font-mono font-semibold text-[#10221F] tabular-nums">
                      ₹{c.requestedAmount.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono font-bold text-[#39786B] tabular-nums text-sm">
                      ₹{c.approvedAmount.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border ${c.status === 'Pre-Authorized'
                        ? 'bg-[#E7F0E9] text-[#1D4840] border-[#39786B]'
                        : c.status === 'Settled'
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                          : 'bg-amber-50 text-amber-800 border-amber-300'
                        }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${c.status === 'Pre-Authorized' ? 'bg-[#39786B] animate-pulse' : c.status === 'Settled' ? 'bg-emerald-600' : 'bg-amber-500'
                          }`} />
                        <span>{c.status}</span>
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center" onClick={e => e.stopPropagation()}>
                      <button
                        onClick={() => setViewVoucherClaim(c)}
                        className="px-3 py-1 rounded-lg bg-[#E7F0E9] hover:bg-[#39786B] text-[#1D4840] hover:text-white border border-[#B7D3C6] text-[11px] font-bold transition-all duration-150 flex items-center gap-1 mx-auto cursor-pointer"
                        title="View Cashless Pre-Auth Letter"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Voucher</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 5. Digital Cashless Pre-Authorization Voucher Modal */}
      {viewVoucherClaim && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#10221F]/65 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-lg rounded-2xl bg-white border border-[#B7D3C6] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150">
            {/* Top header bar */}
            <div className="bg-gradient-to-r from-[#10221F] to-[#1D4840] p-5 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-white/10 border border-[#B7D3C6]/30">
                  <BadgeCheck className="w-5 h-5 text-[#B7D3C6]" />
                </div>
                <div>
                  <h3 className="font-extrabold text-white text-base">Cashless Pre-Auth Voucher</h3>
                  <p className="text-xs text-[#E7F0E9]/80 font-mono">Ref: {viewVoucherClaim.id}</p>
                </div>
              </div>
              <button
                onClick={() => setViewVoucherClaim(null)}
                className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Voucher Details Body */}
            <div className="p-6 space-y-5 text-xs text-[#10221F]">
              <div className="p-4 rounded-xl bg-[#E7F0E9]/70 border border-[#B7D3C6] space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-[#1D4840] uppercase tracking-wider text-[10px]">TPA Provider</span>
                  <span className="font-bold text-[#10221F]">{viewVoucherClaim.provider}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-bold text-[#1D4840] uppercase tracking-wider text-[10px]">Patient Name</span>
                  <span className="font-bold text-[#10221F] text-sm">{viewVoucherClaim.patientName}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-bold text-[#1D4840] uppercase tracking-wider text-[10px]">Policy / Health ID</span>
                  <span className="font-mono font-semibold text-[#10221F]">{viewVoucherClaim.policyNo}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-bold text-[#1D4840] uppercase tracking-wider text-[10px]">Hospital Facility</span>
                  <span className="font-semibold text-[#10221F]">{currentTenant?.name || 'City Care Multi-Specialty Hospital'}</span>
                </div>
              </div>

              {/* Approval Numbers */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3.5 rounded-xl border border-[#B7D3C6] bg-white">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[#1D4840]/70">Requested Expense</p>
                  <p className="mt-1 text-lg font-mono font-bold text-[#10221F]">
                    ₹{viewVoucherClaim.requestedAmount.toLocaleString('en-IN')}
                  </p>
                </div>
                <div className="p-3.5 rounded-xl border border-[#39786B] bg-[#E7F0E9]">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[#1D4840]">Pre-Approved Limit</p>
                  <p className="mt-1 text-xl font-mono font-extrabold text-[#39786B]">
                    ₹{viewVoucherClaim.approvedAmount.toLocaleString('en-IN')}
                  </p>
                </div>
              </div>

              <div className="rounded-xl border border-[#B7D3C6] p-3 text-[11px] text-[#1D4840] flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#39786B] flex-shrink-0" />
                <span>Digitally signed &amp; verified via ABDM / PMJAY Health Insurance Gateway.</span>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-[#E7F0E9]">
                <button
                  onClick={() => alert(`Pre-Auth Slip ${viewVoucherClaim.id} printed to clinical desk spooler.`)}
                  className="px-4 py-2 rounded-xl border border-[#B7D3C6] hover:bg-[#E7F0E9] text-[#10221F] font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Slip</span>
                </button>
                <button
                  onClick={() => alert(`Pre-Authorization Dossier for ${viewVoucherClaim.patientName} downloaded as PDF.`)}
                  className="px-4 py-2 rounded-xl bg-[#39786B] hover:bg-[#1D4840] text-white font-bold text-xs flex items-center gap-1.5 transition cursor-pointer shadow-sm"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Voucher</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 6. New Cashless Claim Submission Modal */}
      {newClaimModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#10221F]/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-md rounded-2xl bg-white border border-[#B7D3C6] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150">
            <div className="h-1.5 w-full bg-gradient-to-r from-[#10221F] via-[#39786B] to-[#79A99A]" />
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#E7F0E9]">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-[#E7F0E9] text-[#39786B] border border-[#B7D3C6]">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-[#10221F] text-base">File Cashless TPA Claim</h3>
                    <p className="text-xs font-medium text-[#1D4840]/80">Submit electronic pre-auth to insurance gateway</p>
                  </div>
                </div>
                <button
                  onClick={() => setNewClaimModal(false)}
                  className="text-[#1D4840] hover:text-[#10221F] hover:bg-[#E7F0E9] rounded-lg p-1.5 transition cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateClaim} className="space-y-3.5 text-xs">
                <div>
                  <label className="font-bold text-[#10221F] block mb-1">Patient Name *</label>
                  {patients.length > 0 ? (
                    <select
                      value={patientName}
                      onChange={e => setPatientName(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl bg-[#E7F0E9]/60 border border-[#B7D3C6] font-medium text-[#10221F] focus:outline-none focus:border-[#39786B] focus:bg-white transition cursor-pointer"
                    >
                      {patients.map(p => (
                        <option key={p.id} value={p.name}>{p.name} ({p.id})</option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type="text"
                      required
                      placeholder="Patient Name"
                      value={patientName}
                      onChange={e => setPatientName(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl bg-[#E7F0E9]/60 border border-[#B7D3C6] font-medium text-[#10221F] focus:outline-none focus:border-[#39786B] focus:bg-white transition"
                    />
                  )}
                </div>

                <div>
                  <label className="font-bold text-[#10221F] block mb-1">Insurance Provider *</label>
                  <select
                    value={provider}
                    onChange={e => setProvider(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-[#E7F0E9]/60 border border-[#B7D3C6] font-medium text-[#10221F] focus:outline-none focus:border-[#39786B] focus:bg-white transition cursor-pointer"
                  >
                    <option value="Star Health & Allied Insurance">Star Health & Allied Insurance</option>
                    <option value="HDFC ERGO Health">HDFC ERGO Health</option>
                    <option value="Care Health Insurance">Care Health Insurance</option>
                    <option value="ICICI Lombard">ICICI Lombard</option>
                    <option value="PMJAY Ayushman Bharat">PMJAY Ayushman Bharat</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-[#10221F] block mb-1">Admission / Care Category</label>
                  <select
                    value={claimType}
                    onChange={e => setClaimType(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-[#E7F0E9]/60 border border-[#B7D3C6] font-medium text-[#10221F] focus:outline-none focus:border-[#39786B] focus:bg-white transition cursor-pointer"
                  >
                    <option value="Inpatient Hospitalization">Inpatient Hospitalization</option>
                    <option value="Emergency Inpatient (ICU)">Emergency Inpatient (ICU)</option>
                    <option value="Cardiology Diagnostics & Angio">Cardiology Diagnostics & Angio</option>
                    <option value="Orthopedic Daycare Surgery">Orthopedic Daycare Surgery</option>
                    <option value="Oncology Chemotherapy Daycare">Oncology Chemotherapy Daycare</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-[#10221F] block mb-1">Policy / Card Number *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. SH-POL-2026-99238"
                    value={policyNo}
                    onChange={e => setPolicyNo(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-[#E7F0E9]/60 border border-[#B7D3C6] font-medium text-[#10221F] focus:outline-none focus:border-[#39786B] focus:bg-white transition"
                  />
                </div>

                <div>
                  <label className="font-bold text-[#10221F] block mb-1">Estimated Hospitalization Expense (₹) *</label>
                  <input
                    type="number"
                    required
                    value={amount}
                    onChange={e => setAmount(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-[#E7F0E9]/60 border border-[#B7D3C6] font-mono font-bold text-[#10221F] focus:outline-none focus:border-[#39786B] focus:bg-white transition"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setNewClaimModal(false)}
                    className="px-4 py-2 rounded-xl border border-[#B7D3C6] text-[#1D4840] font-bold transition hover:bg-[#E7F0E9] cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-[#39786B] hover:bg-[#1D4840] text-white font-bold transition active:scale-[0.98] shadow-sm cursor-pointer"
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