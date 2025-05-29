
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { HelpCircle, X, ThumbsUp, ThumbsDown, Lightbulb } from 'lucide-react';

interface SmartTooltipProps {
  content: string;
  children: React.ReactNode;
  id: string;
  maxViews?: number;
  delay?: number;
  position?: 'top' | 'bottom' | 'left' | 'right';
  adaptiveContent?: {
    beginner?: string;
    intermediate?: string;
    expert?: string;
  };
  relatedTips?: string[];
  category?: string;
}

interface TooltipAnalytics {
  viewCount: number;
  helpfulVotes: number;
  notHelpfulVotes: number;
  completionRate: number;
  userLevel: 'beginner' | 'intermediate' | 'expert';
}

export const SmartTooltip: React.FC<SmartTooltipProps> = ({
  content,
  children,
  id,
  maxViews = 3,
  delay = 500,
  position = 'top',
  adaptiveContent,
  relatedTips = [],
  category = 'general'
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [shouldShow, setShouldShow] = useState(true);
  const [showFeedback, setShowFeedback] = useState(false);
  const [analytics, setAnalytics] = useState<TooltipAnalytics>({
    viewCount: 0,
    helpfulVotes: 0,
    notHelpfulVotes: 0,
    completionRate: 0,
    userLevel: 'beginner'
  });
  const [showRelatedTips, setShowRelatedTips] = useState(false);
  
  const timeoutRef = useRef<NodeJS.Timeout>();
  const containerRef = useRef<HTMLDivElement>(null);
  const showTimeRef = useRef<number>(0);

  // Load analytics and user behavior data
  useEffect(() => {
    const storedAnalytics = localStorage.getItem(`tooltip-analytics-${id}`);
    const userInteractions = JSON.parse(localStorage.getItem('user-interactions') || '{}');
    const userLevel = determineUserLevel(userInteractions);
    
    if (storedAnalytics) {
      const parsed = JSON.parse(storedAnalytics);
      setAnalytics({ ...parsed, userLevel });
    } else {
      setAnalytics(prev => ({ ...prev, userLevel }));
    }

    // Check if should show based on learning algorithm
    const shouldShowTooltip = shouldShowBasedOnLearning(id, userInteractions, userLevel);
    setShouldShow(shouldShowTooltip);
  }, [id]);

  const determineUserLevel = (interactions: any): 'beginner' | 'intermediate' | 'expert' => {
    const totalActions = Object.values(interactions).reduce((sum: number, count: any) => sum + (count || 0), 0) as number;
    
    if (totalActions < 10) return 'beginner';
    if (totalActions < 50) return 'intermediate';
    return 'expert';
  };

  const shouldShowBasedOnLearning = (tooltipId: string, interactions: any, userLevel: string): boolean => {
    const viewCount = parseInt(localStorage.getItem(`tooltip-${tooltipId}`) || '0');
    const dismissed = localStorage.getItem(`tooltip-${tooltipId}-dismissed`) === 'true';
    const categoryInteractions = interactions[category] || 0;
    
    // Don't show if dismissed or viewed too many times
    if (dismissed || viewCount >= maxViews) return false;
    
    // Show more tooltips to beginners
    if (userLevel === 'beginner') return true;
    
    // Show contextually relevant tooltips to intermediate users
    if (userLevel === 'intermediate' && categoryInteractions < 5) return true;
    
    // Only show advanced tooltips to experts
    if (userLevel === 'expert' && category === 'advanced') return true;
    
    return viewCount === 0; // Show at least once
  };

  const getAdaptiveContent = (): string => {
    if (!adaptiveContent) return content;
    
    switch (analytics.userLevel) {
      case 'beginner':
        return adaptiveContent.beginner || content;
      case 'intermediate':
        return adaptiveContent.intermediate || content;
      case 'expert':
        return adaptiveContent.expert || content;
      default:
        return content;
    }
  };

  const handleMouseEnter = () => {
    if (!shouldShow) return;
    
    showTimeRef.current = Date.now();
    timeoutRef.current = setTimeout(() => {
      setIsVisible(true);
      trackView();
    }, getAdaptiveDelay());
  };

  const getAdaptiveDelay = (): number => {
    // Faster tooltips for beginners, slower for experts
    switch (analytics.userLevel) {
      case 'beginner': return delay * 0.5;
      case 'intermediate': return delay;
      case 'expert': return delay * 1.5;
      default: return delay;
    }
  };

  const handleMouseLeave = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    if (isVisible) {
      const timeShown = Date.now() - showTimeRef.current;
      trackEngagement(timeShown);
    }
    
    setIsVisible(false);
    setShowFeedback(false);
    setShowRelatedTips(false);
  };

  const trackView = () => {
    const newViewCount = analytics.viewCount + 1;
    const updatedAnalytics = { ...analytics, viewCount: newViewCount };
    
    setAnalytics(updatedAnalytics);
    localStorage.setItem(`tooltip-analytics-${id}`, JSON.stringify(updatedAnalytics));
    localStorage.setItem(`tooltip-${id}`, newViewCount.toString());
    
    // Track category interaction
    const interactions = JSON.parse(localStorage.getItem('user-interactions') || '{}');
    interactions[category] = (interactions[category] || 0) + 1;
    localStorage.setItem('user-interactions', JSON.stringify(interactions));
  };

  const trackEngagement = (timeShown: number) => {
    // Consider engagement if shown for more than 2 seconds
    if (timeShown > 2000) {
      const updatedAnalytics = {
        ...analytics,
        completionRate: ((analytics.completionRate * analytics.viewCount) + 1) / (analytics.viewCount + 1)
      };
      setAnalytics(updatedAnalytics);
      localStorage.setItem(`tooltip-analytics-${id}`, JSON.stringify(updatedAnalytics));
    }
  };

  const handleFeedback = (helpful: boolean) => {
    const updatedAnalytics = {
      ...analytics,
      helpfulVotes: helpful ? analytics.helpfulVotes + 1 : analytics.helpfulVotes,
      notHelpfulVotes: !helpful ? analytics.notHelpfulVotes + 1 : analytics.notHelpfulVotes
    };
    
    setAnalytics(updatedAnalytics);
    localStorage.setItem(`tooltip-analytics-${id}`, JSON.stringify(updatedAnalytics));
    
    // If not helpful multiple times, stop showing
    if (!helpful && updatedAnalytics.notHelpfulVotes >= 2) {
      handleDismiss();
    } else {
      setShowFeedback(false);
    }
  };

  const handleDismiss = () => {
    localStorage.setItem(`tooltip-${id}-dismissed`, 'true');
    setShouldShow(false);
    setIsVisible(false);
  };

  const handleLearnMore = () => {
    setShowRelatedTips(true);
    // Track that user wants to learn more
    const interactions = JSON.parse(localStorage.getItem('user-interactions') || '{}');
    interactions[`${category}-learn-more`] = (interactions[`${category}-learn-more`] || 0) + 1;
    localStorage.setItem('user-interactions', JSON.stringify(interactions));
  };

  const positionClasses = {
    top: 'bottom-full left-1/2 transform -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 transform -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 transform -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 transform -translate-y-1/2 ml-2',
  };

  const arrowClasses = {
    top: 'top-full left-1/2 transform -translate-x-1/2 border-l-transparent border-r-transparent border-b-transparent border-t-gray-800',
    bottom: 'bottom-full left-1/2 transform -translate-x-1/2 border-l-transparent border-r-transparent border-t-transparent border-b-gray-800',
    left: 'left-full top-1/2 transform -translate-y-1/2 border-t-transparent border-b-transparent border-r-transparent border-l-gray-800',
    right: 'right-full top-1/2 transform -translate-y-1/2 border-t-transparent border-b-transparent border-l-transparent border-r-gray-800',
  };

  return (
    <div
      ref={containerRef}
      className="relative inline-block"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
      
      <AnimatePresence>
        {isVisible && shouldShow && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: position === 'top' ? 10 : -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: position === 'top' ? 10 : -10 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className={cn(
              "absolute z-50 px-4 py-3 text-sm text-white bg-gray-800 rounded-lg shadow-xl",
              "max-w-xs glass-card border border-gray-700",
              positionClasses[position]
            )}
          >
            <div className="space-y-3">
              {/* Main content */}
              <div className="flex items-start justify-between gap-2">
                <span className="flex-1">{getAdaptiveContent()}</span>
                <button
                  onClick={handleDismiss}
                  className="text-gray-300 hover:text-white text-xs ml-2 flex-shrink-0"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>

              {/* Progressive disclosure */}
              {analytics.userLevel === 'beginner' && relatedTips.length > 0 && (
                <button
                  onClick={handleLearnMore}
                  className="flex items-center gap-1 text-xs text-blue-300 hover:text-blue-200"
                >
                  <Lightbulb className="w-3 h-3" />
                  Learn more
                </button>
              )}

              {/* Related tips */}
              <AnimatePresence>
                {showRelatedTips && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="border-t border-gray-600 pt-2"
                  >
                    <p className="text-xs text-gray-300 mb-1">Related tips:</p>
                    <ul className="text-xs space-y-1">
                      {relatedTips.slice(0, 2).map((tip, index) => (
                        <li key={index} className="text-gray-300">• {tip}</li>
                      ))}
                    </ul>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Feedback section */}
              {analytics.viewCount > 1 && !showFeedback && (
                <button
                  onClick={() => setShowFeedback(true)}
                  className="text-xs text-gray-400 hover:text-gray-300"
                >
                  Was this helpful?
                </button>
              )}

              <AnimatePresence>
                {showFeedback && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="flex items-center gap-2 pt-2 border-t border-gray-600"
                  >
                    <span className="text-xs text-gray-300">Helpful?</span>
                    <button
                      onClick={() => handleFeedback(true)}
                      className="text-green-400 hover:text-green-300"
                    >
                      <ThumbsUp className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => handleFeedback(false)}
                      className="text-red-400 hover:text-red-300"
                    >
                      <ThumbsDown className="w-3 h-3" />
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            {/* Arrow */}
            <div
              className={cn(
                "absolute w-0 h-0 border-4",
                arrowClasses[position]
              )}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
