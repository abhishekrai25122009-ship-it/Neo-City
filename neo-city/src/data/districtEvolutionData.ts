import type { DistrictType, DistrictEvolutionState } from '../types/city';

export const INITIAL_DISTRICT_EVOLUTION: Record<DistrictType, DistrictEvolutionState> = {
  downtown: {
    district: 'downtown',
    name: 'Metropolitan Financial Core',
    tier: 2,
    developmentScore: 48,
    prosperity: 64,
    infrastructureHealth: 88,
    passengerDemand: 3400,
    cargoDemand: 1200,
    bannerColor: '#f59e0b', // Amber/gold
    accentGlow: 'rgba(245, 158, 11, 0.4)',
    unlockedPerks: [
      'Tier 1: Capital Market Trading Desk (+5% revenue)',
      'Tier 2: High-Frequency Speculation Hub (+12% commerce)',
    ],
  },
  tech_district: {
    district: 'tech_district',
    name: 'Quantum Silicon Sector',
    tier: 2,
    developmentScore: 52,
    prosperity: 72,
    infrastructureHealth: 92,
    passengerDemand: 2800,
    cargoDemand: 1600,
    bannerColor: '#06b6d4', // Cyan
    accentGlow: 'rgba(6, 182, 212, 0.4)',
    unlockedPerks: [
      'Tier 1: Incubator Clusters (+15 RP/tick)',
      'Tier 2: Neural Lattice Fiber Ring (+25% research yield)',
    ],
  },
  residential: {
    district: 'residential',
    name: 'Neo Arcology Habitation',
    tier: 2,
    developmentScore: 45,
    prosperity: 58,
    infrastructureHealth: 85,
    passengerDemand: 4600,
    cargoDemand: 800,
    bannerColor: '#ec4899', // Pink/Coral
    accentGlow: 'rgba(236, 72, 153, 0.4)',
    unlockedPerks: [
      'Tier 1: Vertical Garden Courtyards (+4% happiness)',
      'Tier 2: Automated Delivery Drone Hub (-15% grocery friction)',
    ],
  },
  industrial: {
    district: 'industrial',
    name: 'Nova Heavy Nanotech Zone',
    tier: 1,
    developmentScore: 32,
    prosperity: 44,
    infrastructureHealth: 76,
    passengerDemand: 1900,
    cargoDemand: 3800,
    bannerColor: '#f97316', // Orange
    accentGlow: 'rgba(249, 115, 22, 0.4)',
    unlockedPerks: ['Tier 1: High-Efficiency Smelting (+10% raw materials)'],
  },
  green_zone: {
    district: 'green_zone',
    name: 'Solarium Ecological Sanctuary',
    tier: 2,
    developmentScore: 56,
    prosperity: 68,
    infrastructureHealth: 95,
    passengerDemand: 2100,
    cargoDemand: 450,
    bannerColor: '#10b981', // Emerald
    accentGlow: 'rgba(16, 185, 129, 0.4)',
    unlockedPerks: [
      'Tier 1: Micro-Climate Scrubbers (-10 AQI)',
      'Tier 2: Hydroponic Vertical Towers (+20 Food/tick)',
    ],
  },
  waterfront: {
    district: 'waterfront',
    name: 'Celestial Promenade & Marina',
    tier: 2,
    developmentScore: 50,
    prosperity: 66,
    infrastructureHealth: 90,
    passengerDemand: 3100,
    cargoDemand: 2200,
    bannerColor: '#3b82f6', // Blue
    accentGlow: 'rgba(59, 130, 246, 0.4)',
    unlockedPerks: [
      'Tier 1: Inter-Modal Ferry Docks (+8% transit efficiency)',
      'Tier 2: Celestial Boardwalk Nightlife (+6% happiness)',
    ],
  },
};

export const DISTRICT_TIER_DESCRIPTIONS = {
  1: {
    title: 'Tier 1: Emerging Sector',
    badge: 'EMERGING',
    color: 'text-slate-400 border-slate-500/40 bg-slate-500/10',
    description: 'Basic structural zoning with foundational utilities and local service access.',
  },
  2: {
    title: 'Tier 2: Developing Sector',
    badge: 'DEVELOPING',
    color: 'text-cyan-400 border-cyan-500/40 bg-cyan-500/10',
    description: 'Interconnected transit links, automated public services, and heightened commercial output.',
  },
  3: {
    title: 'Tier 3: Advanced Sector',
    badge: 'ADVANCED',
    color: 'text-purple-400 border-purple-500/40 bg-purple-500/10',
    description: 'Integrated smart microgrids, multi-tiered skybridges, and zero-loss resource distribution.',
  },
  4: {
    title: 'Tier 4: Autonomous Apex',
    badge: 'AUTONOMOUS APEX',
    color: 'text-amber-400 border-amber-500/40 bg-amber-500/10',
    description: 'Self-regulating AI governance, zero carbon footprint, and metropolitan landmark status.',
  },
};
