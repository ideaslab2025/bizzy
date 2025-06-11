
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate, useSearchParams, useLocation, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { CheckCircle, Play, ExternalLink, ChevronLeft, ChevronRight, SkipForward, User, LogOut, Bell, Trophy, Menu, Rocket, Banknote, Users, Scale, RefreshCw, Shield, Umbrella, TrendingUp, Monitor, Briefcase, HelpCircle, Moon, Compass, Home, FileText, FolderOpen, Settings as SettingsIcon } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useIsMobile } from "@/hooks/use-mobile";
import { CloudSyncIndicator } from "@/components/ui/cloud-sync-indicator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import BizzyChat from "@/components/BizzyChat";
import { useTheme } from "@/hooks/useTheme";
import type { EnhancedGuidanceSection, EnhancedGuidanceStep, UserAchievement, StepTimeTracking } from "@/types/guidance";
import type { UserDocumentProgress } from "@/types/documents";
import { StepContentSkeleton } from '@/components/ui/skeleton-loader';
import { businessSections } from '@/data/businessSections';
import { cn } from "@/lib/utils";

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
  const { user } = useAuth();
  const location = useLocation();
  const isMobile = useIsMobile();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [bizzyOpen, setBizzyOpen] = useState(false);
  const [syncStatus, setSyncStatus] = useState<'typing' | 'uploading' | 'syncing' | 'synced' | 'offline' | 'error'>('synced');
  const { toggleTheme } = useTheme();

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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">Business Setup Guidance</h1>
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

      {/* Bizzy AI Chat */}
      <BizzyChat isOpen={bizzyOpen} onClose={() => setBizzyOpen(false)} />
    </div>
  );
};

export default EnhancedGuidedHelp;
