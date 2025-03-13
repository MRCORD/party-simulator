import React from 'react';
import { ShoppingItem } from '@/types';

interface HeaderStatsProps {
  shoppingItems: ShoppingItem[];
  getItemsByCategory?: () => Record<string, ShoppingItem[]>;
}

const HeaderStats: React.FC<HeaderStatsProps> = ({ 
  shoppingItems, 
  getItemsByCategory 
}) => {
  // Calculate total cost
  const totalCost = shoppingItems.reduce((sum, item) => sum + (item.cost * item.units), 0);
  
  // Count unique categories with items
  let uniqueCategoriesCount = 0;
  
  if (getItemsByCategory) {
    uniqueCategoriesCount = Object.values(getItemsByCategory()).filter(items => items.length > 0).length;
  } else {
    // If getItemsByCategory function is not provided, calculate directly
    const uniqueCategories = new Set(shoppingItems.map(item => item.category));
    uniqueCategoriesCount = uniqueCategories.size;
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
      <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3">
        <div className="text-sm opacity-80">Total Artículos</div>
        <div className="text-xl font-bold">{shoppingItems.length}</div>
      </div>
      <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3">
        <div className="text-sm opacity-80">Costo Total</div>
        <div className="text-xl font-extrabold">S/ {totalCost.toFixed(2)}</div>
      </div>
      <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3">
        <div className="text-sm opacity-80">Categorías</div>
        <div className="text-xl font-bold">{uniqueCategoriesCount}</div>
      </div>
    </div>
  );
};

export default HeaderStats;