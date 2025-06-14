import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { CheckCircle, ExternalLink, ChevronLeft, ChevronRight, SkipForward, User, LogOut, Bell } from "lucide-react";
import { Link } from "react-router-dom";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import type { Json } from "@/integrations/supabase/types";
import { RichContentRenderer } from "@/components/guidance/RichContentRenderer";

interface GuidanceSection {
  id: number;
  title: string;
  description: string;
  order_number: number;
  icon: string;
}

interface GuidanceStep {
  id: number;
  section_id: number;
  title: string;
  content: string;
  video_url?: string;
  external_links: Json;
  order_number: number;
  rich_content?: Json;
  estimated_time_minutes?: number;
}

interface UserProgress {
  section_id: number;
  step_id: number;
  completed: boolean;
  section_completed: boolean;
}

interface EnhancedSection extends GuidanceSection {
  completed_steps: number;
  total_steps: number;
  estimated_time_minutes: number;
}

const GuidedHelp = () => {
  const { user, signOut } = useAuth();
  const [sections, setSections] = useState<GuidanceSection[]>([]);
  const [enhancedSections, setEnhancedSections] = useState<EnhancedSection[]>([]);
  const [currentSection, setCurrentSection] = useState<number>(1);
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [steps, setSteps] = useState<GuidanceStep[]>([]);
  const [allSteps, setAllSteps] = useState<GuidanceStep[]>([]);
  const [progress, setProgress] = useState<UserProgress[]>([]);
  const [completedSections, setCompletedSections] = useState<Set<number>>(new Set());
  const [visitedSteps, setVisitedSteps] = useState<Set<number>>(new Set());
  const [showChatbot, setShowChatbot] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [isAccountDropdownOpen, setIsAccountDropdownOpen] = useState(false);

  useEffect(() => {
    fetchSections();
    fetchAllSteps();
    if (user) {
      fetchProgress();
    }
  }, [user]);

  useEffect(() => {
    if (currentSection) {
      fetchSteps(currentSection);
    }
  }, [currentSection]);

  useEffect(() => {
    if (sections.length > 0 && allSteps.length > 0) {
      calculateEnhancedSections();
    }
  }, [sections, allSteps, progress, visitedSteps]);

  // Track step visits automatically and save to database
  useEffect(() => {
    if (steps.length > 0 && currentStep && user) {
      const currentStepData = steps.find(step => step.order_number === currentStep);
      if (currentStepData && !visitedSteps.has(currentStepData.id)) {
        setVisitedSteps(prev => new Set([...prev, currentStepData.id]));
        // Save step visit to database
        saveStepProgress(currentStepData.id, currentSection);
      }
    }
  }, [currentStep, steps, user]);

  const fetchSections = async () => {
    const { data, error } = await supabase
      .from('guidance_sections')
      .select('*')
      .order('order_number');
    
    if (data && !error) {
      setSections(data);
    }
  };

  const fetchAllSteps = async () => {
    const { data, error } = await supabase
      .from('guidance_steps')
      .select('*')
      .order('section_id, order_number');
    
    if (data && !error) {
      setAllSteps(data);
    }
  };

  const calculateEnhancedSections = () => {
    const enhanced = sections.map(section => {
      const sectionSteps = allSteps.filter(step => step.section_id === section.id);
      const completedStepsCount = sectionSteps.filter(step => visitedSteps.has(step.id)).length;
      const totalEstimatedTime = sectionSteps.reduce((total, step) => total + (step.estimated_time_minutes || 0), 0);

      return {
        ...section,
        completed_steps: completedStepsCount,
        total_steps: sectionSteps.length,
        estimated_time_minutes: totalEstimatedTime
      };
    });

    setEnhancedSections(enhanced);
  };

  const fetchSteps = async (sectionId: number) => {
    const { data, error } = await supabase
      .from('guidance_steps')
      .select('*')
      .eq('section_id', sectionId)
      .order('order_number');
    
    if (data && !error) {
      setSteps(data);
      setCurrentStep(1);
    } else {
      // If no steps found, set empty array
      setSteps([]);
      setCurrentStep(1);
    }
  };

  const fetchProgress = async () => {
    if (!user) return;
    
    // Get the most recent progress for each step to avoid duplicates
    const { data, error } = await supabase
      .from('user_guidance_progress')
      .select('section_id, step_id, completed, section_completed, last_visited_at')
      .eq('user_id', user.id)
      .order('last_visited_at', { ascending: false });
    
    if (data && !error) {
      // Remove duplicates by keeping only the most recent entry for each step
      const uniqueProgress = data.reduce((acc, item) => {
        const key = `${item.section_id}-${item.step_id}`;
        if (!acc[key]) {
          acc[key] = item;
        }
        return acc;
      }, {} as Record<string, typeof data[0]>);
      
      const progressArray = Object.values(uniqueProgress);
      setProgress(progressArray);
      
      // Extract completed sections
      const completedSectionIds = progressArray
        .filter(item => item.section_completed)
        .map(item => item.section_id);
      setCompletedSections(new Set(completedSectionIds));
      
      // Extract visited steps
      const visitedStepIds = progressArray.map(item => item.step_id);
      setVisitedSteps(new Set(visitedStepIds));
    }
  };

  const saveStepProgress = async (stepId: number, sectionId: number) => {
    if (!user) return;
    
    // Use update with match to avoid duplicates
    const { data: existingProgress } = await supabase
      .from('user_guidance_progress')
      .select('id')
      .eq('user_id', user.id)
      .eq('section_id', sectionId)
      .eq('step_id', stepId)
      .single();

    if (existingProgress) {
      // Update existing record
      await supabase
        .from('user_guidance_progress')
        .update({
          completed: true,
          last_visited_at: new Date().toISOString()
        })
        .eq('id', existingProgress.id);
    } else {
      // Insert new record
      await supabase
        .from('user_guidance_progress')
        .insert({
          user_id: user.id,
          section_id: sectionId,
          step_id: stepId,
          completed: true,
          section_completed: false,
          last_visited_at: new Date().toISOString()
        });
    }
  };

  const toggleSectionCompleted = async (sectionId: number) => {
    if (!user) return;
    
    const isNowCompleted = !completedSections.has(sectionId);
    
    // Get all steps for this section
    const { data: sectionSteps, error } = await supabase
      .from('guidance_steps')
      .select('id')
      .eq('section_id', sectionId);
    
    if (error || !sectionSteps) return;
    
    // Update all steps for this section
    for (const step of sectionSteps) {
      const { data: existingProgress } = await supabase
        .from('user_guidance_progress')
        .select('id')
        .eq('user_id', user.id)
        .eq('section_id', sectionId)
        .eq('step_id', step.id)
        .single();

      if (existingProgress) {
        // Update existing record
        await supabase
          .from('user_guidance_progress')
          .update({
            completed: isNowCompleted,
            section_completed: isNowCompleted,
            last_visited_at: new Date().toISOString()
          })
          .eq('id', existingProgress.id);
      } else {
        // Insert new record
        await supabase
          .from('user_guidance_progress')
          .insert({
            user_id: user.id,
            section_id: sectionId,
            step_id: step.id,
            completed: isNowCompleted,
            section_completed: isNowCompleted,
            last_visited_at: new Date().toISOString()
          });
      }
    }
    
    // Update local state immediately
    setCompletedSections(prev => {
      const next = new Set(prev);
      if (isNowCompleted) {
        next.add(sectionId);
      } else {
        next.delete(sectionId);
      }
      return next;
    });
    
    // Update visited steps if marking as completed
    if (isNowCompleted) {
      setVisitedSteps(prev => {
        const next = new Set(prev);
        sectionSteps.forEach(step => next.add(step.id));
        return next;
      });
    }
  };

  const checkAndAutoCompleteSection = async (sectionId: number) => {
    if (!user || completedSections.has(sectionId)) return;
    
    // Get all steps for this section
    const { data: sectionSteps } = await supabase
      .from('guidance_steps')
      .select('id')
      .eq('section_id', sectionId);
    
    if (!sectionSteps) return;
    
    // Check if all steps have been visited
    const allStepsVisited = sectionSteps.every(step => visitedSteps.has(step.id));
    
    if (allStepsVisited) {
      // Mark section as completed
      for (const step of sectionSteps) {
        const { data: existingProgress } = await supabase
          .from('user_guidance_progress')
          .select('id')
          .eq('user_id', user.id)
          .eq('section_id', sectionId)
          .eq('step_id', step.id)
          .single();

        if (existingProgress) {
          await supabase
            .from('user_guidance_progress')
            .update({
              section_completed: true,
              last_visited_at: new Date().toISOString()
            })
            .eq('id', existingProgress.id);
        }
      }
      
      setCompletedSections(prev => new Set([...prev, sectionId]));
    }
  };

  const isSectionCompleted = (sectionId: number) => {
    return completedSections.has(sectionId);
  };

  const getCurrentStepData = () => {
    return steps.find(step => step.order_number === currentStep);
  };

  const isLastStepInSection = () => {
    // If there are no steps, consider it the last (and only) step
    if (steps.length === 0) return true;
    return currentStep === steps.length;
  };

  const nextStep = async () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    } else if (currentSection < sections.length) {
      // Only auto-complete when explicitly moving to next section via Next button
      const currentSectionData = sections.find(s => s.order_number === currentSection);
      if (currentSectionData) {
        await checkAndAutoCompleteSection(currentSectionData.id);
      }
      
      setCurrentSection(currentSection + 1);
      setCurrentStep(1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else if (currentSection > 1) {
      setCurrentSection(currentSection - 1);
      // We'll set to last step of previous section
      const prevSectionSteps = steps.filter(step => step.section_id === currentSection - 1);
      setCurrentStep(prevSectionSteps.length);
    }
  };

  const skipSection = () => {
    if (currentSection < sections.length) {
      setCurrentSection(currentSection + 1);
      setCurrentStep(1);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  // Handle sidebar navigation without auto-completing
  const handleSidebarNavigation = (sectionOrderNumber: number) => {
    setCurrentSection(sectionOrderNumber);
    setCurrentStep(1);
  };

  const currentStepData = getCurrentStepData();
  
  // Debug logging - moved outside JSX
  useEffect(() => {
    if (currentStepData) {
      console.log('Current step data:', {
        title: currentStepData.title,
        hasVideoUrl: !!currentStepData.video_url,
        hasRichContent: !!currentStepData.rich_content,
        richContent: currentStepData.rich_content
      });
      console.log('Rendering content for step:', currentStepData.title);
      console.log('Rich content check:', currentStepData.rich_content || currentStepData.video_url);
    }
  }, [currentStepData]);
  
  // Helper function to safely parse external links
  const getExternalLinks = (links: Json): Array<{ title: string; url: string }> => {
    if (Array.isArray(links)) {
      return links.filter((link): link is { title: string; url: string } => 
        typeof link === 'object' && 
        link !== null && 
        typeof (link as any).title === 'string' && 
        typeof (link as any).url === 'string'
      );
    }
    return [];
  };

  // Get current section for mark complete button - find by current section number
  const currentSectionData = sections.find(s => s.order_number === currentSection);
  const isCurrentSectionCompleted = currentSectionData ? isSectionCompleted(currentSectionData.id) : false;

  return (
    <div className="min-h-screen bg-white flex">
      {/* Left Sidebar - Blue */}
      <div className="w-80 bg-[#0088cc] text-white flex flex-col">
        {/* Logo */}
        <div className="p-4 bg-white">
          <Link to="/dashboard" className="flex items-center justify-center">
            <img src="/lovable-uploads/502b3627-55d4-4915-b44e-a2aa01e5751e.png" alt="Bizzy Logo" className="h-48" />
          </Link>
        </div>

        {/* Progress Steps - moved up with reduced padding */}
        <div className="flex-1 p-4 pt-2">
          <h2 className="text-lg font-semibold mb-4">Your Business Setup Journey</h2>
          <div className="space-y-3">
            {enhancedSections.map((section) => {
              const isCompleted = isSectionCompleted(section.id);
              const isCurrent = currentSection === section.order_number;
              
              return (
                <button
                  key={section.id}
                  onClick={() => handleSidebarNavigation(section.order_number)}
                  className={`w-full flex items-center gap-4 p-3 rounded-lg transition-all ${
                    isCurrent
                      ? 'bg-white text-[#0088cc]'
                      : isCompleted
                      ? 'bg-white/10 text-white/70 hover:bg-white/20'
                      : 'hover:bg-white/10'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold relative ${
                    isCompleted
                      ? isCurrent 
                        ? 'bg-green-500 text-white'
                        : 'bg-green-500 text-white'
                      : isCurrent
                      ? 'bg-[#0088cc] text-white'
                      : 'bg-white/20'
                  }`}>
                    {isCompleted ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : (
                      section.order_number
                    )}
                  </div>
                  <div className="text-left flex-1">
                    <div className={`font-medium ${isCompleted && !isCurrent ? 'line-through' : ''}`}>
                      {section.title}
                    </div>
                    <div className={`text-sm ${isCompleted && !isCurrent ? 'opacity-60 line-through' : 'opacity-75'}`}>
                      {section.completed_steps}/{section.total_steps} steps • {section.estimated_time_minutes} min
                    </div>
                  </div>
                  {isCompleted && !isCurrent && (
                    <div className="ml-auto">
                      <CheckCircle className="w-5 h-5 text-green-400" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content Area - White */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <div className="bg-[#0088cc] border-b p-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-white">
              {sections.find(s => s.order_number === currentSection)?.title}
            </h1>
            <p className="text-white/80">
              Step {currentStep} of {steps.length === 0 ? 1 : steps.length}
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <Button 
              onClick={() => setShowChatbot(true)}
              className="bg-white text-[#0088cc] hover:bg-gray-100"
            >
              Talk to Bizzy
            </Button>
            
            <div 
              className="relative"
              onMouseEnter={() => setShowNotifications(true)}
              onMouseLeave={() => setShowNotifications(false)}
            >
              <Button 
                variant="ghost" 
                size="sm"
                className="relative text-white hover:text-white hover:bg-white/20 font-medium"
              >
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  3
                </span>
              </Button>
              
              {showNotifications && (
                <div className="absolute right-0 top-full mt-2 w-80 bg-white border rounded-lg shadow-lg z-50">
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

            {/* Account Dropdown - Improved hover functionality */}
            <div 
              className="relative"
              onMouseEnter={() => setIsAccountDropdownOpen(true)}
              onMouseLeave={() => setIsAccountDropdownOpen(false)}
            >
              <DropdownMenu open={isAccountDropdownOpen} onOpenChange={setIsAccountDropdownOpen}>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="flex items-center gap-2 text-white hover:text-white hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-1 font-medium"
                  >
                    <User className="h-4 w-4" />
                    <span className="hidden sm:inline font-medium">
                      {user?.user_metadata?.company_name || 
                       (user?.user_metadata?.first_name 
                         ? `${user.user_metadata.first_name.charAt(0).toUpperCase() + user.user_metadata.first_name.slice(1)}`
                         : user?.email?.split('@')[0] || 'Account')}
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48 bg-white border shadow-lg">
                  <DropdownMenuItem asChild>
                    <Link to="/dashboard/settings" className="flex items-center gap-2 w-full text-gray-700 hover:text-gray-900 cursor-pointer">
                      <User className="h-4 w-4" />
                      Account Settings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={handleSignOut}
                    className="flex items-center gap-2 text-red-600 focus:text-red-600 cursor-pointer"
                  >
                    <LogOut className="h-4 w-4" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>

        {/* Content - with padding bottom for fixed footer */}
        <div className="flex-1 p-4 sm:p-8 pb-32">
          {steps.length === 0 ? (
            // Show placeholder content when no steps exist
            <div className="max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4 sm:mb-6">
                {sections.find(s => s.order_number === currentSection)?.title}
              </h2>
              <Card className="mb-6 sm:mb-8">
                <CardContent className="p-6 sm:p-8">
                  <div className="prose max-w-none">
                    <p className="text-sm">
                      Content for this section is coming soon. You can still mark this section as complete to track your progress.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : currentStepData ? (
            <div className="max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4 sm:mb-6">
                {currentStepData.title === "Secure your Company documents" ? "Starting your Company Documents" : currentStepData.title}
              </h2>

              {/* Rich Content Section - video will be handled automatically by RichContentRenderer */}
              <Card className="mb-6 sm:mb-8">
                <CardContent className="p-6 sm:p-8">
                  {currentStepData.rich_content || currentStepData.video_url ? (
                    <RichContentRenderer 
                      content={currentStepData}
                      stepId={currentStepData.id}
                    />
                  ) : (
                    <div className="prose max-w-none">
                      <p className="text-base sm:text-lg leading-relaxed text-gray-700">
                        {currentStepData.content}
                      </p>
                    </div>
                  )}

                  {/* External Links - only show if not using rich content */}
                  {!currentStepData.rich_content && getExternalLinks(currentStepData.external_links).length > 0 && (
                    <div className="mt-6 pt-6 border-t">
                      <h3 className="font-semibold mb-3">Helpful Resources:</h3>
                      <div className="space-y-2">
                        {getExternalLinks(currentStepData.external_links).map((link, index) => (
                          <a
                            key={index}
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-[#0088cc] hover:underline text-sm sm:text-base"
                          >
                            <ExternalLink className="w-4 h-4" />
                            {link.title}
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          ) : null}
        </div>

        {/* Fixed Floating Bottom Navigation */}
        <div className="fixed bottom-0 left-80 right-0 bg-white/95 backdrop-blur-sm border-t shadow-lg p-4 sm:p-6 flex justify-between items-center z-40">
          <Button
            variant="outline"
            onClick={prevStep}
            disabled={currentSection === 1 && currentStep === 1}
            className="text-sm sm:text-base"
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Back
          </Button>

          <div className="flex gap-2 sm:gap-3">
            {/* Show Mark Section Complete and Skip Section buttons on last step of any section OR when no steps exist */}
            {isLastStepInSection() && currentSectionData && (
              <>
                <Button
                  onClick={() => toggleSectionCompleted(currentSectionData.id)}
                  className={`text-sm sm:text-base ${
                    isCurrentSectionCompleted
                      ? "bg-gray-400 hover:bg-gray-500 text-white"
                      : "bg-green-600 hover:bg-green-700 text-white"
                  }`}
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  {isCurrentSectionCompleted ? 'Mark as Incomplete' : 'Mark Section as Complete'}
                </Button>
                
                <Button
                  variant="outline"
                  onClick={skipSection}
                  disabled={currentSection === sections.length}
                  className="text-sm sm:text-base"
                >
                  <SkipForward className="w-4 h-4 mr-2" />
                  Skip Section
                </Button>
              </>
            )}
            
            <Button
              onClick={nextStep}
              disabled={currentSection === sections.length && (steps.length === 0 || currentStep === steps.length)}
              className="bg-[#0088cc] hover:bg-[#0088cc]/90 text-sm sm:text-base"
            >
              Next
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>

      {/* Chatbot Modal */}
      {showChatbot && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-md h-[500px] flex flex-col">
            <div className="flex items-center justify-between p-4 border-b bg-[#0088cc] text-white rounded-t-lg">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-white rounded-full overflow-hidden">
                  <AspectRatio ratio={1}>
                    <img 
                      src="/lovable-uploads/502b3627-55d4-4915-b44e-a2aa01e5751e.png" 
                      alt="Bizzy" 
                      className="w-full h-full object-contain"
                    />
                  </AspectRatio>
                </div>
                <span className="font-medium">Talk to Bizzy</span>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-6 w-6 p-0 text-white hover:bg-white/20"
                onClick={() => setShowChatbot(false)}
              >
                ×
              </Button>
            </div>
            
            <div className="flex-1 p-4">
              <div className="bg-gray-100 p-3 rounded-lg">
                <p className="text-sm">
                  Hi! I'm here to help you with your business setup journey. What questions do you have about this step?
                </p>
              </div>
            </div>
            
            <div className="border-t p-4">
              <div className="flex gap-2">
                <input 
                  placeholder="Ask me anything..." 
                  className="flex-1 px-3 py-2 border rounded-md text-sm"
                />
                <Button className="bg-[#0088cc] hover:bg-[#0088cc]/90 text-sm">
                  Send
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GuidedHelp;
