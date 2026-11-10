import React from 'react';
import { 
  Users, 
  Stethoscope, 
  FlaskConical, 
  Pill, 
  BedDouble, 
  CreditCard, 
  ShieldAlert, 
  Cpu, 
  FolderHeart,
  DollarSign,
  ShieldCheck,
  Lock
} from 'lucide-react';
import { useHospitalOS, NavigationModule } from '../../context/HospitalOSContext';
import { UserRole } from '../../types';

interface SidebarItem {
  id: NavigationModule;
  label: string;
  sublabel: string;
  icon: React.ElementType;
  badge?: string;
  badgeColor?: string;
}

export const Sidebar: React.FC = () => {
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
      badgeColor: 'bg-sky-100 text-sky-800'
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
    },
    {
      id: 'abdm',
      label: 'ABDM India Stack',
      sublabel: 'ABHA & Standards',
      icon: Cpu
    }
  ];

  // Strictly filter only allowed modules for this role
  const visibleNavItems = allNavItems.filter(item => allowedModules.includes(item.id));

  return (
    <aside className="w-64 flex-shrink-0 border-r border-slate-200 bg-white flex flex-col justify-between hidden md:flex min-h-[calc(100vh-4rem)] shadow-xs">
      {/* Top Nav Modules */}
      <div className="p-3 space-y-2">
        {/* Role Workspace Pill */}
        <div className="px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 mb-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-base">{currentUser.avatar}</span>
            <div className="min-w-0">
              <p className="text-xs font-bold text-slate-900 capitalize truncate">
                {currentRole.replace('_', ' ')}
              </p>
              <p className="text-[10px] text-slate-500 truncate">
                {visibleNavItems.length} Desk{visibleNavItems.length > 1 ? 's' : ''} Active
              </p>
            </div>
          </div>
          <Lock className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
        </div>

        <nav className="space-y-1">
          {visibleNavItems.map(item => {
            const Icon = item.icon;
            const isActive = activeModule === item.id;

            return (
              <button
                key={item.id}
                onClick={() => setActiveModule(item.id)}
                className={`w-full text-left px-3 py-2 rounded-lg flex items-center justify-between transition text-xs ${
                  isActive
                    ? 'bg-sky-50 text-sky-900 font-bold border-l-4 border-sky-600 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-sky-600' : 'text-slate-400'}`} />
                  <div className="truncate">
                    <p className="truncate leading-tight">{item.label}</p>
                    <p className="text-[10px] text-slate-400 truncate leading-tight font-normal mt-0.5">
                      {item.sublabel}
                    </p>
                  </div>
                </div>

                {item.badge && (
                  <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium whitespace-nowrap ml-1 ${
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
      <div className="p-3 border-t border-slate-100 bg-slate-50">
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
  );
};
