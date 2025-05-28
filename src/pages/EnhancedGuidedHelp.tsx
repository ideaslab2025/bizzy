import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { 
  CheckCircle, 
  Play, 
  ExternalLink, 
  ChevronLeft, 
  ChevronRight, 
  SkipForward, 
  User, 
  LogOut, 
  Bell,
  Trophy
} from "lucide-react";
import { Link } from "react-router-dom";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { SidebarSection } from "@/components/guidance/SidebarSection";
import { RichContentRenderer } from "@/components/guidance/RichContentRenderer";
import { ProgressHeader } from "@/components/guidance/ProgressHeader";
import { QuickWinsPanel } from "@/components/guidance/QuickWinsPanel";
import { SmartRecommendationsPanel } from "@/components/guidance/SmartRecommendationsPanel";
import type { 
  EnhancedGuidanceSection, 
  EnhancedGuidanceStep, 
  UserAchievement, 
  StepTimeTracking 
} from "@/types/guidance";
import type { UserDocumentProgress } from "@/types/documents";

interface UserProgress {
  section_id: number;
  step_id: number;
  completed: boolean;
  section_completed: boolean;
}

interface QuickWinStep extends EnhancedGuidanceStep {
  section_title: string;
}

const EnhancedGuidedHelp = () => {
  const { user, signOut } = useAuth();
  const [sections, setSections] = useState<EnhancedGuidanceSection[]>([]);
  const [currentSection, setCurrentSection] = useState<number>(1);
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [steps, setSteps] = useState<EnhancedGuidanceStep[]>([]);
  const [progress, setProgress] = useState<UserProgress[]>([]);
  const [completedSections, setCompletedSections] = useState<Set<number>>(new Set());
  const [visitedSteps, setVisitedSteps] = useState<Set<number>>(new Set());
  const [achievements, setAchievements] = useState<UserAchievement[]>([]);
  const [quickWins, setQuickWins] = useState<QuickWinStep[]>([]);
  const [totalTimeSpent, setTotalTimeSpent] = useState(0);
  const [sessionStartTime, setSessionStartTime] = useState<Date | null>(null);
  const [showChatbot, setShowChatbot] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [isAccountDropdownOpen, setIsAccountDropdownOpen] = useState(false);
  const [companyAge, setCompanyAge] = useState(0);

  useEffect(() => {
    fetchSections();
    if (user) {
      fetchProgress();
      fetchAchievements();
      fetchQuickWins();
      fetchTimeSpent();
      setSessionStartTime(new Date());
      calculateCompanyAge();
    }
  }, [user]);

  useEffect(() => {
    if (currentSection) {
      fetchSteps(currentSection);
    }
  }, [currentSection]);

  // Track step visits and time
  useEffect(() => {
    if (steps.length > 0 && currentStep && user) {
      const currentStepData = steps.find(step => step.order_number === currentStep);
      if (currentStepData && !visitedSteps.has(currentStepData.id)) {
        setVisitedSteps(prev => new Set([...prev, currentStepData.id]));
        saveStepProgress(currentStepData.id, currentSection);
      }
    }
  }, [currentStep, steps, user]);

  const fetchSections = async () => {
    const { data, error } = await supabase
      .from('guidance_sections')
      .select('*')
      .order('priority_order', { ascending: true });
    
    if (data && !error) {
      setSections(data);
    }
  };

  const fetchSteps = async (sectionId: number) => {
    const { data, error } = await supabase
      .from('guidance_steps')
      .select('*')
      .eq('section_id', sectionId)
      .order('order_number');
    
    if (data && !error) {
      // Type assertion to handle the database nullable fields
      const typedSteps = data.map(step => ({
        ...step,
        difficulty_level: step.difficulty_level as 'easy' | 'medium' | 'complex' | null,
        step_type: step.step_type as 'action' | 'information' | 'decision' | 'external' | null,
        prerequisites: step.prerequisites as string[] | null
      })) as EnhancedGuidanceStep[];
      
      setSteps(typedSteps);
      setCurrentStep(1);
    } else {
      setSteps([]);
      setCurrentStep(1);
    }
  };

  const fetchProgress = async () => {
    if (!user) return;
    
    const { data, error } = await supabase
      .from('user_guidance_progress')
      .select('section_id, step_id, completed, section_completed, last_visited_at')
      .eq('user_id', user.id)
      .order('last_visited_at', { ascending: false });
    
    if (data && !error) {
      const uniqueProgress = data.reduce((acc, item) => {
        const key = `${item.section_id}-${item.step_id}`;
        if (!acc[key]) {
          acc[key] = item;
        }
        return acc;
      }, {} as Record<string, typeof data[0]>);
      
      const progressArray = Object.values(uniqueProgress);
      setProgress(progressArray);
      
      const completedSectionIds = progressArray
        .filter(item => item.section_completed)
        .map(item => item.section_id);
      setCompletedSections(new Set(completedSectionIds));
      
      const visitedStepIds = progressArray.map(item => item.step_id);
      setVisitedSteps(new Set(visitedStepIds));
    }
  };

  const fetchAchievements = async () => {
    if (!user) return;
    
    const { data, error } = await supabase
      .from('user_achievements')
      .select('*')
      .eq('user_id', user.id);
      
    if (data && !error) {
      setAchievements(data);
    }
  };

  const fetchQuickWins = async () => {
    if (!user) return;
    
    const { data, error } = await supabase
      .from('guidance_steps')
      .select(`
        *,
        guidance_sections!inner(title)
      `)
      .eq('quick_win', true)
      .not('id', 'in', `(${visitedSteps.size > 0 ? Array.from(visitedSteps).join(',') : '0'})`)
      .limit(5);
      
    if (data && !error) {
      const quickWinsWithSection: QuickWinStep[] = data.map(step => ({
        ...step,
        difficulty_level: step.difficulty_level as 'easy' | 'medium' | 'complex' | null,
        step_type: step.step_type as 'action' | 'information' | 'decision' | 'external' | null,
        prerequisites: step.prerequisites as string[] | null,
        section_title: (step as any).guidance_sections.title
      }));
      setQuickWins(quickWinsWithSection);
    }
  };

  const fetchTimeSpent = async () => {
    if (!user) return;
    
    const { data, error } = await supabase
      .from('step_time_tracking')
      .select('time_spent_seconds')
      .eq('user_id', user.id);
      
    if (data && !error) {
      const total = data.reduce((sum, record) => sum + record.time_spent_seconds, 0);
      setTotalTimeSpent(total);
    }
  };

  const saveStepProgress = async (stepId: number, sectionId: number) => {
    if (!user) return;
    
    const { data: existingProgress } = await supabase
      .from('user_guidance_progress')
      .select('id')
      .eq('user_id', user.id)
      .eq('section_id', sectionId)
      .eq('step_id', stepId)
      .single();

    if (existingProgress) {
      await supabase
        .from('user_guidance_progress')
        .update({
          completed: true,
          last_visited_at: new Date().toISOString()
        })
        .eq('id', existingProgress.id);
    } else {
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
    
    const { data: sectionSteps, error } = await supabase
      .from('guidance_steps')
      .select('id')
      .eq('section_id', sectionId);
    
    if (error || !sectionSteps) return;
    
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
            completed: isNowCompleted,
            section_completed: isNowCompleted,
            last_visited_at: new Date().toISOString()
          })
          .eq('id', existingProgress.id);
      } else {
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
    
    setCompletedSections(prev => {
      const next = new Set(prev);
      if (isNowCompleted) {
        next.add(sectionId);
      } else {
        next.delete(sectionId);
      }
      return next;
    });
    
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
    
    const { data: sectionSteps } = await supabase
      .from('guidance_steps')
      .select('id')
      .eq('section_id', sectionId);
    
    if (!sectionSteps) return;
    
    const allStepsVisited = sectionSteps.every(step => visitedSteps.has(step.id));
    
    if (allStepsVisited) {
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

  const isLastStepInSection = () => {
    if (steps.length === 0) return true;
    return currentStep === steps.length;
  };

  const nextStep = async () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    } else if (currentSection < sections.length) {
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

  const handleSidebarNavigation = (sectionOrderNumber: number) => {
    setCurrentSection(sectionOrderNumber);
    setCurrentStep(1);
  };

  const getCurrentStepData = () => {
    return steps.find(step => step.order_number === currentStep);
  };

  const getSectionProgress = (sectionId: number) => {
    const sectionSteps = steps.filter(step => step.section_id === sectionId);
    const completedSteps = sectionSteps.filter(step => visitedSteps.has(step.id));
    return sectionSteps.length > 0 ? (completedSteps.length / sectionSteps.length) * 100 : 0;
  };

  const getOverallProgress = () => {
    const totalSteps = sections.reduce((total, section) => {
      const sectionSteps = steps.filter(step => step.section_id === section.id);
      return total + sectionSteps.length;
    }, 0);
    
    return totalSteps > 0 ? (visitedSteps.size / totalSteps) * 100 : 0;
  };

  const handleNavigateToStep = (sectionId: number, stepNumber: number) => {
    const section = sections.find(s => s.id === sectionId);
    if (section) {
      setCurrentSection(section.order_number);
      setCurrentStep(stepNumber);
    }
  };

  const completedStepIds = Array.from(visitedSteps);

  const currentStepData = getCurrentStepData();
  const currentSectionData = sections.find(s => s.order_number === currentSection);
  const sectionProgress = currentSectionData ? getSectionProgress(currentSectionData.id) : 0;
  const overallProgress = Math.round(getOverallProgress());

  // Enhanced sections with progress data
  const enhancedSections = sections.map(section => {
    const sectionSteps = steps.filter(step => step.section_id === section.id);
    const completedSteps = sectionSteps.filter(step => visitedSteps.has(step.id));
    return {
      ...section,
      total_steps: sectionSteps.length,
      completed_steps: completedSteps.length,
      progress: sectionSteps.length > 0 ? (completedSteps.length / sectionSteps.length) : 0
    };
  });

  return (
    <div className="min-h-screen bg-white flex">
      {/* Enhanced Left Sidebar */}
      <div className="w-80 bg-[#0088cc] text-white flex flex-col">
        {/* Logo */}
        <div className="p-4 bg-white">
          <Link to="/dashboard" className="flex items-center justify-center">
            <img src="/lovable-uploads/502b3627-55d4-4915-b44e-a2aa01e5751e.png" alt="Bizzy Logo" className="h-48" />
          </Link>
        </div>

        {/* Progress Overview */}
        <div className="p-4 bg-white/10 border-b border-white/20">
          <div className="text-center">
            <div className="text-3xl font-bold">{overallProgress}%</div>
            <div className="text-sm opacity-80">Overall Progress</div>
          </div>
        </div>

        {/* Enhanced Progress Steps */}
        <div className="flex-1 p-4 pt-2 overflow-y-auto">
          <h2 className="text-lg font-semibold mb-4">Your Business Setup Journey</h2>
          <div className="space-y-3">
            {enhancedSections.map((section) => {
              const isCompleted = completedSections.has(section.id);
              const isCurrent = currentSection === section.order_number;
              
              return (
                <SidebarSection
                  key={section.id}
                  section={section}
                  isActive={isCurrent}
                  isCompleted={isCompleted}
                  onClick={() => setCurrentSection(section.order_number)}
                />
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Enhanced Progress Header */}
        {currentSectionData && (
          <ProgressHeader
            currentSection={currentSectionData}
            currentStep={currentStep}
            totalSteps={steps.length}
            currentStepData={currentStepData}
            overallProgress={overallProgress}
            totalTimeSpent={totalTimeSpent}
            achievementCount={achievements.length}
            sectionProgress={sectionProgress}
          />
        )}

        {/* Content with Smart Recommendations */}
        <div className="flex-1 p-8 pb-32">
          {/* Smart Recommendations Panel */}
          {user && (
            <div className="mb-6">
              <SmartRecommendationsPanel
                userId={user.id}
                completedStepIds={completedStepIds}
                currentSectionCategory={currentSectionData?.color_theme || ''}
                companyAge={companyAge}
                onNavigateToStep={handleNavigateToStep}
              />
            </div>
          )}

          {/* Quick Wins Panel */}
          <QuickWinsPanel
            quickWins={quickWins}
            onNavigateToStep={handleNavigateToStep}
          />

          {/* Step Content */}
          {steps.length === 0 ? (
            <div className="max-w-4xl">
              <h2 className="text-3xl font-bold text-gray-800 mb-6">
                {currentSectionData?.title}
              </h2>
              <Card className="mb-8">
                <CardContent className="p-8">
                  <div className="prose max-w-none">
                    <p className="text-lg text-gray-600">
                      Content for this section is coming soon. You can still mark this section as complete to track your progress.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : currentStepData ? (
            <motion.div 
              key={`${currentSection}-${currentStep}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="max-w-4xl"
            >
              <h2 className="text-3xl font-bold text-gray-800 mb-6">
                {currentStepData.title}
              </h2>

              {/* Video Section */}
              {currentStepData.video_url && (
                <div className="mb-8">
                  <Card>
                    <CardContent className="p-6">
                      <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                        <Button variant="outline" size="lg" className="gap-2">
                          <Play className="w-5 h-5" />
                          Watch Video Guide
                        </Button>
                      </div>
                      <p className="text-sm text-gray-600">
                        30-60 second video explanation
                      </p>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Enhanced Rich Content */}
              <Card className="mb-8">
                <CardContent className="p-8">
                  <RichContentRenderer
                    content={currentStepData}
                    stepId={currentStepData.id}
                  />

                  {/* External Links */}
                  {currentStepData.external_links && Array.isArray(currentStepData.external_links) && currentStepData.external_links.length > 0 && (
                    <div className="mt-6 pt-6 border-t">
                      <h3 className="font-semibold mb-3">Helpful Resources:</h3>
                      <div className="space-y-2">
                        {(currentStepData.external_links as any[]).map((link, index) => (
                          <a
                            key={index}
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-[#0088cc] hover:underline"
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
            </motion.div>
          ) : null}
        </div>

        {/* Fixed Floating Bottom Navigation */}
        <div className="fixed bottom-0 left-80 right-0 bg-white/95 backdrop-blur-sm border-t shadow-lg p-6 flex justify-between items-center z-40">
          <Button
            variant="outline"
            onClick={prevStep}
            disabled={currentSection === 1 && currentStep === 1}
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Back
          </Button>

          <div className="flex gap-3">
            {/* Show Mark Section Complete and Skip Section buttons on last step of any section OR when no steps exist */}
            {isLastStepInSection() && currentSectionData && (
              <>
                <Button
                  onClick={() => toggleSectionCompleted(currentSectionData.id)}
                  className={
                    isSectionCompleted(currentSectionData.id)
                      ? "bg-gray-400 hover:bg-gray-500 text-white"
                      : "bg-green-600 hover:bg-green-700 text-white"
                  }
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  {isSectionCompleted(currentSectionData.id) ? 'Mark as Incomplete' : 'Mark Section as Complete'}
                </Button>
                
                <Button
                  variant="outline"
                  onClick={skipSection}
                  disabled={currentSection === sections.length}
                >
                  <SkipForward className="w-4 h-4 mr-2" />
                  Skip Section
                </Button>
              </>
            )}
            
            <Button
              onClick={nextStep}
              disabled={currentSection === sections.length && (steps.length === 0 || currentStep === steps.length)}
              className="bg-[#0088cc] hover:bg-[#0088cc]/90"
            >
              Next
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>

      {/* Chatbot Modal */}
      {showChatbot && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-96 h-[500px] flex flex-col">
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
                  className="flex-1 px-3 py-2 border rounded-md"
                />
                <Button className="bg-[#0088cc] hover:bg-[#0088cc]/90">
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

export default EnhancedGuidedHelp;
