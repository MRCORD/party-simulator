"use client";
import React from 'react';
import { 
  Utensils, Users, Beef, Salad, 
  CheckCircle, AlertCircle, List, 
  Package, Clipboard, Sparkles, Link as LinkIcon
} from 'lucide-react';
import Badge from '@/components/ui/Badge';
import ProgressBar from '@/components/ui/ProgressBar';
import Button from '@/components/ui/Button';
import { useTheme } from '@/components/ui/ThemeProvider';
import { ShoppingItem } from '@/types/shopping';
import { FoodRequirements } from '@/types/food';

interface BasicViewProps {
  attendees: number;
  foodServingsPerPerson: number;
  shoppingItems: ShoppingItem[];
  calculateFoodRequirements: () => FoodRequirements;
  getCategoryServings: (category: string) => number;
  getRecommendedUnits: (category: string, totalServings: number) => number;
  toggleView: () => void;
  itemRelationships?: { primaryItemId: string; secondaryItemId: string; ratio: number }[];
}

const BasicView: React.FC<BasicViewProps> = ({
  attendees,
  foodServingsPerPerson,
  shoppingItems,
  calculateFoodRequirements,
  getCategoryServings,
  toggleView,
  itemRelationships = []
}) => {
  const theme = useTheme();
  const foodRequirements = calculateFoodRequirements();
  
  // Filter food-related items
  const foodItems = shoppingItems.filter(item => 
    ['meat', 'sides', 'condiments'].includes(item.category)
  );
  
  // Get category icon for display
  const getCategoryIcon = (category: string) => {
    switch(category) {
      case 'meat': return <Beef className="w-4 h-4 text-accent-amber" />;
      case 'sides': return <Salad className="w-4 h-4 text-success" />;
      case 'condiments': return <Utensils className="w-4 h-4 text-warning" />;
      default: return <Package className="w-4 h-4 text-gray-500" />;
    }
  };

  // Find complementary items for a given item ID
  const findComplementaryItemIds = (itemId: string): string[] => {
    const relatedItems: string[] = [];
    
    // Check for relationships where this item is involved
    itemRelationships?.forEach(rel => {
      if (rel.primaryItemId === itemId) {
        relatedItems.push(rel.secondaryItemId);
      } else if (rel.secondaryItemId === itemId) {
        relatedItems.push(rel.primaryItemId);
      }
    });
    
    return relatedItems;
  };

  // Check if an item has any complementary relationships
  const hasComplementaryItems = (itemId: string): boolean => {
    return findComplementaryItemIds(itemId).length > 0;
  };
  
  // Define inventory status items
  const inventoryStatus = [
    { 
      category: 'meat', 
      label: 'Carnes',
      current: getCategoryServings('meat'), 
      required: foodRequirements.totalServings, 
      isEnough: foodRequirements.hasEnoughMeat,
      icon: <Beef className="w-5 h-5" strokeWidth={2.5} />
    },
    { 
      category: 'sides', 
      label: 'Guarniciones',
      current: getCategoryServings('sides'), 
      required: foodRequirements.totalServings, 
      isEnough: foodRequirements.hasEnoughSides,
      icon: <Salad className="w-5 h-5" strokeWidth={2.5} />
    },
    { 
      category: 'condiments', 
      label: 'Condimentos',
      current: getCategoryServings('condiments'), 
      required: foodRequirements.totalServings, 
      isEnough: foodRequirements.hasEnoughCondiments,
      icon: <Utensils className="w-5 h-5" strokeWidth={2.5} />
    }
  ];
  
  // Cooking tips
  const logisticsTips = [
    "Tener al menos 2 personas manejando la parrilla para fiestas de más de 20 personas",
    "Preparar la carne con anticipación (marinado, sazonado)",
    "Cocinar primero los alimentos que requieren más tiempo, luego los más rápidos",
    "Considerar cocinar algunos alimentos por adelantado y solo terminarlos en la parrilla",
    "Calcular 45-60 minutos de parrilla activa por cada 20 personas"
  ];
  
  const foodSelectionTips = [
    "Elegir alimentos que se puedan preparar con anticipación",
    "Incluir opciones vegetarianas (brochetas de verduras, maíz, etc.)",
    "Ofrecer una variedad de proteínas (pollo, res, cerdo)",
    "Preparar guarniciones simples que no requieran cocción (ensaladas, papas fritas)",
    "Considerar restricciones dietéticas entre los invitados",
    "Tener postres preparados que no requieran refrigeración"
  ];

  // Get category color
  const getCategoryColor = (category: string) => {
    switch(category) {
      case 'meat': return 'bg-accent-amber';
      case 'sides': return 'bg-success';
      case 'condiments': return 'bg-warning';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      {/* Main Planning Card */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className={`${theme.getGradient('warning')} p-5 text-white`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Utensils className="w-6 h-6 mr-3" />
              <h2 className="text-xl font-bold">Planificación de Comida</h2>
            </div>
            
            {/* Toggle button to switch to advanced simulation */}
            <Button 
              variant="outline" 
              color="warning"
              onClick={toggleView}
              className="bg-white/10 hover:bg-white/20 text-white border-white/30"
            >
              <Sparkles size={18} className="mr-2" />
              Usar Simulación Avanzada
            </Button>
          </div>
          
          {/* Key metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mt-4">
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center">
              <div className="text-xs uppercase tracking-wide mb-1">Asistentes</div>
              <div className="text-2xl font-bold flex justify-center items-center">
                <Users size={18} className="mr-2 opacity-70" />
                {attendees}
              </div>
            </div>
            
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center">
              <div className="text-xs uppercase tracking-wide mb-1">Porciones por Persona</div>
              <div className="text-2xl font-bold flex justify-center items-center">
                <Utensils size={18} className="mr-2 opacity-70" />
                {foodServingsPerPerson}
              </div>
            </div>
            
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center">
              <div className="text-xs uppercase tracking-wide mb-1">Total Porciones</div>
              <div className="text-2xl font-bold">{foodRequirements.totalServings}</div>
            </div>
            
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center">
              <div className="text-xs uppercase tracking-wide mb-1">Costo Total</div>
              <div className="text-2xl font-bold">S/ {foodRequirements.totalCost.toFixed(2)}</div>
            </div>
          </div>
          
          <div className="text-sm text-center mt-4 bg-white/10 p-2 rounded-lg">
            El costo por persona para comida es aproximadamente <span className="font-bold">S/ {(foodRequirements.totalCost / attendees).toFixed(2)}</span>
          </div>
        </div>
      </div>
      
      {/* Two Column Layout for Inventory Status and Basic Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Inventory Status */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className={`${theme.getGradient('warning')} px-4 py-3 text-white`}>
            <div className="flex items-center">
              <CheckCircle className="w-5 h-5 mr-2" />
              <h3 className="font-medium">Estado del Inventario</h3>
            </div>
          </div>
          
          <div className="p-4 space-y-4">
            {inventoryStatus.map((item, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div className={`w-8 h-8 rounded-full mr-3 flex items-center justify-center ${getCategoryColor(item.category)}`}>
                      {item.icon}
                    </div>
                    <span className="font-medium">{item.label}</span>
                  </div>
                  <div className="text-sm">
                    <span className="font-medium">{item.current}</span>/{item.required} porciones
                  </div>
                </div>
                
                {/* Progress bar */}
                <ProgressBar
                  value={Math.min(100, (item.current / item.required) * 100)}
                  max={100}
                  color={item.isEnough ? "success" : "error"}
                  showLabel={false}
                />
                
                {/* Status indicator */}
                <div className="flex justify-end">
                  {item.isEnough ? (
                    <Badge variant="success" size="sm" icon={<CheckCircle className="w-3 h-3 mr-1" />}>
                      Suficiente
                    </Badge>
                  ) : (
                    <Badge variant="error" size="sm" icon={<AlertCircle className="w-3 h-3 mr-1" />}>
                      Necesita {item.required - item.current} más
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Basic Information */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className={`${theme.getGradient('warning')} px-4 py-3 text-white`}>
            <div className="flex items-center">
              <List className="w-5 h-5 mr-2" />
              <h3 className="font-medium">Información Básica</h3>
            </div>
          </div>
          
          <div className="p-4">
            <div className="bg-warning-light p-4 rounded-md space-y-2 mb-4">
              <div className="flex justify-between">
                <span className="text-sm font-medium">Asistentes:</span>
                <span className="text-sm">{attendees}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium">Porciones por persona:</span>
                <span className="text-sm">{foodServingsPerPerson}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium">Total de porciones necesarias:</span>
                <span className="text-sm">{foodRequirements.totalServings}</span>
              </div>
            </div>
            
            <h4 className="font-medium mb-2">Desglose de Costos</h4>
            <div className="space-y-2">
              <div className="flex justify-between p-2 bg-accent-amber text-white rounded">
                <span className="text-sm font-medium">Carnes:</span>
                <span className="text-sm">S/ {foodRequirements.meatCost.toFixed(2)}</span>
              </div>
              <div className="flex justify-between p-2 bg-success text-white rounded">
                <span className="text-sm font-medium">Guarniciones:</span>
                <span className="text-sm">S/ {foodRequirements.sidesCost.toFixed(2)}</span>
              </div>
              <div className="flex justify-between p-2 bg-warning text-white rounded">
                <span className="text-sm font-medium">Condimentos:</span>
                <span className="text-sm">S/ {foodRequirements.condimentsCost.toFixed(2)}</span>
              </div>
              <div className="flex justify-between p-2 bg-warning-light rounded font-medium">
                <span>Costo Total de Comida:</span>
                <span>S/ {foodRequirements.totalCost.toFixed(2)}</span>
              </div>
              <div className="flex justify-between p-2 bg-warning-light/50 rounded">
                <span className="text-sm font-medium">Costo por persona:</span>
                <span className="text-sm">S/ {(foodRequirements.totalCost / attendees).toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Food Detail Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className={`${theme.getGradient('warning')} px-4 py-3 text-white`}>
          <div className="flex items-center">
            <List className="w-5 h-5 mr-2" />
            <h3 className="font-medium">Detalle de Comida</h3>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Artículo
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tamaño
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Unidades
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Porciones
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Precio
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Costo Total
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {foodItems.map((item) => {
                // Check if the item has complementary relationships
                const isComplementary = hasComplementaryItems(item.id);
                const complementaryIds = findComplementaryItemIds(item.id);
                
                return (
                  <tr key={item.id} className={`hover:bg-gray-50 ${isComplementary ? 'bg-indigo-50/30' : ''}`}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {getCategoryIcon(item.category)}
                        <div className="ml-2">
                          <div className="font-medium text-gray-900 flex items-center">
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
                          </div>
                          {isComplementary && (
                            <div className="text-xs text-indigo-600 mt-0.5">
                              Complementa con: {
                                complementaryIds.map(id => {
                                  const compItem = shoppingItems.find(item => item.id === id);
                                  return compItem?.name || '';
                                }).join(', ')
                              }
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.size} {item.sizeUnit}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.units}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.servings * item.units}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      S/ {item.cost.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                      S/ {(item.cost * item.units).toFixed(2)}
                    </td>
                  </tr>
                );
              })}
              
              {foodItems.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-gray-500">
                    <Package className="mx-auto h-12 w-12 text-gray-400 mb-2" />
                    <p className="text-lg font-medium text-gray-900 mb-1">No hay artículos de comida</p>
                    <p className="text-sm">
                      Agrega artículos de comida usando la pestaña &quot;Compras&quot;
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
            {/* Total Row */}
            <tfoot>
              <tr className="bg-gray-50 font-medium">
                <td colSpan={5} className="px-6 py-4 text-right text-gray-700">Total:</td>
                <td className="px-6 py-4 text-gray-900 font-bold">
                  S/ {foodRequirements.totalCost.toFixed(2)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
      
      {/* Cooking Tips */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className={`${theme.getGradient('warning')} px-4 py-3 text-white`}>
          <div className="flex items-center">
            <Clipboard className="w-5 h-5 mr-2" />
            <h3 className="font-medium">Consejos para la Parrillada</h3>
          </div>
        </div>
        
        <div className="p-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <h4 className="font-medium text-slate-800">Logística de Cocina</h4>
              <ul className="list-disc pl-5 space-y-1 text-sm">
                {logisticsTips.map((tip, index) => (
                  <li key={index} className="text-slate-700">{tip}</li>
                ))}
              </ul>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium text-slate-800">Consejos de Selección de Alimentos</h4>
              <ul className="list-disc pl-5 space-y-1 text-sm">
                {foodSelectionTips.map((tip, index) => (
                  <li key={index} className="text-slate-700">{tip}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
      
      {/* Call to Action for Advanced Simulation */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden border-2 border-dashed border-warning">
        <div className="p-6 text-center">
          <Sparkles className="w-12 h-12 text-warning mx-auto mb-3" />
          <h3 className="text-xl font-medium text-gray-900 mb-3">¿Quieres una planificación más precisa?</h3>
          <p className="text-gray-600 mb-4 max-w-lg mx-auto">
            Nuestra simulación Monte Carlo te permite calcular con mayor precisión las cantidades de comida necesarias
            basándose en diferentes perfiles de comensales y miles de simulaciones estadísticas.
          </p>
          <Button
            variant="gradient"
            color="warning"
            size="lg"
            onClick={toggleView}
            className="px-6"
          >
            <Sparkles className="w-5 h-5 mr-2" />
            Activar Simulación Monte Carlo
          </Button>
          
          <div className="mt-4 text-sm text-gray-500">
            La simulación Monte Carlo analiza miles de escenarios posibles para darte una recomendación con el nivel de confianza que elijas.
          </div>
        </div>
      </div>
    </div>
  );
};

export default BasicView;