import React from 'react';
import { Activity, Target } from 'lucide-react';

interface FinancialMetricsProps {
  attendees: number;
  ticketPrice: number;
  perPersonCost: number;
  breakEvenAttendees: number;
  recommendedTicketPrice: number;
}

const FinancialMetrics: React.FC<FinancialMetricsProps> = ({
  attendees,
  ticketPrice,
  perPersonCost,
  breakEvenAttendees,
  recommendedTicketPrice,
}) => {
  // Recalculate key values to ensure consistency
  const recalculatedTotalRevenue = attendees * ticketPrice;
  const recalculatedTotalCosts = attendees * perPersonCost;
  const recalculatedNetProfit = recalculatedTotalRevenue - recalculatedTotalCosts;
  
  // Per-attendee metrics
  const revenuePerAttendee = ticketPrice; // This is always the ticket price
  const costPerAttendee = perPersonCost;
  const profitPerAttendee = ticketPrice - perPersonCost;
  
  // Financial ratios
  const profitMargin = (profitPerAttendee / ticketPrice) * 100;
  const roi = (profitPerAttendee / perPersonCost) * 100;
  const costRevenueRatio = (perPersonCost / ticketPrice) * 100;
  const breakEvenPercentage = (attendees / breakEvenAttendees) * 100;
  
  // Format currency with comma as thousands separator
  const formatCurrency = (value: number) => {
    if (isNaN(value) || !isFinite(value)) return "0.00";
    return value.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };
  
  // Format percentage
  const formatPercentage = (value: number) => {
    if (isNaN(value) || !isFinite(value)) return "0.00%";
    return value.toFixed(2) + "%";
  };
  
  return (
    <div className="bg-white rounded-md border border-gray-300 overflow-hidden">
      <div className="border-b border-gray-300 bg-gray-100 p-4">
        <div className="flex items-center">
          <Activity className="h-5 w-5 text-gray-700 mr-2" />
          <h3 className="text-lg font-semibold text-gray-800">Métricas y Análisis Financiero</h3>
        </div>
      </div>
      
      <div className="p-5">
        {/* Core Financial Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-gray-50 rounded p-4 border border-gray-200">
            <h4 className="text-sm font-medium text-gray-600 mb-1">Costo por Persona</h4>
            <p className="text-xl font-semibold text-gray-800">S/ {formatCurrency(perPersonCost)}</p>
            <div className="mt-2 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Ticket</span>
                <span className={`${ticketPrice >= perPersonCost ? 'text-green-600' : 'text-red-600'} font-medium`}>
                  S/ {formatCurrency(ticketPrice)}
                </span>
              </div>
              <div className="flex justify-between items-center mt-1">
                <span className="text-gray-600">Margen</span>
                <span className={`${ticketPrice >= perPersonCost ? 'text-green-600' : 'text-red-600'} font-medium`}>
                  S/ {formatCurrency(ticketPrice - perPersonCost)}
                </span>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-50 rounded p-4 border border-gray-200">
            <h4 className="text-sm font-medium text-gray-600 mb-1">Punto de Equilibrio</h4>
            <p className="text-xl font-semibold text-gray-800">{breakEvenAttendees} asistentes</p>
            <div className="mt-2 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Actual</span>
                <span className={`${attendees >= breakEvenAttendees ? 'text-green-600' : 'text-red-600'} font-medium`}>
                  {attendees} asistentes
                </span>
              </div>
              <div className="flex justify-between items-center mt-1">
                <span className="text-gray-600">Diferencia</span>
                <span className={`${attendees >= breakEvenAttendees ? 'text-green-600' : 'text-red-600'} font-medium`}>
                  {attendees >= breakEvenAttendees 
                    ? `+${attendees - breakEvenAttendees}` 
                    : `-${breakEvenAttendees - attendees}`}
                </span>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-50 rounded p-4 border border-gray-200">
            <h4 className="text-sm font-medium text-gray-600 mb-1">Precio Recomendado</h4>
            <p className="text-xl font-semibold text-gray-800">S/ {formatCurrency(recommendedTicketPrice)}</p>
            <div className="mt-2 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Actual</span>
                <span className={`${ticketPrice >= recommendedTicketPrice ? 'text-green-600' : 'text-red-600'} font-medium`}>
                  S/ {formatCurrency(ticketPrice)}
                </span>
              </div>
              <div className="flex justify-between items-center mt-1">
                <span className="text-gray-600">Ajuste</span>
                <span className={`${ticketPrice >= recommendedTicketPrice ? 'text-green-600' : 'text-red-600'} font-medium`}>
                  {ticketPrice >= recommendedTicketPrice 
                    ? "+0.00" 
                    : `+${formatCurrency(recommendedTicketPrice - ticketPrice)}`}
                </span>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-50 rounded p-4 border border-gray-200">
            <h4 className="text-sm font-medium text-gray-600 mb-1">ROI</h4>
            <p className={`text-xl font-semibold ${roi >= 0 ? 'text-green-700' : 'text-red-700'}`}>
              {formatPercentage(roi)}
            </p>
            <div className="mt-2 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Invertido</span>
                <span className="text-gray-700 font-medium">S/ {formatCurrency(perPersonCost)}</span>
              </div>
              <div className="flex justify-between items-center mt-1">
                <span className="text-gray-600">Retorno</span>
                <span className={`${profitPerAttendee >= 0 ? 'text-green-600' : 'text-red-600'} font-medium`}>
                  S/ {formatCurrency(profitPerAttendee)}
                </span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Financial Indicators Section */}
        <h4 className="text-sm font-bold text-gray-800 mb-3 uppercase tracking-wider border-b border-gray-200 pb-2">
          INDICADORES FINANCIEROS
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Per Attendee Metrics */}
          <div>
            <table className="w-full text-sm">
              <thead>
                <tr>
                  <th className="text-left py-2 font-medium text-gray-700">Métrica por Asistente</th>
                  <th className="text-right py-2 font-medium text-gray-700">Valor</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-200">
                  <td className="py-2 text-gray-600">Ingreso por Asistente</td>
                  <td className="py-2 text-right font-mono text-gray-700">
                    S/ {formatCurrency(revenuePerAttendee)}
                  </td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="py-2 text-gray-600">Costo por Asistente</td>
                  <td className="py-2 text-right font-mono text-gray-700">
                    S/ {formatCurrency(costPerAttendee)}
                  </td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="py-2 text-gray-600">Beneficio por Asistente</td>
                  <td className={`py-2 text-right font-mono ${
                    profitPerAttendee >= 0 ? 'text-green-700' : 'text-red-700'
                  }`}>
                    S/ {formatCurrency(profitPerAttendee)}
                  </td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="py-2 text-gray-600">Ratio Ingreso/Costo</td>
                  <td className={`py-2 text-right font-medium ${
                    (ticketPrice / perPersonCost) >= 1 ? 'text-green-700' : 'text-red-700'
                  }`}>
                    {(ticketPrice / perPersonCost).toFixed(2)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          
          {/* Profitability Metrics */}
          <div>
            <table className="w-full text-sm">
              <thead>
                <tr>
                  <th className="text-left py-2 font-medium text-gray-700">Métrica de Rentabilidad</th>
                  <th className="text-right py-2 font-medium text-gray-700">Valor</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-200">
                  <td className="py-2 text-gray-600">Margen de Beneficio</td>
                  <td className={`py-2 text-right font-medium ${
                    profitMargin >= 0 ? 'text-green-700' : 'text-red-700'
                  }`}>
                    {formatPercentage(profitMargin)}
                  </td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="py-2 text-gray-600">Ratio Costo/Ingreso</td>
                  <td className={`py-2 text-right font-medium ${
                    costRevenueRatio <= 100 ? 'text-green-700' : 'text-red-700'
                  }`}>
                    {formatPercentage(costRevenueRatio)}
                  </td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="py-2 text-gray-600">ROI (Retorno de Inversión)</td>
                  <td className={`py-2 text-right font-medium ${
                    roi >= 0 ? 'text-green-700' : 'text-red-700'
                  }`}>
                    {formatPercentage(roi)}
                  </td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="py-2 text-gray-600">Break-Even % (actual/requerido)</td>
                  <td className={`py-2 text-right font-medium ${
                    breakEvenPercentage >= 100 ? 'text-green-700' : 'text-red-700'
                  }`}>
                    {formatPercentage(breakEvenPercentage)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        
        {/* Target Metrics Section */}
        <div>
          <h4 className="flex items-center text-sm font-bold text-gray-800 mb-3 uppercase tracking-wider border-b border-gray-200 pb-2">
            <Target className="h-4 w-4 text-gray-600 mr-2" />
            OBJETIVOS FINANCIEROS
          </h4>
          
          <div className="text-sm space-y-4">
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-gray-600 font-medium">Margen de Beneficio Óptimo (15%+)</span>
                <span className={`text-xs px-2 py-0.5 rounded ${
                  profitMargin >= 15 ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {profitMargin >= 15 ? 'Alcanzado' : 'No Alcanzado'}
                </span>
              </div>
              <div className="h-2 w-full bg-gray-100 rounded overflow-hidden">
                <div 
                  className={`h-full ${profitMargin >= 15 ? 'bg-green-500' : 'bg-yellow-500'}`}
                  style={{ width: profitMargin >= 15 ? '100%' : `${Math.min(99, (profitMargin / 15) * 100)}%` }}
                ></div>
              </div>
              <p className="mt-1 text-xs text-gray-500">
                Actual: {formatPercentage(profitMargin)} | Meta: 15%
              </p>
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-gray-600 font-medium">Cobertura del Punto de Equilibrio</span>
                <span className={`text-xs px-2 py-0.5 rounded ${
                  attendees >= breakEvenAttendees ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {attendees >= breakEvenAttendees ? 'Alcanzado' : 'No Alcanzado'}
                </span>
              </div>
              <div className="h-2 w-full bg-gray-100 rounded overflow-hidden">
                <div 
                  className={`h-full ${attendees >= breakEvenAttendees ? 'bg-green-500' : 'bg-yellow-500'}`}
                  style={{ width: attendees >= breakEvenAttendees ? '100%' : `${Math.min(99, (attendees / breakEvenAttendees) * 100)}%` }}
                ></div>
              </div>
              <p className="mt-1 text-xs text-gray-500">
                Actual: {attendees} | Meta: {breakEvenAttendees} asistentes
              </p>
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-gray-600 font-medium">Precio Recomendado</span>
                <span className={`text-xs px-2 py-0.5 rounded ${
                  ticketPrice >= recommendedTicketPrice ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {ticketPrice >= recommendedTicketPrice ? 'Alcanzado' : 'No Alcanzado'}
                </span>
              </div>
              <div className="h-2 w-full bg-gray-100 rounded overflow-hidden">
                <div 
                  className={`h-full ${ticketPrice >= recommendedTicketPrice ? 'bg-green-500' : 'bg-yellow-500'}`}
                  style={{ width: ticketPrice >= recommendedTicketPrice ? '100%' : `${Math.min(99, (ticketPrice / recommendedTicketPrice) * 100)}%` }}
                ></div>
              </div>
              <p className="mt-1 text-xs text-gray-500">
                Actual: S/ {formatCurrency(ticketPrice)} | Meta: S/ {formatCurrency(recommendedTicketPrice)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinancialMetrics;