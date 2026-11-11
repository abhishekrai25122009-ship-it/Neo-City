import type { DistrictType, BuildingData } from '../../types/city';
import type { DistrictDensity } from './BuildingSpacingSystem';

export interface DistrictZoneDefinition {
  id: DistrictType;
  name: string;
  description: string;
  color: string;
  bounds: {
    minX: number;
    maxX: number;
    minZ: number;
    maxZ: number;
  };
  preferredDensity: DistrictDensity;
  maxBuildingHeight: number;
  greenPlazaRatio: number;
  openSpaceFeatures: string[];
}

export const DISTRICT_ZONES: Record<DistrictType, DistrictZoneDefinition> = {
  downtown: {
    id: 'downtown',
    name: 'Metropolitan Financial Core',
    description: 'Corporate financial towers, commerce exchanges, and high-rise civic plazas along East Bank.',
    color: '#f59e0b',
    bounds: { minX: 26, maxX: 60, minZ: -32, maxZ: 8 },
    preferredDensity: 'high',
    maxBuildingHeight: 48,
    greenPlazaRatio: 0.18,
    openSpaceFeatures: ['Central Trading Concourse', 'Executive Sky-Plaza', 'Reflecting Pools'],
  },
  tech_district: {
    id: 'tech_district',
    name: 'Quantum Silicon Sector',
    description: 'AI research campuses, quantum server vaults, and optical laboratory spires in East North.',
    color: '#06b6d4',
    bounds: { minX: 26, maxX: 62, minZ: 14, maxZ: 58 },
    preferredDensity: 'medium',
    maxBuildingHeight: 36,
    greenPlazaRatio: 0.32,
    openSpaceFeatures: ['Quantum Courtyards', 'Holographic Promenade', 'Pedestrian Innovation Malls'],
  },
  residential: {
    id: 'residential',
    name: 'Neo Arcology Habitation',
    description: 'Terraced garden residences, stepped family lofts, and ecological arcologies in West North.',
    color: '#ec4899',
    bounds: { minX: -62, maxX: -24, minZ: 14, maxZ: 58 },
    preferredDensity: 'medium',
    maxBuildingHeight: 28,
    greenPlazaRatio: 0.42,
    openSpaceFeatures: ['Community Sky-Parks', 'Children’s Hydro-Playgrounds', 'Balcony Orchards'],
  },
  industrial: {
    id: 'industrial',
    name: 'Nova Heavy Nanotech Zone',
    description: 'Automated fabrication foundries, desalination facilities, and clean energy storage in East South.',
    color: '#f97316',
    bounds: { minX: 28, maxX: 62, minZ: -58, maxZ: -34 },
    preferredDensity: 'low',
    maxBuildingHeight: 20,
    greenPlazaRatio: 0.25,
    openSpaceFeatures: ['Safety Buffers', 'Logistics Freight Yards', 'Coolant Canal Basins'],
  },
  green_zone: {
    id: 'green_zone',
    name: 'Solarium Ecological Sanctuary',
    description: 'Grand geodesic bio-domes, vertical agricultural towers, and botanical reserves in West South.',
    color: '#10b981',
    bounds: { minX: -62, maxX: -24, minZ: -58, maxZ: -14 },
    preferredDensity: 'low',
    maxBuildingHeight: 22,
    greenPlazaRatio: 0.65,
    openSpaceFeatures: ['Botanical Conservatories', 'Misting Waterfalls', 'Permaculture Corridors'],
  },
  waterfront: {
    id: 'waterfront',
    name: 'Celestial Promenade & Marina',
    description: 'The Celestial Needle central island, harbor gateway towers, and open shoreline boardwalks.',
    color: '#3b82f6',
    bounds: { minX: -14, maxX: 14, minZ: -20, maxZ: 20 },
    preferredDensity: 'low',
    maxBuildingHeight: 45,
    greenPlazaRatio: 0.55,
    openSpaceFeatures: ['Shoreline Esplanade', 'Marina Docks', 'Celestial Island Park Rim'],
  },
};

/**
 * Identifies which district zone a given world coordinate falls within.
 */
export function getDistrictAtPosition(x: number, z: number): DistrictType {
  // Check Central Celestial Waterfront
  if (Math.hypot(x, z) <= 12 || (Math.abs(x) <= 14 && Math.abs(z) <= 18)) {
    return 'waterfront';
  }

  for (const [key, zone] of Object.entries(DISTRICT_ZONES) as [DistrictType, DistrictZoneDefinition][]) {
    if (key === 'waterfront') continue;
    if (
      x >= zone.bounds.minX &&
      x <= zone.bounds.maxX &&
      z >= zone.bounds.minZ &&
      z <= zone.bounds.maxZ
    ) {
      return key;
    }
  }

  // Fallbacks based on quadrants
  if (x >= 0) {
    if (z > 10) return 'tech_district';
    if (z < -30) return 'industrial';
    return 'downtown';
  } else {
    if (z > 0) return 'residential';
    return 'green_zone';
  }
}

/**
 * Computes spatial health & density metrics for a district
 */
export function calculateDistrictSpatialMetrics(
  districtId: DistrictType,
  buildings: BuildingData[]
) {
  const districtBuildings = buildings.filter((b) => b.district === districtId);
  const zone = DISTRICT_ZONES[districtId];

  const totalFootprintArea = districtBuildings.reduce((sum, b) => {
    return sum + b.dimensions[0] * b.dimensions[2];
  }, 0);

  const zoneArea = (zone.bounds.maxX - zone.bounds.minX) * (zone.bounds.maxZ - zone.bounds.minZ);
  const builtRatio = zoneArea > 0 ? totalFootprintArea / zoneArea : 0;
  const openSpaceRatio = Math.max(0, 1 - builtRatio);

  const heights = districtBuildings.map((b) => b.height);
  const avgHeight = heights.length > 0 ? +(heights.reduce((a, b) => a + b, 0) / heights.length).toFixed(1) : 0;
  const maxHeight = heights.length > 0 ? Math.max(...heights) : 0;

  // Congestion rating (0 - 100)
  const spatialCongestionIndex = Math.min(100, Math.round((builtRatio / (1 - zone.greenPlazaRatio)) * 100));

  return {
    buildingCount: districtBuildings.length,
    builtAreaSquareMeters: Math.round(totalFootprintArea),
    openSpaceRatio: +openSpaceRatio.toFixed(2),
    avgHeight,
    maxHeight,
    spatialCongestionIndex,
    isCongested: spatialCongestionIndex > 85,
  };
}
