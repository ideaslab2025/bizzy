
import React, { useRef, useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface TiltCardProps extends React.ComponentProps<typeof Card> {
  children: React.ReactNode;
  disabled?: boolean;
  maxTilt?: number;
  perspective?: number;
  scale?: number;
  glare?: boolean;
  className?: string;
}

export const TiltCard: React.FC<TiltCardProps> = ({
  children,
  disabled = false,
  maxTilt = 15,
  perspective = 1000,
  scale = 1.05,
  glare = true,
  className,
  ...props
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [glarePosition, setGlarePosition] = useState({ x: 50, y: 50 });

  useEffect(() => {
    const card = cardRef.current;
    if (!card || disabled) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = card.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      const mouseX = e.clientX - centerX;
      const mouseY = e.clientY - centerY;
      
      const rotateX = (mouseY / (rect.height / 2)) * -maxTilt;
      const rotateY = (mouseX / (rect.width / 2)) * maxTilt;
      
      setTilt({ x: rotateX, y: rotateY });
      
      if (glare) {
        const glareX = ((e.clientX - rect.left) / rect.width) * 100;
        const glareY = ((e.clientY - rect.top) / rect.height) * 100;
        setGlarePosition({ x: glareX, y: glareY });
      }
    };

    const handleMouseLeave = () => {
      setTilt({ x: 0, y: 0 });
      setGlarePosition({ x: 50, y: 50 });
    };

    card.addEventListener('mousemove', handleMouseMove);
    card.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      card.removeEventListener('mousemove', handleMouseMove);
      card.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [disabled, maxTilt, glare]);

  return (
    <Card
      ref={cardRef}
      className={cn(
        "relative transition-all duration-300 ease-out will-change-transform",
        "hover:scale-105 cursor-pointer overflow-hidden",
        className
      )}
      style={{
        transform: disabled 
          ? 'none'
          : `perspective(${perspective}px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale(${tilt.x !== 0 || tilt.y !== 0 ? scale : 1})`,
        transformStyle: 'preserve-3d',
      }}
      {...props}
    >
      {children}
      {glare && !disabled && (
        <div
          className="absolute inset-0 pointer-events-none opacity-20"
          style={{
            background: `radial-gradient(circle at ${glarePosition.x}% ${glarePosition.y}%, rgba(255,255,255,0.8) 0%, transparent 50%)`,
            transition: 'opacity 0.3s ease',
          }}
        />
      )}
    </Card>
  );
};
