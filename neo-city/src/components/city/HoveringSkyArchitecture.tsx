import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useCityStore } from '../../store/useCityStore';

interface FloatingPlatformConfig {
  id: string;
  name: string;
  pos: [number, number, number];
  radius: number;
  type: 'garden' | 'observation' | 'energy' | 'billboard' | 'lounge';
  color: string;
  glowColor: string;
}

const FLOATING_PLATFORMS: FloatingPlatformConfig[] = [
  // 1. Downtown High-Altitude Holographic Billboard
  {
    id: 'fp-billboard-downtown',
    name: 'Aether Sky-Billboard Alpha',
    pos: [36, 42, -4],
    radius: 4.5,
    type: 'billboard',
    color: '#0284c7',
    glowColor: '#ec4899',
  },
  // 2. Tech District Floating Energy Collector
  {
    id: 'fp-energy-tech',
    name: 'Quantum Solar Skystation',
    pos: [46, 38, 38],
    radius: 5.2,
    type: 'energy',
    color: '#4f46e5',
    glowColor: '#00f0ff',
  },
  // 3. Residential Suspended Sky Garden
  {
    id: 'fp-garden-residential',
    name: 'Eden Suspended Botanical Deck',
    pos: [-44, 32, 28],
    radius: 6.0,
    type: 'garden',
    color: '#059669',
    glowColor: '#34d399',
  },
  // 4. Central Waterfront Floating Observation Lounge
  {
    id: 'fp-observation-waterfront',
    name: 'Celestia Harbor Sky-Lounge',
    pos: [-16, 28, -26],
    radius: 4.8,
    type: 'lounge',
    color: '#0ea5e9',
    glowColor: '#f59e0b',
  },
  // 5. West North Floating Transit Hub
  {
    id: 'fp-transit-dock',
    name: 'Zephyr High-Altitude Air-Dock',
    pos: [-38, 36, -38],
    radius: 5.5,
    type: 'observation',
    color: '#d97706',
    glowColor: '#fbbf24',
  },
];

