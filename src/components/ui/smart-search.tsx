
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Mic, Camera, History, TrendingUp, Sparkles, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface SearchResult {
  id: string;
  title: string;
  excerpt: string;
  type: 'document' | 'guide' | 'video';
  relevance: number;
  matchReason: string;
  lastModified: Date;
}

interface SmartSearchProps {
  onSearch?: (query: string) => void;
  onResultClick?: (result: SearchResult) => void;
  className?: string;
  placeholder?: string;
}

export const SmartSearch: React.FC<SmartSearchProps> = ({
  onSearch,
  onResultClick,
  className,
  placeholder = "Search documents, guides, or ask a question...",
}) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [isListening, setIsListening] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  // Mock AI search function
  const performAISearch = async (searchQuery: string): Promise<SearchResult[]> => {
    if (!searchQuery.trim()) return [];
    
    setIsLoading(true);
    
    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Mock intelligent results based on query
    const mockResults: SearchResult[] = [
      {
        id: '1',
        title: 'Business Registration Form',
        excerpt: 'Complete business registration documentation for new companies...',
        type: 'document',
        relevance: 95,
        matchReason: 'Exact match for "business registration"',
        lastModified: new Date(Date.now() - 1000 * 60 * 60 * 2),
      },
      {
        id: '2',
        title: 'Tax Documentation Guide',
        excerpt: 'Step-by-step guide for organizing tax documents...',
        type: 'guide',
        relevance: 87,
        matchReason: 'Related to business documentation',
        lastModified: new Date(Date.now() - 1000 * 60 * 60 * 24),
      },
      {
        id: '3',
        title: 'Company Formation Video',
        excerpt: 'Video tutorial on forming a new company...',
        type: 'video',
        relevance: 82,
        matchReason: 'Contains keywords "company" and "formation"',
        lastModified: new Date(Date.now() - 1000 * 60 * 60 * 48),
      },
    ].filter(result => 
      result.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      result.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
    );
    
    setIsLoading(false);
    return mockResults;
  };

  // Generate smart suggestions
  const generateSuggestions = (input: string) => {
    const suggestions = [
      'Show me tax documents from last month',
      'Find company registration forms',
      'Business license requirements',
      'Employment agreement templates',
      'Financial planning guides',
    ].filter(suggestion => 
      suggestion.toLowerCase().includes(input.toLowerCase()) ||
      input.length < 3
    );
    
    setSuggestions(suggestions.slice(0, 4));
  };

  // Handle search input
  useEffect(() => {
    const timeoutId = setTimeout(async () => {
      if (query.trim()) {
        const searchResults = await performAISearch(query);
        setResults(searchResults);
        setShowResults(true);
        generateSuggestions(query);
      } else {
        setResults([]);
        setShowResults(false);
        generateSuggestions('');
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [query]);

  // Handle voice search
  const startVoiceSearch = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
      const recognition = new SpeechRecognition();
      
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';
      
      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setQuery(transcript);
      };
      
      recognition.start();
    }
  };

  // Handle search submission
  const handleSearch = () => {
    if (query.trim()) {
      setSearchHistory(prev => [query, ...prev.filter(h => h !== query)].slice(0, 10));
      onSearch?.(query);
    }
  };

  // Handle result click
  const handleResultClick = (result: SearchResult) => {
    onResultClick?.(result);
    setShowResults(false);
  };

  // Format time ago
  const formatTimeAgo = (date: Date) => {
    const diff = Date.now() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);
    
    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  // Get type icon and color
  const getTypeInfo = (type: string) => {
    switch (type) {
      case 'document': return { icon: '📄', color: 'bg-blue-100 text-blue-700' };
      case 'guide': return { icon: '🗺️', color: 'bg-green-100 text-green-700' };
      case 'video': return { icon: '🎥', color: 'bg-purple-100 text-purple-700' };
      default: return { icon: '📄', color: 'bg-gray-100 text-gray-700' };
    }
  };

  return (
    <div ref={searchRef} className={cn("relative w-full max-w-2xl", className)}>
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
        <Input
          ref={inputRef}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          placeholder={placeholder}
          className="pl-10 pr-20 py-3 text-base"
        />
        
        {/* Action buttons */}
        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={startVoiceSearch}
            className={cn("h-8 w-8 p-0", isListening && "text-red-500")}
          >
            <Mic className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
          >
            <Camera className="w-4 h-4" />
          </Button>
          {query && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setQuery('')}
              className="h-8 w-8 p-0"
            >
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Search Results Panel */}
      <AnimatePresence>
        {(showResults || (!query && searchHistory.length > 0)) && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 right-0 mt-2 z-50"
          >
            <Card className="glass-card shadow-xl">
              <CardContent className="p-0">
                {/* Loading state */}
                {isLoading && (
                  <div className="p-4 flex items-center gap-3">
                    <Sparkles className="w-4 h-4 text-blue-500 animate-pulse" />
                    <span className="text-sm text-gray-600">AI is searching...</span>
                  </div>
                )}

                {/* Search Results */}
                {results.length > 0 && !isLoading && (
                  <div className="p-2">
                    <div className="text-xs font-medium text-gray-500 px-3 py-2">
                      Search Results ({results.length})
                    </div>
                    {results.map((result) => {
                      const typeInfo = getTypeInfo(result.type);
                      return (
                        <motion.div
                          key={result.id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors"
                          onClick={() => handleResultClick(result)}
                        >
                          <div className="flex items-start gap-3">
                            <span className="text-lg">{typeInfo.icon}</span>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="font-medium text-sm truncate">{result.title}</h4>
                                <Badge variant="secondary" className={cn("text-xs", typeInfo.color)}>
                                  {result.type}
                                </Badge>
                                {result.relevance > 90 && (
                                  <Badge variant="outline" className="text-xs bg-green-50 text-green-700">
                                    Best match
                                  </Badge>
                                )}
                              </div>
                              <p className="text-xs text-gray-600 mb-2">{result.excerpt}</p>
                              <div className="flex items-center justify-between text-xs text-gray-400">
                                <span>{result.matchReason}</span>
                                <span>{formatTimeAgo(result.lastModified)}</span>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                )}

                {/* Suggestions */}
                {suggestions.length > 0 && !isLoading && (
                  <div className="border-t p-2">
                    <div className="text-xs font-medium text-gray-500 px-3 py-2">
                      Try searching for...
                    </div>
                    {suggestions.map((suggestion, index) => (
                      <motion.div
                        key={suggestion}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: index * 0.05 }}
                        className="px-3 py-2 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors text-sm text-gray-700"
                        onClick={() => setQuery(suggestion)}
                      >
                        <div className="flex items-center gap-2">
                          <TrendingUp className="w-3 h-3 text-gray-400" />
                          {suggestion}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}

                {/* Search History */}
                {!query && searchHistory.length > 0 && (
                  <div className="p-2">
                    <div className="text-xs font-medium text-gray-500 px-3 py-2">
                      Recent Searches
                    </div>
                    {searchHistory.slice(0, 5).map((historyItem, index) => (
                      <div
                        key={index}
                        className="px-3 py-2 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors text-sm text-gray-700"
                        onClick={() => setQuery(historyItem)}
                      >
                        <div className="flex items-center gap-2">
                          <History className="w-3 h-3 text-gray-400" />
                          {historyItem}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* No results */}
                {query && results.length === 0 && !isLoading && (
                  <div className="p-6 text-center">
                    <div className="text-gray-400 mb-2">No results found for "{query}"</div>
                    <div className="text-sm text-gray-500">
                      Try different keywords or check your spelling
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
