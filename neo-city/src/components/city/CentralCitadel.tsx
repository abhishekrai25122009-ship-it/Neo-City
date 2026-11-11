import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useCityStore } from '../../store/useCityStore';

export const CentralCitadel: React.FC = () => {
  const lightingMode = useCityStore((state) => state.lightingMode);
  const isNight = lightingMode === 'night';

  const ring1Ref = useRef<THREE.Group>(null);
  const ring2Ref = useRef<THREE.Group>(null);
  const coreRef = useRef<THREE.Mesh>(null);
  const emblemRef = useRef<THREE.Group>(null);
  const beaconRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();

    // 1. Massive Halo Rings rotation
    if (ring1Ref.current) {
      ring1Ref.current.rotation.y = t * 0.4;
      ring1Ref.current.rotation.z = Math.sin(t * 0.3) * 0.12;
    }
    if (ring2Ref.current) {
      ring2Ref.current.rotation.y = -t * 0.6;
      ring2Ref.current.rotation.x = Math.cos(t * 0.25) * 0.15;
    }

    // 2. Pulsating Quantum Energy Core
    if (coreRef.current) {
      const scale = 1.0 + Math.sin(t * 3) * 0.08;
      coreRef.current.scale.set(scale, scale, scale);
    }

    // 3. Floating Holographic City Emblem
    if (emblemRef.current) {
      emblemRef.current.rotation.y = t * 0.8;
      emblemRef.current.position.y = 48 + Math.sin(t * 1.5) * 0.8;
    }

    // 4. Beacon pulse
    if (beaconRef.current) {
      beaconRef.current.rotation.y = t * 2.0;
    }
  });

  // Center coordinates on the grand central harbor island / water concourse
  return (
    <group position={[0, 0, 0]} name="nova_prime_central_citadel">
      {/* ========================================================
          1. MULTI-LEVEL PUBLIC PLAZA & REFLECTING WATER BASIN
          ======================================================== */}
      {/* Grand Tiered Base Island Platform */}
      <mesh position={[0, 0.4, 0]} receiveShadow>
        <cylinderGeometry args={[14, 15, 0.8, 32]} />
        <meshStandardMaterial color="#0f172a" metalness={0.8} roughness={0.25} />
      </mesh>

      {/* Outer Illuminated Promenade Step */}
      <mesh position={[0, 0.85, 0]} receiveShadow>
        <cylinderGeometry args={[12, 12.8, 0.9, 32]} />
        <meshStandardMaterial color="#1e293b" metalness={0.7} roughness={0.3} />
      </mesh>
      <mesh position={[0, 1.32, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[11.5, 12, 32]} />
        <meshBasicMaterial color="#00f0ff" toneMapped={false} />
      </mesh>

      {/* Concentric Reflecting Water Basins */}
      <mesh position={[0, 1.34, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[8.5, 11.2, 32]} />
        <meshStandardMaterial
          color="#0284c7"
          metalness={0.95}
          roughness={0.05}
          transparent
          opacity={0.85}
        />
      </mesh>

      {/* ========================================================
          2. CENTRAL MONUMENTAL SPIRE (Height: 68m)
          ======================================================== */}
      {/* Lower Grand Atrium Lobby */}
      <mesh position={[0, 5, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[4.5, 6.2, 8, 8]} />
        <meshStandardMaterial color="#f8fafc" metalness={0.85} roughness={0.15} />
      </mesh>
      {/* Grand Atrium Entrance Windows */}
      <mesh position={[0, 5, 0]} rotation={[0, Math.PI / 8, 0]}>
        <cylinderGeometry args={[4.6, 6.3, 5, 8]} />
        <meshBasicMaterial color="#38bdf8" transparent opacity={0.65} toneMapped={false} />
      </mesh>

      {/* Mid Spire Shaft */}
      <mesh position={[0, 22, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[2.8, 4.2, 26, 8]} />
        <meshStandardMaterial color="#f8fafc" metalness={0.9} roughness={0.12} />
      </mesh>

      {/* Upper Spire Shaft */}
      <mesh position={[0, 42, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[1.6, 2.7, 16, 8]} />
        <meshStandardMaterial color="#ffffff" metalness={0.95} roughness={0.1} />
      </mesh>

      {/* Apex Crown Needle & Beacon */}
      <mesh position={[0, 58, 0]} castShadow>
        <cylinderGeometry args={[0.08, 1.5, 18, 8]} />
        <meshStandardMaterial color="#f8fafc" metalness={0.98} />
      </mesh>
      <mesh ref={beaconRef} position={[0, 68, 0]}>
        <sphereGeometry args={[0.65, 16, 16]} />
        <meshBasicMaterial color="#ec4899" toneMapped={false} />
      </mesh>
      {/* High-altitude pulse laser emitter */}
      <mesh position={[0, 71, 0]}>
        <cylinderGeometry args={[0.04, 0.04, 6, 8]} />
        <meshBasicMaterial color="#00f0ff" toneMapped={false} />
      </mesh>

      {/* ========================================================
          3. FOUR INTERCONNECTED SATELLITE TOWERS
          ======================================================== */}
      {[
        [-5.8, -5.8],
        [5.8, -5.8],
        [-5.8, 5.8],
        [5.8, 5.8],
      ].map(([sx, sz], i) => (
        <group key={`sat-tower-${i}`} position={[sx, 0, sz]}>
          {/* Satellite Tower Shaft (Height 38m) */}
          <mesh position={[0, 19, 0]} castShadow receiveShadow>
            <boxGeometry args={[3.0, 38, 3.0]} />
            <meshStandardMaterial
              color="#0284c7"
              metalness={0.92}
              roughness={0.12}
              transparent
              opacity={0.9}
            />
          </mesh>

          {/* Corner White Exoskeleton Pylons */}
          {[
            [-1.5, -1.5],
            [1.5, -1.5],
            [-1.5, 1.5],
            [1.5, 1.5],
          ].map(([cx, cz], ci) => (
            <mesh key={`col-${ci}`} position={[cx, 19, cz]}>
              <cylinderGeometry args={[0.16, 0.16, 38, 6]} />
              <meshStandardMaterial color="#ffffff" metalness={0.9} />
            </mesh>
          ))}

          {/* Tower Illuminated Window Arrays */}
          {Array.from({ length: 9 }).map((_, wi) => (
            <mesh key={`win-${wi}`} position={[0, 4 + wi * 3.8, 0]}>
              <boxGeometry args={[3.08, 1.4, 3.08]} />
              <meshBasicMaterial color="#00f0ff" toneMapped={false} />
            </mesh>
          ))}

          {/* Satellite Rooftop Landing Pad */}
          <group position={[0, 38.2, 0]}>
            <mesh>
              <cylinderGeometry args={[2.2, 2.4, 0.5, 8]} />
              <meshStandardMaterial color="#1e293b" metalness={0.8} />
            </mesh>
            <mesh position={[0, 0.3, 0]} rotation={[-Math.PI / 2, 0, 0]}>
              <ringGeometry args={[1.5, 1.9, 8]} />
              <meshBasicMaterial color="#f59e0b" toneMapped={false} />
            </mesh>
            <mesh position={[0, 1.2, 0]}>
              <cylinderGeometry args={[0.05, 0.1, 1.6, 6]} />
              <meshBasicMaterial color="#00f0ff" toneMapped={false} />
            </mesh>
          </group>
        </group>
      ))}

      {/* ========================================================
          4. ELEVATED INTER-TOWER SKYBRIDGES (Heights 20m & 34m)
          ======================================================== */}
      {/* Lower Skybridge Ring (Height 20m) connecting all 4 towers */}
      {[
        { pos: [0, 20, 5.8], rot: [0, 0, 0], len: 11.6 },
        { pos: [0, 20, -5.8], rot: [0, 0, 0], len: 11.6 },
        { pos: [5.8, 20, 0], rot: [0, Math.PI / 2, 0], len: 11.6 },
        { pos: [-5.8, 20, 0], rot: [0, Math.PI / 2, 0], len: 11.6 },
      ].map((sb, sbi) => (
        <group key={`bridge-low-${sbi}`} position={sb.pos as any} rotation={sb.rot as any}>
          {/* Glass Tunnel Body */}
          <mesh castShadow>
            <boxGeometry args={[sb.len, 1.8, 1.6]} />
            <meshStandardMaterial
              color="#0284c7"
              metalness={0.9}
              roughness={0.1}
              transparent
              opacity={0.85}
            />
          </mesh>
          {/* Glowing Walkway Floor Strip */}
          <mesh position={[0, -0.85, 0]}>
            <boxGeometry args={[sb.len, 0.1, 1.4]} />
            <meshBasicMaterial color="#00f0ff" toneMapped={false} />
          </mesh>
          {/* Structural Support Truss */}
          <mesh position={[0, 0.95, 0]}>
            <boxGeometry args={[sb.len, 0.15, 1.7]} />
            <meshStandardMaterial color="#ffffff" metalness={0.9} />
          </mesh>
        </group>
      ))}

      {/* Radial Skyways connecting 4 towers directly to the Central Spire (Height 28m) */}
      {[
        Math.PI / 4,
        (3 * Math.PI) / 4,
        (5 * Math.PI) / 4,
        (7 * Math.PI) / 4,
      ].map((ang, ai) => (
        <group
          key={`rad-bridge-${ai}`}
          position={[Math.cos(ang) * 4.2, 28, Math.sin(ang) * 4.2]}
          rotation={[0, -ang + Math.PI / 2, 0]}
        >
          <mesh>
            <boxGeometry args={[1.5, 1.6, 4.5]} />
            <meshStandardMaterial color="#f8fafc" metalness={0.85} />
          </mesh>
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[1.54, 0.8, 4.4]} />
            <meshBasicMaterial color="#38bdf8" toneMapped={false} />
          </mesh>
        </group>
      ))}

      {/* ========================================================
          5. MASSIVE ROTATING ARCHITECTURAL HALO RINGS (Heights 36m & 45m)
          ======================================================== */}
      {/* Outer Cyan Halo Ring */}
      <group ref={ring1Ref} position={[0, 36, 0]}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[9.5, 0.35, 12, 48]} />
          <meshStandardMaterial
            color="#00f0ff"
            emissive="#00f0ff"
            emissiveIntensity={isNight ? 2.4 : 1.2}
            toneMapped={false}
          />
        </mesh>
        {/* Outer Ring Energy Nodes */}
        {Array.from({ length: 8 }).map((_, ni) => {
          const a = (ni * Math.PI) / 4;
          return (
            <mesh key={`node-${ni}`} position={[Math.cos(a) * 9.5, 0, Math.sin(a) * 9.5]}>
              <sphereGeometry args={[0.55, 12, 12]} />
              <meshBasicMaterial color="#ffffff" toneMapped={false} />
            </mesh>
          );
        })}
      </group>

      {/* Inner Golden Halo Ring */}
      <group ref={ring2Ref} position={[0, 45, 0]}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[6.8, 0.28, 12, 40]} />
          <meshStandardMaterial
            color="#f59e0b"
            emissive="#f59e0b"
            emissiveIntensity={isNight ? 2.2 : 1.1}
            toneMapped={false}
          />
        </mesh>
      </group>

      {/* ========================================================
          6. FLOATING HOLOGRAPHIC CITY EMBLEM
          ======================================================== */}
      <group ref={emblemRef} position={[0, 48, 0]}>
        {/* Central Nova Star Emblem */}
        <mesh>
          <octahedronGeometry args={[2.2, 0]} />
          <meshBasicMaterial color="#ec4899" wireframe={false} toneMapped={false} />
        </mesh>
        <mesh rotation={[0, Math.PI / 4, Math.PI / 4]}>
          <boxGeometry args={[1.8, 1.8, 1.8]} />
          <meshBasicMaterial color="#00f0ff" wireframe toneMapped={false} />
        </mesh>
        {/* Outer Hologram Projection Cage */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[2.8, 3.2, 24]} />
          <meshBasicMaterial color="#f59e0b" transparent opacity={0.8} toneMapped={false} />
        </mesh>
      </group>

      {/* ========================================================
          7. GLOWING INTERNAL QUANTUM ENERGY CORE
          ======================================================== */}
      <mesh ref={coreRef} position={[0, 14, 0]}>
        <sphereGeometry args={[2.2, 20, 20]} />
        <meshStandardMaterial
          color="#00f0ff"
          emissive="#00f0ff"
          emissiveIntensity={isNight ? 3.0 : 1.8}
          transparent
          opacity={0.9}
        />
      </mesh>
    </group>
  );
};
