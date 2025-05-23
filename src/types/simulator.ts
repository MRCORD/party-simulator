import type { ShoppingItem, ItemRelationship } from './shopping';

/**
 * Types for the Monte Carlo food consumption simulator
 */

/**
 * Represents an eater profile for simulation
 * Defines the percentage of attendees and their consumption behavior
 */
export interface EaterProfile {
  name: string;
  percentage: number;
  servingsMultiplier: number;
}

/**
 * Distribution bin for visualization of simulation results
 */
export interface DistributionBin {
  min: number;
  max: number;
  count: number;
  containsRecommendation: boolean;
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

/**
 * Configuration for a Monte Carlo simulation run
 */
export interface SimulationConfig {
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
export interface RawSimulationResults {
  [itemId: string]: number[];
}

/**
 * Options for simulation confidence levels
 */
export interface ConfidenceLevelOption {
  value: number;
  label: string;
}

/**
 * Options for simulation count
 */
export interface SimulationCountOption {
  value: number;
  label: string;
}

/**
 * Props for the food simulator component
 */
export interface FoodSimulatorProps {
  attendees: number;
  foodServingsPerPerson: number;
  shoppingItems: ShoppingItem[];
  calculateFoodRequirements: () => {
    totalServings: number;
    hasEnoughMeat: boolean;
    hasEnoughSides: boolean;
    hasEnoughCondiments: boolean;
    meatCost: number;
    sidesCost: number;
    condimentsCost: number;
    totalCost: number;
  };
  getCategoryServings: (category: string) => number;
  toggleView: () => void;
  setActiveTab: (tab: 'overview' | 'shopping' | 'drinks' | 'food' | 'venue' | 'reports') => void;
  integratedMode?: boolean;
}

/**
 * Represents a drinker profile for drink simulation
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
 * Event factors that affect drink consumption
 */
export interface EventFactors {
  duration: number; // hours
  temperature: 'cold' | 'moderate' | 'hot';
  eventType: 'casual' | 'formal' | 'party';
  isOutdoor: boolean;
}

/**
 * Time period during the event with its own consumption characteristics
 */
export interface TimePeriod {
  name: string;
  durationPercentage: number; // percentage of total duration
  consumptionFactor: number; // multiplier for consumption rate
}

/**
 * Configuration for a Monte Carlo drink simulation run
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
 * Results of a Monte Carlo simulation for a drink item
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
  
  // Time-based consumption pattern
  timePeriodConsumption: {
    periodName: string;
    meanConsumption: number;
    peakConsumption: number;
  }[];
  
  // Distribution data for visualization
  distribution: DistributionBin[];
}