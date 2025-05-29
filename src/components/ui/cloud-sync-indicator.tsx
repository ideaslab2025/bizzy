import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cloud, CloudUpload, RotateCw, Check, CloudOff, AlertTriangle, Wifi, WifiOff } from 'lucide-react';
import { cn } from '@/lib/utils';

export type SyncStatus = 'typing' | 'uploading' | 'syncing' | 'synced' | 'offline' | 'error';

interface CloudSyncIndicatorProps {
  status: SyncStatus;
  lastSaved?: Date;
  progress?: number;
  onForceSync?: () => void;
  onShowHistory?: () => void;
  className?: string;
}

export const CloudSyncIndicator: React.FC<CloudSyncIndicatorProps> = ({
  status,
  lastSaved,
  progress = 0,
  onForceSync,
  onShowHistory,
  className
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showParticles, setShowParticles] = useState(false);

  useEffect(() => {
    if (status === 'uploading' || status === 'syncing') {
      setShowParticles(true);
      const timer = setTimeout(() => setShowParticles(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [status]);

  const getIcon = () => {
    switch (status) {
      case 'typing':
        return <Cloud className="w-4 h-4" />;
      case 'uploading':
        return <CloudUpload className="w-4 h-4" />;
      case 'syncing':
        return <RotateCw className="w-4 h-4 animate-spin" />;
      case 'synced':
        return <Check className="w-4 h-4" />;
      case 'offline':
        return <CloudOff className="w-4 h-4" />;
      case 'error':
        return <AlertTriangle className="w-4 h-4" />;
      default:
        return <Cloud className="w-4 h-4" />;
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'synced':
        return 'text-green-500';
      case 'error':
        return 'text-red-500';
      case 'offline':
        return 'text-gray-400';
      case 'uploading':
      case 'syncing':
        return 'text-blue-500';
      default:
        return 'text-gray-600';
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'typing':
        return 'Saving locally...';
      case 'uploading':
        return 'Uploading...';
      case 'syncing':
        return 'Syncing...';
      case 'synced':
        return lastSaved ? `Synced ${getTimeAgo(lastSaved)}` : 'Synced';
      case 'offline':
        return 'Working offline';
      case 'error':
        return 'Sync failed';
      default:
        return 'Ready';
    }
  };

  const getTimeAgo = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    
    if (seconds < 60) return `${seconds} sec ago`;
    if (minutes < 60) return `${minutes} min ago`;
    return `${hours}h ago`;
  };

  return (
    <div 
      className={cn("relative flex items-center gap-2", className)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Sync particles */}
      <AnimatePresence>
        {showParticles && (
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-blue-400 rounded-full"
                initial={{ 
                  x: 0, 
                  y: 0, 
                  opacity: 0,
                  scale: 0 
                }}
                animate={{ 
                  x: Math.random() * 20 - 10,
                  y: -20 - Math.random() * 10,
                  opacity: [0, 1, 0],
                  scale: [0, 1, 0]
                }}
                transition={{ 
                  duration: 1.5,
                  delay: i * 0.1,
                  repeat: Infinity,
                  repeatDelay: 2 
                }}
                style={{
                  left: '50%',
                  top: '50%'
                }}
              />
            ))}
          </div>
        )}
      </AnimatePresence>

      {/* Main indicator */}
      <motion.div 
        className="relative cursor-pointer"
        onClick={onShowHistory}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        {/* Progress ring for uploads */}
        {(status === 'uploading' || status === 'syncing') && progress > 0 && (
          <svg className="absolute -inset-1 w-6 h-6">
            <circle
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
              opacity="0.2"
            />
            <circle
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
              strokeDasharray={`${2 * Math.PI * 10}`}
              strokeDashoffset={`${2 * Math.PI * 10 * (1 - progress / 100)}`}
              className="transition-all duration-300"
              transform="rotate(-90 12 12)"
            />
          </svg>
        )}

        {/* Glow effect when syncing */}
        {(status === 'syncing' || status === 'uploading') && (
          <motion.div
            className="absolute inset-0 bg-blue-400 rounded-full opacity-30"
            animate={{ scale: [1, 1.5, 1] }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        )}

        {/* Icon */}
        <motion.div
          className={cn("p-1 rounded-full transition-colors", getStatusColor())}
          animate={status === 'synced' ? { 
            scale: [1, 1.2, 1],
            rotate: [0, 360, 0]
          } : {}}
          transition={{ duration: 0.5 }}
        >
          {getIcon()}
        </motion.div>
      </motion.div>

      {/* Status text and controls */}
      <AnimatePresence>
        {(isHovered || status === 'error' || status === 'offline') && (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            className="flex items-center gap-2 text-xs"
          >
            <span className={getStatusColor()}>{getStatusText()}</span>
            
            {status === 'offline' && onForceSync && (
              <button
                onClick={onForceSync}
                className="px-2 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600 transition-colors"
              >
                Retry
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Success burst animation */}
      <AnimatePresence>
        {status === 'synced' && (
          <motion.div
            className="absolute inset-0 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-green-400 rounded-full"
                initial={{ 
                  x: 0, 
                  y: 0, 
                  scale: 0 
                }}
                animate={{ 
                  x: Math.cos(i * 45 * Math.PI / 180) * 15,
                  y: Math.sin(i * 45 * Math.PI / 180) * 15,
                  scale: [0, 1, 0]
                }}
                transition={{ 
                  duration: 0.6,
                  ease: "easeOut"
                }}
                style={{
                  left: '50%',
                  top: '50%'
                }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
