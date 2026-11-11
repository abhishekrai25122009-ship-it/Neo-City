import type {
  BuildingData,
  CityEventLog,
  CityStats,
  MegaProjectData,
  DistrictDensity,
} from '../../types/city';

export interface CitySaveDataV6 {
  version: 6;
  schemaVersion: '6.0.0';
  timestamp: number;
  savedAtFormatted: string;
  slotId: string;
  slotName: string;
  cityName: string;
  densityMode: DistrictDensity;
  stats: CityStats;
  buildings: BuildingData[];
  events: CityEventLog[];
  taxRate: number;
  budgetAllocations: {
    infrastructure: number;
    healthcare: number;
    education: number;
    security: number;
    environmental: number;
  };
  unlockedTechIds: string[];
  claimedMissionIds: string[];
  activePolicyIds: string[];
  megaProjects: MegaProjectData[];
}

export interface SaveSlotMetadata {
  slotId: string;
  slotName: string;
  timestamp: number;
  savedAtFormatted: string;
  cityName: string;
  population: number;
  treasury: number;
  buildingCount: number;
  happiness: number;
  densityMode: DistrictDensity;
  isAutoSave: boolean;
  version: number;
}

export const CURRENT_SAVE_VERSION = 6;

export function validateSaveData(raw: unknown): { isValid: boolean; error?: string; data?: CitySaveDataV6 } {
  if (!raw || typeof raw !== 'object') {
    return { isValid: false, error: 'Invalid save payload: expected an object' };
  }

  const obj = raw as Record<string, any>;

  // Check critical fields
  if (!Array.isArray(obj.buildings)) {
    return { isValid: false, error: 'Missing or corrupted buildings array' };
  }
  if (!obj.stats || typeof obj.stats !== 'object') {
    return { isValid: false, error: 'Missing or corrupted city stats object' };
  }

  // Auto-migrate older saves if needed
  const migrated = migrateSaveData(obj);
  return { isValid: true, data: migrated };
}

export function migrateSaveData(raw: Record<string, any>): CitySaveDataV6 {
  const now = Date.now();
  const dateStr = new Date(now).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

  return {
    version: 6,
    schemaVersion: '6.0.0',
    timestamp: typeof raw.timestamp === 'number' ? raw.timestamp : now,
    savedAtFormatted: raw.savedAtFormatted || raw.savedAt || dateStr,
    slotId: raw.slotId || 'slot_1',
    slotName: raw.slotName || (raw.slotId === 'autosave' ? 'Emergency Auto-Save' : 'Metropolis Archive'),
    cityName: raw.cityName || 'NOVA PRIME',
    densityMode: raw.densityMode === 'low' || raw.densityMode === 'high' ? raw.densityMode : 'medium',
    stats: {
      ...raw.stats,
      population: raw.stats?.population ?? 42000,
      treasury: raw.stats?.treasury ?? 480000,
      happiness: raw.stats?.happiness ?? 86,
    },
    buildings: Array.isArray(raw.buildings) ? raw.buildings : [],
    events: Array.isArray(raw.events) ? raw.events : [],
    taxRate: typeof raw.taxRate === 'number' ? raw.taxRate : 8,
    budgetAllocations: raw.budgetAllocations || {
      infrastructure: 25,
      healthcare: 20,
      education: 20,
      security: 20,
      environmental: 15,
    },
    unlockedTechIds: Array.isArray(raw.unlockedTechIds) ? raw.unlockedTechIds : ['tech-magnetic-fusion'],
    claimedMissionIds: Array.isArray(raw.claimedMissionIds) ? raw.claimedMissionIds : [],
    activePolicyIds: Array.isArray(raw.activePolicyIds) ? raw.activePolicyIds : [],
    megaProjects: Array.isArray(raw.megaProjects) ? raw.megaProjects : [],
  };
}

export function extractMetadataFromSave(save: CitySaveDataV6): SaveSlotMetadata {
  return {
    slotId: save.slotId,
    slotName: save.slotName,
    timestamp: save.timestamp,
    savedAtFormatted: save.savedAtFormatted,
    cityName: save.cityName || 'NOVA PRIME',
    population: save.stats.population,
    treasury: save.stats.treasury,
    buildingCount: save.buildings.length,
    happiness: save.stats.happiness,
    densityMode: save.densityMode,
    isAutoSave: save.slotId === 'autosave',
    version: save.version,
  };
}
