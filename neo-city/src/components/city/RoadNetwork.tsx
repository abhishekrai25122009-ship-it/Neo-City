import React, { useMemo } from 'react';
import { useCityStore } from '../../store/useCityStore';

export const RoadNetwork: React.FC = () => {
  const lightingMode = useCityStore((state) => state.lightingMode);
  const isNight = lightingMode === 'night';

  // Major cross-avenue transit corridors with expansive city-block spacing
  const crossAvenues = useMemo(
    () => [-140, -120, -80, -40, 0, 40, 80, 120, 140],
    []
  );

  return (
    <group position={[0, 0.12, 0]}>
      {/* ========================================================
          1. EAST BANK ARTERIAL NETWORK (EXPANDED TO X = 135)
          ======================================================== */}
      {/* Primary East Bank Boulevard (X = 24, spans Z = -160 to +160) */}
      <mesh position={[24, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[3.6, 320]} />
        <meshStandardMaterial color={isNight ? '#0b1626' : '#1e293b'} roughness={0.6} />
      </mesh>
      <mesh position={[24, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.08, 320]} />
        <meshBasicMaterial color="#00f0ff" transparent opacity={isNight ? 0.8 : 0.4} />
      </mesh>

      {/* Mid East Arterial (X = 64, spans Z = -160 to +160) */}
      <mesh position={[64, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[3.2, 320]} />
        <meshStandardMaterial color={isNight ? '#0b1626' : '#1e293b'} roughness={0.6} />
      </mesh>
      <mesh position={[64, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.08, 320]} />
        <meshBasicMaterial color="#38bdf8" transparent opacity={isNight ? 0.7 : 0.35} />
      </mesh>

      {/* Far East Outer Expansion Arterial (X = 104, spans Z = -160 to +160) */}
      <mesh position={[104, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[3.2, 320]} />
        <meshStandardMaterial color={isNight ? '#0b1626' : '#1e293b'} roughness={0.6} />
      </mesh>
      <mesh position={[104, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.08, 320]} />
        <meshBasicMaterial color="#fbbf24" transparent opacity={isNight ? 0.7 : 0.35} />
      </mesh>

      {/* ========================================================
          2. WEST BANK ARTERIAL NETWORK (EXPANDED TO X = -135)
          ======================================================== */}
      {/* Primary West Bank Boulevard (X = -22, spans Z = -160 to +160) */}
      <mesh position={[-22, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[3.6, 320]} />
        <meshStandardMaterial color={isNight ? '#0b1626' : '#1e293b'} roughness={0.6} />
      </mesh>
      <mesh position={[-22, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.08, 320]} />
        <meshBasicMaterial color="#38bdf8" transparent opacity={isNight ? 0.8 : 0.4} />
      </mesh>

      {/* Mid West Arterial (X = -64, spans Z = -160 to +160) */}
      <mesh position={[-64, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[3.2, 320]} />
        <meshStandardMaterial color={isNight ? '#0b1626' : '#1e293b'} roughness={0.6} />
      </mesh>
      <mesh position={[-64, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.08, 320]} />
        <meshBasicMaterial color="#34d399" transparent opacity={isNight ? 0.7 : 0.35} />
      </mesh>

      {/* Far West Outer Expansion Arterial (X = -104, spans Z = -160 to +160) */}
      <mesh position={[-104, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[3.2, 320]} />
        <meshStandardMaterial color={isNight ? '#0b1626' : '#1e293b'} roughness={0.6} />
      </mesh>
      <mesh position={[-104, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.08, 320]} />
        <meshBasicMaterial color="#a855f7" transparent opacity={isNight ? 0.7 : 0.35} />
      </mesh>

      {/* ========================================================
          3. EXPANDED INTER-DISTRICT CROSS STREETS (Spanning X: -135 to +135)
          ======================================================== */}
      {crossAvenues.map((z) => (
        <group key={`street-${z}`}>
          {/* West Bank cross street (from waterfront X=-10 to outer boundary X=-135) */}
          <mesh position={[-72.5, 0.01, z]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[125, 2.6]} />
            <meshStandardMaterial color={isNight ? '#091322' : '#1e293b'} roughness={0.65} />
          </mesh>

          {/* East Bank cross street (from waterfront X=+10 to outer boundary X=+135) */}
          <mesh position={[72.5, 0.01, z]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[125, 2.6]} />
            <meshStandardMaterial color={isNight ? '#091322' : '#1e293b'} roughness={0.65} />
          </mesh>
        </group>
      ))}

      {/* ========================================================
          4. BRIDGE TRANSIT HIGHWAYS (Connecting East & West across the Bay)
          ======================================================== */}
      {/* North Bridge Transit Highway (Z = 16) */}
      <mesh position={[0, 0.3, 16]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[60, 2.6]} />
        <meshStandardMaterial color={isNight ? '#091322' : '#1e293b'} roughness={0.5} />
      </mesh>
      <mesh position={[0, 0.31, 16]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[60, 0.1]} />
        <meshBasicMaterial color="#00f0ff" transparent opacity={0.8} />
      </mesh>

      {/* South Bridge Transit Highway (Z = -16) */}
      <mesh position={[0, 0.3, -16]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[60, 2.6]} />
        <meshStandardMaterial color={isNight ? '#091322' : '#1e293b'} roughness={0.5} />
      </mesh>
      <mesh position={[0, 0.31, -16]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[60, 0.1]} />
        <meshBasicMaterial color="#00f0ff" transparent opacity={0.8} />
      </mesh>
    </group>
  );
};
