import React, { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useCityStore } from '../../store/useCityStore';

export type AerialCraftType = 'sky_bus' | 'hover_speeder' | 'cargo_hauler' | 'emergency_interceptor';

interface AerialFlightPath {
  type: AerialCraftType;
  points: [number, number, number][]; // 3D waypoints [x, y, z]
  speed: number;
  progress: number;
  currentSegment: number;
  bankFactor: number;
  hullColor: THREE.Color;
  thrustColor: THREE.Color;
  beaconColor: THREE.Color;
  scale: [number, number, number];
}

const MAX_AERIAL_FLEET = 36;

export const AerialSkywaySimulation: React.FC = () => {
  const isRunning = useCityStore((state) => state.isRunning);
  const simSpeed = useCityStore((state) => state.speed);
  const trafficVisible = useCityStore((state) => state.trafficVisible);

  const hullRef = useRef<THREE.InstancedMesh>(null);
  const canopyRef = useRef<THREE.InstancedMesh>(null);
  const engineRef = useRef<THREE.InstancedMesh>(null);
  const plumeRef = useRef<THREE.InstancedMesh>(null);
  const beaconRef = useRef<THREE.InstancedMesh>(null);

  // 3D Flight Corridors through skyscraper canyons, high-altitude skyways, and across the bay
  const fleet = useMemo<AerialFlightPath[]>(() => {
    const list: AerialFlightPath[] = [];

    // Corridor 1: Downtown Financial Canyon (X = 26, weaves at altitude 22-26m between towers)
    for (let i = 0; i < 8; i++) {
      const isBus = i % 3 === 0;
      list.push({
        type: isBus ? 'sky_bus' : 'hover_speeder',
        points: [
          [26, 22, -130],
          [28, 25, -60],
          [24, 23, 0],
          [28, 26, 60],
          [26, 22, 130],
          [23, 24, 60],
          [27, 26, 0],
          [23, 23, -60],
        ],
        speed: isBus ? 14 : 24 + (i % 2) * 6,
        progress: (i / 8) + 0.05,
        currentSegment: 0,
        bankFactor: isBus ? 0.35 : 0.85,
        hullColor: new THREE.Color(isBus ? '#0284c7' : '#00f0ff'),
        thrustColor: new THREE.Color(isBus ? '#38bdf8' : '#34d399'),
        beaconColor: new THREE.Color('#38bdf8'),
        scale: isBus ? [1.2, 0.8, 2.2] : [0.75, 0.4, 1.4],
      });
    }

    // Corridor 2: Residential High-Airway (X = -24, weaves at altitude 18-24m over living pods)
    for (let i = 0; i < 8; i++) {
      const isCargo = i % 2 === 0;
      list.push({
        type: isCargo ? 'cargo_hauler' : 'hover_speeder',
        points: [
          [-24, 19, 130],
          [-27, 23, 60],
          [-22, 21, 0],
          [-26, 24, -60],
          [-24, 19, -130],
          [-22, 22, -60],
          [-26, 20, 0],
          [-22, 23, 60],
        ],
        speed: isCargo ? 12 : 22,
        progress: (i / 8) + 0.1,
        currentSegment: 0,
        bankFactor: isCargo ? 0.25 : 0.75,
        hullColor: new THREE.Color(isCargo ? '#d97706' : '#9333ea'),
        thrustColor: new THREE.Color(isCargo ? '#fbbf24' : '#c084fc'),
        beaconColor: new THREE.Color(isCargo ? '#f59e0b' : '#a855f7'),
        scale: isCargo ? [1.3, 0.9, 1.8] : [0.75, 0.4, 1.4],
      });
    }

    // Corridor 3: Trans-Bay Celestial High Skybridge (Crosses over bay at Y=36m over Celestial Needle)
    for (let i = 0; i < 8; i++) {
      const isInterceptor = i % 2 === 1;
      list.push({
        type: isInterceptor ? 'emergency_interceptor' : 'sky_bus',
        points: [
          [-120, 32, -4],
          [-60, 36, 0],
          [0, 38, 4],
          [60, 36, 0],
          [120, 32, -4],
          [60, 35, -8],
          [0, 38, -6],
          [-60, 35, -8],
        ],
        speed: isInterceptor ? 32 : 16,
        progress: (i / 8) + 0.15,
        currentSegment: 0,
        bankFactor: isInterceptor ? 1.1 : 0.3,
        hullColor: new THREE.Color(isInterceptor ? '#e11d48' : '#0369a1'),
        thrustColor: new THREE.Color(isInterceptor ? '#f43f5e' : '#00f0ff'),
        beaconColor: new THREE.Color(isInterceptor ? '#ef4444' : '#38bdf8'),
        scale: isInterceptor ? [0.85, 0.45, 1.5] : [1.2, 0.8, 2.2],
      });
    }

    // Corridor 4: High-Altitude Diagonal Skyway (Climbing across the sky from altitude 24m to 42m)
    for (let i = 0; i < 6; i++) {
      list.push({
        type: 'hover_speeder',
        points: [
          [-90, 24, -90],
          [-30, 30, -30],
          [0, 35, 0],
          [40, 40, 40],
          [90, 42, 90],
          [40, 38, 40],
          [0, 34, 0],
          [-40, 28, -40],
        ],
        speed: 26 + (i % 2) * 4,
        progress: (i / 6) + 0.05,
        currentSegment: 0,
        bankFactor: 0.95,
        hullColor: new THREE.Color(i % 2 === 0 ? '#059669' : '#c026d3'),
        thrustColor: new THREE.Color(i % 2 === 0 ? '#34d399' : '#f472b6'),
        beaconColor: new THREE.Color(i % 2 === 0 ? '#10b981' : '#ec4899'),
        scale: [0.75, 0.4, 1.4],
      });
    }

    // Corridor 5: Emergency Interceptor Outer Stratospheric Patrol (Altitude 44m)
    for (let i = 0; i < 6; i++) {
      list.push({
        type: 'emergency_interceptor',
        points: [
          [-110, 44, -110],
          [110, 44, -110],
          [110, 44, 110],
          [-110, 44, 110],
        ],
        speed: 36,
        progress: i / 6,
        currentSegment: 0,
        bankFactor: 1.25,
        hullColor: new THREE.Color('#e11d48'),
        thrustColor: new THREE.Color('#38bdf8'),
        beaconColor: new THREE.Color('#fb7185'),
        scale: [0.85, 0.45, 1.6],
      });
    }

    return list.slice(0, MAX_AERIAL_FLEET);
  }, []);

  // Pre-apply instance colors
  useEffect(() => {
    if (!hullRef.current || !plumeRef.current || !beaconRef.current) return;

    fleet.forEach((craft, i) => {
      hullRef.current!.setColorAt(i, craft.hullColor);
      plumeRef.current!.setColorAt(i, craft.thrustColor);
      beaconRef.current!.setColorAt(i, craft.beaconColor);
    });

    if (hullRef.current.instanceColor) hullRef.current.instanceColor.needsUpdate = true;
    if (plumeRef.current.instanceColor) plumeRef.current.instanceColor.needsUpdate = true;
    if (beaconRef.current.instanceColor) beaconRef.current.instanceColor.needsUpdate = true;
  }, [fleet]);

  // Reusable transforms
  const tempMatrix = useMemo(() => new THREE.Matrix4(), []);
  const tempPos = useMemo(() => new THREE.Vector3(), []);
  const tempQuat = useMemo(() => new THREE.Quaternion(), []);
  const tempScale = useMemo(() => new THREE.Vector3(), []);
  const forwardVec = useMemo(() => new THREE.Vector3(), []);

  useFrame((state, delta) => {
    if (!trafficVisible || !hullRef.current || !canopyRef.current || !plumeRef.current) return;

    const speedMult = isRunning ? simSpeed : 0;
    const time = state.clock.elapsedTime;

    for (let i = 0; i < fleet.length; i++) {
      const craft = fleet[i];

      if (speedMult > 0) {
        // Find segment
        const pts = craft.points;
        const numPts = pts.length;
        const currentIdx = Math.floor(craft.progress * numPts) % numPts;
        const nextIdx = (currentIdx + 1) % numPts;

        const p1 = pts[currentIdx];
        const p2 = pts[nextIdx];

        const segLength = Math.hypot(p2[0] - p1[0], p2[1] - p1[1], p2[2] - p1[2]) || 1;
        const step = (craft.speed * speedMult * delta) / (segLength * numPts);

        craft.progress = (craft.progress + step) % 1.0;

        // Current interpolated 3D position
        const segT = (craft.progress * numPts) % 1.0;
        const posX = p1[0] + (p2[0] - p1[0]) * segT;
        const posY = p1[1] + (p2[1] - p1[1]) * segT;
        const posZ = p1[2] + (p2[2] - p1[2]) * segT;

        // Subtle flight oscillation
        const bob = Math.sin(time * 3 + i) * 0.15;

        // Direction vector
        forwardVec.set(p2[0] - p1[0], p2[1] - p1[1], p2[2] - p1[2]).normalize();

        // Calculate heading yaw and pitch
        const yaw = Math.atan2(forwardVec.x, forwardVec.z);
        const pitch = -Math.asin(forwardVec.y);

        // Calculate aerodynamic roll bank into corners
        const roll = Math.sin(craft.progress * Math.PI * 2 * numPts) * 0.25 * craft.bankFactor;

        // Construct 3D orientation quaternion with yaw, pitch, roll
        tempQuat.setFromEuler(new THREE.Euler(pitch, yaw, roll, 'YXZ'));

        // 1. Hull
        tempPos.set(posX, posY + bob, posZ);
        tempScale.set(craft.scale[0], craft.scale[1], craft.scale[2]);
        tempMatrix.compose(tempPos, tempQuat, tempScale);
        hullRef.current.setMatrixAt(i, tempMatrix);

        // 2. Cockpit Canopy
        tempScale.set(craft.scale[0] * 0.75, craft.scale[1] * 0.7, craft.scale[2] * 0.6);
        tempPos.set(posX, posY + bob + craft.scale[1] * 0.45, posZ);
        tempMatrix.compose(tempPos, tempQuat, tempScale);
        canopyRef.current.setMatrixAt(i, tempMatrix);

        // 3. Dual Engine Thruster Nacelles
        tempScale.set(craft.scale[0] * 0.9, craft.scale[1] * 0.5, craft.scale[2] * 0.35);
        tempPos.set(posX, posY + bob, posZ - craft.scale[2] * 0.45);
        tempMatrix.compose(tempPos, tempQuat, tempScale);
        engineRef.current?.setMatrixAt(i, tempMatrix);

        // 4. Radiant Plasma Exhaust Plume (Flaring behind the engines!)
        const plumeFlicker = 1.0 + Math.sin(time * 18 + i * 4) * 0.25;
        const plumeLength = craft.scale[2] * 1.6 * plumeFlicker;
        tempScale.set(craft.scale[0] * 0.35, craft.scale[1] * 0.35, plumeLength);
        
        // Offset plume behind tail along aircraft local Z
        const plumeOffset = -craft.scale[2] * 0.85 - plumeLength * 0.5;
        const rotatedPlumeOffset = new THREE.Vector3(0, 0, plumeOffset).applyQuaternion(tempQuat);
        tempPos.set(posX + rotatedPlumeOffset.x, posY + bob + rotatedPlumeOffset.y, posZ + rotatedPlumeOffset.z);
        tempMatrix.compose(tempPos, tempQuat, tempScale);
        plumeRef.current.setMatrixAt(i, tempMatrix);

        // 5. Flashing Navigation Strobe Beacon (Blinks on/off)
        const strobeState = (Math.sin(time * 8 + i * 2) > 0.3) ? 1.0 : 0.0;
        tempScale.set(strobeState * 0.35, strobeState * 0.35, strobeState * 0.35);
        tempPos.set(posX, posY + bob + craft.scale[1] * 0.6, posZ);
        tempMatrix.compose(tempPos, tempQuat, tempScale);
        beaconRef.current?.setMatrixAt(i, tempMatrix);
      }
    }

    hullRef.current.instanceMatrix.needsUpdate = true;
    canopyRef.current.instanceMatrix.needsUpdate = true;
    if (engineRef.current) engineRef.current.instanceMatrix.needsUpdate = true;
    plumeRef.current.instanceMatrix.needsUpdate = true;
    if (beaconRef.current) beaconRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <group name="aerial_skyway_simulation">
      {/* 1. AERODYNAMIC LIFTING BODY HULL (Instanced) */}
      <instancedMesh
        ref={hullRef}
        args={[undefined, undefined, MAX_AERIAL_FLEET]}
        castShadow
      >
        <boxGeometry args={[1, 0.4, 2]} />
        <meshStandardMaterial metalness={0.85} roughness={0.2} />
      </instancedMesh>

      {/* 2. TINTED COCKPIT CANOPY & OBSERVATION GLASS (Instanced) */}
      <instancedMesh
        ref={canopyRef}
        args={[undefined, undefined, MAX_AERIAL_FLEET]}
      >
        <boxGeometry args={[1, 0.4, 1.2]} />
        <meshStandardMaterial
          color="#0284c7"
          metalness={0.95}
          roughness={0.05}
          transparent
          opacity={0.85}
        />
      </instancedMesh>

      {/* 3. REAR ION PROPULSION NACELLES (Instanced) */}
      <instancedMesh
        ref={engineRef}
        args={[undefined, undefined, MAX_AERIAL_FLEET]}
      >
        <cylinderGeometry args={[0.3, 0.35, 0.5, 12]} />
        <meshStandardMaterial color="#1e293b" metalness={0.9} roughness={0.25} />
      </instancedMesh>

      {/* 4. RADIANT PLASMA THRUSTER PLUME (Glowing unlit cone trailing behind) */}
      <instancedMesh
        ref={plumeRef}
        args={[undefined, undefined, MAX_AERIAL_FLEET]}
      >
        <coneGeometry args={[0.32, 1.4, 10]} />
        <meshBasicMaterial toneMapped={false} />
      </instancedMesh>

      {/* 5. AERIAL NAVIGATION STROBE BEACONS (Flashing high-altitude collision beacons) */}
      <instancedMesh
        ref={beaconRef}
        args={[undefined, undefined, MAX_AERIAL_FLEET]}
      >
        <sphereGeometry args={[0.25, 8, 8]} />
        <meshBasicMaterial toneMapped={false} />
      </instancedMesh>
    </group>
  );
};
