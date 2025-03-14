"use client";

import React from 'react';
// Remove Wine import since it's not used

// Import components
import MainHeader from './components/MainHeader';
import InventoryStatus from './components/InventoryStatus';
import RecommendedQuantities from './components/RecommendedQuantities';
import DrinksList from './components/DrinksList';
import ServiceTips from './components/ServiceTips';
import CostSavingTips from './components/CostSavingTips';

// Import types
import { ShoppingItem } from '@/types';

interface DrinkRequirements {
  hasEnoughSpirits: boolean;
  hasEnoughMixers: boolean;
  hasEnoughSupplies: boolean;
  hasEnoughIce: boolean;
  totalDrinks: number;
  totalCost: number;
}

interface DrinksTabProps {
  attendees: number;
  drinksPerPerson: number;
  shoppingItems: ShoppingItem[];
  calculateDrinkRequirements: () => DrinkRequirements;
  getCategoryServings: (category: string) => number;
  getRecommendedUnits: (category: string, totalDrinks: number) => number;
}

const DrinksTab: React.FC<DrinksTabProps> = ({
  attendees,
  drinksPerPerson,
  shoppingItems,
  calculateDrinkRequirements,
  getCategoryServings,
  getRecommendedUnits
}) => {
  const drinkRequirements = calculateDrinkRequirements();
  
  // Filter drinks-related items
  const drinkItems = shoppingItems.filter(item => 
    ['spirits', 'mixers', 'ice', 'supplies'].includes(item.category)
  );
  
  return (
    <div className="space-y-6">
      {/* Main Planning Card */}
      <MainHeader 
        attendees={attendees} 
        drinksPerPerson={drinksPerPerson} 
        drinkRequirements={drinkRequirements} 
      />
      
      {/* Two Column Layout for Inventory Status and Recommended Quantities */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Inventory Status */}
        <InventoryStatus 
          getCategoryServings={getCategoryServings}
          drinkRequirements={drinkRequirements}
        />
        
        {/* Recommended Quantities */}
        <RecommendedQuantities 
          getRecommendedUnits={getRecommendedUnits}
          drinkRequirements={drinkRequirements}
          shoppingItems={shoppingItems}
        />
      </div>
      
      {/* Drinks Detail Table */}
      <DrinksList drinkItems={drinkItems} drinkRequirements={drinkRequirements} />
      
      {/* Planning Tips */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Service Options */}
        <ServiceTips />
        
        {/* Cost Saving Tips */}
        <CostSavingTips />
      </div>
    </div>
  );
};

export default DrinksTab;