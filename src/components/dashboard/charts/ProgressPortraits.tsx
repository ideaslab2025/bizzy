
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
  Building2,
  Calculator,
  Users,
  Scale,
  Banknote,
  Shield,
  ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProgressPortraitsProps {
  className?: string;
}

export const ProgressPortraits: React.FC<ProgressPortraitsProps> = ({ className }) => {
  // Mock progress data - in a real app this would come from your state management
  const progressData = {
    1: 0, // Company Set-Up
    2: 0, // Tax and VAT
    3: 0, // Employment
    4: 0, // Legal Compliance
    5: 0, // Finance
    6: 0, // Data Protection
  };

  const complianceCategories = [
    {
      id: 1,
      title: "Company Set-Up",
      icon: Building2,
      progress: progressData[1] || 0,
      iconColor: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      id: 2,
      title: "Tax and VAT", 
      icon: Calculator,
      progress: progressData[2] || 0,
      iconColor: "text-green-600",
      bgColor: "bg-green-50"
    },
    {
      id: 3,
      title: "Employment",
      icon: Users, 
      progress: progressData[3] || 0,
      iconColor: "text-orange-600",
      bgColor: "bg-orange-50"
    },
    {
      id: 4,
      title: "Legal Compliance",
      icon: Scale,
      progress: progressData[4] || 0,
      iconColor: "text-red-600", 
      bgColor: "bg-red-50"
    },
    {
      id: 5,
      title: "Finance",
      icon: Banknote,
      progress: progressData[5] || 0,
      iconColor: "text-purple-600",
      bgColor: "bg-purple-50"
    },
    {
      id: 6,
      title: "Data Protection",
      icon: Shield,
      progress: progressData[6] || 0,
      iconColor: "text-indigo-600",
      bgColor: "bg-indigo-50"
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={cn("space-y-6", className)}
    >
      <Card className="bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl font-bold text-gray-900 dark:text-gray-100">
            Progress Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {complianceCategories.map((category, index) => {
              const IconComponent = category.icon;
              return (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex flex-col items-center p-4 rounded-lg border border-gray-200 dark:border-gray-600 hover:shadow-md transition-all duration-200 cursor-pointer"
                >
                  <div className={cn(
                    "w-12 h-12 rounded-full flex items-center justify-center mb-3",
                    category.bgColor
                  )}>
                    <IconComponent className={cn("w-6 h-6", category.iconColor)} strokeWidth={2} />
                  </div>
                  <h4 className="text-sm font-medium text-center text-gray-900 dark:text-gray-100 mb-2 leading-tight">
                    {category.title}
                  </h4>
                  <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2 mb-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-500" 
                      style={{ width: `${category.progress}%` }}
                    ></div>
                  </div>
                  <span className="text-xs text-gray-600 dark:text-gray-400 font-medium">
                    {category.progress}%
                  </span>
                </motion.div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
