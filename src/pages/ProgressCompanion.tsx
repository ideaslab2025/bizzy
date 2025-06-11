
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Bot, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import BizzyRobotCharacter from '@/components/BizzyRobotCharacter';
import { EnhancedBizzyAssistant } from '@/components/guidance/EnhancedBizzyAssistant';
import { MilestoneReached } from '@/components/celebrations/MilestoneReached';
import { PersonalizationProvider, usePersonalization } from '@/contexts/PersonalizationContext';
import { useSmartMessaging } from '@/hooks/useSmartMessaging';
import { PullToRefresh } from '@/components/ui/pull-to-refresh';

const ProgressCompanionContent = () => {
  const navigate = useNavigate();
  const { personalization, sessionDuration, isMobile } = usePersonalization();
  const { getWelcomeMessage, getEncouragingMessage, getSessionMessage } = useSmartMessaging();
  
  const [robotMessage, setRobotMessage] = useState("");
  const [robotAnimationState, setRobotAnimationState] = useState<'idle' | 'celebration' | 'encouraging'>('idle');
  const [activeMilestone, setActiveMilestone] = useState<{
    type: 'section_complete' | 'first_section' | 'halfway' | 'all_complete' | 'quick_wins';
    title: string;
    description: string;
  } | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showChatAssistant, setShowChatAssistant] = useState(true);

  // Mock user progress data for the chat assistant
  const mockUserProgress = {
    completedSteps: [1, 2, 3],
    sectionCompletion: { 1: 75, 2: 50, 3: 25 },
    recentSteps: []
  };

  // Mock current step and section data
  const mockCurrentStep = {
    id: 4,
    section_id: 2,
    title: "Register for Corporation Tax",
    content: "Complete your corporation tax registration with HMRC",
    order_number: 4,
    estimated_time_minutes: 45,
    difficulty_level: 'medium' as const,
    step_type: 'action' as const,
    video_url: null,
    external_links: null,
    rich_content: null,
    prerequisites: null,
    deadline_info: "Must be completed within 3 months of incorporation",
    quick_win: false,
    created_at: new Date().toISOString()
  };

  const mockCurrentSection = {
    id: 2,
    title: "Tax and Legal Setup",
    description: "Complete your tax registrations and legal requirements",
    order_number: 2,
    estimated_time_minutes: 120,
    icon: "receipt",
    color: "blue",
    created_at: new Date().toISOString()
  };

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

  const handleRobotClick = () => {
    const encouragingMessage = getEncouragingMessage({
      progressLevel: 35,
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

  const handleNavigateToStep = (sectionId: number, stepNumber: number) => {
    console.log(`Navigating to section ${sectionId}, step ${stepNumber}`);
    setRobotMessage(`Let me guide you to step ${stepNumber} in section ${sectionId}!`);
    setRobotAnimationState('encouraging');
    
    setTimeout(() => {
      setRobotAnimationState('idle');
    }, 3000);
  };

  const handleCloseMilestone = () => {
    setActiveMilestone(null);
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    
    // Simulate refresh - in real app this would reload progress data
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setRobotMessage("Chat updated! How can I help you with your business setup today?");
    setRobotAnimationState('encouraging');
    
    setTimeout(() => {
      setRobotAnimationState('idle');
    }, 2000);
    
    setIsRefreshing(false);
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
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
              personalization.preferences.highContrast 
                ? 'bg-blue-600' 
                : 'bg-gradient-to-br from-blue-500 to-blue-600'
            }`}>
              <Bot className="w-5 h-5 text-white" />
            </div>
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
          <div className="max-w-6xl mx-auto">
            {/* Robot Character Section */}
            <div className="text-center mb-6 md:mb-8">
              <BizzyRobotCharacter
                animationState={robotAnimationState}
                message={robotMessage}
                onClick={handleRobotClick}
                className="mb-6"
              />
            </div>

            {/* Chat Assistant Interface - Replaces Progress Dashboard */}
            <div className={`${personalization.preferences.textSize === 'large' ? 'text-lg' : ''} flex justify-center`}>
              <div className="w-full max-w-4xl">
                <EnhancedBizzyAssistant
                  isOpen={showChatAssistant}
                  onClose={() => setShowChatAssistant(false)}
                  currentStep={mockCurrentStep}
                  currentSection={mockCurrentSection}
                  userProgress={mockUserProgress}
                  onNavigateToStep={handleNavigateToStep}
                />
              </div>
            </div>

            {/* Toggle Chat Button for mobile */}
            {!showChatAssistant && (
              <div className="fixed bottom-6 right-6">
                <Button
                  onClick={() => setShowChatAssistant(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white rounded-full p-4 shadow-lg"
                  aria-label="Open chat assistant"
                >
                  <Bot className="w-6 h-6" />
                </Button>
              </div>
            )}
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
      <div id="main-content">
        <ProgressCompanionContent />
      </div>
    </PersonalizationProvider>
  );
};

export default ProgressCompanion;
