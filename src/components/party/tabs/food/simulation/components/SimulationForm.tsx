import React, { useState } from 'react';
import { 
  ChevronDown, Plus, Trash2, Beef, 
  Salad, UtensilsCrossed, Package, Utensils, LinkIcon
} from 'lucide-react';
import Button from '@/components/ui/Button';
import { ShoppingItem } from '@/types/shopping';
import Badge from '@/components/ui/Badge';

interface SimulationFormProps {
  confidenceLevel: number;
  simulationCount: number;
  setConfidenceLevel: (level: number) => void;
  setSimulationCount: (count: number) => void;
  shoppingItems: ShoppingItem[];
  runFoodSimulation: (selectedFoodItems?: string[]) => void;
  simulationRun: boolean;
  showItemSelection?: boolean; // New prop to control whether to show item selection
  showRunButton?: boolean; // Added prop to control whether to show the Run button
  itemRelationships?: { primaryItemId: string; secondaryItemId: string; ratio: number }[];
}

const SimulationForm: React.FC<SimulationFormProps> = ({
  confidenceLevel,
  simulationCount,
  setConfidenceLevel,
  setSimulationCount,
  shoppingItems,
  runFoodSimulation,
  showItemSelection = true,
  showRunButton = false, // Set default to false
  itemRelationships = []
}) => {
  const [showItemsModal, setShowItemsModal] = useState(false);
  const [selectedFoodItems, setSelectedFoodItems] = useState<string[]>([]);
  const [isSimulating, setIsSimulating] = useState(false);

  // Confidence level options for the dropdown
  const confidenceLevelOptions = [
    { value: 80, label: "Mínimo para una estimación básica" },
    { value: 90, label: "Recomendado para planificación normal" },
    { value: 95, label: "Recomendado para planificación cuidadosa" },
    { value: 99, label: "Nivel máximo de seguridad en la estimación" }
  ];

  // Simulation count options for the dropdown
  const simulationOptions = [
    { value: 100, label: "Rápido pero menos preciso" },
    { value: 500, label: "Balance entre velocidad y precisión" },
    { value: 1000, label: "Precisión buena" },
    { value: 5000, label: "Precisión muy alta" }
  ];

  // Handle confidence level change
  const handleConfidenceLevelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setConfidenceLevel(Number.parseInt(e.target.value));
  };

  // Handle simulation count change
  const handleSimulationsChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSimulationCount(Number.parseInt(e.target.value));
  };
  
  // Filter food-related items
  const availableFoodItems = shoppingItems.filter(item => 
    ['meat', 'sides', 'condiments'].includes(item.category)
  );
  
  // Function to find complementary items for a given item ID
  const findComplementaryItemIds = (itemId: string): string[] => {
    const relatedItems: string[] = [];
    
    // Check for relationships where this item is involved
    itemRelationships.forEach(rel => {
      if (rel.primaryItemId === itemId) {
        relatedItems.push(rel.secondaryItemId);
      } else if (rel.secondaryItemId === itemId) {
        // Also check if this item is a secondary item
        relatedItems.push(rel.primaryItemId);
      }
    });
    
    return relatedItems;
  };
  
  // Toggle food item selection, handling complementary items
  const toggleFoodItem = (itemId: string) => {
    if (selectedFoodItems.includes(itemId)) {
      // If deselecting an item
      setSelectedFoodItems(selectedFoodItems.filter(id => id !== itemId));
    } else {
      // If selecting an item
      const complementaryIds = findComplementaryItemIds(itemId);
      
      // Add both the selected item and any complementary items
      const newSelectedItems = [...selectedFoodItems, itemId];
      
      // Add any complementary items that aren't already selected
      complementaryIds.forEach(compId => {
        if (!newSelectedItems.includes(compId)) {
          newSelectedItems.push(compId);
        }
      });
      
      setSelectedFoodItems(newSelectedItems);
    }
  };

  // Run the simulation
  const runSimulation = () => {
    if (selectedFoodItems.length === 0 && showItemSelection) {
      return;
    }
    
    if (showItemSelection) {
      runFoodSimulation(selectedFoodItems);
    } else {
      // If we're not showing item selection, run with all food items
      const foodItems = shoppingItems
        .filter(item => ['meat', 'sides', 'condiments'].includes(item.category))
        .map(item => item.id);
      
      runFoodSimulation(foodItems);
    }
  };

  // Wrap the runSimulation function to handle loading state
  const handleSimulation = async () => {
    setIsSimulating(true);
    try {
      await runSimulation();
    } finally {
      setIsSimulating(false);
    }
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
    <>
      {/* Confidence Level and Simulation Count Section */}
      <div className="px-6 py-4 bg-warning-light/20 border-b border-warning-light">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Confidence Level Dropdown */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Nivel de Confianza</label>
            <div className="relative">
              <select
                value={confidenceLevel}
                onChange={handleConfidenceLevelChange}
                className="block w-full rounded-md border border-gray-300 py-2 px-3 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-warning focus:border-warning appearance-none text-gray-700"
              >
                {confidenceLevelOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.value}% - {option.label}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                <ChevronDown className="w-5 h-5 text-gray-400" />
              </div>
            </div>
            <p className="mt-1 text-xs text-gray-500">
              Un nivel de confianza más alto requerirá más unidades pero reducirá el riesgo de quedarse sin provisiones.
            </p>
          </div>

          {/* Simulation Count Dropdown */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Número de Simulaciones</label>
            <div className="relative">
              <select
                value={simulationCount}
                onChange={handleSimulationsChange}
                className="block w-full rounded-md border border-gray-300 py-2 px-3 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-warning focus:border-warning appearance-none text-gray-700"
              >
                {simulationOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.value.toLocaleString()} - {option.label}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                <ChevronDown className="w-5 h-5 text-gray-400" />
              </div>
            </div>
            <p className="mt-1 text-xs text-gray-500">
              Más simulaciones producen resultados más precisos pero requieren más tiempo de cálculo.
            </p>
          </div>
        </div>
        
        {/* Run Simulation Button - Show only if showRunButton is true and not showing item selection */}
        {showRunButton && !showItemSelection && (
          <div className="flex justify-center mt-6">
            <Button
              variant="gradient"
              color="warning"
              size="lg"
              onClick={handleSimulation}
              className="px-6"
              isLoading={isSimulating}
            >
              Ejecutar Simulación Monte Carlo
            </Button>
          </div>
        )}
      </div>
      
      {/* Rest of the form only shown if showItemSelection is true */}
      {showItemSelection && (
        <div className="p-6 bg-white border-t border-gray-200">
          <div className="border-t border-warning-light/20 pt-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <Utensils className="w-5 h-5 mr-2 text-warning" />
                <h2 className="text-lg font-medium text-gray-800">Selección de Alimentos</h2>
              </div>
              <Button 
                variant="gradient"
                color="warning"
                size="sm"
                onClick={() => setShowItemsModal(true)}
              >
                <Plus className="w-4 h-4 mr-2" />
                Agregar Alimentos
              </Button>
            </div>

            {/* Selected Food Items */}
            {selectedFoodItems.length === 0 ? (
              <div className="text-center py-8 border-2 border-dashed border-warning-light rounded-lg">
                <Utensils className="w-12 h-12 text-warning mx-auto mb-3" />
                <p className="text-gray-700 mb-1 font-medium">No has seleccionado ningún alimento</p>
                <p className="text-sm text-gray-600">Haz clic en &quot;Agregar Alimentos&quot; para comenzar la simulación</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
                {selectedFoodItems.map((itemId) => {
                  const item = shoppingItems.find(item => item.id === itemId);
                  if (!item) return null;
                  
                  // Find complementary item IDs for this item
                  const complementaryIds = findComplementaryItemIds(itemId);
                  const hasComplementary = complementaryIds.length > 0;
                  
                  return (
                    <div
                      key={itemId}
                      className={`flex items-center justify-between ${
                        hasComplementary 
                          ? "bg-indigo-50 border border-indigo-200"
                          : "bg-warning-light/20 border border-warning-light"
                      } rounded-lg p-3`}
                    >
                      <div>
                        <div className="font-medium text-warning-dark flex items-center">
                          {item.name}
                          {hasComplementary && (
                            <Badge 
                              variant="primary" 
                              size="sm"
                              className="ml-2"
                              icon={<LinkIcon className="w-3 h-3" />}
                            >
                              Complementario
                            </Badge>
                          )}
                        </div>
                        <div className="text-xs text-warning">
                          {formatCategory(item.category)} • {item.size} {item.sizeUnit} • {item.servings} porciones/unidad
                        </div>
                        
                        {/* Show list of complementary items if any */}
                        {hasComplementary && (
                          <div className="mt-1 text-xs text-indigo-600">
                            Complementa con: {
                              complementaryIds.map(id => {
                                const compItem = shoppingItems.find(item => item.id === id);
                                return compItem?.name || '';
                              }).join(', ')
                            }
                          </div>
                        )}
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
              <div className="fixed inset-0 z-50" style={{ backgroundColor: 'rgba(0, 0, 0, 0.8)' }}>
                <div className="flex flex-col w-full h-full">
                  {/* Modal Header */}
                  <div className="bg-warning text-white px-6 py-4 flex justify-between items-center">
                    <h2 className="text-xl font-semibold flex items-center">
                      <Utensils size={24} className="mr-3" />
                      Agregar Alimentos
                    </h2>
                    <button 
                      onClick={() => setShowItemsModal(false)}
                      className="text-white hover:text-yellow-200 transition-colors"
                    >
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                  </div>
                  
                  {/* Modal Content */}
                  <div className="flex-1 bg-white p-8 overflow-y-auto">
                    <div className="max-w-6xl mx-auto">
                      {['meat', 'sides', 'condiments'].map(category => (
                        <div key={category} className="mb-10">
                          <h3 className="text-xl font-semibold mb-4 flex items-center">
                            {getCategoryIcon(category)}
                            <span className="ml-2">{formatCategory(category)}</span>
                          </h3>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {availableFoodItems
                              .filter(item => item.category === category)
                              .map(item => {
                                // Check if this item has complementary relationships
                                const complementaryIds = findComplementaryItemIds(item.id);
                                const isComplementary = complementaryIds.length > 0;
                                const isSelected = selectedFoodItems.includes(item.id);
                                
                                // Check if any complementary items are already selected
                                const hasSelectedComplementary = complementaryIds.some(id => 
                                  selectedFoodItems.includes(id)
                                );
                                
                                return (
                                  <div 
                                    key={item.id} 
                                    onClick={() => toggleFoodItem(item.id)}
                                    className={`
                                      p-4 rounded-lg border cursor-pointer transition-all duration-200
                                      ${isSelected 
                                        ? 'border-warning bg-warning-light shadow-md' 
                                        : hasSelectedComplementary
                                          ? 'border-indigo-300 bg-indigo-50'
                                          : isComplementary
                                            ? 'border-indigo-200 bg-indigo-50/50'
                                            : 'border-gray-200 hover:bg-gray-50'
                                      }
                                    `}
                                  >
                                    <div className="flex justify-between items-start">
                                      <div>
                                        <h4 className="font-semibold text-gray-800 flex items-center">
                                          {item.name}
                                          {isComplementary && (
                                            <Badge 
                                              variant="primary" 
                                              size="sm" 
                                              className="ml-2"
                                              icon={<LinkIcon className="w-3 h-3" />}
                                            >
                                              Complementario
                                            </Badge>
                                          )}
                                        </h4>
                                        <p className="text-sm text-gray-600 mt-1">
                                          {item.size} {item.sizeUnit} • {item.servings} porciones/unidad
                                        </p>
                                        <p className="text-sm font-medium text-gray-700 mt-1">
                                          S/ {item.cost.toFixed(2)}
                                        </p>
                                        
                                        {/* Show complementary items */}
                                        {isComplementary && (
                                          <p className="mt-2 text-xs text-indigo-600">
                                            Complementa con: {
                                              complementaryIds.map(id => {
                                                const compItem = shoppingItems.find(item => item.id === id);
                                                return compItem?.name || '';
                                              }).join(', ')
                                            }
                                          </p>
                                        )}
                                      </div>
                                      
                                      <div className="ml-2">
                                        {isSelected ? (
                                          <div className="w-6 h-6 bg-warning rounded-full flex items-center justify-center">
                                            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                          </div>
                                        ) : (
                                          <div className="w-6 h-6 border-2 border-gray-300 rounded-full"></div>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                );
                              })}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Modal Footer */}
                  <div className="bg-gray-100 px-6 py-4 border-t border-gray-200 flex justify-between items-center">
                    <div className="text-sm text-gray-500">
                      {selectedFoodItems.length} items seleccionados
                    </div>
                    <div className="flex space-x-3">
                      <Button
                        variant="outline"
                        color="primary"
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
              </div>
            )}

            {/* Run Simulation Button - Only show if we have items and showRunButton is true */}
            {selectedFoodItems.length > 0 && showRunButton && (
              <div className="flex justify-center">
                <Button
                  variant="gradient"
                  color="warning"
                  size="lg"
                  onClick={handleSimulation}
                  className="px-6"
                  isLoading={isSimulating}
                >
                  Ejecutar Simulación Monte Carlo
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default SimulationForm;