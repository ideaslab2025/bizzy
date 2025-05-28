
import React from 'react';
import { cn } from '@/lib/utils';

interface NeonGlowProps {
  children: React.ReactNode;
  color?: 'blue' | 'green' | 'purple' | 'pink' | 'yellow' | 'red' | 'rainbow';
  intensity?: 'low' | 'medium' | 'high';
  pulse?: boolean;
  hover?: boolean;
  active?: boolean;
  className?: string;
}

export const NeonGlow: React.FC<NeonGlowProps> = ({
  children,
  color = 'blue',
  intensity = 'medium',
  pulse = false,
  hover = false,
  active = false,
  className,
}) => {
  const getGlowClasses = () => {
    const baseClasses = 'transition-all duration-300 ease-out';
    
    const colorClasses = {
      blue: 'neon-glow-blue',
      green: 'neon-glow-green',
      purple: 'neon-glow-purple',
      pink: 'neon-glow-pink',
      yellow: 'neon-glow-yellow',
      red: 'neon-glow-red',
      rainbow: 'neon-glow-rainbow',
    };

    const intensityClasses = {
      low: 'neon-intensity-low',
      medium: 'neon-intensity-medium',
      high: 'neon-intensity-high',
    };

    const stateClasses = [
      pulse && 'neon-pulse',
      hover && 'neon-hover',
      active && 'neon-active',
    ].filter(Boolean);

    return cn(
      baseClasses,
      colorClasses[color],
      intensityClasses[intensity],
      ...stateClasses,
      className
    );
  };

  return (
    <div className={getGlowClasses()}>
      {children}
    </div>
  );
};

// Higher-order component for easy wrapping
export const withNeonGlow = <P extends object>(
  Component: React.ComponentType<P>,
  glowProps?: Omit<NeonGlowProps, 'children'>
) => {
  const WrappedComponent = React.forwardRef<any, P>((props, ref) => (
    <NeonGlow {...glowProps}>
      <Component {...props} ref={ref} />
    </NeonGlow>
  ));
  
  WrappedComponent.displayName = `withNeonGlow(${Component.displayName || Component.name})`;
  return WrappedComponent;
};

// Neon Button wrapper
export const NeonButton: React.FC<
  React.ButtonHTMLAttributes<HTMLButtonElement> & 
  Pick<NeonGlowProps, 'color' | 'intensity' | 'pulse'>
> = ({ children, color = 'blue', intensity = 'medium', pulse = false, className, ...props }) => (
  <NeonGlow color={color} intensity={intensity} pulse={pulse} hover active>
    <button
      className={cn(
        'relative px-6 py-3 rounded-lg font-medium',
        'bg-transparent border border-current',
        'transition-all duration-300',
        className
      )}
      {...props}
    >
      {children}
    </button>
  </NeonGlow>
);
