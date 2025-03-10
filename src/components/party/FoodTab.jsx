import React from 'react';
import { Utensils } from 'lucide-react';
import StatusBar from './StatusBar';

const FoodTab = ({
  attendees, foodServingsPerPerson, 
  shoppingItems, 
  calculateFoodRequirements,
  getCategoryServings,
  getRecommendedUnits
}) => {
  const foodRequirements = calculateFoodRequirements();
  
  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <Utensils className="w-5 h-5 mr-2" /> Requisitos de Comida
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium mb-3">Información Básica</h4>
            <div className="bg-blue-50 p-4 rounded-md space-y-2">
              <div className="flex justify-between">
                <span className="text-sm font-medium">Asistentes:</span>
                <span className="text-sm">{attendees}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium">Porciones por persona:</span>
                <span className="text-sm">{foodServingsPerPerson}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium">Total de porciones necesarias:</span>
                <span className="text-sm">{foodRequirements.totalServings}</span>
              </div>
            </div>
            
            <h4 className="font-medium mt-4 mb-3">Desglose de Costos</h4>
            <div className="space-y-2">
              <div className="flex justify-between p-2 bg-gray-900 text-white rounded">
                <span className="text-sm font-medium">Carnes:</span>
                <span className="text-sm">S/ {foodRequirements.meatCost.toFixed(2)}</span>
              </div>
              <div className="flex justify-between p-2 bg-gray-900 text-white rounded">
                <span className="text-sm font-medium">Guarniciones:</span>
                <span className="text-sm">S/ {foodRequirements.sidesCost.toFixed(2)}</span>
              </div>
              <div className="flex justify-between p-2 bg-gray-900 text-white rounded">
                <span className="text-sm font-medium">Condimentos:</span>
                <span className="text-sm">S/ {foodRequirements.condimentsCost.toFixed(2)}</span>
              </div>
              <div className="flex justify-between p-2 bg-blue-50 rounded font-medium">
                <span>Costo Total de Comida:</span>
                <span>S/ {foodRequirements.totalCost.toFixed(2)}</span>
              </div>
              <div className="flex justify-between p-2 bg-yellow-50 rounded">
                <span className="text-sm font-medium">Costo por persona:</span>
                <span className="text-sm">S/ {(foodRequirements.totalCost / attendees).toFixed(2)}</span>
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="font-medium mb-3">Estado del Inventario</h4>
            
            <StatusBar 
              title="Carnes" 
              isEnough={foodRequirements.hasEnoughMeat}
              currentAmount={getCategoryServings('meat')}
              requiredAmount={foodRequirements.totalServings}
            />
            
            <StatusBar 
              title="Guarniciones" 
              isEnough={foodRequirements.hasEnoughSides}
              currentAmount={getCategoryServings('sides')}
              requiredAmount={foodRequirements.totalServings}
            />
            
            <StatusBar 
              title="Condimentos" 
              isEnough={foodRequirements.hasEnoughCondiments}
              currentAmount={getCategoryServings('condiments')}
              requiredAmount={foodRequirements.totalServings}
            />
            
            <h4 className="font-medium mt-4 mb-3">Cantidades Recomendadas</h4>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center p-2 bg-blue-50 rounded">
                <span className="text-sm font-medium">Carnes:</span>
                <div className="flex items-center">
                  <span className="text-sm font-medium mr-2">
                    {getRecommendedUnits('meat', foodRequirements.totalServings)} unidades
                  </span>
                  {getRecommendedUnits('meat', foodRequirements.totalServings) > shoppingItems
                    .filter(i => i.category === 'meat')
                    .reduce((sum, i) => sum + i.units, 0) && (
                    <span className="text-xs bg-red-100 text-red-800 px-2 py-0.5 rounded">
                      Necesita más
                    </span>
                  )}
                </div>
              </div>
              
              <div className="flex justify-between items-center p-2 bg-blue-50 rounded">
                <span className="text-sm font-medium">Guarniciones:</span>
                <div className="flex items-center">
                  <span className="text-sm font-medium mr-2">
                    {getRecommendedUnits('sides', foodRequirements.totalServings)} unidades
                  </span>
                  {getRecommendedUnits('sides', foodRequirements.totalServings) > shoppingItems
                    .filter(i => i.category === 'sides')
                    .reduce((sum, i) => sum + i.units, 0) && (
                    <span className="text-xs bg-red-100 text-red-800 px-2 py-0.5 rounded">
                      Necesita más
                    </span>
                  )}
                </div>
              </div>
              
              <div className="flex justify-between items-center p-2 bg-blue-50 rounded">
                <span className="text-sm font-medium">Condimentos:</span>
                <div className="flex items-center">
                  <span className="text-sm font-medium mr-2">
                    {getRecommendedUnits('condiments', foodRequirements.totalServings)} unidades
                  </span>
                  {getRecommendedUnits('condiments', foodRequirements.totalServings) > shoppingItems
                    .filter(i => i.category === 'condiments')
                    .reduce((sum, i) => sum + i.units, 0) && (
                    <span className="text-xs bg-red-100 text-red-800 px-2 py-0.5 rounded">
                      Necesita más
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold mb-4">Cálculos de Comida</h3>
        
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-900 text-white">
            <tr>
              <th scope="col" className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider">Artículo</th>
              <th scope="col" className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider">Tamaño</th>
              <th scope="col" className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider">Unidades</th>
              <th scope="col" className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider">Porciones</th>
              <th scope="col" className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider">Costo</th>
              <th scope="col" className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider">Costo Total</th>
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
        <h3 className="text-lg font-semibold mb-4">Consejos para la Parrillada</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <h4 className="font-medium text-gray-800">Logística de Cocina</h4>
            <ul className="list-disc pl-5 space-y-1 text-sm">
              <li>Tener al menos 2 personas manejando la parrilla para fiestas de más de 20 personas</li>
              <li>Preparar la carne con anticipación (marinado, sazonado)</li>
              <li>Cocinar primero los alimentos que requieren más tiempo, luego los más rápidos</li>
              <li>Considerar cocinar algunos alimentos por adelantado y solo terminarlos en la parrilla</li>
              <li>Calcular 45-60 minutos de parrilla activa por cada 20 personas</li>
            </ul>
          </div>
          
          <div className="space-y-2">
            <h4 className="font-medium text-gray-800">Consejos de Selección de Alimentos</h4>
            <ul className="list-disc pl-5 space-y-1 text-sm">
              <li>Elegir alimentos que se puedan preparar con anticipación</li>
              <li>Incluir opciones vegetarianas (brochetas de verduras, maíz, etc.)</li>
              <li>Ofrecer una variedad de proteínas (pollo, res, cerdo)</li>
              <li>Preparar guarniciones simples que no requieran cocción (ensaladas, papas fritas)</li>
              <li>Considerar restricciones dietéticas entre los invitados</li>
              <li>Tener postres preparados que no requieran refrigeración</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FoodTab;