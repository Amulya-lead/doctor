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

  return (
    <div className="space-y-7 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="luxury-glass rounded-3xl p-6 sm:p-8 border border-white/[0.12] space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/15 border border-brand-500/30 text-brand-300 text-[10px] font-mono font-bold uppercase tracking-widest mb-2">
              <Radio className="w-3.5 h-3.5 text-brand-400 animate-pulse" />
              <span>Real-Time Event Cascading Engine</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              One Patient. One Connected Workflow.
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
              Watch a single patient registration automatically trigger reception, doctor consultation, lab analyzers, pharmacy dispensing, ICU bed telemetry, and instant TPA cashless settlement.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={resetSimulation}
              disabled={isSimulating}
              className="px-4 py-2.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-slate-300 text-xs font-bold border border-white/[0.1] flex items-center gap-2 transition disabled:opacity-40"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Flow</span>
            </button>

            <button
              onClick={startSimulation}
              disabled={isSimulating}
              className={`px-6 py-2.5 rounded-xl text-xs font-extrabold tracking-wide flex items-center gap-2.5 shadow-xl transition active:scale-95 ${
                isSimulating
                  ? 'bg-brand-500/30 text-brand-200 cursor-not-allowed animate-pulse border border-brand-500/40'
                  : 'bg-gradient-to-r from-brand-500 via-vital-cyan to-vital-emerald text-obsidian-950 hover:brightness-110 shadow-[0_10px_30px_-5px_rgba(6,182,212,0.4)]'
              }`}
            >
              <Play className={`w-4 h-4 fill-current ${isSimulating ? 'animate-spin' : ''}`} />
              <span>{isSimulating ? 'Cascading in Progress...' : 'Launch Live Cascade'}</span>
            </button>
          </div>
        </div>

        {/* Progress bar */}
        <div className="pt-2">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-2">
            <span>Patient: <strong className="text-white">Priya Sundaram (PT-2026-0895)</strong></span>
            <span className="text-brand-300 font-bold">
              Stage {Math.min(currentSimulationStep, 7)} of 7 Completed
            </span>
          </div>

          <div className="w-full bg-slate-950 h-3 rounded-full overflow-hidden p-0.5 border border-white/[0.1]">
            <div 
              className="bg-gradient-to-r from-brand-500 via-vital-cyan to-vital-emerald h-full rounded-full transition-all duration-700 ease-out"
              style={{ width: `${(Math.min(currentSimulationStep, 7) / 7) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* The 7 Connected Stages */}
      <div className="space-y-4">
        {simulationSteps.map(step => {
          const Icon = getStepIcon(step.step);
          const isCompleted = step.status === 'completed';
          const isInProgress = step.status === 'in-progress';

          return (
            <div
              key={step.step}
              className={`p-5 rounded-2xl border transition-all duration-300 ${
                isInProgress
                  ? 'bg-brand-500/15 border-brand-400 shadow-[0_0_30px_rgba(6,182,212,0.25)] scale-[1.01]'
                  : isCompleted
                  ? 'luxury-glass border-vital-emerald/40'
                  : 'bg-black/30 border-white/[0.06] opacity-60'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-base shadow-lg transition flex-shrink-0 ${
                    isCompleted
                      ? 'bg-vital-emerald text-obsidian-950'
                      : isInProgress
                      ? 'bg-brand-500 text-obsidian-950 animate-bounce'
                      : 'bg-white/[0.06] text-slate-400'
                  }`}>
                    {isCompleted ? <CheckCircle2 className="w-6 h-6" /> : <Icon className="w-6 h-6" />}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-brand-300">STAGE 0{step.step}</span>
                      <span className="text-slate-600">•</span>
                      <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">{step.department}</span>
                    </div>

                    <h3 className="font-extrabold text-base text-white mt-1">{step.title}</h3>
                    <p className="text-xs sm:text-sm text-slate-400 mt-1 leading-relaxed max-w-3xl">
                      {step.description}
                    </p>
                  </div>
                </div>

                <div className="sm:text-right font-mono text-xs flex sm:flex-col justify-between items-center sm:items-end flex-shrink-0">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                    isCompleted
                      ? 'bg-vital-emerald/20 text-vital-emerald border-vital-emerald/40'
                      : isInProgress
                      ? 'bg-brand-500/20 text-brand-300 border-brand-500/40 animate-pulse'
                      : 'bg-white/[0.04] text-slate-500 border-white/[0.08]'
                  }`}>
                    {step.status}
                  </span>

                  <span className="text-[10px] text-slate-500 mt-1.5">
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
