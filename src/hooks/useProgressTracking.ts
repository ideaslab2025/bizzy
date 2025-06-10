
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

interface CategoryProgress {
  categoryId: string;
  name: string;
  completed: number;
  total: number;
  percentage: number;
}

export const useProgressTracking = () => {
  const { user } = useAuth();
  const [completedDocuments, setCompletedDocuments] = useState<Set<string>>(new Set());
  const [categoryProgress, setCategoryProgress] = useState<CategoryProgress[]>([]);
  const [loading, setLoading] = useState(false);

  const categoryMapping = {
    'company-setup': 'Company Set-Up',
    'tax-vat': 'Tax and VAT', 
    'employment': 'Employment',
    'legal-compliance': 'Legal Compliance',
    'finance': 'Finance',
    'data-protection': 'Data Protection'
  };

  const fetchCompletionStatus = useCallback(async () => {
    if (!user) return;
    
    try {
      // Fetch user's completion progress
      const { data: progressData, error: progressError } = await supabase
        .from('user_document_progress')
        .select('document_id, is_completed')
        .eq('user_id', user.id)
        .eq('is_completed', true);

      if (progressError) throw progressError;

      const completed = new Set(progressData?.map(p => p.document_id) || []);
      setCompletedDocuments(completed);

      // Fetch all documents to calculate category progress
      const { data: documents, error: docsError } = await supabase
        .from('documents')
        .select('id, category');

      if (docsError) throw docsError;

      // Calculate progress by category
      const progress: CategoryProgress[] = Object.entries(categoryMapping).map(([categoryId, name]) => {
        const categoryDocs = documents?.filter(doc => doc.category === categoryId) || [];
        const completedInCategory = categoryDocs.filter(doc => completed.has(doc.id)).length;
        
        return {
          categoryId,
          name,
          completed: completedInCategory,
          total: categoryDocs.length,
          percentage: categoryDocs.length > 0 ? Math.round((completedInCategory / categoryDocs.length) * 100) : 0
        };
      });

      setCategoryProgress(progress);
    } catch (error) {
      console.error('Error fetching completion status:', error);
    }
  }, [user]);

  const toggleDocumentCompletion = useCallback(async (documentId: string, isCompleted: boolean) => {
    if (!user) return;

    setLoading(true);
    try {
      const { error } = await supabase.rpc('update_document_completion', {
        p_user_id: user.id,
        p_document_id: documentId,
        p_is_completed: isCompleted
      });

      if (error) throw error;

      // Update local state immediately for optimistic UI
      setCompletedDocuments(prev => {
        const newSet = new Set(prev);
        if (isCompleted) {
          newSet.add(documentId);
        } else {
          newSet.delete(documentId);
        }
        return newSet;
      });

      // Refresh progress data
      await fetchCompletionStatus();
      
      toast.success(isCompleted ? 'Document marked as complete' : 'Document unmarked');
    } catch (error) {
      console.error('Error updating completion status:', error);
      toast.error('Failed to update document status');
    } finally {
      setLoading(false);
    }
  }, [user, fetchCompletionStatus]);

  useEffect(() => {
    fetchCompletionStatus();
  }, [fetchCompletionStatus]);

  return {
    completedDocuments,
    categoryProgress,
    loading,
    toggleDocumentCompletion,
    refreshProgress: fetchCompletionStatus
  };
};
