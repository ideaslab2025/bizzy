
import React from 'react';
import { cn } from '@/lib/utils';

interface SkeletonLoaderProps {
  variant?: 'card' | 'text' | 'avatar' | 'button' | 'custom';
  width?: string;
  height?: string;
  className?: string;
  lines?: number;
}

export const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
  variant = 'custom',
  width,
  height,
  className,
  lines = 1
}) => {
  const baseClasses = "relative overflow-hidden bg-gray-200 rounded animate-pulse";
  const shimmerClasses = "absolute inset-0 animate-shimmer bg-gradient-to-r from-transparent via-white/40 to-transparent";

  const getVariantClasses = () => {
    switch (variant) {
      case 'card':
        return 'h-64 w-full rounded-lg';
      case 'text':
        return 'h-4 w-full rounded';
      case 'avatar':
        return 'h-10 w-10 rounded-full';
      case 'button':
        return 'h-10 w-24 rounded-md';
      default:
        return '';
    }
  };

  const style = {
    width: width,
    height: height
  };

  if (variant === 'text' && lines > 1) {
    return (
      <div className={cn("space-y-2", className)}>
        {Array.from({ length: lines }).map((_, index) => (
          <div
            key={index}
            className={cn(baseClasses, getVariantClasses())}
            style={index === lines - 1 ? { width: '75%' } : {}}
          >
            <div className={shimmerClasses} />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div
      className={cn(baseClasses, getVariantClasses(), className)}
      style={style}
    >
      <div className={shimmerClasses} />
    </div>
  );
};

// Specific skeleton components for common use cases
export const DocumentCardSkeleton: React.FC = () => (
  <div className="h-full flex flex-col bg-white rounded-lg border shadow-sm p-6 space-y-4">
    <div className="flex items-start justify-between">
      <div className="flex-1 space-y-2">
        <SkeletonLoader variant="text" height="20px" width="80%" />
        <div className="flex gap-2">
          <SkeletonLoader variant="button" height="20px" width="60px" />
          <SkeletonLoader variant="button" height="20px" width="50px" />
        </div>
      </div>
      <SkeletonLoader variant="avatar" width="20px" height="20px" />
    </div>
    
    <SkeletonLoader variant="text" lines={3} />
    
    <div className="mt-auto space-y-2">
      <div className="flex gap-2 text-xs">
        <SkeletonLoader height="16px" width="40px" />
        <SkeletonLoader height="16px" width="60px" />
      </div>
      <div className="flex gap-2">
        <SkeletonLoader variant="button" height="32px" className="flex-1" />
        <SkeletonLoader variant="button" height="32px" className="flex-1" />
      </div>
    </div>
  </div>
);

export const StepContentSkeleton: React.FC = () => (
  <div className="max-w-4xl space-y-6">
    {/* Header skeleton */}
    <div className="space-y-3">
      <SkeletonLoader variant="text" height="32px" width="60%" />
      <SkeletonLoader variant="text" height="20px" width="40%" />
    </div>
    
    {/* Content paragraphs */}
    <div className="space-y-4">
      <SkeletonLoader variant="text" lines={4} />
      <SkeletonLoader variant="text" lines={3} />
      <SkeletonLoader variant="text" lines={2} />
    </div>
    
    {/* Action buttons */}
    <div className="flex gap-3 pt-4">
      <SkeletonLoader variant="button" width="120px" height="40px" />
      <SkeletonLoader variant="button" width="100px" height="40px" />
    </div>
  </div>
);

export const DashboardCardSkeleton: React.FC = () => (
  <div className="bg-white rounded-lg border p-6 space-y-4">
    <div className="flex items-center justify-between">
      <SkeletonLoader variant="text" width="40%" height="16px" />
      <SkeletonLoader variant="avatar" width="16px" height="16px" />
    </div>
    <SkeletonLoader variant="text" width="60%" height="32px" />
    <SkeletonLoader variant="text" width="80%" height="14px" />
  </div>
);

export const SearchResultSkeleton: React.FC = () => (
  <div className="space-y-3 p-4 border-b">
    <SkeletonLoader variant="text" width="70%" height="20px" />
    <SkeletonLoader variant="text" lines={2} />
    <div className="flex gap-2">
      <SkeletonLoader variant="button" width="60px" height="24px" />
      <SkeletonLoader variant="button" width="80px" height="24px" />
    </div>
  </div>
);
