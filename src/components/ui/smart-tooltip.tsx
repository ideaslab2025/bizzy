
import React, { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

interface SmartTooltipProps {
  content: string;
  children: React.ReactNode;
  id: string; // Unique identifier for tracking
  maxViews?: number;
  delay?: number;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

export const SmartTooltip: React.FC<SmartTooltipProps> = ({
  content,
  children,
  id,
  maxViews = 3,
  delay = 500,
  position = 'top',
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [shouldShow, setShouldShow] = useState(true);
  const timeoutRef = useRef<NodeJS.Timeout>();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const viewCount = parseInt(localStorage.getItem(`tooltip-${id}`) || '0');
    const dismissed = localStorage.getItem(`tooltip-${id}-dismissed`) === 'true';
    
    if (viewCount >= maxViews || dismissed) {
      setShouldShow(false);
    }
  }, [id, maxViews]);

  const handleMouseEnter = () => {
    if (!shouldShow) return;
    
    timeoutRef.current = setTimeout(() => {
      setIsVisible(true);
      const viewCount = parseInt(localStorage.getItem(`tooltip-${id}`) || '0');
      localStorage.setItem(`tooltip-${id}`, (viewCount + 1).toString());
      
      if (viewCount + 1 >= maxViews) {
        setShouldShow(false);
      }
    }, delay);
  };

  const handleMouseLeave = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsVisible(false);
  };

  const handleDismiss = () => {
    localStorage.setItem(`tooltip-${id}-dismissed`, 'true');
    setShouldShow(false);
    setIsVisible(false);
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
      
      {isVisible && shouldShow && (
        <div
          className={cn(
            "absolute z-50 px-3 py-2 text-sm text-white bg-gray-800 rounded-lg shadow-lg",
            "animate-fade-in max-w-xs",
            positionClasses[position]
          )}
        >
          <div className="flex items-start justify-between gap-2">
            <span>{content}</span>
            <button
              onClick={handleDismiss}
              className="text-gray-300 hover:text-white text-xs ml-2 flex-shrink-0"
            >
              ✕
            </button>
          </div>
          
          {/* Arrow */}
          <div
            className={cn(
              "absolute w-0 h-0 border-4",
              arrowClasses[position]
            )}
          />
        </div>
      )}
    </div>
  );
};
