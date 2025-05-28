
import React from 'react';
import { usePullToRefresh } from '@/hooks/usePullToRefresh';
import { PullToRefreshIndicator } from './pull-to-refresh-indicator';
import { useIsMobile } from '@/hooks/use-mobile';

interface PullToRefreshProps {
  onRefresh: () => Promise<void> | void;
  children: React.ReactNode;
  disabled?: boolean;
  className?: string;
}

export const PullToRefresh: React.FC<PullToRefreshProps> = ({
  onRefresh,
  children,
  disabled = false,
  className
}) => {
  const isMobile = useIsMobile();
  
  const {
    pullDistance,
    isRefreshing,
    progress,
    shouldShowIndicator,
    isReadyToRefresh,
    setScrollContainer
  } = usePullToRefresh({
    onRefresh,
    disabled: disabled || !isMobile
  });

  if (!isMobile) {
    return <>{children}</>;
  }

  return (
    <div 
      ref={setScrollContainer}
      className={className}
      style={{
        WebkitOverflowScrolling: 'touch',
        overscrollBehavior: 'none'
      }}
    >
      <PullToRefreshIndicator
        pullDistance={pullDistance}
        isRefreshing={isRefreshing}
        progress={progress}
        isReadyToRefresh={isReadyToRefresh}
        shouldShow={shouldShowIndicator}
      />
      {children}
    </div>
  );
};
