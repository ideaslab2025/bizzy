
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CategoryProgressCard } from './CategoryProgressCard';
import { useDocuments } from '@/hooks/useDocuments';

interface BusinessOverviewProps {
  userId: string;
}

export const BusinessOverview: React.FC<BusinessOverviewProps> = ({ userId }) => {
  const { documents, progress, loading } = useDocuments();

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Business Setup Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex flex-col items-center p-4 bg-gray-50 rounded-lg border">
                <div className="w-24 h-24 bg-gray-200 rounded-full animate-pulse mb-3"></div>
                <div className="h-4 bg-gray-200 rounded w-16 animate-pulse mb-1"></div>
                <div className="h-3 bg-gray-200 rounded w-12 animate-pulse"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  // Calculate completion data by category
  const completedDocIds = progress.filter(p => p.completed_at).map(p => p.document_id);
  
  const categories = ['finance', 'hr', 'legal', 'compliance', 'governance'];
  const categoryData = categories.map(categoryType => {
    const categoryDocs = documents.filter(doc => doc.category === categoryType);
    const completedCategoryDocs = categoryDocs.filter(doc => completedDocIds.includes(doc.id));
    
    const categoryNames: Record<string, string> = {
      'finance': 'Finance & Tax',
      'hr': 'HR & Employment',
      'legal': 'Legal Setup',
      'compliance': 'Compliance',
      'governance': 'Governance'
    };
    
    return {
      id: categoryType,
      name: categoryNames[categoryType] || categoryType,
      type: categoryType,
      completedDocuments: completedCategoryDocs.length,
      totalDocuments: categoryDocs.length
    };
  }).filter(cat => cat.totalDocuments > 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Business Setup Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {categoryData.map(category => (
            <CategoryProgressCard key={category.id} category={category} />
          ))}
        </div>
        
        {categoryData.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No document categories available
          </div>
        )}
      </CardContent>
    </Card>
  );
};
