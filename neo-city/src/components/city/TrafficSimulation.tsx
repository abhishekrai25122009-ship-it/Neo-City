import React, { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useCityStore } from '../../store/useCityStore';

interface VehicleState {
  route:
    | 'bridge_north'
    | 'bridge_south'
    | 'east_main'
    | 'west_main'
    | 'east_outer'
    | 'west_outer'
    | 'cross_avenue_0'
    | 'cross_avenue_north'
    | 'cross_avenue_south';
  currentPos: number;
  laneOffset: number;
  speed: number;
  dir: 1 | -1;
  color: THREE.Color;
  glowColor: THREE.Color;
}

const MAX_STREET_VEHICLES = 80;
const UP_AXIS = new THREE.Vector3(0, 1, 0);

export const TrafficSimulation: React.FC = () => {
  const isRunning = useCityStore((state) => state.isRunning);
  const simSpeed = useCityStore((state) => state.speed);
  const trafficVisible = useCityStore((state) => state.trafficVisible);
  const lightingMode = useCityStore((state) => state.lightingMode);
  const transitStats = useCityStore((state) => state.stats.transitStats);
  const targetTrafficCount = useCityStore((state) => state.graphics.trafficCount);

  const isNight = lightingMode === 'night';

  const chassisRef = useRef<THREE.InstancedMesh>(null);
  const canopyRef = useRef<THREE.InstancedMesh>(null);
  const repulsorRef = useRef<THREE.InstancedMesh>(null);
  const headlightRef = useRef<THREE.InstancedMesh>(null);
  const taillightRef = useRef<THREE.InstancedMesh>(null);

  // Generate fleet spanning the vast continuous 340m city roads
  const vehicles = useMemo<VehicleState[]>(() => {
    const list: VehicleState[] = [];
    const colorHexes = [
      { body: '#0284c7', glow: '#00f0ff' }, // Electric Cyan
      { body: '#ea580c', glow: '#f97316' }, // Coral transport
      { body: '#9333ea', glow: '#c084fc' }, // Neo Violet
      { body: '#d97706', glow: '#fbbf24' }, // Amber taxi
      { body: '#059669', glow: '#34d399' }, // Emerald eco
      { body: '#e11d48', glow: '#fb7185' }, // Crimson courier
      { body: '#0891b2', glow: '#38bdf8' }, // Cobalt hover
      { body: '#c026d3', glow: '#f472b6' }, // Cyber Magenta
    ];

    let cIdx = 0;
    const nextColors = () => {
      const c = colorHexes[cIdx % colorHexes.length];
      cIdx++;
      return { body: new THREE.Color(c.body), glow: new THREE.Color(c.glow) };
    };

    // 1. East Bank Main Boulevard (X = 24, span Z: -130 to +130) - 16 vehicles
    for (let i = 0; i < 16; i++) {
      const { body, glow } = nextColors();
      list.push({
        route: 'east_main',
        currentPos: -120 + i * 16,
        laneOffset: i % 2 === 0 ? 0.9 : -0.9,
        speed: 12 + (i % 3) * 2,
        dir: i % 2 === 0 ? 1 : -1,
        color: body,
        glowColor: glow,
      });
    }

    // 2. West Bank Main Boulevard (X = -22, span Z: -130 to +130) - 16 vehicles
    for (let i = 0; i < 16; i++) {
      const { body, glow } = nextColors();
      list.push({
        route: 'west_main',
        currentPos: -120 + i * 16,
        laneOffset: i % 2 === 0 ? 0.9 : -0.9,
        speed: 12 + (i % 3) * 2,
        dir: i % 2 === 0 ? 1 : -1,
        color: body,
        glowColor: glow,
      });
    }

    // 3. North Bridge (Z = 16, span X: -55 to +55) - 10 vehicles
    for (let i = 0; i < 10; i++) {
      const { body, glow } = nextColors();
      list.push({
        route: 'bridge_north',
        currentPos: -50 + i * 11,
        laneOffset: i % 2 === 0 ? 0.75 : -0.75,
        speed: 14 + (i % 2) * 3,
        dir: i % 2 === 0 ? 1 : -1,
        color: body,
        glowColor: glow,
      });
    }

    // 4. South Bridge (Z = -16, span X: -55 to +55) - 10 vehicles
    for (let i = 0; i < 10; i++) {
      const { body, glow } = nextColors();
      list.push({
        route: 'bridge_south',
        currentPos: -50 + i * 11,
        laneOffset: i % 2 === 0 ? 0.75 : -0.75,
        speed: 14 + (i % 2) * 3,
        dir: i % 2 === 0 ? 1 : -1,
        color: body,
        glowColor: glow,
      });
    }

    // 5. Outer East Expansion Arterial (X = 64, span Z: -130 to +130) - 8 vehicles
    for (let i = 0; i < 8; i++) {
      const { body, glow } = nextColors();
      list.push({
        route: 'east_outer',
        currentPos: -110 + i * 28,
        laneOffset: i % 2 === 0 ? 0.8 : -0.8,
        speed: 15,
        dir: i % 2 === 0 ? 1 : -1,
        color: body,
        glowColor: glow,
      });
    }

    // 6. Outer West Expansion Arterial (X = -64, span Z: -130 to +130) - 8 vehicles
    for (let i = 0; i < 8; i++) {
      const { body, glow } = nextColors();
      list.push({
        route: 'west_outer',
        currentPos: -110 + i * 28,
        laneOffset: i % 2 === 0 ? 0.8 : -0.8,
        speed: 15,
        dir: i % 2 === 0 ? 1 : -1,
        color: body,
        glowColor: glow,
      });
    }

    // 7. Cross Avenues (Z = 0, Z = 36, Z = -36) - 12 vehicles
    for (let i = 0; i < 12; i++) {
      const { body, glow } = nextColors();
      const aveRoute =
        i < 4
          ? 'cross_avenue_0'
          : i < 8
          ? 'cross_avenue_north'
          : 'cross_avenue_south';
      list.push({
        route: aveRoute,
        currentPos: 12 + (i % 4) * 20,
        laneOffset: i % 2 === 0 ? 0.6 : -0.6,
        speed: 10 + (i % 3) * 2,
        dir: i % 2 === 0 ? 1 : -1,
        color: body,
        glowColor: glow,
      });
    }

    return list.slice(0, MAX_STREET_VEHICLES);
  }, []);

  // Initialize instance colors once
  useEffect(() => {
    if (!chassisRef.current || !repulsorRef.current) return;

    vehicles.forEach((v, i) => {
      chassisRef.current!.setColorAt(i, v.color);
      repulsorRef.current!.setColorAt(i, v.glowColor);
    });

    if (chassisRef.current.instanceColor) chassisRef.current.instanceColor.needsUpdate = true;
    if (repulsorRef.current.instanceColor) repulsorRef.current.instanceColor.needsUpdate = true;
  }, [vehicles]);

  // Hide inactive instances when traffic limit changes (prevents running 280 hide calls per frame)
  useEffect(() => {
    if (!chassisRef.current || !canopyRef.current) return;
    const hideMat = new THREE.Matrix4().makeScale(0, 0, 0);
    for (let i = targetTrafficCount; i < MAX_STREET_VEHICLES; i++) {
      chassisRef.current.setMatrixAt(i, hideMat);
      canopyRef.current.setMatrixAt(i, hideMat);
      repulsorRef.current?.setMatrixAt(i, hideMat);
      headlightRef.current?.setMatrixAt(i, hideMat);
      taillightRef.current?.setMatrixAt(i, hideMat);
    }
    chassisRef.current.instanceMatrix.needsUpdate = true;
    canopyRef.current.instanceMatrix.needsUpdate = true;
    if (repulsorRef.current) repulsorRef.current.instanceMatrix.needsUpdate = true;
    if (headlightRef.current) headlightRef.current.instanceMatrix.needsUpdate = true;
    if (taillightRef.current) taillightRef.current.instanceMatrix.needsUpdate = true;
  }, [targetTrafficCount]);

  // Pre-allocated transforms to prevent GC allocation
  const tempMatrix = useMemo(() => new THREE.Matrix4(), []);
  const tempPos = useMemo(() => new THREE.Vector3(), []);
  const tempQuat = useMemo(() => new THREE.Quaternion(), []);
  const unitScale = useMemo(() => new THREE.Vector3(1, 1, 1), []);

  useFrame((state, delta) => {
    if (!trafficVisible || !chassisRef.current || !canopyRef.current) return;

    const speedMult = isRunning ? simSpeed : 0;
    const congestionFactor = THREE.MathUtils.clamp(
      1.0 - transitStats.congestionIndex / 160,
      0.35,
      1.25
    );
    const actualSpeed = speedMult * 1.5 * congestionFactor;
    const activeCount = Math.min(targetTrafficCount, vehicles.length);

    // Only iterate through currently active vehicles
    for (let i = 0; i < activeCount; i++) {
      const veh = vehicles[i];

      // Advance position
      if (speedMult > 0) {
        veh.currentPos += veh.dir * veh.speed * actualSpeed * delta;

        // Wrap boundaries according to route type
        if (veh.route === 'bridge_north' || veh.route === 'bridge_south') {
          if (veh.dir === 1 && veh.currentPos > 58) veh.currentPos = -58;
          else if (veh.dir === -1 && veh.currentPos < -58) veh.currentPos = 58;
        } else if (
          veh.route === 'cross_avenue_0' ||
          veh.route === 'cross_avenue_north' ||
          veh.route === 'cross_avenue_south'
        ) {
          if (veh.dir === 1 && veh.currentPos > 85) veh.currentPos = 12;
          else if (veh.dir === -1 && veh.currentPos < 12) veh.currentPos = 85;
        } else {
          // North-south boulevards (span 280m!)
          if (veh.dir === 1 && veh.currentPos > 140) veh.currentPos = -140;
          else if (veh.dir === -1 && veh.currentPos < -140) veh.currentPos = 140;
        }
      }

      // Smooth aerodynamic bobbing
      const hoverY = 0.38 + Math.sin(state.clock.elapsedTime * 5 + i) * 0.035;

      let posX = 0;
      let posZ = 0;
      let yaw = 0;

      if (veh.route === 'bridge_north') {
        posX = veh.currentPos;
        posZ = 16 + veh.laneOffset;
        yaw = veh.dir === 1 ? Math.PI / 2 : -Math.PI / 2;
      } else if (veh.route === 'bridge_south') {
        posX = veh.currentPos;
        posZ = -16 + veh.laneOffset;
        yaw = veh.dir === 1 ? Math.PI / 2 : -Math.PI / 2;
      } else if (veh.route === 'east_main') {
        posX = 24 + veh.laneOffset;
        posZ = veh.currentPos;
        yaw = veh.dir === 1 ? 0 : Math.PI;
      } else if (veh.route === 'west_main') {
        posX = -22 + veh.laneOffset;
        posZ = veh.currentPos;
        yaw = veh.dir === 1 ? 0 : Math.PI;
      } else if (veh.route === 'east_outer') {
        posX = 64 + veh.laneOffset;
        posZ = veh.currentPos;
        yaw = veh.dir === 1 ? 0 : Math.PI;
      } else if (veh.route === 'west_outer') {
        posX = -64 + veh.laneOffset;
        posZ = veh.currentPos;
        yaw = veh.dir === 1 ? 0 : Math.PI;
      } else if (veh.route === 'cross_avenue_0') {
        posX = veh.currentPos;
        posZ = 0 + veh.laneOffset;
        yaw = veh.dir === 1 ? Math.PI / 2 : -Math.PI / 2;
      } else if (veh.route === 'cross_avenue_north') {
        posX = veh.currentPos;
        posZ = 36 + veh.laneOffset;
        yaw = veh.dir === 1 ? Math.PI / 2 : -Math.PI / 2;
      } else if (veh.route === 'cross_avenue_south') {
        posX = veh.currentPos;
        posZ = -36 + veh.laneOffset;
        yaw = veh.dir === 1 ? Math.PI / 2 : -Math.PI / 2;
      }

      tempQuat.setFromAxisAngle(UP_AXIS, yaw);

      // 1. Chassis
      tempPos.set(posX, hoverY, posZ);
      tempMatrix.compose(tempPos, tempQuat, unitScale);
      chassisRef.current.setMatrixAt(i, tempMatrix);

      // 2. Canopy (slightly raised and offset)
      tempPos.set(posX, hoverY + 0.18, posZ);
      tempMatrix.compose(tempPos, tempQuat, unitScale);
      canopyRef.current.setMatrixAt(i, tempMatrix);

      // 3. Repulsor Glow Disc (underneath)
      tempPos.set(posX, hoverY - 0.12, posZ);
      tempMatrix.compose(tempPos, tempQuat, unitScale);
      repulsorRef.current?.setMatrixAt(i, tempMatrix);

      // 4. Headlights (in front)
      const forwardX = Math.sin(yaw) * 0.7;
      const forwardZ = Math.cos(yaw) * 0.7;
      tempPos.set(posX + forwardX, hoverY + 0.02, posZ + forwardZ);
      tempMatrix.compose(tempPos, tempQuat, unitScale);
      headlightRef.current?.setMatrixAt(i, tempMatrix);

      // 5. Taillights (behind)
      tempPos.set(posX - forwardX, hoverY + 0.04, posZ - forwardZ);
      tempMatrix.compose(tempPos, tempQuat, unitScale);
      taillightRef.current?.setMatrixAt(i, tempMatrix);
    }

    chassisRef.current.instanceMatrix.needsUpdate = true;
    canopyRef.current.instanceMatrix.needsUpdate = true;
    if (repulsorRef.current) repulsorRef.current.instanceMatrix.needsUpdate = true;
    if (headlightRef.current) headlightRef.current.instanceMatrix.needsUpdate = true;
    if (taillightRef.current) taillightRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <group name="instanced_traffic_fleet">
      {/* 1. AERODYNAMIC HOVER POD CHASSIS (InstancedMesh) */}
      <instancedMesh
        ref={chassisRef}
        args={[undefined, undefined, MAX_STREET_VEHICLES]}
        castShadow
      >
        <boxGeometry args={[0.65, 0.28, 1.35]} />
        <meshStandardMaterial metalness={0.75} roughness={0.25} />
      </instancedMesh>

      {/* 2. TINTED COCKPIT CANOPY (InstancedMesh) */}
      <instancedMesh
        ref={canopyRef}
        args={[undefined, undefined, MAX_STREET_VEHICLES]}
      >
        <boxGeometry args={[0.48, 0.16, 0.72]} />
        <meshStandardMaterial color="#0f172a" metalness={0.9} roughness={0.1} />
      </instancedMesh>

      {/* 3. REPULSOR GLOW RINGS (InstancedMesh, Unlit toneMapped=false) */}
      <instancedMesh
        ref={repulsorRef}
        args={[undefined, undefined, MAX_STREET_VEHICLES]}
      >
        <cylinderGeometry args={[0.22, 0.22, 0.04, 10]} />
        <meshBasicMaterial toneMapped={false} />
      </instancedMesh>

      {/* 4. BRIGHT FRONT HEADLIGHTS (InstancedMesh) */}
      <instancedMesh
        ref={headlightRef}
        args={[undefined, undefined, MAX_STREET_VEHICLES]}
      >
        <boxGeometry args={[0.52, 0.08, 0.04]} />
        <meshBasicMaterial
          color={isNight ? '#ffffff' : '#38bdf8'}
          toneMapped={false}
        />
      </instancedMesh>

      {/* 5. REAR NEON TAILLIGHT BARS (InstancedMesh) */}
      <instancedMesh
        ref={taillightRef}
        args={[undefined, undefined, MAX_STREET_VEHICLES]}
      >
        <boxGeometry args={[0.54, 0.06, 0.04]} />
        <meshBasicMaterial color="#ef4444" toneMapped={false} />
      </instancedMesh>
    </group>
  );
};
