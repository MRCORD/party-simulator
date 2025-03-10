"use client";

import React from 'react';
import { Utensils, DollarSign, ShoppingBag, Clipboard } from 'lucide-react';
import Card from '@/components/ui/Card';
import Table from '@/components/ui/Table';
import Badge from '@/components/ui/Badge';
import StatusBar from './StatusBar';
import { useTheme } from '@/components/ui/ThemeProvider';

// Import shared types
import { ShoppingItem, FoodRequirements } from './types';

interface FoodTabProps {
  attendees: number;
  foodServingsPerPerson: number;
  shoppingItems: ShoppingItem[];
  calculateFoodRequirements: () => FoodRequirements;
  getCategoryServings: (category: string) => number;
  getRecommendedUnits: (category: string, totalServings: number) => number;
}

interface TableColumn {
  accessor: keyof ShoppingItem;
  Header: string;
  Cell?: ({ value, row }: { value: any; row: ShoppingItem }) => React.ReactNode;
}

const FoodTab: React.FC<FoodTabProps> = ({
  attendees,
  foodServingsPerPerson,
  shoppingItems,
  calculateFoodRequirements,
  getCategoryServings,
  getRecommendedUnits
}) => {
  const theme = useTheme();
  const foodRequirements = calculateFoodRequirements();
  
  // Define columns for the food items table
  const foodColumns: TableColumn[] = [
    { 
      accessor: 'name', 
      Header: 'Artículo'
    },
    { 
      accessor: 'size', 
      Header: 'Tamaño',
      Cell: ({ value, row }) => `${value} ${row.sizeUnit}`
    },
    { accessor: 'units', Header: 'Unidades' },
    { 
      accessor: 'servings', 
      Header: 'Porciones',
      Cell: ({ value, row }) => value * row.units
    },
    { 
      accessor: 'cost', 
      Header: 'Costo',
      Cell: ({ value }) => `S/ ${value.toFixed(2)}`
    },
    { 
      accessor: 'totalCost', 
      Header: 'Costo Total',
      Cell: ({ value }) => `S/ ${value.toFixed(2)}`
    }
  ];
  
  return (
    <div className="space-y-6">
      <Card>
        <Card.Header 
          title="Requisitos de Comida" 
          icon={<Utensils className="w-5 h-5 text-primary" />}
        />
        <Card.Content>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-3">Información Básica</h4>
              <div className="bg-blue-50 p-4 rounded-md space-y-2">
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
              
              <h4 className="font-medium mt-4 mb-3">Desglose de Costos</h4>
              <div className="space-y-2">
                <div className={`flex justify-between p-2 ${theme.getGradient('primary')} text-white rounded`}>
                  <span className="text-sm font-medium">Carnes:</span>
                  <span className="text-sm">S/ {foodRequirements.meatCost.toFixed(2)}</span>
                </div>
                <div className={`flex justify-between p-2 ${theme.getGradient('primary')} text-white rounded`}>
                  <span className="text-sm font-medium">Guarniciones:</span>
                  <span className="text-sm">S/ {foodRequirements.sidesCost.toFixed(2)}</span>
                </div>
                <div className={`flex justify-between p-2 ${theme.getGradient('primary')} text-white rounded`}>
                  <span className="text-sm font-medium">Condimentos:</span>
                  <span className="text-sm">S/ {foodRequirements.condimentsCost.toFixed(2)}</span>
                </div>
                <div className="flex justify-between p-2 bg-blue-50 rounded font-medium">
                  <span>Costo Total de Comida:</span>
                  <span>S/ {foodRequirements.totalCost.toFixed(2)}</span>
                </div>
                <div className="flex justify-between p-2 bg-yellow-50 rounded">
                  <span className="text-sm font-medium">Costo por persona:</span>
                  <span className="text-sm">S/ {(foodRequirements.totalCost / attendees).toFixed(2)}</span>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium mb-3">Estado del Inventario</h4>
              
              <StatusBar 
                title="Carnes" 
                isEnough={foodRequirements.hasEnoughMeat}
                currentAmount={getCategoryServings('meat')}
                requiredAmount={foodRequirements.totalServings}
              />
              
              <StatusBar 
                title="Guarniciones" 
                isEnough={foodRequirements.hasEnoughSides}
                currentAmount={getCategoryServings('sides')}
                requiredAmount={foodRequirements.totalServings}
              />
              
              <StatusBar 
                title="Condimentos" 
                isEnough={foodRequirements.hasEnoughCondiments}
                currentAmount={getCategoryServings('condiments')}
                requiredAmount={foodRequirements.totalServings}
              />
              
              <h4 className="font-medium mt-4 mb-3">Cantidades Recomendadas</h4>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center p-2 bg-blue-50 rounded">
                  <span className="text-sm font-medium">Carnes:</span>
                  <div className="flex items-center">
                    <span className="text-sm font-medium mr-2">
                      {getRecommendedUnits('meat', foodRequirements.totalServings)} unidades
                    </span>
                    {getRecommendedUnits('meat', foodRequirements.totalServings) > shoppingItems
                      .filter(i => i.category === 'meat')
                      .reduce((sum, i) => sum + i.units, 0) && (
                      <Badge variant="error" size="sm">
                        Necesita más
                      </Badge>
                    )}
                  </div>
                </div>
                
                <div className="flex justify-between items-center p-2 bg-blue-50 rounded">
                  <span className="text-sm font-medium">Guarniciones:</span>
                  <div className="flex items-center">
                    <span className="text-sm font-medium mr-2">
                      {getRecommendedUnits('sides', foodRequirements.totalServings)} unidades
                    </span>
                    {getRecommendedUnits('sides', foodRequirements.totalServings) > shoppingItems
                      .filter(i => i.category === 'sides')
                      .reduce((sum, i) => sum + i.units, 0) && (
                      <Badge variant="error" size="sm">
                        Necesita más
                      </Badge>
                    )}
                  </div>
                </div>
                
                <div className="flex justify-between items-center p-2 bg-blue-50 rounded">
                  <span className="text-sm font-medium">Condimentos:</span>
                  <div className="flex items-center">
                    <span className="text-sm font-medium mr-2">
                      {getRecommendedUnits('condiments', foodRequirements.totalServings)} unidades
                    </span>
                    {getRecommendedUnits('condiments', foodRequirements.totalServings) > shoppingItems
                      .filter(i => i.category === 'condiments')
                      .reduce((sum, i) => sum + i.units, 0) && (
                      <Badge variant="error" size="sm">
                        Necesita más
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card.Content>
      </Card>
      
      <Card>
        <Card.Header 
          title="Cálculos de Comida" 
          icon={<ShoppingBag className="w-5 h-5 text-primary" />}
        />
        <Card.Content>
          <Table
            data={shoppingItems}
            columns={foodColumns}
            striped
            hoverable
          />
        </Card.Content>
      </Card>
      
      <Card>
        <Card.Header 
          title="Consejos para la Parrillada" 
          icon={<Clipboard className="w-5 h-5 text-primary" />}
        />
        <Card.Content>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <h4 className="font-medium text-gray-800">Logística de Cocina</h4>
              <ul className="list-disc pl-5 space-y-1 text-sm">
                <li>Tener al menos 2 personas manejando la parrilla para fiestas de más de 20 personas</li>
                <li>Preparar la carne con anticipación (marinado, sazonado)</li>
                <li>Cocinar primero los alimentos que requieren más tiempo, luego los más rápidos</li>
                <li>Considerar cocinar algunos alimentos por adelantado y solo terminarlos en la parrilla</li>
                <li>Calcular 45-60 minutos de parrilla activa por cada 20 personas</li>
              </ul>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium text-gray-800">Consejos de Selección de Alimentos</h4>
              <ul className="list-disc pl-5 space-y-1 text-sm">
                <li>Elegir alimentos que se puedan preparar con anticipación</li>
                <li>Incluir opciones vegetarianas (brochetas de verduras, maíz, etc.)</li>
                <li>Ofrecer una variedad de proteínas (pollo, res, cerdo)</li>
                <li>Preparar guarniciones simples que no requieran cocción (ensaladas, papas fritas)</li>
                <li>Considerar restricciones dietéticas entre los invitados</li>
                <li>Tener postres preparados que no requieran refrigeración</li>
              </ul>
            </div>
          </div>
        </Card.Content>
      </Card>
    </div>
  );
};

export default FoodTab;