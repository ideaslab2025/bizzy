
import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Search, FileText, HelpCircle, Settings, Sparkles, Building, Users, CheckCircle, Zap } from 'lucide-react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';

interface CommandItem {
  id: string;
  title: string;
  description?: string;
  icon: React.ElementType;
  category: string;
  action: () => void;
  keywords: string[];
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
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  // Business-focused command items
  const businessRelatedItems: CommandItem[] = [
    {
      id: 'documents',
      title: 'My Documents',
      description: 'View business templates and forms',
      icon: FileText,
      category: 'business',
      action: () => navigate('/dashboard/documents'),
      keywords: ['documents', 'templates', 'forms', 'files'],
    },
    {
      id: 'progress',
      title: 'Business Setup Progress',
      description: 'Track your setup journey',
      icon: Building,
      category: 'business',
      action: () => navigate('/dashboard'),
      keywords: ['progress', 'setup', 'dashboard', 'journey'],
    },
    {
      id: 'tasks',
      title: 'Current Tasks',
      description: 'Continue with guided setup',
      icon: CheckCircle,
      category: 'business',
      action: () => navigate('/guided-help'),
      keywords: ['tasks', 'guidance', 'help', 'setup'],
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
      category: 'actions',
      action: () => {
        navigate('/dashboard/documents');
        onOpenChange(false);
      },
      keywords: ['upload', 'document', 'file', 'add'],
    },
    {
      id: 'bizzy',
      title: 'Talk to Bizzy AI',
      icon: HelpCircle,
      category: 'actions',
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
      category: 'actions',
      action: () => navigate('/guided-help'),
      keywords: ['task', 'next', 'setup', 'continue'],
    },
    {
      id: 'settings',
      title: 'Account Settings',
      icon: Settings,
      category: 'actions',
      action: () => navigate('/dashboard/settings'),
      keywords: ['settings', 'account', 'preferences'],
    },
  ];

  const allItems = [...businessRelatedItems, ...quickActions];

  const filteredItems = allItems.filter(item => {
    const matchesQuery = query === '' || 
      item.title.toLowerCase().includes(query.toLowerCase()) ||
      item.description?.toLowerCase().includes(query.toLowerCase()) ||
      item.keywords.some(keyword => keyword.toLowerCase().includes(query.toLowerCase()));
    
    const matchesTab = activeTab === 'all' || 
      (activeTab === 'documents' && item.category === 'business' && item.keywords.includes('documents')) ||
      (activeTab === 'guides' && item.keywords.includes('guidance')) ||
      (activeTab === 'settings' && item.keywords.includes('settings')) ||
      (activeTab === 'help' && item.keywords.includes('help'));
    
    return matchesQuery && matchesTab;
  });

  const businessItems = filteredItems.filter(item => item.category === 'business');
  const actionItems = filteredItems.filter(item => item.category === 'actions');

