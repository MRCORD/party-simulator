import React, { useEffect } from 'react';
import { usePartyStore } from '@/store/usePartyStore';
import { CostBreakdownItem, FinancialOverviewItem } from './types';

// Import refactored components
import PartyHeader from './layout/PartyHeader';
import PartyTabs from './navigation/PartyTabs';
import { tabConfigs, getIndexFromTabKey, getTabKeyFromIndex } from './constants/tabConfig';

// Import tabs
import OverviewTab from './tabs/overview/OverviewTab';
import ShoppingTab from './tabs/shopping/ShoppingTab';
import DrinksTab from './tabs/drinks/DrinksTab';
import FoodTab from './tabs/food/FoodTab';
import VenueTab from './tabs/venue/VenueTab';
import ReportsTab from './tabs/reports/ReportsTab';

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
    // Complementary items state
    itemRelationships,
    addItemRelationship,
    removeItemRelationship,

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

    // Food simulation state
    useAdvancedFoodSim, 
    setUseAdvancedFoodSim,
    simulationResults,

    // Constants
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
  
  // Create the tab content components
  const tabContents = [
    // Overview Tab
    <OverviewTab 
      key="overview"
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
      useAdvancedFoodSim={useAdvancedFoodSim}
      setUseAdvancedFoodSim={setUseAdvancedFoodSim}
      setActiveTab={setActiveTab}
    />,
    
    // Shopping Tab
    <ShoppingTab 
      key="shopping"
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
      itemRelationships={itemRelationships}
      addItemRelationship={addItemRelationship}
      removeItemRelationship={removeItemRelationship}
    />,
    
    // Drinks Tab
    <DrinksTab 
      key="drinks"
      attendees={attendees}
      drinksPerPerson={drinksPerPerson}
      shoppingItems={shoppingItems.filter(item => 
        ['spirits','mixers','ice','supplies'].includes(item.category)
      )}
      calculateDrinkRequirements={calculateDrinkRequirements}
      getCategoryServings={getCategoryServings}
      getRecommendedUnits={getRecommendedUnits}
    />,
    
    // Food Tab
    <FoodTab 
      key="food"
      attendees={attendees}
      foodServingsPerPerson={foodServingsPerPerson}
      shoppingItems={shoppingItems.filter(item => 
        ['meat','sides','condiments'].includes(item.category)
      )}
      calculateFoodRequirements={calculateFoodRequirements}
      getCategoryServings={getCategoryServings}
      getRecommendedUnits={getRecommendedUnits}
      useAdvancedFoodSim={useAdvancedFoodSim}
      setUseAdvancedFoodSim={setUseAdvancedFoodSim}
      simulationResults={simulationResults}
      setActiveTab={setActiveTab}
    />,
    
    // Venue Tab
    <VenueTab 
      key="venue"
      venueCost={venueCost}
      setVenueCost={setVenueCost}
      miscCosts={miscCosts}
      setMiscCosts={setMiscCosts}
      attendees={attendees}
    />,
    
    // Reports Tab
    <ReportsTab 
      key="reports"
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
  ];
  
  // Configure the tabs data structure using our configuration
  const tabs = tabConfigs.map((config, index) => ({
    label: config.label,
    icon: config.icon,
    content: tabContents[index]
  }));
  
  // Helper to convert activeTab string to tab index
  const activeTabIndex = getIndexFromTabKey(activeTab);
  
  // Handle tab change by index
  const handleTabChange = (index: number) => {
    const tabKey = getTabKeyFromIndex(index);
    setActiveTab(tabKey);
  };

  return (
    <div className="bg-gradient-to-br from-primary-light/70 to-white min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header component */}
        <PartyHeader 
          attendees={attendees}
          ticketPrice={ticketPrice}
          isViable={isViable}
          useAdvancedFoodSim={useAdvancedFoodSim}
          itemRelationships={itemRelationships}
          resetAllData={resetAllData}
        />
        
        {/* Tabs navigation */}
        <PartyTabs 
          tabs={tabs}
          activeTabIndex={activeTabIndex}
          onTabChange={handleTabChange}
        />
      </div>
    </div>
  );
}