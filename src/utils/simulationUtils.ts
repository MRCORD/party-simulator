/**
 * Monte Carlo Simulation Utilities for Food Consumption
 * 
 * This module contains the core engine for the Monte Carlo simulation
 * used to predict food consumption patterns at events.
 */

import { ShoppingItem, ItemRelationship } from '@/types/shopping';
import { EaterProfile, SimulationResult } from '@/types/simulator';

/**
 * Distribution bin for visualization
 */
interface DistributionBin {
  min: number;
  max: number;
  count: number;
  containsRecommendation: boolean;
}

/**
 * Configuration for a Monte Carlo simulation run
 */
interface SimulationConfig {
  attendees: number;
  eaterProfiles: EaterProfile[];
  foodItems: ShoppingItem[];
  itemRelationships: ItemRelationship[];
  confidenceLevel: number;
  simulationCount: number;
}

/**
 * Raw results of a Monte Carlo simulation before final analysis
 */
interface RawSimulationResults {
  [itemId: string]: number[];
}

/**
 * Runs a Monte Carlo simulation to predict food consumption
 * 
 * @param config - Simulation configuration
 * @returns Simulation results with recommendations
 */
export function runMonteCarlo(config: SimulationConfig): Record<string, SimulationResult> {
  const { 
    attendees, 
    eaterProfiles, 
    foodItems, 
    itemRelationships, 
    confidenceLevel, 
    simulationCount 
  } = config;
  
  // Initialize raw results
  const rawResults: RawSimulationResults = {};
  foodItems.forEach(item => {
    rawResults[item.id] = [];
  });
  
  // Normalize profiles to ensure percentages sum to 100%
  const normalizedProfiles = normalizeProfiles(eaterProfiles);
  
  // Run multiple simulations
  for (let sim = 0; sim < simulationCount; sim++) {
    // Assign attendees to different profiles
    const profileDistribution = assignAttendeesToProfiles(attendees, normalizedProfiles);
    
    // For each food item, calculate consumption in this simulation
    foodItems.forEach(item => {
      // Base consumption from direct attendee consumption
      let totalServings = calculateServingsForProfiles(profileDistribution);
      rawResults[item.id].push(totalServings);
    });
  }
  
  // Process complementary relationships and adjust raw results
  processComplementaryRelationships(rawResults, foodItems, itemRelationships);
  
  // Analyze raw results and generate final recommendations
  return analyzeResults(rawResults, foodItems, confidenceLevel);
}

/**
 * Normalizes eater profiles to ensure percentages sum to 100%
 */
function normalizeProfiles(profiles: EaterProfile[]): EaterProfile[] {
  const total = profiles.reduce((sum, profile) => sum + profile.percentage, 0);
  
  if (total === 100) return profiles;
  
  return profiles.map((profile, index) => {
    if (index === profiles.length - 1) {
      // Last profile gets whatever is needed to reach 100%
      const otherTotal = profiles
        .slice(0, index)
        .reduce((sum, p) => sum + (p.percentage * 100 / total), 0);
      
      return {
        ...profile,
        percentage: Math.round(100 - otherTotal)
      };
    }
    
    // Scale other profiles proportionally
    return {
      ...profile,
      percentage: Math.round(profile.percentage * 100 / total)
    };
  });
}

/**
 * Assigns attendees to different eater profiles based on percentages
 */
function assignAttendeesToProfiles(
  attendees: number, 
  profiles: EaterProfile[]
): Map<EaterProfile, number> {
  const distribution = new Map<EaterProfile, number>();
  
  let remaining = attendees;
  
  // Assign attendees based on profile percentages
  profiles.forEach((profile, index) => {
    if (index === profiles.length - 1) {
      // Last profile gets all remaining attendees
      distribution.set(profile, remaining);
    } else {
      const count = Math.round((profile.percentage / 100) * attendees);
      distribution.set(profile, count);
      remaining -= count;
    }
  });
  
  return distribution;
}

/**
 * Calculates total servings for a distribution of attendees across profiles
 */
function calculateServingsForProfiles(profileDistribution: Map<EaterProfile, number>): number {
  let totalServings = 0;
  
  profileDistribution.forEach((attendeeCount, profile) => {
    // Apply random variation to each attendee's consumption
    for (let i = 0; i < attendeeCount; i++) {
      // Base consumption rate for this profile
      const baseRate = profile.servingsMultiplier;
      
      // Add random variation (normal distribution around the base rate)
      // Using Box-Muller transform to generate normally distributed random numbers
      const u1 = Math.random();
      const u2 = Math.random();
      const z0 = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
      
      // Standard deviation of 20% of the base rate
      const stdDev = baseRate * 0.2;
      
      // Calculate the consumption with random variation, ensure it's positive
      const consumption = Math.max(0.1, baseRate + z0 * stdDev);
      
      totalServings += consumption;
    }
  });
  
  return totalServings;
}

/**
 * Process complementary item relationships and adjust consumption
 */
