
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface RingData {
  label: string;
  value: number;
  total: number;
  color: string;
}

interface ThreeDRingChartProps {
  data: RingData[];
  title: string;
  centerValue?: number;
  centerLabel?: string;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white p-3 border rounded shadow-lg">
        <p className="font-medium">{data.label}</p>
        <p className="text-sm text-gray-600">
          {data.value} of {data.total} ({Math.round((data.value / data.total) * 100)}%)
        </p>
      </div>
    );
  }
  return null;
};

const CustomLegend = ({ payload }: any) => {
  return (
    <div className="grid grid-cols-2 gap-2 text-xs mt-4">
      {payload.map((entry: any, index: number) => (
        <div key={index} className="flex items-center">
          <div 
            className="w-3 h-3 rounded-full mr-2"
            style={{ backgroundColor: entry.color }}
          />
          <span>{entry.payload.label}: {Math.round((entry.payload.value / entry.payload.total) * 100)}%</span>
        </div>
      ))}
    </div>
  );
};

export const ThreeDRingChart: React.FC<ThreeDRingChartProps> = ({
  data,
  title,
  centerValue,
  centerLabel
}) => {
  // Convert data to format suitable for recharts
  const chartData = data.map(item => ({
    ...item,
    percentage: Math.round((item.value / item.total) * 100)
  }));

  return (
    <Card className="h-96">
      <CardHeader>
        <CardTitle className="text-center">{title}</CardTitle>
      </CardHeader>
      <CardContent className="relative h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={2}
              dataKey="percentage"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
        
        {centerValue && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900">
                {centerValue}%
              </div>
              {centerLabel && (
                <div className="text-sm text-gray-600">{centerLabel}</div>
              )}
            </div>
          </div>
        )}
        
        <div className="absolute bottom-4 left-4 right-4">
          <div className="grid grid-cols-2 gap-2 text-xs">
            {data.map((item) => (
              <div key={item.label} className="flex items-center">
                <div 
                  className="w-3 h-3 rounded-full mr-2"
                  style={{ backgroundColor: item.color }}
                />
                <span>{item.label}: {Math.round((item.value / item.total) * 100)}%</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
