
import React from 'react';
import { Button } from '@/components/ui/button';
import { Search, Command } from 'lucide-react';
import { cn } from '@/lib/utils';

interface GlobalSearchTriggerProps {
  onClick: () => void;
  className?: string;
  variant?: 'button' | 'input';
}

export const GlobalSearchTrigger: React.FC<GlobalSearchTriggerProps> = ({
  onClick,
  className,
  variant = 'input'
}) => {
  if (variant === 'button') {
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={onClick}
        className={cn("flex items-center gap-2", className)}
      >
        <Search className="w-4 h-4" />
        Search
        <kbd className="ml-2 px-1.5 py-0.5 bg-gray-100 border border-gray-200 rounded text-xs font-mono">
          ⌘K
        </kbd>
      </Button>
    );
  }

  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors text-left",
        className
      )}
    >
      <Search className="w-4 h-4 text-gray-400" />
      <span className="text-gray-500 flex-1">Search everything...</span>
      <div className="flex items-center gap-1">
        <kbd className="px-2 py-1 bg-white border border-gray-200 rounded text-xs font-mono text-gray-600">
          <Command className="w-3 h-3 inline mr-1" />
          K
        </kbd>
      </div>
    </button>
  );
};
