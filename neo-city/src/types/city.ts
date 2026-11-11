export type BuildingType = 
  | 'skyscraper'
  | 'corporate_hq'
  | 'residential_tower'
  | 'tech_hub'
  | 'power_plant'
  | 'research_facility'
  | 'commercial_block'
  | 'eco_dome'
  | 'park_monument'
  | 'water_facility'
  | 'landmark'
  | 'civic_facility'
  | 'logistics_hub'
  | 'hovering_structure'
  | 'transit_terminal';

export type ArchitecturalStyle =
  | 'glass_spire'
  | 'white_futurist'
  | 'warm_metallic'
  | 'colourful_residential'
  | 'terrace_green'
  | 'landmark'
  | 'fusion_core'
  | 'helix_spiral'
  | 'twin_arcology'
  | 'floating_crown'
  | 'quantum_needle'
  | 'neon_pyramid'
  | 'plasma_core'
  | 'curved_glass'
  | 'industrial_complex'
  | 'cyber_arcade'
  | 'hover_platform'
  // Neo City 8.0 Visual Reconstruction - 35 Architectural Styles
  | 'holographic_entertainment'
  | 'quantum_research_tower'
  | 'biomimetic_dome'
  | 'suspended_sky_residence'
  | 'spaceport_terminal'
  | 'superconducting_facility'
  | 'cyber_financial_tower'
  | 'luxury_arcology'
  | 'robotic_foundry'
  | 'grand_museum'
  | 'futuristic_hospital'
  | 'university_academy'
  | 'logistics_megahub'
  | 'retail_pavilion'
  | 'marine_research_station'
  | 'hydroponic_vertical_farm'
  | 'solar_collector_spire'
  | 'monumental_megastructure';

export type DistrictType = 'downtown' | 'tech_district' | 'residential' | 'industrial' | 'green_zone' | 'waterfront';
export type DistrictDensity = 'low' | 'medium' | 'high';

export interface BuildingData {
  id: string;
  name: string;
  type: BuildingType;
  style: ArchitecturalStyle;
  district: DistrictType;
  position: [number, number, number]; // [x, y, z]
  dimensions: [number, number, number]; // [width, height, depth]
  rotation?: number; // radians (0, PI/2, PI, 3PI/2)
  height: number;
  level: number;
  occupancy: number; // current occupants (citizens or workers)
  maxOccupancy: number; // max residential or commercial capacity
  jobsProvided: number; // employment slots
  powerConsumption: number; // MW
  powerProduction?: number; // MW
  waterConsumption: number; // ML/cycle
  waterProduction?: number; // ML/cycle
  revenue: number; // credits/cycle
  maintenanceCost: number; // credits/cycle
  pollution: number; // AQI impact (+ or -)
  happinessImpact: number; // +/- percentage
  status: 'optimal' | 'warning' | 'critical' | 'constructing';
  details: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  windowGlowColor: string;
  hasAntenna?: boolean;
  hasHelipad?: boolean;
  hasHoloBanner?: boolean;
  hasSkybridge?: boolean;
  hasRooftopPool?: boolean;
  hasTerraceGardens?: boolean;
  tierName?: string;
  tierDescription?: string;
  transforming?: boolean;
  operationalMode?: 'optimal' | 'overclocked' | 'eco_saver';
}

export type WeatherType = 'clear' | 'cyber_rain' | 'neon_smog' | 'aurora_storm';

export interface DistrictPolicy {
  id: string;
  name: string;
  description: string;
  district: DistrictType;
  active: boolean;
  costPerTick: number;
  effects: {
    revenueMult?: number;
    powerMult?: number;
    pollutionDelta?: number;
    happinessDelta?: number;
    transitBonus?: number;
    growthBonus?: number;
  };
}

export interface DecisionChoice {
  id: string;
  label: string;
  description: string;
  costCredits?: number;
  effects: {
    happinessDelta?: number;
    treasuryDelta?: number;
    rpDelta?: number;
    pollutionDelta?: number;
    transitDelta?: number;
    powerCapDelta?: number;
  };
}

