"use client";

import React from 'react';
import { Edit, Trash2, MinusCircle, PlusCircle, Package } from 'lucide-react';
import Button from '@/components/ui/Button';
import { ShoppingItem, Category } from '@/types';
import { getCategoryIcon } from '@/components/party/constants';

interface ItemListProps {
  shoppingItems: ShoppingItem[];
  getFilteredItems: () => ShoppingItem[];
  getFilteredTotal: () => number;
  startEdit: (item: ShoppingItem) => void;
  saveEdit: () => void;
  deleteItem: (id: string) => void;
  setShowForm: (show: boolean) => void;
  activeCategory: string;
  setActiveCategory: (category: string) => void;
  categories: Category[];
  getCategoryLabel: (category: string) => string;
}

const ItemList: React.FC<ItemListProps> = ({
  shoppingItems,
  getFilteredItems,
  getFilteredTotal,
  startEdit,
  saveEdit,
  deleteItem,
  setShowForm,
  activeCategory,
  setActiveCategory,
  categories,
  getCategoryLabel
}) => {
  const filteredItems = getFilteredItems();
  
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      {/* Category Filter Tabs */}
      <div className="flex border-b border-slate-200 overflow-x-auto px-4 pt-4">
        <Button 
          onClick={() => setActiveCategory('all')}
          variant={activeCategory === 'all' ? "gradient" : "ghost"}
          color="primary"
          size="sm"
          className={`mr-2 ${activeCategory !== 'all' && 'text-slate-600'}`}
        >
          Todos
        </Button>
        
        {categories.map(category => {
          const categoryItems = shoppingItems.filter(item => item.category === category.value);
          if (categoryItems.length === 0) return null;
          
          return (
            <Button
              key={category.value}
              onClick={() => setActiveCategory(category.value)}
              variant={activeCategory === category.value ? "gradient" : "ghost"}
              color="primary"
              size="sm"
              className={`mr-2 flex items-center ${activeCategory !== category.value && 'text-slate-600'}`}
            >
              {getCategoryIcon(category.value, 4)}
              <span className="ml-2">{category.label}</span>
              <span className={`ml-2 ${activeCategory === category.value ? 'bg-white/30' : 'bg-gray-200'} text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center`}>
                {categoryItems.length}
              </span>
            </Button>
          );
        })}
      </div>
      
      {/* Table */}
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
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Porciones
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Precio
              </th>
              <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Unidades
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total Porciones
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredItems.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    {getCategoryIcon(item.category)}
                    {item.url ? (
                      <a 
                        href={item.url} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="ml-2 font-medium text-blue-600 hover:text-blue-800 hover:underline"
                      >
                        {item.name}
                      </a>
                    ) : (
                      <span className="ml-2 font-medium text-gray-900">{item.name}</span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {item.size} {item.sizeUnit}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500">
                  {item.servings}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                  S/ {item.cost.toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center justify-center space-x-2">
                    <Button 
                      variant="ghost"
                      color="primary"
                      size="sm"
                      onClick={() => {
                        const updatedItem = { ...item, units: Math.max(1, item.units - 1) };
                        startEdit(updatedItem);
                        saveEdit();
                      }}
                      className="p-1"
                    >
                      <MinusCircle size={16} />
                    </Button>
                    <span className="text-sm font-medium w-8 text-center">{item.units}</span>
                    <Button 
                      variant="ghost"
                      color="primary" 
                      size="sm"
                      onClick={() => {
                        const updatedItem = { ...item, units: item.units + 1 };
                        startEdit(updatedItem);
                        saveEdit();
                      }}
                      className="p-1"
                    >
                      <PlusCircle size={16} />
                    </Button>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500">
                  {item.servings * item.units}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-bold text-gray-900">
                  S/ {(item.cost * item.units).toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <Button 
                    variant="ghost"
                    color="primary"
                    size="sm"
                    onClick={() => {
                      startEdit(item);
                      setShowForm(true);
                    }}
                    className="mr-3"
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant="ghost"
                    color="error"
                    size="sm"
                    onClick={() => deleteItem(item.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </td>
              </tr>
            ))}
            
            {filteredItems.length === 0 && (
              <tr>
                <td colSpan={8} className="px-6 py-10 text-center text-gray-500">
                  <Package className="mx-auto h-12 w-12 text-gray-400 mb-2" />
                  <p className="text-lg font-medium text-gray-900 mb-1">No hay artículos</p>
                  <p className="text-sm">
                    {activeCategory === 'all' 
                      ? 'Agrega artículos usando el botón "Agregar Artículo"' 
                      : `No hay artículos en la categoría ${getCategoryLabel(activeCategory)}`}
                  </p>
                </td>
              </tr>
            )}
          </tbody>
          
          {/* Total Row */}
          <tfoot>
            <tr className="bg-gray-50 font-medium">
              <td colSpan={6} className="px-6 py-4 text-right text-gray-700 whitespace-nowrap">
                {activeCategory === 'all' 
                  ? 'Total de compras:' 
                  : `Total de ${getCategoryLabel(activeCategory)}:`}
              </td>
              <td className="px-6 py-4 text-gray-900 font-bold whitespace-nowrap">
                S/ {getFilteredTotal().toFixed(2)}
              </td>
              <td></td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};

export default ItemList;