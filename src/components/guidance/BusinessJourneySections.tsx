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
  ChevronRight
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
    <div className="space-y-8">
      {/* Journey Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Your Business Setup Journey</h2>
        <p className="text-gray-600">Follow the steps below in order to build your business foundation</p>
      </div>

      {/* Journey Flow with Arrows */}
      <div className="relative">
        {/* Desktop Arrow Flow */}
        <div className="hidden lg:block">
          <div className="grid grid-cols-3 gap-8 mb-8">
            {businessSections.slice(0, 6).map((section, index) => {
              const status = getSectionStatus(section);
              const IconComponent = section.icon;
              const isLastInRow = (index + 1) % 3 === 0;
              
              return (
                <div key={section.id} className="relative">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card 
                      className={cn(
                        "relative overflow-hidden transition-all duration-200 hover:shadow-lg cursor-pointer h-full",
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
                          {status.progress > 0 && (
                            <div className="space-y-2">
                              <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Progress</span>
                                <span className="font-medium">{Math.round(status.progress)}%</span>
                              </div>
                              <Progress value={status.progress} className="h-2" />
                            </div>
                          )}
                          
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

                  {/* Right Arrow (except for last item in row) */}
                  {!isLastInRow && index < 5 && (
                    <div className="absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center shadow-lg">
                        <ChevronRight className="w-5 h-5 text-white" strokeWidth={2} />
                      </div>
                    </div>
                  )}

                  {/* Down Arrow (for end of first row) */}
                  {index === 2 && (
                    <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 z-10">
                      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center shadow-lg rotate-90">
                        <ChevronRight className="w-5 h-5 text-white" strokeWidth={2} />
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Second Row - Left to Right with proper arrows */}
          <div className="grid grid-cols-3 gap-8 relative">
            {businessSections.slice(6).map((section, index) => {
              const status = getSectionStatus(section);
              const IconComponent = section.icon;
              const actualIndex = index + 6;
              const isLastSection = actualIndex === businessSections.length - 1;
              
              return (
                <div key={section.id} className="relative">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: actualIndex * 0.1 }}
                  >
                    <Card 
                      className={cn(
                        "relative overflow-hidden transition-all duration-200 hover:shadow-lg cursor-pointer h-full",
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
                          {status.progress > 0 && (
                            <div className="space-y-2">
                              <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Progress</span>
                                <span className="font-medium">{Math.round(status.progress)}%</span>
                              </div>
                              <Progress value={status.progress} className="h-2" />
                            </div>
                          )}
                          
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

                  {/* Right Arrow for second row (left to right flow) */}
                  {index < 2 && (
                    <div className="absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center shadow-lg">
                        <ChevronRight className="w-5 h-5 text-white" strokeWidth={2} />
                      </div>
                    </div>
                  )}

                  {/* Bottom line for the last section */}
                  {isLastSection && (
                    <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-full h-1 bg-gradient-to-r from-transparent via-blue-300 to-transparent"></div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Mobile/Tablet - Simple Grid */}
        <div className="lg:hidden grid grid-cols-1 md:grid-cols-2 gap-6">
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
                      {status.progress > 0 && (
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Progress</span>
                            <span className="font-medium">{Math.round(status.progress)}%</span>
                          </div>
                          <Progress value={status.progress} className="h-2" />
                        </div>
                      )}
                      
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
      </div>
    </div>
  );
};
