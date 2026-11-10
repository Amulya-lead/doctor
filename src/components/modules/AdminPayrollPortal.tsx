import React, { useState } from 'react';
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

  // Compute metrics
  const totalBonuses = staff.reduce((acc, s) => acc + (s.bonuses || 0), 0);
  const totalDeductions = staff.reduce((acc, s) => acc + (s.deductions || 0), 0);
  const totalNet = staff.reduce((acc, s) => {
    const net = s.baseSalary + s.incentives + (s.bonuses || 0) - (s.deductions || 0) - (s.baseSalary * 0.12) - 200;
    return acc + Math.max(0, net);
  }, 0);
  const paidCount = staff.filter(s => s.salaryStatus === 'Paid').length;
  const pendingCount = staff.length - paidCount;

  // Filter staff
  const filteredStaff = staff.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(search.toLowerCase()) || 
                          s.designation.toLowerCase().includes(search.toLowerCase()) ||
                          s.id.toLowerCase().includes(search.toLowerCase()) ||
                          s.department.toLowerCase().includes(search.toLowerCase());
    const matchesDept = selectedDept === 'ALL' || s.department.toLowerCase().includes(selectedDept.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || (s.salaryStatus || 'Pending') === statusFilter;
    return matchesSearch && matchesDept && matchesStatus;
  });

  // Unique departments for filter chips
  const activeDepartments = ['ALL', ...Array.from(new Set(staff.map(s => s.department)))];

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

      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase bg-sky-100 text-sky-800 tracking-wide">
              Admin Exclusive Portal
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs text-slate-600 font-medium">{currentTenant.name}</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2 mt-1">
            <DollarSign className="w-6 h-6 text-sky-600" />
            <span>Hospital Staff & Payroll Desk</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Add doctors, nurses, and hospital staff. Give bonuses (+₹), apply salary deductions (-₹), and disburse monthly pay.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Quick 20 Staff Seed Button */}
          <button
            onClick={handleLoad20Staff}
            title="Populate complete 20-member hospital staff roster across all departments"
            className="px-3.5 py-2 rounded-lg bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-indigo-700 font-bold text-xs flex items-center gap-1.5 shadow-2xs transition active:scale-95"
          >
            <Users className="w-4 h-4 text-indigo-600" />
            <span>+ Load 20 Hospital Staff</span>
          </button>

          {/* Add Staff Member */}
          <button
            onClick={() => setIsAddStaffModalOpen(true)}
            className="px-4 py-2 rounded-lg bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs flex items-center gap-2 shadow-xs transition active:scale-95"
          >
            <UserPlus className="w-4 h-4" />
            <span>+ Add Staff Member</span>
          </button>

          {/* Disburse / Reset Action */}
          {pendingCount > 0 ? (
            <button
              onClick={handleBatchDisburse}
              className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-2 shadow-xs transition active:scale-95"
            >
              <Send className="w-4 h-4" />
              <span>Disburse All Salaries ({pendingCount})</span>
            </button>
          ) : (
            <button
              onClick={handleResetCycle}
              title="Reset disbursement cycle to Pending for the new month"
              className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-700 font-bold text-xs flex items-center gap-2 transition active:scale-95"
            >
              <RotateCcw className="w-4 h-4 text-slate-600" />
              <span>Start New Month Cycle (Reset)</span>
            </button>
          )}
        </div>
      </div>

      {/* Financial Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs hover:border-slate-300 transition">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Total Monthly Net Payroll</span>
            <Building2 className="w-4 h-4 text-sky-600" />
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-900 font-mono tracking-tight">
            ₹{Math.round(totalNet).toLocaleString('en-IN')}
          </div>
          <p className="mt-1 text-xs text-slate-500">
            Across {staff.length} Doctors, Nurses & Staff
          </p>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs hover:border-slate-300 transition">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Total Bonuses Awarded</span>
            <Sparkles className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="mt-2 text-2xl font-bold text-emerald-600 font-mono tracking-tight">
            +₹{totalBonuses.toLocaleString('en-IN')}
          </div>
          <p className="mt-1 text-xs text-slate-500">
            Performance rewards & overtime
          </p>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs hover:border-slate-300 transition">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Total Deductions & Penalties</span>
            <AlertTriangle className="w-4 h-4 text-rose-600" />
          </div>
          <div className="mt-2 text-2xl font-bold text-rose-600 font-mono tracking-tight">
            -₹{totalDeductions.toLocaleString('en-IN')}
          </div>
          <p className="mt-1 text-xs text-slate-500">
            Absences & roster fines
          </p>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs hover:border-slate-300 transition">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Disbursement Status</span>
            <CheckCircle2 className="w-4 h-4 text-sky-600" />
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-900 font-mono flex items-baseline gap-2">
            <span>{paidCount}</span>
            <span className="text-xs font-normal text-slate-500">/ {staff.length} Disbursed</span>
          </div>
          <div className="mt-2 w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
            <div 
              className="bg-emerald-600 h-full transition-all duration-300" 
              style={{ width: `${staff.length > 0 ? (paidCount / staff.length) * 100 : 0}%` }}
            />
          </div>
        </div>
      </div>

      {/* Filter and Search Bar with Smooth Scrollbar-Free Pills */}
      <div className="p-3.5 rounded-xl bg-white border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-2xs">
        <div className="flex items-center gap-2 flex-1">
          <div className="relative w-full max-w-sm">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search staff by name, title, department, or ID..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-8 py-2 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:bg-white transition"
            />
            {search && (
              <button 
                onClick={() => setSearch('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Department Pills with Hidden Scrollbar */}
          <div className="hidden sm:flex items-center gap-1.5 overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden py-0.5">
            {activeDepartments.slice(0, 6).map(dept => (
              <button
                key={dept}
                onClick={() => setSelectedDept(dept)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors duration-150 ${
                  selectedDept === dept
                    ? 'bg-sky-600 text-white font-bold shadow-2xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {dept}
              </button>
            ))}
          </div>
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
          {(['ALL', 'Paid', 'Pending'] as const).map(status => {
            const count = status === 'ALL' ? staff.length : status === 'Paid' ? paidCount : pendingCount;
            return (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-3 py-1 rounded-md text-xs font-semibold transition-all duration-150 flex items-center gap-1.5 ${
                  statusFilter === status
                    ? 'bg-white text-slate-900 shadow-2xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>{status}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  statusFilter === status ? 'bg-slate-100 text-slate-800' : 'text-slate-400'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Staff Roster Table */}
      <div className="space-y-3">
        {filteredStaff.length === 0 ? (
          <div className="p-12 rounded-xl bg-white border border-slate-200 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-sky-50 text-sky-600 flex items-center justify-center mx-auto">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">No Staff Members Found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Add individual staff members or load the comprehensive 20-member hospital clinical team.
            </p>
            <div className="flex items-center justify-center gap-2 pt-2">
              <button
                onClick={handleLoad20Staff}
                className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs inline-flex items-center gap-1.5 shadow-xs transition"
              >
                <Users className="w-4 h-4" />
                <span>+ Load 20 Hospital Personnel</span>
              </button>
              <button
                onClick={() => setIsAddStaffModalOpen(true)}
                className="px-4 py-2 rounded-lg bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs inline-flex items-center gap-1.5 shadow-xs transition"
              >
                <UserPlus className="w-4 h-4" />
                <span>+ Add Staff Member</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-2xs">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="p-3.5">Staff Member</th>
                  <th className="p-3.5">Department</th>
                  <th className="p-3.5 text-right">Base Pay</th>
                  <th className="p-3.5 text-right">Bonuses (+₹)</th>
                  <th className="p-3.5 text-right">Deductions (-₹)</th>
                  <th className="p-3.5 text-right">Net Payable</th>
                  <th className="p-3.5 text-center">Status</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredStaff.map(emp => {
                  const netPay = emp.baseSalary + emp.incentives + (emp.bonuses || 0) - (emp.deductions || 0) - (emp.baseSalary * 0.12) - 200;
                  const isPaid = emp.salaryStatus === 'Paid';

                  return (
                    <tr 
                      key={emp.id}
                      className="hover:bg-sky-50/50 transition-colors duration-150"
                    >
                      {/* Name & Role */}
                      <td className="p-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-lg bg-sky-100 text-sky-800 font-bold flex items-center justify-center text-xs flex-shrink-0">
                            {emp.name[0]}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 text-xs">{emp.name}</p>
                            <p className="text-[11px] text-slate-500 font-mono mt-0.5">
                              {emp.id} • {emp.designation}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Department (No wrapping!) */}
                      <td className="p-3.5">
                        <span className="whitespace-nowrap inline-block px-2.5 py-1 rounded-md bg-slate-100 border border-slate-200 text-[11px] font-medium text-slate-700">
                          {emp.department}
                        </span>
                      </td>

                      {/* Base Pay */}
                      <td className="p-3.5 text-right font-mono text-slate-700">
                        ₹{emp.baseSalary.toLocaleString('en-IN')}
                      </td>

                      {/* Bonuses */}
                      <td className="p-3.5 text-right font-mono">
                        {(emp.bonuses && emp.bonuses > 0) ? (
                          <span 
                            className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200" 
                            title={emp.bonusReason || 'Bonus'}
                          >
                            +₹{emp.bonuses.toLocaleString('en-IN')}
                          </span>
                        ) : (
                          <span className="text-slate-400">₹0</span>
                        )}
                      </td>

                      {/* Deductions */}
                      <td className="p-3.5 text-right font-mono">
                        {(emp.deductions && emp.deductions > 0) ? (
                          <span 
                            className="text-rose-600 font-bold bg-rose-50 px-2 py-0.5 rounded border border-rose-200" 
                            title={emp.deductionReason || 'Deduction'}
                          >
                            -₹{emp.deductions.toLocaleString('en-IN')}
                          </span>
                        ) : (
                          <span className="text-slate-400">₹0</span>
                        )}
                      </td>

                      {/* Net Payable */}
                      <td className="p-3.5 text-right font-mono font-bold text-slate-900">
                        ₹{Math.max(0, Math.round(netPay)).toLocaleString('en-IN')}
                      </td>

                      {/* Status */}
                      <td className="p-3.5 text-center">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          isPaid
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}>
                          {isPaid ? <Check className="w-3 h-3" /> : null}
                          <span>{isPaid ? 'Paid' : 'Pending'}</span>
                        </span>
                      </td>

                      {/* Working Interactive Actions */}
                      <td className="p-3.5 text-right">
                        <div className="flex items-center justify-end gap-1.5" onClick={e => e.stopPropagation()}>
                          {/* Give Bonus (+₹) */}
                          <button
                            title="Award Bonus (+₹)"
                            onClick={() => {
                              setBonusModalStaff(emp);
                              setBonusAmount('5000');
                            }}
                            className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 hover:scale-105 transition shadow-2xs"
                          >
                            <PlusCircle className="w-4 h-4" />
                          </button>

                          {/* Minus Money / Deduct (-₹) */}
                          <button
                            title="Minus Money / Deduct Penalty (-₹)"
                            onClick={() => {
                              setDeductModalStaff(emp);
                              setDeductAmount('2000');
                            }}
                            className="p-1.5 rounded-lg bg-rose-50 text-rose-700 hover:bg-rose-100 hover:scale-105 transition shadow-2xs"
                          >
                            <MinusCircle className="w-4 h-4" />
                          </button>

                          {/* Disburse Salary */}
                          <button
                            title={isPaid ? "Disbursed. Click to re-disburse or mark pending." : "Disburse Net Monthly Salary"}
                            onClick={() => handleDisburseSingle(emp)}
                            className={`p-1.5 rounded-lg transition shadow-2xs ${
                              isPaid 
                                ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200' 
                                : 'bg-sky-600 hover:bg-sky-700 text-white hover:scale-105'
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
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 hover:scale-105 transition"
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
        )}
      </div>

      {/* Add Staff Member Modal */}
      {isAddStaffModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-lg rounded-2xl bg-white border border-slate-200 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="p-2.5 rounded-xl bg-sky-50 text-sky-600">
                  <UserPlus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">Add Hospital Staff Member</h3>
                  <p className="text-xs text-slate-500">Register doctors, nurses, technicians, or administrators (Up to 20+ staff)</p>
                </div>
              </div>
              <button 
                onClick={() => setIsAddStaffModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddStaffSubmit} className="space-y-3.5">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dr. Rajesh Sharma, MS"
                  value={newStaffForm.name}
                  onChange={e => setNewStaffForm({ ...newStaffForm, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-sky-500 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Role Category *
                  </label>
                  <select
                    value={newStaffForm.role}
                    onChange={e => handleRoleChange(e.target.value as UserRole)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-sky-500 focus:bg-white"
                  >
                    {STANDARD_STAFF_ROLES.map(r => (
                      <option key={r.role} value={r.role}>{r.title}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Designation / Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Chief Surgeon, Head Nurse"
                    value={newStaffForm.designation}
                    onChange={e => setNewStaffForm({ ...newStaffForm, designation: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-sky-500 focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Department *
                  </label>
                  <select
                    value={newStaffForm.department}
                    onChange={e => setNewStaffForm({ ...newStaffForm, department: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-sky-500 focus:bg-white"
                  >
                    {STANDARD_DEPARTMENTS.map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
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
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-xs font-mono text-slate-900 focus:outline-none focus:border-sky-500 focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Duty Shift
                  </label>
                  <select
                    value={newStaffForm.shift}
                    onChange={e => setNewStaffForm({ ...newStaffForm, shift: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-sky-500 focus:bg-white"
                  >
                    <option value="General (09:00 - 18:00)">General (09:00 - 18:00)</option>
                    <option value="Morning (08:00 - 14:00)">Morning (08:00 - 14:00)</option>
                    <option value="Evening (14:00 - 20:00)">Evening (14:00 - 20:00)</option>
                    <option value="Night (20:00 - 08:00)">Night (20:00 - 08:00)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Contact Phone
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. +91 98765 43210"
                    value={newStaffForm.phone}
                    onChange={e => setNewStaffForm({ ...newStaffForm, phone: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-sky-500 focus:bg-white"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsAddStaffModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs shadow-xs transition"
                >
                  Save & Add Staff Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Give Bonus Modal with Quick Presets */}
      {bonusModalStaff && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-md rounded-2xl bg-white border border-slate-200 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-700">
                  <PlusCircle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">Grant Bonus (+₹)</h3>
                  <p className="text-xs text-slate-500">To {bonusModalStaff.name} ({bonusModalStaff.designation})</p>
                </div>
              </div>
              <button 
                onClick={() => setBonusModalStaff(null)}
                className="text-slate-400 hover:text-slate-700 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleGiveBonus} className="space-y-4">
              {/* Quick Amount Presets */}
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                  Select Bonus Amount
                </label>
                <div className="grid grid-cols-4 gap-2 mb-2">
                  {['1000', '2500', '5000', '10000'].map(val => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setBonusAmount(val)}
                      className={`py-1.5 px-2 rounded-lg text-xs font-mono font-bold border transition ${
                        bonusAmount === val
                          ? 'bg-emerald-600 text-white border-emerald-600 shadow-2xs'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
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
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-sm font-mono text-slate-900 focus:outline-none focus:border-sky-500 focus:bg-white"
                />
              </div>

              {/* Quick Reason Presets */}
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1.5">
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
                          ? 'bg-emerald-100 text-emerald-800 border-emerald-300 font-bold'
                          : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
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
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-sky-500 focus:bg-white"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setBonusModalStaff(null)}
                  className="px-4 py-2 rounded-lg text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition"
                >
                  Grant Bonus (+₹{Number(bonusAmount || 0).toLocaleString('en-IN')})
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Minus Money / Deduction Modal with Quick Presets */}
      {deductModalStaff && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-md rounded-2xl bg-white border border-slate-200 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="p-2.5 rounded-xl bg-rose-50 text-rose-700">
                  <MinusCircle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">Minus Money / Salary Deduction (-₹)</h3>
                  <p className="text-xs text-slate-500">From {deductModalStaff.name} ({deductModalStaff.designation})</p>
                </div>
              </div>
              <button 
                onClick={() => setDeductModalStaff(null)}
                className="text-slate-400 hover:text-slate-700 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleDeductSalary} className="space-y-4">
              {/* Quick Amount Presets */}
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                  Select Deduction Amount
                </label>
                <div className="grid grid-cols-4 gap-2 mb-2">
                  {['500', '1000', '2000', '5000'].map(val => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setDeductAmount(val)}
                      className={`py-1.5 px-2 rounded-lg text-xs font-mono font-bold border transition ${
                        deductAmount === val
                          ? 'bg-rose-600 text-white border-rose-600 shadow-2xs'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
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
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-sm font-mono text-slate-900 focus:outline-none focus:border-rose-500 focus:bg-white"
                />
              </div>

              {/* Quick Reason Presets */}
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1.5">
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
                          ? 'bg-rose-100 text-rose-800 border-rose-300 font-bold'
                          : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
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
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-rose-500 focus:bg-white"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setDeductModalStaff(null)}
                  className="px-4 py-2 rounded-lg text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-xs transition"
                >
                  Apply Deduction (-₹{Number(deductAmount || 0).toLocaleString('en-IN')})
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
