
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import type { Document, UserDocumentProgress } from '@/types/documents';

export const useDocuments = () => {
  const { user } = useAuth();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [progress, setProgress] = useState<UserDocumentProgress[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDocuments();
    if (user) {
      fetchProgress();
    }
  }, [user]);

  const fetchDocuments = async () => {
    try {
      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .order('is_required', { ascending: false })
        .order('title');

      if (error) throw error;
      setDocuments(data || []);
    } catch (error) {
      console.error('Error fetching documents:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProgress = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_document_progress')
        .select('*')
        .eq('user_id', user.id);

      if (error) throw error;
      setProgress(data || []);
    } catch (error) {
      console.error('Error fetching document progress:', error);
    }
  };

  const getDocumentStats = () => {
    const totalDocuments = documents.length;
    const requiredDocuments = documents.filter(doc => doc.is_required).length;
    const completedDocuments = progress.filter(p => p.completed_at).length;
    const viewedDocuments = progress.filter(p => p.viewed).length;

    return {
      total: totalDocuments,
      required: requiredDocuments,
      completed: completedDocuments,
      viewed: viewedDocuments,
      completionRate: requiredDocuments > 0 ? Math.round((completedDocuments / requiredDocuments) * 100) : 0
    };
  };

  return {
    documents,
    progress,
    loading,
    stats: getDocumentStats(),
    refetchProgress: fetchProgress
  };
};
