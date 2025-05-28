
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

interface SwipeableStepContentProps {
  children: React.ReactNode;
  onNext: () => void;
  onPrev: () => void;
  canGoNext: boolean;
  canGoPrev: boolean;
  currentStep: number;
  totalSteps: number;
}

export const SwipeableStepContent: React.FC<SwipeableStepContentProps> = ({
  children,
  onNext,
  onPrev,
  canGoNext,
  canGoPrev,
  currentStep,
  totalSteps
}) => {
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | null>(null);
  const [startX, setStartX] = useState<number | null>(null);
  const [currentX, setCurrentX] = useState<number | null>(null);
  const isMobile = useIsMobile();

  const handleTouchStart = (e: React.TouchEvent) => {
    if (!isMobile) return;
    setStartX(e.touches[0].clientX);
    setCurrentX(e.touches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isMobile || startX === null) return;
    setCurrentX(e.touches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!isMobile || startX === null || currentX === null) return;
    
    const deltaX = currentX - startX;
    const threshold = 50;

    if (Math.abs(deltaX) > threshold) {
      if (deltaX > 0 && canGoPrev) {
        // Swipe right (go to previous)
        setSwipeDirection('right');
        setTimeout(() => {
          onPrev();
          setSwipeDirection(null);
        }, 300);
      } else if (deltaX < 0 && canGoNext) {
        // Swipe left (go to next)
        setSwipeDirection('left');
        setTimeout(() => {
          onNext();
          setSwipeDirection(null);
        }, 300);
      }
    }

    setStartX(null);
    setCurrentX(null);
  };

  const getSwipeOffset = () => {
    if (!isMobile || startX === null || currentX === null) return 0;
    const deltaX = currentX - startX;
    const threshold = 50;
    
    // Limit the offset to prevent excessive movement
    return Math.max(-threshold, Math.min(threshold, deltaX)) * 0.5;
  };

  return (
    <div className="relative overflow-hidden">
      <div 
        className="touch-pan-y select-none"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ 
              x: swipeDirection === 'left' ? 100 : swipeDirection === 'right' ? -100 : 0,
              opacity: 0 
            }}
            animate={{ 
              x: getSwipeOffset(), 
              opacity: 1 
            }}
            exit={{ 
              x: swipeDirection === 'left' ? -100 : swipeDirection === 'right' ? 100 : 0,
              opacity: 0 
            }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </div>
      
      {/* Mobile swipe indicators */}
      {isMobile && (
        <div className="fixed bottom-24 left-0 right-0 px-8 z-30">
          <div className="flex justify-between items-center">
            {/* Left swipe indicator */}
            <motion.div
              animate={{ 
                x: canGoPrev ? [-5, 0, -5] : 0,
                opacity: canGoPrev ? [0.5, 1, 0.5] : 0.3
              }}
              transition={{ 
                repeat: Infinity, 
                duration: 2,
                ease: "easeInOut"
              }}
              className="flex items-center gap-1 text-gray-400"
            >
              <ChevronLeft className="w-5 h-5" />
              <span className="text-sm">Swipe</span>
            </motion.div>
            
            {/* Step dots */}
            <div className="flex gap-2">
              {Array.from({ length: totalSteps }).map((_, index) => (
                <div
                  key={index}
                  className={cn(
                    "w-2 h-2 rounded-full transition-all duration-300",
                    index === currentStep - 1 
                      ? "bg-[#0088cc] w-6" 
                      : "bg-gray-300"
                  )}
                />
              ))}
            </div>
            
            {/* Right swipe indicator */}
            <motion.div
              animate={{ 
                x: canGoNext ? [0, 5, 0] : 0,
                opacity: canGoNext ? [0.5, 1, 0.5] : 0.3
              }}
              transition={{ 
                repeat: Infinity, 
                duration: 2,
                ease: "easeInOut"
              }}
              className="flex items-center gap-1 text-gray-400"
            >
              <span className="text-sm">Swipe</span>
              <ChevronRight className="w-5 h-5" />
            </motion.div>
          </div>
        </div>
      )}
      
      {/* Visual feedback overlay */}
      <AnimatePresence>
        {swipeDirection && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.1 }}
            exit={{ opacity: 0 }}
            className={cn(
              "absolute inset-0 pointer-events-none",
              swipeDirection === 'left' ? "bg-gradient-to-r from-transparent to-[#0088cc]" : 
              "bg-gradient-to-l from-transparent to-[#0088cc]"
            )}
          />
        )}
      </AnimatePresence>
    </div>
  );
};
