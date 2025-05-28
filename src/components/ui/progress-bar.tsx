
import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProgressBarProps {
  progress: number; // 0-100
  mode?: 'determinate' | 'indeterminate';
  showPercentage?: boolean;
  showTimeRemaining?: boolean;
  estimatedTimeRemaining?: number; // in seconds
  speed?: number; // items per second
  label?: string;
  onCancel?: () => void;
  className?: string;
  variant?: 'default' | 'success' | 'error';
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  mode = 'determinate',
  showPercentage = true,
  showTimeRemaining = false,
  estimatedTimeRemaining,
  speed,
  label,
  onCancel,
  className,
  variant = 'default',
}) => {
  const [displayProgress, setDisplayProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (mode === 'determinate') {
      const timer = setTimeout(() => {
        setDisplayProgress(progress);
        if (progress >= 100) {
          setIsComplete(true);
        }
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [progress, mode]);

  const formatTime = (seconds: number) => {
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  const getProgressColor = () => {
    switch (variant) {
      case 'success':
        return 'bg-green-500';
      case 'error':
        return 'bg-red-500';
      default:
        return 'bg-blue-500';
    }
  };

  return (
    <div className={cn("w-full space-y-2", className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {label && <span className="text-sm font-medium">{label}</span>}
          {showPercentage && mode === 'determinate' && (
            <span className="text-sm text-gray-600">{Math.round(displayProgress)}%</span>
          )}
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-500">
          {speed && <span>{speed.toFixed(1)}/s</span>}
          {showTimeRemaining && estimatedTimeRemaining && (
            <span>ETA: {formatTime(estimatedTimeRemaining)}</span>
          )}
          {onCancel && (
            <button
              onClick={onCancel}
              className="text-gray-400 hover:text-gray-600 p-1"
              aria-label="Cancel operation"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
        {mode === 'determinate' ? (
          <div
            className={cn(
              "h-full rounded-full transition-all duration-300 ease-out relative",
              getProgressColor(),
              isComplete && "animate-pulse"
            )}
            style={{ width: `${displayProgress}%` }}
          >
            {/* Animated edge */}
            <div className="absolute right-0 top-0 h-full w-2 bg-white/30 rounded-full animate-pulse" />
          </div>
        ) : (
          <div className={cn("h-full rounded-full animate-pulse", getProgressColor())}>
            <div className="h-full bg-gradient-to-r from-transparent via-white/30 to-transparent animate-[shimmer_2s_infinite]" />
          </div>
        )}
      </div>

      {/* Success Animation */}
      {isComplete && variant === 'success' && (
        <div className="flex items-center justify-center text-green-600 text-sm">
          <span>✓ Complete</span>
        </div>
      )}
    </div>
  );
};

// Multi-step progress variant
interface MultiStepProgressProps {
  steps: Array<{
    label: string;
    progress: number;
    status: 'pending' | 'active' | 'complete' | 'error';
  }>;
  className?: string;
}

export const MultiStepProgress: React.FC<MultiStepProgressProps> = ({
  steps,
  className,
}) => {
  const totalProgress = steps.reduce((sum, step) => sum + step.progress, 0) / steps.length;

  return (
    <div className={cn("space-y-3", className)}>
      <ProgressBar progress={totalProgress} label="Overall Progress" />
      <div className="space-y-2">
        {steps.map((step, index) => (
          <div key={index} className="flex items-center gap-3">
            <div className={cn(
              "w-2 h-2 rounded-full",
              step.status === 'complete' && "bg-green-500",
              step.status === 'active' && "bg-blue-500 animate-pulse",
              step.status === 'error' && "bg-red-500",
              step.status === 'pending' && "bg-gray-300"
            )} />
            <div className="flex-1">
              <div className="flex justify-between text-xs">
                <span className={cn(
                  step.status === 'active' && "font-medium",
                  step.status === 'error' && "text-red-600"
                )}>
                  {step.label}
                </span>
                <span>{Math.round(step.progress)}%</span>
              </div>
              <div className="h-1 bg-gray-200 rounded-full mt-1">
                <div
                  className={cn(
                    "h-full rounded-full transition-all duration-300",
                    step.status === 'complete' && "bg-green-500",
                    step.status === 'active' && "bg-blue-500",
                    step.status === 'error' && "bg-red-500",
                    step.status === 'pending' && "bg-gray-300"
                  )}
                  style={{ width: `${step.progress}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
