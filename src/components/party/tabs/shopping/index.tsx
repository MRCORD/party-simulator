"use client";

import React, { useState } from 'react';
import { ShoppingCart, FileText, Link, PlusCircle, X } from 'lucide-react';
import { useTheme } from '@/components/ui/ThemeProvider';
import Button from '@/components/ui/Button';

// Import components
import ItemList from './components/ItemList';
import ItemForm from './components/ItemForm';
import HeaderStats from './components/HeaderStats';
import ComplementaryItemsManager from '../../ComplementaryItemsManager';

// Import types
import { ShoppingItem, ItemRelationship, Category } from '@/types';

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
  
  // Get total cost of filtered items
  const getFilteredTotal = () => {
    return getFilteredItems().reduce((total, item) => total + (item.cost * item.units), 0);
  };
  
  // Get category label function
  const getCategoryLabel = (categoryValue: string): string => {
    const category = categories.find(cat => cat.value === categoryValue);
    return category ? category.label : categoryValue;
  };

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className={theme.getGradient('primary') + ' p-5 text-white'}>
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
          <HeaderStats shoppingItems={shoppingItems} getItemsByCategory={getItemsByCategory} />
        </div>
        
        {/* Add/Edit Form - Conditionally shown */}
        {showForm && (
          <ItemForm 
            newItem={newItem}
            editingItem={editingItem}
            categories={categories}
            sizeUnits={sizeUnits}
            handleInputChange={handleInputChange}
            addItem={addItem}
            saveEdit={saveEdit}
            onCancel={() => setShowForm(false)}
          />
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
      
      {/* Item List */}
      <ItemList 
        shoppingItems={shoppingItems}
        getFilteredItems={getFilteredItems}
        getFilteredTotal={getFilteredTotal}
        startEdit={startEdit}
        deleteItem={deleteItem}
        setShowForm={setShowForm}
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
        categories={categories}
        getCategoryLabel={getCategoryLabel}
      />
      
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