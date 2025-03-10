"use client";

import React from 'react';
import { useTheme } from './ThemeProvider';

// Main Card component
const Card = ({ 
  children, 
  className = '', 
  variant = 'default',
  accentColor = 'primary',
  hover = false,
  ...props 
}) => {
  const theme = useTheme();
  
  // Base card styles
  const baseClasses = "bg-white rounded-xl border border-slate-100 shadow-sm";
  
  // Variant modifiers
  const variantClasses = {
    default: "",
    accent: "",  // Handled separately with accentBar
    hover: hover ? "transition-all hover:shadow-md" : "",
    gradient: "bg-gradient-to-br from-slate-50 to-white",
  };
  
  // Use theme gradients instead of hardcoded colors
  const accentColorMap = {
    primary: theme.getGradient('primary'),
    secondary: theme.getGradient('secondary'),
    success: theme.getGradient('success'),
    warning: theme.getGradient('warning'),
    error: theme.getGradient('error'),
  };
  
  // Build class string
  const classes = [
    baseClasses,
    variantClasses[variant],
    className
  ].join(' ');
  
  // For accent variant, we need to wrap with a div to show the accent
  if (variant === 'accent') {
    return (
      <div className={`${classes} flex overflow-hidden ${hover ? "transition-all hover:shadow-md" : ""}`} {...props}>
        <div className={`w-2 ${accentColorMap[accentColor]}`}></div>
        <div className="flex-1">{children}</div>
      </div>
    );
  }

  return (
    <div className={classes} {...props}>
      {children}
    </div>
  );
};

// Card Header component
const CardHeader = ({ 
  children, 
  className = '',
  title,
  description,
  icon,
  gradient = false,
  ...props 
}) => {
  const theme = useTheme();
  const baseClasses = "px-6 py-4";
  
  return (
    <div className={`${baseClasses} ${className}`} {...props}>
      {(title || icon) ? (
        <div className="flex items-center mb-2">
          {icon && <span className="mr-2 text-primary">{icon}</span>}
          {title && (
            <h3 className={`font-semibold text-lg ${
              gradient ? theme.getGradientText('primary') : 'text-slate-800'
            }`}>
              {title}
            </h3>
          )}
        </div>
      ) : null}
      
      {description && (
        <p className="text-sm text-slate-500">{description}</p>
      )}
      
      {children}
    </div>
  );
};

// Card Content component
const CardContent = ({ 
  children, 
  className = '',
  noPadding = false,
  ...props 
}) => {
  const baseClasses = noPadding ? "" : "px-6 py-4";
  
  return (
    <div className={`${baseClasses} ${className}`} {...props}>
      {children}
    </div>
  );
};

// Card Footer component
const CardFooter = ({ 
  children, 
  className = '',
  bordered = true,
  ...props 
}) => {
  const baseClasses = "px-6 py-4";
  const borderClass = bordered ? "border-t border-slate-100" : "";
  
  return (
    <div className={`${baseClasses} ${borderClass} ${className}`} {...props}>
      {children}
    </div>
  );
};

// Card Image component
const CardImage = ({ 
  src, 
  alt = "",
  className = '',
  position = 'top',
  ...props 
}) => {
  const baseClasses = "w-full";
  const positionClasses = {
    top: "rounded-t-xl",
    bottom: "rounded-b-xl",
    full: "rounded-xl",
  };
  
  return (
    <div className={`overflow-hidden ${positionClasses[position]}`}>
      <img 
        src={src} 
        alt={alt} 
        className={`${baseClasses} ${className}`} 
        {...props} 
      />
    </div>
  );
};

// Export all components
Card.Header = CardHeader;
Card.Content = CardContent;
Card.Footer = CardFooter;
Card.Image = CardImage;

export default Card;