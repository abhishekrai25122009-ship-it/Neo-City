import React from 'react';
import { useCityStore } from '../../store/useCityStore';

interface TerminalConfig {
  name: string;
  pos: [number, number, number];
  color: string;
  glowColor: string;
}

export const AerialSkyStations: React.FC = () => {
  const lightingMode = useCityStore((state) => state.lightingMode);
  const isNight = lightingMode === 'night';

  const terminals: TerminalConfig[] = [
    {
      name: 'Central Inter-Modal Bay Terminal',
      pos: [0, 32, 0],
      color: '#0284c7',
      glowColor: '#00f0ff',
    },
    {
      name: 'North Innovation Sky-Port',
      pos: [28, 24, 48],
      color: '#059669',
      glowColor: '#34d399',
    },
    {
      name: 'South Financial Sky-Terminal',
      pos: [28, 24, -48],
      color: '#d97706',
      glowColor: '#fbbf24',
    },
    {
      name: 'West Residential Sky-Dock',
      pos: [-26, 20, 0],
      color: '#9333ea',
      glowColor: '#c084fc',
    },
  ];

  return (
    <group name="aerial_transit_stations">
      {terminals.map((term, i) => (
        <group key={`station-${i}`} position={term.pos}>
          {/* Main Octagonal Landing Platform Deck */}
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <circleGeometry args={[4.5, 8]} />
            <meshStandardMaterial color="#0f172a" metalness={0.85} roughness={0.2} />
          </mesh>

          {/* Golden/Cyan Perimeter Landing Ring */}
          <mesh position={[0, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[3.8, 4.3, 8]} />
            <meshBasicMaterial color={term.glowColor} toneMapped={false} />
          </mesh>

          {/* Central Holographic Landing "H" */}
          <group position={[0, 0.06, 0]}>
            <mesh rotation={[-Math.PI / 2, 0, 0]}>
              <planeGeometry args={[0.35, 1.8]} />
              <meshBasicMaterial color="#ffffff" toneMapped={false} />
            </mesh>
            <mesh position={[-0.8, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
              <planeGeometry args={[0.3, 2.2]} />
              <meshBasicMaterial color="#ffffff" toneMapped={false} />
            </mesh>
            <mesh position={[0.8, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
              <planeGeometry args={[0.3, 2.2]} />
              <meshBasicMaterial color="#ffffff" toneMapped={false} />
            </mesh>
          </group>

          {/* Approach Beacon Light Towers (4 corner pylons) */}
          {[
            [-3.5, 3.5],
            [3.5, 3.5],
            [-3.5, -3.5],
            [3.5, -3.5],
          ].map(([bx, bz], bi) => (
            <group key={`beacon-${bi}`} position={[bx, 0.6, bz]}>
              <mesh>
                <cylinderGeometry args={[0.08, 0.1, 1.2, 6]} />
                <meshStandardMaterial color="#1e293b" metalness={0.9} />
              </mesh>
              <mesh position={[0, 0.7, 0]}>
                <sphereGeometry args={[0.18, 6, 6]} />
                <meshBasicMaterial color={isNight ? '#38bdf8' : term.glowColor} toneMapped={false} />
              </mesh>
            </group>
          ))}

          {/* Sub-Deck Supporting Pylon Structure */}
          <mesh position={[0, -2, 0]}>
            <cylinderGeometry args={[2.5, 1.2, 4, 8]} />
            <meshStandardMaterial color="#1e293b" metalness={0.8} roughness={0.3} />
          </mesh>
        </group>
      ))}
    </group>
  );
};
