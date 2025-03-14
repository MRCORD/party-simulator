import React, { useState } from 'react';
import { 
  ChevronDown, Plus, Trash2, Beef, 
  Salad, UtensilsCrossed, Package, Utensils, Info
} from 'lucide-react';
import Button from '@/components/ui/Button';
import { ShoppingItem } from '@/types/shopping';

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
}

const SimulationForm: React.FC<SimulationFormProps> = ({
  confidenceLevel,
  simulationCount,
  setConfidenceLevel,
  setSimulationCount,
  shoppingItems,
  runFoodSimulation,
  simulationRun,
  showItemSelection = true,
  showRunButton = false // Set default to false
}) => {
  const [showForm, setShowForm] = useState(false);
  const [showItemsModal, setShowItemsModal] = useState(false);
  const [selectedFoodItems, setSelectedFoodItems] = useState<string[]>([]);
  
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
  
  // Add food item to selection
  const toggleFoodItem = (itemId: string) => {
    setSelectedFoodItems(prev => {
      if (prev.includes(itemId)) {
        return prev.filter(id => id !== itemId);
      } else {
        return [...prev, itemId];
      }
    });
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
              onClick={runSimulation}
              className="px-6"
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

            {/* Food Selection Modal - This would be a dialog/modal in a real implementation */}
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

            {/* Run Simulation Button - Only show if we have items and showRunButton is true */}
            {selectedFoodItems.length > 0 && showRunButton && (
              <div className="flex justify-center">
                <Button
                  variant="gradient"
                  color="warning"
                  size="lg"
                  onClick={runSimulation}
                  className="px-6"
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