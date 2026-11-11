import { create } from 'zustand';
import type {
  ActiveTab,
  BuildingBlueprint,
  BuildingData,
  CityEventLog,
  CityStats,
  LightingMode,
  Mission,
  PlacementState,
  SimulationSpeed,
  TechNode,
  GraphicsPreset,
  GraphicsSettings,
  PerformanceTelemetry,
  WeatherType,
  DistrictPolicy,
  CityDecisionEvent,
  ResourceType,
  ResourceInventory,
  AIDirectorState,
  AIRecommendation,
  DistrictType,
  DistrictEvolutionState,
  MegaProjectId,
  MegaProjectData,
  EmergencyDisaster,
  DistrictDensity,
  QualityOfLifeMetrics,
  TradePolicy,
} from '../types/city';
import { SaveManager } from '../systems/persistence/SaveManager';
import type { CitySaveDataV6 } from '../systems/persistence/SaveSchema';
import { BUILDING_BLUEPRINTS, INITIAL_BUILDINGS, INITIAL_EVENTS } from '../data/buildingsData';
import { RESEARCH_UNLOCKED_BLUEPRINTS, TECH_TREE_DATA } from '../data/researchData';
import { INITIAL_MISSIONS } from '../data/missionsData';
import { getBuildingTierInfo } from '../data/tierEvolutionData';
import { INITIAL_DISTRICT_POLICIES } from '../data/districtPoliciesData';
import { CITY_DECISION_EVENTS_POOL } from '../data/cityDecisionEventsData';
import { INITIAL_MEGA_PROJECTS } from '../data/megaProjectsData';
import { INITIAL_DISTRICT_EVOLUTION } from '../data/districtEvolutionData';
import { SIMULATION_EMERGENCIES_POOL } from '../data/emergencyDisastersData';
import { initializeSimulatedCitizens, updateCitizenRoutines } from '../systems/city/CitizenSimulationSystem';
import { evaluateCityFunctionality } from '../systems/city/FunctionalBuildingsSystem';
import { processEconomyCycle, calculateQualityOfLife, DEFAULT_TRADE_POLICIES } from '../systems/city/EconomySimulationSystem';
import { evaluateAutonomousDistricts } from '../systems/city/AutonomousDistrictSystem';
import { evaluateSmartMobility, buildTransitStats } from '../systems/city/SmartMobilitySystem';

const SAVE_STORAGE_KEY = 'neo_city_save_v3';

export const createInitialResources = (): ResourceInventory => ({
  energy: {
    current: 4800,
    capacity: 12000,
    production: 1350,
    consumption: 920,
    marketPrice: 1.25,
    basePrice: 1.25,
    trend: 'stable',
    isShortage: false,
  },
  water: {
    current: 5400,
    capacity: 12000,
    production: 1150,
    consumption: 780,
    marketPrice: 0.85,
    basePrice: 0.85,
    trend: 'stable',
    isShortage: false,
  },
  food: {
    current: 3800,
    capacity: 8000,
    production: 160,
    consumption: 110,
    marketPrice: 2.4,
    basePrice: 2.4,
    trend: 'stable',
    isShortage: false,
  },
  materials: {
    current: 2100,
    capacity: 6000,
    production: 110,
    consumption: 65,
    marketPrice: 4.5,
    basePrice: 4.5,
    trend: 'stable',
    isShortage: false,
  },
  manufactured_goods: {
    current: 1800,
    capacity: 5000,
    production: 130,
    consumption: 85,
    marketPrice: 6.8,
    basePrice: 6.8,
    trend: 'stable',
    isShortage: false,
  },
  services: {
    current: 3200,
    capacity: 8000,
    production: 210,
    consumption: 155,
    marketPrice: 3.2,
    basePrice: 3.2,
    trend: 'stable',
    isShortage: false,
  },
});

export const createInitialAIDirector = (): AIDirectorState => ({
  threatLevel: 'nominal',
  infrastructureWear: 22,
  autoMaintenanceActive: true,
  lastAutonomousAction: 'Microgrid phase stabilization calibrated for Downtown financial core.',
  recommendations: [
    {
      id: 'rec-1',
      category: 'expansion',
      priority: 'high',
      title: 'Commence Project Bifrost (Orbital Tether)',
      description: 'Treasury reserves are strong ($2,850,000). Stage 1 will anchor our interstellar trade hub.',
      actionLabel: 'INSPECT MEGA-PROJECT',
      actionType: 'blueprint',
      cost: 850000,
    },
    {
      id: 'rec-2',
      category: 'environment',
      priority: 'medium',
      title: 'Solarium Hydroponic Expansion',
      description: 'Citizen consumption is growing by 3.2%/cycle. Commissioning an Eco-Dome buffers food security.',
      actionLabel: 'VIEW GREEN ZONE',
      actionType: 'blueprint',
    },
    {
      id: 'rec-3',
      category: 'infrastructure',
      priority: 'low',
      title: 'Microgrid Preventive Overhaul',
      description: 'Infrastructure wear is currently low (22%). Maintain auto-overhaul to prevent brownout emergencies.',
      actionLabel: 'DISPATCH OVERHAUL',
      actionType: 'overhaul',
      cost: 50000,
    },
  ],
});

interface CityState {
  // Navigation & Active View Mode
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  activeDrawer:
    | 'construction'
    | 'districts'
    | 'energy_grid'
    | 'economy'
    | 'demographics'
    | 'environment'
    | 'chronicle'
    | 'settings'
    | 'research'
    | 'missions'
    | 'transit'
    | 'megaprojects'
    | 'ai_director'
    | null;
  toggleDrawer: (drawer: CityState['activeDrawer']) => void;
  closeDrawer: () => void;

  // Selected building & inspection
  selectedBuildingId: string | null;
  selectBuilding: (id: string | null) => void;
  upgradePreviewBuildingId: string | null;
  openUpgradePreview: (id: string | null) => void;
  closeUpgradePreview: () => void;

  // Interactive Building Placement Mode
  placement: PlacementState;
  startPlacement: (blueprint: BuildingBlueprint) => void;
  updatePlacementPosition: (pos: [number, number, number], isValid: boolean) => void;
  rotatePlacement: () => void;
  confirmPlacement: () => void;
  cancelPlacement: () => void;

  // Simulation Controls
  isRunning: boolean;
  toggleSimulation: () => void;
  speed: SimulationSpeed;
  setSpeed: (speed: SimulationSpeed) => void;
  lightingMode: LightingMode;
  setLightingMode: (mode: LightingMode) => void;
  cycleLightingMode: () => void;
  weather: WeatherType;
  setWeather: (w: WeatherType) => void;
  cycleWeather: () => void;

  // Camera & View Navigation
  cameraPreset: string;
  setCameraPreset: (preset: string) => void;
  cameraFlightTarget: { pos: [number, number, number]; lookAt: [number, number, number] } | null;
  flyToCamera: (pos: [number, number, number], lookAt: [number, number, number]) => void;
  clearCameraFlight: () => void;
  resetToOverview: () => void;
  flyToDistrict: (preset: string) => void;

  // Viewport Toggles
  gridVisible: boolean;
  toggleGrid: () => void;
  trafficVisible: boolean;
  toggleTraffic: () => void;
  autoRotate: boolean;
  toggleAutoRotate: () => void;

  // City Data & Living Simulation
  stats: CityStats;
  buildings: BuildingData[];
  blueprints: BuildingBlueprint[];
  events: CityEventLog[];
  addBuilding: (building: BuildingData) => void;
  upgradeBuilding: (id: string) => void;
  demolishBuilding: (id: string) => void;
  setBuildingOperationalMode: (buildingId: string, mode: 'optimal' | 'overclocked' | 'eco_saver') => void;

  // District Policies
  districtPolicies: DistrictPolicy[];
  toggleDistrictPolicy: (id: string) => void;

  // Dynamic City Decision Events
  activeDecisionEvent: CityDecisionEvent | null;
  triggerDecisionEvent: (event?: CityDecisionEvent) => void;
  resolveDecisionEvent: (choiceId: string) => void;
  dismissDecisionEvent: () => void;

  // Fiscal Policy & Budget Controls
  taxRate: number; // percentage (3 to 20%)
  setTaxRate: (rate: number) => void;
  budgetAllocations: {
    infrastructure: number;
    healthcare: number;
    education: number;
    security: number;
    environmental: number;
  };
  setBudgetAllocation: (category: keyof CityState['budgetAllocations'], value: number) => void;

  // Milestone 03: Research & Tech Tree
  techTree: TechNode[];
  unlockTech: (techId: string) => boolean;

  // Milestone 03: Missions & Progression
  missions: Mission[];
  claimMissionReward: (missionId: string) => void;

  // Feature 6: Graphics Settings & Performance Telemetry
  graphics: GraphicsSettings;
  setGraphicsPreset: (preset: GraphicsPreset) => void;
  updateGraphicsSettings: (settings: Partial<GraphicsSettings>) => void;
  togglePerfMonitor: () => void;
  perfTelemetry: PerformanceTelemetry;
  setPerfTelemetry: (metrics: PerformanceTelemetry) => void;

  // NEO CITY 6.0 Living Megacity Additions
  megaProjects: MegaProjectData[];
  contributeMegaProjectStage: (id: MegaProjectId) => boolean;
  buyResource: (type: ResourceType, amount: number) => boolean;
  sellResource: (type: ResourceType, amount: number) => boolean;
  applyAIRecommendation: (recId: string) => void;
  toggleAutoMaintenance: () => void;
  performEmergencyMaintenance: () => void;
  triggerEmergency: (id?: string) => void;
  resolveEmergency: (optionId: string) => void;
  dismissEmergency: () => void;

  // Save / Load System
  manualSave: () => void;
  loadCivilization: () => boolean;
  resetCivilization: () => void;

  // NEO CITY 9.0 Living Simulation Actions
  selectCitizen: (id: string | null) => void;
  setTradePolicy: (resource: ResourceType, policy: Partial<TradePolicy>) => void;

  // Spatial Planning & Density System
  densityMode: DistrictDensity;
  setDensityMode: (mode: DistrictDensity) => void;
  cityName: string;
  setCityName: (name: string) => void;
  activeDistrictInspector: DistrictType | null;
  inspectDistrict: (district: DistrictType | null) => void;

  // Dedicated Multi-Slot Persistence System
  isSaveLoadModalOpen: boolean;
  setSaveLoadModalOpen: (open: boolean) => void;
  saveToSlot: (slotId: string, slotName?: string) => Promise<boolean>;
  loadFromSlot: (slotId: string) => Promise<boolean>;
  deleteSlot: (slotId: string) => Promise<boolean>;
  getSerializableSaveData: () => CitySaveDataV6;

  // Centralized Simulation Tick
  tick: () => void;
}

