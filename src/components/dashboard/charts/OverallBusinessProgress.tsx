
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, TrendingUp, Target } from 'lucide-react';
import { useOverallBusinessProgress } from '@/hooks/useOverallBusinessProgress';

interface OverallBusinessProgressProps {
  showCategoryBreakdown?: boolean;
  compact?: boolean;
}

export const OverallBusinessProgress: React.FC<OverallBusinessProgressProps> = ({
  showCategoryBreakdown = true,
  compact = false
}) => {
  const { 
    overallPercentage, 
    totalDocuments, 
    completedDocuments, 
    categoryBreakdown,
    previousPercentage,
    loading 
  } = useOverallBusinessProgress();

  const [animatedPercentage, setAnimatedPercentage] = useState(previousPercentage);

  // Animate percentage changes
  useEffect(() => {
    if (overallPercentage !== previousPercentage) {
      const timer = setTimeout(() => {
        setAnimatedPercentage(overallPercentage);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [overallPercentage, previousPercentage]);

  const getProgressStatus = () => {
    if (overallPercentage >= 90) return { color: 'green', label: 'Almost Complete!', icon: CheckCircle };
    if (overallPercentage >= 70) return { color: 'blue', label: 'Great Progress', icon: TrendingUp };
    if (overallPercentage >= 40) return { color: 'yellow', label: 'Making Progress', icon: Target };
    return { color: 'gray', label: 'Just Getting Started', icon: Target };
  };

  const status = getProgressStatus();
  const StatusIcon = status.icon;

  if (loading) {
    return (
      <Card className={compact ? 'p-4' : undefined}>
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded mb-4"></div>
          <div className="h-24 bg-gray-200 rounded mb-4"></div>
          <div className="h-4 bg-gray-200 rounded"></div>
        </div>
      </Card>
    );
  }

  return (
    <Card className={`transition-all duration-300 ${compact ? 'p-4' : ''}`}>
      <CardHeader className={compact ? 'pb-3' : undefined}>
        <CardTitle className="flex items-center justify-between">
          <span className={compact ? 'text-lg' : 'text-xl'}>
            Overall Business Progress
          </span>
          <Badge 
            variant="secondary" 
            className={`
              ${status.color === 'green' ? 'bg-green-100 text-green-800 border-green-200' : ''}
              ${status.color === 'blue' ? 'bg-blue-100 text-blue-800 border-blue-200' : ''}
              ${status.color === 'yellow' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' : ''}
              ${status.color === 'gray' ? 'bg-gray-100 text-gray-800 border-gray-200' : ''}
              border
            `}
          >
            <StatusIcon className="w-3 h-3 mr-1" />
            {status.label}
          </Badge>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Main Progress Display */}
        <div className="text-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={animatedPercentage}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className={compact ? 'text-3xl font-bold mb-2' : 'text-4xl font-bold mb-2'}
            >
              {animatedPercentage}%
            </motion.div>
          </AnimatePresence>
          
          <p className="text-gray-600 mb-4">
            {completedDocuments} of {totalDocuments} documents completed
          </p>
          
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: '100%' }}
            transition={{ duration: 0.5 }}
          >
            <Progress 
              value={animatedPercentage} 
              className={compact ? 'h-3' : 'h-4'} 
            />
          </motion.div>
        </div>

        {/* Category Breakdown */}
        {showCategoryBreakdown && !compact && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-3"
          >
            <h4 className="font-semibold text-gray-900 mb-3">Progress by Category</h4>
            {Object.entries(categoryBreakdown).map(([categoryId, category]) => (
              <motion.div
                key={categoryId}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="flex items-center justify-between p-3 rounded-lg border border-gray-200 bg-gray-50"
              >
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-900">
                      {category.name}
                    </span>
                    <span className="text-sm text-gray-600">
                      {category.completed}/{category.total}
                    </span>
                  </div>
                  <Progress value={category.percentage} className="h-2" />
                </div>
                <div className="ml-3 text-sm font-medium text-gray-900">
                  {category.percentage}%
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Quick Stats */}
        {!compact && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-200"
          >
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{completedDocuments}</div>
              <p className="text-xs text-gray-600">Completed</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{totalDocuments - completedDocuments}</div>
              <p className="text-xs text-gray-600">Remaining</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {Math.round((completedDocuments / Math.max(totalDocuments, 1)) * 6)}
              </div>
              <p className="text-xs text-gray-600">Categories</p>
            </div>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
};
