
import React, { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { Bell, Search, User, ChevronDown, Settings, LogOut, HelpCircle, Moon, RefreshCw, Menu, Bot } from "lucide-react";
import { motion } from "framer-motion";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/ui/app-sidebar";
import { EnhancedCommandPalette } from "@/components/ui/enhanced-command-palette";
import { RecentlyViewed } from "@/components/ui/recently-viewed";
import { FirstViewSpotlight } from "@/components/ui/first-view-spotlight";
import { CloudSyncIndicator } from "@/components/ui/cloud-sync-indicator";
import { ContextualFAQ } from "@/components/ui/contextual-faq";
import { FAQTrigger } from "@/components/ui/faq-trigger";
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
import { useAuth } from "@/hooks/useAuth";
import { useTheme } from "@/hooks/useTheme";
import { toast } from "@/components/ui/sonner";

const Dashboard = () => {
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const { toggleTheme } = useTheme();
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [bizzyOpen, setBizzyOpen] = useState(false);
  const [faqOpen, setFaqOpen] = useState(false);
  const [hasNotifications] = useState(true);
  const [syncStatus, setSyncStatus] = useState<'typing' | 'uploading' | 'syncing' | 'synced' | 'offline' | 'error'>('synced');

  // Mock notifications data - in a real app this would come from your state management
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'welcome',
      title: 'Welcome to Bizzy!',
      message: 'Complete your profile to get started',
      timestamp: new Date(),
      read: false
    },
    {
      id: 2,
      type: 'document_completion',
      title: 'Document Ready',
      message: 'Your business registration form is ready for review',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      read: false
    },
    {
      id: 3,
      type: 'tax_deadline',
      title: 'Tax Deadline Reminder',
      message: 'VAT registration deadline is approaching in 7 days',
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
      read: false
    },
    {
      id: 4,
      type: 'progress_update',
      title: 'Progress Milestone',
      message: 'You\'ve completed 25% of your business setup',
      categoryId: 'foundation',
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
      read: false
    }
  ]);

  const handleSignOut = async () => {
    try {
      console.log("Initiating logout...");
      await signOut();
      toast.success("Successfully logged out");
      navigate("/");
    } catch (error) {
      console.error("Error signing out:", error);
      toast.error("Failed to logout. Please try again.");
    }
  };

  const handleProfileClick = () => {
    navigate("/profile");
  };

  const handleOverviewRefresh = async () => {
    // Simulate refresh of overview data
    await new Promise(resolve => setTimeout(resolve, 1200));
    toast.success('Overview updated');
  };

  const handleRobotClick = () => {
    navigate('/progress-companion');
  };

  const markAsRead = (notificationId: number) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === notificationId 
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  const handleNotificationClick = (notification: any) => {
    // Mark notification as read
    markAsRead(notification.id);
    
    // Navigate based on notification type
    switch(notification.type) {
      case 'document_completion':
        navigate('/dashboard/documents');
        toast.success('Navigating to documents');
        break;
      case 'tax_deadline':
        navigate('/dashboard', { state: { scrollTo: 'tax-section' } });
        toast.success('Navigating to tax section');
        break;
      case 'progress_update':
        if (notification.categoryId) {
          navigate(`/guided-help?section=${notification.categoryId}`);
        } else {
          navigate('/dashboard');
        }
        toast.success('Navigating to progress section');
        break;
      case 'welcome':
        navigate('/profile');
        toast.success('Navigating to profile');
        break;
      default:
        navigate('/dashboard');
        break;
    }
  };

  // Mock data for now - in a real app this would come from user profile
  const completedStepIds = [1, 2, 3]; // Example completed steps
  const currentSectionCategory = "foundation"; // Example category
  const companyAge = 30; // Example company age in days

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50 dark:bg-gray-900">
        <AppSidebar />
        <main className="flex-1 relative">
          {/* Enhanced Header with White Text and Icons */}
          <header className="sticky top-0 z-40 h-16 md:h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
            <div className="h-full px-4 md:px-6 flex items-center justify-between">
              <div className="flex items-center gap-3 md:gap-4">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <SidebarTrigger className="text-white hover:text-gray-100 dark:text-white dark:hover:text-gray-200 hover:bg-gray-700 dark:hover:bg-gray-600 transition-all duration-200 p-3 min-h-[44px] min-w-[44px] touch-manipulation" />
                      </motion.div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Toggle Sidebar</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <h1 className="text-xl md:text-2xl font-bold text-white dark:text-white tracking-tight">
                  Dashboard
                </h1>
              </div>
              
              {/* Center Search - Hidden on small screens to save space */}
              <div className="hidden md:flex flex-1 max-w-md mx-8">
                <motion.div 
                  className="relative w-full"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                >
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
                  <input
                    type="text"
                    placeholder="Search documents, guides..."
                    className="w-full pl-10 pr-4 py-3 h-12 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:shadow-md text-base text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                    onClick={() => setCommandPaletteOpen(true)}
                  />
                </motion.div>
              </div>

              {/* Right Actions with White Icons */}
              <div className="flex items-center gap-2 md:gap-3">
                {/* Search button for mobile */}
                <motion.div
                  className="md:hidden"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => setCommandPaletteOpen(true)}
                    className="text-white hover:text-gray-100 dark:text-white dark:hover:text-gray-200 hover:bg-gray-700 dark:hover:bg-gray-600 rounded-lg p-3 transition-all duration-200 min-h-[44px] min-w-[44px]"
                  >
                    <Search className="h-5 w-5" />
                  </Button>
                </motion.div>

                {/* Cloud Sync Indicator */}
                <CloudSyncIndicator
                  status={syncStatus}
                  lastSaved={new Date(Date.now() - 30000)}
                  onForceSync={() => setSyncStatus('syncing')}
                  onShowHistory={() => console.log('Show sync history')}
                />

                {/* Dark Mode Toggle */}
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={toggleTheme}
                    className="text-white hover:text-gray-100 dark:text-white dark:hover:text-gray-200 hover:bg-gray-700 dark:hover:bg-gray-600 rounded-lg p-3 transition-all duration-200 min-h-[44px] min-w-[44px]"
                  >
                    <Moon className="h-5 w-5" />
                  </Button>
                </motion.div>
                
                {/* Enhanced Notifications with Click Navigation */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button 
                        variant="ghost" 
                        size="icon"
                        className="relative rounded-lg p-3 transition-all duration-200 hover:bg-gray-700 dark:hover:bg-gray-600 text-white hover:text-gray-100 dark:text-white dark:hover:text-gray-200 hover:shadow-md min-h-[44px] min-w-[44px]"
                      >
                        <Bell className="w-5 h-5" />
                        {hasNotifications && (
                          <motion.span
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute top-2 right-2 flex h-3 w-3"
                          >
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75"></span>
                            <span className="relative inline-flex h-3 w-3 rounded-full bg-red-500 animate-pulse"></span>
                          </motion.span>
                        )}
                      </Button>
                    </motion.div>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-80 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg rounded-lg z-50">
                    <div className="p-4 border-b border-gray-100 dark:border-gray-700">
                      <h3 className="font-semibold text-gray-900 dark:text-gray-100">Notifications</h3>
                    </div>
                    {notifications.map((notification) => (
                      <DropdownMenuItem 
                        key={notification.id}
                        className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700 min-h-[60px] cursor-pointer transition-all duration-200 border-l-4 border-transparent hover:border-blue-500"
                        onClick={() => handleNotificationClick(notification)}
                      >
                        <div className="w-full">
                          <div className="flex items-start justify-between mb-1">
                            <p className="font-medium text-gray-900 dark:text-gray-100 text-sm">
                              {notification.title}
                            </p>
                            {!notification.read && (
                              <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 ml-2 mt-1"></div>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                            {notification.message}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-500">
                            {notification.timestamp.toLocaleTimeString([], { 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })}
                          </p>
                        </div>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Robot Button - Now in Top Navigation with White Styling */}
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={handleRobotClick}
                          className="text-white hover:text-gray-100 dark:text-white dark:hover:text-gray-200 hover:bg-gray-700 dark:hover:bg-gray-600 rounded-lg p-3 transition-all duration-200 min-h-[44px] min-w-[44px]"
                          aria-label="Open Progress Companion"
                        >
                          <Bot className="w-5 h-5" />
                        </Button>
                      </motion.div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Progress Companion</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                {/* Enhanced User Menu with White Styling */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button 
                        variant="ghost" 
                        className="flex items-center gap-2 rounded-lg p-3 transition-all duration-200 hover:bg-gray-700 dark:hover:bg-gray-600 hover:shadow-md text-white hover:text-gray-100 dark:text-white dark:hover:text-gray-200 min-h-[44px]"
                      >
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                          <User className="w-4 h-4 text-white" />
                        </div>
                        <span className="font-medium hidden md:inline-block">Account</span>
                        <ChevronDown className="w-4 h-4" />
                      </Button>
                    </motion.div>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg rounded-lg z-50">
                    <DropdownMenuItem onClick={handleProfileClick} className="hover:bg-gray-50 dark:hover:bg-gray-700 p-4 min-h-[48px] text-gray-900 dark:text-gray-100">
                      <User className="w-4 h-4 mr-3" />
                      Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem className="hover:bg-gray-50 dark:hover:bg-gray-700 p-4 min-h-[48px] text-gray-900 dark:text-gray-100">
                      <Settings className="w-4 h-4 mr-3" />
                      Settings
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleSignOut} className="hover:bg-red-50 dark:hover:bg-red-900/50 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 p-4 min-h-[48px]">
                      <LogOut className="w-4 h-4 mr-3" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Enhanced Talk to Bizzy Button with Proper Styling */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setBizzyOpen(true)}
                  className="flex items-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white rounded-lg transition-all duration-200 text-sm md:text-sm font-medium shadow-sm hover:shadow-md min-h-[44px] touch-manipulation"
                >
                  <HelpCircle className="w-4 h-4" />
                  <span className="hidden sm:inline">Talk to Bizzy</span>
                  <span className="sm:hidden">Help</span>
                </motion.button>
              </div>
            </div>
          </header>
          
          {/* Main Content */}
          <div className="p-4 md:p-6 bg-gray-50 dark:bg-gray-900 min-h-[calc(100vh-4rem)]">
            <Outlet />
          </div>
          
          {/* Enhanced Recently Viewed Sidebar - Hidden on mobile for better UX */}
          <div className="hidden lg:block fixed right-4 top-1/2 -translate-y-1/2 z-30">
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
      
      {/* FAQ Trigger Button - Bottom Right Only with Consistent Styling */}
      <div className="fixed bottom-6 right-6 z-50">
        <FAQTrigger onClick={() => setFaqOpen(true)} />
      </div>
      
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
