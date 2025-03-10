"use client";
import React, { ReactNode } from 'react';
import { useTheme } from './ThemeProvider';
import { TrendingUp, TrendingDown, CheckCircle, AlertCircle, Clock } from 'lucide-react';

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
  
  const getStatusIcon = () => {
    switch (status) {
      case 'active':
        return <CheckCircle className="w-5 h-5 text-success" />;
      case 'inactive':
        return <AlertCircle className="w-5 h-5 text-slate-400" />;
      case 'pending':
        return <Clock className="w-5 h-5 text-warning" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-error" />;
      default:
        return null;
    }
  };
  
  const trendIconClass = trend && trend > 0 ? 'text-error' : 'text-success';
  
  return (
    <div className={`relative bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden group hover:shadow-md transition-all duration-300 ${className}`} {...props}>
      <div className="flex items-center justify-between p-4">
        <div>
          <p className="text-slate-600 text-sm mb-1 group-hover:text-primary transition-colors">{title}</p>
          <h3 className="text-2xl font-semibold mb-2 group-hover:text-primary-dark transition-colors">{value}</h3>
          <div className="flex items-center">
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${theme.getStatusBadge(status)}`}>
              {getStatusIcon()}
              <span className="ml-1">{status}</span>
            </span>
            
            {trend !== undefined && (
              <div className={`ml-2 flex items-center ${trendIconClass}`}>
                {trend > 0 ? (
                  <div className="flex items-center text-xs">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    <span>{Math.abs(trend).toFixed(1)}%</span>
                  </div>
                ) : trend < 0 ? (
                  <div className="flex items-center text-xs">
                    <TrendingDown className="w-3 h-3 mr-1" />
                    <span>{Math.abs(trend).toFixed(1)}%</span>
                  </div>
                ) : null}
              </div>
            )}
          </div>
        </div>
        
        {icon && (
          <div className="text-primary-light opacity-70 group-hover:opacity-100 transform group-hover:scale-110 transition-all">
            {icon}
          </div>
        )}
      </div>
      
      {/* Status indicator bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1">
        <div className={`h-full transition-all duration-700 ease-in-out ${
          status === 'active' ? 'bg-success w-full' :
          status === 'pending' ? 'bg-warning w-3/4' :
          status === 'error' ? 'bg-error w-1/3' :
          'bg-slate-300 w-1/4'
        }`}></div>
      </div>
    </div>
  );
};

export default StatusCard;