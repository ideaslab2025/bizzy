import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useIsMobile } from '@/hooks/use-mobile';
import { FileText, Download, Edit, Eye, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { DocumentHoverCard } from './DocumentHoverCard';
import type { Document, UserDocumentProgress } from '@/types/documents';

interface DocumentCardProps {
  document: Document;
  progress?: UserDocumentProgress;
  onViewDetails: (document: Document) => void;
  onCustomize: (document: Document) => void;
  onDownload: (document: Document) => void;
  className?: string;
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
  onDownload,
  className
}) => {
  const isMobile = useIsMobile();
  const isCompleted = progress?.completed_at;
  const hasProgress = progress?.viewed || progress?.downloaded || progress?.customized;

  const cardContent = (
    <Card className={cn("h-full flex flex-col hover:shadow-md transition-shadow", className)}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <CardTitle className={`line-clamp-2 ${isMobile ? 'text-base' : 'text-lg'}`}>
              {document.title}
            </CardTitle>
            <div className="flex items-center gap-2 mt-2 flex-wrap">
              <Badge className={`${categoryColors[document.category]} text-xs`}>
                {categoryLabels[document.category]}
              </Badge>
              {document.is_required && (
                <Badge variant="outline" className="text-red-600 border-red-200 text-xs">
                  Required
                </Badge>
              )}
              {document.file_type && (
                <Badge variant="outline" className="text-xs">
                  {document.file_type}
                </Badge>
              )}
            </div>
          </div>
          <div className="flex flex-col items-end gap-1">
            <FileText className="w-4 h-4 lg:w-5 lg:h-5 text-gray-400" />
            {isCompleted && (
              <CheckCircle className="w-3 h-3 lg:w-4 lg:h-4 text-green-500" />
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col">
        <p className={`text-gray-600 line-clamp-3 mb-4 ${isMobile ? 'text-sm' : 'text-sm'}`}>
          {document.description}
        </p>
        
        {hasProgress && (
          <div className="flex items-center gap-2 mb-4 text-xs text-gray-500 flex-wrap">
            {progress?.viewed && (
              <span className="flex items-center gap-1">
                <Eye className="w-3 h-3" />
                Viewed
              </span>
            )}
            {progress?.downloaded && (
              <span className="flex items-center gap-1">
                <Download className="w-3 h-3" />
                Downloaded
              </span>
            )}
            {progress?.customized && (
              <span className="flex items-center gap-1">
                <Edit className="w-3 h-3" />
                Customized
              </span>
            )}
          </div>
        )}
        
        <div className={`mt-auto ${isMobile ? 'space-y-2' : 'flex gap-2'}`}>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onViewDetails(document)}
            className={isMobile ? 'w-full' : 'flex-1'}
          >
            <Eye className="w-3 h-3 lg:w-4 lg:h-4 mr-1" />
            <span className="text-xs lg:text-sm">View</span>
          </Button>
          
          {document.customizable_fields && Array.isArray(document.customizable_fields) && document.customizable_fields.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onCustomize(document)}
              className={isMobile ? 'w-full' : 'flex-1'}
            >
              <Edit className="w-3 h-3 lg:w-4 lg:h-4 mr-1" />
              <span className="text-xs lg:text-sm">Customize</span>
            </Button>
          )}
          
          {document.template_url && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDownload(document)}
              className={isMobile ? 'w-full' : ''}
            >
              <Download className="w-3 h-3 lg:w-4 lg:h-4" />
              {isMobile && <span className="ml-1 text-xs">Download</span>}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );

  // On mobile, show without hover card. On desktop, wrap with hover card
  if (isMobile) {
    return cardContent;
  }

  return (
    <DocumentHoverCard document={document} side="top">
      {cardContent}
    </DocumentHoverCard>
  );
};
