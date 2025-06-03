
import React from 'react';
import { motion } from 'framer-motion';
import { CircularProgressRing } from './CircularProgressRing';
import { SectionProgressBar } from './SectionProgressBar';
import { useProgressTracking } from '@/hooks/useProgressTracking';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ProgressTrackingDashboardProps {
  onProgressUpdate?: (overallProgress: number) => void;
  onSectionComplete?: (sectionName: string) => void;
}

export const ProgressTrackingDashboard: React.FC<ProgressTrackingDashboardProps> = ({
  onProgressUpdate,
  onSectionComplete
}) => {
  const { progressData, updateSectionProgress, getNextRecommendedSection } = useProgressTracking();
  const nextSection = getNextRecommendedSection();

  const handleSectionClick = (sectionKey: keyof typeof progressData.sections) => {
    const section = progressData.sections[sectionKey];
    if (section.percentage < 100) {
      // Demo: increment progress by 1
      const newCompleted = Math.min(section.completed + 1, section.total);
      const updatedData = updateSectionProgress(sectionKey, newCompleted);
      
      onProgressUpdate?.(updatedData.overallCompletion);
      
      if (updatedData.sections[sectionKey].percentage === 100) {
        onSectionComplete?.(section.name);
      }
    }
  };

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  return (
    <div className="space-y-6">
      {/* Overall Progress Section */}
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Your Business Setup Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row items-center justify-center gap-8">
            <div className="flex flex-col items-center">
              <CircularProgressRing 
                percentage={progressData.overallCompletion}
                size={140}
                strokeWidth={10}
              />
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="mt-4 text-center"
              >
                <div className="text-lg font-semibold text-gray-900">
                  {progressData.totalCompleted} of {progressData.totalItems} tasks completed
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  Estimated time remaining: {formatTime(progressData.estimatedTimeRemaining)}
                </div>
              </motion.div>
            </div>
            
            {nextSection && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                className="text-center md:text-left"
              >
                <h3 className="font-semibold text-gray-900 mb-2">Recommended Next Step</h3>
                <div className="text-blue-600 font-medium">{nextSection.section.name}</div>
                <div className="text-sm text-gray-600 mt-1">{nextSection.section.nextAction}</div>
                <Button
                  onClick={() => handleSectionClick(nextSection.key as keyof typeof progressData.sections)}
                  className="mt-3"
                  size="sm"
                >
                  Continue Setup
                </Button>
              </motion.div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Section Progress Bars */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Business Setup Sections</CardTitle>
          <p className="text-sm text-gray-600">
            Click on any section to make progress (demo mode)
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Object.entries(progressData.sections).map(([key, section], index) => (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <SectionProgressBar
                  section={section}
                  isRecommended={nextSection?.key === key}
                  onClick={() => handleSectionClick(key as keyof typeof progressData.sections)}
                />
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                // Demo: add progress to a random incomplete section
                const incompleteSections = Object.entries(progressData.sections)
                  .filter(([_, section]) => section.percentage < 100);
                if (incompleteSections.length > 0) {
                  const randomSection = incompleteSections[Math.floor(Math.random() * incompleteSections.length)];
                  handleSectionClick(randomSection[0] as keyof typeof progressData.sections);
                }
              }}
            >
              Mark Task Complete
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                // Demo: reset progress
                Object.keys(progressData.sections).forEach(key => {
                  updateSectionProgress(key as keyof typeof progressData.sections, 0);
                });
              }}
            >
              Reset Progress (Demo)
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
