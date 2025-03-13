"use client";
import React, { useState, useEffect } from 'react';
import { usePartyStore } from '@/store/usePartyStore';
import { 
  Utensils, ChevronRight, AlertTriangle, Target, Plus,
  Trash2, RefreshCw, Info, PieChartIcon, BarChart4, 
  Users, AlertCircle, Beef, Salad, UtensilsCrossed 
} from 'lucide-react';
import { 
  PieChart, Pie, AreaChart, Area, BarChart, Bar, Cell, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  ReferenceLine 
} from 'recharts';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { useTheme } from '@/components/ui/ThemeProvider';
import { EaterProfile } from './types';

interface FoodItem {
  id: string;
  name: string;
  category: 'meat' | 'sides' | 'condiments';
  servingsPerUnit: number;
  cost: number;
  servingSize: string;
  baseConsumptionRate: number;
  avgServingsPerConsumer: number;
}

interface RiskResult {
  servings: number;
  riskPercentage: number;
}

interface SimulationResultItem {
  mean: number;
  min: number;
  max: number;
  recommended: number;
  recommendedUnits: number;
  risks: {
    low: RiskResult;
    medium: RiskResult;
    high: RiskResult;
  };
}

interface DistributionDataPoint {
  value: number;
  frequency: number;
}

interface FoodSimulatorProps {
  useOverrideAttendees?: boolean;
  overrideAttendees?: number;
  integratedMode?: boolean;
}

