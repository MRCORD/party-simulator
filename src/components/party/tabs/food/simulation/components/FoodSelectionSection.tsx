import React, { useState } from 'react';
import { 
  Utensils, Plus, Trash2, 
  Beef, Salad, UtensilsCrossed, Package 
} from 'lucide-react';
import Button from '@/components/ui/Button';
import { ShoppingItem } from '@/types/shopping';

interface FoodSelectionSectionProps {
  shoppingItems: ShoppingItem[];
  selectedFoodItems: string[];
  setSelectedFoodItems: (itemIds: string[]) => void;
}

const FoodSelectionSection: React.FC<FoodSelectionSectionProps> = ({
  shoppingItems,
  selectedFoodItems,
  setSelectedFoodItems
}) => {
  const [showItemsModal, setShowItemsModal] = useState(false);
  
  // Filter food-related items
  const availableFoodItems = shoppingItems.filter(item => 
    ['meat', 'sides', 'condiments'].includes(item.category)
  );
  
  // Toggle food item selection
  const toggleFoodItem = (itemId: string) => {
    setSelectedFoodItems(
      selectedFoodItems.includes(itemId)
        ? selectedFoodItems.filter(id => id !== itemId)
        : [...selectedFoodItems, itemId]
    );
  };
  
  // Get category icon for display
  const getCategoryIcon = (category: string) => {
    switch(category) {
      case 'meat': return <Beef className="w-4 h-4 text-accent-amber" />;
      case 'sides': return <Salad className="w-4 h-4 text-success" />;
      case 'condiments': return <UtensilsCrossed className="w-4 h-4 text-warning" />;
      default: return <Package className="w-4 h-4 text-gray-500" />;
    }
  };
  
  // Format category name
  const formatCategory = (category: string) => {
    switch (category) {
      case 'meat': return 'Carnes';
      case 'sides': return 'Guarniciones';
      case 'condiments': return 'Condimentos';
      default: return category;
    }
  };
  
  return (
    <div className="p-6 bg-white border-t border-warning-light/20">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <Utensils className="w-5 h-5 mr-2 text-warning" />
          <h2 className="text-lg font-medium text-gray-800">Selección de Alimentos</h2>
        </div>
        <button 
          onClick={() => setShowItemsModal(true)}
          className="inline-flex items-center px-3 py-2 text-sm font-medium rounded-md shadow-sm text-white bg-gradient-to-r from-warning to-accent-amber"
        >
          <Plus className="w-4 h-4 mr-2" />
          Agregar Alimentos
        </button>
      </div>

      {/* Selected Food Items */}
      {selectedFoodItems.length === 0 ? (
        <div className="text-center py-8 border-2 border-dashed border-warning-light rounded-lg">
          <Utensils className="w-12 h-12 text-warning mx-auto mb-3" />
          <p className="text-gray-700 mb-1 font-medium">No has seleccionado ningún alimento</p>
          <p className="text-sm text-gray-600">Haz clic en "Agregar Alimentos" para comenzar la simulación</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
          {selectedFoodItems.map((itemId) => {
            const item = shoppingItems.find(item => item.id === itemId);
            if (!item) return null;
            
            return (
              <div
                key={itemId}
                className="flex items-center justify-between bg-warning-light/20 border border-warning-light rounded-lg p-3"
              >
                <div>
                  <div className="font-medium text-warning-dark">{item.name}</div>
                  <div className="text-xs text-warning">
                    {formatCategory(item.category)} • {item.size} {item.sizeUnit} • {item.servings} porciones/unidad
                  </div>
                </div>
                <button
                  onClick={() => toggleFoodItem(itemId)}
                  className="p-1 text-warning hover:text-warning-dark hover:bg-warning-light rounded-full"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Food Selection Modal */}
      {showItemsModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-auto">
            <div className="p-4 border-b border-gray-200 flex justify-between">
              <h3 className="text-lg font-medium">Agregar Alimentos</h3>
              <button onClick={() => setShowItemsModal(false)} className="text-gray-400 hover:text-gray-500">
                ×
              </button>
            </div>
            <div className="p-4">
              {/* Group by category */}
              {['meat', 'sides', 'condiments'].map(category => (
                <div key={category} className="mb-6">
                  <h4 className="font-medium text-gray-700 mb-2">{formatCategory(category)}</h4>
                  <div className="grid grid-cols-1 gap-2">
                    {availableFoodItems
                      .filter(item => item.category === category)
                      .map((item) => (
                        <div 
                          key={item.id} 
                          className={`flex items-center justify-between p-3 border rounded-lg cursor-pointer
                            ${selectedFoodItems.includes(item.id) 
                              ? 'bg-warning-light border-warning' 
                              : 'hover:bg-gray-50 border-gray-200'
                            }`}
                          onClick={() => toggleFoodItem(item.id)}
                        >
                          <div>
                            <h4 className="font-medium">{item.name}</h4>
                            <p className="text-sm text-gray-500">
                              {item.size} {item.sizeUnit} • {item.servings} porciones/unidad • S/ {item.cost.toFixed(2)}
                            </p>
                          </div>
                          <div className="w-6 h-6 flex items-center justify-center">
                            {selectedFoodItems.includes(item.id) && (
                              <svg className="w-5 h-5 text-warning" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                              </svg>
                            )}
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              ))}
            </div>
            <div className="p-4 border-t border-gray-200 flex justify-end">
              <Button
                variant="outline"
                color="primary"
                className="mr-2"
                onClick={() => setShowItemsModal(false)}
              >
                Cancelar
              </Button>
              <Button
                variant="gradient"
                color="warning"
                onClick={() => setShowItemsModal(false)}
              >
                Confirmar Selección
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FoodSelectionSection;