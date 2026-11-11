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
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-brand-500/20 via-vital-emerald/15 to-vital-violet/20 rounded-full blur-3xl pointer-events-none -z-10" />

        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/30 text-brand-300 text-xs font-mono font-bold uppercase tracking-widest shadow-lg shadow-brand-500/10">
          <Sparkles className="w-4 h-4 text-brand-400 animate-spin" />
          <span>The Next-Gen Healthcare Operating Platform</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-white tracking-tight leading-[1.1] max-w-5xl mx-auto">
          One Operating System for <br />
          <span className="bg-gradient-to-r from-brand-300 via-brand-400 to-vital-emerald bg-clip-text text-transparent">
            Your Entire Healthcare Organization
          </span>
        </h1>

        {/* Hero Subtitle */}
        <p className="text-base sm:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
          Not just management software. A sovereign platform where clinics, 100-bed hospitals, multi-branch groups, and diagnostic labs operate from one centralized interface with <span className="text-white font-semibold">strict tenant isolation</span> and <span className="text-vital-emerald font-semibold">zero redundant data entry</span>.
        </p>

        {/* Hero CTA Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
          <button
            onClick={onLaunchOS}
            className="px-8 py-4 rounded-2xl bg-gradient-to-r from-brand-500 via-vital-teal to-vital-emerald text-obsidian-950 font-extrabold text-sm sm:text-base flex items-center gap-3 shadow-xl shadow-brand-500/30 hover:scale-105 hover:brightness-110 transition duration-200"
          >
            <Monitor className="w-5 h-5 text-obsidian-950" />
            <span>Launch Interactive Hospital OS Cockpit</span>
            <ArrowRight className="w-5 h-5" />
          </button>

          <button
            onClick={() => {
              setActiveModule('admin_payroll');
              onLaunchOS();
            }}
            className="px-7 py-4 rounded-2xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 font-bold text-sm sm:text-base border border-slate-700/80 flex items-center gap-2.5 transition duration-200"
          >
            <Radio className="w-4 h-4 text-brand-400" />
            <span>Open Staff Desk</span>
          </button>
        </div>

        {/* Quick Highlights Row */}
        <div className="pt-10 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl mx-auto text-left font-mono">
          <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase tracking-widest">Architecture</span>
            <p className="text-base font-extrabold text-white mt-0.5">Multi-Tenant Cloud</p>
            <span className="text-[11px] text-vital-emerald">Isolated Databases</span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase tracking-widest">Connected Sync</span>
            <p className="text-base font-extrabold text-white mt-0.5">Event-Driven</p>
            <span className="text-[11px] text-brand-400">0.4ms WebSocket Bus</span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase tracking-widest">Clinical Standards</span>
            <p className="text-base font-extrabold text-white mt-0.5">HL7 &amp; FHIR R4</p>
            <span className="text-[11px] text-vital-violet">Encrypted EMR Vault</span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase tracking-widest">Compliance</span>
            <p className="text-base font-extrabold text-white mt-0.5">DPDP Act 2023</p>
            <span className="text-[11px] text-teal-300">NABH & HIPAA Ready</span>
          </div>
        </div>
      </section>

      {/* 2. THE MULTI-HOSPITAL ARCHITECTURE SHOWCASE */}
      <section className="space-y-8">
        <div className="text-center space-y-2">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-brand-400">
            Modular Multi-Tenant Architecture
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            One Platform. Multiple Hospitals. Separate Data.
          </h2>
          <p className="text-sm text-slate-400 max-w-2xl mx-auto">
            Each organization operates in its own isolated sovereign workspace while leveraging shared high-performance clinical workflows.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 rounded-2xl bg-gradient-to-b from-slate-900 to-obsidian-900 border border-slate-800 space-y-3 hover:border-brand-500/50 transition">
            <span className="text-3xl">🏥</span>
            <h3 className="font-bold text-white text-base">Large Tertiary Hospital</h3>
            <p className="text-xs text-slate-400">
              Complete inpatient bed management, ICU multi-monitor telemetry, robotic OT scheduling, and high-volume billing.
            </p>
            <div className="pt-2 border-t border-slate-800 text-[11px] font-mono text-brand-300">
              Example: Apex Super-Specialty (220 Beds)
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-gradient-to-b from-slate-900 to-obsidian-900 border border-slate-800 space-y-3 hover:border-vital-emerald/50 transition">
            <span className="text-3xl">🩺</span>
            <h3 className="font-bold text-white text-base">Independent Clinic</h3>
            <p className="text-xs text-slate-400">
              Lightweight OPD appointments, fast e-prescriptions, instant WhatsApp notifications, and UPI billing for single physicians.
            </p>
            <div className="pt-2 border-t border-slate-800 text-[11px] font-mono text-vital-emerald">
              Example: Sanjeevani Family Clinic
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-gradient-to-b from-slate-900 to-obsidian-900 border border-slate-800 space-y-3 hover:border-vital-violet/50 transition">
            <span className="text-3xl">🔬</span>
            <h3 className="font-bold text-white text-base">Diagnostic Pathology Lab</h3>
            <p className="text-xs text-slate-400">
              LIMS sample barcode tracking, analyzer HL7 interfacing, pathologist e-signatures, and patient report delivery.
            </p>
            <div className="pt-2 border-t border-slate-800 text-[11px] font-mono text-vital-violet">
              Example: PulseCare Reference Lab
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-gradient-to-b from-slate-900 to-obsidian-900 border border-slate-800 space-y-3 hover:border-indigo-500/50 transition">
            <span className="text-3xl">🌐</span>
            <h3 className="font-bold text-white text-base">Multi-Branch Hospital Network</h3>
            <p className="text-xs text-slate-400">
              Centralized group oversight, cross-branch physician scheduling, unified financial consolidated reporting.
            </p>
            <div className="pt-2 border-t border-slate-800 text-[11px] font-mono text-indigo-300">
              Example: MedStar Group (3 Branches)
            </div>
          </div>
        </div>
      </section>

      {/* 3. THE 12 A–Z MAJOR MODULES SHOWCASE */}
      <section className="space-y-8">
        <div className="text-center space-y-2">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-vital-emerald">
            A–Z Complete Ecosystem
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            12 Deeply Integrated Major Systems
          </h2>
          <p className="text-sm text-slate-400 max-w-2xl mx-auto">
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
              color: 'text-brand-400'
            },
            {
              id: 'doctors',
              icon: Stethoscope,
              title: 'B. Doctor & OPD Desk',
              desc: 'Chamber availability, consultation queue, ICD-10 diagnostic coding, and federated digital prescriptions.',
              color: 'text-vital-emerald'
            },
            {
              id: 'lims',
              icon: FlaskConical,
              title: 'C. Laboratory LIMS',
              desc: 'Sample barcode generation, automated analyzer interfacing, technician assignments, and pathologist digital sign-off.',
              color: 'text-vital-violet'
            },
            {
              id: 'billing',
              icon: CreditCard,
              title: 'D. Billing & Finance',
              desc: 'Automated cross-department bill consolidation, UPI QR code reconciliation, GST compliance, and daily cash flow.',
              color: 'text-vital-amber'
            },
            {
              id: 'pharmacy',
              icon: Pill,
              title: 'E. Pharmacy & Inventory',
              desc: 'Batch and expiry tracking, prescription-based barcode dispensing, cold-chain temperature logs, and reorder alerts.',
              color: 'text-teal-400'
            },
            {
              id: 'hr',
              icon: Users,
              title: 'F. HR & Staff Payroll',
              desc: 'Biometric shift allocation, attendance verification, salary calculation, clinical incentives, and automated payslips.',
              color: 'text-indigo-400'
            },
            {
              id: 'operations',
              icon: BedDouble,
              title: 'G. Hospital Operations',
              desc: 'ICU and ward matrix, central oxygen supply telemetry, robotic OT scheduling, and rapid ambulance dispatch.',
              color: 'text-rose-400'
            },
            {
              id: 'simulator',
              icon: Radio,
              title: 'H. Real-Time Sync & Events',
              desc: 'Durable event bus with automated retries. When a test is approved, the bill, doctor EMR, and patient app sync in 0.4ms.',
              color: 'text-cyan-400'
            },
            {
              id: 'insurance',
              icon: ShieldCheck,
              title: 'I. Insurance & Claims',
              desc: 'Government & private TPA cashless desk, 30-minute pre-authorizations, electronic claim settlement status.',
              color: 'text-purple-400'
            },
            {
              id: 'overview',
              icon: Activity,
              title: 'J. Analytics & Management',
              desc: 'Live executive cockpit, bed occupancy metrics, department profitability, doctor turnaround times, and audit trails.',
              color: 'text-vital-emerald'
            },
            {
              id: 'patient_portal',
              icon: HeartPulse,
              title: 'K. Patient Health Locker',
              desc: 'Digital patient health card, instant PDF prescription downloads, verified lab results, and online bill payments.',
              color: 'text-rose-400'
            }
          ].map(module => {
            const Icon = module.icon;
            return (
              <div
                key={module.id}
                onClick={() => handleLaunchModule(module.id)}
                className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-obsidian-900 border border-slate-800 hover:border-brand-500/50 cursor-pointer transition-all duration-200 group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <Icon className={`w-5 h-5 ${module.color} group-hover:scale-110 transition`} />
                    <span className="text-[10px] text-slate-500 font-mono group-hover:text-brand-300">
                      Explore &rarr;
                    </span>
                  </div>
                  <h3 className="font-bold text-white text-sm mt-3">{module.title}</h3>
                  <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">{module.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. PRICING & SUBSCRIPTION ROADMAP */}
      <section className="space-y-8">
        <div className="text-center space-y-2">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-vital-amber">
            SaaS Commercialization Model
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Transparent Pricing Designed for Scale
          </h2>
          <p className="text-sm text-slate-400 max-w-2xl mx-auto">
            From single-doctor family clinics to multi-city hospital chains.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
            <h3 className="font-bold text-white text-base">Starter Clinic</h3>
            <p className="text-2xl font-extrabold text-white font-mono">₹1,999<span className="text-xs font-normal text-slate-400">/mo</span></p>
            <p className="text-xs text-slate-400">Perfect for independent clinics & general practitioners.</p>
            <ul className="text-xs text-slate-300 space-y-2 font-mono">
              <li>✓ Up to 3 Doctors</li>
              <li>✓ OPD & Digital Rx</li>
              <li>✓ WhatsApp Reminders</li>
              <li>✓ ABHA Verification</li>
            </ul>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
            <h3 className="font-bold text-white text-base">Growth Care</h3>
            <p className="text-2xl font-extrabold text-brand-300 font-mono">₹7,999<span className="text-xs font-normal text-slate-400">/mo</span></p>
            <p className="text-xs text-slate-400">For multi-specialty polyclinics & daycare centers.</p>
            <ul className="text-xs text-slate-300 space-y-2 font-mono">
              <li>✓ Up to 15 Doctors</li>
              <li>✓ In-house Pharmacy</li>
              <li>✓ Mini LIMS Diagnostics</li>
              <li>✓ Cashless UPI Billing</li>
            </ul>
          </div>

          <div className="p-6 rounded-2xl bg-gradient-to-b from-brand-950/40 via-slate-900 to-obsidian-900 border border-brand-500/50 space-y-4 shadow-xl shadow-brand-500/10">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-white text-base">Hospital Pro</h3>
              <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-brand-500 text-obsidian-950 uppercase">Popular</span>
            </div>
            <p className="text-2xl font-extrabold text-vital-emerald font-mono">₹29,999<span className="text-xs font-normal text-slate-400">/mo</span></p>
            <p className="text-xs text-slate-400">For 50 to 200 bed hospitals requiring complete operations.</p>
            <ul className="text-xs text-slate-300 space-y-2 font-mono">
              <li>✓ Full Ward & ICU Matrix</li>
              <li>✓ Operation Theatre Suite</li>
              <li>✓ TPA Cashless Insurance Desk</li>
              <li>✓ Biometric HR & Payroll</li>
            </ul>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
            <h3 className="font-bold text-white text-base">Enterprise Network</h3>
            <p className="text-2xl font-extrabold text-vital-violet font-mono">Custom</p>
            <p className="text-xs text-slate-400">For hospital chains & large diagnostic networks.</p>
            <ul className="text-xs text-slate-300 space-y-2 font-mono">
              <li>✓ Unlimited Branches</li>
              <li>✓ Dedicated S3 Object Vault</li>
              <li>✓ Custom HL7/FHIR Bridges</li>
              <li>✓ 99.99% Enterprise SLA</li>
            </ul>
          </div>
        </div>
      </section>

      {/* 5. FINAL LAUNCH CTA BANNER */}
      <section className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-obsidian-900 via-slate-900 to-slate-850 border border-brand-500/30 text-center space-y-6 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-vital-emerald/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />

        <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          Ready to Experience Hospital OS™ in Action?
        </h2>
        <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto">
          Switch between 4 organizations, 9 staff roles, and interact with the live connected patient journey simulator.
        </p>

        <div className="pt-2">
          <button
            onClick={onLaunchOS}
            className="px-8 py-4 rounded-2xl bg-gradient-to-r from-brand-500 to-vital-emerald text-obsidian-950 font-extrabold text-sm sm:text-base inline-flex items-center gap-3 shadow-xl hover:scale-105 transition"
          >
            <Activity className="w-5 h-5 text-obsidian-950" />
            <span>Enter Sovereign Hospital Operating System</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </section>
    </div>
  );
};

