
import React from 'react';
import { cn } from '@/lib/utils';

interface AnimatedGradientProps {
  className?: string;
  variant?: 'default' | 'hero' | 'subtle' | 'dashboard';
  children?: React.ReactNode;
}

export const AnimatedGradient: React.FC<AnimatedGradientProps> = ({
  className,
  variant = 'default',
  children
}) => {
  const getVariantClasses = () => {
    switch (variant) {
      case 'hero':
        return 'gradient-hero';
      case 'subtle':
        return 'gradient-subtle';
      case 'dashboard':
        return 'gradient-dashboard';
      default:
        return 'gradient-default';
    }
  };

  return (
    <div className={cn('relative overflow-hidden', className)}>
      {/* Gradient layers */}
      <div className="absolute inset-0 gradient-mesh">
        <div className={cn('gradient-layer gradient-layer-1', getVariantClasses())} />
        <div className={cn('gradient-layer gradient-layer-2', getVariantClasses())} />
        <div className={cn('gradient-layer gradient-layer-3', getVariantClasses())} />
      </div>
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

export default AnimatedGradient;
