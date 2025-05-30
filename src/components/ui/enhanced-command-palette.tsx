
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

  // Debug: Log state changes
  useEffect(() => {
    console.log('Query state changed:', query);
    console.log('Active tab:', activeTab);
  }, [query, activeTab]);

  // Business-focused command items
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
    {
      id: 'team',
      title: 'Team Management',
      description: 'Manage team and permissions',
      icon: Users,
      category: 'business',
      action: () => navigate('/dashboard/team'),
      keywords: ['team', 'users', 'permissions', 'management'],
    },
  ];

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
    {
      id: 'next-task',
      title: 'Start next setup task',
      icon: Zap,
      category: 'guides',
      action: () => navigate('/guided-help'),
      keywords: ['task', 'next', 'setup', 'continue', 'guides'],
    },
    {
      id: 'settings',
      title: 'Account Settings',
      icon: Settings,
      category: 'settings',
      action: () => navigate('/dashboard/settings'),
      keywords: ['settings', 'account', 'preferences'],
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

  const businessItems = filteredItems.filter(item => item.category === 'business');
  const actionItems = filteredItems.filter(item => item.category !== 'business');

  // Focus input when dialog opens
  useEffect(() => {
    if (open && inputRef.current) {
      console.log('Dialog opened, focusing input...');
      const timer = setTimeout(() => {
        inputRef.current?.focus();
        console.log('Input focused successfully');
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
    { id: 'settings', label: 'Settings' },
    { id: 'help', label: 'Help' },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        className="p-0 max-w-3xl max-h-[80vh] overflow-hidden bg-white rounded-lg border shadow-2xl"
        aria-labelledby="command-palette-title"
        aria-describedby="command-palette-description"
      >
        <DialogTitle id="command-palette-title" className="sr-only">
          Command Palette
        </DialogTitle>
        <DialogDescription id="command-palette-description" className="sr-only">
          Search for documents, guides, and perform quick actions
        </DialogDescription>
        
        {/* SEARCH INPUT - ALWAYS VISIBLE AT TOP */}
        <div className="p-6 pb-3 border-b bg-white">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none z-10" />
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => {
                console.log('Input changed:', e.target.value);
                setQuery(e.target.value);
              }}
              onKeyDown={handleKeyDown}
              placeholder="Search everything..."
              className="w-full text-lg h-12 pl-10 pr-4 border border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 bg-white"
              autoFocus
              autoComplete="off"
            />
          </div>
        </div>

        {/* TAB NAVIGATION */}
        <div className="flex items-center gap-1 px-6 py-2 border-b bg-gray-50">
          {tabs.map((tab) => (
            <Button
              key={tab.id}
              variant="ghost"
              onClick={() => {
                console.log('Tab clicked:', tab.id);
                setActiveTab(tab.id);
              }}
              className={cn(
                "px-4 py-1.5 text-sm font-medium rounded",
                activeTab === tab.id
                  ? "bg-blue-100 text-blue-700"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              )}
            >
              {tab.label}
            </Button>
          ))}
        </div>

        {/* CONTENT AREA */}
        <div className="flex-1 overflow-y-auto max-h-[50vh]">
          {isSearching ? (
            <div className="text-center py-8">
              <Loader className="w-6 h-6 animate-spin mx-auto text-gray-400" />
              <p className="text-sm text-gray-500 mt-2">Searching...</p>
            </div>
          ) : query.trim() && searchResults.length > 0 ? (
            <div className="p-6 space-y-6">
              {['document', 'guide', 'step'].map(type => {
                const typeResults = searchResults.filter(r => r.type === type);
                if (typeResults.length === 0) return null;
                
                return (
                  <div key={type}>
                    <h3 className="text-xs font-semibold text-gray-500 uppercase mb-2">
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
                              "w-full text-left p-3 rounded-lg flex items-center gap-3 transition-colors",
                              selectedIndex === globalIndex ? "bg-blue-50 text-blue-700" : "hover:bg-gray-100"
                            )}
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                          >
                            <IconComponent className="w-5 h-5 text-gray-400 flex-shrink-0" />
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
            <div className="text-center py-8">
              <Search className="w-10 h-10 mx-auto text-gray-300" />
              <p className="mt-3 text-gray-600">No results found for "{query}"</p>
              <p className="text-sm text-gray-500 mt-1">Try different keywords or browse categories below</p>
            </div>
          ) : (
            <div className="p-6">
              {filteredItems.length > 0 ? (
                <div className="space-y-1">
                  {filteredItems.map((item, index) => {
                    const IconComponent = item.icon;
                    return (
                      <motion.button
                        key={item.id}
                        onClick={() => {
                          console.log('Item clicked:', item.title);
                          item.action();
                          onOpenChange(false);
                          setQuery('');
                        }}
                        className={cn(
                          "w-full text-left p-3 rounded-lg flex items-center gap-3 transition-colors",
                          selectedIndex === index ? "bg-blue-50 text-blue-700" : "hover:bg-gray-100"
                        )}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                      >
                        <IconComponent className="w-5 h-5 text-gray-400 flex-shrink-0" />
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
                <div className="text-center py-8">
                  <p className="text-gray-600">No items found in this category</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t p-3 text-xs text-gray-500 flex items-center justify-between bg-gray-50">
          <div className="flex items-center gap-4">
            <span>↑↓ Navigate</span>
            <span>↵ Select</span>
            <span>⌘K Open</span>
          </div>
          <div className="flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            <span>AI-powered search</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
