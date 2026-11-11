import React from 'react';
import { useCityStore } from '../../store/useCityStore';
import { ResourceIndicator } from './ResourceIndicator';
import {
  Users,
  Smile,
  Coins,
  FlaskConical,
  Navigation,
  Zap,
  Droplets,
  Wind,
  Sparkles,
  Cpu,
} from 'lucide-react';

export const ResourceOverview: React.FC = () => {
  const stats = useCityStore((state) => state.stats);
  const toggleDrawer = useCityStore((state) => state.toggleDrawer);

  const netIncome = Math.round((stats.incomePerTick - stats.expensesPerTick) / 1000);
  const netIncomeFormatted = netIncome >= 0 ? `+${netIncome}K/c` : `${netIncome}K/c`;

  // AQI color mapping
  const aqiTheme =
    stats.pollution < 20 ? 'emerald' : stats.pollution < 45 ? 'amber' : 'rose';

  return (
    <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
      {/* 1. Population */}
      <ResourceIndicator
        icon={<Users className="w-3.5 h-3.5 text-purple-400" />}
        label="POP"
        value={stats.population.toLocaleString()}
        changeRate={`+${stats.populationGrowthRate}%`}
        colorTheme="violet"
        tooltip="Citizen Population and growth index"
        onClick={() => toggleDrawer('demographics')}
      />

      {/* 2. Happiness */}
      <ResourceIndicator
        icon={<Smile className="w-3.5 h-3.5 text-emerald-400" />}
        label="MOOD"
        value={`${stats.happiness}%`}
        statusLabel={
          stats.happiness >= 80 ? 'EUPHORIC' : stats.happiness >= 60 ? 'CONTENT' : 'UNREST'
        }
        colorTheme="emerald"
        tooltip="Metropolitan Citizen Satisfaction"
      />

      {/* 3. Treasury */}
      <ResourceIndicator
        icon={<Coins className="w-3.5 h-3.5 text-amber-400" />}
        label="FUNDS"
        value={`${(stats.treasury / 1000000).toFixed(2)}M`}
        changeRate={netIncomeFormatted}
        colorTheme="amber"
        tooltip="Treasury Reserves & Net Cashflow"
        onClick={() => toggleDrawer('economy')}
      />

      {/* 4. Research Tech */}
      <ResourceIndicator
        icon={<FlaskConical className="w-3.5 h-3.5 text-cyan-400" />}
        label="TECH"
        value={`${stats.researchPoints} RP`}
        changeRate={`+${stats.researchPointsPerTick}/c`}
        colorTheme="cyan"
        tooltip="Planetary Research Archive & Unlocks"
        onClick={() => toggleDrawer('research')}
      />

      {/* 5. Transit Network */}
      <ResourceIndicator
        icon={<Navigation className="w-3.5 h-3.5 text-blue-400" />}
        label="TRANSIT"
        value={`${stats.transitStats.efficiencyPercent}%`}
        statusLabel={`${stats.transitStats.avgCommuteMinutes}m`}
        colorTheme="blue"
        tooltip="Hover-pod Corridor Transit Efficiency & Average Commute"
        onClick={() => toggleDrawer('transit')}
      />

      {/* 6. Power Grid */}
      <ResourceIndicator
        icon={<Zap className="w-3.5 h-3.5 text-yellow-400" />}
        label="GRID"
        value={Math.round(stats.powerUsage)}
        capacity={`${stats.powerCapacity}MW`}
        colorTheme="yellow"
        isCritical={stats.powerDeficit}
        tooltip="High-Voltage Plasma Microgrid Load & Capacity"
        onClick={() => toggleDrawer('energy_grid')}
      />

      {/* 7. Water Synthesis */}
      <ResourceIndicator
        icon={<Droplets className="w-3.5 h-3.5 text-sky-400" />}
        label="WATER"
        value={stats.waterUsage}
        capacity={`${stats.waterCapacity}ML`}
        colorTheme="aqua"
        isCritical={stats.waterDeficit}
        tooltip="Nova Bay Aqueduct & Desalination Capacity"
      />

      {/* 8. Air Quality Pollution */}
      <ResourceIndicator
        icon={<Wind className="w-3.5 h-3.5 text-slate-300" />}
        label="AQI"
        value={stats.pollution}
        colorTheme={aqiTheme}
        isWarning={stats.pollution >= 45}
        isCritical={stats.pollution >= 70}
        tooltip="Atmospheric Quality Index (AQI)"
        onClick={() => toggleDrawer('environment')}
      />

      {/* 9. Living Economy (Food & Materials) */}
      {stats.resources && (
        <ResourceIndicator
          icon={<Sparkles className="w-3.5 h-3.5 text-emerald-400" />}
          label="STOCK"
          value={`${stats.resources.food.current}F`}
          capacity={`${stats.resources.materials.current}M`}
          colorTheme="emerald"
          isWarning={stats.resources.food.isShortage || stats.resources.materials.isShortage}
          tooltip="Living Resource Inventory (Food & Construction Materials)"
          onClick={() => toggleDrawer('economy')}
        />
      )}

      {/* 10. Autonomous AI Director */}
      {stats.aiDirector && (
        <ResourceIndicator
          icon={<Cpu className="w-3.5 h-3.5 text-indigo-400" />}
          label="AI"
          value={stats.aiDirector.threatLevel.toUpperCase()}
          statusLabel={`${stats.aiDirector.infrastructureWear}%`}
          colorTheme="cyan"
          isCritical={stats.aiDirector.threatLevel === 'critical'}
          isWarning={stats.aiDirector.threatLevel === 'elevated'}
          tooltip="Autonomous City AI Director & Infrastructure Wear"
          onClick={() => toggleDrawer('ai_director')}
        />
      )}
    </div>
  );
};
