"use client";
import React, { useEffect } from 'react';
import { 
  Users, Wine, Utensils, MapPin, 
  FileBarChart, ShoppingBag, AlertCircle, CheckCircle,
  Sparkles
} from 'lucide-react';
import Tabs from '@/components/ui/Tabs';
// Import shared types
import { 
  CostBreakdownItem,
  FinancialOverviewItem
} from './types';
// Import tab components
import OverviewTab from './OverviewTab';
import ShoppingTab from './ShoppingTab';
import DrinksTab from './DrinksTab';
import FoodTab from './FoodTab';
import VenueTab from './VenueTab';
import ReportsTab from './ReportsTab';
// Import Zustand store
import { usePartyStore } from '@/store/usePartyStore';

// Main component
export default function PartySimulator() {
  // Get state and actions from our Zustand store
  const {
    // UI state
    activeTab,
    setActiveTab,

    // Shopping state
    shoppingItems,
    newItem,
    editingItem,

    // Basic parameters
    attendees,
    ticketPrice,
    venueCost,
    miscCosts,
    drinksPerPerson,
    foodServingsPerPerson,

    // Financial results
    totalRevenue,
    totalCosts,
    netProfit,
    perPersonCost,
    breakEvenAttendees,
    recommendedTicketPrice,
    isViable,

    // Constant values
    categories,
    sizeUnits,

    // Parameter actions
    setAttendees,
    setTicketPrice,
    setVenueCost,
    setMiscCosts,
    setDrinksPerPerson,
    setFoodServingsPerPerson,

    // Shopping actions
    addItem,
    deleteItem,
    startEdit,
    saveEdit,
    handleInputChange,

    // Helper functions
    getCategoryTotal,
    getCategoryServings,
    getItemsByCategory,
    getRecommendedUnits,
    calculateDrinkRequirements,
    calculateFoodRequirements,
    resetAllData
  } = usePartyStore();

  // Calculate financials on initial load
  useEffect(() => {
    usePartyStore.getState().updateFinancials();
  }, []);

  // Cost breakdown for charts
  const costBreakdown: CostBreakdownItem[] = [
    { name: 'Local', value: venueCost },
    { name: 'Bebidas', value: calculateDrinkRequirements().totalCost },
    { name: 'Comida', value: calculateFoodRequirements().totalCost },
    { name: 'Misceláneos', value: miscCosts }
  ];
  
  const COLORS = ['#2563eb', '#14b8a6', '#f59e0b', '#ec4899', '#10b981', '#1e3a8a'];
  
  // Financial overview data
  const financialOverview: FinancialOverviewItem[] = [
    { name: 'Ingresos Totales', amount: totalRevenue },
    { name: 'Costos Totales', amount: totalCosts },
    { name: 'Beneficio Neto', amount: netProfit }
  ];
  
  // JSON preview of all items
  const jsonPreview = JSON.stringify(shoppingItems, null, 2);
  
  // Tabs configuration
  const tabs = [
    { 
      label: 'Resumen', 
      icon: <Users size={18} />,
      content: (
        <OverviewTab 
          attendees={attendees}
          ticketPrice={ticketPrice}
          drinksPerPerson={drinksPerPerson}
          foodServingsPerPerson={foodServingsPerPerson}
          setAttendees={setAttendees}
          setTicketPrice={setTicketPrice}
          setDrinksPerPerson={setDrinksPerPerson}
          setFoodServingsPerPerson={setFoodServingsPerPerson}
          totalRevenue={totalRevenue}
          totalCosts={totalCosts}
          netProfit={netProfit}
          perPersonCost={perPersonCost}
          breakEvenAttendees={breakEvenAttendees}
          recommendedTicketPrice={recommendedTicketPrice}
          isViable={isViable}
          costBreakdown={costBreakdown}
          financialOverview={financialOverview}
          COLORS={COLORS}
          calculateDrinkRequirements={calculateDrinkRequirements}
          calculateFoodRequirements={calculateFoodRequirements}
          getCategoryServings={getCategoryServings}
        />
      )
    },
    { 
      label: 'Compras', 
      icon: <ShoppingBag size={18} />,
      content: (
        <ShoppingTab 
          newItem={newItem}
          editingItem={editingItem}
          handleInputChange={handleInputChange}
          addItem={addItem}
          saveEdit={saveEdit}
          categories={categories}
          sizeUnits={sizeUnits}
          shoppingItems={shoppingItems}
          getItemsByCategory={getItemsByCategory}
          startEdit={startEdit}
          deleteItem={deleteItem}
          jsonPreview={jsonPreview}
        />
      )
    },
    { 
      label: 'Bebidas', 
      icon: <Wine size={18} />,
      content: (
        <DrinksTab 
          attendees={attendees}
          drinksPerPerson={drinksPerPerson}
          shoppingItems={shoppingItems.filter(item => 
            ['spirits','mixers','ice','supplies'].includes(item.category)
          )}
          calculateDrinkRequirements={calculateDrinkRequirements}
          getCategoryServings={getCategoryServings}
          getRecommendedUnits={getRecommendedUnits}
        />
      ) 
    },
    { 
      label: 'Comida', 
      icon: <Utensils size={18} />,
      content: (
        <FoodTab 
          attendees={attendees}
          foodServingsPerPerson={foodServingsPerPerson}
          shoppingItems={shoppingItems.filter(item => 
            ['meat','sides','condiments'].includes(item.category)
          )}
          calculateFoodRequirements={calculateFoodRequirements}
          getCategoryServings={getCategoryServings}
          getRecommendedUnits={getRecommendedUnits}
        />
      )
    },
    { 
      label: 'Local', 
      icon: <MapPin size={18} />,
      content: (
        <VenueTab 
          venueCost={venueCost}
          setVenueCost={setVenueCost}
          miscCosts={miscCosts}
          setMiscCosts={setMiscCosts}
          attendees={attendees}
        />
      )
    },
    { 
      label: 'Informes', 
      icon: <FileBarChart size={18} />,
      content: (
        <ReportsTab 
          venueCost={venueCost}
          attendees={attendees}
          ticketPrice={ticketPrice}
          totalCosts={totalCosts}
          totalRevenue={totalRevenue}
          netProfit={netProfit}
          perPersonCost={perPersonCost}
          breakEvenAttendees={breakEvenAttendees}
          recommendedTicketPrice={recommendedTicketPrice}
          isViable={isViable}
          calculateDrinkRequirements={calculateDrinkRequirements}
          calculateFoodRequirements={calculateFoodRequirements}
          shoppingItems={shoppingItems}
          getCategoryTotal={getCategoryTotal}
        />
      )
    },
  ];
  
  // Map tab labels to their index for handling active tab
  const tabMap: { [key in 'overview'|'shopping'|'drinks'|'food'|'venue'|'reports']: number } = {
    overview: 0,
    shopping: 1,
    drinks: 2, 
    food: 3,
    venue: 4,
    reports: 5
  };
  
  // Helper to convert activeTab string to tab index
  const getActiveTabIndex = () => tabMap[activeTab] || 0;
  
  // Handle tab change by index
  const handleTabChange = (index: number) => {
    const tabKeys = Object.keys(tabMap);
    setActiveTab(tabKeys[index] as 'overview'|'shopping'|'drinks'|'food'|'venue'|'reports');
  };

  return (
    <div className="bg-gradient-to-br from-primary-light/70 to-white min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {/* Enhanced Header with softer colors */}
        <div className="bg-gradient-primary rounded-2xl mb-8 overflow-hidden shadow-lg">
          <div className="px-8 py-6 text-white relative overflow-hidden">
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 left-0 w-40 h-40 bg-white rounded-full -translate-x-1/2 -translate-y-1/2" />
              <div className="absolute bottom-0 right-0 w-60 h-60 bg-white rounded-full translate-x-1/4 translate-y-1/4" />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="bg-white text-primary p-4 rounded-xl mr-4 shadow-md">
                  <Sparkles size={32} />
                </div>
                <div>
                  <h1 className="text-3xl font-bold mb-1">Simulador de Fiestas</h1>
                  <p className="text-blue-100 text-lg">Organiza, planifica y visualiza todos los aspectos de tu próxima fiesta</p>
                </div>
              </div>
              
              <button
                onClick={resetAllData}
                className="bg-white/20 hover:bg-white/30 text-white px-3 py-1.5 rounded-lg text-sm transition-colors"
                title="Reiniciar datos"
              >
                Reiniciar datos
              </button>
            </div>
            
            {/* Status pills with softer colors */}
            <div className="mt-6 flex flex-wrap gap-3">
              <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full flex items-center">
                <Users size={16} className="mr-2 text-blue-100" />
                <span>{attendees} Asistentes</span>
              </div>
              <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full flex items-center">
                <span>S/ {ticketPrice} Entrada</span>
              </div>
              <div className={`px-4 py-2 rounded-full flex items-center ${isViable ? 'bg-success/80' : 'bg-error/80'}`}>
                {isViable ? 
                  <CheckCircle size={16} className="mr-2" /> : 
                  <AlertCircle size={16} className="mr-2" />
                }
                <span>{isViable ? 'Viable' : 'No Viable'}</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Improved Tab Navigation */}
        <div className="bg-white rounded-xl shadow-md p-2 mb-8">
          <Tabs
            tabs={tabs}
            initialTab={getActiveTabIndex()}
            onChange={handleTabChange}
            variant="pills"
            color="primary"
            size="md"
            fullWidth={false}
            className="animate-fadeIn"
          />
        </div>
      </div>
    </div>
  );
}