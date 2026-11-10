import React from 'react';
import { 
  Activity, 
  Building2, 
  Lock, 
  ArrowRight, 
  User, 
  ShieldCheck, 
  Stethoscope, 
  HeartPulse, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  Star,
  Receipt,
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
  const { tenants, doctors, isAuthenticated, currentRole, currentUser } = useHospitalOS();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col justify-between">
      {/* 1. Header Bar */}
      <header className="sticky top-0 z-40 w-full bg-white border-b border-slate-200 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-sky-600 flex items-center justify-center text-white shadow-xs">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg tracking-tight text-slate-900">
                  Hospital<span className="text-sky-600">OS</span>
                </span>
                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-sky-50 text-sky-800 border border-sky-200 hidden sm:inline">
                  Healthcare Network
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden md:block">
                Multi-Hospital Doctor Consultation & Health Operations Platform
              </p>
            </div>
          </div>

          {/* Dual Action Login Buttons (Removed standalone book consultation as requested) */}
          <div className="flex items-center gap-2.5">
            {isAuthenticated ? (
              <button
                onClick={onLaunchOS}
                className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition active:scale-95"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>
                  {currentRole === 'patient' ? `My Patient Portal (${currentUser.name}) ↗` : 'Admin Workspace ↗'}
                </span>
              </button>
            ) : (
              <>
                {/* 1. User / Patient Login Button */}
                <button
                  onClick={onNavigateUserLogin}
                  className="px-4 py-2 rounded-lg bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition active:scale-95"
                  title="Patient & User Login"
                >
                  <User className="w-3.5 h-3.5" />
                  <span>User Login</span>
                </button>

                {/* 2. Admin Login Button */}
                <button
                  onClick={onNavigateAdminLogin}
                  className="px-3.5 py-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 font-semibold text-xs flex items-center gap-1.5 transition active:scale-95 shadow-xs"
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
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-100 text-sky-800 text-xs font-bold uppercase tracking-wider">
            <Building2 className="w-3.5 h-3.5" />
            <span>Multi-Hospital Consultation Network</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Consult Doctors Across <br />
            <span className="text-sky-600">Accredited Hospitals</span>
          </h1>

          <p className="text-base text-slate-600 font-normal max-w-2xl mx-auto">
            Choose your preferred hospital campus, select verified doctors according to your health requirements, and manage your complete consultation history in one unified portal.
          </p>
        </div>

        {/* Dual Portal Selection Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {/* Card 1: User / Patient Portal */}
          <div className="bg-white rounded-2xl border-2 border-sky-200/80 hover:border-sky-500 p-6 sm:p-8 shadow-sm hover:shadow-md transition flex flex-col justify-between space-y-6 group">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center border border-sky-100">
                  <User className="w-6 h-6" />
                </div>
                <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-sky-100 text-sky-800">
                  Patient & User Portal
                </span>
              </div>

              <div>
                <h3 className="text-xl font-bold text-slate-900 group-hover:text-sky-700 transition">
                  Patient Consultation Portal
                </h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Sign in to select accredited hospitals, choose doctors by medical specialty, book consultations, and view your consultation history, prescriptions, and digital passes.
                </p>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-100 text-xs text-slate-600">
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
          <div className="bg-white rounded-2xl border-2 border-slate-200 hover:border-slate-800 p-6 sm:p-8 shadow-sm hover:shadow-md transition flex flex-col justify-between space-y-6 group">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-800 flex items-center justify-center border border-slate-200">
                  <Lock className="w-6 h-6" />
                </div>
                <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-slate-100 text-slate-800">
                  Hospital Management
                </span>
              </div>

              <div>
                <h3 className="text-xl font-bold text-slate-900 group-hover:text-slate-950 transition">
                  Hospital Admin Desk
                </h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Dedicated sovereign administration desk for hospital staff. View all patient consultations booked in real-time, doctor OPD queues, beds occupancy, and financial ledger.
                </p>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-100 text-xs text-slate-600">
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

        {/* Accredited Hospital Network Display */}
        <div className="space-y-4 pt-6 border-t border-slate-200">
          <div className="text-center max-w-xl mx-auto space-y-1">
            <h2 className="text-xl font-bold text-slate-900">Accredited Hospitals in Network</h2>
            <p className="text-xs text-slate-500">
              Users can pick any hospital upon login to view attending doctors and book appointments.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {tenants.map(t => (
              <div 
                key={t.id}
                className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-xl">
                    {t.logo}
                  </div>
                  <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                    NABH Accredited
                  </span>
                </div>

                <div>
                  <h4 className="font-bold text-slate-900 text-sm">{t.name}</h4>
                  <p className="text-xs text-slate-500 mt-0.5">{t.tagline}</p>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-mono">
                  <span>Lic: {t.licenseNumber}</span>
                  <span className="text-sky-600 font-sans font-semibold">Verified Facility</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full bg-white border-t border-slate-200 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-sky-600 flex items-center justify-center text-white">
              <Activity className="w-3.5 h-3.5" />
            </div>
            <span className="font-bold text-slate-900">HospitalOS Multi-Hospital Consultation Network</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={onNavigateUserLogin}
              className="text-sky-600 hover:text-sky-700 font-semibold"
            >
              User Login
            </button>
            <span className="text-slate-300">&bull;</span>
            <button
              onClick={onNavigateAdminLogin}
              className="text-slate-600 hover:text-slate-900 font-semibold"
            >
              Admin Login (admin / admin123)
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};
