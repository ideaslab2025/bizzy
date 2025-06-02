
import React from 'react';
import { StatusSummaryCard } from './StatusSummaryCard';

interface DocumentStatusSummaryProps {
  data: {
    completedCount: number;
    inProgressCount: number;
    notStartedCount: number;
    criticalCount: number;
    totalCount: number;
  };
}

export const DocumentStatusSummary: React.FC<DocumentStatusSummaryProps> = ({ data }) => {
  const statusCards = [
    {
      title: 'Completed Documents',
      count: data.completedCount,
      total: data.totalCount,
      color: 'green' as const,
      icon: '✅',
      description: 'Documents downloaded and confirmed complete'
    },
    {
      title: 'In Progress',
      count: data.inProgressCount,
      total: data.totalCount,
      color: 'blue' as const,
      icon: '📝',
      description: 'Documents downloaded but not yet completed'
    },
    {
      title: 'Not Started',
      count: data.notStartedCount,
      total: data.totalCount,
      color: 'gray' as const,
      icon: '📋',
      description: 'Documents available for download'
    },
    {
      title: 'Critical Priority',
      count: data.criticalCount,
      total: data.totalCount,
      color: 'red' as const,
      icon: '🚨',
      description: 'High-priority regulatory requirements'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {statusCards.map((card, index) => (
        <StatusSummaryCard key={index} {...card} />
      ))}
    </div>
  );
};
