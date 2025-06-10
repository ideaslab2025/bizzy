
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
    green: 'border-green-200 bg-green-50 hover:bg-green-100',
    blue: 'border-blue-200 bg-blue-50 hover:bg-blue-100',
    gray: 'border-gray-200 bg-gray-50 hover:bg-gray-100',
    red: 'border-red-200 bg-red-50 hover:bg-red-100'
  };

  const textColors = {
    green: 'text-green-900',
    blue: 'text-blue-900',
    gray: 'text-gray-900',
    red: 'text-red-900'
  };

  return (
    <div className={`p-6 rounded-lg border transition-all duration-200 hover:shadow-md h-36 flex flex-col justify-between ${colorClasses[color]}`}>
      {/* Header with icon and percentage */}
      <div className="flex items-start justify-between mb-3">
        <span className="text-2xl flex-shrink-0">{icon}</span>
        <span className={`text-sm font-bold px-2 py-1 rounded-md bg-white bg-opacity-60 ${textColors[color]}`}>
          {percentage}%
        </span>
      </div>
      
      {/* Content */}
      <div className="flex-1 flex flex-col justify-between">
        <div>
          <h3 className={`font-semibold mb-2 leading-tight text-base ${textColors[color]}`}>
            {title}
          </h3>
          <p className={`text-2xl font-bold mb-1 ${textColors[color]}`}>
            {count}
          </p>
        </div>
        
        <p className={`text-xs leading-tight ${textColors[color]} opacity-75`}>
          {description}
        </p>
      </div>
    </div>
  );
};
