import React, { useState } from 'react';
import { 
  Activity, 
  Lock, 
  User, 
  ArrowRight, 
  ArrowLeft, 
  ShieldCheck, 
  AlertCircle,
  Sparkles,
  KeyRound,
  CheckCircle2,
  Phone,
  Mail,
  HeartPulse,
  Building2
} from 'lucide-react';
import { useHospitalOS } from '../../context/HospitalOSContext';

interface LoginPageProps {
  onNavigateHome: () => void;
  onLoginSuccess: (role: 'patient' | 'admin') => void;
  initialTab?: 'user' | 'admin';
}

export const LoginPage: React.FC<LoginPageProps> = ({ 
  onNavigateHome, 
  onLoginSuccess,
  initialTab = 'user'
}) => {
  const { loginAsRole, loginAsPatient, currentTenant } = useHospitalOS();

  const [activeTab, setActiveTab] = useState<'user' | 'admin'>(initialTab);

  // User / Patient Login State (User can be anyone)
  const [userName, setUserName] = useState('');
  const [userPhone, setUserPhone] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userBloodGroup, setUserBloodGroup] = useState('B+ Positive');

  // Admin Login State
  const [adminUsername, setAdminUsername] = useState('admin');
  const [adminPassword, setAdminPassword] = useState('admin123');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleFillAdmin = () => {
    setAdminUsername('admin');
    setAdminPassword('admin123');
    setErrorMsg(null);
  };

  const handleUserLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userName.trim()) {
      setErrorMsg('Please enter your full name to proceed.');
      return;
    }
    setIsSubmitting(true);
    setTimeout(() => {
      loginAsPatient({
        name: userName.trim(),
        phone: userPhone.trim(),
        email: userEmail.trim(),
        bloodGroup: userBloodGroup
      });
      setIsSubmitting(false);
      onLoginSuccess('patient');
    }, 300);
  };

  const handleAdminLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsSubmitting(true);

    setTimeout(() => {
      const cleanUser = adminUsername.trim().toLowerCase();
      const cleanPass = adminPassword.trim();

      const isValidAdmin = 
        (cleanUser === 'admin' || cleanUser === 'admin@citycare.in' || cleanUser === 'admin@hospital.in') &&
        (cleanPass === 'admin123' || cleanPass === 'HospitalPass@2026');

      if (isValidAdmin) {
        loginAsRole('admin');
        setIsSubmitting(false);
        onLoginSuccess('admin');
      } else {
        setIsSubmitting(false);
        setErrorMsg(
          'Access Denied: Only authorized Hospital Administrator credentials (username: admin / password: admin123) have access to internal hospital desks.'
        );
      }
    }, 350);
  };

  return (
    <div className="relative min-h-screen flex flex-col justify-between p-4 sm:p-6 text-slate-800 glide-enter overflow-hidden">
      {/* Full-Viewport Architectural Hospital Background */}
      <img
        src="/images/hospital-hero.jpg"
        alt="Modern luxury medical center atrium"
        aria-hidden="true"
        className="fixed inset-0 w-full h-full object-cover object-center pointer-events-none select-none"
      />
      <div
        aria-hidden="true"
        className="fixed inset-0 bg-gradient-to-br from-slate-950/82 via-sky-950/72 to-teal-950/80 backdrop-blur-[2px] pointer-events-none"
      />

      {/* Top Header */}
      <div className="relative z-10 max-w-4xl w-full mx-auto flex items-center justify-between pb-4">
        <button
          onClick={onNavigateHome}
          className="flex items-center gap-2.5 group text-white focus:outline-none"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-sky-400 via-cyan-500 to-teal-500 flex items-center justify-center text-white shadow-lg shadow-sky-500/30 group-hover:scale-105 transition-transform duration-200">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <span className="font-extrabold text-lg text-white tracking-tight">
              Hospital<span className="text-cyan-300">OS</span>
            </span>
            <span className="hidden sm:inline text-xs text-cyan-100/75 ml-2 font-medium">Healthcare Portal</span>
          </div>
        </button>

        <button
          onClick={onNavigateHome}
          className="px-3.5 py-1.5 rounded-xl border border-white/25 bg-white/15 backdrop-blur-md hover:bg-white/25 text-xs font-semibold text-white flex items-center gap-1.5 transition-all duration-200 shadow-xs active:scale-95"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Home</span>
        </button>
      </div>

      {/* Main Login Card */}
      <div className="relative z-10 max-w-lg w-full mx-auto my-auto overflow-hidden bg-white/95 backdrop-blur-2xl rounded-3xl border border-white/75 shadow-[0_32px_80px_-16px_rgba(2,132,199,0.4)] p-6 sm:p-8 space-y-6">
        <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-sky-500 via-teal-400 to-indigo-500" />
        
        {/* Dual Mode Sliding Switcher Tabs */}
        <div className="relative grid grid-cols-2 p-1 rounded-2xl bg-slate-100/90 border border-slate-200/80">
          <div
            aria-hidden="true"
            className={`absolute top-1 bottom-1 left-1 w-[calc(50%-0.25rem)] rounded-xl bg-white shadow-sm transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
              activeTab === 'admin' ? 'translate-x-full' : 'translate-x-0'
            }`}
          />
          <button
            type="button"
            onClick={() => { setActiveTab('user'); setErrorMsg(null); }}
            className={`relative z-10 py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-colors ${
              activeTab === 'user'
                ? 'text-sky-700'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>User / Patient Login</span>
          </button>

          <button
            type="button"
            onClick={() => { setActiveTab('admin'); setErrorMsg(null); }}
            className={`relative z-10 py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-colors ${
              activeTab === 'admin'
                ? 'text-slate-900'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Hospital Admin Login</span>
          </button>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2.5 animate-in fade-in">
            <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
            <p className="leading-relaxed">{errorMsg}</p>
          </div>
        )}

        {/* ================= USER / PATIENT LOGIN TAB ================= */}
        {activeTab === 'user' && (
          <div className="space-y-5 animate-in fade-in duration-150">
            <div className="text-center space-y-1.5">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-sky-500 to-teal-500 text-white flex items-center justify-center mx-auto shadow-lg shadow-sky-500/25">
                <HeartPulse className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-bold text-slate-900">Patient &amp; User Sign In</h2>
              <p className="text-xs text-slate-500">
                Enter your details to choose accredited hospitals, book doctor consultations, and access your personal medical history.
              </p>
            </div>

            <form onSubmit={handleUserLoginSubmit} className="space-y-3.5">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  <span>Full Patient Name *</span>
                </label>
                <input
                  type="text"
                  required
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder="Enter your name (e.g. John Doe, Priya Sharma)..."
                  className="w-full bg-slate-50/90 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10 focus:bg-white transition"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <span>Phone Number</span>
                  </label>
                  <input
                    type="tel"
                    value={userPhone}
                    onChange={(e) => setUserPhone(e.target.value)}
                    placeholder="+91 98765 00000"
                    className="w-full bg-slate-50/90 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10 focus:bg-white transition"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    <span>Email Address</span>
                  </label>
                  <input
                    type="email"
                    value={userEmail}
                    onChange={(e) => setUserEmail(e.target.value)}
                    placeholder="patient@gmail.com"
                    className="w-full bg-slate-50/90 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10 focus:bg-white transition"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-sky-600 to-cyan-600 hover:from-sky-500 hover:to-cyan-600 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md shadow-sky-600/20 transition-all duration-200 active:scale-[0.98] disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>Entering Patient Portal...</span>
                ) : (
                  <>
                    <span>Enter Patient Consultation Portal</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </div>
        )}

        {/* ================= ADMIN LOGIN TAB ================= */}
        {activeTab === 'admin' && (
          <div className="space-y-5 animate-in fade-in duration-150">
            <div className="text-center space-y-1.5">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 text-white flex items-center justify-center mx-auto shadow-lg shadow-amber-500/25">
                <KeyRound className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-bold text-slate-900">Hospital Admin Login</h2>
              <p className="text-xs text-slate-500">
                Sovereign administrator access for hospital operational desks, doctor OPD queue, patient management, and cashier billing.
              </p>
            </div>

            {/* Demo Admin Pill */}
            <div className="p-3 rounded-xl bg-amber-50/80 border border-amber-200 text-amber-950 text-xs flex items-center justify-between gap-2">
              <div className="space-y-0.5">
                <div className="flex items-center gap-1.5 font-bold text-[11px] uppercase tracking-wider text-amber-800">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Admin Access Credential</span>
                </div>
                <p className="font-mono text-xs text-amber-950 font-semibold">
                  User: <span className="bg-amber-100 px-1 py-0.5 rounded font-bold">admin</span> &bull; Pass: <span className="bg-amber-100 px-1 py-0.5 rounded font-bold">admin123</span>
                </p>
              </div>
              <button
                type="button"
                onClick={handleFillAdmin}
                className="px-2.5 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold text-[11px] flex items-center gap-1 shadow-xs transition active:scale-95 flex-shrink-0"
              >
                <Sparkles className="w-3 h-3" />
                <span>Fill</span>
              </button>
            </div>

            <form onSubmit={handleAdminLoginSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-slate-500" />
                  <span>Admin Username</span>
                </label>
                <input
                  type="text"
                  required
                  value={adminUsername}
                  onChange={(e) => setAdminUsername(e.target.value)}
                  placeholder="admin"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-mono placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:bg-white transition"
                />
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-slate-500" />
                    <span>Password</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-[11px] text-sky-600 hover:text-sky-700 font-semibold"
                  >
                    {showPassword ? 'Hide' : 'Show'}
                  </button>
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-mono placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:bg-white transition"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-slate-900 to-slate-800 hover:from-black hover:to-slate-900 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md shadow-slate-900/15 transition-all duration-200 active:scale-[0.98] disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>Authenticating Admin...</span>
                ) : (
                  <>
                    <span>Enter HospitalOS Admin Desks</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </div>
        )}

        <div className="pt-2 border-t border-slate-100 text-center">
          <p className="text-[11px] text-slate-400">
            HospitalOS Multi-Hospital Consultation Network &bull; Secured with Role-Based Access Control
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="relative z-10 max-w-4xl w-full mx-auto text-center pt-4">
        <p className="text-[11px] text-cyan-100/80 font-medium">
          {currentTenant.name} &bull; License: {currentTenant.licenseNumber}
        </p>
      </div>
    </div>
  );
};
