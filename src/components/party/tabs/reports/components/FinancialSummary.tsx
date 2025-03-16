import React from 'react';
import { FileText } from 'lucide-react';
import { DrinkRequirements, FoodRequirements } from '@/types/food';

interface FinancialSummaryProps {
  totalRevenue: number;
  totalCosts: number;
  netProfit: number;
  venueCost: number;
  drinkRequirements: DrinkRequirements;
  foodRequirements: FoodRequirements;
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
  // Format function for currency
  const formatCurrency = (value: number) => {
    return value.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };
  
  // Format negative numbers with parentheses (accounting convention)
  const formatAccounting = (value: number) => {
    if (value < 0) {
      return `(${formatCurrency(Math.abs(value))})`;
    }
    return formatCurrency(value);
  };
  
  // Calculate percentage for the report
  const calculatePercentage = (value: number, total: number) => {
    if (total === 0) return "0.00%";
    return ((value / total) * 100).toFixed(2) + "%";
  };
  
  return (
    <div className="bg-white rounded-md border border-gray-300 overflow-hidden">
      {/* Report Header */}
      <div className="border-b border-gray-300 bg-gray-100 p-4">
        <div className="flex items-center">
          <FileText className="h-5 w-5 text-gray-700 mr-2" />
          <h2 className="text-lg font-semibold text-gray-800">Estado Financiero</h2>
        </div>
        <p className="text-xs text-gray-500 mt-1">Proyección financiera para el evento</p>
      </div>
      
      <div className="p-5">
        {/* Income Statement Section */}
        <div className="mb-6">
          <h3 className="text-sm font-bold text-gray-800 mb-2 uppercase tracking-wider">Estado de Resultados</h3>
          
          <table className="w-full border-collapse text-sm">
            <tbody>
              {/* Revenue Section */}
              <tr className="border-b border-gray-200">
                <td className="py-2 font-medium text-gray-700">INGRESOS</td>
                <td className="py-2 text-right"></td>
                <td className="py-2 text-right"></td>
              </tr>
              <tr>
                <td className="py-1 pl-4 text-gray-600">Ingresos por Entradas</td>
                <td className="py-1 text-right text-gray-800 font-mono">S/ {formatCurrency(totalRevenue)}</td>
                <td className="py-1 text-right text-gray-500 font-mono">{calculatePercentage(totalRevenue, totalRevenue)}</td>
              </tr>
              <tr className="border-t border-gray-200">
                <td className="py-2 pl-4 font-medium text-gray-700">Total Ingresos</td>
                <td className="py-2 text-right font-medium text-gray-800 font-mono">S/ {formatCurrency(totalRevenue)}</td>
                <td className="py-2 text-right text-gray-500 font-mono">100.00%</td>
              </tr>
              
              {/* Cost Section */}
              <tr className="border-t border-b border-gray-200">
                <td className="py-2 font-medium text-gray-700">GASTOS</td>
                <td className="py-2 text-right"></td>
                <td className="py-2 text-right"></td>
              </tr>
              <tr>
                <td className="py-1 pl-4 text-gray-600">Local</td>
                <td className="py-1 text-right text-gray-800 font-mono">S/ {formatCurrency(venueCost)}</td>
                <td className="py-1 text-right text-gray-500 font-mono">{calculatePercentage(venueCost, totalRevenue)}</td>
              </tr>
              <tr>
                <td className="py-1 pl-4 text-gray-600">Bebidas</td>
                <td className="py-1 text-right text-gray-800 font-mono">S/ {formatCurrency(drinkRequirements.totalCost)}</td>
                <td className="py-1 text-right text-gray-500 font-mono">{calculatePercentage(drinkRequirements.totalCost, totalRevenue)}</td>
              </tr>
              <tr>
                <td className="py-1 pl-8 text-xs text-gray-500">Licores</td>
                <td className="py-1 text-right text-xs text-gray-500 font-mono">S/ {formatCurrency(drinkRequirements.spiritsCost)}</td>
                <td className="py-1 text-right"></td>
              </tr>
              <tr>
                <td className="py-1 pl-8 text-xs text-gray-500">Mezcladores</td>
                <td className="py-1 text-right text-xs text-gray-500 font-mono">S/ {formatCurrency(drinkRequirements.mixersCost)}</td>
                <td className="py-1 text-right"></td>
              </tr>
              <tr>
                <td className="py-1 pl-8 text-xs text-gray-500">Hielo</td>
                <td className="py-1 text-right text-xs text-gray-500 font-mono">S/ {formatCurrency(drinkRequirements.iceCost)}</td>
                <td className="py-1 text-right"></td>
              </tr>
              <tr>
                <td className="py-1 pl-8 text-xs text-gray-500">Suministros</td>
                <td className="py-1 text-right text-xs text-gray-500 font-mono">S/ {formatCurrency(drinkRequirements.suppliesCost)}</td>
                <td className="py-1 text-right"></td>
              </tr>
              <tr>
                <td className="py-1 pl-4 text-gray-600">Comida</td>
                <td className="py-1 text-right text-gray-800 font-mono">S/ {formatCurrency(foodRequirements.totalCost)}</td>
                <td className="py-1 text-right text-gray-500 font-mono">{calculatePercentage(foodRequirements.totalCost, totalRevenue)}</td>
              </tr>
              <tr>
                <td className="py-1 pl-8 text-xs text-gray-500">Carnes</td>
                <td className="py-1 text-right text-xs text-gray-500 font-mono">S/ {formatCurrency(foodRequirements.meatCost)}</td>
                <td className="py-1 text-right"></td>
              </tr>
              <tr>
                <td className="py-1 pl-8 text-xs text-gray-500">Guarniciones</td>
                <td className="py-1 text-right text-xs text-gray-500 font-mono">S/ {formatCurrency(foodRequirements.sidesCost)}</td>
                <td className="py-1 text-right"></td>
              </tr>
              <tr>
                <td className="py-1 pl-8 text-xs text-gray-500">Condimentos</td>
                <td className="py-1 text-right text-xs text-gray-500 font-mono">S/ {formatCurrency(foodRequirements.condimentsCost)}</td>
                <td className="py-1 text-right"></td>
              </tr>
              <tr>
                <td className="py-1 pl-4 text-gray-600">Gastos Misceláneos</td>
                <td className="py-1 text-right text-gray-800 font-mono">S/ {formatCurrency(miscCosts)}</td>
                <td className="py-1 text-right text-gray-500 font-mono">{calculatePercentage(miscCosts, totalRevenue)}</td>
              </tr>
              <tr className="border-t border-gray-200">
                <td className="py-2 pl-4 font-medium text-gray-700">Total Gastos</td>
                <td className="py-2 text-right font-medium text-gray-800 font-mono">S/ {formatCurrency(totalCosts)}</td>
                <td className="py-2 text-right text-gray-500 font-mono">{calculatePercentage(totalCosts, totalRevenue)}</td>
              </tr>
              
              {/* Net Profit Section */}
              <tr className="border-t border-t-gray-400 border-double">
                <td className="py-3 font-bold text-gray-800">GANANCIA NETA</td>
                <td className={`py-3 text-right font-bold font-mono ${netProfit >= 0 ? 'text-green-700' : 'text-red-700'}`}>
                  S/ {formatAccounting(netProfit)}
                </td>
                <td className={`py-3 text-right font-medium font-mono ${netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {calculatePercentage(netProfit, totalRevenue)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        
        {/* Financial Ratios Section */}
        <div className="mt-8">
          <h3 className="text-sm font-bold text-gray-800 mb-2 uppercase tracking-wider">Ratios Financieros</h3>
          
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-gray-300">
                <th className="py-2 text-left font-medium text-gray-700">Ratio</th>
                <th className="py-2 text-right font-medium text-gray-700">Valor</th>
                <th className="py-2 text-right font-medium text-gray-700">Estado</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-200">
                <td className="py-2 text-gray-600">Margen de Beneficio</td>
                <td className="py-2 text-right font-mono">
                  {((netProfit / totalRevenue) * 100).toFixed(2)}%
                </td>
                <td className="py-2 text-right">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    netProfit >= 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {netProfit >= 0 ? 'Positivo' : 'Negativo'}
                  </span>
                </td>
              </tr>
              <tr className="border-b border-gray-200">
                <td className="py-2 text-gray-600">Ratio Costo-Ingreso</td>
                <td className="py-2 text-right font-mono">
                  {((totalCosts / totalRevenue) * 100).toFixed(2)}%
                </td>
                <td className="py-2 text-right">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    totalCosts <= totalRevenue ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {totalCosts <= totalRevenue ? 'Óptimo' : 'Excesivo'}
                  </span>
                </td>
              </tr>
              <tr>
                <td className="py-2 text-gray-600">Viabilidad Financiera</td>
                <td className="py-2 text-right font-mono">
                  {isViable ? 'Viable' : 'No Viable'}
                </td>
                <td className="py-2 text-right">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    isViable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {isViable ? 'Proceder' : 'Revisar'}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        
        {/* Auditor Notes */}
        <div className="mt-8 border-t border-gray-300 pt-4">
          <h3 className="text-sm font-bold text-gray-800 mb-2 uppercase tracking-wider">Notas al Estado Financiero</h3>
          <p className="text-xs text-gray-600 mb-2">
            1. Todos los valores son proyecciones basadas en los datos actuales.
          </p>
          <p className="text-xs text-gray-600 mb-2">
            2. La viabilidad financiera se determina en base al margen de beneficio y la cobertura de costos.
          </p>
          {!isViable && (
            <p className="text-xs text-red-600 font-medium mb-2">
              3. ADVERTENCIA: Se requiere revisión de la estructura de costos o del precio de entrada para lograr viabilidad financiera.
            </p>
          )}
        </div>
        
        {/* Report Footer */}
        <div className="mt-8 pt-4 border-t border-gray-300 text-xs text-gray-500 flex justify-between">
          <span>Party Simulator Financial Report</span>
          <span>Generado: {new Date().toLocaleDateString()}</span>
        </div>
      </div>
    </div>
  );
};

export default FinancialSummary;