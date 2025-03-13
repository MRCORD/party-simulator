import React from 'react';

interface StatusRowProps {
  title: string;
  current: number;
  total: number;
  isOk: boolean;
}

const StatusRow: React.FC<StatusRowProps> = ({ title, current, total, isOk }) => {
  // Ensure consistent number formatting
  const currentFormatted = Math.round(current).toString();
  const totalFormatted = Math.round(total).toString();
  
  return (
    <div className="flex justify-between items-center py-2">
      <span className="text-sm">{title}</span>
      <div className="flex items-center">
        <span className="text-sm text-right w-16" suppressHydrationWarning>{currentFormatted}/{totalFormatted}</span>
        <span className={`ml-2 px-2 py-0.5 text-xs rounded ${isOk ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'} min-w-[48px] text-center`}>
          {isOk ? 'OK' : 'Falta'}
        </span>
      </div>
    </div>
  );
};

export default StatusRow;