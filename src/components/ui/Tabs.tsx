"use client";
import React, { useState, ReactNode } from 'react';
import { useTheme } from './ThemeProvider';

interface Tab {
  label: string;
  icon?: ReactNode;
  content?: ReactNode;
}

type TabVariant = 'default' | 'pills' | 'buttons' | 'underline';
type TabColor = 'primary' | 'secondary';
type TabSize = 'sm' | 'md' | 'lg';

interface TabsProps {
  tabs: Tab[];
  initialTab?: number;
  onChange?: (index: number) => void;
  variant?: TabVariant;
  color?: TabColor;
  fullWidth?: boolean;
  size?: TabSize;
  className?: string;
  style?: React.CSSProperties;
  id?: string;
  role?: string;
  'aria-label'?: string;
}

const Tabs = ({
  tabs = [],
  initialTab = 0,
  onChange,
  variant = 'default',
  color = 'primary',
  fullWidth = false,
  size = 'md',
  className = '',
  ...props
}: TabsProps) => {
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState(initialTab);
  
  // Handle tab change
  const handleTabChange = (index: number) => {
    setActiveTab(index);
    if (onChange) onChange(index);
  };
  
  // Base styles for the tabs container
  const containerBaseClasses = "flex overflow-x-auto";
  const containerVariantClasses = {
    default: "",
    pills: "p-1 bg-slate-50 rounded-lg",
    buttons: "p-1 bg-slate-50 rounded-lg",
    underline: "border-b border-slate-200",
  } as const;
  
  // Base styles for individual tabs
  const tabBaseClasses = "inline-flex items-center justify-center font-medium transition-all";
  
  const tabSizeClasses = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-sm",
    lg: "px-5 py-2.5 text-base",
  } as const;
  
  // Styles for different variant and state combinations
  const tabStyleVariants = {
    default: {
      primary: {
        active: "text-primary border-b-2 border-primary",
        inactive: "text-slate-600 hover:text-slate-800 hover:border-b-2 hover:border-slate-300",
      },
      secondary: {
        active: "text-primary-dark border-b-2 border-primary-dark",
        inactive: "text-slate-600 hover:text-slate-800 hover:border-b-2 hover:border-slate-300",
      }
    },
    pills: {
      primary: {
        active: theme.getGradient('primary') + " text-white shadow-md rounded-lg",
        inactive: "text-slate-700 hover:bg-slate-100 rounded-lg",
      },
      secondary: {
        active: "bg-primary text-white shadow-md rounded-lg",
        inactive: "text-slate-700 hover:bg-slate-100 rounded-lg",
      }
    },
    buttons: {
      primary: {
        active: "bg-white text-primary shadow-sm rounded-lg border border-slate-200",
        inactive: "text-slate-600 hover:bg-slate-100 rounded-lg",
      },
      secondary: {
        active: "bg-white text-primary-dark shadow-sm rounded-lg border border-slate-200",
        inactive: "text-slate-600 hover:bg-slate-100 rounded-lg",
      }
    },
    underline: {
      primary: {
        active: "text-primary border-b-2 border-primary",
        inactive: "text-slate-600 hover:text-slate-800 border-b-2 border-transparent hover:border-slate-200",
      },
      secondary: {
        active: "text-primary-dark border-b-2 border-primary-dark",
        inactive: "text-slate-600 hover:text-slate-800 border-b-2 border-transparent hover:border-slate-200",
      }
    }
  } as const;
  
  // Width classes
  const widthClasses = fullWidth ? "flex-1" : "";
  
  return (
    <div className={`${className}`} {...props}>
      <div className={`${containerBaseClasses} ${containerVariantClasses[variant]}`}>
        {tabs.map((tab, index) => (
          <button
            key={index}
            className={`
              ${tabBaseClasses}
              ${tabSizeClasses[size]}
              ${widthClasses}
              ${index === activeTab 
                ? tabStyleVariants[variant][color].active 
                : tabStyleVariants[variant][color].inactive}
              ${index === 0 && variant === 'buttons' ? 'rounded-l-lg' : ''}
              ${index === tabs.length - 1 && variant === 'buttons' ? 'rounded-r-lg' : ''}
              ${variant === 'default' || variant === 'underline' ? 'mx-1' : 'mx-0.5'}
            `}
            onClick={() => handleTabChange(index)}
            aria-selected={index === activeTab ? 'true' : 'false'}
            role="tab"
          >
            {tab.icon && (
              <span className={`${tab.label ? 'mr-2' : ''}`}>{tab.icon}</span>
            )}
            {tab.label}
          </button>
        ))}
      </div>
      
      <div className="mt-4">
        {tabs[activeTab]?.content}
      </div>
    </div>
  );
};

export default Tabs;