
import React from "react";
import { useNavigate } from "react-router-dom";
import { DocumentStatusDashboard } from "@/components/dashboard/DocumentStatusDashboard";
import { BusinessOverview } from "@/components/dashboard/charts/BusinessOverview";
import { SimpleDocumentAnalytics } from "@/components/dashboard/charts/SimpleDocumentAnalytics";
import { BusinessHistoryTimeline } from "@/components/dashboard/charts/BusinessHistoryTimeline";
import { ProgressPortraits } from "@/components/dashboard/charts/ProgressPortraits";
import { SuccessPredictionPanel } from "@/components/dashboard/charts/SuccessPredictionPanel";
import { PullToRefresh } from "@/components/ui/pull-to-refresh";
import { NeonGlow } from "@/components/ui/neon-glow";
import { AnimatedCounter, CurrencyCounter, PercentageCounter } from "@/components/ui/animated-counter";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

const Overview = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-base text-gray-600 dark:text-gray-400">Please log in to view your dashboard.</p>
      </div>
    );
  }

  const handleNavigateToGuidedHelp = () => {
    navigate('/guided-help');
  };

  const handleOverviewRefresh = async () => {
    // Simulate refresh of overview data
    await new Promise(resolve => setTimeout(resolve, 1200));
    toast.success('Overview updated');
  };

  return (
    <PullToRefresh onRefresh={handleOverviewRefresh}>
      {/* Improved mobile spacing and padding */}
      <div className="space-y-6 md:space-y-8 pt-4 md:pt-20 px-0">
        {/* Welcome Section with improved mobile typography */}
        <section 
          className="text-center py-6 md:py-8"
          data-spotlight-first-view="true"
          data-spotlight-id="dashboard-welcome"
          data-spotlight-message="Welcome to Bizzy! This is your command center. Start exploring your business journey here."
        >
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-3 md:mb-4 leading-tight">
            Welcome back! 👋
          </h1>
          <p className="text-base md:text-base text-gray-600 dark:text-gray-400 max-w-2xl mx-auto px-4 leading-relaxed">
            Let's continue building your business together
          </p>
        </section>

        {/* Stats Section with Mobile-Optimized Icon Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
          <NeonGlow color="blue" hover>
            <div className="bg-white dark:bg-gray-800 p-4 md:p-6 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 touch-manipulation min-h-[120px] md:min-h-[140px] flex flex-col justify-center">
              <h3 className="text-xs md:text-sm font-medium text-gray-500 dark:text-gray-400 mb-2 leading-tight">Tasks Completed</h3>
              <div className="text-xl md:text-3xl font-bold text-gray-900 dark:text-gray-100 leading-tight">
                <AnimatedCounter value={42} />
              </div>
            </div>
          </NeonGlow>
          
          <NeonGlow color="green" hover>
            <div className="bg-white dark:bg-gray-800 p-4 md:p-6 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 touch-manipulation min-h-[120px] md:min-h-[140px] flex flex-col justify-center">
              <h3 className="text-xs md:text-sm font-medium text-gray-500 dark:text-gray-400 mb-2 leading-tight">Progress</h3>
              <div className="text-xl md:text-3xl font-bold text-gray-900 dark:text-gray-100 leading-tight">
                <PercentageCounter value={78.5} />
              </div>
            </div>
          </NeonGlow>
          
          <NeonGlow color="purple" hover>
            <div className="bg-white dark:bg-gray-800 p-4 md:p-6 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 touch-manipulation min-h-[120px] md:min-h-[140px] flex flex-col justify-center">
              <h3 className="text-xs md:text-sm font-medium text-gray-500 dark:text-gray-400 mb-2 leading-tight">Time Saved</h3>
              <div className="text-xl md:text-3xl font-bold text-gray-900 dark:text-gray-100 leading-tight">
                <AnimatedCounter value={125} suffix=" hrs" />
              </div>
            </div>
          </NeonGlow>
          
          <NeonGlow color="pink" hover>
            <div className="bg-white dark:bg-gray-800 p-4 md:p-6 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 touch-manipulation min-h-[120px] md:min-h-[140px] flex flex-col justify-center">
              <h3 className="text-xs md:text-sm font-medium text-gray-500 dark:text-gray-400 mb-2 leading-tight">Money Saved</h3>
              <div className="text-xl md:text-3xl font-bold text-gray-900 dark:text-gray-100 leading-tight">
                <CurrencyCounter value={2450} />
              </div>
            </div>
          </NeonGlow>
        </div>

        {/* AI Success Prediction Panel */}
        <SuccessPredictionPanel />

        {/* Business Overview Section */}
        <BusinessOverview userId={user.id} />

        {/* Document Analytics Section */}
        <SimpleDocumentAnalytics userId={user.id} />

        {/* Document Status Dashboard */}
        <DocumentStatusDashboard userId={user.id} />

        {/* Action Buttons with Mobile-Optimized Layout and Fixed Colors */}
        <div 
          className="flex flex-col sm:flex-row flex-wrap gap-3 md:gap-4 mt-6 md:mt-8 justify-center"
          data-spotlight-first-view="true"
          data-spotlight-id="dashboard-cta"
          data-spotlight-message="Ready to start? Click 'Continue Journey' to begin your next step!"
        >
          <NeonGlow color="blue" pulse hover>
            <button 
              className="w-full sm:w-auto px-6 py-4 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-700 text-white rounded-lg font-medium text-base transition-all duration-300 min-h-[48px] touch-manipulation"
              onClick={handleNavigateToGuidedHelp}
            >
              Continue Journey
            </button>
          </NeonGlow>
          
          <NeonGlow color="green" hover>
            <button className="w-full sm:w-auto px-6 py-4 bg-green-600 hover:bg-green-700 active:bg-green-800 dark:bg-green-600 dark:hover:bg-green-700 text-white rounded-lg font-medium text-base transition-all duration-300 min-h-[48px] touch-manipulation">
              Download Documents
            </button>
          </NeonGlow>
          
          <NeonGlow color="rainbow" hover>
            <button className="w-full sm:w-auto px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 dark:from-purple-600 dark:to-pink-600 dark:hover:from-purple-700 dark:hover:to-pink-700 text-white rounded-lg font-medium text-base transition-all duration-300 min-h-[48px] touch-manipulation">
              Premium Features
            </button>
          </NeonGlow>
        </div>
      </div>
    </PullToRefresh>
  );
};

export default Overview;
