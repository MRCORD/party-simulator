"use client";
import React, { ReactNode } from 'react';
import { useTheme } from './ThemeProvider';
import Card from './Card';

type StatusType = 'active' | 'inactive' | 'pending' | 'error';

interface StatusCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  value: string | number;
  icon?: ReactNode;
  status?: StatusType;
  trend?: number;
  className?: string;
}

const StatusCard = ({
  title,
  value,
  icon,
  status = 'active',
  trend,
  className = '',
  ...props
}: StatusCardProps) => {
  const theme = useTheme();
  
  return (
    <Card className={`relative overflow-hidden ${className}`} {...props}>
      <div className="flex items-center justify-between p-4">
        <div>
          <p className="text-slate-600 text-sm mb-1">{title}</p>
          <h3 className="text-2xl font-semibold mb-2">{value}</h3>
          <span className={`inline-flex items-center ${theme.getStatusBadge(status as StatusType)}`}>
            {status}
            {trend !== undefined && (
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
      <div className={`absolute bottom-0 left-0 right-0 h-1 ${theme.getGradient('primary')}`} />
    </Card>
  );
};

export default StatusCard;