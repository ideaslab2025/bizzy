
import React, { createContext, useContext } from 'react';
import { useCustomCursor } from '@/hooks/useCustomCursor';

const CursorContext = createContext<ReturnType<typeof useCustomCursor> | null>(null);

export const useCursorContext = () => {
  const context = useContext(CursorContext);
  if (!context) {
    throw new Error('useCursorContext must be used within CursorProvider');
  }
  return context;
};

interface CursorProviderProps {
  children: React.ReactNode;
}

export const CursorProvider: React.FC<CursorProviderProps> = ({ children }) => {
  const cursorState = useCustomCursor();

  return (
    <CursorContext.Provider value={cursorState}>
      {children}
    </CursorContext.Provider>
  );
};
