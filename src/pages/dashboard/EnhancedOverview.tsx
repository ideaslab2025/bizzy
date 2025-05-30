import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { motion } from 'framer-motion';
import { 
  TrendingUp, Clock, FileText, Calendar, Award, 
  Zap, ArrowRight, CheckCircle, AlertTriangle,
  Target, PlayCircle, BookOpen
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { businessSections } from '@/data/businessSections';

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
  const [analytics, setAnalytics] = useState<DashboardAnalytics | null>(null);
  const [quickWins, setQuickWins] = useState<QuickWin[]>([]);
  const [deadlines, setDeadlines] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    if (!user) return;

    try {
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

      // Process data
      const completionBySection: Record<number, number> = {};
      sections?.forEach(section => {
        const sectionSteps = allSteps?.filter(step => step.section_id === section.id) || [];
        const completedSectionSteps = sectionSteps.filter(step => 
          completedStepIds.includes(step.id)
        );
        completionBySection[section.id] = sectionSteps.length > 0 
          ? (completedSectionSteps.length / sectionSteps.length) * 100 
          : 0;
      });

      const totalSteps = allSteps?.length || 0;
      const completedSteps = completedStepIds.length;
      const overallProgress = totalSteps > 0 ? (completedSteps / totalSteps) * 100 : 0;

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

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Extended sections data with icons for the visual journey map
  const navigateToSection = (sectionId: number) => {
    navigate(`/guided-help?section=${sectionId}`);
  };

  const navigateToStep = (sectionId: number, stepNumber: number) => {
    const section = analytics?.sections.find(s => s.id === sectionId);
    if (section) {
      navigate(`/guided-help?section=${section.id}&step=${stepNumber}`);
    }
  };

  // Function to check completion state from localStorage
  const getSectionCompletionFromStorage = (sectionId: number) => {
    return localStorage.getItem(`bizzy_section_${sectionId}_complete`) === 'true';
  };

  // Enhanced function to get real completion with proper synchronization
  const getSectionCompletion = (sectionId: number) => {
    // First check analytics data
    if (analytics?.completionBySection[sectionId] !== undefined) {
      return analytics.completionBySection[sectionId];
    }
    
    // Then check localStorage for section progress
    const storageKey = `bizzy_section_${sectionId}_progress`;
    const storedProgress = localStorage.getItem(storageKey);
    if (storedProgress) {
      return parseInt(storedProgress, 10);
    }
    
    // Finally check if marked as complete
    if (getSectionCompletionFromStorage(sectionId)) {
      return 100;
    }
    
    return 0;
  };

  if (loading || !analytics) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8">
      {/* Welcome Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">
          Welcome back! 
        </h1>
        <p className="text-gray-600">
          You're {Math.round(analytics.overallProgress)}% through your business setup journey
        </p>
      </div>

      {/* Visual Journey Map - Fixed layout with proper connections */}
      <Card className="p-6">
        <CardHeader className="px-0 pt-0">
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            Your Business Setup Journey
          </CardTitle>
        </CardHeader>
        <CardContent className="px-0">
          <div className="w-full">
            <div className="relative">
              {/* Grid of sections */}
              <div className="grid grid-cols-5 gap-2 lg:gap-4">
                {businessSections.map((section, index) => {
                  const IconComponent = section.icon;
                  const completion = getSectionCompletion(section.id);
                  const isCompleted = completion === 100;
                  const isCurrent = section.id === analytics?.currentSection?.id;
                  
                  return (
                    <div key={section.id} className="flex flex-col items-center">
                      <motion.div
                        className="flex flex-col items-center cursor-pointer w-full"
                        whileHover={{ scale: 1.05 }}
                        onClick={() => navigateToSection(section.id)}
                      >
                        {/* Section node */}
                        <div className={cn(
                          "w-12 h-12 rounded-full flex items-center justify-center border-4 transition-all mb-2 relative z-20 bg-white",
                          isCompleted ? 
                            "border-green-500" :
                          isCurrent ? 
                            "border-blue-500" : 
                            "border-gray-300"
                        )}>
                          {isCompleted ? (
                            <CheckCircle className="w-6 h-6 text-green-500" strokeWidth={2} />
                          ) : (
                            <IconComponent 
                              className={cn(
                                "w-6 h-6",
                                isCurrent ? "text-blue-500" : section.iconColor
                              )} 
                              strokeWidth={2} 
                            />
                          )}
                        </div>
                        
                        <p className="text-xs lg:text-sm text-center font-medium leading-tight">{section.title}</p>
                        <p className="text-xs text-gray-500">
                          {Math.round(completion)}%
                        </p>
                      </motion.div>
                    </div>
                  );
                })}
              </div>
              
              {/* Connecting arrows positioned absolutely over the grid */}
              <div className="absolute inset-0 pointer-events-none">
                {businessSections.map((section, index) => {
                  const completion = getSectionCompletion(section.id);
                  const isCompleted = completion === 100;
                  const isLastSection = index === businessSections.length - 1;
                  
                  return (
                    <div key={`connection-${index}`}>
                      {/* Arrow lines between sections (except for last) */}
                      {!isLastSection && (
                        <div
                          className="absolute top-6"
                          style={{
                            left: `${(index * 20) + 10}%`,
                            width: '20%',
                          }}
                        >
                          <div className={cn(
                            "h-0.5 w-full relative",
                            isCompleted ? "bg-green-500" : "bg-gray-300"
                          )}>
                            <div className={cn(
                              "absolute -right-1 top-1/2 -translate-y-1/2 w-0 h-0",
                              "border-l-4 border-t-2 border-b-2 border-t-transparent border-b-transparent",
                              isCompleted ? "border-l-green-500" : "border-l-gray-300"
                            )} />
                          </div>
                        </div>
                      )}
                      
                      {/* Completion line under last section */}
                      {isLastSection && (
                        <div
                          className="absolute top-20"
                          style={{
                            left: `${index * 20}%`,
                            width: '20%',
                          }}
                        >
                          <div className={cn(
                            "h-1 w-full relative rounded-full",
                            "bg-gradient-to-r from-gray-300 to-green-500"
                          )}>
                            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 bg-green-500 rounded-full" />
                          </div>
                          <div className="mt-2 text-center">
                            <span className="text-xs font-bold text-green-600">Journey Complete!</span>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard
          title="Overall Progress"
          value={`${Math.round(analytics.overallProgress)}%`}
          icon={<TrendingUp className="w-5 h-5" strokeWidth={2} />}
          trend={analytics.completedSteps > 0 ? `${analytics.completedSteps} steps completed` : undefined}
          color="blue"
        />
        <StatCard
          title="Documents"
          value={`${analytics.documentsCompleted}/${analytics.totalDocuments}`}
          icon={<FileText className="w-5 h-5" strokeWidth={2} />}
          trend={analytics.documentsCompleted > 0 ? `${Math.round((analytics.documentsCompleted / analytics.totalDocuments) * 100)}% complete` : undefined}
          color="green"
        />
        <StatCard
          title="Time Invested"
          value={`${analytics.totalHours}h`}
          icon={<Clock className="w-5 h-5" strokeWidth={2} />}
          trend="Estimated time saved: 20h"
          color="purple"
        />
        <StatCard
          title="Next Milestone"
          value={analytics.currentSection?.title || 'Complete!'}
          icon={<Target className="w-5 h-5" strokeWidth={2} />}
          trend={analytics.currentSection ? `${analytics.currentSection.estimated_time_minutes} min remaining` : undefined}
          color="orange"
        />
      </div>

      {/* Action Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Quick Wins */}
        <Card className="border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-800">
              <Zap className="w-5 h-5" strokeWidth={2} />
              Quick Wins Available
              <Badge variant="secondary" className="ml-auto">
                {quickWins.length}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {quickWins.length === 0 ? (
              <p className="text-gray-500 text-center py-4">
                No quick wins available - great job staying on top of things!
              </p>
            ) : (
              <div className="space-y-3">
                {quickWins.map((task) => (
                  <Button
                    key={task.id}
                    variant="outline"
                    className="w-full justify-between hover:bg-green-100"
                    onClick={() => navigateToStep(task.section_id, task.order_number)}
                  >
                    <div className="text-left">
                      <div className="font-medium">{task.title}</div>
                      <div className="text-sm text-gray-600">{task.section_title}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-500">{task.estimated_time_minutes}min</span>
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
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-800">
              <PlayCircle className="w-5 h-5" strokeWidth={2} />
              Continue Your Journey
            </CardTitle>
          </CardHeader>
          <CardContent>
            {analytics.currentSection ? (
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-lg">{analytics.currentSection.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">{analytics.currentSection.description}</p>
                  
                  <div className="mt-3">
                    <div className="flex justify-between text-sm mb-1">
                      <span>Progress</span>
                      <span>{Math.round(getSectionCompletion(analytics.currentSection.id))}%</span>
                    </div>
                    <Progress value={getSectionCompletion(analytics.currentSection.id)} className="h-2" />
                  </div>
                </div>
                
                <Button 
                  className="w-full"
                  onClick={() => navigateToSection(analytics.currentSection.id)}
                >
                  Continue Section
                  <ArrowRight className="w-4 h-4 ml-2" strokeWidth={2} />
                </Button>
              </div>
            ) : (
              <div className="text-center py-4">
                <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-2" strokeWidth={2} />
                <p className="font-semibold">Congratulations!</p>
                <p className="text-sm text-gray-600">You've completed all sections</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Bottom Row - Recent Activity & Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" strokeWidth={2} />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            {analytics.recentActivities.length === 0 ? (
              <p className="text-gray-500 text-center py-4">
                No recent activity. Start your first section to see progress here!
              </p>
            ) : (
              <div className="space-y-3">
                {analytics.recentActivities.map((activity, index) => (
                  <div key={index} className="flex items-center gap-3 p-2 rounded hover:bg-gray-50">
                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" strokeWidth={2} />
                    <div className="flex-1">
                      <p className="font-medium text-sm">{activity.title}</p>
                      <p className="text-xs text-gray-500">{activity.section}</p>
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

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="w-5 h-5" strokeWidth={2} />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                className="h-20 flex-col gap-2"
                onClick={() => navigate('/dashboard/documents')}
              >
                <FileText className="w-5 h-5" strokeWidth={2} />
                <span className="text-sm">Documents</span>
              </Button>
              
              <Button
                variant="outline"
                className="h-20 flex-col gap-2"
                onClick={() => navigate('/guided-help')}
              >
                <Target className="w-5 h-5" strokeWidth={2} />
                <span className="text-sm">Guide</span>
              </Button>
              
              <Button
                variant="outline"
                className="h-20 flex-col gap-2"
                onClick={() => {/* TODO: Navigate to achievements */}}
              >
                <Award className="w-5 h-5" strokeWidth={2} />
                <span className="text-sm">Achievements</span>
              </Button>
              
              <Button
                variant="outline"
                className="h-20 flex-col gap-2"
                onClick={() => {/* TODO: Navigate to help */}}
              >
                <AlertTriangle className="w-5 h-5" strokeWidth={2} />
                <span className="text-sm">Get Help</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
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
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-2xl font-bold mt-1">{value}</p>
            {trend && (
              <p className="text-xs text-gray-500 mt-1">{trend}</p>
            )}
          </div>
          <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${colorClasses[color]}`}>
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EnhancedOverview;
