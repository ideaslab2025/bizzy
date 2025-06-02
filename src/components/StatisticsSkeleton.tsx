
import React from 'react';
import { PoundSterling, Star, Rocket, Clock } from 'lucide-react';

const StatisticsSkeleton: React.FC = () => {
  const statisticIcons = [
    <PoundSterling className="w-8 h-8" />,
    <Star className="w-8 h-8" />,
    <Rocket className="w-8 h-8" />,
    <Clock className="w-8 h-8" />
  ];

  return (
    <section className="py-16 bg-gradient-to-br from-blue-50 to-blue-100/50">
      <div className="container mx-auto px-4">
        {/* Section Header Skeleton */}
        <div className="text-center mb-12">
          <div className="h-8 bg-gray-200 rounded w-96 mx-auto mb-4 animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3 mx-auto animate-pulse"></div>
        </div>

        {/* Statistics Grid Skeleton */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 max-w-6xl mx-auto">
          {statisticIcons.map((icon, index) => (
            <div
              key={index}
              className="bg-white rounded-xl p-6 md:p-8 shadow-lg border border-gray-100 animate-pulse"
            >
              {/* Icon */}
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-300">
                  {icon}
                </div>
              </div>

              {/* Animated Value Skeleton */}
              <div className="text-center mb-3">
                <div className="h-12 bg-gray-200 rounded w-20 mx-auto mb-2"></div>
              </div>

              {/* Label Skeleton */}
              <div className="text-center">
                <div className="h-4 bg-gray-200 rounded w-24 mx-auto mb-2"></div>
              </div>

              {/* Description Skeleton - Hidden on mobile */}
              <div className="text-center mt-2 hidden md:block">
                <div className="h-3 bg-gray-200 rounded w-32 mx-auto"></div>
              </div>
            </div>
          ))}
        </div>

        {/* Trust Indicators Skeleton */}
        <div className="mt-16 text-center">
          <div className="h-6 bg-gray-200 rounded w-48 mx-auto mb-8 animate-pulse"></div>
          <div className="flex flex-wrap justify-center items-center gap-6 max-w-4xl mx-auto">
            {[1, 2, 3].map((item) => (
              <div key={item} className="flex-1 min-w-[280px] max-w-[320px] bg-white rounded-lg shadow-md border-2 border-gray-200 p-6 animate-pulse">
                <div className="flex items-center justify-center gap-3">
                  <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                  <div className="text-left space-y-1">
                    <div className="h-4 bg-gray-200 rounded w-32"></div>
                    <div className="h-3 bg-gray-200 rounded w-24"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default StatisticsSkeleton;
