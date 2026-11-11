import type { TransitStats } from '../../types/city';

export interface CorridorTrafficData {
  id: string;
  name: string;
  type: 'road' | 'bridge' | 'maglev' | 'aerial';
  density: number; // 0 - 100 percentage
  avgSpeedKmH: number;
  delaySeconds: number;
  status: 'smooth' | 'moderate' | 'congested' | 'gridlock';
}

export interface SmartMobilityState {
  corridors: CorridorTrafficData[];
  overallCongestion: number;
  adaptiveSignalsActive: boolean;
  smartLightingIntensity: number; // 0 - 1 multiplier
  publicTransitUtilization: number; // percentage
  averageCommuteMinutes: number;
}

/**
 * Evaluates real-time mobility metrics across the metropolitan arterial grid.
 */
export function evaluateSmartMobility(
  population: number,
  trafficCount: number,
  _pedestrianCount: number,
  weatherCondition: string,
  isNight: boolean
): SmartMobilityState {
  const baseDemand = population * 0.42;

  // Calculate corridor traffic distribution
  const northBridgeDensity = Math.min(95, Math.max(15, Math.round((trafficCount / 60) * 55 + (baseDemand / 50000) * 20)));
  const southBridgeDensity = Math.min(95, Math.max(12, Math.round((trafficCount / 60) * 48 + (baseDemand / 50000) * 18)));
  const eastBoulevardDensity = Math.min(95, Math.max(20, Math.round((trafficCount / 60) * 62 + (baseDemand / 50000) * 22)));
  const westBoulevardDensity = Math.min(95, Math.max(18, Math.round((trafficCount / 60) * 52 + (baseDemand / 50000) * 20)));
  const maglevDensity = Math.min(99, Math.max(30, Math.round(55 + (baseDemand / 60000) * 35)));
  const aerialCorridorDensity = Math.min(90, Math.max(20, Math.round(40 + (trafficCount / 60) * 30)));

  const corridors: CorridorTrafficData[] = [
    {
      id: 'bridge_north',
      name: 'North Trans-Bay Suspension Bridge',
      type: 'bridge',
      density: northBridgeDensity,
      avgSpeedKmH: Math.round(75 * (1 - northBridgeDensity * 0.006)),
      delaySeconds: Math.round(northBridgeDensity * 0.4),
      status: northBridgeDensity > 75 ? 'congested' : northBridgeDensity > 50 ? 'moderate' : 'smooth',
    },
    {
      id: 'bridge_south',
      name: 'South Trans-Bay Suspension Bridge',
      type: 'bridge',
      density: southBridgeDensity,
      avgSpeedKmH: Math.round(80 * (1 - southBridgeDensity * 0.0055)),
      delaySeconds: Math.round(southBridgeDensity * 0.35),
      status: southBridgeDensity > 75 ? 'congested' : southBridgeDensity > 50 ? 'moderate' : 'smooth',
    },
    {
      id: 'east_main',
      name: 'East Financial Grand Boulevard (X=24)',
      type: 'road',
      density: eastBoulevardDensity,
      avgSpeedKmH: Math.round(65 * (1 - eastBoulevardDensity * 0.007)),
      delaySeconds: Math.round(eastBoulevardDensity * 0.5),
      status: eastBoulevardDensity > 75 ? 'congested' : eastBoulevardDensity > 50 ? 'moderate' : 'smooth',
    },
    {
      id: 'west_main',
      name: 'West Arcadia Boulevard (X=-22)',
      type: 'road',
      density: westBoulevardDensity,
      avgSpeedKmH: Math.round(68 * (1 - westBoulevardDensity * 0.0065)),
      delaySeconds: Math.round(westBoulevardDensity * 0.45),
      status: westBoulevardDensity > 75 ? 'congested' : westBoulevardDensity > 50 ? 'moderate' : 'smooth',
    },
    {
      id: 'maglev_loop',
      name: 'Continuous Inter-District Maglev Guideway',
      type: 'maglev',
      density: maglevDensity,
      avgSpeedKmH: 240, // Maglev maintains constant top speed
      delaySeconds: 0,
      status: 'smooth',
    },
    {
      id: 'aerial_canyon',
      name: 'Skyscraper Skyway Aerial Corridor',
      type: 'aerial',
      density: aerialCorridorDensity,
      avgSpeedKmH: 140,
      delaySeconds: Math.round(aerialCorridorDensity * 0.15),
      status: aerialCorridorDensity > 75 ? 'congested' : 'smooth',
    },
  ];

  const overallCongestion = Math.round(
    (northBridgeDensity + southBridgeDensity + eastBoulevardDensity + westBoulevardDensity) / 4
  );

  // Smart infrastructure adaptations
  const adaptiveSignalsActive = overallCongestion > 50;
  const smartLightingIntensity = isNight ? 1.0 : weatherCondition === 'neon_smog' ? 0.85 : 0.4;
  const publicTransitUtilization = Math.round(maglevDensity * 0.75 + 15);
  const averageCommuteMinutes = +(11.5 + (overallCongestion * 0.08) - (adaptiveSignalsActive ? 1.8 : 0)).toFixed(1);

  return {
    corridors,
    overallCongestion,
    adaptiveSignalsActive,
    smartLightingIntensity,
    publicTransitUtilization,
    averageCommuteMinutes,
  };
}

/**
 * Builds updated TransitStats object incorporating smart mobility metrics.
 */
export function buildTransitStats(
  mobility: SmartMobilityState,
  population: number
): TransitStats {
  return {
    congestionIndex: mobility.overallCongestion,
    avgCommuteMinutes: mobility.averageCommuteMinutes,
    efficiencyPercent: Math.max(40, Math.min(99, Math.round(100 - mobility.overallCongestion * 0.55))),
    hoverPodsActive: Math.min(64, Math.max(16, Math.floor(population / 1200))),
    transitDemand: Math.round(population * 0.45),
    transitCapacity: 36000,
    activeRoutesCount: 6,
    adaptiveSignalsActive: mobility.adaptiveSignalsActive,
    smartLightingActive: true,
    junctionDelaysPercent: Math.round(mobility.overallCongestion * 0.35),
    publicTransitShare: mobility.publicTransitUtilization,
    corridors: mobility.corridors,
  };
}
