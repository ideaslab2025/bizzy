import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { motion } from 'framer-motion';
import { 
  TrendingUp, Clock, FileText, Calendar, Award, 
  Zap, ArrowRight, CheckCircle, AlertTriangle,
  Target, PlayCircle, BookOpen, BarChart3,
  Users
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { SimpleDocumentAnalytics } from '@/components/dashboard/charts/SimpleDocumentAnalytics';
import { BusinessHistoryTimeline } from '@/components/dashboard/charts/BusinessHistoryTimeline';
import { ProgressPortraits } from '@/components/dashboard/charts/ProgressPortraits';
import { OverallBusinessProgress } from '@/components/dashboard/charts/OverallBusinessProgress';
import { useProgress } from '@/contexts/ProgressContext';
import { logger } from '@/utils/secureLogger';

interface DashboardAnalytics {
  overallProgress: number;
  totalSteps: number;
  completedSteps: number;
  documentsCompleted: number;
  totalDocuments: number;
  totalHours: number;
  currentSection: any;
  sections: any[];
  completionBySection: Record<number, number>;
  recentActivities: any[];
  achievements: any[];
  nextDeadline: any;
}

interface QuickWin {
  id: number;
  title: string;
  section_title: string;
  section_id: number;
  order_number: number;
  estimated_time_minutes: number;
}

const EnhancedOverview: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { overallBusinessProgress, totalDocuments, totalCompletedDocuments } = useProgress();
  
  const [analytics, setAnalytics] = useState<DashboardAnalytics | null>(null);
  const [quickWins, setQuickWins] = useState<QuickWin[]>([]);
  const [deadlines, setDeadlines] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    if (!user) return;

    try {
      logger.debug("Fetching dashboard data", { userId: user.id });
      
      // Fetch sections and steps
      const { data: sections } = await supabase
        .from('guidance_sections')
        .select('*')
        .order('order_number');

      const { data: allSteps } = await supabase
        .from('guidance_steps')
        .select('*, guidance_sections(title)')
        .order('order_number');

      // Fetch user progress
      const { data: progress } = await supabase
        .from('user_guidance_progress')
        .select('*')
        .eq('user_id', user.id);

      // Fetch documents
      const { data: documents } = await supabase
        .from('documents')
        .select('*');

      const { data: userDocuments } = await supabase
        .from('user_documents')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'completed');

      // Fetch quick wins
      const completedStepIds = progress?.filter(p => p.completed).map(p => p.step_id) || [];
      const { data: quickWinSteps } = await supabase
        .from('guidance_steps')
        .select('*, guidance_sections(title)')
        .eq('quick_win', true)
        .not('id', 'in', completedStepIds.length > 0 ? `(${completedStepIds.join(',')})` : '(0)')
        .limit(3);

      // IMPROVED: Process data with enhanced localStorage integration
      const completionBySection: Record<number, number> = {};
      sections?.forEach(section => {
        const sectionSteps = allSteps?.filter(step => step.section_id === section.id) || [];
        const completedSectionSteps = sectionSteps.filter(step => 
          completedStepIds.includes(step.id)
        );
        
        // Calculate base progress from Supabase
        let baseProgress = sectionSteps.length > 0 
          ? (completedSectionSteps.length / sectionSteps.length) * 100 
          : 0;
        
        // Check localStorage for any additional progress
        const localStorageComplete = localStorage.getItem(`bizzy_section_${section.id}_complete`) === 'true';
        const localStorageProgress = localStorage.getItem(`bizzy_section_${section.id}_progress`);
        const progressFromStorage = localStorageProgress ? parseInt(localStorageProgress, 10) : 0;
        
        // Use the highest value between Supabase and localStorage
        let finalProgress = Math.max(baseProgress, progressFromStorage);
        if (localStorageComplete && finalProgress < 100) {
          finalProgress = 100;
        }
        
        completionBySection[section.id] = finalProgress;
        
        logger.debug("Section progress calculated", {
          sectionId: section.id,
          supabaseProgress: baseProgress,
          localStorageProgress: progressFromStorage,
          finalProgress
        });
      });

      const totalSteps = allSteps?.length || 0;
      const completedSteps = completedStepIds.length;
      
      // Calculate overall progress considering localStorage
      const overallProgressFromSections = Object.values(completionBySection).reduce((sum, progress) => sum + progress, 0) / Object.keys(completionBySection).length;
      const overallProgress = Math.max(
        totalSteps > 0 ? (completedSteps / totalSteps) * 100 : 0,
        overallProgressFromSections
      );

      // Find current section (first incomplete section)
      const currentSection = sections?.find(section => 
        completionBySection[section.id] < 100
      ) || sections?.[0];

      // Recent activities
      const recentActivities = progress
        ?.filter(p => p.completed)
        .sort((a, b) => new Date(b.last_visited_at).getTime() - new Date(a.last_visited_at).getTime())
        .slice(0, 5)
        .map(p => {
          const step = allSteps?.find(s => s.id === p.step_id);
          return {
            title: step?.title || 'Unknown step',
            section: step?.guidance_sections?.title || 'Unknown section',
            completedAt: p.last_visited_at
          };
        }) || [];

      setAnalytics({
        overallProgress,
        totalSteps,
        completedSteps,
        documentsCompleted: userDocuments?.length || 0,
        totalDocuments: documents?.length || 0,
        totalHours: Math.round((completedSteps * 45) / 60), // Estimate 45 min per step
        currentSection,
        sections: sections || [],
        completionBySection,
        recentActivities,
        achievements: [], // TODO: Implement achievements
        nextDeadline: null // TODO: Implement deadline tracking
      });

      setQuickWins(quickWinSteps?.map(step => ({
        id: step.id,
        title: step.title,
        section_title: step.guidance_sections?.title || '',
        section_id: step.section_id || 0,
        order_number: step.order_number,
        estimated_time_minutes: step.estimated_time_minutes || 30
      })) || []);

      logger.info("Dashboard data loaded successfully", {
        sectionsCount: sections?.length || 0,
        stepsCount: allSteps?.length || 0,
        completedSteps,
        overallProgress: Math.round(overallProgress)
      });

    } catch (error) {
      logger.error('Error fetching dashboard data', { 
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    } finally {
      setLoading(false);
    }
  };

  const navigateToStep = (sectionId: number, stepNumber: number) => {
    const section = analytics?.sections.find(s => s.id === sectionId);
    if (section) {
      logger.audit("User navigating to step", { sectionId, stepNumber });
      navigate(`/guided-help?section=${section.id}&step=${stepNumber}`);
    }
  };

  if (loading || !analytics) {
    return (
      <div className="p-4 md:p-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="p-4 md:p-8 space-y-6 md:space-y-8">
      {/* Welcome Header with Mobile Typography */}
      <div className="mb-6 md:mb-8">
        <h1 className="text-xl md:text-3xl font-bold mb-2 md:mb-3 leading-tight">
          Welcome back! 
        </h1>
        <p className="text-sm md:text-base text-gray-600 leading-relaxed">
          You're {overallBusinessProgress}% through your business setup journey
        </p>
      </div>

      {/* Enhanced Tab Navigation with Mobile-Optimized Headers - Updated to 2 columns */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 gap-1 md:gap-0 h-auto md:h-10">
          <TabsTrigger 
            value="overview" 
            className="flex flex-col md:flex-row items-center gap-1 md:gap-2 px-2 md:px-3 py-2 md:py-2 text-xs md:text-sm min-h-[48px] md:min-h-[40px]"
          >
            <Target className="w-3 h-3 md:w-4 md:h-4" />
            <span className="text-center leading-tight">
              Business<br className="md:hidden" />
              <span className="md:ml-1">Overview</span>
            </span>
          </TabsTrigger>
          <TabsTrigger 
            value="analytics" 
            className="flex flex-col md:flex-row items-center gap-1 md:gap-2 px-2 md:px-3 py-2 md:py-2 text-xs md:text-sm min-h-[48px] md:min-h-[40px]"
          >
            <BarChart3 className="w-3 h-3 md:w-4 md:h-4" />
            <span className="text-center leading-tight">
              Document<br className="md:hidden" />
              <span className="md:ml-1">Analytics</span>
            </span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6 md:space-y-8 mt-6">
          {/* Stats Grid with Mobile-Optimized Layout - Updated to use real progress data */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
            <StatCard
              title="Overall Progress"
              value={`${overallBusinessProgress}%`}
              icon={<TrendingUp className="w-4 h-4 md:w-5 md:h-5" strokeWidth={2} />}
              trend={totalCompletedDocuments > 0 ? `${totalCompletedDocuments} documents completed` : undefined}
              color="blue"
            />
            <StatCard
              title="Documents"
              value={`${totalCompletedDocuments}/${totalDocuments}`}
              icon={<FileText className="w-4 h-4 md:w-5 md:h-5" strokeWidth={2} />}
              trend={totalCompletedDocuments > 0 ? `${overallBusinessProgress}% complete` : undefined}
              color="green"
            />
            <StatCard
              title="Time Invested"
              value={`${Math.round((totalCompletedDocuments * 15) / 60)}h`}
              icon={<Clock className="w-4 h-4 md:w-5 md:h-5" strokeWidth={2} />}
              trend="Estimated time saved: 20h"
              color="purple"
            />
            <StatCard
              title="Next Milestone"
              value={analytics.currentSection?.title || 'Complete!'}
              icon={<Target className="w-4 h-4 md:w-5 md:h-5" strokeWidth={2} />}
              trend={analytics.currentSection ? `${analytics.currentSection.estimated_time_minutes} min remaining` : undefined}
              color="orange"
            />
          </div>

          {/* Progress Portraits Section */}
          <ProgressPortraits />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
            {/* Quick Wins */}
            <Card className="border-green-200 bg-green-50">
              <CardHeader className="pb-4 md:pb-6">
                <CardTitle className="flex items-center gap-2 text-green-800 text-base md:text-lg">
                  <Zap className="w-4 h-4 md:w-5 md:h-5" strokeWidth={2} />
                  <span>Quick Wins Available</span>
                  <Badge variant="secondary" className="ml-auto text-xs">
                    {quickWins.length}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {quickWins.length === 0 ? (
                  <p className="text-gray-500 text-center py-4 text-sm md:text-base">
                    No quick wins available - great job staying on top of things!
                  </p>
                ) : (
                  <div className="space-y-3">
                    {quickWins.map((task) => (
                      <Button
                        key={task.id}
                        variant="outline"
                        className="w-full justify-between hover:bg-green-100 min-h-[52px] p-3"
                        onClick={() => navigateToStep(task.section_id, task.order_number)}
                      >
                        <div className="text-left flex-1">
                          <div className="font-medium text-sm md:text-base leading-tight">{task.title}</div>
                          <div className="text-xs md:text-sm text-gray-600 mt-1">{task.section_title}</div>
                        </div>
                        <div className="flex items-center gap-2 ml-3">
                          <span className="text-xs md:text-sm text-gray-500">{task.estimated_time_minutes}min</span>
                          <ArrowRight className="w-4 h-4" strokeWidth={2} />
                        </div>
                      </Button>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Continue Current Section */}
            <Card className="border-blue-200 bg-blue-50">
              <CardHeader className="pb-4 md:pb-6">
                <CardTitle className="flex items-center gap-2 text-blue-800 text-base md:text-lg">
                  <PlayCircle className="w-4 h-4 md:w-5 md:h-5" strokeWidth={2} />
                  Continue Your Journey
                </CardTitle>
              </CardHeader>
              <CardContent>
                {analytics.currentSection ? (
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold text-base md:text-lg leading-tight">{analytics.currentSection.title}</h3>
                      <p className="text-xs md:text-sm text-gray-600 mt-2 leading-relaxed">{analytics.currentSection.description}</p>
                      
                      <div className="mt-3">
                        <div className="flex justify-between text-xs md:text-sm mb-2">
                          <span>Progress</span>
                          <span>{Math.round(analytics.completionBySection[analytics.currentSection.id])}%</span>
                        </div>
                        <Progress value={analytics.completionBySection[analytics.currentSection.id]} className="h-2" />
                      </div>
                    </div>
                    
                    <Button 
                      className="w-full min-h-[48px]"
                      onClick={() => navigate('/guided-help')}
                    >
                      Continue Section
                      <ArrowRight className="w-4 h-4 ml-2" strokeWidth={2} />
                    </Button>
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <CheckCircle className="w-10 h-10 md:w-12 md:h-12 text-green-500 mx-auto mb-2" strokeWidth={2} />
                    <p className="font-semibold text-sm md:text-base">Congratulations!</p>
                    <p className="text-xs md:text-sm text-gray-600 mt-1">You've completed all sections</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
            {/* Recent Activity */}
            <Card>
              <CardHeader className="pb-4 md:pb-6">
                <CardTitle className="flex items-center gap-2 text-base md:text-lg">
                  <Clock className="w-4 h-4 md:w-5 md:h-5" strokeWidth={2} />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                {analytics.recentActivities.length === 0 ? (
                  <p className="text-gray-500 text-center py-4 text-sm md:text-base">
                    No recent activity. Start your first section to see progress here!
                  </p>
                ) : (
                  <div className="space-y-3">
                    {analytics.recentActivities.map((activity, index) => (
                      <div key={index} className="flex items-center gap-3 p-2 rounded hover:bg-gray-50 min-h-[48px]">
                        <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" strokeWidth={2} />
                        <div className="flex-1">
                          <p className="font-medium text-sm md:text-base leading-tight">{activity.title}</p>
                          <p className="text-xs md:text-sm text-gray-500 mt-1">{activity.section}</p>
                        </div>
                        <span className="text-xs text-gray-400">
                          {new Date(activity.completedAt).toLocaleDateString()}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Actions with Mobile-Optimized Grid */}
            <Card>
              <CardHeader className="pb-4 md:pb-6">
                <CardTitle className="flex items-center gap-2 text-base md:text-lg">
                  <BookOpen className="w-4 h-4 md:w-5 md:h-5" strokeWidth={2} />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3 md:gap-4">
                  <Button
                    variant="outline"
                    className="h-20 md:h-24 flex-col gap-2 min-h-[80px] touch-manipulation"
                    onClick={() => navigate('/dashboard/documents')}
                  >
                    <FileText className="w-5 h-5 md:w-6 md:h-6" strokeWidth={2} />
                    <span className="text-xs md:text-sm font-medium">Documents</span>
                  </Button>
                  
                  <Button
                    variant="outline"
                    className="h-20 md:h-24 flex-col gap-2 min-h-[80px] touch-manipulation"
                    onClick={() => navigate('/guided-help')}
                  >
                    <Target className="w-5 h-5 md:w-6 md:h-6" strokeWidth={2} />
                    <span className="text-xs md:text-sm font-medium">Guide</span>
                  </Button>
                  
                  <Button
                    variant="outline"
                    className="h-20 md:h-24 flex-col gap-2 min-h-[80px] touch-manipulation"
                    onClick={() => setActiveTab('analytics')}
                  >
                    <BarChart3 className="w-5 h-5 md:w-6 md:h-6" strokeWidth={2} />
                    <span className="text-xs md:text-sm font-medium">Analytics</span>
                  </Button>
                  
                  <Button
                    variant="outline"
                    className="h-20 md:h-24 flex-col gap-2 min-h-[80px] touch-manipulation"
                    onClick={() => navigate('/dashboard/consultations')}
                  >
                    <Users className="w-5 h-5 md:w-6 md:h-6" strokeWidth={2} />
                    <span className="text-xs md:text-sm font-medium">Consult</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6 mt-6">
          <SimpleDocumentAnalytics userId={user.id} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  trend?: string;
  color: 'blue' | 'green' | 'purple' | 'orange';
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, trend, color }) => {
  const colorClasses = {
    blue: 'text-blue-600 bg-blue-100',
    green: 'text-green-600 bg-green-100',
    purple: 'text-purple-600 bg-purple-100',
    orange: 'text-orange-600 bg-orange-100'
  };

  return (
    <Card className="touch-manipulation">
      <CardContent className="p-4 md:p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <p className="text-xs md:text-sm font-medium text-gray-600 leading-tight">{title}</p>
            <p className="text-lg md:text-2xl font-bold mt-1 leading-tight truncate">{value}</p>
            {trend && (
              <p className="text-xs text-gray-500 mt-1 leading-tight">{trend}</p>
            )}
          </div>
          <div className={`w-10 h-10 md:w-12 md:h-12 rounded-lg flex items-center justify-center flex-shrink-0 ml-3 ${colorClasses[color]}`}>
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EnhancedOverview;
