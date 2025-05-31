
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useFileUpload } from '@/hooks/useFileUpload';

export const useDocumentStorage = () => {
  const { user } = useAuth();
  const { uploadFile, deleteFile } = useFileUpload();
  const [loading, setLoading] = useState(false);

  const uploadDocumentTemplate = async (file: File, documentId: string) => {
    if (!user) throw new Error('User must be authenticated');

    setLoading(true);
    try {
      // Upload to documents bucket (public)
      const result = await uploadFile(file, {
        bucket: 'documents',
        folder: 'templates'
      });

      // Update document record with template URL
      const { error } = await supabase
        .from('documents')
        .update({ template_url: result.url })
        .eq('id', documentId);

      if (error) throw error;

      return result;
    } finally {
      setLoading(false);
    }
  };

  const uploadUserDocument = async (file: File, documentId: string, customizedData?: any) => {
    if (!user) throw new Error('User must be authenticated');

    setLoading(true);
    try {
      // Upload to user-files bucket (private)
      const result = await uploadFile(file, {
        bucket: 'user-files',
        folder: `documents/${documentId}`
      });

      // Create or update user document record
      const { data, error } = await supabase
        .from('user_documents')
        .upsert({
          user_id: user.id,
          document_id: documentId,
          file_url: result.url,
          customized_data: customizedData || {},
          status: 'completed'
        });

      if (error) throw error;

      // Update progress
      await supabase
        .from('user_document_progress')
        .upsert({
          user_id: user.id,
          document_id: documentId,
          completed_at: new Date().toISOString(),
          customized: !!customizedData
        });

      return { userDocument: data, uploadResult: result };
    } finally {
      setLoading(false);
    }
  };

  const getDocumentUrl = async (bucket: 'documents' | 'user-files', path: string) => {
    if (bucket === 'documents') {
      // Public URL for documents
      const { data } = supabase.storage
        .from(bucket)
        .getPublicUrl(path);
      return data.publicUrl;
    } else {
      // Signed URL for user files
      const { data, error } = await supabase.storage
        .from(bucket)
        .createSignedUrl(path, 60 * 60 * 24); // 24 hours
      
      if (error) throw error;
      return data.signedUrl;
    }
  };

  return {
    uploadDocumentTemplate,
    uploadUserDocument,
    getDocumentUrl,
    deleteFile,
    loading
  };
};
