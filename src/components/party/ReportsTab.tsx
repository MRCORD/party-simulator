import React from 'react';
import Card from '@/components/ui/Card';
import Table from '@/components/ui/Table';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { useTheme } from '@/components/ui/ThemeProvider';
import { 
  FileBarChart, TrendingUp, DollarSign, Users, 
  PieChart, BarChart, CheckCircle, AlertCircle, 
  Info, Target, ArrowUp, ArrowDown, Calendar,
  Activity, FileText, ChevronDown
} from 'lucide-react';

interface ShoppingItem {
  category: 'spirits' | 'mixers' | 'ice' | 'supplies' | 'meat' | 'sides' | 'condiments' | 'other';
  cost: number;
  units: number;
}

interface DrinkRequirements {
  totalCost: number;
}

interface FoodRequirements {
  totalCost: number;
}

interface FinancialData {
  category: string;
  cost: number;
  perPerson: number;
  percentage: number | string;
}

interface CategoryData {
  category: string;
  items: number;
  cost: number;
}

interface ExpenseCategory {
  name: string;
  value: number;
  color: string;
}

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
  calculateDrinkRequirements: () => DrinkRequirements;
  calculateFoodRequirements: () => FoodRequirements;
  drinksPerPerson: number;
  foodServingsPerPerson: number;
  shoppingItems: ShoppingItem[];
  getCategoryTotal: (category: string) => number;
}

