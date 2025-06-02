
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useDocuments } from '@/hooks/useDocuments';

interface CategoryAnalytics {
  id: string;
  name: string;
  completed: number;
  total: number;
  criticalRemaining: number;
  nextDeadline?: Date;
  complianceImpact: number;
}

interface RemainingDocument {
  id: string;
  title: string;
  category: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  regulatoryBody?: string;
  estimatedTime: number;
  deadline?: Date;
}

interface DocumentAnalyticsData {
  completedCount: number;
  totalCount: number;
  overallCompletion: number;
  complianceScore: number;
  criticalRemaining: number;
  estimatedCompletion: Date;
  categoryBreakdown: CategoryAnalytics[];
  remainingDocuments: RemainingDocument[];
}

export const useDocumentAnalytics = (userId: string, companyId?: string) => {
  const { documents, progress, loading: documentsLoading } = useDocuments();
  const [analyticsData, setAnalyticsData] = useState<DocumentAnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!documentsLoading && documents.length > 0) {
      calculateAnalytics();
    }
  }, [documents, progress, documentsLoading]);

  const calculateAnalytics = () => {
    const completedDocIds = progress.filter(p => p.completed_at).map(p => p.document_id);
    const completedCount = completedDocIds.length;
    const totalCount = documents.length;
    const overallCompletion = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

    // Calculate compliance score based on critical documents completion
    const criticalDocs = documents.filter(doc => doc.is_required);
    const completedCritical = criticalDocs.filter(doc => completedDocIds.includes(doc.id));
    const complianceScore = criticalDocs.length > 0 
      ? Math.round((completedCritical.length / criticalDocs.length) * 100)
      : 100;

    const criticalRemaining = criticalDocs.length - completedCritical.length;

    // Calculate category breakdown
    const categories = ['legal', 'finance', 'hr', 'governance', 'compliance'];
    const categoryBreakdown: CategoryAnalytics[] = categories.map(category => {
      const categoryDocs = documents.filter(doc => doc.category === category);
      const completedCategoryDocs = categoryDocs.filter(doc => completedDocIds.includes(doc.id));
      const criticalCategoryDocs = categoryDocs.filter(doc => doc.is_required && !completedDocIds.includes(doc.id));
      
      return {
        id: category,
        name: getCategoryDisplayName(category),
        completed: completedCategoryDocs.length,
        total: categoryDocs.length,
        criticalRemaining: criticalCategoryDocs.length,
        complianceImpact: categoryDocs.length > 0 ? Math.round((completedCategoryDocs.length / categoryDocs.length) * 100) : 0
      };
    }).filter(cat => cat.total > 0);

    // Calculate remaining documents with priority
    const remainingDocuments: RemainingDocument[] = documents
      .filter(doc => !completedDocIds.includes(doc.id))
      .map(doc => ({
        id: doc.id,
        title: doc.title,
        category: getCategoryDisplayName(doc.category),
        priority: doc.is_required ? 'critical' : 'medium' as 'critical' | 'high' | 'medium' | 'low',
        estimatedTime: 30, // Default 30 minutes
        regulatoryBody: getRegulatoryBody(doc.category)
      }))
      .sort((a, b) => {
        const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      });

    // Estimate completion date (assuming 2 documents per week)
    const remainingCount = totalCount - completedCount;
    const weeksToComplete = Math.ceil(remainingCount / 2);
    const estimatedCompletion = new Date();
    estimatedCompletion.setDate(estimatedCompletion.getDate() + (weeksToComplete * 7));

    setAnalyticsData({
      completedCount,
      totalCount,
      overallCompletion,
      complianceScore,
      criticalRemaining,
      estimatedCompletion,
      categoryBreakdown,
      remainingDocuments
    });

    setLoading(false);
  };

  const getCategoryDisplayName = (category: string): string => {
    const names: Record<string, string> = {
      legal: 'Legal & Compliance',
      finance: 'Finance & Tax',
      hr: 'HR & Employment',
      governance: 'Corporate Governance',
      compliance: 'Regulatory Compliance'
    };
    return names[category] || category;
  };

  const getRegulatoryBody = (category: string): string | undefined => {
    const bodies: Record<string, string> = {
      legal: 'Companies House',
      finance: 'HMRC',
      hr: 'ACAS',
      governance: 'Companies House',
      compliance: 'Various'
    };
    return bodies[category];
  };

  return {
    analyticsData,
    loading: loading || documentsLoading
  };
};
