
import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Upload, File, X } from 'lucide-react';
import { useFileUpload } from '@/hooks/useFileUpload';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface UserFileUploadProps {
  onUploadComplete: () => void;
  className?: string;
}

export const UserFileUpload: React.FC<UserFileUploadProps> = ({
  onUploadComplete,
  className
}) => {
  const { uploadFile, uploading, progress } = useFileUpload();
  const { user } = useAuth();

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file || !user) return;

    try {
      const result = await uploadFile(file, { 
        bucket: 'user-files',
        folder: user.id
      });

      // Save file info to database
      const { error } = await supabase
        .from('user_uploaded_files')
        .insert({
          user_id: user.id,
          filename: result.path.split('/').pop() || file.name,
          original_filename: file.name,
          file_path: result.path,
          file_size: file.size,
          file_type: file.type || 'application/octet-stream'
        });

      if (error) throw error;

      toast.success('File uploaded successfully');
      onUploadComplete();
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload file');
    }
  }, [uploadFile, user, onUploadComplete]);

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
          </div>
        )}
      </div>

      {uploading && (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <File className="h-4 w-4" />
            <span className="text-sm">Uploading...</span>
            <span className="text-sm text-gray-500">{progress}%</span>
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
