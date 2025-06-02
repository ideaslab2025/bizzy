
import React from 'react';

const TestimonialSkeleton: React.FC = () => {
  return (
    <div className="w-full max-w-6xl mx-auto px-4">
      <div className="flex gap-4 overflow-hidden">
        {/* Show 2 skeleton cards */}
        {[1, 2].map((index) => (
          <div key={index} className="flex-shrink-0 w-96 mx-auto">
            <div className="rounded-full bg-blue-900/30 border-blue-800 h-96 w-96 mx-auto animate-pulse">
              <div className="flex flex-col items-center justify-center p-8 h-full">
                {/* Star rating skeleton */}
                <div className="flex items-center gap-1 mb-4">
                  {Array(5).fill(0).map((_, i) => (
                    <div key={i} className="w-5 h-5 bg-blue-200 rounded-full opacity-30"></div>
                  ))}
                </div>
                
                {/* Quote text skeleton */}
                <div className="relative text-center mb-6 flex-1 flex items-center w-full px-6">
                  <div className="space-y-3 w-full">
                    <div className="h-4 bg-blue-200 rounded opacity-30 w-full"></div>
                    <div className="h-4 bg-blue-200 rounded opacity-30 w-5/6 mx-auto"></div>
                    <div className="h-4 bg-blue-200 rounded opacity-30 w-4/5 mx-auto"></div>
                    <div className="h-4 bg-blue-200 rounded opacity-30 w-3/4 mx-auto"></div>
                  </div>
                </div>
                
                {/* Avatar and details skeleton */}
                <div className="flex flex-col items-center">
                  <div className="h-20 w-20 mb-3 border-2 border-blue-500 rounded-full bg-blue-200 opacity-30"></div>
                  <div className="text-center space-y-2">
                    <div className="h-4 bg-blue-200 rounded opacity-30 w-24"></div>
                    <div className="h-3 bg-blue-200 rounded opacity-30 w-32"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TestimonialSkeleton;
