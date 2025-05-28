import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  TrendingUp, 
  Clock, 
  Target, 
  ArrowRight,
  Calendar,
  Lightbulb
} from 'lucide-react';
import { ProgressAnalyticsDashboard } from '@/components/progress/ProgressAnalyticsDashboard';
import { AchievementPanel } from '@/components/achievements/AchievementPanel';
import { SmartRecommendationsPanel } from '@/components/guidance/SmartRecommendationsPanel';
import { useSmartRecommendations } from '@/hooks/useSmartRecommendations';
import { DashboardCardSkeleton } from '@/components/ui/skeleton-loader';

interface PersonalizedDashboardProps {
  userId: string;
  completedStepIds: number[];
  currentSectionCategory: string;
  companyAge: number;
  onNavigateToStep: (sectionId: number, stepNumber: number) => void;
  onNavigateToGuidedHelp: () => void;
}

export const PersonalizedDashboard: React.FC<PersonalizedDashboardProps> = ({
  userId,
  completedStepIds,
  currentSectionCategory,
  companyAge,
  onNavigateToStep,
  onNavigateToGuidedHelp
}) => {
  const { getTopRecommendations } = useSmartRecommendations(
    userId,
    completedStepIds,
    currentSectionCategory,
    companyAge
  );

  const topRecommendations = getTopRecommendations(3);

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="text-center py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome back! 👋
        </h1>
        <p className="text-gray-600">
          Let's continue building your business together
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50 hover:shadow-lg transition-shadow cursor-pointer" onClick={onNavigateToGuidedHelp}>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Target className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-blue-900">Continue Journey</h3>
                <p className="text-sm text-blue-600">Pick up where you left off</p>
              </div>
              <ArrowRight className="w-5 h-5 text-blue-600 ml-auto" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-green-200 bg-gradient-to-br from-green-50 to-emerald-50">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <Calendar className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-green-900">Schedule Check-in</h3>
                <p className="text-sm text-green-600">Weekly progress review</p>
              </div>
              <ArrowRight className="w-5 h-5 text-green-600 ml-auto" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-violet-50">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <Lightbulb className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold text-purple-900">Get Help</h3>
                <p className="text-sm text-purple-600">Chat with our AI assistant</p>
              </div>
              <ArrowRight className="w-5 h-5 text-purple-600 ml-auto" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Analytics and Progress */}
        <div className="lg:col-span-2 space-y-6">
          <React.Suspense fallback={
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <DashboardCardSkeleton key={i} />
              ))}
            </div>
          }>
            <ProgressAnalyticsDashboard userId={userId} />
          </React.Suspense>
        </div>

        {/* Right Column - Achievements and Recommendations */}
        <div className="space-y-6">
          <React.Suspense fallback={<DashboardCardSkeleton />}>
            <AchievementPanel userId={userId} compact />
          </React.Suspense>
          
          {topRecommendations.length > 0 && (
            <Card className="border-blue-200 bg-blue-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-blue-800">
                  <TrendingUp className="w-5 h-5" />
                  Next Steps
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {topRecommendations.slice(0, 2).map((rec) => (
                    <Button
                      key={rec.id}
                      variant="outline"
                      className="w-full justify-start gap-3 hover:bg-blue-100 h-auto p-3"
                      onClick={() => onNavigateToStep(rec.section_id, rec.order_number)}
                    >
                      <div className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0"></div>
                      <div className="flex-1 text-left">
                        <div className="font-medium text-sm">{rec.title}</div>
                        <div className="text-xs text-gray-600 flex items-center gap-2">
                          <Clock className="w-3 h-3" />
                          {rec.estimated_time_minutes}m
                          {rec.quick_win && (
                            <Badge variant="secondary" className="text-xs">
                              Quick Win
                            </Badge>
                          )}
                        </div>
                      </div>
                    </Button>
                  ))}
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="w-full text-blue-600"
                    onClick={onNavigateToGuidedHelp}
                  >
                    View all recommendations →
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};
