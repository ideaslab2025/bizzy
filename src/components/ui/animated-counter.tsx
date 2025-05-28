
import React, { useEffect, useState, useRef } from 'react';
import { cn } from '@/lib/utils';

interface AnimatedCounterProps {
  value: number;
  duration?: number; // in milliseconds
  prefix?: string;
  suffix?: string;
  decimals?: number;
  useGrouping?: boolean;
  triggerOnView?: boolean;
  className?: string;
  onComplete?: () => void;
}

export const AnimatedCounter: React.FC<AnimatedCounterProps> = ({
  value,
  duration = 2000,
  prefix = '',
  suffix = '',
  decimals = 0,
  useGrouping = true,
  triggerOnView = true,
  className,
  onComplete,
}) => {
  const [currentValue, setCurrentValue] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const elementRef = useRef<HTMLSpanElement>(null);
  const startTimeRef = useRef<number>();
  const animationIdRef = useRef<number>();

  const formatNumber = (num: number) => {
    const options: Intl.NumberFormatOptions = {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
      useGrouping,
    };
    return new Intl.NumberFormat('en-GB', options).format(num);
  };

  const easeOutQuart = (t: number): number => {
    return 1 - Math.pow(1 - t, 4);
  };

  const animate = (timestamp: number) => {
    if (!startTimeRef.current) {
      startTimeRef.current = timestamp;
    }

    const elapsed = timestamp - startTimeRef.current;
    const progress = Math.min(elapsed / duration, 1);
    const easedProgress = easeOutQuart(progress);
    
    setCurrentValue(value * easedProgress);

    if (progress < 1) {
      animationIdRef.current = requestAnimationFrame(animate);
    } else {
      setCurrentValue(value);
      onComplete?.();
      // Add bounce effect at completion
      if (elementRef.current) {
        elementRef.current.style.transform = 'scale(1.1)';
        setTimeout(() => {
          if (elementRef.current) {
            elementRef.current.style.transform = 'scale(1)';
          }
        }, 150);
      }
    }
  };

  const startAnimation = () => {
    if (hasAnimated) return;
    
    // Check if already animated in this session
    const sessionKey = `animated-counter-${value}-${prefix}-${suffix}`;
    if (sessionStorage.getItem(sessionKey)) {
      setCurrentValue(value);
      return;
    }

    setHasAnimated(true);
    sessionStorage.setItem(sessionKey, 'true');
    startTimeRef.current = undefined;
    animationIdRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    if (!triggerOnView) {
      startAnimation();
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            startAnimation();
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
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
  }, [triggerOnView]);

  return (
    <span
      ref={elementRef}
      className={cn(
        "font-mono transition-transform duration-150 ease-out",
        className
      )}
    >
      {prefix}{formatNumber(currentValue)}{suffix}
    </span>
  );
};

// Specialized counter components
export const CurrencyCounter: React.FC<Omit<AnimatedCounterProps, 'prefix' | 'decimals'> & { currency?: string }> = ({
  currency = '£',
  ...props
}) => (
  <AnimatedCounter {...props} prefix={currency} decimals={2} />
);

export const PercentageCounter: React.FC<Omit<AnimatedCounterProps, 'suffix' | 'decimals'>> = (props) => (
  <AnimatedCounter {...props} suffix="%" decimals={1} />
);

export const LargeNumberCounter: React.FC<AnimatedCounterProps> = ({ value, ...props }) => {
  const formatLargeNumber = (num: number) => {
    if (num >= 1000000) {
      return { value: num / 1000000, suffix: 'M' };
    } else if (num >= 1000) {
      return { value: num / 1000, suffix: 'K' };
    }
    return { value: num, suffix: '' };
  };

  const { value: formattedValue, suffix } = formatLargeNumber(value);

  return (
    <AnimatedCounter
      {...props}
      value={formattedValue}
      suffix={suffix}
      decimals={formattedValue < 10 ? 1 : 0}
    />
  );
};

// Staggered counters container
interface StaggeredCountersProps {
  children: React.ReactElement<AnimatedCounterProps>[];
  staggerDelay?: number;
  className?: string;
}

export const StaggeredCounters: React.FC<StaggeredCountersProps> = ({
  children,
  staggerDelay = 100,
  className,
}) => {
  return (
    <div className={cn("flex gap-4", className)}>
      {React.Children.map(children, (child, index) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, {
            ...child.props,
            duration: (child.props.duration || 2000) + (index * staggerDelay),
          });
        }
        return child;
      })}
    </div>
  );
};
