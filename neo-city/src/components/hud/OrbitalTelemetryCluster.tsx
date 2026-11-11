import React from 'react';
import { useCityStore } from '../../store/useCityStore';
import {
  Users,
  Coins,
  Zap,
  Droplets,
  Navigation,
  Wind,
  Smile,
  FlaskConical,
  TrendingUp,
} from 'lucide-react';

interface Props {
  onSelectResource: (resourceId: string) => void;
  selectedResource: string | null;
}

export const OrbitalTelemetryCluster: React.FC<Props> = ({
  onSelectResource,
  selectedResource,
}) => {
  const stats = useCityStore((state) => state.stats);

  const netIncome = Math.round((stats.incomePerTick - stats.expensesPerTick) / 1000);
  const netIncomeFormatted = netIncome >= 0 ? `+${netIncome}K` : `${netIncome}K`;

  // Energy & Water load calculations
  const powerPercent = Math.min(
    100,
    Math.round((stats.powerUsage / Math.max(1, stats.powerCapacity)) * 100)
  );
  const waterPercent = Math.min(
    100,
    Math.round((stats.waterUsage / Math.max(1, stats.waterCapacity)) * 100)
  );

  return (
    <div className="flex items-center gap-2.5 font-mono select-none">
      {/* ========================================================
          1. POPULATION READOUT (Large Typographic Figure)
          ======================================================== */}
      <div
        onClick={() => onSelectResource('population')}
        className={`orbital-cut-corner px-3 py-1.5 flex items-center gap-2.5 bg-[#0d1017] border cursor-pointer transition-all ${
          selectedResource === 'population'
            ? 'border-[#ff5500] shadow-[0_0_15px_rgba(255,85,0,0.35)]'
            : 'border-white/10 hover:border-white/30'
        }`}
        title="Metropolitan Population & Demographic Life"
      >
        <div className="w-7 h-7 rounded-lg bg-[#1a202c] flex items-center justify-center text-[#fcfaf6]">
          <Users className="w-3.5 h-3.5" />
        </div>
        <div>
          <div className="text-[9px] text-[#64748b] tracking-widest uppercase font-semibold">POPULATION</div>
          <div className="flex items-baseline gap-1.5 leading-none mt-0.5">
            <span className="font-['Chakra_Petch'] font-black text-sm md:text-base text-[#fcfaf6]">
              {stats.population >= 1000000
                ? `${(stats.population / 1000000).toFixed(2)}M`
                : `${(stats.population / 1000).toFixed(1)}K`}
            </span>
            <span className="text-[9px] text-[#00e676] font-bold flex items-center">
              <TrendingUp className="w-2.5 h-2.5 mr-0.5" />
              {stats.populationGrowthRate}%
            </span>
          </div>
        </div>
      </div>

      {/* ========================================================
          2. TREASURY READOUT (Prominent Signal Orange Readout)
          ======================================================== */}
      <div
        onClick={() => onSelectResource('treasury')}
        className={`orbital-cut-corner px-3 py-1.5 flex items-center gap-2.5 bg-[#0d1017] border cursor-pointer transition-all ${
          selectedResource === 'treasury'
            ? 'border-[#ff5500] shadow-[0_0_15px_rgba(255,85,0,0.35)]'
            : 'border-white/10 hover:border-white/30'
        }`}
        title="Sovereign Treasury Reserves & Cashflow"
      >
        <div className="w-7 h-7 rounded-lg bg-[#ff5500]/20 border border-[#ff5500]/40 flex items-center justify-center text-[#ff5500]">
          <Coins className="w-3.5 h-3.5" />
        </div>
        <div>
          <div className="text-[9px] text-[#ff8533] tracking-widest uppercase font-semibold">TREASURY</div>
          <div className="flex items-baseline gap-1.5 leading-none mt-0.5">
            <span className="font-['Chakra_Petch'] font-black text-sm md:text-base text-[#ff5500]">
              ₡{(stats.treasury / 1000000).toFixed(2)}M
            </span>
            <span
              className={`text-[9px] font-bold px-1 py-0.2 rounded ${
                netIncome >= 0 ? 'bg-emerald-950/60 text-[#00e676]' : 'bg-rose-950/60 text-[#ef4444]'
              }`}
            >
              {netIncomeFormatted}/c
            </span>
          </div>
        </div>
      </div>

      {/* ========================================================
          3. UTILITY CAPACITY INSTRUMENTS (Power & Water Meters)
          ======================================================== */}
      <div
        onClick={() => onSelectResource('utilities')}
        className={`orbital-cut-corner px-3 py-1.5 flex items-center gap-3 bg-[#0d1017] border cursor-pointer transition-all ${
          selectedResource === 'utilities'
            ? 'border-[#ff5500] shadow-[0_0_15px_rgba(255,85,0,0.35)]'
            : 'border-white/10 hover:border-white/30'
        }`}
        title="High-Voltage Microgrid & Aqueduct Hydraulic Volumes"
      >
        {/* Plasma Power Meter */}
        <div className="flex flex-col gap-1 w-20">
          <div className="flex items-center justify-between text-[8px] font-bold">
            <span className="flex items-center gap-0.5 text-[#ffaa00]">
              <Zap className="w-2.5 h-2.5" /> GRID
            </span>
            <span className={stats.powerDeficit ? 'text-[#ef4444]' : 'text-[#fcfaf6]'}>
              {Math.round(stats.powerUsage)}MW
            </span>
          </div>
          <div className="h-1.5 w-full bg-[#161b26] rounded-full overflow-hidden flex">
            <div
              className={`h-full transition-all duration-300 ${
                stats.powerDeficit ? 'bg-[#ef4444]' : powerPercent > 85 ? 'bg-[#ffaa00]' : 'bg-[#00e676]'
              }`}
              style={{ width: `${powerPercent}%` }}
            />
          </div>
        </div>

        <div className="w-[1px] h-6 bg-white/10" />

        {/* Aqueduct Water Meter */}
        <div className="flex flex-col gap-1 w-20">
          <div className="flex items-center justify-between text-[8px] font-bold">
            <span className="flex items-center gap-0.5 text-[#38bdf8]">
              <Droplets className="w-2.5 h-2.5" /> WATER
            </span>
            <span className={stats.waterDeficit ? 'text-[#ef4444]' : 'text-[#fcfaf6]'}>
              {stats.waterUsage}ML
            </span>
          </div>
          <div className="h-1.5 w-full bg-[#161b26] rounded-full overflow-hidden flex">
            <div
              className={`h-full transition-all duration-300 ${
                stats.waterDeficit ? 'bg-[#ef4444]' : waterPercent > 85 ? 'bg-[#ffaa00]' : 'bg-[#38bdf8]'
              }`}
              style={{ width: `${waterPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* ========================================================
          4. TRANSIT ROUTE EFFICIENCY GAUGE
          ======================================================== */}
      <div
        onClick={() => onSelectResource('transit')}
        className={`orbital-cut-corner px-2.5 py-1.5 flex items-center gap-2 bg-[#0d1017] border cursor-pointer transition-all ${
          selectedResource === 'transit'
            ? 'border-[#ff5500] shadow-[0_0_15px_rgba(255,85,0,0.35)]'
            : 'border-white/10 hover:border-white/30'
        }`}
        title="Maglev & Skyway Transit Efficiency"
      >
        {/* Radial Mini Gauge Ring */}
        <div className="relative w-7 h-7 flex items-center justify-center">
          <svg className="w-7 h-7 -rotate-90">
            <circle cx="14" cy="14" r="10" stroke="#161b26" strokeWidth="2.5" fill="none" />
            <circle
              cx="14"
              cy="14"
              r="10"
              stroke="#00e676"
              strokeWidth="2.5"
              fill="none"
              strokeDasharray={62.8}
              strokeDashoffset={62.8 * (1 - stats.transitStats.efficiencyPercent / 100)}
              strokeLinecap="round"
            />
          </svg>
          <Navigation className="w-2.5 h-2.5 text-[#00e676] absolute" />
        </div>
        <div>
          <div className="text-[8px] text-[#64748b] font-bold">TRANSIT</div>
          <div className="text-xs font-['Chakra_Petch'] font-black text-[#fcfaf6]">
            {stats.transitStats.efficiencyPercent}%
          </div>
        </div>
      </div>

      {/* ========================================================
          5. AIR QUALITY GAUGE (AQI)
          ======================================================== */}
      <div
        onClick={() => onSelectResource('environment')}
        className={`orbital-cut-corner px-2.5 py-1.5 flex items-center gap-2 bg-[#0d1017] border cursor-pointer transition-all ${
          selectedResource === 'environment'
            ? 'border-[#ff5500] shadow-[0_0_15px_rgba(255,85,0,0.35)]'
            : 'border-white/10 hover:border-white/30'
        }`}
        title="Atmospheric Quality Index (AQI)"
      >
        <div className="relative w-7 h-7 flex items-center justify-center">
          <svg className="w-7 h-7 -rotate-90">
            <circle cx="14" cy="14" r="10" stroke="#161b26" strokeWidth="2.5" fill="none" />
            <circle
              cx="14"
              cy="14"
              r="10"
              stroke={stats.pollution < 25 ? '#00e676' : stats.pollution < 50 ? '#ffaa00' : '#ef4444'}
              strokeWidth="2.5"
              fill="none"
              strokeDasharray={62.8}
              strokeDashoffset={62.8 * (1 - Math.min(100, stats.pollution) / 100)}
              strokeLinecap="round"
            />
          </svg>
          <Wind className="w-2.5 h-2.5 text-[#ded6c8] absolute" />
        </div>
        <div>
          <div className="text-[8px] text-[#64748b] font-bold">AQI</div>
          <div
            className={`text-xs font-['Chakra_Petch'] font-black ${
              stats.pollution < 25 ? 'text-[#00e676]' : stats.pollution < 50 ? 'text-[#ffaa00]' : 'text-[#ef4444]'
            }`}
          >
            {stats.pollution}
          </div>
        </div>
      </div>

      {/* ========================================================
          6. MOOD & SENTIMENT INDICATOR
          ======================================================== */}
      <div
        onClick={() => onSelectResource('sentiment')}
        className={`orbital-cut-corner px-2.5 py-1.5 flex items-center gap-2 bg-[#0d1017] border cursor-pointer transition-all ${
          selectedResource === 'sentiment'
            ? 'border-[#ff5500] shadow-[0_0_15px_rgba(255,85,0,0.35)]'
            : 'border-white/10 hover:border-white/30'
        }`}
        title="Citizen Approval & Metropolitan Sentiment"
      >
        <div className="w-7 h-7 rounded-lg bg-[#00e676]/15 border border-[#00e676]/30 flex items-center justify-center text-[#00e676]">
          <Smile className="w-3.5 h-3.5" />
        </div>
        <div>
          <div className="text-[8px] text-[#64748b] font-bold">SENTIMENT</div>
          <div className="text-xs font-['Chakra_Petch'] font-black text-[#00e676]">
            {stats.happiness}%
          </div>
        </div>
      </div>

      {/* ========================================================
          7. RESEARCH (RP) READOUT
          ======================================================== */}
      <div
        onClick={() => onSelectResource('research')}
        className={`orbital-cut-corner px-2.5 py-1.5 flex items-center gap-2 bg-[#0d1017] border cursor-pointer transition-all ${
          selectedResource === 'research'
            ? 'border-[#ff5500] shadow-[0_0_15px_rgba(255,85,0,0.35)]'
            : 'border-white/10 hover:border-white/30'
        }`}
        title="Planetary Research Points & Scientific Tech Tree"
      >
        <div className="w-7 h-7 rounded-lg bg-[#ff5500]/15 border border-[#ff5500]/30 flex items-center justify-center text-[#ff5500]">
          <FlaskConical className="w-3.5 h-3.5" />
        </div>
        <div>
          <div className="text-[8px] text-[#ff8533] font-bold">RESEARCH</div>
          <div className="text-xs font-['Chakra_Petch'] font-black text-[#fcfaf6]">
            {stats.researchPoints} <span className="text-[9px] text-[#64748b]">RP</span>
          </div>
        </div>
      </div>
    </div>
  );
};
