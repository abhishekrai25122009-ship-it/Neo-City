import type { BuildingData, BuildingBlueprint } from '../../types/city';

export type DistrictDensity = 'low' | 'medium' | 'high';

export interface ClearanceRequirement {
  bufferDistance: number; // Minimum clearance to adjacent building walls in meters
  minRoadClearance: number; // Clearance to road edges in meters
  openSpaceRatio: number; // Ratio of open green/plaza space required
  maxHeight: number; // Maximum building height allowed under density rule
}

// Spacing rules configured by Density setting
export const DENSITY_SPACING_CONFIG: Record<DistrictDensity, ClearanceRequirement> = {
  low: {
    bufferDistance: 5.5, // Generous breathing room, open suburban arcologies & villa gardens
    minRoadClearance: 3.5,
    openSpaceRatio: 0.45,
    maxHeight: 24,
  },
  medium: {
    bufferDistance: 3.6, // Believable urban boulevards, pocket parks, and mid-rise corridors
    minRoadClearance: 2.5,
    openSpaceRatio: 0.28,
    maxHeight: 38,
  },
  high: {
    bufferDistance: 2.2, // Dense downtown financial spires, but strictly preventing touching/clipping
    minRoadClearance: 1.8,
    openSpaceRatio: 0.15,
    maxHeight: 55,
  },
};

// Category-specific footprint padding (extra clearance required by building class)
export const CATEGORY_SPACING_PADDING: Record<string, number> = {
  residential: 1.2, // Balconies, courtyard gardens
  commercial: 1.5, // Pedestrian concourses, customer drop-offs
  industrial: 2.5, // Logistics bays, noise/hazard buffer
  tech: 1.8, // Fiber conduits, cooling vaults
  energy: 3.0, // High-voltage safety clearance
  eco: 2.0, // Permaculture root apron
  landmark: 4.5, // Monumental grand plaza apron
};

// Known arterial road lines and infrastructure bounding boxes to prevent overlapping
export const RESTRICTED_ROAD_CORRIDORS = [
  // Primary East Boulevard (X = 24, half-width = 2.0, spans Z from -160 to 160)
  { minX: 21.8, maxX: 26.2, minZ: -160, maxZ: 160 },
  // Mid East Arterial (X = 64, half-width = 1.8)
  { minX: 62.0, maxX: 66.0, minZ: -160, maxZ: 160 },
  // Far East Outer Expansion Arterial (X = 104, half-width = 1.8)
  { minX: 102.0, maxX: 106.0, minZ: -160, maxZ: 160 },
  // Primary West Boulevard (X = -22, half-width = 2.0)
  { minX: -24.2, maxX: -19.8, minZ: -160, maxZ: 160 },
  // Mid West Arterial (X = -64, half-width = 1.8)
  { minX: -66.0, maxX: -62.0, minZ: -160, maxZ: 160 },
  // Far West Outer Expansion Arterial (X = -104, half-width = 1.8)
  { minX: -106.0, maxX: -102.0, minZ: -160, maxZ: 160 },
];

// Major cross avenues across both banks (Z coordinates)
export const CROSS_AVENUE_Z_COORDINATES = [
  -140, -120, -80, -40, 0, 40, 80, 120, 140,
];

// Major elevated aerial stations and bridges to protect
export const PROTECTED_INFRASTRUCTURE = [
  // North suspension bridge: Z=14, X in [-24, 26]
  { minX: -24, maxX: 26, minZ: 11.8, maxZ: 16.2, name: 'North Bridge' },
  // South suspension bridge: Z=-14, X in [-24, 26]
  { minX: -24, maxX: 26, minZ: -16.2, maxZ: -11.8, name: 'South Bridge' },
  // Central Island Celestial Needle: radius 8m around (0,0)
  { minX: -7.5, maxX: 7.5, minZ: -7.5, maxZ: 7.5, name: 'Celestial Island' },
  // Aerial Sky-Stations
  { minX: -6, maxX: 6, minZ: -6, maxZ: 6, name: 'Central Transit Hub' },
  { minX: 23, maxX: 33, minZ: 19, maxZ: 29, name: 'North Skyport' },
  { minX: 25, maxX: 35, minZ: -25, maxZ: -15, name: 'South Terminal' },
  { minX: -33, maxX: -23, minZ: 13, maxZ: 23, name: 'West Sky-Dock' },
  // Mega-Project sites
  { minX: -14, maxX: 14, minZ: -110, maxZ: -80, name: 'Orbital Elevator Marine Anchor' },
  { minX: 52, maxX: 78, minZ: -58, maxZ: -32, name: 'Fusion Tokamak Complex' },
  { minX: -78, maxX: -52, minZ: -58, maxZ: -32, name: 'Gaia Engine Complex' },
  { minX: 52, maxX: 78, minZ: 32, maxZ: 58, name: 'Singularity Citadel' },
  { minX: -80, maxX: -50, minZ: 30, maxZ: 60, name: 'Zephyr Intercontinental Skyport' },
];

