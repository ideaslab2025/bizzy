
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, FileText, CheckCircle, HelpCircle, Search, Home, Bot } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useHapticFeedback } from '@/utils/hapticFeedback';

interface FABAction {
  id: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  action: () => void;
  color?: string;
}

interface FloatingActionButtonProps {
  className?: string;
  onDrag?: (position: { x: number; y: number }) => void;
}

export const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({
  className,
  onDrag,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  
  const navigate = useNavigate();
  const location = useLocation();
  const { trigger } = useHapticFeedback();

  // Handle scroll visibility
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsVisible(currentScrollY <= lastScrollY || currentScrollY < 50);
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = () => {
      if (isExpanded) {
        setIsExpanded(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isExpanded]);

  // Close on route change
  useEffect(() => {
    setIsExpanded(false);
  }, [location.pathname]);

  // Get contextual actions based on current page
  const getContextualActions = (): FABAction[] => {
    const baseActions: FABAction[] = [
      {
        id: 'dashboard',
        icon: Home,
        label: 'Dashboard',
        action: () => navigate('/dashboard'),
        color: 'bg-blue-500',
      },
      {
        id: 'search',
        icon: Search,
        label: 'Search',
        action: () => {
          // Focus search input if available
          const searchInput = document.querySelector('input[placeholder*="search"]') as HTMLInputElement;
          if (searchInput) {
            searchInput.focus();
          } else {
            navigate('/dashboard/documents');
          }
        },
        color: 'bg-purple-500',
      },
      {
        id: 'help',
        icon: HelpCircle,
        label: 'Get Help',
        action: () => navigate('/guided-help'),
        color: 'bg-green-500',
      },
    ];

    // Add page-specific actions
    if (location.pathname.includes('/documents')) {
      baseActions.unshift({
        id: 'add-document',
        icon: FileText,
        label: 'Add Document',
        action: () => {
          console.log('Creating new document...');
        },
        color: 'bg-orange-500',
      });
    }

    if (location.pathname.includes('/guided-help')) {
      baseActions.unshift({
        id: 'complete-step',
        icon: CheckCircle,
        label: 'Mark Complete',
        action: () => {
          console.log('Marking step as complete...');
        },
        color: 'bg-green-500',
      });
    }

    return baseActions.slice(0, 4);
  };

  const actions = getContextualActions();

  const handleMainClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsExpanded(!isExpanded);
    trigger('selection');
  };

  const handleActionClick = (action: FABAction, e: React.MouseEvent) => {
    e.stopPropagation();
    action.action();
    setIsExpanded(false);
    trigger('success');
  };

  const handleRobotClick = () => {
    navigate('/progress-companion');
    trigger('light');
  };

  if (!isVisible) return null;

  return (
    <>
      {/* Backdrop when expanded */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
            style={{ pointerEvents: 'none' }}
          />
        )}
      </AnimatePresence>

      {/* Bottom Navigation Container */}
      <div className="fixed bottom-6 right-6 z-50 flex gap-3">
        {/* Progress Companion Button - Static, no animation */}
        <Button
          size="lg"
          className="w-14 h-14 rounded-full shadow-xl bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 transition-all duration-200 hover:scale-105"
          onClick={handleRobotClick}
          aria-label="Open Progress Companion"
        >
          <Bot className="w-6 h-6 text-white" />
        </Button>

        {/* Main FAB Container */}
        <div className={cn("relative", className)}>
          {/* Action Buttons */}
          <AnimatePresence>
            {isExpanded && (
              <div className="absolute bottom-16 right-0">
                {actions.map((action, index) => (
                  <motion.div
                    key={action.id}
                    initial={{ 
                      opacity: 0, 
                      scale: 0.3,
                      x: 20,
                      y: 20,
                    }}
                    animate={{ 
                      opacity: 1, 
                      scale: 1,
                      x: Math.cos((index * Math.PI) / (actions.length - 1) + Math.PI) * 80,
                      y: Math.sin((index * Math.PI) / (actions.length - 1) + Math.PI) * 80,
                    }}
                    exit={{ 
                      opacity: 0, 
                      scale: 0.3,
                      x: 20,
                      y: 20,
                    }}
                    transition={{ 
                      delay: index * 0.05,
                      type: "spring",
                      stiffness: 300,
                      damping: 20,
                    }}
                    className="absolute"
                  >
                    <Button
                      size="sm"
                      className={cn(
                        "w-12 h-12 rounded-full shadow-lg",
                        action.color || "bg-gray-600",
                        "hover:scale-110 transition-transform"
                      )}
                      onClick={(e) => handleActionClick(action, e)}
                    >
                      <action.icon className="w-5 h-5 text-white" />
                    </Button>
                    
                    {/* Action Label */}
                    <motion.div
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="absolute right-14 top-1/2 transform -translate-y-1/2 bg-gray-900 text-white px-2 py-1 rounded text-xs whitespace-nowrap"
                    >
                      {action.label}
                    </motion.div>
                  </motion.div>
                ))}
              </div>
            )}
          </AnimatePresence>

          {/* Main FAB */}
          <motion.div
            animate={{
              rotate: isExpanded ? 45 : 0,
            }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="relative"
          >
            <Button
              size="lg"
              className={cn(
                "w-14 h-14 rounded-full shadow-xl bg-blue-600 hover:bg-blue-700",
                "transition-all duration-200"
              )}
              onClick={handleMainClick}
            >
              <AnimatePresence mode="wait">
                {isExpanded ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <X className="w-6 h-6 text-white" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="plus"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Plus className="w-6 h-6 text-white" />
                  </motion.div>
                )}
              </AnimatePresence>
            </Button>

            {/* Ripple effect */}
            {isExpanded && (
              <motion.div
                initial={{ scale: 0, opacity: 0.5 }}
                animate={{ scale: 2, opacity: 0 }}
                transition={{ duration: 0.6 }}
                className="absolute inset-0 bg-blue-400 rounded-full"
              />
            )}
          </motion.div>
        </div>
      </div>
    </>
  );
};
