
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings } from 'lucide-react';
import { cn } from '@/lib/utils';
import { usePersonalization } from '@/contexts/PersonalizationContext';
import { RobotCustomization } from '@/components/personalization/RobotCustomization';

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
  const { personalization, incrementClicks } = usePersonalization();
  const [currentState, setCurrentState] = useState<AnimationState>(animationState);
  const [isBlinking, setIsBlinking] = useState(false);
  const [showSpeechBubble, setShowSpeechBubble] = useState(true);
  const [showCustomization, setShowCustomization] = useState(false);

  // Get theme colors
  const getThemeColors = () => {
    const themes = {
      blue: { primary: 'from-blue-500 to-blue-600', secondary: 'bg-blue-400', accent: 'bg-blue-300' },
      green: { primary: 'from-green-500 to-green-600', secondary: 'bg-green-400', accent: 'bg-green-300' },
      purple: { primary: 'from-purple-500 to-purple-600', secondary: 'bg-purple-400', accent: 'bg-purple-300' },
      orange: { primary: 'from-orange-500 to-orange-600', secondary: 'bg-orange-400', accent: 'bg-orange-300' }
    };
    return themes[personalization.colorTheme];
  };

  const themeColors = getThemeColors();

  // Blink animation effect
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 150);
    }, 3500);

    return () => clearInterval(blinkInterval);
  }, []);

  // Update animation state when prop changes
  useEffect(() => {
    setCurrentState(animationState);
  }, [animationState]);

  const handleRobotClick = () => {
    incrementClicks();
    setCurrentState('celebration');
    onClick?.();
    
    // Return to idle after celebration
    setTimeout(() => {
      setCurrentState('idle');
    }, 2000);
  };

  const getAnimationSpeed = () => {
    return personalization.preferences.animationSpeed === 'reduced' ? 2 : 1;
  };

  const robotVariants = {
    idle: {
      scale: [1, 1.02, 1],
      rotate: [0, -1, 1, 0],
      transition: {
        scale: {
          duration: 3 * getAnimationSpeed(),
          repeat: Infinity,
          ease: "easeInOut"
        },
        rotate: {
          duration: 4 * getAnimationSpeed(),
          repeat: Infinity,
          ease: "easeInOut"
        }
      }
    },
    celebration: {
      scale: [1, 1.1, 1],
      rotate: [0, 5, -5, 0],
      y: [0, -10, 0],
      transition: {
        duration: 0.6 * getAnimationSpeed(),
        repeat: personalization.preferences.celebrationIntensity === 'full' ? 3 : 1,
        ease: "easeInOut"
      }
    },
    encouraging: {
      scale: 1.05,
      y: -5,
      transition: {
        duration: 0.5 * getAnimationSpeed(),
        ease: "easeOut"
      }
    }
  };

  const armVariants = {
    idle: {
      rotate: [0, 5, -5, 0],
      transition: {
        duration: 2 * getAnimationSpeed(),
        repeat: Infinity,
        ease: "easeInOut"
      }
    },
    celebration: {
      rotate: [-45, -30, -45],
      y: [-5, 0, -5],
      transition: {
        duration: 0.3 * getAnimationSpeed(),
        repeat: personalization.preferences.celebrationIntensity === 'full' ? 6 : 2,
        ease: "easeInOut"
      }
    },
    encouraging: {
      rotate: -30,
      y: -3,
      transition: {
        duration: 0.5 * getAnimationSpeed(),
        ease: "easeOut"
      }
    }
  };

  return (
    <div className={cn("relative flex flex-col items-center", className)}>
      {/* Customization Button */}
      <button
        onClick={() => setShowCustomization(true)}
        className="absolute -top-2 -right-2 z-10 w-8 h-8 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center transition-colors"
        title="Customize your companion"
      >
        <Settings className="w-4 h-4 text-gray-600" />
      </button>

      {/* Speech Bubble */}
      <AnimatePresence>
        {showSpeechBubble && message && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className="relative bg-white dark:bg-gray-800 rounded-2xl px-4 py-3 mb-4 shadow-lg border border-gray-200 dark:border-gray-700 max-w-xs text-center"
          >
            <p className="text-sm text-gray-700 dark:text-gray-300 font-medium">
              {message}
            </p>
            {/* Speech bubble arrow */}
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full">
              <div className="w-0 h-0 border-l-[8px] border-r-[8px] border-t-[8px] border-l-transparent border-r-transparent border-t-white dark:border-t-gray-800"></div>
            </div>
            {/* Close button */}
            <button
              onClick={() => setShowSpeechBubble(false)}
              className="absolute -top-2 -right-2 w-6 h-6 bg-gray-200 dark:bg-gray-600 rounded-full flex items-center justify-center text-xs text-gray-500 dark:text-gray-400 hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
            >
              ×
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Robot Character */}
      <motion.div
        variants={robotVariants}
        animate={personalization.preferences.reducedMotion ? 'idle' : currentState}
        onClick={handleRobotClick}
        className="relative cursor-pointer select-none"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {/* Robot Body */}
        <div className="relative">
          {/* Head */}
          <div className={`w-20 h-20 bg-gradient-to-br ${themeColors.primary} rounded-2xl relative mx-auto mb-2 shadow-lg`}>
            {/* Eyes */}
            <div className="flex justify-center items-center pt-4 gap-2">
              <motion.div
                animate={isBlinking ? { scaleY: 0.1 } : { scaleY: 1 }}
                transition={{ duration: 0.1 }}
                className="w-3 h-3 bg-white rounded-full"
              >
                <div className="w-2 h-2 bg-blue-900 rounded-full mt-0.5 ml-0.5"></div>
              </motion.div>
              <motion.div
                animate={isBlinking ? { scaleY: 0.1 } : { scaleY: 1 }}
                transition={{ duration: 0.1 }}
                className="w-3 h-3 bg-white rounded-full"
              >
                <div className="w-2 h-2 bg-blue-900 rounded-full mt-0.5 ml-0.5"></div>
              </motion.div>
            </div>
            
            {/* Mouth */}
            <motion.div
              animate={currentState === 'celebration' ? { scaleX: 1.2 } : { scaleX: 1 }}
              className="w-6 h-2 bg-white rounded-full mx-auto mt-2"
            ></motion.div>

            {/* Antenna */}
            <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
              <div className={`w-1 h-4 ${themeColors.secondary} rounded-full`}></div>
              <div className="w-2 h-2 bg-yellow-400 rounded-full -mt-1 -ml-0.5"></div>
            </div>
          </div>

          {/* Body */}
          <div className={`w-16 h-20 bg-gradient-to-br ${themeColors.primary} rounded-xl mx-auto relative shadow-lg`}>
            {/* Chest Panel */}
            <div className={`w-8 h-8 ${themeColors.accent} rounded-lg mx-auto pt-2 relative`}>
              <div className={`w-4 h-1 ${themeColors.secondary} rounded-full mx-auto mb-1`}></div>
              <div className={`w-3 h-1 ${themeColors.secondary} rounded-full mx-auto mb-1`}></div>
              <div className={`w-2 h-1 ${themeColors.secondary} rounded-full mx-auto`}></div>
            </div>

            {/* Arms */}
            <motion.div
              variants={armVariants}
              animate={personalization.preferences.reducedMotion ? 'idle' : currentState}
              className={`absolute -left-4 top-2 w-3 h-8 ${themeColors.secondary} rounded-full origin-top`}
            ></motion.div>
            <motion.div
              variants={armVariants}
              animate={personalization.preferences.reducedMotion ? 'idle' : currentState}
              className={`absolute -right-4 top-2 w-3 h-8 ${themeColors.secondary} rounded-full origin-top`}
              style={{ scaleX: -1 }}
            ></motion.div>
          </div>

          {/* Legs */}
          <div className="flex justify-center gap-2 mt-1">
            <div className={`w-3 h-8 ${themeColors.secondary} rounded-full`}></div>
            <div className={`w-3 h-8 ${themeColors.secondary} rounded-full`}></div>
          </div>

          {/* Celebration Effects */}
          <AnimatePresence>
            {currentState === 'celebration' && personalization.preferences.celebrationIntensity === 'full' && (
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
                  />
                ))}
              </>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Instruction Text */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center max-w-xs"
      >
        Click {personalization.robotName} for encouragement!
      </motion.p>

      {/* Customization Modal */}
      <RobotCustomization 
        isOpen={showCustomization}
        onClose={() => setShowCustomization(false)}
      />
    </div>
  );
};

export default BizzyRobotCharacter;
