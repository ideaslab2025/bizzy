import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileText, ExternalLink, Download, Edit } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';
import { DocumentHoverCard } from './DocumentHoverCard';
import type { GuidanceStepDocument } from '@/types/documents';

interface DocumentsBlockProps {
  stepId: number;
  linkedDocIds?: string[];
}

export const DocumentsBlock: React.FC<DocumentsBlockProps> = ({ stepId, linkedDocIds = [] }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [documents, setDocuments] = useState<GuidanceStepDocument[]>([]);
  const [userProgress, setUserProgress] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStepDocuments();
    if (user) {
      fetchUserProgress();
    }
  }, [stepId, user]);

  const fetchStepDocuments = async () => {
    try {
      const { data, error } = await supabase
        .from('guidance_step_documents')
        .select(`
          *,
          document:documents(*)
        `)
        .eq('guidance_step_id', stepId)
        .order('display_order');

      if (error) throw error;
      setDocuments(data || []);
    } catch (error) {
      console.error('Error fetching step documents:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserProgress = async () => {
    if (!user || documents.length === 0) return;

    try {
      const documentIds = documents.map(d => d.document?.id).filter(Boolean);
      
      const { data, error } = await supabase
        .from('user_document_progress')
        .select('*')
        .eq('user_id', user.id)
        .in('document_id', documentIds);

      if (error) throw error;

      const progressMap: Record<string, any> = {};
      data?.forEach(progress => {
        if (progress.document_id) {
          progressMap[progress.document_id] = progress;
        }
      });

      setUserProgress(progressMap);
    } catch (error) {
      console.error('Error fetching user progress:', error);
    }
  };

  const markDocumentAsViewed = async (documentId: string) => {
    if (!user) return;

    try {
      await supabase
        .from('user_document_progress')
        .upsert({
          user_id: user.id,
          document_id: documentId,
          viewed: true
        });

      // Update local state
      setUserProgress(prev => ({
        ...prev,
        [documentId]: { ...prev[documentId], viewed: true }
      }));
    } catch (error) {
      console.error('Error marking document as viewed:', error);
    }
  };

  const handleDocumentAction = (document: any, action: 'view' | 'customize' | 'download') => {
    markDocumentAsViewed(document.id);

    switch (action) {
      case 'customize':
        navigate(`/dashboard/documents/customize/${document.id}`);
        break;
      case 'view':
        navigate(`/dashboard/documents?filter=${document.category}`);
        break;
      case 'download':
        // TODO: Implement direct download
        navigate(`/dashboard/documents/customize/${document.id}`);
        break;
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-4">
          <div className="animate-pulse space-y-3">
            <div className="h-4 bg-gray-200 rounded w-1/3"></div>
            <div className="h-12 bg-gray-200 rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (documents.length === 0) {
    return null;
  }

  return (
    <Card className="border-blue-200 bg-blue-50">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <FileText className="w-5 h-5 text-blue-600" />
          Related Documents
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {documents.map((stepDoc) => {
          const doc = stepDoc.document;
          if (!doc) return null;

          const progress = userProgress[doc.id];
          const isViewed = progress?.viewed;
          const isCustomized = progress?.customized;
          const isCompleted = progress?.completed_at;

          const documentItem = (
            <div
              key={stepDoc.id}
              className="flex items-start gap-3 p-3 bg-white rounded-lg border hover:shadow-sm transition-all"
            >
              <div className="flex-shrink-0 mt-1">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <FileText className="w-4 h-4 text-blue-600" />
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="font-medium text-sm">{doc.title}</h4>
                    <p className="text-xs text-gray-600 mt-1">{stepDoc.context}</p>
                    {doc.description && (
                      <p className="text-xs text-gray-500 mt-1">{doc.description}</p>
                    )}
                  </div>

                  <div className="flex flex-col gap-1">
                    {stepDoc.is_primary && (
                      <Badge variant="default" className="text-xs">Primary</Badge>
                    )}
                    {doc.is_required && (
                      <Badge variant="destructive" className="text-xs">Required</Badge>
                    )}
                    {isCompleted && (
                      <Badge variant="outline" className="text-xs text-green-600">Complete</Badge>
                    )}
                  </div>
                </div>

                <div className="flex gap-2 mt-3">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDocumentAction(doc, 'view')}
                    className="text-xs"
                  >
                    <ExternalLink className="w-3 h-3 mr-1" />
                    View
                  </Button>

                  {doc.customizable_fields && (
                    <Button
                      size="sm"
                      variant={isCustomized ? "outline" : "default"}
                      onClick={() => handleDocumentAction(doc, 'customize')}
                      className="text-xs"
                    >
                      <Edit className="w-3 h-3 mr-1" />
                      {isCustomized ? 'Edit' : 'Customize'}
                    </Button>
                  )}

                  {isCompleted && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDocumentAction(doc, 'download')}
                      className="text-xs"
                    >
                      <Download className="w-3 h-3 mr-1" />
                      Download
                    </Button>
                  )}
                </div>
              </div>
            </div>
          );

          // On mobile, show without hover card. On desktop, wrap with hover card
          if (isMobile) {
            return documentItem;
          }

          return (
            <DocumentHoverCard key={stepDoc.id} document={doc} side="right">
              {documentItem}
            </DocumentHoverCard>
          );
        })}

        <div className="pt-2 border-t">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/dashboard/documents')}
            className="w-full text-blue-600 hover:text-blue-700"
          >
            View all documents →
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
