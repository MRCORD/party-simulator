import React from 'react';
import { Wine } from 'lucide-react';
import StatusBar from './StatusBar';

const DrinksTab = ({
  attendees, drinksPerPerson, 
  shoppingItems, 
  calculateDrinkRequirements,
  getCategoryServings,
  getRecommendedUnits
}) => {
  const drinkRequirements = calculateDrinkRequirements();
  
  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <Wine className="w-5 h-5 mr-2" /> Requerimientos de Bebidas
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
                <span className="text-sm font-medium">Bebidas por persona:</span>
                <span className="text-sm">{drinksPerPerson}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium">Total de bebidas necesarias:</span>
                <span className="text-sm">{drinkRequirements.totalDrinks}</span>
              </div>
            </div>
            
            <h4 className="font-medium mt-4 mb-3">Desglose de Costos</h4>
            <div className="space-y-2">
              <div className="flex justify-between p-2 bg-gray-900 text-white rounded">
                <span className="text-sm font-medium">Licores:</span>
                <span className="text-sm">S/ {drinkRequirements.spiritsCost.toFixed(2)}</span>
              </div>
              <div className="flex justify-between p-2 bg-gray-900 text-white rounded">
                <span className="text-sm font-medium">Mezcladores:</span>
                <span className="text-sm">S/ {drinkRequirements.mixersCost.toFixed(2)}</span>
              </div>
              <div className="flex justify-between p-2 bg-gray-900 text-white rounded">
                <span className="text-sm font-medium">Hielo:</span>
                <span className="text-sm">S/ {drinkRequirements.iceCost.toFixed(2)}</span>
              </div>
              <div className="flex justify-between p-2 bg-gray-900 text-white rounded">
                <span className="text-sm font-medium">Suministros:</span>
                <span className="text-sm">S/ {drinkRequirements.suppliesCost.toFixed(2)}</span>
              </div>
              <div className="flex justify-between p-2 bg-blue-50 rounded font-medium">
                <span>Costo Total de Bebidas:</span>
                <span>S/ {drinkRequirements.totalCost.toFixed(2)}</span>
              </div>
              <div className="flex justify-between p-2 bg-yellow-50 rounded">
                <span className="text-sm font-medium">Costo por persona:</span>
                <span className="text-sm">S/ {(drinkRequirements.totalCost / attendees).toFixed(2)}</span>
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="font-medium mb-3">Estado del Inventario</h4>
            
            <StatusBar 
              title="Licores" 
              isEnough={drinkRequirements.hasEnoughSpirits}
              currentAmount={getCategoryServings('spirits')}
              requiredAmount={drinkRequirements.totalDrinks}
            />
            
            <StatusBar 
              title="Mezcladores" 
              isEnough={drinkRequirements.hasEnoughMixers}
              currentAmount={getCategoryServings('mixers')}
              requiredAmount={drinkRequirements.totalDrinks}
            />
            
            <StatusBar 
              title="Hielo" 
              isEnough={drinkRequirements.hasEnoughIce}
              currentAmount={getCategoryServings('ice')}
              requiredAmount={drinkRequirements.totalDrinks}
            />
            
            <StatusBar 
              title="Suministros" 
              isEnough={drinkRequirements.hasEnoughSupplies}
              currentAmount={getCategoryServings('supplies')}
              requiredAmount={drinkRequirements.totalDrinks}
            />
            
            <h4 className="font-medium mt-4 mb-3">Cantidades Recomendadas</h4>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center p-2 bg-blue-50 rounded">
                <span className="text-sm font-medium">Licores:</span>
                <div className="flex items-center">
                  <span className="text-sm font-medium mr-2">
                    {getRecommendedUnits('spirits', drinkRequirements.totalDrinks)} unidades
                  </span>
                  {getRecommendedUnits('spirits', drinkRequirements.totalDrinks) > shoppingItems
                    .filter(i => i.category === 'spirits')
                    .reduce((sum, i) => sum + i.units, 0) && (
                    <span className="text-xs bg-red-100 text-red-800 px-2 py-0.5 rounded">
                      Necesita más
                    </span>
                  )}
                </div>
              </div>
              
              <div className="flex justify-between items-center p-2 bg-blue-50 rounded">
                <span className="text-sm font-medium">Mezcladores:</span>
                <div className="flex items-center">
                  <span className="text-sm font-medium mr-2">
                    {getRecommendedUnits('mixers', drinkRequirements.totalDrinks)} unidades
                  </span>
                  {getRecommendedUnits('mixers', drinkRequirements.totalDrinks) > shoppingItems
                    .filter(i => i.category === 'mixers')
                    .reduce((sum, i) => sum + i.units, 0) && (
                    <span className="text-xs bg-red-100 text-red-800 px-2 py-0.5 rounded">
                      Necesita más
                    </span>
                  )}
                </div>
              </div>
              
              <div className="flex justify-between items-center p-2 bg-blue-50 rounded">
                <span className="text-sm font-medium">Hielo:</span>
                <div className="flex items-center">
                  <span className="text-sm font-medium mr-2">
                    {getRecommendedUnits('ice', drinkRequirements.totalDrinks)} unidades
                  </span>
                  {getRecommendedUnits('ice', drinkRequirements.totalDrinks) > shoppingItems
                    .filter(i => i.category === 'ice')
                    .reduce((sum, i) => sum + i.units, 0) && (
                    <span className="text-xs bg-red-100 text-red-800 px-2 py-0.5 rounded">
                      Necesita más
                    </span>
                  )}
                </div>
              </div>
              
              <div className="flex justify-between items-center p-2 bg-blue-50 rounded">
                <span className="text-sm font-medium">Suministros:</span>
                <div className="flex items-center">
                  <span className="text-sm font-medium mr-2">
                    {getRecommendedUnits('supplies', drinkRequirements.totalDrinks)} unidades
                  </span>
                  {getRecommendedUnits('supplies', drinkRequirements.totalDrinks) > shoppingItems
                    .filter(i => i.category === 'supplies')
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
        <h3 className="text-lg font-semibold mb-4">Cálculos de Bebidas</h3>
        
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-900 text-white">
            <tr>
              <th scope="col" className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider">Artículo</th>
              <th scope="col" className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider">Tamaño</th>
              <th scope="col" className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider">Unidades</th>
              <th scope="col" className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider">Porciones</th>
              <th scope="col" className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider">Precio</th>
              <th scope="col" className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider">Costo Total</th>
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
        <h3 className="text-lg font-semibold mb-4">Consejos para Planificar Bebidas</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <h4 className="font-medium text-gray-800">Opciones de Servicio</h4>
            <ul className="list-disc pl-5 space-y-1 text-sm">
              <li>Instalar una estación de bebidas autoservicio para reducir trabajo</li>
              <li>Preparar cócteles por lote para ahorrar tiempo y asegurar consistencia</li>
              <li>Usar dispensadores para mezcladores comunes</li>
              <li>Considerar contratar un bartender si el presupuesto lo permite</li>
            </ul>
          </div>
          
          <div className="space-y-2">
            <h4 className="font-medium text-gray-800">Ideas para Ahorrar Costos</h4>
            <ul className="list-disc pl-5 space-y-1 text-sm">
              <li>Comprar licores en botellas más grandes para mejor valor</li>
              <li>Usar marcas económicas en lugar de marcas premium</li>
              <li>Pedir a los invitados que traigan sus licores preferidos (BYOB)</li>
              <li>Ofrecer un cóctel de la casa en lugar de un bar completo</li>
              <li>Comprar hielo el día del evento para evitar que se derrita</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DrinksTab;