function processComplementaryRelationships(
  results: RawSimulationResults,
  foodItems: ShoppingItem[],
  relationships: ItemRelationship[]
): void {
  if (relationships.length === 0) return;
  
  // For each simulation run
  for (const itemId in results) {
    const simulations = results[itemId].length;
    
    for (let sim = 0; sim < simulations; sim++) {
      // Process each relationship
      relationships.forEach(rel => {
        const primaryItem = foodItems.find(item => item.id === rel.primaryItemId);
        const secondaryItem = foodItems.find(item => item.id === rel.secondaryItemId);
        
        if (!primaryItem || !secondaryItem) return;
        
        if (primaryItem.id === itemId || secondaryItem.id === itemId) {
          // If this item is involved in a relationship
          const primaryConsumption = results[rel.primaryItemId][sim];
          const secondaryConsumption = results[rel.secondaryItemId][sim];
          
          // Calculate units needed based on servings
          const primaryUnits = Math.ceil(primaryConsumption / primaryItem.servings);
          
          // Calculate required secondary servings based on relationship ratio
          const requiredSecondaryServings = primaryUnits * rel.ratio * secondaryItem.servings;
          
          // Update secondary item consumption if needed
          if (secondaryItem.id === itemId && secondaryConsumption < requiredSecondaryServings) {
            results[itemId][sim] = requiredSecondaryServings;
          }
        }
      });
    }
  }
}

/**
 * Analyzes simulation results and generates recommendations
 */
function analyzeResults(
  rawResults: RawSimulationResults,
  foodItems: ShoppingItem[],
  confidenceLevel: number
): Record<string, SimulationResult> {
  const results: Record<string, SimulationResult> = {};
  
  for (const itemId in rawResults) {
    const item = foodItems.find(item => item.id === itemId);
    if (!item) continue;
    
    // Sort results for percentile calculations
    const servingsData = [...rawResults[itemId]].sort((a, b) => a - b);
    
    // Calculate basic statistics
    const mean = calculateMean(servingsData);
    const median = calculateMedian(servingsData);
    const min = servingsData[0];
    const max = servingsData[servingsData.length - 1];
    
    // Calculate percentile based on confidence level
    const percentileIndex = Math.floor((confidenceLevel / 100) * servingsData.length);
    const recommendedServings = servingsData[percentileIndex];
    
    // Calculate recommended units
    const recommendedUnits = Math.ceil(recommendedServings / item.servings);
    
    // Calculate total cost
    const totalCost = recommendedUnits * item.cost;
    
    // Calculate stockout risk (probability of needing more than recommended)
    const stockoutRisk = 100 - confidenceLevel;
    
    // Create distribution data for visualization
    const distribution = createDistributionData(servingsData, recommendedServings);
    
    // Assemble the result
    results[itemId] = {
      mean,
      median,
      min,
      max,
      recommendedServings,
      recommendedUnits,
      totalCost,
      stockoutRisk,
      distribution
    };
  }
  
  return results;
}

/**
 * Calculates the mean of a dataset
 */
function calculateMean(data: number[]): number {
  if (data.length === 0) return 0;
  const sum = data.reduce((acc, val) => acc + val, 0);
  return sum / data.length;
}

/**
 * Calculates the median of a dataset
 */
function calculateMedian(data: number[]): number {
  if (data.length === 0) return 0;
  
  const mid = Math.floor(data.length / 2);
  return data.length % 2 === 0
    ? (data[mid - 1] + data[mid]) / 2
    : data[mid];
}

/**
 * Creates distribution bins for visualization
 */
function createDistributionData(data: number[], recommendedValue: number): DistributionBin[] {
  if (data.length === 0) return [];
  
  const min = Math.floor(data[0]);
  const max = Math.ceil(data[data.length - 1]);
  
  // Create 10-15 bins depending on range
  const binCount = Math.min(15, Math.max(10, Math.ceil((max - min) / 5)));
  const binSize = (max - min) / binCount;
  
  // Initialize bins
  const bins: DistributionBin[] = [];
  for (let i = 0; i < binCount; i++) {
    const binMin = min + (i * binSize);
    const binMax = min + ((i + 1) * binSize);
    bins.push({
      min: binMin,
      max: binMax,
      count: 0,
      containsRecommendation: recommendedValue >= binMin && recommendedValue < binMax
    });
  }
  
  // Count data points in each bin
  data.forEach(value => {
    const binIndex = Math.min(binCount - 1, Math.floor((value - min) / binSize));
    bins[binIndex].count++;
  });
  
  return bins;
}

/**
 * Calculates the recommended simulation count based on desired precision and attendee count
 */
export function calculateRecommendedSimulationCount(attendees: number, desiredPrecision: 'low' | 'medium' | 'high' = 'medium'): number {
  // Base counts for different precision levels
  const baseCounts = {
    low: 100,
    medium: 500,
    high: 1000
  };
  
  // Scale based on attendee count (more attendees = more variability = need more simulations)
  const scaleFactor = Math.max(1, Math.log10(attendees / 10));
  
  // Calculate and round to a nice number
  const rawCount = baseCounts[desiredPrecision] * scaleFactor;
  
  // Round to nearest 100 or 1000 depending on size
  if (rawCount < 1000) {
    return Math.ceil(rawCount / 100) * 100;
  } else {
    return Math.ceil(rawCount / 1000) * 1000;
  }
}