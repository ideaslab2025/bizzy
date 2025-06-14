
import React, { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Search, FileText, BookOpen, CheckCircle, Clock, Trash2, X, Loader, Command } from 'lucide-react';
import { useCommandPalette } from '@/hooks/useCommandPalette';
import { cn } from '@/lib/utils';

interface EnhancedSearchCommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const EnhancedSearchCommandPalette: React.FC<EnhancedSearchCommandPaletteProps> = ({
  open,
  onOpenChange,
}) => {
  const {
    searchQuery,
    setSearchQuery,
    searchResults,
    recentSearches,
    isSearching,
    handleResultClick,
    handleRecentSearchClick,
    clearRecentSearches
  } = useCommandPalette();

  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input when dialog opens
  useEffect(() => {
    if (open && inputRef.current) {
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [open]);

  // Reset selection when query changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [searchQuery]);

  const getIcon = (type: string) => {
    switch (type) {
      case 'document':
        return FileText;
      case 'guide_section':
        return BookOpen;
      case 'guide_step':
        return CheckCircle;
      default:
        return Search;
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onOpenChange(false);
      return;
    }
    
    const totalItems = searchResults.length;
    
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => Math.min(prev + 1, totalItems - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => Math.max(prev - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (searchResults[selectedIndex]) {
        handleResultClick(searchResults[selectedIndex]);
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        className="p-0 max-w-3xl h-[600px] overflow-hidden bg-white rounded-xl border border-gray-200 shadow-2xl fixed left-[50%] top-[40%] translate-x-[-50%] translate-y-[-50%] z-50 [&>button]:hidden"
        aria-labelledby="search-palette-title"
        aria-describedby="search-palette-description"
      >
        <DialogTitle id="search-palette-title" className="sr-only">
          Search Command Palette  
        </DialogTitle>
        <DialogDescription id="search-palette-description" className="sr-only">
          Search for documents, guides, and perform quick actions
        </DialogDescription>

        {/* Custom close button */}
        <button
          onClick={() => onOpenChange(false)}
          className="absolute top-4 right-4 z-50 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Search Header */}
        <div className="p-6 border-b border-gray-100 bg-white">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none z-10" />
            <input
              ref={inputRef}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search documents, guides, and more..."
              className="w-full text-lg h-12 pl-12 pr-16 border-0 bg-transparent focus:outline-none placeholder-gray-400 text-gray-700"
              autoFocus
              autoComplete="off"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          
          {/* Keyboard shortcut hint */}
          <div className="flex items-center justify-between mt-3">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Command className="w-4 h-4" />
              <span>Press</span>
              <kbd className="px-2 py-1 bg-gray-100 border border-gray-200 rounded text-xs font-mono">⌘K</kbd>
              <span>to search</span>
            </div>
            {searchResults.length > 0 && (
              <div className="text-sm text-gray-500">
                {searchResults.length} result{searchResults.length !== 1 ? 's' : ''}
              </div>
            )}
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-hidden">
          {isSearching ? (
            <div className="flex items-center justify-center h-full">
              <Loader className="w-5 h-5 animate-spin text-gray-400" />
              <p className="text-sm text-gray-500 ml-2">Searching...</p>
            </div>
          ) : searchQuery.trim() && searchResults.length > 0 ? (
            <div className="p-4 h-full overflow-y-auto">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Search Results</h3>
              <div className="space-y-2">
                {searchResults.map((result, index) => {
                  const IconComponent = getIcon(result.type);
                  return (
                    <motion.button
                      key={result.id}
                      onClick={() => handleResultClick(result)}
                      className={cn(
                        "w-full text-left p-3 rounded-lg flex items-start gap-3 transition-all",
                        selectedIndex === index 
                          ? "bg-blue-50 border-blue-200 border" 
                          : "hover:bg-gray-50 border border-transparent"
                      )}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                    >
                      <IconComponent className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium text-gray-900 text-sm truncate">
                            {result.title}
                          </h4>
                          <Badge variant="secondary" className="text-xs">
                            {result.type.replace('_', ' ')}
                          </Badge>
                        </div>
                        {result.description && (
                          <p className="text-xs text-gray-600 line-clamp-2">
                            {result.description}
                          </p>
                        )}
                        {result.category && (
                          <p className="text-xs text-gray-500 mt-1">
                            Category: {result.category}
                          </p>
                        )}
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </div>
          ) : searchQuery.trim() && searchResults.length === 0 && !isSearching ? (
            <div className="flex items-center justify-center h-full text-center">
              <div>
                <Search className="w-8 h-8 mx-auto text-gray-300 mb-2" />
                <p className="text-gray-600 font-medium">No results found</p>
                <p className="text-sm text-gray-500 mt-1">Try different keywords or check spelling</p>
              </div>
            </div>
          ) : (
            <div className="p-4 h-full overflow-y-auto">
              {/* Recent Searches */}
              {recentSearches.length > 0 && (
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      Recent Searches
                    </h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearRecentSearches}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="space-y-1">
                    {recentSearches.map((search) => (
                      <button
                        key={search.id}
                        onClick={() => handleRecentSearchClick(search)}
                        className="w-full text-left p-2 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2">
                          <Search className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-700">{search.query}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            {search.results_count} results
                          </Badge>
                          <span className="text-xs text-gray-500">
                            {search.timestamp.toLocaleDateString()}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <Separator className="my-4" />

              {/* Search Tips */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-3">Search Tips</h3>
                <div className="space-y-2 text-sm text-gray-600">
                  <p>• Search for documents, guidance sections, and steps</p>
                  <p>• Use keywords from titles and descriptions</p>
                  <p>• Press <kbd className="px-1 py-0.5 bg-gray-100 border border-gray-200 rounded text-xs font-mono">⌘K</kbd> to quickly open search</p>
                  <p>• Use arrow keys to navigate results</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
