import { useState } from "react";
import { Link, Outlet } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { PullToRefresh } from "@/components/ui/pull-to-refresh";
import { useAuth } from "@/hooks/useAuth";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { User, LogOut, Bell, Menu, X, Keyboard } from "lucide-react";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";
import KeyboardShortcutsModal from "@/components/ui/keyboard-shortcuts-modal";

const Dashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [showChatbot, setShowChatbot] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const { user, signOut } = useAuth();
  const isMobile = useIsMobile();
  
  // Keyboard shortcuts integration
  const { showShortcuts, setShowShortcuts } = useKeyboardShortcuts({
    onToggleChat: () => setShowChatbot(prev => !prev),
    onFocusSearch: () => {
      const searchInput = document.querySelector('input[placeholder="Search..."]') as HTMLInputElement;
      if (searchInput) {
        searchInput.focus();
      }
    }
  });
  
  const handleSignOut = async () => {
    try {
      await signOut();
      // Redirect will be handled by the ProtectedRoute component
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };
  
  const handleDashboardRefresh = async () => {
    // Simulate refresh of dashboard data
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('Dashboard refreshed');
  };
  
  return (
    <div className="min-h-screen flex bg-muted/30">
      {/* Mobile Overlay */}
      {isMobile && isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "bg-white border-r h-full z-30 flex-col transition-all duration-300",
          isMobile 
            ? `fixed ${isSidebarOpen ? "w-64" : "w-0 overflow-hidden"}`
            : `${isSidebarOpen ? "w-64" : "w-16"} relative flex`
        )}
      >
        {/* Sidebar header */}
        <div className="flex items-center justify-between p-4 border-b">
          {isSidebarOpen ? (
            <Link to="/dashboard" className="flex items-center justify-center w-full">
              <img src="/lovable-uploads/502b3627-55d4-4915-b44e-a2aa01e5751e.png" alt="Bizzy Logo" className={isMobile ? "h-32" : "h-40"} />
            </Link>
          ) : (
            <Link to="/dashboard" className="mx-auto">
              <img src="/lovable-uploads/502b3627-55d4-4915-b44e-a2aa01e5751e.png" alt="Bizzy Logo" className="h-20" />
            </Link>
          )}
          
          {/* Close button for mobile */}
          {isMobile && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsSidebarOpen(false)}
              className="lg:hidden"
            >
              <X className="w-4 h-4" />
            </Button>
          )}
          
          {/* Desktop toggle */}
          {!isMobile && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
              {isSidebarOpen ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="4" x2="20" y1="12" y2="12" />
                  <line x1="4" x2="20" y1="6" y2="6" />
                  <line x1="4" x2="20" y1="18" y2="18" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m9 18 6-6-6-6" />
                </svg>
              )}
            </Button>
          )}
        </div>
        
        <nav className="p-2 flex-1">
          <ul className="space-y-1">
            {[
              { name: "Overview", icon: "home", path: "/dashboard" },
              { name: "Guided Help", icon: "map", path: "/guided-help" },
              { name: "Documents", icon: "file", path: "/dashboard/documents" },
              { name: "Consultations", icon: "video", path: "/dashboard/consultations" },
              { name: "Settings", icon: "settings", path: "/dashboard/settings" }
            ].map((item) => (
              <li key={item.name}>
                <Link
                  to={item.path}
                  className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-muted/50 transition-colors"
                  onClick={() => isMobile && setIsSidebarOpen(false)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    {item.icon === "home" && <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />}
                    {item.icon === "map" && <path d="M14.106 5.553a2 2 0 0 0 1.788 0l3.659-1.83A1 1 0 0 1 21 4.619v12.764a1 1 0 0 1-.553.894l-4.553 2.277a2 2 0 0 1-1.788 0l-4.212-2.106a2 2 0 0 0-1.788 0l-3.659 1.83A1 1 0 0 1 3 19.381V6.618a1 1 0 0 1 .553-.894l4.553-2.277a2 2 0 0 1 1.788 0z" />}
                    {item.icon === "file" && <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />}
                    {item.icon === "video" && <path d="m22 8-6 4 6 4V8Z" />}
                    {item.icon === "settings" && <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 2.73.73l.15.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l-.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />}
                  </svg>
                  {isSidebarOpen && <span className={isMobile ? "text-sm" : ""}>{item.name}</span>}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        
        <div className={`border-t p-4 ${isSidebarOpen ? '' : 'hidden lg:block'}`}>
          <Link
            to="/profile"
            className="flex items-center gap-2 hover:bg-muted/50 p-2 rounded-md transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-sm font-medium">
              {user?.user_metadata?.first_name?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            {isSidebarOpen && (
              <div>
                <p className="text-sm font-medium">
                  {user?.user_metadata?.company_name || 
                   (user?.user_metadata?.first_name && user?.user_metadata?.last_name 
                     ? `${user.user_metadata.first_name.charAt(0).toUpperCase() + user.user_metadata.first_name.slice(1)} ${user.user_metadata.last_name.charAt(0).toUpperCase() + user.user_metadata.last_name.slice(1)}`
                     : user?.email?.split('@')[0] || 'User')}
                </p>
                <p className="text-xs text-muted-foreground">
                  {user?.user_metadata?.company_name ? user.user_metadata.company_name : 'Business Owner'}
                </p>
              </div>
            )}
          </Link>
        </div>
      </aside>
      
      {/* Main content area */}
      <div className="flex-1 flex flex-col">
        {/* Top navigation bar */}
        <header className="bg-white border-b sticky top-0 z-20 h-14 lg:h-16">
          <div className="flex items-center justify-between h-full px-4">
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="lg:hidden"
              >
                <Menu className="w-4 h-4" />
              </Button>
              
              <div className="hidden sm:block lg:w-72">
                <Input 
                  placeholder="Search..." 
                  className="max-w-xs"
                />
              </div>
            </div>
            
            <div className="flex items-center gap-2 lg:gap-4">
              <Button 
                variant="outline" 
                size="sm" 
                className="hidden sm:flex items-center gap-2 bg-blue-100 text-blue-600 border-blue-200 hover:bg-blue-200 text-xs lg:text-sm px-2 lg:px-4"
                onClick={() => setShowChatbot(true)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
                <span>{isMobile ? "Bizzy" : "Ask Bizzy"}</span>
              </Button>
              
              <div 
                className="relative"
                onMouseEnter={() => !isMobile && setShowNotifications(true)}
                onMouseLeave={() => !isMobile && setShowNotifications(false)}
                onClick={() => isMobile && setShowNotifications(!showNotifications)}
              >
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="relative text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                >
                  <Bell className="w-4 h-4 lg:w-5 lg:h-5" />
                  <span className="absolute -top-1 -right-1 w-3 h-3 lg:w-4 lg:h-4 bg-[#0088cc] text-white text-xs rounded-full flex items-center justify-center">
                    3
                  </span>
                </Button>
                
                {showNotifications && (
                  <div className={cn(
                    "absolute right-0 top-full mt-2 bg-white border rounded-lg shadow-lg z-50",
                    isMobile ? "w-72 max-w-[90vw]" : "w-80"
                  )}>
                    <div className="p-4 border-b bg-gray-50">
                      <h3 className="font-medium text-gray-900">Notifications</h3>
                    </div>
                    <div className="p-4 space-y-3">
                      <div className="text-sm">
                        <p className="font-medium text-gray-900">New guidance available</p>
                        <p className="text-gray-600">VAT registration guide has been updated</p>
                      </div>
                      <div className="text-sm">
                        <p className="font-medium text-gray-900">Document ready</p>
                        <p className="text-gray-600">Your employee handbook is ready for download</p>
                      </div>
                      <div className="text-sm">
                        <p className="font-medium text-gray-900">Consultation reminder</p>
                        <p className="text-gray-600">Your meeting is scheduled for tomorrow at 2 PM</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Account Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="flex items-center gap-1 lg:gap-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                  >
                    <User className="h-3 w-3 lg:h-4 lg:w-4" />
                    <span className="hidden sm:inline text-xs lg:text-sm font-medium">
                      {user?.user_metadata?.company_name || 
                       (user?.user_metadata?.first_name 
                         ? `${user.user_metadata.first_name.charAt(0).toUpperCase() + user.user_metadata.first_name.slice(1)}`
                         : user?.email?.split('@')[0] || 'Account')}
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem asChild>
                    <Link to="/dashboard/settings" className="flex items-center gap-2 w-full cursor-pointer">
                      <User className="h-4 w-4" />
                      Account Settings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={handleSignOut}
                    className="flex items-center gap-2 text-red-600 hover:text-red-600 cursor-pointer"
                  >
                    <LogOut className="h-4 w-4" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>
        
        {/* Main content with pull-to-refresh */}
        <PullToRefresh 
          onRefresh={handleDashboardRefresh}
          className="flex-1"
        >
          <main className="flex-1 p-4 lg:p-6">
            <Outlet />
          </main>
        </PullToRefresh>
        
        {/* Footer with keyboard shortcut icon */}
        <footer className="bg-white border-t px-4 py-2 flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center gap-4">
            <span>© 2024 Bizzy</span>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 px-2 text-xs hover:text-gray-700"
              onClick={() => setShowShortcuts(true)}
            >
              <Keyboard className="w-3 h-3 mr-1" />
              Shortcuts
            </Button>
          </div>
          <div className="hidden sm:flex items-center gap-2">
            <span>Press</span>
            <kbd className="px-1.5 py-0.5 text-xs bg-gray-100 rounded border">?</kbd>
            <span>for keyboard shortcuts</span>
          </div>
        </footer>
      </div>
      
      {/* Bizzy AI Assistant chatbot - Mobile responsive */}
      {showChatbot && (
        <div className={cn(
          "fixed z-40 bg-white border rounded-lg shadow-lg flex flex-col",
          isMobile 
            ? "inset-4 rounded-lg" 
            : "bottom-4 right-4 w-80 h-96"
        )}>
          <div className="flex items-center justify-between p-3 border-b bg-[#0088cc] text-white rounded-t-lg">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 lg:w-8 lg:h-8 bg-white rounded-full overflow-hidden">
                <AspectRatio ratio={1}>
                  <img 
                    src="/lovable-uploads/502b3627-55d4-4915-b44e-a2aa01e5751e.png" 
                    alt="Bizzy" 
                    className="w-full h-full object-contain"
                  />
                </AspectRatio>
              </div>
              <span className="font-medium text-sm lg:text-base">Bizzy Assistant</span>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-6 w-6 p-0 text-white hover:bg-white/20"
              onClick={() => setShowChatbot(false)}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
          
          <div className="flex-1 p-3 overflow-y-auto space-y-4">
            <div className="flex gap-2">
              <div className="w-8 h-8 bg-[#0088cc]/20 rounded-full flex-shrink-0 flex items-center justify-center">
                <div className="w-6 h-6 overflow-hidden rounded-full">
                  <AspectRatio ratio={1}>
                    <img 
                      src="/lovable-uploads/502b3627-55d4-4915-b44e-a2aa01e5751e.png" 
                      alt="Bizzy" 
                      className="w-full h-full object-contain"
                    />
                  </AspectRatio>
                </div>
              </div>
              <div className="bg-muted/50 p-2 rounded-lg rounded-tl-none max-w-[85%]">
                <p className="text-sm">
                  Hello! I'm Bizzy, your assistant. How can I help you with your business today?
                </p>
              </div>
            </div>
          </div>
          
          <div className="border-t p-3">
            <div className="flex gap-2">
              <Input placeholder="Type your message..." className="flex-1" />
              <Button className="bg-[#0088cc] hover:bg-[#0088cc]/90">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m22 2-7 20-4-9-9-4Z" />
                  <path d="M22 2 11 13" />
                </svg>
              </Button>
            </div>
          </div>
        </div>
      )}
      
      {/* Keyboard Shortcuts Modal */}
      <KeyboardShortcutsModal
        open={showShortcuts}
        onOpenChange={setShowShortcuts}
      />
    </div>
  );
};

export default Dashboard;
