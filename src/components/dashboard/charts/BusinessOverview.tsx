
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { motion } from 'framer-motion';
import { useProgress } from '@/contexts/ProgressContext';
import { 
  TrendingUp, 
  Users, 
  FileText, 
  CheckCircle,
  Clock,
  ArrowRight
} from 'lucide-react';

interface BusinessOverviewProps {
  userId: string;
}

export const BusinessOverview: React.FC<BusinessOverviewProps> = ({ userId }) => {
  const { overallBusinessProgress, totalDocuments, totalCompletedDocuments, categoryProgress } = useProgress();

  // Calculate estimated time (15 minutes per document)
  const estimatedTimeSpent = Math.round((totalCompletedDocuments * 15) / 60); // Convert to hours

  const stats = [
    {
      value: totalDocuments,
      label: 'Total Documents',
      color: 'blue',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      textColor: 'text-blue-900',
      icon: '📄'
    },
    {
      value: totalCompletedDocuments,
      label: 'Completed',
      color: 'green',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      textColor: 'text-green-900',
      icon: '✅'
    },
    {
      value: totalDocuments - totalCompletedDocuments,
      label: 'Remaining',
      color: 'orange',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200',
      textColor: 'text-orange-900',
      icon: '⏳'
    },
    {
      value: `${overallBusinessProgress}%`,
      label: 'Complete',
      color: 'purple',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
      textColor: 'text-purple-900',
      icon: '📊'
    }
  ];

  // Calculate critical documents (assuming required documents from categories with low completion)
  const criticalCategories = categoryProgress.filter(cat => cat.percentage < 100 && cat.total > 0);
  const criticalRemaining = criticalCategories.reduce((sum, cat) => sum + (cat.total - cat.completed), 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <Card className="bg-white shadow-lg border border-gray-200">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            Business Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Main Stats Grid - Matching Document Analytics Design */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {stats.map((stat, index) => (
              <Card 
                key={index} 
                className={`${stat.bgColor} ${stat.borderColor} border hover:shadow-md transition-shadow duration-200 h-32`}
              >
                <CardContent className="p-6 h-full flex flex-col justify-between">
                  <div className="flex items-start justify-between">
                    <span className="text-2xl">{stat.icon}</span>
                    <div className={`text-3xl font-bold ${stat.textColor}`}>
                      {stat.value}
                    </div>
                  </div>
                  <div className={`text-sm font-medium ${stat.textColor} opacity-80`}>
                    {stat.label}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Critical Documents Alert - Matching Document Analytics Style */}
          {criticalRemaining > 0 && (
            <Card className="bg-red-50 border-red-200 border mb-6">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <span className="text-2xl flex-shrink-0">🚨</span>
                  <div className="flex-1">
                    <div className="font-semibold text-red-900">
                      {criticalRemaining} Document{criticalRemaining !== 1 ? 's' : ''} Remaining
                    </div>
                    <div className="text-sm text-red-700 mt-1">
                      Continue your business setup journey to complete these documents
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Category Progress Overview */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Progress by Category</h3>
            <div className="space-y-4">
              {categoryProgress.map(category => (
                <div key={category.categoryId} className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium text-gray-900">{category.name}</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-600">
                        {category.completed}/{category.total}
                      </span>
                      <span className="text-sm font-medium text-blue-600">
                        {category.percentage}%
                      </span>
                    </div>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <motion.div 
                      className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                      initial={{ width: 0 }}
                      animate={{ width: `${category.percentage}%` }}
                      transition={{ duration: 0.8, delay: 0.2 }}
                    />
                  </div>
                  
                  {/* Category Status */}
                  <div className="mt-2 flex flex-wrap gap-2">
                    {category.percentage === 100 && (
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                        ✅ Complete
                      </span>
                    )}
                    {category.percentage < 100 && category.percentage > 0 && (
                      <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded">
                        🔄 In Progress
                      </span>
                    )}
                    {category.percentage === 0 && (
                      <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                        ⚪ Not Started
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Time Investment Summary */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center gap-3">
              <Clock className="w-6 h-6 text-blue-600" />
              <div>
                <div className="font-semibold text-blue-900">
                  {estimatedTimeSpent}h Time Invested
                </div>
                <div className="text-sm text-blue-700">
                  Estimated time spent on business setup • Average 15min per document
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
