
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
    title: "Dashboard",
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
    <Sidebar className="border-r-0 w-[240px] max-w-[240px]">
      <SidebarContent className="bg-[#0088cc] text-white h-screen sticky top-0">
        <SidebarGroup className="px-3 py-6 h-full">
          <SidebarGroupContent className="h-full">
            <SidebarMenu className="space-y-2">
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild
                    className={cn(
                      "transition-all duration-200 rounded-lg p-3 py-3 min-h-[48px] text-white/90 hover:text-white hover:bg-white/10",
                      "border border-transparent hover:border-white/20",
                      "group relative overflow-hidden text-left",
                      location.pathname === item.url && "bg-white text-[#0088cc] shadow-lg hover:bg-white hover:text-[#0088cc] border-white"
                    )}
                  >
                    <Link to={item.url} className="flex items-center gap-3 w-full">
                      <div className={cn(
                        "w-5 h-5 flex-shrink-0 transition-transform group-hover:scale-110",
                        location.pathname === item.url ? "text-[#0088cc]" : "text-white/90 group-hover:text-white"
                      )}>
                        <item.icon className="w-5 h-5" />
                      </div>
                      <span className={cn(
                        "font-semibold text-sm transition-colors",
                        location.pathname === item.url ? "text-[#0088cc]" : "text-white/90 group-hover:text-white"
                      )}>
                        {item.title}
                      </span>
                      {location.pathname === item.url && (
                        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-[#0088cc] rounded-l-full" />
                      )}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        
        {/* Bottom gradient overlay */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[#0088cc] to-transparent pointer-events-none" />
      </SidebarContent>
    </Sidebar>
  )
}
