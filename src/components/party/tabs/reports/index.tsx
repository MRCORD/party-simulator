"use client";
import React from 'react';
import { FileBarChart } from 'lucide-react';
import { useTheme } from '@/components/ui/ThemeProvider';

// Import components
import FinancialSummary from './components/FinancialSummary';
import ExpenseDistribution from './components/ExpenseDistribution';
import InventorySummary from './components/InventorySummary';
import FinancialMetrics from './components/FinancialMetrics';
import RecommendationsSection from './components/RecommendationsSection';
import ExportOptions from './components/ExportOptions';

// Import types
import { ShoppingItem } from '@/types';

interface ReportsTabProps {
  venueCost: number;
  attendees: number;
  ticketPrice: number;
  totalCosts: number;
  totalRevenue: number;
  netProfit: number;
  perPersonCost: number;
  breakEvenAttendees: number;
  recommendedTicketPrice: number;
  isViable: boolean;
  calculateDrinkRequirements: () => any;
  calculateFoodRequirements: () => any;
  shoppingItems: ShoppingItem[];
  getCategoryTotal: (category: string) => number;
}

const ReportsTab: React.FC<ReportsTabProps> = ({
  venueCost,
  attendees,
  ticketPrice,
  totalCosts,
  totalRevenue,
  netProfit,
  perPersonCost,
  breakEvenAttendees,
  recommendedTicketPrice,
  isViable,
  calculateDrinkRequirements,
  calculateFoodRequirements,
  shoppingItems,
  getCategoryTotal
}) => {
  const theme = useTheme();
  
  // Calculate additional metrics
  const drinkRequirements = calculateDrinkRequirements();
  const foodRequirements = calculateFoodRequirements();
  const miscCosts = totalCosts - venueCost - drinkRequirements.totalCost - foodRequirements.totalCost;
  const profitMargin = netProfit !== 0 && totalRevenue !== 0 ? (netProfit / totalRevenue) * 100 : 0;
  const costRevenue = totalRevenue !== 0 ? (totalCosts / totalRevenue) * 100 : 0;
  const roi = totalCosts !== 0 ? (netProfit / totalCosts) * 100 : 0;
  
  // Expense categories for visualizations
  const expenseCategories = [
    { name: 'Local', value: venueCost, color: '#10b981' },  // teal
    { name: 'Bebidas', value: drinkRequirements.totalCost, color: '#4f86f7' }, // blue
    { name: 'Comida', value: foodRequirements.totalCost, color: '#f59e0b' }, // amber
    { name: 'Misceláneos', value: miscCosts, color: '#ec4899' } // pink
  ];
  
  // Beverage and food data for inventory summary
  const beverageData = [
    {
      category: 'Licores',
      items: shoppingItems.filter(i => i.category === 'spirits').length,
      cost: getCategoryTotal('spirits')
    },
    {
      category: 'Mezcladores',
      items: shoppingItems.filter(i => i.category === 'mixers').length,
      cost: getCategoryTotal('mixers')
    },
    {
      category: 'Hielo',
      items: shoppingItems.filter(i => i.category === 'ice').length,
      cost: getCategoryTotal('ice')
    },
    {
      category: 'Suministros',
      items: shoppingItems.filter(i => i.category === 'supplies').length,
      cost: getCategoryTotal('supplies')
    }
  ];
  
  const foodData = [
    {
      category: 'Carnes',
      items: shoppingItems.filter(i => i.category === 'meat').length,
      cost: getCategoryTotal('meat')
    },
    {
      category: 'Guarniciones',
      items: shoppingItems.filter(i => i.category === 'sides').length,
      cost: getCategoryTotal('sides')
    },
    {
      category: 'Condimentos',
      items: shoppingItems.filter(i => i.category === 'condiments').length,
      cost: getCategoryTotal('condiments')
    },
    {
      category: 'Otros',
      items: shoppingItems.filter(i => i.category === 'other').length,
      cost: getCategoryTotal('other')
    }
  ];
  
  return (
    <div className="space-y-6">
      {/* Main Reports Header */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className={`${theme.getGradient('primary')} p-5 text-white`}>
          <div className="flex items-center">
            <FileBarChart className="w-6 h-6 mr-3" />
            <h2 className="text-xl font-bold">Informes y Análisis</h2>
          </div>
        </div>
      </div>

      {/* Financial Summary Section */}
      <FinancialSummary 
        totalRevenue={totalRevenue}
        totalCosts={totalCosts}
        netProfit={netProfit}
        venueCost={venueCost}
        drinkRequirements={drinkRequirements}
        foodRequirements={foodRequirements}
        miscCosts={miscCosts}
        isViable={isViable}
      />
      
      {/* Expense Distribution & Inventory Summaries Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Expense Distribution Chart */}
        <ExpenseDistribution expenseCategories={expenseCategories} />
        
        {/* Inventory Summaries */}
        <InventorySummary 
          beverageData={beverageData} 
          foodData={foodData} 
        />
      </div>
      
      {/* Financial Metrics */}
      <FinancialMetrics 
        attendees={attendees}
        ticketPrice={ticketPrice}
        perPersonCost={perPersonCost}
        breakEvenAttendees={breakEvenAttendees}
        recommendedTicketPrice={recommendedTicketPrice}
        profitMargin={profitMargin}
        costRevenue={costRevenue}
        roi={roi}
      />
      
      {/* Recommendations Section */}
      <RecommendationsSection 
        isViable={isViable}
        ticketPrice={ticketPrice}
        recommendedTicketPrice={recommendedTicketPrice}
        attendees={attendees}
        breakEvenAttendees={breakEvenAttendees}
        drinkRequirements={drinkRequirements}
        foodRequirements={foodRequirements}
        profitMargin={profitMargin}
        totalCosts={totalCosts}
      />
      
      {/* Export Options */}
      <ExportOptions />
    </div>
  );
};

export default ReportsTab;