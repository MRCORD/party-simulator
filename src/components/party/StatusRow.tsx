"use client";
import React from 'react';

interface StatusRowProps {
  title: string;
  current: number;
  total: number;
  isOk: boolean;
}

const StatusRow: React.FC<StatusRowProps> = ({ title, current, total, isOk }) => (
  <div className="flex justify-between items-center py-2">
    <span className="text-sm">{title}</span>
    <div className="flex items-center">
      <span className="text-sm text-right w-16">{current}/{total}</span>
      <span className={`ml-2 px-2 py-0.5 text-xs rounded ${isOk ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'} min-w-[48px] text-center`}>
        {isOk ? 'OK' : 'Falta'}
      </span>
    </div>
  </div>
);

export default StatusRow;