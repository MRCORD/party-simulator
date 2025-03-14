/**
 * Distribution bin for visualization
 */
export interface DistributionBin {
  min: number;
  max: number;
  count: number;
  containsRecommendation: boolean;
}

/**
 * Eater profile definition for simulation
 */
export interface EaterProfile {
  name: string;
  percentage: number;
  servingsMultiplier: number;
}

/**
 * Results of a Monte Carlo simulation for a food item
 */
export interface SimulationResult {
  // Statistical results
  mean: number;
  median: number;
  min: number;
  max: number;
  
  // Recommendations
  recommendedServings: number;
  recommendedUnits: number;
  totalCost: number;
  
  // Risk assessment
  stockoutRisk: number;
  
  // Distribution data for visualization
  distribution: DistributionBin[];
}