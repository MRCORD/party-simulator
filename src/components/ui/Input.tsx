import React, { forwardRef } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  className?: string;
  icon?: React.ReactNode;
  leftAddon?: React.ReactNode;
  rightAddon?: React.ReactNode;
  variant?: 'default' | 'primary' | 'secondary';
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ 
    label, 
    error, 
    className = '', 
    icon, 
    variant = 'default',
    leftAddon,
    rightAddon,
    ...props 
  }, ref) => {
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
          
          {leftAddon && (
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
              {leftAddon}
            </span>
          )}
          
          <input
            ref={ref}
            className={`block w-full rounded-md shadow-sm border ${variantClass} py-2 
              ${(icon || leftAddon) ? 'pl-10' : 'pl-3'} 
              ${rightAddon ? 'pr-10' : 'pr-3'} 
              focus:outline-none focus:ring-2 focus:ring-opacity-50 
              disabled:bg-gray-100 disabled:text-gray-500 
              text-gray-900 ${className}`}
            {...props}
          />
          
          {rightAddon && (
            <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
              {rightAddon}
            </span>
          )}
        </div>
        {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;