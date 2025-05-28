
import React from 'react';
import { cn } from '@/lib/utils';

interface GradientBackgroundProps {
  className?: string;
  type?: 'mesh' | 'simple' | 'minimal';
  children?: React.ReactNode;
}

export const GradientBackground: React.FC<GradientBackgroundProps> = ({
  className,
  type = 'mesh',
  children
}) => {
  const getTypeClasses = () => {
    switch (type) {
      case 'simple':
        return 'gradient-simple';
      case 'minimal':
        return 'gradient-minimal';
      default:
        return 'gradient-mesh-bg';
    }
  };

  return (
    <div className={cn('relative overflow-hidden', getTypeClasses(), className)}>
      {children}
    </div>
  );
};

export default GradientBackground;
