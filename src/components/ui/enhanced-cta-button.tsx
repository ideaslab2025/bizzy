
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface RippleEffect {
  x: number;
  y: number;
  size: number;
  id: number;
}

const useRipple = () => {
  const [ripples, setRipples] = useState<RippleEffect[]>([]);

  const addRipple = (event: React.MouseEvent<HTMLButtonElement>) => {
    const button = event.currentTarget;
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    
    const newRipple: RippleEffect = {
      x,
      y,
      size,
      id: Date.now()
    };

    setRipples(prev => [...prev, newRipple]);

    setTimeout(() => {
      setRipples(prev => prev.filter(ripple => ripple.id !== newRipple.id));
    }, 600);
  };

  return { ripples, addRipple };
};

const RippleComponent = ({ ripples }: { ripples: RippleEffect[] }) => (
  <>
    {ripples.map(ripple => (
      <span
        key={ripple.id}
        className="absolute rounded-full bg-white/20 pointer-events-none animate-ping"
        style={{
          left: ripple.x,
          top: ripple.y,
          width: ripple.size,
          height: ripple.size,
          animationDuration: '0.6s',
          animationIterationCount: '1'
        }}
      />
    ))}
  </>
);

const LoadingSpinner = () => (
  <motion.div
    className="inline-block"
    animate={{ rotate: 360 }}
    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
  >
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-current">
      <circle 
        cx="12" 
        cy="12" 
        r="10" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeDasharray="80" 
        strokeDashoffset="60"
      />
    </svg>
  </motion.div>
);

const AnimatedArrow = ({ direction = 'right' }: { direction?: 'right' | 'down' }) => {
  return (
    <motion.span
      className="inline-block ml-2"
      animate={{ x: direction === 'right' ? [0, 4, 0] : 0, y: direction === 'down' ? [0, 4, 0] : 0 }}
      transition={{ 
        repeat: Infinity, 
        duration: 2, 
        ease: "easeInOut" 
      }}
    >
      {direction === 'right' ? '→' : '↓'}
    </motion.span>
  );
};

interface EnhancedCTAButtonProps {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'default' | 'lg';
  loading?: boolean;
  showArrow?: boolean;
  arrowDirection?: 'right' | 'down';
  children: React.ReactNode;
  className?: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
}

export const EnhancedCTAButton: React.FC<EnhancedCTAButtonProps> = ({
  variant = 'primary',
  size = 'default',
  loading = false,
  showArrow = false,
  arrowDirection = 'right',
  className,
  onClick,
  children,
  disabled,
  type = 'button',
}) => {
  const { ripples, addRipple } = useRipple();

  const baseClasses = "relative overflow-hidden font-semibold rounded-lg transition-all duration-300 ease-out focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variantClasses = {
    primary: "bg-gradient-to-r from-[#3B82F6] to-[#1E40AF] text-white hover:from-[#2563EB] hover:to-[#1D4ED8] hover:shadow-lg hover:shadow-blue-500/25 focus:ring-blue-500 before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent before:translate-x-[-100%] before:transition-transform before:duration-500 hover:before:translate-x-[100%]",
    secondary: "bg-white text-[#3B82F6] border-2 border-[#3B82F6] hover:bg-blue-50 hover:shadow-lg hover:shadow-blue-500/15 focus:ring-blue-500",
    outline: "bg-transparent text-gray-700 border-2 border-gray-300 hover:border-gray-400 hover:bg-gray-50 hover:shadow-md focus:ring-gray-500"
  };

  const sizeClasses = {
    sm: "px-4 py-2 text-sm",
    default: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg"
  };

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!disabled && !loading) {
      addRipple(e);
      onClick?.(e);
    }
  };

  return (
    <motion.button
      type={type}
      className={cn(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      onClick={handleClick}
      disabled={disabled || loading}
      whileHover={{ 
        scale: (disabled || loading) ? 1 : 1.02,
        y: (disabled || loading) ? 0 : -1,
        transition: { type: "spring", stiffness: 400, damping: 10 }
      }}
      whileTap={{ 
        scale: (disabled || loading) ? 1 : 0.98,
        transition: { type: "spring", stiffness: 400, damping: 10 }
      }}
    >
      <span className="relative z-10 flex items-center justify-center">
        {loading ? (
          <>
            <LoadingSpinner />
            <span className="ml-2">Processing...</span>
          </>
        ) : (
          <>
            {children}
            {showArrow && <AnimatedArrow direction={arrowDirection} />}
          </>
        )}
      </span>
      <RippleComponent ripples={ripples} />
    </motion.button>
  );
};
