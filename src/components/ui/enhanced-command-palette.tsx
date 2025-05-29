
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Calculator, Calendar, FileText, Settings, Sparkles, Clock, TrendingUp } from 'lucide-react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface CommandItem {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  category: string;
  action: () => void;
  shortcut?: string;
  recent?: boolean;
}

interface EnhancedCommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const EnhancedCommandPalette: React.FC<EnhancedCommandPaletteProps> = ({
  open,
  onOpenChange,
}) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Mock command items
  const commands: CommandItem[] = [
    {
      id: '1',
      title: 'Go to Dashboard',
      description: 'Navigate to your dashboard',
      icon: FileText,
      category: 'Navigation',
      action: () => console.log('Dashboard'),
      shortcut: '⌘D',
      recent: true,
    },
    {
      id: '2',
      title: 'Open Calculator',
      description: 'Quick calculations',
      icon: Calculator,
      category: 'Tools',
      action: () => console.log('Calculator'),
      shortcut: '⌘C',
    },
    {
      id: '3',
      title: 'View Calendar',
      description: 'Check your schedule',
      icon: Calendar,
      category: 'Navigation',
      action: () => console.log('Calendar'),
      shortcut: '⌘K',
    },
    {
      id: '4',
      title: 'Settings',
      description: 'Manage your preferences',
      icon: Settings,
      category: 'System',
      action: () => console.log('Settings'),
      shortcut: '⌘,',
    },
  ];

  const filteredCommands = commands.filter(command =>
    command.title.toLowerCase().includes(query.toLowerCase()) ||
    command.description.toLowerCase().includes(query.toLowerCase())
  );

  const groupedCommands = filteredCommands.reduce((groups, command) => {
    const category = command.category;
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(command);
    return groups;
  }, {} as Record<string, CommandItem[]>);

  useEffect(() => {
    if (open && inputRef.current) {
      // Use a small delay to ensure the dialog is fully rendered
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [open]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => Math.min(prev + 1, filteredCommands.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => Math.max(prev - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredCommands[selectedIndex]) {
        filteredCommands[selectedIndex].action();
        onOpenChange(false);
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="p-0 max-w-2xl mx-auto mt-20 fixed top-0 left-1/2 transform -translate-x-1/2 z-50">
        <div className="flex flex-col">
          {/* Search Input */}
          <div className="flex items-center border-b px-4 py-3">
            <Search className="w-4 h-4 text-gray-400 mr-3 flex-shrink-0" />
            <Input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search for commands, documents, or ask a question..."
              className="border-0 bg-transparent focus:ring-0 text-base"
            />
            {query && (
              <Badge variant="secondary" className="ml-2">
                <Sparkles className="w-3 h-3 mr-1" />
                AI Enhanced
              </Badge>
            )}
          </div>

          {/* Results */}
          <div className="max-h-96 overflow-y-auto">
            {Object.keys(groupedCommands).length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <Search className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>No results found for "{query}"</p>
                <p className="text-sm mt-1">Try different keywords or check spelling</p>
              </div>
            ) : (
              Object.entries(groupedCommands).map(([category, items]) => (
                <div key={category} className="p-2">
                  <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wide px-2 py-1 mb-1">
                    {category}
                  </h3>
                  {items.map((command, index) => {
                    const globalIndex = filteredCommands.indexOf(command);
                    const IconComponent = command.icon;
                    return (
                      <motion.button
                        key={command.id}
                        className={cn(
                          "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors",
                          selectedIndex === globalIndex ? "bg-blue-50 text-blue-700" : "hover:bg-gray-50"
                        )}
                        onClick={() => {
                          command.action();
                          onOpenChange(false);
                        }}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                      >
                        <IconComponent className="w-4 h-4 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{command.title}</span>
                            {command.recent && (
                              <Badge variant="outline" className="text-xs">
                                <Clock className="w-3 h-3 mr-1" />
                                Recent
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-500 truncate">{command.description}</p>
                        </div>
                        {command.shortcut && (
                          <Badge variant="outline" className="text-xs">
                            {command.shortcut}
                          </Badge>
                        )}
                      </motion.button>
                    );
                  })}
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="border-t p-3 text-xs text-gray-500 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span>↑↓ Navigate</span>
              <span>↵ Select</span>
              <span>⌘K Open</span>
            </div>
            <div className="flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              <span>AI-powered search</span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
