import React from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, ReferenceLine
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
    isRecommended: bin.containsRecommendation,
    // Use midpoint for smoother curve
    x: (bin.min + bin.max) / 2
  }));

  return (
    <div className="mb-4">
      <h5 className="font-medium text-gray-700 mb-3">Distribución de Consumo</h5>
      <div className="bg-white h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{ top: 5, right: 30, left: 20, bottom: 25 }}
          >
            <defs>
              <linearGradient id="colorFreq" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#8884d8" stopOpacity={0.2}/>
              </linearGradient>
              <linearGradient id="colorRec" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.2}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" />
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
            <Area
              type="monotone"
              dataKey="frequency"
              stroke="#8884d8"
              fillOpacity={1}
              fill="url(#colorFreq)"
              dot={false}
              isAnimationActive={true}
            />
            {chartData.some(d => d.isRecommended) && (
              <ReferenceLine
                x={chartData.find(d => d.isRecommended)?.x}
                stroke="#f59e0b"
                strokeWidth={2}
                strokeDasharray="3 3"
                label={{
                  value: 'Recomendado',
                  position: 'top',
                  fill: '#f59e0b'
                }}
              />
            )}
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <p className="text-xs text-gray-500 mt-2 text-center">
        La línea punteada amarilla indica el valor recomendado según el nivel de confianza seleccionado.
      </p>
    </div>
  );
};

export default DistributionChart;