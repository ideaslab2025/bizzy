
import { useState, useEffect } from 'react';

export interface CursorPreferences {
  enabled: boolean;
  magneticEffect: boolean;
  trail: boolean;
}

export const useCustomCursor = () => {
  const [preferences, setPreferences] = useState<CursorPreferences>(() => {
    const saved = localStorage.getItem('cursor-preferences');
    return saved ? JSON.parse(saved) : {
      enabled: true,
      magneticEffect: true,
      trail: false,
    };
  });

  useEffect(() => {
    localStorage.setItem('cursor-preferences', JSON.stringify(preferences));
  }, [preferences]);

  const updatePreference = <K extends keyof CursorPreferences>(
    key: K,
    value: CursorPreferences[K]
  ) => {
    setPreferences(prev => ({ ...prev, [key]: value }));
  };

  return {
    preferences,
    updatePreference,
  };
};
