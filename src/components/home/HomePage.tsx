import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  Activity,
  Lock,
  User,
  CheckCircle2,
  Search,
  X,
  Building2,
  MapPin,
  HeartPulse,
  Brain,
  Stethoscope,
  ShieldCheck,
  Clock,
  CalendarCheck,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Pause,
  Play,
  MinusCircle,
  PhoneCall,
  FileCheck2,
  Pill,
  QrCode,
  Sparkles,
  BedDouble,
  FlaskConical,
  Users,
  CreditCard,
  Layers,
  Globe
} from 'lucide-react';
import { NavigationModule, useHospitalOS } from '../../context/HospitalOSContext';
import { Tenant } from '../../types';

interface HomePageProps {
  onNavigateUserLogin: () => void;
  onNavigateAdminLogin: () => void;
  onLaunchOS: () => void;
}

const HOSPITAL_EMBLEM_THEMES = [
  {
    icon: 'bg-gradient-to-br from-[#2D1B69] to-[#5B21B6] text-white shadow-sm shadow-purple-900/25',
    hoverLine: 'from-[#2D1B69] via-[#5B21B6] to-[#0D9488]',
    hoverBorder: 'hover:border-[#5B21B6]/50 hover:shadow-[0_18px_40px_-14px_rgba(76,29,149,0.22)]'
  },
  {
    icon: 'bg-gradient-to-br from-[#0D9488] to-[#10B981] text-white shadow-sm shadow-emerald-500/25',
    hoverLine: 'from-[#0D9488] via-[#10B981] to-[#6D28D9]',
    hoverBorder: 'hover:border-teal-400/60 hover:shadow-[0_18px_40px_-14px_rgba(13,148,136,0.20)]'
  },
  {
    icon: 'bg-gradient-to-br from-[#2D1B69] to-[#6D28D9] text-white shadow-sm shadow-lavender-700/25',
    hoverLine: 'from-[#2D1B69] via-[#5B21B6] to-[#0D9488]',
    hoverBorder: 'hover:border-lavender-400/60 hover:shadow-[0_18px_40px_-14px_rgba(91,33,182,0.22)]'
  }
];

const CLINICAL_DEPARTMENTS = [
  {
    id: 'cardiology',
    title: 'Cardiology & Vascular',
    subtitle: '24/7 Cath Lab & Non-Invasive Diagnostics',
    description:
      'Comprehensive interventional cardiology, echocardiography, heart rhythm clinics, and structured preventive cardiac screenings across partner hospitals.',
    capabilities: [
      '24/7 Emergency Interventional Cardiology & Primary PCI',
      'Digital ECG, Stress Echo & Lipid Telemetry Reviews',
      'Coordinated Cardiac Rehab & Post-Op Follow-Up'
    ],
    metricLabel: 'Dedicated Cardiac Suites',
    metricValue: '24/7 Cath Readiness',
    topStrip: 'from-rose-500 via-pink-500 to-orange-400',
    readinessStats: [
      { label: 'Door-to-Balloon SLA', value: 'Under 30 Mins' },
      { label: 'Core Diagnostics', value: 'ECG, Echo & CT Angio' },
      { label: 'Consultation Mode', value: 'OPD & 24/7 Emergency' }
    ],
    icon: HeartPulse,
    accentGradient: 'from-rose-500 to-pink-600 text-white shadow-rose-500/25',
    activeBorder: 'border-l-[#E11D48]',
    activeText: 'text-rose-700'
  },
  {
    id: 'neurology',
    title: 'Neurology & Spine Care',
    subtitle: 'Dedicated Stroke Units & Neuro-Rehab',
    description:
      'Rapid stroke stabilization pathways, epilepsy monitoring, movement disorder specialists, and minimally invasive neuro-spine interventions.',
    capabilities: [
      'Acute Stroke Triage with CT/MRI Fast-Track Workflow',
      'Specialized Spine & Functional Neuro-Surgery Units',
      'Continuous Neuro-ICU Monitoring & Physiotherapy'
    ],
    metricLabel: 'Response Protocol',
    metricValue: 'Stroke Code Ready',
    topStrip: 'from-indigo-500 via-violet-500 to-sky-500',
    readinessStats: [
      { label: 'Stroke Triage SLA', value: 'Priority Code Fast-Track' },
      { label: 'Core Diagnostics', value: '3T MRI & Neuro EEG' },
      { label: 'Unit Support', value: 'Dedicated Neuro-ICU' }
    ],
    icon: Brain,
    accentGradient: 'from-indigo-500 to-violet-600 text-white shadow-indigo-500/25',
    activeBorder: 'border-l-[#4F46E5]',
    activeText: 'text-indigo-700'
  },
  {
    id: 'internal',
    title: 'Internal & Family Medicine',
    subtitle: 'Same-Day Outpatient Consultations',
    description:
      'Unified primary care, diabetes and metabolic clinics, preventive executive health checks, and coordinated referrals within one network.',
    capabilities: [
      'Same-Day OPD Slot Booking with Verified Physicians',
      'Integrated Lab Results & E-Prescription Access',
      'Unified Longitudinal Consultation History'
    ],
    metricLabel: 'OPD Scheduling',
    metricValue: 'Instant Slot Booking',
    topStrip: 'from-[#2D1B69] via-[#5B21B6] to-[#0D9488]',
    readinessStats: [
      { label: 'Appointment SLA', value: 'Same-Day Confirmation' },
      { label: 'Records Access', value: 'Instant E-Prescriptions' },
      { label: 'Follow-Up Sync', value: 'Cross-Hospital History' }
    ],
    icon: Stethoscope,
    accentGradient: 'from-[#4C1D95] to-[#6D28D9] text-white shadow-lavender-700/25',
    activeBorder: 'border-l-[#4C1D95]',
    activeText: 'text-[#4C1D95]'
  },
  {
    id: 'critical',
    title: 'Emergency & Trauma ICU',
    subtitle: 'Level-1 Trauma Triage & Critical Beds',
    description:
      'Round-the-clock trauma response, ambulance handoff coordination, multi-organ critical care beds, and real-time ICU specialist oversight.',
    capabilities: [
      'Immediate Triage Intake & Bed Allocation Tracking',
      'Round-the-Clock Critical Care Intensivist Coverage',
      'Cross-Department Trauma Stabilization Teams'
    ],
    metricLabel: 'Readiness',
    metricValue: '365-Day Triage',
    topStrip: 'from-emerald-500 via-teal-500 to-cyan-500',
    readinessStats: [
      { label: 'Triage Availability', value: '24/7 Live Intake' },
      { label: 'Bed Visibility', value: 'Real-Time ICU Tracking' },
      { label: 'Trauma Staffing', value: 'Senior Intensivists' }
    ],
    icon: ShieldCheck,
    accentGradient: 'from-emerald-500 to-teal-600 text-white shadow-emerald-500/25',
    activeBorder: 'border-l-[#059669]',
    activeText: 'text-emerald-700'
  }
];

const UNIFIED_CAPABILITIES = [
  {
    title: 'Digital OPD Pass',
    desc: 'Instant check-in pass with queue token and clinician assignment across all facilities.',
    icon: QrCode,
    accent: 'from-[#2D1B69] to-[#6D28D9] text-white'
  },
  {
    title: 'E-Prescriptions & Notes',
    desc: 'Structured medication orders, clinical summaries, and follow-up dates always handy.',
    icon: FileCheck2,
    accent: 'from-[#0D9488] to-[#10B981] text-white'
  },
  {
    title: 'Pharmacy & Lab Sync',
    desc: 'Seamless dispensing status and diagnostic handoffs linked directly to your visit.',
    icon: Pill,
    accent: 'from-[#4C1D95] to-[#7C3AED] text-white'
  },
  {
    title: 'Unified Network Record',
    desc: 'One cohesive timeline covering every hospital consultation without fragmented paperwork.',
    icon: Sparkles,
    accent: 'from-[#5B21B6] to-[#0D9488] text-white'
  }
];

const CONSULTATION_STEPS = [
  {
    step: '01',
    title: 'Select an Accredited Hospital',
    desc: 'Compare all registered hospitals in the network, verify accreditation status, and inspect branch details.',
    icon: Building2,
    iconStyle: 'bg-gradient-to-br from-[#2D1B69] to-[#6D28D9] text-white shadow-lavender-700/25'
  },
  {
    step: '02',
    title: 'Choose Specialist & Preferred Slot',
    desc: 'Sign in to review verified clinicians by department, check live slot availability, and book seamlessly.',
    icon: CalendarCheck,
    iconStyle: 'bg-gradient-to-br from-[#0D9488] to-[#10B981] text-white shadow-teal-500/25'
  },
  {
    step: '03',
    title: 'Access Digital Pass & Records',
    desc: 'Receive an instant check-in pass alongside organized consultation notes, prescriptions, and history.',
    icon: CheckCircle2,
    iconStyle: 'bg-gradient-to-br from-[#4C1D95] to-[#7C3AED] text-white shadow-lavender-700/25'
  }
];

const TRUST_STANDARDS = [
  { label: 'NABH Certified Care', icon: ShieldCheck, color: 'text-emerald-700 bg-emerald-50 border-emerald-200/80' },
  { label: 'NABL ISO 15189 Labs', icon: FlaskConical, color: 'text-lavender-800 bg-lavender-50 border-lavender-200/80' },
  { label: 'ABDM & ABHA Sync', icon: Globe, color: 'text-indigo-700 bg-indigo-50 border-indigo-200/80' },
  { label: '256-Bit TLS 1.3 Vault', icon: Lock, color: 'text-teal-700 bg-teal-50 border-teal-200/80' },
  { label: '99.99% Clinical Uptime', icon: Activity, color: 'text-[#4C1D95] bg-lavender-50 border-lavender-200/80' }
];

