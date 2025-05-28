
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface ProgressStats {
  totalSteps: number;
  completedSteps: number;
  averageTimePerStep: number;
  totalTimeSpent: number;
  completionRate: number;
  streakDays: number;
  sectionProgress: Array<{
    sectionId: number;
    sectionTitle: string;
    totalSteps: number;
    completedSteps: number;
    progress: number;
    estimatedTimeRemaining: number;
  }>;
  recentActivity: Array<{
    date: string;
    stepsCompleted: number;
    timeSpent: number;
  }>;
}

export const useProgressAnalytics = (userId: string | undefined) => {
  const [stats, setStats] = useState<ProgressStats | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) return;
    fetchProgressStats();
  }, [userId]);

  const fetchProgressStats = async () => {
    if (!userId) return;
    
    setIsLoading(true);
    setError(null);

    try {
      // Get all sections and steps
      const { data: sections } = await supabase
        .from('guidance_sections')
        .select('id, title, estimated_time_minutes')
        .order('order_number');

      const { data: allSteps } = await supabase
        .from('guidance_steps')
        .select('id, section_id, estimated_time_minutes')
        .order('section_id, order_number');

      // Get user progress
      const { data: userProgress } = await supabase
        .from('user_guidance_progress')
        .select('step_id, section_id, completed, last_visited_at')
        .eq('user_id', userId)
        .eq('completed', true);

      // Get time tracking data
      const { data: timeTracking } = await supabase
        .from('step_time_tracking')
        .select('time_spent_seconds, completed_at')
        .eq('user_id', userId);

      if (!sections || !allSteps) {
        throw new Error('Failed to fetch data');
      }

      const totalSteps = allSteps.length;
      const completedSteps = userProgress?.length || 0;
      const totalTimeSpent = timeTracking?.reduce((sum, record) => sum + record.time_spent_seconds, 0) || 0;
      const averageTimePerStep = completedSteps > 0 ? totalTimeSpent / completedSteps : 0;
      const completionRate = totalSteps > 0 ? (completedSteps / totalSteps) * 100 : 0;

      // Calculate section progress
      const sectionProgress = sections.map(section => {
        const sectionSteps = allSteps.filter(step => step.section_id === section.id);
        const sectionCompletedSteps = userProgress?.filter(progress => progress.section_id === section.id) || [];
        const progress = sectionSteps.length > 0 ? (sectionCompletedSteps.length / sectionSteps.length) : 0;
        
        const remainingSteps = sectionSteps.length - sectionCompletedSteps.length;
        const estimatedTimeRemaining = remainingSteps * (section.estimated_time_minutes || 15);

        return {
          sectionId: section.id,
          sectionTitle: section.title,
          totalSteps: sectionSteps.length,
          completedSteps: sectionCompletedSteps.length,
          progress: progress * 100,
          estimatedTimeRemaining
        };
      });

      // Calculate recent activity (last 7 days)
      const recentActivity = Array.from({ length: 7 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        
        const dayProgress = userProgress?.filter(progress => 
          progress.last_visited_at.startsWith(dateStr)
        ) || [];
        
        const dayTimeTracking = timeTracking?.filter(tracking => 
          tracking.completed_at?.startsWith(dateStr)
        ) || [];

        return {
          date: dateStr,
          stepsCompleted: dayProgress.length,
          timeSpent: dayTimeTracking.reduce((sum, record) => sum + record.time_spent_seconds, 0)
        };
      }).reverse();

      // Calculate streak (simplified)
      const streakDays = recentActivity.filter(day => day.stepsCompleted > 0).length;

      setStats({
        totalSteps,
        completedSteps,
        averageTimePerStep,
        totalTimeSpent,
        completionRate,
        streakDays,
        sectionProgress,
        recentActivity
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch progress stats');
      console.error('Error fetching progress analytics:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    stats,
    isLoading,
    error,
    refetch: fetchProgressStats
  };
};
