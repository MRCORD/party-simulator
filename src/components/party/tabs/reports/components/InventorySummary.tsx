import React, { useState } from 'react';
import { List } from 'lucide-react';
import Button from '@/components/ui/Button';

interface CategoryData {
  category: string;
  items: number;
  cost: number;
}

interface InventorySummaryProps {
  beverageData: CategoryData[];
  foodData: CategoryData[];
}

const InventorySummary: React.FC<InventorySummaryProps> = ({
  beverageData,
  foodData
}) => {
  const [activeTab, setActiveTab] = useState<'beverage' | 'food'>('beverage');
  
  const renderDataTable = (data: CategoryData[]) => {
    // Calculate total cost
    const totalCost = data.reduce((sum, item) => sum + item.cost, 0);
    
    return (
      <div className="overflow-hidden border border-gray-200 rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Categoría
              </th>
              <th scope="col" className="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Artículos
              </th>
              <th scope="col" className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Costo (S/)
              </th>
              <th scope="col" className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                % del Total
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {data.map((item, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-gray-800">
                  {item.category}
                </td>
                <td className="px-3 py-2 whitespace-nowrap text-sm text-center">
                  {item.items}
                </td>
                <td className="px-3 py-2 whitespace-nowrap text-sm text-right">
                  {item.cost.toFixed(2)}
                </td>
                <td className="px-3 py-2 whitespace-nowrap text-sm text-right">
                  {totalCost > 0 ? ((item.cost / totalCost) * 100).toFixed(1) : '0.0'}%
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="bg-gray-50 font-medium">
              <td className="px-3 py-2 whitespace-nowrap text-sm">Total</td>
              <td className="px-3 py-2 whitespace-nowrap text-sm text-center">
                {data.reduce((sum, item) => sum + item.items, 0)}
              </td>
              <td className="px-3 py-2 whitespace-nowrap text-sm text-right">
                {totalCost.toFixed(2)}
              </td>
              <td className="px-3 py-2 whitespace-nowrap text-sm text-right">
                100.0%
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    );
  };
  
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      <div className="flex items-center mb-4">
        <List className="w-5 h-5 text-primary mr-2" />
        <h3 className="text-lg font-medium">Resumen de Inventario</h3>
      </div>
      
      {/* Tab Navigation */}
      <div className="flex space-x-2 mb-4">
        <Button 
          variant={activeTab === 'beverage' ? 'gradient' : 'outline'}
          color="primary"
          size="sm"
          onClick={() => setActiveTab('beverage')}
        >
          Bebidas
        </Button>
        <Button 
          variant={activeTab === 'food' ? 'gradient' : 'outline'}
          color="warning"
          size="sm"
          onClick={() => setActiveTab('food')}
        >
          Comida
        </Button>
      </div>
      
      {/* Tab Content */}
      <div className="mt-4">
        {activeTab === 'beverage' ? (
          renderDataTable(beverageData)
        ) : (
          renderDataTable(foodData)
        )}
      </div>
      
      <div className="mt-4 text-xs text-gray-500">
        <p>Este resumen muestra el desglose del inventario por categoría y su costo asociado.</p>
      </div>
    </div>
  );
};

export default InventorySummary;