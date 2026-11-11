import React, { useState, useMemo } from 'react';
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

const DOC_CARD_THEMES = [
  { avatar: 'from-[#4C1D95] to-[#7C3AED] shadow-lavender-700/25', bar: 'from-[#4C1D95] to-[#8B5CF6]' },
  { avatar: 'from-teal-500 to-emerald-600 shadow-teal-500/25', bar: 'from-teal-500 to-emerald-400' },
  { avatar: 'from-indigo-500 to-violet-600 shadow-indigo-500/25', bar: 'from-indigo-500 to-violet-400' }
];

export const DoctorManagement: React.FC = () => {
  const { staff, patients, setActiveModule, currentUser } = useHospitalOS();
  const [search, setSearch] = useState('');
  const [selectedDept, setSelectedDept] = useState('ALL');

  const doctorList = useMemo(
    () => staff.filter(s => s.role === 'doctor'),
    [staff]
  );

  const departments = useMemo(
    () => ['ALL', ...Array.from(new Set(doctorList.map(d => d.department)))],
    [doctorList]
  );

  // Single O(P + D) pre-aggregation for instant scaling across large rosters
  const assignedCountByDocId = useMemo(() => {
    const counts = new Map<string, number>();
    const lowerDoctors = doctorList.map(d => ({ id: d.id, nameLower: d.name.toLowerCase() }));

    for (const p of patients) {
      if (p.assignedDoctorId) {
        counts.set(p.assignedDoctorId, (counts.get(p.assignedDoctorId) || 0) + 1);
      }
      if (p.assignedDoctorName) {
        const ptDocLower = p.assignedDoctorName.toLowerCase();
        for (const d of lowerDoctors) {
          if (d.id !== p.assignedDoctorId && ptDocLower.includes(d.nameLower)) {
            counts.set(d.id, (counts.get(d.id) || 0) + 1);
          }
        }
      }
    }
    return counts;
  }, [patients, doctorList]);

  const filteredDoctors = useMemo(() => {
    const q = search.trim().toLowerCase();
    return doctorList.filter(doc => {
      const matchesSearch = !q ||
        doc.name.toLowerCase().includes(q) ||
        doc.designation.toLowerCase().includes(q) ||
        doc.department.toLowerCase().includes(q);
      const matchesDept = selectedDept === 'ALL' || doc.department === selectedDept;
      return matchesSearch && matchesDept;
    });
  }, [doctorList, search, selectedDept]);

  return (
    <div className="space-y-6">
      {/* Architectural Photographic Banner */}
      <div className="workspace-banner p-6 sm:p-7 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md border border-lavender-300/35 text-[11px] font-bold uppercase tracking-wider text-lavender-200">
            <span>OPD Clinical Directory &bull; {doctorList.length} Consultants</span>
          </div>
          <h2 className="font-display text-2xl font-extrabold text-white flex items-center gap-2.5 tracking-tight">
            <Stethoscope className="w-6 h-6 text-lavender-300" />
            <span>Hospital Physicians &amp; OPD Chambers</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-100 max-w-2xl">
            Directory of medical consultants, duty shifts, OPD chamber schedules, and assigned patient loads.
          </p>
        </div>

        <button
          onClick={() => setActiveModule('admin_payroll')}
          className="px-4 py-2.5 rounded-xl bg-white hover:bg-lavender-50 text-[#1C103B] font-bold text-xs inline-flex items-center gap-1.5 shadow-lg transition active:scale-[0.98] flex-shrink-0"
        >
          <UserPlus className="w-4 h-4 text-[#4C1D95]" />
          <span>Add Physician</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 lavish-card p-3.5">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search physicians by name, department, or title..."
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-300/80 text-xs font-medium text-slate-950 placeholder:text-slate-500 focus:outline-none focus:border-[#5B21B6] focus:ring-2 focus:ring-[#5B21B6]/15 focus:bg-white transition"
          />
        </div>

        {/* Department Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 no-scrollbar">
          {departments.map(dept => (
            <button
              key={dept}
              onClick={() => setSelectedDept(dept)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                selectedDept === dept
                  ? 'btn-zoho-primary text-white'
                  : 'bg-slate-50 border border-slate-200 text-slate-700 hover:text-[#4C1D95] hover:bg-white'
              }`}
            >
              {dept}
            </button>
          ))}
        </div>
      </div>

      {/* Physicians Roster */}
      {filteredDoctors.length === 0 ? (
        <div className="p-12 lavish-card text-center space-y-2.5">
          <div className="w-12 h-12 rounded-2xl bg-lavender-50 text-[#4C1D95] flex items-center justify-center mx-auto border border-lavender-200/80">
            <Stethoscope className="w-6 h-6" />
          </div>
          <h3 className="font-display font-bold text-slate-950 text-base">No Physicians Found</h3>
          <p className="text-xs text-slate-700 max-w-sm mx-auto">
            Click &quot;Add Physician&quot; in the header banner above to onboard doctors and consultants to active hospital OPD chambers.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredDoctors.map((doc, idx) => {
            const assignedCount = assignedCountByDocId.get(doc.id) || 0;
            const isCurrentLoggedInUser = currentUser.id === doc.id || currentUser.name === doc.name;
            const theme = DOC_CARD_THEMES[idx % DOC_CARD_THEMES.length];
            const initials = doc.name
              .replace(/^(Dr\.|Mr\.|Ms\.|Mrs\.)\s+/i, '')
              .trim()
              .split(/\s+/)
              .slice(0, 2)
              .map(w => w[0]?.toUpperCase() || '')
              .join('') || 'DR';

            return (
              <div
                key={doc.id}
                className="relative overflow-hidden lavish-card lavish-card-hover scalable-card p-5 space-y-4"
              >
                <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${theme.bar}`} />

                {/* Doctor Header */}
                <div className="flex items-start justify-between pt-1">
                  <div className="flex items-center gap-3">
                    <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${theme.avatar} text-white font-display font-bold flex items-center justify-center text-xs flex-shrink-0 shadow-md`}>
                      {initials}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-display font-bold text-slate-950 text-sm">{doc.name}</h4>
                        {isCurrentLoggedInUser && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-lavender-50 text-[#4C1D95] border border-lavender-200">
                            You
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-[#4C1D95] font-bold">{doc.designation}</p>
                    </div>
                  </div>
                  <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded-lg bg-slate-100 text-slate-800 border border-slate-200/80 whitespace-nowrap">
                    {doc.id}
                  </span>
                </div>

                {/* Details Grid */}
                <div className="space-y-2 pt-3 border-t border-slate-100 text-xs">
                  <div className="flex items-center justify-between text-slate-700">
                    <span className="flex items-center gap-1.5 text-slate-600 font-semibold">
                      <Building2 className="w-3.5 h-3.5 text-[#4C1D95]" /> Department
                    </span>
                    <span className="font-bold text-slate-950">{doc.department}</span>
                  </div>

                  <div className="flex items-center justify-between text-slate-700">
                    <span className="flex items-center gap-1.5 text-slate-600 font-semibold">
                      <Clock className="w-3.5 h-3.5 text-emerald-600" /> Duty Shift
                    </span>
                    <span className="font-semibold text-slate-900">{doc.shift}</span>
                  </div>

                  <div className="flex items-center justify-between text-slate-700">
                    <span className="flex items-center gap-1.5 text-slate-600 font-semibold">
                      <Phone className="w-3.5 h-3.5 text-indigo-600" /> Contact
                    </span>
                    <span className="font-mono font-semibold text-slate-800">{doc.phone}</span>
                  </div>

                  <div className="flex items-center justify-between text-slate-700">
                    <span className="flex items-center gap-1.5 text-slate-600 font-semibold">
                      <Users className="w-3.5 h-3.5 text-teal-600" /> Assigned Patients
                    </span>
                    <span className="font-bold text-[#4C1D95] bg-lavender-50 px-2.5 py-0.5 rounded-full border border-lavender-200/80">
                      {assignedCount} Active
                    </span>
                  </div>
                </div>

                {/* Status & Actions */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                    <UserCheck className="w-3 h-3 text-emerald-600" />
                    <span>On Duty</span>
                  </span>

                  <button
                    onClick={() => setActiveModule('patients')}
                    className="text-xs font-bold text-[#4C1D95] hover:text-[#2D1B69] flex items-center gap-1 transition"
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