export interface CityDecisionEvent {
  id: string;
  title: string;
  description: string;
  district?: DistrictType;
  category: 'energy' | 'economy' | 'transit' | 'environment' | 'culture' | 'technology';
  severity: 'low' | 'medium' | 'high' | 'critical';
  choices: DecisionChoice[];
  cycleRemaining: number;
}

export type ActiveTab = 'overview' | 'builder' | 'infrastructure' | 'economy' | 'environment';

export type SimulationSpeed = 0 | 1 | 2 | 5;

export type LightingMode = 'day' | 'sunset' | 'night';

// ==========================================
// FEATURE 6: GRAPHICS PRESETS & OPTIMIZATION
// ==========================================
export type GraphicsPreset = 'performance' | 'balanced' | 'ultra' | 'low' | 'medium' | 'high';
export type ShadowQuality = 'off' | 'low' | 'high' | 'ultra';

export interface GraphicsSettings {
  preset: GraphicsPreset;
  shadowQuality: ShadowQuality;
  renderScale: number; // 0.75 | 0.85 | 1.0 | 1.25 | 1.5
  trafficCount: number; // 24 | 48 | 80
  pedestrianCount: number; // 60 | 120 | 200
  lodThreshold: number; // distance units (e.g. 60, 110, 200)
  bloomEffects: boolean;
  showPerfMonitor: boolean;
  autoCalibrated?: boolean;
}

export interface PerformanceTelemetry {
  fps: number;
  frameTimeMs: number;
  drawCalls: number;
  triangles: number;
  geometries: number;
  textures: number;
  activePedestrians: number;
  activeVehicles: number;
}

// ==========================================
// NEO CITY 6.0 & 9.0: LIVING ECONOMY & RESOURCE CHAINS
// ==========================================
export type ResourceType = 'energy' | 'water' | 'food' | 'materials' | 'manufactured_goods' | 'services';

export interface ResourceState {
  current: number;
  capacity: number;
  production: number; // per tick
  consumption: number; // per tick
  marketPrice: number; // credits per unit
  basePrice: number;
  trend: 'rising' | 'falling' | 'stable';
  isShortage: boolean;
}

export interface TradePolicy {
  autoImport: boolean;
  autoExport: boolean;
  minReserve: number;
  maxStockpile: number;
  tariffRate: number; // percentage e.g. 0.08
}

export type ResourceInventory = Record<ResourceType, ResourceState>;

// ==========================================
// NEO CITY 9.0: LIVING CITIZEN SIMULATION TYPES
// ==========================================
export type CitizenActivity =
  | 'resting_at_home'
  | 'commuting_to_work'
  | 'working'
  | 'dining_and_retail'
  | 'visiting_park'
  | 'seeking_medical_care'
  | 'commuting_home'
  | 'nightlife_entertainment';

export type EducationTier = 'basic' | 'secondary' | 'advanced' | 'quantum_scholar';

export interface SimulatedCitizen {
  id: string;
  name: string;
  age: number;
  gender: 'M' | 'F' | 'NB';
  homeBuildingId: string;
  homeBuildingName: string;
  homeDistrict: DistrictType;
  workBuildingId: string | null;
  workBuildingName: string | null;
  workDistrict: DistrictType | null;
  occupation: string;
  education: EducationTier;
  health: number; // 0 - 100
  happiness: number; // 0 - 100
  activity: CitizenActivity;
  activityProgress: number; // 0 - 1
  destinationBuildingId: string | null;
  destinationName: string | null;
  currentPos: [number, number, number];
  targetPos: [number, number, number];
  speed: number;
  suitColor: string;
  visorColor: string;
  commuteMode: 'walking' | 'hover_transit' | 'maglev' | 'aerial_taxi';
}

