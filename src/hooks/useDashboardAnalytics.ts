
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export interface ComplianceAreaData {
  area: string;
  completed: number;
  total: number;
  color: string;
  deadline?: string;
}

export interface TimelineEvent {
  id: string;
  title: string;
  date: Date;
  type: 'deadline' | 'milestone' | 'completed';
  priority: 'high' | 'medium' | 'low';
  description?: string;
}

export interface JourneyStepData {
  stepId: number;
  title: string;
  completed: boolean;
  completionRate: number;
  averageTime: number;
  dropoffRate: number;
}

export interface DashboardAnalytics {
  overallProgress: number;
  complianceAreas: ComplianceAreaData[];
  timelineEvents: TimelineEvent[];
  journeySteps: JourneyStepData[];
  documentProgress: {
    completed: number;
    total: number;
    byCategory: Record<string, { completed: number; total: number }>;
  };
  engagementMetrics: {
    dailyActiveSteps: number;
    weeklyProgress: number;
    timeSpentToday: number;
  };
}

export const useDashboardAnalytics = () => {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState<DashboardAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalytics = async () => {
    if (!user) return;

    try {
      setLoading(true);
      
      // Fetch user progress
      const { data: userProgress } = await supabase
        .from('user_guidance_progress')
        .select('*')
        .eq('user_id', user.id);

      // Fetch all steps and sections
      const { data: allSteps } = await supabase
        .from('guidance_steps')
        .select('*, guidance_sections(title, color_theme)');

      // Fetch documents progress
      const { data: documentProgress } = await supabase
        .from('user_document_progress')
        .select('*, documents(category)')
        .eq('user_id', user.id);

      // Fetch all documents
      const { data: allDocuments } = await supabase
        .from('documents')
        .select('id, category');

      // Calculate compliance areas
      const complianceAreas: ComplianceAreaData[] = [
        {
          area: 'Legal Setup',
          completed: userProgress?.filter(p => p.completed && p.section_id === 1).length || 0,
          total: allSteps?.filter(s => s.section_id === 1).length || 1,
          color: '#3b82f6',
          deadline: '2024-07-01'
        },
        {
          area: 'Financial',
          completed: userProgress?.filter(p => p.completed && p.section_id === 2).length || 0,
          total: allSteps?.filter(s => s.section_id === 2).length || 1,
          color: '#10b981',
          deadline: '2024-06-15'
        },
        {
          area: 'HR & Operations',
          completed: userProgress?.filter(p => p.completed && p.section_id === 3).length || 0,
          total: allSteps?.filter(s => s.section_id === 3).length || 1,
          color: '#f59e0b',
          deadline: '2024-08-01'
        },
        {
          area: 'Tax & Compliance',
          completed: userProgress?.filter(p => p.completed && p.section_id === 4).length || 0,
          total: allSteps?.filter(s => s.section_id === 4).length || 1,
          color: '#ef4444',
          deadline: '2024-06-30'
        }
      ];

      // Calculate overall progress
      const totalCompleted = userProgress?.filter(p => p.completed).length || 0;
      const totalSteps = allSteps?.length || 1;
      const overallProgress = Math.round((totalCompleted / totalSteps) * 100);

      // Generate timeline events
      const timelineEvents: TimelineEvent[] = [
        {
          id: '1',
          title: 'Company Registration Deadline',
          date: new Date('2024-06-30'),
          type: 'deadline',
          priority: 'high',
          description: 'Complete company registration with Companies House'
        },
        {
          id: '2',
          title: 'Tax Registration',
          date: new Date('2024-07-15'),
          type: 'milestone',
          priority: 'medium',
          description: 'Register for Corporation Tax and VAT if applicable'
        },
        {
          id: '3',
          title: 'Banking Setup',
          date: new Date('2024-08-01'),
          type: 'milestone',
          priority: 'medium',
          description: 'Open business bank account'
        }
      ];

      // Calculate document progress by category
      const documentsByCategory = allDocuments?.reduce((acc, doc) => {
        acc[doc.category] = (acc[doc.category] || 0) + 1;
        return acc;
      }, {} as Record<string, number>) || {};

      const completedByCategory = documentProgress?.reduce((acc, prog) => {
        if (prog.completed_at && prog.documents?.category) {
          acc[prog.documents.category] = (acc[prog.documents.category] || 0) + 1;
        }
        return acc;
      }, {} as Record<string, number>) || {};

      const byCategory = Object.keys(documentsByCategory).reduce((acc, category) => {
        acc[category] = {
          completed: completedByCategory[category] || 0,
          total: documentsByCategory[category] || 0
        };
        return acc;
      }, {} as Record<string, { completed: number; total: number }>);

      // Calculate journey steps with completion rates
      const journeySteps: JourneyStepData[] = allSteps?.map(step => {
        const completedUsers = Math.floor(Math.random() * 100); // Mock data - replace with real analytics
        const totalUsers = 100;
        
        return {
          stepId: step.id,
          title: step.title,
          completed: userProgress?.some(p => p.step_id === step.id && p.completed) || false,
          completionRate: (completedUsers / totalUsers) * 100,
          averageTime: step.estimated_time_minutes || 30,
          dropoffRate: Math.max(0, 100 - (completedUsers / totalUsers) * 100)
        };
      }) || [];

      setAnalytics({
        overallProgress,
        complianceAreas,
        timelineEvents,
        journeySteps,
        documentProgress: {
          completed: documentProgress?.filter(p => p.completed_at).length || 0,
          total: allDocuments?.length || 0,
          byCategory
        },
        engagementMetrics: {
          dailyActiveSteps: userProgress?.filter(p => {
            const today = new Date().toDateString();
            return new Date(p.last_visited_at).toDateString() === today;
          }).length || 0,
          weeklyProgress: Math.floor(Math.random() * 20), // Mock data
          timeSpentToday: Math.floor(Math.random() * 120) // Mock data in minutes
        }
      });

    } catch (err) {
      console.error('Error fetching dashboard analytics:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch analytics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [user]);

  return {
    analytics,
    loading,
    error,
    refetch: fetchAnalytics
  };
};
