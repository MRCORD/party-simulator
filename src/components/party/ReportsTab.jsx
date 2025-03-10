import React from 'react';

const ReportsTab = ({
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
  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold mb-4">Resumen Financiero</h3>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-900 text-white">
              <tr>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">Categoría</th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">Costo (S/)</th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">Por Persona (S/)</th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">% del Total</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-black">Local</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-black">S/ {venueCost.toFixed(2)}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-black">S/ {(venueCost / attendees).toFixed(2)}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-black">{((venueCost / totalCosts) * 100).toFixed(1)}%</td>
              </tr>
              <tr>
                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-black">Bebidas</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-black">S/ {calculateDrinkRequirements().totalCost.toFixed(2)}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-black">S/ {(calculateDrinkRequirements().totalCost / attendees).toFixed(2)}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-black">{((calculateDrinkRequirements().totalCost / totalCosts) * 100).toFixed(1)}%</td>
              </tr>
              <tr>
                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-black">Comida</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-black">S/ {calculateFoodRequirements().totalCost.toFixed(2)}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-black">S/ {(calculateFoodRequirements().totalCost / attendees).toFixed(2)}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-black">{((calculateFoodRequirements().totalCost / totalCosts) * 100).toFixed(1)}%</td>
              </tr>
              <tr>
                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-black">Misceláneos</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-black">S/ {(totalCosts - venueCost - calculateDrinkRequirements().totalCost - calculateFoodRequirements().totalCost).toFixed(2)}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-black">S/ {((totalCosts - venueCost - calculateDrinkRequirements().totalCost - calculateFoodRequirements().totalCost) / attendees).toFixed(2)}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-black">{(((totalCosts - venueCost - calculateDrinkRequirements().totalCost - calculateFoodRequirements().totalCost) / totalCosts) * 100).toFixed(1)}%</td>
              </tr>
              <tr className="bg-gray-900 text-white">
                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">COSTOS TOTALES</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">S/ {totalCosts.toFixed(2)}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">S/ {perPersonCost.toFixed(2)}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">100%</td>
              </tr>
              <tr>
                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-black">INGRESOS TOTALES</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-black">S/ {totalRevenue.toFixed(2)}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-black">S/ {ticketPrice.toFixed(2)}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-black">-</td>
              </tr>
              <tr className={netProfit >= 0 ? 'bg-green-50' : 'bg-red-50'}>
                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-black">BENEFICIO/PÉRDIDA NETA</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-black">S/ {netProfit.toFixed(2)}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-black">S/ {(netProfit / attendees).toFixed(2)}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-black">
                  {netProfit >= 0 ? `${((netProfit / totalRevenue) * 100).toFixed(1)}% margen` : '-'}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold mb-4">Resumen de Lista de Compras</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium mb-3">Bebidas</h4>
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-900 text-white">
                <tr>
                  <th scope="col" className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider">Categoría</th>
                  <th scope="col" className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider">Artículos</th>
                  <th scope="col" className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider">Costo</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr>
                  <td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-black">Licores</td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-black">
                    {shoppingItems.filter(i => i.category === 'spirits').length}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-black">
                    S/ {getCategoryTotal('spirits').toFixed(2)}
                  </td>
                </tr>
                <tr>
                  <td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-black">Mezcladores</td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-black">
                    {shoppingItems.filter(i => i.category === 'mixers').length}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-black">
                    S/ {getCategoryTotal('mixers').toFixed(2)}
                  </td>
                </tr>
                <tr>
                  <td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-black">Hielo</td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-black">
                    {shoppingItems.filter(i => i.category === 'ice').length}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-black">
                    S/ {getCategoryTotal('ice').toFixed(2)}
                  </td>
                </tr>
                <tr>
                  <td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-black">Suministros</td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-black">
                    {shoppingItems.filter(i => i.category === 'supplies').length}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-black">
                    S/ {getCategoryTotal('supplies').toFixed(2)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <div>
            <h4 className="font-medium mb-3">Comida</h4>
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-900 text-white">
                <tr>
                  <th scope="col" className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider">Categoría</th>
                  <th scope="col" className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider">Artículos</th>
                  <th scope="col" className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider">Costo</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr>
                  <td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-black">Carnes</td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-black">
                    {shoppingItems.filter(i => i.category === 'meat').length}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-black">
                    S/ {getCategoryTotal('meat').toFixed(2)}
                  </td>
                </tr>
                <tr>
                  <td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-black">Guarniciones</td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-black">
                    {shoppingItems.filter(i => i.category === 'sides').length}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-black">
                    S/ {getCategoryTotal('sides').toFixed(2)}
                  </td>
                </tr>
                <tr>
                  <td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-black">Condimentos</td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-black">
                    {shoppingItems.filter(i => i.category === 'condiments').length}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-black">
                    S/ {getCategoryTotal('condiments').toFixed(2)}
                  </td>
                </tr>
                <tr>
                  <td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-black">Otros</td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-black">
                    {shoppingItems.filter(i => i.category === 'other').length}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-black">
                    S/ {getCategoryTotal('other').toFixed(2)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold mb-4">Métricas Clave y Recomendaciones</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-4 bg-gray-900 text-white rounded-lg">
            <h4 className="font-medium mb-2">Métricas Financieras</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex justify-between">
                <span>Punto de equilibrio:</span>
                <span className="font-medium">{breakEvenAttendees} asistentes</span>
              </li>
              <li className="flex justify-between">
                <span>Costo por asistente:</span>
                <span className="font-medium">S/ {perPersonCost.toFixed(2)}</span>
              </li>
              <li className="flex justify-between">
                <span>Margen de beneficio:</span>
                <span className={`font-medium ${netProfit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {netProfit >= 0 ? ((netProfit / totalRevenue) * 100).toFixed(1) + '%' : 'N/A'}
                </span>
              </li>
              <li className="flex justify-between">
                <span>Entrada mínima viable:</span>
                <span className="font-medium">S/ {recommendedTicketPrice}</span>
              </li>
            </ul>
          </div>
          
          <div className="p-4 bg-gray-900 text-white rounded-lg">
            <h4 className="font-medium mb-2">Métricas del Evento</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex justify-between">
                <span>Bebidas por persona:</span>
                <span className="font-medium">{drinksPerPerson}</span>
              </li>
              <li className="flex justify-between">
                <span>Porciones de comida por persona:</span>
                <span className="font-medium">{foodServingsPerPerson}</span>
              </li>
              <li className="flex justify-between">
                <span>Total bebidas necesarias:</span>
                <span className="font-medium">{attendees * drinksPerPerson}</span>
              </li>
              <li className="flex justify-between">
                <span>Total porciones de comida necesarias:</span>
                <span className="font-medium">{attendees * foodServingsPerPerson}</span>
              </li>
            </ul>
          </div>
          
          <div className="p-4 bg-gray-900 text-white rounded-lg">
            <h4 className="font-medium mb-2">Recomendaciones</h4>
            <ul className="space-y-2 text-sm">
              <li className={`flex justify-between ${ticketPrice >= recommendedTicketPrice ? 'text-green-400' : 'text-red-400'}`}>
                <span>Precio de Entrada:</span>
                <span className="font-medium">
                  {ticketPrice >= recommendedTicketPrice ? 'Bueno' : `Aumentar a S/${recommendedTicketPrice}`}
                </span>
              </li>
              <li className={`flex justify-between ${attendees >= breakEvenAttendees ? 'text-green-400' : 'text-red-400'}`}>
                <span>Asistencia:</span>
                <span className="font-medium">
                  {attendees >= breakEvenAttendees ? 'Bueno' : `Necesita ${breakEvenAttendees - attendees} más`}
                </span>
              </li>
              <li className={`flex justify-between ${isViable ? 'text-green-400' : 'text-red-400'}`}>
                <span>Viabilidad general:</span>
                <span className="font-medium">
                  {isViable ? 'Viable' : 'No viable'}
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsTab;