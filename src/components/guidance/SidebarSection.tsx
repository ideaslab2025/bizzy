
import React from 'react';
import { motion } from 'framer-motion';
import { Check, Lock, PlayCircle } from 'lucide-react';
import { EnhancedGuidanceSection } from '@/types/guidance';

interface SidebarSectionProps {
  section: EnhancedGuidanceSection;
  isActive: boolean;
  isCompleted: boolean;
  isLocked: boolean;
  progress: number;
  onClick: () => void;
}

export const SidebarSection: React.FC<SidebarSectionProps> = ({
  section,
  isActive,
  isCompleted,
  isLocked,
  progress,
  onClick
}) => {
  const getSectionIcon = (sectionId: number) => {
    const iconMap = {
      1: PlayCircle, // Launch Essentials
      2: PlayCircle, // Financial Setup
      3: PlayCircle, // Employment & HR
      4: PlayCircle, // Legal & Compliance
      5: PlayCircle, // Ongoing Operations
      6: PlayCircle, // Data Protection & GDPR
      7: PlayCircle, // Insurance & Risk
      8: PlayCircle, // Business Growth
      9: PlayCircle, // Technology & Systems
      10: PlayCircle, // Sector Requirements
    };
    return iconMap[sectionId as keyof typeof iconMap] || PlayCircle;
  };

  const getSectionColor = (sectionId: number) => {
    const colorMap = {
      1: 'text-blue-400', // Launch Essentials - Blue
      2: 'text-green-400', // Financial Setup - Green
      3: 'text-orange-400', // Employment & HR - Orange
      4: 'text-red-400', // Legal & Compliance - Red
      5: 'text-purple-400', // Ongoing Operations - Purple
      6: 'text-indigo-400', // Data Protection & GDPR - Indigo
      7: 'text-amber-400', // Insurance & Risk - Amber
      8: 'text-emerald-400', // Business Growth - Emerald
      9: 'text-sky-400', // Technology & Systems - Sky
      10: 'text-rose-400', // Sector Requirements - Rose
    };
    return colorMap[sectionId as keyof typeof colorMap] || 'text-white';
  };

  const Icon = getSectionIcon(section.id);
  const iconColorClass = getSectionColor(section.id);

  return (
    <motion.button
      onClick={onClick}
      disabled={isLocked}
      className={`
        w-full text-left p-4 rounded-lg mb-2 transition-all duration-200
        ${isActive 
          ? 'bg-white/20 border-l-4 border-white shadow-lg' 
          : 'hover:bg-white/10'
        }
        ${isLocked ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
      `}
      whileHover={isLocked ? {} : { x: 4 }}
      whileTap={isLocked ? {} : { scale: 0.98 }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className={`
            w-8 h-8 rounded-full flex items-center justify-center
            ${isCompleted 
              ? 'bg-green-500' 
              : isLocked 
                ? 'bg-gray-400/50' 
                : 'bg-white/20 backdrop-blur-sm'
            }
          `}>
            {isCompleted ? (
              <Check className="w-4 h-4 text-white" strokeWidth={2} />
            ) : isLocked ? (
              <Lock className="w-3 h-3 text-white/70" strokeWidth={2} />
            ) : (
              <Icon className={`w-4 h-4 ${iconColorClass}`} strokeWidth={2} />
            )}
          </div>
          <div>
            <h3 className={`
              font-medium text-sm
              ${isActive ? 'text-white' : 'text-white/90'}
            `}>
              {section.title}
            </h3>
            <p className="text-xs text-white/70 mt-1">
              {progress}% complete
            </p>
          </div>
        </div>
        
        {/* Progress indicator */}
        <div className="w-12 text-right">
          <div className="w-full bg-white/20 rounded-full h-1.5">
            <motion.div
              className="bg-white rounded-full h-1.5"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5, delay: 0.1 }}
            />
          </div>
        </div>
      </div>
    </motion.button>
  );
};
