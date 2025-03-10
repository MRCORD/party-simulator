import React from 'react';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';
import { useTheme } from './ThemeProvider';

const Alert = ({
  children,
  title,
  variant = 'info',
  icon,
  dismissible = false,
  onDismiss,
  className = '',
  ...props
}) => {
  const theme = useTheme();

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
  };
  
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
Alert.Toast = ({
  message,
  variant = 'info',
  icon,
  duration = 5000,
  onDismiss,
  className = '',
  ...props
}) => {
  const theme = useTheme();
  
  const variantMap = {
    success: {
      bg: theme.getGradient('success'),
      icon: <CheckCircle className="w-5 h-5" />,
    },
    warning: {
      bg: theme.getGradient('warning'),
      icon: <AlertCircle className="w-5 h-5" />,
    },
    error: {
      bg: theme.getGradient('error'),
      icon: <AlertCircle className="w-5 h-5" />,
    },
    info: {
      bg: theme.getGradient('primary'),
      icon: <Info className="w-5 h-5" />,
    },
  };

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

export default Alert;