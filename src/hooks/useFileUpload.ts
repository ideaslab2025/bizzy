
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface UploadOptions {
  bucket: 'documents' | 'user-files';
  folder?: string;
  onProgress?: (progress: number) => void;
}

export const useFileUpload = () => {
  const { user } = useAuth();
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const uploadFile = async (file: File, options: UploadOptions) => {
    if (!user) {
      throw new Error('User must be authenticated to upload files');
    }

    setUploading(true);
    setProgress(0);

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = options.folder 
        ? `${options.folder}/${fileName}`
        : options.bucket === 'user-files' 
          ? `${user.id}/${fileName}`
          : fileName;

      const { data, error } = await supabase.storage
        .from(options.bucket)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        throw error;
      }

      // Get public URL for documents bucket, signed URL for user-files
      let publicUrl;
      if (options.bucket === 'documents') {
        const { data: urlData } = supabase.storage
          .from(options.bucket)
          .getPublicUrl(data.path);
        publicUrl = urlData.publicUrl;
      } else {
        const { data: urlData, error: urlError } = await supabase.storage
          .from(options.bucket)
          .createSignedUrl(data.path, 60 * 60 * 24 * 7); // 7 days
        
        if (urlError) throw urlError;
        publicUrl = urlData.signedUrl;
      }

      setProgress(100);
      return {
        path: data.path,
        url: publicUrl,
        fullPath: data.fullPath
      };

    } catch (error) {
      console.error('Upload error:', error);
      throw error;
    } finally {
      setUploading(false);
    }
  };

  const deleteFile = async (bucket: 'documents' | 'user-files', path: string) => {
    if (!user) {
      throw new Error('User must be authenticated to delete files');
    }

    const { error } = await supabase.storage
      .from(bucket)
      .remove([path]);

    if (error) {
      throw error;
    }
  };

  return {
    uploadFile,
    deleteFile,
    uploading,
    progress
  };
};
