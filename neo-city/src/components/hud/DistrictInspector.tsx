import React from 'react';
import { useCityStore } from '../../store/useCityStore';
import { DISTRICT_ZONES, calculateDistrictSpatialMetrics } from '../../systems/city/DistrictLayoutSystem';
import {
  Compass,
  Building,
  TreePine,
  ShieldCheck,
  Maximize2,
  X,
} from 'lucide-react';

export const DistrictInspector: React.FC = () => {
  const activeDistrict = useCityStore((state) => state.activeDistrictInspector);
  const inspectDistrict = useCityStore((state) => state.inspectDistrict);
  const buildings = useCityStore((state) => state.buildings);
  const evolution = useCityStore((state) => state.stats.districtEvolution);
  const flyToDistrict = useCityStore((state) => state.flyToDistrict);

  if (!activeDistrict) return null;

  const def = DISTRICT_ZONES[activeDistrict];
  if (!def) return null;

  const metrics = calculateDistrictSpatialMetrics(activeDistrict, buildings);
  const evoState = evolution ? evolution[activeDistrict] : null;

  const handleFlyTo = () => {
    const map: Record<string, string> = {
      downtown: 'Downtown',
      tech_district: 'Innovation',
      residential: 'Residential',
      industrial: 'Energy',
      green_zone: 'Botanical',
      waterfront: 'Waterfront',
    };
    flyToDistrict(map[activeDistrict] || 'Overview');
  };

  return (
    <div className="fixed bottom-24 left-4 z-40 max-w-sm w-full font-mono text-xs pointer-events-auto select-none">
      <div className="orbital-surface-elevated rounded-2xl p-4 border border-[#ff5500]/40 shadow-[0_20px_50px_rgba(0,0,0,0.85)] space-y-3">
        {/* Card Header */}
        <div className="flex items-start justify-between gap-2 border-b border-white/10 pb-2">
          <div className="flex items-center gap-2">
            <div
              className="w-3.5 h-3.5 rounded-full shadow-md"
              style={{ backgroundColor: def.color }}
            />
            <div>
              <span className="text-[10px] text-[#64748b] uppercase font-bold block">
                SECTOR ARCHITECTURE // SPATIAL SURVEY
              </span>
              <h3 className="font-['Chakra_Petch'] font-black text-[#fcfaf6] text-base leading-tight">
                {def.name}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={handleFlyTo}
              title="Fly camera to district view"
              className="p-1.5 rounded-lg bg-[#090c12] hover:bg-[#161b26] text-[#ded6c8] transition-colors cursor-pointer"
            >
              <Maximize2 className="w-3.5 h-3.5 text-[#ff5500]" />
            </button>
            <button
              onClick={() => inspectDistrict(null)}
              className="p-1.5 rounded-lg text-[#64748b] hover:text-[#fcfaf6] transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <p className="text-[11px] text-[#ded6c8] leading-snug">{def.description}</p>

        {/* Spatial Planning Metrics */}
        <div className="grid grid-cols-2 gap-2 text-[11px]">
          <div className="p-2 rounded-lg bg-[#090c12] border border-white/10 flex items-center gap-2">
            <Building className="w-4 h-4 text-[#ffaa00]" />
            <div>
              <span className="text-[9px] text-[#64748b] uppercase block">Structures</span>
              <strong className="text-[#fcfaf6] font-bold">{metrics.buildingCount}</strong>
            </div>
          </div>

          <div className="p-2 rounded-lg bg-[#090c12] border border-white/10 flex items-center gap-2">
            <TreePine className="w-4 h-4 text-[#00e676]" />
            <div>
              <span className="text-[9px] text-[#64748b] uppercase block">Open Space</span>
              <strong className="text-[#00e676] font-bold">
                {Math.round(metrics.openSpaceRatio * 100)}%
              </strong>
            </div>
          </div>

          <div className="p-2 rounded-lg bg-[#090c12] border border-white/10 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#ff8533]" />
            <div>
              <span className="text-[9px] text-[#64748b] uppercase block">Density Model</span>
              <strong className="text-[#ede5d8] font-bold uppercase">
                {def.preferredDensity}
              </strong>
            </div>
          </div>

          <div className="p-2 rounded-lg bg-[#090c12] border border-white/10 flex items-center gap-2">
            <Compass className="w-4 h-4 text-[#38bdf8]" />
            <div>
              <span className="text-[9px] text-[#64748b] uppercase block">Height Cap</span>
              <strong className="text-[#38bdf8] font-bold">{def.maxBuildingHeight}m</strong>
            </div>
          </div>
        </div>

        {/* District Evolution Tier */}
        {evoState && (
          <div className="p-2.5 rounded-lg bg-[#090c12] border border-[#ff5500]/30 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-[#ff8533] font-bold uppercase block">
                EVOLUTION TIER {evoState.tier}
              </span>
              <span className="text-[10px] text-[#64748b]">
                Prosperity: {evoState.prosperity}% • Health: {evoState.infrastructureHealth}%
              </span>
            </div>
            <span className="px-2 py-0.5 rounded bg-[#ff5500]/20 text-[#ff8533] text-[10px] font-bold border border-[#ff5500]/40">
              SCORE {evoState.developmentScore}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
