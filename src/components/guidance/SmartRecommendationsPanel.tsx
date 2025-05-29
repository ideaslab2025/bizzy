
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Brain, 
  Clock, 
  AlertTriangle, 
  Zap, 
  TrendingUp,
  ChevronRight,
  Target
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSmartRecommendations } from '@/hooks/useSmartRecommendations';

interface SmartRecommendationsPanelProps {
  userId: string;
  completedStepIds: number[];
  currentSectionCategory: string;
  companyAge: number;
  onNavigateToStep: (sectionId: number, stepNumber: number) => void;
}

export const SmartRecommendationsPanel: React.FC<SmartRecommendationsPanelProps> = ({
  userId,
  completedStepIds,
  currentSectionCategory,
  companyAge,
  onNavigateToStep
}) => {
  const { 
    recommendations, 
    isLoading, 
    error, 
    getTopRecommendations 
  } = useSmartRecommendations(
    userId, 
    completedStepIds, 
    currentSectionCategory, 
    companyAge
  );

  if (isLoading) {
    return (
      <Card className="border-blue-200 bg-blue-50">
        <CardContent className="p-6">
          <div className="flex items-center gap-3">
            <Brain className="w-5 h-5 animate-pulse text-blue-600" />
            <span className="text-blue-800">Analyzing your progress...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Show a more helpful message instead of error for missing recommendations
  if (error || !recommendations) {
    return (
      <Card className="border-green-200 bg-green-50">
        <CardContent className="p-6">
          <div className="flex items-center gap-3">
            <Target className="w-5 h-5 text-green-600" />
            <span className="text-green-800">Great job! Continue with your current progress.</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  const topRecommendations = getTopRecommendations(3);
  const hasRecommendations = topRecommendations.length > 0;

  if (!hasRecommendations) {
    return (
      <Card className="border-green-200 bg-green-50">
        <CardContent className="p-6">
          <div className="flex items-center gap-3">
            <Target className="w-5 h-5 text-green-600" />
            <span className="text-green-800">Great job! You're on track with your business setup.</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Main Recommendations */}
      <Card className="border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-800">
            <Brain className="w-5 h-5" />
            Smart Recommendations
            <Badge variant="secondary" className="ml-auto">
              {topRecommendations.length} suggested
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {topRecommendations.map((rec, index) => (
              <motion.div
                key={rec.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Button
                  variant="outline"
                  className="w-full justify-start gap-3 hover:bg-blue-100 h-auto p-4"
                  onClick={() => onNavigateToStep(rec.section_id, rec.order_number)}
                >
                  <div className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0",
                    rec.deadline_days && rec.deadline_days <= 7 ? "bg-red-100" :
                    rec.quick_win ? "bg-green-100" : "bg-blue-100"
                  )}>
                    {rec.deadline_days && rec.deadline_days <= 7 ? (
                      <AlertTriangle className="w-4 h-4 text-red-600" />
                    ) : rec.quick_win ? (
                      <Zap className="w-4 h-4 text-green-600" />
                    ) : (
                      <TrendingUp className="w-4 h-4 text-blue-600" />
                    )}
                  </div>
                  
                  <div className="flex-1 text-left">
                    <div className="font-medium">{rec.title}</div>
                    <div className="text-sm text-gray-600 flex items-center gap-2 mt-1">
                      <span>{rec.section_title}</span>
                      {rec.deadline_days && rec.deadline_days <= 7 && (
                        <Badge variant="destructive" className="text-xs">
                          Due in {rec.deadline_days}d
                        </Badge>
                      )}
                      {rec.quick_win && (
                        <Badge variant="secondary" className="text-xs bg-green-100 text-green-700">
                          Quick Win
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                      <Clock className="w-3 h-3" />
                      {rec.estimated_time_minutes}m
                    </div>
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </Button>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Category-specific recommendations */}
      {recommendations.urgent && recommendations.urgent.length > 0 && (
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-800">
              <AlertTriangle className="w-5 h-5" />
              Urgent Actions
              <Badge variant="destructive" className="ml-auto">
                {recommendations.urgent.length}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {recommendations.urgent.slice(0, 2).map((urgent) => (
                <Button
                  key={urgent.id}
                  variant="outline"
                  size="sm"
                  className="w-full justify-start gap-2 hover:bg-red-100"
                  onClick={() => onNavigateToStep(urgent.section_id, urgent.order_number)}
                >
                  <span className="flex-1 text-left truncate">{urgent.title}</span>
                  <span className="text-xs text-red-600">
                    {urgent.deadline_days}d left
                  </span>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {recommendations.quickWins && recommendations.quickWins.length > 0 && (
        <Card className="border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-800">
              <Zap className="w-5 h-5" />
              Quick Wins
              <Badge variant="secondary" className="ml-auto bg-green-100 text-green-700">
                {recommendations.quickWins.length}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {recommendations.quickWins.slice(0, 3).map((quickWin) => (
                <Button
                  key={quickWin.id}
                  variant="outline"
                  size="sm"
                  className="w-full justify-start gap-2 hover:bg-green-100"
                  onClick={() => onNavigateToStep(quickWin.section_id, quickWin.order_number)}
                >
                  <span className="flex-1 text-left truncate">{quickWin.title}</span>
                  <span className="text-xs text-green-600">
                    {quickWin.estimated_time_minutes}m
                  </span>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
