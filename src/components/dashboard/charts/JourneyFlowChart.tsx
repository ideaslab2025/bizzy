
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Users, Clock } from 'lucide-react';
import { JourneyStepData } from '@/hooks/useDashboardAnalytics';

interface JourneyFlowChartProps {
  steps: JourneyStepData[];
  title?: string;
}

export const JourneyFlowChart: React.FC<JourneyFlowChartProps> = ({
  steps,
  title = "Customer Journey Flow"
}) => {
  const [selectedStep, setSelectedStep] = useState<JourneyStepData | null>(null);

  const getCompletionColor = (rate: number) => {
    if (rate >= 80) return 'text-green-600 bg-green-100';
    if (rate >= 60) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getDropoffSeverity = (rate: number) => {
    if (rate > 30) return { icon: TrendingDown, color: 'text-red-500', severity: 'High' };
    if (rate > 15) return { icon: TrendingDown, color: 'text-yellow-500', severity: 'Medium' };
    return { icon: TrendingUp, color: 'text-green-500', severity: 'Low' };
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="w-5 h-5" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Flow visualization */}
          <div className="relative">
            {steps.map((step, index) => {
              const dropoff = getDropoffSeverity(step.dropoffRate);
              const DropoffIcon = dropoff.icon;
              
              return (
                <div key={step.stepId} className="relative">
                  {/* Connection line */}
                  {index < steps.length - 1 && (
                    <div className="absolute left-6 top-12 w-0.5 h-8 bg-gray-300 z-0" />
                  )}
                  
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`relative z-10 p-4 rounded-lg border cursor-pointer transition-all hover:shadow-md ${
                      selectedStep?.stepId === step.stepId
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}
                    onClick={() => setSelectedStep(selectedStep?.stepId === step.stepId ? null : step)}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${
                          step.completed ? 'bg-green-500' : 'bg-gray-300'
                        }`} />
                        <h4 className="font-medium text-gray-900">{step.title}</h4>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getCompletionColor(step.completionRate)}>
                          {Math.round(step.completionRate)}%
                        </Badge>
                        <DropoffIcon className={`w-4 h-4 ${dropoff.color}`} />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>Completion Rate</span>
                        <span>{Math.round(step.completionRate)}%</span>
                      </div>
                      <Progress value={step.completionRate} className="h-2" />
                      
                      {selectedStep?.stepId === step.stepId && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          className="mt-4 pt-4 border-t border-gray-200 space-y-3"
                        >
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4 text-gray-400" />
                              <span className="text-gray-600">Avg. Time:</span>
                              <span className="font-medium">{step.averageTime}m</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <TrendingDown className="w-4 h-4 text-gray-400" />
                              <span className="text-gray-600">Drop-off:</span>
                              <span className={`font-medium ${dropoff.color}`}>
                                {Math.round(step.dropoffRate)}%
                              </span>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-600">Drop-off Severity:</span>
                            <Badge variant="outline" className={dropoff.color}>
                              {dropoff.severity}
                            </Badge>
                          </div>
                        </motion.div>
                      )}
                    </div>
                  </motion.div>
                </div>
              );
            })}
          </div>
          
          {/* Summary stats */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h5 className="font-medium text-gray-900 mb-2">Journey Insights</h5>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Avg. Completion:</span>
                <span className="ml-2 font-medium">
                  {Math.round(steps.reduce((acc, step) => acc + step.completionRate, 0) / steps.length)}%
                </span>
              </div>
              <div>
                <span className="text-gray-600">High Drop-off Steps:</span>
                <span className="ml-2 font-medium text-red-600">
                  {steps.filter(step => step.dropoffRate > 30).length}
                </span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
