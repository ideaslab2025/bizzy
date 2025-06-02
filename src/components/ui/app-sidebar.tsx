
import React from "react"
import { Calendar, Home, Inbox, Search, Settings, FileText, FolderOpen, HelpCircle, DollarSign, Upload, Users } from "lucide-react"
import { Link, useLocation } from "react-router-dom"
import { cn } from "@/lib/utils"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

// Menu items.
const items = [
  {
    title: "Overview",
    url: "/dashboard",
    icon: Home,
  },
  {
    title: "Document Library", 
    url: "/dashboard/documents",
    icon: FileText,
  },
  {
    title: "My Documents",
    url: "/dashboard/my-documents", 
    icon: FolderOpen,
  },
  {
    title: "Guided Help",
    url: "/guided-help",
    icon: HelpCircle,
  },
  {
    title: "Consultations",
    url: "/dashboard/consultations",
    icon: Users,
  },
  {
    title: "Settings",
    url: "/dashboard/settings",
    icon: Settings,
  },
]

export function AppSidebar() {
  const location = useLocation()

  return (
    <Sidebar className="border-r-0">
      <SidebarContent className="bg-gradient-to-b from-[#0088cc] to-[#006ba6] text-white">
        {/* Logo Section with White Background that extends to all edges */}
        <div className="bg-white p-6 flex items-center justify-center">
          <Link to="/dashboard" className="flex items-center justify-center">
            <img src="/lovable-uploads/502b3627-55d4-4915-b44e-a2aa01e5751e.png" alt="Bizzy Logo" className="h-32" />
          </Link>
        </div>
        
        <SidebarGroup className="px-4 py-6">
          <SidebarGroupContent>
            <SidebarMenu className="space-y-3">
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild
                    className={cn(
                      "transition-all duration-200 rounded-lg p-4 py-4 min-h-[56px] text-white/90 hover:text-white hover:bg-white/10",
                      "border border-transparent hover:border-white/20",
                      "group relative overflow-hidden text-left",
                      location.pathname === item.url && "bg-white text-[#0088cc] shadow-lg hover:bg-white hover:text-[#0088cc] border-white"
                    )}
                  >
                    <Link to={item.url} className="flex items-center gap-4 w-full">
                      <div className={cn(
                        "w-6 h-6 flex-shrink-0 transition-transform group-hover:scale-110",
                        location.pathname === item.url ? "text-[#0088cc]" : "text-white/90 group-hover:text-white"
                      )}>
                        <item.icon className="w-6 h-6" />
                      </div>
                      <span className={cn(
                        "font-semibold text-base transition-colors",
                        location.pathname === item.url ? "text-[#0088cc]" : "text-white/90 group-hover:text-white"
                      )}>
                        {item.title}
                      </span>
                      {location.pathname === item.url && (
                        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-10 bg-[#0088cc] rounded-l-full" />
                      )}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        
        {/* Bottom gradient overlay */}
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-[#006ba6] to-transparent pointer-events-none" />
      </SidebarContent>
    </Sidebar>
  )
}
