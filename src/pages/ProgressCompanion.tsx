
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Bot } from 'lucide-react';
import { Button } from '@/components/ui/button';
import BizzyRobotCharacter from '@/components/BizzyRobotCharacter';
import { ProgressTrackingDashboard } from '@/components/progress/ProgressTrackingDashboard';

const ProgressCompanion = () => {
  const navigate = useNavigate();
  const [robotMessage, setRobotMessage] = useState("Hi! I'm here to help you track your business setup progress!");
  const [robotAnimationState, setRobotAnimationState] = useState<'idle' | 'celebration' | 'encouraging'>('idle');

  const handleBackClick = () => {
    navigate('/dashboard');
  };

  const handleRobotClick = () => {
    const encouragingMessages = [
      "You're doing great! Keep up the excellent work!",
      "Every step forward is progress toward your business goals!",
      "I believe in your success! You've got this!",
      "Your business journey is inspiring! Stay focused!",
      "Progress, not perfection! You're on the right track!"
    ];
    
    const randomMessage = encouragingMessages[Math.floor(Math.random() * encouragingMessages.length)];
    setRobotMessage(randomMessage);
    setRobotAnimationState('encouraging');
    
    setTimeout(() => {
      setRobotAnimationState('idle');
    }, 3000);
  };

  const handleProgressUpdate = (overallProgress: number) => {
    if (overallProgress > 0 && overallProgress % 20 === 0) {
      setRobotMessage(`Amazing! You've reached ${overallProgress}% completion! 🎉`);
      setRobotAnimationState('celebration');
      
      setTimeout(() => {
        setRobotAnimationState('idle');
        setRobotMessage("What would you like to work on next?");
      }, 4000);
    }
  };

  const handleSectionComplete = (sectionName: string) => {
    setRobotMessage(`Congratulations! You've completed the ${sectionName} section! 🌟`);
    setRobotAnimationState('celebration');
    
    setTimeout(() => {
      setRobotAnimationState('idle');
      setRobotMessage("Ready to tackle the next section?");
    }, 5000);
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
    </div>
  );
};

export default ProgressCompanion;
