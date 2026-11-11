import React from 'react';
import { useCityStore } from '../../store/useCityStore';
import {
  Building,
  Hammer,
  MapPin,
  Navigation,
  Coins,
  FlaskConical,
  Target,
  HardDrive,
} from 'lucide-react';

export const OrbitalCommandDock: React.FC = () => {
  const activeDrawer = useCityStore((state) => state.activeDrawer);
  const toggleDrawer = useCityStore((state) => state.toggleDrawer);
  const setSaveLoadModalOpen = useCityStore((state) => state.setSaveLoadModalOpen);
  const isSaveLoadModalOpen = useCityStore((state) => state.isSaveLoadModalOpen);
  const missions = useCityStore((state) => state.missions);
  const techTree = useCityStore((state) => state.techTree);
  const stats = useCityStore((state) => state.stats);

  const unclaimedDirectives = missions.filter((m) => m.isCompleted && !m.claimed).length;
  const researchableTechs = techTree.filter(
    (t) =>
      !t.unlocked &&
      stats.researchPoints >= t.costRP &&
      stats.treasury >= t.costCredits &&
      t.prerequisites.every((p) => techTree.find((node) => node.id === p)?.unlocked)
  ).length;

  const dockItems = [
    {
      id: 'city',
      label: 'CITY',
      sublabel: 'VITALS',
      hotkey: '1',
      icon: Building,
      isActive: activeDrawer === 'demographics',
      onClick: () => toggleDrawer('demographics'),
    },
    {
      id: 'build',
      label: 'BUILD',
      sublabel: 'CAD ZONING',
      hotkey: '2',
      icon: Hammer,
      isActive: activeDrawer === 'construction',
      onClick: () => toggleDrawer('construction'),
      highlight: true,
    },
    {
      id: 'districts',
      label: 'DISTRICTS',
      sublabel: 'POLICIES',
      hotkey: '3',
      icon: MapPin,
      isActive: activeDrawer === 'districts',
      onClick: () => toggleDrawer('districts'),
    },
    {
      id: 'transport',
      label: 'TRANSPORT',
      sublabel: 'MAGLEV',
      hotkey: '4',
      icon: Navigation,
      isActive: activeDrawer === 'transit',
      onClick: () => toggleDrawer('transit'),
      badge: `${stats.transitStats.efficiencyPercent}%`,
      badgeColor: 'bg-emerald-950 text-[#00e676] border border-emerald-500/40',
    },
    {
      id: 'economy',
      label: 'ECONOMY',
      sublabel: 'TRADE & FISCAL',
      hotkey: '5',
      icon: Coins,
      isActive: activeDrawer === 'economy',
      onClick: () => toggleDrawer('economy'),
    },
    {
      id: 'research',
      label: 'RESEARCH',
      sublabel: 'TECH TREE',
      hotkey: '6',
      icon: FlaskConical,
      isActive: activeDrawer === 'research',
      onClick: () => toggleDrawer('research'),
      badge: researchableTechs > 0 ? `${researchableTechs}` : undefined,
      badgeColor: 'bg-[#ff5500] text-[#05070a] font-black',
    },
    {
      id: 'directives',
      label: 'DIRECTIVES',
      sublabel: 'AI ORDERS',
      hotkey: '7',
      icon: Target,
      isActive: activeDrawer === 'missions' || activeDrawer === 'ai_director',
      onClick: () => toggleDrawer('missions'),
      badge:
        stats.activeEmergency
          ? 'ALERT'
          : unclaimedDirectives > 0
          ? `${unclaimedDirectives}`
          : undefined,
      badgeColor: stats.activeEmergency
        ? 'bg-[#ef4444] text-[#fcfaf6] animate-pulse font-black'
        : 'bg-[#00e676] text-[#05070a] font-black',
    },
    {
      id: 'save',
      label: 'ARCHIVE',
      sublabel: 'SAVE / LOAD',
      hotkey: '8',
      icon: HardDrive,
      isActive: isSaveLoadModalOpen,
      onClick: () => setSaveLoadModalOpen(true),
    },
  ];

  return (
    <div className="fixed bottom-3 inset-x-0 z-40 flex justify-center pointer-events-none px-2 select-none font-mono">
      {/* AEROSPACE ORBITAL COMMAND DOCK */}
      <nav className="orbital-dock px-3 py-1.5 rounded-2xl flex items-center gap-1 md:gap-2 pointer-events-auto shadow-[0_15px_40px_rgba(0,0,0,0.85)] max-w-4xl w-full justify-between">
        {dockItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={item.onClick}
              className={`group relative flex-1 py-1 px-1.5 md:px-2 rounded-xl flex flex-col items-center justify-center transition-all duration-150 cursor-pointer ${
                item.isActive
                  ? 'bg-[#ff5500]/15 border border-[#ff5500] text-[#fcfaf6] shadow-[0_0_15px_rgba(255,85,0,0.35)]'
                  : 'bg-[#0a0d14]/70 hover:bg-[#121622] border border-white/5 hover:border-white/20 text-[#94a3b8]'
              }`}
            >
              {/* Active indicator top tick */}
              {item.isActive && (
                <div className="absolute -top-[7px] w-5 h-1 bg-[#ff5500] rounded-full shadow-[0_0_8px_#ff5500]" />
              )}

              {/* Icon & Badge */}
              <div className="relative flex items-center justify-center mb-0.5">
                <Icon
                  className={`w-4 h-4 md:w-4.5 md:h-4.5 transition-transform duration-150 group-hover:scale-110 ${
                    item.isActive
                      ? 'text-[#ff5500]'
                      : item.highlight
                      ? 'text-[#ff8533]'
                      : 'text-[#ded6c8] group-hover:text-white'
                  }`}
                />

                {item.badge && (
                  <span
                    className={`absolute -top-1.5 -right-3 text-[8px] font-bold px-1 py-0.2 rounded-full border border-black/50 shadow-sm ${item.badgeColor}`}
                  >
                    {item.badge}
                  </span>
                )}
              </div>

              {/* Title & Technical Subtitle */}
              <span
                className={`font-['Chakra_Petch'] font-black text-[11px] md:text-xs tracking-wider uppercase leading-none ${
                  item.isActive ? 'text-[#fcfaf6]' : 'text-[#ded6c8] group-hover:text-white'
                }`}
              >
                {item.label}
              </span>
              <span className="text-[7px] md:text-[8px] text-[#64748b] tracking-tighter uppercase leading-none mt-0.5 hidden sm:inline">
                {item.sublabel}
              </span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};