// Feature 6: Graphics Presets definitions (NEO CITY 9.1 Extreme Performance Overhaul)
export const GRAPHICS_PRESETS: Record<GraphicsPreset, GraphicsSettings> = {
  performance: {
    preset: 'performance',
    shadowQuality: 'off',
    renderScale: 0.85,
    trafficCount: 24,
    pedestrianCount: 60,
    lodThreshold: 65,
    bloomEffects: false,
    showPerfMonitor: false,
  },
  balanced: {
    preset: 'balanced',
    shadowQuality: 'low',
    renderScale: 1.0,
    trafficCount: 48,
    pedestrianCount: 120,
    lodThreshold: 120,
    bloomEffects: true,
    showPerfMonitor: false,
  },
  ultra: {
    preset: 'ultra',
    shadowQuality: 'high',
    renderScale: 1.25,
    trafficCount: 80,
    pedestrianCount: 200,
    lodThreshold: 220,
    bloomEffects: true,
    showPerfMonitor: false,
  },
  // Legacy aliases for backward compatibility
  low: {
    preset: 'performance',
    shadowQuality: 'off',
    renderScale: 0.85,
    trafficCount: 24,
    pedestrianCount: 60,
    lodThreshold: 65,
    bloomEffects: false,
    showPerfMonitor: false,
  },
  medium: {
    preset: 'balanced',
    shadowQuality: 'low',
    renderScale: 1.0,
    trafficCount: 48,
    pedestrianCount: 120,
    lodThreshold: 120,
    bloomEffects: true,
    showPerfMonitor: false,
  },
  high: {
    preset: 'balanced',
    shadowQuality: 'low',
    renderScale: 1.0,
    trafficCount: 48,
    pedestrianCount: 120,
    lodThreshold: 120,
    bloomEffects: true,
    showPerfMonitor: false,
  },
};

// Compute active bonuses from unlocked research technologies
const computeActiveResearchBonuses = (techTree: TechNode[]) => {
  let powerBonus = 0;
  let waterBonus = 0;
  let transitBonus = 0;
  let happinessBonus = 0;
  let pollutionBonus = 0;
  let incomeBonus = 0;
  let costReduction = 0;

  for (const tech of techTree) {
    if (tech.unlocked) {
      if (tech.effects.powerEfficiency) powerBonus += tech.effects.powerEfficiency;
      if (tech.effects.waterEfficiency) waterBonus += tech.effects.waterEfficiency;
      if (tech.effects.transitEfficiency) transitBonus += tech.effects.transitEfficiency;
      if (tech.effects.happinessBonus) happinessBonus += tech.effects.happinessBonus;
      if (tech.effects.pollutionBonus) pollutionBonus += tech.effects.pollutionBonus;
      if (tech.effects.incomeMultiplier) incomeBonus += tech.effects.incomeMultiplier;
      if (tech.effects.constructionCostReduction) costReduction += tech.effects.constructionCostReduction;
    }
  }

  return {
    powerBonus,
    waterBonus,
    transitBonus,
    happinessBonus,
    pollutionBonus,
    incomeBonus,
    costReduction,
  };
};

