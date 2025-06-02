
import React from 'react';
import { Ring3DChart } from './Ring3DChart';
import { useBusinessSetupData } from '@/hooks/useBusinessSetupData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

export const BusinessSetup3DAnalytics: React.FC = () => {
  const { data, loading, error } = useBusinessSetupData();

  if (loading) {
    return (
      <Card className="h-96">
        <CardContent className="flex items-center justify-center h-full">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2" />
            <p className="text-gray-600">Loading business setup progress...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="h-96 border-red-200 bg-red-50">
        <CardContent className="flex items-center justify-center h-full">
          <div className="text-center">
            <p className="text-red-600 mb-2">Failed to load analytics</p>
            <p className="text-sm text-red-500">{error}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const overallProgress = Math.round(
    data.reduce((acc, item) => acc + (item.value / item.maxValue), 0) / data.length * 100
  );

  return (
    <div className="space-y-6">
      {/* Main 3D Ring Chart */}
      <Ring3DChart
        data={data}
        title="Business Setup Progress"
        centerValue={overallProgress}
        centerLabel="Overall Complete"
      />
      
      {/* Progress Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {data.map((item, index) => (
          <Card key={index} className="border-l-4" style={{ borderLeftColor: item.color }}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">{item.category}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center mb-2">
                <span className="text-2xl font-bold">{Math.round((item.value / item.maxValue) * 100)}%</span>
                <span className="text-sm text-gray-500">{item.value}/{item.maxValue}</span>
              </div>
              <p className="text-xs text-gray-600">{item.description}</p>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div 
                  className="h-2 rounded-full transition-all duration-300"
                  style={{ 
                    width: `${(item.value / item.maxValue) * 100}%`,
                    backgroundColor: item.color 
                  }}
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
