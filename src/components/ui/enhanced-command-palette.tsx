
import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Search, FileText, HelpCircle, Settings, Sparkles, Building, Users, CheckCircle, Zap, BookOpen, Loader } from 'lucide-react';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

interface CommandItem {
  id: string;
  title: string;
  description?: string;
  icon: React.ElementType;
  category: string;
  action: () => void;
  keywords: string[];
}

interface SearchResult {
  id: string;
  title: string;
  description?: string;
  type: 'document' | 'guide' | 'step';
  icon: React.ElementType;
  action: () => void;
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
  const [activeTab, setActiveTab] = useState('all');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  // Reduced business-focused command items (removed some to save space)
  const businessRelatedItems: CommandItem[] = [
    {
      id: 'documents',
      title: 'My Documents',
      description: 'View business templates and forms',
      icon: FileText,
      category: 'documents',
      action: () => navigate('/dashboard/documents'),
      keywords: ['documents', 'templates', 'forms', 'files', 'business'],
    },
    {
      id: 'progress',
      title: 'Business Setup Progress',
      description: 'Track your setup journey',
      icon: Building,
      category: 'business',
      action: () => navigate('/dashboard'),
      keywords: ['progress', 'setup', 'dashboard', 'journey', 'business'],
    },
    {
      id: 'tasks',
      title: 'Current Tasks',
      description: 'Continue with guided setup',
      icon: CheckCircle,
      category: 'guides',
      action: () => navigate('/guided-help'),
      keywords: ['tasks', 'guidance', 'help', 'setup', 'guides'],
    },
  ];

  // Reduced quick actions (removed some to save space)
  const quickActions: CommandItem[] = [
    {
      id: 'upload',
      title: 'Upload new document',
      icon: FileText,
      category: 'documents',
      action: () => {
        navigate('/dashboard/documents');
        onOpenChange(false);
      },
      keywords: ['upload', 'document', 'file', 'add', 'documents'],
    },
    {
      id: 'bizzy',
      title: 'Talk to Bizzy AI',
      icon: HelpCircle,
      category: 'help',
      action: () => {
        onOpenChange(false);
        const event = new CustomEvent('openBizzy');
        window.dispatchEvent(event);
      },
      keywords: ['bizzy', 'ai', 'help', 'assistant'],
    },
  ];

  const allItems = [...businessRelatedItems, ...quickActions];

