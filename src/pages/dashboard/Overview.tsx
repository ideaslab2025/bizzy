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
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { useProgress } from "@/contexts/ProgressContext";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const Overview = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { overallBusinessProgress } = useProgress();
  const [companyName, setCompanyName] = useState<string>("");

  // Fetch company name from profile
  useEffect(() => {
    if (user) {
      fetchCompanyName();
    }
  }, [user]);

  // Listen for company name updates from profile page
  useEffect(() => {
    const handleCompanyNameUpdate = (event: CustomEvent) => {
      setCompanyName(event.detail.companyName);
    };

    window.addEventListener('companyNameUpdated', handleCompanyNameUpdate);
    
    return () => {
      window.removeEventListener('companyNameUpdate', handleCompanyNameUpdate);
    };
  }, []);

  const fetchCompanyName = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('company_name')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error("Error fetching company name:", error);
        return;
      }

      if (data?.company_name) {
        setCompanyName(data.company_name);
      }
    } catch (error) {
      console.error("Unexpected error fetching company name:", error);
    }
  };

  // Get display title with fallback
  const getDisplayTitle = () => {
    if (companyName && companyName.trim()) {
      return companyName;
    }
    return "Welcome back!";
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-base text-black">Please log in to view your dashboard.</p>
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
      {/* Professional dashboard with improved spacing and styling */}
      <div className="space-y-8 md:space-y-10 pt-6 md:pt-24 px-0 relative z-10">
        {/* Welcome Section in a professional card */}
        <section 
          className="flex justify-center"
          data-spotlight-first-view="true"
          data-spotlight-id="dashboard-welcome"
          data-spotlight-message="Welcome to Bizzy! This is your command center. Start exploring your business journey here."
        >
          <NeonGlow color="blue" hover>
            <Card className="card-professional-hover max-w-2xl w-full">
              <CardContent className="spacing-professional text-center">
                <h1 className="text-3xl md:text-4xl font-bold text-black mb-4 md:mb-6 leading-tight">
                  Welcome back! 👋
                </h1>
              </CardContent>
            </Card>
          </NeonGlow>
        </section>

        {/* Professional Stats Grid with Enhanced Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          <NeonGlow color="blue" hover>
            <div className="card-professional-hover spacing-professional min-h-[140px] md:min-h-[160px] flex flex-col justify-center">
              <h3 className="text-sm md:text-base font-semibold text-gray-600 mb-3 leading-tight">Tasks Completed</h3>
              <div className="text-2xl md:text-4xl font-bold text-black leading-tight">
                <AnimatedCounter value={42} />
              </div>
            </div>
          </NeonGlow>
          
          <NeonGlow color="green" hover>
            <div className="card-professional-hover spacing-professional min-h-[140px] md:min-h-[160px] flex flex-col justify-center">
              <h3 className="text-sm md:text-base font-semibold text-gray-600 mb-3 leading-tight">Progress</h3>
              <div className="text-2xl md:text-4xl font-bold text-black leading-tight">
                <PercentageCounter value={78.5} />
              </div>
            </div>
          </NeonGlow>
          
          <NeonGlow color="purple" hover>
            <div className="card-professional-hover spacing-professional min-h-[140px] md:min-h-[160px] flex flex-col justify-center">
              <h3 className="text-sm md:text-base font-semibold text-gray-600 mb-3 leading-tight">Time Saved</h3>
              <div className="text-2xl md:text-4xl font-bold text-black leading-tight">
                <AnimatedCounter value={125} suffix=" hrs" />
              </div>
            </div>
          </NeonGlow>
          
          <NeonGlow color="pink" hover>
            <div className="card-professional-hover spacing-professional min-h-[140px] md:min-h-[160px] flex flex-col justify-center">
              <h3 className="text-sm md:text-base font-semibold text-gray-600 mb-3 leading-tight">Money Saved</h3>
              <div className="text-2xl md:text-4xl font-bold text-black leading-tight">
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

        {/* Professional Action Buttons with Enhanced Styling */}
        <div 
          className="flex flex-col sm:flex-row flex-wrap gap-4 md:gap-6 mt-8 md:mt-12 justify-center"
          data-spotlight-first-view="true"
          data-spotlight-id="dashboard-cta"
          data-spotlight-message="Ready to start? Click 'Continue Journey' to begin your next step!"
        >
          <NeonGlow color="blue" pulse hover>
            <button 
              className="w-full sm:w-auto px-8 py-5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white rounded-xl font-semibold text-lg transition-all duration-300 min-h-[56px] touch-manipulation shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              onClick={handleNavigateToGuidedHelp}
            >
              Continue Journey
            </button>
          </NeonGlow>
          
          <NeonGlow color="green" hover>
            <button className="w-full sm:w-auto px-8 py-5 bg-green-600 hover:bg-green-700 active:bg-green-800 text-white rounded-xl font-semibold text-lg transition-all duration-300 min-h-[56px] touch-manipulation shadow-lg hover:shadow-xl transform hover:-translate-y-1">
              Download Documents
            </button>
          </NeonGlow>
          
          <NeonGlow color="rainbow" hover>
            <button className="w-full sm:w-auto px-8 py-5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl font-semibold text-lg transition-all duration-300 min-h-[56px] touch-manipulation shadow-lg hover:shadow-xl transform hover:-translate-y-1">
              Premium Features
            </button>
          </NeonGlow>
        </div>
      </div>
    </PullToRefresh>
  );
};

export default Overview;
