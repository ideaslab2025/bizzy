
import React from 'react';
import { Home, FileText, HelpCircle, Settings, Users, BookOpen, Badge } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from '@/components/ui/sidebar';

const menuItems = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: Home,
    description: "Overview & analytics"
  },
  {
    title: "Documents",
    url: "/dashboard/documents",
    icon: FileText,
    description: "Legal documents & templates"
  },
  {
    title: "Guided Help",
    url: "/guided-help",
    icon: BookOpen,
    description: "Step-by-step guidance",
    isNew: true
  },
  {
    title: "Settings",
    url: "/dashboard/settings",
    icon: Settings,
    description: "Account & preferences"
  },
];

const supportItems = [
  {
    title: "Help Center",
    url: "/help",
    icon: HelpCircle,
    description: "FAQs & support"
  },
];

export function AppSidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <Sidebar className="bg-gradient-to-b from-gray-50 to-gray-100 border-r border-gray-200">
      <SidebarHeader className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3 group cursor-pointer transition-all duration-200 hover:scale-105">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow duration-200">
            <span className="text-white font-bold text-lg">B</span>
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 tracking-tight">Bizzy</h2>
            <p className="text-xs text-gray-500 mt-1">Setup 68% Complete</p>
          </div>
        </div>
        <div className="mt-3 h-1 bg-gray-200 rounded-full overflow-hidden">
          <div className="h-full w-[68%] bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-300"></div>
        </div>
      </SidebarHeader>
      
      <SidebarContent className="px-4 py-6">
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
            Main Menu
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-2">
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild
                    isActive={location.pathname === item.url}
                    className={`
                      relative group transition-all duration-200 ease-out
                      hover:bg-gray-100 hover:translate-x-1 hover:shadow-sm
                      data-[active=true]:bg-blue-50 data-[active=true]:text-blue-600 
                      data-[active=true]:border-l-4 data-[active=true]:border-blue-500
                      data-[active=true]:ml-0 data-[active=true]:pl-4
                      rounded-lg py-3 px-4 text-base font-medium
                    `}
                  >
                    <button 
                      onClick={() => navigate(item.url)}
                      className="flex items-center w-full text-left"
                    >
                      <item.icon className="w-5 h-5 mr-3 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-700 group-data-[active=true]:text-blue-600 font-medium">
                            {item.title}
                          </span>
                          {item.isNew && (
                            <Badge className="ml-2 px-1.5 py-0.5 text-xs bg-red-500 text-white rounded-full">
                              New
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-gray-500 mt-0.5 group-data-[active=true]:text-blue-500">
                          {item.description}
                        </p>
                      </div>
                    </button>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="mt-8">
          <SidebarGroupLabel className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
            Support
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-2">
              {supportItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild
                    className="hover:bg-gray-100 hover:translate-x-1 transition-all duration-200 rounded-lg py-3 px-4"
                  >
                    <button 
                      onClick={() => navigate(item.url)}
                      className="flex items-center w-full text-left"
                    >
                      <item.icon className="w-5 h-5 mr-3 text-gray-600" />
                      <div>
                        <span className="text-gray-700 font-medium">{item.title}</span>
                        <p className="text-xs text-gray-500 mt-0.5">{item.description}</p>
                      </div>
                    </button>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter className="p-4 border-t border-gray-200 mt-auto">
        <div className="text-center">
          <button className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium py-2.5 px-4 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 hover:shadow-md transform hover:scale-105">
            Upgrade to Pro
          </button>
          <p className="text-xs text-gray-400 mt-3">
            © 2024 Bizzy Platform • v2.1.0
          </p>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
