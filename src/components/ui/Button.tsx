"use client";
import React, { ReactNode } from 'react';
import { useTheme } from './ThemeProvider';

type ButtonVariant = 'solid' | 'outline' | 'ghost' | 'gradient' | 'link';
type ButtonColor = 'primary' | 'secondary' | 'success' | 'danger' | 'warning';
type ButtonSize = 'sm' | 'md' | 'lg';
type ThemeGradientType = 'primary' | 'success' | 'warning';

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
      primary: 'bg-blue-600 hover:bg-blue-700 text-white',
      secondary: 'bg-indigo-600 hover:bg-indigo-700 text-white',
      success: 'bg-green-600 hover:bg-green-700 text-white',
      danger: 'bg-red-600 hover:bg-red-700 text-white',
      warning: 'bg-yellow-500 hover:bg-yellow-600 text-white',
    },
    outline: {
      primary: 'border-2 border-blue-600 text-blue-600 hover:bg-blue-50',
      secondary: 'border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-50',
      success: 'border-2 border-green-600 text-green-600 hover:bg-green-50',
      danger: 'border-2 border-red-600 text-red-600 hover:bg-red-50',
      warning: 'border-2 border-yellow-500 text-yellow-600 hover:bg-yellow-50',
    },
    ghost: {
      primary: 'text-blue-600 hover:bg-blue-50',
      secondary: 'text-indigo-600 hover:bg-indigo-50',
      success: 'text-green-600 hover:bg-green-50',
      danger: 'text-red-600 hover:bg-red-50',
      warning: 'text-yellow-600 hover:bg-yellow-50',
    },
    link: {
      primary: 'text-blue-600 hover:underline',
      secondary: 'text-indigo-600 hover:underline',
      success: 'text-green-600 hover:underline',
      danger: 'text-red-600 hover:underline',
      warning: 'text-yellow-600 hover:underline',
    },
    gradient: {
      primary: theme.getGradient('primary' as ThemeGradientType),
      success: theme.getGradient('success' as ThemeGradientType),
      warning: theme.getGradient('warning' as ThemeGradientType),
      danger: 'bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700',
      secondary: 'bg-gradient-to-r from-indigo-500 to-indigo-600 text-white hover:from-indigo-600 hover:to-indigo-700'
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