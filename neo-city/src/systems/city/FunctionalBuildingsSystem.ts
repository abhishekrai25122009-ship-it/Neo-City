import type {
  BuildingData,
  BuildingOperationalMetrics,
  DistrictType,
} from '../../types/city';

export interface CityFunctionalityReport {
  metricsByBuilding: Map<string, BuildingOperationalMetrics>;
  totalHealthcareCapacity: number;
  totalEducationCapacity: number;
  totalCommercialCustomers: number;
  overallCommercialProfitability: number; // 0 - 100%
  overallIndustrialProductivity: number; // 0 - 100%
  districtAggregates: Record<
    DistrictType,
    {
      residentialOccupancy: number;
      residentialCapacity: number;
      jobsFilled: number;
      jobsTotal: number;
      commercialFootTraffic: number;
      industrialOutput: number;
      healthcareCoverage: number;
      educationRating: number;
    }
  >;
}

/**
 * Evaluates the functional performance of all buildings in the simulation.
 */
export function evaluateCityFunctionality(
  buildings: BuildingData[],
  currentPopulation: number,
  employmentRate: number, // 0 - 1.0
  powerSuppliedRatio: number, // 0 - 1.0
  waterSuppliedRatio: number, // 0 - 1.0
  transitEfficiency: number // 0 - 100
): CityFunctionalityReport {
  const metricsByBuilding = new Map<string, BuildingOperationalMetrics>();

  let totalHealthcareCapacity = 0;
  let totalEducationCapacity = 0;
  let totalCommercialCustomers = 0;
  let sumCommercialProfit = 0;
  let commercialCount = 0;
  let sumIndustrialProductivity = 0;
  let industrialCount = 0;

  const districts: DistrictType[] = [
    'downtown',
    'tech_district',
    'residential',
    'industrial',
    'green_zone',
    'waterfront',
  ];

  const districtAggregates = Object.fromEntries(
    districts.map((d) => [
      d,
      {
        residentialOccupancy: 0,
        residentialCapacity: 0,
        jobsFilled: 0,
        jobsTotal: 0,
        commercialFootTraffic: 0,
        industrialOutput: 0,
        healthcareCoverage: 80,
        educationRating: 75,
      },
    ])
  ) as CityFunctionalityReport['districtAggregates'];

  for (const b of buildings) {
    const dAgg = districtAggregates[b.district] || districtAggregates.downtown;
    const mode = b.operationalMode || 'optimal';
    const modeMultiplier = mode === 'overclocked' ? 1.3 : mode === 'eco_saver' ? 0.75 : 1.0;

    let currentWorkers = Math.floor((b.jobsProvided || 0) * employmentRate);
    let productivityIndex = Math.min(
      100,
      Math.max(
        15,
        Math.floor(
          ((currentWorkers / Math.max(1, b.jobsProvided)) * 0.4 +
            powerSuppliedRatio * 0.35 +
            waterSuppliedRatio * 0.25) *
            100 *
            modeMultiplier
        )
      )
    );

    let customerTraffic = 0;
    let resourceOutputUnits = 0;

    // 1. Residential Buildings
    if (b.type === 'residential_tower') {
      const occRatio = Math.min(1.0, currentPopulation / Math.max(1, b.maxOccupancy * 10));
      b.occupancy = Math.round(b.maxOccupancy * occRatio);
      dAgg.residentialOccupancy += b.occupancy;
      dAgg.residentialCapacity += b.maxOccupancy;
    }

    // 2. Commercial Blocks & Corporate HQs
    else if (
      b.type === 'commercial_block' ||
      b.type === 'corporate_hq' ||
      b.type === 'skyscraper'
    ) {
      // Foot traffic depends on city population, transit efficiency, and level
      const baseCustomers = Math.floor(b.height * 14 + (transitEfficiency * 0.5));
      customerTraffic = Math.floor(baseCustomers * modeMultiplier);
      totalCommercialCustomers += customerTraffic;
      dAgg.commercialFootTraffic += customerTraffic;

      const profitability = Math.min(
        100,
        Math.max(20, Math.floor((customerTraffic / (b.height * 15)) * 90 * powerSuppliedRatio))
      );
      sumCommercialProfit += profitability;
      commercialCount++;
    }

    // 3. Industrial, Power & Tech Foundries
    else if (
      b.type === 'power_plant' ||
      b.type === 'tech_hub' ||
      b.type === 'logistics_hub' ||
      b.style === 'industrial_complex' ||
      b.style === 'superconducting_facility'
    ) {
      resourceOutputUnits = Math.floor((b.height * 8 + b.level * 15) * (productivityIndex / 100));
      sumIndustrialProductivity += productivityIndex;
      industrialCount++;
      dAgg.industrialOutput += resourceOutputUnits;
    }

    // 4. Healthcare & Hospitals
    if (
      b.style === 'futuristic_hospital' ||
      b.name.includes('Hospital') ||
      b.name.includes('Clinic')
    ) {
      const beds = b.height * 45 + b.level * 80;
      totalHealthcareCapacity += beds;
      dAgg.healthcareCoverage = Math.min(100, dAgg.healthcareCoverage + 5);
    }

    // 5. Education & Academies
    if (
      b.style === 'university_academy' ||
      b.name.includes('Academy') ||
      b.name.includes('University')
    ) {
      const seats = b.height * 55 + b.level * 100;
      totalEducationCapacity += seats;
      dAgg.educationRating = Math.min(100, dAgg.educationRating + 4);
    }

    // Jobs tracking
    dAgg.jobsTotal += b.jobsProvided || 0;
    dAgg.jobsFilled += currentWorkers;

    metricsByBuilding.set(b.id, {
      buildingId: b.id,
      currentWorkers,
      maxWorkers: b.jobsProvided || 0,
      productivityIndex,
      customerTraffic,
      resourceOutputUnits,
      operationalHealth: Math.min(100, Math.floor(productivityIndex * 0.9 + 10)),
      serviceRadius: b.height * 2.5,
    });
  }

  const overallCommercialProfitability =
    commercialCount > 0 ? Math.round(sumCommercialProfit / commercialCount) : 85;
  const overallIndustrialProductivity =
    industrialCount > 0 ? Math.round(sumIndustrialProductivity / industrialCount) : 88;

  return {
    metricsByBuilding,
    totalHealthcareCapacity,
    totalEducationCapacity,
    totalCommercialCustomers,
    overallCommercialProfitability,
    overallIndustrialProductivity,
    districtAggregates,
  };
}
