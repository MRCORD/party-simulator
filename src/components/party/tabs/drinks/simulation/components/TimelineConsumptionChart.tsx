import React from 'react';
import {
  Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, Area, AreaChart
} from 'recharts';
import { TimelineConsumptionPoint } from '@/types/drinks';

interface TimelineConsumptionChartProps {
  data: TimelineConsumptionPoint[];
}

const TimelineConsumptionChart: React.FC<TimelineConsumptionChartProps> = ({ data }) => {
  // If there's no data, show a placeholder
  if (!data || data.length === 0) {
    return (
      <div className="mb-4">
        <h5 className="font-medium text-gray-700 mb-3">Consumo por Tiempo</h5>
        <div className="bg-gray-50 h-64 flex items-center justify-center">
          <span className="text-gray-400">No hay datos disponibles</span>
        </div>
      </div>
    );
  }

  // Sort data by time period label if not already sorted
  const sortedData = [...data].sort((a, b) => {
    // Try to sort by numeric indicators if they exist
    const numA = parseInt(a.timePeriod.replace(/\D/g, ''));
    const numB = parseInt(b.timePeriod.replace(/\D/g, ''));
    if (!isNaN(numA) && !isNaN(numB)) {
      return numA - numB;
    }
    
    // Fallback to string comparison
    return a.timePeriod.localeCompare(b.timePeriod);
  });

  return (
    <div className="mb-4">
      <h5 className="font-medium text-gray-700 mb-3">Consumo por Tiempo</h5>
      <div className="bg-white h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={sortedData}
            margin={{ top: 10, right: 30, left: 0, bottom: 20 }}
          >
            <defs>
              <linearGradient id="colorServings" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#4f86f7" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#4f86f7" stopOpacity={0.2}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis 
              dataKey="timePeriod"
              label={{
                value: 'Período del Evento',
                position: 'insideBottom',
                offset: -10
              }}
            />
            <YAxis 
              yAxisId="left"
              label={{ 
                value: 'Servings', 
                angle: -90, 
                position: 'insideLeft'
              }}
            />
            <YAxis 
              yAxisId="right"
              orientation="right"
              label={{ 
                value: 'Porcentaje', 
                angle: 90, 
                position: 'insideRight'
              }}
            />
            <Tooltip 
              formatter={(value: number, name: string) => {
                if (name === 'servings') return [`${value.toFixed(1)} servings`, 'Consumo'];
                return [`${value.toFixed(1)}%`, 'Porcentaje del Total'];
              }}
            />
            <Area 
              yAxisId="left"
              type="monotone"
              dataKey="servings"
              stroke="#4f86f7"
              fillOpacity={1}
              fill="url(#colorServings)"
            />
            <Line 
              yAxisId="right"
              type="monotone"
              dataKey="percentage"
              stroke="#2c5282"
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <p className="text-xs text-gray-500 mt-2 text-center">
        El área azul muestra el consumo por período, mientras que la línea indica el porcentaje del total.
      </p>
    </div>
  );
};

export default TimelineConsumptionChart;