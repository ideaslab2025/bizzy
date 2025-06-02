import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useDocuments } from '@/hooks/useDocuments';
import { formatDistanceToNow } from 'date-fns';

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

// ... keep existing code (CategoryFilter component)

interface CategoryFilterProps {
  value: string;
  onChange: (value: string) => void;
  categories: string[];
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({ value, onChange, categories }) => {
  return (
    <div className="flex items-center gap-2">
      <label className="text-sm font-medium text-gray-700">Category:</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {categories.map(category => (
          <option key={category} value={category}>
            {category === 'all' ? 'All Categories' : category.charAt(0).toUpperCase() + category.slice(1)}
          </option>
        ))}
      </select>
    </div>
  );
};

interface StatusFilterProps {
  value: string;
  onChange: (value: string) => void;
}

const StatusFilter: React.FC<StatusFilterProps> = ({ value, onChange }) => {
  const statuses = [
    { value: 'all', label: 'All Status' },
    { value: 'completed', label: 'Completed' },
    { value: 'in-progress', label: 'In Progress' },
    { value: 'not-started', label: 'Not Started' },
    { value: 'critical', label: 'Critical Priority' }
  ];

  return (
    <div className="flex items-center gap-2">
      <label className="text-sm font-medium text-gray-700">Status:</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {statuses.map(status => (
          <option key={status.value} value={status.value}>
            {status.label}
          </option>
        ))}
      </select>
    </div>
  );
};

interface DocumentStatusSummaryProps {
  data: {
    completedCount: number;
    inProgressCount: number;
    notStartedCount: number;
    criticalCount: number;
    totalCount: number;
  };
}

const DocumentStatusSummary: React.FC<DocumentStatusSummaryProps> = ({ data }) => {
  const statusCards = [
    {
      title: 'Completed Documents',
      count: data.completedCount,
      total: data.totalCount,
      color: 'green' as const,
      icon: '✅',
      description: 'Documents downloaded and confirmed complete'
    },
    {
      title: 'In Progress',
      count: data.inProgressCount,
      total: data.totalCount,
      color: 'blue' as const,
      icon: '📝',
      description: 'Documents downloaded but not yet completed'
    },
    {
      title: 'Not Started',
      count: data.notStartedCount,
      total: data.totalCount,
      color: 'gray' as const,
      icon: '📋',
      description: 'Documents available for download'
    },
    {
      title: 'Critical Priority',
      count: data.criticalCount,
      total: data.totalCount,
      color: 'red' as const,
      icon: '🚨',
      description: 'High-priority regulatory requirements'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {statusCards.map((card, index) => (
        <StatusSummaryCard key={index} {...card} />
      ))}
    </div>
  );
};

interface StatusSummaryCardProps {
  title: string;
  count: number;
  total: number;
  color: 'green' | 'blue' | 'gray' | 'red';
  icon: string;
  description: string;
}

const StatusSummaryCard: React.FC<StatusSummaryCardProps> = ({ 
  title, 
  count, 
  total, 
  color, 
  icon, 
  description 
}) => {
  const percentage = total > 0 ? Math.round((count / total) * 100) : 0;
  
  const colorClasses = {
    green: 'border-green-200 bg-green-50',
    blue: 'border-blue-200 bg-blue-50',
    gray: 'border-gray-200 bg-gray-50',
    red: 'border-red-200 bg-red-50'
  };

  return (
    <div className={`p-4 rounded-lg border ${colorClasses[color]}`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-2xl">{icon}</span>
        <span className="text-sm font-semibold text-gray-600">{percentage}%</span>
      </div>
      <h3 className="font-semibold text-gray-900 mb-1">{title}</h3>
      <p className="text-2xl font-bold text-gray-900 mb-1">{count}</p>
      <p className="text-xs text-gray-600">{description}</p>
    </div>
  );
};

interface DocumentProgressListProps {
  documents: Array<{
    id: string;
    title: string;
    category: string;
    is_required: boolean;
    status: 'completed' | 'in-progress' | 'not-started';
  }>;
  categoryFilter: string;
  statusFilter: string;
}

const DocumentProgressList: React.FC<DocumentProgressListProps> = ({ 
  documents, 
  categoryFilter, 
  statusFilter 
}) => {
  const filteredDocuments = documents.filter(doc => {
    const categoryMatch = categoryFilter === 'all' || doc.category === categoryFilter;
    const statusMatch = statusFilter === 'all' || 
                       (statusFilter === 'critical' && doc.is_required && doc.status !== 'completed') ||
                       (statusFilter !== 'critical' && doc.status === statusFilter);
    return categoryMatch && statusMatch;
  });

  const getStatusBadge = (status: string, isRequired: boolean) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>;
      case 'in-progress':
        return <Badge className="bg-blue-100 text-blue-800">In Progress</Badge>;
      case 'not-started':
        return isRequired ? 
          <Badge className="bg-red-100 text-red-800">Critical - Not Started</Badge> :
          <Badge className="bg-gray-100 text-gray-800">Not Started</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">Unknown</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Document Progress List</CardTitle>
        <p className="text-sm text-gray-600">
          Showing {filteredDocuments.length} of {documents.length} documents
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {filteredDocuments.map(doc => (
            <div key={doc.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex-1">
                <h4 className="font-medium text-gray-900">{doc.title}</h4>
                <p className="text-sm text-gray-600 mt-1">
                  Category: {doc.category.charAt(0).toUpperCase() + doc.category.slice(1)}
                  {doc.is_required && <span className="ml-2 text-red-600 font-medium">• Required</span>}
                </p>
              </div>
              <div className="flex items-center gap-3">
                {getStatusBadge(doc.status, doc.is_required)}
                <Button variant="outline" size="sm">
                  View Document
                </Button>
              </div>
            </div>
          ))}
          
          {filteredDocuments.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">No documents match the selected filters</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
