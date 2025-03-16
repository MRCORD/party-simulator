import { ShoppingItem, ItemRelationship } from './shopping';

/**
 * Types for drink-related simulation and calculations
 */

/**
 * Represents a drinker profile for simulation
 * Defines the percentage of attendees and their consumption behavior
 */
export interface DrinkerProfile {
  name: string;
  percentage: number;
  alcoholicDrinksMultiplier: number;
  nonAlcoholicDrinksMultiplier: number;
  prefersBeer?: boolean;
  prefersSpirits?: boolean;
  prefersWine?: boolean;
}

/**
 * Time period for modeling different phases of consumption during an event
 */
export interface TimePeriod {
  name: string;             // e.g., "Early", "Peak", "Late"
  durationPercentage: number; // Portion of event duration, should sum to 100
  consumptionFactor: number;  // Multiplier for consumption rate during this period
}

/**
 * Environmental factors affecting drink consumption
 */
export interface EventFactors {
  duration: number;         // Event duration in hours
  temperature: 'cool' | 'moderate' | 'hot'; // Temperature factor
  eventType: 'formal' | 'casual' | 'party'; // Type of event
  isOutdoor: boolean;       // Whether event is outdoors
}

/**
 * Configuration for a drink simulation run
 */
export interface DrinkSimulationConfig {
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
 * Results of a drink simulation for a beverage item
 */
export interface DrinkSimulationResult {
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
  distribution: DrinkDistributionBin[];
  
  // Timeline data for time-based consumption
  timeline: TimelineConsumptionPoint[];
}

/**
 * Distribution bin for drink visualization
 */
export interface DrinkDistributionBin {
  min: number;
  max: number;
  count: number;
  containsRecommendation: boolean;
}

/**
 * Data point for timeline visualization
 */
export interface TimelineConsumptionPoint {
  timePeriod: string;
  percentage: number;
  servings: number;
}

/**
 * Mixed drink recipe specification
 */
export interface MixedDrinkRecipe {
  name: string;
  ingredients: {
    itemId: string;
    quantity: number;
    unit: string;
  }[];
}

/**
 * Category-specific consumption statistics
 */
export interface CategoryConsumption {
  category: string;
  servings: number;
  percentage: number;
  cost: number;
}