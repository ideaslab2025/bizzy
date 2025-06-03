
import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { SectionProgress } from '@/hooks/useProgressTracking';

interface SectionProgressBarProps {
  section: SectionProgress;
  isRecommended?: boolean;
  onClick?: () => void;
  className?: string;
}

export const SectionProgressBar: React.FC<SectionProgressBarProps> = ({
  section,
  isRecommended = false,
  onClick,
  className
}) => {
  const getProgressColor = () => {
    if (section.percentage === 0) return 'bg-gray-300';
    if (section.percentage === 100) return 'bg-green-500';
    return 'bg-blue-500';
  };

  const getBarColor = () => {
    if (section.percentage === 0) return 'bg-gray-200';
    if (section.percentage === 100) return 'bg-green-100';
    return 'bg-blue-100';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      onClick={onClick}
      className={cn(
        "p-4 rounded-lg border transition-all duration-200",
        isRecommended 
          ? "border-blue-300 bg-blue-50 shadow-md cursor-pointer hover:shadow-lg" 
          : "border-gray-200 bg-white hover:shadow-sm",
        onClick && "cursor-pointer",
        className
      )}
    >
      {isRecommended && (
        <div className="flex items-center gap-2 mb-2">
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
          <span className="text-xs font-medium text-blue-700">Recommended Next</span>
        </div>
      )}
      
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="font-semibold text-gray-900 text-sm">{section.name}</h3>
          <p className="text-xs text-gray-600 mt-1">{section.description}</p>
        </div>
        <div className="text-right">
          <div className="text-sm font-medium text-gray-900">
            {section.completed}/{section.total}
          </div>
          <div className="text-xs text-gray-500">completed</div>
        </div>
      </div>
      
      {/* Progress bar */}
      <div className={cn("w-full h-2 rounded-full", getBarColor())}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${section.percentage}%` }}
          transition={{ duration: 1, ease: "easeInOut" }}
          className={cn("h-full rounded-full", getProgressColor())}
        />
      </div>
      
      {/* Next action */}
      {section.nextAction && section.percentage < 100 && (
        <div className="mt-2 text-xs text-gray-600">
          <span className="font-medium">Next: </span>
          {section.nextAction}
        </div>
      )}
      
      {section.percentage === 100 && (
        <div className="mt-2 flex items-center gap-1 text-xs text-green-600">
          <span>✓</span>
          <span className="font-medium">Section Complete!</span>
        </div>
      )}
    </motion.div>
  );
};