const FoodSimulator: React.FC<FoodSimulatorProps> = ({ 
  useOverrideAttendees = false,
  overrideAttendees = 0,
  integratedMode = false 
}) => {
  const theme = useTheme();
  
  // Get attendees from props or store
  const storeAttendees = usePartyStore(state => state.attendees);
  const attendees = useOverrideAttendees ? overrideAttendees : storeAttendees;
  
  // Get simulation state from store
  const simRunFromStore = usePartyStore(state => state.simulationRun);
  const simResultsFromStore = usePartyStore(state => state.simulationResults);
  const setSimulationRun = usePartyStore(state => state.setSimulationRun);
  const setSimulationResults = usePartyStore(state => state.setSimulationResults);
  
  // User-adjustable eater profiles
  const [eaterProfiles, setEaterProfiles] = useState<EaterProfile[]>([
    { name: "Light Eater", percentage: 25, servingsMultiplier: 0.7 },
    { name: "Average Eater", percentage: 50, servingsMultiplier: 1.0 },
    { name: "Heavy Eater", percentage: 25, servingsMultiplier: 1.5 }
  ]);
  
  // Confidence level for risk assessment
  const [confidenceLevel, setConfidenceLevel] = useState<number>(90);
  
  // Selected food items
  const [selectedFoodItems, setSelectedFoodItems] = useState<FoodItem[]>([]);
  const [foodSelectionOpen, setFoodSelectionOpen] = useState<boolean>(false);
  
  // Simulation state
  const [simulationRun, setLocalSimulationRun] = useState<boolean>(simRunFromStore);
  const [simulationResults, setLocalSimulationResults] = useState<Record<string, SimulationResultItem>>(
    simResultsFromStore || {}
  );
  
  // Sync state with store when appropriate
  useEffect(() => {
    // Update store when local state changes
    if (simulationRun !== simRunFromStore) {
      setSimulationRun(simulationRun);
    }
    
    if (simulationResults !== simResultsFromStore && Object.keys(simulationResults).length > 0) {
      setSimulationResults(simulationResults);
    }
  }, [simulationRun, simulationResults]);
  
  // Available food items catalog
  const availableFoodItems: FoodItem[] = [
    {
      id: "hamburger",
      name: "Hamburguesa",
      category: "meat",
      servingsPerUnit: 1,
      cost: 8.5,
      servingSize: "180g",
      baseConsumptionRate: 0.7, // 70% of people consume this item
      avgServingsPerConsumer: 1.2
    },
    {
      id: "hotdog",
      name: "Hot Dog",
      category: "meat",
      servingsPerUnit: 1,
      cost: 6.0,
      servingSize: "150g",
      baseConsumptionRate: 0.5,
      avgServingsPerConsumer: 1.0
    },
    {
      id: "anticucho",
      name: "Anticucho",
      category: "meat",
      servingsPerUnit: 1,
      cost: 9.0,
      servingSize: "150g",
      baseConsumptionRate: 0.6,
      avgServingsPerConsumer: 1.5
    },
    {
      id: "chickenWings",
      name: "Alitas de Pollo",
      category: "meat",
      servingsPerUnit: 6,
      cost: 15.0,
      servingSize: "300g (6 pcs)",
      baseConsumptionRate: 0.45,
      avgServingsPerConsumer: 4.0
    },
    {
      id: "potatoSalad",
      name: "Ensalada de Papa",
      category: "sides",
      servingsPerUnit: 5,
      cost: 12.0,
      servingSize: "100g",
      baseConsumptionRate: 0.8,
      avgServingsPerConsumer: 0.7
    },
    {
      id: "chips",
      name: "Papas Fritas",
      category: "sides",
      servingsPerUnit: 6,
      cost: 8.0,
      servingSize: "80g",
      baseConsumptionRate: 0.9,
      avgServingsPerConsumer: 0.8
    },
    {
      id: "guacamole",
      name: "Guacamole",
      category: "condiments",
      servingsPerUnit: 8,
      cost: 10.0,
      servingSize: "30g",
      baseConsumptionRate: 0.7,
      avgServingsPerConsumer: 0.5
    }
  ];
  
  // Add food item to selection
  const addFoodItem = (item: FoodItem) => {
    if (!selectedFoodItems.find(i => i.id === item.id)) {
      setSelectedFoodItems([...selectedFoodItems, item]);
    }
  };
  
  // Remove food item from selection
  const removeFoodItem = (itemId: string) => {
    setSelectedFoodItems(selectedFoodItems.filter(item => item.id !== itemId));
  };
  
  // Update eater profile percentage
  const updateProfilePercentage = (index: number, newPercentage: number) => {
    // Ensure we don't exceed 100% total
    const otherProfilesTotal = eaterProfiles
      .filter((_, i: number) => i !== index)
      .reduce((sum: number, profile: EaterProfile) => sum + profile.percentage, 0);
    
    if (newPercentage + otherProfilesTotal > 100) {
      return; // Don't update if it would exceed 100%
    }
    
    const newProfiles = [...eaterProfiles];
    newProfiles[index].percentage = newPercentage;
    setEaterProfiles(newProfiles);
  };
  
  // Run the simulation
  const runSimulation = () => {
    // This would be where actual Monte Carlo simulation runs
    // For now we'll create sample results based on our parameters
    
    const results: Record<string, SimulationResultItem> = {};
    
    selectedFoodItems.forEach(item => {
      // Calculate how many people will consume this item
      const consumers = attendees * item.baseConsumptionRate;
      
      // Calculate baseline servings needed
      let baselineServings = consumers * item.avgServingsPerConsumer;
      
      // Adjust based on eater profiles
      let adjustedServings = 0;
      eaterProfiles.forEach(profile => {
        const profileConsumers = consumers * (profile.percentage / 100);
        adjustedServings += profileConsumers * item.avgServingsPerConsumer * profile.servingsMultiplier;
      });
      
      // Generate "simulated" results with variance
      const mean = adjustedServings;
      const stdDev = adjustedServings * 0.15; // 15% standard deviation
      
      // Confidence level calculations 
      // (1.28 for 80%, 1.65 for 90%, 1.96 for 95%, 2.58 for 99%)
      let zScore;
      switch(confidenceLevel) {
        case 80: zScore = 1.28; break;
        case 90: zScore = 1.65; break;
        case 95: zScore = 1.96; break;
        case 99: zScore = 2.58; break;
        default: zScore = 1.65;
      }
      
      const percentileResult = Math.ceil(mean + (stdDev * zScore));
      const recommendedUnits = Math.ceil(percentileResult / item.servingsPerUnit);
      
      // Out-of-food risk calculations
      const risk80 = calculateOutOfFoodRisk(mean, stdDev, 0.84); // 80% confidence
      const risk90 = calculateOutOfFoodRisk(mean, stdDev, 1.28); // 90% confidence
      const risk95 = calculateOutOfFoodRisk(mean, stdDev, 1.65); // 95% confidence
      
      results[item.id] = {
        mean: Math.round(mean),
        min: Math.round(mean - (stdDev * 2)),
        max: Math.round(mean + (stdDev * 2)),
        recommended: percentileResult,
        recommendedUnits: recommendedUnits,
        risks: {
          low: risk80,
          medium: risk90,
          high: risk95
        }
      };
    });
    
    setLocalSimulationResults(results);
    setLocalSimulationRun(true);
    
    // Also update the global store
    setSimulationResults(results);
    setSimulationRun(true);
  };
  
  // Calculate risk of running out based on normal distribution
  const calculateOutOfFoodRisk = (mean: number, stdDev: number, zScore: number): RiskResult => {
    const servings = Math.round(mean + (stdDev * zScore));
    return {
      servings: servings,
      riskPercentage: Math.round((1 - confidenceLevel/100) * 100)
    };
  };
  
  // Calculate total cost
  const calculateTotalCost = () => {
    return selectedFoodItems
      .reduce((sum, item) => {
        if (!simulationResults[item.id]) return sum;
        
        const unitsNeeded = simulationResults[item.id].recommendedUnits;
        return sum + (unitsNeeded * item.cost);
      }, 0)
      .toFixed(2);
  };
  
  // Chart colors
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];
  
  // Format category name
  const formatCategory = (category: FoodItem['category']): string => {
    switch(category) {
      case 'meat': return 'Carne';
      case 'sides': return 'Guarnición';
      case 'condiments': return 'Condimento';
      default: return category;
    }
  };
  
  // Get distribution data for charts
  const getDistributionData = (itemId: string): DistributionDataPoint[] => {
    const result = simulationResults[itemId];
    if (!result) return [];
    
    const data: DistributionDataPoint[] = [];
    const step = (result.max - result.min) / 10;
    
    for (let i = result.min; i <= result.max; i += step) {
      const value = Math.round(i);
      // Create a bell curve-like distribution
      const frequency = Math.exp(-0.5 * Math.pow(((value - result.mean) / (result.max - result.min)) * 6, 2)) * 100;
      data.push({
        value: value,
        frequency: Math.round(frequency)
      });
    }
    
    return data;
  };

  return (
    <div className="space-y-6">
      {/* Main Configuration Card */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className={`${theme.getGradient('warning')} p-5 text-white`}>
          <div className="flex items-center">
            <Utensils className="w-6 h-6 mr-3" />
            <h2 className="text-xl font-bold">Simulación de Comida</h2>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
            {/* Display attendees count from store (read-only) */}
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3">
              <div className="text-xs uppercase tracking-wide mb-1">Número de Asistentes</div>
              <div className="flex items-center text-2xl font-bold">
                <Users className="w-5 h-5 mr-2" />
                {attendees} personas
              </div>
            </div>
            
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3">
              <div className="text-xs uppercase tracking-wide mb-1">Nivel de Confianza</div>
              <select
                value={confidenceLevel}
                onChange={(e) => setConfidenceLevel(parseInt(e.target.value))}
                className="w-full bg-transparent border-b border-white/50 text-white text-xl font-bold focus:outline-none focus:border-white"
              >
                <option value="80">80% - Mínimo riesgo de escasez (20%)</option>
                <option value="90">90% - Bajo riesgo de escasez (10%)</option>
                <option value="95">95% - Muy bajo riesgo de escasez (5%)</option>
                <option value="99">99% - Riesgo casi nulo de escasez (1%)</option>
              </select>
            </div>
            
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3">
              <div className="text-xs uppercase tracking-wide mb-1">Alimentos Seleccionados</div>
              <div className="text-2xl font-bold flex items-center">
                {selectedFoodItems.length} tipos
                <Button 
                  size="sm" 
                  color="warning" 
                  variant="outline" 
                  className="ml-2 bg-white/10"
                  onClick={() => setFoodSelectionOpen(true)}
                >
                  <Plus size={16} className="mr-1" />
                  Agregar
                </Button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Food Selection Dialog would be here */}
        {foodSelectionOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-2xl w-full">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">Seleccionar Alimentos</h3>
                <button onClick={() => setFoodSelectionOpen(false)} className="p-1">×</button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
                {availableFoodItems.map(item => (
                  <div key={item.id} className="border rounded-lg p-3 flex justify-between items-center">
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-gray-600">{formatCategory(item.category)} · {item.servingSize}</p>
                    </div>
                    <Button 
                      size="sm" 
                      onClick={() => {
                        addFoodItem(item);
                        setFoodSelectionOpen(false);
                      }}
                      disabled={selectedFoodItems.some(i => i.id === item.id)}
                    >
                      {selectedFoodItems.some(i => i.id === item.id) ? 'Agregado' : 'Agregar'}
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        
        {/* Eater Profiles Adjustment */}
        <div className="p-5 border-t border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900">Ajuste de Perfiles de Consumo</h3>
            <div className="text-sm text-gray-600">
              Total: {eaterProfiles.reduce((sum, p) => sum + p.percentage, 0)}%
            </div>
          </div>
          
          <div className="space-y-4">
            {eaterProfiles.map((profile, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between">
                  <label className="text-sm font-medium text-gray-700">{profile.name}</label>
                  <span className="text-sm text-gray-700">{profile.percentage}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={profile.percentage}
                  onChange={(e) => updateProfilePercentage(index, parseInt(e.target.value))}
                  className="w-full"
                />
                <div className="text-xs text-gray-500">
                  {profile.name === "Light Eater" && "Personas que consumen menos que el promedio"}
                  {profile.name === "Average Eater" && "Personas que consumen cantidades regulares"}
                  {profile.name === "Heavy Eater" && "Personas que consumen más que el promedio"}
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-4 bg-amber-50 rounded-lg p-3 border border-amber-100">
            <div className="flex">
              <Info size={18} className="text-amber-600 mr-2 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-amber-800">
                Ajusta estos porcentajes según tu experiencia con los asistentes. Los perfiles influyen directamente 
                en los cálculos de cantidades recomendadas para cada alimento.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Selected Food Items */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className={`${theme.getGradient('warning')} px-4 py-3 text-white`}>
          <div className="flex items-center">
            <Utensils className="w-5 h-5 mr-2" />
            <h3 className="font-medium">Alimentos Seleccionados</h3>
          </div>
        </div>
        
        <div className="p-4">
          {selectedFoodItems.length === 0 ? (
            <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
              <Utensils className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-700 mb-1 font-medium">No hay alimentos seleccionados</p>
              <Button
                variant="outline"
                color="warning"
                className="mt-3"
                onClick={() => setFoodSelectionOpen(true)}
              >
                <Plus size={16} className="mr-1" />
                Agregar Alimentos
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {selectedFoodItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between border border-gray-200 rounded-lg p-3 hover:bg-gray-50"
                  >
                    <div>
                      <div className="font-medium text-gray-800">{item.name}</div>
                      <div className="flex items-center text-xs text-gray-500">
                        {item.category === "meat" ? (
                          <Beef size={14} className="mr-1" />
                        ) : item.category === "sides" ? (
                          <Salad size={14} className="mr-1" />
                        ) : (
                          <UtensilsCrossed size={14} className="mr-1" />
                        )}
                        {formatCategory(item.category)} · {item.servingSize}
                      </div>
                    </div>
                    <button
                      onClick={() => removeFoodItem(item.id)}
                      className="p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
              
              <div className="flex justify-center">
                <Button
                  variant="gradient"
                  color="warning"
                  onClick={runSimulation}
                  className="px-4 py-2"
                >
                  <RefreshCw size={16} className="mr-2" />
                  Calcular Necesidades
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Results Section - only shown after simulation */}
      {simulationRun && selectedFoodItems.length > 0 && (
        <>
          {/* Overview of Results */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className={`${theme.getGradient('warning')} px-4 py-3 text-white`}>
              <div className="flex items-center">
                <BarChart4 className="w-5 h-5 mr-2" />
                <h3 className="font-medium">Resultados de la Simulación</h3>
              </div>
            </div>
            
            <div className="p-5">
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
                <h4 className="font-medium text-gray-900 mb-2">Resumen de la Planificación</h4>
                <p className="text-gray-700">
                  Basado en {attendees} asistentes con un {confidenceLevel}% de nivel de confianza, se han calculado las siguientes cantidades de alimentos.
                  Con estos resultados, tendrás solo un {100 - confidenceLevel}% de probabilidad de quedarte sin comida.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Total Cost */}
                <div className="bg-green-50 rounded-lg p-4 border border-green-100">
                  <h5 className="text-sm font-medium text-green-800 mb-2">Costo Total</h5>
                  <div className="text-3xl font-bold text-green-700">S/ {calculateTotalCost()}</div>
                  <div className="text-sm text-green-600 mt-1">
                    S/ {(parseFloat(calculateTotalCost()) / attendees).toFixed(2)} por persona
                  </div>
                </div>
                
                {/* Risk Level */}
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                  <h5 className="text-sm font-medium text-blue-800 mb-2">Nivel de Confianza</h5>
                  <div className="text-3xl font-bold text-blue-700">{confidenceLevel}%</div>
                  <div className="text-sm text-blue-600 mt-1">
                    {confidenceLevel >= 95 ? 'Muy bajo riesgo de escasez' : 
                     confidenceLevel >= 90 ? 'Bajo riesgo de escasez' : 
                     'Riesgo moderado de escasez'}
                  </div>
                </div>
                
                {/* Items Count */}
                <div className="bg-purple-50 rounded-lg p-4 border border-purple-100">
                  <h5 className="text-sm font-medium text-purple-800 mb-2">Tipos de Alimentos</h5>
                  <div className="text-3xl font-bold text-purple-700">{selectedFoodItems.length}</div>
                  <div className="text-sm text-purple-600 mt-1">
                    {selectedFoodItems.filter(item => item.category === 'meat').length} carnes, {' '}
                    {selectedFoodItems.filter(item => item.category === 'sides').length} guarniciones, {' '}
                    {selectedFoodItems.filter(item => item.category === 'condiments').length} condimentos
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Food Recommendations Table */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className={`${theme.getGradient('warning')} px-4 py-3 text-white`}>
              <div className="flex items-center">
                <Utensils className="w-5 h-5 mr-2" />
                <h3 className="font-medium">Cantidades Recomendadas</h3>
              </div>
            </div>
            
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
                      Porciones Estimadas
                    </th>
                    <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Unidades Recomendadas
                    </th>
                    <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Riesgo de Escasez
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Costo
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {selectedFoodItems.map((item) => {
                    const result = simulationResults[item.id];
                    if (!result) return null;
                    
                    const costForItem = result.recommendedUnits * item.cost;
                    
                    return (
                      <tr key={item.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {item.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatCategory(item.category)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                          <span className="font-medium">{result.recommended}</span> 
                          <span className="text-gray-500 text-xs"> (min: {result.min}, max: {result.max})</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <Badge 
                            variant="warning" 
                            className="text-sm px-2 py-1"
                          >
                            {result.recommendedUnits} unidades
                          </Badge>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <div className="flex flex-col items-center">
                            <div className="text-sm font-medium">
                              {100 - confidenceLevel}% de probabilidad
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                              <div 
                                className="bg-green-600 h-1.5 rounded-full" 
                                style={{width: `${confidenceLevel}%`}}
                              ></div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium">
                          S/ {costForItem.toFixed(2)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot>
                  <tr className="bg-gray-50">
                    <td colSpan={5} className="px-6 py-4 text-right font-medium text-gray-700">
                      Costo Total:
                    </td>
                    <td className="px-6 py-4 text-right font-medium text-gray-900">
                      S/ {calculateTotalCost()}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
            
            <div className="p-4 bg-gray-50 border-t border-gray-200">
              <div className="flex items-start">
                <AlertCircle className="w-5 h-5 text-amber-500 mr-2 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-gray-700">
                  <strong>Nota:</strong> Las cantidades recomendadas se basan en un {confidenceLevel}% de confianza, lo que significa 
                  que hay un {100-confidenceLevel}% de probabilidad de quedarse sin algún alimento. Para planificación más segura, 
                  aumenta el nivel de confianza. Recuerda que estos cálculos son estimaciones basadas en tu configuración 
                  de perfiles de consumo.
                </p>
              </div>
            </div>
          </div>
          
          {/* Visual Distributions - condensed for integrated mode */}
          {!integratedMode && (
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className={`${theme.getGradient('warning')} px-4 py-3 text-white`}>
                <div className="flex items-center">
                  <PieChartIcon className="w-5 h-5 mr-2" />
                  <h3 className="font-medium">Distribución de Consumo</h3>
                </div>
              </div>
              
              <div className="p-5">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Eater Profiles Distribution */}
                  <div className="border rounded-lg p-4">
                    <h4 className="font-medium text-gray-800 mb-4">Perfiles de Consumidores</h4>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={eaterProfiles.map(profile => ({
                              name: profile.name,
                              value: Math.round(attendees * (profile.percentage / 100))
                            }))}
                            cx="50%"
                            cy="50%"
                            labelLine={true}
                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            {eaterProfiles.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip 
                            formatter={(value) => [`${value} personas`, "Cantidad"]}
                          />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                  
                  {/* Cost Distribution */}
                  <div className="border rounded-lg p-4">
                    <h4 className="font-medium text-gray-800 mb-4">Distribución de Costos</h4>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={selectedFoodItems.map(item => {
                              const result = simulationResults[item.id];
                              if (!result) return { name: item.name, value: 0 };
                              return {
                                name: item.name,
                                value: result.recommendedUnits * item.cost
                              };
                            })}
                            cx="50%"
                            cy="50%"
                            labelLine={true}
                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            {selectedFoodItems.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip 
                            formatter={(value: number | string) => {
                              if (typeof value === 'number') {
                                return [`S/ ${value.toFixed(2)}`, "Costo"];
                              }
                              return [value, "Costo"];
                            }}
                          />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
                
                {/* Individual Food Distribution Charts */}
                <div className="mt-6">
                  <h4 className="font-medium text-gray-800 mb-4">Distribución por Alimento</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {selectedFoodItems.map(item => {
                      const result = simulationResults[item.id];
                      if (!result) return null;
                      
                      const distributionData = getDistributionData(item.id);
                      
                      return (
                        <div key={item.id} className="border rounded-lg p-4">
                          <h5 className="font-medium text-gray-700 mb-3">{item.name}</h5>
                          <div className="h-48">
                            <ResponsiveContainer width="100%" height="100%">
                              <AreaChart data={distributionData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="value" label={{ value: "Porciones", position: "insideBottom", offset: -5 }} />
                                <YAxis label={{ value: "Probabilidad", angle: -90, position: "insideLeft" }} />
                                <Tooltip />
                                <Area type="monotone" dataKey="frequency" stroke="#8884d8" fill="#8884d8" />
                                {/* Confidence level marker */}
                                <ReferenceLine 
                                  x={result.recommended} 
                                  stroke="red" 
                                  label={{ value: `${confidenceLevel}%`, position: 'top' }} 
                                />
                              </AreaChart>
                            </ResponsiveContainer>
                          </div>
                          <div className="mt-2 grid grid-cols-3 gap-2 text-xs text-gray-600">
                            <div className="bg-gray-100 p-2 rounded">Min: {result.min}</div>
                            <div className="bg-gray-100 p-2 rounded">Media: {result.mean}</div>
                            <div className="bg-gray-100 p-2 rounded">Max: {result.max}</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Compact version of distributions for integrated mode */}
          {integratedMode && (
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className={`${theme.getGradient('warning')} px-4 py-3 text-white`}>
                <div className="flex items-center">
                  <PieChartIcon className="w-5 h-5 mr-2" />
                  <h3 className="font-medium">Distribución de Consumo</h3>
                </div>
              </div>
              
              <div className="p-5">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Eater Profiles Distribution */}
                  <div className="border rounded-lg p-4">
                    <h4 className="font-medium text-gray-800 mb-4">Perfiles de Consumidores</h4>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={eaterProfiles.map(profile => ({
                              name: profile.name,
                              value: Math.round(attendees * (profile.percentage / 100))
                            }))}
                            cx="50%"
                            cy="50%"
                            labelLine={true}
                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            {eaterProfiles.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip 
                            formatter={(value) => [`${value} personas`, "Cantidad"]}
                          />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                  
                  {/* Cost Distribution */}
                  <div className="border rounded-lg p-4">
                    <h4 className="font-medium text-gray-800 mb-4">Distribución de Costos</h4>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={selectedFoodItems.map(item => {
                              const result = simulationResults[item.id];
                              if (!result) return { name: item.name, value: 0 };
                              return {
                                name: item.name,
                                value: result.recommendedUnits * item.cost
                              };
                            })}
                            cx="50%"
                            cy="50%"
                            labelLine={true}
                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            {selectedFoodItems.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip 
                            formatter={(value: number | string) => {
                              if (typeof value === 'number') {
                                return [`S/ ${value.toFixed(2)}`, "Costo"];
                              }
                              return [value, "Costo"];
                            }}
                          />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Add to Shopping List Button (for integrated mode) */}
          {integratedMode && simulationRun && (
            <div className="bg-white rounded-xl shadow-md overflow-hidden border-2 border-success p-5 text-center">
              <h4 className="font-medium text-lg text-success-dark mb-3">¡Planificación Completa!</h4>
              <p className="text-gray-700 mb-4">
                Has completado la simulación avanzada de comida. Ahora puedes agregar estos ítems a tu lista de compras o
                imprimir un reporte detallado.
              </p>
              <div className="flex justify-center gap-3">
                <Button 
                  variant="gradient" 
                  color="success"
                  size="md"
                >
                  Agregar a Lista de Compras
                </Button>
                <Button 
                  variant="outline" 
                  color="success"
                  size="md"
                >
                  Imprimir Reporte
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default FoodSimulator;