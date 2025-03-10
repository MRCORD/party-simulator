"use client";

import React, { ReactNode } from 'react';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';
import { useTheme } from './ThemeProvider';

type AlertVariant = 'success' | 'warning' | 'error' | 'info';

interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  title?: string;
  variant?: AlertVariant;
  icon?: ReactNode;
  dismissible?: boolean;
  onDismiss?: () => void;
  className?: string;
}

interface AlertToastProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
  message: string;
  variant?: AlertVariant;
  icon?: ReactNode;
  duration?: number;
  onDismiss?: () => void;
  className?: string;
}

const Alert = ({
  children,
  title,
  variant = 'info',
  icon,
  dismissible = false,
  onDismiss,
  className = '',
  ...props
}: AlertProps) => {
  const variantMap = {
    success: {
      bg: 'bg-success-light',
      border: 'border-success',
      text: 'text-success-dark',
      icon: <CheckCircle className="w-5 h-5 text-success" />,
    },
    warning: {
      bg: 'bg-warning-light',
      border: 'border-warning',
      text: 'text-warning-dark',
      icon: <AlertCircle className="w-5 h-5 text-warning" />,
    },
    error: {
      bg: 'bg-error-light',
      border: 'border-error',
      text: 'text-error-dark',
      icon: <AlertCircle className="w-5 h-5 text-error" />,
    },
    info: {
      bg: 'bg-primary-light',
      border: 'border-primary',
      text: 'text-primary-dark',
      icon: <Info className="w-5 h-5 text-primary" />,
    },
  } as const;
  
  const variantStyles = variantMap[variant];
  
  return (
    <div 
      className={`flex items-start p-4 rounded-lg ${variantStyles.bg} border ${variantStyles.border} ${variantStyles.text} ${className}`} 
      role="alert"
      {...props}
    >
      {/* Alert icon */}
      <div className="flex-shrink-0 mr-3">
        {icon || variantStyles.icon}
      </div>
      
      {/* Alert content */}
      <div className="flex-1">
        {title && (
          <h3 className="font-semibold mb-1">{title}</h3>
        )}
        <div className="text-sm">{children}</div>
      </div>
      
      {/* Dismiss button */}
      {dismissible && onDismiss && (
        <button 
          className={`flex-shrink-0 ml-3 p-1 rounded-full hover:bg-white/10 ${variantStyles.text}`}
          onClick={onDismiss}
          aria-label="Dismiss"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

// Toast-style alert
const AlertToast = ({
  message,
  variant = 'info',
  icon,
  duration = 5000,
  onDismiss,
  className = '',
  ...props
}: AlertToastProps) => {
  const gradientMap = {
    success: 'bg-gradient-to-r from-green-500 to-green-600',
    warning: 'bg-gradient-to-r from-yellow-500 to-yellow-600',
    error: 'bg-gradient-to-r from-red-500 to-red-600',
    info: 'bg-gradient-to-r from-blue-500 to-blue-600',
  } as const;
  
  const variantMap = {
    success: {
      bg: gradientMap.success,
      icon: <CheckCircle className="w-5 h-5" />,
    },
    warning: {
      bg: gradientMap.warning,
      icon: <AlertCircle className="w-5 h-5" />,
    },
    error: {
      bg: gradientMap.error,
      icon: <AlertCircle className="w-5 h-5" />,
    },
    info: {
      bg: gradientMap.info,
      icon: <Info className="w-5 h-5" />,
    },
  } as const;
  
  const variantStyles = variantMap[variant];
  
  React.useEffect(() => {
    if (duration && onDismiss) {
      const timer = setTimeout(onDismiss, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onDismiss]);
  
  return (
    <div 
      className={`flex items-center p-3 rounded-lg shadow-lg text-white ${variantStyles.bg} ${className}`}
      role="alert"
      {...props}
    >
      {/* Alert icon */}
      <div className="flex-shrink-0 mr-3">
        {icon || variantStyles.icon}
      </div>
      
      {/* Alert message */}
      <div className="flex-1 text-sm font-medium">
        {message}
      </div>
      
      {/* Dismiss button */}
      {onDismiss && (
        <button 
          className="flex-shrink-0 ml-3 p-1 rounded-full hover:bg-white/20"
          onClick={onDismiss}
          aria-label="Dismiss"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

Alert.Toast = AlertToast;

export default Alert;