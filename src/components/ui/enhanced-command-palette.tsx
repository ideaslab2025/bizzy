
import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Search, FileText, HelpCircle, Settings, Sparkles, Building, Users, CheckCircle, Zap, BookOpen, Loader, X } from 'lucide-react';
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

  // Minimal business-focused command items
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
  ];

  // Minimal quick actions
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
    { id: 'documents', label: 'Files' },
    { id: 'guides', label: 'Updates' },
    { id: 'help', label: 'People' },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        className="p-0 max-w-4xl h-[520px] overflow-hidden bg-white rounded-xl border border-gray-200 shadow-2xl fixed left-[50%] top-[40%] translate-x-[-50%] translate-y-[-50%] z-50 [&>button]:hidden"
        aria-labelledby="command-palette-title"
        aria-describedby="command-palette-description"
      >
        <DialogTitle id="command-palette-title" className="sr-only">
          Command Palette
        </DialogTitle>
        <DialogDescription id="command-palette-description" className="sr-only">
          Search for documents, guides, and perform quick actions
        </DialogDescription>
        
        {/* Custom close button - positioned absolutely in top right */}
        <button
          onClick={() => onOpenChange(false)}
          className="absolute top-4 right-4 z-50 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {/* SEARCH INPUT - Monday.com style with larger text */}
        <div className="p-6 border-b border-gray-100 bg-white">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none z-10" />
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search Everything ..."
              className="w-full text-lg h-12 pl-12 pr-16 border-0 bg-transparent focus:outline-none placeholder-gray-400 text-gray-700"
              autoFocus
              autoComplete="off"
            />
          </div>
        </div>

        {/* TAB NAVIGATION - Monday.com style with rounded tabs */}
        <div className="flex items-center gap-2 px-6 py-4 border-b border-gray-100 bg-gray-50">
          {tabs.map((tab) => (
            <Button
              key={tab.id}
              variant="ghost"
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "px-4 py-2 text-sm font-medium rounded-full transition-all",
                activeTab === tab.id
                  ? "bg-blue-600 text-white shadow-md"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-200"
              )}
            >
              {tab.label}
            </Button>
          ))}
        </div>

        {/* CONTENT AREA - Fixed height to prevent size changes */}
        <div className="flex-1 overflow-hidden h-[380px]">
          {isSearching ? (
            <div className="flex items-center justify-center h-full">
              <Loader className="w-5 h-5 animate-spin text-gray-400" />
              <p className="text-sm text-gray-500 ml-2">Searching...</p>
            </div>
          ) : query.trim() && searchResults.length > 0 ? (
            <div className="p-6">
              <div className="grid grid-cols-3 gap-8">
                {/* Left Column - Related to me */}
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <Users className="w-4 h-4 text-orange-500" />
                    <h3 className="text-sm font-medium text-gray-700">Related to me</h3>
                  </div>
                  <div className="space-y-2">
                    {searchResults.filter(r => r.type === 'document').slice(0, 3).map((result, index) => {
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
                            "w-full text-left p-2 rounded-lg flex items-center gap-3 transition-all text-sm",
                            selectedIndex === globalIndex 
                              ? "bg-blue-50 text-blue-700" 
                              : "hover:bg-gray-50 text-gray-600"
                          )}
                          whileHover={{ scale: 1.01 }}
                          whileTap={{ scale: 0.99 }}
                        >
                          <IconComponent className="w-4 h-4 text-gray-400 flex-shrink-0" />
                          <span className="truncate">{result.title}</span>
                        </motion.button>
                      );
                    })}
                  </div>
                </div>

                {/* Middle Column - Saved Searches */}
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <Sparkles className="w-4 h-4 text-green-500" />
                    <h3 className="text-sm font-medium text-gray-700">Saved Searches</h3>
                  </div>
                  <div className="space-y-2">
                    {searchResults.filter(r => r.type === 'guide').slice(0, 3).map((result, index) => {
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
                            "w-full text-left p-2 rounded-lg flex items-center gap-3 transition-all text-sm",
                            selectedIndex === globalIndex 
                              ? "bg-blue-50 text-blue-700" 
                              : "hover:bg-gray-50 text-gray-600"
                          )}
                          whileHover={{ scale: 1.01 }}
                          whileTap={{ scale: 0.99 }}
                        >
                          <IconComponent className="w-4 h-4 text-gray-400 flex-shrink-0" />
                          <span className="truncate">{result.title}</span>
                        </motion.button>
                      );
                    })}
                  </div>
                </div>

                {/* Right Column - Recent Searches */}
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <Search className="w-4 h-4 text-blue-500" />
                    <h3 className="text-sm font-medium text-gray-700">Recent Searches</h3>
                  </div>
                  <div className="space-y-2">
                    {searchResults.filter(r => r.type === 'step').slice(0, 3).map((result, index) => {
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
                            "w-full text-left p-2 rounded-lg flex items-center gap-3 transition-all text-sm",
                            selectedIndex === globalIndex 
                              ? "bg-blue-50 text-blue-700" 
                              : "hover:bg-gray-50 text-gray-600"
                          )}
                          whileHover={{ scale: 1.01 }}
                          whileTap={{ scale: 0.99 }}
                        >
                          <IconComponent className="w-4 h-4 text-gray-400 flex-shrink-0" />
                          <span className="truncate">{result.title}</span>
                        </motion.button>
                      );
                    })}
                  </div>
                </div>
              </div>
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
            <div className="p-6">
              <div className="grid grid-cols-3 gap-8">
                {/* Left Column - Related to me */}
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <Users className="w-4 h-4 text-orange-500" />
                    <h3 className="text-sm font-medium text-gray-700">Related to me</h3>
                  </div>
                  <div className="space-y-2">
                    {filteredItems.slice(0, 3).map((item, index) => {
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
                            "w-full text-left p-2 rounded-lg flex items-center gap-3 transition-all text-sm",
                            selectedIndex === index 
                              ? "bg-blue-50 text-blue-700" 
                              : "hover:bg-gray-50 text-gray-600"
                          )}
                          whileHover={{ scale: 1.01 }}
                          whileTap={{ scale: 0.99 }}
                        >
                          <IconComponent className="w-4 h-4 text-gray-400 flex-shrink-0" />
                          <span className="truncate">{item.title}</span>
                        </motion.button>
                      );
                    })}
                  </div>
                </div>

                {/* Middle Column - Quick tip */}
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <Zap className="w-4 h-4 text-yellow-500" />
                    <h3 className="text-sm font-medium text-gray-700">Quick Search Tip</h3>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <kbd className="px-2 py-1 bg-white border border-gray-200 rounded text-xs font-mono">Ctrl</kbd>
                      <span className="text-xs text-gray-500">+</span>
                      <kbd className="px-2 py-1 bg-white border border-gray-200 rounded text-xs font-mono">B</kbd>
                    </div>
                    <p className="text-xs text-gray-600">Use this keyboard shortcut to find boards, dashboards and workspaces faster!</p>
                  </div>
                </div>

                {/* Right Column - Empty for now */}
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <Search className="w-4 h-4 text-blue-500" />
                    <h3 className="text-sm font-medium text-gray-700">Recent Searches</h3>
                  </div>
                  <div className="text-xs text-gray-500">
                    No recent searches
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
