import React from 'react';
import { Activity, Info } from 'lucide-react';
import { useTheme } from '@/components/ui/ThemeProvider';

interface FinancialMetricsProps {
  attendees: number;
  ticketPrice: number;
  perPersonCost: number;
  breakEvenAttendees: number;
  recommendedTicketPrice: number;
  profitMargin: number;
  costRevenue: number;
  roi: number;
}

const FinancialMetrics: React.FC<FinancialMetricsProps> = ({
  attendees,
  ticketPrice,
  perPersonCost,
  breakEvenAttendees,
  recommendedTicketPrice,
  profitMargin,
  costRevenue,
  roi
}) => {
  const theme = useTheme();
  
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <div className={`${theme.getGradient('primary')} px-4 py-3 text-white`}>
        <div className="flex items-center">
          <Activity className="w-5 h-5 mr-2" />
          <h3 className="font-medium">Métricas Financieras</h3>
        </div>
      </div>
      
      <div className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-4">
          <div className="bg-primary-light/20 rounded-lg p-3 border border-primary-light">
            <div className="text-xs text-gray-500 mb-1">Costo por Persona</div>
            <div className="text-base font-medium text-gray-800">S/ {perPersonCost.toFixed(2)}</div>
            <div className="mt-1 flex items-center">
              {ticketPrice >= perPersonCost ? (
                <span className="text-xs text-success-dark flex items-center">
                  Ingreso cubre costo
                </span>
              ) : (
                <span className="text-xs text-error-dark flex items-center">
                  Costo mayor que ingreso
                </span>
              )}
            </div>
          </div>
          
          <div className="bg-primary-light/20 rounded-lg p-3 border border-primary-light">
            <div className="text-xs text-gray-500 mb-1">Punto de Equilibrio</div>
            <div className="text-base font-medium text-gray-800">{breakEvenAttendees} asistentes</div>
            <div className="mt-1 flex items-center">
              {attendees >= breakEvenAttendees ? (
                <span className="text-xs text-success-dark flex items-center">
                  Por encima del equilibrio
                </span>
              ) : (
                <span className="text-xs text-error-dark flex items-center">
                  Faltan {breakEvenAttendees - attendees}
                </span>
              )}
            </div>
          </div>
          
          <div className="bg-primary-light/20 rounded-lg p-3 border border-primary-light">
            <div className="text-xs text-gray-500 mb-1">Precio Recomendado</div>
            <div className="text-base font-medium text-gray-800">S/ {recommendedTicketPrice}</div>
            <div className="mt-1 flex items-center">
              {ticketPrice >= recommendedTicketPrice ? (
                <span className="text-xs text-success-dark flex items-center">
                  Precio adecuado
                </span>
              ) : (
                <span className="text-xs text-warning-dark flex items-center">
                  Aumentar en S/ {(recommendedTicketPrice - ticketPrice).toFixed(2)}
                </span>
              )}
            </div>
          </div>
          
          <div className="bg-primary-light/20 rounded-lg p-3 border border-primary-light">
            <div className="text-xs text-gray-500 mb-1">Margen de Beneficio</div>
            <div className={`text-base font-medium ${profitMargin >= 0 ? 'text-success' : 'text-error'}`}>
              {profitMargin.toFixed(1)}%
            </div>
            <div className="mt-1 flex items-center">
              {profitMargin >= 15 ? (
                <span className="text-xs text-success-dark flex items-center">
                  Excelente margen
                </span>
              ) : profitMargin >= 0 ? (
                <span className="text-xs text-warning-dark flex items-center">
                  Margen positivo bajo
                </span>
              ) : (
                <span className="text-xs text-error-dark flex items-center">
                  Margen negativo
                </span>
              )}
            </div>
          </div>
        </div>
        
        {/* Financial Ratios */}
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Costs vs Revenue */}
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm text-gray-600">Costos vs. Ingresos</span>
              <span className={`text-sm font-medium ${costRevenue <= 80 ? 'text-success' : costRevenue <= 100 ? 'text-warning' : 'text-error'}`}>
                {costRevenue.toFixed(1)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className={`h-2.5 rounded-full ${
                  costRevenue <= 80 ? 'bg-success' : 
                  costRevenue <= 100 ? 'bg-warning' : 
                  'bg-error'
                }`} 
                style={{ width: `${Math.min(costRevenue, 100)}%` }}
              ></div>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {costRevenue <= 80 ? 'Buena eficiencia de costos' : 
              costRevenue <= 100 ? 'Los costos consumen la mayoría de los ingresos' : 
              'Los costos superan los ingresos - ajusta precios o reduce costos'}
            </p>
          </div>
          
          {/* ROI */}
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm text-gray-600">Retorno de Inversión (ROI)</span>
              <span className={`text-sm font-medium ${roi >= 20 ? 'text-success' : roi >= 0 ? 'text-warning' : 'text-error'}`}>
                {roi.toFixed(1)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className={`h-2.5 rounded-full ${
                  roi >= 20 ? 'bg-success' : 
                  roi >= 0 ? 'bg-warning' : 
                  'bg-error'
                }`} 
                style={{ width: `${Math.min(Math.max(roi + 20, 0), 100)}%` }}
              ></div>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {roi >= 20 ? 'Excelente retorno de inversión' : 
              roi >= 0 ? 'Retorno positivo pero bajo' : 
              'Retorno negativo - reconsiderar la estructura de costos'}
            </p>
          </div>
        </div>
        
        {/* Explanation card */}
        <div className="mt-6 bg-blue-50 p-4 rounded-lg">
          <div className="flex">
            <Info className="w-5 h-5 text-primary mr-3 flex-shrink-0" />
            <div>
              <h4 className="font-medium text-primary-dark mb-1">Interpretación de Métricas</h4>
              <ul className="list-disc pl-5 space-y-1 text-sm text-primary-dark">
                <li><strong>Costo por Persona</strong>: El costo total dividido por el número de asistentes. El precio del ticket debe ser mayor que este valor.</li>
                <li><strong>Punto de Equilibrio</strong>: La cantidad mínima de asistentes necesarios para cubrir todos los costos.</li>
                <li><strong>Precio Recomendado</strong>: El precio mínimo del ticket para asegurar rentabilidad.</li>
                <li><strong>Margen de Beneficio</strong>: El porcentaje de ingresos que se convierte en beneficio neto.</li>
                <li><strong>Costos vs. Ingresos</strong>: Qué porcentaje de los ingresos se dedica a cubrir costos.</li>
                <li><strong>ROI</strong>: Retorno de Inversión - el beneficio generado por cada unidad invertida.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinancialMetrics;