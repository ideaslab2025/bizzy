
import React, { useState } from 'react';
import { Home, FileText, HelpCircle, Settings, BookOpen, Badge, ChevronRight } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
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

// Mock user plan - in real app this would come from context/props
const mockUserPlan = { current: 'free' as const };

const UpgradeButton = ({ userPlan }: { userPlan: { current: 'free' | 'bronze' | 'silver' | 'gold' | 'platinum' } }) => {
  const navigate = useNavigate();
  
  const plans = {
    free: { next: 'bronze', color: 'bg-gradient-to-r from-amber-600 to-amber-700', label: 'Bronze' },
    bronze: { next: 'silver', color: 'bg-gradient-to-r from-gray-400 to-gray-500', label: 'Silver' },
    silver: { next: 'gold', color: 'bg-gradient-to-r from-yellow-500 to-yellow-600', label: 'Gold' },
    gold: { next: 'platinum', color: 'bg-gradient-to-r from-purple-600 to-purple-700', label: 'Platinum' },
    platinum: null,
  };

  const nextPlan = plans[userPlan.current];

  if (!nextPlan) {
    return (
      <div className="rounded-lg bg-gradient-to-r from-purple-600 to-purple-700 p-3 text-center">
        <p className="text-sm text-white font-medium">Platinum Member</p>
        <p className="text-xs text-purple-200 mt-1">You're on our highest plan!</p>
      </div>
    );
  }

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => navigate(`/pricing?plan=${nextPlan.next}`)}
      className={`w-full rounded-lg ${nextPlan.color} px-4 py-3 text-white transition-all hover:shadow-lg`}
    >
      <div className="flex items-center justify-between">
        <span className="font-medium">Upgrade to {nextPlan.label}</span>
        <ChevronRight className="h-4 w-4" />
      </div>
      <p className="mt-1 text-xs opacity-90">Unlock more features</p>
    </motion.button>
  );
};

export function AppSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [expandedSections, setExpandedSections] = useState<string[]>(['main']);

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev =>
      prev.includes(sectionId)
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  return (
    <Sidebar className="bg-gradient-to-b from-gray-50 to-gray-100 border-r border-gray-200">
      <SidebarHeader className="p-4 border-b border-gray-200">
        {/* Enhanced Bizzy Logo - Reduced spacing */}
        <div className="flex items-center justify-center mb-3">
          <motion.a
            href="/"
            className="flex items-center gap-3 group cursor-pointer transition-all duration-200"
            whileHover={{ scale: 1.02 }}
            onClick={(e) => {
              e.preventDefault();
              navigate('/');
            }}
          >
            <div className="flex items-center gap-2">
              <img 
                src="/lovable-uploads/aa4b1538-01d2-4242-8776-815bd99470d9.png" 
                alt="Bizzy" 
                className="h-32 w-auto"
              />
            </div>
          </motion.a>
        </div>
        
        {/* Setup Progress - Reduced margins */}
        <div className="mt-2">
          <p className="text-xs text-gray-500 mb-1">Setup 68% Complete</p>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: "68%" }}
              transition={{ duration: 1, delay: 0.2 }}
            />
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarContent className="px-4 pt-4 flex-1 overflow-y-auto">
        {/* Main Menu Section */}
        <div className="mb-6">
          <motion.button
            onClick={() => toggleSection('main')}
            className="flex w-full items-center justify-between mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-gray-400 hover:text-gray-600 transition-colors"
          >
            <span>Main Menu</span>
            <motion.div
              animate={{ rotate: expandedSections.includes('main') ? 90 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronRight className="w-3 h-3" />
            </motion.div>
          </motion.button>
          
          <AnimatePresence>
            {expandedSections.includes('main') && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <SidebarMenu className="flex flex-col space-y-2">
                  {menuItems.map((item) => (
                    <SidebarMenuItem key={item.title} className="block mb-1 last:mb-0">
                      <SidebarMenuButton 
                        asChild
                        isActive={location.pathname === item.url}
                        className={`
                          relative group transition-all duration-200 ease-out
                          hover:bg-gray-100 hover:shadow-sm
                          data-[active=true]:bg-blue-50 data-[active=true]:text-blue-600 
                          data-[active=true]:border-l-4 data-[active=true]:border-blue-500
                          data-[active=true]:ml-0 data-[active=true]:pl-4
                          rounded-lg h-auto py-2.5 px-3 text-base font-medium
                        `}
                      >
                        <button 
                          onClick={() => navigate(item.url)}
                          className="flex items-center w-full text-left h-full"
                        >
                          <item.icon className="w-5 h-5 mr-3 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <span className="text-gray-700 group-data-[active=true]:text-blue-600 font-medium">
                                {item.title}
                              </span>
                              {item.isNew && (
                                <motion.div
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  className="ml-2"
                                >
                                  <Badge className="px-1.5 py-0.5 text-xs bg-red-500 text-white rounded-full">
                                    New
                                  </Badge>
                                </motion.div>
                              )}
                            </div>
                            <p className="text-xs text-gray-500 mt-0.5 group-data-[active=true]:text-blue-500 leading-relaxed leading-[1.3]">
                              {item.description}
                            </p>
                          </div>
                        </button>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Divider */}
        <div className="my-4 border-t border-gray-200" />

        {/* Support Section */}
        <div className="mb-6">
          <motion.button
            onClick={() => toggleSection('support')}
            className="flex w-full items-center justify-between mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-gray-400 hover:text-gray-600 transition-colors"
          >
            <span>Support</span>
            <motion.div
              animate={{ rotate: expandedSections.includes('support') ? 90 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronRight className="w-3 h-3" />
            </motion.div>
          </motion.button>
          
          <AnimatePresence>
            {expandedSections.includes('support') && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <SidebarMenu className="flex flex-col space-y-2">
                  {supportItems.map((item) => (
                    <SidebarMenuItem key={item.title} className="block mb-1 last:mb-0">
                      <SidebarMenuButton 
                        asChild
                        className="hover:bg-gray-100 transition-all duration-200 rounded-lg h-auto py-2.5 px-3"
                      >
                        <button 
                          onClick={() => navigate(item.url)}
                          className="flex items-center w-full text-left h-full"
                        >
                          <item.icon className="w-5 h-5 mr-3 text-gray-600" />
                          <div>
                            <span className="text-gray-700 font-medium">{item.title}</span>
                            <p className="text-xs text-gray-500 mt-0.5 leading-relaxed leading-[1.3]">{item.description}</p>
                          </div>
                        </button>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </SidebarContent>
      
      <SidebarFooter className="p-4 border-t border-gray-200 mt-auto space-y-4">
        <UpgradeButton userPlan={mockUserPlan} />
        
        <div className="text-center text-xs text-gray-400 space-y-1">
          <p>Bizzy Platform v2.1</p>
          <p>© 2025 Bizzy Ltd</p>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
