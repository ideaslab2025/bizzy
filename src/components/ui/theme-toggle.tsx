
import React from 'react';
import { Button } from '@/components/ui/button';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';

export const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleTheme}
      className="relative h-8 w-8 p-0 transition-all duration-300 text-gray-700 hover:text-gray-900 hover:bg-white/50"
      aria-label="Toggle theme"
    >
      <div className="relative w-5 h-5">
        <div
          className={`absolute inset-0 transition-all duration-300 ${
            theme === 'dark' ? 'rotate-90 scale-0' : 'rotate-0 scale-100'
          }`}
        >
          <Sun className="w-5 h-5" />
        </div>
        <div
          className={`absolute inset-0 transition-all duration-300 ${
            theme === 'dark' ? 'rotate-0 scale-100' : '-rotate-90 scale-0'
          }`}
        >
          <Moon className="w-5 h-5" />
        </div>
      </div>
    </Button>
  );
};
