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
    active: 'bg-gradient-to-br from-[#10221F] to-[#1D4840] text-white shadow-[#10221F]/25',
    idle: 'bg-[#E7F0E9] text-[#1D4840] group-hover:bg-[#B7D3C6]/50',
    card: 'from-[#E7F0E9] via-[#F4F8F5] to-white border-[#B7D3C6] text-[#10221F]'
  },
  doctors: {
    active: 'bg-gradient-to-br from-[#1D4840] to-[#39786B] text-white shadow-[#1D4840]/25',
    idle: 'bg-[#E7F0E9] text-[#39786B] group-hover:bg-[#B7D3C6]/50',
    card: 'from-[#E7F0E9] via-[#F4F8F5] to-white border-[#B7D3C6] text-[#10221F]'
  },
  patients: {
    active: 'bg-gradient-to-br from-[#1D4840] to-[#39786B] text-white shadow-[#1D4840]/25',
    idle: 'bg-[#E7F0E9] text-[#1D4840] group-hover:bg-[#B7D3C6]/50',
    card: 'from-[#E7F0E9] via-[#F4F8F5] to-white border-[#B7D3C6] text-[#10221F]'
  },
  operations: {
    active: 'bg-gradient-to-br from-[#39786B] to-[#79A99A] text-white shadow-[#39786B]/25',
    idle: 'bg-[#E7F0E9] text-[#1D4840] group-hover:bg-[#B7D3C6]/50',
    card: 'from-[#E7F0E9] via-[#F4F8F5] to-white border-[#B7D3C6] text-[#10221F]'
  },
  pharmacy: {
    active: 'bg-gradient-to-br from-[#10221F] to-[#39786B] text-white shadow-[#10221F]/25',
    idle: 'bg-[#E7F0E9] text-[#39786B] group-hover:bg-[#B7D3C6]/50',
    card: 'from-[#E7F0E9] via-[#F4F8F5] to-white border-[#B7D3C6] text-[#10221F]'
  },
  lims: {
    active: 'bg-gradient-to-br from-[#1D4840] to-[#39786B] text-white shadow-[#1D4840]/25',
    idle: 'bg-[#E7F0E9] text-[#39786B] group-hover:bg-[#B7D3C6]/50',
    card: 'from-[#E7F0E9] via-[#F4F8F5] to-white border-[#B7D3C6] text-[#10221F]'
  },
  billing: {
    active: 'bg-gradient-to-br from-[#10221F] to-[#1D4840] text-white shadow-[#10221F]/25',
    idle: 'bg-[#E7F0E9] text-[#1D4840] group-hover:bg-[#B7D3C6]/50',
    card: 'from-[#E7F0E9] via-[#F4F8F5] to-white border-[#B7D3C6] text-[#10221F]'
  },
  insurance: {
    active: 'bg-gradient-to-br from-[#39786B] to-[#1D4840] text-white shadow-[#39786B]/25',
    idle: 'bg-[#E7F0E9] text-[#1D4840] group-hover:bg-[#B7D3C6]/50',
    card: 'from-[#E7F0E9] via-[#F4F8F5] to-white border-[#B7D3C6] text-[#10221F]'
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
      badgeColor: 'bg-[#E7F0E9] text-[#1D4840]'
    },
    {
      id: 'doctors',
      label: 'Doctor OPD Desk',
      sublabel: 'Consultation & Prescriptions',
      icon: Stethoscope,
      badge: `${metrics.activeDoctors} Doctors`,
      badgeColor: 'bg-[#E7F0E9] text-[#39786B]'
    },
    {
      id: 'patients',
      label: currentRole === 'doctor' ? 'My Assigned Patients' : 'Patient Records & EMR',
      sublabel: currentRole === 'nurse' ? 'All Ward Bedside Charts' : 'Patient Directory & Vitals',
      icon: Users,
      badge: `${metrics.totalPatientsToday}`,
      badgeColor: 'bg-[#E7F0E9] text-[#10221F]'
    },
    {
      id: 'operations',
      label: 'Hospital Beds & Operations',
      sublabel: 'Add Beds, Wards & Allocations',
      icon: BedDouble,
      badge: `${metrics.availableBeds} Available`,
      badgeColor: 'bg-[#E7F0E9] text-[#1D4840]'
    },
    {
      id: 'pharmacy',
      label: 'Pharmacy & Formulary',
      sublabel: 'Stock, Dispense & Medicines',
      icon: Pill,
      badge: `${metrics.pendingPrescriptions > 0 ? `${metrics.pendingPrescriptions} Reorder` : 'Normal'}`,
      badgeColor: metrics.pendingPrescriptions > 0 ? 'bg-[#B7D3C6]/60 text-[#10221F]' : 'bg-[#E7F0E9] text-[#1D4840]'
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
          className="fixed inset-0 z-40 bg-hospital-950/35 backdrop-blur-sm md:hidden animate-in fade-in"
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed md:sticky top-0 md:top-16 left-0 z-50 md:z-30 h-full md:h-[calc(100vh-4rem)] w-72 md:w-64 flex-shrink-0 border-r border-hospital-300/80 bg-white/95 md:bg-white/85 backdrop-blur-xl flex flex-col justify-between shadow-2xl md:shadow-none transform transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Top Nav Modules */}
        <div className="p-3.5 space-y-3 overflow-y-auto">
          {/* Mobile Header inside Drawer */}
          <div className="flex items-center justify-between md:hidden pb-2 border-b border-hospital-50">
            <span className="text-xs font-extrabold uppercase tracking-wider text-hospital-700">
              Clinical Desks
            </span>
            <button
              onClick={onCloseMobile}
              className="p-1.5 rounded-lg text-hospital-700 hover:text-hospital-900 hover:bg-hospital-50 transition"
              aria-label="Close Menu"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Role Workspace Pill */}
          <div className="px-3.5 py-2.5 rounded-xl bg-gradient-to-br from-[#E7F0E9] via-white to-hospital-50/70 border border-hospital-200/80 shadow-xs flex items-center justify-between">
            <div className="flex items-center gap-2.5 min-w-0">
              <span className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#1D4840] to-[#39786B] text-white text-[10px] font-display font-extrabold flex items-center justify-center flex-shrink-0 shadow-xs">
                {currentRole.slice(0, 2).toUpperCase()}
              </span>
              <div className="min-w-0">
                <p className="text-xs font-extrabold text-hospital-950 capitalize truncate">
                  {currentRole.replace('_', ' ')}
                </p>
                <p className="text-[10px] text-hospital-800 truncate font-semibold">
                  {visibleNavItems.length} Desk{visibleNavItems.length > 1 ? 's' : ''} Active
                </p>
              </div>
            </div>
            <div className="w-6 h-6 rounded-lg bg-hospital-50 border border-hospital-200/70 flex items-center justify-center flex-shrink-0">
              <Lock className="w-3 h-3 text-hospital-600" />
            </div>
          </div>

          <nav className="space-y-1.5">
            {visibleNavItems.map(item => {
              const Icon = item.icon;
              const isActive = activeModule === item.id;
              const accent = DESK_ICON_ACCENTS[item.id] || {
                active: 'bg-[#39786B] text-white shadow-hospital-800/25',
                idle: 'bg-hospital-50/80 text-hospital-700 group-hover:bg-hospital-50 group-hover:text-[#39786B]',
                card: 'from-hospital-50 via-hospital-50/40 to-white border-hospital-200/90 text-[#10221F]'
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
                      : 'text-hospital-800 hover:text-hospital-950 hover:bg-hospital-50/90 border border-transparent hover:translate-x-0.5'
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
                      <p className="truncate leading-tight text-hospital-950">{item.label}</p>
                      <p className="text-[10px] text-hospital-800 truncate leading-tight font-medium mt-0.5">
                        {item.sublabel}
                      </p>
                    </div>
                  </div>

                  {item.badge && (
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold whitespace-nowrap ml-1.5 ${
                      item.badgeColor || 'bg-hospital-50 text-hospital-800'
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
        <div className="p-3.5 border-t border-hospital-50 bg-gradient-to-t from-hospital-50/90 to-white">
          <div className="flex items-center gap-2 text-xs text-hospital-800">
            <ShieldCheck className="w-4 h-4 text-hospital-600 flex-shrink-0" />
            <span className="font-semibold text-hospital-900 text-[11px]">Strict Role Isolation</span>
          </div>
          <p className="text-[10px] text-hospital-700 mt-1 leading-snug">
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
