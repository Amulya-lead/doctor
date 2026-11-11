import React, { useState, useMemo } from 'react';
import { 
  Activity, 
  Building2, 
  Lock, 
  User, 
  CheckCircle2, 
  Search,
  Sparkles
} from 'lucide-react';
import { useHospitalOS } from '../../context/HospitalOSContext';

interface HomePageProps {
  onNavigateUserLogin: () => void;
  onNavigateAdminLogin: () => void;
  onLaunchOS: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({ 
  onNavigateUserLogin, 
  onNavigateAdminLogin, 
  onLaunchOS 
}) => {
  const { tenants, isAuthenticated, currentRole, currentUser } = useHospitalOS();
  const [hospitalSearch, setHospitalSearch] = useState('');
  const [visibleHospitals, setVisibleHospitals] = useState(9);

  const filteredTenants = useMemo(() => {
    const q = hospitalSearch.trim().toLowerCase();
    if (!q) return tenants;
    return tenants.filter(t =>
      t.name.toLowerCase().includes(q) ||
      t.tagline.toLowerCase().includes(q) ||
      t.licenseNumber.toLowerCase().includes(q)
    );
  }, [tenants, hospitalSearch]);

  const displayedTenants = useMemo(
    () => filteredTenants.slice(0, visibleHospitals),
    [filteredTenants, visibleHospitals]
  );

  return (
    <div className="min-h-screen text-slate-800 flex flex-col justify-between glide-enter">
      {/* 1. Frosted Glass Header Bar */}
      <header className="sticky top-0 z-40 w-full lavish-glass border-b border-slate-200/80 shadow-[0_4px_24px_-8px_rgba(15,23,42,0.06)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Brand Logo */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-sky-500 to-cyan-600 flex items-center justify-center text-white shadow-sm shadow-sky-500/25">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg tracking-tight text-slate-900">
                  Hospital<span className="text-sky-600">OS</span>
                </span>
                <span className="text-[10px] uppercase font-bold px-2.5 py-0.5 rounded-full bg-sky-50 text-sky-800 border border-sky-200/80 hidden sm:inline">
                  Healthcare Network
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden md:block">
                Multi-Hospital Doctor Consultation &amp; Clinical Operations Platform
              </p>
            </div>
          </div>

          {/* Dual Action Login Buttons */}
          <div className="flex items-center gap-2.5">
            {isAuthenticated ? (
              <button
                onClick={onLaunchOS}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-600 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm shadow-emerald-600/20 transition-all duration-200 active:scale-95"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>
                  {currentRole === 'patient' ? `My Patient Portal (${currentUser.name}) ↗` : 'Admin Workspace ↗'}
                </span>
              </button>
            ) : (
              <>
                <button
                  onClick={onNavigateUserLogin}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-sky-600 to-cyan-600 hover:from-sky-500 hover:to-cyan-600 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm shadow-sky-600/20 transition-all duration-200 active:scale-95"
                  title="Patient & User Login"
                >
                  <User className="w-3.5 h-3.5" />
                  <span>User Login</span>
                </button>

                <button
                  onClick={onNavigateAdminLogin}
                  className="px-3.5 py-2 rounded-xl border border-slate-200/90 bg-white/90 hover:bg-slate-50 hover:border-slate-300 text-slate-700 hover:text-slate-900 font-semibold text-xs flex items-center gap-1.5 transition-all duration-200 active:scale-95 shadow-xs"
                  title="Hospital Administrator Login"
                >
                  <Lock className="w-3.5 h-3.5 text-slate-500" />
                  <span>Admin Login</span>
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-12">
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto space-y-5">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/90 border border-sky-200/80 shadow-xs text-sky-800 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-sky-600" />
            <span>Multi-Hospital Consultation Network</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-[1.12]">
            Consult Doctors Across <br />
            <span className="bg-gradient-to-r from-sky-600 via-cyan-600 to-teal-600 bg-clip-text text-transparent">
              Accredited Hospitals
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-600 font-normal max-w-2xl mx-auto leading-relaxed">
            Choose your preferred hospital campus, select verified doctors according to your health requirements, and manage your complete consultation history in one unified portal.
          </p>
        </div>

        {/* Dual Portal Selection Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {/* Card 1: User / Patient Portal */}
          <div className="relative overflow-hidden lavish-card lavish-card-hover p-6 sm:p-8 flex flex-col justify-between space-y-6 group">
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-sky-500 via-cyan-500 to-teal-400" />

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-sky-50 to-cyan-50 text-sky-600 flex items-center justify-center border border-sky-200/70 shadow-xs group-hover:scale-105 transition-transform duration-300">
                  <User className="w-6 h-6" />
                </div>
                <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-sky-50 text-sky-800 border border-sky-200/80">
                  Patient &amp; User Portal
                </span>
              </div>

              <div>
                <h3 className="text-xl font-bold text-slate-900 group-hover:text-sky-700 transition-colors">
                  Patient Consultation Portal
                </h3>
                <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                  Sign in to select accredited hospitals, choose doctors by medical specialty, book consultations, and view your consultation history, prescriptions, and digital passes.
                </p>
              </div>

              <div className="space-y-2 pt-3 border-t border-slate-100 text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                  <span>Select from {tenants.length} Accredited Hospitals</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                  <span>Choose Doctors by Clinical Specialty (Cardiology, Ortho, etc.)</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                  <span>Full Consultation History &amp; Profile Settings</span>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Hospital Admin Desk */}
          <div className="relative overflow-hidden lavish-card lavish-card-hover p-6 sm:p-8 flex flex-col justify-between space-y-6 group">
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-slate-800 via-slate-700 to-sky-600" />

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-800 flex items-center justify-center border border-slate-200/80 shadow-xs group-hover:scale-105 transition-transform duration-300">
                  <Lock className="w-6 h-6" />
                </div>
                <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-slate-100 text-slate-800 border border-slate-200/80">
                  Hospital Management
                </span>
              </div>

              <div>
                <h3 className="text-xl font-bold text-slate-900 group-hover:text-slate-950 transition-colors">
                  Hospital Admin Desk
                </h3>
                <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                  Dedicated sovereign administration desk for hospital staff. View all patient consultations booked in real-time, doctor OPD queues, beds occupancy, and financial ledger.
                </p>
              </div>

              <div className="space-y-2 pt-3 border-t border-slate-100 text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                  <span>Real-time Patient Roster &amp; Assigned Clinicians</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                  <span>Instant Fetching of All User-Booked Consultations</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                  <span>Gated behind dedicated admin credential (admin / admin123)</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scalable Accredited Hospital Network Display */}
        <div className="space-y-6 pt-8 border-t border-slate-200/80">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="space-y-1">
              <h2 className="text-xl font-bold text-slate-900">Accredited Hospitals in Network</h2>
              <p className="text-xs text-slate-500">
                Showing {displayedTenants.length} of {filteredTenants.length} verified healthcare facilities.
              </p>
            </div>

            {tenants.length > 3 && (
              <div className="relative w-full sm:w-72">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={hospitalSearch}
                  onChange={(e) => {
                    setHospitalSearch(e.target.value);
                    setVisibleHospitals(9);
                  }}
                  placeholder="Search hospital, city, license..."
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10 transition"
                />
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {displayedTenants.map(t => (
              <div 
                key={t.id}
                className="lavish-card lavish-card-hover scalable-card p-5 space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200/80 flex items-center justify-center text-xl">
                    {t.logo}
                  </div>
                  <span className="text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/80">
                    NABH Accredited
                  </span>
                </div>

                <div>
                  <h4 className="font-bold text-slate-900 text-sm">{t.name}</h4>
                  <p className="text-xs text-slate-500 mt-0.5">{t.tagline}</p>
                </div>

                <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-mono">
                  <span>Lic: {t.licenseNumber}</span>
                  <span className="text-sky-600 font-sans font-semibold">Verified Facility</span>
                </div>
              </div>
            ))}
          </div>

          {filteredTenants.length > displayedTenants.length && (
            <div className="flex justify-center pt-2">
              <button
                onClick={() => setVisibleHospitals(v => v + 12)}
                className="px-5 py-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700 shadow-xs transition-all duration-200 active:scale-95"
              >
                Show More Hospitals ({filteredTenants.length - displayedTenants.length} remaining)
              </button>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full bg-white/80 backdrop-blur-md border-t border-slate-200/80 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-sky-500 to-cyan-600 flex items-center justify-center text-white">
              <Activity className="w-3.5 h-3.5" />
            </div>
            <span className="font-bold text-slate-900">HospitalOS Multi-Hospital Consultation Network</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={onNavigateUserLogin}
              className="text-sky-600 hover:text-sky-700 font-semibold transition-colors"
            >
              User Login
            </button>
            <span className="text-slate-300">&bull;</span>
            <button
              onClick={onNavigateAdminLogin}
              className="text-slate-600 hover:text-slate-900 font-semibold transition-colors"
            >
              Admin Login (admin / admin123)
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};
