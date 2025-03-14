import React, { useState } from 'react';
import { PieChart } from 'lucide-react';
import { 
  PieChart as RechartsPieChart, 
  Pie, 
  Cell, 
  Tooltip, 
  Sector,
  ResponsiveContainer
} from 'recharts';
import { useTheme } from '@/components/ui/ThemeProvider';
import { CostBreakdownItem } from '@/types/party';

interface CostBreakdownProps {
  costBreakdown: CostBreakdownItem[];
  colors: string[];
  isFinancialOverview?: boolean;
}

const CostBreakdown: React.FC<CostBreakdownProps> = ({ 
  costBreakdown, 
  colors,
  isFinancialOverview = false 
}) => {
  const theme = useTheme();
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  
  // Validate and filter out invalid entries
  const validData = costBreakdown.filter(item => 
    item && typeof item.value === 'number' && !isNaN(item.value) && item.value > 0
  );
  
  // Handle empty or invalid data
  if (!validData.length) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex items-center mb-4">
          <PieChart className="w-5 h-5 text-primary mr-2" />
          <h3 className="text-lg font-medium">
            {isFinancialOverview ? 'Resumen Financiero' : 'Distribución de Gastos'}
          </h3>
        </div>
        <div className="h-64 flex items-center justify-center text-gray-500">
          No hay datos disponibles para mostrar
        </div>
      </div>
    );
  }

  // Calculate total for percentages
  const total = validData.reduce((sum, item) => sum + item.value, 0);
  
  // Prepare data with percentages
  const chartData = validData.map((item, index) => ({
    ...item,
    color: colors[index % colors.length],
    percent: item.value / total
  }));

  // Custom active shape for pie chart with better hover effect
  const renderActiveShape = (props: any) => {
    const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill } = props;
    
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
  const CustomTooltip = ({ active, payload }: { active?: boolean, payload?: any[] }) => {
    if (active && payload?.[0]) {
      const data = payload[0].payload;
      const percentage = ((data.value / total) * 100).toFixed(1);
      
      return (
        <div className="bg-white p-3 border border-gray-200 shadow-lg rounded-md">
          <p className="font-medium text-primary">{data.name}</p>
          <p className="text-primary">
            <span className="font-medium">S/ {data.value.toFixed(2)}</span>
          </p>
          <p className="text-gray-600 text-sm">{percentage}% del total</p>
        </div>
      );
    }
    return null;
  };

  // Custom label renderer for pie chart (outside labels with lines)
  const renderCustomizedLabel = (props: any) => {
    const { cx, cy, midAngle, outerRadius, name, value, index } = props;
    const RADIAN = Math.PI / 180;
    const radius = outerRadius * 1.25;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    
    // For labels on the left side, align right, and for right side, align left
    const textAnchor = x > cx ? 'start' : 'end';
    
    // Line from pie to label
    const lineEnd = {
      x: cx + (outerRadius + 10) * Math.cos(-midAngle * RADIAN),
      y: cy + (outerRadius + 10) * Math.sin(-midAngle * RADIAN),
    };
    
    return (
      <g>
        {/* Line from pie to label */}
        <path 
          d={`M${cx + outerRadius * Math.cos(-midAngle * RADIAN)},${cy + outerRadius * Math.sin(-midAngle * RADIAN)}L${lineEnd.x},${lineEnd.y}L${x},${y}`} 
          stroke={colors[index % colors.length]}
          fill="none"
        />
        
        {/* Label text */}
        <text 
          x={x}
          y={y} 
          textAnchor={textAnchor} 
          fill={colors[index % colors.length]}
          dominantBaseline="central"
          className="text-xs font-medium"
        >
          {name} (S/ {value.toFixed(0)})
        </text>
      </g>
    );
  };

  const onPieEnter = (_: any, index: number) => {
    setActiveIndex(index);
  };
  
  const onPieLeave = () => {
    setActiveIndex(null);
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      <div className="flex items-center mb-4">
        <PieChart className="w-5 h-5 text-primary mr-2" />
        <h3 className="text-lg font-medium">
          {isFinancialOverview ? 'Resumen Financiero' : 'Distribución de Gastos'}
        </h3>
      </div>
      
      <div className="w-full h-64">
        <ResponsiveContainer width="100%" height="100%">
          <RechartsPieChart>
            <Pie
              activeIndex={activeIndex !== null ? [activeIndex] : []}
              activeShape={renderActiveShape}
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={2}
              dataKey="value"
              labelLine={true}
              label={renderCustomizedLabel}
              onMouseEnter={onPieEnter}
              onMouseLeave={onPieLeave}
              isAnimationActive={true}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            
            {/* Center label */}
            <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle">
              <tspan x="50%" dy="-0.5em" fontSize="16" fontWeight="bold">S/ {total.toFixed(0)}</tspan>
              <tspan x="50%" dy="1.5em" fontSize="12" fill="#666">Total</tspan>
            </text>
          </RechartsPieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default CostBreakdown;