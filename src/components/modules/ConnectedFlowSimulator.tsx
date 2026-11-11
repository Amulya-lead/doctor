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
              <Radio className="w-3.5 h-3.5 text-hospital-200 animate-pulse" />
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
                  ? 'bg-hospital-400/20 text-hospital-100 cursor-not-allowed animate-pulse border border-hospital-300/40'
                  : 'bg-white text-hospital-950 hover:bg-hospital-50 shadow-black/20'
              }`}
            >
              <Play className={`w-4 h-4 fill-current ${isSimulating ? 'animate-spin' : 'text-[#39786B]'}`} />
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
            <span className="font-mono text-hospital-100 font-bold bg-white/15 px-2.5 py-0.5 rounded-full border border-white/20">
              Stage {Math.min(currentSimulationStep, 7)} of 7 Completed
            </span>
          </div>

          <div className="w-full bg-hospital-950/35 h-2.5 rounded-full overflow-hidden p-0.5 border border-white/20">
            <div 
              className="bg-gradient-to-r from-hospital-300 via-hospital-300 to-hospital-300 h-full rounded-full transition-all duration-700 ease-out"
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
                  ? 'border-[#39786B] bg-gradient-to-r from-hospital-50/90 via-white to-hospital-50/70 shadow-lg shadow-hospital-800/15 scale-[1.01]'
                  : isCompleted
                  ? 'border-hospital-200 bg-white'
                  : 'border-hospital-300/80 bg-white/85 opacity-80'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-base shadow-sm transition flex-shrink-0 ${
                    isCompleted
                      ? 'bg-gradient-to-br from-hospital-500 to-hospital-600 text-white'
                      : isInProgress
                      ? 'bg-gradient-to-br from-[#1D4840] to-[#39786B] text-white animate-pulse'
                      : 'bg-hospital-50 text-hospital-700 border border-hospital-300'
                  }`}>
                    {isCompleted ? <CheckCircle2 className="w-6 h-6" /> : <Icon className="w-6 h-6" />}
                  </div>

                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[11px] font-mono font-extrabold text-[#39786B] bg-hospital-50 px-2 py-0.5 rounded-md border border-hospital-200">
                        STAGE 0{idx + 1}
                      </span>
                      <span className="text-hospital-200">•</span>
                      <span className="text-xs font-extrabold text-hospital-800 uppercase tracking-wider">{step.department}</span>
                    </div>

                    <h3 className="font-extrabold font-display text-base text-hospital-950 mt-1.5">{step.title}</h3>
                    <p className="text-xs sm:text-sm text-hospital-800 mt-1 leading-relaxed max-w-3xl">
                      {step.description}
                    </p>
                  </div>
                </div>

                <div className="sm:text-right text-xs flex sm:flex-col justify-between items-center sm:items-end gap-2 flex-shrink-0">
                  <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider border ${
                      isCompleted
                        ? 'bg-hospital-50 text-hospital-700 border-hospital-200'
                        : isInProgress
                        ? 'bg-hospital-50 text-[#39786B] border-hospital-200 animate-pulse'
                        : 'bg-hospital-50 text-hospital-800 border-hospital-300'
                    }`}>
                      {step.status}
                    </span>
                    <button
                      onClick={() => setActiveModule(targetModule)}
                      className="px-2.5 py-1 rounded-lg bg-hospital-50 hover:bg-hospital-50 text-hospital-900 hover:text-[#39786B] border border-hospital-300 hover:border-hospital-200 text-[11px] font-bold inline-flex items-center gap-1 transition"
                    >
                      <span>Open</span>
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>

                  <span className="text-[11px] font-mono font-medium text-hospital-700">
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
