
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useDocuments } from '@/hooks/useDocuments';

interface ProgressStatsCardsProps {
  userId: string;
}

export const ProgressStatsCards: React.FC<ProgressStatsCardsProps> = ({ userId }) => {
  const { documents, progress, loading } = useDocuments();

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="h-32">
            <CardContent className="p-6 h-full flex flex-col justify-center">
              <div className="animate-pulse">
                <div className="h-8 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  // Calculate statistics
  const completedDocIds = progress.filter(p => p.completed_at).map(p => p.document_id);
  const totalDocuments = documents.length;
  const completedDocuments = completedDocIds.length;
  const remainingDocuments = totalDocuments - completedDocuments;
  const completionPercentage = totalDocuments > 0 ? Math.round((completedDocuments / totalDocuments) * 100) : 0;

  // Calculate required documents
  const requiredDocuments = documents.filter(doc => doc.is_required);
  const completedRequiredDocs = requiredDocuments.filter(doc => completedDocIds.includes(doc.id));
  const criticalRemaining = requiredDocuments.length - completedRequiredDocs.length;

  const stats = [
    {
      value: totalDocuments,
      label: 'Total Documents',
      color: 'blue',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      textColor: 'text-blue-900',
      icon: '📄'
    },
    {
      value: completedDocuments,
      label: 'Completed',
      color: 'green',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      textColor: 'text-green-900',
      icon: '✅'
    },
    {
      value: remainingDocuments,
      label: 'Remaining',
      color: 'orange',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200',
      textColor: 'text-orange-900',
      icon: '⏳'
    },
    {
      value: `${completionPercentage}%`,
      label: 'Complete',
      color: 'purple',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
      textColor: 'text-purple-900',
      icon: '📊'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <Card 
            key={index} 
            className={`${stat.bgColor} ${stat.borderColor} border hover:shadow-md transition-shadow duration-200 h-32`}
          >
            <CardContent className="p-6 h-full flex flex-col justify-between">
              <div className="flex items-start justify-between">
                <span className="text-2xl">{stat.icon}</span>
                <div className={`text-3xl font-bold ${stat.textColor}`}>
                  {stat.value}
                </div>
              </div>
              <div className={`text-sm font-medium ${stat.textColor} opacity-80`}>
                {stat.label}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Critical Documents Alert */}
      {criticalRemaining > 0 && (
        <Card className="bg-red-50 border-red-200 border">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <span className="text-2xl flex-shrink-0">🚨</span>
              <div className="flex-1">
                <div className="font-semibold text-red-900">
                  {criticalRemaining} Critical Document{criticalRemaining !== 1 ? 's' : ''} Remaining
                </div>
                <div className="text-sm text-red-700 mt-1">
                  These are required regulatory documents that need immediate attention
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
