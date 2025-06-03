
import React from "react";
import { useNavigate } from "react-router-dom";
import { PersonalizedDashboard } from "@/components/dashboard/PersonalizedDashboard";
import { DocumentStatusDashboard } from "@/components/dashboard/DocumentStatusDashboard";
import { BusinessOverview } from "@/components/dashboard/charts/BusinessOverview";
import { SimpleDocumentAnalytics } from "@/components/dashboard/charts/SimpleDocumentAnalytics";
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

  const handleNavigateToStep = (sectionId: number, stepNumber: number) => {
    navigate(`/guided-help?section=${sectionId}&step=${stepNumber}`);
  };

  const handleNavigateToGuidedHelp = () => {
    navigate('/guided-help');
  };

  const handleOverviewRefresh = async () => {
    // Simulate refresh of overview data
    await new Promise(resolve => setTimeout(resolve, 1200));
    toast.success('Overview updated');
  };

  // Mock data for now - in a real app this would come from user profile
  const completedStepIds = [1, 2, 3]; // Example completed steps
  const currentSectionCategory = "foundation"; // Example category
  const companyAge = 30; // Example company age in days

  return (
    <PullToRefresh onRefresh={handleOverviewRefresh}>
      {/* Add padding top to account for fixed header */}
      <div className="space-y-8 pt-20 px-4 md:px-6">
        {/* Welcome Section with First-View Spotlight */}
        <section 
          className="text-center py-8"
          data-spotlight-first-view="true"
          data-spotlight-id="dashboard-welcome"
          data-spotlight-message="Welcome to Bizzy! This is your command center. Start exploring your business journey here."
        >
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Welcome back! 👋
          </h1>
          <p className="text-base text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Let's continue building your business together
          </p>
        </section>

        {/* Stats Section with Neon Glow */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <NeonGlow color="blue" hover>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Tasks Completed</h3>
              <div className="text-3xl font-bold text-gray-900 dark:text-white">
                <AnimatedCounter value={42} />
              </div>
            </div>
          </NeonGlow>
          
          <NeonGlow color="green" hover>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Progress</h3>
              <div className="text-3xl font-bold text-gray-900 dark:text-white">
                <PercentageCounter value={78.5} />
              </div>
            </div>
          </NeonGlow>
          
          <NeonGlow color="purple" hover>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Time Saved</h3>
              <div className="text-3xl font-bold text-gray-900 dark:text-white">
                <AnimatedCounter value={125} suffix=" hrs" />
              </div>
            </div>
          </NeonGlow>
          
          <NeonGlow color="pink" hover>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Money Saved</h3>
              <div className="text-3xl font-bold text-gray-900 dark:text-white">
                <CurrencyCounter value={2450} />
              </div>
            </div>
          </NeonGlow>
        </div>

        {/* Business Overview Section */}
        <BusinessOverview userId={user.id} />

        {/* Document Analytics Section */}
        <SimpleDocumentAnalytics userId={user.id} />

        {/* Document Status Dashboard */}
        <DocumentStatusDashboard userId={user.id} />

        {/* Main Dashboard */}
        <PersonalizedDashboard
          userId={user.id}
          completedStepIds={completedStepIds}
          currentSectionCategory={currentSectionCategory}
          companyAge={companyAge}
          onNavigateToStep={handleNavigateToStep}
          onNavigateToGuidedHelp={handleNavigateToGuidedHelp}
        />

        {/* Action Buttons with Neon Effects and First-View Spotlight */}
        <div 
          className="flex flex-wrap gap-4 mt-8 justify-center"
          data-spotlight-first-view="true"
          data-spotlight-id="dashboard-cta"
          data-spotlight-message="Ready to start? Click 'Continue Journey' to begin your next step!"
        >
          <NeonGlow color="blue" pulse hover>
            <button 
              className="px-6 py-3 bg-blue-600 dark:bg-blue-500 text-white rounded-lg font-medium text-base transition-all duration-300 hover:bg-blue-700 dark:hover:bg-blue-600"
              onClick={handleNavigateToGuidedHelp}
            >
              Continue Journey
            </button>
          </NeonGlow>
          
          <NeonGlow color="green" hover>
            <button className="px-6 py-3 bg-green-600 dark:bg-green-500 text-white rounded-lg font-medium text-base transition-all duration-300 hover:bg-green-700 dark:hover:bg-green-600">
              Download Documents
            </button>
          </NeonGlow>
          
          <NeonGlow color="rainbow" hover>
            <button className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-500 dark:to-pink-500 text-white rounded-lg font-medium text-base transition-all duration-300">
              Premium Features
            </button>
          </NeonGlow>
        </div>
      </div>
    </PullToRefresh>
  );
};

export default Overview;
