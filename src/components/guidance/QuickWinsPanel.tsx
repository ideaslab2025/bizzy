
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Zap, Clock, ChevronRight } from 'lucide-react';
import type { EnhancedGuidanceStep } from '@/types/guidance';

interface QuickWinsPanelProps {
  quickWins: Array<EnhancedGuidanceStep & { section_title: string }>;
  onNavigateToStep: (sectionId: number, stepNumber: number) => void;
}

export const QuickWinsPanel: React.FC<QuickWinsPanelProps> = ({
  quickWins,
  onNavigateToStep
}) => {
  if (quickWins.length === 0) return null;

  return (
    <Card className="border-green-200 bg-green-50 mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-green-800">
          <Zap className="w-5 h-5" />
          Quick Wins - Complete These Now!
          <Badge variant="secondary" className="ml-auto">
            {quickWins.length} available
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {quickWins.slice(0, 3).map((task) => (
            <Button
              key={task.id}
              variant="outline"
              className="w-full justify-start gap-3 hover:bg-green-100 h-auto p-4"
              onClick={() => onNavigateToStep(task.section_id, task.order_number)}
            >
              <Clock className="w-4 h-4 text-green-600 flex-shrink-0" />
              <div className="flex-1 text-left">
                <div className="font-medium">{task.title}</div>
                <div className="text-sm text-gray-600">{task.section_title}</div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">{task.estimated_time_minutes || 15} min</span>
                <ChevronRight className="w-4 h-4" />
              </div>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
