
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Bot } from 'lucide-react';
import { Button } from '@/components/ui/button';
import BizzyRobotCharacter from '@/components/BizzyRobotCharacter';
import { ProgressTrackingDashboard } from '@/components/progress/ProgressTrackingDashboard';
import { MilestoneReached } from '@/components/celebrations/MilestoneReached';
import { PersonalizationProvider, usePersonalization } from '@/contexts/PersonalizationContext';
import { useSmartMessaging } from '@/hooks/useSmartMessaging';

const ProgressCompanionContent = () => {
  const navigate = useNavigate();
  const { personalization, sessionDuration } = usePersonalization();
  const { getWelcomeMessage, getEncouragingMessage, getContextualMessage, getSessionMessage } = useSmartMessaging();
  
  const [robotMessage, setRobotMessage] = useState("");
  const [robotAnimationState, setRobotAnimationState] = useState<'idle' | 'celebration' | 'encouraging'>('idle');
  const [activeMilestone, setActiveMilestone] = useState<{
    type: 'section_complete' | 'first_section' | 'halfway' | 'all_complete' | 'quick_wins';
    title: string;
    description: string;
  } | null>(null);

  // Initialize with welcome message
  useEffect(() => {
    setRobotMessage(getWelcomeMessage());
  }, [getWelcomeMessage]);

  // Check for session messages
  useEffect(() => {
    const sessionMsg = getSessionMessage(sessionDuration);
    if (sessionMsg && sessionDuration > 0) {
      setRobotMessage(sessionMsg);
      setRobotAnimationState('encouraging');
      setTimeout(() => setRobotAnimationState('idle'), 3000);
    }
  }, [sessionDuration, getSessionMessage]);

  const handleBackClick = () => {
    navigate('/dashboard');
  };

  const handleRobotClick = () => {
    const encouragingMessage = getEncouragingMessage({
      progressLevel: 35, // This would come from actual progress data
      timeOfDay: 'afternoon',
      sessionDuration,
      completedSections: 2,
      isStuck: false
    });
    
    setRobotMessage(encouragingMessage);
    setRobotAnimationState('encouraging');
    
    setTimeout(() => {
      setRobotAnimationState('idle');
    }, 3000);
  };

  const handleProgressUpdate = (overallProgress: number) => {
    if (overallProgress > 0 && overallProgress % 20 === 0) {
      setRobotMessage(`Amazing! You've reached ${overallProgress}% completion! 🎉`);
      setRobotAnimationState('celebration');
      
      // Show milestone celebration for major milestones
      if (overallProgress === 20) {
        setActiveMilestone({
          type: 'first_section',
          title: 'Getting Started! 🎯',
          description: 'Great start! You\'re building solid foundations for your business!'
        });
      } else if (overallProgress === 40) {
        setActiveMilestone({
          type: 'quick_wins',
          title: 'Quick Win Champion! ⚡',
          description: 'You\'re making excellent progress! Keep up the momentum!'
        });
      } else if (overallProgress === 60) {
        setActiveMilestone({
          type: 'halfway',
          title: 'Halfway Hero! 🏆',
          description: 'You\'re halfway there! Your business is really taking shape!'
        });
      } else if (overallProgress === 80) {
        setActiveMilestone({
          type: 'section_complete',
          title: 'Nearly There! 🎖️',
          description: 'So close! Just a few more steps to complete your business setup!'
        });
      } else if (overallProgress === 100) {
        setActiveMilestone({
          type: 'all_complete',
          title: 'Business Setup Master! 👑',
          description: 'Congratulations! You\'ve completed your entire business setup journey!'
        });
      }
      
      setTimeout(() => {
        setRobotAnimationState('idle');
        setRobotMessage("What would you like to work on next?");
      }, 4000);
    }
  };

  const handleSectionComplete = (sectionName: string) => {
    const contextualMessage = getContextualMessage(sectionName, 'completed');
    setRobotMessage(contextualMessage);
    setRobotAnimationState('celebration');
    
    setTimeout(() => {
      setRobotAnimationState('idle');
      setRobotMessage("Ready to tackle the next section?");
    }, 5000);
  };

  const handleCloseMilestone = () => {
    setActiveMilestone(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-40 h-16 bg-white border-b border-gray-200 shadow-sm">
        <div className="h-full px-4 md:px-6 flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={handleBackClick}
            className="text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg p-3 transition-all duration-200 min-h-[44px] min-w-[44px]"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl md:text-2xl font-bold text-gray-900 tracking-tight">
              Your Business Setup Companion
            </h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-4 md:p-8">
        <div className="max-w-6xl mx-auto">
          {/* Robot Character Section */}
          <div className="text-center mb-8">
            <BizzyRobotCharacter
              animationState={robotAnimationState}
              message={robotMessage}
              onClick={handleRobotClick}
              className="mb-6"
            />
          </div>

          {/* Progress Tracking Dashboard */}
          <ProgressTrackingDashboard
            onProgressUpdate={handleProgressUpdate}
            onSectionComplete={handleSectionComplete}
          />
        </div>
      </main>

      {/* Milestone Celebration Modal */}
      {activeMilestone && (
        <MilestoneReached 
          milestone={activeMilestone} 
          onClose={handleCloseMilestone} 
        />
      )}
    </div>
  );
};

const ProgressCompanion = () => {
  return (
    <PersonalizationProvider>
      <ProgressCompanionContent />
    </PersonalizationProvider>
  );
};

export default ProgressCompanion;
