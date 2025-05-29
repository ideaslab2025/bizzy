
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Clock, 
  Zap, 
  FileText, 
  Navigation, 
  Settings,
  Calculator,
  Mic,
  MicOff,
  ChevronRight,
  Star
} from 'lucide-react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

// Extend window interface for SpeechRecognition
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
  
  interface SpeechRecognition extends EventTarget {
    continuous: boolean;
    interimResults: boolean;
    onresult: (event: SpeechRecognitionEvent) => void;
    onerror: () => void;
    start: () => void;
    stop: () => void;
  }
  
  interface SpeechRecognitionEvent {
    results: SpeechRecognitionResultList;
  }
  
  interface SpeechRecognitionResultList {
    [index: number]: SpeechRecognitionResult;
  }
  
  interface SpeechRecognitionResult {
    [index: number]: SpeechRecognitionAlternative;
  }
  
  interface SpeechRecognitionAlternative {
    transcript: string;
  }
}

interface Command {
  id: string;
  title: string;
  description?: string;
  category: 'navigate' | 'action' | 'search' | 'calculate';
  keywords: string[];
  shortcut?: string;
  icon: React.ReactNode;
  action: () => void;
  preview?: string;
  isRecent?: boolean;
  usageCount?: number;
}

interface EnhancedCommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  commands?: Command[];
}

const mockCommands: Command[] = [
  {
    id: '1',
    title: 'Navigate to Documents',
    description: 'View all your business documents',
    category: 'navigate',
    keywords: ['documents', 'files', 'papers'],
    shortcut: 'Ctrl+D',
    icon: <FileText className="w-4 h-4" />,
    action: () => console.log('Navigate to documents'),
    preview: 'Access your document library with templates and forms',
    isRecent: true,
    usageCount: 15
  },
  {
    id: '2',
    title: 'Open Settings',
    description: 'Configure your account preferences',
    category: 'navigate',
    keywords: ['settings', 'preferences', 'config'],
    shortcut: 'Ctrl+,',
    icon: <Settings className="w-4 h-4" />,
    action: () => console.log('Open settings'),
    usageCount: 8
  },
  {
    id: '3',
    title: 'Search Documents',
    description: 'Find specific documents or content',
    category: 'search',
    keywords: ['search', 'find', 'documents'],
    icon: <Search className="w-4 h-4" />,
    action: () => console.log('Search documents'),
    usageCount: 22
  }
];

