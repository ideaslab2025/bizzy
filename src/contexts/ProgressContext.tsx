
import React, { createContext, useContext, ReactNode } from 'react';
import { useProgressTracking } from '@/hooks/useProgressTracking';

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

  return (
    <ProgressContext.Provider value={progressData}>
      {children}
    </ProgressContext.Provider>
  );
};
