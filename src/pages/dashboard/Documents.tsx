
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useIsMobile } from '@/hooks/use-mobile';
import { useNavigate } from 'react-router-dom';
import { DocumentCard } from '@/components/documents/DocumentCard';
import { DocumentFilters } from '@/components/documents/DocumentFilters';
import { DocumentPreview } from '@/components/documents/DocumentPreview';
import { DocumentCardSkeleton } from '@/components/ui/skeleton-loader';
import { toast } from 'sonner';
import type { Document, UserDocumentProgress, GuidanceStepDocument } from '@/types/documents';

const Documents = () => {
  const { user } = useAuth();
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [progress, setProgress] = useState<UserDocumentProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [previewDocument, setPreviewDocument] = useState<Document | null>(null);
  const [relatedSteps, setRelatedSteps] = useState<GuidanceStepDocument[]>([]);

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
      toast.error('Failed to load documents');
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
      console.error('Error fetching progress:', error);
    }
  };

  const fetchRelatedSteps = async (documentId: string) => {
    try {
      const { data, error } = await supabase
        .from('guidance_step_documents')
        .select('*')
        .eq('document_id', documentId)
        .order('display_order');

      if (error) throw error;
      setRelatedSteps(data || []);
    } catch (error) {
      console.error('Error fetching related steps:', error);
    }
  };

  const markDocumentViewed = async (documentId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('user_document_progress')
        .upsert({
          user_id: user.id,
          document_id: documentId,
          viewed: true
        }, {
          onConflict: 'user_id,document_id'
        });

      if (error) throw error;
      fetchProgress(); // Refresh progress
    } catch (error) {
      console.error('Error marking document as viewed:', error);
    }
  };

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = !searchQuery || 
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.keywords?.some(keyword => keyword.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = !selectedCategory || doc.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const handleViewDetails = async (document: Document) => {
    setPreviewDocument(document);
    await markDocumentViewed(document.id);
    await fetchRelatedSteps(document.id);
  };

  const handleCustomize = (document: Document) => {
    // Navigate to document customizer page
    navigate(`/dashboard/documents/customize/${document.id}`);
  };

  const handleDownload = async (document: Document) => {
    if (!document.template_url) {
      toast.error('No download available for this document');
      return;
    }

    if (!user) return;

    try {
      // Mark as downloaded
      await supabase
        .from('user_document_progress')
        .upsert({
          user_id: user.id,
          document_id: document.id,
          downloaded: true
        }, {
          onConflict: 'user_id,document_id'
        });

      // Open download link
      window.open(document.template_url, '_blank');
      fetchProgress(); // Refresh progress
      toast.success('Document downloaded successfully');
    } catch (error) {
      console.error('Error downloading document:', error);
      toast.error('Failed to download document');
    }
  };

  if (loading) {
    return (
      <div className="space-y-4 lg:space-y-6">
        <div className="px-4 lg:px-0">
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Document Library</h1>
          <p className="text-gray-600 mt-2 text-sm lg:text-base">
            Access templates, forms, and guides to help set up your business
          </p>
        </div>

        <div className="px-4 lg:px-0">
          <DocumentFilters
            searchQuery={searchQuery}
            selectedCategory={selectedCategory}
            onSearchChange={setSearchQuery}
            onCategoryChange={setSelectedCategory}
            documentCount={0}
          />
        </div>

        <div className="px-4 lg:px-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
            {Array.from({ length: 6 }).map((_, index) => (
              <DocumentCardSkeleton key={index} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 lg:space-y-6">
      <div className="px-4 lg:px-0">
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Document Library</h1>
        <p className="text-gray-600 mt-2 text-sm lg:text-base">
          Access templates, forms, and guides to help set up your business
        </p>
      </div>

      <div className="px-4 lg:px-0">
        <DocumentFilters
          searchQuery={searchQuery}
          selectedCategory={selectedCategory}
          onSearchChange={setSearchQuery}
          onCategoryChange={setSelectedCategory}
          documentCount={filteredDocuments.length}
        />
      </div>

      <div className="px-4 lg:px-0">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
          {filteredDocuments.map((document) => {
            const documentProgress = progress.find(p => p.document_id === document.id);
            return (
              <DocumentCard
                key={document.id}
                document={document}
                progress={documentProgress}
                onViewDetails={handleViewDetails}
                onCustomize={handleCustomize}
                onDownload={handleDownload}
                className="flex flex-col h-full"
              />
            );
          })}
        </div>
      </div>

      {filteredDocuments.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No documents found matching your criteria.</p>
        </div>
      )}

      <DocumentPreview
        document={previewDocument}
        isOpen={!!previewDocument}
        onClose={() => setPreviewDocument(null)}
        onCustomize={handleCustomize}
        onDownload={handleDownload}
        relatedSteps={relatedSteps}
      />
    </div>
  );
};

export default Documents;
