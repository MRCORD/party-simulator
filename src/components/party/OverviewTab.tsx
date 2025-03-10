"use client";

import React, { useEffect } from 'react';
import { 
  Users, DollarSign, CheckCircle, AlertCircle, Percent, 
  Wine, Utensils, TrendingUp, ChevronUp, ChevronDown, 
  Droplets, Flame, Sparkles
} from 'lucide-react';
import { 
  PieChart, Pie, Cell, Tooltip, BarChart, Bar, 
  XAxis, YAxis, CartesianGrid, ResponsiveContainer,
  Label, LabelList
} from 'recharts';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import StatusItem from './StatusItem';
import { useTheme } from '@/components/ui/ThemeProvider';
import StatusCard from '@/components/ui/StatusCard';

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
}

interface FoodRequirements {
  hasEnoughMeat: boolean;
  hasEnoughSides: boolean;
  hasEnoughCondiments: boolean;
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
  const theme = useTheme();
  
  // Helper functions to handle state updates
  const incrementAttendees = () => setAttendees(attendees + 1);
  const decrementAttendees = () => setAttendees(Math.max(1, attendees - 1));
  const incrementDrinksPerPerson = () => setDrinksPerPerson(drinksPerPerson + 1);
  const decrementDrinksPerPerson = () => setDrinksPerPerson(Math.max(1, drinksPerPerson - 1));
  const incrementFoodServings = () => setFoodServingsPerPerson(foodServingsPerPerson + 1);
  const decrementFoodServings = () => setFoodServingsPerPerson(Math.max(1, foodServingsPerPerson - 1));
  
