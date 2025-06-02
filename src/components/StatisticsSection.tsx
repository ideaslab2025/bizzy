import React from 'react';
import { PoundSterling, Star, Rocket, Clock } from 'lucide-react';

interface StatisticItem {
  value: string;
  label: string;
  icon: React.ReactNode;
  description?: string;
}

const StatisticsSection: React.FC = () => {
  const statistics: StatisticItem[] = [
    {
      value: "£850,000+",
      label: "Total Saved by Businesses",
      icon: <PoundSterling className="w-8 h-8" />,
      description: "Money saved through efficient business setup"
    },
    {
      value: "98.5%",
      label: "Customer Satisfaction",
      icon: <Star className="w-8 h-8" />,
      description: "Businesses rate us highly for service"
    },
    {
      value: "1,200+",
      label: "Companies Launched",
      icon: <Rocket className="w-8 h-8" />,
      description: "Successful business launches with Bizzy"
    },
    {
      value: "24 hrs",
      label: "Average Setup Time",
      icon: <Clock className="w-8 h-8" />,
      description: "Fast, efficient business setup process"
    }
  ];

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

              {/* Value */}
              <div className="text-center mb-3">
                <div className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-2">
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

        {/* Trust Indicators */}
        <div className="mt-12 text-center">
          <div className="flex flex-wrap justify-center items-center gap-6 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>UK Business Compliant</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span>GDPR Secure</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span>Professional Assured</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StatisticsSection;
