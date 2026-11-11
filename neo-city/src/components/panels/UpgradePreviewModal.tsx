import React from 'react';
import { useCityStore } from '../../store/useCityStore';
import { getBuildingTierInfo } from '../../data/tierEvolutionData';
import { X, ArrowUpCircle, Sparkles, Check, ShieldAlert } from 'lucide-react';

export const UpgradePreviewModal: React.FC = () => {
  const upgradePreviewBuildingId = useCityStore((state) => state.upgradePreviewBuildingId);
  const closeUpgradePreview = useCityStore((state) => state.closeUpgradePreview);
  const buildings = useCityStore((state) => state.buildings);
  const treasury = useCityStore((state) => state.stats.treasury);
  const upgradeBuilding = useCityStore((state) => state.upgradeBuilding);

  if (!upgradePreviewBuildingId) return null;

  const building = buildings.find((b) => b.id === upgradePreviewBuildingId);
  if (!building) return null;

  const currentTier = building.level || 1;
  const currentInfo = getBuildingTierInfo(building.style, currentTier);
  const isMaxTier = currentTier >= 8;
  const nextTier = Math.min(8, currentTier + 1);
  const nextInfo = getBuildingTierInfo(building.style, nextTier);

  const canAfford = treasury >= nextInfo.cost;

  const handleConfirm = () => {
    if (canAfford && !isMaxTier) {
      upgradeBuilding(building.id);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 pointer-events-auto">
      <div className="game-hud-panel w-full max-w-lg rounded-2xl p-5 border border-amber-400/30 shadow-[0_20px_60px_rgba(0,0,0,0.9)] flex flex-col gap-4 font-mono text-xs">
        {/* HEADER */}
        <div className="flex items-start justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center text-slate-950 shadow-[0_0_15px_rgba(245,158,11,0.4)]">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider block">
                ARCHITECTURAL EVOLUTION
              </span>
              <h2 className="font-['Chakra_Petch'] text-lg font-bold text-white">
                {building.name}
              </h2>
            </div>
          </div>

          <button
            onClick={closeUpgradePreview}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* TIER COMPARISON CARDS */}
        <div className="grid grid-cols-2 gap-3">
          {/* Current Tier */}
          <div className="p-3 rounded-xl bg-slate-900/80 border border-white/10 flex flex-col gap-1.5">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider">CURRENT STATE</span>
            <div className="flex items-baseline gap-1.5">
              <span className="font-['Chakra_Petch'] text-base font-bold text-slate-200">
                TIER {currentTier}
              </span>
            </div>
            <strong className="text-white text-xs font-semibold">{currentInfo.name}</strong>
            <p className="text-[11px] font-sans text-slate-400 leading-tight">
              {currentInfo.description}
            </p>
          </div>

          {/* Next Evolution Tier */}
          <div className="p-3 rounded-xl bg-amber-950/30 border border-amber-400/50 flex flex-col gap-1.5 shadow-[0_0_15px_rgba(245,158,11,0.15)]">
            <span className="text-[10px] text-amber-300 uppercase tracking-wider flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-400" /> EVOLUTION TARGET
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="font-['Chakra_Petch'] text-base font-bold text-amber-400">
                TIER {nextTier}
              </span>
              {isMaxTier && <span className="text-[10px] text-emerald-400 font-bold">(MAX APEX)</span>}
            </div>
            <strong className="text-amber-200 text-xs font-semibold">{nextInfo.name}</strong>
            <p className="text-[11px] font-sans text-amber-100/80 leading-tight">
              {nextInfo.description}
            </p>
          </div>
        </div>

        {/* ARCHITECTURAL UPGRADE PERKS & STATS */}
        <div className="p-3 rounded-xl bg-slate-900/60 border border-white/10 flex flex-col gap-2">
          <span className="text-white font-bold uppercase text-[10px] tracking-wider text-slate-300">
            METROPOLITAN IMPACT & GEOMETRY CHANGES
          </span>

          <div className="grid grid-cols-2 gap-2 text-[11px]">
            <div className="flex justify-between border-b border-white/5 pb-1">
              <span className="text-slate-400">Structural Height:</span>
              <strong className="text-amber-300">+{nextInfo.heightBonus}m</strong>
            </div>
            <div className="flex justify-between border-b border-white/5 pb-1">
              <span className="text-slate-400">Citizen Capacity:</span>
              <strong className="text-purple-300">
                +{Math.round((nextInfo.occupancyMultiplier - 1) * 100)}%
              </strong>
            </div>
            <div className="flex justify-between border-b border-white/5 pb-1">
              <span className="text-slate-400">Employment Slots:</span>
              <strong className="text-emerald-300">
                +{Math.round((nextInfo.jobsMultiplier - 1) * 100)}%
              </strong>
            </div>
            <div className="flex justify-between border-b border-white/5 pb-1">
              <span className="text-slate-400">Cycle Revenue:</span>
              <strong className="text-amber-300">
                +{Math.round((nextInfo.revenueMultiplier - 1) * 100)}%
              </strong>
            </div>
          </div>

          {/* Visual features gained */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            {nextInfo.features.exoskeleton && (
              <span className="text-[9px] bg-slate-800 text-slate-200 px-2 py-0.5 rounded border border-white/10">
                + Structural Exoskeleton
              </span>
            )}
            {nextInfo.features.hasSkybridge && (
              <span className="text-[9px] bg-blue-950/60 text-blue-300 px-2 py-0.5 rounded border border-blue-400/30">
                + Illuminated Skybridge
              </span>
            )}
            {nextInfo.features.hasHelipad && (
              <span className="text-[9px] bg-amber-950/60 text-amber-300 px-2 py-0.5 rounded border border-amber-400/30">
                + Aviation Helipad
              </span>
            )}
            {nextInfo.features.hasTerraceGardens && (
              <span className="text-[9px] bg-emerald-950/60 text-emerald-300 px-2 py-0.5 rounded border border-emerald-400/30">
                + Vertical Bio-Terraces
              </span>
            )}
            {nextInfo.features.apexSpire && (
              <span className="text-[9px] bg-purple-950/60 text-purple-300 px-2 py-0.5 rounded border border-purple-400/30">
                + Apex Sovereign Spire
              </span>
            )}
          </div>
        </div>

        {/* UPGRADE COST & CONFIRMATION ACTION */}
        <div className="pt-2 border-t border-white/10 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-400 block">UPGRADE INVESTMENT</span>
            <span className="font-['Chakra_Petch'] text-base font-bold text-amber-400">
              ₡{nextInfo.cost.toLocaleString()} CR
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={closeUpgradePreview}
              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold transition-all cursor-pointer"
            >
              Cancel
            </button>

            {isMaxTier ? (
              <div className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-950/40 border border-emerald-400 text-emerald-300 font-bold">
                <Check className="w-4 h-4" />
                <span>MAX TIER REACHED</span>
              </div>
            ) : !canAfford ? (
              <div className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-950/40 border border-rose-500 text-rose-300 font-bold">
                <ShieldAlert className="w-4 h-4" />
                <span>INSUFFICIENT FUNDS</span>
              </div>
            ) : (
              <button
                onClick={handleConfirm}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold shadow-[0_0_15px_rgba(245,158,11,0.5)] transition-all cursor-pointer"
              >
                <ArrowUpCircle className="w-4 h-4" />
                <span>AUTHORIZE CONSTRUCTION</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
