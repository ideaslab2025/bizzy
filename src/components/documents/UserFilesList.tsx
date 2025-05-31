
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Download, Trash2, File, FileText, Image } from 'lucide-react';
import { useUserFiles } from '@/hooks/useUserFiles';
import { DocumentCardSkeleton } from '@/components/ui/skeleton-loader';
import { format } from 'date-fns';

interface UserFilesListProps {
  refreshTrigger?: number;
}

export const UserFilesList: React.FC<UserFilesListProps> = ({ refreshTrigger }) => {
  const { files, loading, deleteFile, downloadFile, refetch } = useUserFiles();

  React.useEffect(() => {
    if (refreshTrigger) {
      refetch();
    }
  }, [refreshTrigger, refetch]);

  const formatFileSize = (bytes: number) => {
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith('image/')) return <Image className="w-5 h-5" />;
    if (fileType.includes('pdf') || fileType.includes('document')) return <FileText className="w-5 h-5" />;
    return <File className="w-5 h-5" />;
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, index) => (
          <DocumentCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (files.length === 0) {
    return (
      <div className="text-center py-12">
        <File className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <p className="text-gray-500 mb-2">No files uploaded yet</p>
        <p className="text-sm text-gray-400">Upload your first file to get started</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {files.map((file) => (
        <Card key={file.id} className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-start gap-2">
              {getFileIcon(file.file_type)}
              <div className="flex-1 min-w-0">
                <h3 className="truncate font-medium">{file.original_filename}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="outline" className="text-xs">
                    {file.file_type.split('/')[1]?.toUpperCase() || 'FILE'}
                  </Badge>
                  <span className="text-xs text-gray-500">
                    {formatFileSize(file.file_size)}
                  </span>
                </div>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-3">
              <p className="text-xs text-gray-500">
                Uploaded {format(new Date(file.uploaded_at), 'MMM d, yyyy')}
              </p>
              
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => downloadFile(file.file_path, file.original_filename)}
                  className="flex-1"
                >
                  <Download className="w-3 h-3 mr-1" />
                  Download
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    if (confirm('Are you sure you want to delete this file?')) {
                      deleteFile(file.id, file.file_path);
                    }
                  }}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
