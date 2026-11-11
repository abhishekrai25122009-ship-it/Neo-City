import React from 'react';
import { useCityStore } from '../../store/useCityStore';
import {
  X,
  Zap,
  Droplets,
  Coins,
  Users,
  Navigation,
  Building2,
} from 'lucide-react';

interface Props {
  resourceId: string | null;
  onClose: () => void;
}

export const ContextualResourceSurface: React.FC<Props> = ({ resourceId, onClose }) => {
  const stats = useCityStore((state) => state.stats);
  const taxRate = useCityStore((state) => state.taxRate);
  const setTaxRate = useCityStore((state) => state.setTaxRate);
  const toggleDrawer = useCityStore((state) => state.toggleDrawer);
  const flyToDistrict = useCityStore((state) => state.flyToDistrict);

  if (!resourceId) return null;

  // Render contextual content according to the active resource
  const renderContent = () => {
    switch (resourceId) {
      case 'utilities': {
        const powerNet = Math.round(stats.powerCapacity - stats.powerUsage);
        const waterNet = Math.round(stats.waterCapacity - stats.waterUsage);

        return (
          <div className="flex flex-col gap-5">
            {/* Split Dual Utility Instrument */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Plasma Power Matrix */}
              <div className="p-4 rounded-xl bg-[#090c12] border border-white/10 flex flex-col gap-3">
                <div className="flex items-center justify-between border-b border-white/10 pb-2">
                  <div className="flex items-center gap-2 text-[#ffaa00]">
                    <Zap className="w-4 h-4" />
                    <span className="font-['Chakra_Petch'] font-bold text-sm tracking-wide">
                      HIGH-VOLTAGE PLASMA GRID
                    </span>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      stats.powerDeficit
                        ? 'bg-rose-950 text-[#ef4444] border border-rose-500/50'
                        : 'bg-emerald-950 text-[#00e676] border border-emerald-500/50'
                    }`}
                  >
                    {stats.powerDeficit ? 'GRID OVERLOAD' : 'SYNCHRONIZED'}
                  </span>
                </div>

                <div className="flex items-baseline justify-between">
                  <div>
                    <div className="text-[10px] text-[#64748b]">ACTIVE CONSUMPTION</div>
                    <div className="text-2xl font-['Chakra_Petch'] font-black text-[#fcfaf6]">
                      {Math.round(stats.powerUsage)} <span className="text-xs text-[#64748b]">MW</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] text-[#64748b]">GRID CAPACITY</div>
                    <div className="text-2xl font-['Chakra_Petch'] font-black text-[#ffaa00]">
                      {stats.powerCapacity} <span className="text-xs text-[#64748b]">MW</span>
                    </div>
                  </div>
                </div>

                {/* Segmented LED Bar */}
                <div className="h-3 bg-[#131722] rounded-md overflow-hidden p-0.5 border border-white/5 flex gap-1">
                  {Array.from({ length: 20 }).map((_, i) => {
                    const threshold = (i + 1) * 5;
                    const fillPercent = (stats.powerUsage / Math.max(1, stats.powerCapacity)) * 100;
                    const isFilled = fillPercent >= threshold;
                    return (
                      <div
                        key={i}
                        className={`h-full flex-1 rounded-sm transition-all ${
                          isFilled
                            ? stats.powerDeficit || threshold > 90
                              ? 'bg-[#ef4444]'
                              : threshold > 75
                              ? 'bg-[#ffaa00]'
                              : 'bg-[#00e676]'
                            : 'bg-white/5'
                        }`}
                      />
                    );
                  })}
                </div>

                <div className="text-[11px] text-[#ded6c8] flex items-center justify-between">
                  <span>NET MARGIN:</span>
                  <span className={powerNet >= 0 ? 'text-[#00e676] font-bold' : 'text-[#ef4444] font-bold'}>
                    {powerNet >= 0 ? `+${powerNet} MW SURPLUS` : `${powerNet} MW SHORTAGE`}
                  </span>
                </div>
              </div>

              {/* Aqueduct Hydraulic Matrix */}
              <div className="p-4 rounded-xl bg-[#090c12] border border-white/10 flex flex-col gap-3">
                <div className="flex items-center justify-between border-b border-white/10 pb-2">
                  <div className="flex items-center gap-2 text-[#38bdf8]">
                    <Droplets className="w-4 h-4" />
                    <span className="font-['Chakra_Petch'] font-bold text-sm tracking-wide">
                      AQUEDUCT HYDRAULIC MATRIX
                    </span>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      stats.waterDeficit
                        ? 'bg-rose-950 text-[#ef4444] border border-rose-500/50'
                        : 'bg-emerald-950 text-[#00e676] border border-emerald-500/50'
                    }`}
                  >
                    {stats.waterDeficit ? 'AQUIFER DEFICIT' : 'OPTIMAL PRESSURE'}
                  </span>
                </div>

                <div className="flex items-baseline justify-between">
                  <div>
                    <div className="text-[10px] text-[#64748b]">DRAW DEMAND</div>
                    <div className="text-2xl font-['Chakra_Petch'] font-black text-[#fcfaf6]">
                      {stats.waterUsage} <span className="text-xs text-[#64748b]">ML</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] text-[#64748b]">TOTAL SUPPLY</div>
                    <div className="text-2xl font-['Chakra_Petch'] font-black text-[#38bdf8]">
                      {stats.waterCapacity} <span className="text-xs text-[#64748b]">ML</span>
                    </div>
                  </div>
                </div>

                {/* Segmented LED Bar */}
                <div className="h-3 bg-[#131722] rounded-md overflow-hidden p-0.5 border border-white/5 flex gap-1">
                  {Array.from({ length: 20 }).map((_, i) => {
                    const threshold = (i + 1) * 5;
                    const fillPercent = (stats.waterUsage / Math.max(1, stats.waterCapacity)) * 100;
                    const isFilled = fillPercent >= threshold;
                    return (
                      <div
                        key={i}
                        className={`h-full flex-1 rounded-sm transition-all ${
                          isFilled
                            ? stats.waterDeficit || threshold > 90
                              ? 'bg-[#ef4444]'
                              : 'bg-[#38bdf8]'
                            : 'bg-white/5'
                        }`}
                      />
                    );
                  })}
                </div>

                <div className="text-[11px] text-[#ded6c8] flex items-center justify-between">
                  <span>NET HYDRATION:</span>
                  <span className={waterNet >= 0 ? 'text-[#00e676] font-bold' : 'text-[#ef4444] font-bold'}>
                    {waterNet >= 0 ? `+${waterNet} ML SURPLUS` : `${waterNet} ML DEFICIT`}
                  </span>
                </div>
              </div>
            </div>

            {/* Tactical Grid Management Actions */}
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => {
                  toggleDrawer('construction');
                  onClose();
                }}
                className="px-4 py-2 rounded-xl bg-[#ff5500] hover:bg-[#ff6b00] text-[#05070a] font-bold text-xs flex items-center gap-2 transition-all cursor-pointer shadow-[0_0_15px_rgba(255,85,0,0.4)]"
              >
                <Zap className="w-3.5 h-3.5" />
                <span>BUILD POWER/WATER INFRASTRUCTURE</span>
              </button>
              <button
                onClick={() => {
                  flyToDistrict('Energy');
                  onClose();
                }}
                className="px-4 py-2 rounded-xl bg-[#0d1017] hover:bg-[#161b26] border border-white/15 text-[#ded6c8] font-semibold text-xs flex items-center gap-2 transition-all cursor-pointer"
              >
                <Building2 className="w-3.5 h-3.5" />
                <span>INSPECT CLEAN FUSION SECTOR</span>
              </button>
            </div>
          </div>
        );
      }

      case 'treasury': {
        return (
          <div className="flex flex-col gap-5">
            {/* Financial Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-[#090c12] border border-[#ff5500]/30 flex flex-col gap-1">
                <span className="text-[10px] text-[#ff8533] uppercase font-bold">SOVEREIGN RESERVES</span>
                <span className="text-3xl font-['Chakra_Petch'] font-black text-[#ff5500]">
                  ₡{(stats.treasury / 1000000).toFixed(2)}M
                </span>
                <span className="text-[10px] text-[#64748b]">Total liquid municipal credits</span>
              </div>

              <div className="p-4 rounded-xl bg-[#090c12] border border-white/10 flex flex-col gap-1">
                <span className="text-[10px] text-[#00e676] uppercase font-bold">MUNICIPAL REVENUE</span>
                <span className="text-3xl font-['Chakra_Petch'] font-black text-[#00e676]">
                  +₡{Math.round(stats.incomePerTick / 1000)}K<span className="text-xs text-[#64748b]">/c</span>
                </span>
                <span className="text-[10px] text-[#64748b]">Corporate taxes, trade & duties</span>
              </div>

              <div className="p-4 rounded-xl bg-[#090c12] border border-white/10 flex flex-col gap-1">
                <span className="text-[10px] text-[#ef4444] uppercase font-bold">UPKEEP & EXPENSES</span>
                <span className="text-3xl font-['Chakra_Petch'] font-black text-[#ef4444]">
                  -₡{Math.round(stats.expensesPerTick / 1000)}K<span className="text-xs text-[#64748b]">/c</span>
                </span>
                <span className="text-[10px] text-[#64748b]">Infrastructure maintenance & services</span>
              </div>
            </div>

            {/* Tax Policy Control */}
            <div className="p-4 rounded-xl bg-[#090c12] border border-white/10 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-['Chakra_Petch'] font-bold text-sm text-[#fcfaf6]">
                    MUNICIPAL TAXATION LEVY
                  </span>
                  <div className="text-[11px] text-[#64748b]">
                    Current Rate: <span className="text-[#ff5500] font-bold">{taxRate}%</span> (Higher tax increases cashflow but dampens happiness)
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {[6, 8, 10, 12, 15].map((rate) => (
                    <button
                      key={rate}
                      onClick={() => setTaxRate(rate)}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        taxRate === rate
                          ? 'bg-[#ff5500] text-[#05070a] shadow-[0_0_10px_rgba(255,85,0,0.5)]'
                          : 'bg-[#131722] text-[#ded6c8] hover:bg-[#1a202c]'
                      }`}
                    >
                      {rate}%
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  toggleDrawer('economy');
                  onClose();
                }}
                className="px-4 py-2 rounded-xl bg-[#ff5500] hover:bg-[#ff6b00] text-[#05070a] font-bold text-xs flex items-center gap-2 transition-all cursor-pointer"
              >
                <Coins className="w-3.5 h-3.5" />
                <span>OPEN FULL ECONOMIC ARCHIVE & TRADE</span>
              </button>
            </div>
          </div>
        );
      }

      case 'population': {
        const housingCapacity = stats.totalHousingCapacity || stats.population * 1.25;
        const occRatio = Math.round((stats.population / Math.max(1, housingCapacity)) * 100);

        return (
          <div className="flex flex-col gap-5">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-[#090c12] border border-white/10 flex flex-col gap-1">
                <span className="text-[10px] text-[#64748b] uppercase font-bold">REGISTERED CITIZENS</span>
                <span className="text-3xl font-['Chakra_Petch'] font-black text-[#fcfaf6]">
                  {stats.population.toLocaleString()}
                </span>
                <span className="text-[10px] text-[#00e676]">Growth Pull: +{stats.populationGrowthRate}%/cycle</span>
              </div>

              <div className="p-4 rounded-xl bg-[#090c12] border border-white/10 flex flex-col gap-1">
                <span className="text-[10px] text-[#64748b] uppercase font-bold">HOUSING CAPACITY</span>
                <span className="text-3xl font-['Chakra_Petch'] font-black text-[#fcfaf6]">
                  {Math.round(housingCapacity).toLocaleString()}
                </span>
                <span className="text-[10px] text-[#ded6c8]">Occupancy: {occRatio}%</span>
              </div>

              <div className="p-4 rounded-xl bg-[#090c12] border border-white/10 flex flex-col gap-1">
                <span className="text-[10px] text-[#64748b] uppercase font-bold">EMPLOYMENT SLOTS</span>
                <span className="text-3xl font-['Chakra_Petch'] font-black text-[#00e676]">
                  {stats.totalJobs ? stats.totalJobs.toLocaleString() : '84,200'}
                </span>
                <span className="text-[10px] text-[#ded6c8]">Unemployment: {stats.unemploymentRate || 2.4}%</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  toggleDrawer('demographics');
                  onClose();
                }}
                className="px-4 py-2 rounded-xl bg-[#ff5500] hover:bg-[#ff6b00] text-[#05070a] font-bold text-xs flex items-center gap-2 transition-all cursor-pointer"
              >
                <Users className="w-3.5 h-3.5" />
                <span>VIEW CITIZEN LIFE & DEMOGRAPHICS</span>
              </button>
              <button
                onClick={() => {
                  flyToDistrict('Residential');
                  onClose();
                }}
                className="px-4 py-2 rounded-xl bg-[#0d1017] hover:bg-[#161b26] border border-white/15 text-[#ded6c8] font-semibold text-xs flex items-center gap-2 transition-all cursor-pointer"
              >
                <Building2 className="w-3.5 h-3.5" />
                <span>FLY TO RESIDENTIAL ARCOLOGIES</span>
              </button>
            </div>
          </div>
        );
      }

      case 'transit': {
        return (
          <div className="flex flex-col gap-5">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-[#090c12] border border-white/10 flex flex-col gap-1">
                <span className="text-[10px] text-[#00e676] uppercase font-bold">SYSTEM EFFICIENCY</span>
                <span className="text-3xl font-['Chakra_Petch'] font-black text-[#00e676]">
                  {stats.transitStats.efficiencyPercent}%
                </span>
                <span className="text-[10px] text-[#64748b]">Maglev loops & curved skyways synchronized</span>
              </div>

              <div className="p-4 rounded-xl bg-[#090c12] border border-white/10 flex flex-col gap-1">
                <span className="text-[10px] text-[#64748b] uppercase font-bold">AVG COMMUTE TIME</span>
                <span className="text-3xl font-['Chakra_Petch'] font-black text-[#fcfaf6]">
                  {stats.transitStats.avgCommuteMinutes} <span className="text-xs text-[#64748b]">min</span>
                </span>
                <span className="text-[10px] text-[#00e676]">Sub-15m target achieved</span>
              </div>

              <div className="p-4 rounded-xl bg-[#090c12] border border-white/10 flex flex-col gap-1">
                <span className="text-[10px] text-[#64748b] uppercase font-bold">CONGESTION INDEX</span>
                <span className="text-3xl font-['Chakra_Petch'] font-black text-[#ffaa00]">
                  {stats.transitStats.congestionIndex}%
                </span>
                <span className="text-[10px] text-[#64748b]">Surface avenue traffic load</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  toggleDrawer('transit');
                  onClose();
                }}
                className="px-4 py-2 rounded-xl bg-[#ff5500] hover:bg-[#ff6b00] text-[#05070a] font-bold text-xs flex items-center gap-2 transition-all cursor-pointer"
              >
                <Navigation className="w-3.5 h-3.5" />
                <span>OPEN TRANSIT TELEMETRY DRAWER</span>
              </button>
            </div>
          </div>
        );
      }

      default:
        return null;
    }
  };

  const getTitle = () => {
    switch (resourceId) {
      case 'utilities':
        return 'ENERGY & WATER COMMAND';
      case 'treasury':
        return 'MUNICIPAL TREASURY & FISCAL POLICY';
      case 'population':
        return 'CITIZEN DEMOGRAPHICS & HOUSING';
      case 'transit':
        return 'METROPOLITAN TRANSPORTATION';
      case 'environment':
        return 'ATMOSPHERIC & ENVIRONMENTAL SENSORS';
      case 'sentiment':
        return 'CIVILIAN SENTIMENT & APPROVAL';
      case 'research':
        return 'PLANETARY RESEARCH & TECH ARCHIVE';
      default:
        return 'ORBITAL COMMAND SURFACE';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md pointer-events-auto select-none font-mono">
      <div className="orbital-surface max-w-3xl w-full p-6 rounded-2xl flex flex-col gap-4 border border-[#ff5500]/40 shadow-[0_24px_60px_rgba(0,0,0,0.9),0_0_30px_rgba(255,85,0,0.2)] animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-2.5 h-2.5 rounded-full bg-[#ff5500] shadow-[0_0_8px_#ff5500]" />
            <h2 className="font-['Chakra_Petch'] font-black text-lg md:text-xl text-[#fcfaf6] tracking-wide uppercase">
              {getTitle()}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-[#121620] hover:bg-[#1a202c] border border-white/10 flex items-center justify-center text-[#ded6c8] hover:text-white transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Dynamic Content */}
        {renderContent()}
      </div>
    </div>
  );
};
