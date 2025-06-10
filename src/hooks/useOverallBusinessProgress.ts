
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface BusinessProgressData {
  overallPercentage: number;
  totalDocuments: number;
  completedDocuments: number;
  categoryBreakdown: {
    [categoryId: string]: {
      name: string;
      completed: number;
      total: number;
      percentage: number;
    };
  };
}

export const useOverallBusinessProgress = () => {
  const { user } = useAuth();
  const [progressData, setProgressData] = useState<BusinessProgressData>({
    overallPercentage: 0,
    totalDocuments: 0,
    completedDocuments: 0,
    categoryBreakdown: {}
  });
  const [loading, setLoading] = useState(false);
  const [previousPercentage, setPreviousPercentage] = useState(0);

  const categoryMapping = {
    'company-setup': 'Company Set-Up',
    'tax-vat': 'Tax and VAT',
    'employment': 'Employment',
    'legal-compliance': 'Legal Compliance',
    'finance': 'Finance',
    'data-protection': 'Data Protection'
  };

  const calculateProgress = useCallback(async () => {
    if (!user) return;

    setLoading(true);
    try {
      // Fetch all documents
      const { data: allDocuments, error: docsError } = await supabase
        .from('documents')
        .select('id, category');

      if (docsError) throw docsError;

      // Fetch user's completion progress
      const { data: progressData, error: progressError } = await supabase
        .from('user_document_progress')
        .select('document_id, is_completed')
        .eq('user_id', user.id)
        .eq('is_completed', true);

      if (progressError) throw progressError;

      const completedDocumentIds = new Set(progressData?.map(p => p.document_id) || []);
      
      // Calculate category breakdown
      const categoryBreakdown: BusinessProgressData['categoryBreakdown'] = {};
      let totalDocuments = 0;
      let totalCompleted = 0;

      Object.entries(categoryMapping).forEach(([categoryId, name]) => {
        const categoryDocs = allDocuments?.filter(doc => doc.category === categoryId) || [];
        const completedInCategory = categoryDocs.filter(doc => completedDocumentIds.has(doc.id)).length;
        
        categoryBreakdown[categoryId] = {
          name,
          completed: completedInCategory,
          total: categoryDocs.length,
          percentage: categoryDocs.length > 0 ? Math.round((completedInCategory / categoryDocs.length) * 100) : 0
        };

        totalDocuments += categoryDocs.length;
        totalCompleted += completedInCategory;
      });

      const overallPercentage = totalDocuments > 0 ? Math.round((totalCompleted / totalDocuments) * 100) : 0;
      
      // Store previous percentage for animation
      setPreviousPercentage(progressData.overallPercentage);

      setProgressData({
        overallPercentage,
        totalDocuments,
        completedDocuments: totalCompleted,
        categoryBreakdown
      });

    } catch (error) {
      console.error('Error calculating business progress:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Subscribe to real-time updates
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('business-progress-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'user_document_progress',
          filter: `user_id=eq.${user.id}`
        },
        () => {
          calculateProgress();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, calculateProgress]);

  useEffect(() => {
    calculateProgress();
  }, [calculateProgress]);

  return {
    ...progressData,
    previousPercentage,
    loading,
    refreshProgress: calculateProgress
  };
};
