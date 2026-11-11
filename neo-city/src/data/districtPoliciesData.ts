import type { DistrictPolicy } from '../types/city';

export const INITIAL_DISTRICT_POLICIES: DistrictPolicy[] = [
  {
    id: 'pol-clean-subsidies',
    name: 'Clean Energy Matrix Subsidy',
    description: 'Subsidize superconducting Tokamak magnetic coils and solar thermal storage to maximize clean energy output.',
    district: 'industrial',
    active: true,
    costPerTick: 15000,
    effects: {
      powerMult: 0.25,
      pollutionDelta: -4,
    },
  },
  {
    id: 'pol-tax-holiday',
    name: 'Commercial Enterprise Zone',
    description: 'Designate Financial Downtown as a preferential trading zone to accelerate corporate hiring and tax receipts.',
    district: 'downtown',
    active: false,
    costPerTick: 20000,
    effects: {
      revenueMult: 0.25,
      growthBonus: 0.8,
      pollutionDelta: 2,
    },
  },
  {
    id: 'pol-free-transit',
    name: 'Universal Free Sky-Transit',
    description: 'Zero-fare public sky-buses and autonomous hover-pods across the suspension bridges and avenues.',
    district: 'residential',
    active: true,
    costPerTick: 28000,
    effects: {
      transitBonus: 0.2,
      happinessDelta: 8,
    },
  },
  {
    id: 'pol-smart-ai',
    name: 'Autonomous AI City Coordination',
    description: 'Deploy central neural processors to dynamically optimize power routing, logistics, and research simulations.',
    district: 'tech_district',
    active: false,
    costPerTick: 25000,
    effects: {
      powerMult: 0.1,
      transitBonus: 0.15,
      happinessDelta: 4,
    },
  },
  {
    id: 'pol-bio-purification',
    name: 'Bio-Aerosol Carbon Scrubbing',
    description: 'Activate misting micro-algae towers across Botanical Sanctuaries to scrub metropolitan particulate emissions.',
    district: 'green_zone',
    active: true,
    costPerTick: 18000,
    effects: {
      pollutionDelta: -16,
      happinessDelta: 6,
    },
  },
  {
    id: 'pol-nightlife-decree',
    name: 'Nocturnal Tourism Gala',
    description: 'Allow 24-hour waterfront observation decks, neon illuminations, and cultural riverfront pavilions.',
    district: 'waterfront',
    active: false,
    costPerTick: 12000,
    effects: {
      revenueMult: 0.15,
      happinessDelta: 10,
    },
  },
  {
    id: 'pol-logistics-corridor',
    name: 'Heavy Autonomous Logistics Fleet',
    description: 'Prioritize automated cargo drone delivery lines between industrial synthesis facilities and downtown spires.',
    district: 'industrial',
    active: false,
    costPerTick: 22000,
    effects: {
      revenueMult: 0.2,
      transitBonus: -0.05,
      pollutionDelta: 3,
    },
  },
  {
    id: 'pol-vertical-farming',
    name: 'Hydropod Citizen Agriculture',
    description: 'Subsidize community vertical hydroponic gardens in residential arcologies for organic nutrition.',
    district: 'residential',
    active: false,
    costPerTick: 14000,
    effects: {
      growthBonus: 1.2,
      happinessDelta: 6,
      pollutionDelta: -2,
    },
  },
];
