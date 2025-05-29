
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { 
  Lightbulb, 
  Clock, 
  ArrowRight, 
  TrendingUp,
  AlertCircle,
  RefreshCw
} from 'lucide-react';
import { useSmartRecommendations } from '@/hooks/useSmartRecommendations';
import { cn } from '@/lib/utils';

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
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  try {
    const { getTopRecommendations, loading } = useSmartRecommendations(
      userId,
      completedStepIds,
      currentSectionCategory,
      companyAge
    );

    const recommendations = getTopRecommendations(3);

    const handleRetry = () => {
      setError(null);
      setRetryCount(prev => prev + 1);
    };

    if (error) {
      return (
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 text-orange-800">
              <AlertCircle className="w-5 h-5" />
              <div className="flex-1">
                <h3 className="font-semibold">Unable to load recommendations</h3>
                <p className="text-sm text-orange-600 mt-1">
                  We're having trouble getting your personalized recommendations right now.
                </p>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleRetry}
                className="border-orange-300 text-orange-700 hover:bg-orange-100"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      );
    }

    if (loading) {
      return (
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-6">
            <div className="animate-pulse space-y-3">
              <div className="h-4 bg-blue-200 rounded w-3/4"></div>
              <div className="h-3 bg-blue-200 rounded w-1/2"></div>
              <div className="h-8 bg-blue-200 rounded"></div>
            </div>
          </CardContent>
        </Card>
      );
    }

    if (!recommendations || recommendations.length === 0) {
      return (
        <Card className="border-gray-200 bg-gray-50">
          <CardContent className="p-6">
            <div className="text-center text-gray-600">
              <Lightbulb className="w-8 h-8 mx-auto mb-2 text-gray-400" />
              <p className="font-medium">No recommendations available</p>
              <p className="text-sm">Keep working through your sections to unlock personalized suggestions!</p>
            </div>
          </CardContent>
        </Card>
      );
    }

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-blue-800">
              <TrendingUp className="w-5 h-5" />
              Smart Recommendations
              <Badge variant="secondary" className="ml-auto bg-blue-100 text-blue-800">
                {recommendations.length}
              </Badge>
            </CardTitle>
            <p className="text-sm text-blue-600">
              Personalized next steps based on your progress and business needs
            </p>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-3">
              {recommendations.map((rec, index) => (
                <motion.div
                  key={rec.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start gap-3 hover:bg-blue-100 h-auto p-4 text-left",
                      "border-blue-200 hover:border-blue-300 transition-all duration-200"
                    )}
                    onClick={() => onNavigateToStep(rec.section_id, rec.order_number)}
                  >
                    <div className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0 animate-pulse"></div>
                    <div className="flex-1">
                      <div className="font-medium text-sm mb-1">{rec.title}</div>
                      <div className="text-xs text-gray-600 flex items-center gap-3">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {rec.estimated_time_minutes}m
                        </span>
                        {rec.quick_win && (
                          <Badge variant="secondary" className="text-xs bg-green-100 text-green-700">
                            Quick Win
                          </Badge>
                        )}
                        {rec.priority_score && rec.priority_score > 8 && (
                          <Badge variant="secondary" className="text-xs bg-orange-100 text-orange-700">
                            High Priority
                          </Badge>
                        )}
                      </div>
                      {rec.reason && (
                        <div className="text-xs text-blue-600 mt-1 italic">
                          {rec.reason}
                        </div>
                      )}
                    </div>
                    <ArrowRight className="w-4 h-4 text-blue-600 flex-shrink-0" />
                  </Button>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );

  } catch (err) {
    console.error('SmartRecommendationsPanel error:', err);
    
    return (
      <Card className="border-red-200 bg-red-50">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 text-red-800">
            <AlertCircle className="w-5 h-5" />
            <div className="flex-1">
              <h3 className="font-semibold">Recommendations Unavailable</h3>
              <p className="text-sm text-red-600 mt-1">
                There was an error loading your personalized recommendations. This doesn't affect your progress tracking.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }
};
