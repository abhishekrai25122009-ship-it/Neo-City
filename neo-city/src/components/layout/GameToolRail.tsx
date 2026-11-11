import React from 'react';
import { useCityStore } from '../../store/useCityStore';
import {
  Hammer,
  MapPin,
  FlaskConical,
  Target,
  Navigation,
  Zap,
  TrendingUp,
  Users,
  Leaf,
  Bell,
  Sliders,
  Castle,
  Cpu,
} from 'lucide-react';

export const GameToolRail: React.FC = () => {
  const activeDrawer = useCityStore((state) => state.activeDrawer);
  const toggleDrawer = useCityStore((state) => state.toggleDrawer);
  const stats = useCityStore((state) => state.stats);
  const missions = useCityStore((state) => state.missions);
  const techTree = useCityStore((state) => state.techTree);

  // Compute badges
  const unclaimedMissions = missions.filter((m) => m.isCompleted && !m.claimed).length;
  const researchableTechs = techTree.filter(
    (t) =>
      !t.unlocked &&
      stats.researchPoints >= t.costRP &&
      stats.treasury >= t.costCredits &&
      t.prerequisites.every((p) => techTree.find((node) => node.id === p)?.unlocked)
  ).length;

  const tools: {
    id:
      | 'construction'
      | 'megaprojects'
      | 'ai_director'
      | 'research'
      | 'missions'
      | 'transit'
      | 'districts'
      | 'energy_grid'
      | 'economy'
      | 'demographics'
      | 'environment'
      | 'chronicle'
      | 'settings';
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    colorClass: string;
    badge?: string | number;
    badgeColor?: string;
    glowClass: string;
  }[] = [
    {
      id: 'construction',
      label: 'Construct & Zone',
      icon: Hammer,
      colorClass: 'text-orange-400 group-hover:text-orange-300',
      glowClass: 'bg-orange-500/20 border-orange-400 shadow-[0_0_15px_rgba(249,115,22,0.35)]',
      badge: 'CAD',
      badgeColor: 'bg-orange-500/30 text-orange-200 border-orange-400/40',
    },
    {
      id: 'megaprojects',
      label: 'Mega-Projects (Staged)',
      icon: Castle,
      colorClass: 'text-amber-400 group-hover:text-amber-300',
      glowClass: 'bg-amber-500/20 border-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.35)]',
      badge: 'MEGA',
      badgeColor: 'bg-amber-500/30 text-amber-200 border-amber-400/40',
    },
    {
      id: 'ai_director',
      label: 'Autonomous City AI',
      icon: Cpu,
      colorClass: 'text-indigo-400 group-hover:text-indigo-300',
      glowClass: 'bg-indigo-500/20 border-indigo-400 shadow-[0_0_15px_rgba(99,102,241,0.35)]',
      badge: stats.aiDirector?.threatLevel === 'critical' ? 'ALERT' : undefined,
      badgeColor: 'bg-rose-500 text-white font-black animate-pulse',
    },
    {
      id: 'research',
      label: 'Research & Tech Tree',
      icon: FlaskConical,
      colorClass: 'text-cyan-400 group-hover:text-cyan-300',
      glowClass: 'bg-cyan-500/20 border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.35)]',
      badge: researchableTechs > 0 ? researchableTechs : undefined,
      badgeColor: 'bg-cyan-500 text-slate-950 font-black',
    },
    {
      id: 'missions',
      label: 'Directives & Objectives',
      icon: Target,
      colorClass: 'text-amber-400 group-hover:text-amber-300',
      glowClass: 'bg-amber-500/20 border-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.35)]',
      badge: unclaimedMissions > 0 ? unclaimedMissions : undefined,
      badgeColor: 'bg-amber-400 text-slate-950 font-black animate-bounce',
    },
    {
      id: 'transit',
      label: 'Advanced Transportation',
      icon: Navigation,
      colorClass: 'text-blue-400 group-hover:text-blue-300',
      glowClass: 'bg-blue-500/20 border-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.35)]',
      badge: `${stats.transitStats.efficiencyPercent}%`,
      badgeColor: 'bg-blue-500/30 text-blue-200 border-blue-400/30',
    },
    {
      id: 'districts',
      label: 'Districts & Sectors',
      icon: MapPin,
      colorClass: 'text-indigo-400 group-hover:text-indigo-300',
      glowClass: 'bg-indigo-500/20 border-indigo-400 shadow-[0_0_15px_rgba(99,102,241,0.35)]',
    },
    {
      id: 'energy_grid',
      label: 'Energy & Water Grid',
      icon: Zap,
      colorClass: 'text-yellow-400 group-hover:text-yellow-300',
      glowClass: 'bg-yellow-500/20 border-yellow-400 shadow-[0_0_15px_rgba(234,179,8,0.35)]',
      badge: stats.powerDeficit || stats.waterDeficit ? 'ALERT' : undefined,
      badgeColor: 'bg-rose-500 text-white font-black animate-pulse',
    },
    {
      id: 'economy',
      label: 'Economy & Treasury',
      icon: TrendingUp,
      colorClass: 'text-amber-400 group-hover:text-amber-300',
      glowClass: 'bg-amber-500/20 border-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.35)]',
    },
    {
      id: 'demographics',
      label: 'Citizens & Life',
      icon: Users,
      colorClass: 'text-purple-400 group-hover:text-purple-300',
      glowClass: 'bg-purple-500/20 border-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.35)]',
    },
    {
      id: 'environment',
      label: 'Environment & AQI',
      icon: Leaf,
      colorClass: 'text-emerald-400 group-hover:text-emerald-300',
      glowClass: 'bg-emerald-500/20 border-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.35)]',
    },
    {
      id: 'chronicle',
      label: 'Civic Chronicle',
      icon: Bell,
      colorClass: 'text-sky-400 group-hover:text-sky-300',
      glowClass: 'bg-sky-500/20 border-sky-400 shadow-[0_0_15px_rgba(14,165,233,0.35)]',
    },
    {
      id: 'settings',
      label: 'Simulation Config',
      icon: Sliders,
      colorClass: 'text-slate-400 group-hover:text-white',
      glowClass: 'bg-slate-700/40 border-slate-400 shadow-[0_0_15px_rgba(148,163,184,0.35)]',
    },
  ];

  return (
    <aside className="fixed left-2 md:left-4 top-18 bottom-4 z-40 w-12 md:w-14 game-rail rounded-2xl flex flex-col items-center justify-between py-2 pointer-events-auto border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.6)]">
      {/* TOOL BUTTONS */}
      <div className="flex flex-col gap-1.5 w-full px-1.5 overflow-y-auto no-scrollbar">
        {tools.map((t) => {
          const Icon = t.icon;
          const isActive = activeDrawer === t.id;
          return (
            <button
              key={t.id}
              onClick={() => toggleDrawer(t.id)}
              className={`group relative w-full h-9 md:h-10 rounded-xl flex items-center justify-center transition-all duration-200 cursor-pointer ${
                isActive
                  ? t.glowClass
                  : 'bg-slate-900/50 hover:bg-slate-800/80 border border-white/5 hover:border-white/20'
              }`}
              title={t.label}
            >
              <Icon
                className={`w-4 h-4 transition-transform duration-200 group-hover:scale-110 ${t.colorClass}`}
              />

              {/* BADGE */}
              {t.badge && (
                <span
                  className={`absolute -top-1 -right-1 text-[8px] font-mono px-1 py-0.2 rounded-full border border-black/40 shadow-sm ${
                    t.badgeColor || 'bg-indigo-600 text-white'
                  }`}
                >
                  {t.badge}
                </span>
              )}

              {/* TOOLTIP ON HOVER */}
              <div className="absolute left-full ml-3 px-2.5 py-1 rounded-md bg-slate-950/95 border border-white/15 text-white font-mono text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-150 z-50 shadow-xl">
                {t.label}
              </div>
            </button>
          );
        })}
      </div>
    </aside>
  );
};