export interface PlacementValidationResult {
  isValid: boolean;
  reason?: string;
  suggestedOffset?: [number, number];
}

/**
 * Validates building placement against building-to-building spacing,
 * roads, rivers, bridges, sky-stations, and mega-projects.
 */
export function validateBuildingPlacement(
  blueprint: BuildingBlueprint,
  position: [number, number, number],
  rotation: number,
  existingBuildings: BuildingData[],
  densityMode: DistrictDensity = 'medium'
): PlacementValidationResult {
  const [posX, , posZ] = position;
  const [baseW, , baseD] = blueprint.dimensions;

  // Compute effective width & depth with rotation
  const isRotated = Math.abs(Math.sin(rotation)) > 0.5;
  const effW = isRotated ? baseD : baseW;
  const effD = isRotated ? baseW : baseD;

  const densityRule = DENSITY_SPACING_CONFIG[densityMode];
  const catPadding = CATEGORY_SPACING_PADDING[blueprint.category] || 1.5;
  const minClearance = densityRule.bufferDistance + catPadding;

  // 1. World Bounds Check: [-150, 150] buildable continuous ground
  if (Math.abs(posX) > 150 || Math.abs(posZ) > 150) {
    return {
      isValid: false,
      reason: 'Beyond metropolitan planning boundary limits.',
    };
  }

  // 2. River Channel Check: River is X in [-10, 10], except central island (r <= 7.5m)
  const isCentralIsland = Math.hypot(posX, posZ) <= 7.5;
  const overlapsRiver = Math.abs(posX) < effW / 2 + 10.0;
  if (overlapsRiver && !isCentralIsland) {
    return {
      isValid: false,
      reason: 'Cannot construct over Nova Bay waterways (river channel reserved).',
    };
  }

  // 3. Arterial Road Network Overlap Check
  const myMinX = posX - effW / 2;
  const myMaxX = posX + effW / 2;
  const myMinZ = posZ - effD / 2;
  const myMaxZ = posZ + effD / 2;

  for (const road of RESTRICTED_ROAD_CORRIDORS) {
    const xOverlap = myMaxX >= road.minX && myMinX <= road.maxX;
    const zOverlap = myMaxZ >= road.minZ && myMinZ <= road.maxZ;
    if (xOverlap && zOverlap) {
      return {
        isValid: false,
        reason: 'Encroaches on designated metropolitan boulevard transit corridor.',
      };
    }
  }

  // Cross avenues (Z corridors with width 3.2m)
  for (const crossZ of CROSS_AVENUE_Z_COORDINATES) {
    const roadMinZ = crossZ - 1.6;
    const roadMaxZ = crossZ + 1.6;
    // Check if within buildable east or west bank where cross streets exist
    if (myMaxZ >= roadMinZ && myMinZ <= roadMaxZ && (Math.abs(posX) >= 9.5)) {
      return {
        isValid: false,
        reason: 'Blocks inter-district cross street corridor.',
      };
    }
  }

  // 4. Protected Infrastructure Overlap Check
  for (const infra of PROTECTED_INFRASTRUCTURE) {
    if (
      myMaxX >= infra.minX &&
      myMinX <= infra.maxX &&
      myMaxZ >= infra.minZ &&
      myMinZ <= infra.maxZ
    ) {
      // Allow building on island only if blueprint is explicitly a landmark
      if (infra.name === 'Celestial Island' && blueprint.category === 'eco' && blueprint.type === 'landmark') {
        continue;
      }
      return {
        isValid: false,
        reason: `Encroaches upon protected infrastructure: ${infra.name}.`,
      };
    }
  }

  // 5. Building-to-Building Spacing & Overlap Check (with configurable breathing buffer)
  for (const other of existingBuildings) {
    const otherRotated = other.rotation ? Math.abs(Math.sin(other.rotation)) > 0.5 : false;
    const otherEffW = otherRotated ? other.dimensions[2] : other.dimensions[0];
    const otherEffD = otherRotated ? other.dimensions[0] : other.dimensions[2];

    const dx = Math.abs(posX - other.position[0]);
    const dz = Math.abs(posZ - other.position[2]);

    const requiredClearanceX = effW / 2 + otherEffW / 2 + minClearance;
    const requiredClearanceZ = effD / 2 + otherEffD / 2 + minClearance;

    if (dx < requiredClearanceX && dz < requiredClearanceZ) {
      const isActualOverlap =
        dx < effW / 2 + otherEffW / 2 + 0.3 && dz < effD / 2 + otherEffD / 2 + 0.3;

      return {
        isValid: false,
        reason: isActualOverlap
          ? `Collides directly with ${other.name}.`
          : `Too close to ${other.name}. ${densityMode.toUpperCase()} density requires ${minClearance.toFixed(1)}m buffer.`,
      };
    }
  }

  return { isValid: true };
}
