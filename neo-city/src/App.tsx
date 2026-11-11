import React, { useEffect } from 'react';
import { useCityStore } from './store/useCityStore';
import { CityCanvas } from './components/city/CityCanvas';
import { NeoCityHUD } from './components/hud/NeoCityHUD';
import { OrbitalCommandDock } from './components/hud/OrbitalCommandDock';
import { GameDrawerPanel } from './components/panels/GameDrawerPanel';
import { BuildingInspectorCard } from './components/panels/BuildingInspectorCard';
import { PlacementOverlayBar } from './components/panels/PlacementOverlayBar';
import { PerformanceOverlayCard } from './components/panels/PerformanceOverlayCard';
import { UpgradePreviewModal } from './components/panels/UpgradePreviewModal';
import { EventDecisionModal } from './components/panels/EventDecisionModal';
import { EmergencyModal } from './components/panels/EmergencyModal';
import { GameOpeningExperience } from './components/common/GameOpeningExperience';

export const App: React.FC = () => {
  const tick = useCityStore((state) => state.tick);
  const isRunning = useCityStore((state) => state.isRunning);
  const speed = useCityStore((state) => state.speed);
  const selectBuilding = useCityStore((state) => state.selectBuilding);
  const closeDrawer = useCityStore((state) => state.closeDrawer);
  const cancelPlacement = useCityStore((state) => state.cancelPlacement);
  const placementActive = useCityStore((state) => state.placement.active);
  const manualSave = useCityStore((state) => state.manualSave);

  // Centralized Simulation Tick Interval (cleans up cleanly when paused or speed changes)
  useEffect(() => {
    if (!isRunning || speed === 0) return;

    const intervalTime = Math.max(160, Math.floor(1000 / speed));
    const timer = setInterval(() => {
      tick();
    }, intervalTime);

    return () => clearInterval(timer);
  }, [isRunning, speed, tick]);

  // Periodic Auto-Save every 60 seconds
  useEffect(() => {
    const autoSaveTimer = setInterval(() => {
      manualSave();
    }, 60000);

    return () => clearInterval(autoSaveTimer);
  }, [manualSave]);

  // Global Escape Key to cancel placement, deselect, or close drawer
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (placementActive) {
          cancelPlacement();
        } else {
          selectBuilding(null);
          closeDrawer();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [placementActive, cancelPlacement, selectBuilding, closeDrawer]);

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#060b14] text-slate-100 select-none">
      {/* 1. 3D METROPOLIS VIEWPORT (Hero Attraction ~80% Attention) */}
      <CityCanvas />

      {/* 2. TOP CIVILIZATION COMMAND DECK & METRIC RIBBON */}
      <NeoCityHUD />

      {/* 3. FLOATING ORBITAL COMMAND DOCK (Bottom Aerospace Console) */}
      <OrbitalCommandDock />

      {/* 4. RETRACTABLE CITY INTELLIGENCE DRAWER */}
      <GameDrawerPanel />

      {/* 5. CONTEXTUAL BUILDING INSPECTOR (Bottom-Right Game Card) */}
      <BuildingInspectorCard />

      {/* 6. ZONING PLACEMENT FLOATING ACTION BAR */}
      <PlacementOverlayBar />

      {/* 7. HARDWARE & 3D PERFORMANCE MONITOR OVERLAY */}
      <PerformanceOverlayCard />

      {/* 8. ARCHITECTURAL EVOLUTION UPGRADE MODAL */}
      <UpgradePreviewModal />

      {/* 9. DYNAMIC CIVIC DECISION & CRISIS MODAL */}
      <EventDecisionModal />

      {/* 10. METROPOLITAN DISASTER & EMERGENCY COMMAND MODAL */}
      <EmergencyModal />

      {/* 11. POLISHED OPENING SPLASH & SAFE STARTUP SEQUENCE */}
      <GameOpeningExperience />
    </div>
  );
};

export default App;
