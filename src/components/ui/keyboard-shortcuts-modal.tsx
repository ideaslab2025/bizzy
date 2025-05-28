
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Search, X, Keyboard } from 'lucide-react';
import { cn } from '@/lib/utils';

interface KeyboardShortcut {
  id: string;
  keys: string[];
  description: string;
  category: string;
}

interface KeyboardShortcutsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const KeyboardShortcutsModal: React.FC<KeyboardShortcutsModalProps> = ({
  open,
  onOpenChange,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isMac, setIsMac] = useState(false);

  useEffect(() => {
    setIsMac(navigator.platform.toUpperCase().indexOf('MAC') >= 0);
  }, []);

  const shortcuts: KeyboardShortcut[] = [
    // Navigation shortcuts
    { id: 'nav-dashboard', keys: ['g', 'd'], description: 'Go to Dashboard', category: 'Navigation' },
    { id: 'nav-documents', keys: ['g', 'o'], description: 'Go to Documents', category: 'Navigation' },
    { id: 'nav-guided-help', keys: ['g', 'h'], description: 'Go to Guided Help', category: 'Navigation' },
    { id: 'nav-search', keys: ['g', 's'], description: 'Focus Search', category: 'Navigation' },
    { id: 'nav-settings', keys: ['g', ','], description: 'Go to Settings', category: 'Navigation' },

    // Actions shortcuts
    { id: 'action-command', keys: [isMac ? '⌘' : 'Ctrl', 'k'], description: 'Open Command Palette', category: 'Actions' },
    { id: 'action-save', keys: [isMac ? '⌘' : 'Ctrl', 's'], description: 'Save Current Document', category: 'Actions' },
    { id: 'action-new', keys: [isMac ? '⌘' : 'Ctrl', 'n'], description: 'New Document', category: 'Actions' },
    { id: 'action-help', keys: ['?'], description: 'Show Keyboard Shortcuts', category: 'Actions' },
    { id: 'action-close', keys: ['Escape'], description: 'Close Modal/Dialog', category: 'Actions' },

    // Documents shortcuts
    { id: 'doc-open', keys: ['d'], description: 'Open Documents Library', category: 'Documents' },
    { id: 'doc-filter', keys: ['f'], description: 'Focus Document Filters', category: 'Documents' },
    { id: 'doc-download', keys: [isMac ? '⌘' : 'Ctrl', 'd'], description: 'Download Selected Document', category: 'Documents' },

    // Chat shortcuts
    { id: 'chat-toggle', keys: ['c'], description: 'Toggle Bizzy Chat', category: 'Chat' },
    { id: 'chat-focus', keys: [isMac ? '⌘' : 'Ctrl', 'i'], description: 'Focus Chat Input', category: 'Chat' },

    // General shortcuts
    { id: 'general-refresh', keys: [isMac ? '⌘' : 'Ctrl', 'r'], description: 'Refresh Page', category: 'General' },
    { id: 'general-back', keys: [isMac ? '⌘' : 'Alt', '←'], description: 'Go Back', category: 'General' },
    { id: 'general-forward', keys: [isMac ? '⌘' : 'Alt', '→'], description: 'Go Forward', category: 'General' },
  ];

  const filteredShortcuts = shortcuts.filter(shortcut =>
    shortcut.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    shortcut.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    shortcut.keys.some(key => key.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const groupedShortcuts = filteredShortcuts.reduce((acc, shortcut) => {
    if (!acc[shortcut.category]) {
      acc[shortcut.category] = [];
    }
    acc[shortcut.category].push(shortcut);
    return acc;
  }, {} as Record<string, KeyboardShortcut[]>);

  const renderKey = (key: string) => {
    const isModifier = ['⌘', 'Ctrl', 'Alt', 'Shift', 'Meta'].includes(key);
    const isArrow = ['←', '→', '↑', '↓'].includes(key);
    
    return (
      <kbd
        key={key}
        className={cn(
          "inline-flex items-center justify-center min-w-[24px] h-6 px-2 text-xs font-medium rounded border border-gray-300 bg-gray-50 text-gray-700 shadow-sm",
          isModifier && "bg-gray-100 border-gray-400 font-semibold",
          isArrow && "min-w-[28px]"
        )}
      >
        {key}
      </kbd>
    );
  };

  const renderShortcut = (shortcut: KeyboardShortcut) => (
    <div key={shortcut.id} className="flex items-center justify-between py-2">
      <span className="text-sm text-gray-700 flex-1">{shortcut.description}</span>
      <div className="flex items-center gap-1">
        {shortcut.keys.map((key, index) => (
          <React.Fragment key={`${shortcut.id}-${key}-${index}`}>
            {index > 0 && (
              <span className="text-xs text-gray-400 mx-1">+</span>
            )}
            {renderKey(key)}
          </React.Fragment>
        ))}
      </div>
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="flex items-center gap-2">
            <Keyboard className="w-5 h-5" />
            Keyboard Shortcuts
            <Badge variant="outline" className="ml-auto text-xs">
              {isMac ? 'macOS' : 'Windows'}
            </Badge>
          </DialogTitle>
          <DialogDescription>
            View and search through all available keyboard shortcuts to navigate the application faster.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-shrink-0 relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search shortcuts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-10"
          />
          {searchQuery && (
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
              onClick={() => setSearchQuery('')}
            >
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>

        <div className="flex-1 overflow-y-auto space-y-6">
          {Object.entries(groupedShortcuts).map(([category, categoryShortcuts]) => (
            <div key={category}>
              <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
                {category}
                <Badge variant="secondary" className="ml-2 text-xs">
                  {categoryShortcuts.length}
                </Badge>
              </h3>
              <div className="space-y-1 border-l-2 border-gray-100 pl-4">
                {categoryShortcuts.map(renderShortcut)}
              </div>
            </div>
          ))}
          
          {filteredShortcuts.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <Keyboard className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p className="text-sm">No shortcuts found matching "{searchQuery}"</p>
            </div>
          )}
        </div>

        <div className="flex-shrink-0 pt-4 border-t bg-gray-50 -mx-6 -mb-6 px-6 py-4">
          <p className="text-xs text-gray-600 text-center">
            Press <kbd className="px-1.5 py-0.5 text-xs bg-gray-200 rounded">Escape</kbd> to close • 
            <kbd className="px-1.5 py-0.5 text-xs bg-gray-200 rounded mx-1">?</kbd> to reopen
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default KeyboardShortcutsModal;