// ==========================================
// NEO CITY 9.0: QUALITY OF LIFE & DISTRICT LIFE
// ==========================================
export interface QualityOfLifeMetrics {
  overallHappiness: number;
  housingScore: number;
  employmentScore: number;
  healthcareScore: number;
  educationScore: number;
  environmentScore: number;
  transitScore: number;
  safetyScore: number;
  servicesScore: number;
  taxSatisfactionScore: number;
  history: number[]; // 24-tick sparkline history
}

export interface DistrictDetailedStats {
  district: DistrictType;
  name: string;
  population: number;
  housingCapacity: number;
  jobsAvailable: number;
  jobsEmployed: number;
  unemploymentRate: number;
  averageHappiness: number;
  averageAQI: number;
  powerDemand: number;
  waterDemand: number;
  commercialRevenue: number;
  industrialOutput: number;
  transitTraffic: number;
  amenitiesScore: number;
  residentialDemand: number;
  commercialDemand: number;
  industrialProduction: number;
  landValue: number;
  transportAccessibility: number;
  growthRate: number;
  autonomousTier: number;
}

export interface BuildingOperationalMetrics {
  buildingId: string;
  currentWorkers: number;
  maxWorkers: number;
  productivityIndex: number; // 0 - 100%
  customerTraffic: number; // visitors per cycle
  resourceOutputUnits: number; // output per cycle
  operationalHealth: number; // 0 - 100%
  serviceRadius: number; // meters
}

// ==========================================
// NEO CITY 6.0: AUTONOMOUS CITY AI DIRECTOR
// ==========================================
export interface AIRecommendation {
  id: string;
  category: 'economy' | 'energy' | 'transit' | 'environment' | 'infrastructure' | 'expansion';
  priority: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  actionLabel?: string;
  actionType?: 'policy' | 'blueprint' | 'research' | 'overhaul' | 'emergency_repair';
  actionTargetId?: string;
  cost?: number;
  applied?: boolean;
}

export interface AIDirectorState {
  threatLevel: 'nominal' | 'elevated' | 'critical';
  infrastructureWear: number; // 0 - 100%
  autoMaintenanceActive: boolean;
  lastAutonomousAction: string;
  recommendations: AIRecommendation[];
}

// ==========================================
// NEO CITY 6.0: DISTRICT EVOLUTION
// ==========================================
export type DistrictTier = 1 | 2 | 3 | 4; // 1: Emerging, 2: Developing, 3: Advanced, 4: Autonomous Apex

export interface DistrictEvolutionState {
  district: DistrictType;
  name: string;
  tier: DistrictTier;
  developmentScore: number; // 0 - 100
  prosperity: number; // 0 - 100
  infrastructureHealth: number; // 0 - 100
  passengerDemand: number;
  cargoDemand: number;
  unlockedPerks: string[];
  bannerColor: string;
  accentGlow: string;
}

// ==========================================
// NEO CITY 6.0: MEGA-PROJECTS
// ==========================================
export type MegaProjectId =
  | 'orbital_elevator'
  | 'fusion_power_complex'
  | 'climate_restoration'
  | 'research_megacomplex'
  | 'intercontinental_skyport';

export interface MegaProjectStage {
  stageNumber: number; // 1, 2, 3
  name: string;
  description: string;
  costCredits: number;
  costMaterials: number;
  costEnergy: number;
  durationCycles: number;
  progressCycles: number;
  isCompleted: boolean;
}

export interface MegaProjectData {
  id: MegaProjectId;
  name: string;
  codenamed: string;
  description: string;
  location: [number, number, number];
  dimensions: [number, number, number];
  currentStage: number; // 0 = not started, 1 = stage 1, 2 = stage 2, 3 = completed
  stages: MegaProjectStage[];
  status: 'locked' | 'unlocked' | 'under_construction' | 'completed';
  requiredTechId: string;
  bonusesDescription: string[];
  activePerks: {
    unlimitedPower?: boolean;
    zeroPollution?: boolean;
    tradeRevenueBonus?: number;
    researchBoost?: number;
    transitMaxEfficiency?: boolean;
  };
}

// ==========================================
// NEO CITY 6.0: EMERGENCIES & DISASTERS
// ==========================================
export type EmergencyCategory =
  | 'power_grid_overload'
  | 'water_aquifer_shortage'
  | 'transport_network_failure'
  | 'industrial_accident'
  | 'severe_cyber_weather'
  | 'infrastructure_breakdown';

export interface EmergencyDisaster {
  id: string;
  category: EmergencyCategory;
  title: string;
  description: string;
  cause: string;
  severity: 'moderate' | 'severe' | 'catastrophic';
  active: boolean;
  district?: DistrictType;
  remainingCycles: number;
  effectsSummary: string;
  options: {
    id: string;
    label: string;
    costCredits: number;
    costMaterials?: number;
    resolutionEffect: string;
  }[];
}

// ==========================================
// SYSTEM 2: ADVANCED TRANSPORTATION TYPES
// ==========================================
export interface CorridorTrafficData {
  id: string;
  name: string;
  type: 'road' | 'bridge' | 'maglev' | 'aerial';
  density: number; // 0 - 100 percentage
  avgSpeedKmH: number;
  delaySeconds: number;
  status: 'smooth' | 'moderate' | 'congested' | 'gridlock';
}

export interface TransitStats {
  congestionIndex: number; // 0 - 100 percentage
  avgCommuteMinutes: number; // e.g. 14.8 minutes
  efficiencyPercent: number; // 0 - 100 percentage
  hoverPodsActive: number; // count of pods on road
  transitDemand: number; // daily transit passenger demand
  transitCapacity: number; // max throughput
  activeRoutesCount: number; // interconnected corridors
  adaptiveSignalsActive: boolean;
  smartLightingActive: boolean;
  junctionDelaysPercent: number;
  publicTransitShare: number;
  corridors?: CorridorTrafficData[];
}

// ==========================================
// SYSTEM 3: RESEARCH & TECHNOLOGY TYPES
// ==========================================
export type ResearchCategory =
  | 'clean_energy'
  | 'ai'
  | 'advanced_arch'
  | 'transportation'
  | 'biotech'
  | 'environmental';

export interface TechNode {
  id: string;
  name: string;
  category: ResearchCategory;
  costRP: number; // Research Points cost
  costCredits: number; // Treasury Credits cost
  prerequisites: string[]; // Tech IDs required before unlocking
  perkDescription: string;
  unlocked: boolean;
  iconName: string;
  unlocksBlueprintId?: string; // If this tech unlocks a new building
  effects: {
    powerEfficiency?: number; // e.g. +0.20 (+20% power output)
    waterEfficiency?: number; // e.g. +0.25 (+25% water yield)
    transitEfficiency?: number; // e.g. +0.20 (+20% transit flow)
    happinessBonus?: number; // e.g. +5% happiness
    pollutionBonus?: number; // e.g. -15 AQI reduction
    incomeMultiplier?: number; // e.g. +0.10 (+10% revenue)
    constructionCostReduction?: number; // e.g. 0.20 (20% off)
  };
}

// ==========================================
// SYSTEM 4: MISSIONS & PROGRESSION TYPES
// ==========================================
export type MissionCategory = 'daily' | 'milestone' | 'district';

export type MissionTargetType =
  | 'population'
  | 'happiness'
  | 'power_surplus'
  | 'residential_count'
  | 'aqi_below'
  | 'districts_connected'
  | 'treasury'
  | 'tech_unlocked'
  | 'commute_time';

export interface Mission {
  id: string;
  title: string;
  description: string;
  category: MissionCategory;
  targetType: MissionTargetType;
  targetValue: number;
  currentValue: number;
  isCompleted: boolean;
  claimed: boolean;
  rewardCredits: number;
  rewardRP: number;
  rewardXP: number;
}

