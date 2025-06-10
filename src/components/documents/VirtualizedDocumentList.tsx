
import React, { useMemo } from 'react';
import { FixedSizeList as List } from 'react-window';
import { DocumentCard } from '@/components/documents/DocumentCard';
import { useIsMobile } from '@/hooks/use-mobile';
import type { Document, UserDocumentProgress } from '@/types/documents';

interface VirtualizedDocumentListProps {
  documents: (Document & { progress?: UserDocumentProgress })[];
  onViewDetails: (document: Document) => void;
  onCustomize: (document: Document) => void;
  onDownload: (document: Document) => void;
  loading?: boolean;
}

const ITEM_HEIGHT = 200;
const MOBILE_ITEM_HEIGHT = 180;

export const VirtualizedDocumentList: React.FC<VirtualizedDocumentListProps> = ({
  documents,
  onViewDetails,
  onCustomize,
  onDownload,
  loading = false
}) => {
  const isMobile = useIsMobile();
  const itemHeight = isMobile ? MOBILE_ITEM_HEIGHT : ITEM_HEIGHT;
  
  const ItemRenderer = ({ index, style }: { index: number; style: React.CSSProperties }) => {
    const document = documents[index];
    if (!document) return null;

    return (
      <div style={style} className="p-2">
        <DocumentCard
          document={document}
          progress={document.progress}
          onViewDetails={onViewDetails}
          onCustomize={onCustomize}
          onDownload={onDownload}
          className="h-full"
        />
      </div>
    );
  };

  const listHeight = Math.min(600, documents.length * itemHeight);

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="animate-pulse">
            <div className="bg-gray-200 rounded-lg h-48"></div>
          </div>
        ))}
      </div>
    );
  }

  if (documents.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No documents found matching your criteria.</p>
      </div>
    );
  }

  // For small lists, use regular grid layout
  if (documents.length <= 12) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {documents.map((document) => (
          <DocumentCard
            key={document.id}
            document={document}
            progress={document.progress}
            onViewDetails={onViewDetails}
            onCustomize={onCustomize}
            onDownload={onDownload}
            className="h-full"
          />
        ))}
      </div>
    );
  }

  // For large lists, use virtualization
  return (
    <div className="w-full">
      <List
        height={listHeight}
        itemCount={Math.ceil(documents.length / 3)}
        itemSize={itemHeight}
        itemData={documents}
        className="scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100"
      >
        {({ index, style }) => (
          <div style={style} className="flex gap-4 p-2">
            {Array.from({ length: 3 }).map((_, colIndex) => {
              const docIndex = index * 3 + colIndex;
              const document = documents[docIndex];
              
              if (!document) return <div key={colIndex} className="flex-1" />;
              
              return (
                <div key={document.id} className="flex-1">
                  <DocumentCard
                    document={document}
                    progress={document.progress}
                    onViewDetails={onViewDetails}
                    onCustomize={onCustomize}
                    onDownload={onDownload}
                    className="h-full"
                  />
                </div>
              );
            })}
          </div>
        )}
      </List>
    </div>
  );
};
