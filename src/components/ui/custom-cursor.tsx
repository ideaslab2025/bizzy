
import React, { useEffect, useState, useRef } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

interface CustomCursorProps {
  enabled?: boolean;
}

export const CustomCursor: React.FC<CustomCursorProps> = ({ enabled = true }) => {
  const isMobile = useIsMobile();
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [cursorType, setCursorType] = useState<'default' | 'pointer' | 'text' | 'grab' | 'grabbing' | 'help' | 'loading' | 'disabled'>('default');
  const [isClicking, setIsClicking] = useState(false);
  const cursorRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>();

  useEffect(() => {
    if (!enabled || isMobile) return;

    // Hide default cursor
    document.body.style.cursor = 'none';
    document.body.style.setProperty('--cursor-hidden', 'none');

    const updateCursor = (e: MouseEvent) => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }

      animationRef.current = requestAnimationFrame(() => {
        setPosition({ x: e.clientX, y: e.clientY });
      });

      // Determine cursor type based on element
      const target = e.target as HTMLElement;
      if (target.closest('button, a, [role="button"]')) {
        setCursorType('pointer');
      } else if (target.closest('input[type="text"], textarea, [contenteditable]')) {
        setCursorType('text');
      } else if (target.closest('[data-cursor="grab"]')) {
        setCursorType('grab');
      } else if (target.closest('[data-cursor="help"]')) {
        setCursorType('help');
      } else if (target.closest('[disabled], .disabled')) {
        setCursorType('disabled');
      } else {
        setCursorType('default');
      }
    };

    const handleMouseDown = () => {
      setIsClicking(true);
      if (cursorType === 'grab') setCursorType('grabbing');
    };

    const handleMouseUp = () => {
      setIsClicking(false);
      if (cursorType === 'grabbing') setCursorType('grab');
    };

    document.addEventListener('mousemove', updateCursor);
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.body.style.cursor = '';
      document.body.style.removeProperty('--cursor-hidden');
      document.removeEventListener('mousemove', updateCursor);
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mouseup', handleMouseUp);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [enabled, isMobile, cursorType]);

  if (!enabled || isMobile) return null;

  const getCursorIcon = () => {
    switch (cursorType) {
      case 'pointer':
        return '👆';
      case 'text':
        return '|';
      case 'grab':
        return '✋';
      case 'grabbing':
        return '👊';
      case 'help':
        return '❓';
      case 'loading':
        return '⏳';
      case 'disabled':
        return '🚫';
      default:
        return '→';
    }
  };

  return (
    <div
      ref={cursorRef}
      className={cn(
        'fixed top-0 left-0 pointer-events-none z-[9999] mix-blend-difference',
        'transition-transform duration-100 ease-out will-change-transform',
        isClicking && 'scale-75',
        cursorType === 'pointer' && 'scale-125',
        cursorType === 'disabled' && 'opacity-50'
      )}
      style={{
        transform: `translate3d(${position.x - 12}px, ${position.y - 12}px, 0)`,
      }}
    >
      <div className={cn(
        'w-6 h-6 rounded-full bg-white flex items-center justify-center text-xs',
        'shadow-lg backdrop-blur-sm border border-gray-200',
        cursorType === 'pointer' && 'bg-blue-500 text-white glow-blue',
        cursorType === 'text' && 'bg-green-500 text-white',
        cursorType === 'disabled' && 'bg-red-500 text-white',
        cursorType === 'loading' && 'animate-spin'
      )}>
        {getCursorIcon()}
      </div>
    </div>
  );
};
