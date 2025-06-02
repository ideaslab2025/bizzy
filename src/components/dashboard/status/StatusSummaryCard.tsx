
import React from 'react';

interface StatusSummaryCardProps {
  title: string;
  count: number;
  total: number;
  color: 'green' | 'blue' | 'gray' | 'red';
  icon: string;
  description: string;
}

export const StatusSummaryCard: React.FC<StatusSummaryCardProps> = ({ 
  title, 
  count, 
  total, 
  color, 
  icon, 
  description 
}) => {
  const percentage = total > 0 ? Math.round((count / total) * 100) : 0;
  
  const colorClasses = {
    green: 'border-green-200 bg-green-50',
    blue: 'border-blue-200 bg-blue-50',
    gray: 'border-gray-200 bg-gray-50',
    red: 'border-red-200 bg-red-50'
  };

  return (
    <div className={`p-4 rounded-lg border ${colorClasses[color]}`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-2xl">{icon}</span>
        <span className="text-sm font-semibold text-gray-600">{percentage}%</span>
      </div>
      <h3 className="font-semibold text-gray-900 mb-1">{title}</h3>
      <p className="text-2xl font-bold text-gray-900 mb-1">{count}</p>
      <p className="text-xs text-gray-600">{description}</p>
    </div>
  );
};