const CLINICAL_SUITE_DESKS: {
  id: string;
  module: NavigationModule;
  label: string;
  code: string;
  subtitle: string;
  accentBar: string;
  badgeStyle: string;
  icon: typeof Stethoscope;
  highlights: string[];
}[] = [
  {
    id: 'patients',
    module: 'patients',
    label: 'OPD & Patient Registry',
    code: 'patient-registry',
    subtitle: 'Unified triage intake, live bedside vitals, and instant discharge summaries',
    accentBar: 'from-[#2D1B69] via-[#5B21B6] to-[#0D9488]',
    badgeStyle: 'bg-lavender-50 text-lavender-800 border-lavender-200',
    icon: Users,
    highlights: ['Live SpO2, BP & Pulse Telemetry', 'ABHA Digital Health ID Sync', 'Zero Duplicate Registration']
  },
  {
    id: 'lims',
    module: 'lims',
    label: 'Pathology LIMS',
    code: 'diagnostics-lims',
    subtitle: 'Barcoded vacutainer pipelines, analyzer inputs, and NABL sign-offs',
    accentBar: 'from-cyan-500 via-sky-500 to-indigo-600',
    badgeStyle: 'bg-cyan-50 text-cyan-800 border-cyan-200',
    icon: FlaskConical,
    highlights: ['Color-Coded Tube Barcoding', 'Auto Abnormal Value Flags', 'Print-Ready NABL Reports']
  },
  {
    id: 'pharmacy',
    module: 'pharmacy',
    label: 'Pharmacy Formulary',
    code: 'pharmacy-dispensary',
    subtitle: 'Batch expiry alerts, controlled dispensing, and automated billing sync',
    accentBar: 'from-emerald-500 via-teal-500 to-sky-500',
    badgeStyle: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    icon: Pill,
    highlights: ['Real-Time Low Stock Alerts', 'Instant Dose Dispense Ledger', 'Zero-Leak Inventory Audit']
  },
  {
    id: 'operations',
    module: 'operations',
    label: 'Wards & ICU Matrix',
    code: 'wards-icu-matrix',
    subtitle: 'Live bed occupancy grid, sanitization tracking, and admission routing',
    accentBar: 'from-violet-500 via-indigo-500 to-sky-500',
    badgeStyle: 'bg-indigo-50 text-indigo-800 border-indigo-200',
    icon: BedDouble,
    highlights: ['Real-Time ICU Bed Vacancy', '1-Click Sanitization Handoff', 'Direct Patient Allocation']
  },
  {
    id: 'billing',
    module: 'billing',
    label: 'Billing, Payroll & TPA',
    code: 'finance-payroll-tpa',
    subtitle: 'UPI/Card receipts, cashless insurance pre-auths, and monthly payroll',
    accentBar: 'from-amber-500 via-orange-500 to-rose-500',
    badgeStyle: 'bg-amber-50 text-amber-800 border-amber-200',
    icon: CreditCard,
    highlights: ['Instant GST-Exempt Receipts', 'Batch Staff Salary Disburse', 'Cashless TPA Tracking']
  }
];

const FACILITY_ARCHITECTURES = [
  {
    name: 'Specialty & Primary Clinics',
    category: 'Outpatient Centers',
    tagline: 'Streamlined doctor chambers, diagnostics walk-ins, and paperless OPD queues',
    highlight: false,
    accent: 'from-[#5B21B6] to-[#7C3AED]',
    badge: 'Outpatient Ready',
    features: [
      'Instant OPD Slot Booking & Queue Passes',
      'Digital E-Prescriptions & Clinical History',
      'Integrated Cashier & UPI Receipt Desk',
      'Dedicated Patient Consultation Portal'
    ]
  },
  {
    name: 'Multi-Specialty Hospitals',
    category: 'Core Clinical Hub',
    tagline: 'Coordinated inpatient, critical care, pathology, pharmacy, and finance desks',
    highlight: true,
    accent: 'from-[#2D1B69] via-[#5B21B6] to-[#0D9488]',
    badge: 'Full Clinical Desk',
    features: [
      'Role-Isolated Doctor, Nurse & Front-Desk Views',
      'Barcoded Pathology LIMS & Formulary Control',
      'Live Ward & ICU Bed Telemetry Matrix',
      'Staff Roster Payroll & Cashless TPA Claims'
    ]
  },
  {
    name: 'Multi-Hospital Health Groups',
    category: 'Connected Network',
    tagline: 'Unified supervision across every registered hospital facility under one roof',
    highlight: false,
    accent: 'from-indigo-600 to-violet-600',
    badge: 'Multi-Facility',
    features: [
      'Instant Switching Across Registered Hospitals',
      'Isolated Clinical Data Per Hospital Facility',
      'Shared Patient Visit Continuity Across Centers',
      'Centralized NABH & NABL Readiness Standards'
    ]
  }
];

const CLINICAL_COMPARE_ROWS: Record<
  'clinical' | 'governance',
  { capability: string; legacy: string; hospitalOS: string }[]
> = {
  clinical: [
    {
      capability: 'Multi-Hospital Patient Continuity',
      legacy: 'Disconnected silos per facility',
      hospitalOS: 'Unified live longitudinal EMR'
    },
    {
      capability: 'OPD Booking, Queue & Token Pass',
      legacy: 'Manual paper slips & phone desks',
      hospitalOS: 'Instant self-service slots & pass'
    },
    {
      capability: 'LIMS Specimen Barcoding & Reports',
      legacy: 'Delayed manual analyzer uploads',
      hospitalOS: 'Color-coded tubes + auto flags'
    },
    {
      capability: 'Ward & ICU Bed Allocation',
      legacy: 'Static whiteboard tracking',
      hospitalOS: 'Real-time 24/7 telemetry grid'
    },
    {
      capability: 'Pharmacy & Billing Reconciliation',
      legacy: 'Separate third-party cashier',
      hospitalOS: 'One-click dispensing + UPI ledger'
    }
  ],
  governance: [
    {
      capability: 'Facility Data Isolation',
      legacy: 'Complex multi-server patches',
      hospitalOS: 'Strict per-hospital isolation'
    },
    {
      capability: 'Role-Based Staff Separation',
      legacy: 'Shared logins & over-exposed views',
      hospitalOS: 'Isolated Doctor, Nurse, Lab & Admin'
    },
    {
      capability: 'Staff Roster & Monthly Payroll',
      legacy: 'External spreadsheet exports',
      hospitalOS: 'Native bonuses, deductions & batch pay'
    },
    {
      capability: 'Cashless Insurance & TPA Tracking',
      legacy: 'Email chains & lost pre-auths',
      hospitalOS: 'Live claim pipeline & status sync'
    },
    {
      capability: 'NABH & NABL Compliance Audit',
      legacy: 'Manual binder preparation',
      hospitalOS: 'Automated timestamped audit logs'
    }
  ]
};

const CLINICAL_FAQS = [
  {
    q: 'How are records kept strictly separated across multiple registered hospitals?',
    a: 'Every hospital and medical center registered in HospitalOS runs in an isolated workspace boundary. Clinicians, beds, pharmacy formulary stock, laboratory tests, and invoices remain scoped to their active hospital while authorized administrators can switch facilities effortlessly.'
  },
  {
    q: 'Can patients book consultations across any accredited partner hospital from one portal?',
    a: 'Yes. Patients sign in once to browse all registered hospitals, compare NABH/NABL verified departments, select a preferred specialist slot, and immediately receive a digital OPD consultation pass with prescriptions and receipts.'
  },
  {
    q: 'How quickly do OPD, Pathology LIMS, Pharmacy, and Billing desks sync?',
    a: 'Updates propagate across desks in real time—ordering a diagnostic test surfaces instantly in Pathology LIMS with vacutainer tube barcoding, prescribed medicines adjust pharmacy inventory, and receipts synchronize with cashier & TPA ledgers.'
  },
  {
    q: 'How are staff roles protected inside a hospital workspace?',
    a: 'Role-isolated views ensure Doctors focus on OPD & assigned charts, Nurses oversee ward vitals & bed handoffs, Pharmacists manage stock dispensing, Lab Technicians approve pathology panels, and Administrators oversee payroll and facility credentials.'
  },
  {
    q: 'Can hospital administrators register a new hospital or multi-branch tower without downtime?',
    a: 'Yes. Authorized hospital operators can register new hospitals or clinics directly from the top hospital switcher dropdown, configure facility credentials and location branches, and launch full clinical desks immediately.'
  }
];

function getInitials(name: string): string {
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return 'HC';
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return (words[0][0] + words[1][0]).toUpperCase();
}

const RevealBand: React.FC<{ id?: string; className?: string; children: React.ReactNode }> = ({
  id,
  className = '',
  children
}) => {
  const ref = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === 'undefined') {
      setVisible(true);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.08, rootMargin: '0px 0px -30px 0px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id={id}
      ref={ref}
      className={`scroll-reveal ${visible ? 'is-visible' : ''} ${className}`}
    >
      {children}
    </section>
  );
};

