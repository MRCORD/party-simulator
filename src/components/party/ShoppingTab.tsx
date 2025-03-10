"use client";

import React from 'react';
import { 
  ShoppingCart, FileText, Edit, Trash2, PlusCircle, 
  Save, Package, ChevronDown, TrendingUp, Tag,
  Wine, Droplets, Snowflake, Beef, Salad, Utensils  
} from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Table from '@/components/ui/Table';
import Alert from '@/components/ui/Alert';
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
  categories, sizeUnits,
  editingItem, 
  handleInputChange,
  addItem, saveEdit, startEdit, deleteItem,
  getCategoryTotal,
  getItemsByCategory,
  jsonPreview
}) => {
  const theme = useTheme();
  
  const groupedItems = getItemsByCategory();
  
  // Category icons
  const getCategoryIcon = (category: string) => {
    switch(category) {
      case 'spirits': return <Wine className="w-4 h-4 text-primary" />;
      case 'mixers': return <Droplets className="w-4 h-4 text-primary" />;
      case 'ice': return <Snowflake className="w-4 h-4 text-primary" />;
      case 'meat': return <Beef className="w-4 h-4 text-error" />;
      case 'sides': return <Salad className="w-4 h-4 text-success" />;
      case 'condiments': return <Utensils className="w-4 h-4 text-warning" />;
      case 'supplies': return <Package className="w-4 h-4 text-slate-600" />;
      case 'other': return <Tag className="w-4 h-4 text-primary" />;
      default: return <Package className="w-4 h-4 text-slate-600" />;
    }
  };
  
  // Define columns for item tables
  const getItemColumns = (categoryKey: string) => [
    { 
      accessor: 'name' as const, 
      Header: 'Nombre',
      Cell: ({ value }: { value: string }) => (
        <div className="font-medium text-slate-800">{value}</div>
      )
    },
    { 
      accessor: 'size' as const, 
      Header: 'Tamaño',
      Cell: ({ value, row }: { value: number; row: ShoppingItem }) => 
        `${value} ${row.sizeUnit}`
    },
    { 
      accessor: 'cost' as const, 
      Header: 'Precio',
      Cell: ({ value }: { value: number }) => `S/ ${value.toFixed(2)}`
    },
    { accessor: 'units' as const, Header: 'Unidades' },
    { 
      accessor: 'servings' as const, 
      Header: 'Porciones',
      Cell: ({ value, row }: { value: number; row: ShoppingItem }) => 
        value * row.units
    },
    { 
      accessor: 'totalCost' as const, 
      Header: 'Total',
      Cell: ({ value }: { value: number }) => 
        `S/ ${value.toFixed(2)}`
    },
    {
      accessor: 'id' as const,
      Header: 'Acciones',
      Cell: ({ row }: { row: ShoppingItem }) => (
        <div className="flex justify-end gap-2">
          <Button 
            variant="ghost"
            size="sm"
            onClick={() => startEdit(row)}
            className="text-primary hover:text-primary-dark bg-primary-light hover:bg-primary-light/80 p-2 rounded-full"
          >
            <Edit className="w-4 h-4" />
          </Button>
          <Button 
            variant="ghost"
            size="sm"
            onClick={() => deleteItem(row.id)}
            className="text-error hover:text-error-dark bg-error-light hover:bg-error-light/80 p-2 rounded-full"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <Card>
        <Card.Header 
          title="Agregar Nuevo Artículo" 
          icon={<ShoppingCart className="w-5 h-5 text-primary" />}
          gradient
        />
        <Card.Content>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="space-y-2">
              <label className="block text-base font-medium text-slate-700">Nombre del Artículo</label>
              <input
                type="text"
                name="name"
                className={`block w-full rounded-lg border-slate-300 shadow-sm p-3 border focus:border-primary ${theme.getFocusRing()}`}
                value={newItem.name}
                onChange={handleInputChange}
                placeholder="ej. Ron Cartavio"
              />
            </div>
            
            <div className="space-y-2">
              <label className="block text-base font-medium text-slate-700">Categoría</label>
              <div className="relative">
                <select
                  name="category"
                  className={`block w-full rounded-lg border-slate-300 shadow-sm p-3 border focus:border-primary ${theme.getFocusRing()} appearance-none`}
                  value={newItem.category}
                  onChange={handleInputChange}
                >
                  {categories.map(cat => (
                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 pointer-events-none" size={18} />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="block text-base font-medium text-slate-700">Precio (S/)</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500">S/</span>
                <input
                  type="number"
                  name="cost"
                  className={`block w-full rounded-lg border-slate-300 shadow-sm p-3 pl-8 border focus:border-primary ${theme.getFocusRing()}`}
                  value={newItem.cost}
                  onChange={handleInputChange}
                  min="0"
                  step="1"
                  placeholder="0.00"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="block text-base font-medium text-slate-700">Unidades</label>
              <input
                type="number"
                name="units"
                className={`block w-full rounded-lg border-slate-300 shadow-sm p-3 border focus:border-primary ${theme.getFocusRing()}`}
                value={newItem.units}
                onChange={handleInputChange}
                min="1"
                placeholder="1"
              />
            </div>
            
            <div className="space-y-2">
              <label className="block text-base font-medium text-slate-700">Tamaño</label>
              <input
                type="number"
                name="size"
                className={`block w-full rounded-lg border-slate-300 shadow-sm p-3 border focus:border-primary ${theme.getFocusRing()}`}
                value={newItem.size}
                onChange={handleInputChange}
                min="0"
                step="0.1"
                placeholder="0.0"
              />
            </div>
            
            <div className="space-y-2">
              <label className="block text-base font-medium text-slate-700">Unidad de Medida</label>
              <div className="relative">
                <select
                  name="sizeUnit"
                  className={`block w-full rounded-lg border-slate-300 shadow-sm p-3 border focus:border-primary ${theme.getFocusRing()} appearance-none`}
                  value={newItem.sizeUnit}
                  onChange={handleInputChange}
                >
                  {sizeUnits[newItem.category].map(unit => (
                    <option key={unit} value={unit}>{unit}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 pointer-events-none" size={18} />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="block text-base font-medium text-slate-700">Porciones</label>
              <input
                type="number"
                name="servings"
                className={`block w-full rounded-lg border-slate-300 shadow-sm p-3 border focus:border-primary ${theme.getFocusRing()}`}
                value={newItem.servings}
                onChange={handleInputChange}
                min="0"
                placeholder="0"
              />
            </div>
            
            <div className="flex items-end">
              {editingItem ? (
                <Button
                  onClick={saveEdit}
                  color="primary"
                  className="w-full flex items-center justify-center"
                >
                  <Save className="w-5 h-5 mr-2" />
                  Guardar Cambios
                </Button>
              ) : (
                <Button
                  onClick={addItem}
                  color="success"
                  className="w-full flex items-center justify-center"
                >
                  <PlusCircle className="w-5 h-5 mr-2" />
                  Agregar Artículo
                </Button>
              )}
            </div>
          </div>
        </Card.Content>
      </Card>
      
      <Card>
        <Card.Header 
          title="Lista de Compras" 
          icon={<ShoppingCart className="w-5 h-5 text-primary" />}
          gradient
        />
        <Card.Content>
          <div className="space-y-8">
            {categories.map(cat => (
              groupedItems[cat.value] && groupedItems[cat.value].length > 0 ? (
                <div key={cat.value} className="space-y-3">
                  <div className="flex items-center gap-2 border-b pb-3">
                    {getCategoryIcon(cat.value)}
                    <h4 className="font-bold text-lg text-slate-800">{cat.label}</h4>
                  </div>
                  
                  <Table
                    data={groupedItems[cat.value]}
                    columns={getItemColumns(cat.value)}
                    hoverable
                    compact
                    footer={
                      <tr className="bg-slate-100 font-medium">
                        <td colSpan={5} className="px-4 py-3 text-sm text-right rounded-bl-lg">Total de {cat.label}:</td>
                        <td className="px-4 py-3 text-sm font-bold text-success-dark">S/ {getCategoryTotal(cat.value).toFixed(2)}</td>
                        <td className="rounded-br-lg"></td>
                      </tr>
                    }
                  />
                </div>
              ) : null
            ))}
            
            <div className="border-t pt-6 flex justify-between items-center">
              <div className="text-xl font-bold text-primary-dark">Costo Total de la Lista:</div>
              <div className="text-xl font-bold text-success-dark bg-success-light px-6 py-3 rounded-lg">
                S/ {shoppingItems.reduce((sum, item) => sum + (item.cost * item.units), 0).toFixed(2)}
              </div>
            </div>
          </div>
        </Card.Content>
      </Card>
      
      <Card variant="default">
        <Card.Header 
          title="Datos JSON (Para Desarrolladores)" 
          icon={<FileText className="w-5 h-5 text-slate-600" />}
        />
        <Card.Content className="bg-white p-4 rounded-lg border border-slate-200 overflow-hidden">
          <pre className="text-xs overflow-auto max-h-64 text-slate-700 font-mono">{jsonPreview}</pre>
        </Card.Content>
      </Card>
    </div>
  );
};

export default ShoppingTab;