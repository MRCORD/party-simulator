import React from 'react';
import { useTheme } from './ThemeProvider';

const Badge = ({
  children,
  variant = 'default', // default, primary, success, warning, error
  size = 'md', // sm, md, lg
  rounded = 'full', // full, md
  icon,
  iconPosition = 'left',
  onClick,
  className = '',
  ...props
}) => {
  const theme = useTheme();

  // Base styles
  const baseClasses = "inline-flex items-center font-medium";
  
  // Size variations
  const sizeClasses = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-2.5 py-1 text-xs",
    lg: "px-3 py-1.5 text-sm",
  };
  
  // Rounded variations
  const roundedClasses = {
    full: "rounded-full",
    md: "rounded-md",
    lg: "rounded-lg",
  };
  
  // Variant variations
  const variantClasses = {
    default: "bg-slate-100 text-slate-800 hover:bg-slate-200",
    primary: "bg-primary-light text-primary-dark hover:bg-primary/10",
    secondary: "bg-primary-light/80 text-primary-dark hover:bg-primary/20",
    success: "bg-success-light text-success-dark hover:bg-success/10",
    warning: "bg-warning-light text-warning-dark hover:bg-warning/10",
    error: "bg-error-light text-error-dark hover:bg-error/10",
    teal: "bg-accent-teal/10 text-accent-teal hover:bg-accent-teal/20",
    indigo: "bg-indigo-100 text-indigo-800 hover:bg-indigo-200",
    pink: "bg-pink-100 text-pink-800 hover:bg-pink-200",
  };
  
  // Interactive styles if onClick is provided
  const interactiveClasses = onClick 
    ? "cursor-pointer transition-colors" 
    : "";
  
  // Combine classes
  const classes = [
    baseClasses,
    sizeClasses[size],
    roundedClasses[rounded],
    variantClasses[variant],
    interactiveClasses,
    className
  ].join(' ');
  
  return (
    <span 
      className={classes} 
      onClick={onClick} 
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      {...props}
    >
      {icon && iconPosition === 'left' && (
        <span className="mr-1">{icon}</span>
      )}
      
      {children}
      
      {icon && iconPosition === 'right' && (
        <span className="ml-1">{icon}</span>
      )}
    </span>
  );
};

// Usage examples:
// <Badge>Default</Badge>
// <Badge variant="primary">Primary</Badge>
// <Badge variant="success" icon={<CheckCircle className="w-3 h-3" />}>Success</Badge>
// <Badge variant="warning" size="lg">Warning</Badge>
// <Badge variant="error" rounded="md">Error</Badge>

export default Badge;