  // Real database search functionality
  const performSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    
    try {
      // Search across multiple tables
      const { data: documents } = await supabase
        .from('documents')
        .select('id, title, description, category')
        .or(`title.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`)
        .limit(5);

      const { data: guidanceSections } = await supabase
        .from('guidance_sections')
        .select('id, title, description')
        .or(`title.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`)
        .limit(5);

      const { data: guidanceSteps } = await supabase
        .from('guidance_steps')
        .select('id, title, content, section_id')
        .or(`title.ilike.%${searchQuery}%,content.ilike.%${searchQuery}%`)
        .limit(5);

      // Combine and format results
      const results: SearchResult[] = [
        ...(documents || []).map(doc => ({
          id: `doc-${doc.id}`,
          title: doc.title,
          description: doc.description,
          type: 'document' as const,
          icon: FileText,
          action: () => navigate(`/dashboard/documents`)
        })),
        ...(guidanceSections || []).map(section => ({
          id: `section-${section.id}`,
          title: section.title,
          description: section.description,
          type: 'guide' as const,
          icon: BookOpen,
          action: () => navigate(`/guided-help?section=${section.id}`)
        })),
        ...(guidanceSteps || []).map(step => ({
          id: `step-${step.id}`,
          title: step.title,
          description: step.content,
          type: 'step' as const,
          icon: CheckCircle,
          action: () => navigate(`/guided-help?section=${step.section_id}&step=${step.id}`)
        }))
      ];

      setSearchResults(results);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsSearching(false);
    }
  };

  // Debounce search to avoid too many queries
  useEffect(() => {
    const timer = setTimeout(() => {
      performSearch(query);
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  const filteredItems = allItems.filter(item => {
    const matchesQuery = query === '' || 
      item.title.toLowerCase().includes(query.toLowerCase()) ||
      item.description?.toLowerCase().includes(query.toLowerCase()) ||
      item.keywords.some(keyword => keyword.toLowerCase().includes(query.toLowerCase()));
    
    const matchesTab = activeTab === 'all' || item.category === activeTab;
    
    return matchesQuery && matchesTab;
  });

  // Focus input when dialog opens
  useEffect(() => {
    if (open && inputRef.current) {
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [open]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query, activeTab]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onOpenChange(false);
      return;
    }
    
    const allResults = query.trim() ? searchResults : filteredItems;
    
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => Math.min(prev + 1, allResults.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => Math.max(prev - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (query.trim() && searchResults[selectedIndex]) {
        searchResults[selectedIndex].action();
        onOpenChange(false);
        setQuery('');
      } else if (!query.trim() && filteredItems[selectedIndex]) {
        filteredItems[selectedIndex].action();
        onOpenChange(false);
        setQuery('');
      }
    }
  };

  const tabs = [
    { id: 'all', label: 'All' },
    { id: 'documents', label: 'Documents' },
    { id: 'guides', label: 'Guides' },
    { id: 'help', label: 'Help' },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        className="p-0 max-w-2xl h-[480px] overflow-hidden bg-white rounded-xl border border-gray-200 shadow-2xl"
        aria-labelledby="command-palette-title"
        aria-describedby="command-palette-description"
      >
        <DialogTitle id="command-palette-title" className="sr-only">
          Command Palette
        </DialogTitle>
        <DialogDescription id="command-palette-description" className="sr-only">
          Search for documents, guides, and perform quick actions
        </DialogDescription>
        
        {/* SEARCH INPUT - Monday.com style */}
        <div className="p-4 border-b border-gray-100 bg-white">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none z-10" />
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search for anything..."
              className="w-full text-sm h-10 pl-10 pr-4 border-0 bg-gray-50 rounded-lg focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all"
              autoFocus
              autoComplete="off"
            />
          </div>
        </div>

        {/* TAB NAVIGATION - Monday.com style */}
        <div className="flex items-center gap-0 px-4 py-2 border-b border-gray-100 bg-gray-50">
          {tabs.map((tab) => (
            <Button
              key={tab.id}
              variant="ghost"
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "px-3 py-1.5 text-xs font-medium rounded-md transition-all",
                activeTab === tab.id
                  ? "bg-white text-blue-600 shadow-sm border border-gray-200"
                  : "text-gray-600 hover:text-gray-900 hover:bg-white/50"
              )}
            >
              {tab.label}
            </Button>
          ))}
        </div>

        {/* CONTENT AREA - Fixed height to prevent size changes */}
        <div className="flex-1 overflow-y-auto h-[340px]">
          {isSearching ? (
            <div className="flex items-center justify-center h-full">
              <Loader className="w-5 h-5 animate-spin text-gray-400" />
              <p className="text-sm text-gray-500 ml-2">Searching...</p>
            </div>
          ) : query.trim() && searchResults.length > 0 ? (
            <div className="p-4 space-y-4">
              {['document', 'guide', 'step'].map(type => {
                const typeResults = searchResults.filter(r => r.type === type);
                if (typeResults.length === 0) return null;
                
                return (
                  <div key={type}>
                    <h3 className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-2">
                      {type === 'document' ? 'Documents' : type === 'guide' ? 'Guides' : 'Steps'}
                    </h3>
                    <div className="space-y-1">
                      {typeResults.map((result, index) => {
                        const globalIndex = searchResults.indexOf(result);
                        const IconComponent = result.icon;
                        return (
                          <motion.button
                            key={result.id}
                            onClick={() => {
                              result.action();
                              onOpenChange(false);
                              setQuery('');
                            }}
                            className={cn(
                              "w-full text-left p-3 rounded-lg flex items-center gap-3 transition-all",
                              selectedIndex === globalIndex 
                                ? "bg-blue-50 text-blue-700 border border-blue-200" 
                                : "hover:bg-gray-50"
                            )}
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                          >
                            <IconComponent className="w-4 h-4 text-gray-400 flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-sm">{result.title}</p>
                              {result.description && (
                                <p className="text-xs text-gray-500 truncate">{result.description}</p>
                              )}
                            </div>
                          </motion.button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : query.trim() && searchResults.length === 0 && !isSearching ? (
            <div className="flex items-center justify-center h-full text-center">
              <div>
                <Search className="w-8 h-8 mx-auto text-gray-300 mb-2" />
                <p className="text-gray-600 font-medium">No results found</p>
                <p className="text-sm text-gray-500 mt-1">Try different keywords</p>
              </div>
            </div>
          ) : (
            <div className="p-4">
              {filteredItems.length > 0 ? (
                <div className="space-y-1">
                  {filteredItems.map((item, index) => {
                    const IconComponent = item.icon;
                    return (
                      <motion.button
                        key={item.id}
                        onClick={() => {
                          item.action();
                          onOpenChange(false);
                          setQuery('');
                        }}
                        className={cn(
                          "w-full text-left p-3 rounded-lg flex items-center gap-3 transition-all",
                          selectedIndex === index 
                            ? "bg-blue-50 text-blue-700 border border-blue-200" 
                            : "hover:bg-gray-50"
                        )}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                      >
                        <IconComponent className="w-4 h-4 text-gray-400 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm">{item.title}</p>
                          {item.description && (
                            <p className="text-xs text-gray-500 truncate">{item.description}</p>
                          )}
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
              ) : (
                <div className="flex items-center justify-center h-full text-center">
                  <p className="text-gray-600">No items found in this category</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer - Monday.com style */}
        <div className="border-t border-gray-100 p-3 text-xs text-gray-400 flex items-center justify-between bg-gray-50">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <kbd className="px-1 py-0.5 bg-white border border-gray-200 rounded text-[10px]">↑↓</kbd>
              Navigate
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1 py-0.5 bg-white border border-gray-200 rounded text-[10px]">↵</kbd>
              Select
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1 py-0.5 bg-white border border-gray-200 rounded text-[10px]">⌘K</kbd>
              Open
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            <span>AI-powered</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
