import React from 'react';
import { 
  Users, DollarSign, CheckCircle, AlertCircle, Wine, 
  Utensils, Calendar, Info
} from 'lucide-react';
import { 
  PieChart, Pie, Cell, Tooltip, BarChart, Bar, 
  XAxis, YAxis, CartesianGrid, ResponsiveContainer, 
  Legend, LabelList, Sector
} from 'recharts';
import Button from '@/components/ui/Button';

interface CostBreakdownItem {
  name: string;
  value: number;
}

interface FinancialOverviewItem {
  name: string;
  amount: number;
}

interface DrinkRequirements {
  hasEnoughSpirits: boolean;
  hasEnoughMixers: boolean;
  hasEnoughIce: boolean;
  hasEnoughSupplies: boolean;
  totalCost: number;
  totalDrinks: number;
}

interface FoodRequirements {
  hasEnoughMeat: boolean;
  hasEnoughSides: boolean;
  hasEnoughCondiments: boolean;
  totalCost: number;
  totalServings: number;
}

interface OverviewTabProps {
  attendees: number;
  setAttendees: (value: number) => void;
  ticketPrice: number;
  setTicketPrice: (value: number) => void;
  drinksPerPerson: number;
  setDrinksPerPerson: (value: number) => void;
  foodServingsPerPerson: number;
  setFoodServingsPerPerson: (value: number) => void;
  totalRevenue: number;
  totalCosts: number;
  netProfit: number;
  perPersonCost: number;
  breakEvenAttendees: number;
  recommendedTicketPrice: number;
  isViable: boolean;
  costBreakdown: CostBreakdownItem[];
  financialOverview: FinancialOverviewItem[];
  calculateDrinkRequirements: () => DrinkRequirements;
  calculateFoodRequirements: () => FoodRequirements;
  getCategoryServings: (category: string) => number;
  COLORS: string[];
}

// Types for chart components
interface PieChartCustomizedLabelProps {
  cx: number;
  cy: number;
  midAngle: number;
  innerRadius: number;
  outerRadius: number;
  percent: number;
  index: number;
  name: string;
  value: number;
}

interface PieChartActiveShapeProps {
  cx: number;
  cy: number;
  innerRadius: number;
  outerRadius: number;
  startAngle: number;
  endAngle: number;
  fill: string;
  payload: any;
  percent: number;
  value: number;
  name: string;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<any>;
  label?: string;
}

