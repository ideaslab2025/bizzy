
import React, { useState, useEffect } from 'react';
import { PoundSterling, Star, Rocket, Clock } from 'lucide-react';
import { AnimatedCounter } from './ui/AnimatedCounter';
import StatisticsSkeleton from './StatisticsSkeleton';

interface StatisticItem {
  value: React.ReactNode;
  label: string;
  icon: React.ReactNode;
  description?: string;
}

const StatisticsSection: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time for statistics
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1200);

    return () => clearTimeout(timer);
  }, []);

  const statistics: StatisticItem[] = [
    {
      value: <AnimatedCounter end={85} prefix="£" suffix="k+" duration={2500} />,
      label: "Total Saved by Businesses",
      icon: <PoundSterling className="w-8 h-8" />,
      description: "Money saved through efficient business setup"
    },
    {
      value: <AnimatedCounter end={98.5} suffix="%" decimals={1} duration={2000} />,
      label: "Customer Satisfaction",
      icon: <Star className="w-8 h-8" />,
      description: "Businesses rate us highly for service"
    },
    {
      value: <AnimatedCounter end={1200} suffix="+" separator="," duration={2200} />,
      label: "Companies Launched",
      icon: <Rocket className="w-8 h-8" />,
      description: "Successful business launches with Bizzy"
    },
    {
      value: <AnimatedCounter end={24} suffix=" hrs" duration={1800} />,
      label: "Average Setup Time",
      icon: <Clock className="w-8 h-8" />,
      description: "Fast, efficient business setup process"
    }
  ];

  if (isLoading) {
    return <StatisticsSkeleton />;
  }

  return (
    <section className="py-16 bg-gradient-to-br from-blue-50 to-blue-100/50">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Trusted by Businesses Across the UK
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Join thousands of successful businesses who have streamlined their setup process with Bizzy
          </p>
        </div>

        {/* Statistics Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 max-w-6xl mx-auto">
          {statistics.map((stat, index) => (
            <div
              key={index}
              className="bg-white rounded-xl p-6 md:p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              {/* Icon */}
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                  {stat.icon}
                </div>
              </div>

              {/* Animated Value */}
              <div className="text-center mb-3">
                <div 
                  className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-2"
                  role="region"
                  aria-live="polite"
                  aria-label={`Statistic: ${stat.label}`}
                >
                  {stat.value}
                </div>
              </div>

              {/* Label */}
              <div className="text-center">
                <h3 className="text-sm md:text-base font-semibold text-gray-700 leading-tight">
                  {stat.label}
                </h3>
              </div>

              {/* Optional Description - Hidden on mobile for cleaner look */}
              {stat.description && (
                <div className="text-center mt-2 hidden md:block">
                  <p className="text-xs text-gray-500 leading-relaxed">
                    {stat.description}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Enhanced Trust Indicators */}
        <div className="mt-16 text-center">
          <h3 className="text-xl font-semibold text-gray-800 mb-8">Certified & Compliant</h3>
          <div className="flex flex-wrap justify-center items-center gap-6 max-w-4xl mx-auto">
            {/* UK Business Compliant Badge */}
            <div className="flex-1 min-w-[280px] max-w-[320px] bg-white rounded-lg shadow-md border-2 border-green-200 p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-center gap-3">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="text-left">
                  <div className="font-bold text-gray-900 text-sm">UK Business Compliant</div>
                  <div className="text-xs text-gray-600">Companies House Approved</div>
                </div>
              </div>
            </div>

            {/* GDPR Secure Badge */}
            <div className="flex-1 min-w-[280px] max-w-[320px] bg-white rounded-lg shadow-md border-2 border-blue-200 p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-center gap-3">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="text-left">
                  <div className="font-bold text-gray-900 text-sm">GDPR Secure</div>
                  <div className="text-xs text-gray-600">Data Protection Compliant</div>
                </div>
              </div>
            </div>

            {/* Professional Assured Badge */}
            <div className="flex-1 min-w-[280px] max-w-[320px] bg-white rounded-lg shadow-md border-2 border-purple-200 p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-center gap-3">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <Star className="w-6 h-6 text-purple-600" fill="currentColor" />
                </div>
                <div className="text-left">
                  <div className="font-bold text-gray-900 text-sm">Professional Assured</div>
                  <div className="text-xs text-gray-600">Expert Verified Content</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StatisticsSection;
