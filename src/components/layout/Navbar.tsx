import React, { useState } from 'react';
import { 
  Activity, 
  ChevronDown, 
  AlertTriangle, 
  Flame, 
  Plus, 
  Building2, 
  LogOut, 
  User, 
  X,
  Bell,
  CheckCircle2,
  Calendar,
  Globe
} from 'lucide-react';
import { useHospitalOS } from '../../context/HospitalOSContext';
import { UserRole } from '../../types';

interface NavbarProps {
  onNavigateHome: () => void;
  onNavigateLogin: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onNavigateHome, onNavigateLogin }) => {
  const { 
    tenants, 
    currentTenant, 
    setCurrentTenantId, 
    addTenant,
    removeTenant,
    currentRole, 
    setCurrentRole,
    currentUser,
    logout,
    triggerEmergencyAlert,
    emergencyAlert,
    clearEmergencyAlert,
    events
  } = useHospitalOS();

  const [tenantDropdownOpen, setTenantDropdownOpen] = useState(false);
  const [tenantSearch, setTenantSearch] = useState('');
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [isAddHospModalOpen, setIsAddHospModalOpen] = useState(false);

  const [hospForm, setHospForm] = useState({
    name: '',
    type: 'hospital' as 'hospital' | 'clinic' | 'diagnostic' | 'network',
    licenseNumber: '',
    city: 'City Center'
  });

  const rolesList: { id: UserRole; label: string; badge: string; icon: string }[] = [
    { id: 'admin', label: 'Hospital Admin', badge: 'Admin Desk', icon: '👑' },
    { id: 'doctor', label: 'Doctor / Physician', badge: 'OPD & Rx', icon: '👨‍⚕️' },
    { id: 'nurse', label: 'Staff Nurse', badge: 'Wards & Care', icon: '💉' },
    { id: 'receptionist', label: 'Front Desk / Triage', badge: 'Registration', icon: '📋' },
    { id: 'pharmacist', label: 'Pharmacist', badge: 'Pharmacy', icon: '💊' },
    { id: 'lab_tech', label: 'Lab Technologist', badge: 'LIMS Lab', icon: '🔬' },
    { id: 'accountant', label: 'Accountant / Cashier', badge: 'Billing', icon: '💰' }
  ];

  const handleRoleSelect = (role: UserRole) => {
    setCurrentRole(role);
    setRoleDropdownOpen(false);
  };

  const handleAddHospitalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hospForm.name.trim()) return;

    addTenant({
      name: hospForm.name.trim(),
      type: hospForm.type,
      licenseNumber: hospForm.licenseNumber || `REG-${Date.now().toString().slice(-5)}`,
      logo: hospForm.type === 'clinic' ? '🩺' : hospForm.type === 'diagnostic' ? '🔬' : '🏥',
      tagline: `${hospForm.city} Facility`,
      branches: [
        { id: `br-${Date.now()}`, name: `${hospForm.name} Campus`, city: hospForm.city, beds: 0, activeDoctors: 0 }
      ]
    });

    setHospForm({ name: '', type: 'hospital', licenseNumber: '', city: 'City Center' });
    setIsAddHospModalOpen(false);
    setTenantDropdownOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white shadow-sm">
      {/* Emergency Alert Banner */}
      {emergencyAlert && (
        <div className="bg-rose-600 text-white px-4 py-2 flex items-center justify-between text-xs sm:text-sm font-semibold tracking-wide">
          <div className="flex items-center gap-2 truncate">
            <AlertTriangle className="w-4 h-4 flex-shrink-0 animate-bounce" />
            <span className="font-bold flex-shrink-0">CODE BLUE ALERT:</span>
            <span className="font-normal truncate">{emergencyAlert}</span>
          </div>
          <button 
            onClick={clearEmergencyAlert}
            className="ml-2 px-2.5 py-1 rounded bg-rose-800 hover:bg-rose-900 text-xs uppercase tracking-wider text-white transition flex-shrink-0"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Main Bar */}
      <div className="w-full px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
        {/* Left Side: Brand Logo & Hospital Switcher */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <button 
            onClick={onNavigateHome}
            className="flex items-center gap-2 text-left focus:outline-none"
            title="Hospital OS Home"
          >
            <div className="w-9 h-9 rounded-xl bg-sky-600 flex items-center justify-center text-white shadow-sm">
              <Activity className="w-5 h-5" />
            </div>
            <div className="hidden sm:block">
              <span className="font-bold text-base tracking-tight text-slate-900">
                Hospital<span className="text-sky-600">OS</span>
              </span>
            </div>
          </button>

          <div className="h-6 w-px bg-slate-200 hidden sm:block" />

          {/* Hospital Facility Selector */}
          <div className="relative">
            <button
              onClick={() => setTenantDropdownOpen(!tenantDropdownOpen)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 border border-slate-200 text-xs text-slate-800 transition"
              title="Switch or Add Hospital"
            >
              <span className="text-base">{currentTenant.logo}</span>
              <div className="text-left hidden md:block max-w-[170px] truncate">
                <p className="font-semibold text-slate-900 truncate text-xs leading-tight">
                  {currentTenant.name}
                </p>
                <p className="text-[10px] text-slate-500 uppercase font-mono">
                  {currentTenant.type}
                </p>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
            </button>

            {tenantDropdownOpen && (
              <div 
                className="absolute left-0 mt-2 w-80 rounded-xl bg-white border border-slate-200 shadow-xl p-2 z-50 animate-in fade-in"
                onMouseLeave={() => setTenantDropdownOpen(false)}
              >
                <div className="px-2 py-1.5 border-b border-slate-100 flex items-center justify-between text-[11px] font-semibold text-slate-500">
                  <span>Hospitals ({tenants.length})</span>
                  <button
                    onClick={() => {
                      setIsAddHospModalOpen(true);
                      setTenantDropdownOpen(false);
                    }}
                    className="text-sky-600 hover:text-sky-700 font-bold flex items-center gap-1 text-[11px]"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Hospital</span>
                  </button>
                </div>

                {/* Search across up to 1,000 hospitals */}
                <div className="p-1 mt-1">
                  <input
                    type="text"
                    value={tenantSearch}
                    onChange={(e) => setTenantSearch(e.target.value)}
                    placeholder="Filter hospitals by name/license..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-sky-500"
                  />
                </div>

                <div className="space-y-1 mt-1 max-h-60 overflow-y-auto">
                  {tenants
                    .filter(t => 
                      t.name.toLowerCase().includes(tenantSearch.toLowerCase()) || 
                      t.licenseNumber.toLowerCase().includes(tenantSearch.toLowerCase())
                    )
                    .slice(0, 10)
                    .map(t => (
                      <div 
                        key={t.id}
                        onClick={() => {
                          setCurrentTenantId(t.id);
                          setTenantDropdownOpen(false);
                        }}
                        className={`w-full text-left p-2 rounded-lg flex items-center justify-between text-xs cursor-pointer transition ${
                          currentTenant.id === t.id 
                            ? 'bg-sky-50 text-sky-900 font-semibold border border-sky-200' 
                            : 'hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <div className="flex items-center gap-2 truncate">
                          <span className="text-base flex-shrink-0">{t.logo}</span>
                          <div className="truncate">
                            <p className="font-medium text-slate-900 truncate">{t.name}</p>
                            <p className="text-[10px] text-slate-400 capitalize">{t.type} • {t.tagline}</p>
                          </div>
                        </div>
                        {tenants.length > 1 && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              removeTenant(t.id);
                            }}
                            className="text-slate-400 hover:text-rose-500 p-1 rounded"
                            title="Remove Hospital"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    ))}
                </div>

                <div className="mt-2 pt-2 border-t border-slate-100">
                  <button
                    onClick={() => {
                      setIsAddHospModalOpen(true);
                      setTenantDropdownOpen(false);
                    }}
                    className="w-full py-1.5 px-2 rounded-lg bg-sky-50 hover:bg-sky-100 text-sky-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>+ Register Another Hospital / Clinic</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Role Selector, Code Blue Button, User Menu & Notifications */}
        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
          {/* Role Persona Switcher */}
          <div className="relative">
            <button
              onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 border border-slate-200 text-xs text-slate-800 transition"
              title="Switch Active Staff Role"
            >
              <span className="text-sm">{currentUser.avatar}</span>
              <span className="font-medium text-slate-900 text-xs hidden sm:inline capitalize">
                {currentRole.replace('_', ' ')}
              </span>
              <ChevronDown className="w-3 h-3 text-slate-500" />
            </button>

            {roleDropdownOpen && (
              <div 
                className="absolute right-0 mt-2 w-64 rounded-xl bg-white border border-slate-200 shadow-xl p-2 z-50 animate-in fade-in"
                onMouseLeave={() => setRoleDropdownOpen(false)}
              >
                <div className="px-2 py-1 border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Switch Active Role Desk
                </div>
                <div className="space-y-1 mt-1 max-h-72 overflow-y-auto">
                  {rolesList.map(r => (
                    <button
                      key={r.id}
                      onClick={() => handleRoleSelect(r.id)}
                      className={`w-full text-left p-2 rounded-lg flex items-center justify-between text-xs transition ${
                        currentRole === r.id 
                          ? 'bg-sky-50 text-sky-900 font-semibold border border-sky-200' 
                          : 'hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-base">{r.icon}</span>
                        <span className="text-slate-900 font-medium text-xs">{r.label}</span>
                      </div>
                      <span className="text-[10px] text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                        {r.badge}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* CODE BLUE CRITICAL BUTTON */}
          <button
            onClick={() => triggerEmergencyAlert('Code Blue in ICU Bed 01. Emergency Rapid Response Team Dispatched.')}
            className="flex-shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-sm transition active:scale-95"
            title="Trigger Immediate Hospital-Wide Code Blue Alert"
          >
            <Flame className="w-3.5 h-3.5 text-white animate-bounce flex-shrink-0" />
            <span className="tracking-wide uppercase font-mono text-xs whitespace-nowrap">Code Blue</span>
          </button>

          {/* Notifications Stream */}
          <div className="relative">
            <button
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              className="relative p-2 rounded-lg bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-600 hover:text-slate-900 transition"
              title="Hospital Event Notifications"
            >
              <Bell className="w-4 h-4" />
              {events.length > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-500" />
              )}
            </button>

            {notificationsOpen && (
              <div 
                className="absolute right-0 mt-2 w-80 rounded-xl bg-white border border-slate-200 shadow-xl p-3 z-50 animate-in fade-in"
                onMouseLeave={() => setNotificationsOpen(false)}
              >
                <div className="flex items-center justify-between pb-2 border-b border-slate-100 text-xs font-bold text-slate-700">
                  <span>Hospital System Logs</span>
                  <span className="text-[10px] text-slate-400 font-normal">{events.length} events</span>
                </div>

                <div className="space-y-1.5 mt-2 max-h-72 overflow-y-auto">
                  {events.slice(0, 6).map(evt => (
                    <div 
                      key={evt.id}
                      className="p-2 rounded-lg bg-slate-50 border border-slate-100 text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-slate-800 text-xs truncate">{evt.title}</span>
                        <span className="text-[10px] text-slate-400">{evt.timestamp}</span>
                      </div>
                      <p className="text-[11px] text-slate-600 mt-0.5">{evt.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* User Profile & Logout */}
          <div className="relative">
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="flex items-center gap-1.5 p-1 rounded-lg hover:bg-slate-100 transition"
              title="User Account"
            >
              <div className="w-7 h-7 rounded-lg bg-sky-100 text-sky-800 flex items-center justify-center font-bold text-xs border border-sky-200">
                {currentUser.name[0]}
              </div>
              <ChevronDown className="w-3 h-3 text-slate-500 hidden sm:block" />
            </button>

            {userMenuOpen && (
              <div 
                className="absolute right-0 mt-2 w-56 rounded-xl bg-white border border-slate-200 shadow-xl p-2 z-50 animate-in fade-in"
                onMouseLeave={() => setUserMenuOpen(false)}
              >
                <div className="p-2 border-b border-slate-100">
                  <p className="font-bold text-xs text-slate-900 truncate">{currentUser.name}</p>
                  <p className="text-[10px] text-slate-500 truncate">{currentUser.title}</p>
                </div>

                <div className="pt-1 space-y-0.5">
                  <button
                    onClick={() => {
                      logout();
                      setUserMenuOpen(false);
                      onNavigateHome();
                    }}
                    className="w-full text-left p-2 rounded-lg hover:bg-rose-50 text-rose-600 text-xs font-semibold flex items-center gap-2 transition"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add Hospital Modal */}
      {isAddHospModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-2xl bg-white border border-slate-200 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-sky-50 text-sky-600">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">Register Hospital / Clinic</h3>
                  <p className="text-xs text-slate-500">Add a new healthcare facility to your platform</p>
                </div>
              </div>
              <button 
                onClick={() => setIsAddHospModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddHospitalSubmit} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Hospital / Facility Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Metro Specialty Hospital & Trauma Center"
                  value={hospForm.name}
                  onChange={e => setHospForm({ ...hospForm, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-sky-500 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Facility Type
                  </label>
                  <select
                    value={hospForm.type}
                    onChange={e => setHospForm({ ...hospForm, type: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-sky-500 focus:bg-white"
                  >
                    <option value="hospital">Hospital (Multi-Specialty)</option>
                    <option value="clinic">Clinic (Primary Care)</option>
                    <option value="diagnostic">Diagnostic Laboratory</option>
                    <option value="network">Multi-Branch Network</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    City / Location
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Mumbai, Bengaluru"
                    value={hospForm.city}
                    onChange={e => setHospForm({ ...hospForm, city: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-sky-500 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  State / Health Authority License No.
                </label>
                <input
                  type="text"
                  placeholder="e.g. REG-HOSP-2026-99"
                  value={hospForm.licenseNumber}
                  onChange={e => setHospForm({ ...hospForm, licenseNumber: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-sky-500 focus:bg-white"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddHospModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-xs font-medium text-slate-600 hover:text-slate-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs shadow-sm transition"
                >
                  Save & Activate Hospital
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </header>
  );
};
