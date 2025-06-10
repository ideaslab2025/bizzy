
import React, { createContext, useContext, ReactNode } from 'react';
import { useProgressTracking } from '@/hooks/useProgressTracking';
import { useOverallBusinessProgress } from '@/hooks/useOverallBusinessProgress';

interface ProgressContextType {
  completedDocuments: Set<string>;
  categoryProgress: Array<{
    categoryId: string;
    name: string;
    completed: number;
    total: number;
    percentage: number;
  }>;
  loading: boolean;
  toggleDocumentCompletion: (documentId: string, isCompleted: boolean) => Promise<void>;
  refreshProgress: () => Promise<void>;
  // Overall business progress
  overallBusinessProgress: number;
  totalDocuments: number;
  totalCompletedDocuments: number;
  categoryBreakdown: {
    [categoryId: string]: {
      name: string;
      completed: number;
      total: number;
      percentage: number;
    };
  };
  refreshOverallProgress: () => Promise<void>;
}

const ProgressContext = createContext<ProgressContextType | undefined>(undefined);

export const useProgress = () => {
  const context = useContext(ProgressContext);
  if (!context) {
    throw new Error('useProgress must be used within a ProgressProvider');
  }
  return context;
};

interface ProgressProviderProps {
  children: ReactNode;
}

export const ProgressProvider: React.FC<ProgressProviderProps> = ({ children }) => {
  const progressData = useProgressTracking();
  const {
    overallPercentage,
    totalDocuments,
    completedDocuments,
    categoryBreakdown,
    refreshProgress: refreshOverallProgress
  } = useOverallBusinessProgress();

  const contextValue: ProgressContextType = {
    ...progressData,
    overallBusinessProgress: overallPercentage,
    totalDocuments,
    totalCompletedDocuments: completedDocuments,
    categoryBreakdown,
    refreshOverallProgress
  };

  return (
    <ProgressContext.Provider value={contextValue}>
      {children}
    </ProgressContext.Provider>
  );
};
