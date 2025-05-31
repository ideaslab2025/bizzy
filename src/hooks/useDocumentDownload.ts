
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

export const useDocumentDownload = () => {
  const { user } = useAuth();
  const [downloading, setDownloading] = useState<string | null>(null);

  const downloadDocument = async (documentId: string, templateUrl?: string) => {
    if (!user) {
      toast.error('Please sign in to download documents');
      return;
    }

    setDownloading(documentId);

    try {
      let downloadUrl = templateUrl;

      // If no template URL, try to get from storage
      if (!downloadUrl) {
        const { data, error } = await supabase.storage
          .from('documents')
          .createSignedUrl(`templates/${documentId}`, 3600);

        if (error) {
          toast.error('Document not found');
          return;
        }

        downloadUrl = data.signedUrl;
      }

      // Track download
      await supabase
        .from('user_document_progress')
        .upsert({
          user_id: user.id,
          document_id: documentId,
          downloaded: true,
          viewed: true
        });

      // Download file
      const response = await fetch(downloadUrl);
      if (!response.ok) {
        throw new Error('Download failed');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `document-${documentId}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast.success('Document downloaded successfully');
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Failed to download document');
    } finally {
      setDownloading(null);
    }
  };

  const getDownloadCount = async (documentId: string) => {
    try {
      const { count, error } = await supabase
        .from('user_document_progress')
        .select('*', { count: 'exact', head: true })
        .eq('document_id', documentId)
        .eq('downloaded', true);

      if (error) throw error;
      return count || 0;
    } catch (error) {
      console.error('Error getting download count:', error);
      return 0;
    }
  };

  return {
    downloadDocument,
    getDownloadCount,
    downloading
  };
};
