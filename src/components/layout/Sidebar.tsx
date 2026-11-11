import React from 'react';
import { 
  Users, 
  Stethoscope, 
  FlaskConical, 
  Pill, 
  BedDouble, 
  CreditCard, 
  ShieldAlert, 
  DollarSign,
  ShieldCheck,
  Lock,
  X
} from 'lucide-react';
import { useHospitalOS, NavigationModule } from '../../context/HospitalOSContext';

interface SidebarItem {
  id: NavigationModule;
  label: string;
  sublabel: string;
  icon: React.ElementType;
  badge?: string;
  badgeColor?: string;
}

interface SidebarProps {
  mobileOpen?: boolean;
  onCloseMobile?: () => void;
}

const DESK_ICON_ACCENTS: Partial<Record<NavigationModule, { active: string; idle: string; card: string }>> = {
  admin_payroll: {
    active: 'bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-emerald-500/25',
    idle: 'bg-emerald-50 text-emerald-600 group-hover:bg-emerald-100',
    card: 'from-emerald-50 via-teal-50/50 to-white border-emerald-200/90 text-emerald-950'
  },
  doctors: {
    active: 'bg-gradient-to-br from-[#2D1B69] to-[#6D28D9] text-white shadow-lavender-700/25',
    idle: 'bg-lavender-50 text-[#4C1D95] group-hover:bg-lavender-100',
    card: 'from-lavender-50 via-lavender-50/40 to-white border-lavender-200/90 text-[#1C103B]'
  },
  patients: {
    active: 'bg-gradient-to-br from-teal-500 to-emerald-600 text-white shadow-teal-500/25',
    idle: 'bg-teal-50 text-teal-600 group-hover:bg-teal-100',
    card: 'from-teal-50 via-emerald-50/40 to-white border-teal-200/90 text-teal-950'
  },
  operations: {
    active: 'bg-gradient-to-br from-[#4C1D95] to-indigo-600 text-white shadow-indigo-500/25',
    idle: 'bg-indigo-50 text-indigo-700 group-hover:bg-indigo-100',
    card: 'from-indigo-50 via-lavender-50/50 to-white border-indigo-200/90 text-indigo-950'
  },
  pharmacy: {
    active: 'bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-amber-500/25',
    idle: 'bg-amber-50 text-amber-600 group-hover:bg-amber-100',
    card: 'from-amber-50 via-orange-50/50 to-white border-amber-200/90 text-amber-950'
  },
  lims: {
    active: 'bg-gradient-to-br from-[#5B21B6] to-[#7C3AED] text-white shadow-lavender-600/25',
    idle: 'bg-lavender-50 text-[#5B21B6] group-hover:bg-lavender-100',
    card: 'from-lavender-50 via-purple-50/50 to-white border-lavender-200/90 text-[#1C103B]'
  },
  billing: {
    active: 'bg-gradient-to-br from-emerald-600 to-green-600 text-white shadow-emerald-500/25',
    idle: 'bg-emerald-50 text-emerald-600 group-hover:bg-emerald-100',
    card: 'from-emerald-50 via-green-50/50 to-white border-emerald-200/90 text-emerald-950'
  },
  insurance: {
    active: 'bg-gradient-to-br from-violet-500 to-purple-600 text-white shadow-violet-500/25',
    idle: 'bg-violet-50 text-violet-600 group-hover:bg-violet-100',
    card: 'from-violet-50 via-purple-50/50 to-white border-violet-200/90 text-violet-950'
  }
};

