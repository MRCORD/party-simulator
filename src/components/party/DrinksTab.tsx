"use client";

import React from 'react';
import { 
  Wine, Droplet, Snowflake, Package, CheckCircle, AlertCircle, 
  TrendingUp, Users, DollarSign, Info, List
} from 'lucide-react';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import ProgressBar from '@/components/ui/ProgressBar';
import { useTheme } from '@/components/ui/ThemeProvider';

// Import shared types
import { ShoppingItem, DrinkRequirements } from './types';

interface DrinksTabProps {
  attendees: number;
  drinksPerPerson: number;
  shoppingItems: ShoppingItem[];
  calculateDrinkRequirements: () => DrinkRequirements;
  getCategoryServings: (category: string) => number;
  getRecommendedUnits: (category: string, totalDrinks: number) => number;
}

interface TableColumn {
  accessor: keyof ShoppingItem;
  Header: string;
  Cell?: ({ value, row }: { value: any; row: ShoppingItem }) => React.ReactNode;
}

const DrinksTab: React.FC<DrinksTabProps> = ({
  attendees,
  drinksPerPerson,
  shoppingItems,
  calculateDrinkRequirements,
  getCategoryServings,
  getRecommendedUnits
}) => {
  const theme = useTheme();
  const drinkRequirements = calculateDrinkRequirements();
  
  // Filter drinks-related items
  const drinkItems = shoppingItems.filter(item => 
    ['spirits', 'mixers', 'ice', 'supplies'].includes(item.category)
  );
  
  // Get category icon for display
  const getCategoryIcon = (category: string) => {
    switch(category) {
      case 'spirits': return <Wine className="w-4 h-4 text-primary" />;
      case 'mixers': return <Droplet className="w-4 h-4 text-accent-teal" />;
      case 'ice': return <Snowflake className="w-4 h-4 text-primary-light" />;
      case 'supplies': return <Package className="w-4 h-4 text-accent-pink" />;
      default: return null;
    }
  };
  
  // Get category background color
  const getCategoryColor = (category: string) => {
    switch(category) {
      case 'spirits': return 'bg-primary';
      case 'mixers': return 'bg-accent-teal';
      case 'ice': return 'bg-primary-light';
      case 'supplies': return 'bg-accent-pink';
      default: return 'bg-gray-400';
    }
  };
  
  // Define inventory status items
  const inventoryStatus = [
    { 
      category: 'spirits', 
      label: 'Licores',
      current: getCategoryServings('spirits'), 
      required: drinkRequirements.totalDrinks, 
      isEnough: drinkRequirements.hasEnoughSpirits,
      icon: <Wine className="w-5 h-5 text-white" />
    },
    { 
      category: 'mixers', 
      label: 'Mezcladores',
      current: getCategoryServings('mixers'), 
      required: drinkRequirements.totalDrinks, 
      isEnough: drinkRequirements.hasEnoughMixers,
      icon: <Droplet className="w-5 h-5 text-white" />
    },
    { 
      category: 'ice', 
      label: 'Hielo',
      current: getCategoryServings('ice'), 
      required: drinkRequirements.totalDrinks, 
      isEnough: drinkRequirements.hasEnoughIce,
      icon: <Snowflake className="w-5 h-5 text-white" />
    },
    { 
      category: 'supplies', 
      label: 'Suministros',
      current: getCategoryServings('supplies'), 
      required: drinkRequirements.totalDrinks, 
      isEnough: drinkRequirements.hasEnoughSupplies,
      icon: <Package className="w-5 h-5 text-white" />
    }
  ];
  
  // Service tips
  const serviceTips = [
    "Instala una estación de bebidas autoservicio para reducir trabajo y mejorar la experiencia",
    "Prepara cócteles por lote para ahorrar tiempo y asegurar consistencia en el sabor",
    "Usa dispensadores para mezcladores comunes como gaseosas y jugos",
    "Considera contratar un bartender si el presupuesto lo permite para una experiencia premium"
  ];
  
  // Cost saving tips
  const costSavingTips = [
    "Compra licores en botellas más grandes para mejor valor por mililitro",
    "Usa marcas económicas para cócteles donde el sabor se mezcla con otros ingredientes",
    "Pide a los invitados que traigan sus licores preferidos (BYOB) para reducir costos",
    "Compra hielo el día del evento para evitar que se derrita y ahorrar en cantidad",
    "Ofrece un cóctel de la casa en lugar de un bar completo para simplificar y reducir costos"
  ];

  return (
    <div className="space-y-6">
      {/* Main Planning Card */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className={`${theme.getGradient('primary')} p-5 text-white`}>
          <div className="flex items-center">
            <Wine className="w-6 h-6 mr-3" />
            <h2 className="text-xl font-bold">Planificación de Bebidas</h2>
          </div>
          
          {/* Key metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center">
              <div className="text-xs uppercase tracking-wide mb-1">Asistentes</div>
              <div className="text-2xl font-bold flex justify-center items-center">
                <Users size={18} className="mr-2 opacity-70" />
                {attendees}
              </div>
            </div>
            
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center">
              <div className="text-xs uppercase tracking-wide mb-1">Bebidas por Persona</div>
              <div className="text-2xl font-bold flex justify-center items-center">
                <Wine size={18} className="mr-2 opacity-70" />
                {drinksPerPerson}
              </div>
            </div>
            
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center">
              <div className="text-xs uppercase tracking-wide mb-1">Total Bebidas</div>
              <div className="text-2xl font-bold">{drinkRequirements.totalDrinks}</div>
            </div>
            
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center">
              <div className="text-xs uppercase tracking-wide mb-1">Costo Total</div>
              <div className="text-2xl font-bold">S/ {drinkRequirements.totalCost.toFixed(2)}</div>
            </div>
          </div>
          
          <div className="text-sm text-center mt-4 bg-white/10 p-2 rounded-lg">
            El costo por persona para bebidas es aproximadamente <span className="font-bold">S/ {(drinkRequirements.totalCost / attendees).toFixed(2)}</span>
          </div>
        </div>
      </div>
      
      {/* Two Column Layout for Inventory Status and Recommended Quantities */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Inventory Status */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className={`${theme.getGradient('primary')} px-4 py-3 text-white`}>
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
        
        {/* Recommended Quantities */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className={`${theme.getGradient('primary')} px-4 py-3 text-white`}>
            <div className="flex items-center">
              <TrendingUp className="w-5 h-5 mr-2" />
              <h3 className="font-medium">Cantidades Recomendadas</h3>
            </div>
          </div>
          
          <div className="p-4">
            <div className="grid grid-cols-2 gap-4">
              {/* Liquors Recommendation */}
              <div className="bg-primary-light/20 rounded-lg p-4 border border-primary-light">
                <div className="flex items-center mb-2">
                  <div className="w-8 h-8 rounded-full mr-3 flex items-center justify-center bg-primary text-white">
                    <Wine size={16} />
                  </div>
                  <span className="font-medium">Licores</span>
                </div>
                
                <div className="text-center mt-3">
                  <div className="text-3xl font-bold text-primary">
                    {getRecommendedUnits('spirits', drinkRequirements.totalDrinks)}
                  </div>
                  <div className="text-sm text-gray-600">unidades</div>
                </div>
                
                <div className="mt-3 flex justify-center">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    getRecommendedUnits('spirits', drinkRequirements.totalDrinks) > shoppingItems
                      .filter(i => i.category === 'spirits')
                      .reduce((sum, i) => sum + i.units, 0)
                      ? 'bg-red-100 text-red-800'
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {getRecommendedUnits('spirits', drinkRequirements.totalDrinks) > shoppingItems
                      .filter(i => i.category === 'spirits')
                      .reduce((sum, i) => sum + i.units, 0)
                      ? 'Necesita más'
                      : 'Completo'}
                  </span>
                </div>
              </div>
              
              {/* Mixers Recommendation */}
              <div className="bg-primary-light/20 rounded-lg p-4 border border-primary-light">
                <div className="flex items-center mb-2">
                  <div className="w-8 h-8 rounded-full mr-3 flex items-center justify-center bg-accent-teal text-white">
                    <Droplet size={16} />
                  </div>
                  <span className="font-medium">Mezcladores</span>
                </div>
                
                <div className="text-center mt-3">
                  <div className="text-3xl font-bold text-primary">
                    {getRecommendedUnits('mixers', drinkRequirements.totalDrinks)}
                  </div>
                  <div className="text-sm text-gray-600">unidades</div>
                </div>
                
                <div className="mt-3 flex justify-center">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    getRecommendedUnits('mixers', drinkRequirements.totalDrinks) > shoppingItems
                      .filter(i => i.category === 'mixers')
                      .reduce((sum, i) => sum + i.units, 0)
                      ? 'bg-red-100 text-red-800'
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {getRecommendedUnits('mixers', drinkRequirements.totalDrinks) > shoppingItems
                      .filter(i => i.category === 'mixers')
                      .reduce((sum, i) => sum + i.units, 0)
                      ? 'Necesita más'
                      : 'Completo'}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="bg-primary-light/20 rounded-lg p-4 mt-4 border border-primary-light">
              <div className="flex items-center">
                <Info className="w-5 h-5 text-primary mr-2" />
                <span className="text-sm text-primary-dark">
                  Las cantidades recomendadas son calculadas en base al número de asistentes y bebidas por persona.
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Drinks Detail Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className={`${theme.getGradient('primary')} px-4 py-3 text-white`}>
          <div className="flex items-center">
            <List className="w-5 h-5 mr-2" />
            <h3 className="font-medium">Detalle de Bebidas</h3>
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
              {drinkItems.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {getCategoryIcon(item.category)}
                      <span className="ml-2 font-medium text-gray-900">{item.name}</span>
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
              ))}
              
              {drinkItems.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-gray-500">
                    <Package className="mx-auto h-12 w-12 text-gray-400 mb-2" />
                    <p className="text-lg font-medium text-gray-900 mb-1">No hay bebidas</p>
                    <p className="text-sm">
                      Agrega bebidas usando la pestaña "Compras"
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
                  S/ {drinkRequirements.totalCost.toFixed(2)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
      
      {/* Planning Tips */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Service Options */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className={`${theme.getGradient('primary')} px-4 py-3 text-white`}>
            <h3 className="font-medium">Opciones de Servicio</h3>
          </div>
          
          <div className="p-4">
            <div className="space-y-4">
              {serviceTips.map((tip, index) => (
                <div key={index} className="flex">
                  <div className="flex-shrink-0 flex items-start mt-0.5">
                    <div className="flex-shrink-0 w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center mr-3">
                      {index + 1}
                    </div>
                  </div>
                  <p className="text-sm text-gray-700">{tip}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Cost Saving Tips */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className={`${theme.getGradient('success')} px-4 py-3 text-white`}>
            <h3 className="font-medium">Ideas para Ahorrar Costos</h3>
          </div>
          
          <div className="p-4">
            <div className="space-y-4">
              {costSavingTips.map((tip, index) => (
                <div key={index} className="flex">
                  <div className="flex-shrink-0 flex items-start mt-0.5">
                    <div className="flex-shrink-0 w-6 h-6 bg-success text-white rounded-full flex items-center justify-center mr-3">
                      {index + 1}
                    </div>
                  </div>
                  <p className="text-sm text-gray-700">{tip}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DrinksTab;