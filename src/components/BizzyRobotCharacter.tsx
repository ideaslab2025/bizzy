
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, Bot } from 'lucide-react';
import { cn } from '@/lib/utils';
import { usePersonalization } from '@/contexts/PersonalizationContext';
import { MobileRobotCustomization } from '@/components/personalization/MobileRobotCustomization';
import RobotChatInterface from '@/components/RobotChatInterface';

type AnimationState = 'idle' | 'celebration' | 'encouraging' | 'speaking';

interface BizzyRobotCharacterProps {
  animationState?: AnimationState;
  message?: string;
  onClick?: () => void;
  className?: string;
}

export const BizzyRobotCharacter: React.FC<BizzyRobotCharacterProps> = ({
  animationState = 'idle',
  message,
  onClick,
  className
}) => {
  const { personalization, incrementClicks, isMobile } = usePersonalization();
  const [currentState, setCurrentState] = useState<AnimationState>(animationState);
  const [showSpeechBubble, setShowSpeechBubble] = useState(true);
  const [showCustomization, setShowCustomization] = useState(false);
  const [announcementText, setAnnouncementText] = useState('');

  // Memoize theme colors to prevent recalculation
  const themeColors = useMemo(() => {
    const themes = {
      blue: { 
        primary: personalization.preferences.highContrast ? 'bg-blue-600' : 'from-blue-500 to-blue-600', 
        secondary: 'bg-blue-400', 
        accent: 'bg-blue-300' 
      },
      green: { 
        primary: personalization.preferences.highContrast ? 'bg-green-600' : 'from-green-500 to-green-600', 
        secondary: 'bg-green-400', 
        accent: 'bg-green-300' 
      },
      purple: { 
        primary: personalization.preferences.highContrast ? 'bg-purple-600' : 'from-purple-500 to-purple-600', 
        secondary: 'bg-purple-400', 
        accent: 'bg-purple-300' 
      },
      orange: { 
        primary: personalization.preferences.highContrast ? 'bg-orange-600' : 'from-orange-500 to-orange-600', 
        secondary: 'bg-orange-400', 
        accent: 'bg-orange-300' 
      }
    };
    return themes[personalization.colorTheme];
  }, [personalization.colorTheme, personalization.preferences.highContrast]);

  // Update animation state when prop changes
  useEffect(() => {
    setCurrentState(animationState);
  }, [animationState]);

  // Screen reader announcements
  useEffect(() => {
    if (personalization.accessibility.screenReaderEnabled && message) {
      setAnnouncementText(message);
      const timeout = setTimeout(() => setAnnouncementText(''), 100);
      return () => clearTimeout(timeout);
    }
  }, [message, personalization.accessibility.screenReaderEnabled]);

  const getAnimationSpeed = useCallback(() => {
    return personalization.preferences.animationSpeed === 'reduced' ? 2 : 1;
  }, [personalization.preferences.animationSpeed]);

  const robotVariants = useMemo(() => ({
    idle: {
      scale: personalization.preferences.reducedMotion ? [1] : [1, 1.02, 1],
      rotate: personalization.preferences.reducedMotion ? [0] : [0, -1, 1, 0],
      transition: {
        scale: {
          duration: 3 * getAnimationSpeed(),
          repeat: personalization.preferences.reducedMotion ? 0 : Infinity,
          ease: "easeInOut"
        },
        rotate: {
          duration: 4 * getAnimationSpeed(),
          repeat: personalization.preferences.reducedMotion ? 0 : Infinity,
          ease: "easeInOut"
        }
      }
    },
    celebration: {
      scale: personalization.preferences.reducedMotion ? [1] : [1, 1.1, 1],
      rotate: personalization.preferences.reducedMotion ? [0] : [0, 5, -5, 0],
      y: personalization.preferences.reducedMotion ? [0] : [0, -10, 0],
      transition: {
        duration: 0.6 * getAnimationSpeed(),
        repeat: personalization.preferences.celebrationIntensity === 'full' && !personalization.preferences.reducedMotion ? 3 : 1,
        ease: "easeInOut"
      }
    },
    encouraging: {
      scale: personalization.preferences.reducedMotion ? 1 : 1.05,
      y: personalization.preferences.reducedMotion ? 0 : -5,
      transition: {
        duration: 0.5 * getAnimationSpeed(),
        ease: "easeOut"
      }
    },
    speaking: {
      scale: personalization.preferences.reducedMotion ? 1 : 1.02,
      transition: {
        duration: 0.3 * getAnimationSpeed(),
        ease: "easeInOut"
      }
    }
  }), [personalization.preferences, getAnimationSpeed]);

  const handleRobotClick = useCallback(() => {
    incrementClicks();
    setCurrentState('celebration');
    onClick?.();
    
    // Return to idle after celebration
    const timeout = setTimeout(() => {
      setCurrentState('idle');
    }, 2000);

    return () => clearTimeout(timeout);
  }, [incrementClicks, onClick]);

  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleRobotClick();
    }
  }, [handleRobotClick]);

  const handleChatMessage = useCallback((message: string) => {
    setCurrentState('speaking');
    console.log('Bizzy received message:', message);
    
    // Return to idle after speaking animation
    setTimeout(() => {
      setCurrentState('idle');
    }, 3000);
  }, []);

  const robotSize = useMemo(() => {
    const baseSize = isMobile ? 'w-24 h-24' : 'w-32 h-32';
    return personalization.accessibility.touchTargetSize === 'large' ? 'w-36 h-36' : baseSize;
  }, [isMobile, personalization.accessibility.touchTargetSize]);

  const touchTargetSize = personalization.accessibility.touchTargetSize === 'large' ? 'min-h-[52px] min-w-[52px]' : 'min-h-[44px] min-w-[44px]';
  const textSize = personalization.preferences.textSize === 'large' ? 'text-base' : 'text-sm';

  return (
    <div className={cn("relative flex flex-col items-center", className)}>
      {/* Screen reader announcements */}
      <div 
        aria-live="polite" 
        aria-atomic="true" 
        className="sr-only"
      >
        {announcementText}
      </div>

      {/* Enhanced Customization Button */}
      <motion.button
        onClick={() => setShowCustomization(true)}
        className={`absolute -top-3 -right-3 z-10 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-full flex items-center justify-center transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-md border border-gray-200 dark:border-gray-600 ${touchTargetSize}`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        title="Robot Settings"
        aria-label="Open companion customization settings"
      >
        <Settings className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        
        {/* Settings label */}
        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
          Robot Settings
        </div>
      </motion.button>

      {/* Integrated Chat Interface - Positioned better */}
      <div className="absolute -top-6 -right-16 z-20">
        <RobotChatInterface 
          onMessageSent={handleChatMessage}
          className=""
        />
      </div>

      {/* Speech Bubble */}
      <AnimatePresence>
        {showSpeechBubble && message && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            transition={{ duration: personalization.preferences.reducedMotion ? 0.1 : 0.3 }}
            className={`relative bg-white dark:bg-gray-800 rounded-2xl px-4 py-3 mb-4 shadow-lg border border-gray-200 dark:border-gray-700 max-w-xs text-center ${
              personalization.preferences.highContrast ? 'border-2 border-black' : ''
            }`}
            role="status"
            aria-live="polite"
          >
            <p className={`${textSize} text-gray-700 dark:text-gray-300 font-medium ${
              personalization.preferences.highContrast ? 'font-bold text-black dark:text-white' : ''
            }`}>
              {message}
            </p>
            {/* Speech bubble arrow pointing toward robot */}
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full">
              <div className="w-0 h-0 border-l-[8px] border-r-[8px] border-t-[8px] border-l-transparent border-r-transparent border-t-white dark:border-t-gray-800"></div>
            </div>
            {/* Close button */}
            <button
              onClick={() => setShowSpeechBubble(false)}
              className={`absolute -top-2 -right-2 bg-gray-200 dark:bg-gray-600 rounded-full flex items-center justify-center text-xs text-gray-500 dark:text-gray-400 hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${touchTargetSize}`}
              aria-label="Close message"
            >
              ×
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bot Icon Character - Large version of header bot icon */}
      <motion.div
        variants={robotVariants}
        animate={currentState}
        onClick={handleRobotClick}
        onKeyDown={handleKeyPress}
        className={`relative cursor-pointer select-none focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50 rounded-full ${touchTargetSize} flex items-center justify-center ${robotSize} ${
          personalization.preferences.highContrast ? themeColors.primary : `bg-gradient-to-br ${themeColors.primary}`
        } shadow-lg`}
        whileHover={personalization.preferences.reducedMotion ? {} : { scale: 1.05 }}
        whileTap={personalization.preferences.reducedMotion ? {} : { scale: 0.95 }}
        role="button"
        tabIndex={0}
        aria-label={`Click ${personalization.robotName} for encouragement or start chatting`}
      >
        {/* Bot Icon - Significantly larger version of header icon */}
        <motion.div
          animate={
            currentState === 'speaking' && !personalization.preferences.reducedMotion
              ? { 
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, -5, 0]
                }
              : currentState === 'celebration' && !personalization.preferences.reducedMotion 
              ? { 
                  scale: [1, 1.2, 1],
                  rotate: [0, 10, -10, 0]
                } 
              : { scale: 1, rotate: 0 }
          }
          transition={
            currentState === 'speaking' 
              ? { duration: 0.5, repeat: Infinity, ease: "easeInOut" } 
              : currentState === 'celebration'
              ? { duration: 0.3, repeat: 3, ease: "easeInOut" }
              : { duration: 0.3 }
          }
        >
          <Bot 
            className={`${isMobile ? 'w-12 h-12' : 'w-16 h-16'} text-white`}
            strokeWidth={1.5}
          />
        </motion.div>

        {/* Celebration Effects */}
        <AnimatePresence>
          {currentState === 'celebration' && 
           personalization.preferences.celebrationIntensity === 'full' && 
           !personalization.preferences.reducedMotion && (
            <>
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ 
                    opacity: 1, 
                    scale: 0,
                    x: 0,
                    y: 0
                  }}
                  animate={{ 
                    opacity: 0, 
                    scale: 1,
                    x: (Math.random() - 0.5) * 100,
                    y: (Math.random() - 0.5) * 100
                  }}
                  exit={{ opacity: 0 }}
                  transition={{ 
                    duration: 1,
                    delay: i * 0.1,
                    ease: "easeOut"
                  }}
                  className="absolute top-1/2 left-1/2 w-2 h-2 bg-yellow-400 rounded-full"
                  aria-hidden="true"
                />
              ))}
            </>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Instruction Text */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className={`${textSize} text-gray-500 dark:text-gray-400 mt-2 text-center max-w-xs ${
          personalization.preferences.highContrast ? 'font-semibold text-gray-900 dark:text-gray-100' : ''
        }`}
      >
        Click {personalization.robotName} to chat or get encouragement!
      </motion.p>

      {/* Customization Modal */}
      <MobileRobotCustomization 
        isOpen={showCustomization}
        onClose={() => setShowCustomization(false)}
      />
    </div>
  );
};

export default BizzyRobotCharacter;
