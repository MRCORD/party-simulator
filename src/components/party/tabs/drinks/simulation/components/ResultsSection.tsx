import React, { useState, useEffect } from 'react';
import { 
  BarChart4, Info, Save, Wine, 
  Droplet, Snowflake, Package,
  ChevronDown, AlertCircle, Clock
} from 'lucide-react';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { ShoppingItem } from '@/types/shopping';
import { DrinkSimulationResult, EventFactors } from '@/types/drinks';
import DistributionChart from './DistributionChart';
import TimelineConsumptionChart from './TimelineConsumptionChart';

interface ResultsSectionProps {
  simulationResults: Record<string, DrinkSimulationResult>;
  shoppingItems: ShoppingItem[];
  attendees: number;
  applySimulationRecommendations: () => void;
  confidenceLevel: number;
  eventFactors: EventFactors;
  simulationCount: number; // Added simulation count prop
}

const ResultsSection: React.FC<ResultsSectionProps> = ({
  simulationResults,
  shoppingItems,
  attendees,
  applySimulationRecommendations,
  confidenceLevel,
  eventFactors,
  simulationCount // Added to destructuring
}) => {
  const [highlightedItemId, setHighlightedItemId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showDistributions, setShowDistributions] = useState(false);
  const [showTimelines, setShowTimelines] = useState(false);

  useEffect(() => {
    // Show loading state for 1 second
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [simulationResults]); // Reset loading when results change

  // Calculate totals from simulation results
  const calculateTotals = () => {
    if (Object.keys(simulationResults).length === 0) {
      return { totalServings: 0, totalUnits: 0, totalCost: 0 };
    }
    
    let totalServings = 0;
    let totalUnits = 0;
    let totalCost = 0;
    
    Object.keys(simulationResults).forEach(itemId => {
      const result = simulationResults[itemId];
      totalServings += result.recommendedServings;
      totalUnits += result.recommendedUnits;
      totalCost += result.totalCost;
    });
    
    return { totalServings, totalUnits, totalCost };
  };
  
  const { totalServings, totalUnits, totalCost } = calculateTotals();
  
  // Get selected items with their results
  const getSelectedItemsWithResults = () => {
    return Object.keys(simulationResults)
      .map(itemId => {
        const item = shoppingItems.find(item => item.id === itemId);
        if (!item) return null;
        
        const result = simulationResults[itemId];
        return { item, result };
      })
      .filter(item => item !== null) as { item: ShoppingItem, result: DrinkSimulationResult }[];
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
  
  // Format category name for display
  const formatCategory = (category: string) => {
    switch (category) {
      case 'spirits': return 'Licores';
      case 'mixers': return 'Mezcladores';
      case 'beer': return 'Cerveza';
      case 'wine': return 'Vino';
      case 'ice': return 'Hielo';
      case 'supplies': return 'Suministros';
      default: return category;
    }
  };
  
  // Get category icon for display
  const getCategoryIcon = (category: string) => {
    switch(category) {
      case 'spirits': return <Wine className="w-4 h-4 text-primary" />;
      case 'mixers': return <Droplet className="w-4 h-4 text-accent-teal" />;
      case 'beer': return <Wine className="w-4 h-4 text-accent-amber" />;
      case 'wine': return <Wine className="w-4 h-4 text-accent-pink" />;
      case 'ice': return <Snowflake className="w-4 h-4 text-primary-light" />;
      case 'supplies': return <Package className="w-4 h-4 text-accent-pink" />;
      default: return <Package className="w-4 h-4 text-gray-500" />;
    }
  };

  if (isLoading) {
    return (
      <div className="animate-pulse">
        {/* Loading skeleton UI omitted for brevity */}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-primary to-primary-secondary p-5 text-white">
        <div className="flex items-center">
          <BarChart4 className="w-6 h-6 mr-3" />
          <h2 className="text-xl font-bold">Resultados de la Simulación</h2>
        </div>
        
        <div className="bg-blue-50 rounded-lg p-4 mt-4">
          <div className="flex">
            <Info className="w-5 h-5 text-primary mr-3 flex-shrink-0" />
            <p className="text-sm text-primary-dark">
              La simulación ha generado resultados basados en {simulationCount.toLocaleString()} iteraciones Monte Carlo. 
              Los resultados consideran variabilidad en los perfiles de consumidores,
              factores de tiempo y otras variables del evento.
            </p>
          </div>
        </div>
        
        {/* Event factors summary */}
        <div className="mt-4 bg-white/10 backdrop-blur-sm rounded-lg p-3">
          <div className="flex items-center mb-2">
            <Clock className="w-4 h-4 mr-1" />
            <span className="text-sm font-medium">Resumen del Evento:</span>
          </div>
          <div className="grid grid-cols-4 gap-2 text-xs">
            <div>Duración: {eventFactors.duration} horas</div>
            <div>Temperatura: {eventFactors.temperature === 'cool' ? 'Fresca' : 
                             eventFactors.temperature === 'hot' ? 'Calurosa' : 'Moderada'}</div>
            <div>Tipo: {eventFactors.eventType === 'formal' ? 'Formal' : 
                      eventFactors.eventType === 'party' ? 'Fiesta' : 'Casual'}</div>
            <div>Ubicación: {eventFactors.isOutdoor ? 'Exterior' : 'Interior'}</div>
          </div>
        </div>
        
        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center">
            <div className="text-xs uppercase tracking-wide mb-1">Porciones Totales</div>
            <div className="text-2xl font-bold">{totalServings.toFixed(0)}</div>
            <div className="text-sm mt-1">({(totalServings / attendees).toFixed(1)} por persona)</div>
          </div>
          
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center">
            <div className="text-xs uppercase tracking-wide mb-1">Unidades a Comprar</div>
            <div className="text-2xl font-bold">{totalUnits}</div>
            <div className="text-sm mt-1">para garantizar abastecimiento</div>
          </div>
          
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center">
            <div className="text-xs uppercase tracking-wide mb-1">Costo Total</div>
            <div className="text-2xl font-bold">S/ {totalCost.toFixed(2)}</div>
            <div className="text-sm mt-1">S/ {(totalCost / attendees).toFixed(2)} por persona</div>
          </div>
        </div>
      </div>
      
      <div className="p-6">
        <div className="overflow-x-auto mb-6">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Bebida
                </th>
                <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Porciones ({confidenceLevel}%)
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
                  className={`hover:bg-gray-50 cursor-pointer ${highlightedItemId === item.id ? 'bg-blue-50' : ''}`}
                  onClick={() => setHighlightedItemId(highlightedItemId === item.id ? null : item.id)}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {getCategoryIcon(item.category)}
                      <div className="ml-2">
                        <div className="text-sm font-medium text-gray-900">{item.name}</div>
                        <div className="text-xs text-gray-500">
                          {formatCategory(item.category)} • {item.servings} porciones/unidad
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <span className="px-2 py-1 inline-flex text-sm leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                      {result?.recommendedServings?.toFixed(0) || 0} porciones
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div className="flex flex-col items-center">
                      <span className="px-2 py-1 inline-flex text-sm leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        {result?.recommendedUnits || 0} unidades
                      </span>
                      {item.units !== result?.recommendedUnits && (
                        <span className="text-xs mt-1">
                          {item.units < (result?.recommendedUnits || 0)
                            ? <span className="text-error">Faltan {(result?.recommendedUnits || 0) - item.units}</span>
                            : <span className="text-success">Sobran {item.units - (result?.recommendedUnits || 0)}</span>
                          }
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <Badge 
                      variant={getRiskColor(result?.stockoutRisk || 0)} 
                      size="sm"
                    >
                      {result?.stockoutRisk?.toFixed(1) || '0.0'}% - {formatRiskLevel(result?.stockoutRisk || 0)}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium text-gray-900">
                    S/ {result?.totalCost?.toFixed(2) || '0.00'}
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
                      <div><h3 className="text-lg font-medium text-gray-900">{item.name}</h3>
                        <p className="text-sm text-gray-500">
                          {formatCategory(item.category)} • {item.size} {item.sizeUnit} • {item.servings} porciones/unidad
                        </p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h5 className="font-medium text-gray-700 mb-3">Estadísticas de Consumo</h5>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Consumo Promedio:</span>
                            <span className="font-medium">{result?.mean?.toFixed(1) || '0.0'} porciones</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Consumo Mediano:</span>
                            <span className="font-medium">{result?.median?.toFixed(1) || '0.0'} porciones</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Rango (Min-Max):</span>
                            <span className="font-medium">{result?.min?.toFixed(1) || '0.0'} - {result?.max?.toFixed(1) || '0.0'} porciones</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Unidades Recomendadas:</span>
                            <span className="font-medium">{result?.recommendedUnits || 0} unidades</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Riesgo de Escasez:</span>
                            <span className="font-medium">{result?.stockoutRisk?.toFixed(1) || '0.0'}%</span>
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
                    <DistributionChart data={result.distribution} />
                    
                    {/* Timeline Chart */}
                    <div className="mt-6">
                      <TimelineConsumptionChart data={result.timeline} />
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        )}
        
        {/* Distribution Charts Section */}
        <div className="border-t border-gray-200 mt-6">
          <button
            onClick={() => setShowDistributions(!showDistributions)}
            className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center">
              <BarChart4 className="w-5 h-5 text-primary mr-2" />
              <span className="font-medium text-gray-900">
                Ver Distribuciones de Consumo
              </span>
            </div>
            <div className={`transform transition-transform ${showDistributions ? 'rotate-180' : ''}`}>
              <ChevronDown className="w-5 h-5 text-gray-500" />
            </div>
          </button>
          
          {showDistributions && (
            <div className="px-6 py-4 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {getSelectedItemsWithResults().map(({ item, result }) => (
                  <div key={item.id} className="bg-gray-50 rounded-lg p-4">
                    <div className="mb-3">
                      <h4 className="font-medium text-gray-900">{item.name}</h4>
                      <p className="text-sm text-gray-500">
                        {formatCategory(item.category)} • {item.servings} porciones/unidad
                      </p>
                    </div>
                    <DistributionChart data={result.distribution} />
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-500 text-center mt-4">
                Las distribuciones muestran la frecuencia de cada rango de consumo en las simulaciones.
                Las barras azules indican el rango donde se encuentra la recomendación con el nivel de confianza seleccionado.
              </p>
            </div>
          )}
        </div>
        
        {/* Timeline Charts Section */}
        <div className="border-t border-gray-200 mt-6">
          <button
            onClick={() => setShowTimelines(!showTimelines)}
            className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center">
              <Clock className="w-5 h-5 text-primary mr-2" />
              <span className="font-medium text-gray-900">
                Ver Consumo a lo Largo del Tiempo
              </span>
            </div>
            <div className={`transform transition-transform ${showTimelines ? 'rotate-180' : ''}`}>
              <ChevronDown className="w-5 h-5 text-gray-500" />
            </div>
          </button>
          
          {showTimelines && (
            <div className="px-6 py-4 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {getSelectedItemsWithResults().map(({ item, result }) => (
                  <div key={item.id} className="bg-gray-50 rounded-lg p-4">
                    <div className="mb-3">
                      <h4 className="font-medium text-gray-900">{item.name}</h4>
                      <p className="text-sm text-gray-500">
                        {formatCategory(item.category)} • {item.servings} porciones/unidad
                      </p>
                    </div>
                    <TimelineConsumptionChart data={result.timeline} />
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-500 text-center mt-4">
                Los gráficos de línea de tiempo muestran cómo se distribuye el consumo a lo largo de las diferentes 
                fases del evento. Esto ayuda a planificar el servicio de bebidas en cada momento.
              </p>
            </div>
          )}
        </div>

        {/* Apply to Shopping List Button */}
        <div className="flex justify-center mt-6">
          <Button
            variant="gradient"
            color="success"
            size="lg"
            onClick={applySimulationRecommendations}
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
    </div>
  );
};

export default ResultsSection;
