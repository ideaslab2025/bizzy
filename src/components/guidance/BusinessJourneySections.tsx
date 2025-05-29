
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { motion } from 'framer-motion';
import { 
  CheckCircle, 
  Clock, 
  ArrowRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { businessSections, BusinessSection } from '@/data/businessSections';

interface BusinessJourneySectionsProps {
  onSectionClick: (sectionId: number) => void;
  sectionsProgress: Record<number, number>;
}

export const BusinessJourneySections: React.FC<BusinessJourneySectionsProps> = ({
  onSectionClick,
  sectionsProgress
}) => {
  const getSectionStatus = (section: BusinessSection) => {
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
                      status.isCompleted ? "bg-green-100" : section.bgColor
                    )}>
                      {status.isCompleted ? (
                        <CheckCircle className="w-6 h-6 text-green-600" strokeWidth={2} />
                      ) : (
                        <IconComponent className={cn("w-6 h-6", section.iconColor)} strokeWidth={2} />
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
                      <Clock className="w-4 h-4" strokeWidth={2} />
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
                        : "bg-blue-600 hover:bg-blue-700"
                    )}
                    disabled={status.isCompleted}
                  >
                    {status.buttonText}
                    {!status.isCompleted && <ArrowRight className="w-4 h-4 ml-2" strokeWidth={2} />}
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
