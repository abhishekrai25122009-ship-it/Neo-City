import React, { useState, useEffect } from 'react';
import { useCityStore } from '../../store/useCityStore';
import { Atmosphere } from './Atmosphere';
import { Ground } from './Ground';
import { RoadNetwork } from './RoadNetwork';
import { DistrictParks } from './DistrictParks';
import { AerialSkyStations } from './AerialSkyStations';
import { DynamicWeather } from './DynamicWeather';
import { MegaProjects3D } from './MegaProjects3D';
import { DistrictEvolutionFX } from './DistrictEvolutionFX';
import { TrafficSimulation } from './TrafficSimulation';
import { AerialSkywaySimulation } from './AerialSkywaySimulation';
import { PedestrianSimulation } from './PedestrianSimulation';
import { BuildingMesh } from './BuildingMesh';
import { CameraRig } from './CameraRig';
import { PlacementPreview } from './PlacementPreview';
import { PerformanceTracker } from './PerformanceTracker';
import { CentralCitadel } from './CentralCitadel';
import { HoveringSkyArchitecture } from './HoveringSkyArchitecture';
import { CurvedFlyovers } from './CurvedFlyovers';
import { MaglevNetwork } from './MaglevNetwork';
import { GroundCivicFabric } from './GroundCivicFabric';

export const CityScene: React.FC = () => {
  const buildings = useCityStore((state) => state.buildings);
  const selectBuilding = useCityStore((state) => state.selectBuilding);
  const placementActive = useCityStore((state) => state.placement.active);
  const selectedBuildingId = useCityStore((state) => state.selectedBuildingId);
  const lightingMode = useCityStore((state) => state.lightingMode);
  const graphicsPreset = useCityStore((state) => state.graphics.preset);
  const [simReady, setSimReady] = useState(false);

  // Safe Startup Mode: Ensure the core world geometry and lighting compile on frame 0,
  // then stagger dynamic instanced fleets (traffic, pedestrians, skyways) seamlessly.
  useEffect(() => {
    const timer = setTimeout(() => {
      setSimReady(true);
    }, 120);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <Atmosphere />
      <CameraRig />
      <PerformanceTracker />

      {/* Main Geography & Infrastructure */}
      <Ground />
      <RoadNetwork />
      <DistrictParks />
      <GroundCivicFabric />
      <CurvedFlyovers />
      <MaglevNetwork />
      <AerialSkyStations />
      <HoveringSkyArchitecture />
      <CentralCitadel />
      <DynamicWeather />
      <MegaProjects3D />

      {/* Dynamic Multi-Route Traffic, Aerial Skyways, Pedestrians & District Evolution */}
      {simReady && (
        <>
          <DistrictEvolutionFX />
          <TrafficSimulation />
          <AerialSkywaySimulation />
          <PedestrianSimulation />
        </>
      )}

      {/* Dynamic Building Placement Ghost */}
      <PlacementPreview />

      {/* City Buildings */}
      <group>
        {buildings.map((building) => (
          <BuildingMesh
            key={`${building.id}-lvl-${building.level}`}
            building={building}
            isSelected={building.id === selectedBuildingId}
            lightingMode={lightingMode}
            graphicsPreset={graphicsPreset}
          />
        ))}
      </group>

      {/* Empty space click detector to clear selection */}
      {!placementActive && (
        <mesh
          position={[0, -0.2, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
          onPointerDown={(e) => {
            if (e.intersections.length === 1) {
              selectBuilding(null);
            }
          }}
        >
          <planeGeometry args={[400, 400]} />
          <meshBasicMaterial visible={false} />
        </mesh>
      )}
    </>
  );
};
