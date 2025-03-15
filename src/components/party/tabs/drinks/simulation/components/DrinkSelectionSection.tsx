import React from 'react';
import { 
  Wine, 
  Beer, 
  Droplet, 
  Snowflake, 
  Package, 
  Link as LinkIcon
} from 'lucide-react';
import { ShoppingItem, ItemRelationship } from '@/types';
import Badge from '@/components/ui/Badge';

interface DrinkSelectionSectionProps {
  shoppingItems: ShoppingItem[];
  selectedDrinkItems: string[];
  setSelectedDrinkItems: (itemIds: string[]) => void;
  itemRelationships?: ItemRelationship[];
}

const DrinkSelectionSection: React.FC<DrinkSelectionSectionProps> = ({
  shoppingItems,
  selectedDrinkItems,
  setSelectedDrinkItems,
  itemRelationships = []
}) => {
  // Filter drink-related items
  const availableDrinkItems = shoppingItems.filter(item => 
    ['spirits', 'mixers', 'beer', 'wine', 'ice', 'supplies'].includes(item.category)
  );
  
  // Function to find complementary items for a given item ID
  const findComplementaryItemIds = (itemId: string): string[] => {
    const relatedItems: string[] = [];
    itemRelationships.forEach(rel => {
      if (rel.primaryItemId === itemId) {
        relatedItems.push(rel.secondaryItemId);
      } else if (rel.secondaryItemId === itemId) {
        relatedItems.push(rel.primaryItemId);
      }
    });
    return relatedItems;
  };

  // Toggle drink item selection, handling complementary items
  const toggleDrinkItem = (itemId: string) => {
    if (selectedDrinkItems.includes(itemId)) {
      setSelectedDrinkItems(selectedDrinkItems.filter(id => id !== itemId));
    } else {
      const complementaryIds = findComplementaryItemIds(itemId);
      const newSelectedItems = [...selectedDrinkItems, itemId];
      complementaryIds.forEach(compId => {
        if (!newSelectedItems.includes(compId)) {
          newSelectedItems.push(compId);
        }
      });
      setSelectedDrinkItems(newSelectedItems);
    }
  };
  
  // Get category icon and formatted name
  const getCategoryInfo = (category: string) => {
    switch(category) {
      case 'spirits':
        return { icon: <Wine className="w-4 h-4 text-primary" />, name: 'Licores' };
      case 'beer':
        return { icon: <Beer className="w-4 h-4 text-accent-amber" />, name: 'Cerveza' };
      case 'wine':
        return { icon: <Wine className="w-4 h-4 text-accent-pink" />, name: 'Vino' };
      case 'mixers':
        return { icon: <Droplet className="w-4 h-4 text-accent-teal" />, name: 'Mezcladores' };
      case 'ice':
        return { icon: <Snowflake className="w-4 h-4 text-primary-light" />, name: 'Hielo' };
      case 'supplies':
        return { icon: <Package className="w-4 h-4 text-accent-pink" />, name: 'Suministros' };
      default:
        return { icon: <Package className="w-4 h-4 text-gray-500" />, name: category };
    }
  };

  return (
    <div className="bg-white border rounded-lg">
      <div className="p-4 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Wine className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-medium text-gray-800">Selección de Bebidas</h2>
          </div>
          <div className="text-sm text-gray-500">
            {selectedDrinkItems.length} items seleccionados
          </div>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {['spirits', 'beer', 'wine', 'mixers', 'ice', 'supplies'].map(category => {
          const { icon, name } = getCategoryInfo(category);
          const categoryItems = availableDrinkItems.filter(item => item.category === category);

          if (categoryItems.length === 0) return null;

          return (
            <div key={category}>
              <h3 className="flex items-center gap-2 font-medium text-gray-800 mb-3 pb-2 border-b">
                {icon}
                {name}
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {categoryItems.map(item => {
                  const complementaryIds = findComplementaryItemIds(item.id);
                  const isComplementary = complementaryIds.length > 0;
                  const isSelected = selectedDrinkItems.includes(item.id);
                  const hasSelectedComplementary = complementaryIds.some(id => 
                    selectedDrinkItems.includes(id)
                  );

                  return (
                    <button
                      key={item.id}
                      onClick={() => toggleDrinkItem(item.id)}
                      className={`
                        p-3 rounded-lg text-left transition-all duration-200
                        ${isSelected 
                          ? 'bg-primary-light border-primary ring-1 ring-primary' 
                          : hasSelectedComplementary
                            ? 'bg-indigo-50 border-indigo-200'
                            : 'bg-white border-gray-200 hover:bg-gray-50'
                        }
                        border
                      `}
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex-1">
                          <div className="font-medium text-gray-800 flex items-center gap-2">
                            {item.name}
                            {isComplementary && (
                              <Badge 
                                variant="primary" 
                                size="sm"
                                icon={<LinkIcon className="w-3 h-3" />}
                              >
                                Complementario
                              </Badge>
                            )}
                          </div>
                          <div className="text-xs text-gray-600 mt-1">
                            {item.size} {item.sizeUnit} • {item.servings} porciones • S/ {item.cost.toFixed(2)}
                          </div>
                          {isComplementary && (
                            <div className="mt-1 text-xs text-indigo-600">
                              Complementa con: {
                                complementaryIds
                                  .map(id => shoppingItems.find(item => item.id === id)?.name)
                                  .filter(Boolean)
                                  .join(', ')
                              }
                            </div>
                          )}
                        </div>
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center
                          ${isSelected 
                            ? 'bg-primary border-primary text-white'
                            : 'border-gray-300'
                          }`}
                        >
                          {isSelected && (
                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DrinkSelectionSection;