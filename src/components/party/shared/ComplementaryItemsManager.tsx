import React, { useState } from 'react';
import { Link, Trash2, Plus, Info, Zap, ShoppingBag, Coffee } from 'lucide-react';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Select from '@/components/ui/Select';
import { ShoppingItem, ItemRelationship } from '../types';

// Define props interface
interface ComplementaryItemsManagerProps {
  shoppingItems: ShoppingItem[];
  itemRelationships: ItemRelationship[];
  addItemRelationship: (relationship: ItemRelationship) => void;
  removeItemRelationship: (index: number) => void;
}

// Type for grouped items
type GroupedItems = {
  [K in ShoppingItem['category']]?: ShoppingItem[];
};

const ComplementaryItemsManager: React.FC<ComplementaryItemsManagerProps> = ({
  shoppingItems,
  itemRelationships,
  addItemRelationship,
  removeItemRelationship
}) => {
  // Component state
  const [selectedPrimaryItem, setSelectedPrimaryItem] = useState("");
  const [selectedSecondaryItem, setSelectedSecondaryItem] = useState("");
  const [ratio, setRatio] = useState(1);
  const [showForm, setShowForm] = useState(false);
  
  // Group items by category for easier selection
  const groupedItems = shoppingItems.reduce<GroupedItems>((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category]?.push(item);
    return acc;
  }, {});
  
  // Format category name for display
  const formatCategory = (category: ShoppingItem['category']): string => {
    switch(category) {
      case 'spirits': return 'Licores';
      case 'mixers': return 'Mezcladores';
      case 'ice': return 'Hielo';
      case 'meat': return 'Carnes';
      case 'sides': return 'Guarniciones';
      case 'condiments': return 'Condimentos';
      case 'supplies': return 'Suministros';
      default: return category;
    }
  };
  
  // Handle adding a new relationship
  const handleAddRelationship = () => {
    if (selectedPrimaryItem && selectedSecondaryItem && ratio > 0) {
      addItemRelationship({
        primaryItemId: selectedPrimaryItem,
        secondaryItemId: selectedSecondaryItem,
        ratio: ratio
      });
      
      // Reset form
      setSelectedPrimaryItem("");
      setSelectedSecondaryItem("");
      setRatio(1);
      setShowForm(false);
    }
  };
  
  // Get item name by ID
  const getItemName = (id: string): string => {
    const item = shoppingItems.find(item => item.id === id);
    return item ? item.name : 'Unknown Item';
  };
  
  // Generate a helpful example based on real items in the list
  const generateExample = () => {
    const hamburger = shoppingItems.find(item => item.name.toLowerCase().includes('hambur') && item.category === 'meat');
    const bun = shoppingItems.find(item => item.name.toLowerCase().includes('pan') && item.category === 'sides');
    
    if (hamburger && bun) {
      return `Por ejemplo: ${hamburger.name} (1) y ${bun.name} (1) - cada hamburguesa necesita un pan.`;
    }
    
    const spirit = shoppingItems.find(item => item.category === 'spirits');
    const mixer = shoppingItems.find(item => item.category === 'mixers');
    
    if (spirit && mixer) {
      return `Por ejemplo: ${spirit.name} (1) y ${mixer.name} (3) - para hacer tragos con proporción 1:3.`;
    }
    
    return "Por ejemplo: Ron (1) y Coca-Cola (3) - para hacer Cuba Libres con proporción 1:3.";
  };
  
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 px-4 py-3 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Link className="w-5 h-5 mr-2" />
            <h3 className="font-medium">Artículos Complementarios</h3>
          </div>
          <Button
            variant={showForm ? "outline" : "solid"}
            color="primary"
            size="sm"
            className={showForm ? "bg-white/20 text-white border-white/30" : ""}
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? "Cancelar" : <><Plus size={16} className="mr-1" /> Agregar Relación</>}
          </Button>
        </div>
      </div>
      
      {showForm && (
        <div className="p-4 border-b border-gray-200 bg-indigo-50">
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h4 className="font-medium text-gray-800 mb-3">Nueva Relación de Consumo</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <Select
                  label="Artículo Principal"
                  value={selectedPrimaryItem}
                  onChange={(e) => setSelectedPrimaryItem(e.target.value)}
                  variant="primary"
                  icon={<ShoppingBag size={16} />}
                >
                  <option value="">Seleccionar artículo</option>
                  {Object.entries(groupedItems).map(([category, items]) => (
                    <optgroup key={category} label={formatCategory(category as ShoppingItem['category'])}>
                      {items?.map(item => (
                        <option key={item.id} value={item.id}>{item.name}</option>
                      ))}
                    </optgroup>
                  ))}
                </Select>
              </div>
              
              <div>
                <Select
                  label="Artículo Complementario"
                  value={selectedSecondaryItem}
                  onChange={(e) => setSelectedSecondaryItem(e.target.value)}
                  disabled={!selectedPrimaryItem}
                  variant="primary"
                  icon={<Coffee size={16} />}
                >
                  <option value="">Seleccionar artículo</option>
                  {Object.entries(groupedItems).map(([category, items]) => (
                    <optgroup key={category} label={formatCategory(category as ShoppingItem['category'])}>
                      {items
                        ?.filter(item => item.id !== selectedPrimaryItem)
                        .map(item => (
                          <option key={item.id} value={item.id}>{item.name}</option>
                        ))
                      }
                    </optgroup>
                  ))}
                </Select>
              </div>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Proporción (unidades del complementario por cada unidad del principal)
              </label>
              <input
                type="number"
                min="0.1"
                step="0.1"
                value={ratio}
                onChange={(e) => setRatio(parseFloat(e.target.value) || 1)}
                className="block w-full rounded-md border border-indigo-300 py-2 px-3 bg-white shadow-sm 
                focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 
                focus:ring-opacity-50"
              />
              <p className="text-sm text-gray-500 mt-1">
                Ejemplo: Si cada hamburguesa necesita un pan, la proporción es 1. Si cada trago lleva 3 partes de refresco por 1 de licor, la proporción sería 3.
              </p>
            </div>
            
            <div className="bg-indigo-50 p-3 rounded-lg mb-4">
              <div className="flex">
                <Info className="w-5 h-5 text-indigo-600 mr-2 flex-shrink-0" />
                <p className="text-sm text-indigo-700">
                  {generateExample()} Cuando actualices las cantidades de un artículo, sus complementarios se actualizarán automáticamente.
                </p>
              </div>
            </div>
            
            <div className="flex justify-end">
              <Button 
                variant="outline" 
                color="primary" 
                onClick={() => setShowForm(false)}
                className="mr-2"
              >
                Cancelar
              </Button>
              <Button 
                variant="solid" 
                color="primary" 
                onClick={handleAddRelationship}
                disabled={!selectedPrimaryItem || !selectedSecondaryItem}
              >
                Guardar Relación
              </Button>
            </div>
          </div>
        </div>
      )}
      
      <div className="p-4">
        {itemRelationships.length === 0 ? (
          <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
            <Link className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-700 mb-1 font-medium">No hay relaciones de artículos definidas</p>
            <p className="text-sm text-gray-600 mb-4">
              Define relaciones entre artículos complementarios, como hamburguesas y panes, o ron y cola.
            </p>
            <Button
              variant="outline"
              color="primary"
              onClick={() => setShowForm(true)}
            >
              <Plus size={16} className="mr-1" />
              Crear Relación
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <h4 className="font-medium text-gray-800">Relaciones Activas:</h4>
            <div className="grid grid-cols-1 gap-3">
              {itemRelationships.map((relation, index) => (
                <div key={index} className="flex items-center justify-between bg-indigo-50 border border-indigo-100 rounded-lg p-3">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center mr-3">
                      <Zap className="w-4 h-4 text-indigo-600" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-800">
                        {getItemName(relation.primaryItemId)} 
                        <span className="mx-2 text-indigo-400">→</span> 
                        {getItemName(relation.secondaryItemId)}
                      </div>
                      <div className="text-sm text-gray-600">
                        Por cada unidad de <span className="font-medium">{getItemName(relation.primaryItemId)}</span> se necesitan <Badge variant="primary" size="sm">{relation.ratio}</Badge> unidades de <span className="font-medium">{getItemName(relation.secondaryItemId)}</span>
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    color="primary"
                    size="sm"
                    onClick={() => removeItemRelationship(index)}
                    className="p-1 text-indigo-400 hover:text-indigo-600 hover:bg-indigo-100 rounded-full"
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              ))}
            </div>
            
            {/* Summary statistics */}
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 mt-6">
              <div className="flex items-start">
                <Info className="w-5 h-5 text-gray-500 mr-2 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-700 font-medium">Comportamiento de Artículos Complementarios</p>
                  <p className="text-sm text-gray-600 mt-1">
                    Cuando modificas la cantidad de un artículo principal, sus complementarios se actualizarán automáticamente para mantener la proporción correcta. Este cálculo también afecta la planificación de compras.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ComplementaryItemsManager;