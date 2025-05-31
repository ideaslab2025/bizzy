
import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Upload, File, X } from 'lucide-react';
import { useFileUpload } from '@/hooks/useFileUpload';
import { cn } from '@/lib/utils';

interface FileUploadComponentProps {
  onUploadComplete: (result: { path: string; url: string; fullPath: string }) => void;
  onUploadError: (error: Error) => void;
  bucket?: 'documents' | 'user-files';
  folder?: string;
  maxSize?: number;
  acceptedTypes?: Record<string, string[]>;
  className?: string;
}

export const FileUploadComponent: React.FC<FileUploadComponentProps> = ({
  onUploadComplete,
  onUploadError,
  bucket = 'user-files',
  folder,
  maxSize = 104857600, // 100MB default
  acceptedTypes = {
    'application/pdf': ['.pdf'],
    'application/msword': ['.doc'],
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
    'text/plain': ['.txt'],
    'application/vnd.ms-excel': ['.xls'],
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx']
  },
  className
}) => {
  const { uploadFile, uploading, progress } = useFileUpload();

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    try {
      const result = await uploadFile(file, { bucket, folder });
      onUploadComplete(result);
    } catch (error) {
      onUploadError(error as Error);
    }
  }, [uploadFile, bucket, folder, onUploadComplete, onUploadError]);

  const { getRootProps, getInputProps, isDragActive, fileRejections } = useDropzone({
    onDrop,
    maxSize,
    accept: acceptedTypes,
    multiple: false,
    disabled: uploading
  });

  return (
    <div className={cn("space-y-4", className)}>
      <div
        {...getRootProps()}
        className={cn(
          "border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors",
          isDragActive ? "border-blue-400 bg-blue-50" : "border-gray-300 hover:border-gray-400",
          uploading && "opacity-50 cursor-not-allowed"
        )}
      >
        <input {...getInputProps()} />
        <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        {isDragActive ? (
          <p className="text-blue-600">Drop the file here...</p>
        ) : (
          <div>
            <p className="text-gray-600 mb-2">
              Drag and drop a file here, or click to select
            </p>
            <p className="text-sm text-gray-500">
              Supports PDF, DOC, DOCX, TXT, XLS, XLSX (max {Math.round(maxSize / 1024 / 1024)}MB)
            </p>
          </div>
        )}
      </div>

      {uploading && (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <File className="h-4 w-4" />
            <span className="text-sm">Uploading...</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      )}

      {fileRejections.length > 0 && (
        <div className="text-red-600 text-sm">
          {fileRejections.map(({ file, errors }) => (
            <div key={file.name}>
              File {file.name}:
              {errors.map(error => (
                <div key={error.code}>• {error.message}</div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
