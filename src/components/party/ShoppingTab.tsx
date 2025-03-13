"use client";

import React, { useState } from 'react';
import { 
  ShoppingCart, FileText, Edit, Trash2, PlusCircle, MinusCircle,
  Save, Package, ChevronDown, X, Link, Wine, Droplet, Snowflake,
  Beef, Salad, UtensilsCrossed, Layers, Ruler, Type, DollarSign, Hash, Box
} from 'lucide-react';
import { useTheme } from '@/components/ui/ThemeProvider';
// Import shared types
import { ShoppingItem, Category, ItemRelationship } from './types';
// Import UI components
import ComplementaryItemsManager from './ComplementaryItemsManager';
import Select from '@/components/ui/Select';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

interface ShoppingTabProps {
  newItem: Omit<ShoppingItem, 'id'>;
  editingItem: ShoppingItem | null;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  addItem: () => void;
  saveEdit: () => void;
  categories: Category[];
  sizeUnits: Record<string, string[]>;
  shoppingItems: ShoppingItem[];
  getItemsByCategory: () => Record<string, ShoppingItem[]>;
  startEdit: (item: ShoppingItem) => void;
  deleteItem: (id: string) => void;
  jsonPreview: string;
  // New props for complementary items
  itemRelationships: ItemRelationship[];
  addItemRelationship: (relationship: ItemRelationship) => void;
  removeItemRelationship: (index: number) => void;
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
  getItemsByCategory,
  jsonPreview,
  // Add new props destructuring
  itemRelationships,
  addItemRelationship,
  removeItemRelationship
}) => {
  const theme = useTheme();
  const [showForm, setShowForm] = useState(false);
  const [activeCategory, setActiveCategory] = useState('all');
  const [showComplementary, setShowComplementary] = useState(false);
  
  // Get filtered items based on active category
  const getFilteredItems = () => {
    if (activeCategory === 'all') return shoppingItems;
    return shoppingItems.filter(item => item.category === activeCategory);
  };
  
  // Get category icon for display
  const getCategoryIcon = (category: string) => {
    switch(category) {
      case 'spirits': return <Wine className="w-4 h-4 text-primary" />;
      case 'mixers': return <Droplet className="w-4 h-4 text-accent-teal" />;
      case 'ice': return <Snowflake className="w-4 h-4 text-primary-light" />;
      case 'meat': return <Beef className="w-4 h-4 text-accent-amber" />;
      case 'sides': return <Salad className="w-4 h-4 text-success" />;
      case 'condiments': return <UtensilsCrossed className="w-4 h-4 text-warning" />;
      case 'supplies': return <Package className="w-4 h-4 text-accent-pink" />;
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
            <div className="flex space-x-3">
              <Button 
                onClick={() => setShowComplementary(!showComplementary)}
                variant={showComplementary ? "solid" : "outline"}
                color="primary"
                className={showComplementary ? "bg-indigo-600" : "bg-white"}
              >
                <Link size={18} className="mr-2" />
                <span>Artículos Complementarios</span>
              </Button>
              
              <Button 
                onClick={() => setShowForm(!showForm)}
                variant={showForm ? "outline" : "solid"}
                color="primary"
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
              </Button>
            </div>
          </div>
          
          {/* Summary Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3">
              <div className="text-sm opacity-80">Total Artículos</div>
              <div className="text-xl font-bold">{shoppingItems.length}</div>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3">
              <div className="text-sm opacity-80">Costo Total</div>
              <div className="text-xl font-extrabold">S/ {shoppingItems.reduce((sum, item) => sum + (item.cost * item.units), 0).toFixed(2)}</div>
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
            
            {/* Name field in the form */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Input
                  type="text"
                  name="name"
                  value={newItem.name}
                  onChange={handleInputChange}
                  placeholder="ej. Ron Cartavio"
                  label="Nombre del Artículo"
                  variant="secondary"
                  icon={<Type size={16} />}
                />
              </div>
              
              <div>
                <Input
                  type="url"
                  name="url"
                  value={newItem.url}
                  onChange={handleInputChange}
                  placeholder="https://..."
                  label="URL del Producto"
                  variant="secondary"
                  icon={<Link size={16} />}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-blue-800 mb-1">Categoría</label>
                <Select
                  name="category"
                  value={newItem.category}
                  onChange={handleInputChange}
                  variant="secondary"
                  icon={<Layers size={16} />}
                >
                  {categories.map(cat => (
                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                  ))}
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-1 gap-4 mt-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Input
                    type="number"
                    name="cost"
                    value={newItem.cost}
                    onChange={handleInputChange}
                    min="0"
                    step="0.1"
                    placeholder="0.00"
                    label="Precio (S/)"
                    variant="secondary"
                    leftAddon={<DollarSign size={16} />}
                  />
                </div>
                
                <div>
                  <Input
                    type="number"
                    name="units"
                    value={newItem.units}
                    onChange={handleInputChange}
                    min="1"
                    placeholder="1"
                    label="Unidades"
                    variant="secondary"
                    icon={<Hash size={16} />}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 mt-5 gap-4 ml-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div>
                    <Input
                      type="text"
                      name="size"
                      value={newItem.size}
                      onChange={handleInputChange}
                      placeholder="ej. Botella 750"
                      label="Tamaño"
                      variant="secondary"
                      icon={<Box size={16} />}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-blue-800 mb-1">Unidad de Medida</label>
                    <Select
                      name="sizeUnit"
                      value={newItem.sizeUnit}
                      onChange={handleInputChange}
                      variant="secondary"
                      icon={<Ruler size={16} />}
                    >
                      {sizeUnits[newItem.category].map(unit => (
                        <option key={unit} value={unit}>{unit}</option>
                      ))}
                    </Select>
                  </div>
                </div>
                
                <div>
                  <Input
                    type="number"
                    name="servings"
                    value={newItem.servings}
                    onChange={handleInputChange}
                    min="0"
                    placeholder="0"
                    label="Porciones"
                    variant="secondary"
                    icon={<PlusCircle size={16} />}
                  />
                </div>
              </div>
            </div>
            
            <div className="mt-5 flex justify-end">
              <Button
                variant="outline"
                color="primary"
                onClick={() => {
                  setShowForm(false);
                }}
                className="mr-3"
              >
                Cancelar
              </Button>
              
              {editingItem ? (
                <Button
                  variant="gradient"
                  color="primary"
                  onClick={() => {
                    saveEdit();
                    setShowForm(false);
                  }}
                  className="flex items-center"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Guardar Cambios
                </Button>
              ) : (
                <Button
                  variant="gradient"
                  color="success"
                  onClick={() => {
                    addItem();
                    setShowForm(false);
                  }}
                  className="flex items-center"
                >
                  <PlusCircle className="w-4 h-4 mr-2" />
                  Agregar Artículo
                </Button>
              )}
            </div>
          </div>
        )}
        
        {/* Add a hint about complementary items when adding items to the shopping list */}
        {showForm && (
          <div className="bg-indigo-50 rounded-xl p-4 border border-indigo-100 m-5">
            <div className="flex items-start">
              <Link className="w-5 h-5 text-indigo-600 mr-2 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-indigo-800 font-medium">¿Sabías que puedes vincular artículos complementarios?</p>
                <p className="text-sm text-indigo-700 mt-1">
                  Después de agregar tus artículos, usa la sección "Artículos Complementarios" para crear relaciones
                  entre productos que se consumen juntos, como hamburguesas y panes, o ron y cola.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Complementary Items Manager - conditionally rendered */}
      {showComplementary && (
        <ComplementaryItemsManager 
          shoppingItems={shoppingItems}
          itemRelationships={itemRelationships}
          addItemRelationship={addItemRelationship}
          removeItemRelationship={removeItemRelationship}
        />
      )}
      
      {/* Filter Tabs */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
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
                {getCategoryIcon(category.value)}
                <span className="ml-2">{category.label}</span>
                <span className={`ml-2 ${activeCategory === category.value ? 'bg-white/30' : 'bg-gray-200'} text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center`}>
                  {categoryItems.length}
                </span>
              </Button>
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
              {getFilteredItems().map((item) => (
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
              
              {getFilteredItems().length === 0 && (
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
                <td colSpan={6} className="px-6 py-4 text-right text-gray-700">
                  {activeCategory === 'all' 
                    ? 'Total de compras:' 
                    : `Total de ${getCategoryLabel(activeCategory)}:`}
                </td>
                <td className="px-6 py-4 text-gray-900 font-bold">
                  S/ {getFilteredTotal().toFixed(2)}
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
          <Button 
            variant="ghost"
            color="primary"
            size="sm"
            onClick={() => {
              const el = document.getElementById('json-preview');
              if (el) el.classList.toggle('hidden');
            }}
            className="text-sm"
          >
            Mostrar/Ocultar
          </Button>
        </div>
        <div id="json-preview" className="hidden">
          <pre className="text-xs overflow-auto max-h-64 text-slate-700 font-mono p-4">{jsonPreview}</pre>
        </div>
      </div>
    </div>
  );
};

export default ShoppingTab;