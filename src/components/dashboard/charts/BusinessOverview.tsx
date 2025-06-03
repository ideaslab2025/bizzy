
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { motion } from 'framer-motion';
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
  // Mock data - in a real app this would come from your API
  const overviewData = {
    totalTasks: 45,
    completedTasks: 32,
    documentsGenerated: 12,
    timeSpent: 24 // hours
  };

  const completionRate = Math.round((overviewData.completedTasks / overviewData.totalTasks) * 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <Card className="bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            Business Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Total Progress */}
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-3 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">{completionRate}%</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Overall Progress</div>
              <Progress value={completionRate} className="mt-2" />
            </div>

            {/* Tasks Completed */}
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-3 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {overviewData.completedTasks}/{overviewData.totalTasks}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Tasks Completed</div>
            </div>

            {/* Documents Generated */}
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-3 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
                <FileText className="w-8 h-8 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">{overviewData.documentsGenerated}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Documents Generated</div>
            </div>

            {/* Time Invested */}
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-3 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center">
                <Clock className="w-8 h-8 text-orange-600 dark:text-orange-400" />
              </div>
              <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">{overviewData.timeSpent}h</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Time Invested</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
