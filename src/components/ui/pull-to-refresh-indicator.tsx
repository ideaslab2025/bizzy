
import React from 'react';
import { cn } from '@/lib/utils';
import { RefreshCw } from 'lucide-react';

interface PullToRefreshIndicatorProps {
  pullDistance: number;
  isRefreshing: boolean;
  progress: number;
  isReadyToRefresh: boolean;
  shouldShow: boolean;
}

export const PullToRefreshIndicator: React.FC<PullToRefreshIndicatorProps> = ({
  pullDistance,
  isRefreshing,
  progress,
  isReadyToRefresh,
  shouldShow
}) => {
  if (!shouldShow) return null;

  const scale = Math.min(0.5 + (progress * 0.5), 1);
  const rotation = isRefreshing ? 'animate-spin' : '';
  const opacity = Math.min(pullDistance / 60, 1);

  return (
    <div
      className="fixed top-0 left-1/2 transform -translate-x-1/2 z-50 transition-all duration-200 ease-out"
      style={{
        transform: `translateX(-50%) translateY(${Math.min(pullDistance - 20, 80)}px)`,
        opacity
      }}
    >
      <div className="bg-white rounded-full shadow-lg border border-gray-200 p-3">
        <div
          className="flex flex-col items-center"
          style={{
            transform: `scale(${scale})`
          }}
        >
          <RefreshCw 
            className={cn(
              'w-6 h-6 transition-colors duration-200',
              isReadyToRefresh ? 'text-[#0088cc]' : 'text-gray-400',
              rotation
            )}
            style={{
              transform: !isRefreshing ? `rotate(${progress * 360}deg)` : undefined
            }}
          />
          <span className="text-xs text-gray-600 mt-1 whitespace-nowrap">
            {isRefreshing 
              ? 'Refreshing...' 
              : isReadyToRefresh 
                ? 'Release to refresh'
                : 'Pull to refresh'
            }
          </span>
        </div>
        
        {/* Progress ring */}
        <div className="absolute inset-0 rounded-full">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
            <path
              className="stroke-gray-200"
              strokeWidth="2"
              fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
            <path
              className="stroke-[#0088cc] transition-all duration-200"
              strokeWidth="2"
              strokeLinecap="round"
              fill="none"
              strokeDasharray={`${progress * 100}, 100`}
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};
