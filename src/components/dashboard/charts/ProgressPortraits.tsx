
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useProgress } from '@/contexts/ProgressContext';
import { 
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
  const navigate = useNavigate();
  const { categoryProgress } = useProgress();

  const complianceCategories = [
    {
      id: "company-setup",
      title: "Company Set-Up",
      icon: Building2,
      iconColor: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      id: "tax-vat", 
      title: "Tax and VAT",
      icon: Calculator,
      iconColor: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      id: "employment",
      title: "Employment",
      icon: Users, 
      iconColor: "text-orange-600",
      bgColor: "bg-orange-50",
    },
    {
      id: "legal-compliance",
      title: "Legal Compliance",
      icon: Scale,
      iconColor: "text-red-600", 
      bgColor: "bg-red-50",
    },
    {
      id: "finance",
      title: "Finance",
      icon: Banknote,
      iconColor: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      id: "data-protection",
      title: "Data Protection",
      icon: Shield,
      iconColor: "text-indigo-600",
      bgColor: "bg-indigo-50",
    }
  ];

  const handleCategoryClick = (categoryId: string) => {
    navigate(`/dashboard/documents?category=${categoryId}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={cn("space-y-6", className)}
    >
      <Card className="bg-white shadow-lg border border-gray-200">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl font-bold text-gray-900">
            Progress Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {complianceCategories.map((category, index) => {
              const IconComponent = category.icon;
              const progress = categoryProgress.find(p => p.categoryId === category.id);
              const percentage = progress?.percentage || 0;
              
              return (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="group flex flex-col items-center p-4 rounded-lg border border-gray-200 hover:shadow-md hover:border-blue-300 transition-all duration-200 cursor-pointer transform hover:scale-105"
                  onClick={() => handleCategoryClick(category.id)}
                >
                  <div className={cn(
                    "w-12 h-12 rounded-full flex items-center justify-center mb-3 group-hover:shadow-md transition-shadow",
                    category.bgColor
                  )}>
                    <IconComponent className={cn("w-6 h-6", category.iconColor)} strokeWidth={2} />
                  </div>
                  <h4 className="text-sm font-medium text-center text-gray-900 mb-2 leading-tight group-hover:text-blue-600 transition-colors">
                    {category.title}
                  </h4>
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                    <motion.div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-500" 
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      transition={{ duration: 0.8, delay: index * 0.1 }}
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-600 font-medium">
                      {percentage}%
                    </span>
                    <ChevronRight className="w-3 h-3 text-gray-400 group-hover:text-blue-600 transition-colors" />
                  </div>
                  
                  {/* Completion info */}
                  {progress && (
                    <div className="text-xs text-gray-500 mt-1">
                      {progress.completed}/{progress.total} docs
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
