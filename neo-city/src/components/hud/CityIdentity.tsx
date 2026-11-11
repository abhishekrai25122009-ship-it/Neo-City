import React from 'react';
import { useCityStore } from '../../store/useCityStore';
import type { DistrictDensity } from '../../types/city';
import { Layers, Sparkles } from 'lucide-react';

export const CityIdentity: React.FC = () => {
  const stats = useCityStore((state) => state.stats);
  const cityName = useCityStore((state) => state.cityName);
  const densityMode = useCityStore((state) => state.densityMode);
  const setDensityMode = useCityStore((state) => state.setDensityMode);
  const toggleDrawer = useCityStore((state) => state.toggleDrawer);

  const cycleDensity = () => {
    const next: Record<DistrictDensity, DistrictDensity> = {
      low: 'medium',
      medium: 'high',
      high: 'low',
    };
    setDensityMode(next[densityMode]);
  };

  const densityColorMap: Record<DistrictDensity, { text: string; bg: string; border: string }> = {
    low: { text: 'text-emerald-400', bg: 'bg-emerald-950/40', border: 'border-emerald-500/40' },
    medium: { text: 'text-sky-400', bg: 'bg-sky-950/40', border: 'border-sky-500/40' },
    high: { text: 'text-amber-400', bg: 'bg-amber-950/40', border: 'border-amber-500/40' },
  };

  const densityMeta = densityColorMap[densityMode];

  return (
    <div className="flex items-center gap-3 font-mono">
      {/* Civilization Crest */}
      <div className="relative group cursor-pointer" onClick={() => toggleDrawer('missions')}>
        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-amber-500 border border-amber-400/40 flex items-center justify-center shadow-[0_0_15px_rgba(245,158,11,0.3)] transition-transform group-hover:scale-105">
          <Layers className="w-4 h-4 text-white drop-shadow" />
        </div>
        <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-amber-400 border-2 border-slate-950 animate-ping" />
      </div>

      <div>
        <div className="flex items-center gap-2">
          {/* City Name */}
          <span className="font-['Chakra_Petch'] font-black text-sm tracking-widest text-white uppercase flex items-center gap-1.5">
            NEO CITY <span className="text-amber-400">{cityName}</span>
          </span>

          {/* Civ Level Badge */}
          <button
            onClick={() => toggleDrawer('missions')}
            className="text-[9px] px-2 py-0.5 rounded-full bg-gradient-to-r from-purple-600/50 to-indigo-600/50 text-purple-200 border border-purple-400/40 font-bold flex items-center gap-1 cursor-pointer hover:border-purple-300 transition-colors shadow-sm"
            title={`Civilization Level ${stats.civLevel}: ${stats.civXP} / ${stats.civXPToNextLevel} XP towards next milestone`}
          >
            <Sparkles className="w-2.5 h-2.5 text-amber-300" />
            <span>LVL {stats.civLevel}</span>
          </button>

          {/* Density Mode Control Badge */}
          <button
            onClick={cycleDensity}
            className={`text-[9px] px-2 py-0.5 rounded-md font-bold uppercase border transition-all cursor-pointer ${densityMeta.text} ${densityMeta.bg} ${densityMeta.border} hover:brightness-125`}
            title={`District Spacing Density: ${densityMode.toUpperCase()}. Click to switch between Low (Generous gardens), Medium (Believable avenues), High (Dense financial spires).`}
          >
            {densityMode} Density
          </button>

          {/* Era Badge */}
          <span className="text-[9px] px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 font-semibold hidden md:inline">
            {stats.era}
          </span>
        </div>

        {/* Telemetry subline: Cycle, Time, XP */}
        <div className="text-[10px] text-slate-400 flex items-center gap-2 mt-0.5">
          <span>CYCLE {stats.cycleCount} // {stats.timeOfDay}</span>
          <span className="text-slate-600">•</span>
          <span className="text-purple-400 hidden sm:inline">
            XP {stats.civXP} / {stats.civXPToNextLevel}
          </span>
          <div className="hidden lg:inline-block w-16 h-1.5 rounded-full bg-slate-800 overflow-hidden border border-white/10 align-middle">
            <div
              className="h-full bg-gradient-to-r from-purple-500 to-amber-400 rounded-full transition-all duration-300"
              style={{
                width: `${Math.min(100, Math.round((stats.civXP / Math.max(1, stats.civXPToNextLevel)) * 100))}%`,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
