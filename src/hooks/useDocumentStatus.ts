
import { useState, useEffect } from 'react';
import { useDocuments } from '@/hooks/useDocuments';

interface DocumentStatusData {
  totalCount: number;
  completedCount: number;
  inProgressCount: number;
  notStartedCount: number;
  criticalCount: number;
  categories: string[];
  documents: Array<{
    id: string;
    title: string;
    category: string;
    is_required: boolean;
    status: 'completed' | 'in-progress' | 'not-started';
    completedDate?: Date;
    priority: 'critical' | 'high' | 'medium' | 'low';
  }>;
}

export const useDocumentStatus = (userId: string) => {
  const { documents, progress, loading } = useDocuments();
  const [documentStatus, setDocumentStatus] = useState<DocumentStatusData | null>(null);

  useEffect(() => {
    if (!loading && documents.length > 0) {
      calculateDocumentStatus();
    }
  }, [documents, progress, loading]);

  const calculateDocumentStatus = () => {
    const completedDocIds = progress.filter(p => p.completed_at).map(p => p.document_id);
    const inProgressDocIds = progress.filter(p => p.viewed && !p.completed_at).map(p => p.document_id);
    
    const statusData: DocumentStatusData = {
      totalCount: documents.length,
      completedCount: completedDocIds.length,
      inProgressCount: inProgressDocIds.length,
      notStartedCount: documents.length - completedDocIds.length - inProgressDocIds.length,
      criticalCount: documents.filter(doc => doc.is_required && !completedDocIds.includes(doc.id)).length,
      categories: ['all', 'legal', 'finance', 'hr', 'governance', 'compliance'],
      documents: documents.map(doc => {
        const progressItem = progress.find(p => p.document_id === doc.id);
        return {
          id: doc.id,
          title: doc.title,
          category: doc.category,
          is_required: doc.is_required,
          status: completedDocIds.includes(doc.id) ? 'completed' : 
                  inProgressDocIds.includes(doc.id) ? 'in-progress' : 'not-started',
          completedDate: progressItem?.completed_at ? new Date(progressItem.completed_at) : undefined,
          priority: doc.is_required ? 'critical' : 'medium' as 'critical' | 'high' | 'medium' | 'low'
        };
      })
    };

    setDocumentStatus(statusData);
  };

  return {
    documentStatus,
    loading: loading || !documentStatus
  };
};
