import type {
  ResourceInventory,
  ResourceType,
  TradePolicy,
  QualityOfLifeMetrics,
} from '../../types/city';

export interface EconomyUpdateResult {
  updatedInventory: ResourceInventory;
  tradeRevenueTotal: number;
  tradeCostTotal: number;
  tradeNotifications: string[];
}

export const DEFAULT_TRADE_POLICIES: Record<ResourceType, TradePolicy> = {
  energy: { autoImport: true, autoExport: true, minReserve: 1500, maxStockpile: 10000, tariffRate: 0.1 },
  water: { autoImport: true, autoExport: true, minReserve: 1500, maxStockpile: 10000, tariffRate: 0.1 },
  food: { autoImport: true, autoExport: true, minReserve: 1000, maxStockpile: 7000, tariffRate: 0.1 },
  materials: { autoImport: true, autoExport: true, minReserve: 800, maxStockpile: 5000, tariffRate: 0.12 },
  manufactured_goods: { autoImport: false, autoExport: true, minReserve: 500, maxStockpile: 4000, tariffRate: 0.15 },
  services: { autoImport: false, autoExport: false, minReserve: 1000, maxStockpile: 8000, tariffRate: 0.08 },
};

/**
 * Calculates dynamic market price given production, consumption, and stock level.
 */
export function calculateDynamicPrice(
  basePrice: number,
  production: number,
  consumption: number,
  currentStock: number,
  capacity: number
): { price: number; trend: 'rising' | 'falling' | 'stable' } {
  const flowRatio = consumption / Math.max(1, production);
  const stockRatio = currentStock / Math.max(1, capacity);

  // Scarcity multiplier: high consumption and low stock drive prices up
  const scarcityMultiplier = flowRatio * 0.7 + (1.0 - stockRatio) * 0.6;
  const clampedMultiplier = Math.min(2.8, Math.max(0.5, scarcityMultiplier));
  const price = +(basePrice * clampedMultiplier).toFixed(2);

  let trend: 'rising' | 'falling' | 'stable' = 'stable';
  if (clampedMultiplier > 1.08) trend = 'rising';
  else if (clampedMultiplier < 0.92) trend = 'falling';

  return { price, trend };
}

/**
 * Simulates economic production cycles, inventory accumulation, and import/export trades.
 */
export function processEconomyCycle(
  inventory: ResourceInventory,
  tradePolicies: Record<ResourceType, TradePolicy>,
  treasury: number,
  simulationSpeed: number
): EconomyUpdateResult {
  const updated: ResourceInventory = { ...inventory };
  let tradeRevenueTotal = 0;
  let tradeCostTotal = 0;
  const tradeNotifications: string[] = [];

  const types = Object.keys(inventory) as ResourceType[];
  const rate = Math.max(0.2, simulationSpeed * 0.15);

  for (const type of types) {
    const res = inventory[type];
    const netFlow = (res.production - res.consumption) * rate;
    let newCurrent = Math.max(0, Math.min(res.capacity, Math.round(res.current + netFlow)));

    const policy = tradePolicies[type] || DEFAULT_TRADE_POLICIES[type];

    // Automated Emergency Import when reserves are depleted
    if (policy.autoImport && newCurrent < policy.minReserve) {
      const needed = Math.round(policy.minReserve - newCurrent);
      const cost = Math.round(needed * res.marketPrice);
      if (treasury >= cost) {
        newCurrent += needed;
        tradeCostTotal += cost;
        tradeNotifications.push(`Auto-imported ${needed.toLocaleString()} ${type} (₡${cost.toLocaleString()})`);
      }
    }

    // Automated Commercial Export when surplus exceeds maximum capacity
    if (policy.autoExport && newCurrent > policy.maxStockpile) {
      const surplus = Math.round(newCurrent - policy.maxStockpile);
      const grossRevenue = surplus * res.marketPrice;
      const netRevenue = Math.round(grossRevenue * (1 - policy.tariffRate));
      newCurrent -= surplus;
      tradeRevenueTotal += netRevenue;
      tradeNotifications.push(`Exported ${surplus.toLocaleString()} surplus ${type} (+₡${netRevenue.toLocaleString()})`);
    }

    const { price, trend } = calculateDynamicPrice(
      res.basePrice,
      res.production,
      res.consumption,
      newCurrent,
      res.capacity
    );

    updated[type] = {
      ...res,
      current: newCurrent,
      marketPrice: price,
      trend,
      isShortage: newCurrent <= 0,
    };
  }

  return {
    updatedInventory: updated,
    tradeRevenueTotal,
    tradeCostTotal,
    tradeNotifications,
  };
}

/**
 * Computes deep Multi-Factor Quality of Life metrics.
 */
export function calculateQualityOfLife(
  population: number,
  totalHousing: number,
  unemploymentRate: number,
  healthcareCapacity: number,
  educationCapacity: number,
  rawAQI: number,
  transitEfficiency: number,
  servicesShortage: boolean,
  taxRate: number,
  prevHistory: number[] = []
): QualityOfLifeMetrics {
  // 1. Housing (100 if housing >= population, drops if overcrowding)
  const housingScore = Math.min(100, Math.max(20, Math.round((totalHousing / Math.max(1, population)) * 100)));

  // 2. Employment (100 if 0% unemployment, drops by 2.5 per 1%)
  const employmentScore = Math.min(100, Math.max(10, Math.round(100 - unemploymentRate * 2.8)));

  // 3. Healthcare
  const healthcareScore = Math.min(100, Math.max(30, Math.round((healthcareCapacity / Math.max(1, population * 0.15)) * 95)));

  // 4. Education
  const educationScore = Math.min(100, Math.max(30, Math.round((educationCapacity / Math.max(1, population * 0.2)) * 95)));

  // 5. Environmental Quality (100 at 0 AQI, 0 at 100 AQI)
  const environmentScore = Math.min(100, Math.max(5, Math.round(100 - rawAQI * 1.1)));

  // 6. Transit & Commute
  const transitScore = Math.min(100, Math.max(20, Math.round(transitEfficiency)));

  // 7. Commercial Services
  const servicesScore = servicesShortage ? 40 : 92;

  // 8. Public Safety
  const safetyScore = Math.min(100, Math.max(40, Math.round(92 - (unemploymentRate > 15 ? (unemploymentRate - 15) * 2 : 0))));

  // 9. Tax Satisfaction
  const taxSatisfactionScore = Math.min(100, Math.max(20, Math.round(100 - (taxRate > 8 ? (taxRate - 8) * 4 : 0))));

  // Weighted overall happiness
  const overallHappiness = Math.min(
    99,
    Math.max(
      20,
      Math.round(
        housingScore * 0.2 +
          employmentScore * 0.18 +
          healthcareScore * 0.12 +
          educationScore * 0.1 +
          environmentScore * 0.14 +
          transitScore * 0.1 +
          servicesScore * 0.08 +
          taxSatisfactionScore * 0.08
      )
    )
  );

  const history = [...prevHistory.slice(-23), overallHappiness];

  return {
    overallHappiness,
    housingScore,
    employmentScore,
    healthcareScore,
    educationScore,
    environmentScore,
    transitScore,
    safetyScore,
    servicesScore,
    taxSatisfactionScore,
    history,
  };
}
