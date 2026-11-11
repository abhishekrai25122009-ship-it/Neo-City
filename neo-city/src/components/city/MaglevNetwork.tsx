import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useCityStore } from '../../store/useCityStore';

interface StationConfig {
  name: string;
  pos: [number, number, number];
  color: string;
}

export const MaglevNetwork: React.FC = () => {
  const lightingMode = useCityStore((state) => state.lightingMode);
  const isNight = lightingMode === 'night';

  const train1Ref = useRef<THREE.Group>(null);
  const train2Ref = useRef<THREE.Group>(null);
  const cargoTrainRef = useRef<THREE.Group>(null);

  // Closed-loop Inter-District Maglev Guideway Spline
  const trackCurve = useMemo(() => {
    return new THREE.CatmullRomCurve3(
      [
        new THREE.Vector3(30, 14, 0), // Financial Core Station
        new THREE.Vector3(34, 15, 24),
        new THREE.Vector3(32, 14, 46), // Tech District Station
        new THREE.Vector3(12, 16, 52), // North Trans-Bay Crossing
        new THREE.Vector3(-14, 16, 44),
        new THREE.Vector3(-32, 14, 22), // Residential Station
        new THREE.Vector3(-36, 14, -12),
        new THREE.Vector3(-28, 15, -38), // Waterfront South Station
        new THREE.Vector3(-8, 16, -42), // South Trans-Bay Crossing
        new THREE.Vector3(18, 15, -34),
        new THREE.Vector3(28, 14, -16),
      ],
      true // Closed Loop
    );
  }, []);

  // Passenger Stations along the track
  const stations: StationConfig[] = [
    { name: 'Financial Core Terminal', pos: [30, 14, 0], color: '#f59e0b' },
    { name: 'Quantum Silicon Sky-Station', pos: [32, 14, 46], color: '#00f0ff' },
    { name: 'Arcology Habitation Station', pos: [-32, 14, 22], color: '#ec4899' },
    { name: 'Nova Marina South Terminal', pos: [-28, 15, -38], color: '#38bdf8' },
  ];

  // Train motion simulation along the spline
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();

    // 1. High-Speed Interdistrict Maglev (Passenger 01)
    if (train1Ref.current) {
      const u = (t * 0.04) % 1;
      const pt = trackCurve.getPointAt(u);
      const tangent = trackCurve.getTangentAt(u);
      train1Ref.current.position.copy(pt);
      train1Ref.current.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), tangent);
    }

    // 2. High-Speed Interdistrict Maglev (Passenger 02 - opposite phase)
    if (train2Ref.current) {
      const u = (t * 0.04 + 0.5) % 1;
      const pt = trackCurve.getPointAt(u);
      const tangent = trackCurve.getTangentAt(u);
      train2Ref.current.position.copy(pt);
      train2Ref.current.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), tangent);
    }

    // 3. Automated Cargo Pod Train (slightly slower)
    if (cargoTrainRef.current) {
      const u = (t * 0.025 + 0.25) % 1;
      const pt = trackCurve.getPointAt(u);
      const tangent = trackCurve.getTangentAt(u);
      cargoTrainRef.current.position.copy(pt);
      cargoTrainRef.current.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), tangent);
    }
  });

  // Memoized track tube geometries to eliminate allocations during re-renders
  const trackTubeGeo = useMemo(() => new THREE.TubeGeometry(trackCurve, 128, 0.5, 8, true), [trackCurve]);
  const railTubeGeo = useMemo(() => new THREE.TubeGeometry(trackCurve, 128, 0.1, 4, true), [trackCurve]);

  return (
    <group name="futuristic_maglev_transit">
      {/* ========================================================
          1. ELEVATED CONTINUOUS MAGNETIC GUIDEWAY MONORAIL TRACK
          ======================================================== */}
      {/* Track Structural Beam */}
      <mesh geometry={trackTubeGeo}>
        <meshStandardMaterial color="#0f172a" metalness={0.9} roughness={0.25} />
      </mesh>

      {/* Pulsing Magnetic Conduction Rail (Top) */}
      <mesh geometry={railTubeGeo} position={[0, 0.52, 0]}>
        <meshBasicMaterial color="#00f0ff" toneMapped={false} />
      </mesh>

      {/* Structural Support Pylons down to ground level */}
      {Array.from({ length: 14 }).map((_, pi) => {
        const u = pi / 14;
        const pt = trackCurve.getPointAt(u);
        return (
          <group key={`mag-pyl-${pi}`} position={[pt.x, pt.y / 2, pt.z]}>
            <mesh>
              <cylinderGeometry args={[0.4, 0.6, pt.y, 8]} />
              <meshStandardMaterial color="#1e293b" metalness={0.85} roughness={0.3} />
            </mesh>
            {/* Pylon Light Collar */}
            <mesh position={[0, pt.y / 2 - 0.5, 0]}>
              <cylinderGeometry args={[0.55, 0.55, 0.3, 8]} />
              <meshBasicMaterial color="#38bdf8" toneMapped={false} />
            </mesh>
          </group>
        );
      })}

      {/* ========================================================
          2. ELEVATED STATIONS & PASSENGER PLATFORMS
          ======================================================== */}
      {stations.map((st, i) => (
        <group key={`st-${i}`} position={st.pos}>
          {/* Station Platform Deck */}
          <mesh castShadow receiveShadow>
            <boxGeometry args={[7.5, 0.6, 12]} />
            <meshStandardMaterial color="#0f172a" metalness={0.85} roughness={0.2} />
          </mesh>

          {/* Glowing Platform Safety Edge Strips */}
          <mesh position={[-3.65, 0.32, 0]}>
            <boxGeometry args={[0.15, 0.05, 11.5]} />
            <meshBasicMaterial color={st.color} toneMapped={false} />
          </mesh>
          <mesh position={[3.65, 0.32, 0]}>
            <boxGeometry args={[0.15, 0.05, 11.5]} />
            <meshBasicMaterial color={st.color} toneMapped={false} />
          </mesh>

          {/* Arched Translucent Glass Canopy Roof */}
          <mesh position={[0, 3.2, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[4.2, 4.2, 11.8, 16, 1, true, 0, Math.PI]} />
            <meshStandardMaterial
              color="#0284c7"
              transparent
              opacity={0.45}
              metalness={0.9}
              roughness={0.1}
              side={THREE.DoubleSide}
            />
          </mesh>

          {/* Central Animated Station Indicator Hologram */}
          <mesh position={[0, 2.5, 0]}>
            <boxGeometry args={[2.5, 0.8, 0.1]} />
            <meshBasicMaterial color="#ffffff" toneMapped={false} />
          </mesh>

          {/* Ground Access Elevator Column */}
          <mesh position={[0, -st.pos[1] / 2, 0]}>
            <cylinderGeometry args={[0.8, 0.8, st.pos[1], 8]} />
            <meshStandardMaterial color="#1e293b" metalness={0.8} />
          </mesh>
        </group>
      ))}

      {/* ========================================================
          3. AERODYNAMIC HIGH-SPEED MAGLEV TRAIN 01 (Passenger)
          ======================================================== */}
      <group ref={train1Ref}>
        {/* Streamlined Nose Engine Pod */}
        <mesh position={[0, 0.45, 0]} castShadow>
          <boxGeometry args={[1.2, 0.9, 5.2]} />
          <meshStandardMaterial color="#ffffff" metalness={0.95} roughness={0.1} />
        </mesh>
        {/* Illuminated Passenger Cabin Window Strip */}
        <mesh position={[0, 0.55, 0]}>
          <boxGeometry args={[1.25, 0.35, 4.2]} />
          <meshBasicMaterial color="#00f0ff" toneMapped={false} />
        </mesh>
        {/* Aerodynamic Tapered Nose Cone */}
        <mesh position={[0, 0.45, 2.9]} rotation={[Math.PI / 2, 0, 0]}>
          <coneGeometry args={[0.6, 1.4, 8]} />
          <meshStandardMaterial color="#f8fafc" metalness={0.95} />
        </mesh>
        {/* Underbody Magnetic Levitation Glow */}
        <mesh position={[0, 0.05, 0]}>
          <boxGeometry args={[1.3, 0.15, 4.8]} />
          <meshBasicMaterial color="#38bdf8" toneMapped={false} />
        </mesh>
      </group>

      {/* ========================================================
          4. AERODYNAMIC HIGH-SPEED MAGLEV TRAIN 02 (Passenger)
          ======================================================== */}
      <group ref={train2Ref}>
        <mesh position={[0, 0.45, 0]} castShadow>
          <boxGeometry args={[1.2, 0.9, 5.2]} />
          <meshStandardMaterial color="#ffffff" metalness={0.95} roughness={0.1} />
        </mesh>
        <mesh position={[0, 0.55, 0]}>
          <boxGeometry args={[1.25, 0.35, 4.2]} />
          <meshBasicMaterial color="#ec4899" toneMapped={false} />
        </mesh>
        <mesh position={[0, 0.45, 2.9]} rotation={[Math.PI / 2, 0, 0]}>
          <coneGeometry args={[0.6, 1.4, 8]} />
          <meshStandardMaterial color="#f8fafc" metalness={0.95} />
        </mesh>
        <mesh position={[0, 0.05, 0]}>
          <boxGeometry args={[1.3, 0.15, 4.8]} />
          <meshBasicMaterial color="#ec4899" toneMapped={false} />
        </mesh>
      </group>

      {/* ========================================================
          5. AUTOMATED CONTAINER CARGO TRAIN
          ======================================================== */}
      <group ref={cargoTrainRef}>
        <mesh position={[0, 0.45, 0]} castShadow>
          <boxGeometry args={[1.3, 1.0, 5.8]} />
          <meshStandardMaterial color="#b45309" metalness={0.8} roughness={0.3} />
        </mesh>
        {/* Glowing Orange Cargo Pod Containers */}
        <mesh position={[0, 0.65, 1.2]}>
          <boxGeometry args={[1.15, 0.8, 1.8]} />
          <meshStandardMaterial color="#d97706" emissive="#fbbf24" emissiveIntensity={isNight ? 1.5 : 0.6} />
        </mesh>
        <mesh position={[0, 0.65, -1.2]}>
          <boxGeometry args={[1.15, 0.8, 1.8]} />
          <meshStandardMaterial color="#0284c7" emissive="#00f0ff" emissiveIntensity={isNight ? 1.5 : 0.6} />
        </mesh>
        <mesh position={[0, 0.05, 0]}>
          <boxGeometry args={[1.35, 0.15, 5.4]} />
          <meshBasicMaterial color="#f59e0b" toneMapped={false} />
        </mesh>
      </group>
    </group>
  );
};
