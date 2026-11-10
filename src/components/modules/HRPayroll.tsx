import React, { useState } from 'react';
import { 
  UserCheck, 
  Users, 
  Clock, 
  Calendar, 
  DollarSign, 
  CheckCircle2, 
  FileText, 
  Award, 
  ShieldCheck, 
  Briefcase 
} from 'lucide-react';
import { useHospitalOS } from '../../context/HospitalOSContext';
import { StaffEmployee } from '../../types';

export const HRPayroll: React.FC = () => {
  const { staff } = useHospitalOS();

  const [selectedStaff, setSelectedStaff] = useState<StaffEmployee>(staff[0]);
  const [selectedDept, setSelectedDept] = useState<string>('ALL');

  const filteredStaff = staff.filter(s => {
    return selectedDept === 'ALL' || s.department.toLowerCase().includes(selectedDept.toLowerCase());
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-brand-400" />
            <span>Hospital Human Resources, Shift Roster & Automated Payroll</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Biometric Attendance Sync, Multi-Department Shift Allocator, Performance Incentives & Automated Payslips
          </p>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs">
          <span className="px-3 py-1 rounded-xl bg-vital-emerald/15 text-vital-emerald border border-vital-emerald/30">
            Biometric Gate: Online (99.4% On-Duty)
          </span>
          <span className="px-3 py-1 rounded-xl bg-brand-500/15 text-brand-300 border border-brand-500/30">
            Monthly Payroll: Dispatched
          </span>
        </div>
      </div>

      {/* Main Grid: Staff Directory & Detailed Staff Dossier */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 5 cols: Staff Directory */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {['ALL', 'Critical Care', 'Nursing', 'Pathology', 'Pharmacy', 'Finance'].map(dept => (
              <button
                key={dept}
                onClick={() => setSelectedDept(dept)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                  selectedDept === dept
                    ? 'bg-brand-500 text-obsidian-950 font-bold'
                    : 'bg-slate-900 border border-slate-800 text-slate-300 hover:text-white'
                }`}
              >
                {dept}
              </button>
            ))}
          </div>

          <div className="space-y-2 max-h-[580px] overflow-y-auto pr-1">
            {filteredStaff.map(emp => {
              const isSelected = selectedStaff.id === emp.id;

              return (
                <div
                  key={emp.id}
                  onClick={() => setSelectedStaff(emp)}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all duration-200 ${
                    isSelected
                      ? 'bg-brand-500/15 border-brand-500/50 shadow-md shadow-brand-500/10'
                      : 'bg-slate-900/60 border-slate-800 hover:border-slate-750'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-bold text-xs text-white">{emp.name}</p>
                      <p className="text-[11px] text-brand-300">{emp.designation}</p>
                      <p className="text-[10px] text-slate-400">{emp.department}</p>
                    </div>

                    <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-vital-emerald/20 text-vital-emerald border border-vital-emerald/30">
                      {emp.attendanceStatus}
                    </span>
                  </div>

                  <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400 font-mono">
                    <span>Shift: {emp.shift.split(' ')[0]}</span>
                    <span className="text-white">Base: ₹{emp.baseSalary.toLocaleString('en-IN')}/mo</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right 7 cols: Employee Profile, Shift & Payslip Preview */}
        <div className="lg:col-span-7">
          <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-obsidian-900 border border-slate-800 shadow-xl space-y-5">
            {/* Staff Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-600 to-vital-violet flex items-center justify-center text-xl font-bold text-white shadow-lg">
                  {selectedStaff.name[0]}
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">{selectedStaff.name}</h3>
                  <p className="text-xs text-brand-300">{selectedStaff.designation}</p>
                  <p className="text-[11px] text-slate-400">{selectedStaff.department} • Joined {selectedStaff.joiningDate}</p>
                </div>
              </div>

              <span className="px-2.5 py-1 rounded-xl text-xs font-mono font-bold bg-slate-950 border border-slate-750 text-slate-300">
                EMP ID: {selectedStaff.id}
              </span>
            </div>

            {/* Shift & Biometric Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Assigned Active Shift</span>
                <p className="font-bold text-white text-sm">{selectedStaff.shift}</p>
                <p className="text-[11px] text-vital-emerald flex items-center gap-1 font-mono">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Biometric Check-in Confirmed
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Contact Information</span>
                <p className="text-white font-mono">{selectedStaff.phone}</p>
                <p className="text-slate-400 font-mono text-[11px]">{selectedStaff.email}</p>
              </div>
            </div>

            {/* Monthly Salary Breakdown / Payslip Preview */}
            <div>
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-2">
                Automated Monthly Compensation & Payslip Breakdown
              </span>

              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2 text-xs font-mono">
                <div className="flex justify-between text-slate-400">
                  <span>Basic Monthly Pay:</span>
                  <span className="text-white">₹{selectedStaff.baseSalary.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Clinical / Departmental Performance Incentive:</span>
                  <span className="text-vital-emerald">+₹{selectedStaff.incentives.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Provident Fund (PF) & Statutory Deductions:</span>
                  <span className="text-rose-400">-₹{(selectedStaff.baseSalary * 0.12).toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Professional Tax (PT):</span>
                  <span className="text-rose-400">-₹200</span>
                </div>
                <div className="pt-2 border-t border-slate-800 flex justify-between text-sm font-bold text-white">
                  <span>Net Salary Credited to Bank:</span>
                  <span className="text-vital-emerald">
                    ₹{(selectedStaff.baseSalary + selectedStaff.incentives - (selectedStaff.baseSalary * 0.12) - 200).toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-2 flex gap-3">
              <button className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 text-xs font-semibold border border-slate-700 flex items-center gap-1.5 transition">
                <FileText className="w-3.5 h-3.5" /> Generate Form 16 / Payslip PDF
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

