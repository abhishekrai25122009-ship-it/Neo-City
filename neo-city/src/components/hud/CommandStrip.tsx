import React from 'react';
import { CityIdentity } from './CityIdentity';
import { ResourceOverview } from './ResourceOverview';
import { DirectivesPanel } from './DirectivesPanel';
import { TimeControls } from './TimeControls';

export const CommandStrip: React.FC = () => {
  return (
    <div className="game-hud-panel px-3.5 py-2 rounded-xl flex items-center justify-between pointer-events-auto border border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.6)] backdrop-blur-md gap-3">
      {/* Left: Civilization Identity, Level, Era & Density Setting */}
      <div className="shrink-0">
        <CityIdentity />
      </div>

      {/* Center: Full Resource Metric Ribbon with Strict Color Branding */}
      <div className="hidden xl:flex items-center gap-2 overflow-x-auto no-scrollbar max-w-4xl">
        <ResourceOverview />
        <DirectivesPanel />
      </div>

      {/* Right: Time Controls, Weather, Perspectives & Persistence Trigger */}
      <div className="shrink-0 flex items-center gap-2">
        <div className="xl:hidden">
          <DirectivesPanel />
        </div>
        <TimeControls />
      </div>
    </div>
  );
};
