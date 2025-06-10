
import React from 'react';
import { useDocuments } from '@/hooks/useDocuments';
import { DashboardCardSkeleton } from '@/components/ui/skeleton-loader';
import OverallProgressCard from './OverallProgressCard';
import { CategoryProgressCard } from './CategoryProgressCard';
import ProgressLegend from './ProgressLegend';

interface ProgressCategory {
  id: string;
  name: string;
  type: string;
  description: string;
  totalDocuments: number;
  completedDocuments: number;
  completionPercentage: number;
  criticalDocuments: any[];
  upcomingDeadlines: Date[];
}

const BusinessProgressCharts: React.FC<{ userId: string }> = ({ userId }) => {
  const { documents, progress, loading, stats } = useDocuments();

  if (loading) {
    return (
      <div className="space-y-6">
        <DashboardCardSkeleton />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-44 bg-gray-200 rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  const progressCategories: ProgressCategory[] = [
    {
      id: 'company-setup',
      name: 'Company Set-Up',
      type: 'building',
      description: 'Company registration and incorporation documents',
      totalDocuments: documents.filter(doc => 
        doc.category.toLowerCase().includes('company') || 
        doc.category.toLowerCase().includes('incorporation') ||
        doc.category.toLowerCase().includes('registration') ||
        doc.category.toLowerCase().includes('articles')
      ).length,
      completedDocuments: progress.filter(p => 
        p.completed_at && documents.find(d => 
          d.id === p.document_id && (
            d.category.toLowerCase().includes('company') || 
            d.category.toLowerCase().includes('incorporation') ||
            d.category.toLowerCase().includes('registration') ||
            d.category.toLowerCase().includes('articles')
          )
        )
      ).length,
      completionPercentage: 0,
      criticalDocuments: [],
      upcomingDeadlines: []
    },
    {
      id: 'tax-vat',
      name: 'Tax and VAT',
      type: 'finance',
      description: 'Tax registration and VAT compliance',
      totalDocuments: documents.filter(doc => 
        doc.category.toLowerCase().includes('tax') ||
        doc.category.toLowerCase().includes('vat') ||
        doc.category.toLowerCase().includes('hmrc')
      ).length,
      completedDocuments: progress.filter(p => 
        p.completed_at && documents.find(d => 
          d.id === p.document_id && (
            d.category.toLowerCase().includes('tax') ||
            d.category.toLowerCase().includes('vat') ||
            d.category.toLowerCase().includes('hmrc')
          )
        )
      ).length,
      completionPercentage: 0,
      criticalDocuments: [],
      upcomingDeadlines: []
    },
    {
      id: 'employment',
      name: 'Employment',
      type: 'hr',
      description: 'Employment contracts and HR policies',
      totalDocuments: documents.filter(doc => 
        doc.category.toLowerCase().includes('employment') ||
        doc.category.toLowerCase().includes('hr') ||
        doc.category.toLowerCase().includes('paye') ||
        doc.category.toLowerCase().includes('payroll')
      ).length,
      completedDocuments: progress.filter(p => 
        p.completed_at && documents.find(d => 
          d.id === p.document_id && (
            d.category.toLowerCase().includes('employment') ||
            d.category.toLowerCase().includes('hr') ||
            d.category.toLowerCase().includes('paye') ||
            d.category.toLowerCase().includes('payroll')
          )
        )
      ).length,
      completionPercentage: 0,
      criticalDocuments: [],
      upcomingDeadlines: []
    },
    {
      id: 'legal-compliance',
      name: 'Legal Compliance',
      type: 'legal',
      description: 'Legal requirements and regulatory compliance',
      totalDocuments: documents.filter(doc => 
        doc.category.toLowerCase().includes('legal') ||
        doc.category.toLowerCase().includes('compliance') ||
        doc.category.toLowerCase().includes('regulatory')
      ).length,
      completedDocuments: progress.filter(p => 
        p.completed_at && documents.find(d => 
          d.id === p.document_id && (
            d.category.toLowerCase().includes('legal') ||
            d.category.toLowerCase().includes('compliance') ||
            d.category.toLowerCase().includes('regulatory')
          )
        )
      ).length,
      completionPercentage: 0,
      criticalDocuments: [],
      upcomingDeadlines: []
    },
    {
      id: 'finance',
      name: 'Finance',
      type: 'finance',
      description: 'Banking, accounting and financial setup',
      totalDocuments: documents.filter(doc => 
        doc.category.toLowerCase().includes('finance') ||
        doc.category.toLowerCase().includes('banking') ||
        doc.category.toLowerCase().includes('accounting')
      ).length,
      completedDocuments: progress.filter(p => 
        p.completed_at && documents.find(d => 
          d.id === p.document_id && (
            d.category.toLowerCase().includes('finance') ||
            d.category.toLowerCase().includes('banking') ||
            d.category.toLowerCase().includes('accounting')
          )
        )
      ).length,
      completionPercentage: 0,
      criticalDocuments: [],
      upcomingDeadlines: []
    },
    {
      id: 'data-protection',
      name: 'Data Protection',
      type: 'compliance',
      description: 'GDPR compliance and data protection policies',
      totalDocuments: documents.filter(doc => 
        doc.category.toLowerCase().includes('data') ||
        doc.category.toLowerCase().includes('gdpr') ||
        doc.category.toLowerCase().includes('privacy')
      ).length,
      completedDocuments: progress.filter(p => 
        p.completed_at && documents.find(d => 
          d.id === p.document_id && (
            d.category.toLowerCase().includes('data') ||
            d.category.toLowerCase().includes('gdpr') ||
            d.category.toLowerCase().includes('privacy')
          )
        )
      ).length,
      completionPercentage: 0,
      criticalDocuments: [],
      upcomingDeadlines: []
    }
  ];

  // Calculate completion percentages
  progressCategories.forEach(category => {
    category.completionPercentage = category.totalDocuments > 0 
      ? Math.round((category.completedDocuments / category.totalDocuments) * 100)
      : 0;
  });

  const overallProgress = Math.round(stats.completionRate);

  const handleCategoryDrill = (categoryId: string) => {
    console.log('View details for category:', categoryId);
    // Navigate to documents page with category filter
    // You can implement navigation logic here
  };

  return (
    <div className="progress-charts-container space-y-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Business Setup Progress</h2>
        <p className="text-gray-600">Track your completion status across all compliance categories</p>
      </div>

      {/* Overall Progress Summary */}
      <OverallProgressCard 
        totalDocuments={stats.total}
        completedDocuments={stats.completed}
        requiredDocuments={stats.required}
        overallProgress={overallProgress}
      />

      {/* Category Progress Grid - Updated for 6 categories */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {progressCategories.map(category => (
          <CategoryProgressCard 
            key={category.id}
            categoryId={category.id}
            onViewDetails={handleCategoryDrill}
          />
        ))}
      </div>

      {/* Professional Progress Legend */}
      <ProgressLegend />
    </div>
  );
};

export default BusinessProgressCharts;
