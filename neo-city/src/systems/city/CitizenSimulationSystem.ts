import type {
  BuildingData,
  SimulatedCitizen,
  EducationTier,
  WeatherType,
} from '../../types/city';

// Sci-fi naming pools
const FIRST_NAMES = [
  'Kaelen', 'Lyra', 'Dexter', 'Nova', 'Orion', 'Aria', 'Zane', 'Sora',
  'Valen', 'Cora', 'Rylan', 'Mira', 'Tarek', 'Elora', 'Jax', 'Nyx',
  'Cassian', 'Thalia', 'Ronan', 'Kira', 'Dax', 'Seraphina', 'Malik', 'Astrid',
  'Cyprian', 'Zephyr', 'Rowan', 'Selene', 'Vesper', 'Dante', 'Maeve', 'Lucian',
];

const LAST_NAMES = [
  'Voss', 'Vance', 'Thorne', 'Chen', 'Steele', 'Sol', 'Mercer', 'Kovacs',
  'Holloway', 'Cross', 'Sterling', 'Blackwood', 'Lin', 'Frost', 'Vexler', 'Sinclair',
  'Alvarez', 'Rayne', 'Kessler', 'Valo', 'Winter', 'Reyes', 'Turing', 'Drakos',
  'Bishop', 'Helios', 'Sovereign', 'Pike', 'Morrison', 'Volkov', 'Zhang', 'Nakamoto',
];

const OCCUPATIONS_BY_STYLE: Record<string, string[]> = {
  glass_spire: ['Quantum Equity Analyst', 'High-Frequency Trader', 'Corporate Strategist', 'Venture Capitalist'],
  curved_glass: ['Cybernetic Brand Director', 'Interstellar Trade Liaison', 'Digital Asset Manager'],
  white_futurist: ['Aerospace Systems Architect', 'Sub-Orbital Flight Controller', 'Aero-Navigational Specialist'],
  helix_spiral: ['Genetic Bio-Engineer', 'Synthetic DNA Compiler', 'Epigenetic Researcher'],
  twin_arcology: ['Senior Financial Consultant', 'Autonomous Systems Engineer', 'Data Ethicist'],
  floating_crown: ['Sky-Lounge Curator', 'Diplomatic Ambassador', 'Quantum Architect'],
  quantum_needle: ['Subatomic Resonance Physicist', 'Tachyon Grid Controller', 'Singularity Theorist'],
  quantum_research_tower: ['Quantum Cryptographer', 'Particle Accelerator Tech', 'AI Cognition Scientist'],
  superconducting_facility: ['Cryogenic Matrix Tech', 'Magnetic Levitation Engineer', 'Superconductor Fabricator'],
  cyber_financial_tower: ['Decentralized Ledger Auditor', 'Macro-Economic Simulator', 'Smart Contract Engineer'],
  fusion_core: ['Tokamak Plasma Specialist', 'Magnetic Confinement Operator', 'Fusion Grid Overseer'],
  plasma_core: ['Thermal Gradient Engineer', 'High-Energy Conductor Tech', 'Plasma Conduit Inspector'],
  industrial_complex: ['Automated Foundry Supervisor', 'Heavy Robotics Operator', 'Nanomaterial Forger'],
  solar_collector_spire: ['Photovoltaic Array Overseer', 'Atmospheric Filter Engineer', 'Solar Radiance Analyst'],
  spaceport_terminal: ['Intermodal Transit Conductor', 'Maglev Operations Specialist', 'Shuttle Dispatcher'],
  futuristic_hospital: ['Nanite Surgeon', 'Biometric Diagnostics Chief', 'Regenerative Therapist', 'Neural Specialist'],
  holographic_entertainment: ['Holo-Cinematic Director', 'Sensory Media Synthesizer', 'Augmented Reality Artist'],
  retail_pavilion: ['Synthesized Culinary Merchant', 'Boutique Curator', 'Cyber-Apparel Tailor'],
  terrace_green: ['Permaculture Botanist', 'Vertical Hydro-Farmer', 'Ecological Restorationist'],
  hover_platform: ['Anti-Gravity Harmonizer', 'Atmospheric Drone Pilot', 'Skyway Safety Warden'],
  monumental_megastructure: ['Municipal Security Chief', 'Civic Council Administrator', 'Metropolitan Magistrate'],
};

const SUIT_PALETTES = [
  '#00f0ff', // Cyber cyan
  '#38bdf8', // Light sky
  '#0284c7', // Deep blue
  '#f97316', // Coral commuter
  '#a855f7', // Electric violet
  '#10b981', // Emerald tech
  '#f59e0b', // Amber transit
  '#ec4899', // Neo magenta
  '#6366f1', // Indigo executive
  '#14b8a6', // Turquoise bio
  '#e2e8f0', // Pearl alloy
];

// Suspension Bridges across river Nova Bay
const BRIDGE_NORTH_Z = 16.0;
const BRIDGE_SOUTH_Z = -16.0;

/**
 * Generates navigation waypoints between two buildings respecting sidewalks and suspension bridges.
 */
