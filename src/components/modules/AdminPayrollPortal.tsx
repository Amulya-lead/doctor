import React, { useState, useMemo } from 'react';
import { 
  DollarSign, 
  PlusCircle, 
  MinusCircle, 
  Send, 
  Search, 
  Sparkles, 
  AlertTriangle,
  Building2,
  Trash2,
  CheckCircle2,
  X,
  UserPlus,
  Users,
  RotateCcw,
  Check,
  UserCheck
} from 'lucide-react';
import { useHospitalOS } from '../../context/HospitalOSContext';
import { StaffEmployee, UserRole } from '../../types';
import { STANDARD_DEPARTMENTS, STANDARD_STAFF_ROLES } from '../../data/mockData';

const STAFF_AVATAR_THEMES = [
  'from-[#2D1B69] to-[#6D28D9] shadow-lavender-700/20',
  'from-[#0D9488] to-[#10B981] shadow-teal-500/20',
  'from-[#4C1D95] to-[#7C3AED] shadow-lavender-700/20',
  'from-[#0284C7] to-[#2563EB] shadow-sky-500/20'
];

function getStaffInitials(name: string): string {
  const words = name.replace(/^(Dr\.|Mr\.|Ms\.|Mrs\.)\s+/i, '').trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return 'ST';
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return (words[0][0] + words[1][0]).toUpperCase();
}

