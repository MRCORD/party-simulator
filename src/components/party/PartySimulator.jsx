"use client";

import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { AlertCircle, CheckCircle, PlusCircle, Trash2, Edit, Save, ShoppingCart, Utensils, Wine, DollarSign, Users, Percent, FileText, ChevronRight } from 'lucide-react';

// Main component
export default function PartySimulator() {
  // Tab state
  const [activeTab, setActiveTab] = useState('overview');
  
  // JSON data for shopping items
  const [shoppingItems, setShoppingItems] = useState([
    // Default items for demonstration
    { id: 1, name: 'Ron Cartavio', category: 'spirits', cost: 45, units: 1, size: '750', sizeUnit: 'ml', servings: 15 },
    { id: 2, name: 'Coca-Cola', category: 'mixers', cost: 30, units: 6, size: '1.5', sizeUnit: 'L', servings: 30 },
    { id: 3, name: 'Ice Bags', category: 'ice', cost: 12, units: 1, size: '5', sizeUnit: 'kg', servings: 25 },
    { id: 4, name: 'Chicken', category: 'meat', cost: 180, units: 1, size: '10', sizeUnit: 'kg', servings: 20 },
    { id: 5, name: 'Potato Salad', category: 'sides', cost: 120, units: 1, size: '5', sizeUnit: 'kg', servings: 25 },
    { id: 6, name: 'Sauces Pack', category: 'condiments', cost: 60, units: 1, size: '1', sizeUnit: 'pack', servings: 30 },
    { id: 7, name: 'Red Cups', category: 'supplies', cost: 15, units: 100, size: '16', sizeUnit: 'oz', servings: 100 },
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
    { name: 'Venue', value: venueCost },
    { name: 'Drinks', value: calculateDrinkRequirements().totalCost },
    { name: 'Food', value: calculateFoodRequirements().totalCost },
    { name: 'Miscellaneous', value: miscCosts }
  ];
  
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];
  
  // Financial overview data
  const financialOverview = [
    { name: 'Total Revenue', amount: totalRevenue },
    { name: 'Total Costs', amount: totalCosts },
    { name: 'Net Profit', amount: netProfit }
  ];
  
  // Shopping categories
  const categories = [
    { value: 'spirits', label: 'Spirits' },
    { value: 'mixers', label: 'Mixers' },
    { value: 'ice', label: 'Ice' },
    { value: 'meat', label: 'Meat' },
    { value: 'sides', label: 'Sides' },
    { value: 'condiments', label: 'Condiments' },
    { value: 'supplies', label: 'Supplies' },
    { value: 'other', label: 'Other' }
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
  
  // Tab rendering helper
  const renderTab = () => {
    switch(activeTab) {
      case 'overview':
        return renderOverviewTab();
      case 'shopping':
        return renderShoppingTab();
      case 'drinks':
        return renderDrinksTab();
      case 'food':
        return renderFoodTab();
      case 'venue':
        return renderVenueTab();
      case 'reports':
        return renderReportsTab();
      default:
        return renderOverviewTab();
    }
  };
  
  // Overview Tab
  const renderOverviewTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Users className="w-5 h-5 mr-2" /> Basic Parameters
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Attendees</label>
              <input
                type="number"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border focus:border-blue-500 focus:ring focus:ring-blue-200"
                value={attendees}
                onChange={(e) => setAttendees(parseInt(e.target.value) || 1)}
                min="1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Ticket Price (S/)</label>
              <input
                type="number"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border focus:border-blue-500 focus:ring focus:ring-blue-200"
                value={ticketPrice}
                onChange={(e) => setTicketPrice(parseFloat(e.target.value) || 0)}
                min="0"
                step="1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Drinks Per Person</label>
              <input
                type="number"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border focus:border-blue-500 focus:ring focus:ring-blue-200"
                value={drinksPerPerson}
                onChange={(e) => setDrinksPerPerson(parseInt(e.target.value) || 1)}
                min="1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Food Servings/Person</label>
              <input
                type="number"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border focus:border-blue-500 focus:ring focus:ring-blue-200"
                value={foodServingsPerPerson}
                onChange={(e) => setFoodServingsPerPerson(parseInt(e.target.value) || 1)}
                min="1"
              />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <DollarSign className="w-5 h-5 mr-2" /> Financial Summary
          </h3>
          <div className="grid grid-cols-2 gap-2">
            <div className="text-sm font-medium text-gray-700">Total Revenue:</div>
            <div className="text-sm font-semibold">S/ {totalRevenue.toFixed(2)}</div>
            
            <div className="text-sm font-medium text-gray-700">Total Costs:</div>
            <div className="text-sm font-semibold">S/ {totalCosts.toFixed(2)}</div>
            
            <div className="text-sm font-medium text-gray-700">Net Profit/Loss:</div>
            <div className={`text-sm font-semibold ${netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              S/ {netProfit.toFixed(2)}
            </div>
            
            <div className="text-sm font-medium text-gray-700">Cost Per Person:</div>
            <div className="text-sm font-semibold">S/ {perPersonCost.toFixed(2)}</div>
            
            <div className="text-sm font-medium text-gray-700">Break-even Attendees:</div>
            <div className="text-sm font-semibold">{breakEvenAttendees}</div>
            
            <div className="text-sm font-medium text-gray-700">Recommended Ticket:</div>
            <div className="text-sm font-semibold">S/ {recommendedTicketPrice}</div>
          </div>
          
          <div className={`mt-4 p-3 rounded-md ${isViable ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
            <div className="flex items-center">
              {isViable ? (
                <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
              ) : (
                <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
              )}
              <span className={`font-medium ${isViable ? 'text-green-800' : 'text-red-800'}`}>
                {isViable ? 'Party is Financially Viable' : 'Party is Not Financially Viable'}
              </span>
            </div>
            <p className={`text-sm mt-1 ${isViable ? 'text-green-700' : 'text-red-700'}`}>
              {isViable
                ? `Your party will generate a profit of S/ ${netProfit.toFixed(2)}.`
                : `Increase ticket price to at least S/ ${recommendedTicketPrice} or add ${Math.max(0, breakEvenAttendees - attendees)} more attendees to break even.`}
            </p>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold mb-4">Cost Breakdown</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={costBreakdown}
                cx="50%"
                cy="50%"
                labelLine={true}
                label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {costBreakdown.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`S/ ${value.toFixed(2)}`, 'Cost']} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold mb-4">Financial Overview</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={financialOverview}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value) => [`S/ ${value.toFixed(2)}`, '']} />
              <Bar dataKey="amount" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <CheckCircle className="w-5 h-5 mr-2" /> Status Overview
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h4 className="font-medium mb-2 flex items-center">
              <Wine className="w-4 h-4 mr-1" /> Drinks Status
            </h4>
            <div className="space-y-2">
              <StatusItem 
                title="Spirits" 
                isEnough={calculateDrinkRequirements().hasEnoughSpirits}
                currentAmount={getCategoryServings('spirits')}
                requiredAmount={attendees * drinksPerPerson}
              />
              <StatusItem 
                title="Mixers" 
                isEnough={calculateDrinkRequirements().hasEnoughMixers}
                currentAmount={getCategoryServings('mixers')}
                requiredAmount={attendees * drinksPerPerson}
              />
              <StatusItem 
                title="Ice" 
                isEnough={calculateDrinkRequirements().hasEnoughIce}
                currentAmount={getCategoryServings('ice')}
                requiredAmount={attendees * drinksPerPerson}
              />
              <StatusItem 
                title="Supplies" 
                isEnough={calculateDrinkRequirements().hasEnoughSupplies}
                currentAmount={getCategoryServings('supplies')}
                requiredAmount={attendees * drinksPerPerson}
              />
            </div>
          </div>
          
          <div>
            <h4 className="font-medium mb-2 flex items-center">
              <Utensils className="w-4 h-4 mr-1" /> Food Status
            </h4>
            <div className="space-y-2">
              <StatusItem 
                title="Meat" 
                isEnough={calculateFoodRequirements().hasEnoughMeat}
                currentAmount={getCategoryServings('meat')}
                requiredAmount={attendees * foodServingsPerPerson}
              />
              <StatusItem 
                title="Sides" 
                isEnough={calculateFoodRequirements().hasEnoughSides}
                currentAmount={getCategoryServings('sides')}
                requiredAmount={attendees * foodServingsPerPerson}
              />
              <StatusItem 
                title="Condiments" 
                isEnough={calculateFoodRequirements().hasEnoughCondiments}
                currentAmount={getCategoryServings('condiments')}
                requiredAmount={attendees * foodServingsPerPerson}
              />
            </div>
          </div>
          
          <div>
            <h4 className="font-medium mb-2 flex items-center">
              <Percent className="w-4 h-4 mr-1" /> Recommendations
            </h4>
            <div className="space-y-2">
              <div className={`text-sm p-2 rounded ${ticketPrice >= recommendedTicketPrice ? 'bg-green-50' : 'bg-yellow-50'}`}>
                <div className="font-medium">Ticket Price</div>
                <div className="text-xs">
                  {ticketPrice < recommendedTicketPrice 
                    ? `Increase to S/${recommendedTicketPrice}` 
                    : `Good (S/${ticketPrice})`}
                </div>
              </div>
              
              <div className={`text-sm p-2 rounded ${attendees >= breakEvenAttendees ? 'bg-green-50' : 'bg-yellow-50'}`}>
                <div className="font-medium">Attendance</div>
                <div className="text-xs">
                  {attendees < breakEvenAttendees 
                    ? `Need ${breakEvenAttendees} (${breakEvenAttendees - attendees} more)` 
                    : `Good (${attendees})`}
                </div>
              </div>
              
              <div className={`text-sm p-2 rounded ${isViable ? 'bg-green-50' : 'bg-red-50'}`}>
                <div className="font-medium">Overall</div>
                <div className="text-xs">
                  {isViable 
                    ? `Profit: S/${netProfit.toFixed(2)}` 
                    : `Loss: S/${Math.abs(netProfit).toFixed(2)}`}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
  
  // Shopping Tab
  const renderShoppingTab = () => {
    const groupedItems = getItemsByCategory();
    
    return (
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <ShoppingCart className="w-5 h-5 mr-2" /> Add New Item
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Item Name</label>
              <input
                type="text"
                name="name"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border focus:border-blue-500 focus:ring focus:ring-blue-200"
                value={newItem.name}
                onChange={handleInputChange}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Category</label>
              <select
                name="category"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border focus:border-blue-500 focus:ring focus:ring-blue-200"
                value={newItem.category}
                onChange={handleInputChange}
              >
                {categories.map(cat => (
                  <option key={cat.value} value={cat.value}>{cat.label}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Cost (S/)</label>
              <input
                type="number"
                name="cost"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border focus:border-blue-500 focus:ring focus:ring-blue-200"
                value={newItem.cost}
                onChange={handleInputChange}
                min="0"
                step="1"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Units</label>
              <input
                type="number"
                name="units"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border focus:border-blue-500 focus:ring focus:ring-blue-200"
                value={newItem.units}
                onChange={handleInputChange}
                min="1"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Size</label>
              <input
                type="number"
                name="size"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border focus:border-blue-500 focus:ring focus:ring-blue-200"
                value={newItem.size}
                onChange={handleInputChange}
                min="0"
                step="0.1"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Size Unit</label>
              <select
                name="sizeUnit"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border focus:border-blue-500 focus:ring focus:ring-blue-200"
                value={newItem.sizeUnit}
                onChange={handleInputChange}
              >
                {sizeUnits[newItem.category].map(unit => (
                  <option key={unit} value={unit}>{unit}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Servings</label>
              <input
                type="number"
                name="servings"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border focus:border-blue-500 focus:ring focus:ring-blue-200"
                value={newItem.servings}
                onChange={handleInputChange}
                min="0"
              />
            </div>
            
            <div className="flex items-end">
              {editingItem ? (
                <button
                  onClick={saveEdit}
                  className="w-full flex items-center justify-center bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded focus:outline-none focus:ring focus:ring-blue-200"
                >
                  <Save className="w-4 h-4 mr-1" /> Save Changes
                </button>
              ) : (
                <button
                  onClick={addItem}
                  className="w-full flex items-center justify-center bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded focus:outline-none focus:ring focus:ring-green-200"
                >
                  <PlusCircle className="w-4 h-4 mr-1" /> Add Item
                </button>
              )}
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold mb-4">Shopping List</h3>
          
          <div className="space-y-6">
            {categories.map(cat => (
              groupedItems[cat.value] && groupedItems[cat.value].length > 0 ? (
                <div key={cat.value} className="space-y-2">
                  <h4 className="font-medium text-gray-800 border-b pb-2">{cat.label}</h4>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                          <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Size</th>
                          <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cost</th>
                          <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Units</th>
                          <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Servings</th>
                          <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                          <th scope="col" className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {groupedItems[cat.value].map(item => (
                          <tr key={item.id} className="hover:bg-gray-50">
                            <td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-gray-900">{item.name}</td>
                            <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">{item.size} {item.sizeUnit}</td>
                            <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">S/ {item.cost}</td>
                            <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">{item.units}</td>
                            <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">{item.servings * item.units}</td>
                            <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">S/ {(item.cost * item.units).toFixed(2)}</td>
                            <td className="px-3 py-2 whitespace-nowrap text-sm text-right">
                              <button 
                                onClick={() => startEdit(item)} 
                                className="text-blue-600 hover:text-blue-800 mr-3"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button 
                                onClick={() => deleteItem(item.id)} 
                                className="text-red-600 hover:text-red-800"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        ))}
                        <tr className="bg-gray-50">
                          <td colSpan="5" className="px-3 py-2 text-sm font-medium text-right">Category Total:</td>
                          <td className="px-3 py-2 text-sm font-medium">S/ {getCategoryTotal(cat.value).toFixed(2)}</td>
                          <td></td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : null
            ))}
            
            <div className="border-t pt-4 flex justify-between items-center">
              <div className="text-lg font-semibold">Total Shopping List Cost:</div>
              <div className="text-lg font-semibold">S/ {shoppingItems.reduce((sum, item) => sum + (item.cost * item.units), 0).toFixed(2)}</div>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <FileText className="w-5 h-5 mr-2" /> JSON Data
          </h3>
          <div className="bg-gray-100 p-4 rounded-md">
            <pre className="text-xs overflow-auto max-h-64">{jsonPreview}</pre>
          </div>
        </div>
      </div>
    );
  };
  
  // Drinks Tab
  const renderDrinksTab = () => {
    const drinkRequirements = calculateDrinkRequirements();
    
    return (
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Wine className="w-5 h-5 mr-2" /> Drink Requirements
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-3">Basic Information</h4>
              <div className="bg-blue-50 p-4 rounded-md space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Attendees:</span>
                  <span className="text-sm">{attendees}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Drinks per person:</span>
                  <span className="text-sm">{drinksPerPerson}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Total drinks needed:</span>
                  <span className="text-sm">{drinkRequirements.totalDrinks}</span>
                </div>
              </div>
              
              <h4 className="font-medium mt-4 mb-3">Cost Breakdown</h4>
              <div className="space-y-2">
                <div className="flex justify-between p-2 bg-gray-900 text-white rounded">
                  <span className="text-sm font-medium">Spirits:</span>
                  <span className="text-sm">S/ {drinkRequirements.spiritsCost.toFixed(2)}</span>
                </div>
                <div className="flex justify-between p-2 bg-gray-900 text-white rounded">
                  <span className="text-sm font-medium">Mixers:</span>
                  <span className="text-sm">S/ {drinkRequirements.mixersCost.toFixed(2)}</span>
                </div>
                <div className="flex justify-between p-2 bg-gray-900 text-white rounded">
                  <span className="text-sm font-medium">Ice:</span>
                  <span className="text-sm">S/ {drinkRequirements.iceCost.toFixed(2)}</span>
                </div>
                <div className="flex justify-between p-2 bg-gray-900 text-white rounded">
                  <span className="text-sm font-medium">Supplies:</span>
                  <span className="text-sm">S/ {drinkRequirements.suppliesCost.toFixed(2)}</span>
                </div>
                <div className="flex justify-between p-2 bg-blue-50 rounded font-medium">
                  <span>Total Drink Cost:</span>
                  <span>S/ {drinkRequirements.totalCost.toFixed(2)}</span>
                </div>
                <div className="flex justify-between p-2 bg-yellow-50 rounded">
                  <span className="text-sm font-medium">Cost per person:</span>
                  <span className="text-sm">S/ {(drinkRequirements.totalCost / attendees).toFixed(2)}</span>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium mb-3">Inventory Status</h4>
              
              <StatusBar 
                title="Spirits" 
                isEnough={drinkRequirements.hasEnoughSpirits}
                currentAmount={getCategoryServings('spirits')}
                requiredAmount={drinkRequirements.totalDrinks}
              />
              
              <StatusBar 
                title="Mixers" 
                isEnough={drinkRequirements.hasEnoughMixers}
                currentAmount={getCategoryServings('mixers')}
                requiredAmount={drinkRequirements.totalDrinks}
              />
              
              <StatusBar 
                title="Ice" 
                isEnough={drinkRequirements.hasEnoughIce}
                currentAmount={getCategoryServings('ice')}
                requiredAmount={drinkRequirements.totalDrinks}
              />
              
              <StatusBar 
                title="Supplies" 
                isEnough={drinkRequirements.hasEnoughSupplies}
                currentAmount={getCategoryServings('supplies')}
                requiredAmount={drinkRequirements.totalDrinks}
              />
              
              <h4 className="font-medium mt-4 mb-3">Recommended Quantities</h4>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center p-2 bg-blue-50 rounded">
                  <span className="text-sm font-medium">Spirits:</span>
                  <div className="flex items-center">
                    <span className="text-sm font-medium mr-2">
                      {getRecommendedUnits('spirits', drinkRequirements.totalDrinks)} units
                    </span>
                    {getRecommendedUnits('spirits', drinkRequirements.totalDrinks) > shoppingItems
                      .filter(i => i.category === 'spirits')
                      .reduce((sum, i) => sum + i.units, 0) && (
                      <span className="text-xs bg-red-100 text-red-800 px-2 py-0.5 rounded">
                        Need more
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="flex justify-between items-center p-2 bg-blue-50 rounded">
                  <span className="text-sm font-medium">Mixers:</span>
                  <div className="flex items-center">
                    <span className="text-sm font-medium mr-2">
                      {getRecommendedUnits('mixers', drinkRequirements.totalDrinks)} units
                    </span>
                    {getRecommendedUnits('mixers', drinkRequirements.totalDrinks) > shoppingItems
                      .filter(i => i.category === 'mixers')
                      .reduce((sum, i) => sum + i.units, 0) && (
                      <span className="text-xs bg-red-100 text-red-800 px-2 py-0.5 rounded">
                        Need more
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="flex justify-between items-center p-2 bg-blue-50 rounded">
                  <span className="text-sm font-medium">Ice:</span>
                  <div className="flex items-center">
                    <span className="text-sm font-medium mr-2">
                      {getRecommendedUnits('ice', drinkRequirements.totalDrinks)} units
                    </span>
                    {getRecommendedUnits('ice', drinkRequirements.totalDrinks) > shoppingItems
                      .filter(i => i.category === 'ice')
                      .reduce((sum, i) => sum + i.units, 0) && (
                      <span className="text-xs bg-red-100 text-red-800 px-2 py-0.5 rounded">
                        Need more
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="flex justify-between items-center p-2 bg-blue-50 rounded">
                  <span className="text-sm font-medium">Supplies:</span>
                  <div className="flex items-center">
                    <span className="text-sm font-medium mr-2">
                      {getRecommendedUnits('supplies', drinkRequirements.totalDrinks)} units
                    </span>
                    {getRecommendedUnits('supplies', drinkRequirements.totalDrinks) > shoppingItems
                      .filter(i => i.category === 'supplies')
                      .reduce((sum, i) => sum + i.units, 0) && (
                      <span className="text-xs bg-red-100 text-red-800 px-2 py-0.5 rounded">
                        Need more
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold mb-4">Drink Calculations</h3>
          
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-900 text-white">
              <tr>
                <th scope="col" className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider">Item</th>
                <th scope="col" className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider">Size</th>
                <th scope="col" className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider">Units</th>
                <th scope="col" className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider">Servings</th>
                <th scope="col" className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider">Cost</th>
                <th scope="col" className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider">Total Cost</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {shoppingItems
                .filter(item => ['spirits', 'mixers', 'ice', 'supplies'].includes(item.category))
                .map(item => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-gray-900">{item.name}</td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">{item.size} {item.sizeUnit}</td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">{item.units}</td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">{item.servings * item.units}</td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">S/ {item.cost.toFixed(2)}</td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">S/ {(item.cost * item.units).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold mb-4">Tips for Drink Planning</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <h4 className="font-medium text-gray-800">Serve Options</h4>
              <ul className="list-disc pl-5 space-y-1 text-sm">
                <li>Set up a self-serve drink station to reduce labor</li>
                <li>Pre-mix batch cocktails to save time and ensure consistency</li>
                <li>Use drink dispensers for common mixers</li>
                <li>Consider hiring a bartender if budget allows</li>
              </ul>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium text-gray-800">Cost Saving Ideas</h4>
              <ul className="list-disc pl-5 space-y-1 text-sm">
                <li>Buy spirits in larger bottles for better value</li>
                <li>Use house brands instead of premium brands</li>
                <li>Ask guests to bring their preferred spirits (BYOB)</li>
                <li>Offer a signature cocktail instead of a full bar</li>
                <li>Buy ice on the day of the event to prevent melting</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  // Food Tab
  const renderFoodTab = () => {
    const foodRequirements = calculateFoodRequirements();
    
    return (
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Utensils className="w-5 h-5 mr-2" /> Food Requirements
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-3">Basic Information</h4>
              <div className="bg-blue-50 p-4 rounded-md space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Attendees:</span>
                  <span className="text-sm">{attendees}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Servings per person:</span>
                  <span className="text-sm">{foodServingsPerPerson}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Total servings needed:</span>
                  <span className="text-sm">{foodRequirements.totalServings}</span>
                </div>
              </div>
              
              <h4 className="font-medium mt-4 mb-3">Cost Breakdown</h4>
              <div className="space-y-2">
                <div className="flex justify-between p-2 bg-gray-900 text-white rounded">
                  <span className="text-sm font-medium">Meat:</span>
                  <span className="text-sm">S/ {foodRequirements.meatCost.toFixed(2)}</span>
                </div>
                <div className="flex justify-between p-2 bg-gray-900 text-white rounded">
                  <span className="text-sm font-medium">Sides:</span>
                  <span className="text-sm">S/ {foodRequirements.sidesCost.toFixed(2)}</span>
                </div>
                <div className="flex justify-between p-2 bg-gray-900 text-white rounded">
                  <span className="text-sm font-medium">Condiments:</span>
                  <span className="text-sm">S/ {foodRequirements.condimentsCost.toFixed(2)}</span>
                </div>
                <div className="flex justify-between p-2 bg-blue-50 rounded font-medium">
                  <span>Total Food Cost:</span>
                  <span>S/ {foodRequirements.totalCost.toFixed(2)}</span>
                </div>
                <div className="flex justify-between p-2 bg-yellow-50 rounded">
                  <span className="text-sm font-medium">Cost per person:</span>
                  <span className="text-sm">S/ {(foodRequirements.totalCost / attendees).toFixed(2)}</span>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium mb-3">Inventory Status</h4>
              
              <StatusBar 
                title="Meat" 
                isEnough={foodRequirements.hasEnoughMeat}
                currentAmount={getCategoryServings('meat')}
                requiredAmount={foodRequirements.totalServings}
              />
              
              <StatusBar 
                title="Sides" 
                isEnough={foodRequirements.hasEnoughSides}
                currentAmount={getCategoryServings('sides')}
                requiredAmount={foodRequirements.totalServings}
              />
              
              <StatusBar 
                title="Condiments" 
                isEnough={foodRequirements.hasEnoughCondiments}
                currentAmount={getCategoryServings('condiments')}
                requiredAmount={foodRequirements.totalServings}
              />
              
              <h4 className="font-medium mt-4 mb-3">Recommended Quantities</h4>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center p-2 bg-blue-50 rounded">
                  <span className="text-sm font-medium">Meat:</span>
                  <div className="flex items-center">
                    <span className="text-sm font-medium mr-2">
                      {getRecommendedUnits('meat', foodRequirements.totalServings)} units
                    </span>
                    {getRecommendedUnits('meat', foodRequirements.totalServings) > shoppingItems
                      .filter(i => i.category === 'meat')
                      .reduce((sum, i) => sum + i.units, 0) && (
                      <span className="text-xs bg-red-100 text-red-800 px-2 py-0.5 rounded">
                        Need more
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="flex justify-between items-center p-2 bg-blue-50 rounded">
                  <span className="text-sm font-medium">Sides:</span>
                  <div className="flex items-center">
                    <span className="text-sm font-medium mr-2">
                      {getRecommendedUnits('sides', foodRequirements.totalServings)} units
                    </span>
                    {getRecommendedUnits('sides', foodRequirements.totalServings) > shoppingItems
                      .filter(i => i.category === 'sides')
                      .reduce((sum, i) => sum + i.units, 0) && (
                      <span className="text-xs bg-red-100 text-red-800 px-2 py-0.5 rounded">
                        Need more
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="flex justify-between items-center p-2 bg-blue-50 rounded">
                  <span className="text-sm font-medium">Condiments:</span>
                  <div className="flex items-center">
                    <span className="text-sm font-medium mr-2">
                      {getRecommendedUnits('condiments', foodRequirements.totalServings)} units
                    </span>
                    {getRecommendedUnits('condiments', foodRequirements.totalServings) > shoppingItems
                      .filter(i => i.category === 'condiments')
                      .reduce((sum, i) => sum + i.units, 0) && (
                      <span className="text-xs bg-red-100 text-red-800 px-2 py-0.5 rounded">
                        Need more
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold mb-4">Food Calculations</h3>
          
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-900 text-white">
              <tr>
                <th scope="col" className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider">Item</th>
                <th scope="col" className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider">Size</th>
                <th scope="col" className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider">Units</th>
                <th scope="col" className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider">Servings</th>
                <th scope="col" className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider">Cost</th>
                <th scope="col" className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider">Total Cost</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {shoppingItems
                .filter(item => ['meat', 'sides', 'condiments'].includes(item.category))
                .map(item => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-gray-900">{item.name}</td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">{item.size} {item.sizeUnit}</td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">{item.units}</td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">{item.servings * item.units}</td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">S/ {item.cost.toFixed(2)}</td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">S/ {(item.cost * item.units).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold mb-4">BBQ Planning Tips</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <h4 className="font-medium text-gray-800">Cooking Logistics</h4>
              <ul className="list-disc pl-5 space-y-1 text-sm">
                <li>Have at least 2 people managing the grill for parties over 20 people</li>
                <li>Prepare meat ahead of time (marinating, seasoning)</li>
                <li>Cook slower-cooking items first, then faster items</li>
                <li>Consider cooking some items in advance and just finishing on the grill</li>
                <li>Estimate 45-60 minutes of active grilling for every 20 people</li>
              </ul>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium text-gray-800">Food Selection Tips</h4>
              <ul className="list-disc pl-5 space-y-1 text-sm">
                <li>Choose items that can be prepped ahead of time</li>
                <li>Include vegetarian options (vegetable skewers, corn, etc.)</li>
                <li>Offer a mix of proteins (chicken, beef, pork)</li>
                <li>Prepare simple sides that don't require cooking (salads, chips)</li>
                <li>Consider dietary restrictions among your guests</li>
                <li>Have pre-made desserts that don't require refrigeration</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  // Venue Tab
  const renderVenueTab = () => (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold mb-4">Venue & Miscellaneous Costs</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Venue Cost (S/)</label>
            <input
              type="number"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border focus:border-blue-500 focus:ring focus:ring-blue-200"
              value={venueCost}
              onChange={(e) => setVenueCost(parseFloat(e.target.value) || 0)}
              min="0"
              step="1"
            />
            <p className="mt-1 text-xs text-gray-500">Include all venue rental fees, equipment rentals, and security deposits</p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Miscellaneous Costs (S/)</label>
            <input
              type="number"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border focus:border-blue-500 focus:ring focus:ring-blue-200"
              value={miscCosts}
              onChange={(e) => setMiscCosts(parseFloat(e.target.value) || 0)}
              min="0"
              step="1"
            />
            <p className="mt-1 text-xs text-gray-500">Include decorations, music, transportation, cleaning, etc.</p>
          </div>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold mb-4">Venue Checklist</h3>
        
        <div className="space-y-4">
          <h4 className="font-medium">Before Booking</h4>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>Confirm venue capacity (should be at least {attendees} people)</li>
            <li>Check if they allow alcohol service</li>
            <li>Verify if you can bring your own food/drinks or need to use their catering</li>
            <li>Ask about noise restrictions and end time</li>
            <li>Confirm availability of parking</li>
            <li>Check if there are cooking facilities (for BBQ)</li>
            <li>Verify if there are additional fees for cleaning</li>
          </ul>
          
          <h4 className="font-medium">Day of Event</h4>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>Arrive early for setup (at least 2 hours before)</li>
            <li>Bring cleaning supplies</li>
            <li>Have contact info for venue manager</li>
            <li>Know the rules for security deposit return</li>
            <li>Have a plan for garbage disposal</li>
          </ul>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold mb-4">Miscellaneous Items</h3>
        
        <div className="space-y-2">
          <h4 className="font-medium">Don't Forget</h4>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>Music system or speakers</li>
            <li>Extension cords</li>
            <li>Lighting (if evening event)</li>
            <li>Tables and chairs (if not provided by venue)</li>
            <li>Coolers and ice chests</li>
            <li>Garbage bags</li>
            <li>Paper towels</li>
            <li>First aid kit</li>
            <li>Bottle openers and can openers</li>
            <li>Serving utensils</li>
          </ul>
        </div>
      </div>
    </div>
  );
  
  // Reports Tab
  const renderReportsTab = () => (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold mb-4">Financial Summary</h3>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-900 text-white">
              <tr>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">Category</th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">Cost (S/)</th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">Per Person (S/)</th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">% of Total</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">Venue</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">S/ {venueCost.toFixed(2)}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">S/ {(venueCost / attendees).toFixed(2)}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{((venueCost / totalCosts) * 100).toFixed(1)}%</td>
              </tr>
              <tr>
                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">Drinks</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">S/ {calculateDrinkRequirements().totalCost.toFixed(2)}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">S/ {(calculateDrinkRequirements().totalCost / attendees).toFixed(2)}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{((calculateDrinkRequirements().totalCost / totalCosts) * 100).toFixed(1)}%</td>
              </tr>
              <tr>
                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">Food</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">S/ {calculateFoodRequirements().totalCost.toFixed(2)}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">S/ {(calculateFoodRequirements().totalCost / attendees).toFixed(2)}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{((calculateFoodRequirements().totalCost / totalCosts) * 100).toFixed(1)}%</td>
              </tr>
              <tr>
                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">Miscellaneous</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">S/ {miscCosts.toFixed(2)}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">S/ {(miscCosts / attendees).toFixed(2)}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{((miscCosts / totalCosts) * 100).toFixed(1)}%</td>
              </tr>
              <tr className="bg-gray-900 text-white">
                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">TOTAL COSTS</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">S/ {totalCosts.toFixed(2)}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">S/ {perPersonCost.toFixed(2)}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">100%</td>
              </tr>
              <tr>
                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">TOTAL REVENUE</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">S/ {totalRevenue.toFixed(2)}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">S/ {ticketPrice.toFixed(2)}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">-</td>
              </tr>
              <tr className={netProfit >= 0 ? 'bg-green-50' : 'bg-red-50'}>
                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">NET PROFIT/LOSS</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">S/ {netProfit.toFixed(2)}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">S/ {(netProfit / attendees).toFixed(2)}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                  {netProfit >= 0 ? `${((netProfit / totalRevenue) * 100).toFixed(1)}% margin` : '-'}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold mb-4">Shopping List Summary</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium mb-3">Drinks</h4>
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-900 text-white">
                <tr>
                  <th scope="col" className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider">Category</th>
                  <th scope="col" className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider">Items</th>
                  <th scope="col" className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider">Cost</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr>
                  <td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-gray-900">Spirits</td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                    {shoppingItems.filter(i => i.category === 'spirits').length}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                    S/ {getCategoryTotal('spirits').toFixed(2)}
                  </td>
                </tr>
                <tr>
                  <td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-gray-900">Mixers</td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                    {shoppingItems.filter(i => i.category === 'mixers').length}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                    S/ {getCategoryTotal('mixers').toFixed(2)}
                  </td>
                </tr>
                <tr>
                  <td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-gray-900">Ice</td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                    {shoppingItems.filter(i => i.category === 'ice').length}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                    S/ {getCategoryTotal('ice').toFixed(2)}
                  </td>
                </tr>
                <tr>
                  <td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-gray-900">Supplies</td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                    {shoppingItems.filter(i => i.category === 'supplies').length}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                    S/ {getCategoryTotal('supplies').toFixed(2)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <div>
            <h4 className="font-medium mb-3">Food</h4>
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-900 text-white">
                <tr>
                  <th scope="col" className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider">Category</th>
                  <th scope="col" className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider">Items</th>
                  <th scope="col" className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider">Cost</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr>
                  <td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-gray-900">Meat</td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                    {shoppingItems.filter(i => i.category === 'meat').length}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                    S/ {getCategoryTotal('meat').toFixed(2)}
                  </td>
                </tr>
                <tr>
                  <td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-gray-900">Sides</td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                    {shoppingItems.filter(i => i.category === 'sides').length}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                    S/ {getCategoryTotal('sides').toFixed(2)}
                  </td>
                </tr>
                <tr>
                  <td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-gray-900">Condiments</td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                    {shoppingItems.filter(i => i.category === 'condiments').length}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                    S/ {getCategoryTotal('condiments').toFixed(2)}
                  </td>
                </tr>
                <tr>
                  <td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-gray-900">Other</td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                    {shoppingItems.filter(i => i.category === 'other').length}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                    S/ {getCategoryTotal('other').toFixed(2)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold mb-4">Key Metrics & Recommendations</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-4 bg-gray-900 text-white rounded-lg">
            <h4 className="font-medium mb-2">Financial Metrics</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex justify-between">
                <span>Break-even point:</span>
                <span className="font-medium">{breakEvenAttendees} attendees</span>
              </li>
              <li className="flex justify-between">
                <span>Cost per attendee:</span>
                <span className="font-medium">S/ {perPersonCost.toFixed(2)}</span>
              </li>
              <li className="flex justify-between">
                <span>Profit margin:</span>
                <span className={`font-medium ${netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {netProfit >= 0 ? ((netProfit / totalRevenue) * 100).toFixed(1) + '%' : 'N/A'}
                </span>
              </li>
              <li className="flex justify-between">
                <span>Min. viable ticket:</span>
                <span className="font-medium">S/ {recommendedTicketPrice}</span>
              </li>
            </ul>
          </div>
          
          <div className="p-4 bg-gray-900 text-white rounded-lg">
            <h4 className="font-medium mb-2">Event Metrics</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex justify-between">
                <span>Drinks per person:</span>
                <span className="font-medium">{drinksPerPerson}</span>
              </li>
              <li className="flex justify-between">
                <span>Food servings per person:</span>
                <span className="font-medium">{foodServingsPerPerson}</span>
              </li>
              <li className="flex justify-between">
                <span>Total drinks needed:</span>
                <span className="font-medium">{attendees * drinksPerPerson}</span>
              </li>
              <li className="flex justify-between">
                <span>Total food servings needed:</span>
                <span className="font-medium">{attendees * foodServingsPerPerson}</span>
              </li>
            </ul>
          </div>
          
          <div className="p-4 bg-gray-900 text-white rounded-lg">
            <h4 className="font-medium mb-2">Recommendations</h4>
            <ul className="space-y-2 text-sm">
              <li className={`flex justify-between ${ticketPrice >= recommendedTicketPrice ? 'text-green-400' : 'text-red-400'}`}>
                <span>Ticket Price:</span>
                <span className="font-medium">
                  {ticketPrice >= recommendedTicketPrice ? 'Good' : `Increase to S/${recommendedTicketPrice}`}
                </span>
              </li>
              <li className={`flex justify-between ${attendees >= breakEvenAttendees ? 'text-green-400' : 'text-red-400'}`}>
                <span>Attendance:</span>
                <span className="font-medium">
                  {attendees >= breakEvenAttendees ? 'Good' : `Need ${breakEvenAttendees - attendees} more`}
                </span>
              </li>
              <li className={`flex justify-between ${isViable ? 'text-green-400' : 'text-red-400'}`}>
                <span>Overall viability:</span>
                <span className="font-medium">
                  {isViable ? 'Viable' : 'Not viable'}
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
  
  // Helper Components
  const StatusItem = ({ title, isEnough, currentAmount, requiredAmount }) => (
    <div className={`text-sm flex justify-between items-center p-1 rounded ${isEnough ? 'text-green-800' : 'text-red-800'}`}>
      <span className="font-medium">{title}:</span>
      <div className="flex items-center">
        <span>{currentAmount}/{requiredAmount} servings</span>
        {isEnough ? (
          <CheckCircle className="w-4 h-4 ml-1 text-green-500" />
        ) : (
          <AlertCircle className="w-4 h-4 ml-1 text-red-500" />
        )}
      </div>
    </div>
  );
  
  const StatusBar = ({ title, isEnough, currentAmount, requiredAmount }) => {
    const percentage = Math.min(100, (currentAmount / requiredAmount) * 100);
    
    return (
      <div className="mb-4">
        <div className="flex justify-between mb-1">
          <span className="text-sm font-medium text-gray-700">{title}</span>
          <span className="text-sm font-medium text-gray-700">
            {currentAmount}/{requiredAmount} servings
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div
            className={`h-2.5 rounded-full ${isEnough ? 'bg-green-500' : 'bg-red-500'}`}
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
        <div className="text-xs mt-1 text-right">
          {isEnough ? (
            <span className="text-green-600">Sufficient</span>
          ) : (
            <span className="text-red-600">Need {requiredAmount - currentAmount} more servings</span>
          )}
        </div>
      </div>
    );
  };
  
  return (
    <div className="bg-gray-50 min-h-screen p-4">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Party Financial Simulator (PEN)</h2>
          <p className="text-gray-600">Plan your party finances, shopping list, and requirements</p>
        </div>
        
        {/* Tabs */}
        <div className="flex flex-wrap border-b border-gray-200 mb-6">
          <button
            className={`px-4 py-2 text-sm font-medium ${activeTab === 'overview' ? 'text-blue-600 border-b-2 border-blue-500' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button
            className={`px-4 py-2 text-sm font-medium ${activeTab === 'shopping' ? 'text-blue-600 border-b-2 border-blue-500' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('shopping')}
          >
            Shopping List
          </button>
          <button
            className={`px-4 py-2 text-sm font-medium ${activeTab === 'drinks' ? 'text-blue-600 border-b-2 border-blue-500' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('drinks')}
          >
            Drinks
          </button>
          <button
            className={`px-4 py-2 text-sm font-medium ${activeTab === 'food' ? 'text-blue-600 border-b-2 border-blue-500' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('food')}
          >
            Food & BBQ
          </button>
          <button
            className={`px-4 py-2 text-sm font-medium ${activeTab === 'venue' ? 'text-blue-600 border-b-2 border-blue-500' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('venue')}
          >
            Venue & Misc
          </button>
          <button
            className={`px-4 py-2 text-sm font-medium ${activeTab === 'reports' ? 'text-blue-600 border-b-2 border-blue-500' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('reports')}
          >
            Reports
          </button>
        </div>
        
        {/* Tab Content */}
        {renderTab()}
      </div>
    </div>
  );
}