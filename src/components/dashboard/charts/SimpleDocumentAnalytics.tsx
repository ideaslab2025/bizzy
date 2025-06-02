
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SimpleProgressCharts } from './SimpleProgressCharts';
import { DocumentStatusGrid } from './DocumentStatusGrid';
import { ProgressStatsCards } from './ProgressStatsCards';

interface SimpleDocumentAnalyticsProps {
  userId: string;
}

export const SimpleDocumentAnalytics: React.FC<SimpleDocumentAnalyticsProps> = ({ userId }) => {
  return (
    <div className="space-y-6">
      {/* Progress Statistics Cards */}
      <ProgressStatsCards userId={userId} />
      
      {/* Progress Charts and Document Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SimpleProgressCharts userId={userId} />
        <DocumentStatusGrid userId={userId} />
      </div>
    </div>
  );
};
