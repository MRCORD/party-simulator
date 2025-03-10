"use client";

import React, { useState, useEffect } from 'react';
import { 
  Users, DollarSign, Wine, Utensils, MapPin, 
  FileBarChart, ShoppingBag, AlertCircle, CheckCircle,
  Sparkles
} from 'lucide-react';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Tabs from '@/components/ui/Tabs';
import PageHeader from '@/components/ui/PageHeader';
import { useTheme } from '@/components/ui/ThemeProvider';

// Import shared types
import { 
  ShoppingItem,
  CostBreakdownItem,
  FinancialOverviewItem,
  Category
} from './types';

// Import tab components
import OverviewTab from './OverviewTab';
import ShoppingTab from './ShoppingTab';
import DrinksTab from './DrinksTab';
import FoodTab from './FoodTab';
import VenueTab from './VenueTab';
import ReportsTab from './ReportsTab';

// Main component
export default function PartySimulator() {
  const theme = useTheme();
  
  // Tab state
  const [activeTab, setActiveTab] = useState<'overview'|'shopping'|'drinks'|'food'|'venue'|'reports'>('overview');
  
  // JSON data for shopping items
  const [shoppingItems, setShoppingItems] = useState<ShoppingItem[]>([
    // Default items for demonstration
    { id: '1', name: 'Ron Cartavio', category: 'spirits', cost: 45, units: 1, size: 750, sizeUnit: 'ml', servings: 15, totalCost: 45 },
    { id: '2', name: 'Coca-Cola', category: 'mixers', cost: 30, units: 6, size: 1.5, sizeUnit: 'L', servings: 30, totalCost: 180 },
    { id: '3', name: 'Hielo', category: 'ice', cost: 12, units: 1, size: 5, sizeUnit: 'kg', servings: 25, totalCost: 12 },
    { id: '4', name: 'Pollo', category: 'meat', cost: 180, units: 1, size: 10, sizeUnit: 'kg', servings: 20, totalCost: 180 },
    { id: '5', name: 'Ensalada de Papa', category: 'sides', cost: 120, units: 1, size: 5, sizeUnit: 'kg', servings: 25, totalCost: 120 },
    { id: '6', name: 'Pack de Salsas', category: 'condiments', cost: 60, units: 1, size: 1, sizeUnit: 'pack', servings: 30, totalCost: 60 },
    { id: '7', name: 'Vasos Rojos', category: 'supplies', cost: 15, units: 100, size: 16, sizeUnit: 'oz', servings: 100, totalCost: 1500 },
  ]);
  
  // New item form - using Omit to exclude 'id' property which is generated
  const [newItem, setNewItem] = useState<Omit<ShoppingItem, 'id'>>({
    name: '',
    category: 'spirits',
    cost: 0,
    units: 1,
    size: 0,
    sizeUnit: 'ml',
    servings: 0,
    totalCost: 0
  });
  
  // Editing state
  const [editingItem, setEditingItem] = useState<ShoppingItem | null>(null);
  
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
    const categoryCosts: { [key: string]: number } = {};
    
    shoppingItems.forEach(item => {
      if (!categoryCosts[item.category]) {
        categoryCosts[item.category] = 0;
      }
      categoryCosts[item.category] += item.cost * item.units;
    });
    
    return categoryCosts;
  };
  
  // Function to get total costs for a category
  const getCategoryTotal = (category: string) => {
    return shoppingItems
      .filter(item => item.category === category)
      .reduce((sum, item) => sum + (item.cost * item.units), 0);
  };
  
  // Function to get total servings for a category
  const getCategoryServings = (category: string) => {
    return shoppingItems
      .filter(item => item.category === category)
      .reduce((sum, item) => sum + (item.servings * item.units), 0);
  };
  
  // Function to calculate if we have enough servings
  const hasEnoughServings = (category: string, requiredServings: number) => {
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
      const newId = shoppingItems.length > 0 ? (Math.max(...shoppingItems.map(item => parseInt(item.id))) + 1).toString() : '1';
      const totalCost = newItem.cost * newItem.units;
      setShoppingItems([...shoppingItems, { ...newItem, id: newId, totalCost }]);
      // Reset form
      setNewItem({
        name: '',
        category: 'spirits',
        cost: 0,
        units: 1,
        size: 0,
        sizeUnit: 'ml',
        servings: 0,
        totalCost: 0
      });
    }
  };
  
  // Function to start editing an item
  const startEdit = (item: ShoppingItem) => {
    setEditingItem(item);
    setNewItem({ ...item });
  };
  
  // Function to save edited item
  const saveEdit = () => {
    if (editingItem && newItem.name && newItem.cost > 0) {
      const totalCost = newItem.cost * newItem.units;
      setShoppingItems(shoppingItems.map(item => 
        item.id === editingItem.id ? { ...newItem, id: item.id, totalCost } : item
      ));
      setEditingItem(null);
      // Reset form
      setNewItem({
        name: '',
        category: 'spirits',
        cost: 0,
        units: 1,
        size: 0,
        sizeUnit: 'ml',
        servings: 0,
        totalCost: 0
      });
    }
  };
  
  // Function to delete an item
  const deleteItem = (id: string) => {
    setShoppingItems(shoppingItems.filter(item => item.id !== id));
  };
  
  // Get recommended units based on needs
  const getRecommendedUnits = (category: string, requiredServings: number) => {
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
  
  // Shopping categories
  const categories: Category[] = [
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
  const sizeUnits: { [key: string]: string[] } = {
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
    const grouped: { [key: string]: ShoppingItem[] } = {};
    categories.forEach(cat => {
      grouped[cat.value] = shoppingItems.filter(item => item.category === cat.value);
    });
    return grouped;
  };
  
  // JSON preview of all items
  const jsonPreview = JSON.stringify(shoppingItems, null, 2);
  
  // Function to handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === 'category') {
      // set category with cast to our allowed union type
      setNewItem({
        ...newItem,
        [name]: value as ShoppingItem['category'],
        sizeUnit: sizeUnits[value as keyof typeof sizeUnits][0]
      });
    } else {
      setNewItem({
        ...newItem,
        [name]: name === 'cost' || name === 'units' || name === 'servings' || name === 'size' || name === 'totalCost' ? 
          (value === '' ? 0 : parseFloat(value)) : value,
        // Recalculate totalCost whenever cost or units change
        ...(name === 'cost' || name === 'units' ? { 
          totalCost: name === 'cost' 
            ? parseFloat(value || '0') * newItem.units 
            : newItem.cost * parseFloat(value || '0') 
        } : {})
      });
    }
  };

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
          getCategoryTotal={getCategoryTotal}
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
          drinksPerPerson={drinksPerPerson}
          foodServingsPerPerson={foodServingsPerPerson}
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
    <div className="bg-gradient-to-br from-blue-50/70 to-white min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {/* Enhanced Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-500 rounded-2xl mb-8 overflow-hidden shadow-lg">
          <div className="px-8 py-6 text-white relative overflow-hidden">
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 left-0 w-40 h-40 bg-white rounded-full -translate-x-1/2 -translate-y-1/2" />
              <div className="absolute bottom-0 right-0 w-60 h-60 bg-white rounded-full translate-x-1/4 translate-y-1/4" />
            </div>
            
            <div className="flex items-center">
              <div className="bg-white text-blue-600 p-4 rounded-xl mr-4 shadow-md">
                <Sparkles size={32} />
              </div>
              <div>
                <h1 className="text-3xl font-bold mb-1">Simulador de Fiestas</h1>
                <p className="text-blue-100 text-lg">Organiza, planifica y visualiza todos los aspectos de tu próxima fiesta</p>
              </div>
            </div>
            
            {/* Status pills */}
            <div className="mt-6 flex flex-wrap gap-3">
              <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full flex items-center">
                <Users size={16} className="mr-2 text-blue-100" />
                <span>{attendees} Asistentes</span>
              </div>
              <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full flex items-center">
                <DollarSign size={16} className="mr-2 text-blue-100" />
                <span>S/ {ticketPrice} Entrada</span>
              </div>
              <div className={`px-4 py-2 rounded-full flex items-center ${isViable ? 'bg-green-500/80' : 'bg-red-500/80'}`}>
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