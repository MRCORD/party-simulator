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
        <h3 className="text-lg font-semibold mb-4">Financial Summary</h3>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-900 text-white">
              <tr>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">Category</th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">Cost (S/)</th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">Per Person (S/)</th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">% of Total</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">Venue</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">S/ {venueCost.toFixed(2)}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">S/ {(venueCost / attendees).toFixed(2)}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{((venueCost / totalCosts) * 100).toFixed(1)}%</td>
              </tr>
              <tr>
                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">Drinks</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">S/ {calculateDrinkRequirements().totalCost.toFixed(2)}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">S/ {(calculateDrinkRequirements().totalCost / attendees).toFixed(2)}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{((calculateDrinkRequirements().totalCost / totalCosts) * 100).toFixed(1)}%</td>
              </tr>
              <tr>
                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">Food</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">S/ {calculateFoodRequirements().totalCost.toFixed(2)}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">S/ {(calculateFoodRequirements().totalCost / attendees).toFixed(2)}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{((calculateFoodRequirements().totalCost / totalCosts) * 100).toFixed(1)}%</td>
              </tr>
              <tr>
                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">Miscellaneous</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">S/ {(totalCosts - venueCost - calculateDrinkRequirements().totalCost - calculateFoodRequirements().totalCost).toFixed(2)}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">S/ {((totalCosts - venueCost - calculateDrinkRequirements().totalCost - calculateFoodRequirements().totalCost) / attendees).toFixed(2)}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{(((totalCosts - venueCost - calculateDrinkRequirements().totalCost - calculateFoodRequirements().totalCost) / totalCosts) * 100).toFixed(1)}%</td>
              </tr>
              <tr className="bg-gray-900 text-white">
                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">TOTAL COSTS</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">S/ {totalCosts.toFixed(2)}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">S/ {perPersonCost.toFixed(2)}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">100%</td>
              </tr>
              <tr>
                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">TOTAL REVENUE</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">S/ {totalRevenue.toFixed(2)}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">S/ {ticketPrice.toFixed(2)}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">-</td>
              </tr>
              <tr className={netProfit >= 0 ? 'bg-green-50' : 'bg-red-50'}>
                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">NET PROFIT/LOSS</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">S/ {netProfit.toFixed(2)}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">S/ {(netProfit / attendees).toFixed(2)}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                  {netProfit >= 0 ? `${((netProfit / totalRevenue) * 100).toFixed(1)}% margin` : '-'}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold mb-4">Shopping List Summary</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium mb-3">Drinks</h4>
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-900 text-white">
                <tr>
                  <th scope="col" className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider">Category</th>
                  <th scope="col" className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider">Items</th>
                  <th scope="col" className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider">Cost</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr>
                  <td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-gray-900">Spirits</td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                    {shoppingItems.filter(i => i.category === 'spirits').length}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                    S/ {getCategoryTotal('spirits').toFixed(2)}
                  </td>
                </tr>
                <tr>
                  <td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-gray-900">Mixers</td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                    {shoppingItems.filter(i => i.category === 'mixers').length}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                    S/ {getCategoryTotal('mixers').toFixed(2)}
                  </td>
                </tr>
                <tr>
                  <td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-gray-900">Ice</td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                    {shoppingItems.filter(i => i.category === 'ice').length}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                    S/ {getCategoryTotal('ice').toFixed(2)}
                  </td>
                </tr>
                <tr>
                  <td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-gray-900">Supplies</td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                    {shoppingItems.filter(i => i.category === 'supplies').length}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                    S/ {getCategoryTotal('supplies').toFixed(2)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <div>
            <h4 className="font-medium mb-3">Food</h4>
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-900 text-white">
                <tr>
                  <th scope="col" className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider">Category</th>
                  <th scope="col" className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider">Items</th>
                  <th scope="col" className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider">Cost</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr>
                  <td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-gray-900">Meat</td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                    {shoppingItems.filter(i => i.category === 'meat').length}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                    S/ {getCategoryTotal('meat').toFixed(2)}
                  </td>
                </tr>
                <tr>
                  <td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-gray-900">Sides</td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                    {shoppingItems.filter(i => i.category === 'sides').length}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                    S/ {getCategoryTotal('sides').toFixed(2)}
                  </td>
                </tr>
                <tr>
                  <td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-gray-900">Condiments</td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                    {shoppingItems.filter(i => i.category === 'condiments').length}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                    S/ {getCategoryTotal('condiments').toFixed(2)}
                  </td>
                </tr>
                <tr>
                  <td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-gray-900">Other</td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                    {shoppingItems.filter(i => i.category === 'other').length}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                    S/ {getCategoryTotal('other').toFixed(2)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold mb-4">Key Metrics & Recommendations</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-4 bg-gray-900 text-white rounded-lg">
            <h4 className="font-medium mb-2">Financial Metrics</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex justify-between">
                <span>Break-even point:</span>
                <span className="font-medium">{breakEvenAttendees} attendees</span>
              </li>
              <li className="flex justify-between">
                <span>Cost per attendee:</span>
                <span className="font-medium">S/ {perPersonCost.toFixed(2)}</span>
              </li>
              <li className="flex justify-between">
                <span>Profit margin:</span>
                <span className={`font-medium ${netProfit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {netProfit >= 0 ? ((netProfit / totalRevenue) * 100).toFixed(1) + '%' : 'N/A'}
                </span>
              </li>
              <li className="flex justify-between">
                <span>Min. viable ticket:</span>
                <span className="font-medium">S/ {recommendedTicketPrice}</span>
              </li>
            </ul>
          </div>
          
          <div className="p-4 bg-gray-900 text-white rounded-lg">
            <h4 className="font-medium mb-2">Event Metrics</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex justify-between">
                <span>Drinks per person:</span>
                <span className="font-medium">{drinksPerPerson}</span>
              </li>
              <li className="flex justify-between">
                <span>Food servings per person:</span>
                <span className="font-medium">{foodServingsPerPerson}</span>
              </li>
              <li className="flex justify-between">
                <span>Total drinks needed:</span>
                <span className="font-medium">{attendees * drinksPerPerson}</span>
              </li>
              <li className="flex justify-between">
                <span>Total food servings needed:</span>
                <span className="font-medium">{attendees * foodServingsPerPerson}</span>
              </li>
            </ul>
          </div>
          
          <div className="p-4 bg-gray-900 text-white rounded-lg">
            <h4 className="font-medium mb-2">Recommendations</h4>
            <ul className="space-y-2 text-sm">
              <li className={`flex justify-between ${ticketPrice >= recommendedTicketPrice ? 'text-green-400' : 'text-red-400'}`}>
                <span>Ticket Price:</span>
                <span className="font-medium">
                  {ticketPrice >= recommendedTicketPrice ? 'Good' : `Increase to S/${recommendedTicketPrice}`}
                </span>
              </li>
              <li className={`flex justify-between ${attendees >= breakEvenAttendees ? 'text-green-400' : 'text-red-400'}`}>
                <span>Attendance:</span>
                <span className="font-medium">
                  {attendees >= breakEvenAttendees ? 'Good' : `Need ${breakEvenAttendees - attendees} more`}
                </span>
              </li>
              <li className={`flex justify-between ${isViable ? 'text-green-400' : 'text-red-400'}`}>
                <span>Overall viability:</span>
                <span className="font-medium">
                  {isViable ? 'Viable' : 'Not viable'}
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