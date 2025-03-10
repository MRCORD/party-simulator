"use client";

import React, { createContext, useContext, ReactNode } from 'react';

type ThemeType = 'primary' | 'success' | 'warning' | 'error';
type StatusType = 'active' | 'inactive' | 'pending' | 'error';

interface ThemeContextType {
  getGradient: (type?: ThemeType) => string;
  getGradientText: (type?: ThemeType) => string;
  getStatusBadge: (status: StatusType) => string;
  getFocusRing: () => string;
}

// Create theme context
const ThemeContext = createContext<ThemeContextType | null>(null);

// Theme utilities and dynamic functions
const theme: ThemeContextType = {
  // Gradient utilities
  getGradient: (type = 'primary') => {
    const gradients = {
      primary: 'bg-gradient-primary',
      success: 'bg-gradient-success',
      warning: 'bg-gradient-warning',
      error: 'bg-gradient-error',
    };
    return gradients[type] || gradients.primary;
  },
  
  getGradientText: (type = 'primary') => {
    return `text-gradient-${type}`;
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
  getFocusRing: () => {
    return 'focus-ring';
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