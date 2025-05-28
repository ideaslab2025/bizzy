import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, 
  Clock, 
  Target, 
  Award,
  Activity,
  BarChart3
} from 'lucide-react';
import { useProgressAnalytics } from '@/hooks/useProgressAnalytics';
import { DashboardCardSkeleton } from '@/components/ui/skeleton-loader';

interface ProgressAnalyticsDashboardProps {
  userId: string;
}

export const ProgressAnalyticsDashboard: React.FC<ProgressAnalyticsDashboardProps> = ({
  userId
}) => {
  const { stats, isLoading, error } = useProgressAnalytics(userId);

  if (isLoading) {
    return (
      <div className="space-y-6">
        {/* Key Metrics Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <DashboardCardSkeleton key={i} />
          ))}
        </div>

        {/* Section Progress Skeleton */}
        <DashboardCardSkeleton />

        {/* Activity Chart Skeleton */}
        <DashboardCardSkeleton />
      </div>
    );
  }

  if (error || !stats) {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardContent className="p-6">
          <p className="text-red-600">Unable to load progress analytics</p>
        </CardContent>
      </Card>
    );
  }

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
            <Target className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round(stats.completionRate)}%</div>
            <p className="text-xs text-gray-600">
              {stats.completedSteps} of {stats.totalSteps} steps
            </p>
            <Progress value={stats.completionRate} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Time</CardTitle>
            <Clock className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatTime(stats.totalTimeSpent)}</div>
            <p className="text-xs text-gray-600">
              Avg: {formatTime(stats.averageTimePerStep)} per step
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Streak</CardTitle>
            <Award className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.streakDays}</div>
            <p className="text-xs text-gray-600">
              {stats.streakDays === 1 ? 'day' : 'days'} active
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recent Activity</CardTitle>
            <Activity className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.recentActivity.slice(-1)[0]?.stepsCompleted || 0}
            </div>
            <p className="text-xs text-gray-600">steps completed today</p>
          </CardContent>
        </Card>
      </div>

      {/* Section Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Progress by Section
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {stats.sectionProgress.map((section) => (
              <div key={section.sectionId} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{section.sectionTitle}</span>
                    <Badge variant="secondary" className="text-xs">
                      {section.completedSteps}/{section.totalSteps}
                    </Badge>
                  </div>
                  <div className="text-sm text-gray-600">
                    {Math.round(section.progress)}%
                  </div>
                </div>
                <Progress value={section.progress} className="h-2" />
                {section.estimatedTimeRemaining > 0 && (
                  <p className="text-xs text-gray-500">
                    Est. {section.estimatedTimeRemaining} min remaining
                  </p>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Activity Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Recent Activity (Last 7 Days)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {stats.recentActivity.map((day, index) => (
              <div key={day.date} className="flex items-center justify-between py-2">
                <div className="flex items-center gap-3">
                  <div className="text-sm font-medium">
                    {index === stats.recentActivity.length - 1 ? 'Today' : 
                     index === stats.recentActivity.length - 2 ? 'Yesterday' :
                     new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}
                  </div>
                  <div className="text-xs text-gray-600">
                    {new Date(day.date).toLocaleDateString()}
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-sm">
                    {day.stepsCompleted} {day.stepsCompleted === 1 ? 'step' : 'steps'}
                  </div>
                  <div className="text-sm text-gray-600">
                    {formatTime(day.timeSpent)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
