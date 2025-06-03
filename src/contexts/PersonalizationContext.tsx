
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface PersonalizationData {
  robotName: string;
  colorTheme: 'blue' | 'green' | 'purple' | 'orange';
  preferences: {
    animationSpeed: 'normal' | 'reduced';
    celebrationIntensity: 'full' | 'minimal';
    messageFrequency: 'frequent' | 'occasional';
    reducedMotion: boolean;
  };
  interaction: {
    totalClicks: number;
    lastInteraction: string | null;
    favoriteMessages: string[];
    sessionStartTime: string | null;
    lastVisit: string | null;
  };
}

interface PersonalizationContextType {
  personalization: PersonalizationData;
  updatePersonalization: (updates: Partial<PersonalizationData>) => void;
  incrementClicks: () => void;
  updateLastInteraction: () => void;
  isFirstVisit: boolean;
  isReturningUser: boolean;
  sessionDuration: number;
}

const defaultPersonalization: PersonalizationData = {
  robotName: "Bizzy",
  colorTheme: "blue",
  preferences: {
    animationSpeed: "normal",
    celebrationIntensity: "full",
    messageFrequency: "frequent",
    reducedMotion: false
  },
  interaction: {
    totalClicks: 0,
    lastInteraction: null,
    favoriteMessages: [],
    sessionStartTime: new Date().toISOString(),
    lastVisit: null
  }
};

const PersonalizationContext = createContext<PersonalizationContextType | undefined>(undefined);

export const usePersonalization = () => {
  const context = useContext(PersonalizationContext);
  if (!context) {
    throw new Error('usePersonalization must be used within PersonalizationProvider');
  }
  return context;
};

interface PersonalizationProviderProps {
  children: ReactNode;
}

export const PersonalizationProvider: React.FC<PersonalizationProviderProps> = ({ children }) => {
  const [personalization, setPersonalization] = useState<PersonalizationData>(defaultPersonalization);
  const [sessionDuration, setSessionDuration] = useState(0);

  useEffect(() => {
    // Load from localStorage on mount
    const saved = localStorage.getItem('bizzy_personalization');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setPersonalization({
          ...parsed,
          interaction: {
            ...parsed.interaction,
            sessionStartTime: new Date().toISOString()
          }
        });
      } catch (error) {
        console.error('Error loading personalization data:', error);
      }
    }

    // Track session duration
    const interval = setInterval(() => {
      setSessionDuration(prev => prev + 1);
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Save to localStorage whenever personalization changes
    localStorage.setItem('bizzy_personalization', JSON.stringify(personalization));
  }, [personalization]);

  const updatePersonalization = (updates: Partial<PersonalizationData>) => {
    setPersonalization(prev => ({
      ...prev,
      ...updates,
      preferences: { ...prev.preferences, ...updates.preferences },
      interaction: { ...prev.interaction, ...updates.interaction }
    }));
  };

  const incrementClicks = () => {
    setPersonalization(prev => ({
      ...prev,
      interaction: {
        ...prev.interaction,
        totalClicks: prev.interaction.totalClicks + 1,
        lastInteraction: new Date().toISOString()
      }
    }));
  };

  const updateLastInteraction = () => {
    setPersonalization(prev => ({
      ...prev,
      interaction: {
        ...prev.interaction,
        lastInteraction: new Date().toISOString(),
        lastVisit: new Date().toISOString()
      }
    }));
  };

  const isFirstVisit = !personalization.interaction.lastVisit;
  const isReturningUser = personalization.interaction.totalClicks > 5;

  return (
    <PersonalizationContext.Provider value={{
      personalization,
      updatePersonalization,
      incrementClicks,
      updateLastInteraction,
      isFirstVisit,
      isReturningUser,
      sessionDuration
    }}>
      {children}
    </PersonalizationContext.Provider>
  );
};
