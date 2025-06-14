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
  ChevronRight,
  ArrowDown,
  Flag
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
    console.log(`Section ${section.id} (${section.title}) progress from props:`, progress);
    
    // Enhanced fallback - check for both completion and progress in localStorage
    const isCompletedInStorage = localStorage.getItem(`bizzy_section_${section.id}_complete`) === 'true';
    const storedProgress = localStorage.getItem(`bizzy_section_${section.id}_progress`);
    const progressFromStorage = storedProgress ? parseInt(storedProgress, 10) : 0;
    
    console.log(`Section ${section.id} (${section.title}) localStorage complete:`, isCompletedInStorage);
    console.log(`Section ${section.id} (${section.title}) localStorage progress:`, progressFromStorage);
    
    // Use the highest value between props and localStorage
    let finalProgress = Math.max(progress, progressFromStorage);
    if (isCompletedInStorage && finalProgress < 100) {
      finalProgress = 100;
    }
    
    console.log(`Section ${section.id} (${section.title}) final progress:`, finalProgress);
    
    const isCompleted = finalProgress >= 100;
    const isInProgress = finalProgress > 0 && finalProgress < 100;
    
    return {
      isCompleted,
      isInProgress,
      progress: finalProgress,
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

      {/* Journey Flow */}
      <div className="relative">
        {/* Desktop Layout */}
        <div className="hidden lg:block">
          {/* First Row - Left to Right */}
          <div className="grid grid-cols-3 gap-8 mb-16 relative">
            {businessSections.slice(0, 3).map((section, index) => {
              const status = getSectionStatus(section);
              const IconComponent = section.icon;
              
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
                          {/* ALWAYS show progress bar for ALL sections including Sector-Specific Requirements */}
                          <div className="space-y-2 bg-gray-50 p-3 rounded-lg border">
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600 font-medium">Progress</span>
                              <span className="font-semibold text-gray-900">{Math.round(status.progress)}%</span>
                            </div>
                            <div className="relative">
                              <Progress value={status.progress} className="h-3 bg-gray-200 border border-gray-300" />
                              <div className="absolute inset-0 rounded-full border border-gray-300 pointer-events-none"></div>
                            </div>
                            <div className="flex justify-between text-xs text-gray-600">
                              <span className="font-medium">{Math.floor(status.progress / 10)}/{section.subcategories.length} tasks completed</span>
                              <span>Est. time: {section.estimatedTime}</span>
                            </div>
                          </div>
                          
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
                  {index < 2 && (
                    <div className="absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center shadow-lg">
                        <ChevronRight className="w-5 h-5 text-white" strokeWidth={2} />
                      </div>
                    </div>
                  )}
                </div>
              );
            })}

            {/* Down Arrow at the end of first row */}
            <div className="absolute -bottom-8 right-1/3 transform translate-x-1/2 z-10">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center shadow-lg">
                <ArrowDown className="w-5 h-5 text-white" strokeWidth={2} />
              </div>
            </div>
          </div>

          {/* Curved Connection Line from Row 1 to Row 2 - FIXED POSITIONING */}
          <div className="absolute top-80 right-32 w-40 h-32 pointer-events-none z-5">
            <svg width="160" height="128" className="overflow-visible">
              <path 
                d="M 10,0 Q 80,40 150,128" 
                stroke="#3B82F6" 
                strokeWidth="3" 
                fill="none"
                strokeDasharray="6,6"
                opacity="0.6" 
              />
            </svg>
          </div>

          {/* Second Row - Right to Left */}
          <div className="grid grid-cols-3 gap-8 mb-16 relative">
            {businessSections.slice(3, 6).reverse().map((section, reverseIndex) => {
              const status = getSectionStatus(section);
              const IconComponent = section.icon;
              const index = 2 - reverseIndex;
              
              return (
                <div key={section.id} className="relative">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: (index + 3) * 0.1 }}
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
                          {/* ALWAYS show progress bar for ALL sections including Sector-Specific Requirements */}
                          <div className="space-y-2 bg-gray-50 p-3 rounded-lg border">
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600 font-medium">Progress</span>
                              <span className="font-semibold text-gray-900">{Math.round(status.progress)}%</span>
                            </div>
                            <div className="relative">
                              <Progress value={status.progress} className="h-3 bg-gray-200 border border-gray-300" />
                              <div className="absolute inset-0 rounded-full border border-gray-300 pointer-events-none"></div>
                            </div>
                            <div className="flex justify-between text-xs text-gray-600">
                              <span className="font-medium">{Math.floor(status.progress / 10)}/{section.subcategories.length} tasks completed</span>
                              <span>Est. time: {section.estimatedTime}</span>
                            </div>
                          </div>
                          
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

                  {/* Left Arrow (except for first item in reverse order) */}
                  {reverseIndex < 2 && (
                    <div className="absolute top-1/2 -left-4 transform -translate-y-1/2 z-10">
                      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center shadow-lg rotate-180">
                        <ChevronRight className="w-5 h-5 text-white" strokeWidth={2} />
                      </div>
                    </div>
                  )}
                </div>
              );
            })}

            {/* Down Arrow at the end of second row */}
            <div className="absolute -bottom-8 left-1/3 transform -translate-x-1/2 z-10">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center shadow-lg">
                <ArrowDown className="w-5 h-5 text-white" strokeWidth={2} />
              </div>
            </div>
          </div>

          {/* Curved Connection Line from Row 2 to Row 3 - FIXED POSITIONING */}
          <div className="absolute bottom-80 left-32 w-40 h-32 pointer-events-none z-5">
            <svg width="160" height="128" className="overflow-visible">
              <path 
                d="M 150,0 Q 80,40 10,128" 
                stroke="#3B82F6" 
                strokeWidth="3" 
                fill="none"
                strokeDasharray="6,6"
                opacity="0.6" 
              />
            </svg>
          </div>

          {/* Third Row - Left to Right */}
          <div className="grid grid-cols-3 gap-8 relative">
            {businessSections.slice(6).map((section, index) => {
              const status = getSectionStatus(section);
              const IconComponent = section.icon;
              const actualIndex = index + 6;
              const isLastSection = section.id === 10; // Explicitly check for section 10
              
              console.log(`Section ${section.id} (${section.title}) is last section:`, isLastSection); // Debug
              
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
                          {/* FORCE DISPLAY progress bar for ALL sections including Sector-Specific Requirements (section 10) */}
                          <div className="space-y-2 bg-gray-50 p-3 rounded-lg border">
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600 font-medium">Progress</span>
                              <span className="font-semibold text-gray-900">{Math.round(status.progress)}%</span>
                            </div>
                            <div className="relative">
                              <Progress value={status.progress} className="h-3 bg-gray-200 border border-gray-300" />
                              <div className="absolute inset-0 rounded-full border border-gray-300 pointer-events-none"></div>
                            </div>
                            <div className="flex justify-between text-xs text-gray-600">
                              <span className="font-medium">{Math.floor(status.progress / 10)}/{section.subcategories.length} tasks completed</span>
                              <span>Est. time: {section.estimatedTime}</span>
                            </div>
                          </div>
                          
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

                  {/* Right Arrow for third row (except for last section) */}
                  {!isLastSection && (
                    <div className="absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center shadow-lg">
                        <ChevronRight className="w-5 h-5 text-white" strokeWidth={2} />
                      </div>
                    </div>
                  )}

                  {/* FIXED: Completion line under last section (Section 10) */}
                  {isLastSection && (
                    <div className="absolute -bottom-8 left-0 right-0 flex flex-col items-center z-10">
                      <div className="w-full h-2 bg-gradient-to-r from-blue-400 via-purple-500 to-green-500 rounded-full shadow-md"></div>
                      <div className="mt-3 flex items-center gap-2 text-green-600">
                        <Flag className="w-5 h-5" strokeWidth={2} />
                        <span className="text-sm font-bold">Journey Complete!</span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Bottom completion line spanning the full width */}
          <div className="mt-12 w-full h-1 bg-gradient-to-r from-blue-300 via-blue-500 to-blue-300 rounded-full"></div>
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
                      {/* ALWAYS show progress bar for mobile/tablet view too */}
                      <div className="space-y-2 bg-gray-50 p-3 rounded-lg border">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600 font-medium">Progress</span>
                          <span className="font-semibold text-gray-900">{Math.round(status.progress)}%</span>
                        </div>
                        <div className="relative">
                          <Progress value={status.progress} className="h-3 bg-gray-200 border border-gray-300" />
                          <div className="absolute inset-0 rounded-full border border-gray-300 pointer-events-none"></div>
                        </div>
                        <div className="flex justify-between text-xs text-gray-600">
                          <span className="font-medium">{Math.floor(status.progress / 10)}/{section.subcategories.length} tasks completed</span>
                          <span>Est. time: {section.estimatedTime}</span>
                        </div>
                      </div>
                      
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
