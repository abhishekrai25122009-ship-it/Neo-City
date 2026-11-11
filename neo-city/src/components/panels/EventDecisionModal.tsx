import React from 'react';
import { useCityStore } from '../../store/useCityStore';
import {
  Zap,
  TrendingUp,
  Navigation,
  Leaf,
  Sparkles,
  Cpu,
  Clock,
  CheckCircle,
  X,
} from 'lucide-react';

export const EventDecisionModal: React.FC = () => {
  const activeDecisionEvent = useCityStore((state) => state.activeDecisionEvent);
  const resolveDecisionEvent = useCityStore((state) => state.resolveDecisionEvent);
  const dismissDecisionEvent = useCityStore((state) => state.dismissDecisionEvent);
  const treasury = useCityStore((state) => state.stats.treasury);

  if (!activeDecisionEvent) return null;

  const ev = activeDecisionEvent;

  const getCategoryIcon = () => {
    switch (ev.category) {
      case 'energy':
        return <Zap className="w-5 h-5 text-yellow-400" />;
      case 'economy':
        return <TrendingUp className="w-5 h-5 text-amber-400" />;
      case 'transit':
        return <Navigation className="w-5 h-5 text-blue-400" />;
      case 'environment':
        return <Leaf className="w-5 h-5 text-emerald-400" />;
      case 'technology':
        return <Cpu className="w-5 h-5 text-cyan-400" />;
      default:
        return <Sparkles className="w-5 h-5 text-purple-400" />;
    }
  };

  const getSeverityBadge = () => {
    switch (ev.severity) {
      case 'critical':
        return 'bg-rose-500/20 text-rose-300 border-rose-500/50 animate-pulse';
      case 'high':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/50';
      case 'medium':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/50';
      default:
        return 'bg-slate-700/40 text-slate-300 border-slate-600/40';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 pointer-events-auto">
      <div className="game-hud-panel w-full max-w-xl rounded-2xl p-5 border border-amber-400/30 shadow-[0_20px_70px_rgba(0,0,0,0.9)] flex flex-col gap-4 font-mono text-xs">
        {/* HEADER */}
        <div className="flex items-start justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-900 border border-white/15 flex items-center justify-center shadow-[0_0_15px_rgba(245,158,11,0.2)]">
              {getCategoryIcon()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded border ${getSeverityBadge()}`}>
                  {ev.severity} PRIORITY CIVIC EVENT
                </span>
                <span className="text-[10px] text-slate-400 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-slate-400" /> {ev.cycleRemaining} cycles left
                </span>
              </div>
              <h2 className="font-['Chakra_Petch'] text-lg font-bold text-white mt-1">
                {ev.title}
              </h2>
            </div>
          </div>

          <button
            onClick={dismissDecisionEvent}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            title="Defer Decision"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* NARRATIVE BRIEFING */}
        <div className="p-3.5 rounded-xl bg-slate-900/80 border border-white/10 text-slate-300 font-sans text-xs leading-relaxed">
          {ev.description}
        </div>

        {/* DECISION CHOICES GRID */}
        <div className="flex flex-col gap-2.5">
          <span className="text-[10px] font-bold text-amber-300 uppercase tracking-wider">
            EXECUTIVE DIRECTIVE OPTIONS
          </span>

          {ev.choices.map((choice) => {
            const cannotAfford = choice.costCredits ? treasury < choice.costCredits : false;
            return (
              <div
                key={choice.id}
                className="p-3.5 rounded-xl bg-slate-900/60 hover:bg-slate-900/90 border border-white/10 hover:border-amber-400/40 transition-all flex flex-col gap-2 group"
              >
                <div className="flex items-center justify-between">
                  <strong className="text-white font-semibold text-xs group-hover:text-amber-200 transition-colors">
                    {choice.label}
                  </strong>
                  {choice.costCredits ? (
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                      cannotAfford ? 'bg-rose-950/40 text-rose-300 border-rose-500/40' : 'bg-amber-950/40 text-amber-300 border-amber-500/40'
                    }`}>
                      COST: ₡{choice.costCredits.toLocaleString()} CR
                    </span>
                  ) : (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950/40 text-emerald-300 border border-emerald-500/40">
                      NO DIRECT CREDIT COST
                    </span>
                  )}
                </div>

                <p className="text-[11px] font-sans text-slate-400 leading-snug">
                  {choice.description}
                </p>

                {/* EFFECTS PREVIEW & AUTHORIZE BUTTON */}
                <div className="flex items-center justify-between pt-2 border-t border-white/5">
                  <div className="flex items-center gap-2 flex-wrap text-[10px] font-mono">
                    {choice.effects.happinessDelta && (
                      <span className={choice.effects.happinessDelta > 0 ? 'text-emerald-400' : 'text-rose-400'}>
                        MOOD: {choice.effects.happinessDelta > 0 ? `+${choice.effects.happinessDelta}%` : `${choice.effects.happinessDelta}%`}
                      </span>
                    )}
                    {choice.effects.treasuryDelta && choice.effects.treasuryDelta > 0 && (
                      <span className="text-amber-300">
                        REVENUE: +₡{choice.effects.treasuryDelta.toLocaleString()}
                      </span>
                    )}
                    {choice.effects.rpDelta && (
                      <span className={choice.effects.rpDelta > 0 ? 'text-cyan-300' : 'text-slate-400'}>
                        TECH: {choice.effects.rpDelta > 0 ? `+${choice.effects.rpDelta} RP` : `${choice.effects.rpDelta} RP`}
                      </span>
                    )}
                    {choice.effects.pollutionDelta && (
                      <span className={choice.effects.pollutionDelta < 0 ? 'text-emerald-400' : 'text-amber-400'}>
                        AIR: {choice.effects.pollutionDelta < 0 ? `${choice.effects.pollutionDelta} AQI` : `+${choice.effects.pollutionDelta} AQI`}
                      </span>
                    )}
                    {choice.effects.transitDelta && (
                      <span className={choice.effects.transitDelta > 0 ? 'text-blue-300' : 'text-rose-400'}>
                        TRANSIT: {choice.effects.transitDelta > 0 ? `+${choice.effects.transitDelta}%` : `${choice.effects.transitDelta}%`}
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => resolveDecisionEvent(choice.id)}
                    disabled={cannotAfford}
                    className={`py-1.5 px-3.5 rounded-lg font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-md ${
                      cannotAfford
                        ? 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
                        : 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 hover:scale-[1.02]'
                    }`}
                  >
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>ENACT ORDER</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
