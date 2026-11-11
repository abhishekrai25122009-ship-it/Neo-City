import React, { useState } from 'react';
import { OrbitalCityIdentity } from './OrbitalCityIdentity';
import { OrbitalTelemetryCluster } from './OrbitalTelemetryCluster';
import { OrbitalChronometer } from './OrbitalChronometer';
import { ContextualResourceSurface } from './ContextualResourceSurface';
import { AlertsPanel } from './AlertsPanel';
import { DistrictInspector } from './DistrictInspector';
import { SaveLoadPanel } from './SaveLoadPanel';
import { CitizenDossierCard } from './CitizenDossierCard';

export const NeoCityHUD: React.FC = () => {
  const [selectedResource, setSelectedResource] = useState<string | null>(null);

  return (
    <>
      {/* ========================================================
          NEO CITY — ORBITAL COMMAND ASYMMETRIC TOP HEADER
          ======================================================== */}
      <header className="fixed top-2 inset-x-2 md:inset-x-4 z-40 pointer-events-none flex flex-col gap-2">
        <div className="orbital-surface px-4 py-2.5 rounded-2xl flex flex-wrap items-center justify-between pointer-events-auto border border-white/10 shadow-[0_15px_40px_rgba(0,0,0,0.85)] gap-3">
          {/* Left Wing: City Identity, Flagship Crest & Level */}
          <div className="shrink-0">
            <OrbitalCityIdentity />
          </div>

          {/* Center Cluster: Asymmetric Tactical Instruments */}
          <div className="hidden lg:flex items-center gap-2 overflow-x-auto no-scrollbar max-w-5xl">
            <OrbitalTelemetryCluster
              onSelectResource={(id) => setSelectedResource(id)}
              selectedResource={selectedResource}
            />
          </div>

          {/* Right Wing: Orbital Chronometer, Speed & Quick-Save */}
          <div className="shrink-0">
            <OrbitalChronometer />
          </div>
        </div>

        {/* Emergency & Policy Alerts Ribbon */}
        <AlertsPanel />
      </header>

      {/* Deep-Dive Contextual Resource Surface Modal */}
      <ContextualResourceSurface
        resourceId={selectedResource}
        onClose={() => setSelectedResource(null)}
      />

      {/* Floating Spatial District Inspector Card */}
      <DistrictInspector />

      {/* Floating Interactive Citizen Dossier Card */}
      <CitizenDossierCard />

      {/* Dedicated Multi-Slot Persistence Modal */}
      <SaveLoadPanel />
    </>
  );
};

export default NeoCityHUD;
