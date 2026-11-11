import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import type { BuildingData, ArchitecturalStyle } from '../../types/city';
import { useCityStore } from '../../store/useCityStore';

interface BuildingMeshProps {
  building: BuildingData;
  isSelected?: boolean;
  lightingMode?: string;
  graphicsPreset?: string;
  lodThreshold?: number;
}

// ========================================================
// GLOBAL SHARED MATERIAL CACHE
// Minimizes draw calls and GPU memory overhead for 200+ buildings
// ========================================================
const materialCache = new Map<string, THREE.Material>();

function getStandardMat(
  key: string,
  color: string,
  metalness: number,
  roughness: number,
  emissive?: string,
  emissiveIntensity?: number
): THREE.MeshStandardMaterial {
  const fullKey = `${key}_${color}_${metalness}_${roughness}_${emissive || 'none'}_${emissiveIntensity || 0}`;
  let mat = materialCache.get(fullKey) as THREE.MeshStandardMaterial;
  if (!mat) {
    mat = new THREE.MeshStandardMaterial({
      color,
      metalness,
      roughness,
      emissive: emissive || color,
      emissiveIntensity: emissiveIntensity !== undefined ? emissiveIntensity : 0.08, // Subtle base glow prevents pitch-black shadows
    });
    materialCache.set(fullKey, mat);
  }
  return mat;
}

function getBasicMat(key: string, color: string, transparent = false, opacity = 1.0): THREE.MeshBasicMaterial {
  const fullKey = `basic_${key}_${color}_${transparent}_${opacity}`;
  let mat = materialCache.get(fullKey) as THREE.MeshBasicMaterial;
  if (!mat) {
    mat = new THREE.MeshBasicMaterial({
      color,
      transparent,
      opacity,
      toneMapped: false,
      side: THREE.DoubleSide,
    });
    materialCache.set(fullKey, mat);
  }
  return mat;
}

// Isolated animated components to eliminate 228 per-frame hooks on static buildings
const BuildingSelectionReticle: React.FC<{ width: number; depth: number; height: number }> = React.memo(({ width, depth, height }) => {
  const ringRef = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (ringRef.current) {
      ringRef.current.rotation.y = clock.getElapsedTime() * 0.9;
    }
  });
  const maxDim = Math.max(width, depth);
  return (
    <group ref={ringRef} position={[0, 0.15, 0]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[maxDim * 0.75, maxDim * 0.75 + 0.35, 32]} />
        <meshBasicMaterial color="#ff5500" transparent opacity={0.9} side={THREE.DoubleSide} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[maxDim * 0.95, maxDim * 0.95 + 0.2, 4]} />
        <meshBasicMaterial color="#00e676" transparent opacity={0.85} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0, height + 5.5, 0]} rotation={[Math.PI, 0, 0]}>
        <coneGeometry args={[0.7, 1.6, 4]} />
        <meshBasicMaterial color="#ff5500" />
      </mesh>
    </group>
  );
});

const BuildingTransformEffect: React.FC<{ width: number; height: number; depth: number }> = React.memo(({ width, height, depth }) => {
  const scanLineRef = useRef<THREE.Mesh>(null);
  const posY = height / 2;
  useFrame(({ clock }) => {
    if (scanLineRef.current) {
      const scanPhase = (Math.sin(clock.getElapsedTime() * 6) + 1) / 2;
      scanLineRef.current.position.y = scanPhase * (height + 8);
    }
  });
  return (
    <group position={[0, 0, 0]}>
      <lineSegments position={[0, posY, 0]}>
        <edgesGeometry args={[new THREE.BoxGeometry(width + 1.2, height + 1.2, depth + 1.2)]} />
        <lineBasicMaterial color="#ff5500" linewidth={2} />
      </lineSegments>
      <mesh ref={scanLineRef} position={[0, 1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[width + 2, depth + 2]} />
        <meshBasicMaterial color="#ff5500" transparent opacity={0.65} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
});

const defaultTorusAxis: [number, number, number] = [Math.PI / 4, 0, 0];

const KineticTorusRing: React.FC<{ radius: number; tube?: number; color?: string; posY: number; rotationAxis?: [number, number, number] }> = React.memo(
  ({ radius, tube = 0.08, color = '#00f0ff', posY, rotationAxis = defaultTorusAxis }) => {
    const groupRef = useRef<THREE.Group>(null);
    useFrame(({ clock }) => {
      if (groupRef.current) {
        const time = clock.getElapsedTime();
        groupRef.current.rotation.y = time * 0.6;
        groupRef.current.position.y = posY + Math.sin(time * 2.0) * 0.35;
      }
    });
    return (
      <group ref={groupRef} position={[0, posY, 0]}>
        <mesh rotation={rotationAxis}>
          <torusGeometry args={[radius, tube, 6, 24]} />
          <meshBasicMaterial color={color} toneMapped={false} />
        </mesh>
      </group>
    );
  }
);

const RotatingPlasmaCore: React.FC<{ radius: number; color?: string }> = React.memo(({ radius, color = '#00e676' }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = clock.getElapsedTime() * 0.8;
    }
  });
  return (
    <mesh ref={meshRef}>
      <torusGeometry args={[radius, 0.12, 6, 20]} />
      <meshBasicMaterial color={color} toneMapped={false} transparent opacity={0.85} />
    </mesh>
  );
});

const PulsingBeacon: React.FC<{ position: [number, number, number]; material: THREE.Material; radius?: number }> = React.memo(
  ({ position, material, radius = 0.3 }) => {
    const beaconRef = useRef<THREE.Mesh>(null);
    useFrame(({ clock }) => {
      if (beaconRef.current) {
        const s = 1.0 + Math.sin(clock.getElapsedTime() * 4) * 0.15;
        beaconRef.current.scale.set(s, s, s);
      }
    });
    return (
      <mesh ref={beaconRef} position={position} material={material}>
        <sphereGeometry args={[radius, 8, 8]} />
      </mesh>
    );
  }
);

const FloatingCrown: React.FC<{ width: number; height: number; secondaryMat: THREE.Material; neonMat: THREE.Material }> = React.memo(
  ({ width, height, secondaryMat, neonMat }) => {
    const groupRef = useRef<THREE.Group>(null);
    useFrame(({ clock }) => {
      if (groupRef.current) {
        const time = clock.getElapsedTime();
        groupRef.current.rotation.y = time * 0.6;
        groupRef.current.position.y = height + 1.2 + Math.sin(time * 2.0) * 0.35;
      }
    });
    return (
      <group ref={groupRef}>
        <mesh material={secondaryMat}>
          <cylinderGeometry args={[width * 0.85, width * 0.7, 2.4, 24]} />
        </mesh>
        <mesh position={[0, -0.8, 0]} rotation={[Math.PI / 2, 0, 0]} material={neonMat}>
          <torusGeometry args={[width * 0.95, 0.14, 8, 32]} />
        </mesh>
      </group>
    );
  }
);

