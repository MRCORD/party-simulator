import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, Cell, ReferenceLine
} from 'recharts';
import { DistributionBin } from '@/types/simulator';

interface DistributionChartProps {
  data: DistributionBin[];
}

const DistributionChart: React.FC<DistributionChartProps> = ({ data }) => {
  // Format data for the chart
  const chartData = data.map((bin) => ({
    range: `${bin.min.toFixed(0)}-${bin.max.toFixed(0)}`,
    frequency: bin.count,
    isRecommended: bin.containsRecommendation
  }));

  return (
    <div className="mb-4">
      <h5 className="font-medium text-gray-700 mb-3">Distribución de Consumo</h5>
      <div className="bg-white h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 5, right: 30, left: 20, bottom: 25 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="range" 
              angle={-45} 
              textAnchor="end" 
              height={50}
              interval={0}
              tick={{ fontSize: 10 }}
            />
            <YAxis 
              label={{ 
                value: 'Frecuencia', 
                angle: -90, 
                position: 'insideLeft',
                style: { textAnchor: 'middle' }
              }} 
            />
            <Tooltip formatter={(value: any) => [`${value} simulaciones`, 'Frecuencia']} />
            <Bar dataKey="frequency" fill="#8884d8">
              {chartData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.isRecommended ? '#f59e0b' : '#8884d8'} 
                />
              ))}
            </Bar>
            <ReferenceLine x={0} stroke="#666" />
            <ReferenceLine y={0} stroke="#666" />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <p className="text-xs text-gray-500 mt-2 text-center">
        Las barras amarillas indican el rango donde se encuentra la recomendación de confianza.
      </p>
    </div>
  );
};

export default DistributionChart;