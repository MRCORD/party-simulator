import React from 'react';
import { PieChart, DollarSign } from 'lucide-react';
import { 
  PieChart as RechartsPieChart, 
  Pie, 
  Cell, 
  Tooltip, 
  Sector,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ReferenceLine,
  LabelList
} from 'recharts';
import { CostBreakdownItem } from '@/types/party';
import { PieSectorDataItem } from 'recharts/types/polar/Pie';

interface CostBreakdownProps {
  costBreakdown: CostBreakdownItem[];
  colors: string[];
  isFinancialOverview?: boolean;
}

interface TooltipProps {
  active?: boolean;
  payload?: Array<{
    payload: {
      name: string;
      value: number;
    };
  }>;
}

interface CustomizedLabelProps {
  cx: number;
  cy: number;
  midAngle: number;
  outerRadius: number;
  name: string;
  value: number;
  index: number;
}

interface ActiveShapeProps extends PieSectorDataItem {
  cx: number;
  cy: number;
  innerRadius: number;
  outerRadius: number;
  startAngle: number;
  endAngle: number;
  fill: string;
}

const CostBreakdown: React.FC<CostBreakdownProps> = ({ 
  costBreakdown, 
  colors,
  isFinancialOverview = false 
}) => {
  const [activeIndex, setActiveIndex] = React.useState<number | null>(null);
  
  // Validate and filter out invalid entries (allow negative values)
  const validData = costBreakdown.filter(item => 
    item && typeof item.value === 'number' && !isNaN(item.value)
  );
  
  // Handle empty or invalid data
  if (!validData.length) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex items-center mb-4">
          {isFinancialOverview ? (
            <DollarSign className="w-5 h-5 text-primary mr-2" />
          ) : (
            <PieChart className="w-5 h-5 text-primary mr-2" />
          )}
          <h3 className="text-lg font-medium">
            {isFinancialOverview ? 'Balance General' : 'Distribución de Gastos'}
          </h3>
        </div>
        <div className="h-64 flex items-center justify-center text-gray-500">
          No hay datos disponibles para mostrar
        </div>
      </div>
    );
  }

  // Calculate total for percentages (use absolute values for pie chart)
  const total = validData.reduce((sum, item) => 
    isFinancialOverview ? sum : sum + Math.abs(item.value), 0);
  
  // Function to format currency values
  const formatCurrency = (value: number, includeDecimal = true) => {
    const formattingOptions = {
      minimumFractionDigits: includeDecimal ? 1 : 0,
      maximumFractionDigits: includeDecimal ? 1 : 0
    };
    
    // Format negative values correctly
    if (value < 0) {
      return `S/ -${Math.abs(value).toLocaleString('es-PE', formattingOptions)}`;
    }
    return `S/ ${value.toLocaleString('es-PE', formattingOptions)}`;
  };

  // If we're showing a financial overview (bar chart or summary)
  if (isFinancialOverview) {
    const barData = validData.map(item => ({
      name: item.name,
      value: item.value,
      color: item.name === 'Beneficio Neto' 
        ? (item.value >= 0 ? '#10b981' : '#ef4444') 
        : item.name === 'Ingresos Totales' 
          ? '#4f86f7'  // Blue
          : '#14b8a6'  // Teal
    }));

    // Calculate min and max for Y axis domain with proper rounding
    const values = barData.map(item => item.value);
    const minValue = Math.min(0, ...values);
    const maxValue = Math.max(0, ...values);
    
    // Determine if we have a chart with negative values
    const hasNegativeValues = minValue < 0;
    
    // Calculate interval size based on data range
    const range = Math.max(Math.abs(minValue), Math.abs(maxValue));
    let interval: number;
    
    if (range <= 500) {
      interval = 100;
    } else if (range <= 1000) {
      interval = 250;
    } else if (range <= 3000) {
      interval = 750;
    } else if (range <= 5000) {
      interval = 1000;
    } else if (range <= 10000) {
      interval = 2500;
    } else {
      interval = 5000;
    }
    
    // Calculate min and max for y-axis with clean intervals
    const yAxisMin = hasNegativeValues ? Math.floor(minValue / interval) * interval : 0;
    const yAxisMax = Math.ceil(maxValue / interval) * interval;
    
    // Function for Y-axis tick formatting
    const formatYAxisTick = (value: number) => {
      if (Math.abs(value) >= 1000) {
        return `S/ ${(value / 1000).toFixed(1)}k`;
      }
      return `S/ ${value}`;
    };

    return (
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex items-center mb-4">
          <DollarSign className="w-5 h-5 text-primary mr-2" />
          <h3 className="text-lg font-medium">Balance General</h3>
        </div>
        
        {/* Chart section */}
        <div className="w-full h-72 mb-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={barData}
              margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" />
              <YAxis 
                domain={[yAxisMin, yAxisMax]} 
                tickFormatter={formatYAxisTick}
              />
              <Tooltip
                formatter={(value: number) => [formatCurrency(value, true), '']}
                cursor={{ fill: 'rgba(0, 0, 0, 0.05)' }}
              />
              <ReferenceLine y={0} stroke="#666" strokeWidth={1} />
              <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                {barData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
                <LabelList 
                  dataKey="value" 
                  position="top" 
                  formatter={(value: number) => formatCurrency(value, false)}
                  style={{ 
                    fontSize: '13px', 
                    fontWeight: 'medium',
                    fill: '#10b981'  // Default to success color
                  }}
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  }

  // Pie Chart version for expense distribution
  // Prepare data with percentages for pie chart
  const pieData = validData.map((item, index) => ({
    ...item,
    color: colors[index % colors.length],
    percent: Math.abs(item.value) / total
  }));

  // Custom active shape for pie chart
  const renderActiveShape = (props: unknown) => {
    const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill } = props as ActiveShapeProps;
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

  // Tooltip for pie chart
  const CustomTooltip = ({ active, payload }: TooltipProps) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const percentage = ((Math.abs(data.value) / total) * 100).toFixed(1);
      
      return (
        <div className="bg-white p-3 border border-gray-200 shadow-lg rounded-md">
          <p className="font-medium text-primary">{data.name}</p>
          <p className="text-primary">
            <span className="font-medium">{formatCurrency(data.value, true)}</span>
          </p>
          <p className="text-gray-600 text-sm">{percentage}% del total</p>
        </div>
      );
    }
    return null;
  };

  // Label renderer for pie chart
  const renderCustomizedLabel = (props: CustomizedLabelProps) => {
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
          {name} ({formatCurrency(value, false)})
        </text>
      </g>
    );
  };

  const onPieEnter = (_: unknown, index: number) => {
    setActiveIndex(index);
  };
  
  const onPieLeave = () => {
    setActiveIndex(null);
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      <div className="flex items-center mb-4">
        <PieChart className="w-5 h-5 text-primary mr-2" />
        <h3 className="text-lg font-medium">Distribución de Gastos</h3>
      </div>
      
      <div className="w-full h-72">
        <ResponsiveContainer width="100%" height="100%">
          <RechartsPieChart>
            <Pie
              activeIndex={activeIndex !== null ? [activeIndex] : []}
              activeShape={renderActiveShape}
              data={pieData}
              cx="50%"
              cy="50%"
              innerRadius={70}
              outerRadius={95}
              paddingAngle={2}
              dataKey="value"
              valueKey={(data) => Math.abs(data.value)}
              labelLine={true}
              label={renderCustomizedLabel}
              onMouseEnter={onPieEnter}
              onMouseLeave={onPieLeave}
              isAnimationActive={true}
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            
            {/* Center label */}
            <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle">
              <tspan x="50%" dy="-0.5em" fontSize="16" fontWeight="bold">{formatCurrency(total, false)}</tspan>
              <tspan x="50%" dy="1.5em" fontSize="12" fill="#666">Total</tspan>
            </text>
          </RechartsPieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default CostBreakdown;