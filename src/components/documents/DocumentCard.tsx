
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileText, Download, Edit, Eye, CheckCircle } from 'lucide-react';
import type { Document, UserDocumentProgress } from '@/types/documents';

interface DocumentCardProps {
  document: Document;
  progress?: UserDocumentProgress;
  onViewDetails: (document: Document) => void;
  onCustomize: (document: Document) => void;
  onDownload: (document: Document) => void;
}

const categoryLabels = {
  'company-setup': 'Company Setup',
  'employment': 'Employment',
  'tax-vat': 'Tax & VAT',
  'legal-compliance': 'Legal Compliance',
  'finance': 'Finance',
  'data-protection': 'Data Protection'
};

const categoryColors = {
  'company-setup': 'bg-blue-100 text-blue-800',
  'employment': 'bg-green-100 text-green-800',
  'tax-vat': 'bg-orange-100 text-orange-800',
  'legal-compliance': 'bg-red-100 text-red-800',
  'finance': 'bg-purple-100 text-purple-800',
  'data-protection': 'bg-gray-100 text-gray-800'
};

export const DocumentCard: React.FC<DocumentCardProps> = ({
  document,
  progress,
  onViewDetails,
  onCustomize,
  onDownload
}) => {
  const isCompleted = progress?.completed_at;
  const hasProgress = progress?.viewed || progress?.downloaded || progress?.customized;

  return (
    <Card className="h-full flex flex-col hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <CardTitle className="text-lg line-clamp-2">{document.title}</CardTitle>
            <div className="flex items-center gap-2 mt-2">
              <Badge className={categoryColors[document.category]}>
                {categoryLabels[document.category]}
              </Badge>
              {document.is_required && (
                <Badge variant="outline" className="text-red-600 border-red-200">
                  Required
                </Badge>
              )}
              {document.file_type && (
                <Badge variant="outline">
                  {document.file_type}
                </Badge>
              )}
            </div>
          </div>
          <div className="flex flex-col items-end gap-1">
            <FileText className="w-5 h-5 text-gray-400" />
            {isCompleted && (
              <CheckCircle className="w-4 h-4 text-green-500" />
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col">
        <p className="text-sm text-gray-600 line-clamp-3 mb-4">
          {document.description}
        </p>
        
        {hasProgress && (
          <div className="flex items-center gap-2 mb-4 text-xs text-gray-500">
            {progress?.viewed && <span className="flex items-center gap-1"><Eye className="w-3 h-3" />Viewed</span>}
            {progress?.downloaded && <span className="flex items-center gap-1"><Download className="w-3 h-3" />Downloaded</span>}
            {progress?.customized && <span className="flex items-center gap-1"><Edit className="w-3 h-3" />Customized</span>}
          </div>
        )}
        
        <div className="flex gap-2 mt-auto">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onViewDetails(document)}
            className="flex-1"
          >
            <Eye className="w-4 h-4 mr-1" />
            View
          </Button>
          {document.customizable_fields && Array.isArray(document.customizable_fields) && document.customizable_fields.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onCustomize(document)}
              className="flex-1"
            >
              <Edit className="w-4 h-4 mr-1" />
              Customize
            </Button>
          )}
          {document.template_url && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDownload(document)}
            >
              <Download className="w-4 h-4" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
