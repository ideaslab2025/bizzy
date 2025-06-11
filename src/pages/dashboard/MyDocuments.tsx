
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PullToRefresh } from '@/components/ui/pull-to-refresh';
import { UserFileUpload } from '@/components/documents/UserFileUpload';
import { UserFilesList } from '@/components/documents/UserFilesList';
import { Upload, FolderOpen } from 'lucide-react';
import { toast } from 'sonner';

const MyDocuments = () => {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleUploadComplete = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  const handleRefresh = async () => {
    setRefreshTrigger(prev => prev + 1);
    toast.success('Files refreshed');
  };

  return (
    <PullToRefresh onRefresh={handleRefresh}>
      <div className="space-y-6">
        <div className="px-0">
          <div className="flex items-center gap-3 mb-3">
            <FolderOpen className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">My Documents</h1>
          </div>
        </div>

        {/* Upload Section - Always Visible */}
        <div className="px-0">
          <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="text-lg text-gray-900 dark:text-white flex items-center gap-3">
                <Upload className="w-5 h-5" />
                Upload New File
              </CardTitle>
            </CardHeader>
            <CardContent>
              <UserFileUpload onUploadComplete={handleUploadComplete} />
            </CardContent>
          </Card>
        </div>

        {/* Files List with improved mobile layout */}
        <div className="px-0">
          <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="text-lg text-gray-900 dark:text-white">Your Files</CardTitle>
            </CardHeader>
            <CardContent className="p-4 md:p-6">
              <UserFilesList refreshTrigger={refreshTrigger} />
            </CardContent>
          </Card>
        </div>
      </div>
    </PullToRefresh>
  );
};

export default MyDocuments;
