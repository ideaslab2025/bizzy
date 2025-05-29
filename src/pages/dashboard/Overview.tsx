
import React from "react";
import { useNavigate } from "react-router-dom";
import { PersonalizedDashboard } from "@/components/dashboard/PersonalizedDashboard";
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
        <p className="text-gray-600">Please log in to view your dashboard.</p>
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
      <div className="space-y-8">
        {/* Welcome Section with First-View Spotlight */}
        <section 
          className="text-center py-8"
          data-spotlight-first-view="true"
          data-spotlight-id="dashboard-welcome"
          data-spotlight-message="Welcome to Bizzy! This is your command center. Start exploring your business journey here."
        >
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Welcome back! 👋
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Let's continue building your business together
          </p>
        </section>

        {/* Stats Section with Neon Glow */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <NeonGlow color="blue" hover>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Tasks Completed</h3>
              <div className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
                <AnimatedCounter value={42} />
              </div>
            </div>
          </NeonGlow>
          
          <NeonGlow color="green" hover>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Progress</h3>
              <div className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
                <PercentageCounter value={78.5} />
              </div>
            </div>
          </NeonGlow>
          
          <NeonGlow color="purple" hover>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Time Saved</h3>
              <div className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
                <AnimatedCounter value={125} suffix=" hrs" />
              </div>
            </div>
          </NeonGlow>
          
          <NeonGlow color="pink" hover>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Money Saved</h3>
              <div className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
                <CurrencyCounter value={2450} />
              </div>
            </div>
          </NeonGlow>
        </div>

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
          className="flex flex-wrap gap-4 mt-8"
          data-spotlight-first-view="true"
          data-spotlight-id="dashboard-cta"
          data-spotlight-message="Ready to start? Click 'Continue Journey' to begin your next step!"
        >
          <NeonGlow color="blue" pulse hover>
            <button 
              className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium transition-all duration-300"
              onClick={handleNavigateToGuidedHelp}
            >
              Continue Journey
            </button>
          </NeonGlow>
          
          <NeonGlow color="green" hover>
            <button className="px-6 py-3 bg-green-600 text-white rounded-lg font-medium transition-all duration-300">
              Download Documents
            </button>
          </NeonGlow>
          
          <NeonGlow color="rainbow" hover>
            <button className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-medium transition-all duration-300">
              Premium Features
            </button>
          </NeonGlow>
        </div>
      </div>
    </PullToRefresh>
  );
};

export default Overview;
