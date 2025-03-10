"use client";

import React from 'react';
import Card from '@/components/ui/Card';
import Table from '@/components/ui/Table';
import Badge from '@/components/ui/Badge';
import { useTheme } from '@/components/ui/ThemeProvider';
import { FileBarChart, TrendingUp, DollarSign, Users } from 'lucide-react';

const ReportsTab = ({
  venueCost,
  attendees,
  ticketPrice,
  totalCosts,
  totalRevenue,
  netProfit,
  perPersonCost,
  breakEvenAttendees,
  recommendedTicketPrice,
  isViable,
  calculateDrinkRequirements,
  calculateFoodRequirements,
  drinksPerPerson,
  foodServingsPerPerson,
  shoppingItems,
  getCategoryTotal
}) => {
  const theme = useTheme();
  
  // Define columns for the first table
  const financialColumns = [
    { 
      accessor: 'category', 
      Header: 'Categoría',
      width: '25%'
    },
    { 
      accessor: 'cost', 
      Header: 'Costo (S/)',
      Cell: ({ value }) => `S/ ${value.toFixed(2)}`
    },
    { 
      accessor: 'perPerson', 
      Header: 'Por Persona (S/)',
      Cell: ({ value }) => `S/ ${value.toFixed(2)}`
    },
    { 
      accessor: 'percentage', 
      Header: '% del Total',
      Cell: ({ value }) => `${value.toFixed(1)}%`
    }
  ];
  
  // Financial summary data
  const financialData = [
    {
      category: 'Local',
      cost: venueCost,
      perPerson: venueCost / attendees,
      percentage: (venueCost / totalCosts) * 100
    },
    {
      category: 'Bebidas',
      cost: calculateDrinkRequirements().totalCost,
      perPerson: calculateDrinkRequirements().totalCost / attendees,
      percentage: (calculateDrinkRequirements().totalCost / totalCosts) * 100
    },
    {
      category: 'Comida',
      cost: calculateFoodRequirements().totalCost,
      perPerson: calculateFoodRequirements().totalCost / attendees,
      percentage: (calculateFoodRequirements().totalCost / totalCosts) * 100
    },
    {
      category: 'Misceláneos',
      cost: totalCosts - venueCost - calculateDrinkRequirements().totalCost - calculateFoodRequirements().totalCost,
      perPerson: (totalCosts - venueCost - calculateDrinkRequirements().totalCost - calculateFoodRequirements().totalCost) / attendees,
      percentage: ((totalCosts - venueCost - calculateDrinkRequirements().totalCost - calculateFoodRequirements().totalCost) / totalCosts) * 100
    },
    {
      category: 'COSTOS TOTALES',
      cost: totalCosts,
      perPerson: perPersonCost,
      percentage: 100
    },
    {
      category: 'INGRESOS TOTALES',
      cost: totalRevenue,
      perPerson: ticketPrice,
      percentage: '-'
    },
    {
      category: 'BENEFICIO/PÉRDIDA NETA',
      cost: netProfit,
      perPerson: netProfit / attendees,
      percentage: netProfit >= 0 ? `${((netProfit / totalRevenue) * 100).toFixed(1)}% margen` : '-'
    }
  ];
  
  // Define columns for the beverage table
  const beverageColumns = [
    { accessor: 'category', Header: 'Categoría' },
    { accessor: 'items', Header: 'Artículos' },
    { 
      accessor: 'cost', 
      Header: 'Costo',
      Cell: ({ value }) => `S/ ${value.toFixed(2)}`
    }
  ];
  
  // Beverage data
  const beverageData = [
    {
      category: 'Licores',
      items: shoppingItems.filter(i => i.category === 'spirits').length,
      cost: getCategoryTotal('spirits')
    },
    {
      category: 'Mezcladores',
      items: shoppingItems.filter(i => i.category === 'mixers').length,
      cost: getCategoryTotal('mixers')
    },
    {
      category: 'Hielo',
      items: shoppingItems.filter(i => i.category === 'ice').length,
      cost: getCategoryTotal('ice')
    },
    {
      category: 'Suministros',
      items: shoppingItems.filter(i => i.category === 'supplies').length,
      cost: getCategoryTotal('supplies')
    }
  ];
  
  // Define columns for the food table
  const foodColumns = [
    { accessor: 'category', Header: 'Categoría' },
    { accessor: 'items', Header: 'Artículos' },
    { 
      accessor: 'cost', 
      Header: 'Costo',
      Cell: ({ value }) => `S/ ${value.toFixed(2)}`
    }
  ];
  
  // Food data
  const foodData = [
    {
      category: 'Carnes',
      items: shoppingItems.filter(i => i.category === 'meat').length,
      cost: getCategoryTotal('meat')
    },
    {
      category: 'Guarniciones',
      items: shoppingItems.filter(i => i.category === 'sides').length,
      cost: getCategoryTotal('sides')
    },
    {
      category: 'Condimentos',
      items: shoppingItems.filter(i => i.category === 'condiments').length,
      cost: getCategoryTotal('condiments')
    },
    {
      category: 'Otros',
      items: shoppingItems.filter(i => i.category === 'other').length,
      cost: getCategoryTotal('other')
    }
  ];
  
  return (
    <div className="space-y-6">
      <Card>
        <Card.Header 
          title="Resumen Financiero" 
          icon={<FileBarChart className="w-5 h-5 text-primary" />}
          gradient
        />
        <Card.Content>
          <Table
            data={financialData}
            columns={financialColumns}
            striped
            hoverable
          />
        </Card.Content>
      </Card>
      
      <Card>
        <Card.Header 
          title="Resumen de Lista de Compras" 
          icon={<TrendingUp className="w-5 h-5 text-primary" />}
        />
        <Card.Content>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-3">Bebidas</h4>
              <Table
                data={beverageData}
                columns={beverageColumns}
                compact
              />
            </div>
            
            <div>
              <h4 className="font-medium mb-3">Comida</h4>
              <Table
                data={foodData}
                columns={foodColumns}
                compact
              />
            </div>
          </div>
        </Card.Content>
      </Card>
      
      <Card>
        <Card.Header 
          title="Métricas Clave y Recomendaciones" 
          icon={<DollarSign className="w-5 h-5 text-primary" />}
        />
        <Card.Content>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card variant="accent" accentColor="primary">
              <Card.Header title="Métricas Financieras" />
              <Card.Content>
                <ul className="space-y-2 text-sm">
                  <li className="flex justify-between">
                    <span>Punto de equilibrio:</span>
                    <span className="font-medium">{breakEvenAttendees} asistentes</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Costo por asistente:</span>
                    <span className="font-medium">S/ {perPersonCost.toFixed(2)}</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Margen de beneficio:</span>
                    <span className={`font-medium ${netProfit >= 0 ? 'text-success' : 'text-error'}`}>
                      {netProfit >= 0 ? ((netProfit / totalRevenue) * 100).toFixed(1) + '%' : 'N/A'}
                    </span>
                  </li>
                  <li className="flex justify-between">
                    <span>Entrada mínima viable:</span>
                    <span className="font-medium">S/ {recommendedTicketPrice}</span>
                  </li>
                </ul>
              </Card.Content>
            </Card>
            
            <Card variant="accent" accentColor="success">
              <Card.Header title="Métricas del Evento" />
              <Card.Content>
                <ul className="space-y-2 text-sm">
                  <li className="flex justify-between">
                    <span>Bebidas por persona:</span>
                    <span className="font-medium">{drinksPerPerson}</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Porciones de comida por persona:</span>
                    <span className="font-medium">{foodServingsPerPerson}</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Total bebidas necesarias:</span>
                    <span className="font-medium">{attendees * drinksPerPerson}</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Total porciones de comida necesarias:</span>
                    <span className="font-medium">{attendees * foodServingsPerPerson}</span>
                  </li>
                </ul>
              </Card.Content>
            </Card>
            
            <Card variant={isViable ? 'accent' : 'accent'} accentColor={isViable ? 'success' : 'error'}>
              <Card.Header title="Recomendaciones" />
              <Card.Content>
                <ul className="space-y-2 text-sm">
                  <li className="flex justify-between items-center">
                    <span>Precio de Entrada:</span>
                    <Badge variant={ticketPrice >= recommendedTicketPrice ? 'success' : 'error'}>
                      {ticketPrice >= recommendedTicketPrice ? 'Bueno' : `Aumentar a S/${recommendedTicketPrice}`}
                    </Badge>
                  </li>
                  <li className="flex justify-between items-center">
                    <span>Asistencia:</span>
                    <Badge variant={attendees >= breakEvenAttendees ? 'success' : 'error'}>
                      {attendees >= breakEvenAttendees ? 'Bueno' : `Necesita ${breakEvenAttendees - attendees} más`}
                    </Badge>
                  </li>
                  <li className="flex justify-between items-center">
                    <span>Viabilidad general:</span>
                    <Badge variant={isViable ? 'success' : 'error'}>
                      {isViable ? 'Viable' : 'No viable'}
                    </Badge>
                  </li>
                </ul>
              </Card.Content>
            </Card>
          </div>
        </Card.Content>
      </Card>
    </div>
  );
};

export default ReportsTab;