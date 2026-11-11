import type {
  BuildingData,
  DistrictType,
  DistrictEvolutionState,
  DistrictDetailedStats,
} from '../../types/city';

// Base coordinates of district focal centers for spatial calculations
export const DISTRICT_CENTERS: Record<DistrictType, [number, number]> = {
  downtown: [24, 0],
  tech_district: [28, 48],
  residential: [-32, 10],
  industrial: [26, -55],
  green_zone: [-34, 52],
  waterfront: [0, -10],
};

/**
 * Computes transport accessibility for a district based on infrastructure proximity.
 */
export function calculateDistrictAccessibility(
  district: DistrictType,
  congestionIndex: number,
  hasMaglev: boolean
): number {
  let baseScore = 70;
  if (district === 'waterfront') baseScore += 18; // Central hub & suspension bridges
  if (district === 'downtown') baseScore += 14;
  if (hasMaglev) baseScore += 12;

  // Congestion penalty
  const penalty = Math.round(congestionIndex * 0.25);
  return Math.max(30, Math.min(99, baseScore - penalty));
}

/**
 * Simulates autonomous district progression and calculates updated district metrics.
 */
export function evaluateAutonomousDistricts(
  buildings: BuildingData[],
  totalPopulation: number,
  globalHappiness: number,
  globalAQI: number,
  congestionIndex: number,
  currentEvolution: Record<DistrictType, DistrictEvolutionState>,
  simulationSpeed: number
): {
  detailedStats: Record<DistrictType, DistrictDetailedStats>;
  updatedEvolution: Record<DistrictType, DistrictEvolutionState>;
  autonomousUpgradeEvent?: string;
} {
  const districtTypes: DistrictType[] = [
    'downtown',
    'tech_district',
    'residential',
    'industrial',
    'green_zone',
    'waterfront',
  ];

  const districtNames: Record<DistrictType, string> = {
    downtown: 'Financial Downtown Core',
    tech_district: 'Tech & AI Innovation District',
    residential: 'Arcadia Residential Gardens',
    industrial: 'Sol-Foundry & Heavy Works',
    green_zone: 'Botanical & Ecological Sanctuaries',
    waterfront: 'Celestial Bay Waterfront',
  };

  const detailedStats: Record<DistrictType, DistrictDetailedStats> = {} as any;
  const updatedEvolution: Record<DistrictType, DistrictEvolutionState> = { ...currentEvolution };
  let autonomousUpgradeEvent: string | undefined;

  for (const d of districtTypes) {
    const dBuildings = buildings.filter((b) => b.district === d);
    const residential = dBuildings.filter((b) => b.type === 'residential_tower');
    const workplaces = dBuildings.filter((b) => b.type !== 'residential_tower');

    const housingCapacity = residential.reduce((sum, b) => sum + (b.maxOccupancy || b.height * 200), 0);
    const jobsAvailable = workplaces.reduce((sum, b) => sum + (b.jobsProvided || 200), 0);

    // District localized population share
    const popRatio = housingCapacity > 0 ? Math.min(1.0, housingCapacity / 80000) : 0.05;
    const districtPop = Math.max(450, Math.floor(totalPopulation * (popRatio || 0.16)));

    const employed = Math.min(districtPop * 0.65, jobsAvailable);
    const unemploymentRate = districtPop > 0 ? Math.max(0, Math.round(((districtPop * 0.65 - employed) / (districtPop * 0.65 || 1)) * 100)) : 0;

    // Environmental calculation
    const pollutionDelta = dBuildings.reduce((sum, b) => sum + (b.pollution || 0), 0);
    const localizedAQI = Math.max(5, Math.min(95, Math.round(globalAQI + (pollutionDelta * 0.15) - (d === 'green_zone' ? 22 : 0))));

    // Localized Morale / Happiness
    let localHappiness = globalHappiness;
    if (d === 'green_zone') localHappiness += 8;
    if (d === 'residential' && localizedAQI < 25) localHappiness += 6;
    if (localizedAQI > 50) localHappiness -= 12;
    if (unemploymentRate > 15) localHappiness -= 10;
    localHappiness = Math.max(20, Math.min(99, Math.round(localHappiness)));

    const accessibility = calculateDistrictAccessibility(d, congestionIndex, true);

    // Economic metrics
    const commercialRev = dBuildings
      .filter((b) => b.type === 'commercial_block')
      .reduce((sum, b) => sum + (b.revenue || 4500), 0);

    const industrialOutput = dBuildings
      .filter((b) => b.type === 'power_plant' || b.style === 'superconducting_facility' || b.style === 'robotic_foundry')
      .reduce((sum) => sum + 120, 0);

    // Land value calculation ($/sqm index)
    const landValue = Math.round(
      (accessibility * 0.35 + localHappiness * 0.35 + (100 - localizedAQI) * 0.3) * (1 + (commercialRev / 50000))
    );

    // Demand curves
    const residentialDemand = Math.max(10, Math.min(99, Math.round(localHappiness * 0.6 + (100 - unemploymentRate) * 0.4)));
    const commercialDemand = Math.max(10, Math.min(99, Math.round((districtPop / 1000) * 8 + accessibility * 0.3)));
    const industrialDemand = Math.max(10, Math.min(99, Math.round(75 - localizedAQI * 0.3)));

    // Autonomous Growth Rate
    const growthRate = +(
      (residentialDemand * 0.04 + accessibility * 0.03 - unemploymentRate * 0.05) *
      (simulationSpeed * 0.1)
    ).toFixed(2);

    // Autonomous Evolution progression
    const evo = currentEvolution[d] || {
      district: d,
      name: districtNames[d],
      tier: 1,
      developmentScore: 40,
      prosperity: 50,
      infrastructureHealth: 90,
      passengerDemand: 1200,
      cargoDemand: 450,
      unlockedPerks: [],
      bannerColor: '#00f0ff',
      accentGlow: '#00f0ff',
    };

    // Accumulate development score
    const scoreDelta = (localHappiness >= 70 && unemploymentRate < 12 ? 0.35 : -0.15) * simulationSpeed;
    const newScore = Math.max(10, Math.min(100, Math.round(evo.developmentScore + scoreDelta)));

    let newTier = evo.tier;
    if (newScore >= 85 && newTier < 4) {
      newTier = 4;
      autonomousUpgradeEvent = `${districtNames[d]} ascended to Tier 4: Autonomous Apex Civilization!`;
    } else if (newScore >= 65 && newTier < 3) {
      newTier = 3;
      autonomousUpgradeEvent = `${districtNames[d]} evolved to Tier 3: Advanced Metropolitan Hub!`;
    } else if (newScore >= 45 && newTier < 2) {
      newTier = 2;
      autonomousUpgradeEvent = `${districtNames[d]} advanced to Tier 2: Developing Sector!`;
    }

    updatedEvolution[d] = {
      ...evo,
      tier: newTier,
      developmentScore: newScore,
      prosperity: Math.round((localHappiness + (100 - unemploymentRate) + accessibility) / 3),
      passengerDemand: Math.round(districtPop * 0.35),
      cargoDemand: Math.round(industrialOutput * 2.5 + 200),
    };

    detailedStats[d] = {
      district: d,
      name: districtNames[d],
      population: districtPop,
      housingCapacity,
      jobsAvailable,
      jobsEmployed: Math.round(employed),
      unemploymentRate,
      averageHappiness: localHappiness,
      averageAQI: localizedAQI,
      powerDemand: Math.round(districtPop * 0.035),
      waterDemand: Math.round(districtPop * 0.025),
      commercialRevenue: commercialRev,
      industrialOutput,
      transitTraffic: Math.round(districtPop * 0.12),
      amenitiesScore: Math.round((dBuildings.length / 30) * 100),
      residentialDemand,
      commercialDemand,
      industrialProduction: industrialDemand,
      landValue,
      transportAccessibility: accessibility,
      growthRate,
      autonomousTier: newTier,
    };
  }

  return {
    detailedStats,
    updatedEvolution,
    autonomousUpgradeEvent,
  };
}
