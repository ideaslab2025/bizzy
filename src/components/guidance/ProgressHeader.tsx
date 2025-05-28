
import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Clock, Target } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { EnhancedGuidanceSection, EnhancedGuidanceStep } from '@/types/guidance';

interface ProgressHeaderProps {
  currentSection: EnhancedGuidanceSection;
  currentStep: number;
  totalSteps: number;
  currentStepData?: EnhancedGuidanceStep;
  overallProgress: number;
  totalTimeSpent: number;
  achievementCount: number;
  sectionProgress: number;
}

export const ProgressHeader: React.FC<ProgressHeaderProps> = ({
  currentSection,
  currentStep,
  totalSteps,
  currentStepData,
  overallProgress,
  totalTimeSpent,
  achievementCount,
  sectionProgress
}) => {
  return (
    <div className="bg-gradient-to-r from-[#0088cc] to-[#00a6ff] p-6 text-white">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <span className="text-4xl">{currentSection.emoji}</span>
              {currentSection.title}
            </h1>
            <p className="text-white/80 mt-1 flex items-center gap-4">
              <span>Step {currentStep} of {totalSteps}</span>
              {currentStepData?.estimated_time_minutes && (
                <>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    About {currentStepData.estimated_time_minutes} minutes
                  </span>
                </>
              )}
              {currentStepData?.difficulty_level && (
                <>
                  <span>•</span>
                  <span className={cn(
                    "px-2 py-1 rounded text-xs font-medium",
                    currentStepData.difficulty_level === 'easy' && "bg-green-500/20",
                    currentStepData.difficulty_level === 'medium' && "bg-yellow-500/20",
                    currentStepData.difficulty_level === 'complex' && "bg-red-500/20"
                  )}>
                    {currentStepData.difficulty_level}
                  </span>
                </>
              )}
            </p>
          </div>
          
          {/* Quick stats */}
          <div className="flex gap-6 text-sm">
            <div className="text-center">
              <div className="text-2xl font-bold">{overallProgress}%</div>
              <div className="text-white/70">Complete</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{Math.round(totalTimeSpent / 60)}h</div>
              <div className="text-white/70">Time Invested</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{achievementCount}</div>
              <div className="text-white/70">Achievements</div>
            </div>
          </div>
        </div>
        
        {/* Visual progress bar */}
        <div className="relative h-3 bg-white/20 rounded-full overflow-hidden">
          <motion.div
            className="absolute inset-y-0 left-0 bg-white rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${sectionProgress}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
        
        {/* Section deadline warning */}
        {currentSection.deadline_days && sectionProgress < 100 && (
          <div className="mt-3 flex items-center gap-2 text-yellow-200">
            <Target className="w-4 h-4" />
            <span className="text-sm">
              Recommended completion: {currentSection.deadline_days} days from company formation
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
