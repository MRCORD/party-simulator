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

interface CustomLabelProps {
  cx: number;
  cy: number;
  midAngle: number;
  outerRadius: number;
  name: string;
  value: number;
  index: number;
}

const ExpenseDistribution: React.FC<ExpenseDistributionProps> = ({ expenseCategories }) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  // Calculate total for percentages
  const total = expenseCategories.reduce((sum, item) => sum + item.value, 0);
  
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
  const renderCustomizedLabel = (props: CustomLabelProps) => {
    const { cx, cy, midAngle, outerRadius, name, value, index } = props;
    const RADIAN = Math.PI / 180;
    // Position the label further from the pie
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
          stroke={expenseCategories[index].color}
          fill="none"
        />
        
        {/* Label text */}
        <text 
          x={x}
          y={y} 
          textAnchor={textAnchor} 
          fill={expenseCategories[index].color}
          dominantBaseline="central"
          className="text-xs font-medium"
        >
          {name} (S/ {value.toFixed(0)})
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
        <PieChartIcon className="w-5 h-5 text-primary mr-2" />
        <h3 className="text-lg font-medium">Distribución de Gastos</h3>
      </div>
      
      <div className="w-full h-64">
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
              labelLine={true}
              label={renderCustomizedLabel}
              onMouseEnter={onPieEnter}
              onMouseLeave={onPieLeave}
              isAnimationActive={true}
            >
              {expenseCategories.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            
            {/* Center label */}
            <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle">
              <tspan x="50%" dy="-0.5em" fontSize="16" fontWeight="bold">S/ {total.toFixed(0)}</tspan>
              <tspan x="50%" dy="1.5em" fontSize="12" fill="#666">Total</tspan>
            </text>
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ExpenseDistribution;