import React from 'react';
import { useCityStore } from '../../store/useCityStore';
import { getBuildingTierInfo } from '../../data/tierEvolutionData';
import {
  X,
  Users,
  Coins,
  Zap,
  Droplets,
  ArrowUpCircle,
  Trash2,
  Maximize2,
  Sparkles,
} from 'lucide-react';

export const BuildingInspectorCard: React.FC = () => {
  const selectedBuildingId = useCityStore((state) => state.selectedBuildingId);
  const selectBuilding = useCityStore((state) => state.selectBuilding);
  const buildings = useCityStore((state) => state.buildings);
  const openUpgradePreview = useCityStore((state) => state.openUpgradePreview);
  const demolishBuilding = useCityStore((state) => state.demolishBuilding);
  const flyToCamera = useCityStore((state) => state.flyToCamera);
  const setBuildingOperationalMode = useCityStore((state) => state.setBuildingOperationalMode);

  const building = buildings.find((b) => b.id === selectedBuildingId);

  if (!building) return null;

  const currentTierInfo = getBuildingTierInfo(building.style, building.level);
  const nextTierInfo = building.level < 8 ? getBuildingTierInfo(building.style, building.level + 1) : null;
  const occupancyRatio = Math.round((building.occupancy / building.maxOccupancy) * 100);

  const handleFocus = () => {
    flyToCamera(
      [building.position[0] + 16, Math.max(14, building.height + 6), building.position[2] + 18],
      [building.position[0], building.height * 0.45, building.position[2]]
    );
  };

  return (
    <div className="fixed bottom-20 right-4 md:right-6 z-40 w-84 md:w-92 pointer-events-none select-none font-mono text-xs">
      <div className="orbital-surface-elevated p-4 rounded-2xl pointer-events-auto border border-[#ff5500]/40 shadow-[0_20px_50px_rgba(0,0,0,0.9),0_0_20px_rgba(255,85,0,0.15)] flex flex-col gap-3">
        {/* HEADER */}
        <div className="flex items-start justify-between border-b border-white/10 pb-2.5">
          <div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-[#ff5500]/20 text-[#ff8533] border border-[#ff5500]/50">
                TIER {building.level} / 8
              </span>
              <span className="text-[10px] uppercase font-bold text-[#ede5d8]">
                {currentTierInfo.name}
              </span>
            </div>
            <h3 className="font-['Chakra_Petch'] font-black text-base text-[#fcfaf6] mt-1 tracking-wide">
              {building.name}
            </h3>
          </div>

          <button
            onClick={() => selectBuilding(null)}
            className="p-1 rounded-lg text-[#94a3b8] hover:text-[#fcfaf6] hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* ARCHITECTURAL STATUS & DESCRIPTION */}
        <div className="bg-[#090c12] p-2.5 rounded-xl border border-white/10 space-y-1.5">
          <p className="text-[11px] text-[#ded6c8] font-sans leading-snug">
            {building.details}
          </p>
          <div className="text-[10px] text-[#ffaa00] font-mono bg-[#161b26]/50 px-2 py-1 rounded border border-white/5">
            <span className="font-bold text-[#ff8533]">Evolution:</span> {currentTierInfo.description}
          </div>
        </div>

        {/* OPERATIONAL MODE TOGGLE */}
        <div className="flex items-center justify-between p-2 rounded-xl bg-[#090c12] border border-white/10 text-[10px]">
          <span className="text-[#64748b] uppercase font-semibold">ORBITAL GRID MODE:</span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setBuildingOperationalMode(building.id, 'optimal')}
              className={`px-2 py-0.5 rounded cursor-pointer transition-colors ${
                (building.operationalMode || 'optimal') === 'optimal'
                  ? 'bg-[#ff5500] text-[#05070a] font-black shadow-sm'
                  : 'bg-white/5 text-[#94a3b8] hover:text-white'
              }`}
            >
              NORM
            </button>
            <button
              onClick={() => setBuildingOperationalMode(building.id, 'overclocked')}
              className={`px-2 py-0.5 rounded cursor-pointer transition-colors ${
                building.operationalMode === 'overclocked'
                  ? 'bg-[#ffaa00] text-[#05070a] font-black shadow-sm animate-pulse'
                  : 'bg-white/5 text-[#94a3b8] hover:text-white'
              }`}
              title="Overclock: +40% Output, +60% Power Load"
            >
              OVERCLOCK
            </button>
            <button
              onClick={() => setBuildingOperationalMode(building.id, 'eco_saver')}
              className={`px-2 py-0.5 rounded cursor-pointer transition-colors ${
                building.operationalMode === 'eco_saver'
                  ? 'bg-[#00e676] text-[#05070a] font-black shadow-sm'
                  : 'bg-white/5 text-[#94a3b8] hover:text-white'
              }`}
              title="Eco Saver: -50% Power Load, -30% Output"
            >
              ECO
            </button>
          </div>
        </div>

        {/* TELEMETRY METRIC GRID */}
        <div className="grid grid-cols-2 gap-2">
          {/* Occupants / Tenants */}
          <div className="bg-[#090c12] p-2 rounded-xl border border-white/10 flex flex-col gap-1">
            <div className="flex items-center justify-between text-[10px] text-[#ded6c8]">
              <span className="flex items-center gap-1">
                <Users className="w-3 h-3 text-[#ff8533]" /> OCCUPANCY
              </span>
              <span className="font-bold text-[#fcfaf6]">{occupancyRatio}%</span>
            </div>
            <div className="font-bold text-[#fcfaf6] text-xs">
              {building.occupancy.toLocaleString()} <span className="text-[9px] text-[#64748b]">/ {building.maxOccupancy.toLocaleString()}</span>
            </div>
            <div className="w-full bg-[#161b26] h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-[#00e676] h-full rounded-full transition-all"
                style={{ width: `${occupancyRatio}%` }}
              />
            </div>
          </div>

          {/* Revenue */}
          <div className="bg-[#090c12] p-2 rounded-xl border border-white/10 flex flex-col gap-1">
            <div className="flex items-center justify-between text-[10px] text-[#ff8533]">
              <span className="flex items-center gap-1">
                <Coins className="w-3 h-3 text-[#ffaa00]" /> REVENUE
              </span>
            </div>
            <div className="font-bold text-[#00e676] text-xs">
              +{building.revenue.toLocaleString()} <span className="text-[9px] text-[#64748b]">CR/c</span>
            </div>
            <div className="text-[9px] text-[#64748b]">
              Upkeep: -{building.maintenanceCost || 5000} CR
            </div>
          </div>

          {/* Energy */}
          <div className="bg-[#090c12] p-2 rounded-xl border border-white/10 flex flex-col gap-1">
            <div className="flex items-center justify-between text-[10px] text-[#ffaa00]">
              <span className="flex items-center gap-1">
                <Zap className="w-3 h-3 text-[#ffaa00]" /> POWER GRID
              </span>
            </div>
            <div className="font-bold text-[#fcfaf6] text-xs">
              {building.powerProduction ? (
                <span className="text-[#00e676]">+{building.powerProduction} MW GEN</span>
              ) : (
                <span className="text-[#ffaa00]">-{building.powerConsumption} MW LOAD</span>
              )}
            </div>
          </div>

          {/* Water */}
          <div className="bg-[#090c12] p-2 rounded-xl border border-white/10 flex flex-col gap-1">
            <div className="flex items-center justify-between text-[10px] text-[#38bdf8]">
              <span className="flex items-center gap-1">
                <Droplets className="w-3 h-3 text-[#38bdf8]" /> WATER
              </span>
            </div>
            <div className="font-bold text-[#fcfaf6] text-xs">
              {building.waterProduction ? (
                <span className="text-[#00e676]">+{building.waterProduction} ML SUPPLY</span>
              ) : (
                <span className="text-[#38bdf8]">-{building.waterConsumption} ML LOAD</span>
              )}
            </div>
          </div>
        </div>

        {/* JOBS & CLEAN AIR IMPACT */}
        <div className="flex items-center justify-between bg-[#090c12] p-2 rounded-xl border border-white/5 text-[10px]">
          <span className="text-[#ede5d8]">
            EMPLOYMENT: <strong>{building.jobsProvided} SLOTS</strong>
          </span>
          <span className={building.pollution <= 0 ? 'text-[#00e676]' : 'text-[#64748b]'}>
            AQI: <strong>{building.pollution <= 0 ? `${building.pollution} (CLEAN)` : `+${building.pollution}`}</strong>
          </span>
        </div>

        {/* ACTION BUTTONS */}
        <div className="flex items-center gap-2 pt-1 border-t border-white/10">
          <button
            onClick={handleFocus}
            className="p-2.5 rounded-xl bg-[#090c12] hover:bg-[#161b26] border border-white/15 text-[#38bdf8] hover:text-white transition-all cursor-pointer"
            title="Focus Camera"
          >
            <Maximize2 className="w-4 h-4" />
          </button>

          {building.level < 8 && nextTierInfo ? (
            <button
              onClick={() => openUpgradePreview(building.id)}
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-gradient-to-r from-[#ff5500] via-[#ff7a1a] to-[#ff5500] hover:brightness-110 text-[#05070a] font-black text-xs transition-all cursor-pointer shadow-[0_0_20px_rgba(255,85,0,0.4)]"
            >
              <Sparkles className="w-4 h-4" />
              <span>EVOLVE ARCHITECTURE (TIER {building.level + 1})</span>
            </button>
          ) : (
            <div className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-[#090c12] border border-[#ff5500]/30 text-[#ff8533] font-bold text-xs">
              <ArrowUpCircle className="w-4 h-4 text-[#ff5500]" />
              <span>APEX TIER 8 ASCENSION</span>
            </div>
          )}

          <button
            onClick={() => demolishBuilding(building.id)}
            className="p-2.5 rounded-xl bg-rose-950/40 hover:bg-rose-900 border border-rose-500/50 text-[#ef4444] transition-colors cursor-pointer"
            title="Decommission Structure"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