export const HoveringSkyArchitecture: React.FC = () => {
  const lightingMode = useCityStore((state) => state.lightingMode);
  const isNight = lightingMode === 'night';
  const groupRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (groupRef.current) {
      groupRef.current.children.forEach((child, i) => {
        const offset = i * 1.2;
        child.position.y = FLOATING_PLATFORMS[i].pos[1] + Math.sin(t * 1.2 + offset) * 0.45;
        child.rotation.y = t * 0.15 * (i % 2 === 0 ? 1 : -1);
      });
    }
  });

  return (
    <group ref={groupRef} name="hovering_sky_architecture">
      {FLOATING_PLATFORMS.map((plat) => (
        <group key={plat.id} position={plat.pos}>
          {/* Main Octagonal Levitation Platform Hull */}
          <mesh castShadow receiveShadow>
            <cylinderGeometry args={[plat.radius, plat.radius * 0.85, 1.2, 8]} />
            <meshStandardMaterial color="#0f172a" metalness={0.9} roughness={0.2} />
          </mesh>

          {/* Magnetic Levitation Induction Ring (Bottom Emitter) */}
          <mesh position={[0, -0.65, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[plat.radius * 0.8, 0.22, 8, 24]} />
            <meshBasicMaterial color={plat.glowColor} toneMapped={false} />
          </mesh>

          {/* Downward Anti-Gravity Plasma Thruster Beams */}
          {[0, (2 * Math.PI) / 3, (4 * Math.PI) / 3].map((angle, ai) => (
            <mesh
              key={`beam-${ai}`}
              position={[Math.cos(angle) * (plat.radius * 0.65), -1.8, Math.sin(angle) * (plat.radius * 0.65)]}
            >
              <cylinderGeometry args={[0.08, 0.28, 2.4, 6]} />
              <meshBasicMaterial color="#00f0ff" transparent opacity={0.7} toneMapped={false} />
            </mesh>
          ))}

          {/* Platform Surface Features Based on Type */}
          {plat.type === 'garden' && (
            <group position={[0, 0.65, 0]}>
              {/* Botanical Turf & Glass Biosphere Rim */}
              <mesh rotation={[-Math.PI / 2, 0, 0]}>
                <circleGeometry args={[plat.radius * 0.9, 16]} />
                <meshStandardMaterial color="#059669" roughness={0.9} />
              </mesh>
              <mesh position={[0, 1.2, 0]}>
                <cylinderGeometry args={[plat.radius * 0.88, plat.radius * 0.88, 2.4, 16, 1, true]} />
                <meshStandardMaterial color="#34d399" transparent opacity={0.35} metalness={0.9} roughness={0.1} />
              </mesh>
              {/* Central Fountain Feature */}
              <mesh position={[0, 0.4, 0]}>
                <cylinderGeometry args={[1.2, 1.5, 0.8, 12]} />
                <meshStandardMaterial color="#ffffff" metalness={0.8} />
              </mesh>
            </group>
          )}

          {plat.type === 'energy' && (
            <group position={[0, 0.7, 0]}>
              {/* Solar Concentrator Photovoltaic Matrix */}
              <mesh rotation={[-Math.PI / 2, 0, 0]}>
                <ringGeometry args={[0.8, plat.radius * 0.9, 8]} />
                <meshStandardMaterial color="#0284c7" metalness={0.95} roughness={0.1} />
              </mesh>
              {/* Central Power Induction Spire */}
              <mesh position={[0, 2.5, 0]}>
                <cylinderGeometry args={[0.08, 0.35, 5, 8]} />
                <meshBasicMaterial color="#00f0ff" toneMapped={false} />
              </mesh>
            </group>
          )}

          {plat.type === 'billboard' && (
            <group position={[0, 2.8, 0]}>
              {/* Rotating 3D Holographic Ad Cube */}
              <mesh>
                <boxGeometry args={[plat.radius * 1.1, 4.2, 0.3]} />
                <meshBasicMaterial color="#ec4899" transparent opacity={0.85} toneMapped={false} />
              </mesh>
              <mesh rotation={[0, Math.PI / 2, 0]}>
                <boxGeometry args={[plat.radius * 1.1, 4.2, 0.3]} />
                <meshBasicMaterial color="#00f0ff" transparent opacity={0.85} toneMapped={false} />
              </mesh>
            </group>
          )}

          {plat.type === 'lounge' && (
            <group position={[0, 0.65, 0]}>
              {/* Panoramic Glass Pavilion */}
              <mesh position={[0, 1.5, 0]}>
                <cylinderGeometry args={[plat.radius * 0.8, plat.radius * 0.85, 3.0, 16]} />
                <meshStandardMaterial
                  color="#f59e0b"
                  metalness={0.9}
                  roughness={0.1}
                  transparent
                  opacity={0.6}
                />
              </mesh>
              <mesh position={[0, 3.1, 0]}>
                <cylinderGeometry args={[plat.radius * 0.85, plat.radius * 0.85, 0.2, 16]} />
                <meshStandardMaterial color="#ffffff" metalness={0.9} />
              </mesh>
            </group>
          )}

          {plat.type === 'observation' && (
            <group position={[0, 0.65, 0]}>
              {/* Landing Pad Cross H */}
              <mesh rotation={[-Math.PI / 2, 0, 0]}>
                <ringGeometry args={[plat.radius * 0.65, plat.radius * 0.75, 16]} />
                <meshBasicMaterial color="#fbbf24" toneMapped={false} />
              </mesh>
              {/* Perimeter Safety Beacon Lights */}
              {Array.from({ length: 6 }).map((_, bi) => {
                const ba = (bi * Math.PI) / 3;
                return (
                  <mesh key={`beacon-${bi}`} position={[Math.cos(ba) * plat.radius, 0.6, Math.sin(ba) * plat.radius]}>
                    <sphereGeometry args={[0.2, 6, 6]} />
                    <meshBasicMaterial color={isNight ? '#ec4899' : '#00f0ff'} toneMapped={false} />
                  </mesh>
                );
              })}
            </group>
          )}
        </group>
      ))}
    </group>
  );
};
