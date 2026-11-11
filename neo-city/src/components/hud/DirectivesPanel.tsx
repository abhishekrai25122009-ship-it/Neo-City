import React from 'react';
import { useCityStore } from '../../store/useCityStore';
import { Target, CheckCircle2 } from 'lucide-react';

export const DirectivesPanel: React.FC = () => {
  const missions = useCityStore((state) => state.missions);
  const toggleDrawer = useCityStore((state) => state.toggleDrawer);

  const unclaimedMissions = missions.filter((m) => m.isCompleted && !m.claimed);
  const unclaimedCount = unclaimedMissions.length;

  const activeMission = missions.find((m) => !m.isCompleted);

  return (
    <button
      onClick={() => toggleDrawer('missions')}
      className={`flex items-center gap-2 px-2.5 py-1 rounded-lg border font-mono text-xs transition-all cursor-pointer ${
        unclaimedCount > 0
          ? 'bg-amber-500/20 border-amber-400 text-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.4)] animate-bounce'
          : 'bg-purple-950/30 border-purple-500/30 text-purple-300 hover:border-purple-400'
      }`}
      title="Civilization Directives, Milestones & Progression"
    >
      <Target className="w-3.5 h-3.5 text-amber-400" />
      <span className="font-bold text-[11px] hidden sm:inline">DIRECTIVES</span>

      {unclaimedCount > 0 ? (
        <span className="px-1.5 py-0.2 rounded-full bg-amber-400 text-slate-950 text-[10px] font-black">
          {unclaimedCount}
        </span>
      ) : activeMission ? (
        <span className="text-[10px] text-slate-400 hidden xl:inline truncate max-w-[120px]">
          {activeMission.title}
        </span>
      ) : (
        <CheckCircle2 className="w-3 h-3 text-emerald-400" />
      )}
    </button>
  );
};
