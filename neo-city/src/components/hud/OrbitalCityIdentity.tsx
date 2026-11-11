import React from 'react';
import { useCityStore } from '../../store/useCityStore';
import type { DistrictDensity } from '../../types/city';
import { Sparkles, Activity } from 'lucide-react';
import { NeoCityLogo } from '../common/NeoCityLogo';

export const OrbitalCityIdentity: React.FC = () => {
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

  const xpPercentage = Math.min(
    100,
    Math.round((stats.civXP / Math.max(1, stats.civXPToNextLevel)) * 100)
  );

  return (
    <div className="flex items-center gap-3 select-none font-mono">
      {/* 1. MASTER NEO CITY CREST ICON */}
      <div
        className="relative group cursor-pointer transition-transform duration-200 group-hover:scale-105"
        onClick={() => toggleDrawer('missions')}
        title="NEO CITY Command Directives & Milestone Progression"
      >
        <NeoCityLogo size="sm" variant="icon" animated={true} />
        <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-[#00f0ff] border border-[#040812] shadow-[0_0_8px_#00f0ff]" />
      </div>

      {/* 2. FLAGSHIP TITLE & CIVILIZATION METADATA */}
      <div className="flex flex-col">
        {/* City Title and Status */}
        <div className="flex items-center gap-2">
          <span className="font-['Chakra_Petch'] font-black text-lg md:text-xl tracking-wider text-[#fcfaf6] uppercase flex items-center gap-1.5 leading-none">
            <span className="bg-gradient-to-r from-[#00f0ff] via-[#38bdf8] to-[#ec4899] bg-clip-text text-transparent">NEO CITY</span>
            <span className="text-[#94a3b8] text-sm md:text-base font-mono">[{cityName}]</span>
          </span>

          {/* Operational Status Badge */}
          <div className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-[#0d1017] border border-cyan-500/30 text-[9px] font-bold">
            <Activity
              className={`w-2.5 h-2.5 ${
                stats.powerDeficit || stats.waterDeficit || stats.activeEmergency
                  ? 'text-[#ef4444] animate-pulse'
                  : 'text-[#00f0ff]'
              }`}
            />
            <span
              className={
                stats.powerDeficit || stats.waterDeficit || stats.activeEmergency
                  ? 'text-[#ef4444]'
                  : 'text-[#00f0ff]'
              }
            >
              {stats.activeEmergency ? 'CRISIS' : stats.powerDeficit ? 'ONLINE' : 'NOMINAL'}
            </span>
          </div>
        </div>

        {/* Civ Level, Era & XP Progress Track */}
        <div className="flex items-center gap-2 mt-1 text-[10px] text-[#94a3b8]">
          {/* Civ Level Button */}
          <button
            onClick={() => toggleDrawer('missions')}
            className="px-2 py-0.5 rounded bg-cyan-500/15 text-cyan-300 border border-cyan-500/40 font-bold flex items-center gap-1 cursor-pointer hover:bg-cyan-500/25 transition-colors shadow-[0_0_8px_rgba(0,240,255,0.2)]"
          >
            <Sparkles className="w-2.5 h-2.5 text-cyan-400" />
            <span>LVL {stats.civLevel}</span>
          </button>

          {/* Era Title */}
          <span className="text-[#ede5d8] font-semibold tracking-wide uppercase hidden sm:inline">
            {stats.era}
          </span>

          <span className="text-slate-600 hidden sm:inline">|</span>

          {/* Density Selector */}
          <button
            onClick={cycleDensity}
            className={`px-1.5 py-0.5 rounded border text-[9px] font-bold uppercase transition-all cursor-pointer ${
              densityMode === 'low'
                ? 'bg-emerald-950/50 border-emerald-500/50 text-emerald-400'
                : densityMode === 'medium'
                ? 'bg-amber-950/50 border-amber-500/50 text-amber-400'
                : 'bg-rose-950/50 border-rose-500/50 text-rose-400'
            } hover:brightness-125`}
            title={`Zoning Density: ${densityMode.toUpperCase()}. Click to cycle.`}
          >
            {densityMode}
          </button>

          {/* XP Progress Bar */}
          <div className="hidden lg:flex items-center gap-1.5">
            <span className="text-[9px] text-[#64748b]">XP</span>
            <div className="w-18 h-1.5 rounded-full bg-[#121620] border border-white/10 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#00f0ff] to-[#a855f7] rounded-full transition-all duration-300"
                style={{ width: `${xpPercentage}%` }}
              />
            </div>
            <span className="text-[9px] text-[#fcfaf6]">{xpPercentage}%</span>
          </div>
        </div>
      </div>
    </div>
  );
};
