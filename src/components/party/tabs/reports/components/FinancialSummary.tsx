import React from 'react';
import { DollarSign, AlertCircle } from 'lucide-react';
import { useTheme } from '@/components/ui/ThemeProvider';

interface FinancialSummaryProps {
  totalRevenue: number;
  totalCosts: number;
  netProfit: number;
  venueCost: number;
  drinkRequirements: any;
  foodRequirements: any;
  miscCosts: number;
  isViable: boolean;
}

const FinancialSummary: React.FC<FinancialSummaryProps> = ({
  totalRevenue,
  totalCosts,
  netProfit,
  venueCost,
  drinkRequirements,
  foodRequirements,
  miscCosts,
  isViable
}) => {
  const theme = useTheme();
  
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <div className={`${theme.getGradient('primary')} px-4 py-3 text-white`}>
        <div className="flex items-center">
          <DollarSign className="w-5 h-5 mr-2" />
          <h3 className="font-medium">Resumen Financiero</h3>
        </div>
      </div>
      
      <div className="p-4 bg-white">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-5">
          {/* Income and Costs Group */}
          <div className="grid grid-cols-1 gap-3">
            <div className="rounded-lg bg-success-light p-4 border border-success shadow-sm">
              <div className="flex justify-between items-center">
                <span className="text-lg font-medium text-primary">Ingresos:</span>
                <span className="text-lg font-medium text-success-dark">S/ {totalRevenue.toFixed(2)}</span>
              </div>
            </div>
            
            <div className="rounded-lg bg-error-light p-4 border border-error shadow-sm">
              <div className="flex justify-between items-center">
                <span className="text-lg font-medium text-primary">Costos:</span>
                <span className="text-lg font-medium text-error-dark">S/ {totalCosts.toFixed(2)}</span>
              </div>
            </div>
            
            <div className={`rounded-lg ${netProfit >= 0 ? 'bg-success-light border-success' : 'bg-error-light border-error'} p-4 border shadow-sm`}>
              <div className="flex justify-between items-center">
                <span className="text-lg font-medium text-primary">Ganancia:</span>
                <span className={`text-lg font-medium ${netProfit >= 0 ? 'text-success-dark' : 'text-error-dark'}`}>
                  S/ {netProfit.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Cost Breakdown */}
          <div className="grid grid-cols-1 gap-3">
            <div className="rounded-lg bg-teal-50 p-4 border border-teal-200 shadow-sm">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-primary">Local:</span>
                <span className="text-sm font-medium text-gray-700">S/ {venueCost.toFixed(2)}</span>
              </div>
            </div>
            
            <div className="rounded-lg bg-blue-50 p-4 border border-blue-200 shadow-sm">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-primary">Bebidas:</span>
                <span className="text-sm font-medium text-gray-700">S/ {drinkRequirements.totalCost.toFixed(2)}</span>
              </div>
            </div>
            
            <div className="rounded-lg bg-amber-50 p-4 border border-amber-200 shadow-sm">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-primary">Comida:</span>
                <span className="text-sm font-medium text-gray-700">S/ {foodRequirements.totalCost.toFixed(2)}</span>
              </div>
            </div>
            
            <div className="rounded-lg bg-pink-50 p-4 border border-pink-200 shadow-sm">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-primary">Misceláneos:</span>
                <span className="text-sm font-medium text-gray-700">S/ {miscCosts.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
        
        {!isViable && (
          <div className={`${theme.getGradient('error')} text-white rounded-lg p-4 shadow-md`}>
            <div className="flex items-start">
              <AlertCircle className="w-6 h-6 mr-3 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium text-lg">¡Fiesta No Viable Financieramente!</p>
                <p className="mt-1">
                  Los costos superan los ingresos proyectados. Revisa las recomendaciones para mejorar la viabilidad financiera.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FinancialSummary;