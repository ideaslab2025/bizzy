
import React, { useEffect, useState, useRef } from 'react';
import { cn } from '@/lib/utils';

interface AnimatedCounterProps {
  end: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  separator?: string;
  className?: string;
  onComplete?: () => void;
}

export const AnimatedCounter: React.FC<AnimatedCounterProps> = ({
  end,
  duration = 2000,
  prefix = '',
  suffix = '',
  decimals = 0,
  separator = ',',
  className,
  onComplete,
}) => {
  const [currentValue, setCurrentValue] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const elementRef = useRef<HTMLSpanElement>(null);
  const startTimeRef = useRef<number>();
  const animationIdRef = useRef<number>();

  // Format number with separators and decimals
  const formatNumber = (num: number) => {
    const fixed = num.toFixed(decimals);
    const parts = fixed.split('.');
    
    // Add thousands separators
    if (separator) {
      parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, separator);
    }
    
    return parts.join('.');
  };

  // Easing function for smooth animation
  const easeOutQuart = (t: number): number => {
    return 1 - Math.pow(1 - t, 4);
  };

  // Animation function using requestAnimationFrame
  const animate = (timestamp: number) => {
    if (!startTimeRef.current) {
      startTimeRef.current = timestamp;
    }

    const elapsed = timestamp - startTimeRef.current;
    const progress = Math.min(elapsed / duration, 1);
    const easedProgress = easeOutQuart(progress);
    
    setCurrentValue(end * easedProgress);

    if (progress < 1) {
      animationIdRef.current = requestAnimationFrame(animate);
    } else {
      setCurrentValue(end);
      onComplete?.();
    }
  };

  // Start animation when component comes into view
  const startAnimation = () => {
    if (hasAnimated) return;
    
    setHasAnimated(true);
    startTimeRef.current = undefined;
    animationIdRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            startAnimation();
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.3 }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => {
      observer.disconnect();
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
    };
  }, []);

  return (
    <span
      ref={elementRef}
      className={cn(
        "font-bold text-4xl md:text-5xl lg:text-6xl text-primary tabular-nums",
        "transition-all duration-300 ease-out",
        className
      )}
      role="timer"
      aria-live="polite"
      aria-label={`${prefix}${formatNumber(end)}${suffix}`}
    >
      {prefix}{formatNumber(currentValue)}{suffix}
    </span>
  );
};

// Specialized counter variants for common use cases
export const CurrencyCounter: React.FC<Omit<AnimatedCounterProps, 'prefix' | 'decimals'> & { currency?: string }> = ({
  currency = '£',
  ...props
}) => (
  <AnimatedCounter {...props} prefix={currency} decimals={2} />
);

export const PercentageCounter: React.FC<Omit<AnimatedCounterProps, 'suffix'>> = (props) => (
  <AnimatedCounter {...props} suffix="%" />
);

export const TimeCounter: React.FC<Omit<AnimatedCounterProps, 'suffix'>> = (props) => (
  <AnimatedCounter {...props} suffix=" hrs" />
);

export const PlusCounter: React.FC<Omit<AnimatedCounterProps, 'suffix'>> = (props) => (
  <AnimatedCounter {...props} suffix="+" />
);
