import React, { useState } from 'react';
import { 
  Activity, 
  Lock, 
  User, 
  ArrowRight, 
  ArrowLeft, 
  ShieldCheck, 
  AlertCircle,
  KeyRound,
  CheckCircle2,
  Phone,
  Mail,
  HeartPulse
} from 'lucide-react';
import { useHospitalOS } from '../../context/HospitalOSContext';
import { BrandLogo } from '../common/BrandLogo';

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
    <div className="relative min-h-screen flex flex-col justify-between p-4 sm:p-6 text-hospital-900 glide-enter overflow-hidden">
      {/* Full-Viewport Architectural Hospital Background */}
      <img
        src="/images/hospital-network-hero.jpg"
        alt="Modern interconnected hospital medical center"
        aria-hidden="true"
        className="fixed inset-0 w-full h-full object-cover object-center pointer-events-none select-none"
      />
      <div
        aria-hidden="true"
        className="fixed inset-0 bg-gradient-to-br from-[#10221F]/92 via-[#1D4840]/85 to-[#10221F]/90 backdrop-blur-[2px] pointer-events-none"
      />

      {/* Top Header */}
      <div className="relative z-10 max-w-4xl w-full mx-auto flex items-center justify-between pb-4">
        <BrandLogo variant="dark" size="md" subtitle="Clinical Network" />

        <button
          onClick={onNavigateHome}
          className="px-3.5 py-1.5 rounded-lg border border-white/25 bg-white/10 backdrop-blur-md hover:bg-white/20 text-xs font-semibold text-white flex items-center gap-1.5 transition-all duration-150 shadow-xs active:scale-[0.98]"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Home</span>
        </button>
      </div>

      {/* Main Login Card */}
      <div className="relative z-10 max-w-lg w-full mx-auto my-auto overflow-hidden bg-white rounded-2xl border border-hospital-300 shadow-2xl p-6 sm:p-8 space-y-6">
        
        {/* Dual Mode Sliding Switcher Tabs */}
        <div className="relative grid grid-cols-2 p-1 rounded-2xl bg-hospital-50/90 border border-hospital-300/80">
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
                ? 'text-[#39786B]'
                : 'text-hospital-800 hover:text-hospital-950'
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
                ? 'text-hospital-950'
                : 'text-hospital-800 hover:text-hospital-950'
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Hospital Admin Login</span>
          </button>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="p-3 rounded-xl bg-hospital-50 border border-hospital-200 text-hospital-800 text-xs flex items-start gap-2.5 animate-in fade-in">
            <AlertCircle className="w-4 h-4 text-hospital-600 flex-shrink-0 mt-0.5" />
            <p className="leading-relaxed">{errorMsg}</p>
          </div>
        )}

        {/* ================= USER / PATIENT LOGIN TAB ================= */}
        {activeTab === 'user' && (
          <div className="space-y-5 zoho-slide-prev">
            <div className="text-center space-y-1.5">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#1D4840] to-[#39786B] text-white flex items-center justify-center mx-auto shadow-sm shadow-hospital-950/25">
                <HeartPulse className="w-5 h-5" />
              </div>
              <h2 className="font-display text-xl font-bold text-hospital-950">Patient &amp; User Sign In</h2>
              <p className="text-xs text-hospital-800">
                Enter your details to choose accredited hospitals, book doctor consultations, and access your personal medical history.
              </p>
            </div>

            <form onSubmit={handleUserLoginSubmit} className="space-y-3.5">
              <div className="space-y-1">
                <label className="text-xs font-bold text-hospital-900 uppercase tracking-wider flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-hospital-700" />
                  <span>Full Patient Name *</span>
                </label>
                <input
                  type="text"
                  required
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder="Enter your name (e.g. John Doe, Priya Sharma)..."
                  className="w-full bg-hospital-50/90 border border-hospital-300 rounded-xl px-3.5 py-2.5 text-xs text-hospital-950 placeholder-hospital-500 focus:outline-none focus:border-[#39786B] focus:ring-4 focus:ring-[#39786B]/10 focus:bg-white transition"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-hospital-900 uppercase tracking-wider flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-hospital-700" />
                    <span>Phone Number</span>
                  </label>
                  <input
                    type="tel"
                    value={userPhone}
                    onChange={(e) => setUserPhone(e.target.value)}
                    placeholder="+91 98765 00000"
                    className="w-full bg-hospital-50/90 border border-hospital-300 rounded-xl px-3.5 py-2.5 text-xs text-hospital-950 placeholder-hospital-500 focus:outline-none focus:border-[#39786B] focus:ring-4 focus:ring-[#39786B]/10 focus:bg-white transition"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-hospital-900 uppercase tracking-wider flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-hospital-700" />
                    <span>Email Address</span>
                  </label>
                  <input
                    type="email"
                    value={userEmail}
                    onChange={(e) => setUserEmail(e.target.value)}
                    placeholder="patient@gmail.com"
                    className="w-full bg-hospital-50/90 border border-hospital-300 rounded-xl px-3.5 py-2.5 text-xs text-hospital-950 placeholder-hospital-500 focus:outline-none focus:border-[#39786B] focus:ring-4 focus:ring-[#39786B]/10 focus:bg-white transition"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 rounded-lg btn-zoho-primary text-white font-semibold text-xs uppercase tracking-wider flex items-center justify-center gap-2 disabled:opacity-50"
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
          <div className="space-y-5 zoho-slide-next">
            <div className="text-center space-y-1.5">
              <div className="w-11 h-11 rounded-xl bg-hospital-50 border border-hospital-200 text-[#1D4840] flex items-center justify-center mx-auto">
                <KeyRound className="w-5 h-5" />
              </div>
              <h2 className="font-display text-xl font-bold text-hospital-950">Hospital Admin Login</h2>
              <p className="text-xs text-hospital-700">
                Sovereign administrator access for hospital operational desks, doctor OPD queue, patient management, and cashier billing.
              </p>
            </div>

            {/* Demo Admin Pill */}
            <div className="p-3 rounded-lg bg-hospital-50 border border-hospital-300 text-hospital-900 text-xs flex items-center justify-between gap-2">
              <div className="space-y-0.5">
                <div className="flex items-center gap-1.5 font-bold text-[11px] uppercase tracking-wider text-hospital-800">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#39786B]" />
                  <span>Admin Access Credential</span>
                </div>
                <p className="font-mono text-xs text-hospital-950 font-semibold">
                  User: <span className="bg-white border border-hospital-300 px-1.5 py-0.5 rounded font-bold">admin</span> &bull; Pass: <span className="bg-white border border-hospital-300 px-1.5 py-0.5 rounded font-bold">admin123</span>
                </p>
              </div>
              <button
                type="button"
                onClick={handleFillAdmin}
                className="px-3 py-1.5 rounded-lg bg-[#1D4840] hover:bg-[#10221F] text-white font-semibold text-[11px] flex items-center gap-1 shadow-xs transition active:scale-[0.98] flex-shrink-0"
              >
                <span>Fill Credentials</span>
              </button>
            </div>

            <form onSubmit={handleAdminLoginSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-hospital-900 uppercase tracking-wider flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-hospital-700" />
                  <span>Admin Username</span>
                </label>
                <input
                  type="text"
                  required
                  value={adminUsername}
                  onChange={(e) => setAdminUsername(e.target.value)}
                  placeholder="admin"
                  className="w-full bg-hospital-50 border border-hospital-300 rounded-xl px-3.5 py-2.5 text-xs text-hospital-950 font-mono placeholder-hospital-500 focus:outline-none focus:border-[#39786B] focus:bg-white transition"
                />
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-hospital-900 uppercase tracking-wider flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-hospital-700" />
                    <span>Password</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-[11px] text-[#39786B] hover:text-[#1D4840] font-semibold"
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
                  className="w-full bg-hospital-50 border border-hospital-300 rounded-xl px-3.5 py-2.5 text-xs text-hospital-950 font-mono placeholder-hospital-500 focus:outline-none focus:border-[#39786B] focus:bg-white transition"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 rounded-lg bg-[#1D4840] hover:bg-[#10221F] text-white font-semibold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-xs transition-all duration-150 active:scale-[0.98] disabled:opacity-50"
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

        <div className="pt-2 border-t border-hospital-50 text-center">
          <p className="text-[11px] text-hospital-700">
            HospitalOS Multi-Hospital Consultation Network &bull; Secured with Role-Based Access Control
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="relative z-10 max-w-4xl w-full mx-auto text-center pt-4">
        <p className="text-[11px] text-hospital-100/80 font-medium">
          {currentTenant.name} &bull; License: {currentTenant.licenseNumber}
        </p>
      </div>
    </div>
  );
};
