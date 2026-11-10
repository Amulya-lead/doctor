import React, { useState } from 'react';
import { 
  Stethoscope, 
  Search, 
  UserCheck, 
  Clock, 
  Building2, 
  Phone, 
  UserPlus, 
  Users,
  CalendarCheck
} from 'lucide-react';
import { useHospitalOS } from '../../context/HospitalOSContext';

export const DoctorManagement: React.FC = () => {
  const { staff, patients, setActiveModule, currentUser } = useHospitalOS();
  const [search, setSearch] = useState('');
  const [selectedDept, setSelectedDept] = useState('ALL');

  // Filter only staff with role 'doctor'
  const doctorList = staff.filter(s => s.role === 'doctor');

  // Unique departments for filter
  const departments = ['ALL', ...Array.from(new Set(doctorList.map(d => d.department)))];

  const filteredDoctors = doctorList.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(search.toLowerCase()) ||
                          doc.designation.toLowerCase().includes(search.toLowerCase()) ||
                          doc.department.toLowerCase().includes(search.toLowerCase());
    const matchesDept = selectedDept === 'ALL' || doc.department === selectedDept;
    return matchesSearch && matchesDept;
  });

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Stethoscope className="w-6 h-6 text-sky-600" />
            <span>Hospital Physicians & OPD Chambers</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Directory of medical consultants, duty shifts, OPD chamber schedules, and assigned patient loads.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveModule('admin_payroll')}
            className="px-4 py-2 rounded-lg bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs inline-flex items-center gap-1.5 shadow-sm transition"
          >
            <UserPlus className="w-4 h-4" />
            <span>+ Add Physician</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search physicians by name, department, or title..."
            className="w-full pl-9 pr-3 py-2 rounded-lg bg-white border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-sky-500 shadow-xs"
          />
        </div>

        {/* Department Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {departments.map(dept => (
            <button
              key={dept}
              onClick={() => setSelectedDept(dept)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition ${
                selectedDept === dept
                  ? 'bg-slate-900 text-white font-bold'
                  : 'bg-white border border-slate-200 text-slate-600 hover:text-slate-900'
              }`}
            >
              {dept}
            </button>
          ))}
        </div>
      </div>

      {/* Physicians Roster */}
      {filteredDoctors.length === 0 ? (
        <div className="p-12 rounded-xl bg-white border border-slate-200 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-sky-50 text-sky-600 flex items-center justify-center mx-auto">
            <Stethoscope className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-slate-900 text-base">No Physicians Found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Add doctors and consultants through the Staff Desk to populate active hospital OPD chambers.
          </p>
          <button
            onClick={() => setActiveModule('admin_payroll')}
            className="px-4 py-2 rounded-lg bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs inline-flex items-center gap-1.5 shadow-sm transition"
          >
            <UserPlus className="w-4 h-4" />
            <span>+ Add Physician</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDoctors.map(doc => {
            // Compute assigned active patients count dynamically
            const assignedCount = patients.filter(p => 
              p.assignedDoctorId === doc.id || 
              (p.assignedDoctorName && p.assignedDoctorName.toLowerCase().includes(doc.name.toLowerCase()))
            ).length;

            const isCurrentLoggedInUser = currentUser.id === doc.id || currentUser.name === doc.name;

            return (
              <div 
                key={doc.id}
                className="p-5 rounded-xl bg-white border border-slate-200 shadow-xs hover:border-slate-300 transition space-y-4"
              >
                {/* Doctor Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-sky-100 text-sky-800 font-bold flex items-center justify-center text-sm flex-shrink-0">
                      {doc.name[0]}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-slate-900 text-sm">{doc.name}</h4>
                        {isCurrentLoggedInUser && (
                          <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-sky-100 text-sky-800">
                            You
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-sky-700 font-medium">{doc.designation}</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-600 whitespace-nowrap">
                    {doc.id}
                  </span>
                </div>

                {/* Details Grid */}
                <div className="space-y-2 pt-2 border-t border-slate-100 text-xs">
                  <div className="flex items-center justify-between text-slate-600">
                    <span className="flex items-center gap-1.5 text-slate-500">
                      <Building2 className="w-3.5 h-3.5 text-slate-400" /> Department:
                    </span>
                    <span className="font-semibold text-slate-900">{doc.department}</span>
                  </div>

                  <div className="flex items-center justify-between text-slate-600">
                    <span className="flex items-center gap-1.5 text-slate-500">
                      <Clock className="w-3.5 h-3.5 text-slate-400" /> Duty Shift:
                    </span>
                    <span className="font-medium text-slate-800">{doc.shift}</span>
                  </div>

                  <div className="flex items-center justify-between text-slate-600">
                    <span className="flex items-center gap-1.5 text-slate-500">
                      <Phone className="w-3.5 h-3.5 text-slate-400" /> Contact:
                    </span>
                    <span className="font-mono text-slate-700">{doc.phone}</span>
                  </div>

                  <div className="flex items-center justify-between text-slate-600">
                    <span className="flex items-center gap-1.5 text-slate-500">
                      <Users className="w-3.5 h-3.5 text-slate-400" /> Assigned Patients:
                    </span>
                    <span className="font-bold text-sky-700">{assignedCount} Active</span>
                  </div>
                </div>

                {/* Status & Actions */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    <UserCheck className="w-3 h-3 text-emerald-600" />
                    <span>On Duty</span>
                  </span>

                  <button
                    onClick={() => setActiveModule('patients')}
                    className="text-xs font-bold text-sky-600 hover:text-sky-700 flex items-center gap-1"
                  >
                    <CalendarCheck className="w-3.5 h-3.5" />
                    <span>Patient Records</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
