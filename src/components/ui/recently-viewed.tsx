
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface RecentItem {
  id: string;
  title: string;
  type: 'document' | 'guide' | 'video';
  url: string;
  timestamp: Date;
  isPinned?: boolean;
}

const STORAGE_KEY = 'bizzy-recently-viewed';
const MAX_ITEMS = 10;

export const useRecentlyViewed = () => {
  const [items, setItems] = useState<RecentItem[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored).map((item: any) => ({
          ...item,
          timestamp: new Date(item.timestamp),
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
      
      // Use requestIdleCallback for performance
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

  const clearAll = () => {
    setItems([]);
    localStorage.removeItem(STORAGE_KEY);
  };

  const sortedItems = [...items].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return b.timestamp.getTime() - a.timestamp.getTime();
  });

  return {
    items: sortedItems,
    addItem,
    togglePin,
    clearAll,
  };
};

interface RecentlyViewedProps {
  className?: string;
  collapsed?: boolean;
}

export const RecentlyViewed: React.FC<RecentlyViewedProps> = ({
  className,
  collapsed = false,
}) => {
  const { items, togglePin, clearAll } = useRecentlyViewed();
  const navigate = useNavigate();

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
    navigate(item.url);
  };

  if (items.length === 0) {
    return null;
  }

  return (
    <Card className={cn("glass-card", className)}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium">Recently Viewed</CardTitle>
          {items.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAll}
              className="text-xs text-gray-500 hover:text-gray-700"
            >
              Clear all
            </Button>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-2">
        {items.slice(0, collapsed ? 5 : 10).map((item) => (
          <div
            key={item.id}
            className="group flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
            onClick={() => handleItemClick(item)}
          >
            <span className="text-lg flex-shrink-0">{getTypeIcon(item.type)}</span>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium truncate">{item.title}</span>
                {item.isPinned && (
                  <span className="text-xs">📌</span>
                )}
              </div>
              <span className="text-xs text-gray-500">{formatTimestamp(item.timestamp)}</span>
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                togglePin(item.id);
              }}
              className="opacity-0 group-hover:opacity-100 transition-opacity"
            >
              {item.isPinned ? '📌' : '📍'}
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
