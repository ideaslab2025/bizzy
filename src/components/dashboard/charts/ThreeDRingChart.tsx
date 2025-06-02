
import React from 'react';
import { Ring3DChart } from './Ring3DChart';

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

export const ThreeDRingChart: React.FC<ThreeDRingChartProps> = ({
  data,
  title,
  centerValue,
  centerLabel
}) => {
  // Transform data to match Ring3DChart interface
  const chartData = data.map(item => ({
    category: item.label,
    value: item.value,
    maxValue: item.total,
    color: item.color,
    description: `${item.value} of ${item.total} completed`
  }));

  return (
    <Ring3DChart
      data={chartData}
      title={title}
      centerValue={centerValue}
      centerLabel={centerLabel}
    />
  );
};
