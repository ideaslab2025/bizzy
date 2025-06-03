
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Button } from '@/components/ui/button';
import { PullToRefresh } from '@/components/ui/pull-to-refresh';
import { UserFileUpload } from '@/components/documents/UserFileUpload';
import { UserFilesList } from '@/components/documents/UserFilesList';
import { Upload, ChevronDown, FolderOpen } from 'lucide-react';
import { toast } from 'sonner';

const MyDocuments = () => {
  const [showUpload, setShowUpload] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleUploadComplete = () => {
    setRefreshTrigger(prev => prev + 1);
    setShowUpload(false);
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
          <p className="text-gray-600 dark:text-gray-400 text-base">
            Upload and manage your personal files securely
          </p>
        </div>

        {/* Upload Section with better mobile touch targets */}
        <div className="px-0">
          <Collapsible open={showUpload} onOpenChange={setShowUpload}>
            <CollapsibleTrigger asChild>
              <Button 
                variant="outline" 
                className="w-full mb-4 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 min-h-[52px] text-base py-4"
              >
                <Upload className="w-5 h-5 mr-3" />
                Upload New File
                <ChevronDown className={`w-5 h-5 ml-3 transition-transform ${showUpload ? 'rotate-180' : ''}`} />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="mb-6">
              <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                <CardHeader>
                  <CardTitle className="text-lg text-gray-900 dark:text-white">Upload File</CardTitle>
                </CardHeader>
                <CardContent>
                  <UserFileUpload onUploadComplete={handleUploadComplete} />
                </CardContent>
              </Card>
            </CollapsibleContent>
          </Collapsible>
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
