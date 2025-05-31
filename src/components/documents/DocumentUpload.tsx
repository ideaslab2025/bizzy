
import React, { useState } from 'react';
import { useFileUpload } from '@/hooks/useFileUpload';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Upload, CheckCircle, XCircle } from 'lucide-react';
import { toast } from 'sonner';

interface DocumentUploadProps {
  onUploadSuccess?: (url: string, path: string) => void;
  onUploadError?: (error: string) => void;
}

export const DocumentUpload: React.FC<DocumentUploadProps> = ({
  onUploadSuccess,
  onUploadError
}) => {
  const { uploadFile, uploading, progress } = useFileUpload();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setError(null);
      setSuccess(null);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setError(null);
    setSuccess(null);

    try {
      const result = await uploadFile(selectedFile, {
        bucket: 'documents',
        folder: 'templates'
      });

      setSuccess(`File "${selectedFile.name}" uploaded successfully!`);
      toast.success('Document uploaded successfully');
      
      if (onUploadSuccess) {
        onUploadSuccess(result.url, result.path);
      }

      // Reset form
      setSelectedFile(null);
      const fileInput = document.getElementById('document-upload-input') as HTMLInputElement;
      if (fileInput) fileInput.value = '';

    } catch (error: any) {
      const errorMessage = `Upload failed: ${error.message}`;
      setError(errorMessage);
      toast.error('Upload failed');
      
      if (onUploadError) {
        onUploadError(errorMessage);
      }
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="w-5 h-5" />
          Upload Document Template
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <input
            id="document-upload-input"
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
              <span className="text-sm text-gray-500">{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        )}

        <Button 
          onClick={handleUpload} 
          disabled={!selectedFile || uploading}
          className="w-full"
        >
          {uploading ? 'Uploading...' : 'Upload Document'}
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
  );
};
