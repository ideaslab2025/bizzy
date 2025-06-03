
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { 
  Building2, 
  Users, 
  Receipt, 
  Calendar, 
  CheckCircle, 
  Clock, 
  AlertTriangle,
  TrendingUp,
  Award
} from 'lucide-react';

interface TimelineEvent {
  id: string;
  title: string;
  date: Date;
  type: 'milestone' | 'compliance' | 'deadline' | 'achievement';
  status: 'completed' | 'in-progress' | 'upcoming' | 'overdue';
  description: string;
  category: 'legal' | 'financial' | 'hr' | 'operational';
  importance: 'high' | 'medium' | 'low';
}

const mockTimelineData: TimelineEvent[] = [
  {
    id: '1',
    title: 'Company Incorporation',
    date: new Date('2024-01-15'),
    type: 'milestone',
    status: 'completed',
    description: 'Successfully incorporated with Companies House',
    category: 'legal',
    importance: 'high'
  },
  {
    id: '2',
    title: 'Corporation Tax Registration',
    date: new Date('2024-02-01'),
    type: 'compliance',
    status: 'completed',
    description: 'Registered for Corporation Tax with HMRC',
    category: 'financial',
    importance: 'high'
  },
  {
    id: '3',
    title: 'First Employee Hired',
    date: new Date('2024-03-10'),
    type: 'milestone',
    status: 'completed',
    description: 'Expanded team with first full-time employee',
    category: 'hr',
    importance: 'medium'
  },
  {
    id: '4',
    title: 'VAT Registration',
    date: new Date('2024-04-15'),
    type: 'compliance',
    status: 'in-progress',
    description: 'VAT registration due for Q2 revenue threshold',
    category: 'financial',
    importance: 'high'
  },
  {
    id: '5',
    title: 'PAYE Setup',
    date: new Date('2024-05-01'),
    type: 'compliance',
    status: 'upcoming',
    description: 'Setup PAYE for employee payroll',
    category: 'hr',
    importance: 'high'
  },
  {
    id: '6',
    title: 'Annual Return Filing',
    date: new Date('2024-06-30'),
    type: 'deadline',
    status: 'upcoming',
    description: 'Annual return and accounts filing deadline',
    category: 'legal',
    importance: 'high'
  }
];

export const BusinessHistoryTimeline: React.FC = () => {
  const [selectedEvent, setSelectedEvent] = useState<TimelineEvent | null>(null);
  const [filter, setFilter] = useState<'all' | 'completed' | 'upcoming'>('all');

  const getEventIcon = (type: TimelineEvent['type'], category: TimelineEvent['category']) => {
    switch (type) {
      case 'milestone':
        return category === 'hr' ? <Users className="w-4 h-4" /> : <Building2 className="w-4 h-4" />;
      case 'compliance':
        return <Receipt className="w-4 h-4" />;
      case 'deadline':
        return <Calendar className="w-4 h-4" />;
      case 'achievement':
        return <Award className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const getStatusIcon = (status: TimelineEvent['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'in-progress':
        return <Clock className="w-4 h-4 text-blue-500" />;
      case 'upcoming':
        return <Calendar className="w-4 h-4 text-gray-500" />;
      case 'overdue':
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: TimelineEvent['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 border-green-500 text-green-800';
      case 'in-progress':
        return 'bg-blue-100 border-blue-500 text-blue-800';
      case 'upcoming':
        return 'bg-gray-100 border-gray-500 text-gray-800';
      case 'overdue':
        return 'bg-red-100 border-red-500 text-red-800';
      default:
        return 'bg-gray-100 border-gray-500 text-gray-800';
    }
  };

  const filteredEvents = mockTimelineData.filter(event => {
    if (filter === 'all') return true;
    if (filter === 'completed') return event.status === 'completed';
    if (filter === 'upcoming') return event.status === 'upcoming' || event.status === 'in-progress';
    return true;
  }).sort((a, b) => a.date.getTime() - b.date.getTime());

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-xl">
            <TrendingUp className="w-5 h-5" />
            Business Timeline
          </CardTitle>
          <div className="flex gap-2">
            <Button
              variant={filter === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('all')}
            >
              All Events
            </Button>
            <Button
              variant={filter === 'completed' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('completed')}
            >
              Completed
            </Button>
            <Button
              variant={filter === 'upcoming' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('upcoming')}
            >
              Upcoming
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200" />
          
          <div className="space-y-6">
            {filteredEvents.map((event, index) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative flex items-start gap-4"
              >
                {/* Timeline dot */}
                <div className={`
                  relative z-10 w-12 h-12 rounded-full border-4 flex items-center justify-center
                  ${getStatusColor(event.status)} transition-all duration-200
                `}>
                  {getEventIcon(event.type, event.category)}
                </div>
                
                {/* Event content */}
                <div 
                  className={`
                    flex-1 p-4 rounded-lg border cursor-pointer transition-all duration-200 hover:shadow-md
                    ${selectedEvent?.id === event.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}
                  `}
                  onClick={() => setSelectedEvent(selectedEvent?.id === event.id ? null : event)}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-semibold text-gray-900 text-base">{event.title}</h4>
                      <p className="text-sm text-gray-600">{formatDate(event.date)}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(event.status)}
                      <Badge 
                        variant="secondary" 
                        className={event.importance === 'high' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'}
                      >
                        {event.importance}
                      </Badge>
                    </div>
                  </div>
                  
                  {selectedEvent?.id === event.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="mt-3 pt-3 border-t border-gray-200"
                    >
                      <p className="text-sm text-gray-700 mb-3">{event.description}</p>
                      {event.status !== 'completed' && (
                        <Button size="sm" className="w-full">
                          Continue Task
                        </Button>
                      )}
                    </motion.div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
