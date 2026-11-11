import React, { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import * as THREE from 'three';
import { useCityStore } from '../../store/useCityStore';

export const CameraRig: React.FC = () => {
  const controlsRef = useRef<OrbitControlsImpl>(null);
  const autoRotate = useCityStore((state) => state.autoRotate);
  const cameraFlightTarget = useCityStore((state) => state.cameraFlightTarget);
  const clearCameraFlight = useCityStore((state) => state.clearCameraFlight);

  const { camera } = useThree();

  const targetPos = useRef(new THREE.Vector3());
  const targetLook = useRef(new THREE.Vector3());

  // Cancel programmatic camera flight if user interacts directly with mouse
  useEffect(() => {
    const handleUserInteraction = () => {
      if (cameraFlightTarget) {
        clearCameraFlight();
      }
    };
    window.addEventListener('pointerdown', handleUserInteraction);
    window.addEventListener('wheel', handleUserInteraction, { passive: true });
    return () => {
      window.removeEventListener('pointerdown', handleUserInteraction);
      window.removeEventListener('wheel', handleUserInteraction);
    };
  }, [cameraFlightTarget, clearCameraFlight]);

  useFrame((_, delta) => {
    if (!controlsRef.current) return;

    if (cameraFlightTarget) {
      targetPos.current.set(...cameraFlightTarget.pos);
      targetLook.current.set(...cameraFlightTarget.lookAt);

      camera.position.lerp(targetPos.current, Math.min(1.0, delta * 4.5));
      controlsRef.current.target.lerp(targetLook.current, Math.min(1.0, delta * 4.8));
      controlsRef.current.update();

      const distPos = camera.position.distanceTo(targetPos.current);
      const distLook = controlsRef.current.target.distanceTo(targetLook.current);
      if (distPos < 0.25 && distLook < 0.25) {
        clearCameraFlight();
      }
    } else {
      controlsRef.current.update();
    }
  });

  return (
    <OrbitControls
      ref={controlsRef}
      enableDamping
      dampingFactor={0.065}
      enableZoom={true}
      zoomSpeed={1.05}
      enableRotate={true}
      rotateSpeed={0.85}
      enablePan={true}
      panSpeed={0.95}
      screenSpacePanning={true}
      maxPolarAngle={Math.PI / 2 - 0.05}
      minDistance={8}
      maxDistance={480}
      autoRotate={autoRotate}
      autoRotateSpeed={0.7}
    />
  );
};
