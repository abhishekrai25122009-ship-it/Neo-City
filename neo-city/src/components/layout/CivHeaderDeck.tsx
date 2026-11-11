import React, { useState } from 'react';
import { useCityStore } from '../../store/useCityStore';
import type { SimulationSpeed } from '../../types/city';
import {
  Layers,
  Users,
  Smile,
  Coins,
  Zap,
  Droplets,
  Wind,
  Sun,
  Sunset,
  Moon,
  Play,
  Pause,
  Save,
  Download,
  Camera,
  RotateCcw,
  FlaskConical,
  Target,
  Navigation,
  Activity,
  CloudRain,
  AlertTriangle,
  Cpu,
  AlertOctagon,
  Sparkles,
} from 'lucide-react';

export const CivHeaderDeck: React.FC = () => {
  const stats = useCityStore((state) => state.stats);
  const isRunning = useCityStore((state) => state.isRunning);
  const toggleSimulation = useCityStore((state) => state.toggleSimulation);
  const speed = useCityStore((state) => state.speed);
  const setSpeed = useCityStore((state) => state.setSpeed);
  const lightingMode = useCityStore((state) => state.lightingMode);
  const cycleLightingMode = useCityStore((state) => state.cycleLightingMode);
  const weather = useCityStore((state) => state.weather);
  const cycleWeather = useCityStore((state) => state.cycleWeather);
  const activeDecisionEvent = useCityStore((state) => state.activeDecisionEvent);
  const triggerDecisionEvent = useCityStore((state) => state.triggerDecisionEvent);
  const manualSave = useCityStore((state) => state.manualSave);
  const loadCivilization = useCityStore((state) => state.loadCivilization);
  const flyToDistrict = useCityStore((state) => state.flyToDistrict);
  const resetToOverview = useCityStore((state) => state.resetToOverview);
  const missions = useCityStore((state) => state.missions);
  const toggleDrawer = useCityStore((state) => state.toggleDrawer);
  const showPerfMonitor = useCityStore((state) => state.graphics.showPerfMonitor);
  const togglePerfMonitor = useCityStore((state) => state.togglePerfMonitor);

  const [saveSuccess, setSaveSuccess] = useState(false);
  const [cameraMenuOpen, setCameraMenuOpen] = useState(false);

  // Count unclaimed completed missions
  const unclaimedCount = missions.filter((m) => m.isCompleted && !m.claimed).length;

  const speedOptions: { label: string; value: SimulationSpeed }[] = [
    { label: '1x', value: 1 },
    { label: '2x', value: 2 },
    { label: '5x', value: 5 },
  ];

  const cameraPresets = [
    { id: 'Overview', label: 'Civilization Overview' },
    { id: 'Downtown', label: 'Financial Downtown' },
    { id: 'Residential', label: 'Residential Gardens' },
    { id: 'Innovation', label: 'Tech & AI District' },
    { id: 'Energy', label: 'Clean Energy & Fusion' },
    { id: 'Botanical', label: 'Botanical Sanctuaries' },
    { id: 'Waterfront', label: 'Celestial Waterfront' },
    { id: 'StreetLevel', label: 'Street-Level Inspection' },
  ];

  const handleSaveClick = () => {
    manualSave();
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  // Metric Pollution Status color
  const aqiColorClass =
    stats.pollution < 20
      ? 'text-emerald-400 border-emerald-500/30 bg-emerald-950/40'
      : stats.pollution < 45
      ? 'text-amber-400 border-amber-500/30 bg-amber-950/40'
      : 'text-rose-400 border-rose-500/30 bg-rose-950/40 animate-pulse';

  return (
    <header className="fixed top-2 inset-x-2 md:inset-x-4 z-40 pointer-events-none flex flex-col gap-1.5">
      <div className="game-hud-panel px-3.5 py-2 rounded-xl flex items-center justify-between pointer-events-auto border border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.6)]">
        {/* CIVILIZATION IDENTITY, LEVEL & ERA */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-600 to-amber-500 border border-amber-400/40 flex items-center justify-center shadow-[0_0_12px_rgba(245,158,11,0.25)]">
            <Layers className="w-4 h-4 text-white" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="font-['Chakra_Petch'] font-bold text-sm tracking-widest text-white uppercase">
                NEO CITY <span className="text-amber-400">NOVA PRIME</span>
              </span>

              {/* CIV LEVEL BADGE */}
              <button
                onClick={() => toggleDrawer('missions')}
                className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-gradient-to-r from-purple-600/50 to-indigo-600/50 text-purple-200 border border-purple-400/40 font-bold flex items-center gap-1 cursor-pointer hover:border-purple-300 transition-colors"
                title={`Civilization Tier ${stats.civLevel}: ${stats.civXP} / ${stats.civXPToNextLevel} XP`}
              >
                <span>LVL {stats.civLevel}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
              </button>

              <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 font-semibold hidden sm:inline">
                {stats.era}
              </span>
            </div>
            <div className="text-[10px] font-mono text-slate-400 flex items-center gap-2">
              <span>CYCLE {stats.cycleCount} // {stats.timeOfDay}</span>
              <span className="text-purple-400 hidden sm:inline">
                XP {stats.civXP}/{stats.civXPToNextLevel}
              </span>
            </div>
          </div>
        </div>

        {/* METRIC RIBBON WITH STRICT COLOR IDENTITIES */}
        <div className="hidden xl:flex items-center gap-2 font-mono text-xs">
          {/* 1. Population (Violet / Warm White) */}
          <div className="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-purple-950/30 border border-purple-500/30 text-purple-200">
            <Users className="w-3.5 h-3.5 text-purple-400" />
            <div>
              <span className="text-[10px] text-purple-300 mr-1">POP:</span>
              <strong className="text-white font-bold">{stats.population.toLocaleString()}</strong>
              <span className="text-[9px] text-emerald-400 ml-1">+{stats.populationGrowthRate}%</span>
            </div>
          </div>

          {/* 2. Happiness (Emerald Green) */}
          <div className="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-emerald-950/30 border border-emerald-500/30 text-emerald-200">
            <Smile className="w-3.5 h-3.5 text-emerald-400" />
            <div>
              <span className="text-[10px] text-emerald-300 mr-1">MOOD:</span>
              <strong className="text-emerald-300 font-bold">{stats.happiness}%</strong>
              <span className="text-[9px] text-slate-400 ml-1">
                {stats.happiness >= 80 ? 'EUPHORIC' : stats.happiness >= 60 ? 'CONTENT' : 'UNREST'}
              </span>
            </div>
          </div>

          {/* 3. Treasury (Warm Gold) */}
          <div className="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-amber-950/30 border border-amber-500/30 text-amber-200">
            <Coins className="w-3.5 h-3.5 text-amber-400" />
            <div>
              <span className="text-[10px] text-amber-300 mr-1">FUNDS:</span>
              <strong className="text-amber-300 font-bold">{(stats.treasury / 1000000).toFixed(2)}M CR</strong>
              <span className="text-[9px] text-emerald-400 ml-1">
                +{Math.round((stats.incomePerTick - stats.expensesPerTick) / 1000)}K/c
              </span>
            </div>
          </div>

          {/* 4. Research Points (Milestone 03: Electric Cyan/Violet) */}
          <button
            onClick={() => toggleDrawer('research')}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-cyan-950/40 border border-cyan-500/40 text-cyan-200 hover:border-cyan-400 transition-colors cursor-pointer"
            title="Scientific Research Repository"
          >
            <FlaskConical className="w-3.5 h-3.5 text-cyan-400" />
            <div>
              <span className="text-[10px] text-cyan-300 mr-1">TECH:</span>
              <strong className="text-cyan-300 font-bold">{stats.researchPoints} RP</strong>
              <span className="text-[9px] text-indigo-300 ml-1">+{stats.researchPointsPerTick}/c</span>
            </div>
          </button>

          {/* 5. Transit Efficiency (Milestone 03: Blue Navigation) */}
          <button
            onClick={() => toggleDrawer('transit')}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-950/30 border border-blue-500/30 text-blue-200 hover:border-blue-400 transition-colors cursor-pointer"
            title="Advanced Transportation Grid"
          >
            <Navigation className="w-3.5 h-3.5 text-blue-400" />
            <div>
              <span className="text-[10px] text-blue-300 mr-1">TRANSIT:</span>
              <strong className="text-blue-300 font-bold">{stats.transitStats.efficiencyPercent}%</strong>
              <span className="text-[9px] text-slate-400 ml-1">{stats.transitStats.avgCommuteMinutes}m</span>
            </div>
          </button>

          {/* 6. Energy (Electric Yellow) */}
          <div className={`flex items-center gap-2 px-2.5 py-1 rounded-lg border text-yellow-200 ${
            stats.powerDeficit ? 'bg-rose-950/50 border-rose-500 text-rose-300 animate-pulse' : 'bg-yellow-950/30 border-yellow-500/30'
          }`}>
            <Zap className="w-3.5 h-3.5 text-yellow-400" />
            <div>
              <span className="text-[10px] text-yellow-300 mr-1">GRID:</span>
              <strong className="text-yellow-300 font-bold">{Math.round(stats.powerUsage)}</strong>
              <span className="text-[9px] text-slate-400">/{stats.powerCapacity}MW</span>
            </div>
          </div>

          {/* 7. Water (Sky Turquoise) */}
          <div className={`flex items-center gap-2 px-2.5 py-1 rounded-lg border text-cyan-200 ${
            stats.waterDeficit ? 'bg-rose-950/50 border-rose-500 text-rose-300 animate-pulse' : 'bg-cyan-950/30 border-cyan-500/30'
          }`}>
            <Droplets className="w-3.5 h-3.5 text-cyan-400" />
            <div>
              <span className="text-[10px] text-cyan-300 mr-1">WATER:</span>
              <strong className="text-cyan-300 font-bold">{stats.waterUsage}</strong>
              <span className="text-[9px] text-slate-400">/{stats.waterCapacity}ML</span>
            </div>
          </div>

          {/* 8. Pollution (Dynamic Green / Amber / Red) */}
          <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs ${aqiColorClass}`}>
            <Wind className="w-3.5 h-3.5" />
            <span>{stats.pollution} AQI</span>
          </div>

          {/* NEO CITY 6.0: 5-Resource Economy Ticker */}
          {stats.resources && (
            <button
              onClick={() => toggleDrawer('economy')}
              className={`flex items-center gap-2 px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
                stats.resources.food.isShortage || stats.resources.materials.isShortage
                  ? 'bg-rose-950/50 border-rose-500 text-rose-300 animate-pulse'
                  : 'bg-emerald-950/30 border-emerald-500/30 text-emerald-300 hover:border-emerald-400'
              }`}
              title="Living Resource Stockpiles & Market"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <div className="flex items-center gap-1.5 text-[11px]">
                <span>{stats.resources.food.current}T Food</span>
                <span className="text-slate-500">|</span>
                <span>{stats.resources.materials.current} Mat</span>
              </div>
            </button>
          )}

          {/* NEO CITY 6.0: Autonomous AI Director Status */}
          {stats.aiDirector && (
            <button
              onClick={() => toggleDrawer('ai_director')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[11px] font-bold transition-all cursor-pointer ${
                stats.aiDirector.threatLevel === 'critical'
                  ? 'bg-rose-950/60 border-rose-500 text-rose-300 animate-pulse'
                  : stats.aiDirector.threatLevel === 'elevated'
                  ? 'bg-amber-950/40 border-amber-500 text-amber-300'
                  : 'bg-indigo-950/40 border-indigo-500/40 text-indigo-300 hover:border-indigo-400'
              }`}
              title="Autonomous City AI Director & Infrastructure Wear"
            >
              <Cpu className="w-3.5 h-3.5 text-indigo-400" />
              <span>AI: {stats.aiDirector.threatLevel.toUpperCase()}</span>
              <span className="text-[9px] text-slate-400">({stats.aiDirector.infrastructureWear}%)</span>
            </button>
          )}

          {/* 9. Directives Tracker Button */}
          <button
            onClick={() => toggleDrawer('missions')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
              unclaimedCount > 0
                ? 'bg-amber-500/20 border-amber-400 text-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.4)] animate-bounce'
                : 'bg-purple-950/30 border-purple-500/30 text-purple-300 hover:border-purple-400'
            }`}
          >
            <Target className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-[11px] font-bold">DIRECTIVES</span>
            {unclaimedCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-amber-400 text-slate-950 text-[10px] font-black">
                {unclaimedCount}
              </span>
            )}
          </button>
        </div>

        {/* TIME CONTROLS, LIGHTING & SAVE/LOAD */}
        <div className="flex items-center gap-2 font-mono text-xs">
          {/* Lighting switcher */}
          <button
            onClick={cycleLightingMode}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg border text-[11px] font-semibold transition-all cursor-pointer ${
              lightingMode === 'day'
                ? 'bg-amber-500/20 border-amber-400/50 text-amber-300'
                : lightingMode === 'sunset'
                ? 'bg-rose-500/20 border-rose-400/50 text-rose-300'
                : 'bg-indigo-950/60 border-indigo-400/50 text-indigo-300'
            }`}
            title="Switch Day → Sunset → Night"
          >
            {lightingMode === 'day' ? (
              <>
                <Sun className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden sm:inline">DAY</span>
              </>
            ) : lightingMode === 'sunset' ? (
              <>
                <Sunset className="w-3.5 h-3.5 text-rose-400" />
                <span className="hidden sm:inline">SUNSET</span>
              </>
            ) : (
              <>
                <Moon className="w-3.5 h-3.5 text-indigo-400" />
                <span className="hidden sm:inline">NIGHT</span>
              </>
            )}
          </button>

          {/* Weather switcher */}
          <button
            onClick={cycleWeather}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg border text-[11px] font-semibold transition-all cursor-pointer ${
              weather === 'clear'
                ? 'bg-sky-500/20 border-sky-400/50 text-sky-300'
                : weather === 'cyber_rain'
                ? 'bg-blue-600/30 border-blue-400 text-blue-200 animate-pulse'
                : weather === 'neon_smog'
                ? 'bg-purple-950/60 border-purple-400 text-purple-300'
                : 'bg-emerald-950/60 border-emerald-400 text-emerald-300'
            }`}
            title="Cycle Weather: Clear → Cyber Rain → Neon Smog → Aurora Storm"
          >
            <CloudRain className="w-3.5 h-3.5 text-sky-400" />
            <span className="hidden sm:inline uppercase">{weather.replace('_', ' ')}</span>
          </button>

          {/* SIMULATION SPEED & PAUSE */}
          <div className="flex items-center bg-slate-900/80 rounded-lg p-0.5 border border-white/10">
            <button
              onClick={toggleSimulation}
              className={`p-1.5 rounded-md transition-colors cursor-pointer ${
                isRunning ? 'text-amber-400 hover:bg-white/10' : 'bg-emerald-500 text-white shadow-[0_0_10px_rgba(16,185,129,0.5)]'
              }`}
              title={isRunning ? 'Pause Simulation' : 'Resume Simulation'}
            >
              {isRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
            </button>

            <div className="h-4 w-px bg-white/10 mx-1" />

            {speedOptions.map((s) => (
              <button
                key={s.value}
                onClick={() => setSpeed(s.value)}
                className={`px-2 py-0.5 rounded text-[11px] font-bold transition-all cursor-pointer ${
                  speed === s.value && isRunning
                    ? 'bg-indigo-600 text-white shadow-[0_0_8px_rgba(79,70,229,0.5)]'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>

          {/* CAMERA PRESET SELECTOR */}
          <div className="relative">
            <button
              onClick={() => setCameraMenuOpen(!cameraMenuOpen)}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 border border-white/10 text-slate-200 transition-colors cursor-pointer"
              title="Camera Perspectives & District Flythrough"
            >
              <Camera className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden md:inline text-[11px] font-medium">CAM</span>
            </button>

            {cameraMenuOpen && (
              <div className="absolute right-0 top-full mt-2 w-52 game-hud-panel rounded-xl py-2 px-1 border border-white/15 shadow-2xl z-50 flex flex-col gap-1">
                <div className="text-[10px] font-mono text-slate-400 px-2 py-1 uppercase tracking-wider border-b border-white/10">
                  Select Perspective
                </div>
                {cameraPresets.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => {
                      flyToDistrict(p.id);
                      setCameraMenuOpen(false);
                    }}
                    className="text-left px-2 py-1.5 rounded-lg text-xs text-slate-200 hover:bg-indigo-600/30 hover:text-white transition-colors cursor-pointer"
                  >
                    {p.label}
                  </button>
                ))}
                <div className="h-px bg-white/10 my-1" />
                <button
                  onClick={() => {
                    resetToOverview();
                    setCameraMenuOpen(false);
                  }}
                  className="text-left px-2 py-1.5 rounded-lg text-xs text-amber-300 hover:bg-amber-500/20 flex items-center gap-1.5 cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" />
                  Full City Overview
                </button>
              </div>
            )}
          </div>

          {/* ARCHIVE / SAVE ACTIONS & PERF TELEMETRY */}
          <div className="flex items-center gap-1">
            <button
              onClick={togglePerfMonitor}
              className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                showPerfMonitor
                  ? 'bg-cyan-500/30 border-cyan-400 text-cyan-300 shadow-[0_0_10px_rgba(6,182,212,0.4)]'
                  : 'bg-slate-800/80 hover:bg-slate-700/80 border-white/10 text-slate-300'
              }`}
              title="Toggle Live Performance & 3D Telemetry (FPS, Calls, Tris)"
            >
              <Activity className="w-3.5 h-3.5 text-cyan-400" />
            </button>

            <button
              onClick={handleSaveClick}
              className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                saveSuccess
                  ? 'bg-emerald-500/30 border-emerald-400 text-emerald-300'
                  : 'bg-slate-800/80 hover:bg-slate-700/80 border-white/10 text-slate-300'
              }`}
              title="Save Civilization Archive (Ctrl+S)"
            >
              <Save className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={loadCivilization}
              className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 border border-white/10 text-slate-300 transition-colors cursor-pointer"
              title="Load Saved Civilization Archive"
            >
              <Download className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* NEO CITY 6.0: CRITICAL METROPOLITAN EMERGENCY BANNER */}
      {stats.activeEmergency && (
        <div
          onClick={() => {}}
          className="mx-auto max-w-xl w-full px-4 py-2.5 rounded-xl bg-rose-950/95 border-2 border-rose-500 text-rose-200 flex items-center justify-between shadow-[0_0_30px_rgba(244,63,94,0.6)] cursor-pointer hover:bg-rose-900 transition-all pointer-events-auto animate-bounce font-mono text-xs"
        >
          <div className="flex items-center gap-2.5">
            <AlertOctagon className="w-5 h-5 text-rose-400 shrink-0 animate-spin" />
            <div>
              <span className="text-[10px] text-rose-400 font-bold uppercase tracking-widest block">
                METROPOLITAN DISASTER IN PROGRESS
              </span>
              <span className="font-bold text-white text-sm">{stats.activeEmergency.title}</span>
            </div>
          </div>
          <span className="text-[10px] font-black px-2.5 py-1 rounded-lg bg-rose-500 text-slate-950 uppercase shrink-0 shadow-md">
            DISPATCH SQUAD →
          </span>
        </div>
      )}

      {/* DYNAMIC CITY CRISIS / OPPORTUNITY BANNER */}
      {activeDecisionEvent && (
        <div
          onClick={() => triggerDecisionEvent(activeDecisionEvent)}
          className="mx-auto max-w-xl w-full px-4 py-2 rounded-xl bg-amber-950/90 border border-amber-400 text-amber-200 flex items-center justify-between shadow-[0_0_25px_rgba(245,158,11,0.5)] cursor-pointer hover:bg-amber-900 transition-all pointer-events-auto animate-pulse font-mono text-xs"
        >
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 animate-bounce" />
            <span className="font-semibold">
              <span className="text-amber-300 uppercase tracking-wide">DIRECTIVE:</span> {activeDecisionEvent.title}
            </span>
          </div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-400 text-slate-950 uppercase shrink-0">
            RESOLVE →
          </span>
        </div>
      )}
    </header>
  );
};