  useEffect(() => {
    if (open && inputRef.current) {
      // Ensure input gets focus after dialog animation
      const timer = setTimeout(() => {
        inputRef.current?.focus();
        inputRef.current?.select();
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [open]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query, activeTab]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    setQuery(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onOpenChange(false);
      return;
    }
    
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => Math.min(prev + 1, filteredItems.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => Math.max(prev - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredItems[selectedIndex]) {
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
      <DialogContent className="p-0 max-w-3xl mx-auto border shadow-2xl fixed top-[20%] left-1/2 transform -translate-x-1/2 max-h-[70vh] overflow-hidden bg-white rounded-lg">
        {/* Large Search Input Area */}
        <div className="p-6 pb-3 border-b">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              ref={inputRef}
              value={query}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder="Search Everything ..."
              className="w-full text-lg h-12 pl-10 pr-4 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 bg-white"
              autoFocus
              type="text"
              autoComplete="off"
            />
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1 px-6 py-2 border-b bg-gray-50">
          {tabs.map((tab) => (
            <Button
              key={tab.id}
              variant="ghost"
              onClick={() => setActiveTab(tab.id)}
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

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto">
          {query === '' && activeTab === 'all' ? (
            // Default view with three columns
            <div className="grid grid-cols-3 gap-6 p-6">
              {/* Related to Business Column */}
              <div>
                <h3 className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                  <Building className="w-4 h-4 text-orange-500" />
                  Related to your business
                </h3>
                <div className="space-y-1">
                  {businessRelatedItems.map((item) => {
                    const IconComponent = item.icon;
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          item.action();
                          onOpenChange(false);
                          setQuery('');
                        }}
                        className="w-full text-left px-3 py-2 rounded hover:bg-gray-100 flex items-center gap-3 text-sm transition-colors"
                      >
                        <IconComponent className="w-4 h-4 text-gray-500" />
                        <div>
                          <div className="font-medium">{item.title}</div>
                          {item.description && (
                            <div className="text-xs text-gray-500">{item.description}</div>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Quick Actions Column */}
              <div>
                <h3 className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                  <Zap className="w-4 h-4 text-green-500" />
                  Quick Actions
                </h3>
                <div className="space-y-1">
                  {quickActions.map((item) => {
                    const IconComponent = item.icon;
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          item.action();
                          onOpenChange(false);
                          setQuery('');
                        }}
                        className="w-full text-left px-3 py-2 rounded hover:bg-gray-100 flex items-center gap-3 text-sm transition-colors"
                      >
                        <IconComponent className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-700">{item.title}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Search Tips Column */}
              <div>
                <h3 className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                  <Sparkles className="w-4 h-4 text-yellow-500" />
                  Quick Search Tips
                </h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <kbd className="px-2 py-1 text-xs font-semibold text-gray-700 bg-white border border-gray-300 rounded">Ctrl</kbd>
                    <span className="text-gray-500">+</span>
                    <kbd className="px-2 py-1 text-xs font-semibold text-gray-700 bg-white border border-gray-300 rounded">K</kbd>
                  </div>
                  <p className="text-xs text-gray-600">
                    Use this keyboard shortcut to search documents, guides, and help articles faster!
                  </p>
                </div>
              </div>
            </div>
          ) : (
            // Search results view
            <div className="p-4">
              {filteredItems.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Search className="w-10 h-10 mx-auto mb-3 text-gray-300" />
                  <p>No results found for "{query}"</p>
                  <p className="text-sm mt-1">Try searching for documents, guides, or help topics</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {businessItems.length > 0 && (
                    <div>
                      <h3 className="text-sm font-semibold text-gray-700 mb-2">Business Related</h3>
                      <div className="space-y-1">
                        {businessItems.map((item, index) => {
                          const globalIndex = filteredItems.indexOf(item);
                          const IconComponent = item.icon;
                          return (
                            <motion.button
                              key={item.id}
                              className={cn(
                                "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors",
                                selectedIndex === globalIndex ? "bg-blue-50 text-blue-700" : "hover:bg-gray-50"
                              )}
                              onClick={() => {
                                item.action();
                                onOpenChange(false);
                                setQuery('');
                              }}
                              whileHover={{ scale: 1.01 }}
                              whileTap={{ scale: 0.99 }}
                            >
                              <IconComponent className="w-4 h-4 flex-shrink-0" />
                              <div className="flex-1 min-w-0">
                                <div className="font-medium">{item.title}</div>
                                {item.description && (
                                  <p className="text-sm text-gray-500 truncate">{item.description}</p>
                                )}
                              </div>
                            </motion.button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {actionItems.length > 0 && (
                    <div>
                      <h3 className="text-sm font-semibold text-gray-700 mb-2">Quick Actions</h3>
                      <div className="space-y-1">
                        {actionItems.map((item) => {
                          const globalIndex = filteredItems.indexOf(item);
                          const IconComponent = item.icon;
                          return (
                            <motion.button
                              key={item.id}
                              className={cn(
                                "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors",
                                selectedIndex === globalIndex ? "bg-blue-50 text-blue-700" : "hover:bg-gray-50"
                              )}
                              onClick={() => {
                                item.action();
                                onOpenChange(false);
                                setQuery('');
                              }}
                              whileHover={{ scale: 1.01 }}
                              whileTap={{ scale: 0.99 }}
                            >
                              <IconComponent className="w-4 h-4 flex-shrink-0" />
                              <div className="flex-1 min-w-0">
                                <div className="font-medium">{item.title}</div>
                              </div>
                            </motion.button>
                          );
                        })}
                      </div>
                    </div>
                  )}
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
