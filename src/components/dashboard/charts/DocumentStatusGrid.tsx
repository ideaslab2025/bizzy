
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useDocuments } from '@/hooks/useDocuments';

interface DocumentStatusGridProps {
  userId: string;
}

export const DocumentStatusGrid: React.FC<DocumentStatusGridProps> = ({ userId }) => {
  const { documents, progress, loading } = useDocuments();

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  // Calculate document status
  const completedDocIds = progress.filter(p => p.completed_at).map(p => p.document_id);
  const downloadedDocIds = progress.filter(p => p.viewed && !p.completed_at).map(p => p.document_id);

  const documentsWithStatus = documents.map(doc => {
    let status: 'completed' | 'downloaded' | 'available';
    let statusDate: Date | null = null;

    if (completedDocIds.includes(doc.id)) {
      status = 'completed';
      const progressItem = progress.find(p => p.document_id === doc.id && p.completed_at);
      statusDate = progressItem?.completed_at ? new Date(progressItem.completed_at) : null;
    } else if (downloadedDocIds.includes(doc.id)) {
      status = 'downloaded';
    } else {
      status = 'available';
    }

    return {
      ...doc,
      status,
      statusDate
    };
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-50 text-green-800 border-green-200';
      case 'downloaded': return 'bg-blue-50 text-blue-800 border-blue-200';
      case 'available': return 'bg-gray-50 text-gray-800 border-gray-200';
      default: return 'bg-gray-50 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return '✅';
      case 'downloaded': return '📄';
      case 'available': return '⭕';
      default: return '⭕';
    }
  };

  const getStatusAction = (status: string) => {
    switch (status) {
      case 'completed': return 'View';
      case 'downloaded': return 'Mark Complete';
      case 'available': return 'Download';
      default: return 'Download';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Document Checklist</CardTitle>
        
        {/* Simple Status Legend */}
        <div className="flex gap-6 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <span className="text-base">✅</span>
            <span>Completed</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-base">📄</span>
            <span>Downloaded</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-base">⭕</span>
            <span>Available</span>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        {/* Document Grid */}
        <div className="space-y-3">
          {documentsWithStatus.map(doc => (
            <div key={doc.id} className={`p-4 border rounded-lg flex items-center justify-between ${getStatusColor(doc.status)}`}>
              <div className="flex items-center gap-3">
                <span className="text-xl">{getStatusIcon(doc.status)}</span>
                <div>
                  <h3 className="font-medium">{doc.title}</h3>
                  <p className="text-sm opacity-75">{doc.category.charAt(0).toUpperCase() + doc.category.slice(1)}</p>
                  {doc.is_required && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-red-100 text-red-800 mt-1">
                      Required
                    </span>
                  )}
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                {doc.status === 'completed' && doc.statusDate && (
                  <span className="text-sm text-gray-600">
                    Completed {doc.statusDate.toLocaleDateString()}
                  </span>
                )}
                <Button variant="outline" size="sm">
                  {getStatusAction(doc.status)}
                </Button>
              </div>
            </div>
          ))}
        </div>

        {documentsWithStatus.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No documents available
          </div>
        )}
      </CardContent>
    </Card>
  );
};
