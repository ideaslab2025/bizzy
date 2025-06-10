import { useState, useEffect } from 'react';

type Theme = 'light';

export const useTheme = () => {
  const [theme] = useState<Theme>('light');
  const [resolvedTheme] = useState<'light'>('light');

  useEffect(() => {
    const root = window.document.documentElement;
    
    // Always set light theme
    root.classList.remove('light', 'dark');
    root.classList.add('light');
    root.setAttribute('data-theme', 'light');
  }, []);

  const setThemeValue = (newTheme: Theme) => {
    // Always keep light theme
    console.log('Theme switching disabled - using light mode only');
  };

  const toggleTheme = () => {
    // No-op since we only support light mode
    console.log('Theme switching disabled - using light mode only');
  };

  return {
    theme: 'light' as const,
    setTheme: setThemeValue,
    toggleTheme,
  };
};