export const EnhancedCommandPalette: React.FC<EnhancedCommandPaletteProps> = ({
  open,
  onOpenChange,
  commands = mockCommands
}) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isListening, setIsListening] = useState(false);
  const [recentCommands, setRecentCommands] = useState<string[]>([]);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const recognition = useRef<SpeechRecognition | null>(null);

  // Initialize speech recognition
  useEffect(() => {
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognition.current = new SpeechRecognition();
      recognition.current.continuous = false;
      recognition.current.interimResults = false;
      
      recognition.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setQuery(transcript);
        setIsListening(false);
      };
      
      recognition.current.onerror = () => {
        setIsListening(false);
      };
    }
  }, []);

  // Load recent commands and search history
  useEffect(() => {
    if (open) {
      const recent = JSON.parse(localStorage.getItem('recent-commands') || '[]');
      const history = JSON.parse(localStorage.getItem('search-history') || '[]');
      setRecentCommands(recent);
      setSearchHistory(history);
    }
  }, [open]);

  // Reset state when dialog opens
  useEffect(() => {
    if (open) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open]);

  // Fuzzy search with typo correction
  const searchCommands = (query: string) => {
    if (!query.trim()) {
      // Show recent commands when no query
      return commands
        .filter(cmd => recentCommands.includes(cmd.id))
        .sort((a, b) => (b.usageCount || 0) - (a.usageCount || 0));
    }

    const normalizedQuery = query.toLowerCase();
    
    // Simple typo correction
    const corrections: Record<string, string> = {
      'doucments': 'documents',
      'setings': 'settings',
      'documnets': 'documents'
    };
    
    const correctedQuery = corrections[normalizedQuery] || normalizedQuery;
    
    return commands
      .map(cmd => {
        let score = 0;
        
        // Exact title match
        if (cmd.title.toLowerCase().includes(correctedQuery)) {
          score += 100;
        }
        
        // Keyword match
        cmd.keywords.forEach(keyword => {
          if (keyword.includes(correctedQuery)) {
            score += 50;
          }
        });
        
        // Description match
        if (cmd.description?.toLowerCase().includes(correctedQuery)) {
          score += 25;
        }
        
        // Boost recent commands
        if (recentCommands.includes(cmd.id)) {
          score += 10;
        }
        
        // Boost by usage count
        score += (cmd.usageCount || 0);
        
        return { ...cmd, score };
      })
      .filter(cmd => cmd.score > 0)
      .sort((a, b) => b.score - a.score);
  };

  // Handle calculation
  const handleCalculation = (query: string): Command | null => {
    try {
      const mathExpression = query.replace(/[^0-9+\-*/().\s]/g, '');
      const result = Function(`"use strict"; return (${mathExpression})`)();
      return {
        id: 'calc',
        title: `${mathExpression} = ${result}`,
        description: 'Quick calculation',
        category: 'calculate' as const,
        keywords: ['calc'],
        icon: <Calculator className="w-4 h-4" />,
        action: () => {
          navigator.clipboard.writeText(result.toString());
          onOpenChange(false);
        },
        preview: 'Copy result to clipboard',
        shortcut: 'Enter'
      };
    } catch {
      return null;
    }
  };

  const filteredCommands = searchCommands(query);
  
  // Add calculation result if query looks like math
  const calculationResult = /^[\d+\-*/().\s]+$/.test(query) ? handleCalculation(query) : null;
  const finalCommands = calculationResult ? [calculationResult, ...filteredCommands] : filteredCommands;

  const executeCommand = (command: Command) => {
    // Update recent commands
    const newRecent = [command.id, ...recentCommands.filter(id => id !== command.id)].slice(0, 5);
    setRecentCommands(newRecent);
    localStorage.setItem('recent-commands', JSON.stringify(newRecent));
    
    // Update search history
    if (query) {
      const newHistory = [query, ...searchHistory.filter(q => q !== query)].slice(0, 10);
      setSearchHistory(newHistory);
      localStorage.setItem('search-history', JSON.stringify(newHistory));
    }
    
    command.action();
    onOpenChange(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => Math.min(prev + 1, finalCommands.length - 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => Math.max(prev - 1, 0));
        break;
      case 'Enter':
        e.preventDefault();
        if (finalCommands[selectedIndex]) {
          executeCommand(finalCommands[selectedIndex]);
        }
        break;
      case 'Escape':
        onOpenChange(false);
        break;
    }
  };

  const toggleVoiceInput = () => {
    if (!recognition.current) return;
    
    if (isListening) {
      recognition.current.stop();
      setIsListening(false);
    } else {
      recognition.current.start();
      setIsListening(true);
    }
  };

  const getCategoryIcon = (category: Command['category']) => {
    switch (category) {
      case 'navigate': return <Navigation className="w-3 h-3" />;
      case 'action': return <Zap className="w-3 h-3" />;
      case 'search': return <Search className="w-3 h-3" />;
      case 'calculate': return <Calculator className="w-3 h-3" />;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="p-0 max-w-2xl top-[20%] glass-card">
        <div className="flex items-center gap-3 p-4 border-b">
          <Search className="w-5 h-5 text-gray-400" />
          <Input
            ref={inputRef}
            placeholder="Search commands, documents, or calculate..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            className="border-0 focus-visible:ring-0 text-lg"
          />
          
          {recognition.current && (
            <button
              onClick={toggleVoiceInput}
              className={cn(
                "p-2 rounded-lg transition-colors",
                isListening ? "bg-red-100 text-red-600" : "hover:bg-gray-100"
              )}
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>
          )}
        </div>

        <div className="max-h-96 overflow-y-auto">
          {finalCommands.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p>No commands found</p>
              {searchHistory.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm mb-2">Recent searches:</p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {searchHistory.slice(0, 3).map((term, index) => (
                      <button
                        key={index}
                        onClick={() => setQuery(term)}
                        className="px-2 py-1 bg-gray-100 rounded text-xs hover:bg-gray-200"
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="py-2">
              {finalCommands.map((command, index) => (
                <motion.div
                  key={command.id}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors",
                    index === selectedIndex && "bg-blue-50 border-r-2 border-blue-500"
                  )}
                  onClick={() => executeCommand(command)}
                  whileHover={{ x: 4 }}
                  onMouseEnter={() => setSelectedIndex(index)}
                >
                  <div className="flex items-center gap-2">
                    {command.icon}
                    <Badge variant="outline" className="text-xs">
                      {getCategoryIcon(command.category)}
                    </Badge>
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{command.title}</span>
                      {command.isRecent && (
                        <Clock className="w-3 h-3 text-gray-400" />
                      )}
                      {(command.usageCount || 0) > 10 && (
                        <Star className="w-3 h-3 text-yellow-500" />
                      )}
                    </div>
                    {command.description && (
                      <p className="text-sm text-gray-500">{command.description}</p>
                    )}
                    {command.preview && index === selectedIndex && (
                      <motion.p
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="text-xs text-blue-600 mt-1"
                      >
                        {command.preview}
                      </motion.p>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    {command.shortcut && (
                      <Badge variant="secondary" className="text-xs">
                        {command.shortcut}
                      </Badge>
                    )}
                    <ChevronRight className="w-3 h-3" />
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        <div className="px-4 py-2 border-t text-xs text-gray-500 flex justify-between">
          <span>Use ↑↓ to navigate, Enter to select, Esc to close</span>
          <span>Tip: Try voice input or natural language</span>
        </div>
      </DialogContent>
    </Dialog>
  );
};
