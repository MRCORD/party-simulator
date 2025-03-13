import React from 'react';
import { DollarSign, CheckCircle, AlertCircle, ArrowUp, ArrowDown } from 'lucide-react';
import { useTheme } from '@/components/ui/ThemeProvider';

interface FinancialSummaryProps {
  totalRevenue: number;
  totalCosts: number;
  netProfit: number;
  isViable: boolean;
  recommendedTicketPrice: number;
}

const FinancialSummary: React.FC<FinancialSummaryProps> = ({
  totalRevenue,
  totalCosts,
  netProfit,
  isViable,
  recommendedTicketPrice
}) => {
  const theme = useTheme();
  
  return (
    <div className="bg-white rounded-xl border border-slate-100 shadow-sm">
      <div className={`${theme.getGradient('primary')} px-4 py-3 text-white`}>
        <div className="flex items-center">
          <DollarSign className="w-5 h-5 mr-2" />
          <h3 className="font-medium">Resumen Financiero</h3>
        </div>
      </div>
      
      {/* Financial Summary Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-0.5 bg-gray-100 p-0.5">
        {/* Revenue Card */}
        <div className="bg-white p-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-blue-700 font-medium flex items-center">
              <DollarSign className="w-4 h-4 mr-1" />
              Ingresos
            </h4>
            <span className="text-sm text-blue-500 font-medium">
              S/ {totalRevenue.toFixed(2)}
            </span>
          </div>
          <div className="space-y-1">
            <div className="flex justify-between text-sm py-2 font-medium">
              <span className="text-gray-800">Total Ingresos</span>
              <span className="text-blue-600">S/ {totalRevenue.toFixed(2)}</span>
            </div>
          </div>
        </div>
        
        {/* Expenses Card */}
        <div className="bg-white p-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-red-700 font-medium flex items-center">
              <DollarSign className="w-4 h-4 mr-1" />
              Gastos
            </h4>
            <span className="text-sm text-red-500 font-medium">
              S/ {totalCosts.toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between text-sm py-2 font-medium">
            <span className="text-gray-800">Total Gastos</span>
            <span className="text-red-600">S/ {totalCosts.toFixed(2)}</span>
          </div>
        </div>
      </div>
      
      {/* Bottom Line Results */}
      <div className="border-t border-gray-200 bg-gray-50 px-4 py-4">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center">
          <div className="flex items-center mb-3 md:mb-0">
            <h4 className="text-gray-800 font-medium mr-2">Resultado Neto:</h4>
            <div className={`flex items-center ${netProfit >= 0 ? 'text-green-600' : 'text-red-600'} font-bold text-lg`}>
              {netProfit >= 0 ? (
                <ArrowUp className="w-5 h-5 mr-1" />
              ) : (
                <ArrowDown className="w-5 h-5 mr-1" />
              )}
              S/ {netProfit.toFixed(2)}
            </div>
          </div>
          
          <div className="flex items-center">
            <span className="text-gray-600 mr-2">Viabilidad Financiera:</span>
            <span className={`flex items-center ${isViable ? 'text-green-600' : 'text-red-600'} font-medium`}>
              {isViable ? (
                <>
                  <CheckCircle className="w-4 h-4 mr-1" />
                  <span>Viable</span>
                </>
              ) : (
                <>
                  <AlertCircle className="w-4 h-4 mr-1" />
                  <span>No Viable</span>
                </>
              )}
            </span>
          </div>
        </div>
        
        {!isViable && (
          <div className="mt-3 bg-red-50 border-l-4 border-red-400 p-3 text-red-700">
            <div className="flex items-start">
              <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0" />
              <div>
                <p className="font-medium mb-1">Acción Recomendada:</p>
                <p className="text-sm">
                  Aumentar el precio de entrada a al menos S/ {recommendedTicketPrice} para ser rentable.
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