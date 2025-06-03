
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { motion } from 'framer-motion';
import { 
  Receipt, 
  Users, 
  Building2, 
  FileText, 
  ArrowRight,
  Clock,
  CheckCircle,
  AlertTriangle,
  Target
} from 'lucide-react';

interface ComplianceArea {
  id: string;
  title: string;
  description: string;
  category: 'tax' | 'hr' | 'financial' | 'legal' | 'sector';
  completionPercentage: number;
  status: 'complete' | 'in-progress' | 'urgent' | 'not-started';
  tasks: {
    completed: number;
    total: number;
  };
  urgentDeadline?: string;
  estimatedTimeToComplete: string;
  icon: React.ReactNode;
}

const mockProgressData: ComplianceArea[] = [
  {
    id: '1',
    title: 'Tax Setup',
    description: 'Corporation Tax, VAT, and PAYE registration',
    category: 'tax',
    completionPercentage: 85,
    status: 'in-progress',
    tasks: { completed: 6, total: 7 },
    urgentDeadline: '15 days',
    estimatedTimeToComplete: '2 hours',
    icon: <Receipt className="w-6 h-6" />
  },
  {
    id: '2',
    title: 'HR Compliance',
    description: 'Employee policies, insurance, and workplace setup',
    category: 'hr',
    completionPercentage: 60,
    status: 'in-progress',
    tasks: { completed: 3, total: 5 },
    estimatedTimeToComplete: '4 hours',
    icon: <Users className="w-6 h-6" />
  },
  {
    id: '3',
    title: 'Financial Management',
    description: 'Banking setup, accounting software, and bookkeeping',
    category: 'financial',
    completionPercentage: 95,
    status: 'in-progress',
    tasks: { completed: 8, total: 8 },
    estimatedTimeToComplete: '1 hour',
    icon: <Building2 className="w-6 h-6" />
  },
  {
    id: '4',
    title: 'Legal Requirements',
    description: 'Company registrations, licenses, and compliance',
    category: 'legal',
    completionPercentage: 40,
    status: 'urgent',
    tasks: { completed: 2, total: 6 },
    urgentDeadline: '7 days',
    estimatedTimeToComplete: '6 hours',
    icon: <FileText className="w-6 h-6" />
  },
  {
    id: '5',
    title: 'Sector-Specific Requirements',
    description: 'Industry regulations, licenses, and sector compliance',
    category: 'sector',
    completionPercentage: 0,
    status: 'not-started',
    tasks: { completed: 0, total: 5 },
    estimatedTimeToComplete: '8 hours',
    icon: <Target className="w-6 h-6" />
  }
];

const CircularProgress: React.FC<{ percentage: number; size: number; status: ComplianceArea['status'] }> = ({ 
  percentage, 
  size, 
  status 
}) => {
  const radius = (size - 8) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  const getProgressColor = () => {
    switch (status) {
      case 'complete':
        return '#10b981'; // green
      case 'in-progress':
        return '#3b82f6'; // blue
      case 'urgent':
        return '#ef4444'; // red
      case 'not-started':
        return '#6b7280'; // gray
      default:
        return '#6b7280';
    }
  };

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        className="transform -rotate-90"
      >
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#e5e7eb"
          strokeWidth="4"
          fill="transparent"
        />
        {/* Progress circle */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={getProgressColor()}
          strokeWidth="4"
          fill="transparent"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1, ease: "easeInOut" }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-lg font-bold text-gray-900">{percentage}%</span>
      </div>
    </div>
  );
};

export const ProgressPortraits: React.FC = () => {
  const getStatusBadge = (status: ComplianceArea['status']) => {
    switch (status) {
      case 'complete':
        return <Badge className="bg-green-100 text-green-800 border-green-200">Complete</Badge>;
      case 'in-progress':
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200">In Progress</Badge>;
      case 'urgent':
        return <Badge className="bg-red-100 text-red-800 border-red-200">Urgent</Badge>;
      case 'not-started':
        return <Badge className="bg-gray-100 text-gray-800 border-gray-200">Not Started</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  const getStatusIcon = (status: ComplianceArea['status']) => {
    switch (status) {
      case 'complete':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'in-progress':
        return <Clock className="w-4 h-4 text-blue-500" />;
      case 'urgent':
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case 'not-started':
        return <Clock className="w-4 h-4 text-gray-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">
          <Users className="w-5 h-5" />
          Compliance Progress Overview
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {mockProgressData.map((area, index) => (
            <motion.div
              key={area.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-6 rounded-lg border border-gray-200 hover:shadow-md transition-shadow duration-200"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                    {area.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 text-base">{area.title}</h3>
                    <p className="text-sm text-gray-600">{area.description}</p>
                  </div>
                </div>
                {getStatusBadge(area.status)}
              </div>

              {/* Progress Bar Section - Now prominently displayed for all sections including Sector-Specific */}
              <div className="mb-4 space-y-3">
                <div className="flex justify-between text-sm font-medium">
                  <span className="text-gray-700">Progress</span>
                  <span className="text-gray-900">{area.completionPercentage}%</span>
                </div>
                <Progress 
                  value={area.completionPercentage} 
                  className="h-3 bg-gray-200"
                />
                <div className="flex justify-between text-xs text-gray-600">
                  <span>{area.tasks.completed}/{area.tasks.total} tasks completed</span>
                  <span>Est. time: {area.estimatedTimeToComplete}</span>
                </div>
              </div>

              <div className="flex items-center justify-between mb-4">
                <CircularProgress 
                  percentage={area.completionPercentage} 
                  size={80} 
                  status={area.status}
                />
                <div className="text-right">
                  <div className="flex items-center gap-2 mb-2">
                    {getStatusIcon(area.status)}
                    <span className="text-sm font-medium">
                      {area.tasks.completed}/{area.tasks.total} tasks
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">
                    Est. time: {area.estimatedTimeToComplete}
                  </p>
                  {area.urgentDeadline && (
                    <p className="text-sm text-red-600 font-medium">
                      Deadline: {area.urgentDeadline}
                    </p>
                  )}
                </div>
              </div>

              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white" size="sm">
                Continue Tasks
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
