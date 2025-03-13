import React, { forwardRef } from 'react';
import { ChevronDown } from 'lucide-react';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  className?: string;
  icon?: React.ReactNode;
  variant?: 'default' | 'primary' | 'secondary';
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ children, label, error, className = '', icon, variant = 'default', ...props }, ref) => {
    const variants = {
      default: 'border-gray-300 focus:border-blue-500 focus:ring-blue-500',
      primary: 'border-indigo-300 focus:border-indigo-500 focus:ring-indigo-500',
      secondary: 'border-blue-300 focus:border-blue-500 focus:ring-blue-500',
    };

    const variantClass = variants[variant];

    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
              {icon}
            </span>
          )}
          <select
            ref={ref}
            className={`block w-full rounded-md shadow-sm border ${variantClass} py-2 
              ${icon ? 'pl-10' : 'pl-3'} pr-10
              focus:outline-none focus:ring-2 focus:ring-opacity-50 disabled:bg-gray-100 disabled:text-gray-500 
              appearance-none bg-transparent text-inherit ${className}`}
            {...props}
          >
            {children}
          </select>
          <ChevronDown 
            size={18}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-inherit pointer-events-none" 
          />
        </div>
        {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
      </div>
    );
  }
);

Select.displayName = 'Select';

export default Select;