"use client";

import React from 'react';
import { useTheme } from './ThemeProvider';

const ProgressBar = ({
  value = 0,
  max = 100,
  color = 'primary',
  size = 'md',
  showLabel = true,
  className = '',
  ...props
}) => {
  const theme = useTheme();
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));
  
  const sizeClasses = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3'
  };

  return (
    <div className={`w-full ${className}`} {...props}>
      <div className="relative w-full bg-slate-100 rounded-full overflow-hidden">
        <div
          className={`${sizeClasses[size]} ${theme.getGradient(color)} transition-all duration-300 ease-in-out`}
          style={{ width: `${percentage}%` }}
          role="progressbar"
          aria-valuenow={value}
          aria-valuemin={0}
          aria-valuemax={max}
        />
      </div>
      {showLabel && (
        <div className="mt-1 text-sm text-slate-600">
          {percentage.toFixed(0)}%
        </div>
      )}
    </div>
  );
};

export default ProgressBar;