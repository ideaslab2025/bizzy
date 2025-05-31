
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

interface UserUploadedFile {
  id: string;
  user_id: string;
  filename: string;
  original_filename: string;
  file_path: string;
  file_size: number;
  file_type: string;
  uploaded_at: string;
}

export const useUserFiles = () => {
  const { user } = useAuth();
  const [files, setFiles] = useState<UserUploadedFile[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUserFiles = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_uploaded_files')
        .select('*')
        .eq('user_id', user.id)
        .order('uploaded_at', { ascending: false });

      if (error) throw error;
      setFiles(data || []);
    } catch (error) {
      console.error('Error fetching user files:', error);
      toast.error('Failed to load your files');
    } finally {
      setLoading(false);
    }
  };

  const deleteFile = async (fileId: string, filePath: string) => {
    if (!user) return;

    try {
      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from('user-files')
        .remove([filePath]);

      if (storageError) throw storageError;

      // Delete from database
      const { error: dbError } = await supabase
        .from('user_uploaded_files')
        .delete()
        .eq('id', fileId)
        .eq('user_id', user.id);

      if (dbError) throw dbError;

      // Update local state
      setFiles(prev => prev.filter(file => file.id !== fileId));
      toast.success('File deleted successfully');
    } catch (error) {
      console.error('Error deleting file:', error);
      toast.error('Failed to delete file');
    }
  };

  const downloadFile = async (filePath: string, filename: string) => {
    try {
      const { data, error } = await supabase.storage
        .from('user-files')
        .createSignedUrl(filePath, 60 * 60); // 1 hour expiry

      if (error) throw error;

      // Download the file
      const link = document.createElement('a');
      link.href = data.signedUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error downloading file:', error);
      toast.error('Failed to download file');
    }
  };

  useEffect(() => {
    fetchUserFiles();
  }, [user]);

  return {
    files,
    loading,
    deleteFile,
    downloadFile,
    refetch: fetchUserFiles
  };
};
