import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useFileUpload } from '@/hooks/useFileUpload';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Upload, Download, CheckCircle, XCircle, FileText, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import type { Document } from '@/types/documents';

const AdminDocuments = () => {
  const { user } = useAuth();
  const { uploadFile, uploading, progress } = useFileUpload();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploadingDocId, setUploadingDocId] = useState<string | null>(null);
  const [bulkUploading, setBulkUploading] = useState(false);
  const [bulkFiles, setBulkFiles] = useState<FileList | null>(null);
  const [matchResults, setMatchResults] = useState<{ matched: any[], unmatched: string[] }>({ matched: [], unmatched: [] });

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .order('category', { ascending: true })
        .order('title', { ascending: true });

      if (error) throw error;
      setDocuments(data || []);
    } catch (error) {
      console.error('Error fetching documents:', error);
      toast.error('Failed to load documents');
    } finally {
      setLoading(false);
    }
  };

  const handleSingleUpload = async (document: Document, file: File) => {
    if (!user) return;

    setUploadingDocId(document.id);
    
    try {
      const result = await uploadFile(file, {
        bucket: 'documents',
        folder: 'templates'
      });

      // Update document with storage URL
      const { error } = await supabase
        .from('documents')
        .update({ template_url: result.url })
        .eq('id', document.id);

      if (error) throw error;

      await fetchDocuments(); // Refresh list
      toast.success(`File uploaded for "${document.title}"`);
    } catch (error: any) {
      console.error('Upload error:', error);
      toast.error(`Upload failed: ${error.message}`);
    } finally {
      setUploadingDocId(null);
    }
  };

  const handleFileSelect = (documentId: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const document = documents.find(d => d.id === documentId);
      if (document) {
        handleSingleUpload(document, file);
      }
    }
    // Reset input
    event.target.value = '';
  };

  const handleBulkFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      setBulkFiles(files);
      matchFilesToDocuments(files);
    }
  };

  const matchFilesToDocuments = (files: FileList) => {
    const matched: any[] = [];
    const unmatched: string[] = [];

    Array.from(files).forEach(file => {
      const fileName = file.name.toLowerCase().replace(/\.(pdf|docx?|txt)$/i, '');
      
      const matchedDoc = documents.find(doc => {
        const docTitle = doc.title.toLowerCase();
        return docTitle.includes(fileName) || fileName.includes(docTitle);
      });

      if (matchedDoc) {
        matched.push({ file, document: matchedDoc });
      } else {
        unmatched.push(file.name);
      }
    });

    setMatchResults({ matched, unmatched });
  };

  const handleBulkUpload = async () => {
    if (!matchResults.matched.length) return;

    setBulkUploading(true);
    let successCount = 0;
    let failCount = 0;

    for (const { file, document } of matchResults.matched) {
      try {
        await handleSingleUpload(document, file);
        successCount++;
      } catch (error) {
        failCount++;
      }
    }

    setBulkUploading(false);
    setBulkFiles(null);
    setMatchResults({ matched: [], unmatched: [] });
    
    toast.success(`Bulk upload complete: ${successCount} successful, ${failCount} failed`);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Admin - Document Management</h1>
          <div className="flex items-center justify-center h-64">
            <div className="text-gray-500 dark:text-gray-400">Loading documents...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Admin - Document Management</h1>
          <div className="flex gap-3">
            <label htmlFor="bulk-upload" className="cursor-pointer">
              <Button variant="outline" asChild>
                <span>
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Multiple Files
                </span>
              </Button>
            </label>
            <input
              id="bulk-upload"
              type="file"
              multiple
              accept=".pdf,.doc,.docx,.txt"
              onChange={handleBulkFileSelect}
              className="hidden"
            />
          </div>
        </div>

        {/* Bulk Upload Results */}
        {bulkFiles && (
          <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="text-gray-900 dark:text-white">Bulk Upload Results</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {matchResults.matched.length > 0 && (
                <div>
                  <h3 className="font-medium text-green-800 dark:text-green-400 mb-2">
                    Matched Files ({matchResults.matched.length})
                  </h3>
                  <div className="space-y-2">
                    {matchResults.matched.map((match, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-green-50 dark:bg-green-900/20 rounded border border-green-200 dark:border-green-800">
                        <span className="text-sm text-gray-900 dark:text-white">
                          <strong>{match.file.name}</strong> → {match.document.title}
                        </span>
                        <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {matchResults.unmatched.length > 0 && (
                <div>
                  <h3 className="font-medium text-red-800 dark:text-red-400 mb-2">
                    Unmatched Files ({matchResults.unmatched.length})
                  </h3>
                  <div className="space-y-1">
                    {matchResults.unmatched.map((fileName, index) => (
                      <div key={index} className="flex items-center gap-2 p-2 bg-red-50 dark:bg-red-900/20 rounded border border-red-200 dark:border-red-800">
                        <XCircle className="w-4 h-4 text-red-600 dark:text-red-400" />
                        <span className="text-sm text-gray-900 dark:text-white">{fileName}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                <Button 
                  onClick={handleBulkUpload}
                  disabled={!matchResults.matched.length || bulkUploading}
                >
                  {bulkUploading ? 'Uploading...' : `Upload ${matchResults.matched.length} Files`}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setBulkFiles(null);
                    setMatchResults({ matched: [], unmatched: [] });
                  }}
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Documents Table */}
        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
              <FileText className="w-5 h-5" />
              Documents ({documents.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="border-gray-200 dark:border-gray-700">
                  <TableHead className="text-gray-700 dark:text-gray-300">Title</TableHead>
                  <TableHead className="text-gray-700 dark:text-gray-300">Category</TableHead>
                  <TableHead className="text-gray-700 dark:text-gray-300">Status</TableHead>
                  <TableHead className="text-gray-700 dark:text-gray-300">File Size</TableHead>
                  <TableHead className="text-gray-700 dark:text-gray-300">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {documents.map((document) => (
                  <TableRow key={document.id} className="border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                    <TableCell>
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">{document.title}</div>
                        {document.description && (
                          <div className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1">
                            {document.description}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300">{document.category}</Badge>
                      {document.is_required && (
                        <Badge variant="outline" className="ml-1 text-red-600 dark:text-red-400 border-red-300 dark:border-red-600">
                          Required
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {document.template_url ? (
                        <Badge className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 border-green-200 dark:border-green-800">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Available
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-gray-600 dark:text-gray-400 border-gray-300 dark:border-gray-600">
                          <AlertTriangle className="w-3 h-3 mr-1" />
                          Missing
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-gray-700 dark:text-gray-300">
                      {document.file_size ? formatFileSize(document.file_size) : '-'}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {uploadingDocId === document.id ? (
                          <div className="flex items-center gap-2">
                            <Progress value={progress} className="w-20 h-2" />
                            <span className="text-xs text-gray-600 dark:text-gray-400">{progress}%</span>
                          </div>
                        ) : (
                          <>
                            <label htmlFor={`upload-${document.id}`} className="cursor-pointer">
                              <Button size="sm" variant="outline" asChild>
                                <span>
                                  <Upload className="w-3 h-3 mr-1" />
                                  Upload
                                </span>
                              </Button>
                            </label>
                            <input
                              id={`upload-${document.id}`}
                              type="file"
                              accept=".pdf,.doc,.docx,.txt"
                              onChange={(e) => handleFileSelect(document.id, e)}
                              className="hidden"
                            />
                            {document.template_url && (
                              <Button 
                                size="sm" 
                                variant="ghost"
                                onClick={() => window.open(document.template_url, '_blank')}
                              >
                                <Download className="w-3 h-3 mr-1" />
                                View
                              </Button>
                            )}
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{documents.length}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Total Documents</div>
            </CardContent>
          </Card>
          <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {documents.filter(d => d.template_url).length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">With Files</div>
            </CardContent>
          </Card>
          <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                {documents.filter(d => !d.template_url).length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Missing Files</div>
            </CardContent>
          </Card>
          <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {documents.filter(d => d.is_required).length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Required</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminDocuments;
