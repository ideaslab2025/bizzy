
import React from 'react';
import { Button } from '@/components/ui/button';
import { sun, moon } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';

export const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleTheme}
      className="relative h-8 w-8 p-0 transition-all duration-300"
      aria-label="Toggle theme"
    >
      <div className="relative w-4 h-4">
        <div
          className={`absolute inset-0 transition-all duration-300 ${
            theme === 'dark' ? 'rotate-90 scale-0' : 'rotate-0 scale-100'
          }`}
        >
          <sun className="w-4 h-4" />
        </div>
        <div
          className={`absolute inset-0 transition-all duration-300 ${
            theme === 'dark' ? 'rotate-0 scale-100' : '-rotate-90 scale-0'
          }`}
        >
          <moon className="w-4 h-4" />
        </div>
      </div>
    </Button>
  );
};
