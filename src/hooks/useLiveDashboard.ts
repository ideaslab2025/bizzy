
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useLiveDashboard = () => {
  const [stats, setStats] = useState({
    totalSteps: 0,
    completedSteps: 0,
    totalDocuments: 0,
    completedDocuments: 0
  });
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Get total steps and documents counts
      const [stepsResult, documentsResult] = await Promise.all([
        supabase.from('guidance_steps').select('id', { count: 'exact' }),
        supabase.from('documents').select('id', { count: 'exact' })
      ]);

      const totalSteps = stepsResult.count || 0;
      const totalDocuments = documentsResult.count || 0;

      // Simulate realistic completion rates for demo
      const completedSteps = Math.floor(totalSteps * 0.65); // 65% completion
      const completedDocuments = Math.floor(totalDocuments * 0.45); // 45% completion

      setStats({
        totalSteps,
        completedSteps,
        totalDocuments,
        completedDocuments
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getDemoDashboardData = () => {
    const completionRate = stats.totalSteps > 0 
      ? Math.round((stats.completedSteps / stats.totalSteps) * 100)
      : 78;

    return {
      completionRate,
      tasksCompleted: stats.completedSteps,
      totalTasks: stats.totalSteps,
      upcomingDeadlines: 3,
      timeSaved: `${Math.floor(stats.completedSteps * 2.5)} hours`,
      recentActivity: [
        'Completed VAT registration guide',
        'Downloaded Employment Contract template',
        'Updated registered office address'
      ],
      nextActions: [
        'Set up business bank account',
        'Register for Corporation Tax',
        'Create employee handbook'
      ]
    };
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return {
    stats,
    loading,
    demoData: getDemoDashboardData(),
    refreshData: fetchDashboardData
  };
};
