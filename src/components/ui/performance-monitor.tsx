
import React, { useEffect, useState } from 'react';
import { usePerformanceOptimization } from '@/hooks/usePerformanceOptimization';

interface PerformanceMonitorProps {
  enabled?: boolean;
  showMetrics?: boolean;
}

export const PerformanceMonitor: React.FC<PerformanceMonitorProps> = ({
  enabled = process.env.NODE_ENV === 'development',
  showMetrics = false
}) => {
  const { metrics, trackPageLoad } = usePerformanceOptimization();
  const [vitals, setVitals] = useState<any>(null);

  useEffect(() => {
    if (!enabled) return;

    trackPageLoad();

    // Web Vitals tracking - using correct import method
    const trackVitals = async () => {
      try {
        const { onCLS, onFID, onFCP, onLCP, onTTFB } = await import('web-vitals');
        
        onCLS(console.log);
        onFID(console.log);
        onFCP(console.log);
        onLCP(console.log);
        onTTFB(console.log);
      } catch (error) {
        console.warn('Web Vitals not available:', error);
      }
    };

    trackVitals();

    // Performance observer for long tasks
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          if (entry.entryType === 'longtask') {
            console.warn('Long task detected:', entry);
          }
        });
      });

      try {
        observer.observe({ entryTypes: ['longtask'] });
      } catch (e) {
        // Longtask API not supported
      }

      return () => observer.disconnect();
    }
  }, [enabled, trackPageLoad]);

  if (!enabled || !showMetrics) return null;

  return (
    <div className="fixed bottom-4 right-4 bg-black bg-opacity-80 text-white p-4 rounded-lg text-xs font-mono z-50">
      <div className="space-y-1">
        <div>Page Load: {metrics.pageLoadTime.toFixed(0)}ms</div>
        <div>Renders: {metrics.renderCount}</div>
        {Object.entries(metrics.apiResponseTimes).map(([key, time]) => (
          <div key={key} className={time > 1000 ? 'text-red-400' : 'text-green-400'}>
            {key}: {time.toFixed(0)}ms
          </div>
        ))}
      </div>
    </div>
  );
};
