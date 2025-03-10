"use client";

import React, { createContext, useContext, ReactNode } from 'react';

type ThemeType = 'primary' | 'success' | 'warning' | 'error';
type StatusType = 'active' | 'inactive' | 'pending' | 'error';

interface ThemeContextType {
  getGradient: (type?: ThemeType) => string;
  getGradientText: (type?: ThemeType) => string;
  getStatusBadge: (status: StatusType) => string;
  getFocusRing: (color?: ThemeType) => string;
}

// Create theme context
const ThemeContext = createContext<ThemeContextType | null>(null);

// Theme utilities and dynamic functions
const theme: ThemeContextType = {
  // Gradient utilities
  getGradient: (type = 'primary') => {
    const gradients = {
      primary: 'bg-gradient-to-r from-primary to-primary-secondary',
      success: 'bg-gradient-to-r from-success to-accent-teal',
      warning: 'bg-gradient-to-r from-warning to-accent-amber',
      error: 'bg-gradient-to-r from-error to-accent-pink',
    };
    return gradients[type] || gradients.primary;
  },
  
  getGradientText: (type = 'primary') => {
    const textGradients = {
      primary: 'bg-gradient-to-r from-primary to-primary-secondary text-transparent bg-clip-text',
      success: 'bg-gradient-to-r from-success to-accent-teal text-transparent bg-clip-text',
      warning: 'bg-gradient-to-r from-warning to-accent-amber text-transparent bg-clip-text',
      error: 'bg-gradient-to-r from-error to-accent-pink text-transparent bg-clip-text',
    };
    return textGradients[type] || textGradients.primary;
  },
  
  // Status utilities
  getStatusBadge: (status) => {
    const statusStyles = {
      active: 'bg-success-light text-success-dark',
      inactive: 'bg-slate-100 text-slate-800',
      pending: 'bg-warning-light text-warning-dark',
      error: 'bg-error-light text-error-dark',
    };
    return statusStyles[status] || statusStyles.inactive;
  },
  
  // Focus utilities
  getFocusRing: (color = 'primary') => {
    const focusRings = {
      primary: 'focus:ring-2 focus:ring-primary/20 focus:outline-none',
      success: 'focus:ring-2 focus:ring-success/20 focus:outline-none',
      warning: 'focus:ring-2 focus:ring-warning/20 focus:outline-none',
      error: 'focus:ring-2 focus:ring-error/20 focus:outline-none',
    };
    return focusRings[color] || focusRings.primary;
  }
};

interface ThemeProviderProps {
  children: ReactNode;
}

// Theme provider component
export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook to use theme
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined || context === null) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export default ThemeProvider;