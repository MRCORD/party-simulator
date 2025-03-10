import React from 'react';
import { Users, DollarSign, CheckCircle, AlertCircle, Percent, Wine, Utensils, TrendingUp, ChevronUp, ChevronDown, Droplets, Flame } from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import StatusItem from './StatusItem';

const OverviewTab = ({
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
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 transition-transform hover:scale-[1.01]">
          <h3 className="text-xl font-bold mb-4 flex items-center text-indigo-800">
            <Users className="w-5 h-5 mr-2 text-indigo-600" /> Parámetros Básicos
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-1">
              <label className="block text-base font-medium text-gray-700">Asistentes</label>
              <div className="relative">
                <input
                  type="number"
                  className="block w-full rounded-lg border-gray-300 shadow-sm p-3 pr-16 border focus:border-indigo-500 focus:ring focus:ring-indigo-200 text-lg"
                  value={attendees}
                  onChange={(e) => setAttendees(parseInt(e.target.value) || 1)}
                  min="1"
                />
                <div className="absolute right-0 top-0 h-full flex flex-col">
                  <button 
                    className="flex-1 px-3 bg-gray-100 hover:bg-gray-200 border-l border-t border-r border-gray-300 rounded-tr-lg"
                    onClick={() => setAttendees(prev => prev + 1)}
                  >
                    <ChevronUp size={16} />
                  </button>
                  <button 
                    className="flex-1 px-3 bg-gray-100 hover:bg-gray-200 border-l border-b border-r border-gray-300 rounded-br-lg"
                    onClick={() => setAttendees(prev => Math.max(1, prev - 1))}
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
                  className="block w-full rounded-lg border-gray-300 shadow-sm p-3 pl-8 border focus:border-indigo-500 focus:ring focus:ring-indigo-200 text-lg"
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
                  onClick={() => setDrinksPerPerson(prev => Math.max(1, prev - 1))}
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
                  onClick={() => setDrinksPerPerson(prev => prev + 1)}
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
                  onClick={() => setFoodServingsPerPerson(prev => Math.max(1, prev - 1))}
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
                  onClick={() => setFoodServingsPerPerson(prev => prev + 1)}
                >
                  +
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 transition-transform hover:scale-[1.01]">
          <h3 className="text-xl font-bold mb-4 flex items-center text-indigo-800">
            <DollarSign className="w-5 h-5 mr-2 text-green-600" /> Resumen Financiero
          </h3>
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
          
          <div className={`mt-4 p-4 rounded-xl ${isViable ? 'bg-gradient-to-r from-green-500 to-emerald-600' : 'bg-gradient-to-r from-red-500 to-pink-600'} shadow-md transition-all duration-300 ease-in-out`}>
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
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
          <h3 className="text-xl font-bold mb-4 text-indigo-800">Desglose de Costos</h3>
          <div className="h-72">
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
                <Tooltip formatter={(value) => [`S/ ${value.toFixed(2)}`, 'Costo']} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
          <h3 className="text-xl font-bold mb-4 text-indigo-800">Resumen Financiero</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={financialOverview}>
                <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => [`S/ ${value.toFixed(2)}`, '']} />
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
          </div>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
        <h3 className="text-xl font-bold mb-4 flex items-center text-indigo-800">
          <CheckCircle className="w-5 h-5 mr-2 text-indigo-600" /> Estado General
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-indigo-50 p-4 rounded-xl">
            <h4 className="font-bold mb-3 flex items-center text-indigo-800">
              <Wine className="w-5 h-5 mr-2 text-indigo-600" /> Estado de Bebidas
            </h4>
            <div className="space-y-4">
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
            </div>
          </div>
          
          <div className="bg-amber-50 p-4 rounded-xl">
            <h4 className="font-bold mb-3 flex items-center text-amber-800">
              <Utensils className="w-5 h-5 mr-2 text-amber-600" /> Estado de Comida
            </h4>
            <div className="space-y-4">
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
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-4 rounded-xl">
            <h4 className="font-bold mb-3 flex items-center text-purple-800">
              <TrendingUp className="w-5 h-5 mr-2 text-purple-600" /> Recomendaciones
            </h4>
            <div className="space-y-4">
              <div className={`rounded-xl overflow-hidden shadow-sm border ${ticketPrice >= recommendedTicketPrice ? 'border-green-200' : 'border-yellow-200'}`}>
                <div className={`p-3 ${ticketPrice >= recommendedTicketPrice ? 'bg-green-500 text-white' : 'bg-yellow-500 text-white'}`}>
                  <div className="font-medium">Precio de Entrada</div>
                </div>
                <div className={`p-3 ${ticketPrice >= recommendedTicketPrice ? 'bg-green-50' : 'bg-yellow-50'}`}>
                  {ticketPrice < recommendedTicketPrice 
                    ? <div className="flex items-center text-yellow-800"><AlertCircle size={16} className="mr-1" /> Aumentar a S/{recommendedTicketPrice}</div>
                    : <div className="flex items-center text-green-800"><CheckCircle size={16} className="mr-1" /> Bueno (S/{ticketPrice})</div>}
                </div>
              </div>
              
              <div className={`rounded-xl overflow-hidden shadow-sm border ${attendees >= breakEvenAttendees ? 'border-green-200' : 'border-yellow-200'}`}>
                <div className={`p-3 ${attendees >= breakEvenAttendees ? 'bg-green-500 text-white' : 'bg-yellow-500 text-white'}`}>
                  <div className="font-medium">Asistencia</div>
                </div>
                <div className={`p-3 ${attendees >= breakEvenAttendees ? 'bg-green-50' : 'bg-yellow-50'}`}>
                  {attendees < breakEvenAttendees 
                    ? <div className="flex items-center text-yellow-800">
                        <AlertCircle size={16} className="mr-1" /> Necesita {breakEvenAttendees} ({breakEvenAttendees - attendees} más)
                      </div>
                    : <div className="flex items-center text-green-800">
                        <CheckCircle size={16} className="mr-1" /> Bueno ({attendees})
                      </div>}
                </div>
              </div>
              
              <div className={`rounded-xl overflow-hidden shadow-sm border ${isViable ? 'border-green-200' : 'border-red-200'}`}>
                <div className={`p-3 ${isViable ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
                  <div className="font-medium">Viabilidad Global</div>
                </div>
                <div className={`p-3 ${isViable ? 'bg-green-50' : 'bg-red-50'}`}>
                  {isViable 
                    ? <div className="flex items-center text-green-800">
                        <CheckCircle size={16} className="mr-1" /> Ganancia: S/{netProfit.toFixed(2)}
                      </div> 
                    : <div className="flex items-center text-red-800">
                        <AlertCircle size={16} className="mr-1" /> Pérdida: S/{Math.abs(netProfit).toFixed(2)}
                      </div>}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OverviewTab;