// Helper to compute live simulation totals from building roster
const recalculateCitySystems = (
  buildings: BuildingData[],
  currentPop: number,
  taxRate: number,
  techTree: TechNode[],
  districtPolicies: DistrictPolicy[] = [],
  megaProjects: MegaProjectData[] = INITIAL_MEGA_PROJECTS,
  prevResources?: ResourceInventory,
  prevDistricts?: Record<DistrictType, DistrictEvolutionState>,
  prevWear: number = 22,
  autoMaintenance: boolean = true,
  prevQoL?: QualityOfLifeMetrics
) => {
  const bonuses = computeActiveResearchBonuses(techTree);

  // Check Mega-Projects completion bonuses
  const completedProjects = new Set(
    megaProjects.filter((mp) => mp.currentStage >= 3).map((mp) => mp.id)
  );
  const hasFusionCore = completedProjects.has('fusion_power_complex');
  const hasGaiaEngine = completedProjects.has('climate_restoration');
  const hasOrbitalElevator = completedProjects.has('orbital_elevator');
  const hasSingularity = completedProjects.has('research_megacomplex');
  const hasSkyport = completedProjects.has('intercontinental_skyport');

  let totalHousing = 0;
  let totalJobs = 0;
  let totalPowerGen = hasFusionCore ? 50000 : 0;
  let totalPowerLoad = 0;
  let totalWaterGen = 0;
  let totalWaterLoad = 0;
  let totalCommercialRevenue = 0;
  let totalMaintenance = 0;
  let totalPollutionDelta = 0;
  let researchFacilitiesCount = 0;

  // Living Economy Resource generation pools
  let foodProd = 45;
  let materialsProd = 35;
  let goodsProd = 40;
  let servicesProd = 60;

  // Compute District Policies Impact
  let policyExpenses = 0;
  let policyPowerMult = 0;
  let policyRevenueMult = 0;
  let policyPollutionDelta = 0;
  let policyHappinessDelta = 0;
  let policyTransitBonus = 0;

  for (const pol of districtPolicies) {
    if (pol.active) {
      policyExpenses += pol.costPerTick;
      if (pol.effects.powerMult) policyPowerMult += pol.effects.powerMult;
      if (pol.effects.revenueMult) policyRevenueMult += pol.effects.revenueMult;
      if (pol.effects.pollutionDelta) policyPollutionDelta += pol.effects.pollutionDelta;
      if (pol.effects.happinessDelta) policyHappinessDelta += pol.effects.happinessDelta;
      if (pol.effects.transitBonus) policyTransitBonus += pol.effects.transitBonus;
    }
  }

  // Count district buildings for Evolution tracking
  const districtCounts: Record<DistrictType, number> = {
    downtown: 0,
    tech_district: 0,
    residential: 0,
    industrial: 0,
    green_zone: 0,
    waterfront: 0,
  };

  for (const b of buildings) {
    if (districtCounts[b.district] !== undefined) {
      districtCounts[b.district] += 1;
    }

    // Operational mode multipliers
    const mode = b.operationalMode || 'optimal';
    const powerLoadMult = mode === 'overclocked' ? 1.6 : mode === 'eco_saver' ? 0.5 : 1.0;
    const powerGenMult = mode === 'overclocked' ? 1.35 : mode === 'eco_saver' ? 0.7 : 1.0;
    const revMult = mode === 'overclocked' ? 1.4 : mode === 'eco_saver' ? 0.7 : 1.0;
    const jobsMult = mode === 'overclocked' ? 1.2 : 1.0;
    const polDelta = mode === 'overclocked' ? 2 : mode === 'eco_saver' ? -1 : 0;

    if (b.type === 'residential_tower') {
      totalHousing += b.maxOccupancy;
    }
    if (b.type === 'research_facility' || b.type === 'tech_hub') {
      researchFacilitiesCount += (mode === 'overclocked' ? 1.5 : 1);
      materialsProd += 25;
      goodsProd += 16;
    }
    if (b.type === 'eco_dome' || b.type === 'park_monument') {
      foodProd += b.type === 'eco_dome' ? 140 : 25;
    }
    if (b.type === 'power_plant') {
      materialsProd += 15;
    }
    if (b.type === 'commercial_block' || b.type === 'corporate_hq' || b.type === 'skyscraper') {
      servicesProd += b.type === 'corporate_hq' ? 95 : 60;
    }
    if (b.style === 'industrial_complex' || b.style === 'superconducting_facility') {
      goodsProd += 20;
    }

    totalJobs += Math.floor((b.jobsProvided || 0) * jobsMult);
    totalPowerGen += Math.floor((b.powerProduction || 0) * powerGenMult);
    totalPowerLoad += Math.floor((b.powerConsumption || 0) * powerLoadMult);
    totalWaterGen += b.waterProduction || 0;
    totalWaterLoad += b.waterConsumption || 0;
    totalCommercialRevenue += Math.floor((b.revenue || 0) * revMult);
    totalMaintenance += b.maintenanceCost || 0;
    totalPollutionDelta += (b.pollution || 0) + polDelta;
  }

  // Apply tech tree & policy multipliers
  totalPowerGen = Math.round(totalPowerGen * (1 + bonuses.powerBonus + policyPowerMult));
  totalWaterGen = Math.round(totalWaterGen * (1 + bonuses.waterBonus));
  let commerceBonusMult = 1 + bonuses.incomeBonus + policyRevenueMult;
  if (hasOrbitalElevator) commerceBonusMult += 0.65;
  totalCommercialRevenue = Math.round(totalCommercialRevenue * commerceBonusMult);

  const workingAgePop = Math.floor(currentPop * 0.65);
  const employed = Math.min(workingAgePop, totalJobs);
  const unemployment = workingAgePop > 0 ? Math.max(0, Math.round(((workingAgePop - employed) / workingAgePop) * 100)) : 0;

  const powerDeficit = totalPowerLoad > totalPowerGen;
  const waterDeficit = totalWaterLoad > totalWaterGen;

  // Base tax revenue
  const taxRevenue = Math.floor(currentPop * (taxRate / 100) * 0.38);
  const totalRevenue = taxRevenue + (powerDeficit ? Math.floor(totalCommercialRevenue * 0.65) : totalCommercialRevenue);
  const totalExpenses = totalMaintenance + policyExpenses + Math.floor(currentPop * 0.08);

  // Dynamic AQI calculation
  let rawAQI = hasGaiaEngine
    ? 8
    : Math.max(5, Math.min(95, 18 + totalPollutionDelta + bonuses.pollutionBonus + policyPollutionDelta));

  // Dynamic happiness calculation
  let calculatedHappiness = 90 + bonuses.happinessBonus + policyHappinessDelta;
  if (unemployment > 12) calculatedHappiness -= (unemployment - 12) * 1.5;
  if (powerDeficit) calculatedHappiness -= 25;
  if (waterDeficit) calculatedHappiness -= 20;
  if (rawAQI > 30) calculatedHappiness -= (rawAQI - 30) * 0.4;
  if (taxRate > 12) calculatedHappiness -= (taxRate - 12) * 1.5;
  if (currentPop > totalHousing) calculatedHappiness -= 15; // overcrowding
  if (hasGaiaEngine) calculatedHappiness += 10;
  calculatedHappiness = Math.max(20, Math.min(99, Math.round(calculatedHappiness)));

  // Calculate passive research points generated per cycle
  let rpPerTick = Math.max(4, Math.floor(researchFacilitiesCount * 6 + 4));
  if (hasSingularity) rpPerTick += 180;

  // Calculate Transit Stats
  const transitDemand = Math.floor(currentPop * 0.45);
  const transitCapacity = Math.round(28000 * (1 + bonuses.transitBonus + policyTransitBonus));
  const rawCongestion = hasSkyport ? 6 : Math.round((transitDemand / transitCapacity) * 40);
  const congestionIndex = Math.min(95, Math.max(5, rawCongestion));
  const transitEfficiency = hasSkyport
    ? 98
    : Math.max(35, Math.min(99, Math.round((100 - congestionIndex * 0.7) * (1 + (bonuses.transitBonus + policyTransitBonus) * 0.2))));

  // Demographics stats
  const activeCommuters = Math.floor(employed * 0.48);
  const pedestriansInPlazas = Math.floor(currentPop * 0.08);

  // Living Economy Resource Balancing
  const foodCons = Math.floor(currentPop * 0.0019);
  const materialsCons = Math.floor(currentPop * 0.0011);
  const goodsCons = Math.floor(currentPop * 0.0016);
  const servicesCons = Math.floor(currentPop * 0.0024);

  const baseRes = prevResources || createInitialResources();
  const computePrice = (cons: number, prod: number, basePrice: number) => {
    const ratio = cons / Math.max(1, prod);
    return +(basePrice * Math.min(2.5, Math.max(0.6, ratio))).toFixed(2);
  };

  const energyPrice = computePrice(totalPowerLoad, totalPowerGen, 1.25);
  const waterPrice = computePrice(totalWaterLoad, totalWaterGen, 0.85);
  const foodPrice = computePrice(foodCons, foodProd, 2.4);
  const materialsPrice = computePrice(materialsCons, materialsProd, 4.5);
  const goodsPrice = computePrice(goodsCons, goodsProd, 6.8);
  const servicesPrice = computePrice(servicesCons, servicesProd, 3.2);

  const updatedResources: ResourceInventory = {
    energy: {
      ...baseRes.energy,
      production: totalPowerGen,
      consumption: totalPowerLoad,
      marketPrice: energyPrice,
      trend: energyPrice > baseRes.energy.marketPrice ? 'rising' : energyPrice < baseRes.energy.marketPrice ? 'falling' : 'stable',
      isShortage: powerDeficit,
    },
    water: {
      ...baseRes.water,
      production: totalWaterGen,
      consumption: totalWaterLoad,
      marketPrice: waterPrice,
      trend: waterPrice > baseRes.water.marketPrice ? 'rising' : waterPrice < baseRes.water.marketPrice ? 'falling' : 'stable',
      isShortage: waterDeficit,
    },
    food: {
      ...baseRes.food,
      production: foodProd,
      consumption: foodCons,
      marketPrice: foodPrice,
      trend: foodPrice > baseRes.food.marketPrice ? 'rising' : foodPrice < baseRes.food.marketPrice ? 'falling' : 'stable',
      isShortage: baseRes.food.current <= 0,
    },
    materials: {
      ...baseRes.materials,
      production: materialsProd,
      consumption: materialsCons,
      marketPrice: materialsPrice,
      trend: materialsPrice > baseRes.materials.marketPrice ? 'rising' : materialsPrice < baseRes.materials.marketPrice ? 'falling' : 'stable',
      isShortage: baseRes.materials.current <= 0,
    },
    manufactured_goods: {
      ...(baseRes.manufactured_goods || { current: 1800, capacity: 5000, production: 130, consumption: 85, marketPrice: 6.8, basePrice: 6.8, trend: 'stable', isShortage: false }),
      production: goodsProd,
      consumption: goodsCons,
      marketPrice: goodsPrice,
      trend: goodsPrice > (baseRes.manufactured_goods?.marketPrice || 6.8) ? 'rising' : goodsPrice < (baseRes.manufactured_goods?.marketPrice || 6.8) ? 'falling' : 'stable',
      isShortage: (baseRes.manufactured_goods?.current || 0) <= 0,
    },
    services: {
      ...baseRes.services,
      production: servicesProd,
      consumption: servicesCons,
      marketPrice: servicesPrice,
      trend: servicesPrice > baseRes.services.marketPrice ? 'rising' : servicesPrice < baseRes.services.marketPrice ? 'falling' : 'stable',
      isShortage: baseRes.services.current <= 0,
    },
  };

  // Functional Buildings System Evaluation
  const functionality = evaluateCityFunctionality(
    buildings,
    currentPop,
    employed / Math.max(1, totalJobs),
    totalPowerGen / Math.max(1, totalPowerLoad),
    totalWaterGen / Math.max(1, totalWaterLoad),
    transitEfficiency
  );

  // Quality of Life Multi-Factor Analysis
  const qol = calculateQualityOfLife(
    currentPop,
    totalHousing,
    unemployment,
    functionality.totalHealthcareCapacity,
    functionality.totalEducationCapacity,
    rawAQI,
    transitEfficiency,
    updatedResources.services.isShortage,
    taxRate,
    prevQoL?.history || []
  );

  // Autonomous District System (NEO CITY 9.1)
  const autonomousData = evaluateAutonomousDistricts(
    buildings,
    currentPop,
    calculatedHappiness,
    rawAQI,
    congestionIndex,
    prevDistricts || INITIAL_DISTRICT_EVOLUTION,
    1
  );
  const districtStats = autonomousData.detailedStats;
  const updatedDistricts = autonomousData.updatedEvolution;

  // Autonomous AI Director Maintenance & Recommendation Synthesis
  let infrastructureWear = prevWear;
  if (autoMaintenance) {
    infrastructureWear = Math.max(12, Math.min(95, +(infrastructureWear + 0.02 - 0.05).toFixed(1)));
  } else {
    infrastructureWear = Math.min(95, +(infrastructureWear + 0.06).toFixed(1));
  }

  const threatLevel: 'nominal' | 'elevated' | 'critical' =
    powerDeficit || waterDeficit || updatedResources.food.isShortage
      ? 'critical'
      : infrastructureWear > 65 || unemployment > 14
      ? 'elevated'
      : 'nominal';

  // Dynamic Contextual AI Recommendations
  const recommendations: AIRecommendation[] = [];

  if (foodProd < foodCons) {
    recommendations.push({
      id: 'rec-food',
      category: 'environment',
      priority: 'high',
      title: 'Food Stockpile Deficit Imminent',
      description: `Daily food consumption (${foodCons} T) outpaces production (${foodProd} T). Construct an Eco-Dome in Green Zone.`,
      actionLabel: 'ZONE ECO-DOME',
      actionType: 'blueprint',
      cost: 420000,
    });
  }

  if (powerDeficit && !hasFusionCore) {
    recommendations.push({
      id: 'rec-power',
      category: 'energy',
      priority: 'critical',
      title: 'Grid Generating Load Deficit',
      description: 'Power load exceeds capacity. Authorize Helios Tokamak Core or Overdrive existing Power Plants.',
      actionLabel: 'COMMENCE FUSION STAGE',
      actionType: 'blueprint',
      cost: 700000,
    });
  }

  if (congestionIndex > 50 && !hasSkyport) {
    recommendations.push({
      id: 'rec-transit',
      category: 'transit',
      priority: 'medium',
      title: 'Transit Congestion Friction',
      description: `Commuter congestion index at ${congestionIndex}%. Construct Zephyr Skyport or toggle Smart Commute Policy.`,
      actionLabel: 'VIEW TRANSIT HUB',
      actionType: 'blueprint',
    });
  }

  if (recommendations.length < 3) {
    recommendations.push({
      id: 'rec-mega-bifrost',
      category: 'expansion',
      priority: 'high',
      title: 'Advance Project Bifrost (Orbital Tether)',
      description: 'Geosynchronous orbital elevator will elevate trade revenue by +65% city-wide.',
      actionLabel: 'FUND MEGA-PROJECT',
      actionType: 'blueprint',
      cost: 850000,
    });
  }

  // Smart Mobility System (NEO CITY 9.1)
  const smartMobility = evaluateSmartMobility(
    currentPop,
    Math.min(48, Math.max(16, Math.floor(currentPop / 1400))),
    160,
    'clear',
    false
  );
  const smartTransitStats = buildTransitStats(
    smartMobility,
    currentPop
  );

  return {
    totalHousing,
    totalJobs,
    employed,
    unemployment,
    totalPowerGen,
    totalPowerLoad,
    totalWaterGen,
    totalWaterLoad,
    powerDeficit,
    waterDeficit,
    totalRevenue,
    totalExpenses,
    rawAQI,
    calculatedHappiness,
    rpPerTick,
    resources: updatedResources,
    districtEvolution: updatedDistricts,
    infrastructureWear,
    threatLevel,
    aiRecommendations: recommendations,
    qualityOfLife: qol,
    districtStats,
    commercialHealth: functionality.overallCommercialProfitability,
    industrialOutput: functionality.overallIndustrialProductivity,
    healthcareCoverage: Math.min(100, Math.round((functionality.totalHealthcareCapacity / (currentPop * 0.15)) * 100)),
    educationRating: Math.min(100, Math.round((functionality.totalEducationCapacity / (currentPop * 0.2)) * 100)),
    transitStats: smartTransitStats,
    demographics: {
      pedestriansInPlazas,
      activeCommuters,
      workplaceOccupancy: totalJobs > 0 ? Math.round((employed / totalJobs) * 100) : 0,
      residentialOccupancy: totalHousing > 0 ? Math.round((currentPop / totalHousing) * 100) : 0,
      citizenSentiment: (calculatedHappiness >= 85 ? 'ecstatic' : calculatedHappiness >= 65 ? 'satisfied' : calculatedHappiness >= 45 ? 'stressed' : 'rebellious') as 'ecstatic' | 'satisfied' | 'stressed' | 'rebellious',
    },
  };
};

// Cached calculation references for decoupled simulation tick scheduling
let simTickCounter = 0;
let cachedSysCalc: any = null;
let cachedEconomyCalc: any = null;
let cachedCitizensCalc: any = null;

