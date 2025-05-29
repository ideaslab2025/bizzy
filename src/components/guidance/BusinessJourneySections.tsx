
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { motion } from 'framer-motion';
import { 
  CheckCircle, 
  Clock, 
  ArrowRight,
  Shield,
  Umbrella,
  TrendingUp,
  Monitor,
  Briefcase
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Section {
  id: number;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  color: string;
  bgColor: string;
  borderColor: string;
  estimatedTime: string;
  deadline?: string;
  progress: number;
  isCompleted: boolean;
  subcategories: string[];
}

interface BusinessJourneySectionsProps {
  onSectionClick: (sectionId: number) => void;
  sectionsProgress: Record<number, number>;
}

const businessSections: Section[] = [
  {
    id: 1,
    title: "Foundation",
    description: "Business structure and legal setup",
    icon: CheckCircle,
    color: "blue",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
    estimatedTime: "2-3 hours",
    deadline: "Week 1",
    progress: 0,
    isCompleted: false,
    subcategories: ["Business structure", "Company registration", "Legal requirements"]
  },
  {
    id: 2,
    title: "Compliance",
    description: "Tax registration and regulatory compliance",
    icon: CheckCircle,
    color: "green",
    bgColor: "bg-green-50",
    borderColor: "border-green-200",
    estimatedTime: "1-2 hours",
    deadline: "Week 2",
    progress: 0,
    isCompleted: false,
    subcategories: ["HMRC registration", "VAT setup", "Tax obligations"]
  },
  {
    id: 3,
    title: "Banking",
    description: "Business banking and financial setup",
    icon: CheckCircle,
    color: "purple",
    bgColor: "bg-purple-50",
    borderColor: "border-purple-200",
    estimatedTime: "1 hour",
    deadline: "Week 2",
    progress: 0,
    isCompleted: false,
    subcategories: ["Business bank account", "Payment processing", "Financial planning"]
  },
  {
    id: 4,
    title: "Operations",
    description: "Day-to-day business operations setup",
    icon: CheckCircle,
    color: "orange",
    bgColor: "bg-orange-50",
    borderColor: "border-orange-200",
    estimatedTime: "2 hours",
    deadline: "Week 3",
    progress: 0,
    isCompleted: false,
    subcategories: ["Workplace setup", "Equipment", "Operational procedures"]
  },
  {
    id: 5,
    title: "Employment",
    description: "HR setup and employment considerations",
    icon: CheckCircle,
    color: "indigo",
    bgColor: "bg-indigo-50",
    borderColor: "border-indigo-200",
    estimatedTime: "1-2 hours",
    deadline: "As needed",
    progress: 0,
    isCompleted: false,
    subcategories: ["Employment law", "Payroll setup", "HR policies"]
  },
  {
    id: 6,
    title: "Data Protection & GDPR",
    description: "Privacy policies and data handling compliance",
    icon: Shield,
    color: "purple",
    bgColor: "bg-purple-50",
    borderColor: "border-purple-200",
    estimatedTime: "2-3 hours",
    deadline: "Week 4",
    progress: 0,
    isCompleted: false,
    subcategories: ["ICO registration", "Privacy policies", "Data handling procedures"]
  },
  {
    id: 7,
    title: "Insurance & Risk Management",
    description: "Business protection and liability coverage",
    icon: Umbrella,
    color: "orange",
    bgColor: "bg-orange-50",
    borderColor: "border-orange-200",
    estimatedTime: "1-2 hours",
    deadline: "Week 4",
    progress: 0,
    isCompleted: false,
    subcategories: ["Employers' liability", "Public liability", "Professional indemnity"]
  },
  {
    id: 8,
    title: "Business Growth & Scaling",
    description: "Expansion planning and investment readiness",
    icon: TrendingUp,
    color: "green",
    bgColor: "bg-green-50",
    borderColor: "border-green-200",
    estimatedTime: "3-4 hours",
    deadline: "Month 2-3",
    progress: 0,
    isCompleted: false,
    subcategories: ["Hiring plans", "Business expansion", "Investment readiness"]
  },
  {
    id: 9,
    title: "Technology & Systems",
    description: "Digital infrastructure and cybersecurity",
    icon: Monitor,
    color: "blue",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
    estimatedTime: "2-3 hours",
    deadline: "Month 2",
    progress: 0,
    isCompleted: false,
    subcategories: ["Software setup", "Digital tools", "Cybersecurity measures"]
  },
  {
    id: 10,
    title: "Sector-Specific Requirements",
    description: "Industry licenses and specialized compliance",
    icon: Briefcase,
    color: "indigo",
    bgColor: "bg-indigo-50",
    borderColor: "border-indigo-200",
    estimatedTime: "Variable",
    deadline: "As required",
    progress: 0,
    isCompleted: false,
    subcategories: ["Industry licenses", "Professional registrations", "Special compliance"]
  }
];

export const BusinessJourneySections: React.FC<BusinessJourneySectionsProps> = ({
  onSectionClick,
  sectionsProgress
}) => {
  const getSectionStatus = (section: Section) => {
    const progress = sectionsProgress[section.id] || 0;
    const isCompleted = progress >= 100;
    const isInProgress = progress > 0 && progress < 100;
    
    return {
      isCompleted,
      isInProgress,
      progress,
      buttonText: isCompleted ? 'Completed' : isInProgress ? 'Continue' : 'Start'
    };
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {businessSections.map((section, index) => {
        const status = getSectionStatus(section);
        const IconComponent = section.icon;
        
        return (
          <motion.div
            key={section.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card 
              className={cn(
                "relative overflow-hidden transition-all duration-200 hover:shadow-lg cursor-pointer",
                section.borderColor,
                section.bgColor
              )}
              onClick={() => onSectionClick(section.id)}
            >
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "w-10 h-10 rounded-lg flex items-center justify-center",
                      status.isCompleted ? "bg-green-100 text-green-600" : 
                      status.isInProgress ? `bg-${section.color}-100 text-${section.color}-600` :
                      "bg-gray-100 text-gray-500"
                    )}>
                      {status.isCompleted ? (
                        <CheckCircle className="w-5 h-5" />
                      ) : (
                        <IconComponent className="w-5 h-5" />
                      )}
                    </div>
                    <div>
                      <CardTitle className="text-lg font-semibold text-gray-900">
                        {section.title}
                      </CardTitle>
                      <p className="text-sm text-gray-600 mt-1">
                        {section.description}
                      </p>
                    </div>
                  </div>
                  
                  {status.isCompleted && (
                    <Badge variant="secondary" className="bg-green-100 text-green-700">
                      Complete
                    </Badge>
                  )}
                </div>
              </CardHeader>
              
              <CardContent className="pt-0">
                <div className="space-y-4">
                  {/* Progress */}
                  {status.progress > 0 && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Progress</span>
                        <span className="font-medium">{Math.round(status.progress)}%</span>
                      </div>
                      <Progress value={status.progress} className="h-2" />
                    </div>
                  )}
                  
                  {/* Subcategories */}
                  <div className="space-y-2">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                      Key Areas
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {section.subcategories.map((category, idx) => (
                        <Badge 
                          key={idx}
                          variant="outline" 
                          className="text-xs bg-white/50"
                        >
                          {category}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  {/* Timeline */}
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{section.estimatedTime}</span>
                    </div>
                    {section.deadline && (
                      <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                        {section.deadline}
                      </span>
                    )}
                  </div>
                  
                  {/* Action Button */}
                  <Button 
                    className={cn(
                      "w-full mt-4",
                      status.isCompleted 
                        ? "bg-green-600 hover:bg-green-700" 
                        : `bg-${section.color}-600 hover:bg-${section.color}-700`
                    )}
                    disabled={status.isCompleted}
                  >
                    {status.buttonText}
                    {!status.isCompleted && <ArrowRight className="w-4 h-4 ml-2" />}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
};
