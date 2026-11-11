import type { CityDecisionEvent } from '../types/city';

export const CITY_DECISION_EVENTS_POOL: CityDecisionEvent[] = [
  {
    id: 'ev-solar-flare',
    title: 'SOLARIS CORONAL PLASMA SURGE',
    category: 'energy',
    severity: 'high',
    district: 'industrial',
    description: 'An intense coronal mass ejection from the primary star has triggered widespread inductive currents across the metropolitan power grid.',
    cycleRemaining: 4,
    choices: [
      {
        id: 'c-ground-capacitors',
        label: 'Reroute to Subterranean Capacitors',
        description: 'Safely absorb excess voltage into municipal batteries. Costs 45,000 CR in infrastructure stress.',
        costCredits: 45000,
        effects: {
          treasuryDelta: -45000,
          powerCapDelta: 300,
          happinessDelta: 4,
        },
      },
      {
        id: 'c-overclock-research',
        label: 'Overclock Quantum Research Matrix',
        description: 'Funnel raw solar voltage directly into AI supercomputers. Massive scientific harvest, but causes citizen brownouts.',
        effects: {
          rpDelta: 160,
          happinessDelta: -8,
        },
      },
      {
        id: 'c-vent-atmosphere',
        label: 'Controlled Atmospheric Ion Discharge',
        description: 'Vent plasma directly through the Celestial Needle grounding spike. Causes temporary static auroras and mild air ionization.',
        effects: {
          pollutionDelta: 6,
          happinessDelta: 2,
        },
      },
    ],
  },
  {
    id: 'ev-megacorp-bid',
    title: 'OMNI-TECH CONGLOMERATE RELOCATION',
    category: 'economy',
    severity: 'medium',
    district: 'downtown',
    description: 'A Tier-1 interstellar tech conglomerate is offering to establish their global headquarters in Nova Prime if municipal incentives are approved.',
    cycleRemaining: 5,
    choices: [
      {
        id: 'c-approve-tax-break',
        label: 'Grant 3-Year Enterprise Subsidy',
        description: 'Provide 60,000 CR infrastructure grant in exchange for immediate creation of 2,400 high-income executive jobs.',
        costCredits: 60000,
        effects: {
          treasuryDelta: -60000,
          happinessDelta: 8,
          rpDelta: 90,
        },
      },
      {
        id: 'c-require-eco-mandate',
        label: 'Require Biophilic Arcology Standard',
        description: 'Require the conglomerate to fund rooftop bio-domes and clean energy installations before construction.',
        effects: {
          pollutionDelta: -8,
          happinessDelta: 5,
          rpDelta: 50,
        },
      },
      {
        id: 'c-reject-megacorp',
        label: 'Uphold Municipal Independence',
        description: 'Decline corporate concessions to protect civic autonomy and public grid capacity.',
        effects: {
          happinessDelta: 2,
        },
      },
    ],
  },
  {
    id: 'ev-cyber-festival',
    title: 'NOVA BAY CYBERPUNK SOLSTICE GALA',
    category: 'culture',
    severity: 'low',
    district: 'waterfront',
    description: 'Citizen guilds and street artists are requesting city sponsorship for a three-night holographic lantern festival along the bridges and quays.',
    cycleRemaining: 3,
    choices: [
      {
        id: 'c-fund-spectacular',
        label: 'Fully Fund Metropolitan Celebration',
        description: 'Invest 35,000 CR into laser light projections, music stages, and free sky-transit for citizens.',
        costCredits: 35000,
        effects: {
          treasuryDelta: -35000,
          happinessDelta: 16,
          transitDelta: -5,
        },
      },
      {
        id: 'c-corporate-sponsors',
        label: 'Enlist Corporate Sponsors',
        description: 'Permit commercial holo-advertisements during the festival. Generates 40,000 CR in tourism revenue with moderate happiness boost.',
        effects: {
          treasuryDelta: 40000,
          happinessDelta: 7,
        },
      },
      {
        id: 'c-restrict-hours',
        label: 'Enforce Strict Quiet Hours',
        description: 'Limit festivities to daylight to prevent commuter disruption and conserve energy.',
        effects: {
          happinessDelta: -6,
          transitDelta: 5,
        },
      },
    ],
  },
  {
    id: 'ev-skyway-desync',
    title: 'AUTONOMOUS SKYWAY NAVIGATION DESYNC',
    category: 'transit',
    severity: 'high',
    district: 'downtown',
    description: 'A corrupted telemetry packet has disrupted GPS tracking for autonomous hover-speeders and sky-buses across the eastern air corridors.',
    cycleRemaining: 3,
    choices: [
      {
        id: 'c-dispatch-interceptors',
        label: 'Scramble Emergency Interceptor Escorts',
        description: 'Deploy police hovercraft to manually shepherd aerial traffic along safe sky-lanes. Immediate stabilization.',
        costCredits: 25000,
        effects: {
          treasuryDelta: -25000,
          transitDelta: 15,
          happinessDelta: 4,
        },
      },
      {
        id: 'c-ground-flight-tier',
        label: 'Mandate Lower Ground Boulevards',
        description: 'Force all civilian speeders to street level. Causes temporary road congestion but costs zero credits.',
        effects: {
          transitDelta: -18,
          happinessDelta: -5,
        },
      },
      {
        id: 'c-quantum-patch',
        label: 'Flash Neural Sky-Grid Firmware',
        description: 'Use 40 Research Points to deploy a real-time quantum routing patch across all aerial transponders.',
        effects: {
          rpDelta: -40,
          transitDelta: 22,
          happinessDelta: 6,
        },
      },
    ],
  },
  {
    id: 'ev-smog-inversion',
    title: 'ATMOSPHERIC PARTICULATE INVERSION',
    category: 'environment',
    severity: 'high',
    district: 'green_zone',
    description: 'A stagnant high-pressure weather front is trapping industrial particulate emissions over the metropolitan bay.',
    cycleRemaining: 4,
    choices: [
      {
        id: 'c-emergency-scrubbers',
        label: 'Deploy Mobile Electrostatic Scrubbers',
        description: 'Authorize emergency fleet of atmospheric purification drones. Clears air rapidly for 30,000 CR.',
        costCredits: 30000,
        effects: {
          treasuryDelta: -30000,
          pollutionDelta: -24,
          happinessDelta: 8,
        },
      },
      {
        id: 'c-curtail-industry',
        label: 'Enact Mandatory Factory Slowdown',
        description: 'Reduce industrial synthesis production by 40% until the weather front clears.',
        effects: {
          pollutionDelta: -14,
          treasuryDelta: -15000,
          happinessDelta: 2,
        },
      },
      {
        id: 'c-weather-seeding',
        label: 'Cloud-Seed Cyber Rain Shower',
        description: 'Seed the upper clouds with silver iodide to trigger rain and wash airborne pollutants into river filters.',
        effects: {
          pollutionDelta: -18,
          happinessDelta: 4,
        },
      },
    ],
  },
  {
    id: 'ev-commercial-boom',
    title: 'DOWNTOWN COMMERCIAL RETAIL SURGE',
    category: 'economy',
    severity: 'medium',
    district: 'downtown',
    description: 'Surging consumer confidence and tourism have ignited an unprecedented commercial trade boom across retail concourses.',
    cycleRemaining: 4,
    choices: [
      {
        id: 'c-commercial-tax-rebate',
        label: 'Reinvest Revenue into Civic Amenities',
        description: 'Spend 40,000 CR to upgrade streetscape promenades and public holographic kiosks.',
        costCredits: 40000,
        effects: {
          treasuryDelta: -40000,
          happinessDelta: 14,
          transitDelta: 6,
        },
      },
      {
        id: 'c-commercial-harvest',
        label: 'Collect Municipal Commerce Dividend',
        description: 'Impose luxury commercial windfall tariff. Generates 95,000 CR for municipal treasury.',
        effects: {
          treasuryDelta: 95000,
          happinessDelta: -3,
        },
      },
    ],
  },
  {
    id: 'ev-employment-crisis',
    title: 'AUTOMATION EMPLOYMENT TRANSITION',
    category: 'economy',
    severity: 'high',
    district: 'tech_district',
    description: 'Rapid deployment of autonomous factory AI has temporarily displaced manual assembly workers, increasing local unemployment.',
    cycleRemaining: 5,
    choices: [
      {
        id: 'c-retraining-program',
        label: 'Fund Quantum Academy Retraining',
        description: 'Subsidize vocational tech scholarships for 50,000 CR. Converts displaced citizens into advanced tech researchers.',
        costCredits: 50000,
        effects: {
          treasuryDelta: -50000,
          happinessDelta: 12,
          rpDelta: 80,
        },
      },
      {
        id: 'c-public-works',
        label: 'Commission Municipal Infrastructure Corps',
        description: 'Direct workforce to road maintenance and park restoration for 25,000 CR.',
        costCredits: 25000,
        effects: {
          treasuryDelta: -25000,
          happinessDelta: 7,
          pollutionDelta: -6,
        },
      },
    ],
  },
  {
    id: 'ev-housing-shortage',
    title: 'ACUTE RESIDENTIAL HOUSING SHORTAGE',
    category: 'economy',
    severity: 'high',
    district: 'residential',
    description: 'Metropolitan population growth has filled 96% of residential arcologies. Prospective citizens face inflated housing premiums.',
    cycleRemaining: 4,
    choices: [
      {
        id: 'c-subsidize-arcology',
        label: 'Authorize High-Density Zoning Subsidy',
        description: 'Provide 45,000 CR incentive for immediate modular vertical expansion of residential towers.',
        costCredits: 45000,
        effects: {
          treasuryDelta: -45000,
          happinessDelta: 10,
        },
      },
      {
        id: 'c-convert-commercial',
        label: 'Fast-Track Commuter Sky-Ferries',
        description: 'Subsidize outer perimeter transit so citizens can live in suburban arcologies and commute rapidly.',
        costCredits: 20000,
        effects: {
          treasuryDelta: -20000,
          transitDelta: 14,
          happinessDelta: 5,
        },
      },
    ],
  },
  {
    id: 'ev-tourist-influx',
    title: 'INTERSTELLAR TOURISM FLOTILLA ARRIVAL',
    category: 'culture',
    severity: 'low',
    district: 'waterfront',
    description: 'A fleet of luxury orbital cruise yachts has anchored off Nova Bay, bringing thousands of visitors eager to explore the Celestial Needle and Gardens.',
    cycleRemaining: 3,
    choices: [
      {
        id: 'c-open-promenade',
        label: 'Roll Out Red Carpet Water Promenade',
        description: 'Provide guided hover-tours and illumination shows. Boosts commercial sales and yields 80,000 CR trade income.',
        effects: {
          treasuryDelta: 80000,
          happinessDelta: 8,
          transitDelta: -8,
        },
      },
      {
        id: 'c-eco-tourism',
        label: 'Promote Green Zone Eco-Retreats',
        description: 'Direct tourists to botanical sanctuaries, generating 45,000 CR while funding permaculture research.',
        effects: {
          treasuryDelta: 45000,
          rpDelta: 40,
          happinessDelta: 6,
        },
      },
    ],
  },
  {
    id: 'ev-research-breakthrough',
    title: 'QUANTUM SINGULARITY BREAKTHROUGH',
    category: 'technology',
    severity: 'medium',
    district: 'tech_district',
    description: 'Researchers at the Quantum Singularity Labs have achieved stable subatomic lattice coherence, opening new avenues for civilization progress.',
    cycleRemaining: 4,
    choices: [
      {
        id: 'c-publish-open-tech',
        label: 'Publish Open Scientific Blueprint',
        description: 'Distribute findings publicly to all municipal facilities. Grants +180 RP and improves city-wide energy efficiency.',
        effects: {
          rpDelta: 180,
          powerCapDelta: 250,
          happinessDelta: 6,
        },
      },
      {
        id: 'c-patent-license',
        label: 'License Proprietary Patent Off-World',
        description: 'Sell exclusive commercial manufacturing rights to interplanetary consortium for 120,000 CR.',
        effects: {
          treasuryDelta: 120000,
          rpDelta: 60,
        },
      },
    ],
  },
  {
    id: 'ev-energy-surplus',
    title: 'SUB-ATOMIC ENERGY GRID SURPLUS',
    category: 'energy',
    severity: 'low',
    district: 'industrial',
    description: 'Hyperion Fusion Tokamaks and solar collector spires are generating over 4,000 MW in clean zero-carbon electricity surplus.',
    cycleRemaining: 4,
    choices: [
      {
        id: 'c-export-power',
        label: 'Export Megawatt Surplus to Orbital Relay',
        description: 'Beam excess energy via microwave laser to orbiting industrial space stations. Generates 75,000 CR.',
        effects: {
          treasuryDelta: 75000,
          happinessDelta: 3,
        },
      },
      {
        id: 'c-free-citizen-power',
        label: 'Provide Free Municipal Power Credits',
        description: 'Eliminate residential electric utilities for this cycle. Massively increases citizen satisfaction.',
        effects: {
          happinessDelta: 18,
        },
      },
    ],
  },
  {
    id: 'ev-water-shortage',
    title: 'AQUIFER BASIN HYDRAULIC PRESSURE DROP',
    category: 'environment',
    severity: 'high',
    district: 'green_zone',
    description: 'Subterranean water tables have dropped due to heavy industrial cooling draw, threatening botanical gardens and residential supply.',
    cycleRemaining: 4,
    choices: [
      {
        id: 'c-emergency-desal',
        label: 'Deploy Nova Bay Reverse Osmosis Desal',
        description: 'Construct rapid marine filtration barges for 35,000 CR to restore 100% water security.',
        costCredits: 35000,
        effects: {
          treasuryDelta: -35000,
          happinessDelta: 6,
          pollutionDelta: 2,
        },
      },
      {
        id: 'c-ration-industrial',
        label: 'Enforce Heavy Industrial Water Rationing',
        description: 'Prioritize residential drinking and eco-domes; curtail factory cooling loops.',
        effects: {
          happinessDelta: -4,
          treasuryDelta: -18000,
        },
      },
    ],
  },
];