const BuildingMeshComponent: React.FC<BuildingMeshProps> = ({
  building,
  isSelected = false,
  lightingMode = 'day',
  graphicsPreset = 'balanced',
}) => {
  const isNight = lightingMode === 'night';
  const isPerformance = graphicsPreset === 'performance';
  const shouldCastShadow = !isPerformance && (building.height > 16 || isSelected || graphicsPreset === 'ultra');

  const [w, , d] = building.dimensions;
  const tier = Math.max(1, Math.min(8, building.level || 1));
  const baseHeight = building.height;
  const posY = baseHeight / 2;

  const handleClick = (e: any) => {
    e.stopPropagation();
    useCityStore.getState().selectBuilding(building.id);
  };

  const handleDoubleClick = (e: any) => {
    e.stopPropagation();
    useCityStore.getState().selectBuilding(building.id);
    useCityStore.getState().flyToCamera(
      [building.position[0] + 18, Math.max(14, baseHeight + 6), building.position[2] + 20],
      [building.position[0], baseHeight * 0.45, building.position[2]]
    );
  };

  // Coordinated Vibrant Color Hierarchy from Building Blueprint
  const primaryColor = building.primaryColor || '#0ea5e9';
  const secondaryColor = building.secondaryColor || '#0284c7';
  const accentColor = building.accentColor || '#ff5500';
  const windowColor = building.windowGlowColor || '#fef08a';

  // Cached materials for this building (Guaranteed non-black and non-washed-out)
  const mainMat = useMemo(
    () => getStandardMat('main', primaryColor, 0.55, 0.25, primaryColor, isNight ? 0.35 : 0.08),
    [primaryColor, isNight]
  );
  const secondaryMat = useMemo(
    () => getStandardMat('sec', secondaryColor, 0.65, 0.3, secondaryColor, isNight ? 0.3 : 0.08),
    [secondaryColor, isNight]
  );
  const accentMat = useMemo(
    () => getStandardMat('acc', accentColor, 0.8, 0.2, accentColor, isNight ? 1.6 : 0.95),
    [accentColor, isNight]
  );
  const windowMat = useMemo(() => getBasicMat('win', windowColor), [windowColor]);
  const neonMat = useMemo(() => getBasicMat('neon', accentColor), [accentColor]);
  const whiteTrimMat = useMemo(() => getStandardMat('whiteTrim', '#f8fafc', 0.4, 0.2, '#f8fafc', 0.05), []);
  const polishedAlloyMat = useMemo(() => getStandardMat('alloy', '#94a3b8', 0.85, 0.15, '#94a3b8', 0.05), []);

  // Geometry selector for 35 distinct architectural styles with Tier 1-8 Evolution
  const renderArchitecturalDesign = () => {
    const style: ArchitecturalStyle = building.style;

    switch (style) {
      // 1. COMMERCIAL GLASS SPIRE
      case 'glass_spire':
        return (
          <group>
            <mesh position={[0, 1.2, 0]} castShadow={shouldCastShadow} receiveShadow={!isPerformance} material={secondaryMat}>
              <boxGeometry args={[w + 1.2, 2.4, d + 1.2]} />
            </mesh>
            <mesh position={[0, posY, 0]} castShadow={shouldCastShadow} receiveShadow={!isPerformance} material={mainMat}>
              <boxGeometry args={[w, baseHeight, d]} />
            </mesh>
            {/* Tier 2+ Outrigger Wings */}
            {tier >= 2 && (
              <mesh position={[w * 0.55, posY * 0.7, 0]} material={secondaryMat}>
                <boxGeometry args={[w * 0.5, baseHeight * 0.6, d * 0.85]} />
              </mesh>
            )}
            {/* Tier 3+ Cantilever Sky-Lounge */}
            {tier >= 3 && (
              <mesh position={[w * 0.55, posY * 0.9, 0]} material={accentMat}>
                <boxGeometry args={[w * 0.7, 3.6, d * 0.9]} />
              </mesh>
            )}
            {/* Tier 4+ Tapered Crown Observatory */}
            {tier >= 4 && (
              <mesh position={[0, baseHeight - 1.5, 0]} material={mainMat}>
                <boxGeometry args={[w * 1.2, 3, d * 1.2]} />
              </mesh>
            )}
            {/* Tier 5+ Needle Spire & Beacon */}
            {tier >= 5 && (
              <group position={[0, baseHeight + 5, 0]}>
                <mesh material={polishedAlloyMat}>
                  <cylinderGeometry args={[0.08, 0.35, 10, 8]} />
                </mesh>
                <PulsingBeacon position={[0, 5.2, 0]} material={neonMat} />
              </group>
            )}
            {/* Window Bands */}
            {Array.from({ length: Math.min(8, Math.floor(baseHeight / 3.5)) }).map((_, i) => (
              <mesh key={`win-${i}`} position={[0, 3 + i * (baseHeight / 8), 0]} material={windowMat}>
                <boxGeometry args={[w + 0.06, 0.3, d + 0.06]} />
              </mesh>
            ))}
          </group>
        );

      // 2. CURVED GLASS SAIL TOWER
      case 'curved_glass':
        return (
          <group>
            <mesh position={[0, posY, 0]} castShadow={shouldCastShadow} receiveShadow={!isPerformance} material={mainMat}>
              <cylinderGeometry args={[w * 0.45, w * 0.6, baseHeight, 28]} />
            </mesh>
            {/* Tier 2+ Vertical Spine Louvers */}
            {tier >= 2 && (
              <mesh position={[0, posY, d * 0.55]} material={accentMat}>
                <boxGeometry args={[0.3, baseHeight * 1.05, 0.4]} />
              </mesh>
            )}
            {/* Tier 3+ Sweeping Sky Terrace */}
            {tier >= 3 && (
              <mesh position={[0, baseHeight - 0.5, 0]} material={secondaryMat}>
                <cylinderGeometry args={[w * 0.65, w * 0.5, 1.2, 28]} />
              </mesh>
            )}
            {/* Tier 4+ Cantilever Wing */}
            {tier >= 4 && (
              <mesh position={[w * 0.4, posY * 0.8, 0]} material={accentMat}>
                <boxGeometry args={[w * 0.5, 2.5, d * 0.6]} />
              </mesh>
            )}
            {/* Tier 5+ Apex Finial */}
            {tier >= 5 && (
              <mesh position={[0, baseHeight + 3, 0]} material={neonMat}>
                <cylinderGeometry args={[0.05, 0.2, 6, 8]} />
              </mesh>
            )}
          </group>
        );

      // 3. WHITE FUTURIST / AERODYNAMIC TOWER
      case 'white_futurist':
        return (
          <group>
            <mesh position={[0, posY, 0]} castShadow={shouldCastShadow} receiveShadow={!isPerformance} material={mainMat}>
              <cylinderGeometry args={[w * 0.48, w * 0.58, baseHeight, 24]} />
            </mesh>
            {/* Tier 2+ Diamond Exoskeleton Ribs */}
            {tier >= 2 && (
              <mesh position={[0, posY * 0.7, 0]} rotation={[0, 0, Math.PI / 4]} material={secondaryMat}>
                <torusGeometry args={[w * 0.62, 0.2, 8, 24]} />
              </mesh>
            )}
            {/* Tier 3+ Mid-Level Torus Ring */}
            {tier >= 3 && (
              <mesh position={[0, posY * 1.1, 0]} material={accentMat}>
                <torusGeometry args={[w * 0.68, 0.18, 12, 32]} />
              </mesh>
            )}
            {/* Tier 4+ Crown Observation Disk */}
            {tier >= 4 && (
              <mesh position={[0, baseHeight - 1, 0]} material={whiteTrimMat}>
                <cylinderGeometry args={[w * 0.75, w * 0.65, 2, 24]} />
              </mesh>
            )}
            {/* Tier 5+ Slender Crown Needle */}
            {tier >= 5 && (
              <mesh position={[0, baseHeight + 4, 0]} material={polishedAlloyMat}>
                <cylinderGeometry args={[0.05, 0.28, 8, 8]} />
              </mesh>
            )}
          </group>
        );

      // 4. QUANTUM NEEDLE SPIRE
      case 'quantum_needle':
        return (
          <group>
            <mesh position={[0, posY, 0]} castShadow={shouldCastShadow} receiveShadow={!isPerformance} material={mainMat}>
              <cylinderGeometry args={[w * 0.25, w * 0.45, baseHeight, 6]} />
            </mesh>
            {/* Tier 2+ 4 External Stabilizing Buttress Pylons */}
            {tier >= 2 &&
              [
                [w * 0.6, d * 0.6],
                [-w * 0.6, d * 0.6],
                [w * 0.6, -d * 0.6],
                [-w * 0.6, -d * 0.6],
              ].map(([bx, bz], bi) => (
                <mesh key={`but-${bi}`} position={[bx, posY * 0.5, bz]} material={secondaryMat}>
                  <boxGeometry args={[0.5, baseHeight * 0.9, 0.5]} />
                </mesh>
              ))}
            {/* Tier 3+ Floating Quantum Rings */}
            {tier >= 3 && (
              <KineticTorusRing radius={w * 0.85} tube={0.16} posY={posY * 1.1} color={accentColor} rotationAxis={[Math.PI / 3, 0, 0]} />
            )}
            {/* Tier 4+ Outrigger Sensor Pods */}
            {tier >= 4 && (
              <mesh position={[w * 0.5, posY * 0.85, 0]} material={accentMat}>
                <boxGeometry args={[w * 0.6, 2, d * 0.4]} />
              </mesh>
            )}
            {/* Tier 5+ Vertical Quantum Laser Emitter */}
            {tier >= 5 && (
              <mesh position={[0, baseHeight + 8, 0]} material={neonMat}>
                <cylinderGeometry args={[0.04, 0.04, 16, 8]} />
              </mesh>
            )}
          </group>
        );

      // 5. WARM METALLIC FINANCIAL TOWER
      case 'warm_metallic':
        return (
          <group>
            <mesh position={[0, 1.5, 0]} castShadow={shouldCastShadow} receiveShadow={!isPerformance} material={secondaryMat}>
              <boxGeometry args={[w + 1.2, 3, d + 1.2]} />
            </mesh>
            <mesh position={[0, posY, 0]} castShadow={shouldCastShadow} receiveShadow={!isPerformance} material={mainMat}>
              <boxGeometry args={[w, baseHeight, d]} />
            </mesh>
            {/* Tier 2+ Geometric Sun Louvers */}
            {tier >= 2 && (
              <mesh position={[0, posY, d / 2 + 0.15]} material={accentMat}>
                <boxGeometry args={[w * 0.85, baseHeight * 0.8, 0.2]} />
              </mesh>
            )}
            {/* Tier 3+ Stepped Upper Crown */}
            {tier >= 3 && (
              <mesh position={[0, baseHeight - 1, 0]} material={secondaryMat}>
                <boxGeometry args={[w * 0.8, 3, d * 0.8]} />
              </mesh>
            )}
            {/* Tier 4+ Gold Apex Pyramid */}
            {tier >= 4 && (
              <mesh position={[0, baseHeight + 2, 0]} material={accentMat}>
                <coneGeometry args={[w * 0.5, 4, 4]} />
              </mesh>
            )}
            {/* Tier 5+ Glowing Spire Finial */}
            {tier >= 5 && (
              <mesh position={[0, baseHeight + 5, 0]} material={neonMat}>
                <sphereGeometry args={[0.4, 8, 8]} />
              </mesh>
            )}
          </group>
        );

      // 6. HELIX SPIRAL TOWER
      case 'helix_spiral':
        return (
          <group>
            <mesh position={[0, posY, 0]} castShadow={shouldCastShadow} receiveShadow={!isPerformance} material={mainMat}>
              <cylinderGeometry args={[w * 0.42, w * 0.48, baseHeight, 24]} />
            </mesh>
            {/* Tier 2+ Double Helix Structural Ribs */}
            {tier >= 2 && (
              <group>
                {Array.from({ length: 12 }).map((_, i) => {
                  const angle = (i / 12) * Math.PI * 4;
                  const y = (i / 12) * (baseHeight - 2) + 2;
                  return (
                    <mesh
                      key={`helix-${i}`}
                      position={[Math.cos(angle) * (w * 0.55), y, Math.sin(angle) * (d * 0.55)]}
                      material={accentMat}
                    >
                      <boxGeometry args={[0.6, 1.0, 0.6]} />
                    </mesh>
                  );
                })}
              </group>
            )}
            {/* Tier 3+ Crown Revolving Sky-Disk */}
            {tier >= 3 && (
              <mesh position={[0, baseHeight, 0]} material={secondaryMat}>
                <cylinderGeometry args={[w * 0.75, w * 0.65, 1.8, 24]} />
              </mesh>
            )}
            {/* Tier 4+ Exterior Helical Skyway Ramp */}
            {tier >= 4 && (
              <mesh position={[0, posY * 0.8, 0]} rotation={[0.4, 0, 0]} material={neonMat}>
                <torusGeometry args={[w * 0.7, 0.15, 8, 32]} />
              </mesh>
            )}
            {/* Tier 5+ Double Helix Antenna Spire */}
            {tier >= 5 && (
              <mesh position={[0, baseHeight + 5, 0]} material={neonMat}>
                <cylinderGeometry args={[0.06, 0.25, 10, 8]} />
              </mesh>
            )}
          </group>
        );

      // 7. TWIN ARCOLOGY WITH SUSPENDED SKYBRIDGES
      case 'twin_arcology':
        return (
          <group>
            {/* Tower Alpha (Left) */}
            <mesh position={[-w * 0.35, posY, 0]} castShadow={shouldCastShadow} receiveShadow={!isPerformance} material={mainMat}>
              <boxGeometry args={[w * 0.55, baseHeight, d * 0.85]} />
            </mesh>
            {/* Tower Beta (Right) */}
            <mesh position={[w * 0.35, posY, 0]} castShadow={shouldCastShadow} receiveShadow={!isPerformance} material={mainMat}>
              <boxGeometry args={[w * 0.55, baseHeight, d * 0.85]} />
            </mesh>
            {/* Tier 2+ Mid-Level Suspended Skybridge */}
            {tier >= 2 && (
              <mesh position={[0, posY * 0.85, 0]} material={accentMat}>
                <boxGeometry args={[w * 0.8, 1.8, d * 0.45]} />
              </mesh>
            )}
            {/* Tier 3+ Upper Sky-Atrium Bridge */}
            {tier >= 3 && (
              <mesh position={[0, baseHeight * 0.85, 0]} material={secondaryMat}>
                <boxGeometry args={[w * 0.9, 2.2, d * 0.55]} />
              </mesh>
            )}
            {/* Tier 4+ Base Connecting Atrium */}
            {tier >= 4 && (
              <mesh position={[0, 2.5, 0]} material={secondaryMat}>
                <boxGeometry args={[w * 1.1, 5, d]} />
              </mesh>
            )}
            {/* Tier 5+ Twin Crown Antennas */}
            {tier >= 5 && (
              <group>
                <mesh position={[-w * 0.35, baseHeight + 3, 0]} material={polishedAlloyMat}>
                  <cylinderGeometry args={[0.06, 0.2, 6, 8]} />
                </mesh>
                <mesh position={[w * 0.35, baseHeight + 3, 0]} material={polishedAlloyMat}>
                  <cylinderGeometry args={[0.06, 0.2, 6, 8]} />
                </mesh>
              </group>
            )}
          </group>
        );

      // 8. FLOATING CROWN OBSERVATORY
      case 'floating_crown':
        return (
          <group>
            <mesh position={[0, posY, 0]} castShadow={shouldCastShadow} receiveShadow={!isPerformance} material={mainMat}>
              <cylinderGeometry args={[w * 0.5, w * 0.58, baseHeight, 6]} />
            </mesh>
            {/* Tier 2+ Base Atrium Pod */}
            {tier >= 2 && (
              <mesh position={[0, 2, 0]} material={secondaryMat}>
                <cylinderGeometry args={[w * 0.7, w * 0.75, 4, 6]} />
              </mesh>
            )}
            {/* Tier 3+ Floating Levitating Anti-Gravity Crown */}
            {tier >= 3 && (
              <FloatingCrown width={w} height={baseHeight} secondaryMat={secondaryMat} neonMat={neonMat} />
            )}
            {/* Tier 4+ Energy Conduits */}
            {tier >= 4 && (
              <mesh position={[0, posY, w * 0.55]} material={accentMat}>
                <boxGeometry args={[0.3, baseHeight * 0.9, 0.3]} />
              </mesh>
            )}
            {/* Tier 5+ Crown Beacons */}
            {tier >= 5 && (
              <mesh position={[0, baseHeight + 6, 0]} material={neonMat}>
                <sphereGeometry args={[0.4, 8, 8]} />
              </mesh>
            )}
          </group>
        );

      // 9. SUSPENDED HOVER PLATFORM
      case 'hover_platform':
        return (
          <group>
            {[
              [w * 0.45, d * 0.45],
              [-w * 0.45, d * 0.45],
              [w * 0.45, -d * 0.45],
              [-w * 0.45, -d * 0.45],
            ].map(([px, pz], pi) => (
              <mesh key={`pylon-${pi}`} position={[px, 2.5, pz]} material={secondaryMat}>
                <boxGeometry args={[0.6, 5, 0.6]} />
              </mesh>
            ))}
            <mesh position={[0, posY + 2.5, 0]} castShadow={shouldCastShadow} receiveShadow={!isPerformance} material={mainMat}>
              <boxGeometry args={[w * 1.1, baseHeight * 0.75, d * 1.1]} />
            </mesh>
            {/* Glowing Magnetic Core */}
            <mesh position={[0, 2.5, 0]} material={neonMat}>
              <sphereGeometry args={[w * 0.35, 12, 12]} />
            </mesh>
            {/* Tier 2+ Aerodynamic Roof Fin */}
            {tier >= 2 && (
              <mesh position={[0, baseHeight + 3.5, 0]} material={accentMat}>
                <boxGeometry args={[w * 0.8, 1.2, 0.3]} />
              </mesh>
            )}
            {/* Tier 3+ Cantilever Observation Pods */}
            {tier >= 3 && (
              <mesh position={[w * 0.65, posY + 2.5, 0]} material={secondaryMat}>
                <boxGeometry args={[w * 0.4, 2, d * 0.6]} />
              </mesh>
            )}
            {/* Tier 4+ Upper Solar Deck */}
            {tier >= 4 && (
              <mesh position={[0, baseHeight + 4.2, 0]} material={neonMat}>
                <cylinderGeometry args={[w * 0.6, w * 0.6, 0.2, 16]} />
              </mesh>
            )}
            {/* Tier 5+ Magnetic Forcefield Ring */}
            {tier >= 5 && (
              <mesh position={[0, posY + 2.5, 0]} rotation={[Math.PI / 2, 0, 0]} material={neonMat}>
                <torusGeometry args={[w * 1.25, 0.12, 8, 32]} />
              </mesh>
            )}
          </group>
        );

      // 10. NEON CYBER PYRAMID
      case 'neon_pyramid':
        return (
          <group>
            {[0, 1, 2, 3].map((step) => {
              const stepHeight = baseHeight / 4;
              const y = stepHeight * (step + 0.5);
              const scale = 1 - step * 0.22;
              return (
                <group key={`pyr-step-${step}`} position={[0, y, 0]}>
                  <mesh castShadow={shouldCastShadow} receiveShadow={!isPerformance} material={mainMat}>
                    <boxGeometry args={[w * scale, stepHeight * 0.95, d * scale]} />
                  </mesh>
                  <mesh position={[0, stepHeight * 0.48, (d * scale) / 2 + 0.05]} material={neonMat}>
                    <boxGeometry args={[w * scale, 0.2, 0.08]} />
                  </mesh>
                </group>
              );
            })}
            <mesh position={[0, baseHeight + 1.2, 0]} material={accentMat}>
              <coneGeometry args={[w * 0.25, 2.5, 4]} />
            </mesh>
            {/* Tier 2+ Diagonal Corner Neons */}
            {tier >= 2 && (
              <mesh position={[0, posY, 0]} rotation={[0, Math.PI / 4, 0]} material={neonMat}>
                <boxGeometry args={[w * 0.05, baseHeight, w * 0.05]} />
              </mesh>
            )}
            {/* Tier 3+ Tiered Terraces */}
            {tier >= 3 && (
              <mesh position={[0, baseHeight * 0.5, 0]} material={secondaryMat}>
                <boxGeometry args={[w * 0.85, 0.6, d * 0.85]} />
              </mesh>
            )}
            {/* Tier 4+ Floating Apex Ring */}
            {tier >= 4 && (
              <mesh position={[0, baseHeight + 2.8, 0]} rotation={[Math.PI / 2, 0, 0]} material={neonMat}>
                <torusGeometry args={[w * 0.35, 0.08, 6, 20]} />
              </mesh>
            )}
            {/* Tier 5+ Skyward Energy Beam */}
            {tier >= 5 && (
              <mesh position={[0, baseHeight + 6, 0]} material={neonMat}>
                <cylinderGeometry args={[0.04, 0.04, 12, 8]} />
              </mesh>
            )}
          </group>
        );

      // 11. PLASMA TORUS REACTOR
      case 'plasma_core':
        return (
          <group>
            <mesh position={[0, posY * 0.6, 0]} castShadow={shouldCastShadow} receiveShadow={!isPerformance} material={mainMat}>
              <cylinderGeometry args={[w * 0.5, w * 0.55, baseHeight * 0.7, 24]} />
            </mesh>
            <group position={[0, baseHeight * 0.75, 0]}>
              <mesh rotation={[Math.PI / 2, 0, 0]} material={neonMat}>
                <torusGeometry args={[w * 0.55, 0.35, 12, 28]} />
              </mesh>
            </group>
            {/* Tier 2+ Reinforcement Struts */}
            {tier >= 2 && (
              <mesh position={[0, posY * 0.6, 0]} material={secondaryMat}>
                <cylinderGeometry args={[w * 0.58, w * 0.58, baseHeight * 0.4, 8]} />
              </mesh>
            )}
            {/* Tier 3+ Secondary Magnetic Torus */}
            {tier >= 3 && (
              <mesh position={[0, baseHeight * 0.4, 0]} rotation={[Math.PI / 2, 0, 0]} material={accentMat}>
                <torusGeometry args={[w * 0.65, 0.2, 8, 24]} />
              </mesh>
            )}
            {/* Tier 4+ Energy Discharge Rods */}
            {tier >= 4 && (
              <mesh position={[0, baseHeight + 1.5, 0]} material={polishedAlloyMat}>
                <cylinderGeometry args={[0.08, 0.2, 4, 8]} />
              </mesh>
            )}
            {/* Tier 5+ Magnetic Flux Corona */}
            {tier >= 5 && (
              <mesh position={[0, baseHeight + 3.8, 0]} material={neonMat}>
                <sphereGeometry args={[0.5, 10, 10]} />
              </mesh>
            )}
          </group>
        );

      // 12. INDUSTRIAL FUSION TOKAMAK CORE
      case 'fusion_core':
        return (
          <group>
            <mesh position={[0, posY, 0]} castShadow={shouldCastShadow} receiveShadow={!isPerformance} material={mainMat}>
              <cylinderGeometry args={[w * 0.48, w * 0.52, baseHeight, 20]} />
            </mesh>
            <group position={[0, posY, 0]}>
              <mesh rotation={[Math.PI / 2, 0, 0]} material={accentMat}>
                <torusGeometry args={[w * 0.56, 0.25, 8, 20]} />
              </mesh>
            </group>
            <mesh position={[0, baseHeight + 0.6, 0]} material={secondaryMat}>
              <cylinderGeometry args={[w * 0.3, w * 0.4, 1.2, 16]} />
            </mesh>
            {/* Tier 2+ Heavy Support Base */}
            {tier >= 2 && (
              <mesh position={[0, 1.5, 0]} material={secondaryMat}>
                <boxGeometry args={[w * 1.15, 3, d * 1.15]} />
              </mesh>
            )}
            {/* Tier 3+ Cryogenic Coolant Conduits */}
            {tier >= 3 && (
              <mesh position={[w * 0.45, posY, 0]} material={neonMat}>
                <cylinderGeometry args={[0.15, 0.15, baseHeight * 0.85, 8]} />
              </mesh>
            )}
            {/* Tier 4+ Plasma Injector Pods */}
            {tier >= 4 && (
              <mesh position={[-w * 0.45, posY * 1.2, 0]} material={accentMat}>
                <boxGeometry args={[w * 0.4, 2.5, d * 0.4]} />
              </mesh>
            )}
            {/* Tier 5+ Magnetic Confinement Spire */}
            {tier >= 5 && (
              <mesh position={[0, baseHeight + 3, 0]} material={neonMat}>
                <cylinderGeometry args={[0.06, 0.2, 6, 8]} />
              </mesh>
            )}
          </group>
        );

      // 13. AUTOMATED INDUSTRIAL FACTORY & WORKSHOP
      case 'industrial_complex':
        return (
          <group>
            <mesh position={[0, posY, 0]} castShadow={shouldCastShadow} receiveShadow={!isPerformance} material={mainMat}>
              <boxGeometry args={[w, baseHeight, d]} />
            </mesh>
            <mesh position={[-w * 0.35, posY * 0.8, d * 0.35]} material={accentMat}>
              <cylinderGeometry args={[w * 0.2, w * 0.2, baseHeight * 0.7, 16]} />
            </mesh>
            <mesh position={[w * 0.35, posY * 0.8, d * 0.35]} material={secondaryMat}>
              <cylinderGeometry args={[w * 0.2, w * 0.2, baseHeight * 0.7, 16]} />
            </mesh>
            <mesh position={[-w * 0.25, baseHeight + 1.2, -d * 0.25]} material={secondaryMat}>
              <cylinderGeometry args={[0.35, 0.45, 2.4, 12]} />
            </mesh>
            <mesh position={[-w * 0.25, baseHeight + 2.45, -d * 0.25]} material={neonMat}>
              <cylinderGeometry args={[0.3, 0.3, 0.1, 12]} />
            </mesh>
            {/* Tier 2+ Overhead Pipe Gantries */}
            {tier >= 2 && (
              <mesh position={[0, baseHeight * 0.85, 0]} rotation={[0, 0, Math.PI / 2]} material={accentMat}>
                <cylinderGeometry args={[0.18, 0.18, w * 1.1, 8]} />
              </mesh>
            )}
            {/* Tier 3+ Automated Cargo Dock Wing */}
            {tier >= 3 && (
              <mesh position={[w * 0.55, 2, 0]} material={secondaryMat}>
                <boxGeometry args={[w * 0.5, 4, d * 0.9]} />
              </mesh>
            )}
            {/* Tier 4+ High-Bay Assembly Crane */}
            {tier >= 4 && (
              <mesh position={[0, baseHeight + 1.2, 0]} material={accentMat}>
                <boxGeometry args={[w * 0.9, 0.4, 0.4]} />
              </mesh>
            )}
            {/* Tier 5+ Safety Strobe Floodlights */}
            {tier >= 5 && (
              <mesh position={[0, baseHeight + 2.5, 0]} material={neonMat}>
                <sphereGeometry args={[0.35, 8, 8]} />
              </mesh>
            )}
          </group>
        );

      // 14. CYBERNETIC COMMERCIAL ARCADE
      case 'cyber_arcade':
        return (
          <group>
            <mesh position={[0, posY, 0]} castShadow={shouldCastShadow} receiveShadow={!isPerformance} material={mainMat}>
              <boxGeometry args={[w, baseHeight, d]} />
            </mesh>
            <mesh position={[0, 1.8, d / 2 + 0.05]} material={windowMat}>
              <boxGeometry args={[w * 0.88, 2.4, 0.05]} />
            </mesh>
            <mesh position={[0, 3.2, d / 2 + 0.6]} material={neonMat}>
              <boxGeometry args={[w * 0.95, 0.2, 1.2]} />
            </mesh>
            <mesh position={[0, baseHeight - 0.8, d / 2 + 0.06]} material={accentMat}>
              <boxGeometry args={[w * 0.75, 1.2, 0.05]} />
            </mesh>
            {/* Tier 2+ Second-Floor Balcony Gallery */}
            {tier >= 2 && (
              <mesh position={[0, 4.2, d / 2 + 0.4]} material={secondaryMat}>
                <boxGeometry args={[w * 0.9, 0.3, 0.8]} />
              </mesh>
            )}
            {/* Tier 3+ Holographic Cyber Signboard */}
            {tier >= 3 && (
              <mesh position={[0, baseHeight + 1.2, 0]} material={neonMat}>
                <boxGeometry args={[w * 0.7, 1.8, 0.1]} />
              </mesh>
            )}
            {/* Tier 4+ Rooftop Glass Lounge Pavilion */}
            {tier >= 4 && (
              <mesh position={[0, baseHeight + 1.2, 0]} material={secondaryMat}>
                <boxGeometry args={[w * 0.7, 2.2, d * 0.7]} />
              </mesh>
            )}
            {/* Tier 5+ Radiant Neon Crown Beacons */}
            {tier >= 5 && (
              <mesh position={[0, baseHeight + 3.2, 0]} material={neonMat}>
                <sphereGeometry args={[0.4, 8, 8]} />
              </mesh>
            )}
          </group>
        );

      // 15. COLOURFUL MODULAR RESIDENTIAL TOWER
      case 'colourful_residential':
        return (
          <group>
            <mesh position={[0, posY, 0]} castShadow={shouldCastShadow} receiveShadow={!isPerformance} material={mainMat}>
              <boxGeometry args={[w * 0.85, baseHeight, d * 0.85]} />
            </mesh>
            {/* Alternating Vivid Cantilever Balconies */}
            {Array.from({ length: Math.min(6, Math.floor(baseHeight / 3)) }).map((_, bi) => {
              const y = 3 + bi * 3;
              const isEven = bi % 2 === 0;
              return (
                <mesh
                  key={`balc-${bi}`}
                  position={[isEven ? w * 0.42 : -w * 0.42, y, 0]}
                  material={isEven ? accentMat : secondaryMat}
                >
                  <boxGeometry args={[w * 0.4, 1.6, d * 0.9]} />
                </mesh>
              );
            })}
            {/* Tier 2+ Front Balconies */}
            {tier >= 2 && (
              <mesh position={[0, posY, d * 0.45]} material={accentMat}>
                <boxGeometry args={[w * 0.6, baseHeight * 0.8, 0.3]} />
              </mesh>
            )}
            {/* Tier 3+ Rooftop Garden Pergola */}
            {tier >= 3 && (
              <mesh position={[0, baseHeight + 1.2, 0]} material={secondaryMat}>
                <boxGeometry args={[w * 0.8, 1.8, d * 0.8]} />
              </mesh>
            )}
            {/* Tier 4+ Cantilever Sky-Pod */}
            {tier >= 4 && (
              <mesh position={[w * 0.5, baseHeight * 0.8, 0]} material={accentMat}>
                <boxGeometry args={[w * 0.5, 3, d * 0.5]} />
              </mesh>
            )}
            {/* Tier 5+ Solar Canopy Crown */}
            {tier >= 5 && (
              <mesh position={[0, baseHeight + 2.8, 0]} material={neonMat}>
                <cylinderGeometry args={[w * 0.5, w * 0.5, 0.2, 16]} />
              </mesh>
            )}
          </group>
        );

      // 16. STEPPED BIOPHILIC TERRACE RESIDENCE
      case 'terrace_green':
        return (
          <group>
            {[0, 1, 2, 3].map((step) => {
              const stepHeight = baseHeight / 4;
              const y = stepHeight * (step + 0.5);
              const scale = 1 - step * 0.18;
              return (
                <group key={`terr-${step}`} position={[0, y, 0]}>
                  <mesh castShadow={shouldCastShadow} receiveShadow={!isPerformance} material={mainMat}>
                    <boxGeometry args={[w * scale, stepHeight * 0.95, d * scale]} />
                  </mesh>
                  <mesh position={[0, stepHeight * 0.48, (d * scale) / 2 + 0.15]} material={accentMat}>
                    <boxGeometry args={[w * scale * 0.92, 0.3, 0.25]} />
                  </mesh>
                </group>
              );
            })}
            {/* Tier 2+ Vertical Garden Planters */}
            {tier >= 2 && (
              <mesh position={[w / 2 + 0.1, posY, 0]} material={secondaryMat}>
                <boxGeometry args={[0.25, baseHeight * 0.7, d * 0.8]} />
              </mesh>
            )}
            {/* Tier 3+ Rooftop Greenhouse Dome */}
            {tier >= 3 && (
              <mesh position={[0, baseHeight + 1.2, 0]} material={neonMat}>
                <sphereGeometry args={[w * 0.35, 12, 12, 0, Math.PI * 2, 0, Math.PI / 2]} />
              </mesh>
            )}
            {/* Tier 4+ Water Cascade Channel */}
            {tier >= 4 && (
              <mesh position={[0, posY, d / 2 + 0.2]} material={neonMat}>
                <boxGeometry args={[0.3, baseHeight * 0.85, 0.15]} />
              </mesh>
            )}
            {/* Tier 5+ Biophilic Solar Flower */}
            {tier >= 5 && (
              <mesh position={[0, baseHeight + 3, 0]} material={accentMat}>
                <cylinderGeometry args={[w * 0.4, 0.1, 1.2, 6]} />
              </mesh>
            )}
          </group>
        );

      // 17. SIGNATURE CIVIC LANDMARK
      case 'landmark':
        return (
          <group>
            <mesh position={[0, 8, 0]} material={mainMat}>
              <cylinderGeometry args={[w * 0.35, w * 0.6, 16, 24]} />
            </mesh>
            <mesh position={[0, 24, 0]} material={accentMat}>
              <cylinderGeometry args={[w * 0.8, w * 0.9, 2.6, 28]} />
            </mesh>
            <mesh position={[0, 36, 0]} material={secondaryMat}>
              <cylinderGeometry args={[0.06, w * 0.15, 16, 8]} />
            </mesh>
            <PulsingBeacon position={[0, 44.5, 0]} material={neonMat} radius={0.5} />
            {/* Tier 2+ Base Monument Plaza */}
            {tier >= 2 && (
              <mesh position={[0, 0.5, 0]} material={secondaryMat}>
                <cylinderGeometry args={[w * 1.3, w * 1.4, 1.0, 32]} />
              </mesh>
            )}
            {/* Tier 3+ Secondary Revolving Ring */}
            {tier >= 3 && (
              <mesh position={[0, 18, 0]} material={neonMat}>
                <cylinderGeometry args={[w * 0.65, w * 0.65, 1.2, 24]} />
              </mesh>
            )}
            {/* Tier 4+ Radiating Light Ribs */}
            {tier >= 4 && (
              <mesh position={[0, 30, 0]} material={accentMat}>
                <cylinderGeometry args={[w * 0.4, w * 0.4, 4, 16]} />
              </mesh>
            )}
            {/* Tier 5+ Celestial Halo Ring */}
            {tier >= 5 && (
              <mesh position={[0, 40, 0]} rotation={[Math.PI / 2, 0, 0]} material={neonMat}>
                <torusGeometry args={[w * 0.7, 0.15, 8, 32]} />
              </mesh>
            )}
          </group>
        );

      // 18. HOLOGRAPHIC ENTERTAINMENT DOME
      case 'holographic_entertainment':
        return (
          <group>
            <mesh position={[0, posY * 0.6, 0]} castShadow={shouldCastShadow} receiveShadow={!isPerformance} material={mainMat}>
              <sphereGeometry args={[w * 0.65, 24, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
            </mesh>
            <group position={[0, posY * 0.8, 0]}>
              <mesh rotation={[Math.PI / 2, 0, 0]} material={neonMat}>
                <ringGeometry args={[w * 0.75, w * 0.88, 32]} />
              </mesh>
            </group>
            {/* Tier 2+ Curved Video Walls */}
            {tier >= 2 && (
              <mesh position={[0, 2, d * 0.6]} material={accentMat}>
                <boxGeometry args={[w * 0.8, 3, 0.2]} />
              </mesh>
            )}
            {/* Tier 3+ Secondary Floating Holo Ring */}
            {tier >= 3 && (
              <mesh position={[0, posY * 1.1, 0]} rotation={[Math.PI / 3, 0, 0]} material={neonMat}>
                <torusGeometry args={[w * 0.9, 0.12, 6, 28]} />
              </mesh>
            )}
            {/* Tier 4+ Apex Holographic Projector */}
            {tier >= 4 && (
              <mesh position={[0, baseHeight * 0.75, 0]} material={secondaryMat}>
                <cylinderGeometry args={[w * 0.2, w * 0.3, 1.5, 16]} />
              </mesh>
            )}
            {/* Tier 5+ High-Intensity Laser Fan */}
            {tier >= 5 && (
              <mesh position={[0, baseHeight * 0.85, 0]} material={neonMat}>
                <sphereGeometry args={[0.5, 8, 8]} />
              </mesh>
            )}
          </group>
        );

      // 19. QUANTUM RESEARCH TOWER
      case 'quantum_research_tower':
        return (
          <group>
            <mesh position={[0, posY, 0]} castShadow={shouldCastShadow} receiveShadow={!isPerformance} material={secondaryMat}>
              <cylinderGeometry args={[w * 0.5, w * 0.55, baseHeight, 6]} />
            </mesh>
            <mesh position={[0, posY, 0]} material={neonMat}>
              <cylinderGeometry args={[w * 0.28, w * 0.28, baseHeight * 1.05, 16]} />
            </mesh>
            {/* Tier 2+ Hexagonal Outriggers */}
            {tier >= 2 && (
              <mesh position={[w * 0.6, posY * 0.6, 0]} material={mainMat}>
                <boxGeometry args={[w * 0.4, baseHeight * 0.5, d * 0.5]} />
              </mesh>
            )}
            {/* Tier 3+ Magnetic Particle Rings */}
            {tier >= 3 && (
              <mesh position={[0, posY * 0.85, 0]} rotation={[Math.PI / 2, 0, 0]} material={accentMat}>
                <torusGeometry args={[w * 0.65, 0.15, 8, 24]} />
              </mesh>
            )}
            {/* Tier 4+ Crown Laser Sensor Array */}
            {tier >= 4 && (
              <mesh position={[0, baseHeight + 1.5, 0]} material={secondaryMat}>
                <cylinderGeometry args={[w * 0.4, w * 0.4, 2, 12]} />
              </mesh>
            )}
            {/* Tier 5+ Quantum Singularity Core */}
            {tier >= 5 && (
              <mesh position={[0, baseHeight + 4, 0]} material={neonMat}>
                <sphereGeometry args={[0.6, 12, 12]} />
              </mesh>
            )}
          </group>
        );

      // 20. BIOMIMETIC ECO DOME
      case 'biomimetic_dome':
        return (
          <group>
            <mesh position={[0, posY * 0.5, 0]} material={mainMat}>
              <sphereGeometry args={[w * 0.6, 24, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
            </mesh>
            <mesh position={[0, 0.4, 0]} rotation={[-Math.PI / 2, 0, 0]} material={neonMat}>
              <ringGeometry args={[w * 0.58, w * 0.64, 32]} />
            </mesh>
            {/* Tier 2+ Internal Bioluminescent Flora Core */}
            {tier >= 2 && (
              <mesh position={[0, posY * 0.35, 0]} material={accentMat}>
                <sphereGeometry args={[w * 0.35, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
              </mesh>
            )}
            {/* Tier 3+ Surrounding Garden Trellises */}
            {tier >= 3 && (
              <mesh position={[0, 1.2, 0]} material={secondaryMat}>
                <cylinderGeometry args={[w * 0.75, w * 0.8, 1.5, 16]} />
              </mesh>
            )}
            {/* Tier 4+ Atmospheric Aeration Spire */}
            {tier >= 4 && (
              <mesh position={[0, baseHeight * 0.6, 0]} material={secondaryMat}>
                <cylinderGeometry args={[0.15, 0.3, 3.5, 8]} />
              </mesh>
            )}
            {/* Tier 5+ Solar Collection Petals */}
            {tier >= 5 && (
              <mesh position={[0, baseHeight * 0.75, 0]} material={neonMat}>
                <cylinderGeometry args={[w * 0.4, 0.1, 0.8, 6]} />
              </mesh>
            )}
          </group>
        );

      // 21. SUSPENDED SKY RESIDENCE
      case 'suspended_sky_residence':
        return (
          <group>
            <mesh position={[0, posY, 0]} castShadow={shouldCastShadow} receiveShadow={!isPerformance} material={mainMat}>
              <boxGeometry args={[w * 0.4, baseHeight, d * 0.4]} />
            </mesh>
            <mesh position={[w * 0.4, posY * 0.6, 0]} material={accentMat}>
              <boxGeometry args={[w * 0.6, 3.2, d * 0.8]} />
            </mesh>
            <mesh position={[-w * 0.4, posY * 1.2, 0]} material={secondaryMat}>
              <boxGeometry args={[w * 0.6, 3.2, d * 0.8]} />
            </mesh>
            {/* Tier 2+ Third Cantilever Sky-Pod */}
            {tier >= 2 && (
              <mesh position={[0, posY * 0.9, d * 0.4]} material={accentMat}>
                <boxGeometry args={[w * 0.8, 3, d * 0.5]} />
              </mesh>
            )}
            {/* Tier 3+ Private Sky-Deck Helipad */}
            {tier >= 3 && (
              <mesh position={[w * 0.6, posY * 0.6 + 1.8, 0]} material={neonMat}>
                <cylinderGeometry args={[w * 0.3, w * 0.3, 0.2, 16]} />
              </mesh>
            )}
            {/* Tier 4+ Rooftop Infinity Lounge */}
            {tier >= 4 && (
              <mesh position={[0, baseHeight + 1.2, 0]} material={secondaryMat}>
                <boxGeometry args={[w * 0.7, 2, d * 0.7]} />
              </mesh>
            )}
            {/* Tier 5+ Skyward Beacon Antenna */}
            {tier >= 5 && (
              <mesh position={[0, baseHeight + 4, 0]} material={neonMat}>
                <cylinderGeometry args={[0.06, 0.2, 6, 8]} />
              </mesh>
            )}
          </group>
        );

      // 22. SPACEPORT TRANSIT TERMINAL
      case 'spaceport_terminal':
        return (
          <group>
            <mesh position={[0, posY * 0.5, 0]} castShadow={shouldCastShadow} receiveShadow={!isPerformance} material={mainMat}>
              <boxGeometry args={[w * 1.3, baseHeight * 0.6, d * 1.2]} />
            </mesh>
            <mesh position={[w * 0.45, baseHeight * 0.9, -d * 0.35]} material={secondaryMat}>
              <cylinderGeometry args={[0.5, 0.8, baseHeight * 0.8, 12]} />
            </mesh>
            <mesh position={[w * 0.45, baseHeight * 1.35, -d * 0.35]} material={accentMat}>
              <sphereGeometry args={[0.9, 12, 12]} />
            </mesh>
            <mesh position={[0, 0.12, 0]} rotation={[-Math.PI / 2, 0, 0]} material={neonMat}>
              <planeGeometry args={[0.3, d * 1.3]} />
            </mesh>
            {/* Tier 2+ Boarding Gangway Concourse */}
            {tier >= 2 && (
              <mesh position={[-w * 0.5, posY * 0.4, 0]} material={secondaryMat}>
                <boxGeometry args={[w * 0.6, 2.5, d * 0.8]} />
              </mesh>
            )}
            {/* Tier 3+ Rotating Radar Dome */}
            {tier >= 3 && (
              <mesh position={[w * 0.45, baseHeight * 1.6, -d * 0.35]} material={neonMat}>
                <cylinderGeometry args={[0.6, 0.6, 0.2, 16]} />
              </mesh>
            )}
            {/* Tier 4+ Elevated Maglev Sky-Track */}
            {tier >= 4 && (
              <mesh position={[0, baseHeight * 0.7, 0]} material={neonMat}>
                <boxGeometry args={[w * 1.6, 0.3, 0.8]} />
              </mesh>
            )}
            {/* Tier 5+ Aerodrome Guidance Beacon */}
            {tier >= 5 && (
              <mesh position={[0, baseHeight + 3, 0]} material={accentMat}>
                <sphereGeometry args={[0.45, 8, 8]} />
              </mesh>
            )}
          </group>
        );

      // 23. SUPERCONDUCTING POWER FACILITY
      case 'superconducting_facility':
        return (
          <group>
            <mesh position={[0, posY * 0.6, 0]} castShadow={shouldCastShadow} receiveShadow={!isPerformance} material={mainMat}>
              <boxGeometry args={[w, baseHeight * 0.7, d]} />
            </mesh>
            {[
              [-w * 0.3, -d * 0.3],
              [w * 0.3, -d * 0.3],
              [-w * 0.3, d * 0.3],
              [w * 0.3, d * 0.3],
            ].map(([cx, cz], ci) => (
              <mesh key={`coil-${ci}`} position={[cx, baseHeight * 0.75, cz]} material={neonMat}>
                <cylinderGeometry args={[0.5, 0.5, 2.5, 16]} />
              </mesh>
            ))}
            {/* Tier 2+ Magnetic Shielding Walls */}
            {tier >= 2 && (
              <mesh position={[0, posY * 0.6, 0]} material={secondaryMat}>
                <boxGeometry args={[w * 1.1, baseHeight * 0.5, d * 1.1]} />
              </mesh>
            )}
            {/* Tier 3+ High-Voltage Busbars */}
            {tier >= 3 && (
              <mesh position={[0, baseHeight * 0.9, 0]} material={accentMat}>
                <boxGeometry args={[w * 0.8, 0.25, d * 0.8]} />
              </mesh>
            )}
            {/* Tier 4+ Energy Storage Capacitor Bank */}
            {tier >= 4 && (
              <mesh position={[0, baseHeight + 1.2, 0]} material={secondaryMat}>
                <cylinderGeometry args={[w * 0.4, w * 0.4, 2, 16]} />
              </mesh>
            )}
            {/* Tier 5+ Plasma Arc Discharge Antenna */}
            {tier >= 5 && (
              <mesh position={[0, baseHeight + 3.5, 0]} material={neonMat}>
                <cylinderGeometry args={[0.06, 0.2, 5, 8]} />
              </mesh>
            )}
          </group>
        );

      // 24. CYBER FINANCIAL BLADE TOWER
      case 'cyber_financial_tower':
        return (
          <group>
            <mesh position={[0, posY, 0]} castShadow={shouldCastShadow} receiveShadow={!isPerformance} material={mainMat}>
              <boxGeometry args={[w * 0.4, baseHeight, d * 1.2]} />
            </mesh>
            <mesh position={[w * 0.22, posY, 0]} material={neonMat}>
              <boxGeometry args={[0.05, baseHeight * 0.95, 0.2]} />
            </mesh>
            {/* Tier 2+ Trading Floor Podium */}
            {tier >= 2 && (
              <mesh position={[0, 2, 0]} material={secondaryMat}>
                <boxGeometry args={[w * 0.9, 4, d * 1.3]} />
              </mesh>
            )}
            {/* Tier 3+ Slanted Knife Prow */}
            {tier >= 3 && (
              <mesh position={[0, baseHeight - 1, 0]} material={accentMat}>
                <boxGeometry args={[w * 0.45, 3, d * 0.8]} />
              </mesh>
            )}
            {/* Tier 4+ Cantilever Executive Suites */}
            {tier >= 4 && (
              <mesh position={[-w * 0.35, posY * 0.85, 0]} material={secondaryMat}>
                <boxGeometry args={[w * 0.5, 3.5, d * 0.6]} />
              </mesh>
            )}
            {/* Tier 5+ Blade Apex Beacon */}
            {tier >= 5 && (
              <mesh position={[0, baseHeight + 3, 0]} material={neonMat}>
                <cylinderGeometry args={[0.04, 0.15, 6, 8]} />
              </mesh>
            )}
          </group>
        );

      // 25. LUXURY ARCOLOGY
      case 'luxury_arcology':
        return (
          <group>
            <mesh position={[0, posY, 0]} castShadow={shouldCastShadow} receiveShadow={!isPerformance} material={mainMat}>
              <cylinderGeometry args={[w * 0.5, w * 0.6, baseHeight, 24, 1, false, 0, Math.PI * 1.2]} />
            </mesh>
            <mesh position={[0, baseHeight, 0]} material={neonMat}>
              <cylinderGeometry args={[w * 0.55, w * 0.55, 0.4, 24, 1, false, 0, Math.PI * 1.2]} />
            </mesh>
            {/* Tier 2+ Interior Terraced Balconies */}
            {tier >= 2 && (
              <mesh position={[0, posY * 0.7, 0]} material={secondaryMat}>
                <cylinderGeometry args={[w * 0.4, w * 0.45, baseHeight * 0.5, 16, 1, false, 0, Math.PI * 1.2]} />
              </mesh>
            )}
            {/* Tier 3+ Atrium Water Garden */}
            {tier >= 3 && (
              <mesh position={[0, 1.5, 0]} material={accentMat}>
                <cylinderGeometry args={[w * 0.65, w * 0.65, 1.2, 20]} />
              </mesh>
            )}
            {/* Tier 4+ Rooftop Infinity Deck Wings */}
            {tier >= 4 && (
              <mesh position={[0, baseHeight + 0.8, 0]} material={secondaryMat}>
                <cylinderGeometry args={[w * 0.65, w * 0.5, 1.5, 20, 1, false, 0, Math.PI * 1.2]} />
              </mesh>
            )}
            {/* Tier 5+ Celestial Halo Arch */}
            {tier >= 5 && (
              <mesh position={[0, baseHeight + 3.5, 0]} rotation={[Math.PI / 2, 0, 0]} material={neonMat}>
                <torusGeometry args={[w * 0.7, 0.15, 8, 32]} />
              </mesh>
            )}
          </group>
        );

      // 26. ROBOTIC FOUNDRY & ASSEMBLY WORKS
      case 'robotic_foundry':
        return (
          <group>
            <mesh position={[0, posY, 0]} castShadow={shouldCastShadow} receiveShadow={!isPerformance} material={mainMat}>
              <boxGeometry args={[w, baseHeight, d]} />
            </mesh>
            <mesh position={[0, baseHeight + 1.2, 0]} rotation={[0, 0, Math.PI / 4]} material={accentMat}>
              <boxGeometry args={[w * 0.8, 0.4, 0.4]} />
            </mesh>
            {/* Tier 2+ Heavy Gantry Crane Rails */}
            {tier >= 2 && (
              <mesh position={[0, baseHeight * 0.85, 0]} material={secondaryMat}>
                <boxGeometry args={[w * 1.1, 0.5, d * 0.8]} />
              </mesh>
            )}
            {/* Tier 3+ Molten Slag Conduits */}
            {tier >= 3 && (
              <mesh position={[w * 0.45, posY, 0]} material={neonMat}>
                <cylinderGeometry args={[0.2, 0.2, baseHeight * 0.8, 8]} />
              </mesh>
            )}
            {/* Tier 4+ High-Bay Loading Bay Wing */}
            {tier >= 4 && (
              <mesh position={[-w * 0.55, 2, 0]} material={secondaryMat}>
                <boxGeometry args={[w * 0.5, 4, d * 0.85]} />
              </mesh>
            )}
            {/* Tier 5+ Robotic Assembly Beacon */}
            {tier >= 5 && (
              <mesh position={[0, baseHeight + 2.8, 0]} material={neonMat}>
                <sphereGeometry args={[0.4, 8, 8]} />
              </mesh>
            )}
          </group>
        );

      // 27. GRAND CULTURAL MUSEUM
      case 'grand_museum':
        return (
          <group>
            <mesh position={[0, posY * 0.6, 0]} castShadow={shouldCastShadow} receiveShadow={!isPerformance} material={mainMat}>
              <boxGeometry args={[w * 1.1, baseHeight * 0.8, d * 1.1]} />
            </mesh>
            <mesh position={[w * 0.2, baseHeight * 0.7, 0]} rotation={[0.2, 0.3, 0]} material={secondaryMat}>
              <boxGeometry args={[w * 0.5, baseHeight * 0.6, d * 0.5]} />
            </mesh>
            {/* Tier 2+ Outdoor Sculpture Court */}
            {tier >= 2 && (
              <mesh position={[-w * 0.3, 1, 0]} material={accentMat}>
                <cylinderGeometry args={[0.8, 0.8, 2, 8]} />
              </mesh>
            )}
            {/* Tier 3+ Glass Light Well Atrium */}
            {tier >= 3 && (
              <mesh position={[0, baseHeight * 0.85, 0]} material={neonMat}>
                <cylinderGeometry args={[w * 0.4, w * 0.4, 1.5, 16]} />
              </mesh>
            )}
            {/* Tier 4+ Cantilever Gallery Wing */}
            {tier >= 4 && (
              <mesh position={[-w * 0.55, posY * 0.7, 0]} material={secondaryMat}>
                <boxGeometry args={[w * 0.5, 2.5, d * 0.8]} />
              </mesh>
            )}
            {/* Tier 5+ Luminous Beacon Finial */}
            {tier >= 5 && (
              <mesh position={[0, baseHeight + 2, 0]} material={neonMat}>
                <sphereGeometry args={[0.45, 10, 10]} />
              </mesh>
            )}
          </group>
        );

      // 28. FUTURISTIC HOSPITAL MEGACOMPLEX
      case 'futuristic_hospital':
        return (
          <group>
            <mesh position={[0, posY, 0]} castShadow={shouldCastShadow} receiveShadow={!isPerformance} material={mainMat}>
              <boxGeometry args={[w, baseHeight, d * 0.55]} />
            </mesh>
            <mesh position={[0, posY, 0]} castShadow={shouldCastShadow} receiveShadow={!isPerformance} material={mainMat}>
              <boxGeometry args={[w * 0.55, baseHeight, d]} />
            </mesh>
            <mesh position={[0, baseHeight + 0.4, 0]} material={secondaryMat}>
              <cylinderGeometry args={[w * 0.45, w * 0.45, 0.3, 16]} />
            </mesh>
            <PulsingBeacon position={[0, baseHeight + 1.2, 0]} material={neonMat} radius={0.4} />
            {/* Tier 2+ Bio-Containment Pods */}
            {tier >= 2 && (
              <mesh position={[w * 0.45, posY * 0.8, 0]} material={accentMat}>
                <boxGeometry args={[w * 0.4, 3, d * 0.4]} />
              </mesh>
            )}
            {/* Tier 3+ Emergency Drone Launchpad */}
            {tier >= 3 && (
              <mesh position={[-w * 0.45, posY * 0.8, 0]} material={neonMat}>
                <cylinderGeometry args={[w * 0.25, w * 0.25, 0.2, 12]} />
              </mesh>
            )}
            {/* Tier 4+ Trauma Center Wing */}
            {tier >= 4 && (
              <mesh position={[0, 2.5, d * 0.5]} material={secondaryMat}>
                <boxGeometry args={[w * 0.9, 5, d * 0.4]} />
              </mesh>
            )}
            {/* Tier 5+ Medical Beacon Antenna */}
            {tier >= 5 && (
              <mesh position={[0, baseHeight + 3.5, 0]} material={neonMat}>
                <cylinderGeometry args={[0.06, 0.2, 5, 8]} />
              </mesh>
            )}
          </group>
        );

      // 29. UNIVERSITY & SCIENCE ACADEMY
      case 'university_academy':
        return (
          <group>
            <mesh position={[0, posY * 0.7, 0]} castShadow={shouldCastShadow} receiveShadow={!isPerformance} material={mainMat}>
              <cylinderGeometry args={[w * 0.5, w * 0.55, baseHeight * 0.8, 20]} />
            </mesh>
            <mesh position={[0, baseHeight * 0.6, 0]} material={secondaryMat}>
              <boxGeometry args={[w * 1.2, 1.4, d * 0.4]} />
            </mesh>
            {/* Tier 2+ Holographic Lecture Amphitheater */}
            {tier >= 2 && (
              <mesh position={[0, 2, d * 0.45]} material={accentMat}>
                <boxGeometry args={[w * 0.8, 3.5, d * 0.4]} />
              </mesh>
            )}
            {/* Tier 3+ Campus Clock-Tower Beacon */}
            {tier >= 3 && (
              <mesh position={[w * 0.4, baseHeight * 0.85, 0]} material={secondaryMat}>
                <boxGeometry args={[w * 0.35, baseHeight * 0.5, d * 0.35]} />
              </mesh>
            )}
            {/* Tier 4+ Covered Skyway Links */}
            {tier >= 4 && (
              <mesh position={[-w * 0.4, baseHeight * 0.5, 0]} material={neonMat}>
                <boxGeometry args={[w * 0.4, 1.2, d * 0.8]} />
              </mesh>
            )}
            {/* Tier 5+ Academic Beacon Spire */}
            {tier >= 5 && (
              <mesh position={[w * 0.4, baseHeight * 1.15, 0]} material={neonMat}>
                <cylinderGeometry args={[0.05, 0.15, 4, 8]} />
              </mesh>
            )}
          </group>
        );

      // 30. AUTOMATED LOGISTICS MEGAHUB
      case 'logistics_megahub':
        return (
          <group>
            <mesh position={[0, posY, 0]} castShadow={shouldCastShadow} receiveShadow={!isPerformance} material={mainMat}>
              <boxGeometry args={[w, baseHeight, d]} />
            </mesh>
            <mesh position={[0, baseHeight + 0.8, 0]} material={secondaryMat}>
              <boxGeometry args={[w * 1.05, 0.3, d * 0.6]} />
            </mesh>
            {/* Tier 2+ Container Racks */}
            {tier >= 2 && (
              <mesh position={[w * 0.4, posY, 0]} material={accentMat}>
                <boxGeometry args={[0.3, baseHeight * 0.8, d * 0.7]} />
              </mesh>
            )}
            {/* Tier 3+ Freight Drone Helipad */}
            {tier >= 3 && (
              <mesh position={[0, baseHeight + 1.2, 0]} material={neonMat}>
                <cylinderGeometry args={[w * 0.3, w * 0.3, 0.2, 16]} />
              </mesh>
            )}
            {/* Tier 4+ High-Bay Sorter Wing */}
            {tier >= 4 && (
              <mesh position={[-w * 0.45, posY, 0]} material={secondaryMat}>
                <boxGeometry args={[w * 0.3, baseHeight * 0.9, d * 0.8]} />
              </mesh>
            )}
            {/* Tier 5+ Logistics Beacon Mast */}
            {tier >= 5 && (
              <mesh position={[0, baseHeight + 3, 0]} material={accentMat}>
                <cylinderGeometry args={[0.06, 0.2, 5, 8]} />
              </mesh>
            )}
          </group>
        );

      // 31. CURVILINEAR RETAIL SHOWROOM PAVILION
      case 'retail_pavilion':
        return (
          <group>
            <mesh position={[0, posY * 0.6, 0]} castShadow={shouldCastShadow} receiveShadow={!isPerformance} material={mainMat}>
              <cylinderGeometry args={[w * 0.55, w * 0.5, baseHeight * 0.75, 24]} />
            </mesh>
            <mesh position={[0, baseHeight * 0.75, 0]} material={neonMat}>
              <cylinderGeometry args={[w * 0.6, w * 0.6, 0.3, 24]} />
            </mesh>
            {/* Tier 2+ Glass Entrance Canopy */}
            {tier >= 2 && (
              <mesh position={[0, 2.5, d * 0.5]} material={accentMat}>
                <boxGeometry args={[w * 0.7, 0.2, 1.2]} />
              </mesh>
            )}
            {/* Tier 3+ Mezzanine Dining Terrace */}
            {tier >= 3 && (
              <mesh position={[0, baseHeight * 0.5, 0]} material={secondaryMat}>
                <cylinderGeometry args={[w * 0.7, w * 0.7, 0.4, 24]} />
              </mesh>
            )}
            {/* Tier 4+ Illuminated Brand Pylons */}
            {tier >= 4 && (
              <mesh position={[w * 0.55, posY * 0.8, 0]} material={neonMat}>
                <boxGeometry args={[0.3, baseHeight * 0.8, 0.3]} />
              </mesh>
            )}
            {/* Tier 5+ Rooftop Sculpture Dome */}
            {tier >= 5 && (
              <mesh position={[0, baseHeight * 0.95, 0]} material={accentMat}>
                <sphereGeometry args={[w * 0.3, 12, 12]} />
              </mesh>
            )}
          </group>
        );

      // 32. MARINE OCEANOGRAPHIC RESEARCH STATION
      case 'marine_research_station':
        return (
          <group>
            {[
              [-w * 0.4, -d * 0.4],
              [w * 0.4, -d * 0.4],
              [-w * 0.4, d * 0.4],
              [w * 0.4, d * 0.4],
            ].map(([sx, sz], si) => (
              <mesh key={`stilt-${si}`} position={[sx, 1.5, sz]} material={secondaryMat}>
                <cylinderGeometry args={[0.2, 0.2, 3, 8]} />
              </mesh>
            ))}
            <mesh position={[0, posY + 1.5, 0]} castShadow={shouldCastShadow} receiveShadow={!isPerformance} material={mainMat}>
              <boxGeometry args={[w, baseHeight * 0.8, d]} />
            </mesh>
            {/* Tier 2+ Submersible Docking Crane */}
            {tier >= 2 && (
              <mesh position={[w * 0.4, baseHeight * 0.9, 0]} material={accentMat}>
                <boxGeometry args={[0.3, 2.5, d * 0.5]} />
              </mesh>
            )}
            {/* Tier 3+ Rooftop Solar Sails */}
            {tier >= 3 && (
              <mesh position={[0, baseHeight + 2, 0]} rotation={[-0.2, 0, 0]} material={secondaryMat}>
                <boxGeometry args={[w * 0.9, 0.2, d * 0.8]} />
              </mesh>
            )}
            {/* Tier 4+ Hydrofoil Launch Ramp */}
            {tier >= 4 && (
              <mesh position={[0, 0.8, d * 0.6]} rotation={[0.3, 0, 0]} material={neonMat}>
                <planeGeometry args={[w * 0.6, 3]} />
              </mesh>
            )}
            {/* Tier 5+ Marine Sonar Beacon */}
            {tier >= 5 && (
              <mesh position={[0, baseHeight + 3.2, 0]} material={neonMat}>
                <sphereGeometry args={[0.4, 8, 8]} />
              </mesh>
            )}
          </group>
        );

      // 33. HYDROPONIC VERTICAL FARM TOWER
      case 'hydroponic_vertical_farm':
        return (
          <group>
            <mesh position={[0, posY, 0]} castShadow={shouldCastShadow} receiveShadow={!isPerformance} material={mainMat}>
              <cylinderGeometry args={[w * 0.45, w * 0.45, baseHeight, 20]} />
            </mesh>
            {Array.from({ length: Math.min(5, Math.floor(baseHeight / 3.5)) }).map((_, gi) => (
              <mesh key={`grow-${gi}`} position={[0, 3 + gi * (baseHeight / 5), 0]} material={neonMat}>
                <cylinderGeometry args={[w * 0.47, w * 0.47, 0.2, 20]} />
              </mesh>
            ))}
            {/* Tier 2+ Nutrient Supply Columns */}
            {tier >= 2 && (
              <mesh position={[w * 0.48, posY, 0]} material={accentMat}>
                <cylinderGeometry args={[0.15, 0.15, baseHeight * 0.9, 8]} />
              </mesh>
            )}
            {/* Tier 3+ Distribution Center Base */}
            {tier >= 3 && (
              <mesh position={[0, 2, 0]} material={secondaryMat}>
                <boxGeometry args={[w * 1.2, 4, d * 1.2]} />
              </mesh>
            )}
            {/* Tier 4+ Solar Harvesting Canopy */}
            {tier >= 4 && (
              <mesh position={[0, baseHeight + 1.2, 0]} material={secondaryMat}>
                <cylinderGeometry args={[w * 0.6, w * 0.4, 1.2, 16]} />
              </mesh>
            )}
            {/* Tier 5+ Biosphere Glow Core */}
            {tier >= 5 && (
              <mesh position={[0, baseHeight + 2.8, 0]} material={neonMat}>
                <sphereGeometry args={[0.5, 12, 12]} />
              </mesh>
            )}
          </group>
        );

      // 34. SOLAR COLLECTOR SPIRE
      case 'solar_collector_spire':
        return (
          <group>
            <mesh position={[0, posY, 0]} castShadow={shouldCastShadow} receiveShadow={!isPerformance} material={mainMat}>
              <cylinderGeometry args={[w * 0.2, w * 0.35, baseHeight, 12]} />
            </mesh>
            <mesh position={[0, baseHeight + 1.2, 0]} rotation={[-0.3, 0, 0]} material={accentMat}>
              <cylinderGeometry args={[w * 0.75, w * 0.4, 0.5, 6]} />
            </mesh>
            {/* Tier 2+ Secondary Hexagonal Petal Ring */}
            {tier >= 2 && (
              <mesh position={[0, baseHeight - 2, 0]} rotation={[0.3, 0, 0]} material={secondaryMat}>
                <cylinderGeometry args={[w * 0.6, w * 0.3, 0.4, 6]} />
              </mesh>
            )}
            {/* Tier 3+ Energy Accumulator Conduit */}
            {tier >= 3 && (
              <mesh position={[0, posY, 0]} material={neonMat}>
                <cylinderGeometry args={[0.08, 0.08, baseHeight * 0.9, 8]} />
              </mesh>
            )}
            {/* Tier 4+ Thermal Radiator Fins */}
            {tier >= 4 && (
              <mesh position={[0, posY * 0.5, 0]} material={secondaryMat}>
                <boxGeometry args={[w * 0.8, 3, 0.2]} />
              </mesh>
            )}
            {/* Tier 5+ Photovoltaic Beacon Corona */}
            {tier >= 5 && (
              <mesh position={[0, baseHeight + 2.5, 0]} material={neonMat}>
                <sphereGeometry args={[0.5, 10, 10]} />
              </mesh>
            )}
          </group>
        );

      // 35. MONUMENTAL MEGASTRUCTURE ARCH
      case 'monumental_megastructure':
      default:
        return (
          <group>
            <mesh position={[-w * 0.38, posY, 0]} castShadow={shouldCastShadow} receiveShadow={!isPerformance} material={secondaryMat}>
              <boxGeometry args={[w * 0.25, baseHeight, d * 0.85]} />
            </mesh>
            <mesh position={[w * 0.38, posY, 0]} castShadow={shouldCastShadow} receiveShadow={!isPerformance} material={secondaryMat}>
              <boxGeometry args={[w * 0.25, baseHeight, d * 0.85]} />
            </mesh>
            <mesh position={[0, baseHeight - 1, 0]} castShadow={shouldCastShadow} receiveShadow={!isPerformance} material={mainMat}>
              <boxGeometry args={[w * 1.05, 2.8, d * 0.9]} />
            </mesh>
            <mesh position={[0, baseHeight - 2.5, 0]} material={neonMat}>
              <boxGeometry args={[w * 0.65, 0.15, d * 0.6]} />
            </mesh>
            {/* Tier 2+ Mid-Level Transit Flyover Link */}
            {tier >= 2 && (
              <mesh position={[0, posY * 0.6, 0]} material={accentMat}>
                <boxGeometry args={[w * 0.75, 1.2, d * 0.5]} />
              </mesh>
            )}
            {/* Tier 3+ Outer Arch Buttresses */}
            {tier >= 3 && (
              <group>
                <mesh position={[-w * 0.52, posY * 0.5, 0]} material={secondaryMat}>
                  <boxGeometry args={[w * 0.15, baseHeight * 0.7, d * 0.6]} />
                </mesh>
                <mesh position={[w * 0.52, posY * 0.5, 0]} material={secondaryMat}>
                  <boxGeometry args={[w * 0.15, baseHeight * 0.7, d * 0.6]} />
                </mesh>
              </group>
            )}
            {/* Tier 4+ Crown Observation Lounge */}
            {tier >= 4 && (
              <mesh position={[0, baseHeight + 1.2, 0]} material={mainMat}>
                <boxGeometry args={[w * 0.8, 2.2, d * 0.7]} />
              </mesh>
            )}
            {/* Tier 5+ Skyward Civic Beacon Array */}
            {tier >= 5 && (
              <mesh position={[0, baseHeight + 3.2, 0]} material={neonMat}>
                <sphereGeometry args={[0.6, 12, 12]} />
              </mesh>
            )}
          </group>
        );
    }
  };

  return (
    <group
      position={[building.position[0], 0, building.position[2]]}
      rotation={[0, building.rotation || 0, 0]}
    >
      {/* 1. FAST SINGLE-MESH HIT PROXY (Eliminates recursive pointer raycast lag across 2000+ geometric meshes) */}
      <mesh
        position={[0, posY, 0]}
        onClick={handleClick}
        onDoubleClick={handleDoubleClick}
      >
        <boxGeometry args={[w * 1.05, baseHeight, d * 1.05]} />
        <meshBasicMaterial visible={false} />
      </mesh>

      {/* SELECTION HOLOGRAPHIC RETICLE */}
      {isSelected && <BuildingSelectionReticle width={w} depth={d} height={baseHeight} />}

      {/* GROUND ILLUMINATED ENTRANCE PLAZA */}
      <mesh position={[0, 0.08, d / 2 + 0.5]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[w * 0.65, 1.0]} />
        <meshBasicMaterial color={accentColor} transparent opacity={isNight ? 0.8 : 0.4} />
      </mesh>
      {/* Double-Height Glowing Lobby Portal */}
      <mesh position={[0, 1.2, d / 2 + 0.05]}>
        <boxGeometry args={[w * 0.55, 2.2, 0.1]} />
        <meshBasicMaterial color={windowColor} toneMapped={false} />
      </mesh>

      {/* CONSTRUCTION UPGRADE TRANSFORMATION EFFECT */}
      {building.transforming && <BuildingTransformEffect width={w} height={baseHeight} depth={d} />}

      {/* SPECIFIC 3D ARCHITECTURAL MODEL (1 of 35) WITH TIER EVOLUTION */}
      {renderArchitecturalDesign()}

      {/* TIER 6, 7, 8: ARCHITECTURAL EXPANSION SUPERSTRUCTURES */}
      {!isPerformance && tier >= 6 && (
        <group position={[0, baseHeight * 0.88, 0]}>
          <mesh position={[w * 0.8, 0, 0]} material={mainMat}>
            <boxGeometry args={[w * 0.85, 1.8, d * 0.7]} />
          </mesh>
          <mesh position={[-w * 0.8, 0, 0]} material={mainMat}>
            <boxGeometry args={[w * 0.85, 1.8, d * 0.7]} />
          </mesh>
          <mesh position={[0, -0.9, 0]} material={neonMat}>
            <boxGeometry args={[w * 2.4, 0.2, d * 0.5]} />
          </mesh>
        </group>
      )}

      {!isPerformance && tier >= 7 && (
        <group position={[0, baseHeight + 5, 0]}>
          <mesh position={[0, 2, 0]} material={secondaryMat}>
            <cylinderGeometry args={[w * 0.75, w * 0.65, 2.6, 16]} />
          </mesh>
          <KineticTorusRing radius={w * 1.05} tube={0.16} posY={2} color={accentColor} rotationAxis={[Math.PI / 3, 0, 0]} />
        </group>
      )}

      {!isPerformance && tier >= 8 && (
        <group position={[0, baseHeight + 12, 0]}>
          <mesh position={[0, 8, 0]} material={secondaryMat}>
            <cylinderGeometry args={[0.08, 0.45, 16, 8]} />
          </mesh>
          <mesh position={[0, 16, 0]} rotation={[-Math.PI / 2, 0, 0]} material={neonMat}>
            <ringGeometry args={[w * 0.8, w * 1.5, 32]} />
          </mesh>
        </group>
      )}

      {/* Holographic Cyber Billboard Banner */}
      {building.hasHoloBanner && tier >= 3 && (
        <mesh position={[0, posY * 0.9, d / 2 + 0.38]}>
          <planeGeometry args={[w * 0.8, 3.0]} />
          <meshBasicMaterial color={accentColor} transparent opacity={0.85} side={THREE.DoubleSide} toneMapped={false} />
        </mesh>
      )}

      {/* ACTIVE FUNCTIONAL INDICATORS (Living Megacity 9.0) */}
      {!isPerformance && (building.type === 'power_plant' || building.style === 'superconducting_facility' || building.style === 'robotic_foundry') && (
        <group position={[0, Math.min(10, baseHeight * 0.6), 0]}>
          <RotatingPlasmaCore radius={Math.max(w, d) * 0.52} color="#00e676" />
        </group>
      )}

      {!isPerformance && (building.type === 'research_facility' || building.style === 'quantum_research_tower') && (
        <KineticTorusRing radius={w * 0.42} tube={0.08} posY={baseHeight + 1.8} color="#00f0ff" />
      )}

      {(building.type === 'commercial_block' || building.style === 'retail_pavilion') && (
        <mesh position={[0, Math.min(6, baseHeight * 0.35), d / 2 + 0.22]}>
          <planeGeometry args={[w * 0.72, 1.8]} />
          <meshBasicMaterial color="#ec4899" transparent opacity={0.88} toneMapped={false} side={THREE.DoubleSide} />
        </mesh>
      )}
    </group>
  );
};

export const BuildingMesh = React.memo(BuildingMeshComponent, (prev, next) => {
  return (
    prev.building.id === next.building.id &&
    prev.building.level === next.building.level &&
    prev.building.height === next.building.height &&
    prev.building.status === next.building.status &&
    prev.building.occupancy === next.building.occupancy &&
    prev.building.transforming === next.building.transforming &&
    prev.isSelected === next.isSelected &&
    prev.lightingMode === next.lightingMode &&
    prev.graphicsPreset === next.graphicsPreset
  );
});
