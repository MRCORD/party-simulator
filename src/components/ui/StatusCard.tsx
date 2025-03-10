"use client";

import React from 'react';
import { useTheme } from './ThemeProvider';
import Card from './Card';

const StatusCard = ({
  title,
  value,
  icon,
  status = 'active',
  trend,
  className = '',
  ...props
}) => {
  const theme = useTheme();

  return (
    <Card className={`relative overflow-hidden ${className}`} {...props}>
      <div className="flex items-center justify-between p-4">
        <div>
          <p className="text-slate-600 text-sm mb-1">{title}</p>
          <h3 className="text-2xl font-semibold mb-2">{value}</h3>
          <span className={`inline-flex items-center ${theme.getStatusBadge(status)}`}>
            {status}
            {trend && (
              <span className={`ml-2 ${trend > 0 ? 'text-success' : 'text-error'}`}>
                {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%
              </span>
            )}
          </span>
        </div>
        {icon && (
          <div className="text-primary-light">
            {icon}
          </div>
        )}
      </div>
      {/* Optional gradient accent */}
      <div className={`absolute bottom-0 left-0 right-0 h-1 ${theme.getGradient()}`} />
    </Card>
  );
};

export default StatusCard;