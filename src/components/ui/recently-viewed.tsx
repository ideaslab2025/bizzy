import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useNavigate } from 'react-router-dom';
import { 
  Pin, 
  Search, 
  Clock, 
  Users, 
  TrendingUp, 
  Filter,
  ChevronDown,
  Eye,
  Edit,
  MoreHorizontal,
  Trash2,
  Archive
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface RecentItem {
  id: string;
  title: string;
  type: 'document' | 'guide' | 'video';
  url: string;
  timestamp: Date;
  isPinned?: boolean;
  isActive?: boolean;
  progress?: number;
  collaborators?: string[];
  viewCount?: number;
  lastModified?: Date;
  thumbnail?: string;
}

const STORAGE_KEY = 'bizzy-recently-viewed';
const MAX_ITEMS = 50;

export const useRecentlyViewed = () => {
  const [items, setItems] = useState<RecentItem[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored).map((item: any) => ({
          ...item,
          timestamp: new Date(item.timestamp),
          lastModified: item.lastModified ? new Date(item.lastModified) : undefined,
        }));
        setItems(parsed);
      } catch (error) {
        console.error('Failed to parse recently viewed items:', error);
      }
    }
  }, []);

  const addItem = (item: Omit<RecentItem, 'timestamp'>) => {
    setItems(current => {
      const filtered = current.filter(existing => existing.id !== item.id);
      const newItems = [
        { ...item, timestamp: new Date() },
        ...filtered,
      ].slice(0, MAX_ITEMS);
      
      if ('requestIdleCallback' in window) {
        requestIdleCallback(() => {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(newItems));
        });
      } else {
        setTimeout(() => {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(newItems));
        }, 0);
      }
      
      return newItems;
    });
  };

  const togglePin = (id: string) => {
    setItems(current => {
      const updated = current.map(item =>
        item.id === id ? { ...item, isPinned: !item.isPinned } : item
      );
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  const removeItem = (id: string) => {
    setItems(current => {
      const updated = current.filter(item => item.id !== id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  const clearAll = () => {
    setItems([]);
    localStorage.removeItem(STORAGE_KEY);
  };

  return {
    items,
    addItem,
    togglePin,
    removeItem,
    clearAll,
  };
};

interface RecentlyViewedProps {
  className?: string;
  collapsed?: boolean;
  showSearch?: boolean;
  groupByTime?: boolean;
}

export const RecentlyViewed: React.FC<RecentlyViewedProps> = ({
  className,
  collapsed = false,
  showSearch = true,
  groupByTime = true,
}) => {
  const { items, togglePin, removeItem, clearAll } = useRecentlyViewed();
  const navigate = useNavigate();
  const cardRef = useRef<HTMLDivElement>(null);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (cardRef.current && !cardRef.current.contains(event.target as Node)) {
        setIsVisible(false);
      }
    };

    if (isVisible) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [isVisible]);

  // Reset visibility when items change
  useEffect(() => {
    if (items.length > 0) {
      setIsVisible(true);
    }
  }, [items.length]);

  const filteredItems = items.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType === 'all' || item.type === selectedType;
    return matchesSearch && matchesType;
  });

  const groupedItems = groupByTime ? groupItemsByTime(filteredItems) : { 'All Items': filteredItems };
  const sortedItems = Object.entries(groupedItems);

  const formatTimestamp = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days === 1) return 'Yesterday';
    return `${days}d ago`;
  };

  const getTypeIcon = (type: RecentItem['type']) => {
    switch (type) {
      case 'document': return '📄';
      case 'guide': return '🗺️';
      case 'video': return '🎥';
      default: return '📄';
    }
  };

  const handleItemClick = (item: RecentItem) => {
    if (isSelectionMode) {
      setSelectedItems(prev => 
        prev.includes(item.id) 
          ? prev.filter(id => id !== item.id)
          : [...prev, item.id]
      );
    } else {
      navigate(item.url);
    }
  };

  const handleBulkAction = (action: 'pin' | 'unpin' | 'delete') => {
    selectedItems.forEach(id => {
      switch (action) {
        case 'pin':
        case 'unpin':
          togglePin(id);
          break;
        case 'delete':
          removeItem(id);
          break;
      }
    });
    setSelectedItems([]);
    setIsSelectionMode(false);
  };

  if (items.length === 0 || !isVisible) {
    return null;
  }

  return (
    <Card ref={cardRef} className={cn("glass-card", className)}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Recently Viewed
          </CardTitle>
          <div className="flex items-center gap-2">
            {selectedItems.length > 0 && (
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleBulkAction('pin')}
                  className="h-6 text-xs"
                >
                  <Pin className="w-3 h-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleBulkAction('delete')}
                  className="h-6 text-xs text-red-600"
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsSelectionMode(!isSelectionMode)}
              className="h-6 text-xs"
            >
              <MoreHorizontal className="w-3 h-3" />
            </Button>
          </div>
        </div>

        {showSearch && (
          <div className="space-y-2">
            <div className="relative">
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400" />
              <Input
                placeholder="Search recent items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-7 h-7 text-xs"
              />
            </div>
            
            <div className="flex gap-1">
              {['all', 'document', 'guide', 'video'].map(type => (
                <Button
                  key={type}
                  variant={selectedType === type ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setSelectedType(type)}
                  className="h-6 text-xs capitalize"
                >
                  {type}
                </Button>
              ))}
            </div>
          </div>
        )}
      </CardHeader>
      
      <CardContent className="space-y-3 max-h-96 overflow-y-auto">
        <AnimatePresence>
          {sortedItems.map(([timeGroup, groupItems]) => (
            <motion.div
              key={timeGroup}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              {groupByTime && groupItems.length > 0 && (
                <h4 className="text-xs font-medium text-gray-500 mb-2 flex items-center gap-2">
                  <span>{timeGroup}</span>
                  <Badge variant="secondary" className="text-xs">
                    {groupItems.length}
                  </Badge>
                </h4>
              )}
              
              <div className="space-y-1">
                {groupItems.slice(0, collapsed ? 5 : 50).map((item) => (
                  <motion.div
                    key={item.id}
                    className={cn(
                      "group flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-all duration-200",
                      selectedItems.includes(item.id) && "bg-blue-50 border border-blue-200",
                      item.isActive && "border-l-2 border-l-green-500"
                    )}
                    onClick={() => handleItemClick(item)}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                  >
                    {isSelectionMode && (
                      <input
                        type="checkbox"
                        checked={selectedItems.includes(item.id)}
                        onChange={() => {}}
                        className="w-3 h-3"
                      />
                    )}
                    
                    <div className="relative">
                      <span className="text-lg flex-shrink-0">{getTypeIcon(item.type)}</span>
                      {item.isActive && (
                        <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full" />
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium truncate">{item.title}</span>
                        {item.isPinned && (
                          <Pin className="w-3 h-3 text-blue-500 fill-current" />
                        )}
                        {item.progress !== undefined && (
                          <div className="w-12 h-1 bg-gray-200 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-blue-500 transition-all duration-300"
                              style={{ width: `${item.progress}%` }}
                            />
                          </div>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <span>{formatTimestamp(item.timestamp)}</span>
                        {item.viewCount && (
                          <span className="flex items-center gap-1">
                            <Eye className="w-3 h-3" />
                            {item.viewCount}
                          </span>
                        )}
                        {item.collaborators && item.collaborators.length > 0 && (
                          <span className="flex items-center gap-1">
                            <Users className="w-3 h-3" />
                            {item.collaborators.length}
                          </span>
                        )}
                        {item.lastModified && item.lastModified > item.timestamp && (
                          <Badge variant="outline" className="text-xs">
                            <Edit className="w-3 h-3 mr-1" />
                            Updated
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          togglePin(item.id);
                        }}
                        className="h-6 w-6 p-0"
                      >
                        <Pin className={cn(
                          "w-3 h-3",
                          item.isPinned ? "text-blue-500 fill-current" : "text-gray-400"
                        )} />
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {items.length > 0 && (
          <div className="pt-2 border-t flex justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAll}
              className="text-xs text-gray-500 hover:text-gray-700"
            >
              Clear all
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => console.log('Export report')}
              className="text-xs text-blue-600 hover:text-blue-700"
            >
              Export report
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

function groupItemsByTime(items: RecentItem[]) {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
  const thisWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);

  const groups: Record<string, RecentItem[]> = {
    'Working on': [],
    'Today': [],
    'Yesterday': [],
    'This Week': [],
    'Older': []
  };

  // Sort by pinned first, then by timestamp
  const sortedItems = [...items].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return b.timestamp.getTime() - a.timestamp.getTime();
  });

  sortedItems.forEach(item => {
    if (item.isActive || item.isPinned) {
      groups['Working on'].push(item);
    } else if (item.timestamp >= today) {
      groups['Today'].push(item);
    } else if (item.timestamp >= yesterday) {
      groups['Yesterday'].push(item);
    } else if (item.timestamp >= thisWeek) {
      groups['This Week'].push(item);
    } else {
      groups['Older'].push(item);
    }
  });

  // Remove empty groups
  Object.keys(groups).forEach(key => {
    if (groups[key].length === 0) {
      delete groups[key];
    }
  });

  return groups;
}
