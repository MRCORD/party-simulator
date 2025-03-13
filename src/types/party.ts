import { ReactNode } from 'react';

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