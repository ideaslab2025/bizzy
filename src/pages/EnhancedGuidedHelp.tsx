import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Bell, User, ChevronDown, Settings, LogOut, MessageCircle } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useGuidanceProgress } from "@/hooks/useGuidanceProgress";
import { SidebarSection } from "@/components/guidance/SidebarSection";
import { GuidanceStep } from "@/components/guidance/GuidanceStep";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import BizzyChat from "@/components/BizzyChat";
import { guidanceSections } from "@/data/guidance-data";
import { EnhancedGuidanceSection, GuidanceStepType } from "@/types/guidance";

const EnhancedGuidedHelp = () => {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  
  const { 
    completedSections, 
    completedSteps, 
    sectionProgress,
    toggleSectionCompleted,
    getOverallProgress,
    loading: progressLoading 
  } = useGuidanceProgress();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showChatbot, setShowChatbot] = useState(false);
  const [showNotifications, setShowNotifications] = useState(true);
  const [activeSection, setActiveSection] = useState<EnhancedGuidanceSection | null>(null);
  const [activeStep, setActiveStep] = useState<GuidanceStepType | null>(null);

  // Get user display name
  const getUserDisplayName = () => {
    if (user?.user_metadata?.full_name) {
      return user.user_metadata.full_name;
    }
    if (user?.user_metadata?.first_name && user?.user_metadata?.last_name) {
      return `${user.user_metadata.first_name} ${user.user_metadata.last_name}`;
    }
    return user?.email?.split('@')[0] || 'User';
  };

  useEffect(() => {
    // Extract section and step from URL
    const params = new URLSearchParams(location.search);
    const sectionId = params.get('section');
    const stepNumber = params.get('step');

    // Find the section and step based on the URL parameters
    if (sectionId) {
      const section = guidanceSections.find(s => s.id === parseInt(sectionId));
      if (section) {
        setActiveSection(section);
      }
    }
    if (sectionId && stepNumber) {
      const section = guidanceSections.find(s => s.id === parseInt(sectionId));
      if (section) {
        const step = section.steps.find(step => step.step === parseInt(stepNumber));
        if (step) {
          setActiveStep(step);
        }
      }
    }
  }, [location.search]);

  const handleSectionClick = (section: EnhancedGuidanceSection) => {
    setActiveSection(section);
    setActiveStep(section.steps[0]); // Automatically open the first step
    navigate(`/guided-help?section=${section.id}&step=${section.steps[0].step}`);
  };

  const handleStepClick = (step: GuidanceStepType) => {
      setActiveStep(step);
      if (activeSection) {
        navigate(`/guided-help?section=${activeSection.id}&step=${step.step}`);
      }
  };

  const isSectionCompleted = (sectionId: number) => {
    return completedSections.has(sectionId);
  };

  const isStepCompleted = (sectionId: number, stepNumber: number) => {
    return completedSteps.has(`${sectionId}-${stepNumber}`);
  };

  const toggleComplete = (sectionId: number) => {
    toggleSectionCompleted(sectionId);
  };

  const getSectionProgress = (sectionId: number) => {
    return sectionProgress.get(sectionId) || 0;
  };

  const isSectionLocked = (sectionId: number) => {
    const sectionIndex = guidanceSections.findIndex(section => section.id === sectionId);
    return sectionIndex > 0 && !isSectionCompleted(guidanceSections[sectionIndex - 1].id);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Enhanced Header */}
      <header className="bg-blue-600 shadow-lg border-b border-blue-700 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <motion.button
                onClick={() => navigate('/dashboard')}
                className="text-white/80 hover:text-white hover:bg-white/10 p-2 rounded-lg transition-all duration-200"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <ArrowLeft className="w-5 h-5" />
              </motion.button>
              
              <div>
                <h1 className="text-2xl font-bold text-white">
                  Business Setup Guide
                </h1>
                <p className="text-blue-100 text-sm">
                  Step-by-step guidance for your business journey
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <ThemeToggle />
              
              {/* Enhanced Notifications with consistent hover */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="relative text-white hover:bg-white/10 hover:text-white hover:scale-105 transition-all duration-200 rounded-lg p-2"
                  >
                    <Bell className="w-5 h-5" />
                    {showNotifications && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute top-1 right-1 flex h-3 w-3"
                      >
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75"></span>
                        <span className="relative inline-flex h-3 w-3 rounded-full bg-red-500"></span>
                      </motion.span>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80">
                  <div className="p-4 border-b">
                    <h3 className="font-semibold">Notifications</h3>
                  </div>
                  <DropdownMenuItem className="p-4">
                    <div>
                      <p className="font-medium">New guidance available!</p>
                      <p className="text-sm text-gray-500 mt-1">Check out the latest updates to your business setup guide</p>
                    </div>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Enhanced User Menu with consistent hover */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    className="flex items-center gap-2 text-white hover:bg-white/10 hover:text-white hover:scale-105 transition-all duration-200 rounded-lg p-2"
                  >
                    <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-white" />
                    </div>
                    <span className="font-medium hidden md:inline-block">{getUserDisplayName()}</span>
                    <ChevronDown className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem>
                    <User className="w-4 h-4 mr-2" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings className="w-4 h-4 mr-2" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-red-600">
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Enhanced Talk to Bizzy Button with consistent styling */}
              <Button
                onClick={() => setShowChatbot(true)}
                className="bg-white/10 text-white hover:bg-white/20 hover:scale-105 transition-all duration-200 border border-white/20 rounded-lg px-4 py-2 flex items-center gap-2"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Talk to Bizzy</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Enhanced Sidebar */}
        <motion.aside 
          className="w-56 bg-gradient-to-b from-blue-600 to-blue-800 min-h-[calc(100vh-5rem)] shadow-xl"
          initial={false}
          animate={{ width: mobileMenuOpen ? 256 : 256 }}
        >
          <nav className="p-4 space-y-2">
            {guidanceSections.map(section => (
              <SidebarSection
                key={section.id}
                section={section}
                isActive={activeSection?.id === section.id}
                isCompleted={isSectionCompleted(section.id)}
                isLocked={isSectionLocked(section.id)}
                progress={getSectionProgress(section.id)}
                onClick={() => handleSectionClick(section)}
              />
            ))}
          </nav>
        </motion.aside>

        {/* Main Content Area */}
        <main className="flex-1 p-6">
          {activeSection && activeStep ? (
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{activeSection.title}</h2>
                  <p className="text-gray-600 mt-2">{activeSection.description}</p>
                </div>
                <Button
                  onClick={() => toggleComplete(activeSection.id)}
                  variant={isSectionCompleted(activeSection.id) ? "default" : "outline"}
                  className="flex items-center gap-2"
                >
                  {isSectionCompleted(activeSection.id) ? "Completed" : "Mark Complete"}
                </Button>
              </div>
              
              <div className="space-y-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-medium text-blue-900 mb-2">Section Progress</h3>
                  <div className="w-full bg-blue-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${getSectionProgress(activeSection.id)}%` }}
                    />
                  </div>
                  <p className="text-sm text-blue-700 mt-2">
                    {getSectionProgress(activeSection.id)}% complete
                  </p>
                </div>
                
                <div className="text-gray-600">
                  <p>Estimated time: {activeSection.estimated_time_minutes} minutes</p>
                  <p>Priority level: {activeSection.priority_order}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center text-gray-600 mt-12">
              {progressLoading ? (
                <p>Loading progress...</p>
              ) : (
                <>
                  <h2 className="text-2xl font-semibold mb-4">Welcome to the Business Setup Guide</h2>
                  <p>Select a section from the sidebar to get started.</p>
                </>
              )}
            </div>
          )}
        </main>
      </div>

      {/* Bizzy Chatbot Modal */}
      {showChatbot && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed top-0 left-0 w-full h-full bg-black/50 z-50 flex items-center justify-center"
        >
          <motion.div
            initial={{ scale: 0.8, y: 50 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.8, y: 50 }}
            className="bg-white rounded-lg shadow-xl overflow-hidden max-w-3xl max-h-[90vh]"
          >
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-lg font-semibold">Talk to Bizzy</h2>
              <Button variant="ghost" onClick={() => setShowChatbot(false)}>
                <X className="w-5 h-5" />
              </Button>
            </div>
            <div className="p-4">
              <BizzyChat isOpen={showChatbot} onClose={() => setShowChatbot(false)} />
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default EnhancedGuidedHelp;
