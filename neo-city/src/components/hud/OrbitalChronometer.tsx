import React, { useState } from 'react';
import { useCityStore } from '../../store/useCityStore';
import type { SimulationSpeed } from '../../types/city';
import {
  Play,
  Pause,
  Sun,
  Sunset,
  Moon,
  RotateCcw,
  HardDrive,
  FolderOpen,
  Check,
  Compass,
} from 'lucide-react';

export const OrbitalChronometer: React.FC = () => {
  const isRunning = useCityStore((state) => state.isRunning);
  const toggleSimulation = useCityStore((state) => state.toggleSimulation);
  const speed = useCityStore((state) => state.speed);
  const setSpeed = useCityStore((state) => state.setSpeed);
  const stats = useCityStore((state) => state.stats);
  const lightingMode = useCityStore((state) => state.lightingMode);
  const cycleLightingMode = useCityStore((state) => state.cycleLightingMode);
  const manualSave = useCityStore((state) => state.manualSave);
  const resetToOverview = useCityStore((state) => state.resetToOverview);
  const setSaveLoadModalOpen = useCityStore((state) => state.setSaveLoadModalOpen);
  const graphics = useCityStore((state) => state.graphics);
  const setGraphicsPreset = useCityStore((state) => state.setGraphicsPreset);
  const togglePerfMonitor = useCityStore((state) => state.togglePerfMonitor);
  const perfTelemetry = useCityStore((state) => state.perfTelemetry);

  const [savedFeedback, setSavedFeedback] = useState(false);

  const handleQuickSave = () => {
    manualSave();
    setSavedFeedback(true);
    setTimeout(() => setSavedFeedback(false), 2000);
  };

  const speedOptions: { label: string; value: SimulationSpeed }[] = [
    { label: '1x', value: 1 },
    { label: '2x', value: 2 },
    { label: '5x', value: 5 },
  ];

  return (
    <div className="flex items-center gap-2 select-none font-mono text-xs">
      {/* 1. DISTINCTIVE ORBITAL TIME DIAL */}
      <div className="orbital-cut-corner bg-[#0d1017] border border-white/10 px-3 py-1.5 flex items-center gap-2.5">
        {/* Orbital Cycle Rotating Ring */}
        <div className="relative w-8 h-8 flex items-center justify-center">
          <svg className="w-8 h-8 -rotate-90">
            <circle cx="16" cy="16" r="12" stroke="#161b26" strokeWidth="2" fill="none" />
            <circle
              cx="16"
              cy="16"
              r="12"
              stroke="#ff5500"
              strokeWidth="2.5"
              fill="none"
              strokeDasharray={75.4}
              strokeDashoffset={isRunning ? 25 : 75.4}
              strokeLinecap="round"
              className={isRunning ? 'animate-[spin_6s_linear_infinite]' : ''}
            />
          </svg>
          <Compass className="w-3.5 h-3.5 text-[#ff8533] absolute" />
        </div>

        <div>
          <div className="text-[8px] text-[#64748b] tracking-wider font-semibold">
            CYCLE {stats.cycleCount}
          </div>
          <div className="font-['Chakra_Petch'] font-black text-xs text-[#fcfaf6]">
            {stats.timeOfDay} <span className="text-[9px] text-[#ff5500]">ST</span>
          </div>
        </div>
      </div>

      {/* 2. LARGE TACTILE PAUSE / RESUME CONTROL */}
      <button
        onClick={toggleSimulation}
        className={`w-9 h-9 rounded-xl flex items-center justify-center border transition-all cursor-pointer ${
          isRunning
            ? 'bg-[#ff5500] hover:bg-[#ff6b00] text-[#05070a] border-[#ff5500] shadow-[0_0_18px_rgba(255,85,0,0.5)]'
            : 'bg-[#ef4444] hover:bg-[#dc2626] text-[#fcfaf6] border-[#ef4444] shadow-[0_0_18px_rgba(239,68,68,0.5)] animate-pulse'
        }`}
        title={isRunning ? 'Pause Simulation (Space)' : 'Resume Simulation (Space)'}
      >
        {isRunning ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
      </button>

      {/* 3. SIMULATION SPEED SELECTOR */}
      <div className="flex items-center bg-[#0d1017] border border-white/10 rounded-xl p-0.5">
        {speedOptions.map((opt) => (
          <button
            key={opt.value}
            onClick={() => setSpeed(opt.value)}
            className={`px-2 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
              isRunning && speed === opt.value
                ? 'bg-[#ff5500]/20 text-[#ff8533] border border-[#ff5500]/50 shadow-sm'
                : 'text-[#64748b] hover:text-[#ded6c8]'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* 4. ATMOSPHERE LIGHTING TOGGLE */}
      <button
        onClick={cycleLightingMode}
        className="w-8 h-8 rounded-xl bg-[#0d1017] hover:bg-[#161b26] border border-white/10 flex items-center justify-center text-[#ded6c8] hover:text-white transition-all cursor-pointer"
        title={`Cycle Lighting: ${lightingMode.toUpperCase()}`}
      >
        {lightingMode === 'day' ? (
          <Sun className="w-3.5 h-3.5 text-[#ffaa00]" />
        ) : lightingMode === 'sunset' ? (
          <Sunset className="w-3.5 h-3.5 text-[#f43f5e]" />
        ) : (
          <Moon className="w-3.5 h-3.5 text-[#38bdf8]" />
        )}
      </button>

      {/* 5. CAMERA OVERVIEW RESET */}
      <button
        onClick={resetToOverview}
        className="w-8 h-8 rounded-xl bg-[#0d1017] hover:bg-[#161b26] border border-white/10 flex items-center justify-center text-[#ded6c8] hover:text-white transition-all cursor-pointer"
        title="Reset Camera to Metropolitan Overview"
      >
        <RotateCcw className="w-3.5 h-3.5" />
      </button>

      {/* 6. PROMINENT SAVE COMMAND */}
      <button
        onClick={handleQuickSave}
        className={`px-2.5 py-1.5 rounded-xl border flex items-center gap-1.5 font-bold transition-all cursor-pointer ${
          savedFeedback
            ? 'bg-[#00e676]/20 border-[#00e676] text-[#00e676]'
            : 'bg-[#ff5500]/15 hover:bg-[#ff5500]/25 border-[#ff5500]/50 text-[#ff8533]'
        }`}
        title="Quick-Save City State (Or manage 5 slots in Archives)"
      >
        {savedFeedback ? (
          <>
            <Check className="w-3.5 h-3.5 text-[#00e676]" />
            <span className="text-[10px]">SAVED</span>
          </>
        ) : (
          <>
            <HardDrive className="w-3.5 h-3.5 text-[#ff8533]" />
            <span className="text-[10px]">SAVE</span>
          </>
        )}
      </button>

      {/* 7. PROMINENT LOAD COMMAND */}
      <button
        onClick={() => setSaveLoadModalOpen(true)}
        className="px-2.5 py-1.5 rounded-xl bg-[#0d1017] hover:bg-[#161b26] border border-white/10 hover:border-[#00e676]/50 text-[#ded6c8] hover:text-[#00e676] flex items-center gap-1.5 font-bold transition-all cursor-pointer"
        title="Load Game from 5 Manual Slots or Autosave"
      >
        <FolderOpen className="w-3.5 h-3.5 text-[#00e676]" />
        <span className="text-[10px]">LOAD</span>
      </button>

      {/* 8. GRAPHICS PRESET QUICK-SWITCH PILL & LIVE FPS (NEO CITY 9.1) */}
      <div className="flex items-center bg-[#0d1017] border border-white/10 rounded-xl p-0.5 gap-1">
        {(['performance', 'balanced', 'ultra'] as const).map((p) => {
          const isActive = graphics.preset === p;
          const shortLabel = p === 'performance' ? 'PERF' : p === 'balanced' ? 'BAL' : 'ULTRA';
          return (
            <button
              key={p}
              onClick={() => setGraphicsPreset(p)}
              className={`px-1.5 py-1 rounded-lg text-[9px] font-bold tracking-tight transition-all cursor-pointer ${
                isActive
                  ? p === 'performance'
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/50 shadow-sm'
                    : p === 'ultra'
                    ? 'bg-purple-500/20 text-purple-300 border border-purple-500/50 shadow-sm'
                    : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 shadow-sm'
                  : 'text-[#64748b] hover:text-[#ded6c8]'
              }`}
              title={`Switch Graphics Preset to ${p.toUpperCase()} (${p === 'performance' ? 'Fastest, Shadows Off' : p === 'balanced' ? 'Optimal, Hull Shadows' : 'Maximum Fidelity'})`}
            >
              {shortLabel}
            </button>
          );
        })}
        <button
          onClick={togglePerfMonitor}
          className={`px-1.5 py-1 rounded-lg text-[9px] font-mono font-bold flex items-center gap-1 border transition-all cursor-pointer ${
            perfTelemetry.fps >= 50
              ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30'
              : perfTelemetry.fps >= 30
              ? 'text-amber-400 bg-amber-500/10 border-amber-500/30'
              : 'text-rose-400 bg-rose-500/10 border-rose-500/30'
          }`}
          title={`Toggle Hardware Profiler Overlay (DC: ${perfTelemetry.drawCalls})`}
        >
          <span>{perfTelemetry.fps} FPS</span>
        </button>
      </div>
    </div>
  );
};
