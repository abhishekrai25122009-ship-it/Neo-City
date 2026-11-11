import React, { useRef, useMemo, useEffect } from 'react';
import * as THREE from 'three';
import { useCityStore } from '../../store/useCityStore';

export const DistrictParks: React.FC = () => {
  const lightingMode = useCityStore((state) => state.lightingMode);
  const isNight = lightingMode === 'night';

  const trunkInstRef = useRef<THREE.InstancedMesh>(null);
  const canopy1InstRef = useRef<THREE.InstancedMesh>(null);
  const canopy2InstRef = useRef<THREE.InstancedMesh>(null);
  const streetlightInstRef = useRef<THREE.InstancedMesh>(null);
  const lightGlowInstRef = useRef<THREE.InstancedMesh>(null);

  // Instanced Tree positions across green and residential zones
  const trees = useMemo(() => {
    const coords: [number, number, number, number][] = []; // [x, y, z, scaleHeight]
    // Green Zone Grove (West North: X: -36 to -68, Z: 28 to 86)
    for (let x = -36; x >= -68; x -= 8) {
      for (let z = 30; z <= 86; z += 10) {
        coords.push([x + 2, 0.15, z + 2, 1.0 + (coords.length % 3) * 0.25]);
      }
    }
    // Residential Core (West Central: X: -28 to -58, Z: -26 to 26)
    for (let z = -26; z <= 26; z += 6.5) {
      coords.push([-34, 0.15, z, 1.1 + (coords.length % 4) * 0.2]);
      coords.push([-58, 0.15, z, 0.95 + (coords.length % 3) * 0.25]);
    }
    // Waterfront Promenade Green Strips
    for (let z = -32; z >= -88; z -= 8) {
      coords.push([-12, 0.15, z, 1.05 + (coords.length % 3) * 0.2]);
      coords.push([12, 0.15, z, 1.05 + (coords.length % 4) * 0.2]);
    }
    // Central Celestial Island rim
    for (let angle = 0; angle < Math.PI * 2; angle += Math.PI / 6) {
      coords.push([Math.cos(angle) * 7.5, 0.15, Math.sin(angle) * 7.5, 1.3]);
    }
    return coords;
  }, []);

  // Comprehensive Streetlight Network across all 6 districts
  const streetlights = useMemo(() => {
    const coords: [number, number, number, number][] = []; // [x, y, z, rotY]
    
    // 1. East Inner Boulevard (X = 22.5, Z = -92 to +92)
    for (let z = -90; z <= 90; z += 12) {
      coords.push([22.5, 0.15, z, 0]);
    }
    // 2. West Inner Boulevard (X = -20.5, Z = -92 to +92)
    for (let z = -90; z <= 90; z += 12) {
      coords.push([-20.5, 0.15, z, Math.PI]);
    }
    // 3. Outer East Arterial (X = 62.5, Z = -90 to +90)
    for (let z = -85; z <= 85; z += 15) {
      coords.push([62.5, 0.15, z, 0]);
    }
    // 4. Outer West Arterial (X = -62.5, Z = -90 to +90)
    for (let z = -85; z <= 85; z += 15) {
      coords.push([-62.5, 0.15, z, Math.PI]);
    }
    // 5. Cross Avenues Streetlights
    const crossZ = [-80, -40, 0, 40, 80];
    crossZ.forEach(cz => {
      for (let x = -58; x <= -26; x += 10) {
        coords.push([x, 0.15, cz + 1.6, Math.PI / 2]);
      }
      for (let x = 26; x <= 58; x += 10) {
        coords.push([x, 0.15, cz + 1.6, -Math.PI / 2]);
      }
    });

    return coords;
  }, []);

  // Setup tree matrices
  useEffect(() => {
    if (!trunkInstRef.current || !canopy1InstRef.current || !canopy2InstRef.current) return;

    const dummyMatrix = new THREE.Matrix4();
    const pos = new THREE.Vector3();
    const quat = new THREE.Quaternion();
    const scale = new THREE.Vector3();

    trees.forEach(([x, y, z, h], i) => {
      pos.set(x, y + h * 0.45, z);
      scale.set(1, h, 1);
      dummyMatrix.compose(pos, quat, scale);
      trunkInstRef.current!.setMatrixAt(i, dummyMatrix);

      pos.set(x, y + h + 0.3, z);
      scale.set(1, 1, 1);
      dummyMatrix.compose(pos, quat, scale);
      canopy1InstRef.current!.setMatrixAt(i, dummyMatrix);

      pos.set(x, y + h + 0.7, z);
      dummyMatrix.compose(pos, quat, scale);
      canopy2InstRef.current!.setMatrixAt(i, dummyMatrix);
    });

    trunkInstRef.current.instanceMatrix.needsUpdate = true;
    canopy1InstRef.current.instanceMatrix.needsUpdate = true;
    canopy2InstRef.current.instanceMatrix.needsUpdate = true;
  }, [trees]);

  // Setup streetlight matrices
  useEffect(() => {
    if (!streetlightInstRef.current || !lightGlowInstRef.current) return;

    const dummyMatrix = new THREE.Matrix4();
    const pos = new THREE.Vector3();
    const quat = new THREE.Quaternion();
    const scale = new THREE.Vector3(1, 1, 1);

    streetlights.forEach(([x, y, z, rotY], i) => {
      pos.set(x, y + 1.2, z);
      quat.setFromAxisAngle(new THREE.Vector3(0, 1, 0), rotY);
      dummyMatrix.compose(pos, quat, scale);
      streetlightInstRef.current!.setMatrixAt(i, dummyMatrix);

      pos.set(x, y + 2.3, z);
      dummyMatrix.compose(pos, quat, scale);
      lightGlowInstRef.current!.setMatrixAt(i, dummyMatrix);
    });

    streetlightInstRef.current.instanceMatrix.needsUpdate = true;
    lightGlowInstRef.current.instanceMatrix.needsUpdate = true;
  }, [streetlights]);

  return (
    <group position={[0, 0, 0]}>
      {/* 1. West Bank Botanical Park Turf */}
      <mesh receiveShadow position={[-48, 0.14, 52]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[28, 36]} />
        <meshStandardMaterial
          color={isNight ? '#022c22' : '#059669'}
          roughness={0.9}
        />
      </mesh>

      {/* Reflective Turquoise Eco Lagoon */}
      <mesh position={[-48, 0.16, 52]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[6.5, 28]} />
        <meshStandardMaterial
          color="#06b6d4"
          roughness={0.1}
          metalness={0.9}
        />
      </mesh>

      {/* 2. OPTIMIZED INSTANCED TREE CANOPIES (3 Draw Calls for All Trees) */}
      <instancedMesh
        ref={trunkInstRef}
        args={[undefined, undefined, trees.length]}
      >
        <cylinderGeometry args={[0.07, 0.12, 0.9, 6]} />
        <meshStandardMaterial color="#1e293b" roughness={0.7} />
      </instancedMesh>

      <instancedMesh
        ref={canopy1InstRef}
        args={[undefined, undefined, trees.length]}
      >
        <coneGeometry args={[0.55, 0.9, 6]} />
        <meshStandardMaterial
          color={isNight ? '#059669' : '#10b981'}
          emissive={isNight ? '#10b981' : '#047857'}
          emissiveIntensity={isNight ? 0.7 : 0.2}
          roughness={0.4}
        />
      </instancedMesh>

      <instancedMesh
        ref={canopy2InstRef}
        args={[undefined, undefined, trees.length]}
      >
        <coneGeometry args={[0.38, 0.7, 6]} />
        <meshStandardMaterial
          color="#34d399"
          emissive="#34d399"
          emissiveIntensity={isNight ? 0.8 : 0.25}
          roughness={0.4}
        />
      </instancedMesh>

      {/* 3. OPTIMIZED INSTANCED STREETLIGHTS (2 Draw Calls for all 100+ Streetlights!) */}
      <instancedMesh
        ref={streetlightInstRef}
        args={[undefined, undefined, streetlights.length]}
      >
        <cylinderGeometry args={[0.04, 0.06, 2.4, 6]} />
        <meshStandardMaterial color="#475569" metalness={0.8} roughness={0.3} />
      </instancedMesh>

      <instancedMesh
        ref={lightGlowInstRef}
        args={[undefined, undefined, streetlights.length]}
      >
        <boxGeometry args={[0.22, 0.1, 0.22]} />
        <meshBasicMaterial
          color={isNight ? '#00f0ff' : '#fed7aa'}
          toneMapped={false}
        />
      </instancedMesh>
    </group>
  );
};
