
import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/ui/app-sidebar";
import { CommandPalette } from "@/components/ui/command-palette";
import { RecentlyViewed } from "@/components/ui/recently-viewed";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { CursorProvider } from "@/components/ui/cursor-provider";
import { FirstViewSpotlight } from "@/components/ui/first-view-spotlight";
import { NeonGlow } from "@/components/ui/neon-glow";

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
        <div className="min-h-screen flex w-full">
          <AppSidebar />
          <main className="flex-1 relative">
            {/* Header */}
            <header className="border-b border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm sticky top-0 z-40">
              <div className="px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <SidebarTrigger />
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Dashboard
                  </h1>
                </div>
                <div className="flex items-center gap-4">
                  <ThemeToggle />
                  <NeonGlow color="blue" hover>
                    <button 
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      data-cursor="help"
                    >
                      Get Help
                    </button>
                  </NeonGlow>
                </div>
              </div>
            </header>
            
            {/* Main Content */}
            <div className="p-6">
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
