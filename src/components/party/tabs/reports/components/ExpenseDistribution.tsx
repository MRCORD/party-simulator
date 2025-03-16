import React, { useState } from 'react';
import { PieChart, Cell, Pie, Sector, ResponsiveContainer, Tooltip } from 'recharts';
import { PieChart as PieChartIcon } from 'lucide-react';

interface ExpenseCategory {
  name: string;
  value: number;
  color: string;
}

interface ExpenseDistributionProps {
  expenseCategories: ExpenseCategory[];
}

type PieSectorProps = {
  cx: number;
  cy: number;
  innerRadius: number;
  outerRadius: number;
  startAngle: number;
  endAngle: number;
  fill: string;
  payload: ExpenseCategory;
  percent: number;
  value: number;
};

interface TooltipProps {
  active?: boolean;
  payload?: Array<{
    name: string;
    value: number;
    payload: ExpenseCategory;
  }>;
}

const ExpenseDistribution: React.FC<ExpenseDistributionProps> = ({ expenseCategories }) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  // Calculate total for percentages
  const total = expenseCategories.reduce((sum, item) => sum + item.value, 0);
  
  // Sort categories from highest to lowest cost
  const sortedCategories = [...expenseCategories].sort((a, b) => b.value - a.value);
  
  // Custom active shape for pie chart with better hover effect
  const renderActiveShape = (props: unknown) => {
    const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill } = props as PieSectorProps;
    
    return (
      <g>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius + 6}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
        />
        <Sector
          cx={cx}
          cy={cy}
          startAngle={startAngle}
          endAngle={endAngle}
          innerRadius={outerRadius + 6}
          outerRadius={outerRadius + 10}
          fill={fill}
        />
      </g>
    );
  };
  
  // Enhanced custom tooltip for pie chart
  const CustomTooltip = ({ active, payload }: TooltipProps) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      const percentage = ((data.value / total) * 100).toFixed(1);
      
      return (
        <div className="bg-white p-3 border border-gray-200 shadow-lg rounded-md">
          <p className="font-medium text-gray-800">{data.name}</p>
          <p className="text-gray-700">
            <span className="font-medium">S/ {data.value.toFixed(2)}</span>
          </p>
          <p className="text-gray-600 text-sm">{percentage}% del total</p>
        </div>
      );
    }
    return null;
  };
  
  return (
    <div className="bg-white rounded-md border border-gray-300 overflow-hidden">
      <div className="border-b border-gray-300 bg-gray-100 p-4">
        <div className="flex items-center">
          <PieChartIcon className="h-5 w-5 text-gray-700 mr-2" />
          <h3 className="text-lg font-semibold text-gray-800">Distribución de Costos</h3>
        </div>
      </div>
      
      <div className="p-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Pie Chart Visualization */}
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  activeIndex={activeIndex !== null ? [activeIndex] : []}
                  activeShape={renderActiveShape}
                  data={expenseCategories}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                  onMouseEnter={(_, index) => setActiveIndex(index)}
                  onMouseLeave={() => setActiveIndex(null)}
                >
                  {expenseCategories.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                
                {/* Center Label */}
                <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle">
                  <tspan x="50%" dy="-0.5em" fontSize="16" fontWeight="bold">S/ {total.toFixed(0)}</tspan>
                  <tspan x="50%" dy="1.5em" fontSize="12" fill="#666">Total</tspan>
                </text>
              </PieChart>
            </ResponsiveContainer>
          </div>
          
          {/* Cost Breakdown Table */}
          <div>
            <h4 className="text-sm font-semibold text-gray-700 mb-3">Desglose Detallado</h4>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="text-left py-2 px-3 font-medium text-gray-700 border-b border-gray-300">Categoría</th>
                    <th className="text-right py-2 px-3 font-medium text-gray-700 border-b border-gray-300">Monto (S/)</th>
                    <th className="text-right py-2 px-3 font-medium text-gray-700 border-b border-gray-300">% del Total</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedCategories.map((category, index) => (
                    <tr 
                      key={index} 
                      className={`border-b border-gray-200 hover:bg-gray-50 ${
                        activeIndex === expenseCategories.findIndex(c => c.name === category.name) ? 'bg-gray-50' : ''
                      }`}
                      onMouseEnter={() => setActiveIndex(expenseCategories.findIndex(c => c.name === category.name))}
                      onMouseLeave={() => setActiveIndex(null)}
                    >
                      <td className="py-2 px-3 text-gray-700">
                        <div className="flex items-center">
                          <div 
                            className="w-3 h-3 rounded-sm mr-2" 
                            style={{ backgroundColor: category.color }}
                          ></div>
                          {category.name}
                        </div>
                      </td>
                      <td className="py-2 px-3 text-right font-mono text-gray-700">
                        {category.value.toFixed(2)}
                      </td>
                      <td className="py-2 px-3 text-right text-gray-600">
                        {((category.value / total) * 100).toFixed(1)}%
                      </td>
                    </tr>
                  ))}
                  
                  <tr className="bg-gray-50 font-medium">
                    <td className="py-2 px-3 text-gray-700">TOTAL</td>
                    <td className="py-2 px-3 text-right font-mono text-gray-700">{total.toFixed(2)}</td>
                    <td className="py-2 px-3 text-right text-gray-700">100.0%</td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            {/* Highlight Top Expenses */}
            {sortedCategories.length > 0 && (
              <div className="mt-4 text-sm text-gray-600">
                <p>
                  La categoría de mayor gasto es <span className="font-medium">{sortedCategories[0].name}</span> (
                  {((sortedCategories[0].value / total) * 100).toFixed(1)}% del total).
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpenseDistribution;