import React, { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useCityStore } from '../../store/useCityStore';
import { generateCitizenPath } from '../../systems/city/CitizenSimulationSystem';

interface WalkerRuntime {
  path: [number, number][];
  currentWaypointIndex: number;
  progress: number;
  stridePhase: number;
  speed: number;
  lastTargetPos: [number, number, number];
}

const MAX_CITIZENS = 240;
const UP_VECTOR = new THREE.Vector3(0, 1, 0);

export const PedestrianSimulation: React.FC = () => {
  const isRunning = useCityStore((state) => state.isRunning);
  const simSpeed = useCityStore((state) => state.speed);
  const trafficVisible = useCityStore((state) => state.trafficVisible);
  const happiness = useCityStore((state) => state.stats.happiness);
  const lightingMode = useCityStore((state) => state.lightingMode);
  const targetCitizenCount = useCityStore((state) => state.graphics.pedestrianCount);
  const simulatedCitizens = useCityStore((state) => state.stats.simulatedCitizens) || [];
  const selectedCitizenId = useCityStore((state) => state.stats.selectedCitizenId);
  const selectCitizen = useCityStore((state) => state.selectCitizen);

  const isNight = lightingMode === 'night';
  const bodyMeshRef = useRef<THREE.InstancedMesh>(null);
  const headMeshRef = useRef<THREE.InstancedMesh>(null);
  const glowMeshRef = useRef<THREE.InstancedMesh>(null);
  const selectedMarkerRef = useRef<THREE.Group>(null);

  // Runtime tracking for path progression per citizen
  const runtimeMapRef = useRef<Map<string, WalkerRuntime>>(new Map());

  // Keep colors up to date when citizens count initializes or changes
  const citizenCount = simulatedCitizens.length;
  useEffect(() => {
    if (!bodyMeshRef.current || !headMeshRef.current || !glowMeshRef.current) return;

    const dummyColor = new THREE.Color();
    const count = Math.min(citizenCount, MAX_CITIZENS);

    for (let i = 0; i < MAX_CITIZENS; i++) {
      if (i < count) {
        const c = simulatedCitizens[i];
        bodyMeshRef.current.setColorAt(i, dummyColor.set(c?.suitColor || '#00f0ff'));
        headMeshRef.current.setColorAt(i, dummyColor.set('#fed7aa'));
        glowMeshRef.current.setColorAt(i, dummyColor.set(c?.visorColor || '#00f0ff'));
      }
    }

    if (bodyMeshRef.current.instanceColor) bodyMeshRef.current.instanceColor.needsUpdate = true;
    if (headMeshRef.current.instanceColor) headMeshRef.current.instanceColor.needsUpdate = true;
    if (glowMeshRef.current.instanceColor) glowMeshRef.current.instanceColor.needsUpdate = true;
  }, [citizenCount]);

  // Hide inactive instances when pedestrian limit changes
  useEffect(() => {
    if (!bodyMeshRef.current || !headMeshRef.current || !glowMeshRef.current) return;
    const hideMat = new THREE.Matrix4().makeScale(0, 0, 0);
    for (let i = targetCitizenCount; i < MAX_CITIZENS; i++) {
      bodyMeshRef.current.setMatrixAt(i, hideMat);
      headMeshRef.current.setMatrixAt(i, hideMat);
      glowMeshRef.current.setMatrixAt(i, hideMat);
    }
    bodyMeshRef.current.instanceMatrix.needsUpdate = true;
    headMeshRef.current.instanceMatrix.needsUpdate = true;
    glowMeshRef.current.instanceMatrix.needsUpdate = true;
  }, [targetCitizenCount]);

  // Pre-allocated math objects to guarantee 0 allocations in 60fps render loop
  const tempMatrix = useMemo(() => new THREE.Matrix4(), []);
  const tempPos = useMemo(() => new THREE.Vector3(), []);
  const tempQuat = useMemo(() => new THREE.Quaternion(), []);
  const tempScale = useMemo(() => new THREE.Vector3(), []);

  useFrame((state, delta) => {
    if (!trafficVisible || !bodyMeshRef.current || !headMeshRef.current || !glowMeshRef.current) return;

    const speedMult = isRunning ? simSpeed : 0;
    const happinessFactor = THREE.MathUtils.clamp(happiness / 100, 0.6, 1.3);
    const count = Math.min(simulatedCitizens.length, targetCitizenCount, MAX_CITIZENS);
    const runtimes = runtimeMapRef.current;

    let selectedCitizenPos: THREE.Vector3 | null = null;

    for (let i = 0; i < count; i++) {
      const c = simulatedCitizens[i];
      let rt = runtimes.get(c.id);

      // Initialize or recalculate path if target changed
      if (
        !rt ||
        rt.lastTargetPos[0] !== c.targetPos[0] ||
        rt.lastTargetPos[2] !== c.targetPos[2]
      ) {
        const startX = rt ? rt.path[rt.currentWaypointIndex]?.[0] ?? c.currentPos[0] : c.currentPos[0];
        const startZ = rt ? rt.path[rt.currentWaypointIndex]?.[1] ?? c.currentPos[2] : c.currentPos[2];
        const generatedPath = generateCitizenPath([startX, 0.15, startZ], c.targetPos);

        rt = {
          path: generatedPath.length >= 2 ? generatedPath : [[startX, startZ], [c.targetPos[0], c.targetPos[2]]],
          currentWaypointIndex: 0,
          progress: 0,
          stridePhase: Math.random() * Math.PI * 2,
          speed: c.speed,
          lastTargetPos: [...c.targetPos],
        };
        runtimes.set(c.id, rt);
      }

      // Advance path navigation
      if (speedMult > 0 && rt.path.length >= 2) {
        rt.stridePhase += delta * rt.speed * speedMult * 6.5;

        const currentWp = rt.path[rt.currentWaypointIndex];
        const nextWp = rt.path[(rt.currentWaypointIndex + 1) % rt.path.length];

        const dx = nextWp[0] - currentWp[0];
        const dz = nextWp[1] - currentWp[1];
        const dist = Math.sqrt(dx * dx + dz * dz) || 1;

        const step = (rt.speed * speedMult * happinessFactor * delta) / dist;
        rt.progress += step;

        if (rt.progress >= 1.0) {
          rt.progress = 0;
          rt.currentWaypointIndex = (rt.currentWaypointIndex + 1) % rt.path.length;
        }

        const posX = currentWp[0] + dx * rt.progress;
        const posZ = currentWp[1] + dz * rt.progress;

        // Walking vertical bobbing
        const bobbing = Math.abs(Math.sin(rt.stridePhase)) * 0.04;
        const posY = 0.12 + bobbing;

        // Forward facing yaw angle
        const yaw = Math.atan2(dx, dz);

        // 1. Torso Matrix
        tempPos.set(posX, posY + 0.35, posZ);
        tempQuat.setFromAxisAngle(UP_VECTOR, yaw);
        tempScale.set(1, 1, 1);
        tempMatrix.compose(tempPos, tempQuat, tempScale);
        bodyMeshRef.current.setMatrixAt(i, tempMatrix);

        // 2. Head Matrix
        tempPos.set(posX, posY + 0.72, posZ);
        tempScale.set(1, 1, 1);
        tempMatrix.compose(tempPos, tempQuat, tempScale);
        headMeshRef.current.setMatrixAt(i, tempMatrix);

        // 3. Cyber-Visor / Communicator Halo Matrix
        tempPos.set(posX, posY + 0.82, posZ);
        const auraPulse = isNight ? 1.0 + Math.sin(state.clock.elapsedTime * 3 + i) * 0.2 : 0.85;
        tempScale.set(auraPulse, auraPulse, auraPulse);
        tempMatrix.compose(tempPos, tempQuat, tempScale);
        glowMeshRef.current.setMatrixAt(i, tempMatrix);

        // Track selected citizen position for beacon marker
        if (selectedCitizenId === c.id) {
          selectedCitizenPos = tempPos.clone();
        }
      }
    }

    bodyMeshRef.current.instanceMatrix.needsUpdate = true;
    headMeshRef.current.instanceMatrix.needsUpdate = true;
    glowMeshRef.current.instanceMatrix.needsUpdate = true;

    // Update selected citizen beacon
    if (selectedMarkerRef.current) {
      if (selectedCitizenPos) {
        selectedMarkerRef.current.visible = true;
        selectedMarkerRef.current.position.set(
          selectedCitizenPos.x,
          selectedCitizenPos.y + 0.6,
          selectedCitizenPos.z
        );
        selectedMarkerRef.current.rotation.y += delta * 2.5;
      } else {
        selectedMarkerRef.current.visible = false;
      }
    }
  });

  const handlePointerDown = (e: any) => {
    e.stopPropagation();
    if (e.instanceId !== undefined && simulatedCitizens[e.instanceId]) {
      selectCitizen(simulatedCitizens[e.instanceId].id);
    }
  };

  return (
    <group name="living_citizens_pedestrian_simulation">
      {/* CITIZEN TORSO / BODY (Tunic / Exo-Jacket) */}
      <instancedMesh
        ref={bodyMeshRef}
        args={[undefined, undefined, MAX_CITIZENS]}
        onClick={handlePointerDown}
      >
        <cylinderGeometry args={[0.13, 0.16, 0.55, 6]} />
        <meshStandardMaterial
          roughness={0.35}
          metalness={0.65}
          toneMapped={false}
        />
      </instancedMesh>

      {/* CITIZEN HEAD */}
      <instancedMesh
        ref={headMeshRef}
        args={[undefined, undefined, MAX_CITIZENS]}
        onClick={handlePointerDown}
      >
        <sphereGeometry args={[0.12, 6, 6]} />
        <meshStandardMaterial
          color="#fed7aa"
          roughness={0.6}
          metalness={0.1}
        />
      </instancedMesh>

      {/* CITIZEN CYBER-VISOR / COMMUNICATOR RING */}
      <instancedMesh
        ref={glowMeshRef}
        args={[undefined, undefined, MAX_CITIZENS]}
        onClick={handlePointerDown}
      >
        <torusGeometry args={[0.14, 0.025, 6, 12]} />
        <meshBasicMaterial
          toneMapped={false}
        />
      </instancedMesh>

      {/* SELECTED CITIZEN HOLOGRAPHIC BEACON RETICLE */}
      <group ref={selectedMarkerRef} visible={false}>
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.35, 0.45, 16]} />
          <meshBasicMaterial color="#00f0ff" side={THREE.DoubleSide} />
        </mesh>
        <mesh position={[0, 0.35, 0]} rotation={[Math.PI, 0, 0]}>
          <coneGeometry args={[0.12, 0.3, 4]} />
          <meshBasicMaterial color="#00f0ff" />
        </mesh>
      </group>
    </group>
  );
};
