
import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Upload, Download, CheckCircle, XCircle } from 'lucide-react';

interface UploadedFile {
  name: string;
  url: string;
  path: string;
  size: number;
}

const StorageTest = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setError(null);
    }
  };

  const uploadFile = async () => {
    if (!selectedFile) return;

    setUploading(true);
    setUploadProgress(0);
    setError(null);
    setSuccess(null);

    try {
      // Generate a unique filename
      const fileExt = selectedFile.name.split('.').pop();
      const fileName = `test_${Date.now()}.${fileExt}`;
      const filePath = `test-uploads/${fileName}`;

      console.log('Starting upload to documents bucket:', filePath);

      // Upload to documents bucket
      const { data, error: uploadError } = await supabase.storage
        .from('documents')
        .upload(filePath, selectedFile, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        console.error('Upload error:', uploadError);
        throw uploadError;
      }

      setUploadProgress(100);
      console.log('Upload successful:', data);

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('documents')
        .getPublicUrl(data.path);

      console.log('Public URL:', urlData.publicUrl);

      const uploadedFile: UploadedFile = {
        name: selectedFile.name,
        url: urlData.publicUrl,
        path: data.path,
        size: selectedFile.size
      };

      setUploadedFiles(prev => [...prev, uploadedFile]);
      setSuccess(`File "${selectedFile.name}" uploaded successfully!`);
      setSelectedFile(null);

      // Reset file input
      const fileInput = document.getElementById('file-input') as HTMLInputElement;
      if (fileInput) fileInput.value = '';

    } catch (error: any) {
      console.error('Upload failed:', error);
      setError(`Upload failed: ${error.message}`);
    } finally {
      setUploading(false);
    }
  };

  const downloadFile = (file: UploadedFile) => {
    window.open(file.url, '_blank');
  };

  const deleteFile = async (file: UploadedFile) => {
    try {
      const { error } = await supabase.storage
        .from('documents')
        .remove([file.path]);

      if (error) throw error;

      setUploadedFiles(prev => prev.filter(f => f.path !== file.path));
      setSuccess(`File "${file.name}" deleted successfully!`);
    } catch (error: any) {
      setError(`Delete failed: ${error.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">Storage Test Page</h1>
          <p className="text-gray-600 mt-2">Test file uploads to the 'documents' bucket</p>
        </div>

        {/* Upload Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="w-5 h-5" />
              File Upload Test
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <input
                id="file-input"
                type="file"
                onChange={handleFileSelect}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                accept=".pdf,.doc,.docx,.txt,.jpg,.png,.jpeg"
              />
            </div>

            {selectedFile && (
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-700">
                  Selected: <strong>{selectedFile.name}</strong> ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                </p>
              </div>
            )}

            {uploading && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm">Uploading...</span>
                </div>
                <Progress value={uploadProgress} className="h-2" />
              </div>
            )}

            <Button 
              onClick={uploadFile} 
              disabled={!selectedFile || uploading}
              className="w-full"
            >
              {uploading ? 'Uploading...' : 'Upload File'}
            </Button>

            {error && (
              <Alert variant="destructive">
                <XCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {success && (
              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>{success}</AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        {/* Uploaded Files Section */}
        {uploadedFiles.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Uploaded Files</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {uploadedFiles.map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">{file.name}</p>
                      <p className="text-sm text-gray-500">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                      <p className="text-xs text-gray-400 break-all">{file.url}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => downloadFile(file)}
                      >
                        <Download className="w-4 h-4 mr-1" />
                        Download
                      </Button>
                      <Button 
                        size="sm" 
                        variant="destructive"
                        onClick={() => deleteFile(file)}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Debug Info */}
        <Card>
          <CardHeader>
            <CardTitle>Debug Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <p><strong>Bucket:</strong> documents</p>
              <p><strong>Upload Path:</strong> test-uploads/</p>
              <p><strong>Bucket Type:</strong> Public</p>
              <p className="text-gray-600">Check browser console for detailed logs</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StorageTest;
