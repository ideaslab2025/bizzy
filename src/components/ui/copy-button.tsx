
import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

interface CopyButtonProps {
  text: string;
  className?: string;
  size?: 'sm' | 'default' | 'lg' | 'icon';
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  showOnHover?: boolean;
}

export const CopyButton: React.FC<CopyButtonProps> = ({ 
  text, 
  className,
  size = 'icon',
  variant = 'ghost',
  showOnHover = true
}) => {
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setError(false);
      
      // Reset after 2 seconds
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (err) {
      setError(true);
      setTimeout(() => {
        setError(false);
      }, 2000);
    }
  };

  const getTooltipText = () => {
    if (copied) return 'Copied!';
    if (error) return 'Failed to copy';
    return 'Copy to clipboard';
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant={variant}
            size={size}
            onClick={handleCopy}
            className={cn(
              'transition-all duration-200 ease-in-out',
              'hover:scale-105 active:scale-95',
              showOnHover && 'opacity-0 group-hover:opacity-100 md:opacity-0 md:group-hover:opacity-100',
              !showOnHover && 'opacity-100',
              copied && 'text-green-600',
              error && 'text-red-600',
              className
            )}
            aria-label={getTooltipText()}
          >
            <div className="relative">
              <Copy 
                className={cn(
                  'h-4 w-4 transition-all duration-300 ease-in-out',
                  copied ? 'scale-0 opacity-0' : 'scale-100 opacity-100'
                )}
              />
              <Check 
                className={cn(
                  'h-4 w-4 absolute inset-0 transition-all duration-300 ease-in-out',
                  copied ? 'scale-100 opacity-100' : 'scale-0 opacity-0'
                )}
              />
            </div>
          </Button>
        </TooltipTrigger>
        <TooltipContent side="top" className="text-xs">
          {getTooltipText()}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
