"use client"

import React, { useState, useEffect } from "react";
import { 
  Utensils, Users, ChevronDown, Plus, Trash2, RefreshCw, 
  AlertCircle, Info, ArrowRight, BarChart4, Save
} from "lucide-react";
import { useTheme } from '@/components/ui/ThemeProvider';
import { 
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, Cell, ReferenceLine 
} from 'recharts';
import { usePartyStore } from '@/store/usePartyStore';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import ProgressBar from '@/components/ui/ProgressBar';
import Alert from '@/components/ui/Alert';
import { EaterProfile, SimulationResult } from './types';

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
  
  // Get data from store
  const {
    attendees: storeAttendees,
    shoppingItems,
    itemRelationships,
    
    // Simulation config
    confidenceLevel,
    eaterProfiles,
    simulationCount,
    simulationResults,
    simulationRun,
    
    // Actions
    setConfidenceLevel,
    setSimulationCount,
    updateEaterProfile,
    runFoodSimulation,
    applySimulationRecommendations
  } = usePartyStore();

  const attendees = useOverrideAttendees ? overrideAttendees : storeAttendees;
  
  // Component state
  const [menuModalOpen, setMenuModalOpen] = useState(false);
  const [selectedFoodItems, setSelectedFoodItems] = useState<string[]>([]);
  const [showDetailedResults, setShowDetailedResults] = useState(false);
  const [highlightedItemId, setHighlightedItemId] = useState<string | null>(null);
  
  // Reset selected items if they're not in the shopping list
  useEffect(() => {
    setSelectedFoodItems(prev => 
      prev.filter(id => shoppingItems.some(item => item.id === id))
    );
  }, [shoppingItems]);
  
  // Automatically run simulation when configuration changes (only if already run once)
  useEffect(() => {
    if (simulationRun && selectedFoodItems.length > 0) {
      runSimulation();
    }
  }, [attendees, confidenceLevel, simulationCount]);
  
  // Filter food-related items
  const availableFoodItems = shoppingItems.filter(item => 
    ['meat', 'sides', 'condiments'].includes(item.category)
  );
  
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
    if (selectedFoodItems.length === 0) {
      return;
    }
    
    runFoodSimulation(selectedFoodItems);
  };
  
  // Calculate totals from simulation results
  const calculateTotals = () => {
    if (!simulationRun || Object.keys(simulationResults).length === 0) {
      return { totalServings: 0, totalUnits: 0, totalCost: 0 };
    }
    
    let totalServings = 0;
    let totalUnits = 0;
    let totalCost = 0;
    
    selectedFoodItems.forEach(itemId => {
      if (simulationResults[itemId]) {
        const result = simulationResults[itemId];
        totalServings += result.recommendedServings;
        totalUnits += result.recommendedUnits;
        totalCost += result.totalCost;
      }
    });
    
    return { totalServings, totalUnits, totalCost };
  };
  
  const { totalServings, totalUnits, totalCost } = calculateTotals();
  
  // Get selected items with their results
  const getSelectedItemsWithResults = () => {
    return selectedFoodItems
      .map(itemId => {
        const item = shoppingItems.find(item => item.id === itemId);
        if (!item) return null;
        
        const result = simulationResults[itemId];
        return { item, result };
      })
      .filter(item => item !== null) as { item: typeof shoppingItems[0], result: SimulationResult }[];
  };
  
  // Handle profile percentage change with automatic adjustment of other profiles
  const handleProfilePercentageChange = (index: number, newValue: number) => {
    // Don't allow values below 1% or above 98%
    if (newValue < 1) newValue = 1;
    if (newValue > 98) newValue = 98;
    
    // Get current profiles and the one being changed
    const currentProfiles = [...eaterProfiles];
    const originalValue = currentProfiles[index].percentage;
    const difference = newValue - originalValue;
    
    if (difference === 0) return;
    
    // Calculate how much we need to adjust other profiles
    const otherProfilesTotal = 100 - originalValue;
    
    // Update the current profile
    updateEaterProfile(index, 'percentage', newValue);
    
    // Adjust other profiles proportionally
    currentProfiles.forEach((profile, i) => {
      if (i !== index) {
        // Calculate new percentage proportionally
        const adjustmentFactor = (100 - newValue) / otherProfilesTotal;
        const adjustedPercentage = Math.round(profile.percentage * adjustmentFactor);
        
        // Ensure we don't go below 1%
        const finalPercentage = Math.max(1, adjustedPercentage);
        updateEaterProfile(i, 'percentage', finalPercentage);
      }
    });
    
    // Ensure percentages sum to 100% by adjusting the last profile
    let total = 0;
    currentProfiles.forEach((profile, i) => {
      if (i !== currentProfiles.length - 1) {
        total += (i === index) ? newValue : profile.percentage;
      }
    });
    
    // Adjust the last profile if it's not the one being changed
    if (index !== currentProfiles.length - 1) {
      const lastProfilePercentage = Math.max(1, 100 - total);
      updateEaterProfile(currentProfiles.length - 1, 'percentage', lastProfilePercentage);
    }
  };
  
  // Handle profile multiplier change
  const handleProfileMultiplierChange = (index: number, value: number) => {
    updateEaterProfile(index, 'servingsMultiplier', value);
  };
  
  // Apply recommendations to shopping list
  const handleApplyRecommendations = () => {
    applySimulationRecommendations();
  };
  
  // Create consumption distribution data for charts
  const createDistributionData = (itemId: string) => {
    if (!simulationResults[itemId] || !simulationResults[itemId].distribution) {
      return [];
    }
    
    return simulationResults[itemId].distribution.map(bin => ({
      range: `${bin.min.toFixed(0)}-${bin.max.toFixed(0)}`,
      frequency: bin.count,
      isRecommended: bin.containsRecommendation
    }));
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
  
  // Get category color
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'meat': return '#f59e0b';
      case 'sides': return '#10b981';
      case 'condiments': return '#ec4899';
      default: return '#6b7280';
    }
  };
  
  // Format risk level as text
  const formatRiskLevel = (risk: number) => {
    if (risk < 5) return 'Muy bajo';
    if (risk < 10) return 'Bajo';
    if (risk < 20) return 'Moderado';
    if (risk < 30) return 'Alto';
    return 'Muy alto';
  };
  
  // Get risk level color
  const getRiskColor = (risk: number) => {
    if (risk < 5) return 'success';
    if (risk < 10) return 'success';
    if (risk < 20) return 'warning';
    if (risk < 30) return 'warning';
    return 'error';
  };
  
  // Profile distribution chart data
  const profileChartData = eaterProfiles.map(profile => ({
    name: profile.name,
    value: profile.percentage,
    multiplier: profile.servingsMultiplier
  }));
  
  const PROFILE_COLORS = ['#10b981', '#6366f1', '#f59e0b'];
  
  // Check if any complementary relationships exist for selected items
  const hasComplementaryRelationships = selectedFoodItems.some(itemId => 
    itemRelationships.some(rel => 
      rel.primaryItemId === itemId || rel.secondaryItemId === itemId
    )
  );

  return (
    <div className="w-full max-w-5xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
      {/* Header */}
      <div className={`${theme.getGradient('warning')} px-4 py-3`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Utensils className="w-5 h-5 mr-2 text-white" />
            <h3 className="font-medium text-white">Simulación Avanzada de Comida</h3>
          </div>
          {integratedMode && (
            <Badge variant="warning" size="sm" className="bg-white/20 text-white">
              Modo Integrado
            </Badge>
          )}
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-6 bg-warning-light/10">
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
          <p className="text-3xl font-bold text-gray-800">{simulationCount.toLocaleString()}</p>
        </div>
      </div>

      {/* Settings */}
      <div className="p-6 bg-white">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
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
        
        {/* Perfiles de Consumo (Directly Integrated) */}
        <div className="mb-6">
          <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
            <Users className="w-4 h-4 mr-2 text-warning" />
            Perfiles de Consumo
          </h4>
          
          {/* Profile Distribution Chart */}
          <div className="bg-gray-50 p-4 rounded-lg mb-4">
            <div className="h-24">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={profileChartData}
                  layout="vertical"
                  barSize={20}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <XAxis type="number" domain={[0, 100]} />
                  <YAxis dataKey="name" type="category" width={100} />
                  <Tooltip 
                    formatter={(value: any, name: any, props: any) => {
                      const { multiplier } = props.payload;
                      return [`${value}% (${multiplier}x consumo)`, 'Distribución'];
                    }}
                  />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                    {profileChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={PROFILE_COLORS[index % PROFILE_COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          {/* Profile Configuration Controls - Directly in the interface */}
          <div className="space-y-4">
            {eaterProfiles.map((profile, index) => (
              <div key={index} className="border rounded-lg p-3" style={{ borderColor: PROFILE_COLORS[index % PROFILE_COLORS.length] }}>
                <div className="flex items-center justify-between mb-2">
                  <h5 className="font-medium" style={{ color: PROFILE_COLORS[index % PROFILE_COLORS.length] }}>{profile.name}</h5>
                  <Badge 
                    variant="success" 
                    size="sm"
                    style={{ 
                      backgroundColor: PROFILE_COLORS[index % PROFILE_COLORS.length] + '20',
                      color: PROFILE_COLORS[index % PROFILE_COLORS.length]
                    }}
                  >
                    {profile.percentage}% de asistentes
                  </Badge>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {/* Percentage Slider */}
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Porcentaje en el Evento</label>
                    <div className="flex items-center">
                      <input 
                        type="range" 
                        min="1" 
                        max="98" 
                        value={profile.percentage} 
                        onChange={(e) => handleProfilePercentageChange(index, parseInt(e.target.value))}
                        className="w-full mr-3"
                      />
                      <span className="w-10 text-center text-sm">{profile.percentage}%</span>
                    </div>
                  </div>
                  
                  {/* Multiplier Slider */}
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">
                      Multiplicador de Consumo
                    </label>
                    <div className="flex items-center">
                      <input 
                        type="range" 
                        min="0.5" 
                        max="3" 
                        step="0.1" 
                        value={profile.servingsMultiplier} 
                        onChange={(e) => handleProfileMultiplierChange(index, parseFloat(e.target.value))}
                        className="w-full mr-3"
                      />
                      <span className="w-10 text-center text-sm">{profile.servingsMultiplier}x</span>
                    </div>
                  </div>
                </div>
                
                <div className="mt-1 text-xs text-gray-500">
                  {profile.servingsMultiplier < 1 
                    ? "Consume menos que el promedio" 
                    : profile.servingsMultiplier > 1 
                      ? "Consume más que el promedio" 
                      : "Consumo promedio"
                  }
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-2 text-xs text-gray-500 flex items-center">
            <Info className="w-3 h-3 mr-1 text-gray-400" />
            <span>
              Los perfiles definen cómo se distribuyen los participantes y cuánto consume cada grupo.
              El total siempre suma 100%.
            </span>
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
        
        {/* Complementary Items Alert */}
        {hasComplementaryRelationships && (
          <Alert 
            variant="info" 
            className="mb-6"
            title="Artículos Complementarios"
          >
            <p>Se detectaron relaciones entre artículos complementarios. La simulación tendrá en cuenta estas relaciones para calcular las cantidades óptimas.</p>
          </Alert>
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
                  color="gray"
                  className="mr-2"
                  onClick={() => setMenuModalOpen(false)}
                >
                  Cancelar
                </Button>
                <Button
                  variant="gradient"
                  color="warning"
                  onClick={() => setMenuModalOpen(false)}
                >
                  Confirmar Selección
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Run Simulation Button */}
        {selectedFoodItems.length > 0 && (
          <div className="flex justify-center">
            <Button
              variant="gradient"
              color="warning"
              size="lg"
              onClick={runSimulation}
              className="px-6"
            >
              <RefreshCw className="w-5 h-5 mr-2" />
              Ejecutar Simulación Monte Carlo
            </Button>
          </div>
        )}
      </div>

      {/* Simulation Results - Only shown after simulation is run */}
      {simulationRun && selectedFoodItems.length > 0 && (
        <div className="p-6 border-t border-gray-200">
          <h3 className="text-lg font-medium text-gray-800 mb-4 flex items-center">
            <BarChart4 className="w-5 h-5 mr-2 text-primary" />
            Resultados de la Simulación
          </h3>
          
          <div className="bg-blue-50 rounded-lg p-4 mb-6">
            <div className="flex">
              <Info className="w-5 h-5 text-primary mr-3 flex-shrink-0" />
              <p className="text-sm text-primary-dark">
                La simulación ha generado resultados basados en {simulationCount.toLocaleString()} iteraciones Monte Carlo con un
                nivel de confianza del {confidenceLevel}%. Los resultados consideran variabilidad en los perfiles de consumo
                y otras incertidumbres estadísticas.
              </p>
            </div>
          </div>
          
          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
              <h4 className="text-sm font-medium text-gray-500 uppercase mb-1">Porciones Totales</h4>
              <p className="text-2xl font-bold">{totalServings.toFixed(0)}</p>
              <p className="text-sm text-gray-500 mt-1">Porciones necesarias ({(totalServings / attendees).toFixed(1)} por persona)</p>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
              <h4 className="text-sm font-medium text-gray-500 uppercase mb-1">Unidades a Comprar</h4>
              <p className="text-2xl font-bold">{totalUnits}</p>
              <p className="text-sm text-gray-500 mt-1">Unidades recomendadas para {confidenceLevel}% de confianza</p>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
              <h4 className="text-sm font-medium text-gray-500 uppercase mb-1">Costo Total</h4>
              <p className="text-2xl font-bold">S/ {totalCost.toFixed(2)}</p>
              <p className="text-sm text-gray-500 mt-1">S/ {(totalCost / attendees).toFixed(2)} por persona</p>
            </div>
          </div>

          <div className="overflow-x-auto mb-6">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Alimento
                  </th>
                  <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nivel {confidenceLevel}%
                  </th>
                  <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Unidades Necesarias
                  </th>
                  <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Riesgo de Escasez
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Costo Total
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {getSelectedItemsWithResults().map(({ item, result }) => (
                  <tr 
                    key={item.id} 
                    className={`hover:bg-gray-50 cursor-pointer ${highlightedItemId === item.id ? 'bg-yellow-50' : ''}`}
                    onClick={() => setHighlightedItemId(highlightedItemId === item.id ? null : item.id)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{item.name}</div>
                      <div className="text-xs text-gray-500">
                        {formatCategory(item.category)} • {item.servings} porciones/unidad
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span className="px-2 py-1 inline-flex text-sm leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                        {result.recommendedServings.toFixed(0)} porciones
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="flex flex-col items-center">
                        <span className="px-2 py-1 inline-flex text-sm leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          {result.recommendedUnits} unidades
                        </span>
                        {item.units !== result.recommendedUnits && (
                          <span className="text-xs mt-1">
                            {item.units < result.recommendedUnits 
                              ? <span className="text-error">Faltan {result.recommendedUnits - item.units}</span>
                              : <span className="text-success">Sobran {item.units - result.recommendedUnits}</span>
                            }
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <Badge 
                        variant={getRiskColor(result.stockoutRisk)} 
                        size="sm"
                      >
                        {result.stockoutRisk.toFixed(1)}% - {formatRiskLevel(result.stockoutRisk)}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium text-gray-900">
                      S/ {result.totalCost.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-gray-50 font-medium">
                  <td colSpan={4} className="px-6 py-4 text-right text-sm font-medium text-gray-700">
                    Costo Total:
                  </td>
                  <td className="px-6 py-4 text-right text-sm font-bold text-gray-900">
                    S/ {totalCost.toFixed(2)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
          
          {/* Detailed Item View */}
          {highlightedItemId && (
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm mb-6 overflow-hidden">
              <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
                <h4 className="font-medium">Detalle de Simulación</h4>
                <button 
                  onClick={() => setHighlightedItemId(null)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  ×
                </button>
              </div>
              <div className="p-4">
                {(() => {
                  const item = shoppingItems.find(item => item.id === highlightedItemId);
                  const result = item ? simulationResults[item.id] : null;
                  
                  if (!item || !result) return null;
                  
                  return (
                    <div>
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-medium text-gray-900">{item.name}</h3>
                          <p className="text-sm text-gray-500">
                            {formatCategory(item.category)} • {item.size} {item.sizeUnit} • {item.servings} porciones/unidad
                          </p>
                        </div>
                        <Badge 
                          variant="warning" 
                          size="md"
                          className="mt-2 sm:mt-0"
                        >
                          Confianza {confidenceLevel}%
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                        <div className="bg-gray-50 rounded-lg p-4">
                          <h5 className="font-medium text-gray-700 mb-3">Estadísticas de Consumo</h5>
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">Consumo Promedio:</span>
                              <span className="font-medium">{result.mean.toFixed(1)} porciones</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">Consumo Mediano:</span>
                              <span className="font-medium">{result.median.toFixed(1)} porciones</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">Percentil {confidenceLevel}%:</span>
                              <span className="font-medium">{result.recommendedServings.toFixed(1)} porciones</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">Rango (Min-Max):</span>
                              <span className="font-medium">{result.min.toFixed(1)} - {result.max.toFixed(1)} porciones</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">Unidades Recomendadas:</span>
                              <span className="font-medium">{result.recommendedUnits} unidades</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">Riesgo de Escasez:</span>
                              <span className="font-medium">{result.stockoutRisk.toFixed(1)}%</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="bg-gray-50 rounded-lg p-4">
                          <h5 className="font-medium text-gray-700 mb-3">Recomendación</h5>
                          <div className="space-y-4">
                            <div>
                              <div className="flex justify-between text-sm mb-1">
                                <span className="text-gray-600">Unidades Actuales:</span>
                                <span className="font-medium">{item.units} unidades</span>
                              </div>
                              <div className="flex justify-between text-sm mb-1">
                                <span className="text-gray-600">Unidades Recomendadas:</span>
                                <span className="font-medium">{result.recommendedUnits} unidades</span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Diferencia:</span>
                                <span className={`font-medium ${
                                  item.units < result.recommendedUnits ? 'text-error' : 'text-success'
                                }`}>
                                  {item.units < result.recommendedUnits 
                                    ? `-${result.recommendedUnits - item.units}` 
                                    : `+${item.units - result.recommendedUnits}`
                                  }
                                </span>
                              </div>
                            </div>
                            
                            <div>
                              <div className="flex justify-between text-sm mb-1">
                                <span className="text-gray-600">Costo Actual:</span>
                                <span className="font-medium">S/ {(item.cost * item.units).toFixed(2)}</span>
                              </div>
                              <div className="flex justify-between text-sm mb-1">
                                <span className="text-gray-600">Costo Recomendado:</span>
                                <span className="font-medium">S/ {result.totalCost.toFixed(2)}</span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Diferencia:</span>
                                <span className={`font-medium ${
                                  item.units < result.recommendedUnits ? 'text-error' : 'text-success'
                                }`}>
                                  {item.units < result.recommendedUnits 
                                    ? `-S/ ${(result.totalCost - (item.cost * item.units)).toFixed(2)}` 
                                    : `+S/ ${((item.cost * item.units) - result.totalCost).toFixed(2)}`
                                  }
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Distribution Chart */}
                      <div className="mb-4">
                        <h5 className="font-medium text-gray-700 mb-3">Distribución de Consumo</h5>
                        <div className="bg-white h-64">
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                              data={createDistributionData(item.id)}
                              margin={{ top: 5, right: 30, left: 20, bottom: 25 }}
                            >
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis 
                                dataKey="range" 
                                angle={-45} 
                                textAnchor="end" 
                                height={50}
                                interval={0}
                                tick={{ fontSize: 10 }}
                              />
                              <YAxis 
                                label={{ 
                                  value: 'Frecuencia', 
                                  angle: -90, 
                                  position: 'insideLeft',
                                  style: { textAnchor: 'middle' }
                                }} 
                              />
                              <Tooltip formatter={(value: any) => [`${value} simulaciones`, 'Frecuencia']} />
                              <Bar dataKey="frequency" fill="#8884d8">
                                {createDistributionData(item.id).map((entry, index) => (
                                  <Cell 
                                    key={`cell-${index}`} 
                                    fill={entry.isRecommended ? '#f59e0b' : '#8884d8'} 
                                  />
                                ))}
                              </Bar>
                              <ReferenceLine x={0} stroke="#666" />
                              <ReferenceLine y={0} stroke="#666" />
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                        <p className="text-xs text-gray-500 mt-2 text-center">
                          Las barras amarillas indican el rango donde se encuentra la recomendación de {confidenceLevel}% de confianza.
                        </p>
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>
          )}
          
          {/* Show/Hide Detailed Results Button */}
          <div className="flex justify-center mb-6">
            <Button
              variant="outline"
              color="primary"
              onClick={() => setShowDetailedResults(!showDetailedResults)}
            >
              {showDetailedResults ? (
                <>Ocultar Detalles Técnicos</>
              ) : (
                <>Mostrar Detalles Técnicos</>
              )}
              <ChevronDown className={`w-4 h-4 ml-1 transition-transform ${showDetailedResults ? 'rotate-180' : ''}`} />
            </Button>
          </div>
          
          {/* Detailed Technical Results */}
          {showDetailedResults && (
            <div className="bg-gray-50 rounded-lg p-4 mb-6 border border-gray-200">
              <h4 className="font-medium text-gray-700 mb-3">Detalles Técnicos de la Simulación</h4>
              <div className="space-y-4 text-sm">
                <div>
                  <h5 className="font-medium text-gray-600 mb-1">Configuración</h5>
                  <ul className="list-disc list-inside space-y-1 text-gray-600">
                    <li>Método: Simulación Monte Carlo</li>
                    <li>Iteraciones: {simulationCount.toLocaleString()}</li>
                    <li>Nivel de confianza: {confidenceLevel}%</li>
                    <li>Asistentes: {attendees}</li>
                    <li>Perfiles de consumo: {eaterProfiles.map(p => `${p.name} (${p.percentage}%, ${p.servingsMultiplier}x)`).join(', ')}</li>
                    <li>
                      Relaciones complementarias: {itemRelationships.length > 0 
                        ? `${itemRelationships.length} relaciones activas` 
                        : 'Ninguna'
                      }
                    </li>
                  </ul>
                </div>
                
                <div>
                  <h5 className="font-medium text-gray-600 mb-1">Metodología</h5>
                  <p className="text-gray-600">
                    La simulación Monte Carlo genera múltiples escenarios de consumo aleatorios basados en la 
                    distribución de perfiles de consumidores. Para cada simulación, se asignan aleatoriamente 
                    los asistentes a diferentes perfiles y se calcula el consumo total. Las relaciones entre 
                    artículos complementarios se consideran para asegurar proporciones correctas.
                  </p>
                </div>
                
                <div>
                  <h5 className="font-medium text-gray-600 mb-1">Interpretación</h5>
                  <p className="text-gray-600">
                    El nivel de confianza del {confidenceLevel}% significa que en el {confidenceLevel}% de las 
                    simulaciones, el consumo fue menor o igual a la cantidad recomendada. Un nivel más alto 
                    proporciona mayor seguridad, pero requiere más unidades. El riesgo de escasez representa 
                    la probabilidad de quedarse sin existencias si se compra la cantidad recomendada.
                  </p>
                </div>
              </div>
            </div>
          )}
          
          {/* Apply to Shopping List Button */}
          <div className="flex justify-center">
            <Button
              variant="gradient"
              color="success"
              size="lg"
              onClick={handleApplyRecommendations}
              className="px-6"
            >
              <Save className="w-5 h-5 mr-2" />
              Aplicar Recomendaciones a Lista de Compras
            </Button>
          </div>
          
          {/* Apply Recommendations Explanation */}
          <div className="mt-4 text-center text-sm text-gray-500">
            <p>
              Al aplicar las recomendaciones, se actualizarán las cantidades en tu lista de compras 
              según los resultados de la simulación.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default FoodSimulator;