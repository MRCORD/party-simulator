"use client";

import React, { useState } from 'react';
import { 
  ShoppingCart, FileText, Edit, Trash2, PlusCircle, 
  Save, Package, ChevronDown, X,
  Wine, Droplets, Snowflake, Beef, Salad, Utensils, DollarSign
} from 'lucide-react';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { useTheme } from '@/components/ui/ThemeProvider';

// Import shared types
import { ShoppingItem, Category } from './types';

interface ShoppingTabProps {
  newItem: Omit<ShoppingItem, 'id'>;
  shoppingItems: ShoppingItem[];
  categories: Category[];
  sizeUnits: Record<string, string[]>;
  editingItem: ShoppingItem | null;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  addItem: () => void;
  saveEdit: () => void;
  startEdit: (item: ShoppingItem) => void;
  deleteItem: (id: string) => void;
  getCategoryTotal: (category: string) => number;
  getItemsByCategory: () => Record<string, ShoppingItem[]>;
  jsonPreview: string;
}

const ShoppingTab: React.FC<ShoppingTabProps> = ({
  newItem, 
  shoppingItems,
  categories, 
  sizeUnits,
  editingItem, 
  handleInputChange,
  addItem, 
  saveEdit, 
  startEdit, 
  deleteItem,
  getCategoryTotal,
  getItemsByCategory,
  jsonPreview
}) => {
  const theme = useTheme();
  const [showForm, setShowForm] = useState(false);
  const [activeCategory, setActiveCategory] = useState('all');
  
  // Get filtered items based on active category
  const getFilteredItems = () => {
    if (activeCategory === 'all') return shoppingItems;
    return shoppingItems.filter(item => item.category === activeCategory);
  };
  
  // Get icon for category
  const getCategoryIcon = (category: string) => {
    switch(category) {
      case 'spirits': return <Wine className="w-4 h-4 text-blue-500" />;
      case 'mixers': return <Droplets className="w-4 h-4 text-teal-500" />;
      case 'ice': return <Snowflake className="w-4 h-4 text-blue-300" />;
      case 'meat': return <Beef className="w-4 h-4 text-red-500" />;
      case 'sides': return <Salad className="w-4 h-4 text-green-500" />;
      case 'condiments': return <Utensils className="w-4 h-4 text-amber-500" />;
      case 'supplies': return <Package className="w-4 h-4 text-purple-500" />;
      default: return <Package className="w-4 h-4 text-gray-500" />;
    }
  };
  
  // Get total cost of filtered items
  const getFilteredTotal = () => {
    return getFilteredItems().reduce((total, item) => total + (item.cost * item.units), 0);
  };
  
  // Get category label from value
  const getCategoryLabel = (value: string) => {
    const category = categories.find(cat => cat.value === value);
    return category ? category.label : value;
  };

  // Get header section with proper theme gradient
  const headerClasses = theme.getGradient('primary') + ' p-5 text-white';

  // Get form section with proper theme colors
  const formClasses = 'p-5 bg-primary-light/10 border-b border-primary-light/20';

  // Get filtered items and totals
  const filteredItems = getFilteredItems();
  const filteredTotal = getFilteredTotal();

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className={headerClasses}>
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <ShoppingCart className="w-6 h-6 mr-3" />
              <h2 className="text-xl font-bold">Lista de Compras</h2>
            </div>
            <button 
              onClick={() => setShowForm(!showForm)}
              className="bg-white text-blue-600 hover:bg-blue-50 px-4 py-2 rounded-lg shadow flex items-center transition-all"
            >
              {showForm ? (
                <>
                  <X size={18} className="mr-2" />
                  <span>Cerrar</span>
                </>
              ) : (
                <>
                  <PlusCircle size={18} className="mr-2" />
                  <span>Agregar Artículo</span>
                </>
              )}
            </button>
          </div>
          
          {/* Summary Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3">
              <div className="text-sm opacity-80">Total Artículos</div>
              <div className="text-xl font-bold">{shoppingItems.length}</div>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3">
              <div className="text-sm opacity-80">Costo Total</div>
              <div className="text-xl font-bold">S/ {shoppingItems.reduce((sum, item) => sum + (item.cost * item.units), 0).toFixed(2)}</div>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3">
              <div className="text-sm opacity-80">Categorías</div>
              <div className="text-xl font-bold">{Object.values(getItemsByCategory()).filter(items => items.length > 0).length}</div>
            </div>
          </div>
        </div>
        
        {/* Add/Edit Form - Conditionally shown */}
        {showForm && (
          <div className={formClasses}>
            <h3 className="text-lg font-bold text-blue-800 mb-4">
              {editingItem ? 'Editar Artículo' : 'Agregar Nuevo Artículo'}
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-blue-800 mb-1">Nombre del Artículo</label>
                <input
                  type="text"
                  name="name"
                  className="block w-full rounded-md shadow-sm border border-blue-200 p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={newItem.name}
                  onChange={handleInputChange}
                  placeholder="ej. Ron Cartavio"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-blue-800 mb-1">Categoría</label>
                <div className="relative">
                  <select
                    name="category"
                    className="block w-full rounded-md shadow-sm border border-blue-200 p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none"
                    value={newItem.category}
                    onChange={handleInputChange}
                  >
                    {categories.map(cat => (
                      <option key={cat.value} value={cat.value}>{cat.label}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-400 pointer-events-none" size={18} />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-blue-800 mb-1">Precio (S/)</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400">S/</span>
                    <input
                      type="number"
                      name="cost"
                      className="block w-full rounded-md shadow-sm border border-blue-200 p-2.5 pl-8 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={newItem.cost}
                      onChange={handleInputChange}
                      min="0"
                      step="0.1"
                      placeholder="0.00"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-blue-800 mb-1">Unidades</label>
                  <input
                    type="number"
                    name="units"
                    className="block w-full rounded-md shadow-sm border border-blue-200 p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={newItem.units}
                    onChange={handleInputChange}
                    min="1"
                    placeholder="1"
                  />
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <div>
                <label className="block text-sm font-medium text-blue-800 mb-1">Tamaño</label>
                <input
                  type="number"
                  name="size"
                  className="block w-full rounded-md shadow-sm border border-blue-200 p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={newItem.size}
                  onChange={handleInputChange}
                  min="0"
                  step="0.1"
                  placeholder="0.0"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-blue-800 mb-1">Unidad de Medida</label>
                <div className="relative">
                  <select
                    name="sizeUnit"
                    className="block w-full rounded-md shadow-sm border border-blue-200 p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none"
                    value={newItem.sizeUnit}
                    onChange={handleInputChange}
                  >
                    {sizeUnits[newItem.category].map(unit => (
                      <option key={unit} value={unit}>{unit}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-400 pointer-events-none" size={18} />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-blue-800 mb-1">Porciones</label>
                <input
                  type="number"
                  name="servings"
                  className="block w-full rounded-md shadow-sm border border-blue-200 p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={newItem.servings}
                  onChange={handleInputChange}
                  min="0"
                  placeholder="0"
                />
              </div>
            </div>
            
            <div className="mt-5 flex justify-end">
              <button
                onClick={() => {
                  setShowForm(false);
                }}
                className="mr-3 px-4 py-2 border border-blue-200 rounded-lg text-blue-600 hover:bg-blue-50"
              >
                Cancelar
              </button>
              
              {editingItem ? (
                <button
                  onClick={() => {
                    saveEdit();
                    setShowForm(false);
                  }}
                  className="px-5 py-2 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-lg shadow hover:shadow-md flex items-center"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Guardar Cambios
                </button>
              ) : (
                <button
                  onClick={() => {
                    addItem();
                    setShowForm(false);
                  }}
                  className="px-5 py-2 bg-gradient-to-r from-green-600 to-green-500 text-white rounded-lg shadow hover:shadow-md flex items-center"
                >
                  <PlusCircle className="w-4 h-4 mr-2" />
                  Agregar Artículo
                </button>
              )}
            </div>
          </div>
        )}
        
        {/* Filter Tabs */}
        <div className="flex border-b border-slate-200 overflow-x-auto px-4 pt-4">
          <button
            onClick={() => setActiveCategory('all')}
            className={`px-4 py-2 font-medium text-sm rounded-t-lg ${
              activeCategory === 'all' 
                ? theme.getGradient('primary') + ' text-white' 
                : 'text-slate-600 hover:bg-slate-100'
            } mr-2`}
          >
            Todos
          </button>
          
          {categories.map(category => {
            const categoryItems = shoppingItems.filter(item => item.category === category.value);
            if (categoryItems.length === 0) return null;
            
            return (
              <button
                key={category.value}
                onClick={() => setActiveCategory(category.value)}
                className={`px-4 py-2 font-medium text-sm rounded-t-lg flex items-center ${
                  activeCategory === category.value 
                    ? theme.getGradient('primary') + ' text-white' 
                    : 'text-slate-600 hover:bg-slate-100'
                } mr-2`}
              >
                {getCategoryIcon(category.value)}
                <span className="ml-2">{category.label}</span>
                <span className="ml-2 bg-white/30 text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {categoryItems.length}
                </span>
              </button>
            );
          })}
        </div>
        
        {/* Table Section */}
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
                  Precio
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Unidades
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Porciones
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {getFilteredItems().map((item) => (
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
                    {item.cost.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.units}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.servings * item.units}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                    {(item.cost * item.units).toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button 
                      className="text-blue-600 hover:text-blue-900 mr-3"
                      onClick={() => {
                        startEdit(item);
                        setShowForm(true);
                      }}
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button 
                      className="text-red-600 hover:text-red-900"
                      onClick={() => deleteItem(item.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
              
              {getFilteredItems().length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-10 text-center text-gray-500">
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
                <td colSpan={5} className="px-6 py-4 text-right text-gray-700">
                  {activeCategory === 'all' 
                    ? 'Total de compras:' 
                    : `Total de ${getCategoryLabel(activeCategory)}:`}
                </td>
                <td className="px-6 py-4 text-gray-900 font-bold">
                  {getFilteredTotal().toFixed(2)}
                </td>
                <td></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
      
      {/* Optional JSON preview (hidden by default) */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="flex justify-between items-center px-5 py-3 border-b border-slate-200">
          <div className="flex items-center">
            <FileText className="w-5 h-5 text-slate-600 mr-2" />
            <h3 className="font-medium text-slate-800">Datos JSON (Para Desarrolladores)</h3>
          </div>
          <button 
            onClick={() => {
              const el = document.getElementById('json-preview');
              if (el) el.classList.toggle('hidden');
            }}
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            Mostrar/Ocultar
          </button>
        </div>
        <div id="json-preview" className="hidden">
          <pre className="text-xs overflow-auto max-h-64 text-slate-700 font-mono p-4">{jsonPreview}</pre>
        </div>
      </div>
    </div>
  );
};

export default ShoppingTab;