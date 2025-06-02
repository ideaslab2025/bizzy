
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatDistanceToNow } from 'date-fns';

interface ProgressCategory {
  id: string;
  name: string;
  description: string;
  totalDocuments: number;
  completedDocuments: number;
  completionPercentage: number;
  criticalDocuments: any[];
  upcomingDeadlines: Date[];
}

interface CategoryProgressCardProps {
  category: ProgressCategory;
  onViewDetails: (categoryId: string) => void;
}

const CategoryProgressCard: React.FC<CategoryProgressCardProps> = ({ category, onViewDetails }) => {
  const progressPercentage = category.completionPercentage;

  const getStatusColor = (percentage: number) => {
    if (percentage >= 90) return 'text-green-600 bg-green-50 border-green-200';
    if (percentage >= 70) return 'text-blue-600 bg-blue-50 border-blue-200';
    if (percentage >= 40) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  const getProgressBarColor = (percentage: number) => {
    if (percentage >= 90) return 'bg-green-600';
    if (percentage >= 70) return 'bg-blue-600';
    if (percentage >= 40) return 'bg-yellow-600';
    return 'bg-red-600';
  };

  const getCategoryIcon = (categoryId: string) => {
    switch (categoryId) {
      case 'legal': return '⚖️';
      case 'finance': return '💰';
      case 'hr': return '👥';
      case 'governance': return '📋';
      default: return '📄';
    }
  };

  return (
    <Card className="hover:shadow-lg transition-shadow duration-200">
      <CardContent className="p-6">
        {/* Category Header */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-start space-x-3">
            <span className="text-2xl">{getCategoryIcon(category.id)}</span>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{category.name}</h3>
              <p className="text-sm text-gray-600 mt-1">{category.description}</p>
            </div>
          </div>
          <Badge 
            className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(progressPercentage)}`}
          >
            {progressPercentage}%
          </Badge>
        </div>

        {/* Professional 2D Progress Bar */}
        <div className="mb-4">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span className="font-medium">Progress</span>
            <span>{category.completedDocuments} of {category.totalDocuments} documents</span>
          </div>
          <div className="w-full bg-gray-200 rounded-lg h-3">
            <div 
              className={`h-3 rounded-lg transition-all duration-500 ${getProgressBarColor(progressPercentage)}`}
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>

        {/* Document Breakdown */}
        <div className="space-y-3 mb-4">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Documents Status</span>
            <span className="font-medium text-gray-900">
              {category.completedDocuments} completed
            </span>
          </div>
          
          {category.totalDocuments > 0 && (
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <div className="text-lg font-bold text-green-600">{category.completedDocuments}</div>
                  <div className="text-xs text-gray-600">Done</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-gray-600">
                    {category.totalDocuments - category.completedDocuments}
                  </div>
                  <div className="text-xs text-gray-600">Pending</div>
                </div>
              </div>
            </div>
          )}

          {category.upcomingDeadlines.length > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Next Deadline</span>
              <span className="font-medium text-orange-600">
                {formatDistanceToNow(category.upcomingDeadlines[0], { addSuffix: true })}
              </span>
            </div>
          )}
        </div>

        {/* Action Button */}
        <Button
          onClick={() => onViewDetails(category.id)}
          className="w-full bg-blue-600 text-white hover:bg-blue-700 transition-colors"
          size="sm"
        >
          View Documents ({category.totalDocuments - category.completedDocuments} remaining)
        </Button>
      </CardContent>
    </Card>
  );
};

export default CategoryProgressCard;
