"use client";
import React from 'react';

// Import components
import ParametersCard from './components/ParametersCard';
import FinancialSummary from './components/FinancialSummary';
import CostBreakdown from './components/CostBreakdown';
import StatusSection from './components/StatusSection';
import SimulationCallout from './components/SimulationCallout';

interface OverviewTabProps {
  attendees: number;
  ticketPrice: number;
  drinksPerPerson: number;
  foodServingsPerPerson: number;
  setAttendees: (value: number) => void;
  setTicketPrice: (value: number) => void;
  setDrinksPerPerson: (value: number) => void;
  setFoodServingsPerPerson: (value: number) => void;
  totalRevenue: number;
  totalCosts: number;
  netProfit: number;
  perPersonCost: number;
  breakEvenAttendees: number;
  recommendedTicketPrice: number;
  isViable: boolean;
  costBreakdown: {
    name: string;
    value: number;
  }[];
  financialOverview: {
    name: string;
    amount: number;
  }[];
  COLORS: string[];
  calculateDrinkRequirements: () => any;
  calculateFoodRequirements: () => any;
  getCategoryServings: (category: string) => number;
  
  // Food simulator props
  useAdvancedFoodSim: boolean;
  setUseAdvancedFoodSim: (value: boolean) => void;
  setActiveTab: (tab: 'overview' | 'shopping' | 'drinks' | 'food' | 'venue' | 'reports') => void;
}

const OverviewTab: React.FC<OverviewTabProps> = ({
  attendees,
  ticketPrice,
  drinksPerPerson,
  foodServingsPerPerson,
  setAttendees,
  setTicketPrice,
  setDrinksPerPerson,
  setFoodServingsPerPerson,
  totalRevenue,
  totalCosts,
  netProfit,
  perPersonCost,
  breakEvenAttendees,
  recommendedTicketPrice,
  isViable,
  costBreakdown,
  financialOverview,
  COLORS,
  calculateDrinkRequirements,
  calculateFoodRequirements,
  getCategoryServings,
  useAdvancedFoodSim,
  setUseAdvancedFoodSim,
  setActiveTab
}) => {
  const drinkRequirements = calculateDrinkRequirements();
  const foodRequirements = calculateFoodRequirements();
  
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ParametersCard 
          attendees={attendees}
          ticketPrice={ticketPrice}
          drinksPerPerson={drinksPerPerson}
          foodServingsPerPerson={foodServingsPerPerson}
          setAttendees={setAttendees}
          setTicketPrice={setTicketPrice}
          setDrinksPerPerson={setDrinksPerPerson}
          setFoodServingsPerPerson={setFoodServingsPerPerson}
          useAdvancedFoodSim={useAdvancedFoodSim}
          setUseAdvancedFoodSim={setUseAdvancedFoodSim}
          setActiveTab={setActiveTab}
        />
        <FinancialSummary 
          totalRevenue={totalRevenue}
          totalCosts={totalCosts}
          netProfit={netProfit}
          perPersonCost={perPersonCost}
          breakEvenAttendees={breakEvenAttendees}
          recommendedTicketPrice={recommendedTicketPrice}
          isViable={isViable}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <CostBreakdown 
          costBreakdown={costBreakdown}
          COLORS={COLORS}
        />
        <CostBreakdown 
          costBreakdown={financialOverview}
          COLORS={COLORS}
          isFinancialOverview={true}
        />
      </div>
      
      <StatusSection 
        attendees={attendees}
        drinksPerPerson={drinksPerPerson}
        foodServingsPerPerson={foodServingsPerPerson}
        isViable={isViable}
        ticketPrice={ticketPrice}
        recommendedTicketPrice={recommendedTicketPrice}
        attendancePercentage={Math.min(100, (attendees / breakEvenAttendees) * 100)}
        breakEvenAttendees={breakEvenAttendees}
        drinkRequirements={drinkRequirements}
        foodRequirements={foodRequirements}
        getCategoryServings={getCategoryServings}
        useAdvancedFoodSim={useAdvancedFoodSim}
        setUseAdvancedFoodSim={setUseAdvancedFoodSim}
        setActiveTab={setActiveTab}
      />
      
      {!useAdvancedFoodSim && (
        <SimulationCallout 
          setUseAdvancedFoodSim={setUseAdvancedFoodSim}
          setActiveTab={setActiveTab}
        />
      )}
    </div>
  );
};

export default OverviewTab;