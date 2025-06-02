
import React, { useState } from 'react';
import { useDocuments } from '@/hooks/useDocuments';
import { CategoryFilter } from './filters/CategoryFilter';
import { StatusFilter } from './filters/StatusFilter';
import { DocumentStatusSummary } from './status/DocumentStatusSummary';
import { DocumentProgressList } from './progress/DocumentProgressList';

interface DocumentStatusDashboardProps {
  userId: string;
}

export const DocumentStatusDashboard: React.FC<DocumentStatusDashboardProps> = ({ userId }) => {
  const { documents, progress, loading } = useDocuments();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  if (loading) {
    return (
      <div className="document-dashboard p-6 bg-white rounded-lg shadow-sm animate-pulse">
        <div className="h-8 bg-gray-200 rounded mb-4"></div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-32 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  // Calculate document status data
  const completedDocIds = progress.filter(p => p.completed_at).map(p => p.document_id);
  const inProgressDocIds = progress.filter(p => p.viewed && !p.completed_at).map(p => p.document_id);
  
  const documentStatus = {
    totalCount: documents.length,
    completedCount: completedDocIds.length,
    inProgressCount: inProgressDocIds.length,
    notStartedCount: documents.length - completedDocIds.length - inProgressDocIds.length,
    criticalCount: documents.filter(doc => doc.is_required && !completedDocIds.includes(doc.id)).length,
    categories: ['all', 'legal', 'finance', 'hr', 'governance', 'compliance'],
    documents: documents.map(doc => {
      let status: 'completed' | 'in-progress' | 'not-started';
      if (completedDocIds.includes(doc.id)) {
        status = 'completed';
      } else if (inProgressDocIds.includes(doc.id)) {
        status = 'in-progress';
      } else {
        status = 'not-started';
      }

      return {
        id: doc.id,
        title: doc.title,
        category: doc.category,
        is_required: doc.is_required,
        status
      };
    })
  };

  return (
    <div className="document-dashboard p-6 bg-white rounded-lg shadow-sm">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Document Status Overview</h2>
        <p className="text-gray-600">Complete view of your business documentation progress</p>
      </div>

      {/* Professional Filters */}
      <div className="mb-6 flex flex-wrap gap-4">
        <CategoryFilter 
          value={selectedCategory}
          onChange={setSelectedCategory}
          categories={documentStatus.categories}
        />
        <StatusFilter 
          value={statusFilter}
          onChange={setStatusFilter}
        />
      </div>

      {/* Status Summary Cards */}
      <DocumentStatusSummary data={documentStatus} />

      {/* Document List with Progress Correlation */}
      <DocumentProgressList 
        documents={documentStatus.documents}
        categoryFilter={selectedCategory}
        statusFilter={statusFilter}
      />
    </div>
  );
};
