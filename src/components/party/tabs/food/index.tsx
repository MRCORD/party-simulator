"use client";
import React, { useState, useEffect } from 'react';
import BasicView from '@/components/party/tabs/food/components/BasicView';
import FoodSimulator from '@/components/party/tabs/food/simulation/FoodSimulator';
import { ShoppingItem } from '@/types/shopping';
import { FoodRequirements } from '@/types/food';
import { usePartyStore } from '@/store/usePartyStore';
import { SimulationResult } from '@/types/simulator';

interface FoodTabProps {
  attendees: number;
  foodServingsPerPerson: number;
  shoppingItems: ShoppingItem[];
  calculateFoodRequirements: () => FoodRequirements;
  getCategoryServings: (category: string) => number;
  getRecommendedUnits: (category: string, totalServings: number) => number;
  useAdvancedFoodSim: boolean;
  setUseAdvancedFoodSim: (value: boolean) => void;
  simulationResults: Record<string, SimulationResult>;
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
  // Omitting simulationResults from destructuring since we don't use it
  // simulationResults,
  setActiveTab
}) => {
  const [showSimpleView, setShowSimpleView] = useState(true);
  const { itemRelationships } = usePartyStore();

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
          itemRelationships={itemRelationships}
        />
      ) : (
        <FoodSimulator 
          attendees={attendees}
          shoppingItems={shoppingItems}
          toggleView={toggleView}
          setActiveTab={setActiveTab}
          getRecommendedUnits={getRecommendedUnits}
          integratedMode={true}
        />
      )}
    </div>
  );
};

export default FoodTab;