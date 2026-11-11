import React from 'react';
import { useCityStore } from '../../store/useCityStore';
import { AlertOctagon, AlertTriangle, ShieldAlert } from 'lucide-react';

export const AlertsPanel: React.FC = () => {
  const stats = useCityStore((state) => state.stats);
  const activeDecisionEvent = useCityStore((state) => state.activeDecisionEvent);
  const triggerDecisionEvent = useCityStore((state) => state.triggerDecisionEvent);

  const activeEmergency = stats.activeEmergency;

  return (
    <div className="w-full flex flex-col gap-1.5 pointer-events-none select-none font-mono">
      {/* 1. Critical Metropolitan Disaster In Progress */}
      {activeEmergency && (
        <div
          onClick={() => {}}
          className="mx-auto max-w-xl w-full px-4 py-2.5 rounded-xl bg-[#0d1017] border-2 border-[#ef4444] text-[#ede5d8] flex items-center justify-between shadow-[0_0_30px_rgba(239,68,68,0.6)] cursor-pointer hover:bg-[#161b26] transition-all pointer-events-auto animate-bounce text-xs"
        >
          <div className="flex items-center gap-2.5">
            <AlertOctagon className="w-5 h-5 text-[#ef4444] shrink-0 animate-spin" />
            <div>
              <span className="text-[10px] text-[#ef4444] font-black uppercase tracking-widest block">
                ORBITAL CRISIS IN PROGRESS [{activeEmergency.severity.toUpperCase()}]
              </span>
              <span className="font-['Chakra_Petch'] font-black text-[#fcfaf6] text-sm tracking-wide">
                {activeEmergency.title}
              </span>
            </div>
          </div>
          <span className="text-[10px] font-black px-3 py-1 rounded-lg bg-[#ef4444] text-[#05070a] uppercase shrink-0 shadow-md">
            DISPATCH PROTOCOL →
          </span>
        </div>
      )}

      {/* 2. Dynamic City Decision & Policy Event */}
      {activeDecisionEvent && (
        <div
          onClick={() => triggerDecisionEvent(activeDecisionEvent)}
          className="mx-auto max-w-xl w-full px-4 py-2 rounded-xl bg-[#0d1017] border border-[#ff5500] text-[#ede5d8] flex items-center justify-between shadow-[0_0_25px_rgba(255,85,0,0.4)] cursor-pointer hover:bg-[#161b26] transition-all pointer-events-auto animate-pulse text-xs"
        >
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-[#ff5500] shrink-0 animate-bounce" />
            <span className="font-semibold">
              <span className="text-[#ff8533] uppercase font-bold tracking-wide">EXECUTIVE DIRECTIVE:</span>{' '}
              {activeDecisionEvent.title}
            </span>
          </div>
          <span className="text-[10px] font-black px-2.5 py-0.5 rounded bg-[#ff5500] text-[#05070a] uppercase shrink-0">
            RESOLVE →
          </span>
        </div>
      )}

      {/* 3. Utility Deficit Warnings (Power & Water) */}
      {(stats.powerDeficit || stats.waterDeficit) && !activeEmergency && (
        <div className="mx-auto max-w-lg w-full px-3 py-1.5 rounded-lg bg-[#0d1017] border border-[#ef4444] text-[#fcfaf6] flex items-center justify-center gap-2 text-[11px] shadow-md animate-pulse pointer-events-auto">
          <ShieldAlert className="w-3.5 h-3.5 text-[#ef4444]" />
          <span>
            CRITICAL GRID DEFICIT:{' '}
            {stats.powerDeficit && <strong className="text-[#ef4444]">PLASMA OVERLOAD </strong>}
            {stats.powerDeficit && stats.waterDeficit && '• '}
            {stats.waterDeficit && <strong className="text-[#38bdf8]">AQUIFER DEPLETED</strong>}
          </span>
        </div>
      )}
    </div>
  );
};
