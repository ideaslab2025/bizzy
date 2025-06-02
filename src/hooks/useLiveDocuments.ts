
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Document } from '@/types/documents';

export const useLiveDocuments = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      
      const { data, error: docError } = await supabase
        .from('documents')
        .select('*')
        .order('is_required', { ascending: false })
        .order('title')
        .limit(8); // Limit for demo display

      if (docError) throw docError;

      setDocuments(data || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching documents:', err);
      setError('Failed to load documents');
    } finally {
      setLoading(false);
    }
  };

  const getDemoDocumentsData = () => {
    if (!documents.length) return null;

    const categories = [...new Set(documents.map(doc => doc.category))];
    const featuredTemplates = documents
      .filter(doc => doc.is_required)
      .slice(0, 4)
      .map(doc => doc.title);

    return {
      featuredTemplates,
      totalDocuments: documents.length,
      recentlyViewed: Math.floor(Math.random() * 5) + 1,
      categories: categories.slice(0, 4),
      documents: documents.slice(0, 6).map(doc => ({
        title: doc.title,
        category: doc.category,
        description: doc.description,
        isRequired: doc.is_required,
        hasTemplate: !!doc.template_url
      }))
    };
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  return {
    documents,
    loading,
    error,
    demoData: getDemoDocumentsData(),
    refreshContent: fetchDocuments
  };
};