export const AdminPayrollPortal: React.FC = () => {
  const { 
    staff, 
    addStaffMember, 
    removeStaffMember, 
    giveBonus, 
    deductSalary, 
    disburseSalary, 
    disburseAllSalaries, 
    resetPayrollCycle,
    populateDefaultStaffRoster,
    currentTenant 
  } = useHospitalOS();

  const [search, setSearch] = useState('');
  const [selectedDept, setSelectedDept] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'Paid' | 'Pending'>('ALL');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Modal states
  const [isAddStaffModalOpen, setIsAddStaffModalOpen] = useState(false);
  const [newStaffForm, setNewStaffForm] = useState({
    name: '',
    role: 'doctor' as UserRole,
    designation: '',
    department: 'General Medicine',
    baseSalary: '75000',
    incentives: '8000',
    shift: 'General (09:00 - 18:00)' as StaffEmployee['shift'],
    phone: '',
    email: ''
  });

  const [bonusModalStaff, setBonusModalStaff] = useState<StaffEmployee | null>(null);
  const [bonusAmount, setBonusAmount] = useState<string>('5000');
  const [bonusReason, setBonusReason] = useState<string>('Emergency ICU Duty & Overtime');

  const [deductModalStaff, setDeductModalStaff] = useState<StaffEmployee | null>(null);
  const [deductAmount, setDeductAmount] = useState<string>('2000');
  const [deductReason, setDeductReason] = useState<string>('Unexcused Shift Absence & Penalty');

  // Compute metrics in a single O(N) pass
  const { totalBonuses, totalDeductions, totalNet, paidCount, pendingCount } = useMemo(() => {
    let bonuses = 0;
    let deductions = 0;
    let netSum = 0;
    let paid = 0;
    for (const s of staff) {
      bonuses += s.bonuses || 0;
      deductions += s.deductions || 0;
      const net = s.baseSalary + s.incentives + (s.bonuses || 0) - (s.deductions || 0) - (s.baseSalary * 0.12) - 200;
      netSum += Math.max(0, net);
      if (s.salaryStatus === 'Paid') paid++;
    }
    return {
      totalBonuses: bonuses,
      totalDeductions: deductions,
      totalNet: netSum,
      paidCount: paid,
      pendingCount: staff.length - paid
    };
  }, [staff]);

  // Filter staff
  const filteredStaff = useMemo(() => {
    const q = search.trim().toLowerCase();
    const deptLower = selectedDept.toLowerCase();
    return staff.filter(s => {
      const matchesSearch = !q ||
        s.name.toLowerCase().includes(q) ||
        s.designation.toLowerCase().includes(q) ||
        s.id.toLowerCase().includes(q) ||
        s.department.toLowerCase().includes(q);
      const matchesDept = selectedDept === 'ALL' || s.department.toLowerCase().includes(deptLower);
      const matchesStatus = statusFilter === 'ALL' || (s.salaryStatus || 'Pending') === statusFilter;
      return matchesSearch && matchesDept && matchesStatus;
    });
  }, [staff, search, selectedDept, statusFilter]);

  // Unique departments for filter chips
  const activeDepartments = useMemo(
    () => ['ALL', ...Array.from(new Set(staff.map(s => s.department)))],
    [staff]
  );

  const handleAddStaffSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStaffForm.name.trim()) return;

    addStaffMember({
      name: newStaffForm.name.trim(),
      role: newStaffForm.role,
      designation: newStaffForm.designation.trim() || (newStaffForm.role === 'doctor' ? 'Consultant Physician' : 'Staff Member'),
      department: newStaffForm.department,
      baseSalary: parseFloat(newStaffForm.baseSalary) || 45000,
      incentives: parseFloat(newStaffForm.incentives) || 0,
      shift: newStaffForm.shift,
      phone: newStaffForm.phone || '+91 98765 43210',
      email: newStaffForm.email || `${newStaffForm.name.toLowerCase().replace(/[^a-z0-9]/g, '')}@hospital.in`
    });

    showToast(`Staff member "${newStaffForm.name}" registered successfully.`);

    setNewStaffForm({
      name: '',
      role: 'doctor',
      designation: '',
      department: 'General Medicine',
      baseSalary: '75000',
      incentives: '8000',
      shift: 'General (09:00 - 18:00)',
      phone: '',
      email: ''
    });
    setIsAddStaffModalOpen(false);
  };

  const handleGiveBonus = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bonusModalStaff) return;
    const amount = parseFloat(bonusAmount);
    if (isNaN(amount) || amount <= 0) return;
    giveBonus(bonusModalStaff.id, amount, bonusReason);
    showToast(`Granted +₹${amount.toLocaleString('en-IN')} bonus to ${bonusModalStaff.name}`);
    setBonusModalStaff(null);
  };

  const handleDeductSalary = (e: React.FormEvent) => {
    e.preventDefault();
    if (!deductModalStaff) return;
    const amount = parseFloat(deductAmount);
    if (isNaN(amount) || amount <= 0) return;
    deductSalary(deductModalStaff.id, amount, deductReason);
    showToast(`Deducted -₹${amount.toLocaleString('en-IN')} from ${deductModalStaff.name}`);
    setDeductModalStaff(null);
  };

  const handleDisburseSingle = (emp: StaffEmployee) => {
    disburseSalary(emp.id);
    showToast(`Disbursed monthly salary to ${emp.name}`);
  };

  const handleBatchDisburse = () => {
    disburseAllSalaries();
    showToast(`All pending staff salaries (${pendingCount}) disbursed successfully!`);
  };

  const handleResetCycle = () => {
    resetPayrollCycle();
    showToast('Monthly payroll cycle reset. All staff marked as Pending.');
  };

  const handleLoad20Staff = () => {
    populateDefaultStaffRoster();
    showToast('Loaded full 20-member hospital medical & clinical staff roster!');
  };

  const handleRoleChange = (role: UserRole) => {
    let defaultTitle = 'Staff Member';
    let defaultDept = 'General Medicine';
    let defaultSalary = '50000';

    if (role === 'doctor') {
      defaultTitle = 'Consultant Physician';
      defaultDept = 'General Medicine';
      defaultSalary = '90000';
    } else if (role === 'nurse') {
      defaultTitle = 'Staff Nurse (Ward Care)';
      defaultDept = 'Nursing & Inpatient Wards';
      defaultSalary = '42000';
    } else if (role === 'pharmacist') {
      defaultTitle = 'Hospital Pharmacist';
      defaultDept = 'Hospital Pharmacy';
      defaultSalary = '45000';
    } else if (role === 'lab_tech') {
      defaultTitle = 'Medical Lab Technologist';
      defaultDept = 'Pathology & Laboratory';
      defaultSalary = '44000';
    } else if (role === 'admin') {
      defaultTitle = 'Hospital Administrator';
      defaultDept = 'Hospital Administration & HR';
      defaultSalary = '80000';
    } else if (role === 'accountant') {
      defaultTitle = 'Billing & Accounts Officer';
      defaultDept = 'Billing & Accounts';
      defaultSalary = '50000';
    } else if (role === 'receptionist') {
      defaultTitle = 'Frontdesk Patient Coordinator';
      defaultDept = 'Hospital Administration & HR';
      defaultSalary = '32000';
    }

    setNewStaffForm({
      ...newStaffForm,
      role,
      designation: defaultTitle,
      department: defaultDept,
      baseSalary: defaultSalary
    });
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-xl flex items-center gap-3 border border-slate-700 animate-in fade-in slide-in-from-top-4 duration-200">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
          <span className="text-xs font-semibold">{toastMessage}</span>
          <button onClick={() => setToastMessage(null)} className="text-slate-400 hover:text-white ml-2">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Architectural Workspace Banner */}
      <div className="workspace-banner workspace-banner-payroll p-6 sm:p-7 text-white flex flex-col xl:flex-row xl:items-center justify-between gap-5">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-0.5 rounded-full text-[11px] font-bold uppercase bg-white/15 backdrop-blur-md border border-lavender-300/30 text-lavender-100 tracking-wider">
              Admin Exclusive Portal
            </span>
            <span className="text-xs text-slate-100 font-semibold">{currentTenant.name}</span>
          </div>
          <h2 className="font-display text-2xl sm:text-[1.65rem] font-extrabold text-white flex items-center gap-2.5 tracking-tight">
            <span className="w-9 h-9 rounded-xl bg-white/15 border border-white/20 flex items-center justify-center flex-shrink-0">
              <DollarSign className="w-5 h-5 text-emerald-300" />
            </span>
            <span>Hospital Staff &amp; Payroll Desk</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-100 max-w-2xl leading-relaxed">
            Add doctors, nurses, and hospital staff. Award performance bonuses (+₹), apply roster deductions (-₹), and disburse monthly pay.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 flex-shrink-0">
          <button
            onClick={handleLoad20Staff}
            title="Populate complete 20-member hospital staff roster across all departments"
            className="px-3.5 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 backdrop-blur-md border border-white/25 text-white font-bold text-xs flex items-center gap-1.5 whitespace-nowrap transition active:scale-[0.98]"
          >
            <Users className="w-4 h-4 text-lavender-300" />
            <span>Load 20 Staff</span>
          </button>

          <button
            onClick={() => setIsAddStaffModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-white hover:bg-lavender-50 text-[#1C103B] font-bold text-xs flex items-center gap-1.5 shadow-lg whitespace-nowrap transition active:scale-[0.98]"
          >
            <UserPlus className="w-4 h-4 text-[#4C1D95]" />
            <span>Add Staff</span>
          </button>

          {pendingCount > 0 ? (
            <button
              onClick={handleBatchDisburse}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:brightness-105 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-emerald-500/25 whitespace-nowrap transition active:scale-[0.98]"
            >
              <Send className="w-4 h-4" />
              <span>Disburse All ({pendingCount})</span>
            </button>
          ) : (
            <button
              onClick={handleResetCycle}
              title="Reset disbursement cycle to Pending for the new month"
              className="px-4 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 border border-white/25 text-white font-bold text-xs flex items-center gap-1.5 whitespace-nowrap transition active:scale-[0.98]"
            >
              <RotateCcw className="w-4 h-4 text-slate-100" />
              <span>New Month Cycle</span>
            </button>
          )}
        </div>
      </div>

      {/* Lavish Financial Metrics Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="relative overflow-hidden lavish-card lavish-card-hover p-5">
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#2D1B69] to-[#6D28D9]" />
          <div className="flex items-center justify-between gap-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-700">Total Monthly Net Payroll</span>
            <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#2D1B69] to-[#6D28D9] text-white flex items-center justify-center shadow-xs flex-shrink-0">
              <Building2 className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-2.5 font-display text-2xl font-extrabold text-slate-950 font-mono tracking-tight">
            ₹{Math.round(totalNet).toLocaleString('en-IN')}
          </div>
          <p className="mt-1 text-xs font-medium text-slate-700">
            Across {staff.length} Doctors, Nurses &amp; Staff
          </p>
        </div>

        <div className="relative overflow-hidden lavish-card lavish-card-hover p-5">
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-emerald-500 to-teal-500" />
          <div className="flex items-center justify-between gap-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800">Total Bonuses Awarded</span>
            <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 text-white flex items-center justify-center shadow-xs flex-shrink-0">
              <Sparkles className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-2.5 font-display text-2xl font-extrabold text-emerald-700 font-mono tracking-tight">
            +₹{totalBonuses.toLocaleString('en-IN')}
          </div>
          <p className="mt-1 text-xs font-medium text-slate-700">
            Performance rewards &amp; overtime
          </p>
        </div>

        <div className="relative overflow-hidden lavish-card lavish-card-hover p-5">
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-rose-500 to-orange-500" />
          <div className="flex items-center justify-between gap-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-rose-800">Deductions &amp; Penalties</span>
            <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-rose-500 to-pink-600 text-white flex items-center justify-center shadow-xs flex-shrink-0">
              <AlertTriangle className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-2.5 font-display text-2xl font-extrabold text-rose-700 font-mono tracking-tight">
            -₹{totalDeductions.toLocaleString('en-IN')}
          </div>
          <p className="mt-1 text-xs font-medium text-slate-700">
            Absences &amp; roster adjustments
          </p>
        </div>

        <div className="relative overflow-hidden lavish-card lavish-card-hover p-5">
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#4C1D95] to-[#7C3AED]" />
          <div className="flex items-center justify-between gap-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#4C1D95]">Disbursement Progress</span>
            <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#4C1D95] to-[#7C3AED] text-white flex items-center justify-center shadow-xs flex-shrink-0">
              <CheckCircle2 className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-2.5 flex items-baseline justify-between gap-2">
            <div className="font-display text-2xl font-extrabold text-slate-950 font-mono flex items-baseline gap-1.5">
              <span>{paidCount}</span>
              <span className="text-xs font-sans font-semibold text-slate-700">/ {staff.length} Disbursed</span>
            </div>
            <span className="font-mono text-xs font-bold text-[#4C1D95] bg-lavender-50 border border-lavender-200/80 px-2 py-0.5 rounded-md">
              {staff.length > 0 ? Math.round((paidCount / staff.length) * 100) : 0}%
            </span>
          </div>
          <div className="mt-2.5 w-full bg-slate-100 rounded-full h-2 overflow-hidden">
            <div
              className="bg-gradient-to-r from-[#5B21B6] to-[#10B981] h-full rounded-full transition-all duration-300"
              style={{ width: `${staff.length > 0 ? (paidCount / staff.length) * 100 : 0}%` }}
            />
          </div>
        </div>
      </div>

      {/* Dual-Row Clean Search & Department Filter Command Card */}
      <div className="lavish-card p-4 space-y-3.5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative w-full sm:max-w-md">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search staff by name, title, department, or ID..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-8 py-2 rounded-xl bg-slate-50/90 border border-slate-300/80 text-xs font-medium text-slate-950 placeholder-slate-500 focus:outline-none focus:border-[#5B21B6] focus:ring-2 focus:ring-[#5B21B6]/15 focus:bg-white transition"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-900 p-0.5"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Bigin-Style Sliding Status Filter Switch */}
          <div className="relative grid grid-cols-3 bg-lavender-50 border border-lavender-200/80 p-1 rounded-xl self-start sm:self-auto min-w-[270px]">
            <div
              aria-hidden="true"
              className="absolute top-1 bottom-1 left-1 w-[calc(33.333%-0.25rem)] rounded-lg bg-white shadow-xs transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]"
              style={{
                transform:
                  statusFilter === 'ALL'
                    ? 'translateX(0%)'
                    : statusFilter === 'Paid'
                      ? 'translateX(100%)'
                      : 'translateX(200%)'
              }}
            />
            {(['ALL', 'Paid', 'Pending'] as const).map(status => {
              const count = status === 'ALL' ? staff.length : status === 'Paid' ? paidCount : pendingCount;
              return (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`relative z-10 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-colors duration-200 flex items-center justify-center gap-1.5 ${
                    statusFilter === status
                      ? 'text-[#4C1D95]'
                      : 'text-slate-700 hover:text-slate-950'
                  }`}
                >
                  <span>{status === 'ALL' ? 'All' : status}</span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono ${
                    statusFilter === status ? 'bg-lavender-50 text-[#4C1D95]' : 'bg-slate-200/70 text-slate-700'
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Full Non-Clipped Department Pills */}
        <div className="flex flex-wrap items-center gap-1.5 pt-2.5 border-t border-slate-100">
          {activeDepartments.map(dept => (
            <button
              key={dept}
              onClick={() => setSelectedDept(dept)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all duration-150 ${
                selectedDept === dept
                  ? 'btn-zoho-primary text-white shadow-xs'
                  : 'bg-slate-50 border border-slate-200/90 text-slate-700 hover:bg-lavender-50/80 hover:text-[#4C1D95] hover:border-lavender-200'
              }`}
            >
              {dept === 'ALL' ? 'All Departments' : dept}
            </button>
          ))}
        </div>
      </div>

      {/* Main Staff Roster Table */}
      <div className="space-y-3">
        {filteredStaff.length === 0 ? (
          <div className="p-12 lavish-card text-center space-y-2.5">
            <div className="w-12 h-12 rounded-xl bg-lavender-50 text-[#4C1D95] border border-lavender-200/80 flex items-center justify-center mx-auto">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="font-display font-bold text-slate-950 text-base">No Staff Members Found</h3>
            <p className="text-xs text-slate-700 max-w-sm mx-auto">
              {search || selectedDept !== 'ALL' || statusFilter !== 'ALL'
                ? 'No staff members match your active search or department filter.'
                : 'Use "Load 20 Staff" or "Add Staff" in the banner above to populate the payroll roster.'}
            </p>
          </div>
        ) : (
          <div className="lavish-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-gradient-to-r from-[#F7F5FF] to-[#F1ECFE] border-b border-slate-200/90 text-slate-800 font-bold uppercase text-[11px] tracking-wider">
                  <tr>
                    <th className="py-3.5 px-4 whitespace-nowrap">Staff Member</th>
                    <th className="py-3.5 px-4 whitespace-nowrap">Department</th>
                    <th className="py-3.5 px-4 text-right whitespace-nowrap">Base Pay</th>
                    <th className="py-3.5 px-4 text-right whitespace-nowrap">Bonuses</th>
                    <th className="py-3.5 px-4 text-right whitespace-nowrap">Deductions</th>
                    <th className="py-3.5 px-4 text-right whitespace-nowrap">Net Payable</th>
                    <th className="py-3.5 px-4 text-center whitespace-nowrap">Status</th>
                    <th className="py-3.5 px-4 text-right whitespace-nowrap">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredStaff.map((emp, idx) => {
                    const netPay = emp.baseSalary + emp.incentives + (emp.bonuses || 0) - (emp.deductions || 0) - (emp.baseSalary * 0.12) - 200;
                    const isPaid = emp.salaryStatus === 'Paid';
                    const avatarTheme = STAFF_AVATAR_THEMES[idx % STAFF_AVATAR_THEMES.length];

                    return (
                      <tr
                        key={emp.id}
                        className="hover:bg-lavender-50/50 transition-colors duration-150"
                      >
                        {/* Name & Role */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${avatarTheme} text-white font-display font-bold flex items-center justify-center text-xs flex-shrink-0 shadow-xs`}>
                              {getStaffInitials(emp.name)}
                            </div>
                            <div className="min-w-0">
                              <p className="font-display font-bold text-slate-950 text-[13px] truncate">{emp.name}</p>
                              <p className="text-[11px] text-slate-700 font-medium mt-0.5 truncate">
                                <span className="font-mono text-[#4C1D95] font-semibold">{emp.id}</span> &bull; {emp.designation}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Department */}
                        <td className="py-3.5 px-4">
                          <span className="whitespace-nowrap inline-block px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200/90 text-[11px] font-bold text-slate-800">
                            {emp.department}
                          </span>
                        </td>

                        {/* Base Pay */}
                        <td className="py-3.5 px-4 text-right font-mono font-semibold text-slate-800 tabular-nums whitespace-nowrap">
                          ₹{emp.baseSalary.toLocaleString('en-IN')}
                        </td>

                        {/* Bonuses */}
                        <td className="py-3.5 px-4 text-right font-mono tabular-nums whitespace-nowrap">
                          {(emp.bonuses && emp.bonuses > 0) ? (
                            <span
                              className="text-emerald-800 font-bold bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200"
                              title={emp.bonusReason || 'Bonus'}
                            >
                              +₹{emp.bonuses.toLocaleString('en-IN')}
                            </span>
                          ) : (
                            <span className="text-slate-600 font-medium">₹0</span>
                          )}
                        </td>

                        {/* Deductions */}
                        <td className="py-3.5 px-4 text-right font-mono tabular-nums whitespace-nowrap">
                          {(emp.deductions && emp.deductions > 0) ? (
                            <span
                              className="text-rose-700 font-bold bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200"
                              title={emp.deductionReason || 'Deduction'}
                            >
                              -₹{emp.deductions.toLocaleString('en-IN')}
                            </span>
                          ) : (
                            <span className="text-slate-600 font-medium">₹0</span>
                          )}
                        </td>

                        {/* Net Payable */}
                        <td className="py-3.5 px-4 text-right font-mono font-extrabold text-slate-950 tabular-nums whitespace-nowrap">
                          ₹{Math.max(0, Math.round(netPay)).toLocaleString('en-IN')}
                        </td>

                        {/* Status */}
                        <td className="py-3.5 px-4 text-center whitespace-nowrap">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border ${
                            isPaid
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                              : 'bg-amber-50 text-amber-800 border-amber-200'
                          }`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${isPaid ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                            <span>{isPaid ? 'Paid' : 'Pending'}</span>
                          </span>
                        </td>

                        {/* Working Interactive Actions */}
                        <td className="py-3.5 px-4 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-1.5" onClick={e => e.stopPropagation()}>
                            {/* Give Bonus (+₹) */}
                            <button
                              title="Award Bonus (+₹)"
                              onClick={() => {
                                setBonusModalStaff(emp);
                                setBonusAmount('5000');
                              }}
                              className="p-1.5 rounded-lg bg-emerald-50 border border-emerald-200/80 text-emerald-700 hover:bg-emerald-100 transition"
                            >
                              <PlusCircle className="w-4 h-4" />
                            </button>

                            {/* Minus Money / Deduct (-₹) */}
                            <button
                              title="Salary Deduction (-₹)"
                              onClick={() => {
                                setDeductModalStaff(emp);
                                setDeductAmount('2000');
                              }}
                              className="p-1.5 rounded-lg bg-rose-50 border border-rose-200/80 text-rose-700 hover:bg-rose-100 transition"
                            >
                              <MinusCircle className="w-4 h-4" />
                            </button>

                            {/* Disburse Salary */}
                            <button
                              title={isPaid ? 'Disbursed. Click to toggle or re-disburse.' : 'Disburse Net Monthly Salary'}
                              onClick={() => handleDisburseSingle(emp)}
                              className={`p-1.5 rounded-lg transition ${
                                isPaid
                                  ? 'bg-emerald-100 border border-emerald-300 text-emerald-800 hover:bg-emerald-200'
                                  : 'btn-zoho-primary text-white'
                              }`}
                            >
                              <Send className="w-4 h-4" />
                            </button>

                            {/* Remove Staff */}
                            <button
                              title="Remove Staff Member"
                              onClick={() => {
                                if (window.confirm(`Are you sure you want to remove ${emp.name}?`)) {
                                  removeStaffMember(emp.id);
                                  showToast(`Removed ${emp.name} from hospital staff.`);
                                }
                              }}
                              className="p-1.5 rounded-lg border border-transparent text-slate-500 hover:text-rose-700 hover:bg-rose-50 hover:border-rose-200 transition"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Clean Roster Footer Summary */}
            <div className="px-4 py-3 bg-gradient-to-r from-[#F8FAFF] to-[#F1F6FE] border-t border-slate-200/80 flex flex-wrap items-center justify-between gap-2 text-xs">
              <span className="font-semibold text-slate-700">
                Displaying <strong className="text-slate-950">{filteredStaff.length}</strong> of <strong className="text-slate-950">{staff.length}</strong> active personnel
              </span>
              <span className="font-semibold text-slate-700">
                Payroll Ledger Sync: <span className="font-mono font-bold text-[#4C1D95]">{currentTenant.name}</span>
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Add Staff Member Modal */}
      {isAddStaffModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-lg rounded-2xl bg-white border border-slate-200 shadow-2xl overflow-hidden">
            <div className="h-1.5 w-full bg-gradient-to-r from-[#2D1B69] via-[#6D28D9] to-[#0D9488]" />
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <div className="p-2.5 rounded-xl bg-lavender-50 text-[#4C1D95] border border-lavender-200/80">
                    <UserPlus className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-slate-950 text-base">Add Hospital Staff Member</h3>
                    <p className="text-xs font-medium text-slate-700">Register doctors, nurses, technicians, or administrators</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsAddStaffModalOpen(false)}
                  className="text-slate-600 hover:text-slate-950 hover:bg-slate-100 rounded-lg p-1.5"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAddStaffSubmit} className="space-y-3.5">
                <div>
                  <label className="text-xs font-bold text-slate-800 block mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Dr. Rajesh Sharma, MS"
                    value={newStaffForm.name}
                    onChange={e => setNewStaffForm({ ...newStaffForm, name: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-300/80 text-xs font-medium text-slate-950 focus:outline-none focus:border-[#5B21B6] focus:bg-white transition"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-800 block mb-1">
                      Role Category *
                    </label>
                    <select
                      value={newStaffForm.role}
                      onChange={e => handleRoleChange(e.target.value as UserRole)}
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-300/80 text-xs font-medium text-slate-950 focus:outline-none focus:border-[#5B21B6] focus:bg-white transition"
                    >
                      {STANDARD_STAFF_ROLES.map(r => (
                        <option key={r.role} value={r.role}>{r.title}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-800 block mb-1">
                      Designation / Title *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Chief Surgeon, Head Nurse"
                      value={newStaffForm.designation}
                      onChange={e => setNewStaffForm({ ...newStaffForm, designation: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-300/80 text-xs font-medium text-slate-950 focus:outline-none focus:border-[#5B21B6] focus:bg-white transition"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-800 block mb-1">
                      Department *
                    </label>
                    <select
                      value={newStaffForm.department}
                      onChange={e => setNewStaffForm({ ...newStaffForm, department: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-300/80 text-xs font-medium text-slate-950 focus:outline-none focus:border-[#5B21B6] focus:bg-white transition"
                    >
                      {STANDARD_DEPARTMENTS.map(d => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-800 block mb-1">
                      Base Salary (₹/Month) *
                    </label>
                    <input
                      type="number"
                      required
                      min="1000"
                      step="1000"
                      placeholder="e.g. 75000"
                      value={newStaffForm.baseSalary}
                      onChange={e => setNewStaffForm({ ...newStaffForm, baseSalary: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-300/80 text-xs font-mono font-bold text-slate-950 focus:outline-none focus:border-[#5B21B6] focus:bg-white transition"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-800 block mb-1">
                      Duty Shift
                    </label>
                    <select
                      value={newStaffForm.shift}
                      onChange={e => setNewStaffForm({ ...newStaffForm, shift: e.target.value as any })}
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-300/80 text-xs font-medium text-slate-950 focus:outline-none focus:border-[#5B21B6] focus:bg-white transition"
                    >
                      <option value="General (09:00 - 18:00)">General (09:00 - 18:00)</option>
                      <option value="Morning (08:00 - 14:00)">Morning (08:00 - 14:00)</option>
                      <option value="Evening (14:00 - 20:00)">Evening (14:00 - 20:00)</option>
                      <option value="Night (20:00 - 08:00)">Night (20:00 - 08:00)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-800 block mb-1">
                      Contact Phone
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. +91 98765 43210"
                      value={newStaffForm.phone}
                      onChange={e => setNewStaffForm({ ...newStaffForm, phone: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-300/80 text-xs font-medium text-slate-950 focus:outline-none focus:border-[#5B21B6] focus:bg-white transition"
                    />
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl btn-zoho-primary text-white font-bold text-xs transition active:scale-[0.98]"
                  >
                    Save &amp; Add Staff Member
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Give Bonus Modal with Quick Presets */}
      {bonusModalStaff && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-md rounded-2xl bg-white border border-slate-200 shadow-2xl overflow-hidden">
            <div className="h-1.5 w-full bg-gradient-to-r from-emerald-500 to-teal-500" />
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200/70">
                    <PlusCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-slate-950 text-base">Grant Bonus (+₹)</h3>
                    <p className="text-xs font-medium text-slate-700">To {bonusModalStaff.name} ({bonusModalStaff.designation})</p>
                  </div>
                </div>
                <button
                  onClick={() => setBonusModalStaff(null)}
                  className="text-slate-600 hover:text-slate-950 hover:bg-slate-100 rounded-lg p-1.5"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleGiveBonus} className="space-y-4">
                {/* Quick Amount Presets */}
                <div>
                  <label className="text-xs font-bold text-slate-800 block mb-1.5">
                    Select Bonus Amount
                  </label>
                  <div className="grid grid-cols-4 gap-2 mb-2">
                    {['1000', '2500', '5000', '10000'].map(val => (
                      <button
                        key={val}
                        type="button"
                        onClick={() => setBonusAmount(val)}
                        className={`py-1.5 px-2 rounded-xl text-xs font-mono font-bold border transition ${
                          bonusAmount === val
                            ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                            : 'bg-slate-50 text-slate-800 border-slate-300/80 hover:bg-slate-100'
                        }`}
                      >
                        +₹{Number(val).toLocaleString('en-IN')}
                      </button>
                    ))}
                  </div>
                  <input
                    type="number"
                    min="100"
                    step="500"
                    required
                    value={bonusAmount}
                    onChange={e => setBonusAmount(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-300/80 text-sm font-mono font-bold text-slate-950 focus:outline-none focus:border-emerald-500 focus:bg-white transition"
                  />
                </div>

                {/* Quick Reason Presets */}
                <div>
                  <label className="text-xs font-bold text-slate-800 block mb-1.5">
                    Reason for Bonus
                  </label>
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {[
                      'Emergency ICU Duty',
                      'Overtime Night Shift',
                      'NABH Quality Excellence',
                      'Exemplary Patient Care'
                    ].map(reason => (
                      <button
                        key={reason}
                        type="button"
                        onClick={() => setBonusReason(reason)}
                        className={`text-[11px] px-2.5 py-1 rounded-full border transition ${
                          bonusReason === reason
                            ? 'bg-emerald-100 text-emerald-900 border-emerald-300 font-bold'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {reason}
                      </button>
                    ))}
                  </div>
                  <input
                    type="text"
                    required
                    value={bonusReason}
                    onChange={e => setBonusReason(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-300/80 text-xs font-medium text-slate-950 focus:outline-none focus:border-emerald-500 focus:bg-white transition"
                  />
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="submit"
                    className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:brightness-105 text-white font-bold text-xs shadow-sm transition"
                  >
                    Grant Bonus (+₹{Number(bonusAmount || 0).toLocaleString('en-IN')})
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Minus Money / Deduction Modal with Quick Presets */}
      {deductModalStaff && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-md rounded-2xl bg-white border border-slate-200 shadow-2xl overflow-hidden">
            <div className="h-1.5 w-full bg-gradient-to-r from-rose-500 to-pink-600" />
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <div className="p-2.5 rounded-xl bg-rose-50 text-rose-700 border border-rose-200/70">
                    <MinusCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-slate-950 text-base">Salary Deduction (-₹)</h3>
                    <p className="text-xs font-medium text-slate-700">From {deductModalStaff.name} ({deductModalStaff.designation})</p>
                  </div>
                </div>
                <button
                  onClick={() => setDeductModalStaff(null)}
                  className="text-slate-600 hover:text-slate-950 hover:bg-slate-100 rounded-lg p-1.5"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleDeductSalary} className="space-y-4">
                {/* Quick Amount Presets */}
                <div>
                  <label className="text-xs font-bold text-slate-800 block mb-1.5">
                    Select Deduction Amount
                  </label>
                  <div className="grid grid-cols-4 gap-2 mb-2">
                    {['500', '1000', '2000', '5000'].map(val => (
                      <button
                        key={val}
                        type="button"
                        onClick={() => setDeductAmount(val)}
                        className={`py-1.5 px-2 rounded-xl text-xs font-mono font-bold border transition ${
                          deductAmount === val
                            ? 'bg-rose-600 text-white border-rose-600 shadow-xs'
                            : 'bg-slate-50 text-slate-800 border-slate-300/80 hover:bg-slate-100'
                        }`}
                      >
                        -₹{Number(val).toLocaleString('en-IN')}
                      </button>
                    ))}
                  </div>
                  <input
                    type="number"
                    min="100"
                    step="500"
                    required
                    value={deductAmount}
                    onChange={e => setDeductAmount(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-300/80 text-sm font-mono font-bold text-slate-950 focus:outline-none focus:border-rose-500 focus:bg-white transition"
                  />
                </div>

                {/* Quick Reason Presets */}
                <div>
                  <label className="text-xs font-bold text-slate-800 block mb-1.5">
                    Reason for Deduction
                  </label>
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {[
                      'Unexcused Shift Absence',
                      'Late Duty Arrival Penalty',
                      'Roster Policy Violation',
                      'Advance Salary Adjustment'
                    ].map(reason => (
                      <button
                        key={reason}
                        type="button"
                        onClick={() => setDeductReason(reason)}
                        className={`text-[11px] px-2.5 py-1 rounded-full border transition ${
                          deductReason === reason
                            ? 'bg-rose-100 text-rose-900 border-rose-300 font-bold'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {reason}
                      </button>
                    ))}
                  </div>
                  <input
                    type="text"
                    required
                    value={deductReason}
                    onChange={e => setDeductReason(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-300/80 text-xs font-medium text-slate-950 focus:outline-none focus:border-rose-500 focus:bg-white transition"
                  />
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="submit"
                    className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 hover:brightness-105 text-white font-bold text-xs shadow-sm transition"
                  >
                    Apply Deduction (-₹{Number(deductAmount || 0).toLocaleString('en-IN')})
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
