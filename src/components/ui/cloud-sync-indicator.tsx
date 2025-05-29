
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cloud, CloudUpload, RotateCcw, Check, CloudOff, AlertTriangle, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

type SyncState = 'typing' | 'uploading' | 'syncing' | 'synced' | 'offline' | 'error';

interface CloudSyncIndicatorProps {
  state: SyncState;
  lastSynced?: Date;
  onForceSync?: () => void;
  onShowHistory?: () => void;
  progress?: number;
  queueCount?: number;
  className?: string;
}

export const CloudSyncIndicator: React.FC<CloudSyncIndicatorProps> = ({
  state,
  lastSynced,
  onForceSync,
  onShowHistory,
  progress = 0,
  queueCount = 0,
  className,
}) => {
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number }>>([]);

  useEffect(() => {
    if (state === 'uploading' || state === 'syncing') {
      const interval = setInterval(() => {
        setParticles(prev => [
          ...prev.slice(-10),
          { id: Date.now(), x: Math.random() * 20, y: 0 }
        ]);
      }, 200);
      return () => clearInterval(interval);
    }
  }, [state]);

  const getIcon = () => {
    switch (state) {
      case 'typing': return Cloud;
      case 'uploading': return CloudUpload;
      case 'syncing': return RotateCcw;
      case 'synced': return Check;
      case 'offline': return CloudOff;
      case 'error': return AlertTriangle;
      default: return Cloud;
    }
  };

  const getColor = () => {
    switch (state) {
      case 'synced': return 'text-green-500';
      case 'error': return 'text-red-500';
      case 'offline': return 'text-gray-400';
      case 'uploading':
      case 'syncing': return 'text-blue-500';
      default: return 'text-gray-600';
    }
  };

  const formatLastSynced = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    if (seconds < 60) return `${seconds} sec ago`;
    if (minutes < 60) return `${minutes} min ago`;
    if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    return date.toLocaleDateString();
  };

  const Icon = getIcon();

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className={cn("relative flex items-center gap-2", className)}>
            {/* Main sync indicator */}
            <div className="relative">
              {/* Progress ring for uploads */}
              {(state === 'uploading' || state === 'syncing') && progress > 0 && (
                <svg className="absolute inset-0 w-6 h-6 transform -rotate-90">
                  <circle
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="2"
                    fill="none"
                    className="text-gray-200"
                  />
                  <motion.circle
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="2"
                    fill="none"
                    strokeDasharray={`${2 * Math.PI * 10}`}
                    className="text-blue-500"
                    initial={{ strokeDashoffset: 2 * Math.PI * 10 }}
                    animate={{ strokeDashoffset: 2 * Math.PI * 10 * (1 - progress / 100) }}
                    transition={{ duration: 0.3 }}
                  />
                </svg>
              )}

              {/* Icon with animations */}
              <motion.div
                className={cn("relative z-10", getColor())}
                animate={{
                  rotate: state === 'syncing' ? 360 : 0,
                  scale: state === 'synced' ? [1, 1.2, 1] : 1,
                }}
                transition={{
                  rotate: { duration: 1, repeat: state === 'syncing' ? Infinity : 0, ease: 'linear' },
                  scale: { duration: 0.5 }
                }}
              >
                <Icon className="w-4 h-4" />
              </motion.div>

              {/* Glow effect */}
              {(state === 'syncing' || state === 'uploading') && (
                <motion.div
                  className="absolute inset-0 w-4 h-4 bg-blue-400 rounded-full opacity-20"
                  animate={{ scale: [1, 1.5, 1], opacity: [0.2, 0.4, 0.2] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              )}

              {/* Upload particles */}
              <AnimatePresence>
                {particles.map(particle => (
                  <motion.div
                    key={particle.id}
                    className="absolute w-1 h-1 bg-blue-400 rounded-full"
                    initial={{ x: particle.x, y: 20, opacity: 1 }}
                    animate={{ x: particle.x - 5, y: -10, opacity: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1 }}
                    onAnimationComplete={() => {
                      setParticles(prev => prev.filter(p => p.id !== particle.id));
                    }}
                  />
                ))}
              </AnimatePresence>

              {/* Queue indicator */}
              {queueCount > 0 && (
                <motion.div
                  className="absolute -top-1 -right-1 w-3 h-3 bg-orange-500 text-white text-xs rounded-full flex items-center justify-center"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                >
                  {queueCount}
                </motion.div>
              )}
            </div>

            {/* Status text */}
            <div className="text-xs text-gray-500">
              {state === 'typing' && 'Saving...'}
              {state === 'uploading' && 'Uploading...'}
              {state === 'syncing' && 'Syncing...'}
              {state === 'synced' && lastSynced && `Synced ${formatLastSynced(lastSynced)}`}
              {state === 'offline' && 'Working offline'}
              {state === 'error' && 'Sync failed'}
            </div>

            {/* Force sync button when offline/error */}
            {(state === 'offline' || state === 'error') && onForceSync && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onForceSync}
                className="h-6 px-2 text-xs"
              >
                Retry
              </Button>
            )}
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <div className="text-sm">
            <div className="font-medium">Cloud Sync Status</div>
            <div className="text-gray-400">
              {state === 'synced' && 'All changes saved to cloud'}
              {state === 'typing' && 'Changes being saved locally'}
              {state === 'uploading' && 'Uploading to cloud storage'}
              {state === 'syncing' && 'Synchronizing across devices'}
              {state === 'offline' && 'Working in offline mode'}
              {state === 'error' && 'Failed to sync with cloud'}
            </div>
            {onShowHistory && (
              <div className="mt-2 pt-2 border-t">
                <Button variant="ghost" size="sm" onClick={onShowHistory} className="h-6 text-xs">
                  View sync history
                </Button>
              </div>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

// Hook for managing cloud sync state
export const useCloudSync = () => {
  const [state, setState] = useState<SyncState>('synced');
  const [lastSynced, setLastSynced] = useState<Date>(new Date());
  const [progress, setProgress] = useState(0);
  const [queueCount, setQueueCount] = useState(0);

  const startSync = () => {
    setState('uploading');
    setProgress(0);
    
    // Simulate upload progress
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setState('synced');
          setLastSynced(new Date());
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const simulateTyping = () => {
    setState('typing');
    setTimeout(() => startSync(), 1000);
  };

  const forceSync = () => {
    startSync();
  };

  return {
    state,
    lastSynced,
    progress,
    queueCount,
    startSync,
    simulateTyping,
    forceSync,
  };
};
