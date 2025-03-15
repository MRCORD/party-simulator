import { ShoppingItem, ItemRelationship } from '@/types/shopping';
import { DrinkerProfile, EventFactors, TimePeriod, DrinkSimulationResult, TimelineConsumptionPoint, DrinkDistributionBin } from '@/types/drinks';

/**
 * Configuration for a drink simulation run
 */
interface DrinkSimulationConfig {
  attendees: number;
  drinkerProfiles: DrinkerProfile[];
  drinkItems: ShoppingItem[];
  eventFactors: EventFactors;
  timePeriods: TimePeriod[];
  itemRelationships: ItemRelationship[];
  confidenceLevel: number;
  simulationCount: number;
}

/**
 * Raw results of a drink simulation before final analysis
 */
interface RawDrinkSimulationResults {
  [itemId: string]: {
    servings: number[];
    timelineData: { [timePeriod: string]: number[] };
  };
}

/**
 * Runs a Monte Carlo simulation to predict drink consumption
 * 
 * @param config - Simulation configuration
 * @returns Simulation results with recommendations
 */
export function runDrinkMonteCarlo(config: DrinkSimulationConfig): Record<string, DrinkSimulationResult> {
  const { 
    attendees, 
    drinkerProfiles, 
    drinkItems, 
    eventFactors,
    timePeriods,
    itemRelationships, 
    confidenceLevel, 
    simulationCount 
  } = config;
  
  // Initialize raw results
  const rawResults: RawDrinkSimulationResults = {};
  drinkItems.forEach(item => {
    rawResults[item.id] = { 
      servings: [],
      timelineData: {}
    };
    
    // Initialize timeline data buckets for each time period
    timePeriods.forEach(period => {
      rawResults[item.id].timelineData[period.name] = [];
    });
  });
  
  // Normalize profiles to ensure percentages sum to 100%
  const normalizedProfiles = normalizeProfiles(drinkerProfiles);
  
  // Apply temperature and event type modifiers
  const environmentalFactor = calculateEnvironmentalFactor(eventFactors);
  
  // Run multiple simulations
  for (let sim = 0; sim < simulationCount; sim++) {
    // Assign attendees to different profiles
    const profileDistribution = assignAttendeesToProfiles(attendees, normalizedProfiles);
    
    // For each drink item, calculate consumption in this simulation
    drinkItems.forEach(item => {
      const isAlcoholic = item.category === 'spirits' || item.category === 'beer' || item.category === 'wine';
      const isMixer = item.category === 'mixers';
      
      // Track total servings across all time periods
      let totalServings = 0;
      
      // Simulate consumption for each time period
      timePeriods.forEach(period => {
        const periodServings = calculateServingsForTimePeriod(
          profileDistribution,
          period,
          isAlcoholic,
          isMixer,
          item.category,
          environmentalFactor
        );
        
        totalServings += periodServings;
        rawResults[item.id].timelineData[period.name].push(periodServings);
      });
      
      // Store total servings for this simulation
      rawResults[item.id].servings.push(totalServings);
    });
  }
  
  // Process complementary relationships (e.g., spirits and mixers)
  processComplementaryDrinkRelationships(rawResults, drinkItems, itemRelationships);
  
  // Analyze raw results and generate final recommendations
  return analyzeResults(rawResults, drinkItems, confidenceLevel, timePeriods);
}

/**
 * Normalizes drinker profiles to ensure percentages sum to 100%
 */
