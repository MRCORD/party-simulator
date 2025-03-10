"use client";

import React, { createContext, useContext } from 'react';

// Create theme context
const ThemeContext = createContext();

// Theme utilities and dynamic functions
const theme = {
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
  getFocusRing: (color = 'primary') => {
    return 'focus-ring';
  }
};

// Theme provider component
export const ThemeProvider = ({ children }) => {
  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook to use theme
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export default ThemeProvider;