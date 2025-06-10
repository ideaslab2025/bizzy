
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
</ProgressContext.Provider>

Now I'll update the main Dashboard component to include the progress provider:

<lov-write file_path="src/pages/Dashboard.tsx">
import React from 'react';
import { Outlet } from 'react-router-dom';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/ui/app-sidebar';
import { ProgressProvider } from '@/contexts/ProgressContext';

const Dashboard = () => {
  return (
    <ProgressProvider>
      <SidebarProvider>
        <div className="flex min-h-screen w-full">
          <AppSidebar />
          <main className="flex-1 overflow-auto">
            <div className="container mx-auto p-6">
              <Outlet />
            </div>
          </main>
        </div>
      </SidebarProvider>
    </ProgressProvider>
  );
};

export default Dashboard;
