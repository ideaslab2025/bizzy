
import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Upload, File, AlertTriangle, Shield } from 'lucide-react';
import { useFileUpload } from '@/hooks/useFileUpload';
import { useSecurityMonitoring } from '@/hooks/useSecurityMonitoring';
import { validateFileUpload, logSecurityEvent } from '@/utils/security';
import { logger } from '@/utils/secureLogger';
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

  // Enhanced file validation with security checks
  const performSecurityScan = async (file: File): Promise<{ safe: boolean; reason?: string }> => {
    // Check file header/magic bytes for common file types
    const buffer = await file.slice(0, 16).arrayBuffer();
    const bytes = new Uint8Array(buffer);
    
    // Common file signatures
    const signatures = {
      pdf: [0x25, 0x50, 0x44, 0x46], // %PDF
      jpg: [0xFF, 0xD8, 0xFF],
      png: [0x89, 0x50, 0x4E, 0x47],
      gif: [0x47, 0x49, 0x46],
      zip: [0x50, 0x4B, 0x03, 0x04],
      docx: [0x50, 0x4B, 0x03, 0x04], // DOCX is a ZIP file
    };

    // Check if file content matches its extension
    const extension = file.name.split('.').pop()?.toLowerCase();
    if (extension === 'pdf') {
      const isValidPDF = bytes.slice(0, 4).every((byte, i) => byte === signatures.pdf[i]);
      if (!isValidPDF) {
        return { safe: false, reason: 'File content does not match PDF format' };
      }
    }

    // Check for embedded executables in files
    const suspiciousPatterns = [
      [0x4D, 0x5A], // PE executable header
      [0x7F, 0x45, 0x4C, 0x46], // ELF executable
    ];

    for (const pattern of suspiciousPatterns) {
      for (let i = 0; i <= bytes.length - pattern.length; i++) {
        if (pattern.every((byte, j) => bytes[i + j] === byte)) {
          return { safe: false, reason: 'File contains suspicious executable content' };
        }
      }
    }

    return { safe: true };
  };

  const onDrop = useCallback(async (acceptedFiles: File[], rejectedFiles: any[]) => {
    // Check rate limiting
    const userIdentifier = 'current-user';
    if (!checkUploadRateLimit(userIdentifier)) {
      logger.security('Upload rate limit exceeded', { userIdentifier });
      toast.error('Upload rate limit exceeded. Please wait before uploading again.');
      return;
    }

    // Log rejected files
    if (rejectedFiles.length > 0) {
      const rejectionReasons = rejectedFiles.map(f => ({
        fileName: f.file?.name,
        errors: f.errors.map((e: any) => e.message)
      }));
      
      logger.security('File upload rejected by dropzone', { 
        rejectedCount: rejectedFiles.length,
        rejectionReasons 
      });
      
      logSuspiciousActivity('File upload rejected', {
        rejectedCount: rejectedFiles.length,
        reasons: rejectionReasons
      });
    }

    const file = acceptedFiles[0];
    if (!file) return;

    try {
      // Basic validation
      const validation = validateFileUpload(file);
      if (!validation.isValid) {
        logger.security('File upload blocked by validation', {
          filename: file.name,
          size: file.size,
          type: file.type,
          reason: validation.error
        });
        
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

      // Enhanced security scan
      const securityScan = await performSecurityScan(file);
      if (!securityScan.safe) {
        logger.security('File upload blocked by security scan', {
          filename: file.name,
          reason: securityScan.reason
        });
        
        toast.error(`Security scan failed: ${securityScan.reason}`);
        onUploadError(new Error(securityScan.reason || 'Security scan failed'));
        return;
      }

      logger.audit('File upload started', {
        filename: file.name,
        size: file.size,
        type: file.type,
        bucket
      });

      logSecurityEvent('file_upload_started', {
        filename: file.name,
        size: file.size,
        type: file.type
      });

      const result = await uploadFile(file, { bucket, folder });
      
      logger.audit('File upload completed', {
        filename: file.name,
        path: result.path,
        bucket
      });

      logSecurityEvent('file_upload_completed', {
        filename: file.name,
        path: result.path
      });

      onUploadComplete(result);
      toast.success('File uploaded and verified successfully');
    } catch (error) {
      logger.error('File upload failed', {
        filename: file.name,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      
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
        <div className="flex flex-col items-center">
          <div className="flex items-center gap-2 mb-4">
            <Upload className="h-12 w-12 text-gray-400" />
            <Shield className="h-6 w-6 text-green-500" />
          </div>
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
              <p className="text-xs text-gray-400 mt-2 flex items-center justify-center gap-1">
                <Shield className="h-3 w-3" />
                Files are scanned for security threats and malware
              </p>
            </div>
          )}
        </div>
      </div>

      {uploading && (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <File className="h-4 w-4" />
            <span className="text-sm">Uploading and scanning...</span>
            <span className="text-sm text-gray-500">{progress}%</span>
          </div>
          <Progress value={progress} className="h-2" />
          <p className="text-xs text-gray-500 flex items-center gap-1">
            <Shield className="h-3 w-3" />
            Running security checks...
          </p>
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
