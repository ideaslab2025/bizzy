
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useDocuments } from '@/hooks/useDocuments';

interface SimpleProgressChartsProps {
  userId: string;
}

export const SimpleProgressCharts: React.FC<SimpleProgressChartsProps> = ({ userId }) => {
  const { documents, progress, loading } = useDocuments();

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded mb-4"></div>
            <div className="h-8 bg-gray-200 rounded mb-6"></div>
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-16 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Calculate progress data
  const completedDocIds = progress.filter(p => p.completed_at).map(p => p.document_id);
  const totalDocuments = documents.length;
  const completedDocuments = completedDocIds.length;
  const overallPercentage = totalDocuments > 0 ? Math.round((completedDocuments / totalDocuments) * 100) : 0;

  // Group documents by category
  const categories = ['legal', 'finance', 'hr', 'governance', 'compliance'];
  const categoryData = categories.map(category => {
    const categoryDocs = documents.filter(doc => doc.category === category);
    const completedCategoryDocs = categoryDocs.filter(doc => completedDocIds.includes(doc.id));
    
    return {
      name: category.charAt(0).toUpperCase() + category.slice(1),
      completed: completedCategoryDocs.length,
      total: categoryDocs.length,
      percentage: categoryDocs.length > 0 ? Math.round((completedCategoryDocs.length / categoryDocs.length) * 100) : 0
    };
  }).filter(cat => cat.total > 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Progress</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Overall Progress Bar */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="font-medium">Overall Progress</span>
            <span className="text-sm text-gray-600">{completedDocuments}/{totalDocuments} documents</span>
          </div>
          <Progress value={overallPercentage} className="h-4 mb-2" />
          <div className="text-right text-sm text-gray-600">
            {overallPercentage}% Complete
          </div>
        </div>

        {/* Category Progress Bars */}
        <div className="space-y-4">
          <h3 className="font-medium text-gray-900">Progress by Category</h3>
          {categoryData.map(category => (
            <CategoryProgress key={category.name} category={category} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

interface CategoryProgressProps {
  category: {
    name: string;
    completed: number;
    total: number;
    percentage: number;
  };
}

const CategoryProgress: React.FC<CategoryProgressProps> = ({ category }) => {
  const getProgressColor = (percentage: number) => {
    if (percentage === 100) return 'bg-green-500';
    if (percentage >= 75) return 'bg-blue-500';
    if (percentage >= 50) return 'bg-yellow-500';
    return 'bg-gray-400';
  };

  return (
    <div className="p-4 border rounded-lg bg-gray-50">
      <div className="flex justify-between items-center mb-2">
        <h4 className="font-medium text-gray-900">{category.name}</h4>
        <span className="text-sm text-gray-600">{category.completed}/{category.total}</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
        <div 
          className={`h-3 rounded-full transition-all duration-300 ${getProgressColor(category.percentage)}`}
          style={{ width: `${category.percentage}%` }}
        />
      </div>
      <div className="text-sm text-gray-600">{category.percentage}% complete</div>
    </div>
  );
};
