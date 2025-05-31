
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { FileUploadComponent } from '@/components/documents/FileUploadComponent';
import { useDocumentDownload } from '@/hooks/useDocumentDownload';
import { toast } from 'sonner';
import { Upload, Download, CheckCircle, AlertTriangle } from 'lucide-react';

export const TestUploadFlow = () => {
  const { downloadDocument, downloading } = useDocumentDownload();
  const [testResults, setTestResults] = useState<{
    upload: 'pending' | 'success' | 'error';
    download: 'pending' | 'success' | 'error';
    uploadedFile?: { path: string; url: string };
  }>({
    upload: 'pending',
    download: 'pending'
  });

  const handleTestUpload = async (result: { path: string; url: string; fullPath: string }) => {
    try {
      setTestResults(prev => ({
        ...prev,
        upload: 'success',
        uploadedFile: result
      }));
      toast.success('Test upload successful!');
    } catch (error) {
      setTestResults(prev => ({ ...prev, upload: 'error' }));
      toast.error('Test upload failed');
    }
  };

  const handleTestDownload = async () => {
    if (!testResults.uploadedFile) {
      toast.error('No test file to download');
      return;
    }

    try {
      // Create a temporary download using the uploaded file URL
      const response = await fetch(testResults.uploadedFile.url);
      if (!response.ok) throw new Error('Download failed');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'test-document.pdf';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      setTestResults(prev => ({ ...prev, download: 'success' }));
      toast.success('Test download successful!');
    } catch (error) {
      setTestResults(prev => ({ ...prev, download: 'error' }));
      toast.error('Test download failed');
    }
  };

  const resetTest = () => {
    setTestResults({
      upload: 'pending',
      download: 'pending'
    });
  };

  const getStatusIcon = (status: 'pending' | 'success' | 'error') => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'error':
        return <AlertTriangle className="w-5 h-5 text-red-500" />;
      default:
        return <div className="w-5 h-5 rounded-full border-2 border-gray-300" />;
    }
  };

  const getStatusBadge = (status: 'pending' | 'success' | 'error') => {
    switch (status) {
      case 'success':
        return <Badge className="bg-green-100 text-green-800">Success</Badge>;
      case 'error':
        return <Badge variant="destructive">Error</Badge>;
      default:
        return <Badge variant="outline">Pending</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="w-5 h-5" />
          Test Complete Flow
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Test Steps */}
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-3">
              {getStatusIcon(testResults.upload)}
              <div>
                <h4 className="font-medium">1. Upload Test Document</h4>
                <p className="text-sm text-gray-600">Upload a test file to verify storage</p>
              </div>
            </div>
            {getStatusBadge(testResults.upload)}
          </div>

          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-3">
              {getStatusIcon(testResults.download)}
              <div>
                <h4 className="font-medium">2. Download Test Document</h4>
                <p className="text-sm text-gray-600">Verify the uploaded file can be downloaded</p>
              </div>
            </div>
            {getStatusBadge(testResults.download)}
          </div>
        </div>

        {/* Upload Section */}
        {testResults.upload === 'pending' && (
          <div className="space-y-4">
            <h4 className="font-medium">Step 1: Upload a test document</h4>
            <FileUploadComponent
              onUploadComplete={handleTestUpload}
              onUploadError={(error) => {
                setTestResults(prev => ({ ...prev, upload: 'error' }));
                toast.error('Upload failed: ' + error.message);
              }}
              bucket="documents"
              folder="test"
              acceptedTypes={{
                'application/pdf': ['.pdf'],
                'text/plain': ['.txt']
              }}
            />
          </div>
        )}

        {/* Download Section */}
        {testResults.upload === 'success' && testResults.download === 'pending' && (
          <div className="space-y-4">
            <h4 className="font-medium">Step 2: Test download functionality</h4>
            <Button 
              onClick={handleTestDownload}
              disabled={downloading !== null}
              className="w-full"
            >
              <Download className="w-4 h-4 mr-2" />
              {downloading ? 'Downloading...' : 'Test Download'}
            </Button>
          </div>
        )}

        {/* Results */}
        {testResults.upload === 'success' && testResults.download === 'success' && (
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-2 text-green-600">
              <CheckCircle className="w-6 h-6" />
              <span className="text-lg font-medium">All tests passed!</span>
            </div>
            <p className="text-gray-600">
              Storage upload and download functionality is working correctly.
            </p>
            <Button onClick={resetTest} variant="outline">
              Run Test Again
            </Button>
          </div>
        )}

        {/* Test Info */}
        {testResults.uploadedFile && (
          <div className="bg-gray-50 p-4 rounded-lg">
            <h5 className="font-medium mb-2">Test File Details</h5>
            <div className="space-y-1 text-sm">
              <div><strong>Path:</strong> {testResults.uploadedFile.path}</div>
              <div><strong>URL:</strong> {testResults.uploadedFile.url.substring(0, 50)}...</div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
