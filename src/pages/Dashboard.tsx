import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { Bell, Search, User, ChevronDown, Settings, LogOut, X, HelpCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/ui/app-sidebar";
import { EnhancedCommandPalette } from "@/components/ui/enhanced-command-palette";
import { RecentlyViewed } from "@/components/ui/recently-viewed";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { FirstViewSpotlight } from "@/components/ui/first-view-spotlight";
import { NeonGlow } from "@/components/ui/neon-glow";
import { CloudSyncIndicator } from "@/components/ui/cloud-sync-indicator";
import { ContextualFAQ } from "@/components/ui/contextual-faq";
import { UndoKeyboardHandler } from "@/components/ui/undo-toast";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import BizzyChat from "@/components/BizzyChat";

const Dashboard = () => {
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [bizzyOpen, setBizzyOpen] = useState(false);
  const [faqOpen, setFaqOpen] = useState(false);
  const [hasNotifications] = useState(true);
  const [syncStatus, setSyncStatus] = useState<'typing' | 'uploading' | 'syncing' | 'synced' | 'offline' | 'error'>('synced');

  // Listen for keyboard shortcut to open command palette
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCommandPaletteOpen(true);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        <AppSidebar />
        <main className="flex-1 relative">
          {/* Enhanced Header */}
          <header className="sticky top-0 z-40 h-16 bg-gradient-to-r from-blue-50 via-white to-indigo-50 backdrop-blur-sm border-b border-gray-200 shadow-sm">
            <div className="h-full px-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <SidebarTrigger className="text-gray-700 hover:text-gray-900 hover:bg-white/50 transition-all duration-200" />
                      </motion.div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Toggle Sidebar</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
                  Dashboard
                </h1>
              </div>
              
              {/* Center Search */}
              <div className="flex-1 max-w-md mx-8">
                <motion.div 
                  className="relative"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                >
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search documents, guides..."
                    className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:shadow-md"
                    onClick={() => setCommandPaletteOpen(true)}
                  />
                </motion.div>
              </div>

              {/* Right Actions */}
              <div className="flex items-center gap-3">
                {/* Cloud Sync Indicator */}
                <CloudSyncIndicator
                  status={syncStatus}
                  lastSaved={new Date(Date.now() - 30000)}
                  onForceSync={() => setSyncStatus('syncing')}
                  onShowHistory={() => console.log('Show sync history')}
                />

                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <ThemeToggle />
                </motion.div>
                
                {/* Enhanced Notifications with proper hover */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="relative rounded-lg p-2 transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 hover:text-gray-900 hover:shadow-md"
                      >
                        <Bell className="w-5 h-5" />
                        {hasNotifications && (
                          <motion.span
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute top-1 right-1 flex h-3 w-3"
                          >
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75"></span>
                            <span className="relative inline-flex h-3 w-3 rounded-full bg-red-500 animate-pulse"></span>
                          </motion.span>
                        )}
                      </Button>
                    </motion.div>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-80 bg-white border border-gray-200 shadow-lg rounded-lg z-50">
                    <div className="p-4 border-b border-gray-100">
                      <h3 className="font-semibold text-gray-900">Notifications</h3>
                    </div>
                    <DropdownMenuItem className="p-4 hover:bg-gray-50">
                      <div>
                        <p className="font-medium text-gray-900">Welcome to Bizzy!</p>
                        <p className="text-sm text-gray-500 mt-1">Complete your profile to get started</p>
                      </div>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Enhanced User Menu with proper hover */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button 
                        variant="ghost" 
                        className="flex items-center gap-2 rounded-lg p-2 transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-800 hover:shadow-md text-gray-700 hover:text-gray-900"
                      >
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                          <User className="w-4 h-4 text-white" />
                        </div>
                        <span className="font-medium hidden md:inline-block">Account</span>
                        <ChevronDown className="w-4 h-4" />
                      </Button>
                    </motion.div>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 bg-white border border-gray-200 shadow-lg rounded-lg z-50">
                    <DropdownMenuItem className="hover:bg-gray-50">
                      <User className="w-4 h-4 mr-2" />
                      Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem className="hover:bg-gray-50">
                      <Settings className="w-4 h-4 mr-2" />
                      Settings
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="hover:bg-gray-50 text-red-600">
                      <LogOut className="w-4 h-4 mr-2" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Enhanced Talk to Bizzy Button */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setBizzyOpen(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 font-medium shadow-sm hover:shadow-md"
                >
                  <HelpCircle className="w-4 h-4" />
                  <span>Talk to Bizzy</span>
                </motion.button>
              </div>
            </div>
          </header>
          
          {/* Main Content */}
          <div className="p-6 bg-gray-50 min-h-[calc(100vh-4rem)]">
            <Outlet />
          </div>
          
          {/* Enhanced Recently Viewed Sidebar */}
          <div className="fixed right-4 top-1/2 -translate-y-1/2 z-30">
            <RecentlyViewed 
              showSearch={true}
              groupByTime={true}
              collapsed={false}
            />
          </div>
        </main>
      </div>
      
      {/* Enhanced Command Palette */}
      <EnhancedCommandPalette 
        open={commandPaletteOpen} 
        onOpenChange={setCommandPaletteOpen}
      />
      
      {/* Bizzy AI Chat */}
      <BizzyChat 
        isOpen={bizzyOpen} 
        onClose={() => setBizzyOpen(false)} 
      />
      
      {/* FAQ Trigger Button */}
      <FAQTrigger onClick={() => setFaqOpen(true)} />
      
      {/* Contextual FAQ */}
      <ContextualFAQ
        isOpen={faqOpen}
        onClose={() => setFaqOpen(false)}
        currentPage={window.location.pathname}
        onContactSupport={() => setBizzyOpen(true)}
      />
      
      {/* Global Keyboard Handlers */}
      <UndoKeyboardHandler />
      
      <FirstViewSpotlight />
    </SidebarProvider>
  );
};

export default Dashboard;
