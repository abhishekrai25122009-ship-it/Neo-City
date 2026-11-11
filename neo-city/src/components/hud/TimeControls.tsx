import React, { useState } from 'react';
import { useCityStore } from '../../store/useCityStore';
import type { SimulationSpeed } from '../../types/city';
import {
  Play,
  Pause,
  Sun,
  Sunset,
  Moon,
  CloudRain,
  Camera,
  RotateCcw,
  Activity,
  HardDrive,
} from 'lucide-react';

export const TimeControls: React.FC = () => {
  const isRunning = useCityStore((state) => state.isRunning);
  const toggleSimulation = useCityStore((state) => state.toggleSimulation);
  const speed = useCityStore((state) => state.speed);
  const setSpeed = useCityStore((state) => state.setSpeed);
  const lightingMode = useCityStore((state) => state.lightingMode);
  const cycleLightingMode = useCityStore((state) => state.cycleLightingMode);
  const weather = useCityStore((state) => state.weather);
  const cycleWeather = useCityStore((state) => state.cycleWeather);
  const flyToDistrict = useCityStore((state) => state.flyToDistrict);
  const resetToOverview = useCityStore((state) => state.resetToOverview);
  const showPerfMonitor = useCityStore((state) => state.graphics.showPerfMonitor);
  const togglePerfMonitor = useCityStore((state) => state.togglePerfMonitor);
  const setSaveLoadModalOpen = useCityStore((state) => state.setSaveLoadModalOpen);

  const [cameraMenuOpen, setCameraMenuOpen] = useState(false);

  const speedOptions: { label: string; value: SimulationSpeed }[] = [
    { label: '1x', value: 1 },
    { label: '2x', value: 2 },
    { label: '5x', value: 5 },
  ];

  const cameraPresets = [
    { id: 'Overview', label: 'Civilization Overview' },
    { id: 'Downtown', label: 'Financial Downtown Core' },
    { id: 'Residential', label: 'Residential Arcologies' },
    { id: 'Innovation', label: 'Quantum Tech District' },
    { id: 'Energy', label: 'Clean Fusion & Industrial' },
    { id: 'Botanical', label: 'Botanical Bio-Domes' },
    { id: 'Waterfront', label: 'Celestial Waterfront' },
    { id: 'StreetLevel', label: 'Street-Level Inspection' },
  ];

  return (
    <div className="flex items-center gap-1.5 font-mono text-xs">
      {/* 1. Lighting Mode Switcher */}
      <button
        onClick={cycleLightingMode}
        className={`flex items-center gap-1 px-2.5 py-1 rounded-lg border text-[11px] font-semibold transition-all cursor-pointer ${
          lightingMode === 'day'
            ? 'bg-amber-500/20 border-amber-400/50 text-amber-300'
            : lightingMode === 'sunset'
            ? 'bg-rose-500/20 border-rose-400/50 text-rose-300'
            : 'bg-indigo-950/60 border-indigo-400/50 text-indigo-300'
        }`}
        title="Cycle Atmosphere: Day → Sunset → Night"
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

      {/* 2. Weather Switcher */}
      <button
        onClick={cycleWeather}
        className={`flex items-center gap-1 px-2 py-1 rounded-lg border text-[11px] font-semibold transition-all cursor-pointer ${
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
        <span className="hidden md:inline uppercase text-[10px]">
          {weather.replace('_', ' ')}
        </span>
      </button>

      {/* 3. Simulation Speed & Pause Controls */}
      <div className="flex items-center bg-slate-900/80 rounded-lg p-0.5 border border-white/10">
        <button
          onClick={toggleSimulation}
          className={`p-1.5 rounded-md transition-colors cursor-pointer ${
            isRunning
              ? 'text-amber-400 hover:bg-white/10'
              : 'bg-emerald-500 text-white shadow-[0_0_10px_rgba(16,185,129,0.5)]'
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
            className={`px-1.5 py-0.5 rounded text-[11px] font-bold transition-all cursor-pointer ${
              speed === s.value && isRunning
                ? 'bg-indigo-600 text-white shadow-[0_0_8px_rgba(79,70,229,0.5)]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* 4. Camera Perspectives Dropdown */}
      <div className="relative">
        <button
          onClick={() => setCameraMenuOpen(!cameraMenuOpen)}
          className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 border border-white/10 text-slate-200 transition-colors cursor-pointer"
          title="Camera Perspectives & District Flythrough"
        >
          <Camera className="w-3.5 h-3.5 text-cyan-400" />
          <span className="hidden md:inline text-[11px]">CAM</span>
        </button>

        {cameraMenuOpen && (
          <div className="absolute right-0 top-full mt-2 w-52 game-hud-panel rounded-xl py-2 px-1 border border-white/15 shadow-2xl z-50 flex flex-col gap-1">
            <div className="text-[10px] text-slate-400 px-2 py-1 uppercase tracking-wider border-b border-white/10 font-bold">
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
              className="text-left px-2 py-1.5 rounded-lg text-xs text-amber-300 hover:bg-amber-500/20 flex items-center gap-1.5 cursor-pointer font-bold"
            >
              <RotateCcw className="w-3 h-3" />
              Full City Overview
            </button>
          </div>
        )}
      </div>

      {/* 5. Performance Telemetry Toggle */}
      <button
        onClick={togglePerfMonitor}
        className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
          showPerfMonitor
            ? 'bg-cyan-500/30 border-cyan-400 text-cyan-300 shadow-[0_0_10px_rgba(6,182,212,0.4)]'
            : 'bg-slate-800/80 hover:bg-slate-700/80 border-white/10 text-slate-300'
        }`}
        title="Toggle Real-Time Telemetry (FPS, Draw Calls, Triangles)"
      >
        <Activity className="w-3.5 h-3.5 text-cyan-400" />
      </button>

      {/* 6. Multi-Slot Persistence Modal Trigger */}
      <button
        onClick={() => setSaveLoadModalOpen(true)}
        className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-gradient-to-r from-amber-600/40 to-indigo-600/40 hover:from-amber-600/60 hover:to-indigo-600/60 border border-amber-400/40 text-amber-200 text-xs font-bold transition-all cursor-pointer shadow-[0_0_12px_rgba(245,158,11,0.25)]"
        title="Open Multi-Slot Archives & Save Manager"
      >
        <HardDrive className="w-3.5 h-3.5 text-amber-400" />
        <span className="hidden sm:inline">ARCHIVES</span>
      </button>
    </div>
  );
};
