
import React from 'react';
import { useDocuments } from '@/hooks/useDocuments';
import { DashboardCardSkeleton } from '@/components/ui/skeleton-loader';
import OverallProgressCard from './OverallProgressCard';
import CategoryProgressCard from './CategoryProgressCard';
import ProgressLegend from './ProgressLegend';

interface ProgressCategory {
  id: string;
  name: string;
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <DashboardCardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  // Transform documents into progress categories with better filtering
  const progressCategories: ProgressCategory[] = [
    {
      id: 'legal',
      name: 'Legal & Compliance',
      description: 'Company registration and legal documents',
      totalDocuments: documents.filter(doc => 
        doc.category.toLowerCase().includes('legal') || 
        doc.category.toLowerCase().includes('compliance') ||
        doc.category.toLowerCase().includes('articles')
      ).length,
      completedDocuments: progress.filter(p => 
        p.completed_at && documents.find(d => 
          d.id === p.document_id && (
            d.category.toLowerCase().includes('legal') || 
            d.category.toLowerCase().includes('compliance') ||
            d.category.toLowerCase().includes('articles')
          )
        )
      ).length,
      completionPercentage: 0,
      criticalDocuments: [],
      upcomingDeadlines: []
    },
    {
      id: 'finance',
      name: 'Finance & Tax',
      description: 'Tax registration and financial setup',
      totalDocuments: documents.filter(doc => 
        doc.category.toLowerCase().includes('finance') || 
        doc.category.toLowerCase().includes('tax') ||
        doc.category.toLowerCase().includes('vat') ||
        doc.category.toLowerCase().includes('accounting')
      ).length,
      completedDocuments: progress.filter(p => 
        p.completed_at && documents.find(d => 
          d.id === p.document_id && (
            d.category.toLowerCase().includes('finance') || 
            d.category.toLowerCase().includes('tax') ||
            d.category.toLowerCase().includes('vat') ||
            d.category.toLowerCase().includes('accounting')
          )
        )
      ).length,
      completionPercentage: 0,
      criticalDocuments: [],
      upcomingDeadlines: []
    },
    {
      id: 'hr',
      name: 'HR & Employment',
      description: 'Employment contracts and HR policies',
      totalDocuments: documents.filter(doc => 
        doc.category.toLowerCase().includes('hr') || 
        doc.category.toLowerCase().includes('employment') ||
        doc.category.toLowerCase().includes('paye') ||
        doc.category.toLowerCase().includes('payroll')
      ).length,
      completedDocuments: progress.filter(p => 
        p.completed_at && documents.find(d => 
          d.id === p.document_id && (
            d.category.toLowerCase().includes('hr') || 
            d.category.toLowerCase().includes('employment') ||
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
      id: 'governance',
      name: 'Governance & Admin',
      description: 'Business governance and administration',
      totalDocuments: documents.filter(doc => 
        doc.category.toLowerCase().includes('governance') || 
        doc.category.toLowerCase().includes('admin') ||
        doc.category.toLowerCase().includes('policy') ||
        doc.category.toLowerCase().includes('register')
      ).length,
      completedDocuments: progress.filter(p => 
        p.completed_at && documents.find(d => 
          d.id === p.document_id && (
            d.category.toLowerCase().includes('governance') || 
            d.category.toLowerCase().includes('admin') ||
            d.category.toLowerCase().includes('policy') ||
            d.category.toLowerCase().includes('register')
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

      {/* Category Progress Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {progressCategories.map(category => (
          <CategoryProgressCard 
            key={category.id}
            category={category}
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
