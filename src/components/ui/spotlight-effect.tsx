
import React, { useEffect, useState, useRef } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

interface SpotlightEffectProps {
  children: React.ReactNode;
  className?: string;
  radius?: number;
  intensity?: number;
  enabled?: boolean;
}

export const SpotlightEffect: React.FC<SpotlightEffectProps> = ({
  children,
  className,
  radius = 300,
  intensity = 0.8,
  enabled = true,
}) => {
  const isMobile = useIsMobile();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>();

  useEffect(() => {
    if (!enabled || isMobile) return;

    const container = containerRef.current;
    if (!container) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }

      animationRef.current = requestAnimationFrame(() => {
        setMousePosition({ x, y });
      });
    };

    const handleMouseEnter = () => setIsHovering(true);
    const handleMouseLeave = () => setIsHovering(false);

    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mouseenter', handleMouseEnter);
    container.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseenter', handleMouseEnter);
      container.removeEventListener('mouseleave', handleMouseLeave);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [enabled, isMobile]);

  if (!enabled || isMobile) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div
      ref={containerRef}
      className={cn('relative overflow-hidden', className)}
      data-spotlight="true"
    >
      {children}
      
      {isHovering && (
        <div
          className="absolute inset-0 pointer-events-none transition-opacity duration-300 ease-out"
          style={{
            background: `radial-gradient(${radius}px circle at ${mousePosition.x}px ${mousePosition.y}px, 
              rgba(59, 130, 246, 0.1) 0%, 
              rgba(59, 130, 246, 0.05) 30%, 
              rgba(0, 0, 0, ${intensity * 0.3}) 70%, 
              rgba(0, 0, 0, ${intensity * 0.5}) 100%)`,
            mixBlendMode: 'multiply',
          }}
        />
      )}
      
      {/* Particle effect in spotlight */}
      {isHovering && (
        <div
          className="absolute pointer-events-none"
          style={{
            left: mousePosition.x - 10,
            top: mousePosition.y - 10,
            width: 20,
            height: 20,
          }}
        >
          <div className="w-1 h-1 bg-blue-400 rounded-full animate-ping opacity-75" />
          <div className="w-1 h-1 bg-purple-400 rounded-full animate-ping opacity-50" 
               style={{ animationDelay: '0.5s' }} />
        </div>
      )}
    </div>
  );
};
