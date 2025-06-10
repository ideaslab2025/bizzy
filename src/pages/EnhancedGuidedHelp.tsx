import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile";
import { CheckCircle, Play, ExternalLink, ChevronLeft, ChevronRight, SkipForward, User, LogOut, Bell, Trophy, Menu, Rocket, Banknote, Users, Scale, RefreshCw, Shield, Umbrella, TrendingUp, Monitor, Briefcase, HelpCircle, Moon, Compass } from "lucide-react";
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
import { CloudSyncIndicator } from "@/components/ui/cloud-sync-indicator";
import { SidebarProvider, SidebarTrigger, Sidebar, SidebarContent, SidebarInset } from "@/components/ui/sidebar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import BizzyChat from "@/components/BizzyChat";
import { useTheme } from "@/hooks/useTheme";
import type { EnhancedGuidanceSection, EnhancedGuidanceStep, UserAchievement, StepTimeTracking } from "@/types/guidance";
import type { UserDocumentProgress } from "@/types/documents";
import { StepContentSkeleton } from '@/components/ui/skeleton-loader';
import { businessSections } from '@/data/businessSections';

interface UserProgress {
  section_id: number;
  step_id: number;
  completed: boolean;
  section_completed: boolean;
}
interface QuickWinStep extends EnhancedGuidanceStep {
  section_title: string;
}

const guidanceCategories = [
  {
    id: 'company-setup',
    title: 'Company Set-Up',
    description: 'Essential steps to establish your business foundation',
    icon: Rocket,
    color: 'blue',
    steps: [
      {
        id: 1,
        title: 'Launch Essentials',
        description: 'Get your business started with the fundamental requirements',
        estimatedTime: '15 min',
        difficulty: 'easy' as const
      },
      {
        id: 2,
        title: 'Business Registration',
        description: 'Register your company with Companies House',
        estimatedTime: '30 min',
        difficulty: 'medium' as const
      },
      {
        id: 3,
        title: 'Business Bank Account',
        description: 'Open a dedicated business bank account',
        estimatedTime: '45 min',
        difficulty: 'medium' as const
      }
    ]
  },
  {
    id: 'tax-vat',
    title: 'Tax and VAT',
    description: 'Navigate tax obligations and VAT registration',
    icon: Banknote,
    color: 'green',
    steps: [
      {
        id: 4,
        title: 'Corporation Tax Registration',
        description: 'Register for Corporation Tax with HMRC',
        estimatedTime: '20 min',
        difficulty: 'medium' as const
      },
      {
        id: 5,
        title: 'VAT Registration',
        description: 'Determine if you need to register for VAT',
        estimatedTime: '25 min',
        difficulty: 'medium' as const
      }
    ]
  },
  {
    id: 'employment',
    title: 'Employment',
    description: 'Set up employment processes and compliance',
    icon: Users,
    color: 'purple',
    steps: [
      {
        id: 6,
        title: 'PAYE Setup',
        description: 'Set up PAYE for employee payroll',
        estimatedTime: '30 min',
        difficulty: 'complex' as const
      },
      {
        id: 7,
        title: 'Employment Contracts',
        description: 'Create compliant employment contracts',
        estimatedTime: '40 min',
        difficulty: 'medium' as const
      }
    ]
  },
  {
    id: 'legal-compliance',
    title: 'Legal Compliance',
    description: 'Ensure your business meets all legal requirements',
    icon: Scale,
    color: 'red',
    steps: [
      {
        id: 8,
        title: 'Terms and Conditions',
        description: 'Create website terms and conditions',
        estimatedTime: '35 min',
        difficulty: 'medium' as const
      },
      {
        id: 9,
        title: 'Privacy Policy',
        description: 'Draft a GDPR-compliant privacy policy',
        estimatedTime: '30 min',
        difficulty: 'medium' as const
      }
    ]
  },
  {
    id: 'finance',
    title: 'Finance',
    description: 'Manage your business finances and accounting',
    icon: TrendingUp,
    color: 'yellow',
    steps: [
      {
        id: 10,
        title: 'Accounting Software',
        description: 'Choose and set up accounting software',
        estimatedTime: '45 min',
        difficulty: 'medium' as const
      },
      {
        id: 11,
        title: 'Financial Planning',
        description: 'Create business financial projections',
        estimatedTime: '60 min',
        difficulty: 'complex' as const
      }
    ]
  },
  {
    id: 'data-protection',
    title: 'Data Protection',
    description: 'Implement GDPR compliance and data security',
    icon: Shield,
    color: 'indigo',
    steps: [
      {
        id: 12,
        title: 'GDPR Compliance',
        description: 'Ensure your business is GDPR compliant',
        estimatedTime: '50 min',
        difficulty: 'complex' as const
      },
      {
        id: 13,
        title: 'Data Security',
        description: 'Implement data protection measures',
        estimatedTime: '40 min',
        difficulty: 'medium' as const
      }
    ]
  }
];

