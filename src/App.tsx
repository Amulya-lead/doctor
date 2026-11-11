import React, { useState, useEffect, Suspense } from 'react';
import { HospitalOSProvider, useHospitalOS } from './context/HospitalOSContext';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { HomePage } from './components/home/HomePage';
import { LoginPage } from './components/auth/LoginPage';

const PatientManagement = React.lazy(() => import('./components/modules/PatientManagement').then(m => ({ default: m.PatientManagement })));
const DoctorManagement = React.lazy(() => import('./components/modules/DoctorManagement').then(m => ({ default: m.DoctorManagement })));
const LaboratoryLIMS = React.lazy(() => import('./components/modules/LaboratoryLIMS').then(m => ({ default: m.LaboratoryLIMS })));
const PharmacyManagement = React.lazy(() => import('./components/modules/PharmacyManagement').then(m => ({ default: m.PharmacyManagement })));
const HospitalOperations = React.lazy(() => import('./components/modules/HospitalOperations').then(m => ({ default: m.HospitalOperations })));
const BillingFinancials = React.lazy(() => import('./components/modules/BillingFinancials').then(m => ({ default: m.BillingFinancials })));
const AdminPayrollPortal = React.lazy(() => import('./components/modules/AdminPayrollPortal').then(m => ({ default: m.AdminPayrollPortal })));
const InsuranceClaims = React.lazy(() => import('./components/modules/InsuranceClaims').then(m => ({ default: m.InsuranceClaims })));
const ABDMHub = React.lazy(() => import('./components/modules/ABDMHub').then(m => ({ default: m.ABDMHub })));
const PatientPortal = React.lazy(() => import('./components/modules/PatientPortal').then(m => ({ default: m.PatientPortal })));

const ModuleLoader = () => (
  <div className="flex items-center justify-center min-h-[320px] text-slate-500 text-sm font-medium">
    Loading workspace module...
  </div>
);

type AppView = 'home' | 'login' | 'os';

const MainAppContent: React.FC = () => {
  const { activeModule, isAuthenticated, currentRole, logout } = useHospitalOS();

  const [loginTab, setLoginTab] = useState<'user' | 'admin'>('user');

  // Persist view across browser refresh
  const [currentView, setCurrentView] = useState<AppView>(() => {
    const saved = localStorage.getItem('hospital_os_current_view') as AppView | null;
    const isAuth = localStorage.getItem('hospital_auth') === 'true';

    if (saved === 'os' && isAuth) return 'os';
    if (saved === 'login') return 'login';
    if (saved === 'home') return 'home';
    return isAuth ? 'os' : 'home';
  });

  useEffect(() => {
    localStorage.setItem('hospital_os_current_view', currentView);
  }, [currentView]);

  // If user logs out, switch to home view
  useEffect(() => {
    if (!isAuthenticated && currentView === 'os') {
      setCurrentView('home');
    }
  }, [isAuthenticated, currentView]);

  // If user is logged in as a Patient / Normal User -> Render dedicated Patient Consultation Portal!
  if (isAuthenticated && currentRole === 'patient') {
    return (
      <Suspense fallback={<ModuleLoader />}>
        <PatientPortal 
          onNavigateHome={() => {
            logout();
            setCurrentView('home');
          }} 
        />
      </Suspense>
    );
  }

  // If user is on home page
  if (currentView === 'home') {
    return (
      <HomePage
        onNavigateUserLogin={() => {
          setLoginTab('user');
          setCurrentView('login');
        }}
        onNavigateAdminLogin={() => {
          setLoginTab('admin');
          setCurrentView('login');
        }}
        onLaunchOS={() => setCurrentView('os')}
      />
    );
  }

  // If user is on login page
  if (currentView === 'login') {
    return (
      <LoginPage
        initialTab={loginTab}
        onNavigateHome={() => setCurrentView('home')}
        onLoginSuccess={(role) => setCurrentView('os')}
      />
    );
  }

  // Render Admin HospitalOS Workspace (Gated behind admin login)
  const renderActiveModule = () => {
    switch (activeModule) {
      case 'admin_payroll': return <AdminPayrollPortal />;
      case 'patients': return <PatientManagement />;
      case 'doctors': return <DoctorManagement />;
      case 'lims': return <LaboratoryLIMS />;
      case 'pharmacy': return <PharmacyManagement />;
      case 'operations': return <HospitalOperations />;
      case 'billing': return <BillingFinancials />;
      case 'insurance': return <InsuranceClaims />;
      case 'abdm': return <ABDMHub />;
      default: return <DoctorManagement />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-sky-500/20 selection:text-sky-900">
      <Navbar
        onNavigateHome={() => setCurrentView('home')}
        onNavigateLogin={() => {
          setLoginTab('admin');
          setCurrentView('login');
        }}
      />

      <div className="flex-1 flex overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-50">
          <Suspense fallback={<ModuleLoader />}>
            {renderActiveModule()}
          </Suspense>
        </main>
      </div>
    </div>
  );
};

export function App() {
  return (
    <HospitalOSProvider>
      <MainAppContent />
    </HospitalOSProvider>
  );
}

export default App;