interface TableColumn<T> {
  accessor: keyof T;
  Header: string;
  width?: string;
  Cell?: ({ value }: { value: any }) => React.ReactNode;
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
  drinksPerPerson,
  foodServingsPerPerson,
  shoppingItems,
  getCategoryTotal
}) => {
  const theme = useTheme();
  
  // Calculate some additional financial metrics
  const drinkRequirements = calculateDrinkRequirements();
  const foodRequirements = calculateFoodRequirements();
  const miscCosts = totalCosts - venueCost - drinkRequirements.totalCost - foodRequirements.totalCost;
  const profitMargin = netProfit !== 0 && totalRevenue !== 0 ? (netProfit / totalRevenue) * 100 : 0;
  const costRevenue = totalRevenue !== 0 ? (totalCosts / totalRevenue) * 100 : 0;
  const roi = totalCosts !== 0 ? (netProfit / totalCosts) * 100 : 0;
  
  // Helper to get badge style
  const getBadgeStyle = (isGood: boolean): string => {
    return isGood 
      ? "bg-success-light text-success-dark flex items-center"
      : "bg-error-light text-error-dark flex items-center";
  };
  
  // Expense categories for visualizations
  const expenseCategories: ExpenseCategory[] = [
    { name: 'Local', value: venueCost, color: 'bg-teal-500' },
    { name: 'Bebidas', value: drinkRequirements.totalCost, color: 'bg-blue-500' },
    { name: 'Comida', value: foodRequirements.totalCost, color: 'bg-red-500' },
    { name: 'Misceláneos', value: miscCosts, color: 'bg-amber-500' }
  ];
  
  // Financial summary data
  const financialData: FinancialData[] = [
    {
      category: 'Local',
      cost: venueCost,
      perPerson: venueCost / attendees,
      percentage: (venueCost / totalCosts) * 100
    },
    {
      category: 'Bebidas',
      cost: drinkRequirements.totalCost,
      perPerson: drinkRequirements.totalCost / attendees,
      percentage: (drinkRequirements.totalCost / totalCosts) * 100
    },
    {
      category: 'Comida',
      cost: foodRequirements.totalCost,
      perPerson: foodRequirements.totalCost / attendees,
      percentage: (foodRequirements.totalCost / totalCosts) * 100
    },
    {
      category: 'Misceláneos',
      cost: miscCosts,
      perPerson: miscCosts / attendees,
      percentage: (miscCosts / totalCosts) * 100
    },
    {
      category: 'COSTOS TOTALES',
      cost: totalCosts,
      perPerson: perPersonCost,
      percentage: 100
    },
    {
      category: 'INGRESOS TOTALES',
      cost: totalRevenue,
      perPerson: ticketPrice,
      percentage: '-'
    },
    {
      category: 'BENEFICIO/PÉRDIDA NETA',
      cost: netProfit,
      perPerson: netProfit / attendees,
      percentage: netProfit >= 0 ? `${((netProfit / totalRevenue) * 100).toFixed(1)}% margen` : '-'
    }
  ];
  
  // Beverage data
  const beverageData: CategoryData[] = [
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
  
  // Food data
  const foodData: CategoryData[] = [
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
          
          {/* Key metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center">
              <div className="text-xs uppercase tracking-wide mb-1">Ingresos Totales</div>
              <div className="text-2xl font-bold flex justify-center items-center">
                <DollarSign size={18} className="mr-2 opacity-70" />
                S/ {totalRevenue.toFixed(2)}
              </div>
            </div>
            
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center">
              <div className="text-xs uppercase tracking-wide mb-1">Costos Totales</div>
              <div className="text-2xl font-bold flex justify-center items-center">
                <DollarSign size={18} className="mr-2 opacity-70" />
                S/ {totalCosts.toFixed(2)}
              </div>
            </div>
            
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center">
              <div className="text-xs uppercase tracking-wide mb-1">Beneficio Neto</div>
              <div className={`text-2xl font-bold flex justify-center items-center ${netProfit >= 0 ? '' : 'text-red-200'}`}>
                {netProfit >= 0 ? (
                  <ArrowUp size={18} className="mr-2 opacity-70" />
                ) : (
                  <ArrowDown size={18} className="mr-2 opacity-70" />
                )}
                S/ {netProfit.toFixed(2)}
              </div>
            </div>
            
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center">
              <div className="text-xs uppercase tracking-wide mb-1">Viabilidad</div>
              <div className="text-2xl font-bold flex justify-center items-center">
                {isViable ? (
                  <CheckCircle size={18} className="mr-2 opacity-70" />
                ) : (
                  <AlertCircle size={18} className="mr-2 opacity-70" />
                )}
                {isViable ? 'Viable' : 'No Viable'}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Enhanced Financial Summary Section */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className={`${theme.getGradient('primary')} px-4 py-3 text-white`}>
          <div className="flex items-center">
            <FileText className="w-5 h-5 mr-2" />
            <h3 className="font-medium">Resumen Financiero</h3>
          </div>
        </div>
        
        {/* Financial Summary Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0.5 bg-gray-100 p-0.5">
          {/* Revenue Card */}
          <div className="bg-white p-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-blue-700 font-medium flex items-center">
                <DollarSign className="w-4 h-4 mr-1" />
                Ingresos
              </h4>
              <span className="text-sm text-blue-500 font-medium">
                S/ {totalRevenue.toFixed(2)}
              </span>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-sm py-1 border-b border-gray-100">
                <span className="text-gray-600">Venta de Entradas ({attendees} × S/ {ticketPrice})</span>
                <span className="font-medium">S/ {totalRevenue.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm py-1 border-b border-gray-100">
                <span className="text-gray-600">Ingresos Adicionales</span>
                <span className="font-medium">S/ 0.00</span>
              </div>
              <div className="flex justify-between text-sm py-2 font-medium">
                <span className="text-gray-800">Total Ingresos</span>
                <span className="text-blue-600">S/ {totalRevenue.toFixed(2)}</span>
              </div>
            </div>
          </div>
          
          {/* Expenses Card */}
          <div className="bg-white p-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-red-700 font-medium flex items-center">
                <DollarSign className="w-4 h-4 mr-1" />
                Gastos
              </h4>
              <span className="text-sm text-red-500 font-medium">
                S/ {totalCosts.toFixed(2)}
              </span>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-sm py-1 border-b border-gray-100">
                <span className="text-gray-600">Alquiler del Local</span>
                <span className="font-medium">S/ {venueCost.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm py-1 border-b border-gray-100">
                <span className="text-gray-600">Bebidas</span>
                <span className="font-medium">S/ {drinkRequirements.totalCost.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm py-1 border-b border-gray-100">
                <span className="text-gray-600">Comida</span>
                <span className="font-medium">S/ {foodRequirements.totalCost.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm py-1 border-b border-gray-100">
                <span className="text-gray-600">Misceláneos</span>
                <span className="font-medium">S/ {miscCosts.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm py-2 font-medium">
                <span className="text-gray-800">Total Gastos</span>
                <span className="text-red-600">S/ {totalCosts.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Bottom Line Results */}
        <div className="border-t border-gray-200 bg-gray-50 px-4 py-4">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center">
            <div className="flex items-center mb-3 md:mb-0">
              <h4 className="text-gray-800 font-medium mr-2">Resultado Neto:</h4>
              <div className={`flex items-center ${netProfit >= 0 ? 'text-green-600' : 'text-red-600'} font-bold text-lg`}>
                {netProfit >= 0 ? (
                  <ArrowUp className="w-5 h-5 mr-1" />
                ) : (
                  <ArrowDown className="w-5 h-5 mr-1" />
                )}
                S/ {netProfit.toFixed(2)}
                <span className="text-sm font-normal ml-2">
                  ({profitMargin.toFixed(1)}% de margen)
                </span>
              </div>
            </div>
            
            <div className="flex items-center">
              <span className="text-gray-600 mr-2">Viabilidad Financiera:</span>
              <span className={`flex items-center ${isViable ? 'text-green-600' : 'text-red-600'} font-medium`}>
                {isViable ? (
                  <>
                    <CheckCircle className="w-4 h-4 mr-1" />
                    <span>Viable</span>
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-4 h-4 mr-1" />
                    <span>No Viable</span>
                  </>
                )}
              </span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Expense Distribution & Shopping List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Expense Distribution */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className={`${theme.getGradient('primary')} px-4 py-3 text-white`}>
            <div className="flex items-center">
              <PieChart className="w-5 h-5 mr-2" />
              <h3 className="font-medium">Distribución de Gastos</h3>
            </div>
          </div>
          
          <div className="p-4">
            <div className="overflow-hidden border border-gray-200 rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Categoría
                    </th>
                    <th scope="col" className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Monto (S/)
                    </th>
                    <th scope="col" className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      % del Total
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {expenseCategories.map((category, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-gray-800">
                        {category.name}
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap text-sm text-right">
                        S/ {category.value.toFixed(2)}
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap text-sm text-right">
                        {totalCosts > 0 ? ((category.value / totalCosts) * 100).toFixed(1) : '0.0'}%
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="bg-gray-50 font-medium">
                    <td className="px-3 py-2 whitespace-nowrap text-sm">Total</td>
                    <td className="px-3 py-2 whitespace-nowrap text-sm text-right">
                      S/ {totalCosts.toFixed(2)}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap text-sm text-right">
                      100.0%
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
            
            {/* Distribution Bars */}
            <div className="mt-4 space-y-2">
              {expenseCategories.map((category, index) => (
                <div key={index}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-600">{category.name}</span>
                    <span className="text-gray-600">
                      {totalCosts > 0 ? ((category.value / totalCosts) * 100).toFixed(1) : '0.0'}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${category.color}`} 
                      style={{ width: `${totalCosts > 0 ? (category.value / totalCosts) * 100 : 0}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Shopping Lists Summary */}
        <div className="space-y-4">
          {/* Beverage Data */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className={`${theme.getGradient('primary')} px-4 py-3 text-white`}>
              <div className="flex items-center">
                <BarChart className="w-5 h-5 mr-2" />
                <h3 className="font-medium">Resumen de Bebidas</h3>
              </div>
            </div>
            
            <div className="p-4">
              <div className="overflow-hidden border border-gray-200 rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Categoría
                      </th>
                      <th scope="col" className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Artículos
                      </th>
                      <th scope="col" className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Costo
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {beverageData.map((item, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-gray-800">
                          {item.category}
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap text-sm text-right">
                          {item.items}
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap text-sm text-right font-medium">
                          S/ {item.cost.toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="bg-gray-50 font-medium">
                      <td colSpan={2} className="px-3 py-2 whitespace-nowrap text-sm text-right">
                        Total:
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap text-sm text-right">
                        S/ {beverageData.reduce((sum, item) => sum + item.cost, 0).toFixed(2)}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          </div>
          
          {/* Food Data */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className={`${theme.getGradient('warning')} px-4 py-3 text-white`}>
              <div className="flex items-center">
                <BarChart className="w-5 h-5 mr-2" />
                <h3 className="font-medium">Resumen de Comida</h3>
              </div>
            </div>
            
            <div className="p-4">
              <div className="overflow-hidden border border-gray-200 rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Categoría
                      </th>
                      <th scope="col" className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Artículos
                      </th>
                      <th scope="col" className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Costo
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {foodData.map((item, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-gray-800">
                          {item.category}
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap text-sm text-right">
                          {item.items}
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap text-sm text-right font-medium">
                          S/ {item.cost.toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="bg-gray-50 font-medium">
                      <td colSpan={2} className="px-3 py-2 whitespace-nowrap text-sm text-right">
                        Total:
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap text-sm text-right">
                        S/ {foodData.reduce((sum, item) => sum + item.cost, 0).toFixed(2)}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Financial Metrics and Recommendations */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className={`${theme.getGradient('primary')} px-4 py-3 text-white`}>
          <div className="flex items-center">
            <Activity className="w-5 h-5 mr-2" />
            <h3 className="font-medium">Métricas Financieras</h3>
          </div>
        </div>
        
        <div className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-4">
            <div className="bg-primary-light/20 rounded-lg p-3 border border-primary-light">
              <div className="text-xs text-gray-500 mb-1">Costo por Persona</div>
              <div className="text-base font-medium text-gray-800">S/ {perPersonCost.toFixed(2)}</div>
              <div className="mt-1 flex items-center">
                {ticketPrice >= perPersonCost ? (
                  <span className="text-xs text-success-dark flex items-center">
                    <CheckCircle className="w-3 h-3 mr-1" /> Ingreso cubre costo
                  </span>
                ) : (
                  <span className="text-xs text-error-dark flex items-center">
                    <AlertCircle className="w-3 h-3 mr-1" /> Costo mayor que ingreso
                  </span>
                )}
              </div>
            </div>
            
            <div className="bg-primary-light/20 rounded-lg p-3 border border-primary-light">
              <div className="text-xs text-gray-500 mb-1">Punto de Equilibrio</div>
              <div className="text-base font-medium text-gray-800">{breakEvenAttendees} asistentes</div>
              <div className="mt-1 flex items-center">
                {attendees >= breakEvenAttendees ? (
                  <span className="text-xs text-success-dark flex items-center">
                    <CheckCircle className="w-3 h-3 mr-1" /> Por encima del equilibrio
                  </span>
                ) : (
                  <span className="text-xs text-error-dark flex items-center">
                    <AlertCircle className="w-3 h-3 mr-1" /> Faltan {breakEvenAttendees - attendees}
                  </span>
                )}
              </div>
            </div>
            
            <div className="bg-primary-light/20 rounded-lg p-3 border border-primary-light">
              <div className="text-xs text-gray-500 mb-1">Precio Recomendado</div>
              <div className="text-base font-medium text-gray-800">S/ {recommendedTicketPrice}</div>
              <div className="mt-1 flex items-center">
                {ticketPrice >= recommendedTicketPrice ? (
                  <span className="text-xs text-success-dark flex items-center">
                    <CheckCircle className="w-3 h-3 mr-1" /> Precio adecuado
                  </span>
                ) : (
                  <span className="text-xs text-warning-dark flex items-center">
                    <AlertCircle className="w-3 h-3 mr-1" /> Aumentar en S/ {(recommendedTicketPrice - ticketPrice).toFixed(2)}
                  </span>
                )}
              </div>
            </div>
            
            <div className="bg-primary-light/20 rounded-lg p-3 border border-primary-light">
              <div className="text-xs text-gray-500 mb-1">Margen de Beneficio</div>
              <div className={`text-base font-medium ${profitMargin >= 0 ? 'text-success' : 'text-error'}`}>
                {profitMargin.toFixed(1)}%
              </div>
              <div className="mt-1 flex items-center">
                {profitMargin >= 15 ? (
                  <span className="text-xs text-success-dark flex items-center">
                    <CheckCircle className="w-3 h-3 mr-1" /> Excelente margen
                  </span>
                ) : profitMargin >= 0 ? (
                  <span className="text-xs text-warning-dark flex items-center">
                    <AlertCircle className="w-3 h-3 mr-1" /> Margen positivo bajo
                  </span>
                ) : (
                  <span className="text-xs text-error-dark flex items-center">
                    <AlertCircle className="w-3 h-3 mr-1" /> Margen negativo
                  </span>
                )}
              </div>
            </div>
          </div>
          
          {/* Financial Ratios visualizations */}
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Costs vs Revenue */}
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm text-gray-600">Costos vs. Ingresos</span>
                <span className={`text-sm font-medium ${costRevenue <= 80 ? 'text-success' : costRevenue <= 100 ? 'text-warning' : 'text-error'}`}>
                  {costRevenue.toFixed(1)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className={`h-2.5 rounded-full ${
                    costRevenue <= 80 ? 'bg-success' : 
                    costRevenue <= 100 ? 'bg-warning' : 
                    'bg-error'
                  }`} 
                  style={{ width: `${Math.min(costRevenue, 100)}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {costRevenue <= 80 ? 'Buena eficiencia de costos' : 
                costRevenue <= 100 ? 'Los costos consumen la mayoría de los ingresos' : 
                'Los costos superan los ingresos - ajusta precios o reduce costos'}
              </p>
            </div>
            
            {/* ROI */}
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm text-gray-600">Retorno de Inversión (ROI)</span>
                <span className={`text-sm font-medium ${roi >= 20 ? 'text-success' : roi >= 0 ? 'text-warning' : 'text-error'}`}>
                  {roi.toFixed(1)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className={`h-2.5 rounded-full ${
                    roi >= 20 ? 'bg-success' : 
                    roi >= 0 ? 'bg-warning' : 
                    'bg-error'
                  }`} 
                  style={{ width: `${Math.min(Math.max(roi + 20, 0), 100)}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {roi >= 20 ? 'Excelente retorno de inversión' : 
                roi >= 0 ? 'Retorno positivo pero bajo' : 
                'Retorno negativo - reconsiderar la estructura de costos'}
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Recommendations section */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className={`${theme.getGradient('primary')} px-4 py-3 text-white`}>
          <div className="flex items-center">
            <Target className="w-5 h-5 mr-2" />
            <h3 className="font-medium">Recomendaciones Financieras</h3>
          </div>
        </div>
        
        <div className="p-4">
          <div className="bg-primary-light/20 rounded-lg p-4 border border-primary-light mb-4">
            <h5 className="font-medium text-primary-dark flex items-center mb-2">
              <Info className="w-5 h-5 mr-2" />
              Diagnóstico Financiero
            </h5>
            <p className="text-sm text-primary-dark mb-3">
              {isViable 
                ? 'El evento es financieramente viable con la estructura actual de costos e ingresos.' 
                : 'El evento no es financieramente viable con la estructura actual de costos e ingresos.'}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              <div className={`rounded-lg p-3 text-sm ${isViable ? 'bg-success-light text-success-dark' : 'bg-warning-light text-warning-dark'}`}>
                <div className="font-medium mb-1">Estado Actual</div>
                <div className="flex items-center">
                  {isViable ? (
                    <CheckCircle className="w-4 h-4 mr-1 flex-shrink-0" />
                  ) : (
                    <AlertCircle className="w-4 h-4 mr-1 flex-shrink-0" />
                  )}
                  <span>{isViable ? 'Viable' : 'No Viable'}</span>
                </div>
              </div>
              <div className={`rounded-lg p-3 text-sm ${attendees >= breakEvenAttendees ? 'bg-success-light text-success-dark' : 'bg-warning-light text-warning-dark'}`}>
                <div className="font-medium mb-1">Asistencia</div>
                <div>
                  Actual: <span className="font-medium">{attendees}</span> / Necesaria: <span className="font-medium">{breakEvenAttendees}</span>
                </div>
              </div>
              <div className={`rounded-lg p-3 text-sm ${ticketPrice >= recommendedTicketPrice ? 'bg-success-light text-success-dark' : 'bg-warning-light text-warning-dark'}`}>
                <div className="font-medium mb-1">Precio de Entrada</div>
                <div>
                  Actual: <span className="font-medium">S/ {ticketPrice.toFixed(2)}</span> / Recomendado: <span className="font-medium">S/ {recommendedTicketPrice.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
          
          <h5 className="font-medium text-gray-800 mb-3">Acciones Recomendadas</h5>
          <ul className="space-y-2">
            {ticketPrice < recommendedTicketPrice && (
              <li className="flex items-start">
                <div className="flex-shrink-0 h-5 w-5 rounded-full border border-primary flex items-center justify-center mr-2 mt-0.5">
                  <span className="h-3 w-3 rounded-sm bg-primary"></span>
                </div>
                <span className="text-sm text-gray-700">
                  Aumentar el precio de la entrada a S/ {recommendedTicketPrice.toFixed(2)} (+S/ {(recommendedTicketPrice - ticketPrice).toFixed(2)}) para asegurar rentabilidad.
                </span>
              </li>
            )}
            
            {attendees < breakEvenAttendees && (
              <li className="flex items-start">
                <div className="flex-shrink-0 h-5 w-5 rounded-full border border-primary flex items-center justify-center mr-2 mt-0.5">
                  <span className="h-3 w-3 rounded-sm bg-primary"></span>
                </div>
                <span className="text-sm text-gray-700">
                  Aumentar la asistencia a al menos {breakEvenAttendees} personas (+{breakEvenAttendees - attendees}) para alcanzar el punto de equilibrio.
                </span>
              </li>
            )}
            
            {drinkRequirements.totalCost > foodRequirements.totalCost * 3 && (
              <li className="flex items-start">
                <div className="flex-shrink-0 h-5 w-5 rounded-full border border-primary flex items-center justify-center mr-2 mt-0.5">
                  <span className="h-3 w-3 rounded-sm bg-primary"></span>
                </div>
                <span className="text-sm text-gray-700">
                  Optimizar los costos de bebidas que representan un {((drinkRequirements.totalCost / totalCosts) * 100).toFixed(1)}% del presupuesto total.
                </span>
              </li>
            )}
            
            {profitMargin < 15 && profitMargin >= 0 && (
              <li className="flex items-start">
                <div className="flex-shrink-0 h-5 w-5 rounded-full border border-primary flex items-center justify-center mr-2 mt-0.5">
                  <span className="h-3 w-3 rounded-sm bg-primary"></span>
                </div>
                <span className="text-sm text-gray-700">
                  Buscar formas de aumentar el margen de beneficio actual ({profitMargin.toFixed(1)}%) a al menos 15% para mejor rentabilidad.
                </span>
              </li>
            )}
            
            <li className="flex items-start">
              <div className="flex-shrink-0 h-5 w-5 rounded-full border border-primary flex items-center justify-center mr-2 mt-0.5">
                <span className="h-3 w-3 rounded-sm bg-primary"></span>
              </div>
              <span className="text-sm text-gray-700">
                {isViable 
                  ? 'Mantener el control de gastos para preservar la viabilidad financiera.' 
                  : 'Revisar y ajustar la estructura de costos para mejorar la viabilidad financiera.'}
              </span>
            </li>
          </ul>
        </div>
      </div>
      
      {/* Export Options */}
      <div className="bg-white rounded-lg shadow p-4 flex justify-between items-center">
        <span className="text-sm text-gray-600">Exportar informe completo para compartir</span>
        <div className="flex space-x-3">
          <Button
            variant="gradient"
            color="primary"
            size="md"
          >
            <FileText className="w-4 h-4 mr-2" />
            PDF
          </Button>
          <Button
            variant="ghost"
            color="primary"
            size="md"
          >
            <ChevronDown className="w-4 h-4 mr-2" />
            Excel
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ReportsTab;