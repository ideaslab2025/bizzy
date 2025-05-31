
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useDocumentStorage } from '@/hooks/useDocumentStorage';
import { FileUploadComponent } from '@/components/documents/FileUploadComponent';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Upload, FileText, CheckCircle, AlertCircle, Trash2 } from 'lucide-react';
import type { Document } from '@/types/documents';

interface UploadProgress {
  [key: string]: number;
}

const AdminDocumentUpload = () => {
  const { user } = useAuth();
  const { uploadDocumentTemplate, loading } = useDocumentStorage();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [uploading, setUploading] = useState<UploadProgress>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [bulkFiles, setBulkFiles] = useState<File[]>([]);
  const [bulkUploading, setBulkUploading] = useState(false);

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .order('title');

      if (error) throw error;
      setDocuments(data || []);
    } catch (error) {
      console.error('Error fetching documents:', error);
      toast.error('Failed to load documents');
    }
  };

  const handleFileUpload = async (documentId: string, file: File) => {
    setUploading(prev => ({ ...prev, [documentId]: 0 }));

    try {
      const result = await uploadDocumentTemplate(file, documentId);
      
      setUploading(prev => ({ ...prev, [documentId]: 100 }));
      toast.success(`Template uploaded for ${documents.find(d => d.id === documentId)?.title}`);
      
      // Refresh documents to show updated template_url
      await fetchDocuments();
      
      // Clear progress after 2 seconds
      setTimeout(() => {
        setUploading(prev => {
          const updated = { ...prev };
          delete updated[documentId];
          return updated;
        });
      }, 2000);
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload template');
      setUploading(prev => {
        const updated = { ...prev };
        delete updated[documentId];
        return updated;
      });
    }
  };

  const handleBulkUpload = async () => {
    if (bulkFiles.length === 0) return;

    setBulkUploading(true);
    let successCount = 0;
    let failCount = 0;

    for (const file of bulkFiles) {
      try {
        // Try to match filename to document title
        const matchedDoc = documents.find(doc => 
          file.name.toLowerCase().includes(doc.title.toLowerCase().substring(0, 10))
        );

        if (matchedDoc) {
          await uploadDocumentTemplate(file, matchedDoc.id);
          successCount++;
        } else {
          failCount++;
        }
      } catch (error) {
        failCount++;
      }
    }

    setBulkUploading(false);
    setBulkFiles([]);
    await fetchDocuments();
    
    toast.success(`Bulk upload complete: ${successCount} successful, ${failCount} failed`);
  };

  const deleteTemplate = async (documentId: string) => {
    try {
      const { error } = await supabase
        .from('documents')
        .update({ template_url: null })
        .eq('id', documentId);

      if (error) throw error;
      
      await fetchDocuments();
      toast.success('Template removed');
    } catch (error) {
      console.error('Error removing template:', error);
      toast.error('Failed to remove template');
    }
  };

  const filteredDocuments = documents.filter(doc =>
    doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doc.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const documentsWithTemplates = documents.filter(doc => doc.template_url).length;
  const totalDocuments = documents.length;

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Document Template Management</h1>
          <p className="text-gray-600 mt-2">
            Upload and manage document templates for the platform
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-sm text-gray-600">
            {documentsWithTemplates}/{totalDocuments} documents have templates
          </div>
          <Progress 
            value={(documentsWithTemplates / totalDocuments) * 100} 
            className="w-32"
          />
        </div>
      </div>

      {/* Bulk Upload Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="w-5 h-5" />
            Bulk Upload
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
              <input
                type="file"
                multiple
                accept=".pdf,.doc,.docx,.txt,.xls,.xlsx"
                onChange={(e) => setBulkFiles(Array.from(e.target.files || []))}
                className="w-full"
              />
            </div>
            {bulkFiles.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm text-gray-600">
                  {bulkFiles.length} files selected for bulk upload
                </p>
                <Button 
                  onClick={handleBulkUpload}
                  disabled={bulkUploading}
                  className="w-full"
                >
                  {bulkUploading ? 'Uploading...' : 'Upload All Files'}
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Search and Filter */}
      <div className="flex gap-4">
        <Input
          placeholder="Search documents..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-md"
        />
      </div>

      {/* Documents List */}
      <div className="grid gap-4">
        {filteredDocuments.map((document) => (
          <Card key={document.id}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <FileText className="w-5 h-5 text-gray-400" />
                    <h3 className="font-semibold">{document.title}</h3>
                    <Badge variant={document.is_required ? "destructive" : "secondary"}>
                      {document.is_required ? "Required" : "Optional"}
                    </Badge>
                    <Badge variant="outline">{document.category}</Badge>
                    {document.template_url && (
                      <Badge className="bg-green-100 text-green-800">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Template Uploaded
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{document.description}</p>
                  
                  {uploading[document.id] !== undefined && (
                    <div className="mb-3">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <span>Uploading...</span>
                        <span>{uploading[document.id]}%</span>
                      </div>
                      <Progress value={uploading[document.id]} className="h-2 mt-1" />
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {document.template_url && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(document.template_url!, '_blank')}
                    >
                      View
                    </Button>
                  )}
                  
                  <FileUploadComponent
                    onUploadComplete={(result) => {
                      handleFileUpload(document.id, new File([], ''));
                    }}
                    onUploadError={(error) => {
                      console.error('Upload error:', error);
                      toast.error('Upload failed');
                    }}
                    bucket="documents"
                    folder="templates"
                    className="inline-block"
                  />

                  {document.template_url && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => deleteTemplate(document.id)}
                      className="text-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AdminDocumentUpload;
