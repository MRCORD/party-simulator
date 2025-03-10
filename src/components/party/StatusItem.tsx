"use client";

import React from 'react';
import Badge from '@/components/ui/Badge';
import { CheckCircle, AlertCircle } from 'lucide-react';
import { useTheme } from '@/components/ui/ThemeProvider';

interface StatusItemProps {
  title: string;
  icon?: React.ReactNode;
  isEnough: boolean;
  currentAmount: number;
  requiredAmount: number;
}

const StatusItem: React.FC<StatusItemProps> = ({ title, icon, isEnough, currentAmount, requiredAmount }) => {
  const theme = useTheme();
  
  return (
    <div className="flex justify-between items-center p-1 rounded">
      <div className="flex items-center">
        {icon && <span className="mr-2">{icon}</span>}
        <span className="font-medium">{title}:</span>
      </div>
      
      <div className="flex items-center">
        <span className="mr-2">{currentAmount}/{requiredAmount} porciones</span>
        {isEnough ? (
          <Badge 
            variant="success" 
            size="sm"
            icon={<CheckCircle className="w-3 h-3" />}
          >
            OK
          </Badge>
        ) : (
          <Badge 
            variant="error" 
            size="sm"
            icon={<AlertCircle className="w-3 h-3" />}
          >
            Falta
          </Badge>
        )}
      </div>
    </div>
  );
};

export default StatusItem;