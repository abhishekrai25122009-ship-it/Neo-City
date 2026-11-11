const fs = require('fs');
const path = require('path');

const buildingsPath = path.join(__dirname, '../src/data/initialCityBuildings.ts');
const content = fs.readFileSync(buildingsPath, 'utf8');

// Parse existing building positions
const posMatches = [...content.matchAll(/position:\s*\[\s*(-?\d+\.?\d*)\s*,\s*(-?\d+\.?\d*)\s*,\s*(-?\d+\.?\d*)\s*\]/g)];
const existingPositions = posMatches.map(m => [parseFloat(m[1]), parseFloat(m[2]), parseFloat(m[3])]);
console.log(`Found ${existingPositions.length} existing building positions.`);

const RESTRICTED_X = [
  { min: 21.8, max: 26.2 },
  { min: 62.0, max: 66.0 },
  { min: 102.0, max: 106.0 },
  { min: -24.2, max: -19.8 },
  { min: -66.0, max: -62.0 },
  { min: -106.0, max: -102.0 },
];

const CROSS_Z = [-140, -120, -80, -40, 0, 40, 80, 120, 140];

function isValid(x, z, w, d, existingList) {
  // World bounds
  if (Math.abs(x) > 135 || Math.abs(z) > 140) return false;
  // River
  if (Math.abs(x) < 12) return false;

  // Road corridors
  for (const r of RESTRICTED_X) {
    if (x + w/2 >= r.min && x - w/2 <= r.max) return false;
  }

  // Cross avenues (width 3.2m -> 1.6 half width)
  for (const cz of CROSS_Z) {
    if (z + d/2 >= cz - 1.6 && z - d/2 <= cz + 1.6) return false;
  }

  // Existing positions
  for (const pos of existingList) {
    const dx = Math.abs(x - pos[0]);
    const dz = Math.abs(z - pos[2]);
    if (dx < 7.0 && dz < 7.0) return false;
  }

  return true;
}

// Target 56 buildings
// 14 in East Inner Expansion (X = 86 to 92, Z in [-130..130])
// 14 in East Outer Expansion (X = 114 to 124, Z in [-130..130])
// 14 in West Inner Expansion (X = -92 to -86, Z in [-130..130])
// 14 in West Outer Expansion (X = -124 to -114, Z in [-130..130])

