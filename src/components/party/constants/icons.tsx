import React from 'react';
import { 
  Wine, Droplet, Snowflake, Package, 
  Beef, Salad, UtensilsCrossed, Layers
} from 'lucide-react';

/**
 * Get the icon component for a category
 */
export const getCategoryIcon = (category: string, size: number = 4): React.ReactNode => {
  switch(category) {
    case 'spirits': return <Wine className={`w-${size} h-${size} text-primary`} />;
    case 'mixers': return <Droplet className={`w-${size} h-${size} text-accent-teal`} />;
    case 'ice': return <Snowflake className={`w-${size} h-${size} text-primary-light`} />;
    case 'meat': return <Beef className={`w-${size} h-${size} text-accent-amber`} />;
    case 'sides': return <Salad className={`w-${size} h-${size} text-success`} />;
    case 'condiments': return <UtensilsCrossed className={`w-${size} h-${size} text-warning`} />;
    case 'supplies': return <Package className={`w-${size} h-${size} text-accent-pink`} />;
    default: return <Layers className={`w-${size} h-${size} text-gray-500`} />;
  }
};

/**
 * Get the icon for an inventory status based on whether we have enough
 */
export const getInventoryStatusIcon = (
  category: string, 
  isEnough: boolean, 
  strokeWidth: number = 2.5
): React.ReactNode => {
  // You can customize based on category and status
  switch(category) {
    case 'spirits': return <Wine className={`w-5 h-5 ${isEnough ? 'text-success' : 'text-error'}`} strokeWidth={strokeWidth} />;
    case 'mixers': return <Droplet className={`w-5 h-5 ${isEnough ? 'text-success' : 'text-error'}`} strokeWidth={strokeWidth} />;
    case 'ice': return <Snowflake className={`w-5 h-5 ${isEnough ? 'text-success' : 'text-error'}`} strokeWidth={strokeWidth} />;
    case 'meat': return <Beef className={`w-5 h-5 ${isEnough ? 'text-success' : 'text-error'}`} strokeWidth={strokeWidth} />;
    case 'sides': return <Salad className={`w-5 h-5 ${isEnough ? 'text-success' : 'text-error'}`} strokeWidth={strokeWidth} />;
    case 'condiments': return <UtensilsCrossed className={`w-5 h-5 ${isEnough ? 'text-success' : 'text-error'}`} strokeWidth={strokeWidth} />;
    case 'supplies': return <Package className={`w-5 h-5 ${isEnough ? 'text-success' : 'text-error'}`} strokeWidth={strokeWidth} />;
    default: return <Layers className={`w-5 h-5 ${isEnough ? 'text-success' : 'text-error'}`} strokeWidth={strokeWidth} />;
  }
};