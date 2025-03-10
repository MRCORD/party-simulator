"use client";

import React, { useState, useEffect } from 'react';
import { Users, DollarSign, Wine, Utensils, MapPin, FileBarChart, ShoppingBag, AlertCircle, CheckCircle } from 'lucide-react';
import OverviewTab from './OverviewTab';
import ShoppingTab from './ShoppingTab';
import DrinksTab from './DrinksTab';
import FoodTab from './FoodTab';
import VenueTab from './VenueTab';
import ReportsTab from './ReportsTab';
import StatusItem from './StatusItem';
import StatusBar from './StatusBar';

// Main component
export default function PartySimulator() {
  // Tab state
  const [activeTab, setActiveTab] = useState('overview');
  
  // JSON data for shopping items
  const [shoppingItems, setShoppingItems] = useState([
    // Default items for demonstration
    { id: 1, name: 'Ron Cartavio', category: 'spirits', cost: 45, units: 1, size: '750', sizeUnit: 'ml', servings: 15 },
    { id: 2, name: 'Coca-Cola', category: 'mixers', cost: 30, units: 6, size: '1.5', sizeUnit: 'L', servings: 30 },
    { id: 3, name: 'Hielo', category: 'ice', cost: 12, units: 1, size: '5', sizeUnit: 'kg', servings: 25 },
    { id: 4, name: 'Pollo', category: 'meat', cost: 180, units: 1, size: '10', sizeUnit: 'kg', servings: 20 },
    { id: 5, name: 'Ensalada de Papa', category: 'sides', cost: 120, units: 1, size: '5', sizeUnit: 'kg', servings: 25 },
    { id: 6, name: 'Pack de Salsas', category: 'condiments', cost: 60, units: 1, size: '1', sizeUnit: 'pack', servings: 30 },
    { id: 7, name: 'Vasos Rojos', category: 'supplies', cost: 15, units: 100, size: '16', sizeUnit: 'oz', servings: 100 },
  ]);
  
  // New item form
  const [newItem, setNewItem] = useState({
    name: '',
    category: 'spirits',
    cost: 0,
    units: 1,
    size: '0',
    sizeUnit: 'ml',
    servings: 0
  });
  
  // Editing state
  const [editingItem, setEditingItem] = useState(null);
  
  // Basic parameters
  const [attendees, setAttendees] = useState(40);
  const [ticketPrice, setTicketPrice] = useState(80);
  const [venueCost, setVenueCost] = useState(1500);
  const [miscCosts, setMiscCosts] = useState(600);
  const [drinksPerPerson, setDrinksPerPerson] = useState(4);
  const [foodServingsPerPerson, setFoodServingsPerPerson] = useState(1);
  
  // Financial results
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalCosts, setTotalCosts] = useState(0);
  const [netProfit, setNetProfit] = useState(0);
  const [breakEvenAttendees, setBreakEvenAttendees] = useState(0);
  const [perPersonCost, setPerPersonCost] = useState(0);
  const [isViable, setIsViable] = useState(false);
  const [recommendedTicketPrice, setRecommendedTicketPrice] = useState(0);
  
  // Function to calculate costs by category
  const calculateCostsByCategory = () => {
    const categoryCosts = {};
    
    shoppingItems.forEach(item => {
      if (!categoryCosts[item.category]) {
        categoryCosts[item.category] = 0;
      }
      categoryCosts[item.category] += item.cost * item.units;
    });
    
    return categoryCosts;
  };
  
  // Function to get total costs for a category
  const getCategoryTotal = (category) => {
    return shoppingItems
      .filter(item => item.category === category)
      .reduce((sum, item) => sum + (item.cost * item.units), 0);
  };
  
  // Function to get total servings for a category
  const getCategoryServings = (category) => {
    return shoppingItems
      .filter(item => item.category === category)
      .reduce((sum, item) => sum + (item.servings * item.units), 0);
  };
  
  // Function to calculate if we have enough servings
  const hasEnoughServings = (category, requiredServings) => {
    const totalServings = getCategoryServings(category);
    return totalServings >= requiredServings;
  };
  
  // Calculate drink requirements
  const calculateDrinkRequirements = () => {
    const totalDrinks = attendees * drinksPerPerson;
    const hasEnoughSpirits = hasEnoughServings('spirits', totalDrinks);
    const hasEnoughMixers = hasEnoughServings('mixers', totalDrinks);
    const hasEnoughIce = hasEnoughServings('ice', totalDrinks);
    const hasEnoughSupplies = hasEnoughServings('supplies', totalDrinks);
    
    return {
      totalDrinks,
      hasEnoughSpirits,
      hasEnoughMixers,
      hasEnoughIce,
      hasEnoughSupplies,
      spiritsCost: getCategoryTotal('spirits'),
      mixersCost: getCategoryTotal('mixers'),
      iceCost: getCategoryTotal('ice'),
      suppliesCost: getCategoryTotal('supplies'),
      totalCost: getCategoryTotal('spirits') + getCategoryTotal('mixers') + 
                getCategoryTotal('ice') + getCategoryTotal('supplies')
    };
  };
  
  // Calculate food requirements
  const calculateFoodRequirements = () => {
    const totalServings = attendees * foodServingsPerPerson;
    const hasEnoughMeat = hasEnoughServings('meat', totalServings);
    const hasEnoughSides = hasEnoughServings('sides', totalServings);
    const hasEnoughCondiments = hasEnoughServings('condiments', totalServings);
    
    return {
      totalServings,
      hasEnoughMeat,
      hasEnoughSides,
      hasEnoughCondiments,
      meatCost: getCategoryTotal('meat'),
      sidesCost: getCategoryTotal('sides'),
      condimentsCost: getCategoryTotal('condiments'),
      totalCost: getCategoryTotal('meat') + getCategoryTotal('sides') + getCategoryTotal('condiments')
    };
  };
  
  // Function to add a new item
  const addItem = () => {
    if (newItem.name && newItem.cost > 0) {
      const newId = shoppingItems.length > 0 ? Math.max(...shoppingItems.map(item => item.id)) + 1 : 1;
      setShoppingItems([...shoppingItems, { ...newItem, id: newId }]);
      // Reset form
      setNewItem({
        name: '',
        category: 'spirits',
        cost: 0,
        units: 1,
        size: '0',
        sizeUnit: 'ml',
        servings: 0
      });
    }
  };
  
  // Function to start editing an item
  const startEdit = (item) => {
    setEditingItem(item);
    setNewItem({ ...item });
  };
  
  // Function to save edited item
  const saveEdit = () => {
    if (editingItem && newItem.name && newItem.cost > 0) {
      setShoppingItems(shoppingItems.map(item => 
        item.id === editingItem.id ? { ...newItem, id: item.id } : item
      ));
      setEditingItem(null);
      // Reset form
      setNewItem({
        name: '',
        category: 'spirits',
        cost: 0,
        units: 1,
        size: '0',
        sizeUnit: 'ml',
        servings: 0
      });
    }
  };
  
  // Function to delete an item
  const deleteItem = (id) => {
    setShoppingItems(shoppingItems.filter(item => item.id !== id));
  };
  
  // Get recommended units based on needs
  const getRecommendedUnits = (category, requiredServings) => {
    const items = shoppingItems.filter(item => item.category === category);
    if (items.length === 0) return 0;
    
    // Just use the first item's servings as a simple estimation
    const servingsPerUnit = items[0].servings;
    return Math.ceil(requiredServings / servingsPerUnit);
  };
  
  // Calculate overall financials
  useEffect(() => {
    const drinkRequirements = calculateDrinkRequirements();
    const foodRequirements = calculateFoodRequirements();
    
    const totalShoppingCosts = shoppingItems.reduce((sum, item) => sum + (item.cost * item.units), 0);
    const calculatedTotalCosts = venueCost + totalShoppingCosts + miscCosts;
    const calculatedTotalRevenue = attendees * ticketPrice;
    const calculatedNetProfit = calculatedTotalRevenue - calculatedTotalCosts;
    
    const calculatedPerPersonCost = calculatedTotalCosts / attendees;
    
    // Calculate recommended ticket price with 15% profit margin
    const calculatedRecommendedTicketPrice = Math.ceil(calculatedPerPersonCost * 1.15);
    
    // Calculate break-even attendees
    const fixedCosts = venueCost + miscCosts;
    const variableCosts = totalShoppingCosts;
    const variableCostPerPerson = variableCosts / attendees;
    const calculatedBreakEvenAttendees = Math.ceil(fixedCosts / (ticketPrice - variableCostPerPerson));
    
    setTotalCosts(calculatedTotalCosts);
    setTotalRevenue(calculatedTotalRevenue);
    setNetProfit(calculatedNetProfit);
    setPerPersonCost(calculatedPerPersonCost);
    setBreakEvenAttendees(calculatedBreakEvenAttendees);
    setIsViable(calculatedNetProfit >= 0);
    setRecommendedTicketPrice(calculatedRecommendedTicketPrice);
  }, [
    attendees, ticketPrice, venueCost, miscCosts,
    shoppingItems, drinksPerPerson, foodServingsPerPerson
  ]);
  
  // Cost breakdown for charts
  const costBreakdown = [
    { name: 'Local', value: venueCost },
    { name: 'Bebidas', value: calculateDrinkRequirements().totalCost },
    { name: 'Comida', value: calculateFoodRequirements().totalCost },
    { name: 'Misceláneos', value: miscCosts }
  ];
  
  const COLORS = ['#4F46E5', '#06B6D4', '#F59E0B', '#EC4899', '#10B981', '#8B5CF6'];
  
  // Financial overview data
  const financialOverview = [
    { name: 'Ingresos Totales', amount: totalRevenue },
    { name: 'Costos Totales', amount: totalCosts },
    { name: 'Beneficio Neto', amount: netProfit }
  ];
  
  // Shopping categories
  const categories = [
    { value: 'spirits', label: 'Licores' },
    { value: 'mixers', label: 'Mezcladores' },
    { value: 'ice', label: 'Hielo' },
    { value: 'meat', label: 'Carnes' },
    { value: 'sides', label: 'Guarniciones' },
    { value: 'condiments', label: 'Condimentos' },
    { value: 'supplies', label: 'Suministros' },
    { value: 'other', label: 'Otros' }
  ];
  
  // Size units
  const sizeUnits = {
    spirits: ['ml', 'L'],
    mixers: ['ml', 'L'],
    ice: ['kg', 'lb'],
    meat: ['kg', 'lb', 'units'],
    sides: ['kg', 'lb', 'units'],
    condiments: ['units', 'pack'],
    supplies: ['units', 'oz', 'pack'],
    other: ['units']
  };
  
  // Group items by category for the shopping list
  const getItemsByCategory = () => {
    const grouped = {};
    categories.forEach(cat => {
      grouped[cat.value] = shoppingItems.filter(item => item.category === cat.value);
    });
    return grouped;
  };
  
  // JSON preview of all items
  const jsonPreview = JSON.stringify(shoppingItems, null, 2);
  
  // Function to handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'category') {
      // Reset size unit when category changes
      setNewItem({
        ...newItem,
        [name]: value,
        sizeUnit: sizeUnits[value][0]
      });
    } else {
      setNewItem({
        ...newItem,
        [name]: name === 'cost' || name === 'units' || name === 'servings' ? 
          (value === '' ? '' : Number(value)) : value
      });
    }
  };

  // Render appropriate tab content
  const renderTab = () => {
    switch(activeTab) {
      case 'overview':
        return (
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
        );
      case 'shopping':
        return (
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
            getCategoryTotal={getCategoryTotal}
            jsonPreview={jsonPreview}
          />
        );
      case 'drinks':
        return (
          <DrinksTab 
            attendees={attendees}
            drinksPerPerson={drinksPerPerson}
            shoppingItems={shoppingItems}
            calculateDrinkRequirements={calculateDrinkRequirements}
            getCategoryServings={getCategoryServings}
            getRecommendedUnits={getRecommendedUnits}
          />
        );
      case 'food':
        return (
          <FoodTab 
            attendees={attendees}
            foodServingsPerPerson={foodServingsPerPerson}
            shoppingItems={shoppingItems}
            calculateFoodRequirements={calculateFoodRequirements}
            getCategoryServings={getCategoryServings}
            getRecommendedUnits={getRecommendedUnits}
          />
        );
      case 'venue':
        return (
          <VenueTab 
            venueCost={venueCost}
            setVenueCost={setVenueCost}
            miscCosts={miscCosts}
            setMiscCosts={setMiscCosts}
            attendees={attendees}
          />
        );
      case 'reports':
        return (
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
            drinksPerPerson={drinksPerPerson}
            foodServingsPerPerson={foodServingsPerPerson}
            shoppingItems={shoppingItems}
            getCategoryTotal={getCategoryTotal}
          />
        );
      default:
        return <OverviewTab />;
    }
  };

  // Tabs configuration
  const tabs = [
    { id: 'overview', label: 'Resumen', icon: <Users size={18} /> },
    { id: 'shopping', label: 'Compras', icon: <ShoppingBag size={18} /> },
    { id: 'drinks', label: 'Bebidas', icon: <Wine size={18} /> },
    { id: 'food', label: 'Comida', icon: <Utensils size={18} /> },
    { id: 'venue', label: 'Local', icon: <MapPin size={18} /> },
    { id: 'reports', label: 'Informes', icon: <FileBarChart size={18} /> },
  ];

  return (
    <div className="bg-gradient-to-b from-indigo-50 to-white min-h-screen p-4">
      <div className="max-w-7xl mx-auto">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 rounded-xl shadow-lg mb-6 text-white">
          <h2 className="text-3xl font-bold mb-2 flex items-center">
            <span className="bg-white text-indigo-600 p-2 rounded-lg mr-3">🎉</span>
            Simulador de Fiestas
          </h2>
          <p className="text-indigo-100 text-lg">Organiza, planifica y visualiza todos los aspectos de tu próxima fiesta</p>
          
          {/* Status summary */}
          <div className="mt-4 p-3 bg-white/10 backdrop-blur-sm rounded-lg flex flex-wrap gap-2">
            <div className="flex items-center px-3 py-1 bg-white/20 rounded-full text-sm">
              <Users size={14} className="mr-1" />
              <span>{attendees} Asistentes</span>
            </div>
            <div className="flex items-center px-3 py-1 bg-white/20 rounded-full text-sm">
              <DollarSign size={14} className="mr-1" />
              <span>S/ {ticketPrice} Entrada</span>
            </div>
            <div className={`flex items-center px-3 py-1 rounded-full text-sm ${isViable ? 'bg-green-500/70' : 'bg-red-500/70'}`}>
              {isViable ? <CheckCircle size={14} className="mr-1" /> : <AlertCircle size={14} className="mr-1" />}
              <span>{isViable ? 'Viable' : 'No Viable'}</span>
            </div>
          </div>
        </div>
        
        {/* Tabs */}
        <div className="flex overflow-x-auto md:flex-wrap bg-white rounded-xl shadow-md mb-6 p-1">
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`flex items-center px-4 py-3 text-sm md:text-base font-medium rounded-lg transition-all duration-200 mx-1 whitespace-nowrap
                ${activeTab === tab.id 
                  ? 'bg-indigo-600 text-white shadow-md' 
                  : 'text-gray-700 hover:bg-indigo-100'}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>
        
        {/* Tab Content */}
        <div className="transition-all duration-300 ease-in-out">
          {renderTab()}
        </div>
      </div>
    </div>
  );
}