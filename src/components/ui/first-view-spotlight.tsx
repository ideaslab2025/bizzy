
import React, { useEffect, useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

interface SpotlightData {
  id: string;
  message?: string;
  element: HTMLElement;
  rect: DOMRect;
}

interface SpotlightStorage {
  [key: string]: boolean;
}

const STORAGE_KEY = 'spotlight_seen';
const SPOTLIGHT_RADIUS = 400;
const AUTO_DISMISS_DELAY = 3000;
const FADE_DURATION = 800;

export const FirstViewSpotlight: React.FC = () => {
  const [activeSpotlight, setActiveSpotlight] = useState<SpotlightData | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const isMobile = useIsMobile();
  const observerRef = useRef<IntersectionObserver>();
  const timeoutRef = useRef<NodeJS.Timeout>();
  const isScrollingRef = useRef(false);
  const scrollTimeoutRef = useRef<NodeJS.Timeout>();

  // Get spotlight storage
  const getSpotlightStorage = useCallback((): SpotlightStorage => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  }, []);

  // Save spotlight as seen
  const markSpotlightAsSeen = useCallback((id: string) => {
    try {
      const storage = getSpotlightStorage();
      storage[id] = true;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(storage));
    } catch {
      // Silently fail if localStorage is unavailable
    }
  }, [getSpotlightStorage]);

  // Check if spotlight was already seen
  const wasSpotlightSeen = useCallback((id: string): boolean => {
    const storage = getSpotlightStorage();
    return storage[id] === true;
  }, [getSpotlightStorage]);

  // Dismiss spotlight
  const dismissSpotlight = useCallback(() => {
    if (activeSpotlight) {
      markSpotlightAsSeen(activeSpotlight.id);
      setIsVisible(false);
      setTimeout(() => setActiveSpotlight(null), FADE_DURATION);
    }
  }, [activeSpotlight, markSpotlightAsSeen]);

  // Handle rapid scrolling detection
  const handleScroll = useCallback(() => {
    isScrollingRef.current = true;
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }
    scrollTimeoutRef.current = setTimeout(() => {
      isScrollingRef.current = false;
    }, 150);
  }, []);

  // Show spotlight for element
  const showSpotlight = useCallback((element: HTMLElement) => {
    const id = element.dataset.spotlightId;
    const message = element.dataset.spotlightMessage;

    if (!id || wasSpotlightSeen(id) || isScrollingRef.current) {
      return;
    }

    // Don't show on mobile if screen is too small
    if (isMobile && window.innerWidth < 768) {
      markSpotlightAsSeen(id);
      return;
    }

    // Check for reduced motion preference
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      markSpotlightAsSeen(id);
      return;
    }

    // Dismiss any existing spotlight first
    if (activeSpotlight) {
      dismissSpotlight();
      return;
    }

    const rect = element.getBoundingClientRect();
    
    setActiveSpotlight({
      id,
      message,
      element,
      rect
    });

    // Show with fade-in
    setTimeout(() => setIsVisible(true), 50);

    // Auto-dismiss after delay
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      dismissSpotlight();
    }, AUTO_DISMISS_DELAY);
  }, [activeSpotlight, dismissSpotlight, isMobile, markSpotlightAsSeen, wasSpotlightSeen]);

  // Initialize intersection observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && (entry.target as HTMLElement).dataset.spotlightFirstView === 'true') {
            showSpotlight(entry.target as HTMLElement);
          }
        });
      },
      {
        threshold: 0.6,
        rootMargin: '-50px'
      }
    );

    observerRef.current = observer;

    // Observe all spotlight elements
    const elements = document.querySelectorAll('[data-spotlight-first-view="true"]');
    elements.forEach((element) => observer.observe(element));

    // Add scroll listener
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', handleScroll);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [showSpotlight, handleScroll]);

  // Handle clicks to dismiss
  useEffect(() => {
    const handleClick = () => {
      if (activeSpotlight) {
        dismissSpotlight();
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && activeSpotlight) {
        dismissSpotlight();
      }
    };

    if (activeSpotlight) {
      document.addEventListener('click', handleClick);
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('click', handleClick);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [activeSpotlight, dismissSpotlight]);

  if (!activeSpotlight) {
    return null;
  }

  const { rect, message } = activeSpotlight;
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: FADE_DURATION / 1000 }}
          className="fixed inset-0 z-[9999] pointer-events-none"
          style={{
            background: `radial-gradient(circle ${SPOTLIGHT_RADIUS}px at ${centerX}px ${centerY}px, 
              rgba(0, 0, 0, 0) 0%, 
              rgba(0, 0, 0, 0) 30%, 
              rgba(0, 0, 0, 0.2) 70%, 
              rgba(0, 0, 0, 0.8) 100%)`
          }}
        >
          {/* Pulsing ring around highlighted element */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ 
              scale: [0.8, 1.1, 1],
              opacity: [0, 0.6, 0.4]
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut"
            }}
            className="absolute border-2 border-blue-400 rounded-lg"
            style={{
              left: rect.left - 8,
              top: rect.top - 8,
              width: rect.width + 16,
              height: rect.height + 16,
              boxShadow: '0 0 20px rgba(59, 130, 246, 0.5)'
            }}
          />

          {/* Message tooltip */}
          {message && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.4 }}
              className="absolute pointer-events-auto"
              style={{
                left: Math.min(centerX - 150, window.innerWidth - 320),
                top: rect.bottom + 20,
                maxWidth: 300
              }}
            >
              <div className="bg-white dark:bg-gray-900 rounded-lg shadow-2xl border border-gray-200 dark:border-gray-700 p-4">
                <div className="flex items-start gap-3">
                  <MessageCircle className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                      {message}
                    </p>
                    <Button
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        dismissSpotlight();
                      }}
                      className="h-7 text-xs"
                    >
                      Got it
                    </Button>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      dismissSpotlight();
                    }}
                    className="h-6 w-6 p-0 text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </div>
              </div>
              
              {/* Arrow pointing to element */}
              <div 
                className="absolute w-3 h-3 bg-white dark:bg-gray-900 border-l border-t border-gray-200 dark:border-gray-700 transform rotate-45"
                style={{
                  left: Math.max(10, centerX - (centerX - 150) - 6),
                  top: -6
                }}
              />
            </motion.div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Helper hook for managing spotlight storage
export const useSpotlightReset = () => {
  const resetAllSpotlights = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Silently fail if localStorage is unavailable
    }
  }, []);

  const resetSpotlight = useCallback((id: string) => {
    try {
      const storage = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
      delete storage[id];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(storage));
    } catch {
      // Silently fail if localStorage is unavailable
    }
  }, []);

  return { resetAllSpotlights, resetSpotlight };
};
