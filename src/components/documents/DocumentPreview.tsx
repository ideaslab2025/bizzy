
import React from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CopyableText } from '@/components/ui/copyable-text';
import { Download, Edit, ExternalLink } from 'lucide-react';
import type { Document, GuidanceStepDocument } from '@/types/documents';

interface DocumentPreviewProps {
  document: Document | null;
  isOpen: boolean;
  onClose: () => void;
  onCustomize: (document: Document) => void;
  onDownload: (document: Document) => void;
  relatedSteps?: GuidanceStepDocument[];
}

const categoryLabels = {
  'company-setup': 'Company Setup',
  'employment': 'Employment',
  'tax-vat': 'Tax & VAT',
  'legal-compliance': 'Legal Compliance',
  'finance': 'Finance',
  'data-protection': 'Data Protection'
};

export const DocumentPreview: React.FC<DocumentPreviewProps> = ({
  document,
  isOpen,
  onClose,
  onCustomize,
  onDownload,
  relatedSteps = []
}) => {
  if (!document) return null;

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-[400px] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle className="text-left">{document.title}</SheetTitle>
        </SheetHeader>
        
        <div className="mt-6 space-y-6">
          <div className="flex flex-wrap gap-2">
            <Badge>{categoryLabels[document.category]}</Badge>
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

          {/* Document ID and reference information */}
          <div className="bg-gray-50 p-3 rounded-lg space-y-2">
            <div className="text-sm">
              <span className="text-gray-600">Document ID: </span>
              <CopyableText textToCopy={document.id} className="ml-1">
                <code className="bg-gray-200 px-2 py-1 rounded text-xs font-mono">{document.id}</code>
              </CopyableText>
            </div>
            {document.template_url && (
              <div className="text-sm">
                <span className="text-gray-600">Template URL: </span>
                <CopyableText textToCopy={document.template_url} className="ml-1">
                  <span className="text-blue-600 break-all">{document.template_url}</span>
                </CopyableText>
              </div>
            )}
          </div>
          
          {document.description && (
            <div>
              <h3 className="font-medium mb-2">Description</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                {document.description}
              </p>
            </div>
          )}
          
          {document.keywords && document.keywords.length > 0 && (
            <div>
              <h3 className="font-medium mb-2">Keywords</h3>
              <div className="flex flex-wrap gap-1">
                {document.keywords.map((keyword, index) => (
                  <CopyableText key={index} textToCopy={keyword}>
                    <Badge variant="secondary" className="text-xs cursor-pointer">
                      {keyword}
                    </Badge>
                  </CopyableText>
                ))}
              </div>
            </div>
          )}
          
          {relatedSteps.length > 0 && (
            <div>
              <h3 className="font-medium mb-2">Related Guide Steps</h3>
              <div className="space-y-2">
                {relatedSteps.map((stepDoc) => (
                  <div key={stepDoc.id} className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <CopyableText textToCopy={`Step ${stepDoc.guidance_step_id}`}>
                        <span className="text-sm font-medium">Step {stepDoc.guidance_step_id}</span>
                      </CopyableText>
                      <Button variant="ghost" size="sm">
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                    </div>
                    {stepDoc.context && (
                      <p className="text-xs text-gray-600 mt-1">{stepDoc.context}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
          
          <div className="flex gap-3 pt-4 border-t">
            {document.customizable_fields && Array.isArray(document.customizable_fields) && document.customizable_fields.length > 0 && (
              <Button onClick={() => onCustomize(document)} className="flex-1">
                <Edit className="w-4 h-4 mr-2" />
                Customize Document
              </Button>
            )}
            {document.template_url && (
              <Button variant="outline" onClick={() => onDownload(document)}>
                <Download className="w-4 h-4 mr-2" />
                Download Template
              </Button>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
