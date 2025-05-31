
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface StorageStats {
  totalFiles: number;
  totalSize: number;
  filesByType: Record<string, number>;
  bucketStats: {
    documents: { files: number; size: number };
    userFiles: { files: number; size: number };
  };
}

export const useStorageMonitoring = () => {
  const [stats, setStats] = useState<StorageStats>({
    totalFiles: 0,
    totalSize: 0,
    filesByType: {},
    bucketStats: {
      documents: { files: 0, size: 0 },
      userFiles: { files: 0, size: 0 }
    }
  });
  const [loading, setLoading] = useState(true);

  const fetchStorageStats = async () => {
    try {
      setLoading(true);

      // Get all files from both buckets
      const [documentsResponse, userFilesResponse] = await Promise.all([
        supabase.storage.from('documents').list(),
        supabase.storage.from('user-files').list()
      ]);

      const documentFiles = documentsResponse.data || [];
      const userFiles = userFilesResponse.data || [];
      
      const allFiles = [
        ...documentFiles.map(f => ({ ...f, bucket: 'documents' })),
        ...userFiles.map(f => ({ ...f, bucket: 'user-files' }))
      ];

      const totalFiles = allFiles.length;
      const totalSize = allFiles.reduce((sum, file) => sum + (file.metadata?.size || 0), 0);
      
      const filesByType: Record<string, number> = {};
      allFiles.forEach(file => {
        const ext = file.name.split('.').pop()?.toLowerCase() || 'unknown';
        filesByType[ext] = (filesByType[ext] || 0) + 1;
      });

      const bucketStats = {
        documents: {
          files: documentFiles.length,
          size: documentFiles.reduce((sum, file) => sum + (file.metadata?.size || 0), 0)
        },
        userFiles: {
          files: userFiles.length,
          size: userFiles.reduce((sum, file) => sum + (file.metadata?.size || 0), 0)
        }
      };

      setStats({
        totalFiles,
        totalSize,
        filesByType,
        bucketStats
      });
    } catch (error) {
      console.error('Error fetching storage stats:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStorageStats();
  }, []);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return {
    stats,
    loading,
    refresh: fetchStorageStats,
    formatFileSize
  };
};
