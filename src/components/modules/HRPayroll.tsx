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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-hospital-900">
        <div>
          <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-hospital-400" />
            <span>Hospital Human Resources, Shift Roster & Automated Payroll</span>
          </h2>
          <p className="text-xs text-hospital-700 mt-0.5">
            Biometric Attendance Sync, Multi-Department Shift Allocator, Performance Incentives & Automated Payslips
          </p>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs">
          <span className="px-3 py-1 rounded-xl bg-hospital-500/15 text-hospital-500 border border-hospital-500/30">
            Biometric Gate: Online (99.4% On-Duty)
          </span>
          <span className="px-3 py-1 rounded-xl bg-hospital-500/15 text-hospital-300 border border-hospital-500/30">
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
                    ? 'bg-hospital-500 text-hospital-950 font-bold'
                    : 'bg-hospital-950 border border-hospital-900 text-hospital-200 hover:text-white'
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
                      ? 'bg-hospital-500/15 border-hospital-500/50 shadow-md shadow-hospital-500/10'
                      : 'bg-hospital-950/60 border-hospital-900 hover:border-hospital-700'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-bold text-xs text-white">{emp.name}</p>
                      <p className="text-[11px] text-hospital-300">{emp.designation}</p>
                      <p className="text-[10px] text-hospital-400">{emp.department}</p>
                    </div>

                    <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-hospital-500/20 text-hospital-300 border border-hospital-500/30">
                      {emp.attendanceStatus}
                    </span>
                  </div>

                  <div className="mt-2.5 pt-2 border-t border-hospital-900/80 flex items-center justify-between text-[10px] text-hospital-400 font-mono">
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
          <div className="p-5 rounded-2xl bg-gradient-to-br from-hospital-950 to-hospital-900 border border-hospital-800 shadow-xl space-y-5">
            {/* Staff Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-hospital-800">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-hospital-700 to-hospital-500 flex items-center justify-center text-xl font-bold text-white shadow-lg">
                  {selectedStaff.name[0]}
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">{selectedStaff.name}</h3>
                  <p className="text-xs text-hospital-300">{selectedStaff.designation}</p>
                  <p className="text-[11px] text-hospital-400">{selectedStaff.department} • Joined {selectedStaff.joiningDate}</p>
                </div>
              </div>

              <span className="px-2.5 py-1 rounded-xl text-xs font-mono font-bold bg-hospital-950 border border-hospital-700 text-hospital-200">
                EMP ID: {selectedStaff.id}
              </span>
            </div>

            {/* Shift & Biometric Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-hospital-950/70 border border-hospital-800 space-y-1">
                <span className="text-[10px] text-hospital-400 uppercase tracking-wider block">Assigned Active Shift</span>
                <p className="font-bold text-white text-sm">{selectedStaff.shift}</p>
                <p className="text-[11px] text-hospital-300 flex items-center gap-1 font-mono">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Biometric Check-in Confirmed
                </p>
              </div>

              <div className="p-3 rounded-xl bg-hospital-950/70 border border-hospital-800 space-y-1">
                <span className="text-[10px] text-hospital-400 uppercase tracking-wider block">Contact Information</span>
                <p className="text-white font-mono">{selectedStaff.phone}</p>
                <p className="text-hospital-300 font-mono text-[11px]">{selectedStaff.email}</p>
              </div>
            </div>

            {/* Monthly Salary Breakdown / Payslip Preview */}
            <div>
              <span className="text-xs font-bold text-hospital-200 uppercase tracking-wider block mb-2">
                Automated Monthly Compensation & Payslip Breakdown
              </span>

              <div className="p-4 rounded-xl bg-hospital-950/80 border border-hospital-800 space-y-2 text-xs font-mono">
                <div className="flex justify-between text-hospital-300">
                  <span>Basic Monthly Pay:</span>
                  <span className="text-white">₹{selectedStaff.baseSalary.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-hospital-300">
                  <span>Clinical / Departmental Performance Incentive:</span>
                  <span className="text-hospital-300">+₹{selectedStaff.incentives.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-hospital-300">
                  <span>Provident Fund (PF) & Statutory Deductions:</span>
                  <span className="text-hospital-400">-₹{(selectedStaff.baseSalary * 0.12).toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-hospital-300">
                  <span>Professional Tax (PT):</span>
                  <span className="text-hospital-400">-₹200</span>
                </div>
                <div className="pt-2 border-t border-hospital-800 flex justify-between text-sm font-bold text-white">
                  <span>Net Salary Credited to Bank:</span>
                  <span className="text-hospital-300">
                    ₹{(selectedStaff.baseSalary + selectedStaff.incentives - (selectedStaff.baseSalary * 0.12) - 200).toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-2 flex gap-3">
              <button className="px-4 py-2 rounded-xl bg-hospital-900 hover:bg-hospital-700 text-hospital-200 text-xs font-semibold border border-hospital-700 flex items-center gap-1.5 transition">
                <FileText className="w-3.5 h-3.5" /> Generate Form 16 / Payslip PDF
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

