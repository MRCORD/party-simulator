"use client";
import React, { ReactNode } from 'react';
import { ChevronRight } from 'lucide-react';
import { useTheme } from './ThemeProvider';

interface Breadcrumb {
  href?: string;
  label: string;
  icon?: ReactNode;
}

interface Tab {
  label: string;
  icon?: ReactNode;
  count?: number;
  content?: ReactNode;
}

interface StatChange {
  trend: 'up' | 'down' | 'neutral';
  text: string;
  icon?: ReactNode;
}

interface Stat {
  label: string;
  value: string | number;
  icon?: ReactNode;
  change?: StatChange;
}

interface PageHeaderBaseProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  subtitle?: string;
  icon?: ReactNode | string;
  actions?: ReactNode;
  gradient?: boolean;
  className?: string;
}

interface PageHeaderProps extends PageHeaderBaseProps {
  breadcrumbs?: Breadcrumb[];
}

interface PageHeaderWithTabsProps extends PageHeaderBaseProps {
  tabs: Tab[];
  activeTab: number;
  onTabChange: (index: number) => void;
}

interface PageHeaderWithStatsProps extends PageHeaderBaseProps {
  stats: Stat[];
}

const PageHeader = ({
  title,
  subtitle,
  icon,
  actions,
  breadcrumbs = [],
  gradient = true,
  className = '',
  ...props
}: PageHeaderProps) => {
  const theme = useTheme();
  
  return (
    <div className={`mb-6 ${className}`} {...props}>
      {breadcrumbs.length > 0 && (
        <nav className="flex mb-3" aria-label="Breadcrumb">
          <ol className="inline-flex items-center space-x-1 md:space-x-3 text-sm">
            {breadcrumbs.map((crumb, index) => (
              <li key={index} className="inline-flex items-center">
                {index > 0 && (
                  <ChevronRight className="w-4 h-4 text-slate-400 mx-1" />
                )}
                {index < breadcrumbs.length - 1 ? (
                  <a
                    href={crumb.href}
                    className="text-slate-500 hover:text-primary inline-flex items-center"
                  >
                    {crumb.icon && (
                      <span className="mr-1.5">{crumb.icon}</span>
                    )}
                    {crumb.label}
                  </a>
                ) : (
                  <span className="text-slate-600 inline-flex items-center">
                    {crumb.icon && (
                      <span className="mr-1.5">{crumb.icon}</span>
                    )}
                    {crumb.label}
                  </span>
                )}
              </li>
            ))}
          </ol>
        </nav>
      )}
      
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center mb-3 sm:mb-0">
          {icon && (
            <div className="flex-shrink-0 mr-3">
              {typeof icon === 'string' ? (
                <img src={icon} alt="" className="h-10 w-10" />
              ) : (
                <div className="h-10 w-10 bg-primary-light rounded-lg flex items-center justify-center">
                  {icon}
                </div>
              )}
            </div>
          )}
          
          <div>
            <h1 
              className={
                gradient 
                  ? theme.getGradientText('primary')
                  : 'text-slate-800'
              }
            >
              {title}
            </h1>
            
            {subtitle && (
              <p className="mt-1 text-sm text-slate-500">
                {subtitle}
              </p>
            )}
          </div>
        </div>
        
        {actions && (
          <div className="flex space-x-3">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
};

// With tabs subcomponent
PageHeader.WithTabs = ({
  title,
  subtitle,
  icon,
  actions,
  tabs = [],
  activeTab,
  onTabChange,
  gradient = true,
  ...props
}: PageHeaderWithTabsProps) => {
  const theme = useTheme();
  
  return (
    <div {...props}>
      <PageHeader
        title={title}
        subtitle={subtitle}
        icon={icon}
        actions={actions}
        gradient={gradient}
      />
      
      <div className="flex overflow-x-auto border-b border-slate-200 mb-6">
        {tabs.map((tab, index) => (
          <button
            key={index}
            className={`
              px-4 py-2 text-sm font-medium border-b-2 transition-colors
              ${index === activeTab 
                ? 'border-primary text-primary' 
                : 'border-transparent text-slate-600 hover:text-slate-800 hover:border-slate-300'}
            `}
            onClick={() => onTabChange(index)}
          >
            {tab.icon && (
              <span className="mr-2">{tab.icon}</span>
            )}
            {tab.label}
            {tab.count !== undefined && (
              <span className={`ml-2 px-2 py-0.5 text-xs rounded-full ${
                index === activeTab 
                  ? 'bg-primary-light text-primary-dark' 
                  : 'bg-slate-100 text-slate-600'
              }`}>
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>
      
      {tabs[activeTab]?.content}
    </div>
  );
};

// With stats subcomponent
PageHeader.WithStats = ({
  title,
  subtitle,
  icon,
  actions,
  stats = [],
  gradient = true,
  ...props
}: PageHeaderWithStatsProps) => {
  const theme = useTheme();
  
  return (
    <div {...props}>
      <PageHeader
        title={title}
        subtitle={subtitle}
        icon={icon}
        actions={actions}
        gradient={gradient}
      />
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((stat, index) => (
          <div 
            key={index} 
            className="bg-white rounded-xl overflow-hidden shadow-sm border border-slate-100 flex"
          >
            <div className={`w-2 ${theme.getGradient('primary')}`}></div>
            <div className="flex-1 p-4">
              <div className="flex items-center">
                {stat.icon && (
                  <span className="text-primary mr-2">{stat.icon}</span>
                )}
                <span className="text-sm font-medium text-slate-700">{stat.label}</span>
              </div>
              <div className="mt-2 text-2xl font-bold text-slate-900">{stat.value}</div>
              {stat.change && (
                <div className={`mt-1 text-xs flex items-center ${
                  stat.change.trend === 'up' 
                    ? 'text-success' 
                    : stat.change.trend === 'down' 
                    ? 'text-error' 
                    : 'text-slate-500'
                }`}>
                  {stat.change.icon}
                  <span>{stat.change.text}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PageHeader;