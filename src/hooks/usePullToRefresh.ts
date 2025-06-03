
import { useState, useEffect, useRef, useCallback } from 'react';

interface UsePullToRefreshOptions {
  onRefresh: () => Promise<void> | void;
  threshold?: number;
  maxPullDistance?: number;
  disabled?: boolean;
}

export const usePullToRefresh = ({
  onRefresh,
  threshold = 80,
  maxPullDistance = 120,
  disabled = false
}: UsePullToRefreshOptions) => {
  const [pullDistance, setPullDistance] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [shouldShowIndicator, setShouldShowIndicator] = useState(false);
  
  const startY = useRef<number | null>(null);
  const scrollContainer = useRef<HTMLElement | null>(null);
  const isPulling = useRef(false);
  const rafId = useRef<number | null>(null);

  const isReadyToRefresh = pullDistance >= threshold;
  const progress = Math.min(pullDistance / threshold, 1);

  const setScrollContainer = useCallback((element: HTMLElement | null) => {
    scrollContainer.current = element;
  }, []);

  const handleTouchStart = useCallback((e: TouchEvent) => {
    if (disabled || !scrollContainer.current || isRefreshing) return;
    
    const scrollTop = scrollContainer.current.scrollTop;
    if (scrollTop > 0) return;

    startY.current = e.touches[0].clientY;
    isPulling.current = true;
  }, [disabled, isRefreshing]);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!isPulling.current || startY.current === null || disabled) return;

    const currentY = e.touches[0].clientY;
    const deltaY = currentY - startY.current;

    if (deltaY > 0) {
      // Prevent default scrolling when pulling down
      e.preventDefault();
      
      const newPullDistance = Math.min(deltaY * 0.5, maxPullDistance);
      
      // Use RAF for smooth updates
      if (rafId.current) {
        cancelAnimationFrame(rafId.current);
      }
      
      rafId.current = requestAnimationFrame(() => {
        setPullDistance(newPullDistance);
        setShouldShowIndicator(newPullDistance > 10);
      });
    }
  }, [disabled, maxPullDistance]);

  const handleTouchEnd = useCallback(async () => {
    if (!isPulling.current || disabled) return;

    isPulling.current = false;
    startY.current = null;

    if (rafId.current) {
      cancelAnimationFrame(rafId.current);
      rafId.current = null;
    }

    if (isReadyToRefresh && !isRefreshing) {
      setIsRefreshing(true);
      try {
        await onRefresh();
      } catch (error) {
        console.error('Refresh failed:', error);
      } finally {
        setIsRefreshing(false);
      }
    }

    // Smooth reset animation
    const resetAnimation = () => {
      setPullDistance(prev => {
        const newDistance = prev * 0.9;
        if (newDistance < 1) {
          setShouldShowIndicator(false);
          return 0;
        }
        requestAnimationFrame(resetAnimation);
        return newDistance;
      });
    };
    
    requestAnimationFrame(resetAnimation);
  }, [disabled, isReadyToRefresh, isRefreshing, onRefresh]);

  useEffect(() => {
    const container = scrollContainer.current;
    if (!container) return;

    // Use passive listeners for better performance
    container.addEventListener('touchstart', handleTouchStart, { passive: false });
    container.addEventListener('touchmove', handleTouchMove, { passive: false });
    container.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('touchend', handleTouchEnd);
      
      if (rafId.current) {
        cancelAnimationFrame(rafId.current);
      }
    };
  }, [handleTouchStart, handleTouchMove, handleTouchEnd]);

  return {
    pullDistance,
    isRefreshing,
    progress,
    shouldShowIndicator,
    isReadyToRefresh,
    setScrollContainer
  };
};
