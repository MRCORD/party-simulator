import React from 'react';
import { Target, Info, CheckCircle, AlertCircle } from 'lucide-react';
import { useTheme } from '@/components/ui/ThemeProvider';
import { DrinkRequirements, FoodRequirements } from '@/types/food';

interface RecommendationsSectionProps {
  isViable: boolean;
  ticketPrice: number;
  recommendedTicketPrice: number;
  attendees: number;
  breakEvenAttendees: number;
  drinkRequirements: DrinkRequirements;
  foodRequirements: FoodRequirements;
  profitMargin: number;
  totalCosts: number;
}

const RecommendationsSection: React.FC<RecommendationsSectionProps> = ({
  isViable,
  ticketPrice,
  recommendedTicketPrice,
  attendees,
  breakEvenAttendees,
  drinkRequirements,
  foodRequirements,
  profitMargin,
  totalCosts
}) => {
  const theme = useTheme();
  
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <div className={`${theme.getGradient('primary')} px-4 py-3 text-white`}>
        <div className="flex items-center">
          <Target className="w-5 h-5 mr-2" />
          <h3 className="font-medium">Recomendaciones Financieras</h3>
        </div>
      </div>
      
      <div className="p-4">
        <div className="bg-primary-light/20 rounded-lg p-4 border border-primary-light mb-4">
          <h5 className="font-medium text-primary-dark flex items-center mb-2">
            <Info className="w-5 h-5 mr-2" />
            Diagnóstico Financiero
          </h5>
          <p className="text-sm text-primary-dark mb-3">
            {isViable 
              ? 'El evento es financieramente viable con la estructura actual de costos e ingresos.' 
              : 'El evento no es financieramente viable con la estructura actual de costos e ingresos.'}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            <div className={`rounded-lg p-3 text-sm ${isViable ? 'bg-success-light text-success-dark' : 'bg-warning-light text-warning-dark'}`}>
              <div className="font-medium mb-1">Estado Actual</div>
              <div className="flex items-center">
                {isViable ? (
                  <CheckCircle className="w-4 h-4 mr-1 flex-shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 mr-1 flex-shrink-0" />
                )}
                <span>{isViable ? 'Viable' : 'No Viable'}</span>
              </div>
            </div>
            <div className={`rounded-lg p-3 text-sm ${attendees >= breakEvenAttendees ? 'bg-success-light text-success-dark' : 'bg-warning-light text-warning-dark'}`}>
              <div className="font-medium mb-1">Asistencia</div>
              <div>
                Actual: <span className="font-medium">{attendees}</span> / Necesaria: <span className="font-medium">{breakEvenAttendees}</span>
              </div>
            </div>
            <div className={`rounded-lg p-3 text-sm ${ticketPrice >= recommendedTicketPrice ? 'bg-success-light text-success-dark' : 'bg-warning-light text-warning-dark'}`}>
              <div className="font-medium mb-1">Precio de Entrada</div>
              <div>
                Actual: <span className="font-medium">S/ {ticketPrice.toFixed(2)}</span> / Recomendado: <span className="font-medium">S/ {recommendedTicketPrice.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
        
        <h5 className="font-medium text-gray-800 mb-3">Acciones Recomendadas</h5>
        <ul className="space-y-2">
          {ticketPrice < recommendedTicketPrice && (
            <li className="flex items-start">
              <div className="flex-shrink-0 h-5 w-5 rounded-full border border-primary flex items-center justify-center mr-2 mt-0.5">
                <span className="h-3 w-3 rounded-sm bg-primary"></span>
              </div>
              <span className="text-sm text-gray-700">
                Aumentar el precio de la entrada a S/ {recommendedTicketPrice.toFixed(2)} (+S/ {(recommendedTicketPrice - ticketPrice).toFixed(2)}) para asegurar rentabilidad.
              </span>
            </li>
          )}
          
          {attendees < breakEvenAttendees && (
            <li className="flex items-start">
              <div className="flex-shrink-0 h-5 w-5 rounded-full border border-primary flex items-center justify-center mr-2 mt-0.5">
                <span className="h-3 w-3 rounded-sm bg-primary"></span>
              </div>
              <span className="text-sm text-gray-700">
                Aumentar la asistencia a al menos {breakEvenAttendees} personas (+{breakEvenAttendees - attendees}) para alcanzar el punto de equilibrio.
              </span>
            </li>
          )}
          
          {drinkRequirements.totalCost > foodRequirements.totalCost * 2 && (
            <li className="flex items-start">
              <div className="flex-shrink-0 h-5 w-5 rounded-full border border-primary flex items-center justify-center mr-2 mt-0.5">
                <span className="h-3 w-3 rounded-sm bg-primary"></span>
              </div>
              <span className="text-sm text-gray-700">
                Optimizar los costos de bebidas que representan un {((drinkRequirements.totalCost / totalCosts) * 100).toFixed(1)}% del presupuesto total.
              </span>
            </li>
          )}
          
          {profitMargin < 15 && profitMargin >= 0 && (
            <li className="flex items-start">
              <div className="flex-shrink-0 h-5 w-5 rounded-full border border-primary flex items-center justify-center mr-2 mt-0.5">
                <span className="h-3 w-3 rounded-sm bg-primary"></span>
              </div>
              <span className="text-sm text-gray-700">
                Buscar formas de aumentar el margen de beneficio actual ({profitMargin.toFixed(1)}%) a al menos 15% para mejor rentabilidad.
              </span>
            </li>
          )}
          
          <li className="flex items-start">
            <div className="flex-shrink-0 h-5 w-5 rounded-full border border-primary flex items-center justify-center mr-2 mt-0.5">
              <span className="h-3 w-3 rounded-sm bg-primary"></span>
            </div>
            <span className="text-sm text-gray-700">
              {isViable 
                ? 'Mantener el control de gastos para preservar la viabilidad financiera.' 
                : 'Revisar y ajustar la estructura de costos para mejorar la viabilidad financiera.'}
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default RecommendationsSection;