export function generateCitizenPath(
  startPos: [number, number, number],
  endPos: [number, number, number]
): [number, number][] {
  const [sx, , sz] = startPos;
  const [ex, , ez] = endPos;

  // Immediate start waypoint outside building
  const path: [number, number][] = [[sx, sz]];

  // Determine closest north/south bridge if crossing between East (X>0) and West (X<0)
  const isCrossingRiver = (sx < -9.5 && ex > 9.5) || (sx > 9.5 && ex < -9.5);

  if (isCrossingRiver) {
    const bridgeZ = Math.abs(sz - BRIDGE_NORTH_Z) < Math.abs(sz - BRIDGE_SOUTH_Z)
      ? BRIDGE_NORTH_Z
      : BRIDGE_SOUTH_Z;

    // Step 1: Walk to river quay on originating bank
    const quayX = sx < 0 ? -12.0 : 12.0;
    path.push([quayX, sz]);

    // Step 2: Move to bridge entrance
    path.push([quayX, bridgeZ]);

    // Step 3: Cross bridge to destination bank quay
    const destQuayX = ex < 0 ? -12.0 : 12.0;
    path.push([0, bridgeZ]);
    path.push([destQuayX, bridgeZ]);

    // Step 4: Move along destination bank
    path.push([destQuayX, ez]);
  } else {
    // Same bank navigation along grid lines
    path.push([sx, ez]);
  }

  // Final destination
  path.push([ex, ez]);

  return path;
}

/**
 * Initializes a pool of simulated citizens anchored to actual buildings.
 */
export function initializeSimulatedCitizens(
  buildings: BuildingData[],
  count: number = 200
): SimulatedCitizen[] {
  const residential = buildings.filter((b) => b.type === 'residential_tower');
  const workplaces = buildings.filter((b) => b.type !== 'residential_tower');

  const citizens: SimulatedCitizen[] = [];

  for (let i = 0; i < count; i++) {
    const home = residential[i % residential.length] || buildings[0];
    const work = workplaces[i % workplaces.length] || null;

    const firstName = FIRST_NAMES[i % FIRST_NAMES.length];
    const lastName = LAST_NAMES[(i * 3 + 7) % LAST_NAMES.length];
    const age = 19 + ((i * 7) % 52);
    const gender: 'M' | 'F' | 'NB' = i % 3 === 0 ? 'M' : i % 3 === 1 ? 'F' : 'NB';

    const educations: EducationTier[] = ['basic', 'secondary', 'advanced', 'quantum_scholar'];
    const education = educations[i % educations.length];

    const styleOccupations = work ? OCCUPATIONS_BY_STYLE[work.style] : null;
    const occupation = styleOccupations
      ? styleOccupations[i % styleOccupations.length]
      : 'Metropolitan Citizen';

    const suitColor = SUIT_PALETTES[i % SUIT_PALETTES.length];
    const visorColor = i % 2 === 0 ? '#00f0ff' : '#ec4899';

    // Start near home building
    const posX = home.position[0] + (Math.sin(i * 1.5) * (home.dimensions[0] * 0.45));
    const posZ = home.position[2] + (Math.cos(i * 1.5) * (home.dimensions[2] * 0.45));

    citizens.push({
      id: `cit-${(i + 1).toString().padStart(4, '0')}`,
      name: `${firstName} ${lastName}`,
      age,
      gender,
      homeBuildingId: home.id,
      homeBuildingName: home.name,
      homeDistrict: home.district,
      workBuildingId: work?.id || null,
      workBuildingName: work?.name || 'Unassigned / Independent',
      workDistrict: work?.district || null,
      occupation,
      education,
      health: 85 + (i % 15),
      happiness: 80 + (i % 18),
      activity: 'resting_at_home',
      activityProgress: Math.random(),
      destinationBuildingId: null,
      destinationName: home.name,
      currentPos: [posX, 0.15, posZ],
      targetPos: [posX, 0.15, posZ],
      speed: 1.1 + (i % 6) * 0.12,
      suitColor,
      visorColor,
      commuteMode: i % 4 === 0 ? 'hover_transit' : i % 4 === 1 ? 'maglev' : i % 4 === 2 ? 'aerial_taxi' : 'walking',
    });
  }

  return citizens;
}

/**
 * Updates citizen routine based on current time of day and city simulation conditions.
 */
export function updateCitizenRoutines(
  citizens: SimulatedCitizen[],
  buildings: BuildingData[],
  timeOfDay: string, // "HH:MM"
  weather: WeatherType,
  pollutionAQI: number,
  unemploymentRate: number,
  averageHappiness: number
): SimulatedCitizen[] {
  const [hours] = timeOfDay.split(':').map(Number);
  const buildingMap = new Map<string, BuildingData>(buildings.map((b) => [b.id, b]));

  const parks = buildings.filter((b) => b.type === 'park_monument' || b.type === 'eco_dome');
  const retails = buildings.filter((b) => b.type === 'commercial_block' || b.style === 'retail_pavilion');
  const hospitals = buildings.filter((b) => b.style === 'futuristic_hospital' || b.name.includes('Hospital') || b.name.includes('Clinic'));

  return citizens.map((citizen, idx) => {
    let nextActivity = citizen.activity;
    let targetBuildingId = citizen.destinationBuildingId;
    let targetBuildingName = citizen.destinationName;

    // React to Health & High Smog / Pollution
    if (citizen.health < 60 && hospitals.length > 0 && Math.random() < 0.25) {
      const clinic = hospitals[idx % hospitals.length];
      nextActivity = 'seeking_medical_care';
      targetBuildingId = clinic.id;
      targetBuildingName = clinic.name;
    } else {
      // Natural 24-Hour Routine Cycle
      if (hours >= 22 || hours < 6) {
        // Late Night / Sleep
        nextActivity = 'resting_at_home';
        targetBuildingId = citizen.homeBuildingId;
        targetBuildingName = citizen.homeBuildingName;
      } else if (hours >= 6 && hours < 9) {
        // Morning Commute
        if (citizen.workBuildingId) {
          nextActivity = 'commuting_to_work';
          targetBuildingId = citizen.workBuildingId;
          targetBuildingName = citizen.workBuildingName;
        } else {
          nextActivity = 'visiting_park';
          const park = parks[idx % (parks.length || 1)] || buildings[0];
          targetBuildingId = park.id;
          targetBuildingName = park.name;
        }
      } else if (hours >= 9 && hours < 12) {
        // Peak Work / Productivity
        if (citizen.workBuildingId) {
          nextActivity = 'working';
          targetBuildingId = citizen.workBuildingId;
          targetBuildingName = citizen.workBuildingName;
        } else {
          nextActivity = 'visiting_park';
        }
      } else if (hours >= 12 && hours < 14) {
        // Lunch, Dining & Plaza Stroll
        nextActivity = 'dining_and_retail';
        const spot = retails[idx % (retails.length || 1)] || parks[idx % (parks.length || 1)] || buildings[0];
        targetBuildingId = spot.id;
        targetBuildingName = spot.name;
      } else if (hours >= 14 && hours < 17) {
        // Afternoon Work
        if (citizen.workBuildingId) {
          nextActivity = 'working';
          targetBuildingId = citizen.workBuildingId;
          targetBuildingName = citizen.workBuildingName;
        } else {
          nextActivity = 'dining_and_retail';
        }
      } else if (hours >= 17 && hours < 20) {
        // Evening Commute & Recreation
        if (Math.random() < 0.45 && parks.length > 0) {
          nextActivity = 'visiting_park';
          const park = parks[idx % parks.length];
          targetBuildingId = park.id;
          targetBuildingName = park.name;
        } else {
          nextActivity = 'commuting_home';
          targetBuildingId = citizen.homeBuildingId;
          targetBuildingName = citizen.homeBuildingName;
        }
      } else {
        // 20:00 - 22:00 Nightlife or Home Relaxation
        if (Math.random() < 0.4) {
          nextActivity = 'nightlife_entertainment';
          const spot = retails[idx % (retails.length || 1)] || buildings[0];
          targetBuildingId = spot.id;
          targetBuildingName = spot.name;
        } else {
          nextActivity = 'resting_at_home';
          targetBuildingId = citizen.homeBuildingId;
          targetBuildingName = citizen.homeBuildingName;
        }
      }
    }

    // Dynamic Individual Health & Happiness Response
    let healthDelta = 0;
    if (weather === 'neon_smog' || pollutionAQI > 55) {
      healthDelta -= 1.2;
    } else if (weather === 'clear' && pollutionAQI < 25) {
      healthDelta += 0.8;
    }

    let happinessDelta = 0;
    if (unemploymentRate > 15 && !citizen.workBuildingId) happinessDelta -= 2.0;
    if (nextActivity === 'visiting_park') happinessDelta += 1.5;
    if (nextActivity === 'dining_and_retail') happinessDelta += 1.0;
    if (citizen.health < 50) happinessDelta -= 2.0;

    const updatedHealth = Math.max(30, Math.min(100, +(citizen.health + healthDelta).toFixed(1)));
    const updatedHappiness = Math.max(20, Math.min(99, +(citizen.happiness + (happinessDelta * 0.5) + (averageHappiness - citizen.happiness) * 0.05).toFixed(1)));

    // Determine target location from destination building
    const destBuilding = targetBuildingId ? buildingMap.get(targetBuildingId) : null;
    let targetPos: [number, number, number] = citizen.targetPos;

    if (destBuilding) {
      targetPos = [
        destBuilding.position[0] + (Math.sin(idx * 2) * (destBuilding.dimensions[0] * 0.4)),
        0.15,
        destBuilding.position[2] + (Math.cos(idx * 2) * (destBuilding.dimensions[2] * 0.4)),
      ];
    }

    return {
      ...citizen,
      activity: nextActivity,
      destinationBuildingId: targetBuildingId,
      destinationName: targetBuildingName,
      health: updatedHealth,
      happiness: updatedHappiness,
      targetPos,
    };
  });
}