export const Sidebar: React.FC<SidebarProps> = ({ mobileOpen = false, onCloseMobile }) => {
  const { activeModule, setActiveModule, metrics, currentRole, getAllowedModulesForRole, currentUser } = useHospitalOS();

  const allowedModules = getAllowedModulesForRole(currentRole);

  const allNavItems: SidebarItem[] = [
    {
      id: 'admin_payroll',
      label: 'Staff & Payroll',
      sublabel: 'Staff Roster & Salaries',
      icon: DollarSign,
      badge: 'Admin Desk',
      badgeColor: 'bg-emerald-100 text-emerald-800'
    },
    {
      id: 'doctors',
      label: 'Doctor OPD Desk',
      sublabel: 'Consultation & Prescriptions',
      icon: Stethoscope,
      badge: `${metrics.activeDoctors} Doctors`,
      badgeColor: 'bg-lavender-100 text-[#4C1D95]'
    },
    {
      id: 'patients',
      label: currentRole === 'doctor' ? 'My Assigned Patients' : 'Patient Records & EMR',
      sublabel: currentRole === 'nurse' ? 'All Ward Bedside Charts' : 'Patient Directory & Vitals',
      icon: Users,
      badge: `${metrics.totalPatientsToday}`,
      badgeColor: 'bg-slate-100 text-slate-700'
    },
    {
      id: 'operations',
      label: 'Hospital Beds & Operations',
      sublabel: 'Add Beds, Wards & Allocations',
      icon: BedDouble,
      badge: `${metrics.availableBeds} Available`,
      badgeColor: 'bg-indigo-100 text-indigo-800'
    },
    {
      id: 'pharmacy',
      label: 'Pharmacy & Formulary',
      sublabel: 'Stock, Dispense & Medicines',
      icon: Pill,
      badge: `${metrics.pendingPrescriptions > 0 ? `${metrics.pendingPrescriptions} Reorder` : 'Normal'}`,
      badgeColor: metrics.pendingPrescriptions > 0 ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-700'
    },
    {
      id: 'lims',
      label: 'Laboratory (LIMS)',
      sublabel: 'Test Orders & Results',
      icon: FlaskConical
    },
    {
      id: 'billing',
      label: 'Billing & Cashier',
      sublabel: 'Invoices & Receipts',
      icon: CreditCard
    },
    {
      id: 'insurance',
      label: 'Insurance & Claims',
      sublabel: 'TPA Pre-authorizations',
      icon: ShieldAlert
    }
  ];

  // Strictly filter only allowed modules for this role
  const visibleNavItems = allNavItems.filter(item => allowedModules.includes(item.id));

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-slate-900/35 backdrop-blur-sm md:hidden animate-in fade-in"
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed md:sticky top-0 md:top-16 left-0 z-50 md:z-30 h-full md:h-[calc(100vh-4rem)] w-72 md:w-64 flex-shrink-0 border-r border-slate-200/80 bg-white/95 md:bg-white/85 backdrop-blur-xl flex flex-col justify-between shadow-2xl md:shadow-none transform transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Top Nav Modules */}
        <div className="p-3.5 space-y-3 overflow-y-auto">
          {/* Mobile Header inside Drawer */}
          <div className="flex items-center justify-between md:hidden pb-2 border-b border-slate-100">
            <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
              Clinical Desks
            </span>
            <button
              onClick={onCloseMobile}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
              aria-label="Close Menu"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Role Workspace Pill */}
          <div className="px-3.5 py-2.5 rounded-xl bg-gradient-to-br from-[#F7F5FF] via-white to-lavender-50/70 border border-lavender-200/80 shadow-xs flex items-center justify-between">
            <div className="flex items-center gap-2.5 min-w-0">
              <span className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#2D1B69] to-[#6D28D9] text-white text-[10px] font-display font-extrabold flex items-center justify-center flex-shrink-0 shadow-xs">
                {currentRole.slice(0, 2).toUpperCase()}
              </span>
              <div className="min-w-0">
                <p className="text-xs font-extrabold text-slate-900 capitalize truncate">
                  {currentRole.replace('_', ' ')}
                </p>
                <p className="text-[10px] text-slate-600 truncate font-semibold">
                  {visibleNavItems.length} Desk{visibleNavItems.length > 1 ? 's' : ''} Active
                </p>
              </div>
            </div>
            <div className="w-6 h-6 rounded-lg bg-emerald-50 border border-emerald-200/70 flex items-center justify-center flex-shrink-0">
              <Lock className="w-3 h-3 text-emerald-600" />
            </div>
          </div>

          <nav className="space-y-1.5">
            {visibleNavItems.map(item => {
              const Icon = item.icon;
              const isActive = activeModule === item.id;
              const accent = DESK_ICON_ACCENTS[item.id] || {
                active: 'bg-[#4C1D95] text-white shadow-lavender-700/25',
                idle: 'bg-slate-100/80 text-slate-500 group-hover:bg-lavender-50 group-hover:text-[#4C1D95]',
                card: 'from-lavender-50 via-lavender-50/40 to-white border-lavender-200/90 text-[#1C103B]'
              };

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveModule(item.id);
                    onCloseMobile?.();
                  }}
                  className={`group w-full text-left px-3 py-2.5 rounded-xl flex items-center justify-between transition-all duration-200 text-xs ${
                    isActive
                      ? `bg-gradient-to-r ${accent.card} font-bold border shadow-sm`
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50/90 border border-transparent hover:translate-x-0.5'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-200 ${
                        isActive ? `${accent.active} shadow-sm` : accent.idle
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <div className="truncate">
                      <p className="truncate leading-tight text-slate-900">{item.label}</p>
                      <p className="text-[10px] text-slate-600 truncate leading-tight font-medium mt-0.5">
                        {item.sublabel}
                      </p>
                    </div>
                  </div>

                  {item.badge && (
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold whitespace-nowrap ml-1.5 ${
                      item.badgeColor || 'bg-slate-100 text-slate-600'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Role Info */}
        <div className="p-3.5 border-t border-slate-100 bg-gradient-to-t from-slate-50/90 to-white">
          <div className="flex items-center gap-2 text-xs text-slate-600">
            <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span className="font-semibold text-slate-800 text-[11px]">Strict Role Isolation</span>
          </div>
          <p className="text-[10px] text-slate-500 mt-1 leading-snug">
            {currentRole === 'doctor' && 'Viewing clinical OPD & assigned patients only.'}
            {currentRole === 'nurse' && 'Nurse authority over all ward charts & beds.'}
            {currentRole === 'admin' && 'Administrator: add staff, give bonuses, minus salary.'}
            {currentRole === 'pharmacist' && 'Formulary dispensing & medicine management.'}
            {currentRole === 'lab_tech' && 'Specimen tests & diagnostic report approval.'}
            {currentRole === 'accountant' && 'Cashless claims & invoice reconciliation.'}
            {currentRole === 'receptionist' && 'Patient registration & OPD check-in.'}
            {currentRole === 'patient' && 'Personal health records & prescriptions.'}
          </p>
        </div>
      </aside>
    </>
  );
};
