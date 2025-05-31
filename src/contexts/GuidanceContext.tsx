
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';

interface GuidanceStep {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed';
  order: number;
}

interface GuidanceContextType {
  steps: GuidanceStep[];
  currentStep: GuidanceStep | null;
  updateStepStatus: (stepId: string, status: GuidanceStep['status']) => void;
  loading: boolean;
}

const GuidanceContext = createContext<GuidanceContextType | undefined>(undefined);

export const useGuidance = () => {
  const context = useContext(GuidanceContext);
  if (!context) {
    throw new Error('useGuidance must be used within a GuidanceProvider');
  }
  return context;
};

interface GuidanceProviderProps {
  children: React.ReactNode;
}

export const GuidanceProvider: React.FC<GuidanceProviderProps> = ({ children }) => {
  const { user } = useAuth();
  const [steps, setSteps] = useState<GuidanceStep[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadGuidanceSteps();
    }
  }, [user]);

  const loadGuidanceSteps = async () => {
    // Mock data for now - in a real app, this would come from your database
    const mockSteps: GuidanceStep[] = [
      {
        id: '1',
        title: 'Business Registration',
        description: 'Register your business with the appropriate authorities',
        status: 'completed',
        order: 1
      },
      {
        id: '2',
        title: 'Tax Registration',
        description: 'Set up your tax accounts and understand your obligations',
        status: 'in-progress',
        order: 2
      },
      {
        id: '3',
        title: 'Banking Setup',
        description: 'Open business bank accounts and set up payment processing',
        status: 'pending',
        order: 3
      }
    ];

    setSteps(mockSteps);
    setLoading(false);
  };

  const updateStepStatus = (stepId: string, status: GuidanceStep['status']) => {
    setSteps(prev => 
      prev.map(step => 
        step.id === stepId ? { ...step, status } : step
      )
    );
  };

  const currentStep = steps.find(step => step.status === 'in-progress') || 
                     steps.find(step => step.status === 'pending') || 
                     null;

  const value: GuidanceContextType = {
    steps,
    currentStep,
    updateStepStatus,
    loading
  };

  return (
    <GuidanceContext.Provider value={value}>
      {children}
    </GuidanceContext.Provider>
  );
};
