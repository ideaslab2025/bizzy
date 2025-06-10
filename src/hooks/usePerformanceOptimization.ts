
import { useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from '@/hooks/useAuth';

interface PerformanceMetrics {
  pageLoadTime: number;
  apiResponseTimes: Record<string, number>;
  renderCount: number;
}

export const usePerformanceOptimization = () => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    pageLoadTime: 0,
    apiResponseTimes: {},
    renderCount: 0
  });

  const measureApiResponse = useCallback((key: string, startTime: number) => {
    const endTime = performance.now();
    const responseTime = endTime - startTime;
    
    setMetrics(prev => ({
      ...prev,
      apiResponseTimes: {
        ...prev.apiResponseTimes,
        [key]: responseTime
      }
    }));

    // Log slow API responses
    if (responseTime > 1000) {
      console.warn(`Slow API response for ${key}: ${responseTime}ms`);
    }

    return responseTime;
  }, []);

  const trackPageLoad = useCallback(() => {
    const loadTime = performance.now();
    setMetrics(prev => ({
      ...prev,
      pageLoadTime: loadTime
    }));

    // Log slow page loads
    if (loadTime > 3000) {
      console.warn(`Slow page load: ${loadTime}ms`);
    }
  }, []);

  useEffect(() => {
    setMetrics(prev => ({
      ...prev,
      renderCount: prev.renderCount + 1
    }));
  });

  return {
    metrics,
    measureApiResponse,
    trackPageLoad
  };
};

export const useMemoizedCallback = <T extends (...args: any[]) => any>(
  callback: T,
  deps: any[]
): T => {
  return useCallback(callback, deps);
};

export const useMemoizedValue = <T>(
  factory: () => T,
  deps: any[]
): T => {
  return useMemo(factory, deps);
};
