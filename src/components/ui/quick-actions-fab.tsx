
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Bell, FileText, HelpCircle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface QuickActionsFabProps {
  onSearchClick: () => void;
  onDocumentsClick: () => void;
  onHelpClick: () => void;
  className?: string;
}

export const QuickActionsFab: React.FC<QuickActionsFabProps> = ({
  onSearchClick,
  onDocumentsClick,
  onHelpClick,
  className
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const actions = [
    {
      icon: Search,
      label: 'Search',
      onClick: onSearchClick,
      color: 'bg-blue-500 hover:bg-blue-600'
    },
    {
      icon: FileText,
      label: 'Documents',
      onClick: onDocumentsClick,
      color: 'bg-green-500 hover:bg-green-600'
    },
    {
      icon: HelpCircle,
      label: 'Help',
      onClick: onHelpClick,
      color: 'bg-purple-500 hover:bg-purple-600'
    }
  ];

  return (
    <div className={cn("fixed bottom-6 right-6 z-50", className)}>
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            className="absolute bottom-16 right-0 space-y-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
          >
            {actions.map((action, index) => {
              const IconComponent = action.icon;
              return (
                <motion.div
                  key={action.label}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-3"
                >
                  <span className="bg-white px-2 py-1 rounded-lg shadow-lg text-sm font-medium whitespace-nowrap">
                    {action.label}
                  </span>
                  <Button
                    size="sm"
                    className={cn("w-12 h-12 rounded-full shadow-lg", action.color)}
                    onClick={() => {
                      action.onClick();
                      setIsOpen(false);
                    }}
                  >
                    <IconComponent className="w-5 h-5 text-white" />
                  </Button>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      <Button
        size="lg"
        className="w-14 h-14 rounded-full bg-blue-600 hover:bg-blue-700 shadow-lg"
        onClick={() => setIsOpen(!isOpen)}
      >
        <motion.div
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ duration: 0.2 }}
        >
          {isOpen ? (
            <X className="w-6 h-6 text-white" />
          ) : (
            <Plus className="w-6 h-6 text-white" />
          )}
        </motion.div>
      </Button>
    </div>
  );
};
