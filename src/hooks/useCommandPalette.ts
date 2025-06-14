
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

export interface SearchResult {
  id: string;
  title: string;
  description?: string;
  type: 'document' | 'guide_section' | 'guide_step' | 'command';
  category?: string;
  url?: string;
  icon?: string;
}

export interface RecentSearch {
  id: string;
  query: string;
  timestamp: Date;
  results_count: number;
}

export const useCommandPalette = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [recentSearches, setRecentSearches] = useState<RecentSearch[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Load recent searches from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('recent-searches');
    if (stored) {
      const parsed = JSON.parse(stored).map((item: any) => ({
        ...item,
        timestamp: new Date(item.timestamp)
      }));
      setRecentSearches(parsed.slice(0, 5)); // Keep only last 5
    }
  }, []);

  // Save recent searches to localStorage
  const saveRecentSearch = useCallback((query: string, resultsCount: number) => {
    if (query.trim().length < 2) return;
    
    const newSearch: RecentSearch = {
      id: Date.now().toString(),
      query: query.trim(),
      timestamp: new Date(),
      results_count: resultsCount
    };

    const updated = [newSearch, ...recentSearches.filter(s => s.query !== query.trim())].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem('recent-searches', JSON.stringify(updated));
  }, [recentSearches]);

  // Perform database search
  const performSearch = useCallback(async (query: string) => {
    if (!query.trim() || query.length < 2) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    const results: SearchResult[] = [];

    try {
      // Search documents
      const { data: documents } = await supabase
        .from('documents')
        .select('id, title, description, category')
        .or(`title.ilike.%${query}%,description.ilike.%${query}%,keywords.cs.{${query}}`)
        .limit(8);

      if (documents) {
        results.push(...documents.map(doc => ({
          id: `doc-${doc.id}`,
          title: doc.title,
          description: doc.description,
          type: 'document' as const,
          category: doc.category,
          url: '/dashboard/documents',
          icon: 'FileText'
        })));
      }

      // Search guidance sections
      const { data: sections } = await supabase
        .from('guidance_sections')
        .select('id, title, description, color_theme')
        .or(`title.ilike.%${query}%,description.ilike.%${query}%`)
        .limit(5);

      if (sections) {
        results.push(...sections.map(section => ({
          id: `section-${section.id}`,
          title: section.title,
          description: section.description,
          type: 'guide_section' as const,
          category: section.color_theme,
          url: `/guided-help?section=${section.id}`,
          icon: 'BookOpen'
        })));
      }

      // Search guidance steps
      const { data: steps } = await supabase
        .from('guidance_steps')
        .select('id, title, content, section_id')
        .or(`title.ilike.%${query}%,content.ilike.%${query}%`)
        .limit(5);

      if (steps) {
        results.push(...steps.map(step => ({
          id: `step-${step.id}`,
          title: step.title,
          description: step.content?.substring(0, 100) + '...',
          type: 'guide_step' as const,
          url: `/guided-help?section=${step.section_id}&step=${step.id}`,
          icon: 'CheckCircle'
        })));
      }

      setSearchResults(results);
      saveRecentSearch(query, results.length);
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  }, [saveRecentSearch]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      performSearch(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, performSearch]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(true);
      }
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
        setSearchQuery('');
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const handleResultClick = useCallback((result: SearchResult) => {
    if (result.url) {
      navigate(result.url);
    }
    setIsOpen(false);
    setSearchQuery('');
  }, [navigate]);

  const handleRecentSearchClick = useCallback((recentSearch: RecentSearch) => {
    setSearchQuery(recentSearch.query);
    performSearch(recentSearch.query);
  }, [performSearch]);

  const clearRecentSearches = useCallback(() => {
    setRecentSearches([]);
    localStorage.removeItem('recent-searches');
  }, []);

  return {
    isOpen,
    setIsOpen,
    searchQuery,
    setSearchQuery,
    searchResults,
    recentSearches,
    isSearching,
    handleResultClick,
    handleRecentSearchClick,
    clearRecentSearches,
    performSearch
  };
};
