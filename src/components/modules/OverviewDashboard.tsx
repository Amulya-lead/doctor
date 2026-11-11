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

  const getInitials = (name: string) =>
    name
      .replace(/^Dr\.\s*/i, '')
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map(part => part[0]?.toUpperCase() || '')
      .join('');

  return (
    <div className="space-y-6 glide-enter">
      {/* 1. TOP EXECUTIVE TELEMETRY BANNER */}
      <div className="workspace-banner rounded-2xl p-6 sm:p-8 text-white shadow-xl">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full text-[11px] font-bold tracking-wider uppercase bg-white/15 backdrop-blur-sm border border-white/25 text-white flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-300 animate-ping" />
                HospitalOS Command Active
              </span>
              <span className="px-3 py-1 rounded-full text-[11px] font-bold tracking-wider uppercase bg-emerald-400/20 text-emerald-100 border border-emerald-300/30 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                NABH Multi-Tenant Sync
              </span>
            </div>

            <div className="flex items-center gap-3 pt-0.5">
              <div className="w-11 h-11 rounded-2xl bg-white/15 backdrop-blur-sm border border-white/25 flex items-center justify-center font-display font-extrabold text-base text-white shadow-sm flex-shrink-0">
                {getInitials(currentTenant.name)}
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-white tracking-tight">
                {currentTenant.name}
              </h1>
            </div>

            <p className="text-xs sm:text-sm text-white/90 flex flex-wrap items-center gap-2">
              <span>{currentTenant.tagline}</span>
              <span className="text-white/50">•</span>
              <span className="font-mono text-lavender-100 font-semibold">License: {currentTenant.licenseNumber}</span>
            </p>
          </div>

          {/* Real-Time Connected Flow Simulator Action */}
          <div className="flex flex-wrap items-center gap-2.5 flex-shrink-0">
            <button
              onClick={startSimulation}
              disabled={isSimulating}
              className={`px-5 py-2.5 rounded-xl text-xs font-extrabold tracking-wide flex items-center gap-2 shadow-lg transition active:scale-[0.98] ${
                isSimulating 
                  ? 'bg-amber-400/20 text-amber-100 cursor-not-allowed animate-pulse border border-amber-300/40'
                  : 'bg-white text-slate-900 hover:bg-lavender-50 shadow-black/20'
              }`}
            >
              <Radio className={`w-4 h-4 text-[#5B21B6] ${isSimulating ? 'animate-spin' : ''}`} />
              <span>{isSimulating ? 'Cascading Flow...' : 'Simulate Connected Flow'}</span>
            </button>
          </div>
        </div>

        {/* Live Telemetry Bar */}
        <div className="relative z-10 mt-6 pt-4 border-t border-white/15 flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <HeartPulse className="w-4 h-4 text-rose-300 animate-pulse" />
            <div className="font-mono text-xs">
              <span className="font-bold text-white">Live Patient Vitals Telemetry:</span>{' '}
              <span className="text-emerald-200 font-semibold">Synchronized (0 Packet Loss)</span>
            </div>
          </div>

          <div className="flex items-center gap-3 font-mono text-[11px] text-white/85">
            <span>NABH Standards Verified</span>
            <span className="text-white/40">•</span>
            <span className="text-emerald-200 flex items-center gap-1 font-semibold">
              <ShieldCheck className="w-4 h-4" /> 256-Bit TLS 1.3
            </span>
          </div>
        </div>
      </div>

      {/* 2. EXECUTIVE KPI CARDS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div 
          onClick={() => setActiveModule('patients')}
          className="lavish-card lavish-card-hover stagger-item rounded-2xl p-5 space-y-3 cursor-pointer group border-t-4 border-t-sky-500"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">Total Patients Today</span>
            <div className="p-2 rounded-xl bg-lavender-50 text-[#5B21B6] group-hover:scale-110 transition border border-lavender-200">
              <Users className="w-4 h-4" />
            </div>
          </div>

          <div className="flex items-baseline justify-between">
            <p className="text-3xl font-extrabold font-display text-slate-900 tracking-tight">
              {metrics.totalPatientsToday}
            </p>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 flex items-center gap-0.5 font-mono">
              <TrendingUp className="w-3 h-3" /> +14.2%
            </span>
          </div>

          <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600 font-mono">
            <span>OPD: <strong className="text-slate-900">{metrics.opdCount}</strong></span>
            <span>IPD: <strong className="text-[#4C1D95]">{metrics.ipdAdmissions}</strong></span>
          </div>
        </div>

        {/* Metric 2 */}
        <div 
          onClick={() => setActiveModule('operations')}
          className="lavish-card lavish-card-hover stagger-item rounded-2xl p-5 space-y-3 cursor-pointer group border-t-4 border-t-emerald-500"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">Bed Occupancy Rate</span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600 group-hover:scale-110 transition border border-emerald-200">
              <BedDouble className="w-4 h-4" />
            </div>
          </div>

          <div className="flex items-baseline justify-between">
            <p className="text-3xl font-extrabold font-display text-slate-900 tracking-tight">
              {metrics.bedOccupancyRate}%
            </p>
            <span className="text-xs font-mono text-emerald-700 font-bold">
              {metrics.availableBeds} Vacant
            </span>
          </div>

          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden border border-slate-200/80">
            <div 
              className="bg-gradient-to-r from-emerald-500 to-teal-500 h-full rounded-full transition-all duration-700"
              style={{ width: `${metrics.bedOccupancyRate}%` }}
            />
          </div>

          <div className="text-[11px] text-slate-600 flex justify-between font-mono font-semibold">
            <span>ICU Telemetry Active</span>
            <span className="text-emerald-700">Live Sync</span>
          </div>
        </div>

        {/* Metric 3 */}
        <div 
          onClick={() => setActiveModule('billing')}
          className="lavish-card lavish-card-hover stagger-item rounded-2xl p-5 space-y-3 cursor-pointer group border-t-4 border-t-amber-500"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">Realized Revenue</span>
            <div className="p-2 rounded-xl bg-amber-50 text-amber-600 group-hover:scale-110 transition border border-amber-200">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>

          <div className="flex items-baseline justify-between">
            <p className="text-3xl font-extrabold font-display text-slate-900 tracking-tight">
              ₹{metrics.totalRevenueToday.toLocaleString('en-IN')}
            </p>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 flex items-center gap-0.5 font-mono">
              <TrendingUp className="w-3 h-3" /> +8.9%
            </span>
          </div>

          <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-600 font-mono">
            <span>Pending TPA: ₹{metrics.pendingClaimsAmount.toLocaleString('en-IN')}</span>
            <span className="text-indigo-700 font-bold">Cashless 82%</span>
          </div>
        </div>

        {/* Metric 4 */}
        <div 
          onClick={() => setActiveModule('lims')}
          className="lavish-card lavish-card-hover stagger-item rounded-2xl p-5 space-y-3 cursor-pointer group border-t-4 border-t-rose-500"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">Critical Lab Alerts</span>
            <div className="p-2 rounded-xl bg-rose-50 text-rose-600 group-hover:scale-110 transition border border-rose-200">
              <AlertCircle className="w-4 h-4" />
            </div>
          </div>

          <div className="flex items-baseline justify-between">
            <p className="text-3xl font-extrabold font-display text-rose-600 tracking-tight">
              {metrics.criticalLabAlerts}
            </p>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-rose-50 text-rose-700 border border-rose-200">
              STAT Attention
            </span>
          </div>

          <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600 font-semibold">
            <span>LIMS Panic Values</span>
            <span className="text-[#4C1D95] group-hover:translate-x-0.5 transition inline-flex items-center gap-0.5">
              Review <ChevronRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>
      </div>

      {/* 3. SPLIT WORKSPACE: SYNCHRONIZED EVENT BUS & ACTIVE DOCTORS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 8 Cols: Real-Time Cross-Department Synchronized Event Stream */}
        <div className="lg:col-span-8 lavish-card rounded-2xl p-5 sm:p-6 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-lavender-50 text-[#5B21B6] border border-lavender-200">
                <Activity className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-extrabold font-display text-slate-900">
                  Real-Time Cross-Department Event Bus
                </h2>
                <p className="text-xs text-slate-600">
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
                  className={`px-3 py-1.5 rounded-lg text-[11px] font-mono font-bold transition ${
                    selectedModuleFilter === m
                      ? 'btn-zoho-primary text-white shadow-sm'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200/80 border border-slate-200/80'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          {/* Timeline Feed */}
          <div className="space-y-3 max-h-[460px] overflow-y-auto pr-1">
            {filteredEvents.map(evt => {
              const isCritical = evt.severity === 'critical';
              const isWarning = evt.severity === 'warning';
              const isSuccess = evt.severity === 'success';

              return (
                <div
                  key={evt.id}
                  className={`p-4 rounded-xl border transition-all duration-200 ${
                    isCritical
                      ? 'bg-rose-50/70 border-rose-200 hover:border-rose-300'
                      : isWarning
                      ? 'bg-amber-50/70 border-amber-200 hover:border-amber-300'
                      : isSuccess
                      ? 'bg-emerald-50/70 border-emerald-200 hover:border-emerald-300'
                      : 'bg-slate-50/80 border-slate-200 hover:border-lavender-300'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <span className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${
                        isCritical ? 'bg-rose-500 animate-ping' :
                        isWarning ? 'bg-amber-500' :
                        isSuccess ? 'bg-emerald-500' : 'bg-[#6D28D9]'
                      }`} />
                      <span className="font-extrabold font-display text-xs sm:text-sm text-slate-900">{evt.title}</span>
                    </div>

                    <span className="text-[11px] font-mono font-semibold text-slate-600 bg-white px-2.5 py-0.5 rounded-md border border-slate-200 flex-shrink-0">
                      {evt.timestamp}
                    </span>
                  </div>

                  <p className="text-xs text-slate-700 mt-2 leading-relaxed">
                    {evt.description}
                  </p>

                  <div className="mt-3 pt-2.5 border-t border-slate-200/70 flex items-center justify-between text-[11px] font-mono text-slate-600">
                    <span>Source: <strong className="text-slate-900 font-bold">{evt.actor}</strong></span>
                    <span className="px-2 py-0.5 rounded bg-white text-[#4C1D95] font-bold border border-slate-200">
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
          <div className="lavish-card rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Stethoscope className="w-4 h-4 text-[#5B21B6]" />
                <h3 className="text-xs font-extrabold font-display text-slate-900 uppercase tracking-wider">
                  OPD Doctor Chambers
                </h3>
              </div>
              <span className="text-[11px] text-[#4C1D95] font-mono font-bold">
                Real-Time
              </span>
            </div>

            <div className="space-y-2.5">
              {doctors.slice(0, 4).map(doc => (
                <div 
                  key={doc.id}
                  onClick={() => setActiveModule('doctors')}
                  className="p-3 rounded-xl bg-slate-50/80 border border-slate-200/80 text-xs hover:border-lavender-300 hover:bg-white cursor-pointer transition space-y-2"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#2D1B69] to-[#6D28D9] text-white font-display font-extrabold text-xs flex items-center justify-center flex-shrink-0">
                        {getInitials(doc.name)}
                      </div>
                      <div className="min-w-0">
                        <p className="font-extrabold text-slate-900 truncate">{doc.name}</p>
                        <p className="text-[11px] text-slate-600 truncate">{doc.specialization}</p>
                      </div>
                    </div>

                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold font-mono flex-shrink-0 border ${
                      doc.status === 'In Consultation' ? 'bg-lavender-50 text-[#4C1D95] border-lavender-200' :
                      doc.status === 'In Surgery' ? 'bg-violet-50 text-violet-700 border-violet-200' :
                      doc.status === 'Available' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                      'bg-slate-100 text-slate-600 border-slate-200'
                    }`}>
                      {doc.status}
                    </span>
                  </div>

                  <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-slate-600 font-mono">
                    <span>{doc.currentRoom}</span>
                    <span className="font-semibold text-slate-800">{doc.todayAppointmentsCount} Patients</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Bed Status */}
          <div className="lavish-card rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <BedDouble className="w-4 h-4 text-emerald-600" />
                <h3 className="text-xs font-extrabold font-display text-slate-900 uppercase tracking-wider">
                  Critical Care Beds
                </h3>
              </div>
              <span className="text-[11px] text-emerald-700 font-mono font-bold">
                Live Telemetry
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              {beds.slice(0, 4).map(b => (
                <div 
                  key={b.id}
                  onClick={() => setActiveModule('operations')}
                  className={`p-3 rounded-xl border text-xs cursor-pointer transition hover:shadow-sm ${
                    b.status === 'Occupied' 
                      ? 'bg-rose-50/70 border-rose-200 text-rose-900' 
                      : b.status === 'Available'
                      ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900'
                      : 'bg-slate-50 border-slate-200 text-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between font-bold">
                    <span className="font-display">{b.bedNumber}</span>
                    <span className="text-[9px] uppercase px-1.5 py-0.5 rounded-full bg-white/80 border border-current/20 font-mono">
                      {b.status}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 mt-1.5 truncate font-medium">
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
