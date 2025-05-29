
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile";
import { useLocation, useNavigate } from "react-router-dom";
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
  Trophy,
  Menu,
  Rocket,
  Banknote,
  Users,
  Scale,
  RefreshCw,
  Shield,
  Umbrella,
  TrendingUp,
  Monitor,
  Briefcase,
  FileText,
  Building2,
  UserPlus,
  CreditCard,
  Lock,
  ShieldAlert,
  Cpu
} from "lucide-react";
import { Link } from "react-router-dom";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { SidebarSection } from "@/components/guidance/SidebarSection";
import { RichContentRenderer } from "@/components/guidance/RichContentRenderer";
import { ProgressHeader } from "@/components/guidance/ProgressHeader";
import { QuickWinsPanel } from "@/components/guidance/QuickWinsPanel";
import { SmartRecommendationsPanel } from "@/components/guidance/SmartRecommendationsPanel";
import { SwipeableStepContent } from "@/components/guidance/SwipeableStepContent";
import { MilestoneReached } from "@/components/celebrations/MilestoneReached";
import { AchievementNotification } from "@/components/celebrations/AchievementNotification";
import { useGuidanceProgress } from "@/hooks/useGuidanceProgress";
import type { 
  EnhancedGuidanceSection, 
  EnhancedGuidanceStep, 
  UserAchievement, 
  StepTimeTracking 
} from "@/types/guidance";
import type { UserDocumentProgress } from "@/types/documents";
import { StepContentSkeleton } from '@/components/ui/skeleton-loader';

interface UserProgress {
  section_id: number;
  step_id: number;
  completed: boolean;
  section_completed: boolean;
}

interface QuickWinStep extends EnhancedGuidanceStep {
  section_title: string;
}

// Section configuration with enhanced metadata and proper outline icons
const sectionConfig = {
  1: { 
    icon: Rocket, 
    color: 'text-blue-600 bg-blue-100', 
    emoji: '🚀', 
    title: 'Launch Essentials',
    description: 'Get your company officially registered and set up with all government requirements.'
  },
  2: { 
    icon: Banknote, 
    color: 'text-green-600 bg-green-100', 
    emoji: '💰', 
    title: 'Financial Setup',
    description: 'Open business accounts, register for taxes, and establish your financial foundation.'
  },
  3: { 
    icon: Users, 
    color: 'text-orange-600 bg-orange-100', 
    emoji: '👥', 
    title: 'Employment & HR',
    description: 'Register as an employer, set up payroll, and create essential HR policies.'
  },
  4: { 
    icon: Scale, 
    color: 'text-red-600 bg-red-100', 
    emoji: '⚖️', 
    title: 'Legal & Compliance',
    description: 'Ensure legal compliance with contracts, terms of service, and regulatory requirements.'
  },
  5: { 
    icon: RefreshCw, 
    color: 'text-purple-600 bg-purple-100', 
    emoji: '🔄', 
    title: 'Ongoing Operations',
    description: 'Establish systems for smooth daily operations and long-term business management.'
  },
  6: { 
    icon: Shield, 
    color: 'text-indigo-600 bg-indigo-100', 
    emoji: '🛡️', 
    title: 'Data Protection & GDPR',
    description: 'Register with ICO, create privacy policies, and ensure GDPR compliance for your business data handling.'
  },
  7: { 
    icon: Umbrella, 
    color: 'text-amber-600 bg-amber-100', 
    emoji: '☂️', 
    title: 'Insurance & Risk Management',
    description: 'Set up essential business insurance including employers\' liability, public liability, and professional indemnity.'
  },
  8: { 
    icon: TrendingUp, 
    color: 'text-emerald-600 bg-emerald-100', 
    emoji: '📈', 
    title: 'Business Growth & Scaling',
    description: 'Plan for expansion, hiring strategies, and prepare your business for investment and scaling opportunities.'
  },
  9: { 
    icon: Monitor, 
    color: 'text-sky-600 bg-sky-100', 
    emoji: '💻', 
    title: 'Technology & Systems',
    description: 'Implement essential software, digital tools, and cybersecurity measures for efficient operations.'
  },
  10: { 
    icon: Briefcase, 
    color: 'text-rose-600 bg-rose-100', 
    emoji: '💼', 
    title: 'Sector-Specific Requirements',
    description: 'Complete industry-specific registrations, licenses, and compliance requirements for your business sector.'
  }
};

