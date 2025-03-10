// Centralized type definitions for the party simulator

// Base shopping item definition used throughout all components
export interface ShoppingItem {
    id: string;
    name: string;
    category: 'spirits' | 'mixers' | 'ice' | 'meat' | 'sides' | 'condiments' | 'supplies' | 'other';
    cost: number;
    units: number;
    size: number;
    sizeUnit: string;
    servings: number;
    totalCost: number;
  }
  
  // Drink-related types
  export interface DrinkRequirements {
    totalDrinks: number;
    totalCost: number;
    spiritsCost: number;
    mixersCost: number;
    iceCost: number;
    suppliesCost: number;
    hasEnoughSpirits: boolean;
    hasEnoughMixers: boolean;
    hasEnoughIce: boolean;
    hasEnoughSupplies: boolean;
  }
  
  // Food-related types
  export interface FoodRequirements {
    totalServings: number;
    totalCost: number;
    meatCost: number;
    sidesCost: number;
    condimentsCost: number;
    hasEnoughMeat: boolean;
    hasEnoughSides: boolean;
    hasEnoughCondiments: boolean;
  }
  
  // For cost breakdown charts
  export interface CostBreakdownItem {
    name: string;
    value: number;
  }
  
  // For financial overview charts
  export interface FinancialOverviewItem {
    name: string;
    amount: number;
  }
  
  // Category definition
  export interface Category {
    value: string;
    label: string;
  }
  
  // For venue/report tabs
  export interface VenueCosts {
    venue: number;
    misc: number;
  }