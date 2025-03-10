"use client";
import React, { ReactNode } from 'react';
import { useTheme } from './ThemeProvider';

type BadgeVariant = 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'teal' | 'indigo' | 'pink';
type BadgeSize = 'sm' | 'md' | 'lg';
type BadgeRounded = 'full' | 'md' | 'lg';
type IconPosition = 'left' | 'right';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  children: ReactNode;
  variant?: BadgeVariant;
  size?: BadgeSize;
  rounded?: BadgeRounded;
  icon?: ReactNode;
  iconPosition?: IconPosition;
  onClick?: (event: React.MouseEvent<HTMLSpanElement>) => void;
  className?: string;
}

const Badge = ({
  children,
  variant = 'default',
  size = 'md',
  rounded = 'full',
  icon,
  iconPosition = 'left',
  onClick,
  className = '',
  ...props
}: BadgeProps) => {
  const theme = useTheme();
  
  // Base styles
  const baseClasses = "inline-flex items-center font-medium";
  
  // Size variations
  const sizeClasses = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-2.5 py-1 text-xs",
    lg: "px-3 py-1.5 text-sm",
  } as const;
  
  // Rounded variations
  const roundedClasses = {
    full: "rounded-full",
    md: "rounded-md",
    lg: "rounded-lg",
  } as const;
  
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
  } as const;
  
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

export default Badge;