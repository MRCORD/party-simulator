"use client";
import React, { ReactNode } from 'react';
import Image from 'next/image';
import { useTheme } from './ThemeProvider';

type CardVariant = 'default' | 'accent' | 'hover' | 'gradient' | 'glass';
type AccentColor = 'primary' | 'success' | 'warning' | 'error';
type ImagePosition = 'top' | 'bottom' | 'full';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  className?: string;
  variant?: CardVariant;
  accentColor?: AccentColor;
  hover?: boolean;
}

interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
  className?: string;
  title?: string;
  description?: string;
  icon?: ReactNode;
  gradient?: boolean;
  centered?: boolean;
}

interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  className?: string;
  noPadding?: boolean;
}

interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  className?: string;
  bordered?: boolean;
}

interface CardImageProps extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'position'> {
  src: string;
  alt?: string;
  className?: string;
  position?: ImagePosition;
  overlay?: boolean;
  width: number;
  height: number;
}

// Main Card component
const Card = ({ 
  children, 
  className = '', 
  variant = 'default',
  accentColor = 'primary',
  hover = false,
  ...props 
}: CardProps) => {
  const theme = useTheme();
  
  // Base card styles
  const baseClasses = "bg-white rounded-xl border border-slate-100";
  
  // Variant modifiers
  const variantClasses = {
    default: "shadow-sm",
    accent: "shadow-sm",  // Handled separately with accentBar
    hover: "shadow-sm transition-all duration-300",
    gradient: "bg-gradient-to-br from-slate-50 to-white shadow-sm",
    glass: "backdrop-blur-sm bg-white/80 shadow-md"
  } as const;
  
  // Hover effect
  const hoverClasses = hover ? "hover:shadow-md hover:border-slate-200 hover:translate-y-[-2px]" : "";
  
  // Use theme gradients for accent colors
  const accentColorMap = {
    primary: theme.getGradient('primary'),
    success: theme.getGradient('success'),
    warning: theme.getGradient('warning'),
    error: theme.getGradient('error'),
  } as const;
  
  // Build class string
  const classes = [
    baseClasses,
    variantClasses[variant],
    hoverClasses,
    className
  ].filter(Boolean).join(' ');
  
  // For accent variant, we need to wrap with a div to show the accent
  if (variant === 'accent') {
    return (
      <div className={`${classes} flex overflow-hidden ${hover ? "transition-all duration-300 hover:shadow-md hover:translate-y-[-2px]" : ""}`} {...props}>
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
  centered = false,
  ...props 
}: CardHeaderProps) => {
  const theme = useTheme();
  const baseClasses = "px-6 py-4";
  const alignClasses = centered ? "text-center" : "";
  
  return (
    <div className={`${baseClasses} ${alignClasses} ${className}`} {...props}>
      {(title || icon) ? (
        <div className={`flex ${centered ? "justify-center" : ""} items-center mb-2`}>
          {icon && <span className="mr-2 text-primary animate-fadeIn">{icon}</span>}
          {title && (
            <h3 className={`font-bold text-lg ${
              gradient ? theme.getGradientText('primary') : 'text-slate-800'
            } animate-fadeIn`}>
              {title}
            </h3>
          )}
        </div>
      ) : null}
      
      {description && (
        <p className="text-sm text-slate-500 animate-fadeIn">
          {description}
        </p>
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
}: CardContentProps) => {
  const baseClasses = noPadding ? "" : "px-6 py-4";
  
  return (
    <div className={`${baseClasses} ${className} animate-fadeIn`} {...props}>
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
}: CardFooterProps) => {
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
  overlay = false,
  width,
  height,
  ...props 
}: CardImageProps) => {
  const baseClasses = "w-full";
  const positionClasses = {
    top: "rounded-t-xl",
    bottom: "rounded-b-xl",
    full: "rounded-xl",
  } as const;
  
  return (
    <div className={`relative overflow-hidden ${positionClasses[position]}`}>
      <Image 
        src={src} 
        alt={alt}
        width={width}
        height={height}
        className={`${baseClasses} ${className} transition-transform duration-700 hover:scale-105`} 
        {...props} 
      />
      {overlay && (
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
      )}
    </div>
  );
};

// Export all components
Card.Header = CardHeader;
Card.Content = CardContent;
Card.Footer = CardFooter;
Card.Image = CardImage;

export default Card;