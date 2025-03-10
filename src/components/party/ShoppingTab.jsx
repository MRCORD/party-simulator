"use client";

import React from 'react';
import { ShoppingCart, FileText, Edit, Trash2, PlusCircle, Save, Package, ChevronDown, TrendingUp, Calendar, Tag } from 'lucide-react';

const ShoppingTab = ({
  newItem, 
  shoppingItems,
  categories, sizeUnits,
  editingItem, 
  handleInputChange,
  addItem, saveEdit, startEdit, deleteItem,
  getCategoryTotal
}) => {
  // Group items by category for the shopping list
  const getItemsByCategory = () => {
    const grouped = {};
    categories.forEach(cat => {
      const items = shoppingItems.filter(item => item.category === cat.value);
      if (items.length > 0) {
        grouped[cat.value] = items;
      }
    });
    return grouped;
  };

  const groupedItems = getItemsByCategory();
  const jsonPreview = JSON.stringify(shoppingItems, null, 2);
  
  // Category icons
  const categoryIcons = {
    spirits: <Wine className="w-4 h-4 text-purple-600" />,
    mixers: <Droplets className="w-4 h-4 text-blue-600" />,
    ice: <Snowflake className="w-4 h-4 text-cyan-600" />,
    meat: <Beef className="w-4 h-4 text-red-600" />,
    sides: <Salad className="w-4 h-4 text-green-600" />,
    condiments: <Salt className="w-4 h-4 text-yellow-600" />,
    supplies: <Package className="w-4 h-4 text-gray-600" />,
    other: <Tag className="w-4 h-4 text-orange-600" />
  };
  
  // Custom icons for categories
  function Wine(props) {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M8 22h8"></path><path d="M7 10h10"></path>
        <path d="M12 15v7"></path><path d="M12 15a5 5 0 0 0 5-5c0-2-.5-4-2-8H9c-1.5 4-2 6-2 8a5 5 0 0 0 5 5z"></path>
      </svg>
    );
  }
  
  function Droplets(props) {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M7 16.3c2.2 0 4-1.83 4-4.05 0-1.16-.57-2.26-1.71-3.19S7.29 6.75 7 5.3c-.29 1.45-1.14 2.84-2.29 3.76S3 11.1 3 12.25c0 2.22 1.8 4.05 4 4.05z"></path>
        <path d="M12.56 6.6A10.97 10.97 0 0 0 14 3.02c.5 2.5 2 4.9 4 6.5s3 3.5 3 5.5a6.98 6.98 0 0 1-11.91 4.97"></path>
      </svg>
    );
  }
  
  function Snowflake(props) {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <line x1="2" x2="22" y1="12" y2="12"></line>
        <line x1="12" x2="12" y1="2" y2="22"></line>
        <path d="m20 16-4-4 4-4"></path>
        <path d="m4 8 4 4-4 4"></path>
        <path d="m16 4-4 4-4-4"></path>
        <path d="m8 20 4-4 4 4"></path>
      </svg>
    );
  }
  
  function Beef(props) {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <circle cx="12" cy="12" r="8"></circle>
        <path d="M18.08 7.73c.13.86.18 1.73.17 2.58a5.93 5.93 0 0 1-1.3 3.58c-.68.98-1.53 1.74-2.55 2.3-1.04.55-2.37.96-3.4 1-1.05.05-2.13.14-3.2-.42a5.44 5.44 0 0 1-1.9-1.92c-.7-1.08-1.05-2.39-1.09-3.8A10.32 10.32 0 0 1 5 7.73c.2-.95.75-1.85 1.57-2.57.87-.77 1.93-1.25 3.05-1.55a9.42 9.42 0 0 1 4.75.07c1.48.41 2.72 1.17 3.14 2.55"></path>
      </svg>
    );
  }
  
  function Salad(props) {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M7 21h10"></path>
        <path d="M12 21a9 9 0 0 0 9-9H3a9 9 0 0 0 9 9Z"></path>
        <path d="M11.38 12a2.4 2.4 0 0 1-.4-4.77 2.4 2.4 0 0 1 3.2-2.77 2.4 2.4 0 0 1 3.47-.63 2.4 2.4 0 0 1 3.37 1.12 2.4 2.4 0 0 1-1.1 3.44 2.4 2.4 0 0 1-1.84 3.17 2.4 2.4 0 0 1-4.18 0 2.4 2.4 0 0 1-2.5.44Z"></path>
        <path d="M8 12a3 3 0 0 1 0-6"></path>
        <path d="M4.82 7.6a3 3 0 0 0 .18 4.4"></path>
      </svg>
    );
  }
  
  function Salt(props) {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M7 7a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2z"></path>
      </svg>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
        <h3 className="text-xl font-bold mb-6 flex items-center text-indigo-800">
          <ShoppingCart className="w-5 h-5 mr-2 text-indigo-600" /> Agregar Nuevo Artículo
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="space-y-2">
            <label className="block text-base font-medium text-gray-700">Nombre del Artículo</label>
            <input
              type="text"
              name="name"
              className="block w-full rounded-lg border-gray-300 shadow-sm p-3 border focus:border-indigo-500 focus:ring focus:ring-indigo-200"
              value={newItem.name}
              onChange={handleInputChange}
              placeholder="ej. Ron Cartavio"
            />
          </div>
          
          <div className="space-y-2">
            <label className="block text-base font-medium text-gray-700">Categoría</label>
            <div className="relative">
              <select
                name="category"
                className="block w-full rounded-lg border-gray-300 shadow-sm p-3 border focus:border-indigo-500 focus:ring focus:ring-indigo-200 appearance-none"
                value={newItem.category}
                onChange={handleInputChange}
              >
                {categories.map(cat => (
                  <option key={cat.value} value={cat.value}>{cat.label}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="block text-base font-medium text-gray-700">Precio (S/)</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">S/</span>
              <input
                type="number"
                name="cost"
                className="block w-full rounded-lg border-gray-300 shadow-sm p-3 pl-8 border focus:border-indigo-500 focus:ring focus:ring-indigo-200"
                value={newItem.cost}
                onChange={handleInputChange}
                min="0"
                step="1"
                placeholder="0.00"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="block text-base font-medium text-gray-700">Unidades</label>
            <input
              type="number"
              name="units"
              className="block w-full rounded-lg border-gray-300 shadow-sm p-3 border focus:border-indigo-500 focus:ring focus:ring-indigo-200"
              value={newItem.units}
              onChange={handleInputChange}
              min="1"
              placeholder="1"
            />
          </div>
          
          <div className="space-y-2">
            <label className="block text-base font-medium text-gray-700">Tamaño</label>
            <input
              type="number"
              name="size"
              className="block w-full rounded-lg border-gray-300 shadow-sm p-3 border focus:border-indigo-500 focus:ring focus:ring-indigo-200"
              value={newItem.size}
              onChange={handleInputChange}
              min="0"
              step="0.1"
              placeholder="0.0"
            />
          </div>
          
          <div className="space-y-2">
            <label className="block text-base font-medium text-gray-700">Unidad de Medida</label>
            <div className="relative">
              <select
                name="sizeUnit"
                className="block w-full rounded-lg border-gray-300 shadow-sm p-3 border focus:border-indigo-500 focus:ring focus:ring-indigo-200 appearance-none"
                value={newItem.sizeUnit}
                onChange={handleInputChange}
              >
                {sizeUnits[newItem.category].map(unit => (
                  <option key={unit} value={unit}>{unit}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="block text-base font-medium text-gray-700">Porciones</label>
            <input
              type="number"
              name="servings"
              className="block w-full rounded-lg border-gray-300 shadow-sm p-3 border focus:border-indigo-500 focus:ring focus:ring-indigo-200"
              value={newItem.servings}
              onChange={handleInputChange}
              min="0"
              placeholder="0"
            />
          </div>
          
          <div className="flex items-end">
            {editingItem ? (
              <button
                onClick={saveEdit}
                className="w-full flex items-center justify-center bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300 transition duration-200"
              >
                <Save className="w-5 h-5 mr-2" /> Guardar Cambios
              </button>
            ) : (
              <button
                onClick={addItem}
                className="w-full flex items-center justify-center bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300 transition duration-200"
              >
                <PlusCircle className="w-5 h-5 mr-2" /> Agregar Artículo
              </button>
            )}
          </div>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
        <h3 className="text-xl font-bold mb-4 flex items-center text-indigo-800">
          <ShoppingCart className="w-5 h-5 mr-2 text-indigo-600" /> Lista de Compras
        </h3>
        
        <div className="space-y-8">
          {categories.map(cat => (
            groupedItems[cat.value] && groupedItems[cat.value].length > 0 ? (
              <div key={cat.value} className="space-y-3">
                <div className="flex items-center gap-2 border-b pb-3">
                  {categoryIcons[cat.value]}
                  <h4 className="font-bold text-lg text-gray-800">{cat.label}</h4>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-100">
                        <tr>
                          <th scope="col" className="px-4 py-3 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider rounded-tl-lg">Nombre</th>
                          <th scope="col" className="px-4 py-3 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">Tamaño</th>
                          <th scope="col" className="px-4 py-3 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">Precio</th>
                          <th scope="col" className="px-4 py-3 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">Unidades</th>
                          <th scope="col" className="px-4 py-3 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">Porciones</th>
                          <th scope="col" className="px-4 py-3 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">Total</th>
                          <th scope="col" className="px-4 py-3 text-right text-sm font-semibold text-gray-700 uppercase tracking-wider rounded-tr-lg">Acciones</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {groupedItems[cat.value].map(item => (
                          <tr key={item.id} className="hover:bg-indigo-50 transition-colors duration-150">
                            <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-800">{item.name}</td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{item.size} {item.sizeUnit}</td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">S/ {item.cost}</td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{item.units}</td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{item.servings * item.units}</td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-green-700">S/ {(item.cost * item.units).toFixed(2)}</td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-right">
                              <div className="flex justify-end gap-2">
                                <button 
                                  onClick={() => startEdit(item)} 
                                  className="text-indigo-600 hover:text-indigo-800 bg-indigo-100 hover:bg-indigo-200 p-2 rounded-full transition-colors duration-150"
                                  title="Editar"
                                >
                                  <Edit className="w-4 h-4" />
                                </button>
                                <button 
                                  onClick={() => deleteItem(item.id)} 
                                  className="text-red-600 hover:text-red-800 bg-red-100 hover:bg-red-200 p-2 rounded-full transition-colors duration-150"
                                  title="Eliminar"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                        <tr className="bg-gray-100 font-medium">
                          <td colSpan="5" className="px-4 py-3 text-sm text-right rounded-bl-lg">Total de {cat.label}:</td>
                          <td className="px-4 py-3 text-sm font-bold text-green-700">S/ {getCategoryTotal(cat.value).toFixed(2)}</td>
                          <td className="rounded-br-lg"></td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            ) : null
          ))}
          
          <div className="border-t pt-6 flex justify-between items-center">
            <div className="text-xl font-bold text-indigo-800">Costo Total de la Lista:</div>
            <div className="text-xl font-bold text-green-700 bg-green-50 px-6 py-3 rounded-lg">
              S/ {shoppingItems.reduce((sum, item) => sum + (item.cost * item.units), 0).toFixed(2)}
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-gradient-to-r from-gray-100 to-gray-50 p-6 rounded-xl shadow-md border border-gray-100">
        <h3 className="text-xl font-bold mb-4 flex items-center text-gray-800">
          <FileText className="w-5 h-5 mr-2 text-gray-600" /> Datos JSON (Para Desarrolladores)
        </h3>
        <div className="bg-white p-4 rounded-lg border border-gray-200 overflow-hidden">
          <pre className="text-xs overflow-auto max-h-64 text-gray-700 font-mono">{jsonPreview}</pre>
        </div>
      </div>
    </div>
  );
};

export default ShoppingTab;