import React, { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Stars } from '@react-three/drei';
import * as THREE from 'three';
import { useCityStore } from '../../store/useCityStore';

// Static reusable objects to guarantee zero allocation in render loop
const TEMP_SUN_COLOR = new THREE.Color();
const TEMP_AMBIENT_COLOR = new THREE.Color();
const TEMP_SUN_POS = new THREE.Vector3();

export const Atmosphere: React.FC = () => {
  const lightingMode = useCityStore((state) => state.lightingMode);
  const shadowQuality = useCityStore((state) => state.graphics.shadowQuality);

  const dirLightRef = useRef<THREE.DirectionalLight>(null);
  const ambientLightRef = useRef<THREE.AmbientLight>(null);
  const hemiLightRef = useRef<THREE.HemisphereLight>(null);
  const isTransitioning = useRef<boolean>(true);

  // Trigger shadow map update when lighting mode or shadow quality changes
  useEffect(() => {
    isTransitioning.current = true;
    if (dirLightRef.current) {
      dirLightRef.current.shadow.needsUpdate = true;
    }
  }, [lightingMode, shadowQuality]);

  useFrame((_, delta) => {
    let sunIntensity = 2.4;
    let ambientIntensity = 1.25;

    if (lightingMode === 'sunset') {
      TEMP_SUN_COLOR.set('#f97316');
      TEMP_AMBIENT_COLOR.set('#a21caf');
      sunIntensity = 2.6;
      ambientIntensity = 1.1;
      TEMP_SUN_POS.set(80, 45, 50);
    } else if (lightingMode === 'night') {
      TEMP_SUN_COLOR.set('#38bdf8');
      TEMP_AMBIENT_COLOR.set('#38bdf8');
      sunIntensity = 1.35;
      ambientIntensity = 1.05;
      TEMP_SUN_POS.set(60, 80, -60);
    } else {
      TEMP_SUN_COLOR.set('#fff7ed');
      TEMP_AMBIENT_COLOR.set('#e2e8f0');
      sunIntensity = 2.5;
      ambientIntensity = 1.25;
      TEMP_SUN_POS.set(80, 100, 70);
    }

    if (dirLightRef.current) {
      // Configure shadow caching: only auto-update while transitioning
      dirLightRef.current.shadow.autoUpdate = false;

      if (isTransitioning.current) {
        dirLightRef.current.color.lerp(TEMP_SUN_COLOR, delta * 3);
        dirLightRef.current.intensity = THREE.MathUtils.lerp(
          dirLightRef.current.intensity,
          sunIntensity,
          delta * 3
        );
        dirLightRef.current.position.lerp(TEMP_SUN_POS, delta * 2);

        // Mark shadow map dirty during lighting interpolation
        dirLightRef.current.shadow.needsUpdate = true;

        if (dirLightRef.current.position.distanceTo(TEMP_SUN_POS) < 0.2) {
          isTransitioning.current = false;
        }
      }
    }

    if (ambientLightRef.current) {
      ambientLightRef.current.color.lerp(TEMP_AMBIENT_COLOR, delta * 3);
      ambientLightRef.current.intensity = THREE.MathUtils.lerp(
        ambientLightRef.current.intensity,
        ambientIntensity,
        delta * 3
      );
    }
  });

  const getFogColor = () => {
    if (lightingMode === 'day') return '#e2e8f0';
    if (lightingMode === 'sunset') return '#2e1065';
    return '#060e1e';
  };

  const getBgColor = () => {
    if (lightingMode === 'day') return '#dbeafe';
    if (lightingMode === 'sunset') return '#3b0764';
    return '#040914';
  };

  const shadowMapSize = shadowQuality === 'low' ? 1024 : shadowQuality === 'ultra' ? 4096 : 2048;
  const isShadowActive = shadowQuality !== 'off';

  return (
    <>
      {/* Dynamic atmospheric background & expansive fog */}
      <color attach="background" args={[getBgColor()]} />
      <fog
        attach="fog"
        args={[
          getFogColor(),
          lightingMode === 'day' ? 140 : 110,
          lightingMode === 'day' ? 680 : 580,
        ]}
      />

      {/* Main Celestial Directional Light - Expansive 450m x 450m Frustum Covering Entire City & Corners */}
      <directionalLight
        ref={dirLightRef}
        position={[80, 100, 70]}
        intensity={2.5}
        color="#fff7ed"
        castShadow={isShadowActive}
        shadow-mapSize-width={shadowMapSize}
        shadow-mapSize-height={shadowMapSize}
        shadow-camera-near={1}
        shadow-camera-far={480}
        shadow-camera-left={-220}
        shadow-camera-right={220}
        shadow-camera-top={220}
        shadow-camera-bottom={-220}
        shadow-bias={-0.0001}
        shadow-normalBias={0.035}
      />

      {/* Southwest Omnidirectional Fill Light - Illuminates South and West Quadrants & Corners */}
      <directionalLight
        position={[-90, 65, -80]}
        intensity={lightingMode === 'sunset' ? 1.5 : lightingMode === 'day' ? 1.35 : 1.1}
        color={lightingMode === 'sunset' ? '#f43f5e' : lightingMode === 'day' ? '#bae6fd' : '#0ea5e9'}
      />

      {/* Northeast Omnidirectional Rim Light - Illuminates North and East Quadrants & Corners */}
      <directionalLight
        position={[90, 55, -80]}
        intensity={lightingMode === 'sunset' ? 1.3 : lightingMode === 'day' ? 1.2 : 0.95}
        color={lightingMode === 'sunset' ? '#fb923c' : lightingMode === 'day' ? '#f1f5f9' : '#38bdf8'}
      />

      {/* Ambient Lighting - Guarantees Base Visibility Across All Surfaces */}
      <ambientLight ref={ambientLightRef} intensity={1.25} color="#cbd5e1" />

      {/* Hemisphere Light for Realistic Sky/Ground Ambient Bouncing (Slate Alloy Ground Bounce) */}
      <hemisphereLight
        ref={hemiLightRef}
        color={lightingMode === 'sunset' ? '#fb923c' : lightingMode === 'day' ? '#bae6fd' : '#38bdf8'}
        groundColor={lightingMode === 'sunset' ? '#831843' : lightingMode === 'day' ? '#475569' : '#1e3a5f'}
        intensity={lightingMode === 'night' ? 0.9 : 1.05}
      />

      {/* Cosmic starry sky (active at sunset and night) */}
      <group visible={lightingMode !== 'day'}>
        <Stars
          radius={180}
          depth={80}
          count={lightingMode === 'sunset' ? 1500 : 3500}
          factor={4}
          saturation={1}
          fade
          speed={0.6}
        />
      </group>
    </>
  );
};
