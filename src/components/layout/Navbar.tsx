import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { 
  Activity, 
  ChevronDown, 
  AlertTriangle, 
  Flame, 
  Plus, 
  Building2, 
  LogOut, 
  X,
  Bell,
  Menu
} from 'lucide-react';
import { useHospitalOS } from '../../context/HospitalOSContext';
import { UserRole } from '../../types';
import { BrandLogo } from '../common/BrandLogo';

interface NavbarProps {
  onNavigateHome: () => void;
  onNavigateLogin: () => void;
  onToggleMobileSidebar?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onNavigateHome, onNavigateLogin, onToggleMobileSidebar }) => {
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
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (headerRef.current && !headerRef.current.contains(event.target as Node)) {
        setTenantDropdownOpen(false);
        setRoleDropdownOpen(false);
        setNotificationsOpen(false);
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const [hospForm, setHospForm] = useState({
    name: '',
    type: 'hospital' as 'hospital' | 'clinic' | 'diagnostic' | 'network',
    licenseNumber: '',
    city: ''
  });
  const [hospFormError, setHospFormError] = useState('');

  const rolesList: { id: UserRole; label: string; badge: string; code: string; gradient: string }[] = [
    { id: 'admin', label: 'Hospital Admin', badge: 'Admin Desk', code: 'AD', gradient: 'from-hospital-500 to-hospital-600' },
    { id: 'doctor', label: 'Doctor / Physician', badge: 'OPD & Rx', code: 'DR', gradient: 'from-hospital-500 to-hospital-600' },
    { id: 'nurse', label: 'Staff Nurse', badge: 'Wards & Care', code: 'NR', gradient: 'from-hospital-500 to-hospital-600' },
    { id: 'receptionist', label: 'Front Desk / Triage', badge: 'Registration', code: 'FD', gradient: 'from-hospital-500 to-hospital-600' },
    { id: 'pharmacist', label: 'Pharmacist', badge: 'Pharmacy', code: 'PH', gradient: 'from-hospital-500 to-hospital-600' },
    { id: 'lab_tech', label: 'Lab Technologist', badge: 'LIMS Lab', code: 'LB', gradient: 'from-hospital-500 to-hospital-600' },
    { id: 'accountant', label: 'Accountant / Cashier', badge: 'Billing', code: 'AC', gradient: 'from-hospital-500 to-hospital-600' }
  ];

  const activeRoleMeta = rolesList.find(r => r.id === currentRole) || rolesList[0];

  const handleRoleSelect = (role: UserRole) => {
    setCurrentRole(role);
    setRoleDropdownOpen(false);
  };

  const handleAddHospitalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = hospForm.name.trim();
    if (!trimmedName) {
      setHospFormError('Please enter a Hospital / Facility Name.');
      return;
    }
    const cityLabel = hospForm.city.trim() || 'City Center';

    addTenant({
      name: trimmedName,
      type: hospForm.type,
      licenseNumber: hospForm.licenseNumber.trim() || `REG-${Date.now().toString().slice(-5)}`,
      logo: hospForm.type === 'clinic' ? '🩺' : hospForm.type === 'diagnostic' ? '🔬' : '🏥',
      tagline: `${cityLabel} Facility`,
      branches: [
        { id: `br-${Date.now()}`, name: `${trimmedName} Medical Center`, city: cityLabel, beds: 0, activeDoctors: 0 }
      ]
    });

    setHospFormError('');
    setHospForm({ name: '', type: 'hospital', licenseNumber: '', city: '' });
    setIsAddHospModalOpen(false);
    setTenantDropdownOpen(false);
  };

  return (
    <>
    <header ref={headerRef} className="sticky top-0 z-40 w-full border-b border-hospital-300 bg-white/95 backdrop-blur-md shadow-xs transition-all">
      {/* Emergency Alert Banner */}
      {emergencyAlert && (
        <div className="bg-gradient-to-r from-rose-600 via-red-600 to-rose-600 text-white px-4 py-2 flex items-center justify-between text-xs sm:text-sm font-semibold tracking-wide animate-in fade-in">
          <div className="flex items-center gap-2 truncate">
            <AlertTriangle className="w-4 h-4 flex-shrink-0 animate-bounce" />
            <span className="font-bold flex-shrink-0">CODE BLUE ALERT:</span>
            <span className="font-normal truncate">{emergencyAlert}</span>
          </div>
          <button 
            onClick={clearEmergencyAlert}
            className="ml-2 px-3 py-1 rounded-lg bg-white/15 hover:bg-white/25 backdrop-blur-sm text-xs uppercase tracking-wider text-white transition flex-shrink-0"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Main Bar */}
      <div className="w-full px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
        {/* Left Side: Mobile Drawer Toggle, Brand Logo & Hospital Switcher */}
        <div className="flex items-center gap-2.5 sm:gap-3 flex-shrink-0">
          {onToggleMobileSidebar && (
            <button
              onClick={onToggleMobileSidebar}
              className="md:hidden p-2 rounded-xl bg-hospital-50/80 hover:bg-hospital-300/80 border border-hospital-300/80 text-hospital-900 transition active:scale-95"
              title="Open Workspace Menu"
              aria-label="Open Workspace Menu"
            >
              <Menu className="w-4 h-4" />
            </button>
          )}

          <button 
            onClick={onNavigateHome}
            className="flex items-center text-left focus:outline-none group"
            title="Hospital OS Home"
          >
            <BrandLogo size="md" className="group-hover:opacity-90 transition-opacity" />
          </button>

          <div className="h-6 w-px bg-hospital-300/80 hidden sm:block" />

          {/* Hospital Facility Selector */}
          <div className="relative">
            <button
              onClick={() => {
                setTenantDropdownOpen(!tenantDropdownOpen);
                setRoleDropdownOpen(false);
                setNotificationsOpen(false);
                setUserMenuOpen(false);
              }}
              className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-white hover:bg-hospital-50/60 border border-hospital-300/95 hover:border-[#39786B]/40 text-xs text-hospital-900 shadow-xs transition-all duration-200 active:scale-[0.98]"
              title="Switch or Add Hospital"
            >
              <span className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#1D4840] to-[#39786B] text-white font-display font-bold text-[11px] flex items-center justify-center flex-shrink-0 shadow-xs">
                {currentTenant.name
                  .trim()
                  .split(/\s+/)
                  .slice(0, 2)
                  .map(w => w[0]?.toUpperCase() || '')
                  .join('')}
              </span>
              <div className="text-left hidden md:block max-w-[175px] truncate">
                <p className="font-display font-bold text-hospital-950 truncate text-xs leading-tight">
                  {currentTenant.name}
                </p>
                <p className="text-[10px] text-hospital-800 uppercase font-mono font-semibold">
                  {currentTenant.type}
                </p>
              </div>
              <ChevronDown className={`w-3.5 h-3.5 text-hospital-700 transition-transform duration-200 ${tenantDropdownOpen ? 'rotate-180 text-[#39786B]' : ''}`} />
            </button>

            {tenantDropdownOpen && (
              <div 
                className="absolute left-0 mt-2 w-80 rounded-2xl bg-white/95 backdrop-blur-xl border border-hospital-300/90 shadow-2xl shadow-hospital-950/10 p-2.5 z-50 animate-in fade-in"
              >
                <div className="px-2 py-1.5 border-b border-hospital-50 flex items-center justify-between text-[11px] font-bold text-hospital-800">
                  <span>Registered Hospitals ({tenants.length})</span>
                </div>

                {/* Search across up to 1,000 hospitals */}
                <div className="p-1 mt-1">
                  <input
                    type="text"
                    value={tenantSearch}
                    onChange={(e) => setTenantSearch(e.target.value)}
                    placeholder="Filter hospitals by name/license..."
                    className="w-full bg-hospital-50 border border-hospital-300 rounded-lg px-2.5 py-1.5 text-xs text-hospital-950 placeholder-hospital-500 focus:outline-none focus:border-[#39786B]"
                  />
                </div>

                <div className="space-y-1 mt-1 max-h-60 overflow-y-auto">
                  {tenants
                    .filter(t => 
                      t.name.toLowerCase().includes(tenantSearch.toLowerCase()) || 
                      t.licenseNumber.toLowerCase().includes(tenantSearch.toLowerCase())
                    )
                    .map(t => (
                      <div 
                        key={t.id}
                        onClick={() => {
                          setCurrentTenantId(t.id);
                          setTenantDropdownOpen(false);
                        }}
                        className={`w-full text-left p-2 rounded-lg flex items-center justify-between text-xs cursor-pointer transition ${
                          currentTenant.id === t.id 
                            ? 'bg-hospital-50 text-hospital-950 font-semibold border border-hospital-200' 
                            : 'hover:bg-hospital-50 text-hospital-900'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 truncate">
                          <span className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#1D4840] to-[#39786B] text-white font-display font-bold text-[10px] flex items-center justify-center flex-shrink-0">
                            {t.name
                              .trim()
                              .split(/\s+/)
                              .slice(0, 2)
                              .map(w => w[0]?.toUpperCase() || '')
                              .join('')}
                          </span>
                          <div className="truncate">
                            <p className="font-display font-bold text-hospital-950 truncate">{t.name}</p>
                            <p className="text-[10px] text-hospital-800 font-medium capitalize">{t.type} &bull; {t.tagline}</p>
                          </div>
                        </div>
                        {tenants.length > 1 && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              removeTenant(t.id);
                            }}
                            className="text-hospital-700 hover:text-hospital-500 p-1 rounded"
                            title="Remove Hospital"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    ))}
                </div>

                <div className="mt-2 pt-2 border-t border-hospital-50">
                  <button
                    onClick={() => {
                      setIsAddHospModalOpen(true);
                      setTenantDropdownOpen(false);
                    }}
                    className="w-full py-2 px-3 rounded-xl bg-hospital-50 hover:bg-hospital-100 text-[#39786B] text-xs font-bold flex items-center justify-center gap-1.5 border border-hospital-200/80 transition"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Hospital / Clinic</span>
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
              onClick={() => {
                setRoleDropdownOpen(!roleDropdownOpen);
                setTenantDropdownOpen(false);
                setNotificationsOpen(false);
                setUserMenuOpen(false);
              }}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/90 hover:bg-hospital-50 border border-hospital-300/90 hover:border-hospital-300 text-xs text-hospital-900 shadow-sm transition-all duration-200 active:scale-[0.98]"
              title="Switch Active Staff Role"
            >
              <span className={`w-5 h-5 rounded-md bg-gradient-to-br ${activeRoleMeta.gradient} text-white text-[9px] font-display font-extrabold flex items-center justify-center flex-shrink-0`}>
                {activeRoleMeta.code}
              </span>
              <span className="font-bold text-hospital-950 text-xs hidden sm:inline capitalize">
                {currentRole.replace('_', ' ')}
              </span>
              <ChevronDown className={`w-3 h-3 text-hospital-700 transition-transform duration-200 ${roleDropdownOpen ? 'rotate-180 text-[#39786B]' : ''}`} />
            </button>

            {roleDropdownOpen && (
              <div 
                className="absolute right-0 mt-2 w-64 rounded-2xl bg-white/95 backdrop-blur-xl border border-hospital-300/90 shadow-2xl shadow-hospital-950/10 p-2 z-50 glide-enter"
              >
                <div className="px-2.5 py-1.5 border-b border-hospital-50 text-[10px] font-extrabold text-hospital-800 uppercase tracking-wider">
                  Switch Active Role Desk
                </div>
                <div className="space-y-1 mt-1.5 max-h-72 overflow-y-auto">
                  {rolesList.map(r => (
                    <button
                      key={r.id}
                      onClick={() => handleRoleSelect(r.id)}
                      className={`w-full text-left p-2 rounded-xl flex items-center justify-between text-xs transition ${
                        currentRole === r.id 
                          ? 'bg-hospital-50 text-hospital-950 font-bold border border-hospital-200' 
                          : 'hover:bg-hospital-50 text-hospital-900'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className={`w-6 h-6 rounded-lg bg-gradient-to-br ${r.gradient} text-white text-[9px] font-display font-extrabold flex items-center justify-center flex-shrink-0`}>
                          {r.code}
                        </span>
                        <span className="text-hospital-950 font-semibold text-xs">{r.label}</span>
                      </div>
                      <span className="text-[10px] font-semibold text-hospital-800 bg-hospital-50 px-2 py-0.5 rounded-md">
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
            className="flex-shrink-0 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-hospital-600 to-red-600 hover:from-hospital-500 hover:to-red-600 text-white font-bold text-xs shadow-md shadow-hospital-500/20 hover:shadow-lg hover:shadow-hospital-500/30 transition-all duration-200 active:scale-95"
            title="Trigger Immediate Hospital-Wide Code Blue Alert"
          >
            <Flame className="w-3.5 h-3.5 text-white animate-pulse flex-shrink-0" />
            <span className="tracking-wide uppercase font-mono text-xs whitespace-nowrap">Code Blue</span>
          </button>

          {/* Notifications Stream */}
          <div className="relative">
            <button
              onClick={() => {
                setNotificationsOpen(!notificationsOpen);
                setTenantDropdownOpen(false);
                setRoleDropdownOpen(false);
                setUserMenuOpen(false);
              }}
              className="relative p-2 rounded-xl bg-white/90 hover:bg-hospital-50 border border-hospital-300/90 hover:border-hospital-300 text-hospital-800 hover:text-[#1D4840] shadow-sm transition-all duration-200 active:scale-95"
              title="Hospital Event Notifications"
            >
              <Bell className="w-4 h-4" />
              {events.length > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-hospital-500 ring-2 ring-white" />
              )}
            </button>

            {notificationsOpen && (
              <div 
                className="absolute right-0 mt-2 w-80 rounded-2xl bg-white/95 backdrop-blur-xl border border-hospital-300/90 shadow-2xl shadow-hospital-950/10 p-3 z-50 glide-enter"
              >
                <div className="flex items-center justify-between pb-2 border-b border-hospital-50 text-xs font-extrabold text-hospital-900">
                  <span>Hospital System Logs</span>
                  <span className="text-[10px] text-hospital-800 font-semibold">{events.length} events</span>
                </div>

                <div className="space-y-1.5 mt-2 max-h-72 overflow-y-auto">
                  {events.slice(0, 6).map(evt => (
                    <div 
                      key={evt.id}
                      className="p-2 rounded-lg bg-hospital-50 border border-hospital-50 text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-hospital-900 text-xs truncate">{evt.title}</span>
                        <span className="text-[10px] text-hospital-700">{evt.timestamp}</span>
                      </div>
                      <p className="text-[11px] text-hospital-800 mt-0.5">{evt.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* User Profile & Logout */}
          <div className="relative">
            <button
              onClick={() => {
                setUserMenuOpen(!userMenuOpen);
                setTenantDropdownOpen(false);
                setRoleDropdownOpen(false);
                setNotificationsOpen(false);
              }}
              className="flex items-center gap-1.5 p-1 rounded-xl hover:bg-hospital-50/80 transition-all duration-200 active:scale-95"
              title="User Account"
            >
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-hospital-100 to-hospital-200 text-[#1D4840] flex items-center justify-center font-bold text-xs border border-hospital-300/80 shadow-xs">
                {currentUser.name[0]}
              </div>
              <ChevronDown className={`w-3 h-3 text-hospital-700 hidden sm:block transition-transform duration-200 ${userMenuOpen ? 'rotate-180' : ''}`} />
            </button>

            {userMenuOpen && (
              <div 
                className="absolute right-0 mt-2 w-56 rounded-2xl bg-white/95 backdrop-blur-xl border border-hospital-300/90 shadow-2xl shadow-hospital-950/10 p-2 z-50 animate-in fade-in"
              >
                <div className="p-2 border-b border-hospital-50">
                  <p className="font-bold text-xs text-hospital-950 truncate">{currentUser.name}</p>
                  <p className="text-[10px] text-hospital-700 truncate">{currentUser.title}</p>
                </div>

                <div className="pt-1 space-y-0.5">
                  <button
                    onClick={() => {
                      logout();
                      setUserMenuOpen(false);
                      onNavigateHome();
                    }}
                    className="w-full text-left p-2 rounded-lg hover:bg-hospital-50 text-hospital-600 text-xs font-semibold flex items-center gap-2 transition"
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
    </header>

    {/* Add Hospital Modal — rendered via Portal so header backdrop-filter never clips fixed positioning */}
    {isAddHospModalOpen &&
      typeof document !== 'undefined' &&
      createPortal(
        <div
          onClick={() => setIsAddHospModalOpen(false)}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-hospital-950/60 backdrop-blur-xs p-4 animate-in fade-in duration-150 overflow-y-auto"
        >
          <div
            onClick={e => e.stopPropagation()}
            className="w-full max-w-md my-auto max-h-[90vh] overflow-y-auto rounded-2xl bg-white border border-hospital-300 shadow-2xl glide-enter"
          >
            <div className="h-1.5 w-full bg-gradient-to-r from-[#1D4840] via-[#39786B] to-[#39786B]" />
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-hospital-50">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-hospital-50 text-[#39786B] border border-hospital-200/80">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-hospital-950 text-base">Register Hospital / Clinic</h3>
                    <p className="text-xs font-medium text-hospital-900">Add a new healthcare facility to your network</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsAddHospModalOpen(false)}
                  className="text-hospital-800 hover:text-hospital-950 hover:bg-hospital-50 rounded-lg p-1.5"
                  aria-label="Close Register Hospital dialog"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAddHospitalSubmit} className="space-y-3.5" noValidate>
                {hospFormError && (
                  <div className="px-3 py-2 rounded-xl bg-hospital-50 border border-hospital-200 text-hospital-700 text-xs font-semibold">
                    {hospFormError}
                  </div>
                )}

                <div>
                  <label className="text-xs font-bold text-hospital-900 block mb-1">
                    Hospital / Facility Name *
                  </label>
                  <input
                    type="text"
                    required
                    autoFocus
                    placeholder="e.g. Lotus Specialty Hospital"
                    value={hospForm.name}
                    onChange={e => {
                      setHospForm({ ...hospForm, name: e.target.value });
                      if (hospFormError) setHospFormError('');
                    }}
                    className="w-full px-3.5 py-2 rounded-xl bg-hospital-50 border border-hospital-300/80 text-xs font-medium text-hospital-950 focus:outline-none focus:border-[#39786B] focus:bg-white transition"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-hospital-900 block mb-1">
                      Facility Type
                    </label>
                    <select
                      value={hospForm.type}
                      onChange={e => setHospForm({ ...hospForm, type: e.target.value as 'hospital' | 'clinic' | 'diagnostic' | 'network' })}
                      className="w-full px-3.5 py-2 rounded-xl bg-hospital-50 border border-hospital-300/80 text-xs font-medium text-hospital-950 focus:outline-none focus:border-[#39786B] focus:bg-white transition"
                    >
                      <option value="hospital">Hospital (Multi-Specialty)</option>
                      <option value="clinic">Clinic (Primary Care)</option>
                      <option value="diagnostic">Diagnostic Laboratory</option>
                      <option value="network">Multi-Branch Network</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-hospital-900 block mb-1">
                      City / Location
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Hyderabad, Mumbai"
                      value={hospForm.city}
                      onChange={e => setHospForm({ ...hospForm, city: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl bg-hospital-50 border border-hospital-300/80 text-xs font-medium text-hospital-950 focus:outline-none focus:border-[#39786B] focus:bg-white transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-hospital-900 block mb-1">
                    State / Health Authority License No.
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. REG-HOSP-2026-99"
                    value={hospForm.licenseNumber}
                    onChange={e => setHospForm({ ...hospForm, licenseNumber: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-hospital-50 border border-hospital-300/80 text-xs font-mono font-medium text-hospital-950 focus:outline-none focus:border-[#39786B] focus:bg-white transition"
                  />
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="submit"
                    className="w-full sm:w-auto px-5 py-2.5 rounded-xl btn-zoho-primary text-white font-bold text-xs transition active:scale-[0.98]"
                  >
                    Save &amp; Activate Hospital
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
};