const EnhancedGuidedHelp = () => {
  const { user, signOut } = useAuth();
  const isMobile = useIsMobile();
  const location = useLocation();
  const navigate = useNavigate();
  
  // Use the shared progress hook
  const { 
    completedSections, 
    completedSteps, 
    sectionProgress,
    toggleSectionCompleted,
    getOverallProgress,
    loading: progressLoading 
  } = useGuidanceProgress();

  // Local state for component-specific data
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [sections, setSections] = useState<EnhancedGuidanceSection[]>([]);
  const [currentSection, setCurrentSection] = useState<number>(1);
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [steps, setSteps] = useState<EnhancedGuidanceStep[]>([]);
  const [allSteps, setAllSteps] = useState<EnhancedGuidanceStep[]>([]);
  const [progress, setProgress] = useState<UserProgress[]>([]);
  const [visitedSteps, setVisitedSteps] = useState<Set<number>>(new Set());
  const [achievements, setAchievements] = useState<UserAchievement[]>([]);
  const [quickWins, setQuickWins] = useState<QuickWinStep[]>([]);
  const [totalTimeSpent, setTotalTimeSpent] = useState(0);
  const [sessionStartTime, setSessionStartTime] = useState<Date | null>(null);
  const [showChatbot, setShowChatbot] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [companyAge, setCompanyAge] = useState(0);
  const [stepLoading, setStepLoading] = useState(false);
  
  // Celebration states
  const [showMilestone, setShowMilestone] = useState<any>(null);
  const [achievementQueue, setAchievementQueue] = useState<any[]>([]);

  // URL parameter handling for navigation
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const sectionParam = searchParams.get('section');
    const stepParam = searchParams.get('step');
    
    if (sectionParam) {
      const sectionNumber = parseInt(sectionParam);
      if (sectionNumber >= 1 && sectionNumber <= 10) {
        setCurrentSection(sectionNumber);
        
        if (stepParam) {
          const stepNumber = parseInt(stepParam);
          if (stepNumber >= 1) {
            setCurrentStep(stepNumber);
          }
        } else {
          setCurrentStep(1);
        }
      }
    }
  }, [location.search]);

  const calculateCompanyAge = async () => {
    if (!user) return;
    
    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('created_at')
        .eq('id', user.id)
        .single();
        
      if (profile?.created_at) {
        const createdDate = new Date(profile.created_at);
        const now = new Date();
        const ageInDays = Math.floor((now.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24));
        setCompanyAge(ageInDays);
      }
    } catch (error) {
      console.error('Error calculating company age:', error);
    }
  };

  useEffect(() => {
    fetchSections();
    fetchAllSteps();
    if (user) {
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

  const fetchAllSteps = async () => {
    const { data, error } = await supabase
      .from('guidance_steps')
      .select('*')
      .order('section_id, order_number');
    
    if (data && !error) {
      const typedSteps = data.map(step => ({
        ...step,
        difficulty_level: step.difficulty_level as 'easy' | 'medium' | 'complex' | null,
        step_type: step.step_type as 'action' | 'information' | 'decision' | 'external' | null,
        prerequisites: step.prerequisites as string[] | null
      })) as EnhancedGuidanceStep[];
      
      setAllSteps(typedSteps);
    }
  };

  const fetchSteps = async (sectionId: number) => {
    const { data, error } = await supabase
      .from('guidance_steps')
      .select('*')
      .eq('section_id', sectionId)
      .order('order_number');
    
    if (data && !error) {
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
          completed: false,
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
          completed: false,
          section_completed: false,
          last_visited_at: new Date().toISOString()
        });
    }
  };

  const saveAchievement = async (achievementType: string) => {
    if (!user) return;
    
    try {
      await supabase
        .from('user_achievements')
        .insert({
          user_id: user.id,
          achievement_type: achievementType
        });
    } catch (error) {
      console.error('Error saving achievement:', error);
    }
  };

  const checkForAchievements = async () => {
    if (!user) return;

    // Check for first section completion
    if (completedSteps.size === 1) {
      const achievement = {
        type: 'first_section',
        title: 'First Steps!',
        description: 'You\'ve completed your first step in the journey!'
      };
      setShowMilestone(achievement);
      await saveAchievement('first_steps');
    }
    
    // Check for section completion
    const currentSectionData = sections.find(s => s.order_number === currentSection);
    if (currentSectionData) {
      const currentSectionSteps = steps.filter(s => s.section_id === currentSectionData?.id);
      const sectionCompletedSteps = currentSectionSteps.filter(s => completedSteps.has(s.id));
      
      if (sectionCompletedSteps.length === currentSectionSteps.length && currentSectionSteps.length > 0) {
        const achievement = {
          type: 'section_complete',
          title: `${currentSectionData.title} Complete!`,
          description: 'You\'ve mastered this entire section!'
        };
        setShowMilestone(achievement);
        await saveAchievement(`section_${currentSectionData.id}_complete`);
      }
    }
    
    // Check for halfway point
    const totalProgress = getOverallProgress();
    if (totalProgress >= 50 && totalProgress < 55) {
      const achievement = {
        type: 'halfway',
        title: 'Halfway There!',
        description: 'You\'re 50% through your business setup journey!'
      };
      setShowMilestone(achievement);
      await saveAchievement('halfway_complete');
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
    }
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
    const sectionSteps = allSteps.filter(step => step.section_id === sectionId);
    const completedSectionSteps = sectionSteps.filter(step => completedSteps.has(step.id));
    return sectionSteps.length > 0 ? (completedSectionSteps.length / sectionSteps.length) * 100 : 0;
  };

  const handleNavigateToStep = (sectionId: number, stepNumber: number) => {
    const section = sections.find(s => s.id === sectionId);
    if (section) {
      setCurrentSection(section.order_number);
      setCurrentStep(stepNumber);
    }
  };

  const completedStepIds = Array.from(completedSteps);

  const currentStepData = getCurrentStepData();
  const currentSectionData = sections.find(s => s.order_number === currentSection);
  const currentSectionProgress = currentSectionData ? getSectionProgress(currentSectionData.id) : 0;
  const overallProgress = Math.round(getOverallProgress());

  const enhancedSections = sections.map(section => {
    const progressData = sectionProgress[section.id];
    return {
      ...section,
      total_steps: progressData?.totalSteps || 0,
      completed_steps: progressData?.completedSteps || 0,
      progress: progressData?.progress || 0
    };
  });

  const sidebarContent = (
    <div className="bg-[#0088cc] h-full text-white flex flex-col">
      {/* Logo */}
      <div className="p-4 bg-white">
        <Link to="/dashboard" className="flex items-center justify-center">
          <img src="/lovable-uploads/502b3627-55d4-4915-b44e-a2aa01e5751e.png" alt="Bizzy Logo" className="h-48" />
        </Link>
      </div>

      {/* Progress Overview */}
      <div className="p-4 bg-white/10 border-b border-white/20">
        <div className="text-center">
          <div className="text-3xl font-bold">{Math.round(getOverallProgress())}%</div>
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
              <div key={section.id} data-section={section.order_number}>
                <SidebarSection
                  section={section}
                  isActive={isCurrent}
                  isCompleted={isCompleted}
                  onClick={() => {
                    setCurrentSection(section.order_number);
                    setMobileMenuOpen(false);
                    
                    // Update URL
                    navigate(`/guided-help?section=${section.order_number}`, { replace: true });
                  }}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  const getSectionIcon = (section: any) => {
    const config = sectionConfig[section.order_number as keyof typeof sectionConfig];
    if (config?.icon) {
      const IconComponent = config.icon;
      return <IconComponent className="w-6 h-6" strokeWidth={2} />;
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-white flex">
      {/* Mobile Menu Button */}
      {isMobile && (
        <div className="fixed top-4 left-4 z-50">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="bg-white shadow-md"
          >
            <Menu className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Sidebar - Desktop */}
      <div className="hidden lg:flex w-80">
        {sidebarContent}
      </div>

      {/* Sidebar - Mobile Drawer */}
      <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
        <SheetContent side="left" className="w-80 p-0">
          {sidebarContent}
        </SheetContent>
      </Sheet>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Enhanced Progress Header */}
        {currentSectionData && (
          <ProgressHeader
            currentSection={{
              ...currentSectionData,
              title: sectionConfig[currentSectionData.order_number as keyof typeof sectionConfig]?.title || currentSectionData.title,
              description: sectionConfig[currentSectionData.order_number as keyof typeof sectionConfig]?.description || currentSectionData.description
            }}
            currentStep={currentStep}
            totalSteps={steps.length}
            currentStepData={currentStepData}
            overallProgress={overallProgress}
            totalTimeSpent={totalTimeSpent}
            achievementCount={achievements.length}
            sectionProgress={currentSectionProgress}
          />
        )}

        {/* Top Bar - Mobile responsive */}
        <div className="bg-[#0088cc] border-b p-4 flex justify-between items-center">
          <div className="flex-1">
            <h1 className="text-xl lg:text-2xl font-bold text-white">
              {currentSectionData ? 
                (sectionConfig[currentSectionData.order_number as keyof typeof sectionConfig]?.title || currentSectionData.title) :
                'Business Setup Journey'
              }
            </h1>
            <p className="text-white/90 text-sm lg:text-base">
              Step {currentStep} of {steps.length === 0 ? 1 : steps.length}
            </p>
          </div>
          
          <div className="flex items-center gap-2 lg:gap-4">
            <Button 
              onClick={() => setShowChatbot(true)}
              className="bg-white text-[#0088cc] hover:bg-gray-100 text-xs lg:text-sm px-2 lg:px-4"
              size={isMobile ? "sm" : "default"}
            >
              {isMobile ? "Bizzy" : "Talk to Bizzy"}
            </Button>
            
            {/* Notifications - Mobile optimized */}
            <div
              className="relative"
              onMouseEnter={() => setShowNotifications(true)}
              onMouseLeave={() => setShowNotifications(false)}
            >
              <Button 
                variant="ghost" 
                size="sm"
                className="relative text-white hover:bg-white/20"
              >
                <Bell className="w-4 h-4 lg:w-5 lg:h-5" />
                <span className="absolute -top-1 -right-1 w-3 h-3 lg:w-4 lg:h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  3
                </span>
              </Button>

              {showNotifications && !isMobile && (
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

            {/* Account button */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="flex items-center gap-1 lg:gap-2 text-white hover:bg-white/20"
                >
                  <User className="h-3 w-3 lg:h-4 lg:w-4" />
                  <span className="hidden sm:inline text-xs lg:text-sm">
                    {user?.email?.split('@')[0] || 'Account'}
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

        {/* Content with Smart Recommendations */}
        <div className="flex-1 p-4 lg:p-8 pb-20 lg:pb-32">
          {/* Smart Recommendations Panel */}
          {user && completedStepIds.length >= 0 && (
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
          <SwipeableStepContent
            onNext={nextStep}
            onPrev={prevStep}
            canGoNext={currentSection < sections.length || currentStep < steps.length}
            canGoPrev={currentSection > 1 || currentStep > 1}
            currentStep={currentStep}
            totalSteps={steps.length || 1}
          >
            {steps.length === 0 ? (
              stepLoading ? (
                <StepContentSkeleton />
              ) : (
                <div className="max-w-4xl">
                  <h2 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-6">
                    {currentSectionData ? 
                      (sectionConfig[currentSectionData.order_number as keyof typeof sectionConfig]?.title || currentSectionData.title) :
                      'Section Title'
                    }
                  </h2>
                  <Card className="mb-8">
                    <CardContent className="p-4 lg:p-8">
                      <div className="prose max-w-none">
                        <p className="text-base lg:text-lg text-gray-600">
                          {currentSectionData ? 
                            (sectionConfig[currentSectionData.order_number as keyof typeof sectionConfig]?.description || 'Content for this section is coming soon.') :
                            'Content for this section is coming soon. You can still mark this section as complete to track your progress.'
                          }
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )
            ) : currentStepData ? (
              <motion.div 
                key={`${currentSection}-${currentStep}`}
                className="max-w-4xl"
              >
                <h2 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-6">
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
            ) : (
              stepLoading ? (
                <StepContentSkeleton />
              ) : null
            )}
          </SwipeableStepContent>
        </div>

        {/* Fixed Floating Bottom Navigation - Mobile responsive */}
        <div className="fixed bottom-0 left-0 lg:left-80 right-0 bg-white/95 backdrop-blur-sm border-t shadow-lg p-3 lg:p-6 flex justify-between items-center z-40">
          <Button
            variant="outline"
            onClick={prevStep}
            disabled={currentSection === 1 && currentStep === 1}
            size={isMobile ? "sm" : "default"}
          >
            <ChevronLeft className="w-3 h-3 lg:w-4 lg:h-4 mr-1 lg:mr-2" />
            <span className="text-xs lg:text-sm">Back</span>
          </Button>

          <div className="flex gap-2 lg:gap-3">
            {isLastStepInSection() && currentSectionData && (
              <>
                <Button
                  onClick={() => toggleSectionCompleted(currentSectionData.id)}
                  className={
                    completedSections.has(currentSectionData.id)
                      ? "bg-gray-400 hover:bg-gray-500 text-white text-xs lg:text-sm px-2 lg:px-4"
                      : "bg-green-600 hover:bg-green-700 text-white text-xs lg:text-sm px-2 lg:px-4"
                  }
                  size={isMobile ? "sm" : "default"}
                >
                  <CheckCircle className="w-3 h-3 lg:w-4 lg:h-4 mr-1 lg:mr-2" />
                  {isMobile ? 
                    (completedSections.has(currentSectionData.id) ? 'Incomplete' : 'Complete') :
                    (completedSections.has(currentSectionData.id) ? 'Mark as Incomplete' : 'Mark Section as Complete')
                  }
                </Button>
                
                <Button
                  variant="outline"
                  onClick={skipSection}
                  disabled={currentSection === sections.length}
                  size={isMobile ? "sm" : "default"}
                >
                  <SkipForward className="w-3 h-3 lg:w-4 lg:h-4 mr-1 lg:mr-2" />
                  <span className="text-xs lg:text-sm">{isMobile ? 'Skip' : 'Skip Section'}</span>
                </Button>
              </>
            )}
            
            <Button
              onClick={nextStep}
              disabled={currentSection === sections.length && (steps.length === 0 || currentStep === steps.length)}
              className="bg-[#0088cc] hover:bg-[#0088cc]/90 text-xs lg:text-sm px-2 lg:px-4"
              size={isMobile ? "sm" : "default"}
            >
              <span className="text-xs lg:text-sm">Next</span>
              <ChevronRight className="w-3 h-3 lg:w-4 lg:h-4 ml-1 lg:ml-2" />
            </Button>
          </div>
        </div>
      </div>

      {/* Celebration Components */}
      {showMilestone && (
        <MilestoneReached
          milestone={showMilestone}
          onClose={() => setShowMilestone(null)}
        />
      )}

      {achievementQueue.map((achievement, index) => (
        <AchievementNotification
          key={achievement.id}
          achievement={achievement}
          onClose={() => setAchievementQueue(prev => prev.filter((_, i) => i !== index))}
        />
      ))}

      {/* Chatbot Modal - Mobile responsive */}
      {showChatbot && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 lg:p-0">
          <div className={`bg-white rounded-lg flex flex-col ${isMobile ? 'w-full h-full max-w-md' : 'w-96 h-[500px]'}`}>
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
