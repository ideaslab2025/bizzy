
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
  
  // Circular progress calculation
  const circumference = 2 * Math.PI * 40; // radius = 40 for better consistency
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
      className="flex flex-col items-center justify-between p-6 bg-white border border-gray-200 rounded-lg hover:shadow-lg hover:border-gray-300 transition-all duration-200 cursor-pointer h-44 w-full"
      onClick={handleClick}
    >
      {/* Circular Progress with Icon */}
      <div className="relative w-20 h-20 mb-4 flex-shrink-0">
        {/* Background Circle */}
        <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="40"
            stroke="#E5E7EB"
            strokeWidth="6"
            fill="none"
          />
          {/* Progress Circle */}
          <circle
            cx="50"
            cy="50"
            r="40"
            stroke={getProgressColor(percentage)}
            strokeWidth="6"
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-500"
          />
        </svg>
        
        {/* Category Icon */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xl">{getCategoryIcon(category.type)}</span>
        </div>
        
        {/* Percentage Label */}
        <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
          <span className="text-sm font-semibold text-gray-700 bg-white px-2 py-1 rounded-md shadow-sm border border-gray-200">
            {percentage}%
          </span>
        </div>
      </div>

      {/* Category Info */}
      <div className="text-center flex-1 flex flex-col justify-end">
        <h3 className="text-sm font-semibold text-gray-900 mb-2 leading-tight line-clamp-2">
          {category.name}
        </h3>
        <p className="text-xs text-gray-500 font-medium">
          {category.completedDocuments}/{category.totalDocuments} complete
        </p>
      </div>
    </div>
  );
};
