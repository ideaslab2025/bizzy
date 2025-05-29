
import React from 'react';
import { motion } from 'framer-motion';
import { 
  CheckCircle, Clock, Rocket, Banknote, Users, Scale, RefreshCw,
  Shield, Umbrella, TrendingUp, Monitor, Briefcase
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { EnhancedGuidanceSection } from '@/types/guidance';

interface SidebarSectionProps {
  section: EnhancedGuidanceSection & {
    completed_steps: number;
    total_steps: number;
    progress: number;
  };
  isActive: boolean;
  isCompleted: boolean;
  onClick: () => void;
}

// Section configuration matching the dashboard with outline icons
const sectionConfig = {
  1: { 
    icon: Rocket, 
    title: 'Launch Essentials', 
    iconColor: '#3B82F6',
    description: 'Get your company officially registered and set up with all government requirements.'
  },
  2: { 
    icon: Banknote, 
    title: 'Financial Setup', 
    iconColor: '#10B981',
    description: 'Open business accounts, register for taxes, and establish your financial foundation.'
  },
  3: { 
    icon: Users, 
    title: 'Employment & HR', 
    iconColor: '#F97316',
    description: 'Register as an employer, set up payroll, and create essential HR policies.'
  },
  4: { 
    icon: Scale, 
    title: 'Legal & Compliance', 
    iconColor: '#EF4444',
    description: 'Ensure legal compliance with contracts, terms of service, and regulatory requirements.'
  },
  5: { 
    icon: RefreshCw, 
    title: 'Ongoing Operations', 
    iconColor: '#8B5CF6',
    description: 'Establish systems for smooth daily operations and long-term business management.'
  },
  6: { 
    icon: Shield, 
    title: 'Data Protection & GDPR', 
    iconColor: '#6366F1',
    description: 'Register with ICO, create privacy policies, and ensure GDPR compliance for your business data handling.'
  },
  7: { 
    icon: Umbrella, 
    title: 'Insurance & Risk Management', 
    iconColor: '#F59E0B',
    description: 'Set up essential business insurance including employers\' liability, public liability, and professional indemnity.'
  },
  8: { 
    icon: TrendingUp, 
    title: 'Business Growth & Scaling', 
    iconColor: '#10B981',
    description: 'Plan for expansion, hiring strategies, and prepare your business for investment and scaling opportunities.'
  },
  9: { 
    icon: Monitor, 
    title: 'Technology & Systems', 
    iconColor: '#0EA5E9',
    description: 'Implement essential software, digital tools, and cybersecurity measures for efficient operations.'
  },
  10: { 
    icon: Briefcase, 
    title: 'Sector-Specific Requirements', 
    iconColor: '#F43F5E',
    description: 'Complete industry-specific registrations, licenses, and compliance requirements for your business sector.'
  }
};

export const SidebarSection: React.FC<SidebarSectionProps> = ({
  section,
  isActive,
  isCompleted,
  onClick
}) => {
  const progress = section.total_steps > 0 ? (section.completed_steps / section.total_steps) : 0;
  const config = sectionConfig[section.order_number as keyof typeof sectionConfig];
  const displayTitle = config?.title || section.title;
  const IconComponent = config?.icon;

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={cn(
        "w-full p-4 rounded-xl transition-all duration-300",
        "border-2 backdrop-blur-sm relative",
        isActive ? "border-white bg-white text-[#0088cc] shadow-xl" : 
        isCompleted ? "border-white/20 bg-white/10 text-white/80" : 
        "border-transparent hover:border-white/30 hover:bg-white/5"
      )}
    >
      <div className="flex items-start gap-3">
        {/* Animated progress ring */}
        <div className="relative">
          <svg className="w-12 h-12 -rotate-90">
            <circle
              cx="24"
              cy="24"
              r="20"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
              opacity="0.2"
            />
            <circle
              cx="24"
              cy="24"
              r="20"
              stroke={isCompleted ? "#10b981" : "currentColor"}
              strokeWidth="4"
              fill="none"
              strokeDasharray={`${2 * Math.PI * 20}`}
              strokeDashoffset={`${2 * Math.PI * 20 * (1 - progress)}`}
              className="transition-all duration-500"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            {isCompleted ? (
              <CheckCircle className="w-6 h-6 text-green-500" strokeWidth={2} />
            ) : IconComponent ? (
              <IconComponent 
                className="w-6 h-6" 
                style={{ color: config?.iconColor || 'currentColor' }} 
                strokeWidth={2}
              />
            ) : (
              <span className="text-lg">{section.emoji || section.order_number}</span>
            )}
          </div>
        </div>
        
        <div className="flex-1 text-left">
          <h3 className={cn(
            "font-semibold text-sm",
            isCompleted && !isActive && "line-through opacity-70"
          )}>
            {displayTitle}
          </h3>
          <p className="text-xs opacity-75 mt-1">
            {section.completed_steps}/{section.total_steps} steps • {section.estimated_time_minutes || 0} min
          </p>
          {section.deadline_days && !isCompleted && (
            <p className="text-xs text-yellow-300 mt-1 flex items-center gap-1">
              <Clock className="w-3 h-3" />
              Due in {section.deadline_days} days
            </p>
          )}
        </div>
      </div>
      
      {/* Completion celebration animation */}
      {isCompleted && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute -top-2 -right-2 bg-green-500 text-white rounded-full p-1"
        >
          <CheckCircle className="w-4 h-4" strokeWidth={2} />
        </motion.div>
      )}
    </motion.button>
  );
};
