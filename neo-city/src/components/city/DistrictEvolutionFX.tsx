import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useCityStore } from '../../store/useCityStore';
import type { DistrictType } from '../../types/city';

interface DistrictMarker {
  type: DistrictType;
  pos: [number, number, number];
  label: string;
}

const DISTRICT_LOCATIONS: DistrictMarker[] = [
  { type: 'downtown', pos: [26, 0, -8], label: 'DOWNTOWN' },
  { type: 'tech_district', pos: [26, 0, 22], label: 'TECH CORE' },
  { type: 'residential', pos: [-26, 0, 18], label: 'ARCOLOGY' },
  { type: 'industrial', pos: [45, 0, -35], label: 'FOUNDRY' },
  { type: 'green_zone', pos: [-26, 0, -18], label: 'SANCTUARY' },
  { type: 'waterfront', pos: [0, 0, 0], label: 'PROMENADE' },
];

export const DistrictEvolutionFX: React.FC = () => {
  const districtEvolution = useCityStore((state) => state.stats.districtEvolution);
  const lightingMode = useCityStore((state) => state.lightingMode);
  const isNight = lightingMode === 'night';

  const ringGroupRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (ringGroupRef.current) {
      ringGroupRef.current.rotation.y += delta * 0.4;
    }
  });

  return (
    <group name="DistrictEvolution_Visuals" ref={ringGroupRef}>
      {DISTRICT_LOCATIONS.map((loc) => {
        const evo = districtEvolution?.[loc.type];
        if (!evo) return null;

        const tier = evo.tier;
        const [x, y, z] = loc.pos;
        const color = evo.bannerColor;
        const pillarHeight = 6 + tier * 4;

        return (
          <group key={loc.type} position={[x, y, z]}>
            {/* Holographic District Ground Beacon Ring */}
            <mesh position={[0, 0.15, 0]} rotation={[-Math.PI / 2, 0, 0]}>
              <ringGeometry args={[2.5 + tier * 0.5, 3 + tier * 0.5, 24]} />
              <meshBasicMaterial
                color={color}
                transparent
                opacity={isNight ? 0.6 : 0.3}
                side={THREE.DoubleSide}
              />
            </mesh>

            {/* Vertical Data Monolith */}
            <mesh position={[0, pillarHeight / 2, 0]}>
              <cylinderGeometry args={[0.2, 0.3, pillarHeight, 6]} />
              <meshStandardMaterial
                color={color}
                emissive={color}
                emissiveIntensity={isNight ? 0.8 * tier : 0.4 * tier}
                transparent
                opacity={0.8}
              />
            </mesh>

            {/* Apex Holographic Pulse Orb */}
            <mesh position={[0, pillarHeight + 0.6, 0]}>
              <sphereGeometry args={[0.4 + tier * 0.15, 12, 12]} />
              <meshBasicMaterial color={color} />
            </mesh>

            {/* High Tier (Tier 3-4) Skyward Laser Beam */}
            {tier >= 3 && (
              <mesh position={[0, 45, 0]}>
                <cylinderGeometry args={[0.1, 0.1, 80, 6]} />
                <meshBasicMaterial
                  color={color}
                  transparent
                  opacity={isNight ? 0.35 : 0.15}
                />
              </mesh>
            )}
          </group>
        );
      })}
    </group>
  );
};
