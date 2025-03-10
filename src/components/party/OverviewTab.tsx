"use client";

import React from 'react';
import { 
  Users, DollarSign, CheckCircle, AlertCircle, Percent, 
  Wine, Utensils, TrendingUp, ChevronUp, ChevronDown, 
  Droplets, Flame
} from 'lucide-react';
import { 
  PieChart, Pie, Cell, Tooltip, BarChart, Bar, 
  XAxis, YAxis, CartesianGrid, ResponsiveContainer 
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
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card hover>
          <Card.Header 
            title="Parámetros Básicos"
            icon={<Users className="w-5 h-5 text-indigo-600" />}
            gradient
          />
          <Card.Content>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-1">
                <label className="block text-base font-medium text-gray-700">Asistentes</label>
                <div className="relative">
                  <input
                    type="number"
                    className={`block w-full rounded-lg border-gray-300 shadow-sm p-3 pr-16 border focus:border-indigo-500 ${theme.getFocusRing()} text-lg`}
                    value={attendees}
                    onChange={(e) => setAttendees(parseInt(e.target.value) || 1)}
                    min="1"
                  />
                  <div className="absolute right-0 top-0 h-full flex flex-col">
                    <button 
                      className="flex-1 px-3 bg-gray-100 hover:bg-gray-200 border-l border-t border-r border-gray-300 rounded-tr-lg"
                      onClick={incrementAttendees}
                    >
                      <ChevronUp size={16} />
                    </button>
                    <button 
                      className="flex-1 px-3 bg-gray-100 hover:bg-gray-200 border-l border-b border-r border-gray-300 rounded-br-lg"
                      onClick={decrementAttendees}
                    >
                      <ChevronDown size={16} />
                    </button>
                  </div>
                </div>
              </div>
              <div className="space-y-1">
                <label className="block text-base font-medium text-gray-700">Precio de Entrada (S/)</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">S/</span>
                  <input
                    type="number"
                    className={`block w-full rounded-lg border-gray-300 shadow-sm p-3 pl-8 border focus:border-indigo-500 ${theme.getFocusRing()} text-lg`}
                    value={ticketPrice}
                    onChange={(e) => setTicketPrice(parseFloat(e.target.value) || 0)}
                    min="0"
                    step="1"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="block text-base font-medium text-gray-700 flex items-center">
                  <Wine className="w-4 h-4 mr-1 text-purple-600" /> Bebidas por Persona
                </label>
                <div className="flex rounded-lg border border-gray-300 overflow-hidden">
                  <button 
                    className="px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 border-r border-gray-300 flex items-center justify-center"
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
                    className="px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 border-l border-gray-300 flex items-center justify-center"
                    onClick={incrementDrinksPerPerson}
                  >
                    +
                  </button>
                </div>
              </div>
              <div className="space-y-1">
                <label className="block text-base font-medium text-gray-700 flex items-center">
                  <Utensils className="w-4 h-4 mr-1 text-orange-600" /> Porciones/Persona
                </label>
                <div className="flex rounded-lg border border-gray-300 overflow-hidden">
                  <button 
                    className="px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 border-r border-gray-300 flex items-center justify-center"
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
                    className="px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 border-l border-gray-300 flex items-center justify-center"
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
            icon={<DollarSign className="w-5 h-5 text-green-600" />}
            gradient
          />
          <Card.Content>
            <div className="grid grid-cols-2 gap-y-3 gap-x-6">
              <div className="flex items-center justify-between bg-green-50 p-2 rounded-lg">
                <span className="text-base font-medium text-gray-700">Ingresos:</span>
                <span className="text-base font-bold text-green-700">S/ {totalRevenue.toFixed(2)}</span>
              </div>
              
              <div className="flex items-center justify-between bg-red-50 p-2 rounded-lg">
                <span className="text-base font-medium text-gray-700">Costos:</span>
                <span className="text-base font-bold text-red-700">S/ {totalCosts.toFixed(2)}</span>
              </div>
              
              <div className="flex items-center justify-between bg-gray-50 p-2 rounded-lg">
                <span className="text-base font-medium text-gray-700">Punto Equilibrio:</span>
                <span className="text-base font-bold text-gray-700">{breakEvenAttendees} personas</span>
              </div>
              
              <div className="flex items-center justify-between bg-blue-50 p-2 rounded-lg">
                <span className="text-base font-medium text-gray-700">Costo/Persona:</span>
                <span className="text-base font-bold text-blue-700">S/ {perPersonCost.toFixed(2)}</span>
              </div>
              
              <div className="flex items-center justify-between bg-purple-50 p-2 rounded-lg">
                <span className="text-base font-medium text-gray-700">Entrada Mínima:</span>
                <span className="text-base font-bold text-purple-700">S/ {recommendedTicketPrice}</span>
              </div>
              
              <div className={`flex items-center justify-between p-2 rounded-lg ${netProfit >= 0 ? 'bg-green-50' : 'bg-red-50'}`}>
                <span className="text-base font-medium text-gray-700">Ganancia:</span>
                <span className={`text-base font-bold ${netProfit >= 0 ? 'text-green-700' : 'text-red-700'}`}>
                  S/ {netProfit.toFixed(2)}
                </span>
              </div>
            </div>
            
            <div className="mt-4">
              <Card variant="gradient">
                <Card.Content className={`p-4 rounded-xl ${isViable ? theme.getGradient('success') : theme.getGradient('error')} shadow-md`}>
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
        <Card>
          <Card.Header title="Desglose de Costos" gradient />
          <Card.Content className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={costBreakdown}
                  cx="50%"
                  cy="50%"
                  labelLine={true}
                  label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  paddingAngle={2}
                >
                  {costBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => [`S/ ${value.toFixed(2)}`, 'Costo']} />
              </PieChart>
            </ResponsiveContainer>
          </Card.Content>
        </Card>
        
        <Card>
          <Card.Header title="Resumen Financiero" gradient />
          <Card.Content className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={financialOverview}>
                <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value: number) => [`S/ ${value.toFixed(2)}`, '']} />
                <Bar 
                  dataKey="amount" 
                  radius={[4, 4, 0, 0]}
                  barSize={60}
                >
                  {financialOverview.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={index === 0 ? '#4F46E5' : index === 1 ? '#EF4444' : entry.amount >= 0 ? '#10B981' : '#F43F5E'} 
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Card.Content>
        </Card>
      </div>
      
      <Card>
        <Card.Header 
          title="Estado General" 
          icon={<CheckCircle className="w-5 h-5 text-indigo-600" />}
          gradient
        />
        <Card.Content>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card variant="accent" accentColor="primary">
              <Card.Header title="Estado de Bebidas" icon={<Wine className="w-5 h-5 text-indigo-600" />} />
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
            
            <Card variant="accent" accentColor="warning">
              <Card.Header title="Estado de Comida" icon={<Utensils className="w-5 h-5 text-amber-600" />} />
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
            
            <Card variant="gradient">
              <Card.Header title="Recomendaciones" icon={<TrendingUp className="w-5 h-5 text-purple-600" />} />
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