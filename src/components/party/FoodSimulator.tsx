"use client"

import React, { useState } from "react";
import { Utensils, Users, ChevronDown, Plus, Trash2, RefreshCw } from "lucide-react";
import { useTheme } from '@/components/ui/ThemeProvider';

interface FoodItem {
  id: string;
  name: string;
  category: 'meat' | 'sides' | 'condiments';
  servingsPerUnit: number;
  cost: number;
  servingSize: string;
  prepTime: string;
}

interface SimulationResult {
  mean: number;
  median: number;
  percentile95: number;
  min: number;
  max: number;
}

const FoodSimulator: React.FC = () => {
  const theme = useTheme();

  // State for the main parameters
  const [attendees, setAttendees] = useState(50);
  const [confidenceLevel, setConfidenceLevel] = useState(95);
  const [simulations, setSimulations] = useState(1000);
  const [simulationRun, setSimulationRun] = useState(false);
  const [selectedFoodItems, setSelectedFoodItems] = useState<FoodItem[]>([]);
  const [menuModalOpen, setMenuModalOpen] = useState(false);
  
  // Available food items that can be selected
  const availableFoodItems: FoodItem[] = [
    {
      id: "hamburger",
      name: "Hamburguesa",
      category: "meat",
      servingsPerUnit: 1,
      cost: 8.5,
      servingSize: "180g",
      prepTime: "Medium",
    },
    {
      id: "hotdog",
      name: "Hot Dog",
      category: "meat",
      servingsPerUnit: 1,
      cost: 6.0,
      servingSize: "150g",
      prepTime: "Quick",
    },
    {
      id: "anticucho",
      name: "Anticucho",
      category: "meat",
      servingsPerUnit: 1,
      cost: 9.0,
      servingSize: "150g",
      prepTime: "Medium",
    },
    {
      id: "chickenWings",
      name: "Alitas de Pollo",
      category: "meat",
      servingsPerUnit: 6,
      cost: 15.0,
      servingSize: "300g (6 pcs)",
      prepTime: "Medium",
    },
    {
      id: "potatoSalad",
      name: "Ensalada de Papa",
      category: "sides",
      servingsPerUnit: 5,
      cost: 12.0,
      servingSize: "100g",
      prepTime: "Can prepare ahead",
    },
    {
      id: "chips",
      name: "Papas Fritas",
      category: "sides",
      servingsPerUnit: 6,
      cost: 8.0,
      servingSize: "80g",
      prepTime: "Quick",
    },
    {
      id: "guacamole",
      name: "Guacamole",
      category: "condiments",
      servingsPerUnit: 8,
      cost: 10.0,
      servingSize: "30g",
      prepTime: "Can prepare ahead",
    },
  ];
  
  // Sample simulation results
  const simulationResults: Record<string, SimulationResult> = {
    hamburger: { mean: 32.5, median: 33, percentile95: 38, min: 25, max: 42 },
    anticucho: { mean: 28.7, median: 29, percentile95: 35, min: 22, max: 39 },
    hotdog: { mean: 18.3, median: 18, percentile95: 22, min: 14, max: 26 },
    chickenWings: { mean: 15.2, median: 15, percentile95: 19, min: 10, max: 22 },
    potatoSalad: { mean: 22.4, median: 22, percentile95: 28, min: 18, max: 32 },
    chips: { mean: 32.5, median: 32, percentile95: 40, min: 25, max: 42 },
    guacamole: { mean: 18.8, median: 19, percentile95: 24, min: 15, max: 29 },
  };

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
    setSimulations(Number.parseInt(e.target.value));
  };
  
  // Add food item to selection
  const addFoodItem = (item: FoodItem) => {
    if (!selectedFoodItems.find((i) => i.id === item.id)) {
      setSelectedFoodItems([...selectedFoodItems, item]);
    }
  };

  // Remove food item from selection
  const removeFoodItem = (itemId: string) => {
    setSelectedFoodItems(selectedFoodItems.filter((item) => item.id !== itemId));
  };

  // Run the simulation
  const runSimulation = () => {
    // In a real implementation, this would run the actual simulation
    setSimulationRun(true);
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
      {/* Header */}
      <div className={`${theme.getGradient('warning')} px-4 py-3`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Utensils className="w-5 h-5 mr-2 text-white" />
            <h3 className="font-medium">Simulación de Comida</h3>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-3 gap-6 p-6 bg-warning-light/10">
        {/* Attendees */}
        <div className="flex flex-col items-center justify-center bg-white rounded-lg p-4 shadow-sm">
          <p className="text-sm font-semibold text-warning-dark uppercase tracking-wide mb-1">ASISTENTES</p>
          <div className="flex items-center">
            <Users className="w-5 h-5 text-warning mr-2 opacity-75" />
            <span className="text-3xl font-bold text-gray-800">{attendees}</span>
          </div>
        </div>

        {/* Confidence Level */}
        <div className="flex flex-col items-center justify-center bg-white rounded-lg p-4 shadow-sm">
          <p className="text-sm font-semibold text-warning-dark uppercase tracking-wide mb-1">NIVEL DE CONFIANZA</p>
          <p className="text-3xl font-bold text-gray-800">{confidenceLevel}%</p>
        </div>

        {/* Simulation Count */}
        <div className="flex flex-col items-center justify-center bg-white rounded-lg p-4 shadow-sm">
          <p className="text-sm font-semibold text-warning-dark uppercase tracking-wide mb-1">SIMULACIONES</p>
          <p className="text-3xl font-bold text-gray-800">{simulations.toLocaleString()}</p>
        </div>
      </div>

      {/* Settings */}
      <div className="p-6 grid grid-cols-2 gap-6 bg-white">
        {/* Confidence Level Dropdown */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Nivel de Confianza</label>
          <div className="relative">
            <select
              value={confidenceLevel}
              onChange={handleConfidenceLevelChange}
              className="block w-full rounded-md border border-gray-300 py-2 px-3 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none text-gray-700"
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
        </div>

        {/* Simulation Count Dropdown */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Número de Simulaciones</label>
          <div className="relative">
            <select
              value={simulations}
              onChange={handleSimulationsChange}
              className="block w-full rounded-md border border-gray-300 py-2 px-3 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none text-gray-700"
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
        </div>
      </div>

      {/* Food Selection Section */}
      <div className="p-6 border-t border-warning-light/20">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <Utensils className="w-5 h-5 mr-2 text-warning" />
            <h2 className="text-lg font-medium text-gray-800">Selección de Alimentos</h2>
          </div>
          <button 
            onClick={() => setMenuModalOpen(true)}
            className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded-md shadow-sm text-white ${theme.getGradient('warning')}`}
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
            <p className="text-sm text-gray-600">Haz clic en "Agregar Alimentos" para empezar</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
            {selectedFoodItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between bg-warning-light/20 border border-warning-light rounded-lg p-3"
              >
                <div>
                  <div className="font-medium text-warning-dark">{item.name}</div>
                  <div className="text-xs text-warning">
                    {item.category === "meat"
                      ? "Carne"
                      : item.category === "sides"
                        ? "Guarniciones"
                        : "Condimentos"} • {item.servingSize}
                  </div>
                </div>
                <button
                  onClick={() => removeFoodItem(item.id)}
                  className="p-1 text-warning hover:text-warning-dark hover:bg-warning-light rounded-full"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Food Selection Modal - This would be a dialog/modal in a real implementation */}
        {menuModalOpen && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-auto">
              <div className="p-4 border-b border-gray-200 flex justify-between">
                <h3 className="text-lg font-medium">Agregar Alimentos</h3>
                <button onClick={() => setMenuModalOpen(false)} className="text-gray-400 hover:text-gray-500">
                  ×
                </button>
              </div>
              <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                {availableFoodItems.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <h4 className="font-medium">{item.name}</h4>
                      <p className="text-sm text-gray-500">{item.servingSize}</p>
                    </div>
                    <button
                      onClick={() => {
                        addFoodItem(item);
                        setMenuModalOpen(false);
                      }}
                      className="px-3 py-1 bg-blue-600 text-white rounded-md text-sm"
                    >
                      Agregar
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Run Simulation Button */}
        {selectedFoodItems.length > 0 && (
          <div className="flex justify-center">
            <button
              onClick={runSimulation}
              className={`inline-flex items-center px-4 py-2 text-sm font-medium rounded-md shadow-sm text-white ${theme.getGradient('warning')}`}
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Ejecutar Simulación
            </button>
          </div>
        )}
      </div>

      {/* Simulation Results - Only shown after simulation is run */}
      {simulationRun && selectedFoodItems.length > 0 && (
        <div className="p-6 border-t border-gray-200">
          <h3 className="text-lg font-medium text-gray-800 mb-4">Resultados de la Simulación</h3>
          
          <p className="text-gray-700 mb-4">
            La simulación ha generado resultados basados en {simulations.toLocaleString()} iteraciones con un
            nivel de confianza del {confidenceLevel}%. A continuación se muestran los requisitos estimados de
            comida para tu evento.
          </p>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Alimento
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Categoría
                  </th>
                  <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nivel {confidenceLevel}%
                  </th>
                  <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Unidades Necesarias
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Costo Total
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {selectedFoodItems.map((item) => {
                  const result = simulationResults[item.id] || { percentile95: 0 };
                  const unitsNeeded = Math.ceil(result.percentile95 / item.servingsPerUnit);
                  const totalCost = unitsNeeded * item.cost;

                  return (
                    <tr key={item.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{item.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.category === "meat"
                          ? "Carne"
                          : item.category === "sides"
                            ? "Guarnición"
                            : "Condimento"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <span className="px-2 py-1 inline-flex text-sm leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                          {result.percentile95.toFixed(0)} porciones
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <span className="px-2 py-1 inline-flex text-sm leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          {unitsNeeded} unidades
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium text-gray-900">
                        S/ {totalCost.toFixed(2)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr className="bg-gray-50">
                  <td colSpan={4} className="px-6 py-4 text-right text-sm font-medium text-gray-700">
                    Costo Total:
                  </td>
                  <td className="px-6 py-4 text-right text-sm font-bold text-gray-900">
                    S/ {selectedFoodItems
                      .reduce((sum, item) => {
                        const result = simulationResults[item.id] || { percentile95: 0 };
                        const unitsNeeded = Math.ceil(result.percentile95 / item.servingsPerUnit);
                        return sum + unitsNeeded * item.cost;
                      }, 0)
                      .toFixed(2)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default FoodSimulator;