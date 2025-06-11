
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { UKBusinessChatbot } from '@/components/chatbot/UKBusinessChatbot';
import { BizzyRobotCharacter } from '@/components/BizzyRobotCharacter';
import { MilestoneReached } from '@/components/celebrations/MilestoneReached';
import { PersonalizationProvider, usePersonalization } from '@/contexts/PersonalizationContext';
import { ProgressProvider } from '@/contexts/ProgressContext';
import { useSmartMessaging } from '@/hooks/useSmartMessaging';
import { PullToRefresh } from '@/components/ui/pull-to-refresh';

const ProgressCompanionContent = () => {
  const navigate = useNavigate();
  const { personalization, sessionDuration, isMobile } = usePersonalization();
  const { getWelcomeMessage, getEncouragingMessage, getSessionMessage } = useSmartMessaging();
  
  const [activeMilestone, setActiveMilestone] = useState<{
    type: 'section_complete' | 'first_section' | 'halfway' | 'all_complete' | 'quick_wins';
    title: string;
    description: string;
  } | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Mock user progress data for the chat assistant
  const mockUserProgress = {
    completedSteps: [1, 2, 3],
    sectionCompletion: { 1: 75, 2: 50, 3: 25 }
  };

  // Announce important changes for screen readers
  useEffect(() => {
    if (personalization.accessibility.screenReaderEnabled && activeMilestone) {
      const announcement = `Achievement unlocked: ${activeMilestone.title}. ${activeMilestone.description}`;
      // Create temporary element for screen reader announcement
      const announcement_div = document.createElement('div');
      announcement_div.setAttribute('aria-live', 'assertive');
      announcement_div.setAttribute('aria-atomic', 'true');
      announcement_div.className = 'sr-only';
      announcement_div.textContent = announcement;
      document.body.appendChild(announcement_div);
      
      setTimeout(() => {
        document.body.removeChild(announcement_div);
      }, 1000);
    }
  }, [activeMilestone, personalization.accessibility.screenReaderEnabled]);

  const handleBackClick = () => {
    navigate('/dashboard');
  };

  const handleCloseMilestone = () => {
    setActiveMilestone(null);
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    
    // Simulate refresh - in real app this would reload progress data
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setIsRefreshing(false);
  };

  const handleRobotClick = () => {
    console.log('Robot clicked - encouraging interaction');
  };

  // Enhanced touch target sizing based on accessibility preferences
  const buttonClasses = `${
    personalization.accessibility.touchTargetSize === 'large' 
      ? 'min-h-[52px] min-w-[52px] p-4' 
      : 'min-h-[44px] min-w-[44px] p-3'
  } text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`;

  return (
    <div className={`min-h-screen ${
      personalization.preferences.highContrast 
        ? 'bg-white text-black' 
        : 'bg-gray-50 dark:bg-gray-900'
    }`}>
      {/* Header with Fixed Styling */}
      <header className={`sticky top-0 z-40 h-16 bg-white dark:bg-gray-800 border-b shadow-sm ${
        personalization.preferences.highContrast ? 'border-black border-2' : 'border-gray-200 dark:border-gray-700'
      }`}>
        <div className="h-full px-4 md:px-6 flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={handleBackClick}
            className={buttonClasses}
            aria-label="Go back to dashboard"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <h1 className={`text-lg md:text-2xl font-bold tracking-tight truncate ${
              personalization.preferences.textSize === 'large' ? 'text-xl md:text-3xl' : ''
            } ${
              personalization.preferences.highContrast ? 'text-black dark:text-white' : 'text-gray-900 dark:text-gray-100'
            }`}>
              Chat with Bizzy
            </h1>
          </div>

          {isMobile && (
            <Button 
              variant="ghost" 
              size="icon"
              className={buttonClasses}
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </Button>
          )}
        </div>
      </header>

      {/* Main Content with Pull-to-Refresh */}
      <PullToRefresh onRefresh={handleRefresh} disabled={isRefreshing}>
        <main className="p-4 md:p-8">
          <div className="max-w-7xl mx-auto">
            {/* Large Robot Character */}
            <div className="flex justify-center mb-8">
              <BizzyRobotCharacter
                message="Hi! I'm here to help you with your UK business setup. Ask me anything!"
                onClick={handleRobotClick}
                className="mb-6"
              />
            </div>

            {/* UK Business Chatbot Interface */}
            <div className={`${personalization.preferences.textSize === 'large' ? 'text-lg' : ''} w-full`}>
              <UKBusinessChatbot
                userProgress={mockUserProgress}
              />
            </div>
          </div>
        </main>
      </PullToRefresh>

      {/* Milestone Celebration Modal */}
      {activeMilestone && (
        <MilestoneReached 
          milestone={activeMilestone} 
          onClose={handleCloseMilestone} 
        />
      )}

      {/* Skip to main content link for screen readers */}
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-blue-600 text-white px-4 py-2 rounded-md z-50"
      >
        Skip to main content
      </a>
    </div>
  );
};

const ProgressCompanion = () => {
  return (
    <PersonalizationProvider>
      <ProgressProvider>
        <div id="main-content">
          <ProgressCompanionContent />
        </div>
      </ProgressProvider>
    </PersonalizationProvider>
  );
};

export default ProgressCompanion;
