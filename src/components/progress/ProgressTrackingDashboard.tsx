
import React from 'react';
import { motion } from 'framer-motion';
import { CircularProgressRing } from './CircularProgressRing';
import { useProgress } from '@/contexts/ProgressContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ProgressTrackingDashboardProps {
  onProgressUpdate?: (overallProgress: number) => void;
  onSectionComplete?: (sectionName: string) => void;
}

export const ProgressTrackingDashboard: React.FC<ProgressTrackingDashboardProps> = ({
  onProgressUpdate,
  onSectionComplete
}) => {
  const { categoryProgress, loading } = useProgress();

  const overallCompleted = categoryProgress.reduce((sum, cat) => sum + cat.completed, 0);
  const overallTotal = categoryProgress.reduce((sum, cat) => sum + cat.total, 0);
  const overallPercentage = overallTotal > 0 ? Math.round((overallCompleted / overallTotal) * 100) : 0;

  const nextCategory = categoryProgress.find(cat => cat.percentage > 0 && cat.percentage < 100) || 
                      categoryProgress.find(cat => cat.percentage === 0);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-40 bg-gray-200 rounded-lg mb-6"></div>
          <div className="space-y-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-20 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const formatTime = (documents: number) => {
    const minutes = documents * 15; // Estimate 15 minutes per document
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  return (
    <div className="space-y-6">
      {/* Overall Progress Section */}
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Your Business Setup Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row items-center justify-center gap-8">
            <div className="flex flex-col items-center">
              <CircularProgressRing 
                percentage={overallPercentage}
                size={140}
                strokeWidth={10}
              />
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="mt-4 text-center"
              >
                <div className="text-lg font-semibold text-gray-900">
                  {overallCompleted} of {overallTotal} documents completed
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  Estimated time remaining: {formatTime(overallTotal - overallCompleted)}
                </div>
              </motion.div>
            </div>
            
            {nextCategory && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                className="text-center md:text-left"
              >
                <h3 className="font-semibold text-gray-900 mb-2">Recommended Next Step</h3>
                <div className="text-blue-600 font-medium">{nextCategory.name}</div>
                <div className="text-sm text-gray-600 mt-1">
                  {nextCategory.completed}/{nextCategory.total} documents completed
                </div>
                <Button
                  onClick={() => {
                    // Navigate to documents page with category filter
                    window.location.href = `/dashboard/documents?category=${nextCategory.categoryId}`;
                  }}
                  className="mt-3"
                  size="sm"
                >
                  Continue Setup
                </Button>
              </motion.div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Category Progress Bars */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Business Setup Categories</CardTitle>
          <p className="text-sm text-gray-600">
            Track your progress across different business setup areas
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {categoryProgress.map((category, index) => (
              <motion.div
                key={category.categoryId}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-4 rounded-lg border border-gray-200 bg-white hover:shadow-sm transition-all duration-200"
              >
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-gray-900 text-sm">{category.name}</h3>
                    <p className="text-xs text-gray-600 mt-1">
                      {category.completed} of {category.total} documents completed
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-900">
                      {category.percentage}%
                    </div>
                    <div className="text-xs text-gray-500">complete</div>
                  </div>
                </div>
                
                {/* Progress bar */}
                <div className="w-full h-2 bg-gray-200 rounded-full">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${category.percentage}%` }}
                    transition={{ duration: 1, ease: "easeInOut" }}
                    className="h-full bg-blue-500 rounded-full"
                  />
                </div>
                
                {category.percentage === 100 && (
                  <div className="mt-2 flex items-center gap-1 text-xs text-green-600">
                    <span>✓</span>
                    <span className="font-medium">Category Complete!</span>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                window.location.href = '/dashboard/documents';
              }}
            >
              View All Documents
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                onProgressUpdate?.(overallPercentage);
              }}
            >
              Refresh Progress
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
