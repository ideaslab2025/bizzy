
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Clock, AlertTriangle } from 'lucide-react';

interface OverallProgressCardProps {
  totalDocuments: number;
  completedDocuments: number;
  requiredDocuments: number;
  overallProgress: number;
}

const OverallProgressCard: React.FC<OverallProgressCardProps> = ({
  totalDocuments,
  completedDocuments,
  requiredDocuments,
  overallProgress
}) => {
  const remainingDocuments = totalDocuments - completedDocuments;
  const requiredCompleted = Math.min(completedDocuments, requiredDocuments);

  const getOverallStatus = () => {
    if (overallProgress >= 90) return { color: 'green', label: 'Excellent Progress', icon: CheckCircle };
    if (overallProgress >= 70) return { color: 'blue', label: 'On Track', icon: Clock };
    if (overallProgress >= 40) return { color: 'yellow', label: 'Needs Attention', icon: AlertTriangle };
    return { color: 'red', label: 'Action Required', icon: AlertTriangle };
  };

  const status = getOverallStatus();
  const StatusIcon = status.icon;

  return (
    <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="text-xl font-bold text-gray-900">Overall Business Setup</span>
          <Badge 
            variant="secondary" 
            className={`
              ${status.color === 'green' ? 'bg-green-100 text-green-800 border-green-200' : ''}
              ${status.color === 'blue' ? 'bg-blue-100 text-blue-800 border-blue-200' : ''}
              ${status.color === 'yellow' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' : ''}
              ${status.color === 'red' ? 'bg-red-100 text-red-800 border-red-200' : ''}
              border
            `}
          >
            <StatusIcon className="w-3 h-3 mr-1" />
            {status.label}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Main Progress Display */}
          <div className="text-center">
            <div className="text-4xl font-bold text-gray-900 mb-2">
              {overallProgress}%
            </div>
            <p className="text-gray-600 mb-4">
              {completedDocuments} of {totalDocuments} documents completed
            </p>
            <Progress value={overallProgress} className="h-4" />
          </div>

          {/* Detailed Breakdown */}
          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-200">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{completedDocuments}</div>
              <p className="text-sm text-gray-600">Completed</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{requiredCompleted}</div>
              <p className="text-sm text-gray-600">Required Done</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{remainingDocuments}</div>
              <p className="text-sm text-gray-600">Remaining</p>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700">Required Documents Progress</span>
              <span className="text-sm font-bold text-gray-900">
                {Math.round((requiredCompleted / requiredDocuments) * 100)}%
              </span>
            </div>
            <Progress 
              value={(requiredCompleted / requiredDocuments) * 100} 
              className="mt-2 h-2" 
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default OverallProgressCard;
