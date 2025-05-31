
import React, { createContext, useContext, useState } from 'react';

interface GuidanceContextType {
  currentStep: number;
  setCurrentStep: (step: number) => void;
}

const GuidanceContext = createContext<GuidanceContextType | undefined>(undefined);

export const GuidanceProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentStep, setCurrentStep] = useState(0);

  return (
    <GuidanceContext.Provider value={{ currentStep, setCurrentStep }}>
      {children}
    </GuidanceContext.Provider>
  );
};

export const useGuidance = () => {
  const context = useContext(GuidanceContext);
  if (context === undefined) {
    throw new Error('useGuidance must be used within a GuidanceProvider');
  }
  return context;
};
