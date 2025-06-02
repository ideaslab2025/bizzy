
import React from 'react';

interface CategoryData {
  id: string;
  name: string;
  type: string;
  completedDocuments: number;
  totalDocuments: number;
}

interface CategoryProgressCardProps {
  category: CategoryData;
  onViewDetails?: (categoryId: string) => void;
}

export const CategoryProgressCard: React.FC<CategoryProgressCardProps> = ({ category, onViewDetails }) => {
  const percentage = category.totalDocuments > 0 
    ? Math.round((category.completedDocuments / category.totalDocuments) * 100) 
    : 0;
  
  // Circular progress calculation - smaller size
  const circumference = 2 * Math.PI * 45; // radius = 45
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  const getCategoryIcon = (categoryType: string) => {
    const icons: Record<string, string> = {
      'finance': '💰',
      'hr': '👥',
      'legal': '⚖️',
      'compliance': '📋',
      'governance': '🏛️'
    };
    return icons[categoryType] || '📄';
  };

  const getProgressColor = (percentage: number) => {
    if (percentage >= 90) return '#10B981'; // green
    if (percentage >= 70) return '#3B82F6'; // blue
    if (percentage >= 40) return '#F59E0B'; // yellow
    return '#EF4444'; // red
  };

  const handleClick = () => {
    if (onViewDetails) {
      onViewDetails(category.id);
    }
  };

  return (
    <div 
      className="flex flex-col items-center p-3 bg-gray-50 rounded-lg border hover:shadow-md transition-shadow cursor-pointer h-32"
      onClick={handleClick}
    >
      {/* Circular Progress with Icon - smaller size */}
      <div className="relative w-20 h-20 mb-2">
        {/* Background Circle */}
        <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="45"
            stroke="#E5E7EB"
            strokeWidth="8"
            fill="none"
          />
          {/* Progress Circle */}
          <circle
            cx="50"
            cy="50"
            r="45"
            stroke={getProgressColor(percentage)}
            strokeWidth="8"
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-500"
          />
        </svg>
        
        {/* Category Icon - smaller */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-lg">{getCategoryIcon(category.type)}</span>
        </div>
        
        {/* Percentage Label - smaller */}
        <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2">
          <span className="text-xs font-medium text-gray-600 bg-white px-1.5 py-0.5 rounded shadow text-center">
            {percentage}%
          </span>
        </div>
      </div>

      {/* Category Info - much smaller fonts */}
      <div className="text-center">
        <h3 className="text-xs font-medium text-gray-900 mb-1 leading-tight">{category.name}</h3>
        <p className="text-xs text-gray-500">
          {category.completedDocuments}/{category.totalDocuments}
        </p>
      </div>
    </div>
  );
};
