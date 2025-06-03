
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  Target, 
  Brain, 
  Zap, 
  Award,
  CheckCircle,
  AlertCircle,
  ArrowUp,
  ArrowDown
} from 'lucide-react';

interface SuccessFactor {
  id: string;
  name: string;
  score: number;
  weight: number;
  trend: 'up' | 'down' | 'stable';
  description: string;
  recommendations: string[];
}

interface PredictionData {
  overallScore: number;
  previousScore: number;
  scoreChange: number;
  riskLevel: 'low' | 'medium' | 'high';
  confidenceLevel: number;
  factors: SuccessFactor[];
  predictions: {
    sixMonths: number;
    oneYear: number;
    threeYears: number;
  };
}

const mockPredictionData: PredictionData = {
  overallScore: 78,
  previousScore: 72,
  scoreChange: 6,
  riskLevel: 'low',
  confidenceLevel: 92,
  factors: [
    {
      id: '1',
      name: 'Compliance Readiness',
      score: 85,
      weight: 30,
      trend: 'up',
      description: 'Legal and regulatory compliance status',
      recommendations: ['Complete VAT registration', 'Update employee handbook']
    },
    {
      id: '2',
      name: 'Financial Health',
      score: 90,
      weight: 25,
      trend: 'up',
      description: 'Banking, accounting, and financial management',
      recommendations: ['Setup automated invoicing', 'Review expense tracking']
    },
    {
      id: '3',
      name: 'Operational Efficiency',
      score: 65,
      weight: 20,
      trend: 'stable',
      description: 'Business processes and operational setup',
      recommendations: ['Implement HR policies', 'Setup project management tools']
    },
    {
      id: '4',
      name: 'Risk Management',
      score: 70,
      weight: 15,
      trend: 'up',
      description: 'Insurance, legal protection, and risk mitigation',
      recommendations: ['Review insurance coverage', 'Update terms of service']
    },
    {
      id: '5',
      name: 'Growth Preparedness',
      score: 80,
      weight: 10,
      trend: 'up',
      description: 'Scalability and expansion readiness',
      recommendations: ['Document key processes', 'Plan hiring strategy']
    }
  ],
  predictions: {
    sixMonths: 85,
    oneYear: 92,
    threeYears: 96
  }
};

const CircularGauge: React.FC<{ score: number; size: number }> = ({ score, size }) => {
  const radius = (size - 20) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const getScoreColor = () => {
    if (score >= 80) return '#10b981'; // green
    if (score >= 60) return '#f59e0b'; // amber
    return '#ef4444'; // red
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
          strokeWidth="8"
          fill="transparent"
        />
        {/* Score circle */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={getScoreColor()}
          strokeWidth="8"
          fill="transparent"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 2, ease: "easeInOut" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-bold text-gray-900">{score}</span>
        <span className="text-sm text-gray-600">/ 100</span>
      </div>
    </div>
  );
};

export const SuccessPredictionPanel: React.FC = () => {
  const { 
    overallScore, 
    previousScore, 
    scoreChange, 
    riskLevel, 
    confidenceLevel, 
    factors, 
    predictions 
  } = mockPredictionData;

  const getRiskBadge = (risk: string) => {
    switch (risk) {
      case 'low':
        return <Badge className="bg-green-100 text-green-800 border-green-200">Low Risk</Badge>;
      case 'medium':
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Medium Risk</Badge>;
      case 'high':
        return <Badge className="bg-red-100 text-red-800 border-red-200">High Risk</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up':
        return <ArrowUp className="w-4 h-4 text-green-500" />;
      case 'down':
        return <ArrowDown className="w-4 h-4 text-red-500" />;
      default:
        return <div className="w-4 h-4 rounded-full bg-gray-400" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Main Score Card */}
      <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <Brain className="w-5 h-5" />
            Business Readiness Score
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <CircularGauge score={overallScore} size={120} />
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl font-bold text-gray-900">{overallScore}%</span>
                  <div className="flex items-center gap-1">
                    {scoreChange > 0 ? (
                      <>
                        <ArrowUp className="w-4 h-4 text-green-500" />
                        <span className="text-sm font-medium text-green-600">+{scoreChange}%</span>
                      </>
                    ) : (
                      <>
                        <ArrowDown className="w-4 h-4 text-red-500" />
                        <span className="text-sm font-medium text-red-600">{scoreChange}%</span>
                      </>
                    )}
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-2">
                  Previous score: {previousScore}%
                </p>
                <div className="flex items-center gap-3">
                  {getRiskBadge(riskLevel)}
                  <span className="text-sm text-gray-600">
                    {confidenceLevel}% confidence
                  </span>
                </div>
              </div>
            </div>
            
            <div className="text-right">
              <h4 className="font-semibold text-gray-900 mb-2 text-base">Success Predictions</h4>
              <div className="space-y-1">
                <div className="flex justify-between gap-4">
                  <span className="text-sm text-gray-600">6 months:</span>
                  <span className="text-sm font-medium">{predictions.sixMonths}%</span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-sm text-gray-600">1 year:</span>
                  <span className="text-sm font-medium">{predictions.oneYear}%</span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-sm text-gray-600">3 years:</span>
                  <span className="text-sm font-medium">{predictions.threeYears}%</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Success Factors Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <Target className="w-5 h-5" />
            Success Factors Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {factors.map((factor, index) => (
              <motion.div
                key={factor.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-4 rounded-lg border border-gray-200 hover:shadow-sm transition-shadow"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <h4 className="font-semibold text-gray-900 text-base">{factor.name}</h4>
                    {getTrendIcon(factor.trend)}
                    <Badge variant="secondary" className="text-xs">
                      {factor.weight}% weight
                    </Badge>
                  </div>
                  <span className="text-lg font-bold text-gray-900">{factor.score}%</span>
                </div>
                
                <Progress value={factor.score} className="mb-3 h-2" />
                
                <p className="text-sm text-gray-600 mb-3">{factor.description}</p>
                
                {factor.recommendations.length > 0 && (
                  <div>
                    <h5 className="text-sm font-medium text-gray-900 mb-2 flex items-center gap-1">
                      <Zap className="w-3 h-3" />
                      Quick Improvements:
                    </h5>
                    <ul className="space-y-1">
                      {factor.recommendations.map((rec, idx) => (
                        <li key={idx} className="text-sm text-gray-600 flex items-start gap-2">
                          <CheckCircle className="w-3 h-3 text-green-500 mt-0.5 flex-shrink-0" />
                          {rec}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
