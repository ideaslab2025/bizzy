
import React from 'react';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { Badge } from '@/components/ui/badge';
import { FileText, File, Download, Clock } from 'lucide-react';
import { format } from 'date-fns';
import type { Document } from '@/types/documents';

interface DocumentHoverCardProps {
  document: Document;
  children: React.ReactNode;
  side?: 'top' | 'right' | 'bottom' | 'left';
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

const getFileTypeIcon = (fileType?: string) => {
  if (!fileType) return FileText;
  
  switch (fileType.toLowerCase()) {
    case 'pdf':
      return File;
    case 'doc':
    case 'docx':
      return FileText;
    default:
      return FileText;
  }
};

const formatFileSize = (bytes?: number) => {
  if (!bytes) return 'Unknown size';
  
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${Math.round(bytes / Math.pow(1024, i) * 100) / 100} ${sizes[i]}`;
};

export const DocumentHoverCard: React.FC<DocumentHoverCardProps> = ({ 
  document, 
  children, 
  side = 'top' 
}) => {
  const FileIcon = getFileTypeIcon(document.file_type);
  const lastUpdated = document.updated_at ? new Date(document.updated_at) : new Date(document.created_at);

  return (
    <HoverCard openDelay={500} closeDelay={200}>
      <HoverCardTrigger asChild>
        {children}
      </HoverCardTrigger>
      <HoverCardContent 
        side={side} 
        className="w-80 p-4 bg-white/95 backdrop-blur-sm border shadow-lg rounded-lg"
        sideOffset={8}
      >
        <div className="space-y-3">
          {/* Header with title and icon */}
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 mt-0.5">
              <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                <FileIcon className="w-4 h-4 text-blue-600" />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 text-base leading-tight">
                {document.title}
              </h3>
              {document.description && (
                <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                  {document.description}
                </p>
              )}
            </div>
          </div>

          {/* Category and badges */}
          <div className="flex items-center gap-2 flex-wrap">
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
                {document.file_type.toUpperCase()}
              </Badge>
            )}
          </div>

          {/* Metadata */}
          <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t">
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>Updated {format(lastUpdated, 'MMM d, yyyy')}</span>
            </div>
            {document.file_size && (
              <div className="flex items-center gap-1">
                <Download className="w-3 h-3" />
                <span>{formatFileSize(document.file_size)}</span>
              </div>
            )}
          </div>

          {/* CTA */}
          <div className="text-center pt-1">
            <span className="text-xs text-gray-400">Click to view details</span>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
};
