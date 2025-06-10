
import React, { useState, useCallback } from 'react';
import { useOptimizedDocuments } from '@/hooks/useOptimizedDocuments';
import { useIsMobile } from '@/hooks/use-mobile';
import { useNavigate } from 'react-router-dom';
import { DocumentFilters } from '@/components/documents/DocumentFilters';
import { DocumentPreview } from '@/components/documents/DocumentPreview';
import { VirtualizedDocumentList } from '@/components/documents/VirtualizedDocumentList';
import { PullToRefresh } from '@/components/ui/pull-to-refresh';
import { PerformanceMonitor } from '@/components/ui/performance-monitor';
import { toast } from 'sonner';
import type { Document } from '@/types/documents';

const OptimizedDocuments = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [previewDocument, setPreviewDocument] = useState<Document | null>(null);

  const {
    documents,
    loading,
    error,
    stats,
    refetch
  } = useOptimizedDocuments({
    category: selectedCategory || undefined,
    searchQuery: searchQuery || undefined,
    limit: 100,
    enableCache: true
  });

  const handleViewDetails = useCallback((document: Document) => {
    setPreviewDocument(document);
  }, []);

  const handleCustomize = useCallback((document: Document) => {
    navigate(`/dashboard/documents/customize/${document.id}`);
  }, [navigate]);

  const handleDownload = useCallback(async (document: Document) => {
    if (!document.template_url) {
      toast.error('No download available for this document');
      return;
    }

    try {
      window.open(document.template_url, '_blank');
      toast.success('Document downloaded successfully');
    } catch (error) {
      console.error('Error downloading document:', error);
      toast.error('Failed to download document');
    }
  }, []);

  const handleRefresh = useCallback(async () => {
    await refetch();
    toast.success('Documents refreshed');
  }, [refetch]);

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500">Error loading documents: {error}</p>
        <button 
          onClick={refetch} 
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Retry
        </button>
      </div>
    );
  }

  const documentsContent = (
    <div className="space-y-6">
      <div className="px-4 lg:px-0">
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">
          Document Library
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2 text-sm lg:text-base">
          Access templates, forms, and guides to help set up your business
        </p>
        
        {/* Performance stats for debugging */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mt-4 p-3 bg-blue-50 rounded-lg text-sm">
            <div className="flex gap-4">
              <span>Total: {stats.total}</span>
              <span>Completed: {stats.completed}</span>
              <span>Progress: {stats.completionRate}%</span>
            </div>
          </div>
        )}
      </div>

      <div className="px-4 lg:px-0">
        <DocumentFilters
          searchQuery={searchQuery}
          selectedCategory={selectedCategory}
          onSearchChange={setSearchQuery}
          onCategoryChange={setSelectedCategory}
          documentCount={documents.length}
        />
      </div>

      <div className="px-4 lg:px-0">
        <VirtualizedDocumentList
          documents={documents}
          onViewDetails={handleViewDetails}
          onCustomize={handleCustomize}
          onDownload={handleDownload}
          loading={loading}
        />
      </div>

      <DocumentPreview
        document={previewDocument}
        isOpen={!!previewDocument}
        onClose={() => setPreviewDocument(null)}
        onCustomize={handleCustomize}
        onDownload={handleDownload}
        relatedSteps={[]}
      />
    </div>
  );

  return (
    <>
      <PullToRefresh onRefresh={handleRefresh}>
        {documentsContent}
      </PullToRefresh>
      <PerformanceMonitor enabled={true} showMetrics={process.env.NODE_ENV === 'development'} />
    </>
  );
};

export default OptimizedDocuments;
