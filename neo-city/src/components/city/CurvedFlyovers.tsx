import React, { useMemo } from 'react';
import * as THREE from 'three';
import { useCityStore } from '../../store/useCityStore';

export const CurvedFlyovers: React.FC = () => {
  const lightingMode = useCityStore((state) => state.lightingMode);
  const isNight = lightingMode === 'night';

  // 1. East Bank High-Speed Curved Skyway
  const eastCurve = useMemo(() => {
    return new THREE.CatmullRomCurve3([
      new THREE.Vector3(26, 5.5, -55),
      new THREE.Vector3(34, 6.8, -32),
      new THREE.Vector3(48, 7.5, -12),
      new THREE.Vector3(46, 8.2, 10),
      new THREE.Vector3(34, 7.2, 28),
      new THREE.Vector3(26, 5.8, 55),
    ]);
  }, []);

  // 2. West Bank Sweeping Habitation Flyover
  const westCurve = useMemo(() => {
    return new THREE.CatmullRomCurve3([
      new THREE.Vector3(-28, 5.5, -55),
      new THREE.Vector3(-42, 6.8, -30),
      new THREE.Vector3(-46, 7.8, -8),
      new THREE.Vector3(-44, 8.2, 12),
      new THREE.Vector3(-36, 7.0, 32),
      new THREE.Vector3(-28, 5.8, 55),
    ]);
  }, []);

  // 3. Grand Trans-Bay Orbital Sky-Loop (Crossing across the bay at high altitude)
  const transBayCurve = useMemo(() => {
    return new THREE.CatmullRomCurve3([
      new THREE.Vector3(32, 7.0, -28),
      new THREE.Vector3(18, 9.5, -18),
      new THREE.Vector3(0, 11.5, -8),
      new THREE.Vector3(-18, 9.5, 4),
      new THREE.Vector3(-32, 7.2, 22),
    ]);
  }, []);

  // Structural Support Pylon Coordinates
  const eastPylons: [number, number, number][] = [
    [26, 5.5, -55],
    [34, 6.8, -32],
    [48, 7.5, -12],
    [46, 8.2, 10],
    [34, 7.2, 28],
    [26, 5.8, 55],
  ];

  const westPylons: [number, number, number][] = [
    [-28, 5.5, -55],
    [-42, 6.8, -30],
    [-46, 7.8, -8],
    [-44, 8.2, 12],
    [-36, 7.0, 32],
    [-28, 5.8, 55],
  ];

  const transBayPylons: [number, number, number][] = [
    [18, 9.5, -18],
    [-18, 9.5, 4],
  ];

  const roadMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: isNight ? '#0b1626' : '#1e293b',
        roughness: 0.5,
        metalness: 0.8,
      }),
    [isNight]
  );

  const cyanGuidanceMat = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: '#00f0ff',
        toneMapped: false,
      }),
    []
  );

  const amberGuidanceMat = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: '#f59e0b',
        toneMapped: false,
      }),
    []
  );

  const pylonMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#0f172a',
        metalness: 0.9,
        roughness: 0.25,
      }),
    []
  );

  // Cached static tube geometries to eliminate per-render allocations
  const eastTubeGeom = useMemo(() => new THREE.TubeGeometry(eastCurve, 64, 1.8, 6, false), [eastCurve]);
  const eastGlowGeom = useMemo(() => new THREE.TubeGeometry(eastCurve, 64, 0.08, 4, false), [eastCurve]);
  const westTubeGeom = useMemo(() => new THREE.TubeGeometry(westCurve, 64, 1.8, 6, false), [westCurve]);
  const westGlowGeom = useMemo(() => new THREE.TubeGeometry(westCurve, 64, 0.08, 4, false), [westCurve]);
  const transBayTubeGeom = useMemo(() => new THREE.TubeGeometry(transBayCurve, 48, 1.9, 6, false), [transBayCurve]);
  const transBayGlowGeom = useMemo(() => new THREE.TubeGeometry(transBayCurve, 48, 0.1, 4, false), [transBayCurve]);

  return (
    <group name="curved_futuristic_flyovers">
      {/* ========================================================
          1. EAST BANK CURVED SKYWAY
          ======================================================== */}
      {/* Primary Road Deck (Flat Extrusion / Tube) */}
      <mesh geometry={eastTubeGeom} material={roadMaterial} />
      {/* Edge Glowing Guidance Strips */}
      <mesh geometry={eastGlowGeom} material={cyanGuidanceMat} position={[0, 0.45, 0]} />

      {/* East Pylons */}
      {eastPylons.map(([px, py, pz], i) => (
        <group key={`east-pyl-${i}`} position={[px, py / 2, pz]}>
          <mesh material={pylonMat}>
            <cylinderGeometry args={[0.55, 0.75, py, 12]} />
          </mesh>
          <mesh position={[0, py / 2 - 0.2, 0]}>
            <cylinderGeometry args={[1.6, 0.8, 0.4, 8]} />
            <meshStandardMaterial color="#f8fafc" metalness={0.8} />
          </mesh>
        </group>
      ))}

      {/* ========================================================
          2. WEST BANK CURVED SKYWAY
          ======================================================== */}
      <mesh geometry={westTubeGeom} material={roadMaterial} />
      <mesh geometry={westGlowGeom} material={amberGuidanceMat} position={[0, 0.45, 0]} />

      {/* West Pylons */}
      {westPylons.map(([px, py, pz], i) => (
        <group key={`west-pyl-${i}`} position={[px, py / 2, pz]}>
          <mesh material={pylonMat}>
            <cylinderGeometry args={[0.55, 0.75, py, 12]} />
          </mesh>
          <mesh position={[0, py / 2 - 0.2, 0]}>
            <cylinderGeometry args={[1.6, 0.8, 0.4, 8]} />
            <meshStandardMaterial color="#f8fafc" metalness={0.8} />
          </mesh>
        </group>
      ))}

      {/* ========================================================
          3. GRAND TRANS-BAY SKY-LOOP OVER NOVA BAY
          ======================================================== */}
      <mesh geometry={transBayTubeGeom} material={roadMaterial} />
      <mesh geometry={transBayGlowGeom} material={cyanGuidanceMat} position={[0, 0.5, 0]} />

      {/* Marine Support Pylons Rising out of the Water */}
      {transBayPylons.map(([px, py, pz], i) => (
        <group key={`trans-pyl-${i}`} position={[px, py / 2, pz]}>
          <mesh castShadow receiveShadow material={pylonMat}>
            <cylinderGeometry args={[0.7, 1.1, py, 12]} />
          </mesh>
          {/* Water Splash Ring at sea level */}
          <mesh position={[0, -py / 2 + 0.1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[1.2, 2.0, 16]} />
            <meshBasicMaterial color="#00f0ff" transparent opacity={0.6} toneMapped={false} />
          </mesh>
        </group>
      ))}
    </group>
  );
};