export const HomePage: React.FC<HomePageProps> = ({
  onNavigateUserLogin,
  onNavigateAdminLogin,
  onLaunchOS
}) => {
  const {
    tenants,
    patients,
    doctors,
    beds,
    labTests,
    pharmacyItems,
    invoices,
    staff,
    metrics,
    setActiveModule,
    isAuthenticated,
    currentRole,
    currentUser
  } = useHospitalOS();
  const [hospitalSearch, setHospitalSearch] = useState('');
  const [hospitalFilter, setHospitalFilter] = useState<'ALL' | 'NABH' | 'MULTI'>('ALL');
  const [activeDeptId, setActiveDeptId] = useState<string>(CLINICAL_DEPARTMENTS[0].id);
  const [deptDirection, setDeptDirection] = useState<'next' | 'prev'>('next');
  const [activeSuiteId, setActiveSuiteId] = useState<string>(CLINICAL_SUITE_DESKS[0].id);
  const [suiteDirection, setSuiteDirection] = useState<'next' | 'prev'>('next');
  const [isSuitePaused, setIsSuitePaused] = useState(false);
  const [selectedHospital, setSelectedHospital] = useState<Tenant | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [parallaxY, setParallaxY] = useState(0);
  const [activeNavSection, setActiveNavSection] = useState<string>('hospitals');
  const [compareMode, setCompareMode] = useState<'clinical' | 'governance'>('clinical');
  const [compareDir, setCompareDir] = useState<'next' | 'prev'>('next');
  const [openFaqIndexes, setOpenFaqIndexes] = useState<number[]>([0]);
  const hospitalTrackRef = useRef<HTMLDivElement | null>(null);

  const toggleFaq = (idx: number) => {
    setOpenFaqIndexes((prev) =>
      prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]
    );
  };

  const toggleAllFaqs = () => {
    setOpenFaqIndexes((prev) =>
      prev.length === CLINICAL_FAQS.length ? [] : CLINICAL_FAQS.map((_, idx) => idx)
    );
  };

  useEffect(() => {
    const sectionIds = ['hospitals', 'platform-suite', 'specialties', 'hospital-network'];
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 12);
      setParallaxY(Math.min(y * 0.14, 72));
      const maxScroll = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
      setScrollProgress(Math.min(Math.max(y / maxScroll, 0), 1));

      let current = sectionIds[0];
      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 180) {
            current = id;
          }
        }
      }
      setActiveNavSection(current);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const selectSuiteTab = (nextId: string, forcedDir?: 'next' | 'prev') => {
    const prevIdx = CLINICAL_SUITE_DESKS.findIndex((d) => d.id === activeSuiteId);
    const nextIdx = CLINICAL_SUITE_DESKS.findIndex((d) => d.id === nextId);
    if (forcedDir) {
      setSuiteDirection(forcedDir);
    } else if (nextIdx !== -1 && prevIdx !== -1) {
      setSuiteDirection(nextIdx >= prevIdx ? 'next' : 'prev');
    }
    setActiveSuiteId(nextId);
  };

  const stepSuiteSlide = (delta: 1 | -1) => {
    const idx = CLINICAL_SUITE_DESKS.findIndex((d) => d.id === activeSuiteId);
    const nextIdx = (idx + delta + CLINICAL_SUITE_DESKS.length) % CLINICAL_SUITE_DESKS.length;
    selectSuiteTab(CLINICAL_SUITE_DESKS[nextIdx].id, delta > 0 ? 'next' : 'prev');
  };

  useEffect(() => {
    if (isSuitePaused) return;
    const timer = window.setInterval(() => {
      setSuiteDirection('next');
      setActiveSuiteId((prevId) => {
        const idx = CLINICAL_SUITE_DESKS.findIndex((d) => d.id === prevId);
        return CLINICAL_SUITE_DESKS[(idx + 1) % CLINICAL_SUITE_DESKS.length].id;
      });
    }, 5500);
    return () => window.clearInterval(timer);
  }, [isSuitePaused]);

  const selectDepartment = (nextId: string) => {
    const prevIdx = CLINICAL_DEPARTMENTS.findIndex((d) => d.id === activeDeptId);
    const nextIdx = CLINICAL_DEPARTMENTS.findIndex((d) => d.id === nextId);
    setDeptDirection(nextIdx >= prevIdx ? 'next' : 'prev');
    setActiveDeptId(nextId);
  };

  const scrollHospitals = (dir: -1 | 1) => {
    const track = hospitalTrackRef.current;
    if (!track) return;
    const step = Math.max(track.clientWidth * 0.72, 320);
    track.scrollBy({ left: dir * step, behavior: 'smooth' });
  };

  const scrollToSection = (sectionId: string) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const filteredHospitals = useMemo(() => {
    const q = hospitalSearch.trim().toLowerCase();
    return tenants.filter((t) => {
      const matchesFilter =
        hospitalFilter === 'ALL'
          ? true
          : hospitalFilter === 'NABH'
            ? t.nabhAccredited
            : t.type?.toLowerCase().includes('multi') ||
              t.tagline.toLowerCase().includes('multi') ||
              t.tagline.toLowerCase().includes('trauma');

      if (!matchesFilter) return false;
      if (!q) return true;
      return (
        t.name.toLowerCase().includes(q) ||
        t.tagline.toLowerCase().includes(q) ||
        t.licenseNumber.toLowerCase().includes(q)
      );
    });
  }, [tenants, hospitalSearch, hospitalFilter]);

  const activeDepartment = useMemo(
    () => CLINICAL_DEPARTMENTS.find((d) => d.id === activeDeptId) || CLINICAL_DEPARTMENTS[0],
    [activeDeptId]
  );

  const activeSuiteDesk = useMemo(
    () => CLINICAL_SUITE_DESKS.find((s) => s.id === activeSuiteId) || CLINICAL_SUITE_DESKS[0],
    [activeSuiteId]
  );

  const ActiveDeptIcon = activeDepartment.icon;
  const ActiveSuiteIcon = activeSuiteDesk.icon;

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col">
      {/* 1. Crisp Luminous Navigation Bar */}
      <header
        className={`sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b transition-all duration-200 ${
          scrolled ? 'border-slate-200 shadow-[0_6px_24px_-10px_rgba(15,23,42,0.12)]' : 'border-slate-200/85'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Brand Mark */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#2D1B69] via-[#4C1D95] to-[#6D28D9] flex items-center justify-center text-white shadow-sm shadow-purple-900/25">
              <Activity className="w-5 h-5" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="font-display font-extrabold text-lg tracking-tight text-slate-950">
                Hospital<span className="text-[#4C1D95]">OS</span>
              </span>
              <span className="hidden sm:inline-block text-[11px] font-semibold text-slate-600 border-l border-slate-200 pl-2.5">
                Healthcare Network
              </span>
            </div>
          </div>

          {/* Animated Underline Anchor Nav with Active Section Spy */}
          <nav className="hidden lg:flex items-center gap-8 text-[13px] font-semibold text-slate-700">
            {[
              { id: 'hospitals', label: 'Hospitals' },
              { id: 'platform-suite', label: 'Clinical Suite' },
              { id: 'specialties', label: 'Specialties' },
              { id: 'hospital-network', label: 'Hospital Network' }
            ].map((item) => {
              const isNavActive = activeNavSection === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => scrollToSection(item.id)}
                  className={`group relative py-1.5 transition-colors ${
                    isNavActive ? 'text-[#4C1D95]' : 'hover:text-[#4C1D95]'
                  }`}
                >
                  <span>{item.label}</span>
                  <span
                    className={`absolute inset-x-0 -bottom-0.5 h-0.5 bg-gradient-to-r from-[#2D1B69] via-[#5B21B6] to-[#0D9488] origin-left transition-transform duration-300 ${
                      isNavActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                    }`}
                  />
                </button>
              );
            })}
          </nav>

          {/* Header Account Actions */}
          <div className="flex items-center gap-2.5">
            {isAuthenticated ? (
              <button
                onClick={onLaunchOS}
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-[#059669] to-[#0D9488] hover:brightness-105 text-white font-semibold text-xs flex items-center gap-1.5 shadow-sm shadow-emerald-600/25 transition-all duration-200 active:scale-[0.98]"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>
                  {currentRole === 'patient' ? `Patient Portal (${currentUser.name})` : 'Admin Workspace'}
                </span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <>
                <button
                  onClick={onNavigateAdminLogin}
                  className="px-3.5 py-2 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 hover:border-slate-400 text-slate-800 font-semibold text-xs flex items-center gap-1.5 transition-all duration-150 active:scale-[0.98]"
                  title="Hospital Administrator Login"
                >
                  <Lock className="w-3.5 h-3.5 text-slate-600" />
                  <span>Admin Login</span>
                </button>

                <button
                  onClick={onNavigateUserLogin}
                  className="px-4 py-2 rounded-lg btn-zoho-primary text-white font-semibold text-xs flex items-center gap-1.5"
                  title="Patient & User Login"
                >
                  <User className="w-3.5 h-3.5" />
                  <span>User Login</span>
                </button>
              </>
            )}
          </div>
        </div>

        {/* Zoho-Style Scroll Reading Progress Hairline */}
        <div
          aria-hidden="true"
          className="h-[2.5px] w-full bg-gradient-to-r from-[#2D1B69] via-[#6D28D9] to-[#0D9488] origin-left transition-transform duration-100 ease-out"
          style={{ transform: `scaleX(${scrollProgress})` }}
        />
      </header>

      {/* 2. Bright Zoho-Inspired Architectural Hero Stage with Parallax Depth */}
      <section className="relative overflow-hidden bg-[#F7F4FF] border-b border-purple-200/60">
        <img
          src="/images/hospital-network-hero.jpg"
          alt="Sunlit interconnected multi-hospital medical center and gardens"
          className="absolute inset-0 w-full h-full object-cover object-right pointer-events-none select-none transition-transform duration-150 ease-out will-change-transform"
          style={{ transform: `translate3d(0, ${parallaxY}px, 0) scale(1.06)` }}
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'linear-gradient(96deg, rgba(252, 250, 255, 0.97) 0%, rgba(246, 243, 255, 0.91) 42%, rgba(243, 239, 255, 0.45) 70%, rgba(255, 255, 255, 0.08) 100%)'
          }}
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-16 sm:pt-20 sm:pb-20 lg:pt-24 lg:pb-24">
          <div className="max-w-2xl space-y-6">
            <div
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/95 backdrop-blur-md border border-[#4C1D95]/20 text-[#3B1876] text-xs font-bold tracking-wide shadow-xs zoho-hero-reveal"
              style={{ '--hero-delay': '0ms' } as React.CSSProperties}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Multi-Hospital Network &bull; One Unified Standard</span>
            </div>

            <h1
              className="font-display text-4xl sm:text-5xl lg:text-[3.65rem] font-extrabold text-[#140B29] leading-[1.06] tracking-[-0.028em] zoho-hero-reveal"
              style={{ '--hero-delay': '90ms' } as React.CSSProperties}
            >
              Smarter Hospitals.{' '}
              <span className="block bg-gradient-to-r from-[#2D1B69] via-[#5B21B6] to-[#0D9488] bg-clip-text text-transparent">
                Faster Healing, Everywhere.
              </span>
            </h1>

            <p
              className="text-base sm:text-[17px] text-slate-700 leading-relaxed max-w-xl font-medium zoho-hero-reveal"
              style={{ '--hero-delay': '180ms' } as React.CSSProperties}
            >
              Where specialist expertise, instant diagnostics, and calmer patient journeys come together—moving every hospital facility in one connected heartbeat.
            </p>

            <div
              className="flex flex-wrap items-center gap-3 pt-1 zoho-hero-reveal"
              style={{ '--hero-delay': '270ms' } as React.CSSProperties}
            >
              <button
                type="button"
                onClick={isAuthenticated ? onLaunchOS : onNavigateUserLogin}
                className="px-6 py-3.5 rounded-xl btn-zoho-primary text-white font-bold text-sm flex items-center gap-2 group"
              >
                <span>{isAuthenticated ? 'Open Workspace' : 'Book Consultation'}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
              </button>

              <button
                type="button"
                onClick={() => scrollToSection('platform-suite')}
                className="px-5 py-3.5 rounded-xl bg-white/95 hover:bg-white border border-purple-200/90 hover:border-[#4C1D95]/45 text-[#1F1240] font-bold text-sm backdrop-blur-md shadow-xs transition-all duration-200 hover:-translate-y-0.5 active:scale-[0.98]"
              >
                Explore Clinical Suite
              </button>
            </div>
          </div>
        </div>

        {/* High-Contrast Dark-Lavender Accent Metrics Strip */}
        <div className="relative border-t border-purple-200/60 bg-white/92 backdrop-blur-md">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 lg:grid-cols-4 divide-y lg:divide-y-0 lg:divide-x divide-purple-100">
            {[
              { label: 'Active Destinations', value: `${tenants.length} Premier Hospitals`, accent: 'text-[#4C1D95]' },
              { label: 'Clinical Precision', value: '50+ Medical Specialties', accent: 'text-[#6D28D9]' },
              { label: 'Instant Readiness', value: '24/7 Trauma & ICU Sync', accent: 'text-emerald-700' },
              { label: 'Trust Benchmark', value: 'NABH & NABL Accredited', accent: 'text-[#2D1B69]' }
            ].map((stat, idx) => (
              <div
                key={stat.label}
                className="py-4 px-2 sm:px-5 first:pl-0 transition-transform duration-200 hover:-translate-y-0.5 zoho-hero-reveal"
                style={{ '--hero-delay': `${320 + idx * 65}ms` } as React.CSSProperties}
              >
                <span className={`text-[11px] uppercase tracking-wider font-bold block ${stat.accent}`}>
                  {stat.label}
                </span>
                <span className="font-display text-sm sm:text-base font-bold text-slate-950 mt-0.5 block">
                  {stat.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 2B. Seamless Sliding Trust & Accreditation Marquee Ribbon */}
      <div className="bg-[#FAF8FF] border-b border-lavender-200/70 py-3.5 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center gap-3 sm:gap-6">
          <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#4C1D95] whitespace-nowrap flex-shrink-0">
            Compliance &amp; Clinical Standards
          </span>
          <div className="w-full overflow-hidden zoho-marquee-mask">
            <div className="zoho-marquee-track items-center gap-3">
              {[...TRUST_STANDARDS, ...TRUST_STANDARDS].map((std, idx) => {
                const StdIcon = std.icon;
                return (
                  <div
                    key={`${std.label}-${idx}`}
                    className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border text-[11px] font-bold whitespace-nowrap shadow-2xs ${std.color}`}
                  >
                    <StdIcon className="w-3.5 h-3.5" />
                    <span>{std.label}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* 3. Pure White Surface — Registered & Accredited Hospitals Network */}
      <main className="flex-1">
        <section id="hospitals" className="scroll-mt-20 bg-white border-b border-slate-200/80 py-14 sm:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-5 pb-5 border-b border-slate-200/90">
              <div className="space-y-1.5">
                <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#4C1D95] block">
                  Your Trusted Care Destinations
                </span>
                <h2 className="font-display text-2xl sm:text-3xl font-bold text-slate-950">
                  Step Inside Leading Accredited Hospitals <span className="text-[#4C1D95]">({filteredHospitals.length})</span>
                </h2>
                <p className="text-sm text-slate-700">
                  Every partner hospital is verified live. Select any facility to inspect credentials and branch readiness in one click.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                {/* Bigin-Style Sliding White Pill Segmented Filter */}
                <div className="relative grid grid-cols-3 p-1 rounded-xl bg-lavender-50 border border-lavender-200/80 min-w-[290px]">
                  <div
                    aria-hidden="true"
                    className="absolute top-1 bottom-1 left-1 w-[calc(33.333%-0.25rem)] rounded-lg bg-white shadow-xs transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]"
                    style={{
                      transform:
                        hospitalFilter === 'ALL'
                          ? 'translateX(0%)'
                          : hospitalFilter === 'NABH'
                            ? 'translateX(100%)'
                            : 'translateX(200%)'
                    }}
                  />
                  {(['ALL', 'NABH', 'MULTI'] as const).map((tab) => (
                    <button
                      key={tab}
                      type="button"
                      onClick={() => setHospitalFilter(tab)}
                      className={`relative z-10 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors duration-200 ${
                        hospitalFilter === tab
                          ? 'text-[#4C1D95]'
                          : 'text-slate-600 hover:text-slate-950'
                      }`}
                    >
                      {tab === 'ALL' ? 'All Hospitals' : tab === 'NABH' ? 'NABH Verified' : 'Multi-Specialty'}
                    </button>
                  ))}
                </div>

                {/* Search Input */}
                <div className="relative w-full sm:w-72">
                  <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    value={hospitalSearch}
                    onChange={(e) => setHospitalSearch(e.target.value)}
                    placeholder="Search hospitals or licenses..."
                    className="w-full pl-10 pr-9 py-2 rounded-lg bg-white border border-slate-300 text-sm text-slate-900 placeholder-slate-500 focus:outline-none focus:border-[#4C1D95] focus:ring-2 focus:ring-[#4C1D95]/15 transition"
                  />
                  {hospitalSearch && (
                    <button
                      type="button"
                      onClick={() => setHospitalSearch('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 rounded text-slate-400 hover:text-slate-700"
                      title="Clear search"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </div>

            {filteredHospitals.length === 0 ? (
              <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50/80 p-10 text-center space-y-2">
                <p className="font-display font-bold text-slate-900 text-base">
                  No hospitals match "{hospitalSearch}"
                </p>
                <p className="text-xs text-slate-600">
                  Clear your search query or switch the filter tab to view all registered hospitals.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredHospitals.length > 3 && (
                  <div className="flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => scrollHospitals(-1)}
                      aria-label="Previous Hospitals"
                      className="w-9 h-9 rounded-full bg-white border border-lavender-200 hover:border-[#4C1D95] text-slate-700 hover:text-[#4C1D95] flex items-center justify-center shadow-xs transition-all hover:scale-105 active:scale-95"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => scrollHospitals(1)}
                      aria-label="Next Hospitals"
                      className="w-9 h-9 rounded-full bg-white border border-lavender-200 hover:border-[#4C1D95] text-slate-700 hover:text-[#4C1D95] flex items-center justify-center shadow-xs transition-all hover:scale-105 active:scale-95"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                )}

                <div
                  ref={hospitalTrackRef}
                  className={
                    filteredHospitals.length > 3
                      ? 'flex gap-6 overflow-x-auto no-scrollbar snap-x snap-mandatory pb-2 scroll-smooth'
                      : 'grid grid-cols-1 md:grid-cols-3 gap-6'
                  }
                >
                  {filteredHospitals.map((t, index) => {
                    const theme = HOSPITAL_EMBLEM_THEMES[index % HOSPITAL_EMBLEM_THEMES.length];
                    return (
                      <button
                        type="button"
                        key={t.id}
                        onClick={() => setSelectedHospital(t)}
                        style={{ '--stagger-delay': `${Math.min(index, 6) * 70}ms` } as React.CSSProperties}
                        className={`group text-left relative overflow-hidden rounded-xl bg-white border border-slate-200/95 p-6 space-y-4 shadow-[0_4px_16px_-6px_rgba(15,23,42,0.06)] hover:-translate-y-1.5 transition-all duration-300 scalable-card stagger-item ${theme.hoverBorder} ${
                          filteredHospitals.length > 3 ? 'flex-shrink-0 w-[86%] sm:w-[47%] lg:w-[calc((100%-3rem)/3)] snap-start' : ''
                        }`}
                      >
                      <div className="flex items-start justify-between gap-3">
                        <div className={`w-11 h-11 rounded-lg flex items-center justify-center font-display font-bold text-sm tracking-tight transition-transform duration-200 group-hover:scale-105 ${theme.icon}`}>
                          {getInitials(t.name)}
                        </div>
                        <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/90">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          <span>{t.nabhAccredited ? 'NABH Accredited' : 'Verified Hospital'}</span>
                        </span>
                      </div>

                      <div className="space-y-1.5">
                        <h3 className="font-display font-bold text-slate-950 text-lg leading-snug group-hover:text-[#4C1D95] transition-colors">
                          {t.name}
                        </h3>
                        <p className="text-xs sm:text-sm text-slate-700 leading-relaxed line-clamp-2">
                          {t.tagline}
                        </p>
                      </div>

                      <div className="pt-3.5 border-t border-slate-100 flex items-center justify-between text-xs">
                        <span className="font-mono text-[11px] font-medium text-slate-600">{t.licenseNumber}</span>
                        <span className="inline-flex items-center gap-1 font-semibold text-[#4C1D95]">
                          <span>Inspect Hospital</span>
                          <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                        </span>
                      </div>

                      {/* Signature smooth glide bottom highlight on hover */}
                      <div
                        className={`absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r ${theme.hoverLine} origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300`}
                      />
                    </button>
                  );
                })}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* 3B. Zoho-Style Auto-Advancing & Sliding Clinical Suite Showcase */}
        <RevealBand
          id="platform-suite"
          className="scroll-mt-20 bg-gradient-to-b from-[#F7F4FF] to-white border-b border-purple-200/50 py-14 sm:py-16"
        >
          <div
            onMouseEnter={() => setIsSuitePaused(true)}
            onMouseLeave={() => setIsSuitePaused(false)}
            className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8"
          >
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 zoho-slide-left">
              <div className="max-w-2xl space-y-1.5">
                <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-[#4C1D95]">
                  <Layers className="w-3.5 h-3.5" />
                  <span>Unified Clinical Choreography</span>
                </span>
                <h2 className="font-display text-2xl sm:text-3xl font-bold text-slate-950">
                  When Every Desk Connects, Every Second Matters.
                </h2>
                <p className="text-sm text-slate-700">
                  See how OPD consultations, LIMS diagnostics, pharmacy stock, ICU beds, and billing move in effortless sync—zero paperwork drag.
                </p>
              </div>
              <div className="flex items-center gap-2 self-start md:self-auto">
                <button
                  type="button"
                  onClick={() => setIsSuitePaused((p) => !p)}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full bg-white border border-lavender-200 text-[#4C1D95] hover:bg-lavender-50 shadow-2xs transition"
                  title={isSuitePaused ? 'Resume Auto-Slide Tour' : 'Pause Auto-Slide Tour'}
                >
                  {isSuitePaused ? <Play className="w-3 h-3 fill-current" /> : <Pause className="w-3 h-3" />}
                  <span>{isSuitePaused ? 'Resume Tour' : 'Auto-Sliding Live'}</span>
                </button>
                <div className="inline-flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => stepSuiteSlide(-1)}
                    aria-label="Previous Clinical Desk"
                    className="w-8 h-8 rounded-full bg-white border border-slate-200 hover:border-[#4C1D95] text-slate-700 hover:text-[#4C1D95] flex items-center justify-center transition hover:scale-105 active:scale-95"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => stepSuiteSlide(1)}
                    aria-label="Next Clinical Desk"
                    className="w-8 h-8 rounded-full bg-white border border-slate-200 hover:border-[#4C1D95] text-slate-700 hover:text-[#4C1D95] flex items-center justify-center transition hover:scale-105 active:scale-95"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Suite Horizontal Tabs with Animated Progress Timer Underline */}
            <div className="flex items-center gap-2.5 overflow-x-auto no-scrollbar pb-1">
              {CLINICAL_SUITE_DESKS.map((desk) => {
                const Icon = desk.icon;
                const isSelected = desk.id === activeSuiteDesk.id;
                return (
                  <button
                    key={desk.id}
                    type="button"
                    onClick={() => selectSuiteTab(desk.id)}
                    className={`relative overflow-hidden px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap inline-flex items-center gap-2 border transition-all duration-300 ${
                      isSelected
                        ? 'btn-zoho-primary text-white border-transparent shadow-md scale-[1.02]'
                        : 'bg-white text-slate-700 border-slate-200 hover:border-lavender-300 hover:text-[#4C1D95]'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{desk.label}</span>
                    {isSelected && (
                      <span
                        key={`${desk.id}-progress`}
                        className={`absolute inset-x-0 bottom-0 h-[3px] bg-gradient-to-r from-emerald-300 via-teal-200 to-white zoho-tab-progress ${
                          isSuitePaused ? 'is-paused' : ''
                        }`}
                      />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Directional Sliding Interactive Hospital Desk Container */}
            <div className="overflow-hidden rounded-2xl">
              <div
                key={activeSuiteDesk.id}
                className={`rounded-2xl bg-white border border-slate-200/95 shadow-[0_22px_50px_-16px_rgba(28,16,59,0.14)] overflow-hidden ${
                  suiteDirection === 'next' ? 'zoho-slide-next' : 'zoho-slide-prev'
                }`}
              >
              {/* Top Window Bar */}
              <div className="px-4 sm:px-6 py-3 bg-slate-50 border-b border-slate-200/90 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-400" />
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                  <span className="ml-2 px-3 py-1 rounded-md bg-white border border-slate-200 text-[11px] font-mono text-slate-600 font-medium">
                    HospitalOS &bull; {activeSuiteDesk.code}
                  </span>
                </div>
                <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${activeSuiteDesk.badgeStyle}`}>
                  Role-Isolated Hospital Desk
                </span>
              </div>

              <div className={`h-1.5 w-full bg-gradient-to-r ${activeSuiteDesk.accentBar}`} />

              <div className="p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-7 items-center">
                {/* Left Module Narrative & Action */}
                <div className="lg:col-span-5 space-y-5">
                  <div className="flex items-center gap-3">
                    <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${activeSuiteDesk.accentBar} text-white flex items-center justify-center shadow-sm`}>
                      <ActiveSuiteIcon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-display text-xl font-extrabold text-slate-950">{activeSuiteDesk.label}</h3>
                      <p className="text-xs text-slate-600 font-medium">{activeSuiteDesk.subtitle}</p>
                    </div>
                  </div>

                  <div className="space-y-2.5 pt-1">
                    {activeSuiteDesk.highlights.map((hl) => (
                      <div key={hl} className="flex items-center gap-2.5 text-sm font-medium text-slate-800">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                        <span>{hl}</span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        setActiveModule(activeSuiteDesk.module);
                        if (isAuthenticated) {
                          onLaunchOS();
                        } else {
                          onNavigateAdminLogin();
                        }
                      }}
                      className="btn-zoho-primary px-5 py-2.5 rounded-xl text-white font-bold text-xs inline-flex items-center gap-2"
                    >
                      <span>Launch {activeSuiteDesk.label}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Right Live Mini Interface Replication with Floating Zoho Telemetry Pill */}
                <div className="lg:col-span-7 relative rounded-xl bg-slate-50/90 border border-slate-200/90 p-4 sm:p-5 space-y-3.5">
                  {activeSuiteDesk.id === 'patients' && (
                    <>
                      <div className="flex items-center justify-between text-xs font-bold text-slate-800 pb-2 border-b border-slate-200">
                        <span>Live Patient Registry Stream</span>
                        <span className="font-mono text-[#4C1D95]">{patients.length} Active Records</span>
                      </div>
                      <div className="space-y-2">
                        {patients.slice(0, 3).map((pt) => (
                          <div key={pt.id} className="p-3 rounded-xl bg-white border border-slate-200/80 flex items-center justify-between text-xs shadow-2xs">
                            <div>
                              <p className="font-bold text-slate-950">{pt.name} <span className="font-mono text-slate-500 font-normal">({pt.id})</span></p>
                              <p className="text-[11px] text-slate-600">{pt.assignedDoctorName} &bull; SpO2 {pt.vitals.spO2}% &bull; BP {pt.vitals.bloodPressure}</p>
                            </div>
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-lavender-50 text-lavender-800 border border-lavender-200">
                              {pt.status}
                            </span>
                          </div>
                        ))}
                      </div>
                    </>
                  )}

                  {activeSuiteDesk.id === 'lims' && (
                    <>
                      <div className="flex items-center justify-between text-xs font-bold text-slate-800 pb-2 border-b border-slate-200">
                        <span>Diagnostic Specimen &amp; Analyzer Queue</span>
                        <span className="font-mono text-cyan-700">{labTests.length} Active Orders</span>
                      </div>
                      <div className="space-y-2">
                        {(labTests.length > 0 ? labTests.slice(0, 3) : [
                          { id: 'LAB-101', testName: 'Complete Blood Count (CBC)', patientName: 'Sample Queue Ready', barcode: 'BC-884102', status: 'Analyzing' },
                          { id: 'LAB-102', testName: 'Comprehensive Metabolic Panel', patientName: 'Walk-In Automation', barcode: 'BC-884109', status: 'Approved' }
                        ]).map((t) => (
                          <div key={t.id} className="p-3 rounded-xl bg-white border border-slate-200/80 flex items-center justify-between text-xs shadow-2xs">
                            <div>
                              <p className="font-bold text-slate-950">{t.testName}</p>
                              <p className="text-[11px] text-slate-600">{t.patientName} &bull; <span className="font-mono">{t.barcode}</span></p>
                            </div>
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-cyan-50 text-cyan-800 border border-cyan-200">
                              {t.status}
                            </span>
                          </div>
                        ))}
                      </div>
                    </>
                  )}

                  {activeSuiteDesk.id === 'pharmacy' && (
                    <>
                      <div className="flex items-center justify-between text-xs font-bold text-slate-800 pb-2 border-b border-slate-200">
                        <span>Live Dispensary Stock Ledger</span>
                        <span className="font-mono text-emerald-700">{pharmacyItems.length} Formulations</span>
                      </div>
                      <div className="space-y-2">
                        {pharmacyItems.slice(0, 3).map((item) => (
                          <div key={item.id} className="p-3 rounded-xl bg-white border border-slate-200/80 flex items-center justify-between text-xs shadow-2xs">
                            <div>
                              <p className="font-bold text-slate-950">{item.name}</p>
                              <p className="text-[11px] text-slate-600">{item.category} &bull; Batch {item.batchNo}</p>
                            </div>
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                              {item.stockQty} Units
                            </span>
                          </div>
                        ))}
                      </div>
                    </>
                  )}

                  {activeSuiteDesk.id === 'operations' && (
                    <>
                      <div className="flex items-center justify-between text-xs font-bold text-slate-800 pb-2 border-b border-slate-200">
                        <span>Live Ward &amp; ICU Bed Matrix</span>
                        <span className="font-mono text-indigo-700">{beds.length} Tracked Beds</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {beds.slice(0, 4).map((b) => (
                          <div key={b.id} className="p-3 rounded-xl bg-white border border-slate-200/80 flex items-center justify-between text-xs shadow-2xs">
                            <div>
                              <p className="font-bold text-slate-950">{b.bedNumber}</p>
                              <p className="text-[11px] text-slate-600">{b.wardType}</p>
                            </div>
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                              b.status === 'Occupied'
                                ? 'bg-rose-50 text-rose-700 border-rose-200'
                                : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            }`}>
                              {b.status}
                            </span>
                          </div>
                        ))}
                      </div>
                    </>
                  )}

                  {activeSuiteDesk.id === 'billing' && (
                    <>
                      <div className="flex items-center justify-between text-xs font-bold text-slate-800 pb-2 border-b border-slate-200">
                        <span>Finance, TPA Claims &amp; Staff Payroll</span>
                        <span className="font-mono text-amber-700">{staff.length} Active Staff</span>
                      </div>
                      <div className="grid grid-cols-2 gap-3 text-xs">
                        <div className="p-3.5 rounded-xl bg-white border border-slate-200/80">
                          <span className="text-[10px] font-bold uppercase text-slate-500 block">Daily Revenue Realized</span>
                          <span className="font-display text-lg font-extrabold text-slate-950 mt-0.5 block">
                            ₹{metrics.totalRevenueToday.toLocaleString('en-IN')}
                          </span>
                        </div>
                        <div className="p-3.5 rounded-xl bg-white border border-slate-200/80">
                          <span className="text-[10px] font-bold uppercase text-slate-500 block">Pending TPA Claims</span>
                          <span className="font-display text-lg font-extrabold text-amber-700 mt-0.5 block">
                            ₹{metrics.pendingClaimsAmount.toLocaleString('en-IN')}
                          </span>
                        </div>
                      </div>
                      {invoices.length > 0 && (
                        <div className="space-y-2">
                          {invoices.slice(0, 2).map((inv) => (
                            <div key={inv.id} className="p-2.5 rounded-xl bg-white border border-slate-200/80 flex items-center justify-between text-xs shadow-2xs">
                              <div>
                                <p className="font-bold text-slate-950">{inv.patientName}</p>
                                <p className="text-[11px] text-slate-600">{inv.type} &bull; ₹{inv.totalAmount.toLocaleString('en-IN')}</p>
                              </div>
                              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                                {inv.status}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </>
                  )}

                  {/* Signature Zoho CRM Floating Live Sync Pill */}
                  <div className="mt-3 pt-2.5 border-t border-slate-200/70 flex items-center justify-between text-[11px]">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/95 backdrop-blur-md border border-lavender-200/90 shadow-sm animate-float">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                      <span className="font-bold text-[#2D1B69]">Live Hospital Desk Sync</span>
                    </div>
                    <span className="font-mono font-semibold text-slate-600">
                      Isolated &bull; NABH Audit Ready
                    </span>
                  </div>
                </div>
              </div>
            </div>
            </div>

            {/* Slide Indicator Dots */}
            <div className="flex items-center justify-center gap-2 pt-1">
              {CLINICAL_SUITE_DESKS.map((desk) => {
                const active = desk.id === activeSuiteDesk.id;
                return (
                  <button
                    key={`${desk.id}-dot`}
                    type="button"
                    aria-label={`Jump to ${desk.label}`}
                    onClick={() => selectSuiteTab(desk.id)}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      active
                        ? 'w-7 bg-gradient-to-r from-[#2D1B69] to-[#6D28D9]'
                        : 'w-2 bg-lavender-300/80 hover:bg-lavender-400'
                    }`}
                  />
                );
              })}
            </div>
          </div>
        </RevealBand>

        {/* 4. Sticky Split Specialty Switcher — Soft Luminous Lavender Mist Surface */}
        <RevealBand
          id="specialties"
          className="scroll-mt-20 bg-gradient-to-b from-[#F3EEFF] to-[#FAF8FF] border-b border-purple-200/50 py-14 sm:py-16"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
            <div className="max-w-2xl space-y-1.5 zoho-slide-left">
              <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#4C1D95] block">
                Centers of Clinical Excellence
              </span>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-slate-950">
                World-Class Expertise, Ready When You Are
              </h2>
              <p className="text-sm text-slate-700">
                From urgent 24/7 cardiac rescue to same-day family visits—step straight into specialized care without the wait.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left Sticky Interactive Selector */}
              <div className="lg:col-span-5 lg:sticky lg:top-24 space-y-2.5 zoho-slide-left">
                {CLINICAL_DEPARTMENTS.map((dept) => {
                  const Icon = dept.icon;
                  const isActive = dept.id === activeDepartment.id;
                  return (
                    <button
                      type="button"
                      key={dept.id}
                      onClick={() => selectDepartment(dept.id)}
                      className={`w-full text-left rounded-xl p-4 border transition-all duration-300 flex items-center justify-between gap-3 ${
                        isActive
                          ? `bg-white border-lavender-200 border-l-4 ${dept.activeBorder} shadow-[0_12px_30px_-10px_rgba(76,29,149,0.18)] translate-x-1`
                          : 'bg-white/75 border-slate-200/60 hover:bg-white hover:border-lavender-200 hover:translate-x-0.5'
                      }`}
                    >
                      <div className="flex items-center gap-3.5">
                        <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${dept.accentGradient} flex items-center justify-center flex-shrink-0 shadow-sm transition-transform duration-300 ${isActive ? 'scale-105' : ''}`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className={`font-display font-bold text-sm ${isActive ? dept.activeText : 'text-slate-950'}`}>
                            {dept.title}
                          </h3>
                          <p className="text-xs text-slate-600 mt-0.5">{dept.subtitle}</p>
                        </div>
                      </div>
                      <ChevronRight
                        className={`w-4 h-4 flex-shrink-0 transition-transform duration-200 ${
                          isActive ? `${dept.activeText} translate-x-1` : 'text-slate-500'
                        }`}
                      />
                    </button>
                  );
                })}
              </div>

              {/* Right Active Showcase Card with Zoho Directional Slide */}
              <div className="lg:col-span-7 overflow-hidden rounded-2xl zoho-slide-right">
                <div
                  key={activeDepartment.id}
                  className={`relative overflow-hidden rounded-2xl bg-white border border-lavender-200/80 shadow-[0_18px_44px_-16px_rgba(76,29,149,0.16)] ${
                    deptDirection === 'next' ? 'zoho-slide-next' : 'zoho-slide-prev'
                  }`}
                >
                {/* Signature Zoho Top Color Gradation Accent */}
                <div className={`h-1.5 w-full bg-gradient-to-r ${activeDepartment.topStrip}`} />

                <div className="p-6 sm:p-8 space-y-6">
                  <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-100 pb-5">
                    <div className="flex items-center gap-3.5">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${activeDepartment.accentGradient} flex items-center justify-center shadow-sm`}>
                        <ActiveDeptIcon className="w-6 h-6" />
                      </div>
                      <div>
                        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600 block">
                          {activeDepartment.metricLabel}: <span className="text-[#4C1D95]">{activeDepartment.metricValue}</span>
                        </span>
                        <h3 className="font-display text-xl sm:text-2xl font-bold text-slate-950">
                          {activeDepartment.title}
                        </h3>
                      </div>
                    </div>

                    <span className="text-xs font-semibold px-3 py-1 rounded-full bg-lavender-50 text-[#4C1D95] border border-lavender-200/90">
                      Active in {tenants.length} Hospitals
                    </span>
                  </div>

                  <p className="text-sm sm:text-base text-slate-800 leading-relaxed">
                    {activeDepartment.description}
                  </p>

                  {/* 3-Column Clinical Readiness Spotlight */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {activeDepartment.readinessStats.map((stat) => (
                      <div
                        key={stat.label}
                        className="rounded-xl bg-gradient-to-br from-[#F7F5FF] to-[#F3EEFF] border border-lavender-200/80 px-4 py-3"
                      >
                        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600 block">
                          {stat.label}
                        </span>
                        <span className="font-display text-sm font-bold text-slate-950 mt-0.5 block">
                          {stat.value}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-2.5">
                    {activeDepartment.capabilities.map((cap) => (
                      <div key={cap} className="flex items-start gap-2.5 text-sm text-slate-900 font-medium">
                        <CheckCircle2 className="w-4 h-4 text-[#059669] flex-shrink-0 mt-0.5" />
                        <span>{cap}</span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-4 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100">
                    <span className="text-xs font-semibold text-slate-700">
                      Verified specialists available for OPD &amp; scheduled visits
                    </span>
                    <button
                      type="button"
                      onClick={isAuthenticated ? onLaunchOS : onNavigateUserLogin}
                      className="px-4 py-2 rounded-lg btn-zoho-primary text-white text-xs font-bold inline-flex items-center gap-1.5"
                    >
                      <span>Book {activeDepartment.title.split('&')[0].trim()} Visit</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
              </div>
            </div>
          </div>
        </RevealBand>

        {/* 5. Structured 3-Step Patient Workflow & Unified Care Capabilities */}
        <RevealBand
          id="care-flow"
          className="scroll-mt-20 bg-gradient-to-b from-white via-[#FAF8FF] to-[#F3EEFF] border-b border-lavender-200/60 py-14 sm:py-16"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div className="max-w-2xl space-y-1.5">
                <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#4C1D95] block">
                  Care Without Waiting Room Friction
                </span>
                <h2 className="font-display text-2xl sm:text-3xl font-bold text-slate-950">
                  Three Effortless Steps to Better Care
                </h2>
                <p className="text-sm text-slate-700">
                  Pick your hospital, reserve your specialist in seconds, and carry every report and prescription in one living record.
                </p>
              </div>
              <span className="text-xs font-semibold px-3.5 py-1.5 rounded-full bg-lavender-50 border border-lavender-200 text-[#4C1D95] shadow-xs self-start md:self-auto">
                3 Connected Clinical Steps
              </span>
            </div>

            <div className="relative">
              {/* Connected Desktop Animated Progression Track */}
              <div
                aria-hidden="true"
                className="zoho-track-line hidden md:block absolute top-11 left-[14%] right-[14%] h-0.5 bg-gradient-to-r from-[#2D1B69]/40 via-[#6D28D9]/55 to-[#0D9488]/45 pointer-events-none"
              />

              <div className="relative grid grid-cols-1 md:grid-cols-3 gap-6">
                {CONSULTATION_STEPS.map((item, idx) => {
                  const StepIcon = item.icon;
                  return (
                    <div
                      key={item.step}
                      style={{ '--stagger-i': idx } as React.CSSProperties}
                      className="zoho-stagger group rounded-2xl border border-slate-200/95 bg-white hover:border-[#4C1D95]/45 p-6 space-y-4 transition-all duration-300 hover:-translate-y-1.5 shadow-[0_8px_24px_-14px_rgba(28,16,59,0.09)] hover:shadow-[0_18px_36px_-14px_rgba(76,29,149,0.22)]"
                    >
                      <div className="flex items-center justify-between">
                        <div className={`w-11 h-11 rounded-xl flex items-center justify-center shadow-sm ${item.iconStyle}`}>
                          <StepIcon className="w-5 h-5" />
                        </div>
                        <span className="font-mono text-xs font-bold text-[#4C1D95] bg-lavender-50 border border-lavender-200 px-2.5 py-1 rounded-md">
                          STEP {item.step}
                        </span>
                      </div>
                      <div className="space-y-1.5">
                        <h3 className="font-display font-bold text-slate-950 text-lg group-hover:text-[#4C1D95] transition-colors">
                          {item.title}
                        </h3>
                        <p className="text-sm text-slate-700 leading-relaxed">{item.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Integrated 4-Tile Unified Platform Capabilities Bar */}
            <div className="rounded-2xl bg-white/95 border border-slate-200/90 p-5 sm:p-6 shadow-[0_12px_32px_-16px_rgba(28,16,59,0.08)]">
              <div className="flex flex-wrap items-center justify-between gap-2 pb-4 mb-5 border-b border-slate-100">
                <span className="text-xs font-bold uppercase tracking-[0.14em] text-[#4C1D95]">
                  Included Across Every Registered Hospital
                </span>
                <span className="text-xs font-semibold text-slate-700">
                  Real-time synchronized clinical ecosystem
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {UNIFIED_CAPABILITIES.map((cap, idx) => {
                  const CapIcon = cap.icon;
                  return (
                    <div
                      key={cap.title}
                      style={{ '--stagger-i': idx + 2 } as React.CSSProperties}
                      className="zoho-stagger flex items-start gap-3.5 group"
                    >
                      <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${cap.accent} flex items-center justify-center flex-shrink-0 shadow-xs transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3`}>
                        <CapIcon className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="font-display font-bold text-sm text-slate-950">{cap.title}</h4>
                        <p className="text-xs text-slate-700 leading-relaxed mt-1">{cap.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </RevealBand>

        {/* 5B. Bigin-Inspired Interactive Clinical Benchmark Comparison Matrix */}
        <RevealBand
          id="network-compare"
          className="scroll-mt-20 bg-[#FAF8FF] border-b border-lavender-200/60 py-14 sm:py-16"
        >
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-9">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-5">
              <div className="max-w-2xl space-y-1.5 zoho-slide-left">
                <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#4C1D95] block">
                  Designed Without Software Bloat
                </span>
                <h2 className="font-display text-2xl sm:text-3xl font-bold text-slate-950">
                  Unified Clinical OS vs. Fragmented Legacy Tools
                </h2>
                <p className="text-sm text-slate-700">
                  See why modern hospitals move off disconnected spreadsheets and clunky legacy portals onto a single unified workspace.
                </p>
              </div>

              {/* Sliding Pill Mode Toggle (Clinical vs Governance) */}
              <div className="relative grid grid-cols-2 p-1 rounded-xl bg-lavender-100/80 border border-lavender-200 min-w-[280px] self-start md:self-auto zoho-slide-right">
                <div
                  aria-hidden="true"
                  className={`absolute top-1 bottom-1 left-1 w-[calc(50%-0.25rem)] rounded-lg bg-white shadow-xs transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                    compareMode === 'governance' ? 'translate-x-full' : 'translate-x-0'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => {
                    setCompareDir('prev');
                    setCompareMode('clinical');
                  }}
                  className={`relative z-10 px-3.5 py-2 rounded-lg text-xs font-bold transition-colors ${
                    compareMode === 'clinical' ? 'text-[#4C1D95]' : 'text-slate-600 hover:text-slate-950'
                  }`}
                >
                  Clinical Desks
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setCompareDir('next');
                    setCompareMode('governance');
                  }}
                  className={`relative z-10 px-3.5 py-2 rounded-lg text-xs font-bold transition-colors ${
                    compareMode === 'governance' ? 'text-[#4C1D95]' : 'text-slate-600 hover:text-slate-950'
                  }`}
                >
                  Network Governance
                </button>
              </div>
            </div>

            <div className="rounded-2xl overflow-hidden bg-white border border-lavender-200/80 shadow-[0_18px_46px_-18px_rgba(76,29,149,0.16)]">
              {/* Matrix Header */}
              <div className="grid grid-cols-12 border-b border-lavender-100 bg-slate-50/70 text-xs font-bold">
                <div className="col-span-12 sm:col-span-4 p-4 sm:p-5 text-slate-600 uppercase tracking-wider text-[11px] flex items-center">
                  Hospital Workflow Area
                </div>
                <div className="col-span-6 sm:col-span-4 p-4 sm:p-5 text-slate-500 border-t sm:border-t-0 sm:border-l border-slate-200/80 flex items-center gap-2">
                  <MinusCircle className="w-4 h-4 text-slate-400 flex-shrink-0" />
                  <span>Legacy Siloed Tools</span>
                </div>
                <div className="col-span-6 sm:col-span-4 p-4 sm:p-5 bg-gradient-to-r from-[#2D1B69] via-[#4C1D95] to-[#5B21B6] text-white border-t sm:border-t-0 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-emerald-300 flex-shrink-0" />
                    <span className="font-display font-extrabold">HospitalOS Network</span>
                  </div>
                  <span className="hidden lg:inline-block px-2 py-0.5 rounded-full bg-white/15 text-[10px] font-bold text-lavender-100">
                    Unified
                  </span>
                </div>
              </div>

              {/* Sliding Rows */}
              <div
                key={compareMode}
                className={`divide-y divide-slate-100 ${
                  compareDir === 'next' ? 'zoho-slide-next' : 'zoho-slide-prev'
                }`}
              >
                {CLINICAL_COMPARE_ROWS[compareMode].map((row, idx) => (
                  <div
                    key={row.capability}
                    style={{ '--stagger-i': idx } as React.CSSProperties}
                    className="grid grid-cols-12 items-center hover:bg-lavender-50/45 transition-colors duration-200"
                  >
                    <div className="col-span-12 sm:col-span-4 px-4 sm:px-5 py-3.5 sm:py-4 font-display font-bold text-xs sm:text-sm text-slate-950">
                      {row.capability}
                    </div>
                    <div className="col-span-6 sm:col-span-4 px-4 sm:px-5 py-3.5 sm:py-4 border-t sm:border-t-0 sm:border-l border-slate-100 text-xs text-slate-500 flex items-center gap-2">
                      <MinusCircle className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                      <span>{row.legacy}</span>
                    </div>
                    <div className="col-span-6 sm:col-span-4 px-4 sm:px-5 py-3.5 sm:py-4 bg-lavender-50/40 border-t sm:border-t-0 border-l border-lavender-100 text-xs font-bold text-[#2D1B69] flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                      <span>{row.hospitalOS}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </RevealBand>

        {/* 6. Multi-Hospital Network Governance Architecture */}
        <RevealBand
          id="hospital-network"
          className="scroll-mt-20 bg-white border-t border-slate-200/80 py-14 sm:py-16"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-5">
              <div className="max-w-2xl space-y-1.5">
                <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#4C1D95] block">
                  Built for Multi-Hospital Scale
                </span>
                <h2 className="font-display text-2xl sm:text-3xl font-bold text-slate-950">
                  Built for Every Clinic, Care Tower &amp; Hospital Group
                </h2>
                <p className="text-sm text-slate-700">
                  Strict clinical isolation meets seamless network coordination across every facility, ward, and medical team.
                </p>
              </div>

              <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-lavender-50 border border-lavender-200 text-xs font-bold text-[#4C1D95] self-start md:self-auto">
                <Building2 className="w-4 h-4" />
                <span>{tenants.length} Active Network Facilities</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {FACILITY_ARCHITECTURES.map((arch, idx) => (
                <div
                  key={arch.name}
                  style={{ '--stagger-i': idx } as React.CSSProperties}
                  className={`zoho-stagger relative rounded-2xl overflow-hidden bg-white border transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between scalable-card ${
                    arch.highlight
                      ? 'border-[#4C1D95]/45 shadow-[0_20px_44px_-16px_rgba(76,29,149,0.22)] ring-1 ring-[#4C1D95]/15'
                      : 'border-slate-200/95 shadow-sm hover:border-purple-300'
                  }`}
                >
                  <div className={`h-1.5 w-full bg-gradient-to-r ${arch.accent}`} />
                  <div className="p-6 sm:p-7 space-y-5 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#4C1D95] block">
                          {arch.category}
                        </span>
                        <h3 className="font-display text-lg font-extrabold text-slate-950 mt-0.5">{arch.name}</h3>
                        <p className="text-xs text-slate-600 mt-1">{arch.tagline}</p>
                      </div>
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider flex-shrink-0 border ${
                          arch.highlight
                            ? 'bg-lavender-50 text-[#4C1D95] border-lavender-200'
                            : 'bg-slate-50 text-slate-700 border-slate-200'
                        }`}
                      >
                        {arch.badge}
                      </span>
                    </div>

                    <div className="pt-3 border-t border-slate-100">
                      <ul className="space-y-2.5">
                        {arch.features.map((feat) => (
                          <li key={feat} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-800 font-medium">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Live Multi-Hospital Capacity Summary Bar */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 p-5 rounded-2xl bg-gradient-to-r from-[#F7F5FF] via-[#F3EEFF] to-[#F0FDFA] border border-lavender-200/80">
              {[
                { label: 'Registered Hospitals', value: tenants.length, sub: 'Live synchronized directories' },
                { label: 'Verified Specialists', value: doctors.length, sub: 'Across OPD & trauma care' },
                { label: 'Tracked Hospital Beds', value: beds.length, sub: `${metrics.availableBeds} ready for intake` },
                { label: 'Active Patient Records', value: patients.length, sub: 'Isolated per medical facility' }
              ].map((item, idx) => (
                <div
                  key={item.label}
                  style={{ '--stagger-i': idx } as React.CSSProperties}
                  className="zoho-stagger space-y-0.5 px-2"
                >
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600 block">
                    {item.label}
                  </span>
                  <span className="font-display text-2xl font-extrabold text-[#1C103B] block">
                    {item.value}
                  </span>
                  <span className="text-[11px] font-medium text-slate-600 block">{item.sub}</span>
                </div>
              ))}
            </div>
          </div>
        </RevealBand>

        {/* 6B. Smooth CSS-Grid Clinical Operations Accordion (Bigin / Zoho FAQ Pattern) */}
        <RevealBand
          id="clinical-faq"
          className="scroll-mt-20 bg-[#FAF8FF] border-t border-lavender-200/60 py-14 sm:py-16"
        >
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div className="space-y-1.5 zoho-slide-left">
                <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#4C1D95] block">
                  Operational Clarity
                </span>
                <h2 className="font-display text-2xl sm:text-3xl font-bold text-slate-950">
                  Common Questions Across Hospital Networks
                </h2>
              </div>

              <button
                type="button"
                onClick={toggleAllFaqs}
                className="px-3.5 py-2 rounded-xl bg-white border border-lavender-200 hover:border-[#4C1D95] text-xs font-bold text-[#4C1D95] shadow-2xs transition self-start sm:self-auto"
              >
                {openFaqIndexes.length === CLINICAL_FAQS.length ? 'Collapse All' : 'Expand All'}
              </button>
            </div>

            <div className="rounded-2xl bg-white border border-lavender-200/80 divide-y divide-lavender-100 shadow-[0_14px_38px_-18px_rgba(76,29,149,0.12)] overflow-hidden">
              {CLINICAL_FAQS.map((item, idx) => {
                const isOpen = openFaqIndexes.includes(idx);
                return (
                  <div key={item.q} className="transition-colors hover:bg-lavender-50/35">
                    <button
                      type="button"
                      onClick={() => toggleFaq(idx)}
                      aria-expanded={isOpen}
                      className="w-full px-6 py-5 flex items-center justify-between gap-4 text-left"
                    >
                      <span className={`font-display font-bold text-sm sm:text-base transition-colors ${isOpen ? 'text-[#4C1D95]' : 'text-slate-950'}`}>
                        {item.q}
                      </span>
                      <span
                        className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
                          isOpen
                            ? 'bg-[#4C1D95] text-white rotate-180'
                            : 'bg-lavender-50 text-[#4C1D95]'
                        }`}
                      >
                        <ChevronDown className="w-4 h-4" />
                      </span>
                    </button>
                    <div className={`zoho-accordion-body ${isOpen ? 'is-open' : ''}`}>
                      <div className="zoho-accordion-inner">
                        <p className="px-6 pb-5 text-xs sm:text-sm text-slate-700 leading-relaxed">
                          {item.a}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </RevealBand>

        {/* 7. Royal Dark-Lavender Coordination Band */}
        <RevealBand
          id="emergency-care"
          className="scroll-mt-20 bg-gradient-to-r from-[#170C35] via-[#2D1B69] to-[#4C1D95] text-white py-12 sm:py-14"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-white/10 border border-purple-300/25 text-purple-200 flex items-center justify-center flex-shrink-0">
                <PhoneCall className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-purple-200">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Always-On Hospital Coordination</span>
                </div>
                <h2 className="font-display text-xl sm:text-2xl font-bold text-white">
                  Great Care Never Keeps You Waiting.
                </h2>
                <p className="text-sm text-purple-100/90 max-w-2xl">
                  Compare top specialists across every registered hospital, lock in your visit, and experience calmer, faster healthcare today.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={isAuthenticated ? onLaunchOS : onNavigateUserLogin}
              className="px-6 py-3 rounded-lg bg-white hover:bg-purple-50 text-[#1F1042] font-bold text-sm flex items-center gap-2 shadow-md transition-all duration-150 active:scale-[0.98] flex-shrink-0"
            >
              <span>{isAuthenticated ? 'Enter Workspace' : 'Start Now'}</span>
              <ArrowRight className="w-4 h-4 text-[#4C1D95]" />
            </button>
          </div>
        </RevealBand>
      </main>

      {/* Multi-Hospital Network Footer */}
      <footer className="bg-[#120829] text-purple-100/80 border-t border-purple-400/15 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-md bg-gradient-to-br from-[#2D1B69] to-[#6D28D9] flex items-center justify-center text-white border border-purple-300/20">
              <Activity className="w-4 h-4" />
            </div>
            <span className="font-display font-bold text-white">HospitalOS Network</span>
            <span className="text-purple-400/60">&bull;</span>
            <span className="text-purple-200/70">Multi-Hospital Clinical Operations</span>
          </div>
          <div className="flex flex-wrap items-center gap-5 text-purple-200/75 font-medium">
            <span>NABH Quality Standards</span>
            <span>NABL ISO 15189</span>
            <span>256-Bit Encrypted Facility Isolation</span>
          </div>
        </div>
      </footer>

      {/* Interactive Hospital Quick-Inspect Modal */}
      {selectedHospital && (
        <div
          onClick={() => setSelectedHospital(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#0F0722]/65 backdrop-blur-xs p-4 animate-in fade-in"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg rounded-2xl overflow-hidden bg-white border border-slate-200 shadow-2xl glide-enter"
          >
            <div className="bg-gradient-to-r from-[#170C35] via-[#2D1B69] to-[#4C1D95] p-6 text-white flex items-start justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#6D28D9] to-[#8B5CF6] flex items-center justify-center font-display font-bold text-base text-white shadow-sm border border-purple-300/30">
                  {getInitials(selectedHospital.name)}
                </div>
                <div>
                  <span className="text-[10px] uppercase tracking-widest font-semibold text-purple-200">
                    {selectedHospital.type} Network
                  </span>
                  <h3 className="font-display text-lg font-bold text-white leading-snug">
                    {selectedHospital.name}
                  </h3>
                  <p className="text-xs text-slate-200">{selectedHospital.tagline}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedHospital(null)}
                className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition"
                aria-label="Close hospital details"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200/90">
                  <span className="text-[10px] uppercase font-bold text-slate-600 block">License Number</span>
                  <span className="font-mono font-bold text-slate-950 mt-0.5 block">
                    {selectedHospital.licenseNumber}
                  </span>
                </div>
                <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200/80">
                  <span className="text-[10px] uppercase font-bold text-emerald-700 block">Accreditation</span>
                  <span className="font-bold text-emerald-800 mt-0.5 block">
                    {selectedHospital.nabhAccredited ? 'NABH Verified' : 'Verified Facility'}
                  </span>
                </div>
              </div>

              {selectedHospital.branches && selectedHospital.branches.length > 0 && (
                <div className="space-y-2">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-[#4C1D95]" />
                    <span>Hospital Locations ({selectedHospital.branches.length})</span>
                  </p>
                  <div className="space-y-1.5 max-h-40 overflow-y-auto">
                    {selectedHospital.branches.map((br) => (
                      <div
                        key={br.id}
                        className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/80 flex items-center justify-between text-xs"
                      >
                        <div className="flex items-center gap-2 text-slate-900 font-semibold">
                          <MapPin className="w-3.5 h-3.5 text-[#4C1D95] flex-shrink-0" />
                          <span>{br.name}</span>
                        </div>
                        <span className="text-[11px] text-slate-600 font-mono">{br.city}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="pt-2 flex items-center justify-end">
                <button
                  onClick={() => {
                    setSelectedHospital(null);
                    if (isAuthenticated) {
                      onLaunchOS();
                    } else {
                      onNavigateUserLogin();
                    }
                  }}
                  className="px-4 py-2 rounded-lg btn-zoho-primary text-white text-xs font-semibold flex items-center gap-1.5"
                >
                  <span>{isAuthenticated ? 'Open Workspace' : 'Book Consultation'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
