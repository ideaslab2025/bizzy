
import { useState, useEffect, useCallback, useRef } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';

interface PullToRefreshOptions {
  onRefresh: () => Promise<void> | void;
  threshold?: number;
  maxPullDistance?: number;
  disabled?: boolean;
}

export const usePullToRefresh = ({
  onRefresh,
  threshold = 100,
  maxPullDistance = 150,
  disabled = false
}: PullToRefreshOptions) => {
  const isMobile = useIsMobile();
  const [pullDistance, setPullDistance] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isPulling, setIsPulling] = useState(false);
  
  const startY = useRef(0);
  const currentY = useRef(0);
  const scrollContainer = useRef<HTMLElement | null>(null);
  const refreshTimeoutRef = useRef<NodeJS.Timeout>();

  const triggerHapticFeedback = useCallback(() => {
    if ('vibrate' in navigator) {
      navigator.vibrate(50);
    }
  }, []);

  const handleRefresh = useCallback(async () => {
    if (isRefreshing || disabled) return;
    
    setIsRefreshing(true);
    triggerHapticFeedback();
    
    try {
      await onRefresh();
    } catch (error) {
      console.error('Refresh failed:', error);
    }
    
    // Minimum refresh duration for UX
    refreshTimeoutRef.current = setTimeout(() => {
      setIsRefreshing(false);
      setPullDistance(0);
      setIsPulling(false);
    }, 800);
  }, [onRefresh, isRefreshing, disabled, triggerHapticFeedback]);

  const handleTouchStart = useCallback((e: TouchEvent) => {
    if (!isMobile || disabled || isRefreshing) return;
    
    const container = scrollContainer.current || document.documentElement;
    if (container.scrollTop > 0) return;
    
    startY.current = e.touches[0].clientY;
    setIsPulling(true);
  }, [isMobile, disabled, isRefreshing]);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!isPulling || !isMobile || disabled || isRefreshing) return;
    
    currentY.current = e.touches[0].clientY;
    const diff = currentY.current - startY.current;
    
    if (diff > 0) {
      e.preventDefault();
      const distance = Math.min(diff * 0.4, maxPullDistance);
      setPullDistance(distance);
    }
  }, [isPulling, isMobile, disabled, isRefreshing, maxPullDistance]);

  const handleTouchEnd = useCallback(() => {
    if (!isPulling || !isMobile || disabled) return;
    
    if (pullDistance >= threshold && !isRefreshing) {
      handleRefresh();
    } else {
      setIsPulling(false);
      setPullDistance(0);
    }
  }, [isPulling, isMobile, disabled, pullDistance, threshold, isRefreshing, handleRefresh]);

  useEffect(() => {
    if (!isMobile || disabled) return;

    const container = scrollContainer.current || document;
    
    container.addEventListener('touchstart', handleTouchStart, { passive: false });
    container.addEventListener('touchmove', handleTouchMove, { passive: false });
    container.addEventListener('touchend', handleTouchEnd);

    return () => {
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('touchend', handleTouchEnd);
      
      if (refreshTimeoutRef.current) {
        clearTimeout(refreshTimeoutRef.current);
      }
    };
  }, [isMobile, disabled, handleTouchStart, handleTouchMove, handleTouchEnd]);

  const progress = Math.min(pullDistance / threshold, 1);
  const shouldShowIndicator = isPulling && pullDistance > 20;
  const isReadyToRefresh = pullDistance >= threshold;

  return {
    pullDistance,
    isRefreshing,
    isPulling,
    progress,
    shouldShowIndicator,
    isReadyToRefresh,
    setScrollContainer: (element: HTMLElement | null) => {
      scrollContainer.current = element;
    }
  };
};
