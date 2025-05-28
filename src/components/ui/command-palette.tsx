
import React, { useState, useEffect, useRef } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface Command {
  id: string;
  title: string;
  subtitle?: string;
  group: string;
  action: () => void;
  keywords: string[];
  shortcut?: string;
  icon?: React.ReactNode;
}

interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  open,
  onOpenChange,
}) => {
  const [search, setSearch] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);

  const commands: Command[] = [
    {
      id: 'dashboard',
      title: 'Go to Dashboard',
      group: 'Navigation',
      action: () => navigate('/dashboard'),
      keywords: ['dashboard', 'home', 'overview'],
      shortcut: '⌘1',
      icon: '🏠',
    },
    {
      id: 'documents',
      title: 'Go to Documents',
      group: 'Navigation',
      action: () => navigate('/dashboard/documents'),
      keywords: ['documents', 'files', 'templates'],
      shortcut: '⌘2',
      icon: '📄',
    },
    {
      id: 'guided-help',
      title: 'Go to Guided Help',
      group: 'Navigation',
      action: () => navigate('/guided-help'),
      keywords: ['help', 'guide', 'setup'],
      shortcut: '⌘3',
      icon: '🗺️',
    },
    {
      id: 'search-docs',
      title: 'Search Documents',
      subtitle: 'Find templates and forms',
      group: 'Search',
      action: () => {
        navigate('/dashboard/documents');
        // Focus search input after navigation
        setTimeout(() => {
          const searchInput = document.querySelector('input[placeholder*="search"]') as HTMLInputElement;
          if (searchInput) searchInput.focus();
        }, 100);
      },
      keywords: ['search', 'find', 'documents', 'templates'],
      shortcut: '⌘/',
      icon: '🔍',
    },
    {
      id: 'shortcuts',
      title: 'Show Keyboard Shortcuts',
      group: 'Help',
      action: () => {
        // This would trigger the shortcuts modal
        const event = new KeyboardEvent('keydown', { key: '?' });
        document.dispatchEvent(event);
      },
      keywords: ['shortcuts', 'keyboard', 'help'],
      shortcut: '?',
      icon: '⌨️',
    },
  ];

  const filteredCommands = commands.filter(command =>
    command.title.toLowerCase().includes(search.toLowerCase()) ||
    command.keywords.some(keyword =>
      keyword.toLowerCase().includes(search.toLowerCase())
    )
  );

  const groupedCommands = filteredCommands.reduce((groups, command) => {
    if (!groups[command.group]) {
      groups[command.group] = [];
    }
    groups[command.group].push(command);
    return groups;
  }, {} as Record<string, Command[]>);

  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
    }
  }, [open]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [search]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(i => Math.min(i + 1, filteredCommands.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(i => Math.max(i - 1, 0));
    } else if (e.key === 'Enter' && filteredCommands[selectedIndex]) {
      filteredCommands[selectedIndex].action();
      onOpenChange(false);
      setSearch('');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass-modal max-w-2xl p-0 gap-0">
        <div className="border-b p-4">
          <Input
            ref={inputRef}
            placeholder="Type a command or search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={handleKeyDown}
            className="border-0 focus-visible:ring-0 text-lg"
          />
        </div>
        
        <div className="max-h-96 overflow-y-auto p-2">
          {Object.entries(groupedCommands).map(([group, groupCommands]) => (
            <div key={group} className="mb-4">
              <div className="px-2 py-1 text-xs font-medium text-gray-500 uppercase tracking-wide">
                {group}
              </div>
              {groupCommands.map((command, index) => {
                const globalIndex = filteredCommands.indexOf(command);
                return (
                  <button
                    key={command.id}
                    onClick={() => {
                      command.action();
                      onOpenChange(false);
                      setSearch('');
                    }}
                    className={cn(
                      "w-full flex items-center justify-between p-3 rounded-lg text-left transition-colors",
                      globalIndex === selectedIndex
                        ? "bg-blue-50 text-blue-900"
                        : "hover:bg-gray-50"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-lg">{command.icon}</span>
                      <div>
                        <div className="font-medium">{command.title}</div>
                        {command.subtitle && (
                          <div className="text-sm text-gray-500">{command.subtitle}</div>
                        )}
                      </div>
                    </div>
                    {command.shortcut && (
                      <Badge variant="outline" className="text-xs">
                        {command.shortcut}
                      </Badge>
                    )}
                  </button>
                );
              })}
            </div>
          ))}
          
          {filteredCommands.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No commands found for "{search}"
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
