
import React from "react";
import { useNavigate } from "react-router-dom";
import { PersonalizedDashboard } from "@/components/dashboard/PersonalizedDashboard";
import { PullToRefresh } from "@/components/ui/pull-to-refresh";
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
      <PersonalizedDashboard
        userId={user.id}
        completedStepIds={completedStepIds}
        currentSectionCategory={currentSectionCategory}
        companyAge={companyAge}
        onNavigateToStep={handleNavigateToStep}
        onNavigateToGuidedHelp={handleNavigateToGuidedHelp}
      />
    </PullToRefresh>
  );
};

export default Overview;
