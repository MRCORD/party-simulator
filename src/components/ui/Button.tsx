"use client";
import React, { ReactNode } from 'react';
import { useTheme } from './ThemeProvider';

type ButtonVariant = 'solid' | 'outline' | 'ghost' | 'gradient';
type ButtonColor = 'primary' | 'success' | 'warning' | 'error';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  color?: ButtonColor;
  size?: ButtonSize;
  isLoading?: boolean;
  children: ReactNode;
  className?: string;
}

const Button = ({
  variant = 'solid',
  color = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  className = '',
  children,
  ...props
}: ButtonProps) => {
  const theme = useTheme();
  
  const baseClasses = 'inline-flex items-center justify-center rounded-md font-medium transition-all duration-200';
  
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  } as const;
  
  const variantClasses = {
    solid: {
      primary: 'bg-primary hover:bg-primary-dark text-white',
      success: 'bg-success hover:bg-success-dark text-white',
      warning: 'bg-warning hover:bg-warning-dark text-white',
      error: 'bg-error hover:bg-error-dark text-white',
    },
    outline: {
      primary: 'border-2 border-primary text-primary hover:bg-primary hover:text-white',
      success: 'border-2 border-success text-success hover:bg-success hover:text-white',
      warning: 'border-2 border-warning text-warning hover:bg-warning hover:text-white',
      error: 'border-2 border-error text-error hover:bg-error hover:text-white',
    },
    ghost: {
      primary: 'text-primary hover:bg-primary-light',
      success: 'text-success hover:bg-success-light',
      warning: 'text-warning hover:bg-warning-light',
      error: 'text-error hover:bg-error-light',
    },
    gradient: {
      primary: theme.getGradient('primary'),
      success: theme.getGradient('success'),
      warning: theme.getGradient('warning'),
      error: theme.getGradient('error'),
    }
  } as const;

  const classes = [
    baseClasses,
    sizeClasses[size],
    variantClasses[variant][color],
    disabled && 'opacity-50 cursor-not-allowed',
    isLoading && 'opacity-75 cursor-wait',
    theme.getFocusRing(),
    className
  ].filter(Boolean).join(' ');

  return (
    <button
      disabled={disabled || isLoading}
      className={classes}
      {...props}
    >
      {isLoading ? (
        <>
          <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          Loading...
        </>
      ) : children}
    </button>
  );
};

export default Button;