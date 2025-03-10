import React from 'react';
import { ShoppingCart, FileText, Edit, Trash2, PlusCircle, Save } from 'lucide-react';

const ShoppingTab = ({
  newItem, setNewItem,
  shoppingItems, setShoppingItems,
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
  
  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <ShoppingCart className="w-5 h-5 mr-2" /> Agregar Nuevo Artículo
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Nombre del Artículo</label>
            <input
              type="text"
              name="name"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border focus:border-blue-500 focus:ring focus:ring-blue-200"
              value={newItem.name}
              onChange={handleInputChange}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Categoría</label>
            <select
              name="category"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border focus:border-blue-500 focus:ring focus:ring-blue-200"
              value={newItem.category}
              onChange={handleInputChange}
            >
              {categories.map(cat => (
                <option key={cat.value} value={cat.value}>{cat.label}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Precio (S/)</label>
            <input
              type="number"
              name="cost"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border focus:border-blue-500 focus:ring focus:ring-blue-200"
              value={newItem.cost}
              onChange={handleInputChange}
              min="0"
              step="1"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Unidades</label>
            <input
              type="number"
              name="units"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border focus:border-blue-500 focus:ring focus:ring-blue-200"
              value={newItem.units}
              onChange={handleInputChange}
              min="1"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Tamaño</label>
            <input
              type="number"
              name="size"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border focus:border-blue-500 focus:ring focus:ring-blue-200"
              value={newItem.size}
              onChange={handleInputChange}
              min="0"
              step="0.1"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Unidad de Medida</label>
            <select
              name="sizeUnit"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border focus:border-blue-500 focus:ring focus:ring-blue-200"
              value={newItem.sizeUnit}
              onChange={handleInputChange}
            >
              {sizeUnits[newItem.category].map(unit => (
                <option key={unit} value={unit}>{unit}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Porciones</label>
            <input
              type="number"
              name="servings"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border focus:border-blue-500 focus:ring focus:ring-blue-200"
              value={newItem.servings}
              onChange={handleInputChange}
              min="0"
            />
          </div>
          
          <div className="flex items-end">
            {editingItem ? (
              <button
                onClick={saveEdit}
                className="w-full flex items-center justify-center bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded focus:outline-none focus:ring focus:ring-blue-200"
              >
                <Save className="w-4 h-4 mr-1" /> Guardar Cambios
              </button>
            ) : (
              <button
                onClick={addItem}
                className="w-full flex items-center justify-center bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded focus:outline-none focus:ring focus:ring-green-200"
              >
                <PlusCircle className="w-4 h-4 mr-1" /> Agregar Artículo
              </button>
            )}
          </div>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold mb-4">Lista de Compras</h3>
        
        <div className="space-y-6">
          {categories.map(cat => (
            groupedItems[cat.value] && groupedItems[cat.value].length > 0 ? (
              <div key={cat.value} className="space-y-2">
                <h4 className="font-medium text-gray-800 border-b pb-2">{cat.label}</h4>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                        <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tamaño</th>
                        <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Precio</th>
                        <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Unidades</th>
                        <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Porciones</th>
                        <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                        <th scope="col" className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {groupedItems[cat.value].map(item => (
                        <tr key={item.id} className="hover:bg-gray-50">
                          <td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-gray-900">{item.name}</td>
                          <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">{item.size} {item.sizeUnit}</td>
                          <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">S/ {item.cost}</td>
                          <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">{item.units}</td>
                          <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">{item.servings * item.units}</td>
                          <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">S/ {(item.cost * item.units).toFixed(2)}</td>
                          <td className="px-3 py-2 whitespace-nowrap text-sm text-right">
                            <button 
                              onClick={() => startEdit(item)} 
                              className="text-blue-600 hover:text-blue-800 mr-3"
                              title="Editar"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => deleteItem(item.id)} 
                              className="text-red-600 hover:text-red-800"
                              title="Eliminar"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                      <tr className="bg-gray-50">
                        <td colSpan="5" className="px-3 py-2 text-sm font-medium text-right">Total de Categoría:</td>
                        <td className="px-3 py-2 text-sm font-medium">S/ {getCategoryTotal(cat.value).toFixed(2)}</td>
                        <td></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            ) : null
          ))}
          
          <div className="border-t pt-4 flex justify-between items-center">
            <div className="text-lg font-semibold">Costo Total de la Lista:</div>
            <div className="text-lg font-semibold">S/ {shoppingItems.reduce((sum, item) => sum + (item.cost * item.units), 0).toFixed(2)}</div>
          </div>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <FileText className="w-5 h-5 mr-2" /> Datos JSON
        </h3>
        <div className="bg-gray-100 p-4 rounded-md">
          <pre className="text-xs overflow-auto max-h-64">{jsonPreview}</pre>
        </div>
      </div>
    </div>
  );
};

export default ShoppingTab;