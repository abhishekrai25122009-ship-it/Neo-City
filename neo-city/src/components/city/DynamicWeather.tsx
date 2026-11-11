import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useCityStore } from '../../store/useCityStore';

const RAIN_DROP_COUNT = 350;

export const DynamicWeather: React.FC = () => {
  const weather = useCityStore((state) => state.weather);
  const rainRef = useRef<THREE.InstancedMesh>(null);
  const auroraRef = useRef<THREE.Mesh>(null);
  const smogRef = useRef<THREE.Group>(null);

  // Initialize randomized rain drops across metropolitan bounds
  const rainDrops = useMemo(() => {
    const list: { x: number; y: number; z: number; speed: number; len: number }[] = [];
    for (let i = 0; i < RAIN_DROP_COUNT; i++) {
      list.push({
        x: (Math.random() - 0.5) * 220,
        y: Math.random() * 60 + 5,
        z: (Math.random() - 0.5) * 220,
        speed: 40 + Math.random() * 25,
        len: 1.2 + Math.random() * 0.8,
      });
    }
    return list;
  }, []);

  // Pre-allocated transforms
  const tempMatrix = useMemo(() => new THREE.Matrix4(), []);
  const tempPos = useMemo(() => new THREE.Vector3(), []);
  const tempQuat = useMemo(() => new THREE.Quaternion(), []);
  const tempScale = useMemo(() => new THREE.Vector3(1, 1, 1), []);

  useFrame(({ clock }, delta) => {
    // 1. Cyber Rain Physics
    if (weather === 'cyber_rain' && rainRef.current) {
      const time = clock.getElapsedTime();
      // Slight slant due to metropolitan crosswind
      tempQuat.setFromEuler(new THREE.Euler(0.08, 0, -0.05));

      for (let i = 0; i < RAIN_DROP_COUNT; i++) {
        const drop = rainDrops[i];
        drop.y -= drop.speed * delta;
        drop.x += Math.sin(time + i) * 0.05;

        // Wrap around sky ceiling when hitting ground
        if (drop.y <= 0.2) {
          drop.y = 60 + Math.random() * 5;
          drop.x = (Math.random() - 0.5) * 220;
          drop.z = (Math.random() - 0.5) * 220;
        }

        tempPos.set(drop.x, drop.y, drop.z);
        tempScale.set(1, drop.len, 1);
        tempMatrix.compose(tempPos, tempQuat, tempScale);
        rainRef.current.setMatrixAt(i, tempMatrix);
      }
      rainRef.current.instanceMatrix.needsUpdate = true;
    }

    // 2. Aurora Borealis Wave Oscillation
    if (weather === 'aurora_storm' && auroraRef.current) {
      const t = clock.getElapsedTime() * 0.5;
      auroraRef.current.rotation.y = t * 0.05;
      auroraRef.current.position.y = 52 + Math.sin(t) * 2;
    }

    // 3. Neon Smog Breathing
    if (weather === 'neon_smog' && smogRef.current) {
      const t = clock.getElapsedTime() * 0.3;
      smogRef.current.rotation.y = t * 0.02;
    }
  });

  return (
    <group name="dynamic_weather_system">
      {/* ========================================================
          1. CYBER RAIN (Streak Instanced Mesh)
          ======================================================== */}
      {weather === 'cyber_rain' && (
        <instancedMesh
          ref={rainRef}
          args={[undefined, undefined, RAIN_DROP_COUNT]}
          frustumCulled={false}
        >
          <cylinderGeometry args={[0.015, 0.015, 1.4, 4]} />
          <meshBasicMaterial
            color="#7dd3fc"
            transparent
            opacity={0.65}
            toneMapped={false}
          />
        </instancedMesh>
      )}

      {/* ========================================================
          2. AURORA BOREALIS MAGNETIC CURTAIN
          ======================================================== */}
      {weather === 'aurora_storm' && (
        <mesh ref={auroraRef} position={[0, 52, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[40, 160, 32, 4]} />
          <meshBasicMaterial
            color="#10b981"
            transparent
            opacity={0.25}
            side={THREE.DoubleSide}
            wireframe
          />
        </mesh>
      )}

      {/* ========================================================
          3. NEON SMOG VOLUMETRIC HAZE PLANES
          ======================================================== */}
      {weather === 'neon_smog' && (
        <group ref={smogRef} position={[0, 6, 0]}>
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[260, 260]} />
            <meshBasicMaterial
              color="#a855f7"
              transparent
              opacity={0.12}
              side={THREE.DoubleSide}
            />
          </mesh>
          <mesh position={[0, 12, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[220, 220]} />
            <meshBasicMaterial
              color="#06b6d4"
              transparent
              opacity={0.08}
              side={THREE.DoubleSide}
            />
          </mesh>
        </group>
      )}
    </group>
  );
};
