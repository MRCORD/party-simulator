import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, ReferenceLine
} from 'recharts';
import { DrinkDistributionBin } from '@/types/drinks';

interface DistributionChartProps {
  data: DrinkDistributionBin[];
}

interface ChartDataPoint {
  range: string;
  frequency: number;
  isRecommended: boolean;
  x: number;
}

const DistributionChart: React.FC<DistributionChartProps> = ({ data }) => {
  // Format data for the chart
  const chartData = data.map((bin) => ({
    range: `${bin.min.toFixed(0)}-${bin.max.toFixed(0)}`,
    frequency: bin.count,
    isRecommended: bin.containsRecommendation,
    // Use midpoint for smoother curve
    x: (bin.min + bin.max) / 2
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
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis 
              dataKey="x"
              type="number"
              domain={['auto', 'auto']}
              tickFormatter={(value) => value.toFixed(0)}
              label={{
                value: 'Porciones',
                position: 'insideBottom',
                offset: -15
              }}
            />
            <YAxis 
              label={{ 
                value: 'Frecuencia', 
                angle: -90, 
                position: 'insideLeft',
                style: { textAnchor: 'middle' }
              }}
            />
            <Tooltip 
              formatter={(value: number) => [`${value} simulaciones`, 'Frecuencia']}
              labelFormatter={(value: number) => `${value} porciones`}
            />
            <Bar 
              dataKey="frequency"
              fill="#63b3ed"
              fillOpacity={1}
              stroke="none"
              radius={[4, 4, 0, 0]}
            />
            {chartData.some(d => d.isRecommended) && (
              <ReferenceLine
                x={chartData.find(d => d.isRecommended)?.x}
                stroke="#2c5282"
                strokeWidth={2}
                strokeDasharray="3 3"
                label={{
                  value: 'Recomendado',
                  position: 'top',
                  fill: '#2c5282'
                }}
              />
            )}
          </BarChart>
        </ResponsiveContainer>
      </div>
      <p className="text-xs text-gray-500 mt-2 text-center">
        La línea punteada azul indica el valor recomendado según el nivel de confianza seleccionado.
      </p>
    </div>
  );
};

export default DistributionChart;