import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight, Download, Save, FileText, CheckCircle, Eye, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import type { Document, CustomField } from '@/types/documents';
import { cn } from '@/lib/utils';

const DocumentCustomizer: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [documentData, setDocumentData] = useState<Document | null>(null);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [preview, setPreview] = useState('');

  const steps = [
    { title: 'Document Info', description: 'Review document details' },
    { title: 'Fill Details', description: 'Customize your information' },
    { title: 'Preview', description: 'Review your document' },
    { title: 'Download', description: 'Save and download' }
  ];

  useEffect(() => {
    if (id) {
      loadDocument();
      loadExistingCustomization();
    }
  }, [id]);

  // Auto-save functionality
  useEffect(() => {
    const timer = setTimeout(() => {
      if (Object.keys(formData).length > 0 && user && documentData) {
        saveDraft();
      }
    }, 2000);
    return () => clearTimeout(timer);
  }, [formData]);

  const loadDocument = async () => {
    try {
      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      setDocumentData(data);
      
      // Pre-fill with user profile data
      await prefillFromProfile();
    } catch (error) {
      console.error('Error loading document:', error);
      toast.error('Failed to load document');
    } finally {
      setLoading(false);
    }
  };

  const loadExistingCustomization = async () => {
    if (!user || !id) return;

    try {
      const { data } = await supabase
        .from('user_documents')
        .select('customized_data')
        .eq('user_id', user.id)
        .eq('document_id', id)
        .eq('status', 'draft')
        .single();

      if (data?.customized_data) {
        setFormData(data.customized_data as Record<string, any>);
      }
    } catch (error) {
      // No existing draft found, which is fine
    }
  };

  const prefillFromProfile = async () => {
    if (!user) return;

    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profile) {
        const prefillData: Record<string, any> = {};
        
        // Common mappings
        if (profile.company_name) prefillData.company_name = profile.company_name;
        if (profile.first_name && profile.last_name) {
          prefillData.employee_name = `${profile.first_name} ${profile.last_name}`;
          prefillData.data_controller = `${profile.first_name} ${profile.last_name}`;
        }
        if (user.email) prefillData.contact_email = user.email;

        setFormData(prev => ({ ...prefillData, ...prev }));
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  };

  const saveDraft = async () => {
    if (!user || !documentData || saving) return;

    setSaving(true);
    try {
      const { data: existing } = await supabase
        .from('user_documents')
        .select('id')
        .eq('user_id', user.id)
        .eq('document_id', documentData.id)
        .eq('status', 'draft')
        .single();

      if (existing) {
        await supabase
          .from('user_documents')
          .update({
            customized_data: formData,
            updated_at: new Date().toISOString()
          })
          .eq('id', existing.id);
      } else {
        await supabase
          .from('user_documents')
          .insert({
            user_id: user.id,
            document_id: documentData.id,
            customized_data: formData,
            status: 'draft'
          });
      }
    } catch (error) {
      console.error('Error saving draft:', error);
    } finally {
      setSaving(false);
    }
  };

  const validateField = (field: CustomField, value: any) => {
    if (field.required && (!value || value === '')) {
      return `${field.label} is required`;
    }
    return null;
  };

  const updateField = (fieldId: string, value: any) => {
    setFormData(prev => ({ ...prev, [fieldId]: value }));
    
    // Clear error when user starts typing
    if (errors[fieldId]) {
      setErrors(prev => ({ ...prev, [fieldId]: '' }));
    }
  };

  const validateForm = () => {
    if (!documentData?.customizable_fields) return true;

    const fields = documentData.customizable_fields as CustomField[];
    const newErrors: Record<string, string> = {};

    for (const field of fields) {
      const error = validateField(field, formData[field.id]);
      if (error) {
        newErrors[field.id] = error;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const generatePreview = () => {
    if (!validateForm()) {
      toast.error('Please fix the errors before previewing');
      return;
    }

    // Simple template replacement
    let previewContent = `${documentData?.title}\n\n${documentData?.description}\n\n`;
    
    const fields = (documentData?.customizable_fields as CustomField[]) || [];
    fields.forEach(field => {
      const value = formData[field.id] || '[Not provided]';
      previewContent += `${field.label}: ${value}\n`;
    });

    setPreview(previewContent);
    setCurrentStep(2);
  };

  const handleFinalize = async () => {
    if (!user || !documentData) return;

    setSaving(true);
    try {
      // Mark document as completed
      const { data: existing } = await supabase
        .from('user_documents')
        .select('id')
        .eq('user_id', user.id)
        .eq('document_id', documentData.id)
        .single();

      if (existing) {
        await supabase
          .from('user_documents')
          .update({
            status: 'completed',
            customized_data: formData,
            updated_at: new Date().toISOString()
          })
          .eq('id', existing.id);
      } else {
        await supabase
          .from('user_documents')
          .insert({
            user_id: user.id,
            document_id: documentData.id,
            customized_data: formData,
            status: 'completed'
          });
      }

      // Update document progress
      await supabase
        .from('user_document_progress')
        .upsert({
          user_id: user.id,
          document_id: documentData.id,
          customized: true,
          completed_at: new Date().toISOString()
        });

      // Download document
      const blob = new Blob([preview], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const downloadLink = window.document.createElement('a');
      downloadLink.href = url;
      downloadLink.download = `${documentData.title.replace(/\s+/g, '_')}_customized.txt`;
      downloadLink.click();
      URL.revokeObjectURL(url);

      toast.success('Document customized successfully!');
      setCurrentStep(3);
    } catch (error) {
      console.error('Error finalizing document:', error);
      toast.error('Failed to save document');
    } finally {
      setSaving(false);
    }
  };

  const renderCustomField = (field: CustomField) => {
    const value = formData[field.id] || field.default_value || '';
    const error = errors[field.id];

    switch (field.type) {
      case 'text':
        return (
          <div key={field.id} className="space-y-2">
            <Label htmlFor={field.id}>
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <Input
              id={field.id}
              value={value}
              onChange={(e) => updateField(field.id, e.target.value)}
              placeholder={field.placeholder}
              className={error ? 'border-red-500' : ''}
            />
            {field.help_text && (
              <p className="text-sm text-gray-500">{field.help_text}</p>
            )}
            {error && <p className="text-sm text-red-500">{error}</p>}
          </div>
        );

      case 'textarea':
        return (
          <div key={field.id} className="space-y-2">
            <Label htmlFor={field.id}>
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <Textarea
              id={field.id}
              value={value}
              onChange={(e) => updateField(field.id, e.target.value)}
              placeholder={field.placeholder}
              rows={4}
              className={error ? 'border-red-500' : ''}
            />
            {field.help_text && (
              <p className="text-sm text-gray-500">{field.help_text}</p>
            )}
            {error && <p className="text-sm text-red-500">{error}</p>}
          </div>
        );

      case 'select':
        return (
          <div key={field.id} className="space-y-2">
            <Label htmlFor={field.id}>
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <Select value={value} onValueChange={(val) => updateField(field.id, val)}>
              <SelectTrigger className={error ? 'border-red-500' : ''}>
                <SelectValue placeholder={field.placeholder || `Select ${field.label}`} />
              </SelectTrigger>
              <SelectContent>
                {field.options?.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {field.help_text && (
              <p className="text-sm text-gray-500">{field.help_text}</p>
            )}
            {error && <p className="text-sm text-red-500">{error}</p>}
          </div>
        );

      case 'number':
        return (
          <div key={field.id} className="space-y-2">
            <Label htmlFor={field.id}>
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <Input
              id={field.id}
              type="number"
              value={value}
              onChange={(e) => updateField(field.id, parseFloat(e.target.value) || '')}
              placeholder={field.placeholder}
              className={error ? 'border-red-500' : ''}
            />
            {field.help_text && (
              <p className="text-sm text-gray-500">{field.help_text}</p>
            )}
            {error && <p className="text-sm text-red-500">{error}</p>}
          </div>
        );

      case 'date':
        return (
          <div key={field.id} className="space-y-2">
            <Label htmlFor={field.id}>
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <Input
              id={field.id}
              type="date"
              value={value}
              onChange={(e) => updateField(field.id, e.target.value)}
              className={error ? 'border-red-500' : ''}
            />
            {field.help_text && (
              <p className="text-sm text-gray-500">{field.help_text}</p>
            )}
            {error && <p className="text-sm text-red-500">{error}</p>}
          </div>
        );

      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (!documentData) {
    return (
      <div className="max-w-4xl mx-auto p-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Document not found</h1>
        <Button onClick={() => navigate('/dashboard/documents')}>
          Back to Documents
        </Button>
      </div>
    );
  }

  const customFields = (documentData.customizable_fields as CustomField[]) || [];

  return (
    <div className="max-w-4xl mx-auto p-8">
      {/* Header */}
      <div className="mb-8">
        <Button
          variant="ghost"
          onClick={() => navigate('/dashboard/documents')}
          className="mb-4"
        >
          <ChevronLeft className="w-4 h-4 mr-2" />
          Back to Documents
        </Button>
        
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">{documentData.title}</h1>
            <p className="text-gray-600 mt-1">{documentData.description}</p>
          </div>
          
          <div className="flex items-center gap-2">
            {saving && <Badge variant="secondary">Saving...</Badge>}
            {documentData.is_required && <Badge variant="destructive">Required</Badge>}
          </div>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          {steps.map((step, index) => (
            <div key={index} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                index <= currentStep ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-500'
              }`}>
                {index + 1}
              </div>
              <div className="ml-2 hidden sm:block">
                <p className="text-sm font-medium">{step.title}</p>
                <p className="text-xs text-gray-500">{step.description}</p>
              </div>
              {index < steps.length - 1 && (
                <div className={`w-8 h-0.5 mx-4 ${
                  index < currentStep ? 'bg-blue-500' : 'bg-gray-200'
                }`} />
              )}
            </div>
          ))}
        </div>
        <Progress value={(currentStep / (steps.length - 1)) * 100} className="h-2" />
      </div>

      {/* Step Content */}
      <Card>
        <CardContent className="p-6">
          {currentStep === 0 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold mb-4">Document Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Category</Label>
                    <p className="text-sm text-gray-600 mt-1 capitalize">{documentData.category}</p>
                  </div>
                  <div>
                    <Label>Required</Label>
                    <p className="text-sm text-gray-600 mt-1">
                      {documentData.is_required ? 'Yes' : 'No'}
                    </p>
                  </div>
                  {customFields.length > 0 && (
                    <div className="md:col-span-2">
                      <Label>Customizable Fields</Label>
                      <p className="text-sm text-gray-600 mt-1">
                        {customFields.length} field(s) to customize
                      </p>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="flex items-start gap-3">
                  <FileText className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-medium text-blue-900">What happens next?</h3>
                    <p className="text-sm text-blue-700 mt-1">
                      You'll customize this document with your business information, then download the finalized version.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentStep === 1 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">Customize Your Document</h2>
              
              {customFields.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">This document doesn't require customization.</p>
                  <p className="text-sm text-gray-400 mt-1">You can download it as-is.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {customFields.map(renderCustomField)}
                </div>
              )}
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">Preview Your Document</h2>
              
              <div className="border rounded-lg p-6 bg-gray-50">
                <h3 className="font-medium mb-4">Document Preview</h3>
                <pre className="whitespace-pre-wrap font-sans text-sm">{preview}</pre>
              </div>
              
              <div className="p-4 bg-yellow-50 rounded-lg">
                <p className="text-sm text-yellow-800">
                  <strong>Note:</strong> This is a simplified preview. The actual document will be properly formatted.
                </p>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-6 text-center">
              <h2 className="text-xl font-semibold">Document Ready!</h2>
              
              <div className="py-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Download className="w-8 h-8 text-green-600" />
                </div>
                <p className="text-gray-600">
                  Your customized document is ready to download and use.
                </p>
              </div>

              <div className="flex gap-4 justify-center">
                <Button onClick={handleFinalize} disabled={saving}>
                  <Save className="w-4 h-4 mr-2" />
                  {saving ? 'Saving...' : 'Save & Download'}
                </Button>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between mt-8 pt-6 border-t">
            <Button
              variant="outline"
              onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
              disabled={currentStep === 0}
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Previous
            </Button>

            {currentStep < steps.length - 1 ? (
              <Button onClick={() => {
                if (currentStep === 1) {
                  generatePreview();
                } else {
                  setCurrentStep(currentStep + 1);
                }
              }}>
                {currentStep === 1 ? 'Preview' : 'Next'}
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <div />
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DocumentCustomizer;
