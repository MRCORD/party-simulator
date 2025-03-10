"use client";

import React from 'react';
import { Wine, Droplet, Snowflake, Package, CheckCircle, AlertCircle, TrendingUp, Users } from 'lucide-react';
import Card from '@/components/ui/Card';
import Table from '@/components/ui/Table';
import Badge from '@/components/ui/Badge';
import StatusBar from './StatusBar';
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

// Add table column type after other interfaces
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
  
  // Define columns for the drinks table with proper typing
  const drinkColumns: TableColumn[] = [
    { 
      accessor: 'name', 
      Header: 'Artículo',
      Cell: ({ value, row }) => (
        <div className="flex items-center">
          {getCategoryIcon(row.category)}
          <span className="ml-2">{value}</span>
        </div>
      )
    },
    { 
      accessor: 'size', 
      Header: 'Tamaño',
      Cell: ({ value, row }) => `${value} ${row.sizeUnit}`
    },
    { accessor: 'units', Header: 'Unidades' },
    { accessor: 'servings', Header: 'Porciones', Cell: ({ value, row }) => value * row.units },
    { 
      accessor: 'cost', 
      Header: 'Precio',
      Cell: ({ value }) => `S/ ${value.toFixed(2)}`
    },
    { 
      accessor: 'totalCost', 
      Header: 'Costo Total',
      Cell: ({ value }) => `S/ ${value.toFixed(2)}`
    }
  ];
  
  // Transform shopping items for the table
  const drinkItems = shoppingItems
    .filter(item => ['spirits', 'mixers', 'ice', 'supplies'].includes(item.category))
    .map(item => ({
      ...item,
      totalCost: item.cost * item.units
    }));
  
  // Helper function to get category icon - UPDATED to use theme colors
  const getCategoryIcon = (category: string) => {
    switch(category) {
      case 'spirits': return <Wine className="w-4 h-4 text-primary" />;
      case 'mixers': return <Droplet className="w-4 h-4 text-primary" />;
      case 'ice': return <Snowflake className="w-4 h-4 text-primary" />;
      case 'supplies': return <Package className="w-4 h-4 text-slate-600" />;
      default: return null;
    }
  };
  
  return (
    <div className="space-y-6">
      <Card variant="gradient">
        <Card.Content className={`${theme.getGradient('primary')} p-6 rounded-xl shadow-lg text-white`}>
          <h3 className="text-xl font-bold mb-4 flex items-center">
            <Wine className="w-6 h-6 mr-2" /> Planificación de Bebidas
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
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
          <div className="text-sm opacity-80">
            El costo por persona para bebidas es aproximadamente <span className="font-bold text-white">S/ {(drinkRequirements.totalCost / attendees).toFixed(2)}</span>
          </div>
        </Card.Content>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <Card.Header 
            title="Información Detallada" 
            gradient
            icon={<Wine className="w-5 h-5 text-primary" />}
          />
          <Card.Content>
            <div className="space-y-6">
              <div className="bg-primary-light p-4 rounded-lg space-y-3">
                <h4 className="font-bold text-primary-dark border-b border-primary-light pb-2">Requerimientos Básicos</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-700">Asistentes:</span>
                    <span className="font-medium text-primary-dark">{attendees}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-700">Bebidas por persona:</span>
                    <span className="font-medium text-primary-dark">{drinksPerPerson}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-700">Total de bebidas:</span>
                    <span className="font-medium text-primary-dark">{drinkRequirements.totalDrinks}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-700">Costo por persona:</span>
                    <span className="font-medium text-success-dark">S/ {(drinkRequirements.totalCost / attendees).toFixed(2)}</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                <h4 className="font-bold text-primary-dark border-b border-slate-200 pb-2">Desglose de Costos</h4>
                
                <div className="grid gap-2">
                  <div className={`flex items-center p-3 ${theme.getGradient('primary')} text-white rounded-lg`}>
                    <Wine className="w-5 h-5 mr-3" />
                    <span className="flex-1 font-medium">Licores:</span>
                    <span className="text-white font-bold">S/ {drinkRequirements.spiritsCost.toFixed(2)}</span>
                  </div>
                  
                  <div className={`flex items-center p-3 ${theme.getGradient('primary')} text-white rounded-lg`}>
                    <Droplet className="w-5 h-5 mr-3" />
                    <span className="flex-1 font-medium">Mezcladores:</span>
                    <span className="text-white font-bold">S/ {drinkRequirements.mixersCost.toFixed(2)}</span>
                  </div>
                  
                  <div className={`flex items-center p-3 ${theme.getGradient('success')} text-white rounded-lg`}>
                    <Snowflake className="w-5 h-5 mr-3" />
                    <span className="flex-1 font-medium">Hielo:</span>
                    <span className="text-white font-bold">S/ {drinkRequirements.iceCost.toFixed(2)}</span>
                  </div>
                  
                  <div className={`flex items-center p-3 ${theme.getGradient('warning')} text-white rounded-lg`}>
                    <Package className="w-5 h-5 mr-3" />
                    <span className="flex-1 font-medium">Suministros:</span>
                    <span className="text-white font-bold">S/ {drinkRequirements.suppliesCost.toFixed(2)}</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-success-light text-success-dark rounded-lg font-bold">
                    <span>COSTO TOTAL DE BEBIDAS:</span>
                    <span>S/ {drinkRequirements.totalCost.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </Card.Content>
        </Card>
        
        <Card>
          <Card.Header 
            title="Estado del Inventario"
            gradient 
            icon={<CheckCircle className="w-5 h-5 text-primary" />}
          />
          <Card.Content>
            <div className="space-y-5">
              <StatusBar 
                title="Licores" 
                icon={<Wine className="w-5 h-5 text-primary" />}
                isEnough={drinkRequirements.hasEnoughSpirits}
                currentAmount={getCategoryServings('spirits')}
                requiredAmount={drinkRequirements.totalDrinks}
              />
              
              <StatusBar 
                title="Mezcladores" 
                icon={<Droplet className="w-5 h-5 text-primary" />}
                isEnough={drinkRequirements.hasEnoughMixers}
                currentAmount={getCategoryServings('mixers')}
                requiredAmount={drinkRequirements.totalDrinks}
              />
              
              <StatusBar 
                title="Hielo" 
                icon={<Snowflake className="w-5 h-5 text-primary" />}
                isEnough={drinkRequirements.hasEnoughIce}
                currentAmount={getCategoryServings('ice')}
                requiredAmount={drinkRequirements.totalDrinks}
              />
              
              <StatusBar 
                title="Suministros" 
                icon={<Package className="w-5 h-5 text-slate-700" />}
                isEnough={drinkRequirements.hasEnoughSupplies}
                currentAmount={getCategoryServings('supplies')}
                requiredAmount={drinkRequirements.totalDrinks}
              />
              
              <h4 className="font-bold text-primary-dark border-b border-slate-200 pb-2 pt-2">Cantidades Recomendadas</h4>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Card variant="default" className="bg-primary-light">
                  <Card.Header className={`${theme.getGradient('primary')} text-white p-3 font-medium`}>
                    <div className="flex items-center">
                      <Wine className="w-4 h-4 mr-2" /> Licores
                    </div>
                  </Card.Header>
                  <Card.Content className="p-3">
                    <div className="flex justify-between items-center">
                      <span className="text-primary-dark font-medium">Unidades necesarias:</span>
                      <div className="flex items-center">
                        <span className="font-bold text-primary-dark">
                          {getRecommendedUnits('spirits', drinkRequirements.totalDrinks)}
                        </span>
                        {getRecommendedUnits('spirits', drinkRequirements.totalDrinks) > shoppingItems
                          .filter(i => i.category === 'spirits')
                          .reduce((sum, i) => sum + i.units, 0) ? (
                          <Badge variant="error" size="sm" className="ml-2" icon={<AlertCircle size={12} />}>
                            Falta
                          </Badge>
                        ) : (
                          <Badge variant="success" size="sm" className="ml-2" icon={<CheckCircle size={12} />}>
                            Completo
                          </Badge>
                        )}
                      </div>
                    </div>
                  </Card.Content>
                </Card>
                
                <Card variant="default" className="bg-primary-light">
                  <Card.Header className={`${theme.getGradient('primary')} text-white p-3 font-medium`}>
                    <div className="flex items-center">
                      <Droplet className="w-4 h-4 mr-2" /> Mezcladores
                    </div>
                  </Card.Header>
                  <Card.Content className="p-3">
                    <div className="flex justify-between items-center">
                      <span className="text-primary-dark font-medium">Unidades necesarias:</span>
                      <div className="flex items-center">
                        <span className="font-bold text-primary-dark">
                          {getRecommendedUnits('mixers', drinkRequirements.totalDrinks)}
                        </span>
                        {getRecommendedUnits('mixers', drinkRequirements.totalDrinks) > shoppingItems
                          .filter(i => i.category === 'mixers')
                          .reduce((sum, i) => sum + i.units, 0) ? (
                          <Badge variant="error" size="sm" className="ml-2" icon={<AlertCircle size={12} />}>
                            Falta
                          </Badge>
                        ) : (
                          <Badge variant="success" size="sm" className="ml-2" icon={<CheckCircle size={12} />}>
                            Completo
                          </Badge>
                        )}
                      </div>
                    </div>
                  </Card.Content>
                </Card>
              </div>
            </div>
          </Card.Content>
        </Card>
      </div>
      
      <Card>
        <Card.Header 
          title="Detalle de Bebidas" 
          gradient
          icon={<Wine className="w-5 h-5 text-primary" />}
        />
        <Card.Content>
          <Table
            data={drinkItems}
            columns={drinkColumns}
            hoverable
          />
        </Card.Content>
      </Card>
      
      <Card>
        <Card.Header 
          title="Consejos para Planificar Bebidas" 
          icon={<TrendingUp className="w-5 h-5 text-primary" />}
        />
        <Card.Content>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-primary-light p-5 rounded-lg">
              <h4 className="font-bold text-primary-dark mb-3 border-b border-primary-light/50 pb-2">Opciones de Servicio</h4>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <div className="flex-shrink-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center mr-3 mt-0.5">1</div>
                  <p className="text-slate-800">Instala una estación de bebidas autoservicio para reducir trabajo y mejorar la experiencia</p>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center mr-3 mt-0.5">2</div>
                  <p className="text-slate-800">Prepara cócteles por lote para ahorrar tiempo y asegurar consistencia en el sabor</p>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center mr-3 mt-0.5">3</div>
                  <p className="text-slate-800">Usa dispensadores para mezcladores comunes como gaseosas y jugos</p>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center mr-3 mt-0.5">4</div>
                  <p className="text-slate-800">Considera contratar un bartender si el presupuesto lo permite para una experiencia premium</p>
                </li>
              </ul>
            </div>
            
            <div className="bg-success-light p-5 rounded-lg">
              <h4 className="font-bold text-success-dark mb-3 border-b border-success-light/50 pb-2">Ideas para Ahorrar Costos</h4>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <div className="flex-shrink-0 w-8 h-8 bg-success text-white rounded-full flex items-center justify-center mr-3 mt-0.5">1</div>
                  <p className="text-slate-800">Compra licores en botellas más grandes para mejor valor por mililitro</p>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 w-8 h-8 bg-success text-white rounded-full flex items-center justify-center mr-3 mt-0.5">2</div>
                  <p className="text-slate-800">Usa marcas económicas para cócteles donde el sabor se mezcla con otros ingredientes</p>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 w-8 h-8 bg-success text-white rounded-full flex items-center justify-center mr-3 mt-0.5">3</div>
                  <p className="text-slate-800">Pide a los invitados que traigan sus licores preferidos (BYOB) para reducir costos</p>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 w-8 h-8 bg-success text-white rounded-full flex items-center justify-center mr-3 mt-0.5">4</div>
                  <p className="text-slate-800">Compra hielo el día del evento para evitar que se derrita y ahorrar en cantidad</p>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 w-8 h-8 bg-success text-white rounded-full flex items-center justify-center mr-3 mt-0.5">5</div>
                  <p className="text-slate-800">Ofrece un cóctel de la casa en lugar de un bar completo para simplificar y reducir costos</p>
                </li>
              </ul>
            </div>
          </div>
        </Card.Content>
      </Card>
    </div>
  );
};

export default DrinksTab;