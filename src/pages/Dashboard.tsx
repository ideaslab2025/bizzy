
import React, { useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { Bell, Search, User, ChevronDown, Settings, LogOut, RefreshCw, Menu, Bot } from "lucide-react";
import { motion } from "framer-motion";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/ui/app-sidebar";
import { ProgressProvider } from "@/contexts/ProgressContext";
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
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/components/ui/sonner";
import { supabase } from "@/integrations/supabase/client";

const Dashboard = () => {
  const navigate = useNavigate();
  const { signOut, user } = useAuth();
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [faqOpen, setFaqOpen] = useState(false);
  const [hasNotifications] = useState(true);
  const [syncStatus, setSyncStatus] = useState<'typing' | 'uploading' | 'syncing' | 'synced' | 'offline' | 'error'>('synced');
  const [companyName, setCompanyName] = useState<string>("");

  // Debug: Log when component mounts to verify background class
  useEffect(() => {
    console.log("Dashboard mounted - checking background image");
    const dashboardElement = document.querySelector('.dashboard-bg-image');
    if (dashboardElement) {
      console.log("Dashboard background element found");
      const styles = window.getComputedStyle(dashboardElement);
      console.log("Background image:", styles.backgroundImage);
      console.log("Background color:", styles.backgroundColor);
    } else {
      console.log("Dashboard background element NOT found");
    }
  }, []);

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

  useEffect(() => {
    if (user) {
      fetchCompanyName();
    }
  }, [user]);

  useEffect(() => {
    const handleCompanyNameUpdate = (event: CustomEvent) => {
      setCompanyName(event.detail.companyName);
    };

    window.addEventListener('companyNameUpdated', handleCompanyNameUpdate);
    
    return () => {
      window.removeEventListener('companyNameUpdated', handleCompanyNameUpdate);
    };
  }, []);

  const fetchCompanyName = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('company_name')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error("Error fetching company name:", error);
        return;
      }

      if (data?.company_name) {
        setCompanyName(data.company_name);
      }
    } catch (error) {
      console.error("Unexpected error fetching company name:", error);
    }
  };

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

  // Get display title with fallback - Updated for header display
  const getDisplayTitle = () => {
    if (companyName && companyName.trim()) {
      return companyName;
    }
    return "Welcome back!";
  };

  return (
    <ProgressProvider>
      <SidebarProvider>
        {/* FORCE the background class application with multiple approaches - NEW STONE TEXTURE */}
        <div 
          className="min-h-screen flex w-full dashboard-bg-image" 
          style={{
            backgroundImage: 'url(/lovable-uploads/39360b89-4264-4182-8266-a5609921867a.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            backgroundColor: '#ff0000' // Red fallback for debugging
          }}
        >
          <AppSidebar />
          <main className="flex-1 relative">
            <header className="sticky top-0 z-40 h-16 md:h-18 bg-white border-b border-gray-200 shadow-sm">
              <div className="h-full px-6 md:px-8 flex items-center justify-between">
                <div className="flex items-center gap-4 md:gap-6">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <motion.div
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <SidebarTrigger className="text-black hover:text-gray-700 hover:bg-gray-100 transition-all duration-200 p-3 min-h-[48px] min-w-[48px] touch-manipulation rounded-lg" />
                        </motion.div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Toggle Sidebar</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <div className="flex flex-col justify-center min-w-0">
                    <h1 className="text-xl md:text-2xl font-bold text-black tracking-tight truncate leading-tight">
                      {getDisplayTitle()}
                    </h1>
                    <p className="text-sm md:text-base text-gray-600 leading-tight font-medium">
                      Dashboard
                    </p>
                  </div>
                </div>
                
                <div className="hidden md:flex flex-1 max-w-md mx-8">
                  <motion.div 
                    className="relative w-full"
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search documents, guides..."
                      className="w-full pl-12 pr-4 py-4 h-12 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:shadow-md text-base text-black placeholder-gray-500 font-medium"
                      onClick={() => setCommandPaletteOpen(true)}
                    />
                  </motion.div>
                </div>

                <div className="flex items-center gap-3 md:gap-4">
                  <motion.div
                    className="md:hidden"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => setCommandPaletteOpen(true)}
                      className="text-black hover:text-gray-700 hover:bg-gray-100 rounded-xl p-3 transition-all duration-200 min-h-[48px] min-w-[48px]"
                    >
                      <Search className="h-5 w-5" />
                    </Button>
                  </motion.div>

                  <CloudSyncIndicator
                    status={syncStatus}
                    lastSaved={new Date(Date.now() - 30000)}
                    onForceSync={() => setSyncStatus('syncing')}
                    onShowHistory={() => console.log('Show sync history')}
                  />
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Button 
                          variant="ghost" 
                          size="icon"
                          className="relative rounded-xl p-3 transition-all duration-200 hover:bg-gray-100 text-black hover:text-gray-700 hover:shadow-md min-h-[48px] min-w-[48px]"
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
                    <DropdownMenuContent align="end" className="w-80 bg-white border border-gray-200 shadow-xl rounded-xl z-50">
                      <div className="p-6 border-b border-gray-100">
                        <h3 className="font-bold text-black text-lg">Notifications</h3>
                      </div>
                      {notifications.map((notification) => (
                        <DropdownMenuItem 
                          key={notification.id}
                          className="p-6 hover:bg-gray-50 min-h-[80px] cursor-pointer transition-all duration-200 border-l-4 border-transparent hover:border-blue-500"
                          onClick={() => handleNotificationClick(notification)}
                        >
                          <div className="w-full">
                            <div className="flex items-start justify-between mb-2">
                              <p className="font-semibold text-black text-base">
                                {notification.title}
                              </p>
                              {!notification.read && (
                                <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 ml-2 mt-1"></div>
                              )}
                            </div>
                            <p className="text-base text-gray-600 mb-2 font-medium">
                              {notification.message}
                            </p>
                            <p className="text-sm text-gray-500 font-medium">
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
                            className="text-black hover:text-gray-700 hover:bg-gray-100 rounded-xl p-3 transition-all duration-200 min-h-[48px] min-w-[48px]"
                            aria-label="Open Progress Companion"
                          >
                            <Bot className="w-5 h-5" />
                          </Button>
                        </motion.div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Talk to Bizzy</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Button 
                          variant="ghost" 
                          className="flex items-center gap-3 rounded-xl p-3 transition-all duration-200 hover:bg-gray-100 hover:shadow-md text-black hover:text-gray-700 min-h-[48px]"
                        >
                          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                            <User className="w-4 h-4 text-white" />
                          </div>
                          <span className="font-semibold hidden md:inline-block">Account</span>
                          <ChevronDown className="w-4 h-4" />
                        </Button>
                      </motion.div>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56 bg-white border border-gray-200 shadow-xl rounded-xl z-50">
                      <DropdownMenuItem onClick={handleProfileClick} className="hover:bg-gray-50 p-4 min-h-[48px] text-black font-medium">
                        <User className="w-4 h-4 mr-3" />
                        Profile
                      </DropdownMenuItem>
                      <DropdownMenuItem className="hover:bg-gray-50 p-4 min-h-[48px] text-black font-medium">
                        <Settings className="w-4 h-4 mr-3" />
                        Settings
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={handleSignOut} className="hover:bg-red-50 text-red-600 hover:text-red-700 p-4 min-h-[48px] font-medium">
                        <LogOut className="w-4 h-4 mr-3" />
                        Logout
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </header>
            
            {/* Professional Main Content */}
            <div className="p-6 md:p-8 min-h-[calc(100vh-4rem)]">
              <Outlet />
            </div>
            
            <div className="hidden lg:block fixed right-4 top-1/2 -translate-y-1/2 z-30">
              <RecentlyViewed 
                showSearch={true}
                groupByTime={true}
                collapsed={false}
              />
            </div>
          </main>
        </div>
        
        <EnhancedCommandPalette 
          open={commandPaletteOpen} 
          onOpenChange={setCommandPaletteOpen}
        />
        
        <div className="fixed bottom-6 right-6 z-50">
          <FAQTrigger onClick={() => setFaqOpen(true)} />
        </div>
        
        <ContextualFAQ
          isOpen={faqOpen}
          onClose={() => setFaqOpen(false)}
          currentPage={window.location.pathname}
          onContactSupport={() => console.log('Contact support')}
        />
        
        <UndoKeyboardHandler />
        
        <FirstViewSpotlight />
      </SidebarProvider>
    </ProgressProvider>
  );
};

export default Dashboard;

