
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

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

export const DocumentProgressList: React.FC<DocumentProgressListProps> = ({ 
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