const expansionSpecs = [
  // EAST INNER (Tech / Industrial / Commercial)
  {
    xCols: [86, 92],
    zRows: [-130, -102, -62, -22, 18, 58, 98, 130],
    district: 'industrial',
    categories: [
      { name: 'Quantum Core Forge', style: 'industrial_foundry', type: 'factory', primary: '#f97316', secondary: '#c2410c', accent: '#00f0ff', glow: '#ffedd5', h: 10, w: 6, d: 6 },
      { name: 'Plasma Synthesis Station', style: 'plasma_plant', type: 'energy_plant', primary: '#8b5cf6', secondary: '#6d28d9', accent: '#00f0ff', glow: '#ddd6fe', h: 12, w: 6, d: 6 },
      { name: 'Hyper-Logistics Hub Gamma', style: 'logistics_hub', type: 'distribution_center', primary: '#3b82f6', secondary: '#1d4ed8', accent: '#10b981', glow: '#dbeafe', h: 8, w: 6.5, d: 6 },
      { name: 'Aerospace Propulsion Yard', style: 'aerospace_complex', type: 'research_facility', primary: '#06b6d4', secondary: '#0891b2', accent: '#f59e0b', glow: '#cffafe', h: 14, w: 6, d: 6 },
      { name: 'Automated Foundry Beta', style: 'robotic_assembly', type: 'factory', primary: '#ef4444', secondary: '#b91c1c', accent: '#eab308', glow: '#fee2e2', h: 9, w: 6, d: 6 },
      { name: 'Singularity Sub-Station', style: 'quantum_lab', type: 'research_facility', primary: '#10b981', secondary: '#047857', accent: '#00f0ff', glow: '#d1fae5', h: 16, w: 5.5, d: 5.5 },
      { name: 'Superconductor Facility', style: 'quantum_cube', type: 'research_facility', primary: '#6366f1', secondary: '#4338ca', accent: '#ec4899', glow: '#e0e7ff', h: 15, w: 5.5, d: 5.5 },
    ]
  },
  // EAST OUTER (Advanced Tech / Skyscraper Spalls)
  {
    xCols: [116, 122],
    zRows: [-130, -102, -62, -22, 18, 58, 98, 130],
    district: 'tech_corridor',
    categories: [
      { name: 'Zenith Vector Tower', style: 'exoskeleton_tower', type: 'skyscraper', primary: '#0ea5e9', secondary: '#0369a1', accent: '#00f0ff', glow: '#e0f2fe', h: 32, w: 5, d: 5 },
      { name: 'Helix Data Megalith', style: 'twist_tower', type: 'skyscraper', primary: '#a855f7', secondary: '#7e22ce', accent: '#f43f5e', glow: '#f3e8ff', h: 28, w: 5, d: 5 },
      { name: 'Crystalline Informatics Pylon', style: 'crystalline_spire', type: 'skyscraper', primary: '#14b8a6', secondary: '#0f766e', accent: '#38bdf8', glow: '#ccfbf1', h: 30, w: 5, d: 5 },
      { name: 'Orbital Uplink Spire', style: 'origami_spire', type: 'skyscraper', primary: '#f59e0b', secondary: '#d97706', accent: '#00f0ff', glow: '#fef3c7', h: 26, w: 5, d: 5 },
      { name: 'Apex Kinetic Obelisk', style: 'kinetic_tower', type: 'skyscraper', primary: '#ec4899', secondary: '#be185d', accent: '#fbbf24', glow: '#fce7f3', h: 34, w: 5, d: 5 },
      { name: 'Hyperboloid Signal Beacon', style: 'hyperboloid', type: 'telecom', primary: '#3b82f6', secondary: '#1e40af', accent: '#00f0ff', glow: '#dbeafe', h: 25, w: 5, d: 5 },
      { name: 'Cybernetic Monolith East', style: 'cyber_tower', type: 'commercial', primary: '#06b6d4', secondary: '#0e7490', accent: '#a855f7', glow: '#cffafe', h: 27, w: 5, d: 5 },
    ]
  },
  // WEST INNER (Arcadia Residential / Biomorphic & Eco)
  {
    xCols: [-86, -92],
    zRows: [-130, -102, -62, -22, 18, 58, 98, 130],
    district: 'green_zone',
    categories: [
      { name: 'Solaris Biosphere Dome', style: 'geodesic_dome', type: 'park', primary: '#10b981', secondary: '#047857', accent: '#00f0ff', glow: '#d1fae5', h: 9, w: 7, d: 7 },
      { name: 'Arboretum Living Spire', style: 'solarpunk_tree', type: 'residential', primary: '#059669', secondary: '#047857', accent: '#34d399', glow: '#ecfdf5', h: 22, w: 6, d: 6 },
      { name: 'Verdant Biomorphic Habitat', style: 'biomorphic', type: 'residential', primary: '#14b8a6', secondary: '#0d9488', accent: '#6ee7b7', glow: '#ccfbf1', h: 18, w: 6, d: 6 },
      { name: 'Vertical Agro-Tower Prime', style: 'vertical_farm', type: 'hydroponics', primary: '#22c55e', secondary: '#15803d', accent: '#eab308', glow: '#dcfce7', h: 24, w: 5.5, d: 5.5 },
      { name: 'Terraced Garden Pavilions', style: 'terrace_apron', type: 'residential', primary: '#0284c7', secondary: '#0369a1', accent: '#38bdf8', glow: '#e0f2fe', h: 14, w: 6.5, d: 6.5 },
      { name: 'Hydroponic Lotus Dome', style: 'hydroponic_dome', type: 'hydroponics', primary: '#10b981', secondary: '#065f46', accent: '#00f0ff', glow: '#a7f3d0', h: 8, w: 7, d: 7 },
      { name: 'Levitating Botanical Sanctuary', style: 'hover_platform', type: 'park', primary: '#06b6d4', secondary: '#0891b2', accent: '#a855f7', glow: '#cffafe', h: 12, w: 6, d: 6 },
    ]
  },
  // WEST OUTER (Suburban Arcology / Pod Residential)
  {
    xCols: [-116, -122],
    zRows: [-130, -102, -62, -22, 18, 58, 98, 130],
    district: 'residential',
    categories: [
      { name: 'Arcadia Habitat Cluster Alpha', style: 'pod_cluster', type: 'residential', primary: '#8b5cf6', secondary: '#6d28d9', accent: '#00f0ff', glow: '#ede9fe', h: 19, w: 6, d: 6 },
      { name: 'Nova Vista Arcology', style: 'suburban_arcology', type: 'residential', primary: '#3b82f6', secondary: '#1d4ed8', accent: '#38bdf8', glow: '#dbeafe', h: 20, w: 6, d: 6 },
      { name: 'Sky-Terrace Habitation Unit', style: 'floating_hab', type: 'residential', primary: '#0ea5e9', secondary: '#0284c7', accent: '#f59e0b', glow: '#bae6fd', h: 17, w: 5.5, d: 5.5 },
      { name: 'Modular Eco-Blocks Beta', style: 'modular_blocks', type: 'residential', primary: '#10b981', secondary: '#047857', accent: '#f43f5e', glow: '#d1fae5', h: 16, w: 6, d: 6 },
      { name: 'Spherical Pod Haven', style: 'spherical_pod', type: 'residential', primary: '#ec4899', secondary: '#9d174d', accent: '#00f0ff', glow: '#fce7f3', h: 15, w: 5.5, d: 5.5 },
      { name: 'Cascade Living Slabs', style: 'stacked_slabs', type: 'residential', primary: '#6366f1', secondary: '#4338ca', accent: '#a855f7', glow: '#e0e7ff', h: 18, w: 6, d: 6 },
      { name: 'Stepped Solarium Ziggurat', style: 'stepped_ziggurat', type: 'residential', primary: '#f59e0b', secondary: '#b45309', accent: '#10b981', glow: '#fef3c7', h: 21, w: 6, d: 6 },
    ]
  }
];

