import React from 'react';
import { List, Package, Wine, Droplet, Snowflake } from 'lucide-react';
import { useTheme } from '@/components/ui/ThemeProvider';
import { ShoppingItem } from '@/types';

interface DrinksListProps {
  drinkItems: ShoppingItem[];
  drinkRequirements: {
    totalCost: number;
  };
}

const DrinksList: React.FC<DrinksListProps> = ({
  drinkItems,
  drinkRequirements
}) => {
  const theme = useTheme();
  
  // Get category icon for display
  const getCategoryIcon = (category: string) => {
    switch(category) {
      case 'spirits': return <Wine className="w-4 h-4 text-primary" />;
      case 'mixers': return <Droplet className="w-4 h-4 text-accent-teal" />;
      case 'ice': return <Snowflake className="w-4 h-4 text-primary-light" />;
      case 'supplies': return <Package className="w-4 h-4 text-accent-pink" />;
      default: return <Package className="w-4 h-4 text-gray-500" />;
    }
  };
  
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <div className={`${theme.getGradient('primary')} px-4 py-3 text-white`}>
        <div className="flex items-center">
          <List className="w-5 h-5 mr-2" />
          <h3 className="font-medium">Detalle de Bebidas</h3>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Artículo
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tamaño
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Unidades
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Porciones
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Precio
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Costo Total
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {drinkItems.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    {getCategoryIcon(item.category)}
                    <span className="ml-2 font-medium text-gray-900">{item.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {item.size} {item.sizeUnit}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {item.units}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {item.servings * item.units}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  S/ {item.cost.toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                  S/ {(item.cost * item.units).toFixed(2)}
                </td>
              </tr>
            ))}
            
            {drinkItems.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-10 text-center text-gray-500">
                  <Package className="mx-auto h-12 w-12 text-gray-400 mb-2" />
                  <p className="text-lg font-medium text-gray-900 mb-1">No hay bebidas</p>
                  <p className="text-sm">
                    Agrega bebidas usando la pestaña &quot;Compras&quot;
                  </p>
                </td>
              </tr>
            )}
          </tbody>
          {/* Total Row */}
          <tfoot>
            <tr className="bg-gray-50 font-medium">
              <td colSpan={5} className="px-6 py-4 text-right text-gray-700">Total:</td>
              <td className="px-6 py-4 text-gray-900 font-bold">
                S/ {drinkRequirements.totalCost.toFixed(2)}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};

export default DrinksList;