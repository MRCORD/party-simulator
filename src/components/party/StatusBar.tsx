"use client";

import React from 'react';
import ProgressBar from '@/components/ui/ProgressBar';
import Badge from '@/components/ui/Badge';
import { useTheme } from '@/components/ui/ThemeProvider';

interface StatusBarProps {
  title: string;
  icon?: React.ReactNode;
  isEnough: boolean;
  currentAmount: number;
  requiredAmount: number;
  colorClass?: string;
}

const StatusBar: React.FC<StatusBarProps> = ({ 
  title, 
  icon, 
  isEnough, 
  currentAmount, 
  requiredAmount,
  colorClass
}) => {
  const theme = useTheme();
  const percentage = Math.min(100, (currentAmount / requiredAmount) * 100);
  
  // Map isEnough to appropriate theme color
  const statusColor = isEnough ? 'success' : 'error';
  const statusType = isEnough ? 'active' : 'error';
  
  return (
    <div className="mb-4">
      <div className="flex justify-between mb-1">
        <div className="flex items-center">
          {icon && <span className={`mr-2 ${isEnough ? 'text-success-500' : 'text-error-500'}`}>{icon}</span>}
          <span className="text-sm font-medium">{title}</span>
        </div>
        <span className={`text-sm font-medium ${theme.getStatusBadge(statusType)}`}>
          {currentAmount}/{requiredAmount} porciones
        </span>
      </div>
      
      <ProgressBar 
        value={percentage} 
        max={100} 
        color={statusColor}
        showLabel={false}
      />
      
      <div className="text-xs mt-1 text-right">
        {isEnough ? (
          <Badge variant="success" size="sm">Suficiente</Badge>
        ) : (
          <Badge variant="error" size="sm">
            Necesita {requiredAmount - currentAmount} porciones más
          </Badge>
        )}
      </div>
    </div>
  );
};

export default StatusBar;