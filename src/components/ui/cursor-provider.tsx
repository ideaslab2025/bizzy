
import React, { createContext, useContext } from 'react';

// Empty context since we removed custom cursor functionality
const CursorContext = createContext<null>(null);

export const useCursorContext = () => {
  const context = useContext(CursorContext);
  // Return null since we don't have cursor functionality anymore
  return context;
};

interface CursorProviderProps {
  children: React.ReactNode;
}

export const CursorProvider: React.FC<CursorProviderProps> = ({ children }) => {
  return (
    <CursorContext.Provider value={null}>
      {children}
    </CursorContext.Provider>
  );
};