export const useCityStore = create<CityState>((set, get) => {
  const initialTechTree = TECH_TREE_DATA;
  const initialBlueprints = [...BUILDING_BLUEPRINTS, ...RESEARCH_UNLOCKED_BLUEPRINTS];
  const initialTotals = recalculateCitySystems(INITIAL_BUILDINGS, 58420, 8, initialTechTree);
  const initialCitizens = initializeSimulatedCitizens(INITIAL_BUILDINGS, 160);

  return {
    activeTab: 'overview',
    setActiveTab: (tab) => set({ activeTab: tab }),

    // Spatial Planning & Density
    densityMode: 'medium',
    setDensityMode: (mode) => set({ densityMode: mode }),
    cityName: 'NOVA PRIME',
    setCityName: (name) => set({ cityName: name }),
    activeDistrictInspector: null,
    inspectDistrict: (district) => set({ activeDistrictInspector: district }),

    // Save/Load Modal
    isSaveLoadModalOpen: false,
    setSaveLoadModalOpen: (open) => set({ isSaveLoadModalOpen: open }),

    activeDrawer: null,
    toggleDrawer: (drawer) =>
      set((state) => ({ activeDrawer: state.activeDrawer === drawer ? null : drawer })),
    closeDrawer: () => set({ activeDrawer: null }),

    selectedBuildingId: null,
    selectBuilding: (id) => set({ selectedBuildingId: id }),

    placement: {
      active: false,
      blueprint: null,
      position: [0, 0, 0],
      rotation: 0,
      isValid: true,
    },

    startPlacement: (blueprint) =>
      set({
        placement: {
          active: true,
          blueprint,
          position: [0, 0, 0],
          rotation: 0,
          isValid: true,
        },
        selectedBuildingId: null,
        activeDrawer: null,
      }),

    updatePlacementPosition: (pos, isValid) =>
      set((state) => ({
        placement: {
          ...state.placement,
          position: pos,
          isValid,
        },
      })),

    rotatePlacement: () =>
      set((state) => ({
        placement: {
          ...state.placement,
          rotation: (state.placement.rotation + Math.PI / 2) % (Math.PI * 2),
        },
      })),

    confirmPlacement: () => {
      const { placement, stats, buildings, events, taxRate, techTree } = get();
      if (!placement.active || !placement.blueprint || !placement.isValid) return;

      if (stats.treasury < placement.blueprint.cost) {
        alert('Insufficient municipal treasury funds.');
        return;
      }

      const bp = placement.blueprint;
      const newBuilding: BuildingData = {
        id: `b-${Date.now()}`,
        name: bp.name,
        type: bp.type,
        style: bp.style,
        district: bp.district,
        position: [placement.position[0], 0, placement.position[2]],
        dimensions: bp.dimensions,
        rotation: placement.rotation,
        height: bp.height,
        level: 1,
        occupancy: bp.type === 'residential_tower' ? Math.floor(bp.height * 180) : Math.floor(bp.jobsProvided * 0.8),
        maxOccupancy: bp.type === 'residential_tower' ? Math.floor(bp.height * 220) : bp.jobsProvided,
        jobsProvided: bp.jobsProvided,
        powerConsumption: bp.powerConsumption,
        powerProduction: bp.powerProduction,
        waterConsumption: bp.waterConsumption,
        waterProduction: bp.waterProduction,
        revenue: bp.revenue,
        maintenanceCost: bp.maintenanceCost,
        pollution: bp.pollution,
        happinessImpact: bp.happinessImpact,
        status: 'optimal',
        details: bp.details,
        primaryColor: bp.primaryColor,
        secondaryColor: bp.secondaryColor,
        accentColor: bp.accentColor,
        windowGlowColor: bp.windowGlowColor,
        hasAntenna: bp.hasAntenna,
        hasHelipad: bp.hasHelipad,
        hasHoloBanner: bp.hasHoloBanner,
        hasTerraceGardens: bp.hasTerraceGardens,
        hasRooftopPool: bp.hasRooftopPool,
      };

      const newBuildingsList = [...buildings, newBuilding];
      const newEvent: CityEventLog = {
        id: `ev-${Date.now()}`,
        timestamp: stats.timeOfDay,
        type: 'success',
        message: `Constructed: ${newBuilding.name} deployed to Sector.`,
      };

      const newTotals = recalculateCitySystems(newBuildingsList, stats.population, taxRate, techTree);
      cachedSysCalc = null;
      cachedCitizensCalc = null;

      set({
        buildings: newBuildingsList,
        selectedBuildingId: newBuilding.id,
        stats: {
          ...stats,
          treasury: stats.treasury - bp.cost,
          totalHousingCapacity: newTotals.totalHousing,
          totalJobs: newTotals.totalJobs,
          powerCapacity: newTotals.totalPowerGen,
          powerUsage: newTotals.totalPowerLoad,
          waterCapacity: newTotals.totalWaterGen,
          waterUsage: newTotals.totalWaterLoad,
          incomePerTick: newTotals.totalRevenue,
          expensesPerTick: newTotals.totalExpenses,
          pollution: newTotals.rawAQI,
          happiness: newTotals.calculatedHappiness,
          transitStats: newTotals.transitStats,
          demographics: newTotals.demographics,
        },
        events: [newEvent, ...events.slice(0, 9)],
        placement: {
          active: false,
          blueprint: null,
          position: [0, 0, 0],
          rotation: 0,
          isValid: true,
        },
      });
    },

    cancelPlacement: () =>
      set({
        placement: {
          active: false,
          blueprint: null,
          position: [0, 0, 0],
          rotation: 0,
          isValid: true,
        },
      }),

    isRunning: true,
    toggleSimulation: () => set((state) => ({ isRunning: !state.isRunning })),

    speed: 1,
    setSpeed: (speed) => set({ speed, isRunning: speed > 0 }),

    lightingMode: 'day',
    setLightingMode: (mode) =>
      set((state) => ({
        lightingMode: mode,
        stats: { ...state.stats, lightingMode: mode },
      })),

    cycleLightingMode: () =>
      set((state) => {
        const next: LightingMode =
          state.lightingMode === 'day'
            ? 'sunset'
            : state.lightingMode === 'sunset'
            ? 'night'
            : 'day';
        return {
          lightingMode: next,
          stats: { ...state.stats, lightingMode: next },
        };
      }),

    weather: 'clear',
    setWeather: (w) =>
      set((state) => ({
        weather: w,
        stats: { ...state.stats, weather: w },
      })),

    cycleWeather: () =>
      set((state) => {
        const sequence: WeatherType[] = ['clear', 'cyber_rain', 'neon_smog', 'aurora_storm'];
        const currentIdx = sequence.indexOf(state.weather);
        const next = sequence[(currentIdx + 1) % sequence.length];
        return {
          weather: next,
          stats: { ...state.stats, weather: next },
        };
      }),

    cameraPreset: 'Overview',
    setCameraPreset: (preset) => set({ cameraPreset: preset }),

    // Initial elevated three-quarter perspective framing the entire civilization
    cameraFlightTarget: { pos: [64, 52, 70], lookAt: [0, 4, 0] },

    flyToCamera: (pos, lookAt) =>
      set({
        cameraFlightTarget: { pos, lookAt },
      }),

    clearCameraFlight: () => set({ cameraFlightTarget: null }),

    resetToOverview: () =>
      set({
        selectedBuildingId: null,
        cameraPreset: 'Overview',
        cameraFlightTarget: { pos: [64, 52, 70], lookAt: [0, 4, 0] },
      }),

    flyToDistrict: (preset: string) => {
      const presets: Record<string, { pos: [number, number, number]; lookAt: [number, number, number] }> = {
        'Overview': { pos: [78, 64, 85], lookAt: [0, 6, 0] },
        'Downtown': { pos: [38, 28, 14], lookAt: [24, 12, 0] },
        'Residential': { pos: [-38, 26, 10], lookAt: [-22, 8, 0] },
        'Innovation': { pos: [36, 26, 36], lookAt: [24, 10, 22] },
        'Energy': { pos: [36, 24, -34], lookAt: [24, 6, -22] },
        'Botanical': { pos: [-34, 24, 34], lookAt: [-22, 6, 22] },
        'Waterfront': { pos: [0, 26, 32], lookAt: [0, 10, 0] },
        'OuterEast': { pos: [120, 38, 25], lookAt: [95, 10, 0] },
        'OuterWest': { pos: [-120, 38, 25], lookAt: [-95, 10, 0] },
        'StreetLevel': { pos: [22, 3, 4], lookAt: [20, 12, 0] },
      };

      const target = presets[preset] || presets['Overview'];
      set({
        cameraPreset: preset,
        cameraFlightTarget: target,
      });
    },

    gridVisible: true,
    toggleGrid: () => set((state) => ({ gridVisible: !state.gridVisible })),

    trafficVisible: true,
    toggleTraffic: () => set((state) => ({ trafficVisible: !state.trafficVisible })),

    autoRotate: false,
    toggleAutoRotate: () => set((state) => ({ autoRotate: !state.autoRotate })),

    stats: {
      population: 58420,
      totalHousingCapacity: initialTotals.totalHousing,
      populationGrowthRate: 3.2,
      totalJobs: initialTotals.totalJobs,
      employedCitizens: initialTotals.employed,
      unemploymentRate: initialTotals.unemployment,
      treasury: 2850000,
      incomePerTick: initialTotals.totalRevenue,
      expensesPerTick: initialTotals.totalExpenses,
      happiness: initialTotals.calculatedHappiness,
      powerUsage: initialTotals.totalPowerLoad,
      powerCapacity: initialTotals.totalPowerGen,
      waterUsage: initialTotals.totalWaterLoad,
      waterCapacity: initialTotals.totalWaterGen,
      powerDeficit: initialTotals.powerDeficit,
      waterDeficit: initialTotals.waterDeficit,
      pollution: initialTotals.rawAQI,
      lightingMode: 'day',
      weather: 'clear',
      timeOfDay: '14:30',
      cycleCount: 152,
      era: 'ERA III // SOLARIS',
      autoSaveTimestamp: undefined,

      // Milestone 03 initial stats
      researchPoints: 340,
      researchPointsPerTick: initialTotals.rpPerTick,
      civLevel: 3,
      civXP: 450,
      civXPToNextLevel: 1000,
      transitStats: initialTotals.transitStats,
      demographics: initialTotals.demographics,

      // NEO CITY 6.0 Living Megacity initial systems
      resources: initialTotals.resources,
      aiDirector: {
        threatLevel: initialTotals.threatLevel,
        infrastructureWear: initialTotals.infrastructureWear,
        autoMaintenanceActive: true,
        lastAutonomousAction: 'Microgrid phase stabilization calibrated for Downtown financial core.',
        recommendations: initialTotals.aiRecommendations,
      },
      districtEvolution: initialTotals.districtEvolution,
      activeEmergency: null,

      // NEO CITY 9.0 Living Megacity & Deep Simulation
      qualityOfLife: initialTotals.qualityOfLife,
      districtStats: initialTotals.districtStats,
      simulatedCitizens: initialCitizens,
      selectedCitizenId: null,
      commercialHealth: initialTotals.commercialHealth,
      industrialOutput: initialTotals.industrialOutput,
      healthcareCoverage: initialTotals.healthcareCoverage,
      educationRating: initialTotals.educationRating,
      tradePolicies: DEFAULT_TRADE_POLICIES,
    },

    megaProjects: INITIAL_MEGA_PROJECTS,

    buildings: INITIAL_BUILDINGS,
    blueprints: initialBlueprints,
    events: INITIAL_EVENTS,

    taxRate: 8,
    setTaxRate: (rate) => set({ taxRate: rate }),

    budgetAllocations: {
      infrastructure: 28,
      healthcare: 22,
      education: 18,
      security: 17,
      environmental: 15,
    },
    setBudgetAllocation: (category, value) =>
      set((state) => ({
        budgetAllocations: { ...state.budgetAllocations, [category]: value },
      })),

    // Milestone 03: Research State
    techTree: initialTechTree,
    unlockTech: (techId: string) => {
      const { techTree, stats, blueprints, events, buildings, taxRate } = get();
      const tech = techTree.find((t) => t.id === techId);
      if (!tech || tech.unlocked) return false;

      // Check prerequisites
      const prereqsMet = tech.prerequisites.every((prereqId) =>
        techTree.find((t) => t.id === prereqId && t.unlocked)
      );
      if (!prereqsMet) {
        alert('Prerequisite technology not yet unlocked.');
        return false;
      }

      // Check cost
      if (stats.researchPoints < tech.costRP || stats.treasury < tech.costCredits) {
        alert(`Insufficient resources. Requires ${tech.costRP} RP and ₡${tech.costCredits.toLocaleString()}.`);
        return false;
      }

      const updatedTechTree = techTree.map((t) => (t.id === techId ? { ...t, unlocked: true } : t));

      // Unlock blueprint if applicable
      let updatedBlueprints = blueprints;
      if (tech.unlocksBlueprintId) {
        updatedBlueprints = blueprints.map((b) =>
          b.id === tech.unlocksBlueprintId ? { ...b, isLocked: false } : b
        );
      }

      const newEvent: CityEventLog = {
        id: `ev-${Date.now()}`,
        timestamp: stats.timeOfDay,
        type: 'success',
        message: `TECHNOLOGY UNLOCKED: ${tech.name}! Municipal perks activated.`,
      };

      const newTotals = recalculateCitySystems(buildings, stats.population, taxRate, updatedTechTree);

      set({
        techTree: updatedTechTree,
        blueprints: updatedBlueprints,
        events: [newEvent, ...events.slice(0, 9)],
        stats: {
          ...stats,
          researchPoints: stats.researchPoints - tech.costRP,
          treasury: stats.treasury - tech.costCredits,
          powerCapacity: newTotals.totalPowerGen,
          waterCapacity: newTotals.totalWaterGen,
          happiness: newTotals.calculatedHappiness,
          pollution: newTotals.rawAQI,
          transitStats: newTotals.transitStats,
        },
      });

      return true;
    },

    // Milestone 03: Missions & Objectives
    missions: INITIAL_MISSIONS,
    claimMissionReward: (missionId: string) => {
      const { missions, stats, events } = get();
      const target = missions.find((m) => m.id === missionId);
      if (!target || !target.isCompleted || target.claimed) return;

      const updatedMissions = missions.map((m) =>
        m.id === missionId ? { ...m, claimed: true } : m
      );

      let newXP = stats.civXP + target.rewardXP;
      let newLevel = stats.civLevel;
      let newXPReq = stats.civXPToNextLevel;
      let leveledUp = false;

      if (newXP >= newXPReq) {
        newLevel += 1;
        newXP -= newXPReq;
        newXPReq = Math.round(newXPReq * 1.5);
        leveledUp = true;
      }

      const rewardEvent: CityEventLog = {
        id: `ev-${Date.now()}`,
        timestamp: stats.timeOfDay,
        type: 'success',
        message: `DIRECTIVE COMPLETED: "${target.title}" claimed! +₡${target.rewardCredits.toLocaleString()}, +${target.rewardRP} RP, +${target.rewardXP} XP.${leveledUp ? ` CIVILIZATION ASCENDED TO LEVEL ${newLevel}!` : ''}`,
      };

      set({
        missions: updatedMissions,
        events: [rewardEvent, ...events.slice(0, 9)],
        stats: {
          ...stats,
          treasury: stats.treasury + target.rewardCredits,
          researchPoints: stats.researchPoints + target.rewardRP,
          civLevel: newLevel,
          civXP: newXP,
          civXPToNextLevel: newXPReq,
        },
      });
    },

    // Feature 6: Graphics Settings & Telemetry
    graphics: GRAPHICS_PRESETS.balanced,
    setGraphicsPreset: (preset) =>
      set((state) => ({
        graphics: {
          ...GRAPHICS_PRESETS[preset],
          showPerfMonitor: state.graphics.showPerfMonitor,
        },
      })),
    updateGraphicsSettings: (settings) =>
      set((state) => ({
        graphics: { ...state.graphics, ...settings },
      })),
    togglePerfMonitor: () =>
      set((state) => ({
        graphics: {
          ...state.graphics,
          showPerfMonitor: !state.graphics.showPerfMonitor,
        },
      })),
    perfTelemetry: {
      fps: 60,
      frameTimeMs: 16.6,
      drawCalls: 0,
      triangles: 0,
      geometries: 0,
      textures: 0,
      activePedestrians: 160,
      activeVehicles: 40,
    },
    setPerfTelemetry: (metrics) => set({ perfTelemetry: metrics }),

    addBuilding: (newBuilding) =>
      set((state) => ({
        buildings: [...state.buildings, newBuilding],
        selectedBuildingId: newBuilding.id,
      })),

    upgradePreviewBuildingId: null,
    openUpgradePreview: (id) => set({ upgradePreviewBuildingId: id }),
    closeUpgradePreview: () => set({ upgradePreviewBuildingId: null }),

    upgradeBuilding: (id) => {
      const state = get();
      const target = state.buildings.find((b) => b.id === id);
      if (!target) return;

      const currentTier = target.level || 1;
      if (currentTier >= 8) {
        alert('This structure has reached maximum Tier 8 Stellar Arcology Ascension and cannot be upgraded further.');
        return;
      }

      const nextTier = currentTier + 1;
      const nextTierInfo = getBuildingTierInfo(target.style, nextTier);

      if (state.stats.treasury < nextTierInfo.cost) {
        alert(`Insufficient funds. Tier ${nextTier} upgrade requires ₡${nextTierInfo.cost.toLocaleString()} CR.`);
        return;
      }

      const updated = state.buildings.map((b) => {
        if (b.id === id) {
          const isLowRise = b.height <= 8;
          const heightGain = isLowRise ? Math.min(1.2, (nextTierInfo.heightBonus || 4) * 0.12) : Math.min(6, (nextTierInfo.heightBonus || 4) * 0.6);
          const newHeight = +(b.height + heightGain).toFixed(1);
          const widthGain = +(0.25 * nextTier).toFixed(1);
          const depthGain = +(0.25 * nextTier).toFixed(1);
          return {
            ...b,
            level: nextTier,
            height: newHeight,
            dimensions: [+(b.dimensions[0] + widthGain).toFixed(1), newHeight, +(b.dimensions[2] + depthGain).toFixed(1)] as [number, number, number],
            tierName: nextTierInfo.name,
            tierDescription: nextTierInfo.description,
            transforming: true,
            occupancy: Math.floor(b.occupancy * nextTierInfo.occupancyMultiplier),
            maxOccupancy: Math.floor(b.maxOccupancy * nextTierInfo.occupancyMultiplier),
            jobsProvided: Math.floor(b.jobsProvided * nextTierInfo.jobsMultiplier),
            revenue: Math.floor(b.revenue * nextTierInfo.revenueMultiplier),
            happinessImpact: b.happinessImpact + nextTierInfo.happinessBonus,
            pollution: b.pollution + nextTierInfo.pollutionBonus,
            hasAntenna: b.hasAntenna || nextTierInfo.features.hasAntenna,
            hasHelipad: b.hasHelipad || nextTierInfo.features.hasHelipad,
            hasHoloBanner: b.hasHoloBanner || nextTierInfo.features.hasHoloBanner,
            hasSkybridge: b.hasSkybridge || nextTierInfo.features.hasSkybridge,
            hasRooftopPool: b.hasRooftopPool || nextTierInfo.features.hasRooftopPool,
            hasTerraceGardens: b.hasTerraceGardens || nextTierInfo.features.hasTerraceGardens,
          };
        }
        return b;
      });

      const newEvent: CityEventLog = {
        id: `ev-${Date.now()}`,
        timestamp: state.stats.timeOfDay,
        type: 'success',
        message: `ARCHITECTURAL EVOLUTION: ${target.name} upgraded to Tier ${nextTier} (${nextTierInfo.name})!`,
      };

      const newTotals = recalculateCitySystems(updated, state.stats.population, state.taxRate, state.techTree);
      cachedSysCalc = null;
      cachedCitizensCalc = null;

      set({
        buildings: updated,
        upgradePreviewBuildingId: null,
        events: [newEvent, ...state.events.slice(0, 9)],
        stats: {
          ...state.stats,
          treasury: state.stats.treasury - nextTierInfo.cost,
          totalHousingCapacity: newTotals.totalHousing,
          totalJobs: newTotals.totalJobs,
          incomePerTick: newTotals.totalRevenue,
          expensesPerTick: newTotals.totalExpenses,
          powerCapacity: newTotals.totalPowerGen,
          powerUsage: newTotals.totalPowerLoad,
          waterCapacity: newTotals.totalWaterGen,
          waterUsage: newTotals.totalWaterLoad,
          happiness: newTotals.calculatedHappiness,
          pollution: newTotals.rawAQI,
        },
      });

      // Clear transformation animation state after 1.8 seconds
      setTimeout(() => {
        set((curr) => ({
          buildings: curr.buildings.map((b) =>
            b.id === id ? { ...b, transforming: false } : b
          ),
        }));
      }, 1800);
    },

    demolishBuilding: (id) =>
      set((state) => {
        const target = state.buildings.find((b) => b.id === id);
        const updated = state.buildings.filter((b) => b.id !== id);
        const newEvent: CityEventLog = {
          id: `ev-${Date.now()}`,
          timestamp: state.stats.timeOfDay,
          type: 'warning',
          message: `Decommissioned structure: ${target?.name || 'Building'}.`,
        };

        const newTotals = recalculateCitySystems(updated, state.stats.population, state.taxRate, state.techTree);

        return {
          buildings: updated,
          selectedBuildingId: null,
          events: [newEvent, ...state.events.slice(0, 9)],
          stats: {
            ...state.stats,
            totalHousingCapacity: newTotals.totalHousing,
            totalJobs: newTotals.totalJobs,
            incomePerTick: newTotals.totalRevenue,
            expensesPerTick: newTotals.totalExpenses,
            powerCapacity: newTotals.totalPowerGen,
            powerUsage: newTotals.totalPowerLoad,
            waterCapacity: newTotals.totalWaterGen,
            waterUsage: newTotals.totalWaterLoad,
            happiness: newTotals.calculatedHappiness,
          },
        };
      }),

    setBuildingOperationalMode: (buildingId, mode) => {
      const state = get();
      const updated = state.buildings.map((b) =>
        b.id === buildingId ? { ...b, operationalMode: mode } : b
      );
      const newTotals = recalculateCitySystems(updated, state.stats.population, state.taxRate, state.techTree, state.districtPolicies);
      const target = state.buildings.find((b) => b.id === buildingId);
      const newEvent: CityEventLog = {
        id: `ev-${Date.now()}`,
        timestamp: state.stats.timeOfDay,
        type: 'info',
        message: `${target?.name || 'Structure'} operational mode shifted to ${mode.toUpperCase()}.`,
      };
      set({
        buildings: updated,
        events: [newEvent, ...state.events.slice(0, 9)],
        stats: {
          ...state.stats,
          powerCapacity: newTotals.totalPowerGen,
          powerUsage: newTotals.totalPowerLoad,
          incomePerTick: newTotals.totalRevenue,
          expensesPerTick: newTotals.totalExpenses,
          totalJobs: newTotals.totalJobs,
          pollution: newTotals.rawAQI,
          happiness: newTotals.calculatedHappiness,
        },
      });
    },

    districtPolicies: INITIAL_DISTRICT_POLICIES,
    toggleDistrictPolicy: (id) => {
      const state = get();
      const updatedPolicies = state.districtPolicies.map((p) =>
        p.id === id ? { ...p, active: !p.active } : p
      );
      const target = updatedPolicies.find((p) => p.id === id);
      const newTotals = recalculateCitySystems(state.buildings, state.stats.population, state.taxRate, state.techTree, updatedPolicies);
      const newEvent: CityEventLog = {
        id: `ev-${Date.now()}`,
        timestamp: state.stats.timeOfDay,
        type: target?.active ? 'success' : 'warning',
        message: `Policy: ${target?.name} ${target?.active ? 'ENACTED' : 'SUSPENDED'}.`,
      };
      set({
        districtPolicies: updatedPolicies,
        events: [newEvent, ...state.events.slice(0, 9)],
        stats: {
          ...state.stats,
          expensesPerTick: newTotals.totalExpenses,
          incomePerTick: newTotals.totalRevenue,
          powerCapacity: newTotals.totalPowerGen,
          happiness: newTotals.calculatedHappiness,
          pollution: newTotals.rawAQI,
          transitStats: newTotals.transitStats,
        },
      });
    },

    activeDecisionEvent: null,
    triggerDecisionEvent: (event) => {
      if (event) {
        set({ activeDecisionEvent: event });
      } else {
        const pool = CITY_DECISION_EVENTS_POOL;
        const randomEvent = pool[Math.floor(Math.random() * pool.length)];
        set({ activeDecisionEvent: { ...randomEvent, cycleRemaining: 4 } });
      }
    },
    resolveDecisionEvent: (choiceId) => {
      const state = get();
      const currentEv = state.activeDecisionEvent;
      if (!currentEv) return;
      const choice = currentEv.choices.find((c) => c.id === choiceId);
      if (!choice) return;

      if (choice.costCredits && state.stats.treasury < choice.costCredits) {
        alert('Insufficient municipal treasury funds to authorize this civic resolution.');
        return;
      }

      const eff = choice.effects;
      const newTreasury = state.stats.treasury + (eff.treasuryDelta || 0);
      const newRP = state.stats.researchPoints + (eff.rpDelta || 0);
      const newHappiness = Math.max(10, Math.min(99, state.stats.happiness + (eff.happinessDelta || 0)));
      const newAQI = Math.max(5, Math.min(95, state.stats.pollution + (eff.pollutionDelta || 0)));

      const resolveEvent: CityEventLog = {
        id: `ev-${Date.now()}`,
        timestamp: state.stats.timeOfDay,
        type: 'success',
        message: `EXECUTIVE DECISION: [${currentEv.title}] resolved via "${choice.label}".`,
      };

      set({
        activeDecisionEvent: null,
        events: [resolveEvent, ...state.events.slice(0, 9)],
        stats: {
          ...state.stats,
          treasury: newTreasury,
          researchPoints: newRP,
          happiness: newHappiness,
          pollution: newAQI,
        },
      });
    },
    dismissDecisionEvent: () => set({ activeDecisionEvent: null }),

    // NEO CITY 6.0: Mega-Projects Progression Action
    contributeMegaProjectStage: (id) => {
      const state = get();
      const project = state.megaProjects.find((mp) => mp.id === id);
      if (!project) return false;

      const nextStageNum = project.currentStage + 1;
      const stage = project.stages.find((s) => s.stageNumber === nextStageNum);
      if (!stage) {
        alert('All stages for this megastructure are already completed.');
        return false;
      }

      if (state.stats.treasury < stage.costCredits) {
        alert(`Insufficient treasury. Requires ₡${stage.costCredits.toLocaleString()} Credits.`);
        return false;
      }
      if (state.stats.resources.materials.current < stage.costMaterials) {
        alert(`Insufficient raw materials. Requires ${stage.costMaterials} Materials (current: ${state.stats.resources.materials.current}).`);
        return false;
      }
      if (state.stats.resources.energy.current < stage.costEnergy) {
        alert(`Insufficient grid energy storage. Requires ${stage.costEnergy} MW (current: ${state.stats.resources.energy.current}).`);
        return false;
      }

      const updatedProjects = state.megaProjects.map((mp) => {
        if (mp.id !== id) return mp;
        const updatedStages = mp.stages.map((st) =>
          st.stageNumber === nextStageNum ? { ...st, isCompleted: true, progressCycles: st.durationCycles } : st
        );
        const newStage = nextStageNum;
        return {
          ...mp,
          currentStage: newStage,
          status: (newStage >= 3 ? 'completed' : 'under_construction') as 'under_construction' | 'completed',
          stages: updatedStages,
        };
      });

      const newEvent: CityEventLog = {
        id: `ev-${Date.now()}`,
        timestamp: state.stats.timeOfDay,
        type: 'success',
        message: `MEGA-PROJECT ADVANCED: [${project.name}] - ${stage.name}! New civilization bonuses active.`,
      };

      set({
        megaProjects: updatedProjects,
        events: [newEvent, ...state.events.slice(0, 9)],
        stats: {
          ...state.stats,
          treasury: state.stats.treasury - stage.costCredits,
          resources: {
            ...state.stats.resources,
            materials: {
              ...state.stats.resources.materials,
              current: state.stats.resources.materials.current - stage.costMaterials,
            },
            energy: {
              ...state.stats.resources.energy,
              current: state.stats.resources.energy.current - stage.costEnergy,
            },
          },
        },
      });

      return true;
    },

    // NEO CITY 6.0: Living Resource Market Actions
    buyResource: (type, amount) => {
      const state = get();
      const res = state.stats.resources[type];
      const cost = Math.round(res.marketPrice * amount);
      if (state.stats.treasury < cost) {
        alert(`Insufficient treasury funds. ₡${cost.toLocaleString()} required.`);
        return false;
      }
      const newStock = Math.min(res.capacity, res.current + amount);
      set({
        stats: {
          ...state.stats,
          treasury: state.stats.treasury - cost,
          resources: {
            ...state.stats.resources,
            [type]: {
              ...res,
              current: newStock,
              isShortage: false,
            },
          },
        },
      });
      return true;
    },

    sellResource: (type, amount) => {
      const state = get();
      const res = state.stats.resources[type];
      if (res.current < amount) {
        alert(`Insufficient stockpile to export.`);
        return false;
      }
      const revenue = Math.round(res.marketPrice * amount * 0.9); // 10% trade tariff
      set({
        stats: {
          ...state.stats,
          treasury: state.stats.treasury + revenue,
          resources: {
            ...state.stats.resources,
            [type]: {
              ...res,
              current: res.current - amount,
            },
          },
        },
      });
      return true;
    },

    // NEO CITY 9.0: Living Citizens & Trade Policies
    selectCitizen: (id: string | null) =>
      set((state) => ({
        stats: {
          ...state.stats,
          selectedCitizenId: id,
        },
      })),

    setTradePolicy: (res: ResourceType, policy: Partial<TradePolicy>) =>
      set((state) => {
        const currentPolicy = state.stats.tradePolicies?.[res] || DEFAULT_TRADE_POLICIES[res];
        return {
          stats: {
            ...state.stats,
            tradePolicies: {
              ...state.stats.tradePolicies,
              [res]: {
                ...currentPolicy,
                ...policy,
              },
            },
          },
        };
      }),

    // NEO CITY 6.0: Autonomous AI Director Actions
    applyAIRecommendation: (recId) => {
      const state = get();
      const rec = state.stats.aiDirector.recommendations.find((r) => r.id === recId);
      if (!rec) return;

      if (rec.cost && state.stats.treasury < rec.cost) {
        alert(`Insufficient treasury for recommendation. ₡${rec.cost.toLocaleString()} required.`);
        return;
      }

      if (rec.actionType === 'overhaul') {
        const cost = rec.cost || 50000;
        set({
          stats: {
            ...state.stats,
            treasury: state.stats.treasury - cost,
            aiDirector: {
              ...state.stats.aiDirector,
              infrastructureWear: Math.max(10, state.stats.aiDirector.infrastructureWear - 35),
              lastAutonomousAction: `Emergency preventative overhaul executed: ${rec.title}`,
              recommendations: state.stats.aiDirector.recommendations.filter((r) => r.id !== recId),
            },
          },
        });
      } else {
        if (rec.category === 'energy' || rec.category === 'expansion') {
          set({ activeDrawer: 'megaprojects' });
        } else {
          set({ activeDrawer: 'construction' });
        }
      }
    },

    toggleAutoMaintenance: () =>
      set((state) => ({
        stats: {
          ...state.stats,
          aiDirector: {
            ...state.stats.aiDirector,
            autoMaintenanceActive: !state.stats.aiDirector.autoMaintenanceActive,
            lastAutonomousAction: !state.stats.aiDirector.autoMaintenanceActive
              ? 'Autonomous municipal maintenance protocols enabled.'
              : 'Maintenance protocol suspended to manual executive mode.',
          },
        },
      })),

    performEmergencyMaintenance: () => {
      const state = get();
      if (state.stats.treasury < 60000) {
        alert('Insufficient treasury. ₡60,000 required for emergency maintenance overhaul.');
        return;
      }
      set({
        stats: {
          ...state.stats,
          treasury: state.stats.treasury - 60000,
          aiDirector: {
            ...state.stats.aiDirector,
            infrastructureWear: Math.max(8, state.stats.aiDirector.infrastructureWear - 40),
            lastAutonomousAction: 'Emergency infrastructure nanite maintenance overhaul deployed city-wide.',
          },
        },
      });
    },

    // NEO CITY 6.0: Emergencies & Disasters Actions
    triggerEmergency: (id) => {
      const pool = SIMULATION_EMERGENCIES_POOL;
      const target = pool.find((e) => e.id === id) || pool[Math.floor(Math.random() * pool.length)];
      set((state) => ({
        stats: {
          ...state.stats,
          activeEmergency: { ...target, remainingCycles: 5 },
        },
      }));
    },

    resolveEmergency: (optionId) => {
      const state = get();
      const emg = state.stats.activeEmergency;
      if (!emg) return;
      const opt = emg.options.find((o) => o.id === optionId);
      if (!opt) return;

      if (state.stats.treasury < opt.costCredits) {
        alert(`Insufficient credits. Requires ₡${opt.costCredits.toLocaleString()} CR.`);
        return;
      }

      const newEvent: CityEventLog = {
        id: `ev-${Date.now()}`,
        timestamp: state.stats.timeOfDay,
        type: 'success',
        message: `EMERGENCY RESOLVED: [${emg.title}]. Order: "${opt.label}". ${opt.resolutionEffect}`,
      };

      set({
        events: [newEvent, ...state.events.slice(0, 9)],
        stats: {
          ...state.stats,
          activeEmergency: null,
          treasury: state.stats.treasury - opt.costCredits,
        },
      });
    },

    dismissEmergency: () =>
      set((state) => ({
        stats: { ...state.stats, activeEmergency: null },
      })),

    // Dedicated Multi-Slot Persistence System (SaveManager IndexedDB + LocalStorage)
    getSerializableSaveData: () => {
      const state = get();
      const unlockedTechIds = state.techTree.filter((t) => t.unlocked).map((t) => t.id);
      const claimedMissionIds = state.missions.filter((m) => m.claimed).map((m) => m.id);
      const activePolicyIds = state.districtPolicies.filter((p) => p.active).map((p) => p.id);
      const now = Date.now();
      const dateStr = new Date(now).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

      return {
        version: 6,
        schemaVersion: '6.0.0',
        timestamp: now,
        savedAtFormatted: dateStr,
        slotId: 'slot_1',
        slotName: 'Archive Slot 1 (Primary)',
        cityName: state.cityName,
        densityMode: state.densityMode,
        stats: state.stats,
        buildings: state.buildings,
        events: state.events,
        taxRate: state.taxRate,
        budgetAllocations: state.budgetAllocations,
        unlockedTechIds,
        claimedMissionIds,
        activePolicyIds,
        megaProjects: state.megaProjects,
      };
    },

    saveToSlot: async (slotId: string, slotName?: string) => {
      const state = get();
      const data = state.getSerializableSaveData();
      data.slotId = slotId;
      if (slotName) data.slotName = slotName;

      const success = await SaveManager.saveGame(slotId, data.slotName, data);
      if (success) {
        const newEvent: CityEventLog = {
          id: `ev-${Date.now()}`,
          timestamp: state.stats.timeOfDay,
          type: 'success',
          message: `Civilization state saved to [${data.slotName}] at ${data.savedAtFormatted}.`,
        };
        set({
          events: [newEvent, ...state.events.slice(0, 9)],
          stats: { ...state.stats, autoSaveTimestamp: data.savedAtFormatted },
        });
      }
      return success;
    },

    loadFromSlot: async (slotId: string) => {
      try {
        const data = await SaveManager.loadGame(slotId);
        if (!data || !data.buildings || !data.stats) {
          alert('Could not load archive or slot is empty.');
          return false;
        }

        const unlockedSet = new Set(data.unlockedTechIds || ['tech-magnetic-fusion']);
        const restoredTechTree = TECH_TREE_DATA.map((t) => ({
          ...t,
          unlocked: unlockedSet.has(t.id),
        }));

        const restoredBlueprints = [...BUILDING_BLUEPRINTS, ...RESEARCH_UNLOCKED_BLUEPRINTS].map((b) => {
          if (b.requiredTechId) {
            return { ...b, isLocked: !unlockedSet.has(b.requiredTechId) };
          }
          return b;
        });

        const claimedSet = new Set(data.claimedMissionIds || []);
        const restoredMissions = INITIAL_MISSIONS.map((m) => ({
          ...m,
          claimed: claimedSet.has(m.id),
        }));

        const newTotals = recalculateCitySystems(
          data.buildings,
          data.stats.population,
          data.taxRate || 8,
          restoredTechTree
        );

        const restoreEvent: CityEventLog = {
          id: `ev-${Date.now()}`,
          timestamp: data.stats.timeOfDay,
          type: 'info',
          message: `Civilization restored from [${data.slotName || slotId}] (${data.savedAtFormatted}).`,
        };

        const restoredPolicies = INITIAL_DISTRICT_POLICIES.map((p) => ({
          ...p,
          active: data.activePolicyIds ? data.activePolicyIds.includes(p.id) : p.active,
        }));

        const restoredMegaProjects = data.megaProjects || INITIAL_MEGA_PROJECTS;

        set({
          cityName: data.cityName || 'NOVA PRIME',
          densityMode: data.densityMode || 'medium',
          buildings: data.buildings,
          techTree: restoredTechTree,
          blueprints: restoredBlueprints,
          missions: restoredMissions,
          districtPolicies: restoredPolicies,
          megaProjects: restoredMegaProjects,
          weather: data.stats.weather || 'clear',
          stats: {
            ...data.stats,
            totalHousingCapacity: newTotals.totalHousing,
            totalJobs: newTotals.totalJobs,
            powerCapacity: newTotals.totalPowerGen,
            powerUsage: newTotals.totalPowerLoad,
            waterCapacity: newTotals.totalWaterGen,
            waterUsage: newTotals.totalWaterLoad,
            happiness: newTotals.calculatedHappiness,
            transitStats: newTotals.transitStats,
            demographics: newTotals.demographics,
            resources: data.stats.resources || newTotals.resources,
            aiDirector: data.stats.aiDirector || {
              threatLevel: newTotals.threatLevel,
              infrastructureWear: newTotals.infrastructureWear,
              autoMaintenanceActive: true,
              lastAutonomousAction: 'System restore completed.',
              recommendations: newTotals.aiRecommendations,
            },
            districtEvolution: data.stats.districtEvolution || newTotals.districtEvolution,
            activeEmergency: data.stats.activeEmergency || null,
            qualityOfLife: data.stats.qualityOfLife || newTotals.qualityOfLife,
            districtStats: data.stats.districtStats || newTotals.districtStats,
            simulatedCitizens: data.stats.simulatedCitizens || initializeSimulatedCitizens(data.buildings, 160),
            selectedCitizenId: null,
            commercialHealth: data.stats.commercialHealth ?? newTotals.commercialHealth,
            industrialOutput: data.stats.industrialOutput ?? newTotals.industrialOutput,
            healthcareCoverage: data.stats.healthcareCoverage ?? newTotals.healthcareCoverage,
            educationRating: data.stats.educationRating ?? newTotals.educationRating,
            tradePolicies: data.stats.tradePolicies || DEFAULT_TRADE_POLICIES,
          },
          events: [restoreEvent, ...(data.events || []).slice(0, 9)],
          taxRate: data.taxRate || 8,
          budgetAllocations: data.budgetAllocations || get().budgetAllocations,
          selectedBuildingId: null,
        });

        return true;
      } catch (err) {
        console.error('Error loading save slot:', err);
        return false;
      }
    },

    deleteSlot: async (slotId: string) => {
      const success = await SaveManager.deleteGame(slotId);
      return success;
    },

    manualSave: () => {
      const state = get();
      state.saveToSlot('slot_1', 'Archive Slot 1 (Primary)');
    },

    loadCivilization: () => {
      const state = get();
      state.loadFromSlot('slot_1');
      return true;
    },

    resetCivilization: () => {
      if (confirm('Reset Nova Prime to baseline era state? All custom structures will reset.')) {
        localStorage.removeItem(SAVE_STORAGE_KEY);
        const freshTech = TECH_TREE_DATA;
        const freshBlueprints = [...BUILDING_BLUEPRINTS, ...RESEARCH_UNLOCKED_BLUEPRINTS];
        const resetTotals = recalculateCitySystems(INITIAL_BUILDINGS, 58420, 8, freshTech);
        set({
          buildings: INITIAL_BUILDINGS,
          techTree: freshTech,
          blueprints: freshBlueprints,
          missions: INITIAL_MISSIONS,
          megaProjects: INITIAL_MEGA_PROJECTS,
          selectedBuildingId: null,
          taxRate: 8,
          events: INITIAL_EVENTS,
          stats: {
            population: 58420,
            totalHousingCapacity: resetTotals.totalHousing,
            populationGrowthRate: 3.2,
            totalJobs: resetTotals.totalJobs,
            employedCitizens: resetTotals.employed,
            unemploymentRate: resetTotals.unemployment,
            treasury: 2850000,
            incomePerTick: resetTotals.totalRevenue,
            expensesPerTick: resetTotals.totalExpenses,
            happiness: resetTotals.calculatedHappiness,
            powerUsage: resetTotals.totalPowerLoad,
            powerCapacity: resetTotals.totalPowerGen,
            waterUsage: resetTotals.totalWaterLoad,
            waterCapacity: resetTotals.totalWaterGen,
            powerDeficit: resetTotals.powerDeficit,
            waterDeficit: resetTotals.waterDeficit,
            pollution: resetTotals.rawAQI,
            weather: 'clear',
            lightingMode: 'day',
            timeOfDay: '14:30',
            cycleCount: 152,
            era: 'ERA III // SOLARIS',
            researchPoints: 340,
            researchPointsPerTick: resetTotals.rpPerTick,
            civLevel: 3,
            civXP: 450,
            civXPToNextLevel: 1000,
            transitStats: resetTotals.transitStats,
            demographics: resetTotals.demographics,
            resources: resetTotals.resources,
            aiDirector: {
              threatLevel: resetTotals.threatLevel,
              infrastructureWear: resetTotals.infrastructureWear,
              autoMaintenanceActive: true,
              lastAutonomousAction: 'Civilization baseline state reset.',
              recommendations: resetTotals.aiRecommendations,
            },
            districtEvolution: resetTotals.districtEvolution,
            activeEmergency: null,
            qualityOfLife: resetTotals.qualityOfLife,
            districtStats: resetTotals.districtStats,
            simulatedCitizens: initializeSimulatedCitizens(INITIAL_BUILDINGS, 160),
            selectedCitizenId: null,
            commercialHealth: resetTotals.commercialHealth,
            industrialOutput: resetTotals.industrialOutput,
            healthcareCoverage: resetTotals.healthcareCoverage,
            educationRating: resetTotals.educationRating,
            tradePolicies: DEFAULT_TRADE_POLICIES,
          },
        });
      }
    },

    // Centralized Simulation Tick Loop with Decoupled Schedulers
    tick: () => {
      const {
        isRunning,
        speed,
        stats,
        taxRate,
        buildings,
        events,
        techTree,
        missions,
        districtPolicies,
        activeDecisionEvent,
        megaProjects,
      } = get();
      if (!isRunning || speed === 0) return;

      // Clock progression
      const [hStr, mStr] = stats.timeOfDay.split(':');
      let hours = parseInt(hStr, 10);
      let mins = parseInt(mStr, 10) + speed;
      let cycle = stats.cycleCount;

      if (mins >= 60) {
        hours = (hours + Math.floor(mins / 60)) % 24;
        mins = mins % 60;
        if (hours === 0 && mins < speed) {
          cycle += 1;
        }
      }

      const timeFormatted = `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;

      // Decoupled Simulation Schedulers:
      // High-frequency (every tick): clock, treasury surplus, RP
      // Mid-frequency (every 3 ticks): deep economy balancing, district evolution
      // Low-frequency (every 8 ticks ~1.3s): citizen routing & path generation
      simTickCounter = (simTickCounter + 1) % 240;
      const shouldRunSys = !cachedSysCalc || simTickCounter % 3 === 0;
      const shouldRunEconomy = !cachedEconomyCalc || simTickCounter % 3 === 0;
      const shouldRunCitizens = !cachedCitizensCalc || simTickCounter % 8 === 0;

      // Recalculate systems with district policies & megaprojects
      const sys = shouldRunSys
        ? (cachedSysCalc = recalculateCitySystems(
            buildings,
            stats.population,
            taxRate,
            techTree,
            districtPolicies,
            megaProjects,
            stats.resources,
            stats.districtEvolution,
            stats.aiDirector.infrastructureWear,
            stats.aiDirector.autoMaintenanceActive
          ))
        : (cachedSysCalc || recalculateCitySystems(buildings, stats.population, taxRate, techTree));

      // Living Economy Cycle: dynamic pricing, production, consumption, automated trade
      const economyResult = shouldRunEconomy
        ? (cachedEconomyCalc = processEconomyCycle(
            sys.resources,
            stats.tradePolicies || DEFAULT_TRADE_POLICIES,
            stats.treasury,
            speed
          ))
        : (cachedEconomyCalc || { updatedInventory: sys.resources, tradeRevenueTotal: 0, tradeCostTotal: 0, tradeNotifications: [] });
      const liveResources = economyResult.updatedInventory;

      // Update simulated citizens routines & satisfaction
      const currentCitizens = stats.simulatedCitizens && stats.simulatedCitizens.length > 0
        ? stats.simulatedCitizens
        : initializeSimulatedCitizens(buildings, 160);

      const updatedCitizens = shouldRunCitizens
        ? (cachedCitizensCalc = updateCitizenRoutines(
            currentCitizens,
            buildings,
            timeFormatted,
            stats.weather,
            sys.rawAQI,
            sys.unemployment,
            sys.calculatedHappiness
          ))
        : (cachedCitizensCalc || currentCitizens);

      // Population dynamics (migration response to happiness and housing)
      let popDelta = 0;
      if (sys.calculatedHappiness >= 75 && sys.totalHousing > stats.population) {
        popDelta = Math.floor((Math.random() * 6 + 4) * speed);
      } else if (sys.calculatedHappiness < 45 || liveResources.food.isShortage) {
        popDelta = -Math.floor((Math.random() * 5 + 3) * speed);
      } else {
        popDelta = Math.floor((Math.random() * 2) * speed);
      }

      const newPop = Math.max(1000, stats.population + popDelta);

      // Economy net treasury delta
      const netSurplus = sys.totalRevenue - sys.totalExpenses;
      const treasuryDelta = Math.round(netSurplus * (speed * 0.12)) + economyResult.tradeRevenueTotal - economyResult.tradeCostTotal;
      const newTreasury = Math.max(0, stats.treasury + treasuryDelta);

      // Passive Research Points generated per tick
      const rpEarned = Math.floor(sys.rpPerTick * (speed * 0.2));
      const newRP = stats.researchPoints + rpEarned;

      // Active Decision Event management
      let currentEvent = activeDecisionEvent;
      let updatedEvents = events;

      if (economyResult.tradeNotifications.length > 0 && Math.random() < 0.08) {
        updatedEvents = [
          {
            id: `ev-${Date.now()}`,
            timestamp: timeFormatted,
            type: 'info',
            message: `MUNICIPAL TRADE: ${economyResult.tradeNotifications[0]}`,
          },
          ...updatedEvents.slice(0, 9),
        ];
      }

      if (currentEvent) {
        if (mins < speed) {
          const newRemaining = currentEvent.cycleRemaining - 1;
          if (newRemaining <= 0) {
            updatedEvents = [
              {
                id: `ev-${Date.now()}`,
                timestamp: timeFormatted,
                type: 'warning',
                message: `EVENT CONCLUDED: [${currentEvent.title}] expired with baseline civic response.`,
              },
              ...updatedEvents.slice(0, 9),
            ];
            currentEvent = null;
          } else {
            currentEvent = { ...currentEvent, cycleRemaining: newRemaining };
          }
        }
      } else if (Math.random() < 0.012 * speed) {
        // Contextually pick decision event based on city conditions
        let candidate: CityDecisionEvent | null = null;
        if (sys.totalHousing < stats.population * 1.05) {
          candidate = CITY_DECISION_EVENTS_POOL.find((e) => e.id === 'dev-housing-shortage') || null;
        } else if (sys.unemployment > 14) {
          candidate = CITY_DECISION_EVENTS_POOL.find((e) => e.id === 'dev-employment-crisis') || null;
        } else if (liveResources.water.isShortage) {
          candidate = CITY_DECISION_EVENTS_POOL.find((e) => e.id === 'dev-water-shortage') || null;
        } else if (liveResources.energy.current > liveResources.energy.capacity * 0.85) {
          candidate = CITY_DECISION_EVENTS_POOL.find((e) => e.id === 'dev-energy-surplus') || null;
        } else if (sys.commercialHealth > 82) {
          candidate = CITY_DECISION_EVENTS_POOL.find((e) => e.id === 'dev-commercial-boom') || null;
        } else if (sys.rpPerTick > 35) {
          candidate = CITY_DECISION_EVENTS_POOL.find((e) => e.id === 'dev-research-breakthrough') || null;
        }

        if (!candidate) {
          candidate = CITY_DECISION_EVENTS_POOL[Math.floor(Math.random() * CITY_DECISION_EVENTS_POOL.length)];
        }

        currentEvent = { ...candidate, cycleRemaining: 4 };
        updatedEvents = [
          {
            id: `ev-${Date.now()}`,
            timestamp: timeFormatted,
            type: candidate.severity === 'critical' || candidate.severity === 'high' ? 'alert' : 'info',
            message: `CIVIC DIRECTIVE REQUIRED: "${candidate.title}". Awaiting Executive resolution.`,
          },
          ...updatedEvents.slice(0, 9),
        ];
      }

      // Simulation-Driven Emergencies & Disasters management
      let currentEmergency = stats.activeEmergency;
      if (currentEmergency) {
        if (mins < speed) {
          const remaining = currentEmergency.remainingCycles - 1;
          if (remaining <= 0) {
            updatedEvents = [
              {
                id: `ev-${Date.now()}`,
                timestamp: timeFormatted,
                type: 'alert',
                message: `EMERGENCY CRITICAL FALLOUT: [${currentEmergency.title}] timed out unresolved! Severe economic penalty imposed.`,
              },
              ...updatedEvents.slice(0, 9),
            ];
            currentEmergency = null;
          } else {
            currentEmergency = { ...currentEmergency, remainingCycles: remaining };
          }
        }
      } else if (Math.random() < 0.006 * speed) {
        // Evaluate condition-driven emergency triggers
        let emgCandidate: EmergencyDisaster | null = null;
        if (sys.infrastructureWear > 70) {
          emgCandidate = SIMULATION_EMERGENCIES_POOL.find((e) => e.category === 'infrastructure_breakdown') || null;
        } else if (sys.powerDeficit) {
          emgCandidate = SIMULATION_EMERGENCIES_POOL.find((e) => e.category === 'power_grid_overload') || null;
        } else if (sys.waterDeficit) {
          emgCandidate = SIMULATION_EMERGENCIES_POOL.find((e) => e.category === 'water_aquifer_shortage') || null;
        } else if (sys.transitStats.congestionIndex > 65) {
          emgCandidate = SIMULATION_EMERGENCIES_POOL.find((e) => e.category === 'transport_network_failure') || null;
        } else if (Math.random() < 0.3) {
          emgCandidate = SIMULATION_EMERGENCIES_POOL[Math.floor(Math.random() * SIMULATION_EMERGENCIES_POOL.length)];
        }

        if (emgCandidate) {
          currentEmergency = { ...emgCandidate, remainingCycles: 5 };
          updatedEvents = [
            {
              id: `ev-${Date.now()}`,
              timestamp: timeFormatted,
              type: 'alert',
              message: `METROPOLITAN CRISIS ALERT: ${emgCandidate.title}! Open Emergency Command immediately.`,
            },
            ...updatedEvents.slice(0, 9),
          ];
        }
      }

      // Milestone 03 & 05: Live Mission State Evaluation
      const residentialCount = buildings.filter((b) => b.type === 'residential_tower').length;
      const powerSurplus = Math.max(0, sys.totalPowerGen - sys.totalPowerLoad);
      const unlockedTechCount = techTree.filter((t) => t.unlocked).length;

      const evaluatedMissions = missions.map((mission) => {
        let curVal = mission.currentValue;

        switch (mission.targetType) {
          case 'population':
            curVal = newPop;
            break;
          case 'happiness':
            curVal = sys.calculatedHappiness;
            break;
          case 'power_surplus':
            curVal = powerSurplus;
            break;
          case 'residential_count':
            curVal = residentialCount;
            break;
          case 'aqi_below':
            curVal = sys.rawAQI;
            break;
          case 'districts_connected':
            curVal = sys.transitStats.activeRoutesCount;
            break;
          case 'treasury':
            curVal = newTreasury;
            break;
          case 'tech_unlocked':
            curVal = unlockedTechCount;
            break;
          case 'commute_time':
            curVal = sys.transitStats.avgCommuteMinutes;
            break;
        }

        const isNowCompleted =
          mission.targetType === 'aqi_below' || mission.targetType === 'commute_time'
            ? curVal <= mission.targetValue
            : curVal >= mission.targetValue;

        if (isNowCompleted && !mission.isCompleted) {
          updatedEvents = [
            {
              id: `ev-${Date.now()}`,
              timestamp: timeFormatted,
              type: 'success',
              message: `OBJECTIVE COMPLETED: "${mission.title}"! Open Directives to claim rewards.`,
            },
            ...updatedEvents.slice(0, 9),
          ];
        }

        return {
          ...mission,
          currentValue: curVal,
          isCompleted: isNowCompleted,
        };
      });

      // Dynamic Ambient Event triggers
      if (Math.random() < 0.02 * speed) {
        const dynamicEvents = [
          { type: 'success' as const, msg: 'Living resource exchange reports quantum arbitrage trading surplus.' },
          { type: 'info' as const, msg: 'Autonomous city drone maintenance completed scheduled sector diagnostics.' },
          { type: 'warning' as const, msg: 'Atmospheric geo-scrubbers operational at 100% capacity.' },
          { type: 'success' as const, msg: 'Nova Bay aquaculture units record record crystalline nutrient harvest.' },
          { type: 'info' as const, msg: 'Autonomous AI Director synchronized microgrid power distribution.' },
        ];
        const chosen = dynamicEvents[Math.floor(Math.random() * dynamicEvents.length)];
        updatedEvents = [
          {
            id: `ev-${Date.now()}`,
            timestamp: timeFormatted,
            type: chosen.type,
            message: chosen.msg,
          },
          ...updatedEvents.slice(0, 9),
        ];
      }

      set({
        events: updatedEvents,
        missions: evaluatedMissions,
        activeDecisionEvent: currentEvent,
        stats: {
          ...stats,
          cycleCount: cycle,
          timeOfDay: timeFormatted,
          population: newPop,
          totalHousingCapacity: sys.totalHousing,
          totalJobs: sys.totalJobs,
          employedCitizens: sys.employed,
          unemploymentRate: sys.unemployment,
          treasury: newTreasury,
          incomePerTick: sys.totalRevenue,
          expensesPerTick: sys.totalExpenses,
          powerUsage: sys.totalPowerLoad,
          powerCapacity: sys.totalPowerGen,
          waterUsage: sys.totalWaterLoad,
          waterCapacity: sys.totalWaterGen,
          powerDeficit: sys.powerDeficit,
          waterDeficit: sys.waterDeficit,
          happiness: sys.calculatedHappiness,
          pollution: sys.rawAQI,
          researchPoints: newRP,
          researchPointsPerTick: sys.rpPerTick,
          transitStats: sys.transitStats,
          demographics: sys.demographics,
          resources: liveResources,
          districtEvolution: sys.districtEvolution,
          aiDirector: {
            ...stats.aiDirector,
            threatLevel: sys.threatLevel,
            infrastructureWear: sys.infrastructureWear,
            recommendations: sys.aiRecommendations,
          },
          activeEmergency: currentEmergency,
          qualityOfLife: sys.qualityOfLife,
          districtStats: sys.districtStats,
          simulatedCitizens: updatedCitizens,
          commercialHealth: sys.commercialHealth,
          industrialOutput: sys.industrialOutput,
          healthcareCoverage: sys.healthcareCoverage,
          educationRating: sys.educationRating,
        },
      });
    },
  };
});
