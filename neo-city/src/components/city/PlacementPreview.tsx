import React, { useEffect, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useCityStore } from '../../store/useCityStore';
import {
  validateBuildingPlacement,
  DENSITY_SPACING_CONFIG,
  CATEGORY_SPACING_PADDING,
} from '../../systems/city/BuildingSpacingSystem';

export const PlacementPreview: React.FC = () => {
  const placement = useCityStore((state) => state.placement);
  const buildings = useCityStore((state) => state.buildings);
  const updatePlacementPosition = useCityStore((state) => state.updatePlacementPosition);
  const rotatePlacement = useCityStore((state) => state.rotatePlacement);
  const confirmPlacement = useCityStore((state) => state.confirmPlacement);
  const cancelPlacement = useCityStore((state) => state.cancelPlacement);
  const densityMode = useCityStore((state) => state.densityMode || 'medium');

  const ghostRef = useRef<THREE.Group>(null);
  const reticleRef = useRef<THREE.Mesh>(null);

  // Keyboard shortcut listeners (R to rotate, Esc to cancel, Enter to confirm)
  useEffect(() => {
    if (!placement.active) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'r' || e.key === 'R') {
        rotatePlacement();
      } else if (e.key === 'Escape') {
        cancelPlacement();
      } else if (e.key === 'Enter' || e.key === ' ') {
        confirmPlacement();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [placement.active, rotatePlacement, cancelPlacement, confirmPlacement]);

  // Subtle floating pulse for ghost mesh
  useFrame(({ clock }) => {
    if (ghostRef.current) {
      const t = clock.getElapsedTime();
      ghostRef.current.position.y = 0.15 + Math.sin(t * 4) * 0.08;
    }
  });

  if (!placement.active || !placement.blueprint) return null;

  const bp = placement.blueprint;
  const [w, h, d] = bp.dimensions;
  const isValid = placement.isValid;

  // Handle pointer hover on ground plane across full buildable terrain
  const handlePointerMove = (e: any) => {
    e.stopPropagation();
    const pt = e.point;

    // Snap to 2m grid increments across the entire map
    const snappedX = Math.round(pt.x / 2) * 2;
    const snappedZ = Math.round(pt.z / 2) * 2;

    const result = validateBuildingPlacement(
      bp,
      [snappedX, 0, snappedZ],
      placement.rotation,
      buildings,
      densityMode
    );

    updatePlacementPosition([snappedX, 0, snappedZ], result.isValid);
  };

  const handleClick = (e: any) => {
    e.stopPropagation();
    if (isValid) {
      confirmPlacement();
    }
  };

  const previewColor = isValid ? '#00f0ff' : '#ef4444';

  return (
    <>
      {/* Expansive raycasting ground collision plane spanning 360m x 360m */}
      <mesh
        position={[0, 0.08, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        onPointerMove={handlePointerMove}
        onClick={handleClick}
        visible={false}
      >
        <planeGeometry args={[360, 360]} />
        <meshBasicMaterial />
      </mesh>

      {/* 3D Holographic Ghost Mesh at current snapped position */}
      <group
        position={[placement.position[0], 0, placement.position[2]]}
        rotation={[0, placement.rotation, 0]}
      >
        {/* Ground footprint bounding reticle */}
        <mesh ref={reticleRef} position={[0, 0.15, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[w + 0.8, d + 0.8]} />
          <meshBasicMaterial color={previewColor} transparent opacity={0.35} />
        </mesh>

        {/* Clearance Buffer Ring (shows required spacing under current density setting) */}
        {(() => {
          const buffer =
            (DENSITY_SPACING_CONFIG[densityMode as keyof typeof DENSITY_SPACING_CONFIG]?.bufferDistance || 3.6) +
            (CATEGORY_SPACING_PADDING[bp.category] || 1.5);
          return (
            <mesh position={[0, 0.12, 0]} rotation={[-Math.PI / 2, 0, 0]}>
              <ringGeometry args={[Math.max(w, d) / 2 + 0.4, Math.max(w, d) / 2 + buffer, 32]} />
              <meshBasicMaterial color={isValid ? '#38bdf8' : '#ef4444'} transparent opacity={0.16} />
            </mesh>
          );
        })()}

        {/* Blueprint Footprint Wireframe Border */}
        <lineSegments position={[0, 0.16, 0]}>
          <edgesGeometry args={[new THREE.BoxGeometry(w + 0.8, 0.1, d + 0.8)]} />
          <lineBasicMaterial color={previewColor} linewidth={2} />
        </lineSegments>

        {/* Semi-transparent Holographic CAD Volume */}
        <group ref={ghostRef}>
          <mesh position={[0, h / 2, 0]}>
            <boxGeometry args={[w, h, d]} />
            <meshStandardMaterial
              color={previewColor}
              transparent
              opacity={0.38}
              roughness={0.2}
              metalness={0.8}
              wireframe={false}
            />
          </mesh>

          {/* Wireframe CAD Exoskeleton Lines */}
          <lineSegments position={[0, h / 2, 0]}>
            <edgesGeometry args={[new THREE.BoxGeometry(w, h, d)]} />
            <lineBasicMaterial color={previewColor} />
          </lineSegments>

          {/* Vertical Elevation Laser Beam */}
          <mesh position={[0, h + 1.2, 0]}>
            <cylinderGeometry args={[0.08, 0.08, 2.4, 8]} />
            <meshBasicMaterial color={previewColor} />
          </mesh>
        </group>
      </group>
    </>
  );
};
