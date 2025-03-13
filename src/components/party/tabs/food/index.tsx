"use client";
import React, { useState, useEffect } from 'react';
import BasicView from './components/BasicView';
import FoodSimulator from './simulation/FoodSimulator';
import { 
  ShoppingItem, 
  FoodRequirements 
} from '@/components/party/types';

interface FoodTabProps {
  attendees: number;
  foodServingsPerPerson: number;
  shoppingItems: ShoppingItem[];
  calculateFoodRequirements: () => FoodRequirements;
  getCategoryServings: (category: string) => number;
  getRecommendedUnits: (category: string, totalServings: number) => number;
  useAdvancedFoodSim: boolean;
  setUseAdvancedFoodSim: (value: boolean) => void;
  simulationResults?: Record<string, any>;
  setActiveTab: (tab: 'overview' | 'shopping' | 'drinks' | 'food' | 'venue' | 'reports') => void;
}

const FoodTab: React.FC<FoodTabProps> = ({
  attendees,
  foodServingsPerPerson,
  shoppingItems,
  calculateFoodRequirements,
  getCategoryServings,
  getRecommendedUnits,
  useAdvancedFoodSim,
  setUseAdvancedFoodSim,
  simulationResults,
  setActiveTab
}) => {
  const [showSimpleView, setShowSimpleView] = useState(true);

  // Update showSimpleView when useAdvancedFoodSim changes
  useEffect(() => {
    setShowSimpleView(!useAdvancedFoodSim);
  }, [useAdvancedFoodSim]);

  // Toggle between simple and advanced views
  const toggleView = () => {
    const newAdvancedMode = !useAdvancedFoodSim;
    setUseAdvancedFoodSim(newAdvancedMode);
    setShowSimpleView(!newAdvancedMode);
  };

  return (
    <div>
      {showSimpleView ? (
        <BasicView 
          attendees={attendees}
          foodServingsPerPerson={foodServingsPerPerson}
          shoppingItems={shoppingItems}
          calculateFoodRequirements={calculateFoodRequirements}
          getCategoryServings={getCategoryServings}
          getRecommendedUnits={getRecommendedUnits}
          toggleView={toggleView}
          setActiveTab={setActiveTab}
        />
      ) : (
        <FoodSimulator 
          attendees={attendees}
          foodServingsPerPerson={foodServingsPerPerson}
          shoppingItems={shoppingItems}
          calculateFoodRequirements={calculateFoodRequirements}
          getCategoryServings={getCategoryServings}
          toggleView={toggleView}
          setActiveTab={setActiveTab}
          integratedMode={true}
        />
      )}
    </div>
  );
};

export default FoodTab;