function normalizeProfiles(profiles: DrinkerProfile[]): DrinkerProfile[] {
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
 * Calculates environmental factor based on temperature, event type, etc.
 */
function calculateEnvironmentalFactor(factors: EventFactors): number {
  // Base factor
  let factor = 1.0;
  
  // Temperature adjustment
  switch (factors.temperature) {
    case 'cool':
      factor *= 0.8;
      break;
    case 'hot':
      factor *= 1.3;
      break;
    default: // moderate
      break;
  }
  
  // Event type adjustment
  switch (factors.eventType) {
    case 'formal':
      factor *= 0.9;
      break;
    case 'party':
      factor *= 1.2;
      break;
    default: // casual
      break;
  }
  
  // Outdoor adjustment
  if (factors.isOutdoor) {
    factor *= 1.1;
  }
  
  // Duration impact (diminishing returns for very long events)
  factor *= Math.min(1.5, 0.8 + (factors.duration / 10));
  
  return factor;
}

/**
 * Assigns attendees to different drinker profiles based on percentages
 */
function assignAttendeesToProfiles(
  attendees: number, 
  profiles: DrinkerProfile[]
): Map<DrinkerProfile, number> {
  const distribution = new Map<DrinkerProfile, number>();
  
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
 * Calculates servings for a specific time period
 */
function calculateServingsForTimePeriod(
  profileDistribution: Map<DrinkerProfile, number>,
  period: TimePeriod,
  isAlcoholic: boolean,
  isMixer: boolean,
  category: string,
  environmentalFactor: number
): number {
  let periodServings = 0;
  
  profileDistribution.forEach((attendeeCount, profile) => {
    // Choose the right multiplier based on drink type
    const baseMultiplier = isAlcoholic 
      ? profile.alcoholicDrinksMultiplier 
      : profile.nonAlcoholicDrinksMultiplier;
    
    // Apply preferences for specific categories
    let categoryMultiplier = 1.0;
    if (category === 'beer' && profile.prefersBeer) categoryMultiplier = 1.3;
    if (category === 'spirits' && profile.prefersSpirits) categoryMultiplier = 1.3;
    if (category === 'wine' && profile.prefersWine) categoryMultiplier = 1.3;
    
    // Calculate per-person consumption for this time period
    const periodConsumption = baseMultiplier * 
                            categoryMultiplier *
                            period.consumptionFactor * 
                            environmentalFactor * 
                            (period.durationPercentage / 100);
    
    // Add random variation (normal distribution around the base rate)
    for (let i = 0; i < attendeeCount; i++) {
      // Using Box-Muller transform to generate normally distributed random numbers
      const u1 = Math.random();
      const u2 = Math.random();
      const z0 = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
      
      // Standard deviation of 20% of the base rate
      const stdDev = periodConsumption * 0.2;
      
      // Calculate the consumption with random variation, ensure it's positive
      const attendance = Math.random() < 0.95 ? 1 : 0; // 5% chance attendee misses this period
      const consumption = attendance * Math.max(0.01, periodConsumption + z0 * stdDev);
      
      periodServings += consumption;
    }
  });
  
  return periodServings;
}

/**
 * Process complementary item relationships for mixed drinks
 */
function processComplementaryDrinkRelationships(
  results: RawDrinkSimulationResults,
  drinkItems: ShoppingItem[],
  relationships: ItemRelationship[]
): void {
  if (relationships.length === 0) return;
  
  Object.keys(results).forEach(itemId => {
    const simulations = results[itemId].servings.length;
    
    for (let sim = 0; sim < simulations; sim++) {
      // Process each relationship
      relationships.forEach(rel => {
        const primaryItem = drinkItems.find(item => item.id === rel.primaryItemId);
        const secondaryItem = drinkItems.find(item => item.id === rel.secondaryItemId);
        
        if (!primaryItem || !secondaryItem) return;
        
        // Specific handling for spirits and mixers
        const isPrimarySpirit = primaryItem.category === 'spirits';
        const isSecondaryMixer = secondaryItem.category === 'mixers';
        
        // If we have a spirit-mixer relationship, apply special rules
        if (isPrimarySpirit && isSecondaryMixer) {
          const primaryConsumption = results[rel.primaryItemId].servings[sim];
          
          // Calculate required mixer based on relationship ratio
          const requiredMixerServings = primaryConsumption * rel.ratio;
          
          // If secondary is the current item and current consumption is less than required
          if (secondaryItem.id === itemId && results[itemId].servings[sim] < requiredMixerServings) {
            results[itemId].servings[sim] = requiredMixerServings;
            
            // Also adjust timeline data proportionally
            const periodNames = Object.keys(results[itemId].timelineData);
            periodNames.forEach(periodName => {
              const primaryPeriodConsumption = results[primaryItem.id].timelineData[periodName][sim];
              const requiredPeriodConsumption = primaryPeriodConsumption * rel.ratio;
              
              if (results[itemId].timelineData[periodName][sim] < requiredPeriodConsumption) {
                results[itemId].timelineData[periodName][sim] = requiredPeriodConsumption;
              }
            });
          }
        }
      });
    }
  });
}

/**
 * Analyzes simulation results and generates recommendations
 */
function analyzeResults(
  rawResults: RawDrinkSimulationResults,
  drinkItems: ShoppingItem[],
  confidenceLevel: number,
  timePeriods: TimePeriod[]
): Record<string, DrinkSimulationResult> {
  const results: Record<string, DrinkSimulationResult> = {};
  
  for (const itemId in rawResults) {
    const item = drinkItems.find(item => item.id === itemId);
    if (!item) continue;
    
    // Sort results for percentile calculations
    const servingsData = [...rawResults[itemId].servings].sort((a, b) => a - b);
    
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
    
    // Create timeline consumption data
    const timeline = createTimelineData(rawResults[itemId].timelineData, timePeriods, recommendedServings);
    
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
      distribution,
      timeline
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
function createDistributionData(data: number[], recommendedValue: number): DrinkDistributionBin[] {
  if (data.length === 0) return [];
  
  const min = Math.floor(data[0]);
  const max = Math.ceil(data[data.length - 1]);
  
  // Create 10-15 bins depending on range
  const binCount = Math.min(15, Math.max(10, Math.ceil((max - min) / 5)));
  const binSize = (max - min) / binCount;
  
  // Initialize bins
  const bins: DrinkDistributionBin[] = [];
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
 * Creates timeline data for time-based consumption visualization
 */
function createTimelineData(
  timelineData: { [timePeriod: string]: number[] },
  timePeriods: TimePeriod[],
  totalRecommendedServings: number
): TimelineConsumptionPoint[] {
  const result: TimelineConsumptionPoint[] = [];
  
  // Calculate mean servings for each time period
  timePeriods.forEach(period => {
    const periodData = timelineData[period.name] || [];
    if (periodData.length === 0) return;
    
    const meanServings = calculateMean(periodData);
    
    // Calculate percentage of total
    const percentage = (meanServings / totalRecommendedServings) * 100;
    
    result.push({
      timePeriod: period.name,
      percentage,
      servings: meanServings
    });
  });
  
  return result;
}

/**
 * Calculates the recommended simulation count based on attendee count
 */
export function calculateRecommendedDrinkSimulationCount(attendees: number, desiredPrecision: 'low' | 'medium' | 'high' = 'medium'): number {
  // Base counts for different precision levels
  const baseCounts = {
    low: 100,
    medium: 500,
    high: 1000
  };
  
  // Scale based on attendee count
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