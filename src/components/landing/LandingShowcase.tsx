import React from 'react';
import { 
  Activity, 
  Layers, 
  ShieldCheck, 
  Radio, 
  CheckCircle2, 
  Sparkles, 
  Users, 
  Stethoscope, 
  FlaskConical, 
  Pill, 
  BedDouble, 
  CreditCard, 
  Clock, 
  FileCheck, 
  ArrowRight,
  Flame,
  Zap,
  Building,
  HeartPulse,
  Monitor
} from 'lucide-react';
import { useHospitalOS } from '../../context/HospitalOSContext';
import { BrandLogo } from '../common/BrandLogo';

interface LandingShowcaseProps {
  onLaunchOS: () => void;
}

export const LandingShowcase: React.FC<LandingShowcaseProps> = ({ onLaunchOS }) => {
  const { setActiveModule } = useHospitalOS();

  const handleLaunchModule = (mod: any) => {
    setActiveModule(mod);
    onLaunchOS();
  };

  return (
    <div className="space-y-24 py-8 animate-in fade-in duration-500 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* 1. HERO SECTION */}
      <section className="relative text-center space-y-6 pt-10">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-hospital-500/20 via-hospital-500/15 to-hospital-500/20 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="flex justify-center">
          <BrandLogo variant="dark" size="lg" subtitle="Multi-Hospital Clinical OS" />
        </div>

        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-hospital-500/10 border border-hospital-500/30 text-hospital-300 text-xs font-mono font-bold uppercase tracking-widest shadow-lg shadow-hospital-500/10">
          <Sparkles className="w-4 h-4 text-hospital-400 animate-spin" />
          <span>The Next-Gen Healthcare Operating Platform</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-white tracking-tight leading-[1.1] max-w-5xl mx-auto">
          One Operating System for <br />
          <span className="bg-gradient-to-r from-hospital-300 via-hospital-400 to-hospital-500 bg-clip-text text-transparent">
            Your Entire Healthcare Organization
          </span>
        </h1>

        {/* Hero Subtitle */}
        <p className="text-base sm:text-xl text-hospital-300 max-w-3xl mx-auto leading-relaxed">
          Not just management software. A sovereign platform where clinics, 100-bed hospitals, multi-branch groups, and diagnostic labs operate from one centralized interface with <span className="text-white font-semibold">strict tenant isolation</span> and <span className="text-hospital-500 font-semibold">zero redundant data entry</span>.
        </p>

        {/* Hero CTA Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
          <button
            onClick={onLaunchOS}
            className="px-8 py-4 rounded-2xl bg-gradient-to-r from-hospital-500 via-hospital-500 to-hospital-500 text-hospital-950 font-extrabold text-sm sm:text-base flex items-center gap-3 shadow-xl shadow-hospital-500/30 hover:scale-105 hover:brightness-110 transition duration-200"
          >
            <Monitor className="w-5 h-5 text-hospital-950" />
            <span>Launch Interactive Hospital OS Cockpit</span>
            <ArrowRight className="w-5 h-5" />
          </button>

          <button
            onClick={() => {
              setActiveModule('admin_payroll');
              onLaunchOS();
            }}
            className="px-7 py-4 rounded-2xl bg-hospital-950/90 hover:bg-hospital-900 text-hospital-300 font-bold text-sm sm:text-base border border-hospital-900/80 flex items-center gap-2.5 transition duration-200"
          >
            <Radio className="w-4 h-4 text-hospital-400" />
            <span>Open Staff Desk</span>
          </button>
        </div>

        {/* Quick Highlights Row */}
        <div className="pt-10 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl mx-auto text-left font-mono">
          <div className="p-3.5 rounded-xl bg-hospital-950/60 border border-hospital-900">
            <span className="text-[10px] text-hospital-300 uppercase tracking-widest">Architecture</span>
            <p className="text-base font-extrabold text-white mt-0.5">Multi-Tenant Cloud</p>
            <span className="text-[11px] text-hospital-500">Isolated Databases</span>
          </div>

          <div className="p-3.5 rounded-xl bg-hospital-950/60 border border-hospital-900">
            <span className="text-[10px] text-hospital-300 uppercase tracking-widest">Connected Sync</span>
            <p className="text-base font-extrabold text-white mt-0.5">Event-Driven</p>
            <span className="text-[11px] text-hospital-400">0.4ms WebSocket Bus</span>
          </div>

          <div className="p-3.5 rounded-xl bg-hospital-950/60 border border-hospital-900">
            <span className="text-[10px] text-hospital-300 uppercase tracking-widest">Clinical Standards</span>
            <p className="text-base font-extrabold text-white mt-0.5">HL7 &amp; FHIR R4</p>
            <span className="text-[11px] text-hospital-500">Encrypted EMR Vault</span>
          </div>

          <div className="p-3.5 rounded-xl bg-hospital-950/60 border border-hospital-900">
            <span className="text-[10px] text-hospital-300 uppercase tracking-widest">Compliance</span>
            <p className="text-base font-extrabold text-white mt-0.5">DPDP Act 2023</p>
            <span className="text-[11px] text-hospital-300">NABH & HIPAA Ready</span>
          </div>
        </div>
      </section>

      {/* 2. THE MULTI-HOSPITAL ARCHITECTURE SHOWCASE */}
      <section className="space-y-8">
        <div className="text-center space-y-2">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-hospital-400">
            Modular Multi-Tenant Architecture
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            One Platform. Multiple Hospitals. Separate Data.
          </h2>
          <p className="text-sm text-hospital-300 max-w-2xl mx-auto">
            Each organization operates in its own isolated sovereign workspace while leveraging shared high-performance clinical workflows.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 rounded-2xl bg-gradient-to-b from-hospital-950 to-hospital-950 border border-hospital-900 space-y-3 hover:border-hospital-500/50 transition">
            <span className="text-3xl">🏥</span>
            <h3 className="font-bold text-white text-base">Large Tertiary Hospital</h3>
            <p className="text-xs text-hospital-300">
              Complete inpatient bed management, ICU multi-monitor telemetry, robotic OT scheduling, and high-volume billing.
            </p>
            <div className="pt-2 border-t border-hospital-900 text-[11px] font-mono text-hospital-300">
              Example: Apex Super-Specialty (220 Beds)
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-gradient-to-b from-hospital-950 to-hospital-950 border border-hospital-900 space-y-3 hover:border-hospital-500/50 transition">
            <span className="text-3xl">🩺</span>
            <h3 className="font-bold text-white text-base">Independent Clinic</h3>
            <p className="text-xs text-hospital-300">
              Lightweight OPD appointments, fast e-prescriptions, instant WhatsApp notifications, and UPI billing for single physicians.
            </p>
            <div className="pt-2 border-t border-hospital-900 text-[11px] font-mono text-hospital-500">
              Example: Sanjeevani Family Clinic
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-gradient-to-b from-hospital-950 to-hospital-950 border border-hospital-900 space-y-3 hover:border-hospital-500/50 transition">
            <span className="text-3xl">🔬</span>
            <h3 className="font-bold text-white text-base">Diagnostic Pathology Lab</h3>
            <p className="text-xs text-hospital-300">
              LIMS sample barcode tracking, analyzer HL7 interfacing, pathologist e-signatures, and patient report delivery.
            </p>
            <div className="pt-2 border-t border-hospital-900 text-[11px] font-mono text-hospital-500">
              Example: PulseCare Reference Lab
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-gradient-to-b from-hospital-950 to-hospital-950 border border-hospital-900 space-y-3 hover:border-hospital-500/50 transition">
            <span className="text-3xl">🌐</span>
            <h3 className="font-bold text-white text-base">Multi-Branch Hospital Network</h3>
            <p className="text-xs text-hospital-300">
              Centralized group oversight, cross-branch physician scheduling, unified financial consolidated reporting.
            </p>
            <div className="pt-2 border-t border-hospital-900 text-[11px] font-mono text-hospital-300">
              Example: MedStar Group (3 Branches)
            </div>
          </div>
        </div>
      </section>

      {/* 3. THE 12 A–Z MAJOR MODULES SHOWCASE */}
      <section className="space-y-8">
        <div className="text-center space-y-2">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-hospital-500">
            A–Z Complete Ecosystem
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            12 Deeply Integrated Major Systems
          </h2>
          <p className="text-sm text-hospital-300 max-w-2xl mx-auto">
            Everything your hospital needs from the moment a patient walks in until after discharge.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[
            {
              id: 'patients',
              icon: Users,
              title: 'A. Patient Management & EMR',
              desc: 'ABHA integration, digital registration, vitals telemetry, longitudinal medical history, and electronic health records.',
              color: 'text-hospital-400'
            },
            {
              id: 'doctors',
              icon: Stethoscope,
              title: 'B. Doctor & OPD Desk',
              desc: 'Chamber availability, consultation queue, ICD-10 diagnostic coding, and federated digital prescriptions.',
              color: 'text-hospital-500'
            },
            {
              id: 'lims',
              icon: FlaskConical,
              title: 'C. Laboratory LIMS',
              desc: 'Sample barcode generation, automated analyzer interfacing, technician assignments, and pathologist digital sign-off.',
              color: 'text-hospital-500'
            },
            {
              id: 'billing',
              icon: CreditCard,
              title: 'D. Billing & Finance',
              desc: 'Automated cross-department bill consolidation, UPI QR code reconciliation, GST compliance, and daily cash flow.',
              color: 'text-hospital-500'
            },
            {
              id: 'pharmacy',
              icon: Pill,
              title: 'E. Pharmacy & Inventory',
              desc: 'Batch and expiry tracking, prescription-based barcode dispensing, cold-chain temperature logs, and reorder alerts.',
              color: 'text-hospital-400'
            },
            {
              id: 'hr',
              icon: Users,
              title: 'F. HR & Staff Payroll',
              desc: 'Biometric shift allocation, attendance verification, salary calculation, clinical incentives, and automated payslips.',
              color: 'text-hospital-400'
            },
            {
              id: 'operations',
              icon: BedDouble,
              title: 'G. Hospital Operations',
              desc: 'ICU and ward matrix, central oxygen supply telemetry, robotic OT scheduling, and rapid ambulance dispatch.',
              color: 'text-hospital-400'
            },
            {
              id: 'simulator',
              icon: Radio,
              title: 'H. Real-Time Sync & Events',
              desc: 'Durable event bus with automated retries. When a test is approved, the bill, doctor EMR, and patient app sync in 0.4ms.',
              color: 'text-hospital-400'
            },
            {
              id: 'insurance',
              icon: ShieldCheck,
              title: 'I. Insurance & Claims',
              desc: 'Government & private TPA cashless desk, 30-minute pre-authorizations, electronic claim settlement status.',
              color: 'text-hospital-500'
            },
            {
              id: 'overview',
              icon: Activity,
              title: 'J. Analytics & Management',
              desc: 'Live executive cockpit, bed occupancy metrics, department profitability, doctor turnaround times, and audit trails.',
              color: 'text-hospital-500'
            },
            {
              id: 'patient_portal',
              icon: HeartPulse,
              title: 'K. Patient Health Locker',
              desc: 'Digital patient health card, instant PDF prescription downloads, verified lab results, and online bill payments.',
              color: 'text-hospital-400'
            }
          ].map(module => {
            const Icon = module.icon;
            return (
              <div
                key={module.id}
                onClick={() => handleLaunchModule(module.id)}
                className="p-5 rounded-2xl bg-gradient-to-br from-hospital-950 to-hospital-950 border border-hospital-900 hover:border-hospital-500/50 cursor-pointer transition-all duration-200 group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <Icon className={`w-5 h-5 ${module.color} group-hover:scale-110 transition`} />
                    <span className="text-[10px] text-hospital-700 font-mono group-hover:text-hospital-300">
                      Explore &rarr;
                    </span>
                  </div>
                  <h3 className="font-bold text-white text-sm mt-3">{module.title}</h3>
                  <p className="text-xs text-hospital-300 mt-1.5 leading-relaxed">{module.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. MULTI-HOSPITAL SCALE ARCHITECTURE */}
      <section className="space-y-8">
        <div className="text-center space-y-2">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-hospital-500">
            Multi-Hospital Clinical Architecture
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Built for Clinics to Multi-City Hospital Groups
          </h2>
          <p className="text-sm text-hospital-300 max-w-2xl mx-auto">
            Unified hospital operations adapted for primary care centers, specialty institutes, and multi-hospital groups.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="p-6 rounded-2xl bg-hospital-950/60 border border-hospital-900 space-y-4">
            <h3 className="font-bold text-white text-base">Specialty Clinics</h3>
            <p className="text-xs text-hospital-300">Tailored for independent outpatient centers &amp; general practitioners.</p>
            <ul className="text-xs text-hospital-300 space-y-2 font-mono">
              <li>✓ Physician Consultation Queue</li>
              <li>✓ OPD &amp; Digital Rx</li>
              <li>✓ Appointment Reminders</li>
              <li>✓ ABHA Verification</li>
            </ul>
          </div>

          <div className="p-6 rounded-2xl bg-hospital-950/60 border border-hospital-900 space-y-4">
            <h3 className="font-bold text-white text-base">Diagnostic Centers</h3>
            <p className="text-xs text-hospital-300">For integrated polyclinics &amp; NABL testing facilities.</p>
            <ul className="text-xs text-hospital-300 space-y-2 font-mono">
              <li>✓ Barcoded Sample Pipeline</li>
              <li>✓ In-house Pharmacy</li>
              <li>✓ Pathology LIMS Desk</li>
              <li>✓ Cashless UPI Billing</li>
            </ul>
          </div>

          <div className="p-6 rounded-2xl bg-gradient-to-b from-hospital-950/40 via-hospital-950 to-hospital-950 border border-hospital-500/50 space-y-4 shadow-xl shadow-hospital-500/10">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-white text-base">Multi-Specialty</h3>
              <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-hospital-500 text-hospital-950 uppercase">Core Hub</span>
            </div>
            <p className="text-xs text-hospital-300">For multi-department hospitals requiring end-to-end coordination.</p>
            <ul className="text-xs text-hospital-300 space-y-2 font-mono">
              <li>✓ Full Ward &amp; ICU Matrix</li>
              <li>✓ Operation Theatre Suite</li>
              <li>✓ TPA Cashless Insurance Desk</li>
              <li>✓ Staff Roster &amp; Payroll</li>
            </ul>
          </div>

          <div className="p-6 rounded-2xl bg-hospital-950/60 border border-hospital-900 space-y-4">
            <h3 className="font-bold text-white text-base">Hospital Groups</h3>
            <p className="text-xs text-hospital-300">For accredited multi-branch medical networks &amp; chains.</p>
            <ul className="text-xs text-hospital-300 space-y-2 font-mono">
              <li>✓ Instant Hospital Switcher</li>
              <li>✓ Isolated Record Vaults</li>
              <li>✓ HL7 / FHIR Analyzer Sync</li>
              <li>✓ 99.99% Clinical Uptime</li>
            </ul>
          </div>
        </div>
      </section>

      {/* 5. FINAL LAUNCH CTA BANNER */}
      <section className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-hospital-950 via-hospital-950 to-hospital-900 border border-hospital-500/30 text-center space-y-6 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-hospital-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-hospital-500/10 rounded-full blur-3xl pointer-events-none" />

        <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          Ready to Experience Hospital OS™ in Action?
        </h2>
        <p className="text-sm sm:text-base text-hospital-300 max-w-2xl mx-auto">
          Switch between 4 organizations, 9 staff roles, and interact with the live connected patient journey simulator.
        </p>

        <div className="pt-2">
          <button
            onClick={onLaunchOS}
            className="px-8 py-4 rounded-2xl bg-gradient-to-r from-hospital-500 to-hospital-500 text-hospital-950 font-extrabold text-sm sm:text-base inline-flex items-center gap-3 shadow-xl hover:scale-105 transition"
          >
            <Activity className="w-5 h-5 text-hospital-950" />
            <span>Enter Sovereign Hospital Operating System</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </section>
    </div>
  );
};