const OverviewTab: React.FC<OverviewTabProps> = ({
  attendees, setAttendees,
  ticketPrice, setTicketPrice,
  drinksPerPerson, setDrinksPerPerson,
  foodServingsPerPerson, setFoodServingsPerPerson,
  totalRevenue, totalCosts, netProfit,
  perPersonCost, breakEvenAttendees, recommendedTicketPrice,
  isViable, costBreakdown, financialOverview, 
  calculateDrinkRequirements, calculateFoodRequirements, 
  getCategoryServings, COLORS
}) => {
  // Get calculated requirements
  const drinkRequirements = calculateDrinkRequirements();
  const foodRequirements = calculateFoodRequirements();
  
  // Active section for the pie chart (for hover effect)
  const [activeIndex, setActiveIndex] = React.useState<number | null>(null);
  
  // Basic parameters card
  const renderBasicParameters = () => {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-center mb-4">
          <Users className="w-5 h-5 text-blue-600 mr-2" />
          <h2 className="text-base font-medium text-primary">Parámetros Básicos</h2>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm text-primary mb-1">Asistentes</label>
            <div className="relative">
              <input
                type="number"
                className="block w-full rounded border border-gray-300 py-2 px-3 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                value={attendees}
                onChange={(e) => setAttendees(parseInt(e.target.value) || 1)}
                min="1"
                step="1"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm text-primary mb-1">Precio de Entrada (S/)</label>
            <div className="relative">
              <div className="flex rounded shadow-sm">
                <span className="inline-flex items-center rounded-l border border-r-0 border-gray-300 bg-gray-50 px-3 text-gray-500">S/</span>
                <input
                  type="number"
                  className="block w-full rounded-r border border-gray-300 py-2 pl-1 pr-3 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                  value={ticketPrice}
                  onChange={(e) => setTicketPrice(parseFloat(e.target.value) || 0)}
                  min="0"
                  step="1"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-primary mb-1 flex items-center">
              <Wine className="w-4 h-4 mr-1 text-blue-600" /> Bebidas por Persona
            </label>
            <div className="flex rounded shadow-sm">
              <Button
                variant="outline"
                color="primary"
                size="sm"
                onClick={() => setDrinksPerPerson(Math.max(1, drinksPerPerson - 1))}
                className="rounded-r-none"
              >
                -
              </Button>
              <input
                type="text"
                className="block w-full min-w-0 flex-1 text-center border-y border-gray-300 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                value={drinksPerPerson}
                readOnly
              />
              <Button
                variant="outline"
                color="primary"
                size="sm"
                onClick={() => setDrinksPerPerson(drinksPerPerson + 1)}
                className="rounded-l-none"
              >
                +
              </Button>
            </div>
          </div>
          
          <div>
            <label className="block text-sm text-primary mb-1 flex items-center">
              <Utensils className="w-4 h-4 mr-1 text-blue-600" /> Porciones/Persona
            </label>
            <div className="flex rounded shadow-sm">
              <Button
                variant="outline"
                color="primary"
                size="sm"
                onClick={() => setFoodServingsPerPerson(Math.max(1, foodServingsPerPerson - 1))}
                className="rounded-r-none"
              >
                -
              </Button>
              <input
                type="text"
                className="block w-full min-w-0 flex-1 text-center border-y border-gray-300 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                value={foodServingsPerPerson}
                readOnly
                aria-label="Porciones por persona"
              />
              <Button
                variant="outline"
                color="primary"
                size="sm"
                onClick={() => setFoodServingsPerPerson(foodServingsPerPerson + 1)}
                className="rounded-l-none"
              >
                +
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Financial summary card
  const renderFinancialSummary = () => {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <div className="flex items-center mb-5 text-lg font-medium text-primary">
          <DollarSign className="w-6 h-6 text-green-600 mr-3" />
          <h2>Resumen Financiero</h2>
        </div>
        
        {/* Income & Costs - Main financial metrics in a group */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-5">
          {/* Income and Costs Group */}
          <div className="grid grid-cols-1 gap-3">
            <div className="rounded-lg bg-green-50 p-4 border border-green-100 shadow-sm">
              <div className="flex justify-between items-center">
                <span className="text-lg font-medium text-primary">Ingresos:</span>
                <span className="text-lg font-medium text-green-700">S/ {totalRevenue.toFixed(2)}</span>
              </div>
            </div>
            
            <div className="rounded-lg bg-red-50 p-4 border border-red-100 shadow-sm">
              <div className="flex justify-between items-center">
                <span className="text-lg font-medium text-primary">Costos:</span>
                <span className="text-lg font-medium text-red-700">S/ {totalCosts.toFixed(2)}</span>
              </div>
            </div>
            
            <div className={`rounded-lg ${netProfit >= 0 ? 'bg-green-50 border-green-100' : 'bg-red-50 border-red-100'} p-4 border shadow-sm`}>
              <div className="flex justify-between items-center">
                <span className="text-lg font-medium text-primary">Ganancia:</span>
                <span className={`text-lg font-medium ${netProfit >= 0 ? 'text-green-700' : 'text-red-700'}`}>
                  S/ {netProfit.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Planning Metrics Group */}
          <div className="grid grid-cols-1 gap-3">
            <div className="rounded-lg bg-blue-50 p-4 border border-blue-100 shadow-sm">
              <div className="flex justify-between items-center">
                <span className="text-lg font-medium text-primary">Costo/Persona:</span>
                <span className="text-lg font-medium text-blue-700">S/ {perPersonCost.toFixed(2)}</span>
              </div>
            </div>
            
            <div className="rounded-lg bg-gray-50 p-4 border border-gray-200 shadow-sm">
              <div className="flex justify-between items-center">
                <span className="text-lg font-medium text-primary">Punto Equilibrio:</span>
                <span className="text-lg font-medium text-gray-900">{breakEvenAttendees} personas</span>
              </div>
            </div>
            
            <div className="rounded-lg bg-blue-50 p-4 border border-blue-100 shadow-sm">
              <div className="flex justify-between items-center">
                <span className="text-lg font-medium text-primary">Entrada Mínima:</span>
                <span className="text-lg font-medium text-blue-700">S/ {recommendedTicketPrice}</span>
              </div>
            </div>
          </div>
        </div>
        
        {!isViable && (
          <div className="bg-red-500 text-white rounded-lg p-4 shadow-md">
            <div className="flex items-start">
              <AlertCircle className="w-6 h-6 mr-3 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium text-lg">¡Fiesta No Viable Financieramente!</p>
                <p className="mt-1">
                  Aumenta el precio de entrada a al menos S/ {recommendedTicketPrice} para ser rentable.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };
  
  // Custom active shape for pie chart with better hover effect
  const renderActiveShape: any = (props: PieChartActiveShapeProps) => {
    const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill } = props;
    
    return (
      <g>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius + 6}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
        />
        <Sector
          cx={cx}
          cy={cy}
          startAngle={startAngle}
          endAngle={endAngle}
          innerRadius={outerRadius + 6}
          outerRadius={outerRadius + 10}
          fill={fill}
        />
      </g>
    );
  };
  
  // Enhanced custom tooltip for pie chart
  const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      const totalValue = costBreakdown.reduce((sum, item) => sum + item.value, 0);
      const percentage = ((data.value / totalValue) * 100).toFixed(1);
      
      return (
        <div className="bg-white p-3 border border-gray-200 shadow-lg rounded-md">
          <p className="font-medium text-primary">{data.name}</p>
          <p className="text-primary">
            <span className="font-medium">S/ {data.value.toFixed(2)}</span>
          </p>
          <p className="text-gray-600 text-sm">{percentage}% del total</p>
        </div>
      );
    }
    return null;
  };
  
  // Custom label renderer for pie chart (outside labels with lines)
  const renderCustomizedLabel = (props: PieChartCustomizedLabelProps) => {
    const { cx, cy, midAngle, innerRadius, outerRadius, percent, index, name, value } = props;
    const RADIAN = Math.PI / 180;
    // Position the label further from the pie
    const radius = outerRadius * 1.25;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    
    // For labels on the left side, align right, and for right side, align left
    const textAnchor = x > cx ? 'start' : 'end';
    
    // Line from pie to label
    const lineEnd = {
      x: cx + (outerRadius + 10) * Math.cos(-midAngle * RADIAN),
      y: cy + (outerRadius + 10) * Math.sin(-midAngle * RADIAN),
    };
    
    return (
      <g>
        {/* Line from pie to label */}
        <path 
          d={`M${cx + outerRadius * Math.cos(-midAngle * RADIAN)},${cy + outerRadius * Math.sin(-midAngle * RADIAN)}L${lineEnd.x},${lineEnd.y}L${x},${y}`} 
          stroke={COLORS[index % COLORS.length]}
          fill="none"
        />
        
        {/* Label text */}
        <text 
          x={x}
          y={y} 
          textAnchor={textAnchor} 
          fill={COLORS[index % COLORS.length]}
          dominantBaseline="central"
          className="text-xs font-medium"
        >
          {name} (S/ {value.toFixed(0)})
        </text>
      </g>
    );
  };
  
  // Improved cost breakdown chart
  const renderCostBreakdown = () => {
    // Calculate total for percentages
    const total = costBreakdown.reduce((sum, item) => sum + item.value, 0);
    
    // Prepare data with percentages
    const chartData = costBreakdown.map((item, index) => ({
      ...item,
      color: COLORS[index % COLORS.length],
      percent: item.value / total
    }));
    
    const onPieEnter = (_: any, index: number) => {
      setActiveIndex(index);
    };
    
    const onPieLeave = () => {
      setActiveIndex(null);
    };
    
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <h3 className="text-lg font-medium mb-4">Desglose de Costos</h3>
        
        <div className="w-full h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                activeIndex={activeIndex !== null ? [activeIndex] : []}
                activeShape={renderActiveShape}
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={2}
                dataKey="value"
                labelLine={true}
                label={renderCustomizedLabel}
                onMouseEnter={onPieEnter}
                onMouseLeave={onPieLeave}
                isAnimationActive={true}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              
              {/* Center label */}
              <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle">
                <tspan x="50%" dy="-0.5em" fontSize="16" fontWeight="bold">S/ {total.toFixed(0)}</tspan>
                <tspan x="50%" dy="1.5em" fontSize="12" fill="#666">Total</tspan>
              </text>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  };
  
  // Financial overview chart using actual financialOverview data
  const renderFinancialOverview = () => {
    const data = financialOverview.map((item, index) => {
      let color = COLORS[0]; // Use first color for positives
      if (item.name.includes('Costos')) {
        color = COLORS[3]; // Use another color for costs
      } else if (item.name.includes('Beneficio') || item.name.includes('Neto')) {
        color = item.amount >= 0 ? COLORS[2] : COLORS[3]; // Different colors for profit vs loss
      }
      
      return {
        ...item,
        color
      };
    });
    
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <h3 className="text-lg font-medium mb-4">Resumen Financiero</h3>
        
        <div className="w-full h-56">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip
                formatter={(value: number) => [`S/ ${value.toFixed(2)}`, '']}
                cursor={{ fill: 'rgba(0, 0, 0, 0.05)' }}
              />
              <Bar dataKey="amount" radius={[4, 4, 0, 0]}>
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
                <LabelList 
                  dataKey="amount" 
                  position="top" 
                  formatter={(value: number) => `S/ ${value.toFixed(0)}`}
                  style={{ fontSize: '11px', fill: '#666' }} 
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        <div className="mt-2 grid grid-cols-3 gap-2 text-center">
          {data.map((item, index) => (
            <div key={index} className="text-sm">
              <div className="font-medium">{item.name}</div>
              <div className={`${item.amount < 0 ? 'text-red-600' : ''}`}>
                S/ {item.amount < 0 ? `-${Math.abs(item.amount).toFixed(0)}` : item.amount.toFixed(0)}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };
  
  // Status section with actual data and equal card sizes
  const renderStatusSection = () => {
    const totalDrinkRequirement = attendees * drinksPerPerson;
    const totalFoodRequirement = attendees * foodServingsPerPerson;
    
    const StatusRow = ({ title, current, total, isOk }: { title: string, current: number, total: number, isOk: boolean }) => (
      <div className="flex justify-between items-center py-2">
        <span className="text-sm">{title}</span>
        <div className="flex items-center">
          <span className="text-sm text-right w-16">{current}/{total}</span>
          <span className={`ml-2 px-2 py-0.5 text-xs rounded ${isOk ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'} min-w-[48px] text-center`}>
            {isOk ? 'OK' : 'Falta'}
          </span>
        </div>
      </div>
    );

    // Check if everything is balanced (all requirements met)
    const isEverythingBalanced = 
      drinkRequirements.hasEnoughSpirits && 
      drinkRequirements.hasEnoughMixers && 
      drinkRequirements.hasEnoughIce && 
      drinkRequirements.hasEnoughSupplies &&
      foodRequirements.hasEnoughMeat &&
      foodRequirements.hasEnoughSides &&
      foodRequirements.hasEnoughCondiments;
    
    // Calculate percentages for recommendation bars
    const ticketPricePercentage = Math.min(100, Math.max(0, (ticketPrice / recommendedTicketPrice) * 100));
    const attendancePercentage = Math.min(100, Math.max(0, (attendees / breakEvenAttendees) * 100));
    
    // For overall viability, calculate a more nuanced percentage based on multiple factors
    const viabilityFactors = [
      ticketPrice >= recommendedTicketPrice ? 1 : 0,
      attendees >= breakEvenAttendees ? 1 : 0,
      isEverythingBalanced ? 1 : 0
    ];
    
    const viabilityPercentage = (viabilityFactors.reduce((a, b) => a + b, 0) / viabilityFactors.length) * 100;
    
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-center mb-4">
          <Info className="w-5 h-5 text-blue-600 mr-2" />
          <h2 className="text-base font-medium text-primary">Estado General</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Drinks Status */}
          <div className="rounded overflow-hidden border border-gray-200">
            <div className="bg-blue-500 text-white px-3 py-2 flex items-center">
              <Wine className="w-4 h-4 mr-2" />
              <span className="font-medium">Estado de Bebidas</span>
            </div>
            <div className="p-3">
              <StatusRow 
                title="Licores" 
                current={getCategoryServings('spirits')} 
                total={totalDrinkRequirement} 
                isOk={drinkRequirements.hasEnoughSpirits} 
              />
              <StatusRow 
                title="Mezcladores" 
                current={getCategoryServings('mixers')} 
                total={totalDrinkRequirement} 
                isOk={drinkRequirements.hasEnoughMixers} 
              />
              <StatusRow 
                title="Hielo" 
                current={getCategoryServings('ice')} 
                total={totalDrinkRequirement} 
                isOk={drinkRequirements.hasEnoughIce} 
              />
              <StatusRow 
                title="Suministros" 
                current={getCategoryServings('supplies')} 
                total={totalDrinkRequirement} 
                isOk={drinkRequirements.hasEnoughSupplies} 
              />
            </div>
          </div>
          
          {/* Food Status */}
          <div className="rounded overflow-hidden border border-gray-200">
            <div className="bg-amber-500 text-white px-3 py-2 flex items-center">
              <Utensils className="w-4 h-4 mr-2" />
              <span className="font-medium">Estado de Comida</span>
            </div>
            <div className="p-3">
              <StatusRow 
                title="Carnes" 
                current={getCategoryServings('meat')} 
                total={totalFoodRequirement} 
                isOk={foodRequirements.hasEnoughMeat} 
              />
              <StatusRow 
                title="Guarniciones" 
                current={getCategoryServings('sides')} 
                total={totalFoodRequirement} 
                isOk={foodRequirements.hasEnoughSides} 
              />
              <StatusRow 
                title="Condimentos" 
                current={getCategoryServings('condiments')} 
                total={totalFoodRequirement} 
                isOk={foodRequirements.hasEnoughCondiments} 
              />
            </div>
          </div>
          
          {/* Recommendations - enhanced with better visualizations */}
          <div className="rounded overflow-hidden border border-gray-200 md:col-span-1">
            <div className="bg-blue-500 text-white px-3 py-2 flex items-center">
              <Calendar className="w-4 h-4 mr-2" />
              <span className="font-medium">Recomendaciones</span>
            </div>
            <div className="p-3">
              <div className="mb-3">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-600">Precio de Entrada</span>
                  <span className={ticketPrice >= recommendedTicketPrice ? "text-green-600" : "text-red-600"}>
                    {ticketPrice >= recommendedTicketPrice ? "Bueno" : "Muy bajo"}
                  </span>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="bg-red-500" 
                    style={{ width: `${ticketPricePercentage}%`, height: '100%' }}
                  ></div>
                </div>
              </div>
              
              <div className="mb-3">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-600">Asistencia</span>
                  <span className={attendees >= breakEvenAttendees ? "text-green-600" : "text-yellow-600"}>
                    {attendees >= breakEvenAttendees ? "Suficiente" : "Insuficiente"}
                  </span>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="bg-yellow-500" 
                    style={{ width: `${attendancePercentage}%`, height: '100%' }}
                  ></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-600">Viabilidad Global</span>
                  <span className={isViable ? "text-green-600" : "text-red-600"}>
                    {isViable ? "Viable" : "No viable"}
                  </span>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="bg-red-500" 
                    style={{ width: `${viabilityPercentage}%`, height: '100%' }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {renderBasicParameters()}
        {renderFinancialSummary()}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {renderCostBreakdown()}
        {renderFinancialOverview()}
      </div>
      
      {renderStatusSection()}
    </div>
  );
};

export default OverviewTab;