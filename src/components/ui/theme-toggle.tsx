
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';

export const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <Button
        variant="ghost"
        size="sm"
        onClick={toggleTheme}
        className="relative h-8 w-8 p-0 transition-all duration-300 text-gray-700 hover:text-gray-900 hover:bg-white/50"
        aria-label="Toggle theme"
      >
        <div className="relative w-5 h-5">
          <motion.div
            className="absolute inset-0"
            animate={{ 
              rotate: theme === 'dark' ? 180 : 0,
              scale: theme === 'dark' ? 0 : 1,
              opacity: theme === 'dark' ? 0 : 1
            }}
            transition={{ duration: 0.3 }}
          >
            <Sun className="w-5 h-5" />
          </motion.div>
          <motion.div
            className="absolute inset-0"
            animate={{ 
              rotate: theme === 'dark' ? 0 : -180,
              scale: theme === 'dark' ? 1 : 0,
              opacity: theme === 'dark' ? 1 : 0
            }}
            transition={{ duration: 0.3 }}
          >
            <Moon className="w-5 h-5" />
          </motion.div>
        </div>
      </Button>
    </motion.div>
  );
};
