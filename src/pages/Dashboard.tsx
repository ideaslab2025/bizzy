
import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import { Bell, Search, User, ChevronDown, Settings, LogOut } from "lucide-react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/ui/app-sidebar";
import { CommandPalette } from "@/components/ui/command-palette";
import { RecentlyViewed } from "@/components/ui/recently-viewed";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { CursorProvider } from "@/components/ui/cursor-provider";
import { FirstViewSpotlight } from "@/components/ui/first-view-spotlight";
import { NeonGlow } from "@/components/ui/neon-glow";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

const Dashboard = () => {
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);

  // Listen for keyboard shortcut to open command palette
  React.useEffect(() => {
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
    <CursorProvider>
      <SidebarProvider>
        <div className="min-h-screen flex w-full bg-gray-50">
          <AppSidebar />
          <main className="flex-1 relative">
            {/* Enhanced Header */}
            <header className="sticky top-0 z-40 h-16 bg-gradient-to-r from-indigo-100 via-purple-50 to-pink-100 backdrop-blur-sm border-b border-white/20 shadow-sm">
              <div className="h-full px-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <SidebarTrigger className="text-gray-700 hover:text-gray-900 hover:bg-white/50 transition-all duration-200" />
                  <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
                    Dashboard
                  </h1>
                </div>
                
                {/* Center Search */}
                <div className="flex-1 max-w-md mx-8">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search documents, guides..."
                      className="w-full pl-10 pr-4 py-2 bg-white/80 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      onClick={() => setCommandPaletteOpen(true)}
                    />
                  </div>
                </div>

                {/* Right Actions */}
                <div className="flex items-center gap-3">
                  <ThemeToggle />
                  
                  {/* Notifications */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="relative text-gray-700 hover:text-gray-900 hover:bg-white/50 transition-all duration-200"
                      >
                        <Bell className="w-5 h-5" />
                        <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full flex items-center justify-center">
                          <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
                        </span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-80 bg-white border border-gray-200 shadow-lg rounded-lg">
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

                  {/* User Menu */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button 
                        variant="ghost" 
                        className="flex items-center gap-2 text-gray-700 hover:text-gray-900 hover:bg-white/50 transition-all duration-200"
                      >
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                          <User className="w-4 h-4 text-white" />
                        </div>
                        <span className="font-medium">John Doe</span>
                        <ChevronDown className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56 bg-white border border-gray-200 shadow-lg rounded-lg">
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

                  <NeonGlow color="blue" hover>
                    <button 
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 font-medium shadow-sm hover:shadow-md"
                      data-cursor="help"
                    >
                      Get Help
                    </button>
                  </NeonGlow>
                </div>
              </div>
            </header>
            
            {/* Main Content */}
            <div className="p-6 bg-gray-50 min-h-[calc(100vh-4rem)]">
              <Outlet />
            </div>
            
            {/* Recently Viewed Sidebar */}
            <div className="fixed right-4 top-1/2 -translate-y-1/2 z-30">
              <RecentlyViewed />
            </div>
          </main>
        </div>
        <CommandPalette 
          open={commandPaletteOpen} 
          onOpenChange={setCommandPaletteOpen}
        />
        <FirstViewSpotlight />
      </SidebarProvider>
    </CursorProvider>
  );
};

export default Dashboard;
