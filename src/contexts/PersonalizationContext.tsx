
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface PersonalizationData {
  robotName: string;
  colorTheme: 'blue' | 'green' | 'purple' | 'orange';
  preferences: {
    animationSpeed: 'normal' | 'reduced';
    celebrationIntensity: 'full' | 'minimal';
    messageFrequency: 'frequent' | 'occasional';
    reducedMotion: boolean;
    highContrast: boolean;
    textSize: 'normal' | 'large';
    soundEnabled: boolean;
  };
  interaction: {
    totalClicks: number;
    lastInteraction: string | null;
    favoriteMessages: string[];
    sessionStartTime: string | null;
    lastVisit: string | null;
  };
  accessibility: {
    screenReaderEnabled: boolean;
    keyboardNavigation: boolean;
    touchTargetSize: 'normal' | 'large';
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
  isMobile: boolean;
}

const defaultPersonalization: PersonalizationData = {
  robotName: "Bizzy",
  colorTheme: "blue",
  preferences: {
    animationSpeed: "normal",
    celebrationIntensity: "full",
    messageFrequency: "frequent",
    reducedMotion: false,
    highContrast: false,
    textSize: "normal",
    soundEnabled: false
  },
  interaction: {
    totalClicks: 0,
    lastInteraction: null,
    favoriteMessages: [],
    sessionStartTime: new Date().toISOString(),
    lastVisit: null
  },
  accessibility: {
    screenReaderEnabled: false,
    keyboardNavigation: false,
    touchTargetSize: "normal"
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
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768 || /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Detect system accessibility preferences
  useEffect(() => {
    const detectAccessibilityPreferences = () => {
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const prefersHighContrast = window.matchMedia('(prefers-contrast: high)').matches;
      
      if (prefersReducedMotion || prefersHighContrast) {
        setPersonalization(prev => ({
          ...prev,
          preferences: {
            ...prev.preferences,
            reducedMotion: prefersReducedMotion,
            highContrast: prefersHighContrast,
            animationSpeed: prefersReducedMotion ? 'reduced' : prev.preferences.animationSpeed,
            celebrationIntensity: prefersReducedMotion ? 'minimal' : prev.preferences.celebrationIntensity
          }
        }));
      }
    };

    detectAccessibilityPreferences();
  }, []);

  useEffect(() => {
    // Load from localStorage on mount
    const saved = localStorage.getItem('bizzy_personalization');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Merge with defaults to ensure new properties exist
        const merged = {
          ...defaultPersonalization,
          ...parsed,
          preferences: { ...defaultPersonalization.preferences, ...parsed.preferences },
          accessibility: { ...defaultPersonalization.accessibility, ...parsed.accessibility },
          interaction: {
            ...defaultPersonalization.interaction,
            ...parsed.interaction,
            sessionStartTime: new Date().toISOString()
          }
        };
        setPersonalization(merged);
      } catch (error) {
        console.error('Error loading personalization data:', error);
        // Reset to defaults if corrupted
        localStorage.removeItem('bizzy_personalization');
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
    try {
      localStorage.setItem('bizzy_personalization', JSON.stringify(personalization));
    } catch (error) {
      console.error('Error saving personalization data:', error);
    }
  }, [personalization]);

  const updatePersonalization = (updates: Partial<PersonalizationData>) => {
    setPersonalization(prev => ({
      ...prev,
      ...updates,
      preferences: { ...prev.preferences, ...updates.preferences },
      interaction: { ...prev.interaction, ...updates.interaction },
      accessibility: { ...prev.accessibility, ...updates.accessibility }
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
      sessionDuration,
      isMobile
    }}>
      {children}
    </PersonalizationContext.Provider>
  );
};
