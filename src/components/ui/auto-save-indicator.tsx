
import React from 'react';
import { Check, Undo, Wifi, WifiOff } from 'lucide-react';
import { cn } from '@/lib/utils';
import { CloudSyncIndicator } from './cloud-sync-indicator';

interface AutoSaveIndicatorProps {
  status: 'idle' | 'saving' | 'saved' | 'error';
  lastSaved?: Date;
  onRetry?: () => void;
  className?: string;
  showCloudSync?: boolean;
  progress?: number;
}

export const AutoSaveIndicator: React.FC<AutoSaveIndicatorProps> = ({
  status,
  lastSaved,
  onRetry,
  className,
  showCloudSync = true,
  progress = 0
}) => {
  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    
    if (minutes < 1) return 'just now';
    if (minutes === 1) return '1 minute ago';
    return `${minutes} minutes ago`;
  };

  // Map auto-save status to cloud sync status
  const getSyncStatus = () => {
    switch (status) {
      case 'saving':
        return 'uploading';
      case 'saved':
        return 'synced';
      case 'error':
        return 'error';
      default:
        return 'synced';
    }
  };

  if (showCloudSync) {
    return (
      <CloudSyncIndicator
        status={getSyncStatus()}
        lastSaved={lastSaved}
        progress={progress}
        onForceSync={onRetry}
        className={className}
      />
    );
  }

  // Fallback to simple indicator
  return (
    <div className={cn("flex items-center gap-2 text-xs transition-all duration-300", className)}>
      {status === 'saving' && (
        <>
          <div className="w-3 h-3 border border-blue-300 border-t-blue-600 rounded-full animate-spin" />
          <span className="text-blue-600">Saving...</span>
        </>
      )}
      
      {status === 'saved' && (
        <>
          <Check className="w-3 h-3 text-green-600" />
          <span className="text-green-600">Saved</span>
          {lastSaved && (
            <span className="text-gray-500">• {formatTime(lastSaved)}</span>
          )}
        </>
      )}
      
      {status === 'error' && (
        <>
          <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
          <span className="text-red-600">Failed to save</span>
          {onRetry && (
            <button
              onClick={onRetry}
              className="text-blue-600 hover:text-blue-700 underline"
            >
              Retry
            </button>
          )}
        </>
      )}
      
      {status === 'idle' && lastSaved && (
        <span className="text-gray-500">Last saved {formatTime(lastSaved)}</span>
      )}
    </div>
  );
};
