"use client";

import React, { useState, useEffect } from 'react';
// Import components
import MainHeader from './components/MainHeader';
import InventoryStatus from './components/InventoryStatus';
import RecommendedQuantities from './components/RecommendedQuantities';
import DrinksList from './components/DrinksList';
import ServiceTips from './components/ServiceTips';
import CostSavingTips from './components/CostSavingTips';
import DrinkSimulator from './simulation/DrinkSimulator';

// Import types
import { ShoppingItem } from '@/types';
import { usePartyStore } from '@/store/usePartyStore';

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
  
  // Get advanced drink simulation state from store
  const { useAdvancedDrinkSim, setUseAdvancedDrinkSim, setActiveTab } = usePartyStore();
  
  // Local state to manage view toggle
  const [showSimpleView, setShowSimpleView] = useState(true);
  
  // Update showSimpleView when useAdvancedDrinkSim changes
  useEffect(() => {
    setShowSimpleView(!useAdvancedDrinkSim);
  }, [useAdvancedDrinkSim]);
  
  // Toggle between simple and advanced views
  const toggleView = () => {
    const newAdvancedMode = !useAdvancedDrinkSim;
    setUseAdvancedDrinkSim(newAdvancedMode);
    setShowSimpleView(!newAdvancedMode);
  };
  
  // Filter drinks-related items
  const drinkItems = shoppingItems.filter(item => 
    ['spirits', 'mixers', 'ice', 'supplies'].includes(item.category)
  );
  
  return (
    <div>
      {showSimpleView ? (
        <div className="space-y-6">
          {/* Main Planning Card */}
          <MainHeader 
            attendees={attendees} 
            drinksPerPerson={drinksPerPerson} 
            drinkRequirements={drinkRequirements}
            toggleView={toggleView}
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
      ) : (
        <DrinkSimulator 
          attendees={attendees}
          shoppingItems={shoppingItems}
          toggleView={toggleView}
          setActiveTab={setActiveTab}
        />
      )}
    </div>
  );
};

export default DrinksTab;