import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useCityStore } from '../../store/useCityStore';

export const MegaProjects3D: React.FC = () => {
  const megaProjects = useCityStore((state) => state.megaProjects);
  const lightingMode = useCityStore((state) => state.lightingMode);
  const isNight = lightingMode === 'night';

  const elevatorPodRef = useRef<THREE.Group>(null);
  const fusionRingRef = useRef<THREE.Mesh>(null);
  const fusionPlasmaRef = useRef<THREE.Mesh>(null);
  const climateTurbineRef = useRef<THREE.Group>(null);
  const quantumPrismRef = useRef<THREE.Mesh>(null);
  const radarSweepRef = useRef<THREE.Group>(null);

  // Dynamic animation loop for completed / building megaprojects
  useFrame((_, delta) => {
    // 1. Orbital Elevator Climber Pod movement
    if (elevatorPodRef.current) {
      const time = Date.now() * 0.0005;
      const progress = (Math.sin(time) + 1) * 0.5; // 0 to 1
      elevatorPodRef.current.position.y = 8 + progress * 160;
    }

    // 2. Fusion Core rotation & plasma pulse
    if (fusionRingRef.current) {
      fusionRingRef.current.rotation.y += delta * 0.8;
    }
    if (fusionPlasmaRef.current) {
      fusionPlasmaRef.current.rotation.x += delta * 1.2;
      fusionPlasmaRef.current.rotation.z += delta * 0.9;
    }

    // 3. Climate Scrubber Turbine rotation
    if (climateTurbineRef.current) {
      climateTurbineRef.current.rotation.y += delta * 1.5;
    }

    // 4. Quantum Singularity floating prism
    if (quantumPrismRef.current) {
      quantumPrismRef.current.rotation.y += delta * 0.7;
      quantumPrismRef.current.position.y = 26 + Math.sin(Date.now() * 0.002) * 1.5;
    }

    // 5. Skyport Radar rotation
    if (radarSweepRef.current) {
      radarSweepRef.current.rotation.y += delta * 1.8;
    }
  });

  return (
    <group name="MegaProjects_Layer">
      {megaProjects.map((mp) => {
        const stage = mp.currentStage;
        const [x, y, z] = mp.location;

        return (
          <group key={mp.id} position={[x, y, z]}>
            {/* 1. ORBITAL ELEVATOR (PROJECT BIFROST) */}
            {mp.id === 'orbital_elevator' && (
              <group>
                {/* Floating Offshore Base Platform */}
                <mesh position={[0, 1.5, 0]}>
                  <cylinderGeometry args={[14, 16, 3, 8]} />
                  <meshStandardMaterial
                    color="#0f172a"
                    metalness={0.9}
                    roughness={0.2}
                    emissive="#0284c7"
                    emissiveIntensity={isNight ? 0.3 : 0.1}
                  />
                </mesh>

                {/* Submersible Mooring Pontoons */}
                {[-10, 10].map((px) =>
                  [-10, 10].map((pz) => (
                    <mesh key={`${px}-${pz}`} position={[px, 0.5, pz]}>
                      <cylinderGeometry args={[2.5, 3, 2, 6]} />
                      <meshStandardMaterial color="#1e293b" metalness={0.8} roughness={0.3} />
                    </mesh>
                  ))
                )}

                {/* Perimeter Beacons */}
                {[0, Math.PI / 4, Math.PI / 2, (3 * Math.PI) / 4, Math.PI, (5 * Math.PI) / 4, (3 * Math.PI) / 2, (7 * Math.PI) / 4].map(
                  (angle, i) => (
                    <mesh
                      key={i}
                      position={[Math.cos(angle) * 13.5, 3.2, Math.sin(angle) * 13.5]}
                    >
                      <sphereGeometry args={[0.3, 8, 8]} />
                      <meshBasicMaterial color={stage > 0 ? '#38bdf8' : '#f59e0b'} />
                    </mesh>
                  )
                )}

                {/* Stage 1: Tripod Guide Pylons & Foundation Ring */}
                {stage >= 1 && (
                  <group>
                    <mesh position={[0, 6, 0]}>
                      <cylinderGeometry args={[7, 10, 8, 6]} />
                      <meshStandardMaterial color="#1e293b" metalness={0.9} roughness={0.2} wireframe={stage === 1} />
                    </mesh>
                    {/* Magnetic Guide Rails */}
                    {[0, (2 * Math.PI) / 3, (4 * Math.PI) / 3].map((angle, idx) => (
                      <mesh
                        key={idx}
                        position={[Math.cos(angle) * 6, 12, Math.sin(angle) * 6]}
                        rotation={[0, angle, 0]}
                      >
                        <boxGeometry args={[1.5, 20, 1.5]} />
                        <meshStandardMaterial color="#0284c7" metalness={0.8} roughness={0.2} />
                      </mesh>
                    ))}
                  </group>
                )}

                {/* Stage 2 & 3: Ultra-Tall Carbon Nanotube Tether */}
                {stage >= 2 && (
                  <group>
                    {/* Main Sky-Tether Line going up to 300m */}
                    <mesh position={[0, 150, 0]}>
                      <cylinderGeometry args={[0.6, 0.6, 300, 12]} />
                      <meshStandardMaterial
                        color="#38bdf8"
                        emissive="#0284c7"
                        emissiveIntensity={isNight ? 0.9 : 0.5}
                        metalness={0.9}
                        roughness={0.1}
                      />
                    </mesh>

                    {/* Secondary Twin Guide Cables */}
                    <mesh position={[-2, 150, 0]}>
                      <cylinderGeometry args={[0.15, 0.15, 300, 8]} />
                      <meshBasicMaterial color="#38bdf8" />
                    </mesh>
                    <mesh position={[2, 150, 0]}>
                      <cylinderGeometry args={[0.15, 0.15, 300, 8]} />
                      <meshBasicMaterial color="#38bdf8" />
                    </mesh>

                    {/* Laser Light Column at night */}
                    <mesh position={[0, 200, 0]}>
                      <cylinderGeometry args={[2, 2, 400, 8]} />
                      <meshBasicMaterial color="#0284c7" transparent opacity={isNight ? 0.25 : 0.08} />
                    </mesh>
                  </group>
                )}

                {/* Stage 3: Animated Ascending / Descending Climber Pod */}
                {stage >= 3 && (
                  <group ref={elevatorPodRef} position={[0, 20, 0]}>
                    <mesh>
                      <boxGeometry args={[4.5, 7, 4.5]} />
                      <meshStandardMaterial
                        color="#f8fafc"
                        metalness={0.9}
                        roughness={0.1}
                        emissive="#38bdf8"
                        emissiveIntensity={0.6}
                      />
                    </mesh>
                    {/* Pod Solar/Thruster Rings */}
                    <mesh position={[0, 0, 0]}>
                      <torusGeometry args={[3.2, 0.4, 8, 16]} />
                      <meshStandardMaterial color="#0ea5e9" emissive="#0284c7" emissiveIntensity={0.8} />
                    </mesh>
                  </group>
                )}
              </group>
            )}

            {/* 2. FUSION POWER COMPLEX (HYPERION CORE) */}
            {mp.id === 'fusion_power_complex' && (
              <group>
                {/* Octagonal Industrial Foundation */}
                <mesh position={[0, 1.2, 0]}>
                  <cylinderGeometry args={[16, 18, 2.4, 8]} />
                  <meshStandardMaterial color="#0f172a" metalness={0.8} roughness={0.3} />
                </mesh>

                {/* Outer Cryo Manifolds */}
                {stage >= 1 && (
                  <group>
                    {[0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2].map((ang, i) => (
                      <mesh key={i} position={[Math.cos(ang) * 12, 4, Math.sin(ang) * 12]}>
                        <cylinderGeometry args={[2, 2.5, 8, 8]} />
                        <meshStandardMaterial color="#334155" metalness={0.7} roughness={0.3} />
                      </mesh>
                    ))}
                  </group>
                )}

                {/* Stage 2 & 3: Magnetic Tokamak Torus Ring */}
                {stage >= 2 && (
                  <group position={[0, 10, 0]}>
                    <mesh ref={fusionRingRef} rotation={[Math.PI / 2, 0, 0]}>
                      <torusGeometry args={[8.5, 2.8, 16, 32]} />
                      <meshStandardMaterial
                        color="#1e293b"
                        metalness={0.95}
                        roughness={0.15}
                        wireframe={stage === 2}
                        emissive="#2563eb"
                        emissiveIntensity={isNight ? 0.4 : 0.15}
                      />
                    </mesh>

                    {/* Support Girders */}
                    {[0, Math.PI / 3, (2 * Math.PI) / 3, Math.PI, (4 * Math.PI) / 3, (5 * Math.PI) / 3].map(
                      (ang, i) => (
                        <mesh key={i} position={[Math.cos(ang) * 8.5, 0, Math.sin(ang) * 8.5]}>
                          <boxGeometry args={[1.5, 3.5, 1.5]} />
                          <meshStandardMaterial color="#475569" metalness={0.8} roughness={0.2} />
                        </mesh>
                      )
                    )}
                  </group>
                )}

                {/* Stage 3: Glowing Magnetic Plasma Ignition Sphere */}
                {stage >= 3 && (
                  <group position={[0, 10, 0]}>
                    <mesh ref={fusionPlasmaRef}>
                      <sphereGeometry args={[4.5, 24, 24]} />
                      <meshStandardMaterial
                        color="#60a5fa"
                        emissive="#3b82f6"
                        emissiveIntensity={isNight ? 1.8 : 1.2}
                        roughness={0.1}
                      />
                    </mesh>
                    {/* Energy Corona Glow Mesh */}
                    <mesh>
                      <sphereGeometry args={[5.8, 16, 16]} />
                      <meshBasicMaterial color="#93c5fd" transparent opacity={0.35} />
                    </mesh>
                  </group>
                )}
              </group>
            )}

            {/* 3. CLIMATE RESTORATION (GAIA ENGINE) */}
            {mp.id === 'climate_restoration' && (
              <group>
                {/* Terraced Bio-Filtration Base */}
                <mesh position={[0, 1, 0]}>
                  <cylinderGeometry args={[14, 16, 2, 12]} />
                  <meshStandardMaterial color="#064e3b" metalness={0.4} roughness={0.6} />
                </mesh>

                {stage >= 1 && (
                  <mesh position={[0, 3, 0]}>
                    <cylinderGeometry args={[11, 13, 2, 12]} />
                    <meshStandardMaterial color="#047857" metalness={0.5} roughness={0.5} />
                  </mesh>
                )}

                {/* Stage 2 & 3: Quad Kinetic Scrubbing Towers */}
                {stage >= 2 && (
                  <group>
                    {[-6, 6].map((tx) =>
                      [-6, 6].map((tz) => (
                        <group key={`${tx}-${tz}`} position={[tx, 14, tz]}>
                          <mesh>
                            <cylinderGeometry args={[1.8, 2.4, 22, 12]} />
                            <meshStandardMaterial
                              color="#10b981"
                              metalness={0.8}
                              roughness={0.2}
                              emissive="#059669"
                              emissiveIntensity={isNight ? 0.4 : 0.15}
                            />
                          </mesh>
                          {/* Tower Intake Vents */}
                          <mesh position={[0, 8, 0]}>
                            <torusGeometry args={[2.6, 0.4, 8, 16]} />
                            <meshStandardMaterial color="#34d399" emissive="#10b981" emissiveIntensity={0.6} />
                          </mesh>
                        </group>
                      ))
                    )}
                  </group>
                )}

                {/* Stage 3: Central Ionization Crown & Rotating Mist Fan */}
                {stage >= 3 && (
                  <group position={[0, 26, 0]}>
                    <group ref={climateTurbineRef}>
                      {[0, (2 * Math.PI) / 3, (4 * Math.PI) / 3].map((ang, i) => (
                        <mesh key={i} rotation={[0, ang, 0]} position={[Math.cos(ang) * 5, 0, Math.sin(ang) * 5]}>
                          <boxGeometry args={[4.5, 0.5, 1.2]} />
                          <meshStandardMaterial color="#6ee7b7" emissive="#10b981" emissiveIntensity={0.7} />
                        </mesh>
                      ))}
                    </group>
                    {/* Emerald Ion Mist Cloud */}
                    <mesh position={[0, 4, 0]}>
                      <sphereGeometry args={[7, 16, 16]} />
                      <meshBasicMaterial color="#34d399" transparent opacity={isNight ? 0.28 : 0.12} />
                    </mesh>
                  </group>
                )}
              </group>
            )}

            {/* 4. RESEARCH MEGACOMPLEX (SINGULARITY CITADEL) */}
            {mp.id === 'research_megacomplex' && (
              <group>
                {/* Monolithic Dark Cyber-Base */}
                <mesh position={[0, 1.5, 0]}>
                  <boxGeometry args={[22, 3, 22]} />
                  <meshStandardMaterial color="#090d16" metalness={0.9} roughness={0.15} />
                </mesh>

                {/* Foundation Tech Spires */}
                {stage >= 1 && (
                  <group>
                    {[-8, 8].map((sx) =>
                      [-8, 8].map((sz) => (
                        <mesh key={`${sx}-${sz}`} position={[sx, 8, sz]}>
                          <boxGeometry args={[3, 14, 3]} />
                          <meshStandardMaterial
                            color="#1e1b4b"
                            metalness={0.9}
                            roughness={0.1}
                            emissive="#6366f1"
                            emissiveIntensity={isNight ? 0.35 : 0.1}
                          />
                        </mesh>
                      ))
                    )}
                  </group>
                )}

                {/* Stage 2 & 3: Angled Cyber Spire Clusters */}
                {stage >= 2 && (
                  <group>
                    {[-5, 5].map((sx) =>
                      [-5, 5].map((sz) => (
                        <mesh
                          key={`upper-${sx}-${sz}`}
                          position={[sx, 18, sz]}
                          rotation={[sx > 0 ? -0.1 : 0.1, 0, sz > 0 ? 0.1 : -0.1]}
                        >
                          <coneGeometry args={[2.5, 18, 4]} />
                          <meshStandardMaterial
                            color="#312e81"
                            metalness={0.9}
                            roughness={0.2}
                            emissive="#818cf8"
                            emissiveIntensity={isNight ? 0.5 : 0.2}
                          />
                        </mesh>
                      ))
                    )}
                  </group>
                )}

                {/* Stage 3: Floating Quantum Prism Core */}
                {stage >= 3 && (
                  <group>
                    <mesh ref={quantumPrismRef} position={[0, 26, 0]}>
                      <octahedronGeometry args={[4.2, 0]} />
                      <meshStandardMaterial
                        color="#a855f7"
                        emissive="#c084fc"
                        emissiveIntensity={isNight ? 1.5 : 0.9}
                        metalness={0.8}
                        roughness={0.1}
                      />
                    </mesh>
                    {/* Quantum Ring Data Link */}
                    <mesh position={[0, 26, 0]} rotation={[Math.PI / 4, 0, 0]}>
                      <torusGeometry args={[6.5, 0.25, 8, 24]} />
                      <meshStandardMaterial color="#e879f9" emissive="#c084fc" emissiveIntensity={0.8} />
                    </mesh>
                  </group>
                )}
              </group>
            )}

            {/* 5. INTERCONTINENTAL SKYPORT (ZEPHYR NEXUS) */}
            {mp.id === 'intercontinental_skyport' && (
              <group>
                {/* Elevated Heavy Support Pylons */}
                {[-10, 0, 10].map((px) =>
                  [-10, 0, 10].map((pz) => (
                    <mesh key={`pylon-${px}-${pz}`} position={[px, 6, pz]}>
                      <cylinderGeometry args={[1.2, 1.6, 12, 8]} />
                      <meshStandardMaterial color="#1e293b" metalness={0.8} roughness={0.3} />
                    </mesh>
                  ))
                )}

                {/* Stage 1: Ground Freight Rail Hub */}
                <mesh position={[0, 1, 0]}>
                  <boxGeometry args={[26, 2, 26]} />
                  <meshStandardMaterial color="#0f172a" metalness={0.8} roughness={0.3} />
                </mesh>

                {/* Stage 2 & 3: Massive Elevated Dual-Deck Runway */}
                {stage >= 2 && (
                  <group position={[0, 12.5, 0]}>
                    {/* Primary Cross Runway Platform */}
                    <mesh position={[0, 0, 0]}>
                      <boxGeometry args={[30, 1.6, 12]} />
                      <meshStandardMaterial color="#1e293b" metalness={0.85} roughness={0.25} />
                    </mesh>
                    <mesh position={[0, 0, 0]}>
                      <boxGeometry args={[12, 1.6, 30]} />
                      <meshStandardMaterial color="#1e293b" metalness={0.85} roughness={0.25} />
                    </mesh>

                    {/* Runway Guidance Centerlines */}
                    <mesh position={[0, 0.85, 0]}>
                      <planeGeometry args={[28, 1]} />
                      <meshBasicMaterial color="#f59e0b" />
                    </mesh>
                    <mesh position={[0, 0.85, 0]} rotation={[0, Math.PI / 2, 0]}>
                      <planeGeometry args={[28, 1]} />
                      <meshBasicMaterial color="#38bdf8" />
                    </mesh>
                  </group>
                )}

                {/* Stage 3: Airspace Control Tower & Rotating Radar Guidance Array */}
                {stage >= 3 && (
                  <group position={[0, 13, 0]}>
                    {/* Control Spire */}
                    <mesh position={[0, 8, 0]}>
                      <cylinderGeometry args={[2, 3, 16, 8]} />
                      <meshStandardMaterial color="#0f172a" metalness={0.9} roughness={0.2} />
                    </mesh>
                    {/* Observation Deck */}
                    <mesh position={[0, 16, 0]}>
                      <cylinderGeometry args={[4.5, 3.5, 3, 12]} />
                      <meshStandardMaterial
                        color="#38bdf8"
                        emissive="#0284c7"
                        emissiveIntensity={isNight ? 0.8 : 0.3}
                        metalness={0.9}
                      />
                    </mesh>
                    {/* Rotating Phased Radar Dish */}
                    <group ref={radarSweepRef} position={[0, 19, 0]}>
                      <mesh position={[0, 0, 2]}>
                        <boxGeometry args={[5, 1.2, 0.5]} />
                        <meshStandardMaterial color="#f59e0b" emissive="#d97706" emissiveIntensity={0.9} />
                      </mesh>
                    </group>
                  </group>
                )}
              </group>
            )}
          </group>
        );
      })}
    </group>
  );
};
