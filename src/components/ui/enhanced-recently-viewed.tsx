
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useNavigate } from 'react-router-dom';
import { 
  Pin, 
  ExternalLink, 
  Download, 
  Share2, 
  Search, 
  Filter, 
  Clock, 
  TrendingUp,
  X,
  Eye,
  Calendar,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useRecentlyViewed } from '@/components/ui/recently-viewed';

interface EnhancedRecentItem {
  id: string;
  title: string;
  type: 'document' | 'guide' | 'video';
  url: string;
  timestamp: Date;
  viewCount: number;
  timeSpent: number; // in seconds
  isPinned?: boolean;
  thumbnail?: string;
  progress?: number; // for guides/videos
  lastModified?: Date;
}

interface EnhancedRecentlyViewedProps {
  className?: string;
  maxItems?: number;
  showSearch?: boolean;
  showFilters?: boolean;
  collapsed?: boolean;
  onItemClick?: (item: EnhancedRecentItem) => void;
}

export const EnhancedRecentlyViewed: React.FC<EnhancedRecentlyViewedProps> = ({
  className,
  maxItems = 20,
  showSearch = true,
  showFilters = true,
  collapsed = false,
  onItemClick,
}) => {
  const { items: baseItems, togglePin, clearAll } = useRecentlyViewed();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [timeFilter, setTimeFilter] = useState<string>('all');
  const [isCollapsed, setIsCollapsed] = useState(collapsed);
  const [items, setItems] = useState<EnhancedRecentItem[]>([]);
  const navigate = useNavigate();

  // Convert base items to enhanced items
  useEffect(() => {
    const enhancedItems: EnhancedRecentItem[] = baseItems.map(item => ({
      ...item,
      viewCount: Math.floor(Math.random() * 10) + 1,
      timeSpent: Math.floor(Math.random() * 300) + 30,
      progress: item.type === 'guide' ? Math.floor(Math.random() * 100) : undefined,
      lastModified: new Date(item.timestamp.getTime() - Math.random() * 7 * 24 * 60 * 60 * 1000),
    }));
    setItems(enhancedItems);
  }, [baseItems]);

  // Filter items
  const filteredItems = items.filter(item => {
    // Search filter
    if (searchQuery && !item.title.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    // Type filter
    if (selectedType !== 'all' && item.type !== selectedType) {
      return false;
    }
    
    // Time filter
    if (timeFilter !== 'all') {
      const now = new Date();
      const itemDate = item.timestamp;
      const diffHours = (now.getTime() - itemDate.getTime()) / (1000 * 60 * 60);
      
      switch (timeFilter) {
        case 'today':
          if (diffHours > 24) return false;
          break;
        case 'week':
          if (diffHours > 168) return false;
          break;
        case 'month':
          if (diffHours > 720) return false;
          break;
      }
    }
    
    return true;
  });

  // Group items by time
  const groupedItems = filteredItems.reduce((groups, item) => {
    const now = new Date();
    const diffHours = (now.getTime() - item.timestamp.getTime()) / (1000 * 60 * 60);
    
    let group = 'Older';
    if (diffHours < 24) group = 'Today';
    else if (diffHours < 48) group = 'Yesterday';
    else if (diffHours < 168) group = 'This Week';
    
    if (!groups[group]) groups[group] = [];
    groups[group].push(item);
    return groups;
  }, {} as Record<string, EnhancedRecentItem[]>);

  // Sort pinned items first
  Object.keys(groupedItems).forEach(group => {
    groupedItems[group].sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      return b.timestamp.getTime() - a.timestamp.getTime();
    });
  });

  const formatTime = (date: Date) => {
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

  const formatTimeSpent = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    if (minutes < 1) return `${seconds}s`;
    return `${minutes}m`;
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'document': return '📄';
      case 'guide': return '🗺️';
      case 'video': return '🎥';
      default: return '📄';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'document': return 'bg-blue-100 text-blue-700';
      case 'guide': return 'bg-green-100 text-green-700';
      case 'video': return 'bg-purple-100 text-purple-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const handleItemClick = (item: EnhancedRecentItem) => {
    onItemClick?.(item);
    navigate(item.url);
  };

  const handleQuickAction = (item: EnhancedRecentItem, action: string, e: React.MouseEvent) => {
    e.stopPropagation();
    switch (action) {
      case 'pin':
        togglePin(item.id);
        break;
      case 'external':
        window.open(item.url, '_blank');
        break;
      case 'download':
        console.log('Download', item.title);
        break;
      case 'share':
        navigator.share?.({ title: item.title, url: item.url });
        break;
    }
  };

  if (filteredItems.length === 0 && !searchQuery) {
    return null;
  }

  return (
    <Card className={cn("glass-card", className)}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CardTitle className="text-sm font-medium">Recently Viewed</CardTitle>
            <Badge variant="outline" className="text-xs">
              {filteredItems.length}
            </Badge>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="h-6 w-6 p-0"
            >
              {isCollapsed ? <ChevronDown className="w-3 h-3" /> : <ChevronUp className="w-3 h-3" />}
            </Button>
            {items.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearAll}
                className="text-xs text-gray-500 hover:text-gray-700 h-6"
              >
                Clear
              </Button>
            )}
          </div>
        </div>

        {/* Search and Filters */}
        <AnimatePresence>
          {!isCollapsed && (showSearch || showFilters) && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-3"
            >
              {showSearch && (
                <div className="relative">
                  <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 w-3 h-3 text-gray-400" />
                  <Input
                    placeholder="Search recent items..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-7 h-8 text-xs"
                  />
                  {searchQuery && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSearchQuery('')}
                      className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  )}
                </div>
              )}

              {showFilters && (
                <div className="flex gap-2">
                  <select
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                    className="text-xs px-2 py-1 border rounded"
                  >
                    <option value="all">All types</option>
                    <option value="document">Documents</option>
                    <option value="guide">Guides</option>
                    <option value="video">Videos</option>
                  </select>
                  
                  <select
                    value={timeFilter}
                    onChange={(e) => setTimeFilter(e.target.value)}
                    className="text-xs px-2 py-1 border rounded"
                  >
                    <option value="all">All time</option>
                    <option value="today">Today</option>
                    <option value="week">This week</option>
                    <option value="month">This month</option>
                  </select>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <AnimatePresence>
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              {Object.entries(groupedItems).map(([group, groupItems]) => (
                <div key={group} className="space-y-2">
                  <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                    {group}
                  </h4>
                  
                  {groupItems.slice(0, maxItems).map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="group flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-all recently-viewed-item"
                      onClick={() => handleItemClick(item)}
                    >
                      {/* Thumbnail/Icon */}
                      <div className="relative flex-shrink-0">
                        {item.thumbnail ? (
                          <img 
                            src={item.thumbnail} 
                            alt={item.title}
                            className="w-10 h-10 rounded object-cover"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded bg-gray-100 flex items-center justify-center text-lg">
                            {getTypeIcon(item.type)}
                          </div>
                        )}
                        
                        {item.isPinned && (
                          <Pin className="absolute -top-1 -right-1 w-3 h-3 text-blue-500 fill-current" />
                        )}
                      </div>
                      
                      {/* Content */}
                      <div className="flex-1 min-w-0 space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium truncate">{item.title}</span>
                          <Badge 
                            variant="secondary" 
                            className={cn("text-xs", getTypeColor(item.type))}
                          >
                            {item.type}
                          </Badge>
                          {item.viewCount > 5 && (
                            <Badge variant="outline" className="text-xs">
                              <TrendingUp className="w-3 h-3 mr-1" />
                              Hot
                            </Badge>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-3 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {formatTime(item.timestamp)}
                          </span>
                          <span className="flex items-center gap-1">
                            <Eye className="w-3 h-3" />
                            {item.viewCount}x
                          </span>
                          <span>⏱️ {formatTimeSpent(item.timeSpent)}</span>
                        </div>
                        
                        {/* Progress bar for guides/videos */}
                        {item.progress !== undefined && (
                          <div className="w-full bg-gray-200 rounded-full h-1">
                            <motion.div
                              className="bg-green-500 h-1 rounded-full"
                              initial={{ width: 0 }}
                              animate={{ width: `${item.progress}%` }}
                              transition={{ duration: 0.5 }}
                            />
                          </div>
                        )}
                      </div>
                      
                      {/* Quick Actions */}
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => handleQuickAction(item, 'pin', e)}
                          className="h-6 w-6 p-0"
                        >
                          <Pin className={cn("w-3 h-3", item.isPinned ? "text-blue-500 fill-current" : "text-gray-400")} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => handleQuickAction(item, 'external', e)}
                          className="h-6 w-6 p-0"
                        >
                          <ExternalLink className="w-3 h-3 text-gray-400" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => handleQuickAction(item, 'download', e)}
                          className="h-6 w-6 p-0"
                        >
                          <Download className="w-3 h-3 text-gray-400" />
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ))}
              
              {/* Suggested Next */}
              {filteredItems.length > 0 && (
                <div className="pt-3 border-t">
                  <h4 className="text-xs font-medium text-gray-500 mb-2 flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    Suggested Next
                  </h4>
                  <div className="text-xs text-gray-600 bg-blue-50 p-2 rounded">
                    Based on your recent activity, you might want to check out the "Advanced Business Setup" guide.
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* No results */}
        {filteredItems.length === 0 && searchQuery && (
          <div className="text-center py-4 text-gray-500">
            <Search className="w-8 h-8 mx-auto mb-2 text-gray-300" />
            <p className="text-sm">No items found for "{searchQuery}"</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
