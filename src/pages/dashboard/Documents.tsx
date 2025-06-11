import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useIsMobile } from '@/hooks/use-mobile';
import { useNavigate } from 'react-router-dom';
import { DocumentCard } from '@/components/documents/DocumentCard';
import { DocumentFilters } from '@/components/documents/DocumentFilters';
import { DocumentPreview } from '@/components/documents/DocumentPreview';
import { DocumentUpload } from '@/components/documents/DocumentUpload';
import { DocumentCardSkeleton } from '@/components/ui/skeleton-loader';
import { CopyableText } from '@/components/ui/copyable-text';
import { PullToRefresh } from '@/components/ui/pull-to-refresh';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, Upload } from 'lucide-react';
import { toast } from 'sonner';
import type { Document, UserDocumentProgress, GuidanceStepDocument } from '@/types/documents';
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";

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
  const [showUpload, setShowUpload] = useState(false);

  // Keyboard shortcuts for documents page
  const { showShortcuts, setShowShortcuts } = useKeyboardShortcuts({
    onFocusSearch: () => {
      const searchInput = document.querySelector('input[placeholder*="search"]') as HTMLInputElement;
      if (searchInput) {
        searchInput.focus();
      }
    },
    onNew: () => {
      // Focus on first document or open creation flow
      console.log('New document shortcut triggered');
    }
  });

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

  const handleUploadSuccess = (url: string, path: string) => {
    console.log('Document uploaded successfully:', { url, path });
    // Optionally refresh documents list or show additional success message
  };

  const handleUploadError = (error: string) => {
    console.error('Document upload error:', error);
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
      // Track the download
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

  const handleRefresh = async () => {
    await fetchDocuments();
    if (user) {
      await fetchProgress();
    }
    toast.success('Documents refreshed');
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="px-4 lg:px-0">
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">Document Library</h1>
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

  const documentsContent = (
    <div className="space-y-6">
      <div className="px-4 lg:px-0">
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">Document Library</h1>
        
        {/* Example copyable reference information */}
        <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <h3 className="font-medium text-blue-900 dark:text-blue-100 mb-2">Quick Reference</h3>
          <div className="space-y-2 text-sm">
            <div className="text-gray-700 dark:text-gray-300">
              Document Library ID: 
              <CopyableText textToCopy="DOC-LIB-001" className="ml-2">
                <code className="bg-blue-100 dark:bg-blue-800/50 px-2 py-1 rounded font-mono text-blue-900 dark:text-blue-100">DOC-LIB-001</code>
              </CopyableText>
            </div>
            <div className="text-gray-700 dark:text-gray-300">
              Support Email: 
              <CopyableText textToCopy="support@bizzy.app" className="ml-2">
                <span className="text-blue-700 dark:text-blue-400">support@bizzy.app</span>
              </CopyableText>
            </div>
          </div>
        </div>
      </div>

      {/* Upload Section */}
      <div className="px-4 lg:px-0">
        <Collapsible open={showUpload} onOpenChange={setShowUpload}>
          <CollapsibleTrigger asChild>
            <Button variant="outline" className="w-full mb-4 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700">
              <Upload className="w-4 h-4 mr-2" />
              Upload New Document Template
              <ChevronDown className={`w-4 h-4 ml-2 transition-transform ${showUpload ? 'rotate-180' : ''}`} />
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="mb-6">
            <DocumentUpload 
              onUploadSuccess={handleUploadSuccess}
              onUploadError={handleUploadError}
            />
          </CollapsibleContent>
        </Collapsible>
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
          <p className="text-gray-500 dark:text-gray-400">No documents found matching your criteria.</p>
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

  return (
    <PullToRefresh onRefresh={handleRefresh}>
      {documentsContent}
    </PullToRefresh>
  );
};

export default Documents;
