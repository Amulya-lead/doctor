import React, { useState } from 'react';
import { 
  Users, 
  Stethoscope, 
  BedDouble, 
  CreditCard, 
  Activity, 
  AlertCircle, 
  TrendingUp, 
  Clock, 
  CheckCircle2, 
  ArrowUpRight, 
  Sparkles, 
  Radio, 
  ShieldCheck, 
  Building,
  HeartPulse,
  Flame,
  Zap,
  Filter,
  Layers,
  ChevronRight
} from 'lucide-react';
import { useHospitalOS } from '../../context/HospitalOSContext';

export const OverviewDashboard: React.FC = () => {
  const { 
    currentTenant, 
    metrics, 
    events, 
    doctors, 
    beds, 
    setActiveModule, 
    startSimulation, 
    isSimulating 
  } = useHospitalOS();

  const [selectedModuleFilter, setSelectedModuleFilter] = useState<string>('ALL');

  const filteredEvents = selectedModuleFilter === 'ALL' 
    ? events 
    : events.filter(e => e.module === selectedModuleFilter);

  return (
    <div className="space-y-7 animate-in fade-in duration-300">
      {/* 1. TOP EXECUTIVE TELEMETRY BANNER */}
      <div className="relative overflow-hidden rounded-3xl luxury-glass border border-white/[0.12] p-6 sm:p-8 shadow-2xl">
        <div className="absolute top-0 right-0 w-[500px] h-[300px] bg-brand-500/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[250px] bg-vital-violet/10 rounded-full blur-[90px] pointer-events-none" />

        <div className="relative flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="px-3 py-1 rounded-full text-[10px] font-extrabold tracking-widest uppercase bg-brand-500/15 text-brand-300 border border-brand-500/30 flex items-center gap-1.5 font-mono shadow-sm">
                <span className="w-2 h-2 rounded-full bg-brand-400 animate-ping" />
                SOVEREIGN OS v2.8 ACTIVE
              </span>
              <span className="px-3 py-1 rounded-full text-[10px] font-extrabold tracking-widest uppercase bg-vital-emerald/15 text-vital-emerald border border-vital-emerald/30 flex items-center gap-1.5 font-mono shadow-sm">
                <CheckCircle2 className="w-3.5 h-3.5" />
                NABH MULTI-TENANT SYNC
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight flex items-center gap-3">
              <span>{currentTenant.name}</span>
              <span className="text-3xl filter drop-shadow-md">{currentTenant.logo}</span>
            </h1>

            <p className="text-xs sm:text-sm text-slate-400 flex flex-wrap items-center gap-2">
              <span className="text-slate-300">{currentTenant.tagline}</span>
              <span>•</span>
              <span className="font-mono text-brand-300">License: {currentTenant.licenseNumber}</span>
            </p>
          </div>

          {/* Real-Time Connected Flow Simulator Action */}
          <div className="flex items-center gap-3">
            <button
              onClick={startSimulation}
              disabled={isSimulating}
              className={`px-5 py-3 rounded-2xl text-xs font-extrabold tracking-wide flex items-center gap-2.5 shadow-xl transition active:scale-95 ${
                isSimulating 
                  ? 'bg-brand-500/30 text-brand-200 cursor-not-allowed animate-pulse border border-brand-500/40'
                  : 'bg-gradient-to-r from-brand-500 via-vital-cyan to-vital-emerald text-obsidian-950 hover:brightness-110 shadow-[0_10px_30px_-5px_rgba(6,182,212,0.4)]'
              }`}
            >
              <Radio className={`w-4 h-4 ${isSimulating ? 'animate-spin' : ''}`} />
              <span>{isSimulating ? 'Cascading Flow...' : 'Simulate Connected Flow'}</span>
            </button>
          </div>
        </div>

        {/* Live ECG Heartbeat Wave SVG Line */}
        <div className="mt-6 pt-5 border-t border-white/[0.08] flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <HeartPulse className="w-5 h-5 text-rose-500 animate-pulse" />
            <div className="font-mono text-xs">
              <span className="font-extrabold text-white">Live Patient Vitals Telemetry:</span>{' '}
              <span className="text-vital-emerald">Synchronized (0 Packet Loss)</span>
            </div>
          </div>

          <div className="flex items-center gap-4 font-mono text-[11px] text-slate-400">
            <span>NABH Standards Verified</span>
            <span>•</span>
            <span className="text-vital-emerald flex items-center gap-1 font-semibold">
              <ShieldCheck className="w-4 h-4" /> 256-Bit TLS 1.3
            </span>
          </div>
        </div>
      </div>

      {/* 2. SIZZLING METRIC CARDS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Metric 1 */}
        <div 
          onClick={() => setActiveModule('patients')}
          className="luxury-glass luxury-glass-interactive rounded-2xl p-5 space-y-3 cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Patients Today</span>
            <div className="p-2.5 rounded-xl bg-brand-500/10 text-brand-400 group-hover:scale-110 transition border border-brand-500/20">
              <Users className="w-4 h-4" />
            </div>
          </div>

          <div className="flex items-baseline justify-between">
            <p className="text-3xl font-extrabold text-white font-mono tracking-tight">
              {metrics.totalPatientsToday}
            </p>
            <span className="text-xs font-bold text-vital-emerald flex items-center gap-0.5 font-mono">
              <TrendingUp className="w-3.5 h-3.5" /> +14.2%
            </span>
          </div>

          <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between text-[11px] text-slate-400 font-mono">
            <span>OPD: <strong className="text-slate-200">{metrics.opdCount}</strong></span>
            <span>IPD: <strong className="text-vital-cyan">{metrics.ipdAdmissions}</strong></span>
          </div>
        </div>

        {/* Metric 2 */}
        <div 
          onClick={() => setActiveModule('operations')}
          className="luxury-glass luxury-glass-interactive rounded-2xl p-5 space-y-3 cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Bed Occupancy Rate</span>
            <div className="p-2.5 rounded-xl bg-vital-emerald/10 text-vital-emerald group-hover:scale-110 transition border border-vital-emerald/20">
              <BedDouble className="w-4 h-4" />
            </div>
          </div>

          <div className="flex items-baseline justify-between">
            <p className="text-3xl font-extrabold text-white font-mono tracking-tight">
              {metrics.bedOccupancyRate}%
            </p>
            <span className="text-xs font-mono text-vital-emerald font-semibold">
              {metrics.availableBeds} Beds Vacant
            </span>
          </div>

          <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden p-0.5 border border-white/[0.08]">
            <div 
              className="bg-gradient-to-r from-vital-emerald to-vital-teal h-full rounded-full transition-all duration-700"
              style={{ width: `${metrics.bedOccupancyRate}%` }}
            />
          </div>

          <div className="text-[11px] text-slate-400 flex justify-between font-mono">
            <span>ICU: 2 Free</span>
            <span>Deluxe: 1 Free</span>
          </div>
        </div>

        {/* Metric 3 */}
        <div 
          onClick={() => setActiveModule('billing')}
          className="luxury-glass luxury-glass-interactive rounded-2xl p-5 space-y-3 cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Realized Revenue</span>
            <div className="p-2.5 rounded-xl bg-vital-amber/10 text-vital-amber group-hover:scale-110 transition border border-vital-amber/20">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>

          <div className="flex items-baseline justify-between">
            <p className="text-3xl font-extrabold text-white font-mono tracking-tight">
              ₹{metrics.totalRevenueToday.toLocaleString('en-IN')}
            </p>
            <span className="text-xs font-bold text-vital-emerald flex items-center gap-0.5 font-mono">
              <TrendingUp className="w-3.5 h-3.5" /> +8.9%
            </span>
          </div>

          <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between text-[11px] text-slate-400 font-mono">
            <span>Pending TPA: ₹{metrics.pendingClaimsAmount.toLocaleString('en-IN')}</span>
            <span className="text-brand-300">Cashless 82%</span>
          </div>
        </div>

        {/* Metric 4 */}
        <div 
          onClick={() => setActiveModule('lims')}
          className="luxury-glass luxury-glass-interactive rounded-2xl p-5 space-y-3 cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Critical Lab Alerts</span>
            <div className="p-2.5 rounded-xl bg-rose-500/10 text-rose-400 group-hover:scale-110 transition border border-rose-500/20">
              <AlertCircle className="w-4 h-4 animate-bounce" />
            </div>
          </div>

          <div className="flex items-baseline justify-between">
            <p className="text-3xl font-extrabold text-rose-400 font-mono tracking-tight">
              {metrics.criticalLabAlerts}
            </p>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40">
              STAT Attention
            </span>
          </div>

          <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between text-[11px] text-slate-400 font-mono">
            <span>CBC Elevated WBC</span>
            <span className="text-brand-400 group-hover:underline">Review &rarr;</span>
          </div>
        </div>
      </div>

      {/* 3. SPLIT WORKSPACE: SYNCHRONIZED EVENT BUS & ACTIVE DOCTORS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-7">
        {/* Left 8 Cols: Real-Time Cross-Department Synchronized Event Stream */}
        <div className="lg:col-span-8 luxury-glass rounded-3xl p-6 sm:p-7 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-brand-500/15 text-brand-400 border border-brand-500/30">
                <Activity className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <h2 className="text-base font-extrabold text-white tracking-wide">
                  Real-Time Cross-Department Event Bus
                </h2>
                <p className="text-xs text-slate-400">
                  Sub-millisecond durable event stream connecting all clinical & administrative units
                </p>
              </div>
            </div>

            {/* Module Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
              {['ALL', 'DOCTOR', 'LIMS', 'PHARMACY', 'BEDS', 'BILLING'].map(m => (
                <button
                  key={m}
                  onClick={() => setSelectedModuleFilter(m)}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold transition ${
                    selectedModuleFilter === m
                      ? 'bg-brand-500 text-obsidian-950 font-extrabold shadow-sm'
                      : 'bg-white/[0.04] text-slate-400 hover:text-white'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          {/* Timeline Feed */}
          <div className="space-y-3 max-h-[460px] overflow-y-auto pr-2">
            {filteredEvents.map(evt => {
              const isCritical = evt.severity === 'critical';
              const isWarning = evt.severity === 'warning';
              const isSuccess = evt.severity === 'success';

              return (
                <div
                  key={evt.id}
                  className={`p-4 rounded-2xl border transition-all duration-200 ${
                    isCritical
                      ? 'bg-rose-950/20 border-rose-500/40 hover:border-rose-400'
                      : isWarning
                      ? 'bg-amber-950/20 border-amber-500/40 hover:border-amber-400'
                      : isSuccess
                      ? 'bg-emerald-950/20 border-emerald-500/40 hover:border-emerald-400'
                      : 'bg-black/30 border-white/[0.08] hover:border-white/20'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <span className={`w-2 h-2 rounded-full flex-shrink-0 ${
                        isCritical ? 'bg-rose-500 animate-ping' :
                        isWarning ? 'bg-amber-400' :
                        isSuccess ? 'bg-vital-emerald' : 'bg-brand-400'
                      }`} />
                      <span className="font-extrabold text-xs sm:text-sm text-white">{evt.title}</span>
                    </div>

                    <span className="text-[10px] font-mono text-brand-300 bg-black/50 px-2 py-0.5 rounded-md border border-white/[0.08] flex-shrink-0">
                      {evt.timestamp}
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                    {evt.description}
                  </p>

                  <div className="mt-3 pt-2.5 border-t border-white/[0.06] flex items-center justify-between text-[10px] font-mono text-slate-400">
                    <span>Source: <strong className="text-slate-200 font-semibold">{evt.actor}</strong></span>
                    <span className="px-2 py-0.5 rounded bg-black/40 text-brand-300 border border-white/[0.06]">
                      #{evt.module}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right 4 Cols: Active Doctor Chambers & Critical Beds */}
        <div className="lg:col-span-4 space-y-6">
          {/* Active Chambers */}
          <div className="luxury-glass rounded-3xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
              <div className="flex items-center gap-2">
                <Stethoscope className="w-4 h-4 text-brand-400" />
                <h3 className="text-xs font-extrabold text-white uppercase tracking-wider">
                  OPD Doctor Chambers
                </h3>
              </div>
              <span className="text-[10px] text-brand-300 font-mono">
                Real-Time Status
              </span>
            </div>

            <div className="space-y-2.5">
              {doctors.slice(0, 4).map(doc => (
                <div 
                  key={doc.id}
                  className="p-3 rounded-2xl bg-black/30 border border-white/[0.06] text-xs hover:border-white/20 transition space-y-2"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2.5">
                      <span className="text-2xl">{doc.avatar}</span>
                      <div className="min-w-0">
                        <p className="font-extrabold text-white truncate">{doc.name}</p>
                        <p className="text-[10px] text-slate-400 truncate">{doc.specialization}</p>
                      </div>
                    </div>

                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold font-mono ${
                      doc.status === 'In Consultation' ? 'bg-brand-500/20 text-brand-300 border border-brand-500/30' :
                      doc.status === 'In Surgery' ? 'bg-vital-violet/20 text-vital-violet border border-vital-violet/30' :
                      doc.status === 'Available' ? 'bg-vital-emerald/20 text-vital-emerald border border-vital-emerald/30' :
                      'bg-slate-800 text-slate-400'
                    }`}>
                      {doc.status}
                    </span>
                  </div>

                  <div className="pt-2 border-t border-white/[0.04] flex items-center justify-between text-[10px] text-slate-400 font-mono">
                    <span>{doc.currentRoom}</span>
                    <span>{doc.todayAppointmentsCount} Patients</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Bed Status */}
          <div className="luxury-glass rounded-3xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
              <div className="flex items-center gap-2">
                <BedDouble className="w-4 h-4 text-vital-emerald" />
                <h3 className="text-xs font-extrabold text-white uppercase tracking-wider">
                  Critical Care Beds
                </h3>
              </div>
              <span className="text-[10px] text-vital-emerald font-mono">
                Live Telemetry
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              {beds.slice(0, 4).map(b => (
                <div 
                  key={b.id}
                  className={`p-2.5 rounded-2xl border text-xs ${
                    b.status === 'Occupied' 
                      ? 'bg-rose-950/20 border-rose-500/30 text-rose-200' 
                      : b.status === 'Available'
                      ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-200'
                      : 'bg-slate-900 border-white/[0.06] text-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between font-bold">
                    <span>{b.bedNumber}</span>
                    <span className="text-[9px] uppercase px-1.5 py-0.5 rounded-full bg-black/40 font-mono">
                      {b.status}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1 truncate">
                    {b.status === 'Occupied' ? b.patientName : 'Sanitized & Vacant'}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
