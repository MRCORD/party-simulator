import { ReactNode } from 'react';
import { ShoppingItem } from './shopping';
import { DrinkRequirements, FoodRequirements } from './food';

/**
 * Tab definition
 */
export interface Tab {
  label: string;
  icon?: ReactNode;
  content?: ReactNode;
}

/**
 * Category definition
 */
export interface Category {
  value: string;
  label: string;
}

/**
 * For cost breakdown charts
 */
export interface CostBreakdownItem {
  name: string;
  value: number;
}

/**
 * For financial overview charts
 */
export interface FinancialOverviewItem {
  name: string;
  amount: number;
}

/**
 * For venue/report tabs
 */
export interface VenueCosts {
  venue: number;
  misc: number;
}

/**
 * Reports tab props
 */
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
  shoppingItems: ShoppingItem[];
  getCategoryTotal: (category: string) => number;
  setActiveTab: (tab: 'overview' | 'shopping' | 'drinks' | 'food' | 'venue' | 'reports') => void;
}