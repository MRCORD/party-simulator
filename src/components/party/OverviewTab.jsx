import React from 'react';
import { Users, DollarSign, CheckCircle, AlertCircle, Percent, Wine, Utensils } from 'lucide-react';
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
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Users className="w-5 h-5 mr-2" /> Parámetros Básicos
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Asistentes</label>
              <input
                type="number"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border focus:border-blue-500 focus:ring focus:ring-blue-200"
                value={attendees}
                onChange={(e) => setAttendees(parseInt(e.target.value) || 1)}
                min="1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Precio de Entrada (S/)</label>
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
              <label className="block text-sm font-medium text-gray-700">Bebidas por Persona</label>
              <input
                type="number"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border focus:border-blue-500 focus:ring focus:ring-blue-200"
                value={drinksPerPerson}
                onChange={(e) => setDrinksPerPerson(parseInt(e.target.value) || 1)}
                min="1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Porciones/Persona</label>
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
            <DollarSign className="w-5 h-5 mr-2" /> Resumen Financiero
          </h3>
          <div className="grid grid-cols-2 gap-2">
            <div className="text-sm font-medium text-gray-700">Ingresos Totales:</div>
            <div className="text-sm font-semibold">S/ {totalRevenue.toFixed(2)}</div>
            
            <div className="text-sm font-medium text-gray-700">Costos Totales:</div>
            <div className="text-sm font-semibold">S/ {totalCosts.toFixed(2)}</div>
            
            <div className="text-sm font-medium text-gray-700">Ganancia/Pérdida Neta:</div>
            <div className={`text-sm font-semibold ${netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              S/ {netProfit.toFixed(2)}
            </div>
            
            <div className="text-sm font-medium text-gray-700">Costo por Persona:</div>
            <div className="text-sm font-semibold">S/ {perPersonCost.toFixed(2)}</div>
            
            <div className="text-sm font-medium text-gray-700">Asistentes para Equilibrio:</div>
            <div className="text-sm font-semibold">{breakEvenAttendees}</div>
            
            <div className="text-sm font-medium text-gray-700">Entrada Recomendada:</div>
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
                {isViable ? 'La Fiesta es Financieramente Viable' : 'La Fiesta No es Financieramente Viable'}
              </span>
            </div>
            <p className={`text-sm mt-1 ${isViable ? 'text-green-700' : 'text-red-700'}`}>
              {isViable
                ? `Tu fiesta generará una ganancia de S/ ${netProfit.toFixed(2)}.`
                : `Aumenta el precio de entrada a al menos S/ ${recommendedTicketPrice} o añade ${Math.max(0, breakEvenAttendees - attendees)} asistentes más para llegar al punto de equilibrio.`}
            </p>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold mb-4">Desglose de Costos</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={costBreakdown.map(item => ({
                  ...item, 
                  name: item.name === 'Venue' ? 'Local' : 
                         item.name === 'Drinks' ? 'Bebidas' :
                         item.name === 'Food' ? 'Comida' :
                         item.name === 'Miscellaneous' ? 'Misceláneos' : item.name
                }))}
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
              <Tooltip formatter={(value) => [`S/ ${value.toFixed(2)}`, 'Costo']} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold mb-4">Resumen Financiero</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={financialOverview.map(item => ({
              ...item, 
              name: item.name === 'Total Revenue' ? 'Ingresos Totales' : 
                     item.name === 'Total Costs' ? 'Costos Totales' :
                     item.name === 'Net Profit' ? 'Beneficio Neto' : item.name
            }))}>
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
          <CheckCircle className="w-5 h-5 mr-2" /> Resumen de Estado
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h4 className="font-medium mb-2 flex items-center">
              <Wine className="w-4 h-4 mr-1" /> Estado de Bebidas
            </h4>
            <div className="space-y-2">
              <StatusItem 
                title="Licores" 
                isEnough={calculateDrinkRequirements().hasEnoughSpirits}
                currentAmount={getCategoryServings('spirits')}
                requiredAmount={attendees * drinksPerPerson}
              />
              <StatusItem 
                title="Mezcladores" 
                isEnough={calculateDrinkRequirements().hasEnoughMixers}
                currentAmount={getCategoryServings('mixers')}
                requiredAmount={attendees * drinksPerPerson}
              />
              <StatusItem 
                title="Hielo" 
                isEnough={calculateDrinkRequirements().hasEnoughIce}
                currentAmount={getCategoryServings('ice')}
                requiredAmount={attendees * drinksPerPerson}
              />
              <StatusItem 
                title="Suministros" 
                isEnough={calculateDrinkRequirements().hasEnoughSupplies}
                currentAmount={getCategoryServings('supplies')}
                requiredAmount={attendees * drinksPerPerson}
              />
            </div>
          </div>
          
          <div>
            <h4 className="font-medium mb-2 flex items-center">
              <Utensils className="w-4 h-4 mr-1" /> Estado de Comida
            </h4>
            <div className="space-y-2">
              <StatusItem 
                title="Carne" 
                isEnough={calculateFoodRequirements().hasEnoughMeat}
                currentAmount={getCategoryServings('meat')}
                requiredAmount={attendees * foodServingsPerPerson}
              />
              <StatusItem 
                title="Acompañamientos" 
                isEnough={calculateFoodRequirements().hasEnoughSides}
                currentAmount={getCategoryServings('sides')}
                requiredAmount={attendees * foodServingsPerPerson}
              />
              <StatusItem 
                title="Condimentos" 
                isEnough={calculateFoodRequirements().hasEnoughCondiments}
                currentAmount={getCategoryServings('condiments')}
                requiredAmount={attendees * foodServingsPerPerson}
              />
            </div>
          </div>
          
          <div>
            <h4 className="font-medium mb-2 flex items-center">
              <Percent className="w-4 h-4 mr-1" /> Recomendaciones
            </h4>
            <div className="space-y-2">
              <div className={`text-sm p-2 rounded ${ticketPrice >= recommendedTicketPrice ? 'bg-green-50' : 'bg-yellow-50'}`}>
                <div className="font-medium">Precio de Entrada</div>
                <div className="text-xs">
                  {ticketPrice < recommendedTicketPrice 
                    ? `Aumentar a S/${recommendedTicketPrice}` 
                    : `Bueno (S/${ticketPrice})`}
                </div>
              </div>
              
              <div className={`text-sm p-2 rounded ${attendees >= breakEvenAttendees ? 'bg-green-50' : 'bg-yellow-50'}`}>
                <div className="font-medium">Asistencia</div>
                <div className="text-xs">
                  {attendees < breakEvenAttendees 
                    ? `Necesita ${breakEvenAttendees} (${breakEvenAttendees - attendees} más)` 
                    : `Bueno (${attendees})`}
                </div>
              </div>
              
              <div className={`text-sm p-2 rounded ${isViable ? 'bg-green-50' : 'bg-red-50'}`}>
                <div className="font-medium">General</div>
                <div className="text-xs">
                  {isViable 
                    ? `Ganancia: S/${netProfit.toFixed(2)}` 
                    : `Pérdida: S/${Math.abs(netProfit).toFixed(2)}`}
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