const EnhancedGuidedHelp = () => {
  const {
    user,
    signOut
  } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const isMobile = useIsMobile();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [sections, setSections] = useState<EnhancedGuidanceSection[]>([]);
  const [currentSection, setCurrentSection] = useState<number>(1);
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [steps, setSteps] = useState<EnhancedGuidanceStep[]>([]);
  const [allSteps, setAllSteps] = useState<EnhancedGuidanceStep[]>([]);
  const [progress, setProgress] = useState<UserProgress[]>([]);
  const [completedSections, setCompletedSections] = useState<Set<number>>(new Set());
  const [visitedSteps, setVisitedSteps] = useState<Set<number>>(new Set());
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [achievements, setAchievements] = useState<UserAchievement[]>([]);
  const [quickWins, setQuickWins] = useState<QuickWinStep[]>([]);
  const [totalTimeSpent, setTotalTimeSpent] = useState(0);
  const [sessionStartTime, setSessionStartTime] = useState<Date | null>(null);
  const [bizzyOpen, setBizzyOpen] = useState(false);
  const [companyAge, setCompanyAge] = useState(0);
  const [stepLoading, setStepLoading] = useState(false);
  const [syncStatus, setSyncStatus] = useState<'typing' | 'uploading' | 'syncing' | 'synced' | 'offline' | 'error'>('synced');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const {
    toggleTheme
  } = useTheme();

  // Celebration states
  const [showMilestone, setShowMilestone] = useState<any>(null);
  const [achievementQueue, setAchievementQueue] = useState<any[]>([]);

  const calculateCompanyAge = async () => {
    if (!user) return;
    try {
      const {
        data: profile
      } = await supabase.from('profiles').select('created_at').eq('id', user.id).single();
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
      fetchProgress();
      fetchAchievements();
      fetchQuickWins();
      fetchTimeSpent();
      setSessionStartTime(new Date());
      calculateCompanyAge();
    }
  }, [user]);

  // Handle URL parameters for navigation
  useEffect(() => {
    const sectionParam = searchParams.get('section');
    const stepParam = searchParams.get('step');
    if (sectionParam) {
      const sectionId = parseInt(sectionParam);
      // Find the business section by ID and get its order number
      const businessSection = businessSections.find(bs => bs.id === sectionId);
      if (businessSection) {
        setCurrentSection(businessSection.order_number);
      }
    }
    if (stepParam) {
      const stepNumber = parseInt(stepParam);
      setCurrentStep(stepNumber);
    }
  }, [searchParams]);
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
    const {
      data,
      error
    } = await supabase.from('guidance_sections').select('*').order('priority_order', {
      ascending: true
    });
    if (data && !error) {
      setSections(data);
    }
  };
  const fetchAllSteps = async () => {
    const {
      data,
      error
    } = await supabase.from('guidance_steps').select('*').order('section_id, order_number');
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
    const {
      data,
      error
    } = await supabase.from('guidance_steps').select('*').eq('section_id', sectionId).order('order_number');
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
  const fetchProgress = async () => {
    if (!user) return;
    const {
      data,
      error
    } = await supabase.from('user_guidance_progress').select('section_id, step_id, completed, section_completed, last_visited_at').eq('user_id', user.id).order('last_visited_at', {
      ascending: false
    });
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
      const completedSectionIds = progressArray.filter(item => item.section_completed).map(item => item.section_id);
      setCompletedSections(new Set(completedSectionIds));
      const visitedStepIds = progressArray.map(item => item.step_id);
      setVisitedSteps(new Set(visitedStepIds));
      const actuallyCompletedStepIds = progressArray.filter(item => item.completed === true).map(item => item.step_id);
      setCompletedSteps(new Set(actuallyCompletedStepIds));
    }
  };
  const fetchAchievements = async () => {
    if (!user) return;
    const {
      data,
      error
    } = await supabase.from('user_achievements').select('*').eq('user_id', user.id);
    if (data && !error) {
      setAchievements(data);
    }
  };
  const fetchQuickWins = async () => {
    if (!user) return;
    const {
      data,
      error
    } = await supabase.from('guidance_steps').select(`
        *,
        guidance_sections!inner(title)
      `).eq('quick_win', true).not('id', 'in', `(${visitedSteps.size > 0 ? Array.from(visitedSteps).join(',') : '0'})`).limit(5);
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
    const {
      data,
      error
    } = await supabase.from('step_time_tracking').select('time_spent_seconds').eq('user_id', user.id);
    if (data && !error) {
      const total = data.reduce((sum, record) => sum + record.time_spent_seconds, 0);
      setTotalTimeSpent(total);
    }
  };
  const saveStepProgress = async (stepId: number, sectionId: number) => {
    if (!user) return;
    const {
      data: existingProgress
    } = await supabase.from('user_guidance_progress').select('id').eq('user_id', user.id).eq('section_id', sectionId).eq('step_id', stepId).single();
    if (existingProgress) {
      await supabase.from('user_guidance_progress').update({
        completed: false,
        last_visited_at: new Date().toISOString()
      }).eq('id', existingProgress.id);
    } else {
      await supabase.from('user_guidance_progress').insert({
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
      await supabase.from('user_achievements').insert({
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

  // Function to check completion state from localStorage
  const getSectionCompletionFromStorage = (sectionId: number) => {
    return localStorage.getItem(`bizzy_section_${sectionId}_complete`) === 'true';
  };

  // Function to save completion state to localStorage
  const saveSectionCompletionToStorage = (sectionId: number, completed: boolean) => {
    if (completed) {
      localStorage.setItem(`bizzy_section_${sectionId}_complete`, 'true');
    } else {
      localStorage.removeItem(`bizzy_section_${sectionId}_complete`);
    }
  };
  const toggleSectionCompleted = async (sectionId: number) => {
    if (!user) return;
    const isNowCompleted = !completedSections.has(sectionId) && !getSectionCompletionFromStorage(sectionId);

    // Save to localStorage
    saveSectionCompletionToStorage(sectionId, isNowCompleted);
    const {
      data: sectionSteps,
      error
    } = await supabase.from('guidance_steps').select('id').eq('section_id', sectionId);
    if (error || !sectionSteps) return;
    for (const step of sectionSteps) {
      const {
        data: existingProgress
      } = await supabase.from('user_guidance_progress').select('id').eq('user_id', user.id).eq('section_id', sectionId).eq('step_id', step.id).single();
      if (existingProgress) {
        await supabase.from('user_guidance_progress').update({
          completed: isNowCompleted,
          section_completed: isNowCompleted,
          last_visited_at: new Date().toISOString()
        }).eq('id', existingProgress.id);
      } else {
        await supabase.from('user_guidance_progress').insert({
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
    setCompletedSteps(prev => {
      const next = new Set(prev);
      if (isNowCompleted) {
        sectionSteps.forEach(step => next.add(step.id));
      } else {
        sectionSteps.forEach(step => next.delete(step.id));
      }
      return next;
    });
    if (isNowCompleted) {
      setVisitedSteps(prev => {
        const next = new Set(prev);
        sectionSteps.forEach(step => next.add(step.id));
        return next;
      });

      // Check for achievements after completing section
      setTimeout(() => checkForAchievements(), 500);
    }
  };
  const checkAndAutoCompleteSection = async (sectionId: number) => {
    if (!user || completedSections.has(sectionId)) return;
    const {
      data: sectionSteps
    } = await supabase.from('guidance_steps').select('id').eq('section_id', sectionId);
    if (!sectionSteps) return;
    const allStepsVisited = sectionSteps.every(step => visitedSteps.has(step.id));
    if (allStepsVisited) {
      for (const step of sectionSteps) {
        const {
          data: existingProgress
        } = await supabase.from('user_guidance_progress').select('id').eq('user_id', user.id).eq('section_id', sectionId).eq('step_id', step.id).single();
        if (existingProgress) {
          await supabase.from('user_guidance_progress').update({
            section_completed: true,
            last_visited_at: new Date().toISOString()
          }).eq('id', existingProgress.id);
        }
      }
      setCompletedSections(prev => new Set([...prev, sectionId]));
    }
  };
  const isSectionCompleted = (sectionId: number) => {
    return completedSections.has(sectionId) || getSectionCompletionFromStorage(sectionId);
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
  const navigateToSection = (sectionOrderNumber: number) => {
    navigate(`/guided-help?section=${sectionOrderNumber}`);
  };
  const handleSidebarNavigation = (sectionOrderNumber: number) => {
    setCurrentSection(sectionOrderNumber);
    setCurrentStep(1);
    // Scroll to top when switching sections
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  const getCurrentStepData = () => {
    return steps.find(step => step.order_number === currentStep);
  };
  const getSectionProgress = (sectionId: number) => {
    const sectionSteps = allSteps.filter(step => step.section_id === sectionId);
    const completedSectionSteps = sectionSteps.filter(step => completedSteps.has(step.id));
    return sectionSteps.length > 0 ? completedSectionSteps.length / sectionSteps.length * 100 : 0;
  };
  const getOverallProgress = () => {
    const totalSteps = allSteps.length;
    const totalCompletedSteps = completedSteps.size;
    return totalSteps > 0 ? totalCompletedSteps / totalSteps * 100 : 0;
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
  const sectionProgress = currentSectionData ? getSectionProgress(currentSectionData.id) : 0;
  const overallProgress = Math.round(getOverallProgress());

  const filteredSteps = guidanceCategories.flatMap(category => 
    category.steps.filter(step => {
      const matchesSearch = !searchQuery || 
        step.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        step.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = !selectedCategory || category.id === selectedCategory;
      
      return matchesSearch && matchesCategory;
    }).map(step => ({ ...step, category: category.title, categoryId: category.id }))
  );

  const getDifficultyColor = (difficulty: 'easy' | 'medium' | 'complex') => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'complex': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const getColorClasses = (color: string) => {
    const colorMap = {
      blue: 'text-blue-600 dark:text-blue-400',
      green: 'text-green-600 dark:text-green-400',
      purple: 'text-purple-600 dark:text-purple-400',
      red: 'text-red-600 dark:text-red-400',
      yellow: 'text-yellow-600 dark:text-yellow-400',
      indigo: 'text-indigo-600 dark:text-indigo-400'
    };
    return colorMap[color as keyof typeof colorMap] || 'text-gray-600 dark:text-gray-400';
  };

  // Left sidebar content matching dashboard design
  const sidebarContent = (
    <Sidebar className="border-r-0 w-16 max-w-16">
      <SidebarContent className="bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-800 border-r border-slate-200 dark:border-slate-700 h-screen sticky top-0">
        {/* Logo - Matching dashboard height */}
        <div className="p-3 border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
          <Link to="/dashboard" className="flex items-center justify-center">
            <img src="/lovable-uploads/502b3627-55d4-4915-b44e-a2aa01e5751e.png" alt="Bizzy Logo" className="h-8 w-8" />
          </Link>
        </div>

        {/* Navigation Icons */}
        <div className="flex-1 p-2 space-y-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link to="/dashboard" className="flex items-center justify-center w-12 h-12 rounded-lg bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors">
                  <Monitor className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>Dashboard</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900/30 border-2 border-blue-200 dark:border-blue-700">
                  <Compass className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>Guided Help</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link to="/dashboard/documents" className="flex items-center justify-center w-12 h-12 rounded-lg bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors">
                  <Briefcase className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>Documents</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </SidebarContent>
    </Sidebar>
  );

  return (
    <SidebarProvider>
      <div className="min-h-screen bg-white dark:bg-gray-900 flex w-full">
        {/* Sidebar - Using the same approach as dashboard */}
        {sidebarContent}

        {/* Sidebar - Mobile Drawer */}
        <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
          <SheetContent side="left" className="w-64 p-0">
            <div className="bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-800 h-full flex flex-col">
              {/* Logo */}
              <div className="p-4 border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
                <Link to="/dashboard" className="flex items-center gap-3">
                  <img src="/lovable-uploads/502b3627-55d4-4915-b44e-a2aa01e5751e.png" alt="Bizzy Logo" className="h-8 w-8" />
                  <span className="font-semibold text-gray-900 dark:text-white">Bizzy</span>
                </Link>
              </div>

              {/* Navigation Links */}
              <div className="flex-1 p-4 space-y-2">
                <Link to="/dashboard" className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                  <Monitor className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                  <span className="text-gray-900 dark:text-white">Dashboard</span>
                </Link>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700">
                  <Compass className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  <span className="text-blue-600 dark:text-blue-400 font-medium">Guided Help</span>
                </div>
                <Link to="/dashboard/documents" className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                  <Briefcase className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                  <span className="text-gray-900 dark:text-white">Documents</span>
                </Link>
              </div>
            </div>
          </SheetContent>
        </Sheet>

        {/* Main Content Area - Using SidebarInset for consistency */}
        <SidebarInset className="flex-1">
          {/* Mobile Menu Button */}
          {isMobile && (
            <div className="fixed top-4 left-4 z-50">
              <Button 
                variant="outline" 
                size="icon" 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
                className="bg-white dark:bg-gray-800 shadow-md"
              >
                <Menu className="h-4 w-4" />
              </Button>
            </div>
          )}

          {/* Fixed Floating Header - Dashboard Style */}
          <div className="fixed top-0 right-0 left-0 md:left-16 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 p-3 flex justify-between items-center h-16 shadow-sm z-40 transition-all duration-300">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <Compass className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                <h1 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white tracking-tight">Guided Help</h1>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <CloudSyncIndicator 
                status={syncStatus} 
                lastSaved={new Date(Date.now() - 30000)} 
                onForceSync={() => setSyncStatus('syncing')} 
                onShowHistory={() => console.log('Show sync history')} 
              />

              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={toggleTheme} 
                  className="text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg p-2 transition-all duration-200"
                >
                  <Moon className="h-4 w-4" />
                </Button>
              </motion.div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="relative text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg p-2 transition-all duration-200"
                    >
                      <Bell className="w-4 h-4" />
                      <motion.span 
                        initial={{ scale: 0 }} 
                        animate={{ scale: 1 }} 
                        className="absolute top-1 right-1 flex h-3 w-3"
                      >
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75"></span>
                        <span className="relative inline-flex h-3 w-3 rounded-full bg-red-500 animate-pulse"></span>
                      </motion.span>
                    </Button>
                  </motion.div>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80 bg-white border border-gray-200 shadow-lg rounded-lg z-50">
                  <div className="p-4 border-b border-gray-100 bg-gray-50">
                    <h3 className="font-semibold text-gray-900">Notifications</h3>
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
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button variant="ghost" className="flex items-center gap-2 rounded-lg p-2 transition-all duration-200 text-gray-700 hover:text-gray-900 hover:bg-gray-100">
                      <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                        <User className="w-3 h-3 text-white" />
                      </div>
                      <span className="font-medium hidden md:inline-block text-sm">Account</span>
                    </Button>
                  </motion.div>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 bg-white border border-gray-200 shadow-lg rounded-lg z-50">
                  <DropdownMenuItem className="hover:bg-gray-50">
                    <User className="w-4 h-4 mr-2" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut} className="hover:bg-red-50 text-red-600">
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <motion.button 
                whileHover={{ scale: 1.05 }} 
                whileTap={{ scale: 0.95 }} 
                onClick={() => setBizzyOpen(true)} 
                className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 font-medium shadow-sm hover:shadow-md text-sm"
              >
                <HelpCircle className="w-4 h-4" />
                <span>{isMobile ? "Bizzy" : "Talk to Bizzy"}</span>
              </motion.button>
            </div>
          </div>

          {/* Main Content with proper padding */}
          <div className="pt-20 pb-8">
            <div className="max-w-7xl mx-auto px-4 lg:px-6 space-y-6">
              {/* Header */}
              <div>
                <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">Business Setup Guidance</h1>
                <p className="text-gray-600 dark:text-gray-400 mt-2 text-sm lg:text-base">
                  Step-by-step guidance to set up your business properly
                </p>
              </div>

              {/* Filters */}
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="Search guidance..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
                  />
                </div>
                <select
                  value={selectedCategory || ''}
                  onChange={(e) => setSelectedCategory(e.target.value || null)}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
                >
                  <option value="">All Categories</option>
                  {guidanceCategories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.title}
                    </option>
                  ))}
                </select>
              </div>

              {/* Category Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {guidanceCategories.map((category) => {
                  const Icon = category.icon;
                  const visibleSteps = category.steps.filter(step => {
                    const matchesSearch = !searchQuery || 
                      step.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      step.description.toLowerCase().includes(searchQuery.toLowerCase());
                    return matchesSearch;
                  });

                  if (selectedCategory && category.id !== selectedCategory) return null;
                  if (searchQuery && visibleSteps.length === 0) return null;

                  return (
                    <Card key={category.id} className="h-full hover:shadow-md transition-shadow">
                      <CardHeader className="pb-3">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg bg-${category.color}-50 dark:bg-${category.color}-900/20`}>
                            <Icon className={`w-8 h-8 ${getColorClasses(category.color)}`} />
                          </div>
                          <div>
                            <CardTitle className="text-lg text-gray-900 dark:text-white">{category.title}</CardTitle>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{category.description}</p>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="space-y-3">
                          {(searchQuery ? visibleSteps : category.steps).map((step) => (
                            <div key={step.id} className="p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer transition-colors">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <h4 className="font-medium text-gray-900 dark:text-white text-sm">{step.title}</h4>
                                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{step.description}</p>
                                  <div className="flex items-center gap-2 mt-2">
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(step.difficulty)}`}>
                                      {step.difficulty}
                                    </span>
                                    <span className="text-xs text-gray-500 dark:text-gray-400">{step.estimatedTime}</span>
                                  </div>
                                </div>
                                <Button size="sm" variant="outline" className="ml-3">
                                  <Play className="w-3 h-3 mr-1" />
                                  Start
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              {filteredSteps.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-500 dark:text-gray-400">No guidance found matching your criteria.</p>
                </div>
              )}
            </div>
          </div>
        </SidebarInset>

        {/* Celebration Components */}
        {showMilestone && <MilestoneReached milestone={showMilestone} onClose={() => setShowMilestone(null)} />}

        {achievementQueue.map((achievement, index) => (
          <AchievementNotification 
            key={achievement.id} 
            achievement={achievement} 
            onClose={() => setAchievementQueue(prev => prev.filter((_, i) => i !== index))} 
          />
        ))}

        {/* Bizzy AI Chat */}
        <BizzyChat isOpen={bizzyOpen} onClose={() => setBizzyOpen(false)} />
      </div>
    </SidebarProvider>
  );
};

export default EnhancedGuidedHelp;