// ==========================================
// CITY DEMOGRAPHICS & ACTIVITY TYPES
// ==========================================
export interface DemographicsStats {
  pedestriansInPlazas: number;
  activeCommuters: number;
  workplaceOccupancy: number;
  residentialOccupancy: number;
  citizenSentiment: 'ecstatic' | 'satisfied' | 'stressed' | 'rebellious';
}

export interface CityStats {
  population: number;
  totalHousingCapacity: number;
  populationGrowthRate: number;
  totalJobs: number;
  employedCitizens: number;
  unemploymentRate: number;
  treasury: number;
  incomePerTick: number;
  expensesPerTick: number;
  happiness: number; // 0 - 100
  powerUsage: number; // MW
  powerCapacity: number; // MW
  waterUsage: number; // ML
  waterCapacity: number; // ML
  powerDeficit: boolean;
  waterDeficit: boolean;
  pollution: number; // 0 - 100 (AQI index)
  lightingMode: LightingMode;
  weather: WeatherType;
  timeOfDay: string; // e.g. "14:30"
  cycleCount: number;
  era: string;
  autoSaveTimestamp?: string;
  
  // Milestone 03 additions
  researchPoints: number; // Current available RP
  researchPointsPerTick: number; // Passive generation from research facilities
  civLevel: number; // Civilization Level (1 to 10+)
  civXP: number; // Current XP
  civXPToNextLevel: number; // Target XP for next level
  transitStats: TransitStats;
  demographics: DemographicsStats;

  // NEO CITY 6.0 Living Megacity Additions
  resources: ResourceInventory;
  aiDirector: AIDirectorState;
  districtEvolution: Record<DistrictType, DistrictEvolutionState>;
  activeEmergency: EmergencyDisaster | null;

  // NEO CITY 9.0 Living Simulation Additions
  qualityOfLife: QualityOfLifeMetrics;
  districtStats: Record<DistrictType, DistrictDetailedStats>;
  simulatedCitizens: SimulatedCitizen[];
  selectedCitizenId: string | null;
  commercialHealth: number; // 0 - 100%
  industrialOutput: number; // 0 - 100%
  healthcareCoverage: number; // 0 - 100%
  educationRating: number; // 0 - 100%
  tradePolicies: Record<ResourceType, TradePolicy>;
}

export interface CityEventLog {
  id: string;
  timestamp: string;
  type: 'info' | 'success' | 'warning' | 'alert';
  message: string;
}

export interface BuildingBlueprint {
  id: string;
  name: string;
  type: BuildingType;
  style: ArchitecturalStyle;
  district: DistrictType;
  category: 'residential' | 'commercial' | 'tech' | 'energy' | 'eco';
  cost: number;
  height: number;
  dimensions: [number, number, number];
  jobsProvided: number;
  powerConsumption: number;
  powerProduction?: number;
  waterConsumption: number;
  waterProduction?: number;
  revenue: number;
  maintenanceCost: number;
  pollution: number;
  happinessImpact: number;
  details: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  windowGlowColor: string;
  hasAntenna?: boolean;
  hasHelipad?: boolean;
  hasHoloBanner?: boolean;
  hasSkybridge?: boolean;
  hasTerraceGardens?: boolean;
  hasRooftopPool?: boolean;
  requiredTechId?: string; // If locked behind research
  isLocked?: boolean;
}

export interface PlacementState {
  active: boolean;
  blueprint: BuildingBlueprint | null;
  position: [number, number, number];
  rotation: number;
  isValid: boolean;
}

export interface NeoCitySaveData {
  version: string;
  savedAt: string;
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
  // Milestone 03 & 05 persistence
  unlockedTechIds: string[];
  claimedMissionIds: string[];
  activePolicyIds?: string[];
  // NEO CITY 6.0 persistence
  megaProjects?: MegaProjectData[];
}
