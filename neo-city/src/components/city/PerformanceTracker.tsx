import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useCityStore } from '../../store/useCityStore';

export const PerformanceTracker: React.FC = () => {
  const showPerfMonitor = useCityStore((state) => state.graphics.showPerfMonitor);
  const autoCalibrated = useCityStore((state) => state.graphics.autoCalibrated);
  const setGraphicsPreset = useCityStore((state) => state.setGraphicsPreset);
  const updateGraphicsSettings = useCityStore((state) => state.updateGraphicsSettings);
  const setPerfTelemetry = useCityStore((state) => state.setPerfTelemetry);
  const pedestrianCount = useCityStore((state) => state.graphics.pedestrianCount);
  const trafficCount = useCityStore((state) => state.graphics.trafficCount);

  const frameTimeHistory = useRef<number[]>([]);
  const lastUpdateTime = useRef<number>(0);
  const sessionStartTime = useRef<number>(performance.now());
  const calibrationDone = useRef<boolean>(false);

  useFrame((state, delta) => {
    // Record frame time
    const frameTimeMs = delta * 1000;
    frameTimeHistory.current.push(frameTimeMs);
    if (frameTimeHistory.current.length > 40) {
      frameTimeHistory.current.shift();
    }

    const now = performance.now();
    // Throttle: 350ms if monitor is open, 2500ms if closed (drastically saves React re-render cycles)
    const updateThrottle = showPerfMonitor ? 350 : 2500;

    // Update telemetry state at throttled interval
    if (now - lastUpdateTime.current > updateThrottle) {
      lastUpdateTime.current = now;

      const avgFrameTime =
        frameTimeHistory.current.reduce((a, b) => a + b, 0) /
        (frameTimeHistory.current.length || 1);
      const measuredFPS = Math.round(1000 / (avgFrameTime || 16.6));

      // Read real measured WebGLRenderer info from Three.js
      const info = state.gl.info;

      // Only dispatch telemetry updates to Zustand when monitor is open or for warmup calibration
      if (showPerfMonitor || !calibrationDone.current) {
        setPerfTelemetry({
          fps: Math.min(144, Math.max(1, measuredFPS)),
          frameTimeMs: +avgFrameTime.toFixed(1),
          drawCalls: info.render.calls,
          triangles: info.render.triangles,
          geometries: info.memory.geometries,
          textures: info.memory.textures,
          activePedestrians: pedestrianCount,
          activeVehicles: trafficCount,
        });
      }

      // Auto-hardware calibration check after 3.5s of warmup
      if (!calibrationDone.current && !autoCalibrated && now - sessionStartTime.current > 3500) {
        calibrationDone.current = true;
        if (measuredFPS < 34) {
          console.warn('[NEO CITY 9.1] Auto-calibration: switching to performance preset for smooth frame pacing.');
          setGraphicsPreset('performance');
          updateGraphicsSettings({ autoCalibrated: true });
        } else {
          updateGraphicsSettings({ autoCalibrated: true });
        }
      }
    }
  });

  return null;
};
