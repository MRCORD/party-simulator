import React from 'react';

// Centralized type definitions for the party simulator

// Base shopping item definition used throughout all components
export interface ShoppingItem {
  id: string;
  name: string;
  url?: string; // Optional URL field
  category: 'spirits' | 'mixers' | 'ice' | 'meat' | 'sides' | 'condiments' | 'supplies' | 'other';
  cost: number;
  units: number;
  size: string;
  sizeUnit: string;
  servings: number;
  totalCost: number;
}

// New type for complementary item relationships
export interface ItemRelationship {
  primaryItemId: string;
  secondaryItemId: string;
  ratio: number; // How many secondary items per one primary item
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

// Shopping tab props
export interface ShoppingTabProps {
  newItem: Omit<ShoppingItem, 'id'>;
  editingItem: ShoppingItem | null;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  addItem: () => void;
  saveEdit: () => void;
  categories: Category[];
  sizeUnits: { [key: string]: string[] };
  shoppingItems: ShoppingItem[];
  getItemsByCategory: () => { [key: string]: ShoppingItem[] };
  startEdit: (item: ShoppingItem) => void;
  deleteItem: (id: string) => void;
  jsonPreview: string;
  itemRelationships?: ItemRelationship[];
}

// Props for ComplementaryItemsManager component
export interface ComplementaryItemsProps {
  shoppingItems: ShoppingItem[];
  itemRelationships: ItemRelationship[];
  addItemRelationship: (relationship: ItemRelationship) => void;
  removeItemRelationship: (index: number) => void;
}

// Reports tab props
export interface ReportsTabProps {
  venueCost: number;
  attendees: number;
  ticketPrice: number;
  totalCosts: number;
  totalRevenue: number;
  netProfit: number;
  perPersonCost: number;
  breakEvenAttendees: number;
  recommendedTicketPrice: number;
  isViable: boolean;
  calculateDrinkRequirements: () => DrinkRequirements;
  calculateFoodRequirements: () => FoodRequirements;
  drinksPerPerson: number;
  foodServingsPerPerson: number;
  shoppingItems: ShoppingItem[];
  getCategoryTotal: (category: string) => number;
}

// Food Simulator types
export interface EaterProfile {
  name: string;
  percentage: number;
  servingsMultiplier: number;
}

export interface SimulationResult {
  mean: number;
  min: number;
  max: number;
  recommended: number;
  recommendedUnits: number;
  risks: {
    low: { servings: number, riskPercentage: number };
    medium: { servings: number, riskPercentage: number };
    high: { servings: number, riskPercentage: number };
  }
}