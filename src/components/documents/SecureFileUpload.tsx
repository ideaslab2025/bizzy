
import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Upload, File, AlertTriangle } from 'lucide-react';
import { useFileUpload } from '@/hooks/useFileUpload';
import { useSecurityMonitoring } from '@/hooks/useSecurityMonitoring';
import { validateFileUpload, logSecurityEvent } from '@/utils/security';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface SecureFileUploadProps {
  onUploadComplete: (result: { path: string; url: string; fullPath: string }) => void;
  onUploadError: (error: Error) => void;
  bucket?: 'documents' | 'user-files';
  folder?: string;
  className?: string;
}

export const SecureFileUpload: React.FC<SecureFileUploadProps> = ({
  onUploadComplete,
  onUploadError,
  bucket = 'user-files',
  folder,
  className
}) => {
  const { uploadFile, uploading, progress } = useFileUpload();
  const { checkUploadRateLimit, logSuspiciousActivity } = useSecurityMonitoring();

  const onDrop = useCallback(async (acceptedFiles: File[], rejectedFiles: any[]) => {
    // Check rate limiting
    const userIdentifier = 'current-user'; // In real app, use user ID or IP
    if (!checkUploadRateLimit(userIdentifier)) {
      toast.error('Upload rate limit exceeded. Please wait before uploading again.');
      return;
    }

    // Log rejected files
    if (rejectedFiles.length > 0) {
      logSuspiciousActivity('File upload rejected', {
        rejectedCount: rejectedFiles.length,
        reasons: rejectedFiles.map(f => f.errors.map((e: any) => e.message))
      });
    }

    const file = acceptedFiles[0];
    if (!file) return;

    // Additional security validation
    const validation = validateFileUpload(file);
    if (!validation.isValid) {
      logSecurityEvent('file_upload_blocked', {
        filename: file.name,
        size: file.size,
        type: file.type,
        reason: validation.error
      });
      toast.error(validation.error);
      onUploadError(new Error(validation.error || 'File validation failed'));
      return;
    }

    try {
      logSecurityEvent('file_upload_started', {
        filename: file.name,
        size: file.size,
        type: file.type
      });

      const result = await uploadFile(file, { bucket, folder });
      
      logSecurityEvent('file_upload_completed', {
        filename: file.name,
        path: result.path
      });

      onUploadComplete(result);
      toast.success('File uploaded successfully');
    } catch (error) {
      logSecurityEvent('file_upload_failed', {
        filename: file.name,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      onUploadError(error as Error);
      toast.error('Failed to upload file');
    }
  }, [uploadFile, bucket, folder, onUploadComplete, onUploadError, checkUploadRateLimit, logSuspiciousActivity]);

  const { getRootProps, getInputProps, isDragActive, fileRejections } = useDropzone({
    onDrop,
    maxSize: 104857600, // 100MB
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/plain': ['.txt'],
      'application/vnd.ms-excel': ['.xls'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'image/*': ['.png', '.jpg', '.jpeg', '.gif']
    },
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
          <p className="text-blue-600">Drop your file here...</p>
        ) : (
          <div>
            <p className="text-gray-600 mb-2">
              Drag and drop a file here, or click to select
            </p>
            <p className="text-sm text-gray-500">
              Supports PDF, DOC, DOCX, TXT, XLS, XLSX, Images (max 100MB)
            </p>
            <p className="text-xs text-gray-400 mt-2">
              Files are scanned for security threats
            </p>
          </div>
        )}
      </div>

      {uploading && (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <File className="h-4 w-4" />
            <span className="text-sm">Uploading and scanning...</span>
            <span className="text-sm text-gray-500">{progress}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      )}

      {fileRejections.length > 0 && (
        <div className="text-red-600 text-sm space-y-2">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            <span className="font-medium">Security Alert: Files Rejected</span>
          </div>
          {fileRejections.map(({ file, errors }) => (
            <div key={file.name} className="ml-6">
              File {file.name}:
              {errors.map((error: any) => (
                <div key={error.code}>• {error.message}</div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
