import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { EnhancedGuidanceSection } from '@/types/guidance';
import { businessSections } from '@/data/businessSections';

interface SidebarSectionProps {
  section: EnhancedGuidanceSection & {
    completed_steps: number;
    total_steps: number;
    progress: number;
  };
  isActive: boolean;
  isCompleted: boolean;
  onClick: () => void;
}

export const SidebarSection: React.FC<SidebarSectionProps> = ({
  section,
  isActive,
  isCompleted,
  onClick
}) => {
  const progress = section.total_steps > 0 ? (section.completed_steps / section.total_steps) : 0;
  
  // Get the matching business section for icon
  const businessSection = businessSections.find(bs => bs.id === section.id);
  const IconComponent = businessSection?.icon;

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={cn(
        "w-full p-4 rounded-xl transition-all duration-300",
        "border-2 backdrop-blur-sm relative",
        isActive ? "border-white bg-white text-[#0088cc] shadow-xl" : 
        isCompleted ? "border-white/20 bg-white/10 text-white/80" : 
        "border-transparent hover:border-white/30 hover:bg-white/5"
      )}
    >
      <div className="flex items-start gap-3">
        {/* Animated progress ring with enhanced icon background */}
        <div className="relative">
          <svg className="w-12 h-12 -rotate-90">
            <circle
              cx="24"
              cy="24"
              r="20"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
              opacity="0.2"
            />
            <circle
              cx="24"
              cy="24"
              r="20"
              stroke={isCompleted ? "#10b981" : "currentColor"}
              strokeWidth="4"
              fill="none"
              strokeDasharray={`${2 * Math.PI * 20}`}
              strokeDashoffset={`${2 * Math.PI * 20 * (1 - progress)}`}
              className="transition-all duration-500"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            {isCompleted ? (
              <CheckCircle className="w-6 h-6 text-green-500" />
            ) : IconComponent ? (
              <div className="relative">
                {/* Enhanced white background with stronger contrast */}
                <div className="absolute inset-0 bg-white rounded-lg shadow-sm transform scale-125" />
                <div className="absolute inset-0 bg-gradient-to-br from-white to-gray-50 rounded-lg transform scale-125" />
                <IconComponent 
                  className={cn(
                    "w-6 h-6 relative z-10 drop-shadow-sm",
                    isActive 
                      ? "text-[#0088cc]" 
                      : businessSection?.iconColor 
                        ? businessSection.iconColor.replace('text-', 'text-').replace('-600', '-700')
                        : "text-gray-700"
                  )}
                  fill="none"
                  strokeWidth={2}
                />
              </div>
            ) : (
              <div className="relative">
                <div className="absolute inset-0 bg-white rounded-lg shadow-sm transform scale-125" />
                <span className="text-lg font-bold relative z-10 text-gray-700">{section.order_number}</span>
              </div>
            )}
          </div>
        </div>
        
        <div className="flex-1 text-left">
          <h3 className={cn(
            "font-semibold",
            isCompleted && !isActive && "line-through opacity-70"
          )}>
            {section.title}
          </h3>
          <p className="text-xs opacity-75 mt-1">
            {section.completed_steps}/{section.total_steps} steps • {section.estimated_time_minutes || 0} min
          </p>
          {section.deadline_days && !isCompleted && (
            <p className="text-xs text-yellow-300 mt-1 flex items-center gap-1">
              <Clock className="w-3 h-3" />
              Due in {section.deadline_days} days
            </p>
          )}
        </div>
      </div>
      
      {/* Completion celebration animation */}
      {isCompleted && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute -top-2 -right-2 bg-green-500 text-white rounded-full p-1"
        >
          <CheckCircle className="w-4 h-4" />
        </motion.div>
      )}
    </motion.button>
  );
};
