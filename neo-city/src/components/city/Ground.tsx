import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Grid } from '@react-three/drei';
import * as THREE from 'three';
import { useCityStore } from '../../store/useCityStore';

export const Ground: React.FC = () => {
  const gridVisible = useCityStore((state) => state.gridVisible);
  const lightingMode = useCityStore((state) => state.lightingMode);

  const waterRef = useRef<THREE.Mesh>(null);

  // Smooth river water ripple without allocations
  useFrame(({ clock }) => {
    if (waterRef.current) {
      waterRef.current.position.y = -0.1 + Math.sin(clock.getElapsedTime() * 1.5) * 0.02;
    }
  });

  const isNight = lightingMode === 'night';
  const isSunset = lightingMode === 'sunset';

  return (
    <group position={[0, 0, 0]}>
      {/* ========================================================
          0. VAST OUTER HORIZON SUBTERRANEAN APRON (Spans 750m x 750m)
          Eliminates floating void appearance from any camera angle
          ======================================================== */}
      <mesh receiveShadow position={[0, -0.45, 0]}>
        <boxGeometry args={[750, 0.4, 750]} />
        <meshStandardMaterial
          color={isNight ? '#030816' : isSunset ? '#0e0b1f' : '#0f172a'}
          roughness={0.9}
          metalness={0.1}
        />
      </mesh>

      {/* Distant Cyber City Grid Lines on Horizon Substrate */}
      <mesh position={[0, -0.24, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[720, 720]} />
        <meshStandardMaterial
          color={isNight ? '#050f24' : '#1e293b'}
          roughness={0.95}
          wireframe={isNight}
          transparent
          opacity={isNight ? 0.08 : 0.2}
        />
      </mesh>

      {/* ========================================================
          1. CONTINUOUS WEST BANK EXPANDABLE TERRAIN FOUNDATION
          Spans X = -170 to -9.5 (Width 160.5m), Z = -170 to +170 (Depth 340m)
          ======================================================== */}
      <mesh receiveShadow position={[-90, -0.15, 0]}>
        <boxGeometry args={[161, 0.5, 340]} />
        <meshStandardMaterial
          color={isNight ? '#0b1626' : isSunset ? '#1a1836' : '#1e293b'}
          roughness={0.7}
          metalness={0.25}
        />
      </mesh>

      {/* West Bank Inner Urban Pavement Slab (Central district finish) */}
      <mesh receiveShadow position={[-35, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[51, 140]} />
        <meshStandardMaterial
          color={isNight ? '#0f172a' : '#334155'}
          roughness={0.65}
          metalness={0.2}
        />
      </mesh>

      {/* West Bank Park Turf & Garden Expansion Parcel */}
      <mesh receiveShadow position={[-95, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[70, 260]} />
        <meshStandardMaterial
          color={isNight ? '#022c22' : '#064e3b'}
          roughness={0.85}
        />
      </mesh>

      {/* ========================================================
          2. CONTINUOUS EAST BANK EXPANDABLE TERRAIN FOUNDATION
          Spans X = 9.5 to 170 (Width 160.5m), Z = -170 to +170 (Depth 340m)
          ======================================================== */}
      <mesh receiveShadow position={[90, -0.15, 0]}>
        <boxGeometry args={[161, 0.5, 340]} />
        <meshStandardMaterial
          color={isNight ? '#0b1626' : isSunset ? '#1a1836' : '#1e293b'}
          roughness={0.7}
          metalness={0.25}
        />
      </mesh>

      {/* East Bank Inner Commercial Granite Slab */}
      <mesh receiveShadow position={[35, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[51, 140]} />
        <meshStandardMaterial
          color={isNight ? '#0f172a' : '#334155'}
          roughness={0.65}
          metalness={0.2}
        />
      </mesh>

      {/* East Bank Technology & Industrial Expansion Parcel */}
      <mesh receiveShadow position={[95, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[70, 260]} />
        <meshStandardMaterial
          color={isNight ? '#0f172a' : '#1e293b'}
          roughness={0.75}
        />
      </mesh>

      {/* ========================================================
          3. CONTINUOUS RIVER BAY, EMBANKMENTS & WATER QUAYS
          Channel runs seamlessly from Z = -170 to +170 along X in [-9.5, +9.5]
          ======================================================== */}
      {/* Animated Water Surface */}
      <mesh
        ref={waterRef}
        position={[0, -0.1, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <planeGeometry args={[360, 360]} />
        <meshStandardMaterial
          color={isNight ? '#0284c7' : isSunset ? '#06b6d4' : '#0ea5e9'}
          roughness={0.12}
          metalness={0.88}
          transparent
          opacity={0.88}
        />
      </mesh>

      {/* Deep Riverbed Substrate */}
      <mesh position={[0, -0.65, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[380, 380]} />
        <meshStandardMaterial color="#020e1f" roughness={0.98} />
      </mesh>

      {/* West Waterfront Reinforced Concrete Quay (Continuous Z=-170 to +170) */}
      <mesh position={[-9.5, 0.15, 0]}>
        <boxGeometry args={[0.8, 0.45, 340]} />
        <meshStandardMaterial color="#0284c7" metalness={0.75} roughness={0.25} />
      </mesh>

      {/* East Waterfront Reinforced Concrete Quay (Continuous Z=-170 to +170) */}
      <mesh position={[9.5, 0.15, 0]}>
        <boxGeometry args={[0.8, 0.45, 340]} />
        <meshStandardMaterial color="#0284c7" metalness={0.75} roughness={0.25} />
      </mesh>

      {/* Waterfront Promenade LED Glow Line (West) */}
      <mesh position={[-9.15, 0.28, 0]}>
        <boxGeometry args={[0.1, 0.05, 340]} />
        <meshBasicMaterial color="#00f0ff" />
      </mesh>

      {/* Waterfront Promenade LED Glow Line (East) */}
      <mesh position={[9.15, 0.28, 0]}>
        <boxGeometry args={[0.1, 0.05, 340]} />
        <meshBasicMaterial color="#00f0ff" />
      </mesh>

      {/* ========================================================
          4. CENTRAL CELESTIAL ISLAND & CONNECTOR BRIDGES
          ======================================================== */}
      <mesh receiveShadow position={[0, -0.1, 0]}>
        <cylinderGeometry args={[11, 11.5, 0.5, 36]} />
        <meshStandardMaterial
          color={isNight ? '#0f172a' : '#334155'}
          roughness={0.5}
          metalness={0.35}
        />
      </mesh>

      {/* Celestial Island Granite Plaza Ring */}
      <mesh position={[0, 0.16, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[8.5, 11, 36]} />
        <meshStandardMaterial
          color="#f1f5f9"
          roughness={0.3}
          metalness={0.7}
        />
      </mesh>

      {/* Central Island Pedestrian Connecting Piers */}
      <mesh position={[5.5, 0.16, 0]}>
        <boxGeometry args={[6, 0.25, 4]} />
        <meshStandardMaterial color="#334155" metalness={0.5} />
      </mesh>
      <mesh position={[-5.5, 0.16, 0]}>
        <boxGeometry args={[6, 0.25, 4]} />
        <meshStandardMaterial color="#334155" metalness={0.5} />
      </mesh>

      {/* ========================================================
          5. DUAL GRAND SUSPENSION BRIDGES
          ======================================================== */}
      {/* North Suspension Bridge (Z = 16) */}
      <group position={[0, 0.35, 16]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[20, 0.35, 5]} />
          <meshStandardMaterial color="#0f172a" metalness={0.7} roughness={0.3} />
        </mesh>
        <mesh position={[0, 0.19, 0]}>
          <boxGeometry args={[19.8, 0.02, 0.12]} />
          <meshBasicMaterial color="#f59e0b" />
        </mesh>
        {/* West Tower Pylon */}
        <mesh position={[-8, 4.2, 2.3]}>
          <boxGeometry args={[0.7, 8.4, 0.7]} />
          <meshStandardMaterial color="#ffffff" metalness={0.8} roughness={0.2} />
        </mesh>
        <mesh position={[-8, 4.2, -2.3]}>
          <boxGeometry args={[0.7, 8.4, 0.7]} />
          <meshStandardMaterial color="#ffffff" metalness={0.8} roughness={0.2} />
        </mesh>
        <mesh position={[-8, 8, 0]}>
          <boxGeometry args={[0.7, 0.6, 5.2]} />
          <meshStandardMaterial color="#ffffff" metalness={0.8} roughness={0.2} />
        </mesh>
        {/* East Tower Pylon */}
        <mesh position={[8, 4.2, 2.3]}>
          <boxGeometry args={[0.7, 8.4, 0.7]} />
          <meshStandardMaterial color="#ffffff" metalness={0.8} roughness={0.2} />
        </mesh>
        <mesh position={[8, 4.2, -2.3]}>
          <boxGeometry args={[0.7, 8.4, 0.7]} />
          <meshStandardMaterial color="#ffffff" metalness={0.8} roughness={0.2} />
        </mesh>
        <mesh position={[8, 8, 0]}>
          <boxGeometry args={[0.7, 0.6, 5.2]} />
          <meshStandardMaterial color="#ffffff" metalness={0.8} roughness={0.2} />
        </mesh>
      </group>

      {/* South Suspension Bridge (Z = -16) */}
      <group position={[0, 0.35, -16]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[20, 0.35, 5]} />
          <meshStandardMaterial color="#0f172a" metalness={0.7} roughness={0.3} />
        </mesh>
        <mesh position={[0, 0.19, 0]}>
          <boxGeometry args={[19.8, 0.02, 0.12]} />
          <meshBasicMaterial color="#f59e0b" />
        </mesh>
        {/* West Tower Pylon */}
        <mesh position={[-8, 4.2, 2.3]}>
          <boxGeometry args={[0.7, 8.4, 0.7]} />
          <meshStandardMaterial color="#ffffff" metalness={0.8} roughness={0.2} />
        </mesh>
        <mesh position={[-8, 4.2, -2.3]}>
          <boxGeometry args={[0.7, 8.4, 0.7]} />
          <meshStandardMaterial color="#ffffff" metalness={0.8} roughness={0.2} />
        </mesh>
        <mesh position={[-8, 8, 0]}>
          <boxGeometry args={[0.7, 0.6, 5.2]} />
          <meshStandardMaterial color="#ffffff" metalness={0.8} roughness={0.2} />
        </mesh>
        {/* East Tower Pylon */}
        <mesh position={[8, 4.2, 2.3]}>
          <boxGeometry args={[0.7, 8.4, 0.7]} />
          <meshStandardMaterial color="#ffffff" metalness={0.8} roughness={0.2} />
        </mesh>
        <mesh position={[8, 4.2, -2.3]}>
          <boxGeometry args={[0.7, 8.4, 0.7]} />
          <meshStandardMaterial color="#ffffff" metalness={0.8} roughness={0.2} />
        </mesh>
        <mesh position={[8, 8, 0]}>
          <boxGeometry args={[0.7, 0.6, 5.2]} />
          <meshStandardMaterial color="#ffffff" metalness={0.8} roughness={0.2} />
        </mesh>
      </group>

      {/* ========================================================
          6. EXPANSIVE TACTICAL GRID OVERLAY (Spans 280m x 280m)
          Covers all buildable metropolitan sectors without drop-off
          ======================================================== */}
      {gridVisible && (
        <Grid
          position={[0, 0.16, 0]}
          args={[300, 300]}
          cellSize={3}
          cellThickness={0.7}
          cellColor={isNight ? '#0284c7' : '#94a3b8'}
          sectionSize={12}
          sectionThickness={1.4}
          sectionColor={isNight ? '#00f0ff' : '#0284c7'}
          fadeDistance={340}
          fadeStrength={1.2}
          infiniteGrid={false}
        />
      )}
    </group>
  );
};
