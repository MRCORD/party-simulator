import React from 'react';
import { Wine, Droplet, Snowflake, Package, CheckCircle, AlertCircle, TrendingUp, Users } from 'lucide-react';
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
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 rounded-xl shadow-lg text-white mb-6">
        <h3 className="text-xl font-bold mb-4 flex items-center">
          <Wine className="w-6 h-6 mr-2" /> Planificación de Bebidas
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center">
            <div className="text-xs uppercase tracking-wide mb-1">Asistentes</div>
            <div className="text-2xl font-bold flex justify-center items-center">
              <Users size={18} className="mr-2 opacity-70" />
              {attendees}
            </div>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center">
            <div className="text-xs uppercase tracking-wide mb-1">Bebidas por Persona</div>
            <div className="text-2xl font-bold flex justify-center items-center">
              <Wine size={18} className="mr-2 opacity-70" />
              {drinksPerPerson}
            </div>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center">
            <div className="text-xs uppercase tracking-wide mb-1">Total Bebidas</div>
            <div className="text-2xl font-bold">{drinkRequirements.totalDrinks}</div>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center">
            <div className="text-xs uppercase tracking-wide mb-1">Costo Total</div>
            <div className="text-2xl font-bold">S/ {drinkRequirements.totalCost.toFixed(2)}</div>
          </div>
        </div>
        <div className="text-sm opacity-80">
          El costo por persona para bebidas es aproximadamente <span className="font-bold text-white">S/ {(drinkRequirements.totalCost / attendees).toFixed(2)}</span>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
          <h3 className="text-xl font-bold mb-4 text-indigo-800">Información Detallada</h3>
          
          <div className="space-y-6">
            <div className="bg-indigo-50 p-4 rounded-lg space-y-3">
              <h4 className="font-bold text-indigo-800 border-b border-indigo-200 pb-2">Requerimientos Básicos</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Asistentes:</span>
                  <span className="font-medium text-indigo-800">{attendees}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Bebidas por persona:</span>
                  <span className="font-medium text-indigo-800">{drinksPerPerson}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Total de bebidas:</span>
                  <span className="font-medium text-indigo-800">{drinkRequirements.totalDrinks}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Costo por persona:</span>
                  <span className="font-medium text-green-600">S/ {(drinkRequirements.totalCost / attendees).toFixed(2)}</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-bold text-indigo-800 border-b border-gray-200 pb-2">Desglose de Costos</h4>
              
              <div className="grid gap-2">
                <div className="flex items-center p-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg">
                  <Wine className="w-5 h-5 mr-3" />
                  <span className="flex-1 font-medium">Licores:</span>
                  <span className="text-white font-bold">S/ {drinkRequirements.spiritsCost.toFixed(2)}</span>
                </div>
                
                <div className="flex items-center p-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg">
                  <Droplet className="w-5 h-5 mr-3" />
                  <span className="flex-1 font-medium">Mezcladores:</span>
                  <span className="text-white font-bold">S/ {drinkRequirements.mixersCost.toFixed(2)}</span>
                </div>
                
                <div className="flex items-center p-3 bg-gradient-to-r from-cyan-600 to-teal-600 text-white rounded-lg">
                  <Snowflake className="w-5 h-5 mr-3" />
                  <span className="flex-1 font-medium">Hielo:</span>
                  <span className="text-white font-bold">S/ {drinkRequirements.iceCost.toFixed(2)}</span>
                </div>
                
                <div className="flex items-center p-3 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-lg">
                  <Package className="w-5 h-5 mr-3" />
                  <span className="flex-1 font-medium">Suministros:</span>
                  <span className="text-white font-bold">S/ {drinkRequirements.suppliesCost.toFixed(2)}</span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-green-100 text-green-800 rounded-lg font-bold">
                  <span>COSTO TOTAL DE BEBIDAS:</span>
                  <span>S/ {drinkRequirements.totalCost.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
          <h3 className="text-xl font-bold mb-4 text-indigo-800">Estado del Inventario</h3>
          
          <div className="space-y-5">
            <StatusBar 
              title="Licores" 
              icon={<Wine className="w-5 h-5 text-purple-600" />}
              isEnough={drinkRequirements.hasEnoughSpirits}
              currentAmount={getCategoryServings('spirits')}
              requiredAmount={drinkRequirements.totalDrinks}
              colorClass="from-purple-600 to-indigo-600"
            />
            
            <StatusBar 
              title="Mezcladores" 
              icon={<Droplet className="w-5 h-5 text-blue-600" />}
              isEnough={drinkRequirements.hasEnoughMixers}
              currentAmount={getCategoryServings('mixers')}
              requiredAmount={drinkRequirements.totalDrinks}
              colorClass="from-blue-600 to-cyan-600"
            />
            
            <StatusBar 
              title="Hielo" 
              icon={<Snowflake className="w-5 h-5 text-cyan-600" />}
              isEnough={drinkRequirements.hasEnoughIce}
              currentAmount={getCategoryServings('ice')}
              requiredAmount={drinkRequirements.totalDrinks}
              colorClass="from-cyan-600 to-teal-600"
            />
            
            <StatusBar 
              title="Suministros" 
              icon={<Package className="w-5 h-5 text-gray-700" />}
              isEnough={drinkRequirements.hasEnoughSupplies}
              currentAmount={getCategoryServings('supplies')}
              requiredAmount={drinkRequirements.totalDrinks}
              colorClass="from-gray-600 to-gray-700"
            />
            
            <h4 className="font-bold text-indigo-800 border-b border-gray-200 pb-2 pt-2">Cantidades Recomendadas</h4>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-indigo-50 rounded-lg overflow-hidden shadow-sm">
                <div className="bg-indigo-600 text-white p-3 font-medium flex items-center">
                  <Wine className="w-4 h-4 mr-2" /> Licores
                </div>
                <div className="p-3">
                  <div className="flex justify-between items-center">
                    <span className="text-indigo-800 font-medium">Unidades necesarias:</span>
                    <div className="flex items-center">
                      <span className="font-bold text-indigo-800">
                        {getRecommendedUnits('spirits', drinkRequirements.totalDrinks)}
                      </span>
                      {getRecommendedUnits('spirits', drinkRequirements.totalDrinks) > shoppingItems
                        .filter(i => i.category === 'spirits')
                        .reduce((sum, i) => sum + i.units, 0) ? (
                        <span className="ml-2 text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full flex items-center">
                          <AlertCircle size={12} className="mr-1" /> Falta
                        </span>
                      ) : (
                        <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full flex items-center">
                          <CheckCircle size={12} className="mr-1" /> Completo
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-blue-50 rounded-lg overflow-hidden shadow-sm">
                <div className="bg-blue-600 text-white p-3 font-medium flex items-center">
                  <Droplet className="w-4 h-4 mr-2" /> Mezcladores
                </div>
                <div className="p-3">
                  <div className="flex justify-between items-center">
                    <span className="text-blue-800 font-medium">Unidades necesarias:</span>
                    <div className="flex items-center">
                      <span className="font-bold text-blue-800">
                        {getRecommendedUnits('mixers', drinkRequirements.totalDrinks)}
                      </span>
                      {getRecommendedUnits('mixers', drinkRequirements.totalDrinks) > shoppingItems
                        .filter(i => i.category === 'mixers')
                        .reduce((sum, i) => sum + i.units, 0) ? (
                        <span className="ml-2 text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full flex items-center">
                          <AlertCircle size={12} className="mr-1" /> Falta
                        </span>
                      ) : (
                        <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full flex items-center">
                          <CheckCircle size={12} className="mr-1" /> Completo
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-cyan-50 rounded-lg overflow-hidden shadow-sm">
                <div className="bg-cyan-600 text-white p-3 font-medium flex items-center">
                  <Snowflake className="w-4 h-4 mr-2" /> Hielo
                </div>
                <div className="p-3">
                  <div className="flex justify-between items-center">
                    <span className="text-cyan-800 font-medium">Unidades necesarias:</span>
                    <div className="flex items-center">
                      <span className="font-bold text-cyan-800">
                        {getRecommendedUnits('ice', drinkRequirements.totalDrinks)}
                      </span>
                      {getRecommendedUnits('ice', drinkRequirements.totalDrinks) > shoppingItems
                        .filter(i => i.category === 'ice')
                        .reduce((sum, i) => sum + i.units, 0) ? (
                        <span className="ml-2 text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full flex items-center">
                          <AlertCircle size={12} className="mr-1" /> Falta
                        </span>
                      ) : (
                        <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full flex items-center">
                          <CheckCircle size={12} className="mr-1" /> Completo
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 rounded-lg overflow-hidden shadow-sm">
                <div className="bg-gray-600 text-white p-3 font-medium flex items-center">
                  <Package className="w-4 h-4 mr-2" /> Suministros
                </div>
                <div className="p-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-800 font-medium">Unidades necesarias:</span>
                    <div className="flex items-center">
                      <span className="font-bold text-gray-800">
                        {getRecommendedUnits('supplies', drinkRequirements.totalDrinks)}
                      </span>
                      {getRecommendedUnits('supplies', drinkRequirements.totalDrinks) > shoppingItems
                        .filter(i => i.category === 'supplies')
                        .reduce((sum, i) => sum + i.units, 0) ? (
                        <span className="ml-2 text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full flex items-center">
                          <AlertCircle size={12} className="mr-1" /> Falta
                        </span>
                      ) : (
                        <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full flex items-center">
                          <CheckCircle size={12} className="mr-1" /> Completo
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
          <h3 className="text-xl font-bold mb-4 text-indigo-800">Detalle de Bebidas</h3>
          
          <div className="overflow-hidden rounded-xl border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
                  <th scope="col" className="px-4 py-3 text-left text-sm font-semibold uppercase tracking-wider">Artículo</th>
                  <th scope="col" className="px-4 py-3 text-left text-sm font-semibold uppercase tracking-wider">Tamaño</th>
                  <th scope="col" className="px-4 py-3 text-left text-sm font-semibold uppercase tracking-wider">Unidades</th>
                  <th scope="col" className="px-4 py-3 text-left text-sm font-semibold uppercase tracking-wider">Porciones</th>
                  <th scope="col" className="px-4 py-3 text-left text-sm font-semibold uppercase tracking-wider">Precio</th>
                  <th scope="col" className="px-4 py-3 text-left text-sm font-semibold uppercase tracking-wider">Costo Total</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {shoppingItems
                  .filter(item => ['spirits', 'mixers', 'ice', 'supplies'].includes(item.category))
                  .map(item => {
                    // Determine background color based on category
                    let bgColorClass = "";
                    switch(item.category) {
                      case 'spirits': bgColorClass = "hover:bg-purple-50"; break;
                      case 'mixers': bgColorClass = "hover:bg-blue-50"; break;
                      case 'ice': bgColorClass = "hover:bg-cyan-50"; break;
                      case 'supplies': bgColorClass = "hover:bg-gray-50"; break;
                      default: bgColorClass = "hover:bg-gray-50";
                    }
                    
                    // Determine icon based on category
                    let icon = null;
                    switch(item.category) {
                      case 'spirits': icon = <Wine className="w-4 h-4 text-purple-600 mr-2" />; break;
                      case 'mixers': icon = <Droplet className="w-4 h-4 text-blue-600 mr-2" />; break;
                      case 'ice': icon = <Snowflake className="w-4 h-4 text-cyan-600 mr-2" />; break;
                      case 'supplies': icon = <Package className="w-4 h-4 text-gray-600 mr-2" />; break;
                    }
                    
                    return (
                      <tr key={item.id} className={`${bgColorClass} transition-colors duration-150`}>
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-800 flex items-center">
                          {icon} {item.name}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{item.size} {item.sizeUnit}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{item.units}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{item.servings * item.units}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">S/ {item.cost.toFixed(2)}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-green-700">S/ {(item.cost * item.units).toFixed(2)}</td>
                      </tr>
                    )
                  })}
              </tbody>
            </table>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
          <h3 className="text-xl font-bold mb-4 flex items-center text-indigo-800">
            <TrendingUp className="w-5 h-5 mr-2 text-indigo-600" /> Consejos para Planificar Bebidas
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-indigo-50 p-5 rounded-lg">
              <h4 className="font-bold text-indigo-800 mb-3 border-b border-indigo-200 pb-2">Opciones de Servicio</h4>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <div className="flex-shrink-0 w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center mr-3 mt-0.5">1</div>
                  <p className="text-gray-800">Instala una estación de bebidas autoservicio para reducir trabajo y mejorar la experiencia</p>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center mr-3 mt-0.5">2</div>
                  <p className="text-gray-800">Prepara cócteles por lote para ahorrar tiempo y asegurar consistencia en el sabor</p>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center mr-3 mt-0.5">3</div>
                  <p className="text-gray-800">Usa dispensadores para mezcladores comunes como gaseosas y jugos</p>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center mr-3 mt-0.5">4</div>
                  <p className="text-gray-800">Considera contratar un bartender si el presupuesto lo permite para una experiencia premium</p>
                </li>
              </ul>
            </div>
            
            <div className="bg-green-50 p-5 rounded-lg">
              <h4 className="font-bold text-green-800 mb-3 border-b border-green-200 pb-2">Ideas para Ahorrar Costos</h4>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <div className="flex-shrink-0 w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center mr-3 mt-0.5">1</div>
                  <p className="text-gray-800">Compra licores en botellas más grandes para mejor valor por mililitro</p>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center mr-3 mt-0.5">2</div>
                  <p className="text-gray-800">Usa marcas económicas para cócteles donde el sabor se mezcla con otros ingredientes</p>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center mr-3 mt-0.5">3</div>
                  <p className="text-gray-800">Pide a los invitados que traigan sus licores preferidos (BYOB) para reducir costos</p>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center mr-3 mt-0.5">4</div>
                  <p className="text-gray-800">Compra hielo el día del evento para evitar que se derrita y ahorrar en cantidad</p>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center mr-3 mt-0.5">5</div>
                  <p className="text-gray-800">Ofrece un cóctel de la casa en lugar de un bar completo para simplificar y reducir costos</p>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DrinksTab;