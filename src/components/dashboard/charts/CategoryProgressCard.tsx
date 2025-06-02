
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
}

export const CategoryProgressCard: React.FC<CategoryProgressCardProps> = ({ category }) => {
  const percentage = category.totalDocuments > 0 
    ? Math.round((category.completedDocuments / category.totalDocuments) * 100) 
    : 0;
  
  // Circular progress calculation
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

  return (
    <div className="flex flex-col items-center p-4 bg-gray-50 rounded-lg border hover:shadow-md transition-shadow">
      {/* Circular Progress with Icon */}
      <div className="relative w-24 h-24 mb-3">
        {/* Background Circle */}
        <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
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
        
        {/* Category Icon */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-2xl">{getCategoryIcon(category.type)}</span>
        </div>
        
        {/* Percentage Label */}
        <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
          <span className="text-xs font-semibold text-gray-600 bg-white px-2 py-1 rounded shadow">
            {percentage}%
          </span>
        </div>
      </div>

      {/* Category Info */}
      <div className="text-center">
        <h3 className="text-sm font-semibold text-gray-900 mb-1">{category.name}</h3>
        <p className="text-xs text-gray-600">
          {category.completedDocuments}/{category.totalDocuments} documents
        </p>
      </div>
    </div>
  );
};
