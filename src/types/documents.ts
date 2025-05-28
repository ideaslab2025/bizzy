
export interface Document {
  id: string;
  title: string;
  description?: string;
  category: 'company-setup' | 'employment' | 'tax-vat' | 'legal-compliance' | 'finance' | 'data-protection';
  subcategory?: string;
  file_type?: 'template' | 'guide' | 'form' | 'policy';
  template_url?: string;
  is_required: boolean;
  customizable_fields?: CustomField[];
  keywords?: string[];
  created_at: string;
  updated_at: string;
}

export interface CustomField {
  id: string;
  label: string;
  type: 'text' | 'select' | 'date' | 'number' | 'textarea' | 'checkbox';
  required: boolean;
  placeholder?: string;
  options?: string[];
  default_value?: string;
  help_text?: string;
}

export interface UserDocument {
  id: string;
  user_id: string;
  document_id: string;
  customized_data?: any;
  status: 'draft' | 'completed' | 'archived';
  file_url?: string;
  created_at: string;
  updated_at: string;
  document?: Document;
}

export interface UserDocumentProgress {
  id: string;
  user_id: string;
  document_id: string;
  viewed: boolean;
  downloaded: boolean;
  customized: boolean;
  completed_at?: string;
  created_at: string;
}

export interface GuidanceStepDocument {
  id: string;
  guidance_step_id: number;
  document_id: string;
  context?: string;
  is_primary: boolean;
  display_order: number;
  document?: Document;
}
