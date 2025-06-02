
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface RingChartData {
  category: string;
  value: number;
  maxValue: number;
  color: string;
  description: string;
}

interface UserTask {
  id: string;
  section_id: number;
  completed: boolean;
  category?: string;
}

interface UserDocument {
  id: string;
  category: string;
  downloaded: boolean;
  completed_at?: string;
}

interface BusinessSetupProgress {
  hrProgress: number;
  financeProgress: number;
  legalProgress: number;
  documentsProgress: number;
}

// Calculate actual business setup progress
const calculateSetupProgress = (userTasks: UserTask[], documents: UserDocument[]): BusinessSetupProgress => {
  const categories = {
    hr: ['employment-contracts', 'hr-policies', 'paye-setup', 'payroll'],
    finance: ['corporation-tax', 'vat-registration', 'bank-account', 'accounting'],
    legal: ['articles-association', 'company-registers', 'compliance-docs', 'memorandum'],
    documents: ['contract-templates', 'policy-templates', 'legal-templates', 'forms']
  };

  const calculateCategoryProgress = (categoryItems: string[], sectionId: number) => {
    const sectionTasks = userTasks.filter(task => task.section_id === sectionId);
    const completedTasks = sectionTasks.filter(task => task.completed);
    
    const categoryDocs = documents.filter(doc => 
      categoryItems.some(item => doc.category.toLowerCase().includes(item))
    );
    const completedDocs = categoryDocs.filter(doc => doc.completed_at);
    
    const totalItems = Math.max(sectionTasks.length + categoryDocs.length, 1);
    const completedItems = completedTasks.length + completedDocs.length;
    
    return Math.round((completedItems / totalItems) * 100);
  };

  return {
    hrProgress: calculateCategoryProgress(categories.hr, 3), // HR section
    financeProgress: calculateCategoryProgress(categories.finance, 2), // Finance section
    legalProgress: calculateCategoryProgress(categories.legal, 1), // Legal section
    documentsProgress: calculateCategoryProgress(categories.documents, 4) // Documents section
  };
};

// Hook to fetch real business setup data
export const useBusinessSetupData = () => {
  const { user } = useAuth();
  const [data, setData] = useState<RingChartData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSetupProgress = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Fetch user tasks progress
        const { data: userProgress, error: progressError } = await supabase
          .from('user_guidance_progress')
          .select('step_id, section_id, completed')
          .eq('user_id', user.id);

        if (progressError) throw progressError;

        // Fetch user documents
        const { data: userDocuments, error: docsError } = await supabase
          .from('user_document_progress')
          .select('document_id, completed_at, documents(category)')
          .eq('user_id', user.id);

        if (docsError) throw docsError;

        // Transform the data for calculation
        const userTasks: UserTask[] = userProgress?.map(p => ({
          id: p.step_id.toString(),
          section_id: p.section_id,
          completed: p.completed
        })) || [];

        const documents: UserDocument[] = userDocuments?.map(d => ({
          id: d.document_id.toString(),
          category: d.documents?.category || '',
          downloaded: !!d.completed_at,
          completed_at: d.completed_at
        })) || [];

        // Calculate progress for each category
        const progressData = calculateSetupProgress(userTasks, documents);
        
        const chartData: RingChartData[] = [
          {
            category: 'Legal & Compliance',
            value: progressData.legalProgress,
            maxValue: 100,
            color: '#3B82F6',
            description: 'Company registration, articles, legal documents'
          },
          {
            category: 'Finance & Tax',
            value: progressData.financeProgress,
            maxValue: 100,
            color: '#10B981',
            description: 'Corporation tax, VAT, banking setup'
          },
          {
            category: 'HR & Employment',
            value: progressData.hrProgress,
            maxValue: 100,
            color: '#F59E0B',
            description: 'Employment contracts, policies, PAYE setup'
          },
          {
            category: 'Documents & Templates',
            value: progressData.documentsProgress,
            maxValue: 100,
            color: '#EF4444',
            description: 'Contract templates, policy documents'
          }
        ];
        
        setData(chartData);
      } catch (err) {
        console.error('Failed to fetch setup progress:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch data');
        
        // Provide fallback data
        setData([
          {
            category: 'Legal & Compliance',
            value: 25,
            maxValue: 100,
            color: '#3B82F6',
            description: 'Company registration, articles, legal documents'
          },
          {
            category: 'Finance & Tax',
            value: 40,
            maxValue: 100,
            color: '#10B981',
            description: 'Corporation tax, VAT, banking setup'
          },
          {
            category: 'HR & Employment',
            value: 60,
            maxValue: 100,
            color: '#F59E0B',
            description: 'Employment contracts, policies, PAYE setup'
          },
          {
            category: 'Documents & Templates',
            value: 80,
            maxValue: 100,
            color: '#EF4444',
            description: 'Contract templates, policy documents'
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchSetupProgress();
  }, [user]);

  return { data, loading, error };
};
