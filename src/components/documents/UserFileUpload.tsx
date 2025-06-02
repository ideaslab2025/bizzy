
import React from 'react';
import { SecureFileUpload } from '@/components/documents/SecureFileUpload';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface UserFileUploadProps {
  onUploadComplete: () => void;
  className?: string;
}

export const UserFileUpload: React.FC<UserFileUploadProps> = ({
  onUploadComplete,
  className
}) => {
  const { user } = useAuth();

  const handleUploadComplete = async (result: { path: string; url: string; fullPath: string }) => {
    if (!user) return;

    try {
      // Save file info to database
      const { error } = await supabase
        .from('user_uploaded_files')
        .insert({
          user_id: user.id,
          filename: result.path.split('/').pop() || 'unknown',
          original_filename: result.path.split('/').pop() || 'unknown',
          file_path: result.path,
          file_size: 0, // Size is validated before upload
          file_type: 'application/octet-stream'
        });

      if (error) throw error;

      toast.success('File uploaded successfully');
      onUploadComplete();
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to save file information');
    }
  };

  const handleUploadError = (error: Error) => {
    console.error('Upload error:', error);
    toast.error('Failed to upload file');
  };

  return (
    <SecureFileUpload
      onUploadComplete={handleUploadComplete}
      onUploadError={handleUploadError}
      bucket="user-files"
      folder={user?.id}
      className={className}
    />
  );
};
