
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronRight, HelpCircle, RotateCcw, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

interface ProgressiveDisclosureProps {
  title: string;
  children: React.ReactNode;
  defaultExpanded?: boolean;
  level?: 'basic' | 'advanced' | 'expert';
  optional?: boolean;
  helpText?: string;
  onToggle?: (expanded: boolean) => void;
  className?: string;
  variant?: 'default' | 'card' | 'inline';
}

export const ProgressiveDisclosure: React.FC<ProgressiveDisclosureProps> = ({
  title,
  children,
  defaultExpanded = false,
  level = 'basic',
  optional = false,
  helpText,
  onToggle,
  className,
  variant = 'default',
}) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const [height, setHeight] = useState<number | 'auto'>(defaultExpanded ? 'auto' : 0);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (contentRef.current) {
      if (isExpanded) {
        setHeight(contentRef.current.scrollHeight);
      } else {
        setHeight(0);
      }
    }
  }, [isExpanded, children]);

  const handleToggle = () => {
    const newExpanded = !isExpanded;
    setIsExpanded(newExpanded);
    onToggle?.(newExpanded);
  };

  const getLevelInfo = (level: string) => {
    switch (level) {
      case 'advanced':
        return { 
          color: 'bg-orange-100 text-orange-700', 
          icon: Settings,
          description: 'Advanced options for power users' 
        };
      case 'expert':
        return { 
          color: 'bg-red-100 text-red-700', 
          icon: Settings,
          description: 'Expert-level configuration' 
        };
      default:
        return { 
          color: 'bg-blue-100 text-blue-700', 
          icon: ChevronRight,
          description: 'Basic configuration options' 
        };
    }
  };

  const levelInfo = getLevelInfo(level);

  if (variant === 'inline') {
    return (
      <div className={cn("space-y-2", className)}>
        <Button
          variant="ghost"
          onClick={handleToggle}
          className="h-auto p-2 justify-start text-sm font-normal hover:bg-gray-50"
        >
          <motion.div
            animate={{ rotate: isExpanded ? 90 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronRight className="w-4 h-4 mr-2" />
          </motion.div>
          {title}
          {optional && <Badge variant="outline" className="ml-2 text-xs">Optional</Badge>}
        </Button>
        
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="ml-6 border-l-2 border-gray-200 pl-4"
            >
              {children}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  if (variant === 'card') {
    return (
      <div className={cn("border rounded-lg", className)}>
        <button
          onClick={handleToggle}
          className="w-full p-4 text-left hover:bg-gray-50 transition-colors flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <motion.div
              animate={{ rotate: isExpanded ? 90 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </motion.div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-medium">{title}</span>
                {level !== 'basic' && (
                  <Badge variant="outline" className={levelInfo.color}>
                    {level}
                  </Badge>
                )}
                {optional && (
                  <Badge variant="outline" className="text-xs">
                    Optional
                  </Badge>
                )}
              </div>
              {helpText && (
                <p className="text-sm text-gray-500 mt-1">{helpText}</p>
              )}
            </div>
          </div>
          
          {helpText && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <HelpCircle className="w-4 h-4 text-gray-400" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs">{helpText}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </button>
        
        <motion.div
          initial={false}
          animate={{ height: isExpanded ? 'auto' : 0 }}
          transition={{ duration: 0.3, ease: [0.04, 0.62, 0.23, 0.98] }}
          className="overflow-hidden"
        >
          <div ref={contentRef} className="p-4 border-t bg-gray-50/50">
            {children}
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex items-center justify-between">
        <button
          onClick={handleToggle}
          className="flex items-center gap-2 text-left hover:text-blue-600 transition-colors group"
        >
          <motion.div
            animate={{ rotate: isExpanded ? 90 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDown className="w-4 h-4" />
          </motion.div>
          <span className="font-medium">{title}</span>
          {level !== 'basic' && (
            <Badge variant="outline" className={levelInfo.color}>
              {level}
            </Badge>
          )}
          {optional && (
            <Badge variant="outline" className="text-xs">
              Optional
            </Badge>
          )}
        </button>
        
        <div className="flex items-center gap-2">
          {helpText && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <HelpCircle className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs">{helpText}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
      </div>
      
      <motion.div
        initial={false}
        animate={{ 
          height: isExpanded ? 'auto' : 0,
          opacity: isExpanded ? 1 : 0,
        }}
        transition={{ 
          duration: 0.3, 
          ease: [0.04, 0.62, 0.23, 0.98],
          opacity: { duration: 0.2 }
        }}
        className="overflow-hidden"
      >
        <div 
          ref={contentRef}
          className={cn(
            "space-y-4",
            level === 'advanced' && "bg-orange-50/50 p-4 rounded-lg border border-orange-200",
            level === 'expert' && "bg-red-50/50 p-4 rounded-lg border border-red-200"
          )}
        >
          {children}
        </div>
      </motion.div>
    </div>
  );
};

// Multi-level disclosure component
interface MultiLevelDisclosureProps {
  levels: Array<{
    id: string;
    title: string;
    content: React.ReactNode;
    level: 'basic' | 'advanced' | 'expert';
    optional?: boolean;
    helpText?: string;
  }>;
  defaultLevel?: 'basic' | 'advanced' | 'expert';
  onLevelChange?: (level: string) => void;
  className?: string;
}

export const MultiLevelDisclosure: React.FC<MultiLevelDisclosureProps> = ({
  levels,
  defaultLevel = 'basic',
  onLevelChange,
  className,
}) => {
  const [activeLevel, setActiveLevel] = useState(defaultLevel);
  const [userPreferences, setUserPreferences] = useState<Record<string, boolean>>({});

  const handleLevelChange = (level: string) => {
    setActiveLevel(level as any);
    onLevelChange?.(level);
  };

  const resetToBasic = () => {
    setActiveLevel('basic');
    setUserPreferences({});
  };

  const levelOrder = ['basic', 'advanced', 'expert'];
  const activeLevelIndex = levelOrder.indexOf(activeLevel);

  return (
    <div className={cn("space-y-4", className)}>
      {/* Level Selector */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-700">View level:</span>
          <div className="flex border rounded-lg overflow-hidden">
            {levelOrder.map((level) => (
              <button
                key={level}
                onClick={() => handleLevelChange(level)}
                className={cn(
                  "px-3 py-1 text-sm capitalize transition-colors",
                  activeLevel === level
                    ? "bg-blue-600 text-white"
                    : "bg-white text-gray-600 hover:bg-gray-50"
                )}
              >
                {level}
              </button>
            ))}
          </div>
        </div>
        
        {activeLevel !== 'basic' && (
          <Button variant="ghost" size="sm" onClick={resetToBasic}>
            <RotateCcw className="w-4 h-4 mr-1" />
            Reset to Basic
          </Button>
        )}
      </div>

      {/* Content Sections */}
      <div className="space-y-4">
        {levels.map((levelConfig, index) => {
          const shouldShow = levelOrder.indexOf(levelConfig.level) <= activeLevelIndex;
          
          if (!shouldShow) return null;
          
          return (
            <ProgressiveDisclosure
              key={levelConfig.id}
              title={levelConfig.title}
              level={levelConfig.level}
              optional={levelConfig.optional}
              helpText={levelConfig.helpText}
              defaultExpanded={levelConfig.level === 'basic' || userPreferences[levelConfig.id]}
              onToggle={(expanded) => {
                setUserPreferences(prev => ({
                  ...prev,
                  [levelConfig.id]: expanded
                }));
              }}
              variant="card"
            >
              {levelConfig.content}
            </ProgressiveDisclosure>
          );
        })}
      </div>
    </div>
  );
};