  // Custom pie chart renderization for animation
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }: any) => {
    const RADIAN = Math.PI / 180;
    const radius = outerRadius * 1.1;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
  
    return (
      <text 
        x={x} 
        y={y} 
        fill={COLORS[index % COLORS.length]}
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        className="text-xs font-medium"
      >
        {costBreakdown[index].name} ({`${(percent * 100).toFixed(0)}%`})
      </text>
    );
  };
  
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-slate-200 rounded-lg shadow-lg">
          <p className="font-medium text-slate-900">{payload[0].name}</p>
          <p className="text-primary-dark">
            <span className="font-bold">S/ {payload[0].value.toFixed(2)}</span>
          </p>
          <p className="text-xs text-slate-500">
            {(payload[0].payload.percent * 100).toFixed(1)}% del total
          </p>
        </div>
      );
    }
    return null;
  };
  
  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card hover variant="default">
          <Card.Header 
            title="Parámetros Básicos"
            icon={<Users className="w-5 h-5 text-primary" />}
            gradient
          />
          <Card.Content>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-1 group">
                <label className="block text-base font-medium text-slate-700 group-hover:text-primary transition-colors">Asistentes</label>
                <div className="relative">
                  <input
                    type="number"
                    className="block w-full rounded-lg border-slate-300 shadow-sm p-3 pr-16 border focus:border-primary focus:ring-2 focus:ring-primary/20 text-lg transition-all duration-300"
                    value={attendees}
                    onChange={(e) => setAttendees(parseInt(e.target.value) || 1)}
                    min="1"
                  />
                  <div className="absolute right-0 top-0 h-full flex flex-col">
                    <button 
                      className="flex-1 px-3 bg-slate-100 hover:bg-slate-200 hover:text-primary border-l border-t border-r border-slate-300 rounded-tr-lg transition-colors"
                      onClick={incrementAttendees}
                    >
                      <ChevronUp size={16} />
                    </button>
                    <button 
                      className="flex-1 px-3 bg-slate-100 hover:bg-slate-200 hover:text-primary border-l border-b border-r border-slate-300 rounded-br-lg transition-colors"
                      onClick={decrementAttendees}
                    >
                      <ChevronDown size={16} />
                    </button>
                  </div>
                </div>
              </div>
              <div className="space-y-1 group">
                <label className="block text-base font-medium text-slate-700 group-hover:text-primary transition-colors">Precio de Entrada (S/)</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500 group-hover:text-primary transition-colors">S/</span>
                  <input
                    type="number"
                    className="block w-full rounded-lg border-slate-300 shadow-sm p-3 pl-8 border focus:border-primary focus:ring-2 focus:ring-primary/20 text-lg transition-all duration-300"
                    value={ticketPrice}
                    onChange={(e) => setTicketPrice(parseFloat(e.target.value) || 0)}
                    min="0"
                    step="1"
                  />
                </div>
              </div>
              <div className="space-y-1 group">
                <label className="block text-base font-medium text-slate-700 group-hover:text-primary transition-colors flex items-center">
                  <Wine className="w-4 h-4 mr-1 text-primary" /> Bebidas por Persona
                </label>
                <div className="flex rounded-lg shadow-sm border border-slate-300 overflow-hidden group-hover:border-primary transition-colors">
                  <button 
                    className="px-4 bg-slate-100 hover:bg-slate-200 hover:text-primary text-slate-700 border-r border-slate-300 flex items-center justify-center transition-colors"
                    onClick={decrementDrinksPerPerson}
                  >
                    -
                  </button>
                  <input
                    type="number"
                    className="flex-1 p-3 border-0 focus:ring-0 text-center text-lg"
                    value={drinksPerPerson}
                    onChange={(e) => setDrinksPerPerson(parseInt(e.target.value) || 1)}
                    min="1"
                  />
                  <button 
                    className="px-4 bg-slate-100 hover:bg-slate-200 hover:text-primary text-slate-700 border-l border-slate-300 flex items-center justify-center transition-colors"
                    onClick={incrementDrinksPerPerson}
                  >
                    +
                  </button>
                </div>
              </div>
              <div className="space-y-1 group">
                <label className="block text-base font-medium text-slate-700 group-hover:text-primary transition-colors flex items-center">
                  <Utensils className="w-4 h-4 mr-1 text-primary" /> Porciones/Persona
                </label>
                <div className="flex rounded-lg shadow-sm border border-slate-300 overflow-hidden group-hover:border-primary transition-colors">
                  <button 
                    className="px-4 bg-slate-100 hover:bg-slate-200 hover:text-primary text-slate-700 border-r border-slate-300 flex items-center justify-center transition-colors"
                    onClick={decrementFoodServings}
                  >
                    -
                  </button>
                  <input
                    type="number"
                    className="flex-1 p-3 border-0 focus:ring-0 text-center text-lg"
                    value={foodServingsPerPerson}
                    onChange={(e) => setFoodServingsPerPerson(parseInt(e.target.value) || 1)}
                    min="1"
                  />
                  <button 
                    className="px-4 bg-slate-100 hover:bg-slate-200 hover:text-primary text-slate-700 border-l border-slate-300 flex items-center justify-center transition-colors"
                    onClick={incrementFoodServings}
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          </Card.Content>
        </Card>
        
        <Card hover>
          <Card.Header 
            title="Resumen Financiero"
            icon={<DollarSign className="w-5 h-5 text-success" />}
            gradient
          />
          <Card.Content>
            <div className="grid grid-cols-2 gap-y-3 gap-x-6">
              <div className="flex items-center justify-between bg-success-light p-3 rounded-lg shadow-sm hover:shadow-md transition-all">
                <span className="text-base font-medium text-slate-700 flex items-center">
                  <DollarSign className="w-4 h-4 mr-1 text-success" /> Ingresos:
                </span>
                <span className="text-base font-bold text-success-dark">S/ {totalRevenue.toFixed(2)}</span>
              </div>
              
              <div className="flex items-center justify-between bg-error-light p-3 rounded-lg shadow-sm hover:shadow-md transition-all">
                <span className="text-base font-medium text-slate-700 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1 text-error" /> Costos:
                </span>
                <span className="text-base font-bold text-error-dark">S/ {totalCosts.toFixed(2)}</span>
              </div>
              
              <div className="flex items-center justify-between bg-slate-100 p-3 rounded-lg shadow-sm hover:shadow-md transition-all">
                <span className="text-base font-medium text-slate-700 flex items-center">
                  <Users className="w-4 h-4 mr-1 text-slate-500" /> Punto Equilibrio:
                </span>
                <span className="text-base font-bold text-slate-700">{breakEvenAttendees} personas</span>
              </div>
              
              <div className="flex items-center justify-between bg-primary-light p-3 rounded-lg shadow-sm hover:shadow-md transition-all">
                <span className="text-base font-medium text-slate-700 flex items-center">
                  <Users className="w-4 h-4 mr-1 text-primary" /> Costo/Persona:
                </span>
                <span className="text-base font-bold text-primary-dark">S/ {perPersonCost.toFixed(2)}</span>
              </div>
              
              <div className="flex items-center justify-between bg-primary-light p-3 rounded-lg shadow-sm hover:shadow-md transition-all">
                <span className="text-base font-medium text-slate-700 flex items-center">
                  <Sparkles className="w-4 h-4 mr-1 text-primary" /> Entrada Mínima:
                </span>
                <span className="text-base font-bold text-primary-dark">S/ {recommendedTicketPrice}</span>
              </div>
              
              <div className={`flex items-center justify-between p-3 rounded-lg shadow-sm hover:shadow-md transition-all ${netProfit >= 0 ? 'bg-success-light' : 'bg-error-light'}`}>
                <span className="text-base font-medium text-slate-700 flex items-center">
                  <TrendingUp className="w-4 h-4 mr-1 text-slate-700" /> Ganancia:
                </span>
                <span className={`text-base font-bold ${netProfit >= 0 ? 'text-success-dark' : 'text-error-dark'}`}>
                  S/ {netProfit.toFixed(2)}
                </span>
              </div>
            </div>
            
            <div className="mt-4">
              <Card variant="gradient">
                <Card.Content className={`p-4 rounded-xl ${isViable ? theme.getGradient('success') : theme.getGradient('error')} shadow-md transform hover:scale-[1.02] transition-all duration-300`}>
                  <div className="flex items-center">
                    {isViable ? (
                      <CheckCircle className="w-6 h-6 text-white mr-2" />
                    ) : (
                      <AlertCircle className="w-6 h-6 text-white mr-2" />
                    )}
                    <span className="font-bold text-white text-lg">
                      {isViable ? '¡Fiesta Financieramente Viable!' : '¡Fiesta No Viable Financieramente!'}
                    </span>
                  </div>
                  <p className="text-white text-base mt-2">
                    {isViable
                      ? `Tu fiesta generará una ganancia aproximada de S/ ${netProfit.toFixed(2)}.`
                      : ticketPrice < recommendedTicketPrice 
                        ? `Aumenta el precio de entrada a al menos S/ ${recommendedTicketPrice} para ser rentable.` 
                        : `Necesitas al menos ${Math.max(0, breakEvenAttendees - attendees)} asistentes más para llegar al punto de equilibrio.`}
                  </p>
                </Card.Content>
              </Card>
            </div>
          </Card.Content>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card hover>
          <Card.Header title="Desglose de Costos" gradient icon={<PieChart className="w-5 h-5 text-primary" />} />
          <Card.Content className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={costBreakdown}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={renderCustomizedLabel}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  paddingAngle={4}
                  animationDuration={1500}
                  animationBegin={300}
                  className="hover:opacity-95"
                >
                  {costBreakdown.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={COLORS[index % COLORS.length]} 
                      className="hover:opacity-90 transition-opacity"
                      stroke="#fff"
                      strokeWidth={2}
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </Card.Content>
        </Card>
        
        <Card hover>
          <Card.Header title="Resumen Financiero" gradient icon={<BarChart className="w-5 h-5 text-primary" />} />
          <Card.Content className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={financialOverview}>
                <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
                <XAxis dataKey="name" tick={{ fill: '#64748b' }} />
                <YAxis tick={{ fill: '#64748b' }} />
                <Tooltip 
                  formatter={(value: number) => [`S/ ${value.toFixed(2)}`, '']}
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e2e8f0',
                    borderRadius: '0.375rem',
                    boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
                  }}
                />
                <Bar 
                  dataKey="amount" 
                  radius={[4, 4, 0, 0]}
                  barSize={60}
                  animationDuration={1500}
                  animationBegin={300}
                >
                  {financialOverview.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={index === 0 ? '#2563eb' : index === 1 ? '#f43f5e' : entry.amount >= 0 ? '#10b981' : '#f43f5e'} 
                      className="hover:opacity-90 transition-opacity"
                    />
                  ))}
                  <LabelList 
                    dataKey="amount" 
                    position="top" 
                    formatter={(value: number) => `S/ ${value.toFixed(0)}`}
                    style={{ fill: '#64748b', fontWeight: 'bold', fontSize: '12px' }}
                  />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Card.Content>
        </Card>
      </div>
      
      <Card hover>
        <Card.Header 
          title="Estado General" 
          icon={<CheckCircle className="w-5 h-5 text-primary" />}
          gradient
        />
        <Card.Content>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card variant="accent" accentColor="primary" hover>
              <Card.Header title="Estado de Bebidas" icon={<Wine className="w-5 h-5 text-primary" />} />
              <Card.Content className="space-y-4">
                <StatusItem 
                  title="Licores" 
                  icon={<Wine size={18} />}
                  isEnough={calculateDrinkRequirements().hasEnoughSpirits}
                  currentAmount={getCategoryServings('spirits')}
                  requiredAmount={attendees * drinksPerPerson}
                />
                <StatusItem 
                  title="Mezcladores" 
                  icon={<Droplets size={18} />}
                  isEnough={calculateDrinkRequirements().hasEnoughMixers}
                  currentAmount={getCategoryServings('mixers')}
                  requiredAmount={attendees * drinksPerPerson}
                />
                <StatusItem 
                  title="Hielo" 
                  icon={<Flame size={18} />}
                  isEnough={calculateDrinkRequirements().hasEnoughIce}
                  currentAmount={getCategoryServings('ice')}
                  requiredAmount={attendees * drinksPerPerson}
                />
                <StatusItem 
                  title="Suministros" 
                  icon={<Wine size={18} />}
                  isEnough={calculateDrinkRequirements().hasEnoughSupplies}
                  currentAmount={getCategoryServings('supplies')}
                  requiredAmount={attendees * drinksPerPerson}
                />
              </Card.Content>
            </Card>
            
            <Card variant="accent" accentColor="warning" hover>
              <Card.Header title="Estado de Comida" icon={<Utensils className="w-5 h-5 text-warning" />} />
              <Card.Content className="space-y-4">
                <StatusItem 
                  title="Carne" 
                  icon={<Utensils size={18} />}
                  isEnough={calculateFoodRequirements().hasEnoughMeat}
                  currentAmount={getCategoryServings('meat')}
                  requiredAmount={attendees * foodServingsPerPerson}
                />
                <StatusItem 
                  title="Guarniciones" 
                  icon={<Utensils size={18} />}
                  isEnough={calculateFoodRequirements().hasEnoughSides}
                  currentAmount={getCategoryServings('sides')}
                  requiredAmount={attendees * foodServingsPerPerson}
                />
                <StatusItem 
                  title="Condimentos" 
                  icon={<Utensils size={18} />}
                  isEnough={calculateFoodRequirements().hasEnoughCondiments}
                  currentAmount={getCategoryServings('condiments')}
                  requiredAmount={attendees * foodServingsPerPerson}
                />
              </Card.Content>
            </Card>
            
            <Card variant="gradient" hover>
              <Card.Header title="Recomendaciones" icon={<TrendingUp className="w-5 h-5 text-primary" />} />
              <Card.Content className="space-y-4">
                <StatusCard
                  title="Precio de Entrada"
                  value={`S/ ${ticketPrice}`}
                  status={ticketPrice >= recommendedTicketPrice ? 'active' : 'pending'}
                  trend={ticketPrice >= recommendedTicketPrice ? 0 : ((recommendedTicketPrice - ticketPrice) / ticketPrice * 100)}
                />
                
                <StatusCard
                  title="Asistencia"
                  value={`${attendees} personas`}
                  status={attendees >= breakEvenAttendees ? 'active' : 'pending'}
                  trend={attendees >= breakEvenAttendees ? 0 : ((breakEvenAttendees - attendees) / breakEvenAttendees * 100)}
                />
                
                <StatusCard
                  title="Viabilidad Global"
                  value={isViable ? `Ganancia: S/${netProfit.toFixed(2)}` : `Pérdida: S/${Math.abs(netProfit).toFixed(2)}`}
                  status={isViable ? 'active' : 'error'}
                />
              </Card.Content>
            </Card>
          </div>
        </Card.Content>
      </Card>
    </div>
  );
};

export default OverviewTab;