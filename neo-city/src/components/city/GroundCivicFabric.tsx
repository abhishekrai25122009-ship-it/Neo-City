import React, { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

export const GroundCivicFabric: React.FC = () => {
  const fountainRef = useRef<THREE.Group>(null);
  const kioskHoloRef = useRef<THREE.Mesh>(null);
  const craneArmRef = useRef<THREE.Group>(null);
  const sculptureRef = useRef<THREE.Group>(null);

  // Animate dynamic civic elements smoothly
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();

    // Rotating holographic kiosk ad/info sphere
    if (kioskHoloRef.current) {
      kioskHoloRef.current.rotation.y = t * 0.8;
      kioskHoloRef.current.position.y = 2.2 + Math.sin(t * 2) * 0.15;
    }

    // Kinetic art sculpture in residential park
    if (sculptureRef.current) {
      sculptureRef.current.rotation.y = t * 0.5;
      sculptureRef.current.rotation.z = Math.sin(t * 0.7) * 0.1;
    }

    // Industrial automated crane arm sweeping back and forth
    if (craneArmRef.current) {
      craneArmRef.current.rotation.y = Math.sin(t * 0.4) * 0.6;
    }

    // Water fountain jet pulse
    if (fountainRef.current) {
      const scale = 1 + Math.sin(t * 4) * 0.15;
      fountainRef.current.scale.set(scale, 1 + Math.sin(t * 3) * 0.2, scale);
    }
  });

  // Reusable materials
  const materials = useMemo(() => {
    return {
      plazaPavement: new THREE.MeshStandardMaterial({
        color: '#1a2233',
        roughness: 0.6,
        metalness: 0.4,
      }),
      plazaBorder: new THREE.MeshStandardMaterial({
        color: '#0ea5e9',
        emissive: '#0284c7',
        emissiveIntensity: 0.8,
      }),
      kioskBody: new THREE.MeshStandardMaterial({
        color: '#0f172a',
        metalness: 0.8,
        roughness: 0.3,
      }),
      kioskScreen: new THREE.MeshBasicMaterial({
        color: '#38bdf8',
      }),
      holoGlass: new THREE.MeshBasicMaterial({
        color: '#06b6d4',
        wireframe: true,
        transparent: true,
        opacity: 0.6,
      }),
      benchWood: new THREE.MeshStandardMaterial({
        color: '#334155',
        roughness: 0.5,
      }),
      benchGlow: new THREE.MeshBasicMaterial({
        color: '#a855f7',
      }),
      fountainWater: new THREE.MeshStandardMaterial({
        color: '#06b6d4',
        emissive: '#0891b2',
        emissiveIntensity: 0.7,
        roughness: 0.1,
        metalness: 0.2,
        transparent: true,
        opacity: 0.85,
      }),
      containerBlue: new THREE.MeshStandardMaterial({
        color: '#1e3a8a',
        roughness: 0.5,
      }),
      containerOrange: new THREE.MeshStandardMaterial({
        color: '#c2410c',
        roughness: 0.5,
      }),
      containerStripe: new THREE.MeshBasicMaterial({
        color: '#eab308',
      }),
      craneSteel: new THREE.MeshStandardMaterial({
        color: '#475569',
        metalness: 0.8,
        roughness: 0.4,
      }),
      warningLight: new THREE.MeshBasicMaterial({
        color: '#f59e0b',
      }),
      cyberFlora: new THREE.MeshStandardMaterial({
        color: '#10b981',
        emissive: '#059669',
        emissiveIntensity: 0.5,
        roughness: 0.4,
      }),
      streetLampPost: new THREE.MeshStandardMaterial({
        color: '#1e293b',
        metalness: 0.8,
        roughness: 0.3,
      }),
      lampGlow: new THREE.MeshBasicMaterial({
        color: '#e0f2fe',
      }),
    };
  }, []);

  // Streetlamp positions lining main corridors
  const lampPositions: [number, number, number][] = useMemo(() => [
    [16, 0, -40], [16, 0, -20], [16, 0, 0], [16, 0, 20], [16, 0, 40],
    [-16, 0, -40], [-16, 0, -20], [-16, 0, 0], [-16, 0, 20], [-16, 0, 40],
    [32, 0, -30], [32, 0, -10], [32, 0, 10], [32, 0, 30],
    [-32, 0, -30], [-32, 0, -10], [-32, 0, 10], [-32, 0, 30],
  ], []);

  return (
    <group name="GroundCivicFabric">
      {/* 1. DOWNTOWN CYBER PLAZA (X: 25, Z: -15) */}
      <group position={[25, 0.05, -15]}>
        {/* Main stepped tile base */}
        <mesh position={[0, 0.05, 0]} material={materials.plazaPavement}>
          <boxGeometry args={[14, 0.1, 14]} />
        </mesh>
        {/* Glowing perimeter border */}
        <mesh position={[0, 0.11, 0]} material={materials.plazaBorder}>
          <ringGeometry args={[6.8, 7, 4]} />
        </mesh>
        
        {/* Corner illuminated light pillars */}
        {[-6, 6].map((x) =>
          [-6, 6].map((z) => (
            <group key={`plaza-pillar-${x}-${z}`} position={[x, 0, z]}>
              <mesh position={[0, 1.2, 0]} material={materials.kioskBody}>
                <cylinderGeometry args={[0.2, 0.25, 2.4, 8]} />
              </mesh>
              <mesh position={[0, 2.4, 0]} material={materials.plazaBorder}>
                <sphereGeometry args={[0.3, 8, 8]} />
              </mesh>
            </group>
          ))
        )}

        {/* Central interactive cyber kiosk with holographic projection */}
        <group position={[0, 0.1, 0]}>
          <mesh position={[0, 0.9, 0]} material={materials.kioskBody}>
            <cylinderGeometry args={[0.8, 1, 1.8, 8]} />
          </mesh>
          <mesh position={[0, 1.3, 0.7]} material={materials.kioskScreen}>
            <planeGeometry args={[0.7, 0.4]} />
          </mesh>
          <mesh position={[0, 1.3, -0.7]} rotation={[0, Math.PI, 0]} material={materials.kioskScreen}>
            <planeGeometry args={[0.7, 0.4]} />
          </mesh>
          {/* Animated floating holo ad/sphere */}
          <mesh ref={kioskHoloRef} position={[0, 2.2, 0]} material={materials.holoGlass}>
            <octahedronGeometry args={[0.6, 1]} />
          </mesh>
        </group>

        {/* Neon bench clusters */}
        {[
          { pos: [-3.5, 0, 0], rot: Math.PI / 2 },
          { pos: [3.5, 0, 0], rot: -Math.PI / 2 },
          { pos: [0, 0, 3.5], rot: 0 },
          { pos: [0, 0, -3.5], rot: Math.PI },
        ].map((bench, idx) => (
          <group key={`bench-${idx}`} position={bench.pos as [number, number, number]} rotation={[0, bench.rot, 0]}>
            <mesh position={[0, 0.25, 0]} material={materials.benchWood}>
              <boxGeometry args={[2.4, 0.1, 0.6]} />
            </mesh>
            <mesh position={[0, 0.31, 0]} material={materials.benchGlow}>
              <boxGeometry args={[2.2, 0.02, 0.08]} />
            </mesh>
            <mesh position={[-1, 0.12, 0]} material={materials.kioskBody}>
              <boxGeometry args={[0.15, 0.25, 0.5]} />
            </mesh>
            <mesh position={[1, 0.12, 0]} material={materials.kioskBody}>
              <boxGeometry args={[0.15, 0.25, 0.5]} />
            </mesh>
          </group>
        ))}
      </group>

      {/* 2. CIVIC WATERFRONT PROMENADE & FOUNTAIN (X: 14, Z: 5) */}
      <group position={[14, 0.05, 5]}>
        {/* Stepped viewing terrace overlooking Nova Bay */}
        <mesh position={[0, 0.1, 0]} material={materials.plazaPavement}>
          <boxGeometry args={[5, 0.2, 18]} />
        </mesh>
        <mesh position={[-2.3, 0.25, 0]} material={materials.plazaBorder}>
          <boxGeometry args={[0.1, 0.2, 18]} />
        </mesh>

        {/* Illuminated cyber fountain basin */}
        <group position={[0.5, 0.2, 0]}>
          <mesh position={[0, 0.2, 0]} material={materials.kioskBody}>
            <cylinderGeometry args={[2.4, 2.6, 0.4, 16]} />
          </mesh>
          {/* Glowing water surface */}
          <mesh position={[0, 0.35, 0]} rotation={[-Math.PI / 2, 0, 0]} material={materials.fountainWater}>
            <circleGeometry args={[2.2, 16]} />
          </mesh>
          {/* Animated vertical water jets */}
          <group ref={fountainRef} position={[0, 0.35, 0]}>
            <mesh position={[0, 0.8, 0]} material={materials.fountainWater}>
              <coneGeometry args={[0.3, 1.6, 8]} />
            </mesh>
            {[0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2].map((ang, i) => (
              <mesh
                key={`jet-${i}`}
                position={[Math.cos(ang) * 1.2, 0.4, Math.sin(ang) * 1.2]}
                material={materials.fountainWater}
              >
                <coneGeometry args={[0.15, 0.8, 6]} />
              </mesh>
            ))}
          </group>
        </group>
      </group>

      {/* 3. RESIDENTIAL POCKET PARK & KINETIC SCULPTURE (X: -32, Z: -20) */}
      <group position={[-32, 0.05, -20]}>
        {/* Curving green-tinged pavement plaza */}
        <mesh position={[0, 0.05, 0]} material={materials.plazaPavement}>
          <cylinderGeometry args={[7, 7, 0.1, 16]} />
        </mesh>
        <mesh position={[0, 0.11, 0]} material={materials.cyberFlora}>
          <ringGeometry args={[6.7, 7, 16]} />
        </mesh>

        {/* Planter boxes with cyber flora */}
        {[
          [-4, -4], [4, -4], [-4, 4], [4, 4]
        ].map(([px, pz], idx) => (
          <group key={`planter-${idx}`} position={[px, 0.1, pz]}>
            <mesh position={[0, 0.3, 0]} material={materials.kioskBody}>
              <cylinderGeometry args={[0.9, 1, 0.6, 8]} />
            </mesh>
            {/* Cyber plant foliage */}
            <mesh position={[0, 0.9, 0]} material={materials.cyberFlora}>
              <dodecahedronGeometry args={[0.6, 0]} />
            </mesh>
            <mesh position={[0, 1.4, 0]} material={materials.plazaBorder}>
              <sphereGeometry args={[0.15, 6, 6]} />
            </mesh>
          </group>
        ))}

        {/* Central kinetic art sculpture */}
        <mesh position={[0, 0.5, 0]} material={materials.kioskBody}>
          <cylinderGeometry args={[0.6, 0.8, 1, 8]} />
        </mesh>
        <group ref={sculptureRef} position={[0, 1.8, 0]}>
          <mesh material={materials.plazaBorder}>
            <torusGeometry args={[0.9, 0.08, 8, 24]} />
          </mesh>
          <mesh rotation={[Math.PI / 2, 0, 0]} material={materials.benchGlow}>
            <torusGeometry args={[0.6, 0.06, 8, 24]} />
          </mesh>
          <mesh material={materials.lampGlow}>
            <sphereGeometry args={[0.25, 8, 8]} />
          </mesh>
        </group>
      </group>

      {/* 4. INDUSTRIAL LOGISTICS STAGING BAY (X: -45, Z: 35) */}
      <group position={[-45, 0.05, 35]}>
        {/* Heavy duty reinforced concrete pad */}
        <mesh position={[0, 0.05, 0]} material={materials.kioskBody}>
          <boxGeometry args={[16, 0.1, 14]} />
        </mesh>
        {/* Yellow boundary hazard markings */}
        <mesh position={[0, 0.11, 6.8]} material={materials.containerStripe}>
          <boxGeometry args={[15.6, 0.02, 0.2]} />
        </mesh>
        <mesh position={[0, 0.11, -6.8]} material={materials.containerStripe}>
          <boxGeometry args={[15.6, 0.02, 0.2]} />
        </mesh>

        {/* Stacked freight containers */}
        {/* Stack A */}
        <group position={[-5, 0.1, -3]}>
          <mesh position={[0, 0.9, 0]} material={materials.containerBlue}>
            <boxGeometry args={[2.4, 1.8, 4.5]} />
          </mesh>
          <mesh position={[0, 2.7, 0]} material={materials.containerOrange}>
            <boxGeometry args={[2.4, 1.8, 4.5]} />
          </mesh>
          <mesh position={[0, 1.8, 2.26]} material={materials.containerStripe}>
            <boxGeometry args={[2.2, 0.1, 0.02]} />
          </mesh>
        </group>

        {/* Stack B */}
        <group position={[-2, 0.1, -2]}>
          <mesh position={[0, 0.9, 0]} material={materials.containerOrange}>
            <boxGeometry args={[2.4, 1.8, 4.5]} />
          </mesh>
        </group>

        {/* Automated Robotic Loading Gantry Crane */}
        <group position={[4, 0.1, 0]}>
          {/* Base pedestal */}
          <mesh position={[0, 1.5, 0]} material={materials.craneSteel}>
            <cylinderGeometry args={[0.7, 0.9, 3, 8]} />
          </mesh>
          {/* Warning beacon */}
          <mesh position={[0, 3.1, 0]} material={materials.warningLight}>
            <cylinderGeometry args={[0.15, 0.15, 0.3, 6]} />
          </mesh>
          {/* Rotating crane boom & hoist */}
          <group ref={craneArmRef} position={[0, 3, 0]}>
            <mesh position={[3, 0, 0]} material={materials.craneSteel}>
              <boxGeometry args={[6.5, 0.3, 0.4]} />
            </mesh>
            <mesh position={[-1.2, 0, 0]} material={materials.kioskBody}>
              <boxGeometry args={[1.6, 0.8, 0.8]} />
            </mesh>
            {/* Cable & Magnetic spreader */}
            <mesh position={[4.5, -1, 0]} material={materials.kioskBody}>
              <cylinderGeometry args={[0.04, 0.04, 2, 4]} />
            </mesh>
            <mesh position={[4.5, -2, 0]} material={materials.containerStripe}>
              <boxGeometry args={[1.6, 0.2, 0.8]} />
            </mesh>
          </group>
        </group>
      </group>

      {/* 5. SMART TRANSIT SHELTER & BUS STOP (X: 30, Z: 35) */}
      <group position={[30, 0.05, 35]}>
        {/* Curving illuminated canopy */}
        <mesh position={[0, 1.4, 0]} material={materials.plazaPavement}>
          <boxGeometry args={[4, 0.1, 2]} />
        </mesh>
        <mesh position={[0, 1.46, 0]} material={materials.plazaBorder}>
          <boxGeometry args={[3.8, 0.02, 0.1]} />
        </mesh>
        {/* Glass back panel */}
        <mesh position={[0, 0.7, -0.9]} material={materials.holoGlass}>
          <boxGeometry args={[3.8, 1.4, 0.05]} />
        </mesh>
        {/* Canopy support columns */}
        {[-1.8, 1.8].map((cx, i) => (
          <mesh key={`canopy-col-${i}`} position={[cx, 0.7, -0.9]} material={materials.craneSteel}>
            <cylinderGeometry args={[0.08, 0.08, 1.4, 6]} />
          </mesh>
        ))}
        {/* Waiting bench */}
        <mesh position={[0, 0.3, -0.4]} material={materials.benchWood}>
          <boxGeometry args={[2.5, 0.1, 0.4]} />
        </mesh>
        <mesh position={[0, 0.36, -0.4]} material={materials.benchGlow}>
          <boxGeometry args={[2.3, 0.02, 0.06]} />
        </mesh>
        {/* Route timetable hologram pillar */}
        <group position={[2.4, 0, 0]}>
          <mesh position={[0, 1, 0]} material={materials.kioskBody}>
            <boxGeometry args={[0.3, 2, 0.3]} />
          </mesh>
          <mesh position={[0, 1.4, 0.16]} material={materials.kioskScreen}>
            <planeGeometry args={[0.24, 0.5]} />
          </mesh>
        </group>
      </group>

      {/* 6. CORRIDOR SMART STREETLAMPS */}
      {lampPositions.map(([lx, ly, lz], i) => (
        <group key={`lamp-${i}`} position={[lx, ly, lz]}>
          <mesh position={[0, 1.6, 0]} material={materials.streetLampPost}>
            <cylinderGeometry args={[0.08, 0.12, 3.2, 6]} />
          </mesh>
          {/* Overhanging curved arm */}
          <mesh position={[0.3, 3.2, 0]} material={materials.streetLampPost}>
            <boxGeometry args={[0.7, 0.08, 0.08]} />
          </mesh>
          {/* Glowing luminaire emitter */}
          <mesh position={[0.6, 3.14, 0]} material={materials.lampGlow}>
            <boxGeometry args={[0.25, 0.05, 0.15]} />
          </mesh>
          {/* Subtle neon ring indicator */}
          <mesh position={[0, 1.8, 0]} material={materials.plazaBorder}>
            <cylinderGeometry args={[0.13, 0.13, 0.06, 6]} />
          </mesh>
        </group>
      ))}
    </group>
  );
};
