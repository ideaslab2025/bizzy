
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useDocumentAnalytics } from '@/hooks/useDocumentAnalytics';
import { formatDistanceToNow } from 'date-fns';

interface DocumentAnalyticsProps {
  userId: string;
  companyId?: string;
}

export const DocumentAnalytics: React.FC<DocumentAnalyticsProps> = ({ userId, companyId }) => {
  const { analyticsData, loading } = useDocumentAnalytics(userId, companyId);

  if (loading) {
    return (
      <div className="document-analytics p-6 bg-white rounded-lg shadow-sm animate-pulse">
        <div className="h-8 bg-gray-200 rounded mb-4"></div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-24 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  if (!analyticsData) {
    return (
      <div className="document-analytics p-6 bg-white rounded-lg shadow-sm">
        <p className="text-gray-500">No analytics data available</p>
      </div>
    );
  }

  return (
    <div className="document-analytics p-6 bg-white rounded-lg shadow-sm">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Compliance Analytics</h2>
        <p className="text-gray-600">Document completion impact on business readiness</p>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <MetricCard
          title="Documents Completed"
          value={`${analyticsData.completedCount}/${analyticsData.totalCount}`}
          percentage={analyticsData.overallCompletion}
          icon="📋"
          trend="up"
        />
        <MetricCard
          title="Compliance Score"
          value={`${analyticsData.complianceScore}/100`}
          percentage={analyticsData.complianceScore}
          icon="⚖️"
          trend="up"
        />
        <MetricCard
          title="Critical Items"
          value={analyticsData.criticalRemaining.toString()}
          subtitle="remaining"
          icon="🚨"
          trend={analyticsData.criticalRemaining === 0 ? "neutral" : "attention"}
        />
        <MetricCard
          title="Est. Completion"
          value={analyticsData.estimatedCompletion.toLocaleDateString('en-GB', { 
            day: 'numeric', 
            month: 'short' 
          })}
          subtitle="at current pace"
          icon="📅"
          trend="neutral"
        />
      </div>

      {/* Category Breakdown Chart */}
      <CategoryBreakdownChart data={analyticsData.categoryBreakdown} />
      
      {/* Document Priority Matrix */}
      <DocumentPriorityMatrix documents={analyticsData.remainingDocuments} />
    </div>
  );
};

interface MetricCardProps {
  title: string;
  value: string;
  percentage?: number;
  subtitle?: string;
  icon: string;
  trend: 'up' | 'attention' | 'down' | 'neutral';
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, percentage, subtitle, icon, trend }) => {
  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up': return 'text-green-600 bg-green-50 border-green-200';
      case 'attention': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'down': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-blue-600 bg-blue-50 border-blue-200';
    }
  };

  return (
    <div className={`p-4 rounded-lg border ${getTrendColor(trend)}`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-2xl">{icon}</span>
        {percentage !== undefined && (
          <span className="text-sm font-medium">{percentage}%</span>
        )}
      </div>
      <h3 className="text-sm font-medium text-gray-700 mb-1">{title}</h3>
      <p className="text-xl font-bold text-gray-900">{value}</p>
      {subtitle && (
        <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
      )}
    </div>
  );
};

interface CategoryBreakdownChartProps {
  data: Array<{
    id: string;
    name: string;
    completed: number;
    total: number;
    criticalRemaining: number;
    nextDeadline?: Date;
  }>;
}

const CategoryBreakdownChart: React.FC<CategoryBreakdownChartProps> = ({ data }) => {
  return (
    <div className="mb-8">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Progress by Category</h3>
      <div className="space-y-4">
        {data.map(category => (
          <div key={category.id} className="bg-gray-50 p-4 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium text-gray-900">{category.name}</span>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">
                  {category.completed}/{category.total}
                </span>
                <span className="text-sm font-medium text-blue-600">
                  {category.total > 0 ? Math.round((category.completed / category.total) * 100) : 0}%
                </span>
              </div>
            </div>
            
            {/* Professional 2D Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                style={{ 
                  width: `${category.total > 0 ? (category.completed / category.total) * 100 : 0}%` 
                }}
              />
            </div>
            
            {/* Document Details */}
            <div className="mt-2 flex flex-wrap gap-2">
              {category.criticalRemaining > 0 && (
                <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded">
                  {category.criticalRemaining} critical remaining
                </span>
              )}
              {category.nextDeadline && (
                <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded">
                  Next deadline: {formatDistanceToNow(category.nextDeadline)}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

interface DocumentPriorityMatrixProps {
  documents: Array<{
    id: string;
    title: string;
    category: string;
    priority: 'critical' | 'high' | 'medium' | 'low';
    regulatoryBody?: string;
    estimatedTime: number;
  }>;
}

const DocumentPriorityMatrix: React.FC<DocumentPriorityMatrixProps> = ({ documents }) => {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const criticalDocs = documents.filter(doc => doc.priority === 'critical').slice(0, 5);
  const upcomingDocs = documents.filter(doc => doc.priority !== 'critical').slice(0, 5);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Critical Documents */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg text-red-700">🚨 Critical Documents</CardTitle>
        </CardHeader>
        <CardContent>
          {criticalDocs.length === 0 ? (
            <p className="text-green-600 font-medium">✅ All critical documents completed!</p>
          ) : (
            <div className="space-y-3">
              {criticalDocs.map(doc => (
                <div key={doc.id} className="flex justify-between items-center p-3 bg-red-50 rounded-lg border border-red-200">
                  <div>
                    <h4 className="font-medium text-gray-900">{doc.title}</h4>
                    <p className="text-sm text-gray-600">{doc.category}</p>
                    {doc.regulatoryBody && (
                      <p className="text-xs text-gray-500">{doc.regulatoryBody}</p>
                    )}
                  </div>
                  <div className="text-right">
                    <span className={`px-2 py-1 rounded text-xs font-medium border ${getPriorityColor(doc.priority)}`}>
                      {doc.priority}
                    </span>
                    <p className="text-xs text-gray-500 mt-1">{doc.estimatedTime}m</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Upcoming Documents */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg text-blue-700">📋 Next Documents</CardTitle>
        </CardHeader>
        <CardContent>
          {upcomingDocs.length === 0 ? (
            <p className="text-gray-500">No upcoming documents</p>
          ) : (
            <div className="space-y-3">
              {upcomingDocs.map(doc => (
                <div key={doc.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <div>
                    <h4 className="font-medium text-gray-900">{doc.title}</h4>
                    <p className="text-sm text-gray-600">{doc.category}</p>
                    {doc.regulatoryBody && (
                      <p className="text-xs text-gray-500">{doc.regulatoryBody}</p>
                    )}
                  </div>
                  <div className="text-right">
                    <span className={`px-2 py-1 rounded text-xs font-medium border ${getPriorityColor(doc.priority)}`}>
                      {doc.priority}
                    </span>
                    <p className="text-xs text-gray-500 mt-1">{doc.estimatedTime}m</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
