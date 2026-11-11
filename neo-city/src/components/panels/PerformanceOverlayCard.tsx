import React from 'react';
import { useCityStore } from '../../store/useCityStore';
import type { GraphicsPreset } from '../../types/city';
import { Activity, X, Gauge, Cpu, Eye, Sliders } from 'lucide-react';

export const PerformanceOverlayCard: React.FC = () => {
  const showPerfMonitor = useCityStore((state) => state.graphics.showPerfMonitor);
  const togglePerfMonitor = useCityStore((state) => state.togglePerfMonitor);
  const perfTelemetry = useCityStore((state) => state.perfTelemetry);
  const currentPreset = useCityStore((state) => state.graphics.preset);
  const setGraphicsPreset = useCityStore((state) => state.setGraphicsPreset);
  const updateGraphicsSettings = useCityStore((state) => state.updateGraphicsSettings);
  const renderScale = useCityStore((state) => state.graphics.renderScale);
  const shadowQuality = useCityStore((state) => state.graphics.shadowQuality);

  if (!showPerfMonitor) return null;

  const presets: GraphicsPreset[] = ['performance', 'balanced', 'ultra'];

  // FPS color status indicator
  const fpsStatusClass =
    perfTelemetry.fps >= 55
      ? 'text-emerald-400 border-emerald-500/40 bg-emerald-950/40 shadow-[0_0_12px_rgba(16,185,129,0.35)]'
      : perfTelemetry.fps >= 35
      ? 'text-amber-400 border-amber-500/40 bg-amber-950/40 shadow-[0_0_12px_rgba(245,158,11,0.35)]'
      : 'text-rose-400 border-rose-500/40 bg-rose-950/40 animate-pulse';

  return (
    <div className="fixed right-4 top-18 z-40 w-72 md:w-80 game-hud-panel rounded-2xl p-3.5 flex flex-col gap-2.5 font-mono text-xs border border-white/20 shadow-[0_12px_40px_rgba(0,0,0,0.85)] pointer-events-auto">
      {/* HEADER */}
      <div className="flex items-center justify-between pb-2 border-b border-white/10">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-cyan-400 animate-pulse" />
          <span className="font-['Chakra_Petch'] font-bold text-xs uppercase tracking-wider text-white">
            HARDWARE & 3D TELEMETRY
          </span>
        </div>
        <button
          onClick={togglePerfMonitor}
          className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* PRIMARY FPS & FRAME TIME HERO METRIC */}
      <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/80 border border-white/10">
        <div className="flex flex-col">
          <span className="text-[10px] text-slate-400 tracking-wider">RENDER VELOCITY</span>
          <div className="flex items-baseline gap-1.5">
            <span className={`font-['Chakra_Petch'] text-2xl font-black px-2 py-0.5 rounded-lg border ${fpsStatusClass}`}>
              {perfTelemetry.fps}
            </span>
            <span className="text-[11px] font-bold text-slate-300">FPS</span>
          </div>
        </div>

        <div className="text-right">
          <span className="text-[10px] text-slate-400 tracking-wider block">FRAME DURATION</span>
          <span className="font-['Chakra_Petch'] text-base font-bold text-white">
            {perfTelemetry.frameTimeMs} <span className="text-xs text-slate-400">ms</span>
          </span>
        </div>
      </div>

      {/* MEASURED WEBGL RENDER METRICS */}
      <div className="grid grid-cols-2 gap-2 text-[11px]">
        <div className="p-2 rounded-lg bg-slate-900/50 border border-white/5 flex flex-col">
          <span className="text-[9px] text-slate-400 flex items-center gap-1">
            <Gauge className="w-3 h-3 text-cyan-400" /> DRAW CALLS
          </span>
          <strong className="text-cyan-300 text-sm font-bold">
            {perfTelemetry.drawCalls} <span className="text-[10px] text-slate-400">calls</span>
          </strong>
        </div>

        <div className="p-2 rounded-lg bg-slate-900/50 border border-white/5 flex flex-col">
          <span className="text-[9px] text-slate-400 flex items-center gap-1">
            <Cpu className="w-3 h-3 text-amber-400" /> GEOM TRIANGLES
          </span>
          <strong className="text-amber-300 text-sm font-bold">
            {(perfTelemetry.triangles / 1000).toFixed(1)}k <span className="text-[10px] text-slate-400">tris</span>
          </strong>
        </div>

        <div className="p-2 rounded-lg bg-slate-900/50 border border-white/5 flex flex-col">
          <span className="text-[9px] text-slate-400 flex items-center gap-1">
            <Eye className="w-3 h-3 text-purple-400" /> CITIZENS ACTIVE
          </span>
          <strong className="text-purple-300 text-sm font-bold">
            {perfTelemetry.activePedestrians} <span className="text-[10px] text-slate-400">agents</span>
          </strong>
        </div>

        <div className="p-2 rounded-lg bg-slate-900/50 border border-white/5 flex flex-col">
          <span className="text-[9px] text-slate-400 flex items-center gap-1">
            <Sliders className="w-3 h-3 text-blue-400" /> HOVER TRANSIT
          </span>
          <strong className="text-blue-300 text-sm font-bold">
            {perfTelemetry.activeVehicles} <span className="text-[10px] text-slate-400">pods</span>
          </strong>
        </div>
      </div>

      {/* FUNCTIONAL GRAPHICS PRESETS SWITCHER (PERFORMANCE / BALANCED / ULTRA) */}
      <div className="pt-2 border-t border-white/10 flex flex-col gap-2">
        <div className="flex items-center justify-between text-[10px]">
          <span className="text-slate-400 font-bold">GRAPHICS PRESET</span>
          <span className="text-cyan-300 font-bold uppercase tracking-wider">
            {currentPreset} ({renderScale}x DPR / Shadows: {shadowQuality.toUpperCase()})
          </span>
        </div>

        <div className="grid grid-cols-3 gap-1.5">
          {presets.map((p) => (
            <button
              key={p}
              onClick={() => setGraphicsPreset(p)}
              className={`py-1.5 px-2 rounded-lg text-[10px] font-black uppercase transition-all cursor-pointer ${
                currentPreset === p
                  ? 'bg-cyan-500 text-slate-950 shadow-[0_0_12px_rgba(6,182,212,0.6)]'
                  : 'bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-white/10'
              }`}
            >
              {p}
            </button>
          ))}
        </div>

        {/* RESOLUTION SCALE SHORTCUT CONTROLS */}
        <div className="flex items-center justify-between pt-1 border-t border-white/5 text-[9px]">
          <span className="text-slate-400">RESOLUTION DPR:</span>
          <div className="flex gap-1">
            {[0.75, 1.0, 1.25].map((scale) => (
              <button
                key={scale}
                onClick={() => updateGraphicsSettings({ renderScale: scale })}
                className={`px-2 py-0.5 rounded text-[9px] font-bold transition-all cursor-pointer ${
                  renderScale === scale
                    ? 'bg-purple-600 text-white shadow-[0_0_8px_rgba(168,85,247,0.5)]'
                    : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                {scale}x
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
