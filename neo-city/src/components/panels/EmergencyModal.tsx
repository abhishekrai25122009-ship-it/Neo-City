import React from 'react';
import { useCityStore } from '../../store/useCityStore';
import {
  AlertOctagon,
  Clock,
  ShieldAlert,
  Coins,
  Package,
  CheckCircle,
  X,
} from 'lucide-react';

export const EmergencyModal: React.FC = () => {
  const activeEmergency = useCityStore((state) => state.stats.activeEmergency);
  const resolveEmergency = useCityStore((state) => state.resolveEmergency);
  const dismissEmergency = useCityStore((state) => state.dismissEmergency);
  const treasury = useCityStore((state) => state.stats.treasury);

  if (!activeEmergency) return null;

  const emg = activeEmergency;
  const severityColors = {
    moderate: 'text-amber-400 border-amber-500/40 bg-amber-500/10',
    severe: 'text-orange-400 border-orange-500/40 bg-orange-500/10',
    catastrophic: 'text-rose-400 border-rose-500/50 bg-rose-500/20 animate-pulse',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md pointer-events-auto">
      <div className="relative w-full max-w-2xl bg-gradient-to-b from-slate-900 via-slate-900/95 to-slate-950 border-2 border-rose-500/50 rounded-2xl shadow-[0_0_60px_rgba(244,63,94,0.35)] overflow-hidden">
        {/* TOP STATUS BAR */}
        <div className="flex items-center justify-between px-6 py-4 bg-rose-950/40 border-b border-rose-500/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-500/20 border border-rose-500/50 flex items-center justify-center">
              <AlertOctagon className="w-6 h-6 text-rose-400 animate-bounce" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono tracking-widest text-rose-300 font-bold uppercase">
                  METROPOLITAN CRISIS DISPATCH
                </span>
                <span
                  className={`text-[9px] font-mono px-2 py-0.5 rounded-full border uppercase font-bold ${
                    severityColors[emg.severity] || severityColors.severe
                  }`}
                >
                  {emg.severity}
                </span>
              </div>
              <h2 className="text-xl font-black text-white tracking-wide">{emg.title}</h2>
            </div>
          </div>
          <button
            onClick={dismissEmergency}
            className="p-1.5 rounded-lg bg-slate-800/60 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* BODY */}
        <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto no-scrollbar">
          {/* NARRATIVE & CAUSE */}
          <div className="p-4 rounded-xl bg-slate-950/60 border border-white/10 space-y-2">
            <p className="text-sm text-slate-300 leading-relaxed">{emg.description}</p>
            <div className="flex items-center gap-2 text-xs text-rose-400 font-mono pt-1 border-t border-white/5">
              <ShieldAlert className="w-4 h-4 shrink-0" />
              <span>ROOT CAUSE: {emg.cause}</span>
            </div>
            <div className="text-xs text-amber-300 font-mono bg-amber-500/10 p-2 rounded-lg border border-amber-500/20">
              IMMEDIATE IMPACT: {emg.effectsSummary}
            </div>
          </div>

          {/* TIMER */}
          <div className="flex items-center justify-between px-4 py-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20">
            <div className="flex items-center gap-2 text-rose-300 text-xs font-mono font-bold">
              <Clock className="w-4 h-4 animate-spin" />
              <span>EXECUTIVE RESPONSE WINDOW</span>
            </div>
            <span className="font-mono text-sm text-white font-black bg-rose-600 px-3 py-0.5 rounded-full shadow-sm">
              {emg.remainingCycles} CYCLES REMAINING
            </span>
          </div>

          {/* RECOVERY ACTION OPTIONS */}
          <div className="space-y-3">
            <h3 className="text-xs font-mono tracking-wider text-slate-400 uppercase font-bold">
              DIRECTIVE RESPONSE PROTOCOLS (CHOOSE ONE)
            </h3>

            {emg.options.map((opt) => {
              const canAfford = treasury >= opt.costCredits;
              return (
                <div
                  key={opt.id}
                  className="p-4 rounded-xl bg-slate-950/70 border border-white/10 hover:border-cyan-400/50 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <h4 className="text-sm font-bold text-white flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-cyan-400 shrink-0" />
                      {opt.label}
                    </h4>
                    <p className="text-xs text-slate-300">{opt.resolutionEffect}</p>
                    <div className="flex items-center gap-3 text-[11px] font-mono text-slate-400 pt-1">
                      <span className="flex items-center gap-1 text-amber-400">
                        <Coins className="w-3.5 h-3.5" />
                        ₡{opt.costCredits.toLocaleString()} CR
                      </span>
                      {opt.costMaterials && opt.costMaterials > 0 && (
                        <span className="flex items-center gap-1 text-orange-400">
                          <Package className="w-3.5 h-3.5" />
                          {opt.costMaterials} Materials
                        </span>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => resolveEmergency(opt.id)}
                    disabled={!canAfford}
                    className={`px-4 py-2.5 rounded-xl text-xs font-mono font-bold tracking-wider shrink-0 transition-all ${
                      canAfford
                        ? 'bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-400 hover:to-amber-400 text-slate-950 cursor-pointer shadow-[0_0_15px_rgba(244,63,94,0.4)]'
                        : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-white/5'
                    }`}
                  >
                    {canAfford ? 'EXECUTE PROTOCOL' : 'INSUFFICIENT FUNDS'}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
