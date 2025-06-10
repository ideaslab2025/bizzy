
import { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { usePerformanceOptimization } from '@/hooks/usePerformanceOptimization';
import type { Document, UserDocumentProgress } from '@/types/documents';

interface UseOptimizedDocumentsOptions {
  limit?: number;
  category?: string;
  searchQuery?: string;
  enableCache?: boolean;
}

export const useOptimizedDocuments = (options: UseOptimizedDocumentsOptions = {}) => {
  const { user } = useAuth();
  const { measureApiResponse } = usePerformanceOptimization();
  const { limit = 50, category, searchQuery, enableCache = true } = options;
  
  const [documents, setDocuments] = useState<Document[]>([]);
  const [progress, setProgress] = useState<UserDocumentProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Cache key for memoization
  const cacheKey = useMemo(() => 
    `docs_${category || 'all'}_${searchQuery || ''}_${limit}`,
    [category, searchQuery, limit]
  );

  const fetchDocuments = async () => {
    const startTime = performance.now();
    
    try {
      setLoading(true);
      setError(null);

      // Build optimized query
      let query = supabase
        .from('documents')
        .select(`
          id,
          title,
          description,
          category,
          file_type,
          is_required,
          template_url,
          keywords,
          customizable_fields
        `)
        .limit(limit);

      // Add filters
      if (category && category !== 'all') {
        query = query.eq('category', category);
      }

      if (searchQuery) {
        query = query.or(`title.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`);
      }

      // Order by priority
      query = query.order('is_required', { ascending: false })
                  .order('title');

      const { data, error } = await query;

      if (error) throw error;

      setDocuments(data || []);
      measureApiResponse('fetch_documents', startTime);

    } catch (err) {
      console.error('Error fetching documents:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch documents');
    } finally {
      setLoading(false);
    }
  };

  const fetchProgress = async () => {
    if (!user) return;

    const startTime = performance.now();

    try {
      const { data, error } = await supabase
        .from('user_document_progress')
        .select('document_id, viewed, customized, downloaded, completed_at')
        .eq('user_id', user.id);

      if (error) throw error;

      setProgress(data || []);
      measureApiResponse('fetch_progress', startTime);

    } catch (err) {
      console.error('Error fetching progress:', err);
    }
  };

  // Memoized filtered and processed documents
  const processedDocuments = useMemo(() => {
    return documents.map(doc => {
      const docProgress = progress.find(p => p.document_id === doc.id);
      return {
        ...doc,
        progress: docProgress,
        isCompleted: !!docProgress?.completed_at,
        isViewed: !!docProgress?.viewed,
        isCustomized: !!docProgress?.customized
      };
    });
  }, [documents, progress]);

  // Stats calculation (memoized)
  const stats = useMemo(() => {
    const total = documents.length;
    const required = documents.filter(doc => doc.is_required).length;
    const completed = progress.filter(p => p.completed_at).length;
    const viewed = progress.filter(p => p.viewed).length;

    return {
      total,
      required,
      completed,
      viewed,
      completionRate: required > 0 ? Math.round((completed / required) * 100) : 0
    };
  }, [documents, progress]);

  useEffect(() => {
    fetchDocuments();
  }, [cacheKey]);

  useEffect(() => {
    if (user && documents.length > 0) {
      fetchProgress();
    }
  }, [user, documents.length]);

  return {
    documents: processedDocuments,
    loading,
    error,
    stats,
    refetch: fetchDocuments,
    refetchProgress: fetchProgress
  };
};
