
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Calendar, Clock, AlertTriangle, CheckCircle } from 'lucide-react';
import { TimelineEvent } from '@/hooks/useDashboardAnalytics';

interface InteractiveTimelineProps {
  events: TimelineEvent[];
  title?: string;
}

export const InteractiveTimeline: React.FC<InteractiveTimelineProps> = ({
  events,
  title = "Business Setup Timeline"
}) => {
  const [selectedEvent, setSelectedEvent] = useState<TimelineEvent | null>(null);
  const [filter, setFilter] = useState<'all' | 'deadline' | 'milestone' | 'completed'>('all');

  const filteredEvents = events.filter(event => 
    filter === 'all' || event.type === filter
  ).sort((a, b) => a.date.getTime() - b.date.getTime());

  const getEventIcon = (type: TimelineEvent['type']) => {
    switch (type) {
      case 'deadline':
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case 'milestone':
        return <Calendar className="w-4 h-4 text-blue-500" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getPriorityColor = (priority: TimelineEvent['priority']) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const getDaysUntil = (date: Date) => {
    const today = new Date();
    const diffTime = date.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            {title}
          </CardTitle>
          <div className="flex gap-2">
            <Button
              variant={filter === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('all')}
            >
              All
            </Button>
            <Button
              variant={filter === 'deadline' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('deadline')}
            >
              Deadlines
            </Button>
            <Button
              variant={filter === 'milestone' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('milestone')}
            >
              Milestones
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 max-h-64 overflow-y-auto">
          {filteredEvents.map((event, index) => {
            const daysUntil = getDaysUntil(event.date);
            const isOverdue = daysUntil < 0;
            const isUpcoming = daysUntil <= 7 && daysUntil >= 0;
            
            return (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`p-4 rounded-lg border cursor-pointer transition-all hover:shadow-md ${
                  selectedEvent?.id === event.id 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setSelectedEvent(selectedEvent?.id === event.id ? null : event)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    {getEventIcon(event.type)}
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{event.title}</h4>
                      <p className="text-sm text-gray-600 mt-1">
                        {formatDate(event.date)}
                      </p>
                      {selectedEvent?.id === event.id && event.description && (
                        <p className="text-sm text-gray-700 mt-2">
                          {event.description}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <Badge className={getPriorityColor(event.priority)}>
                      {event.priority}
                    </Badge>
                    {isOverdue && (
                      <span className="text-xs text-red-600 font-medium">
                        {Math.abs(daysUntil)} days overdue
                      </span>
                    )}
                    {isUpcoming && (
                      <span className="text-xs text-orange-600 font-medium">
                        {daysUntil} days left
                      </span>
                    )}
                    {!isOverdue && !isUpcoming && daysUntil > 0 && (
                      <span className="text-xs text-gray-500">
                        {daysUntil} days
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
