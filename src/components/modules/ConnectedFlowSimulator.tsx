import React from 'react';
import { 
  Radio, 
  Play, 
  RotateCcw, 
  CheckCircle2, 
  Clock, 
  Users, 
  Stethoscope, 
  FlaskConical, 
  Pill, 
  BedDouble, 
  CreditCard, 
  Bell, 
  ArrowRight,
  Sparkles,
  Zap,
  Activity,
  ChevronRight
} from 'lucide-react';
import { useHospitalOS } from '../../context/HospitalOSContext';

export const ConnectedFlowSimulator: React.FC = () => {
  const { 
    simulationSteps, 
    isSimulating, 
    currentSimulationStep, 
    startSimulation, 
    resetSimulation,
    setActiveModule
  } = useHospitalOS();

  const getStepIcon = (step: number) => {
    switch (step) {
      case 1: return Users;
      case 2: return Stethoscope;
      case 3: return FlaskConical;
      case 4: return Pill;
      case 5: return BedDouble;
      case 6: return CreditCard;
      case 7: return Bell;
      default: return CheckCircle2;
    }
  };

  const getStepModule = (step: number) => {
    switch (step) {
      case 1: return 'patients';
      case 2: return 'doctors';
      case 3: return 'lims';
      case 4: return 'pharmacy';
      case 5: return 'operations';
      case 6: return 'billing';
      case 7: return 'insurance';
      default: return 'patients';
    }
  };

  return (
    <div className="space-y-6 glide-enter">
      {/* Header Banner */}
      <div className="workspace-banner rounded-2xl p-6 sm:p-8 text-white shadow-xl space-y-5">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-5">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-sm border border-white/25 text-white text-[11px] font-bold uppercase tracking-widest mb-2.5">
              <Radio className="w-3.5 h-3.5 text-lavender-200 animate-pulse" />
              <span>Real-Time Event Cascading Engine</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold font-display tracking-tight text-white">
              One Patient. One Connected Workflow.
            </h2>
            <p className="text-xs sm:text-sm text-white/90 mt-1.5 max-w-2xl leading-relaxed">
              Watch a single patient registration automatically trigger reception, doctor consultation, lab analyzers, pharmacy dispensing, ICU bed telemetry, and instant TPA cashless settlement.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 flex-shrink-0">
            <button
              onClick={resetSimulation}
              disabled={isSimulating}
              className="px-4 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 text-white text-xs font-bold border border-white/25 backdrop-blur-sm flex items-center gap-2 transition disabled:opacity-40"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Flow</span>
            </button>

            <button
              onClick={startSimulation}
              disabled={isSimulating}
              className={`px-5 py-2.5 rounded-xl text-xs font-extrabold tracking-wide flex items-center gap-2 shadow-lg transition active:scale-[0.98] ${
                isSimulating
                  ? 'bg-amber-400/20 text-amber-100 cursor-not-allowed animate-pulse border border-amber-300/40'
                  : 'bg-white text-slate-900 hover:bg-lavender-50 shadow-black/20'
              }`}
            >
              <Play className={`w-4 h-4 fill-current ${isSimulating ? 'animate-spin' : 'text-[#5B21B6]'}`} />
              <span>{isSimulating ? 'Cascading in Progress...' : 'Launch Live Cascade'}</span>
            </button>
          </div>
        </div>

        {/* Progress bar */}
        <div className="relative z-10 pt-3 border-t border-white/15">
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-semibold text-white/90 mb-2">
            <span>
              Patient: <strong className="text-white font-display">Priya Sundaram (PT-2026-0895)</strong>
            </span>
            <span className="font-mono text-lavender-100 font-bold bg-white/15 px-2.5 py-0.5 rounded-full border border-white/20">
              Stage {Math.min(currentSimulationStep, 7)} of 7 Completed
            </span>
          </div>

          <div className="w-full bg-slate-950/35 h-2.5 rounded-full overflow-hidden p-0.5 border border-white/20">
            <div 
              className="bg-gradient-to-r from-sky-300 via-cyan-300 to-emerald-300 h-full rounded-full transition-all duration-700 ease-out"
              style={{ width: `${(Math.min(currentSimulationStep, 7) / 7) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* The 7 Connected Stages */}
      <div className="space-y-3.5">
        {simulationSteps.map((step, idx) => {
          const Icon = getStepIcon(step.step);
          const isCompleted = step.status === 'completed';
          const isInProgress = step.status === 'in-progress';
          const targetModule = getStepModule(step.step);

          return (
            <div
              key={step.step}
              className={`lavish-card stagger-item p-5 rounded-2xl border transition-all duration-300 ${
                isInProgress
                  ? 'border-[#5B21B6] bg-gradient-to-r from-lavender-50/90 via-white to-purple-50/70 shadow-lg shadow-lavender-700/15 scale-[1.01]'
                  : isCompleted
                  ? 'border-emerald-200 bg-white'
                  : 'border-slate-200/80 bg-white/85 opacity-80'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-base shadow-sm transition flex-shrink-0 ${
                    isCompleted
                      ? 'bg-gradient-to-br from-emerald-500 to-teal-600 text-white'
                      : isInProgress
                      ? 'bg-gradient-to-br from-[#2D1B69] to-[#6D28D9] text-white animate-pulse'
                      : 'bg-slate-100 text-slate-500 border border-slate-200'
                  }`}>
                    {isCompleted ? <CheckCircle2 className="w-6 h-6" /> : <Icon className="w-6 h-6" />}
                  </div>

                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[11px] font-mono font-extrabold text-[#4C1D95] bg-lavender-50 px-2 py-0.5 rounded-md border border-lavender-200">
                        STAGE 0{idx + 1}
                      </span>
                      <span className="text-slate-300">•</span>
                      <span className="text-xs font-extrabold text-slate-600 uppercase tracking-wider">{step.department}</span>
                    </div>

                    <h3 className="font-extrabold font-display text-base text-slate-900 mt-1.5">{step.title}</h3>
                    <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed max-w-3xl">
                      {step.description}
                    </p>
                  </div>
                </div>

                <div className="sm:text-right text-xs flex sm:flex-col justify-between items-center sm:items-end gap-2 flex-shrink-0">
                  <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider border ${
                      isCompleted
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : isInProgress
                        ? 'bg-lavender-50 text-[#4C1D95] border-lavender-200 animate-pulse'
                        : 'bg-slate-100 text-slate-600 border-slate-200'
                    }`}>
                      {step.status}
                    </span>
                    <button
                      onClick={() => setActiveModule(targetModule)}
                      className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-lavender-50 text-slate-700 hover:text-[#4C1D95] border border-slate-200 hover:border-lavender-200 text-[11px] font-bold inline-flex items-center gap-1 transition"
                    >
                      <span>Open</span>
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>

                  <span className="text-[11px] font-mono font-medium text-slate-500">
                    {step.timestamp !== '--:--:--' ? `Synced at ${step.timestamp}` : 'Awaiting Trigger'}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