const newBuildings = [];
const currentPositions = [...existingPositions];
let bIndex = 173;

for (const group of expansionSpecs) {
  let catIdx = 0;
  for (const x of group.xCols) {
    for (const z of group.zRows) {
      const cat = group.categories[catIdx % group.categories.length];
      catIdx++;

      if (isValid(x, z, cat.w, cat.d, currentPositions)) {
        currentPositions.push([x, 0, z]);
        const id = `b-expansion-${bIndex}`;
        const building = {
          id,
          name: `${cat.name} ${String.fromCharCode(64 + (bIndex % 26 || 1))}`,
          type: cat.type,
          style: cat.style,
          district: group.district,
          position: [x, 0, z],
          dimensions: [cat.w, cat.h, cat.d],
          height: cat.h,
          level: Math.floor(Math.random() * 3) + 1,
          occupancy: Math.round(cat.h * 120),
          maxOccupancy: Math.round(cat.h * 150),
          jobsProvided: Math.round(cat.h * 25),
          powerConsumption: Math.round(cat.h * 2.2),
          waterConsumption: Math.round(cat.h * 1.8),
          revenue: Math.round(cat.h * 1400),
          maintenanceCost: Math.round(cat.h * 320),
          pollution: cat.style.includes('eco') || cat.style.includes('bio') || cat.style.includes('dome') ? -6 : cat.type === 'factory' ? 8 : 1,
          happinessImpact: cat.type === 'park' || cat.type === 'hydroponics' ? 14 : 6,
          status: 'optimal',
          details: `Expanded metropolitan structure advancing Nova Prime's ${group.district.replace('_', ' ')} sector with luminous futuristic architecture.`,
          primaryColor: cat.primary,
          secondaryColor: cat.secondary,
          accentColor: cat.accent,
          windowGlowColor: cat.glow,
          hasAntenna: cat.h > 20,
          hasHelipad: cat.h > 24
        };
        newBuildings.push(building);
        bIndex++;
      }
    }
  }
}

console.log(`Successfully generated ${newBuildings.length} valid expansion buildings! Total will be ${existingPositions.length + newBuildings.length}.`);

// Format TypeScript objects
function formatBuilding(b) {
  return `  {
    id: '${b.id}',
    name: "${b.name}",
    type: '${b.type}',
    style: '${b.style}',
    district: '${b.district}',
    position: [${b.position[0]}, ${b.position[1]}, ${b.position[2]}],
    dimensions: [${b.dimensions[0]}, ${b.dimensions[1]}, ${b.dimensions[2]}],
    height: ${b.height},
    level: ${b.level},
    occupancy: ${b.occupancy},
    maxOccupancy: ${b.maxOccupancy},
    jobsProvided: ${b.jobsProvided},
    powerConsumption: ${b.powerConsumption},
    waterConsumption: ${b.waterConsumption},
    revenue: ${b.revenue},
    maintenanceCost: ${b.maintenanceCost},
    pollution: ${b.pollution},
    happinessImpact: ${b.happinessImpact},
    status: 'optimal',
    details: "${b.details}",
    primaryColor: '${b.primaryColor}',
    secondaryColor: '${b.secondaryColor}',
    accentColor: '${b.accentColor}',
    windowGlowColor: '${b.windowGlowColor}',
    hasAntenna: ${b.hasAntenna},
    hasHelipad: ${b.hasHelipad},
  },`;
}

const formattedBuildings = newBuildings.map(formatBuilding).join('\n');

// Replace the end of array `];` with new buildings and then `];`
const updatedContent = content.replace(/\s*\];\s*$/, ',\n' + formattedBuildings + '\n];\n');
fs.writeFileSync(buildingsPath, updatedContent, 'utf8');
console.log('Updated initialCityBuildings.ts successfully!');
