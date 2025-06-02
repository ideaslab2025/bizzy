
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ThreeDRingChart } from './charts/ThreeDRingChart';
import { InteractiveTimeline } from './charts/InteractiveTimeline';
import { JourneyFlowChart } from './charts/JourneyFlowChart';
import { useDashboardAnalytics } from '@/hooks/useDashboardAnalytics';
import { DashboardCardSkeleton } from '@/components/ui/skeleton-loader';
import { BarChart3, Target, Users, FileText } from 'lucide-react';

export const AdvancedAnalyticsDashboard: React.FC = () => {
  const { analytics, loading, error } = useDashboardAnalytics();

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <DashboardCardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (error || !analytics) {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardContent className="p-6">
          <p className="text-red-600">Unable to load analytics dashboard</p>
        </CardContent>
      </Card>
    );
  }

  // Prepare data for 3D ring chart
  const complianceRingData = analytics.complianceAreas.map(area => ({
    label: area.area,
    value: area.completed,
    total: area.total,
    color: area.color
  }));

  const documentRingData = Object.entries(analytics.documentProgress.byCategory).map(([category, data], index) => ({
    label: category,
    value: data.completed,
    total: data.total,
    color: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'][index % 5]
  }));

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overall Progress</CardTitle>
            <Target className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.overallProgress}%</div>
            <p className="text-xs text-gray-600">Business setup completion</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Documents</CardTitle>
            <FileText className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {analytics.documentProgress.completed}/{analytics.documentProgress.total}
            </div>
            <p className="text-xs text-gray-600">Documents completed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Daily Activity</CardTitle>
            <BarChart3 className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.engagementMetrics.dailyActiveSteps}</div>
            <p className="text-xs text-gray-600">Steps completed today</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Time Invested</CardTitle>
            <Users className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.engagementMetrics.timeSpentToday}m</div>
            <p className="text-xs text-gray-600">Minutes today</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Visualizations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {/* 3D Compliance Ring Chart */}
        <ThreeDRingChart
          data={complianceRingData}
          title="Compliance Areas Progress"
          centerValue={analytics.overallProgress}
          centerLabel="Overall"
        />

        {/* Document Progress Ring Chart */}
        <ThreeDRingChart
          data={documentRingData}
          title="Document Categories"
          centerValue={Math.round((analytics.documentProgress.completed / analytics.documentProgress.total) * 100)}
          centerLabel="Documents"
        />

        {/* Interactive Timeline */}
        <InteractiveTimeline
          events={analytics.timelineEvents}
          title="Upcoming Deadlines"
        />
      </div>

      {/* Journey Flow Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
        <JourneyFlowChart
          steps={analytics.journeySteps.slice(0, 8)} // Show first 8 steps
          title="Setup Journey Analysis"
        />
      </div>
    </div>
  );
};
