
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
import { BarChart3, TrendingUp, Clock, DollarSign } from "lucide-react";

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

  // Get display title with fallback
  const getDisplayTitle = () => {
    if (companyName && companyName.trim()) {
      return companyName;
    }
    return "Dashboard Overview";
  };

  return (
    <PullToRefresh onRefresh={handleOverviewRefresh}>
      <div className="p-6 bg-gray-50 min-h-full">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                <BarChart3 className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{getDisplayTitle()}</h1>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              <Card className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <BarChart3 className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Tasks Completed</p>
                    <p className="text-2xl font-bold text-gray-900">
                      <AnimatedCounter value={42} />
                    </p>
                  </div>
                </div>
              </Card>
              
              <Card className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Progress</p>
                    <p className="text-2xl font-bold text-gray-900">
                      <PercentageCounter value={78.5} />
                    </p>
                  </div>
                </div>
              </Card>
              
              <Card className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Clock className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Time Saved</p>
                    <p className="text-2xl font-bold text-gray-900">
                      <AnimatedCounter value={125} suffix=" hrs" />
                    </p>
                  </div>
                </div>
              </Card>
              
              <Card className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center">
                    <DollarSign className="w-6 h-6 text-pink-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Money Saved</p>
                    <p className="text-2xl font-bold text-gray-900">
                      <CurrencyCounter value={2450} />
                    </p>
                  </div>
                </div>
              </Card>
            </div>

            {/* AI Success Prediction Panel */}
            <SuccessPredictionPanel />

            {/* Business Overview Section */}
            <BusinessOverview userId={user.id} />

            {/* Document Analytics Section */}
            <SimpleDocumentAnalytics userId={user.id} />

            {/* Document Status Dashboard */}
            <DocumentStatusDashboard userId={user.id} />

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row flex-wrap gap-4 md:gap-6 justify-center">
              <button 
                className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-all duration-200"
                onClick={handleNavigateToGuidedHelp}
              >
                Continue Journey
              </button>
              
              <button className="px-8 py-4 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-all duration-200">
                Download Documents
              </button>
              
              <button className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg font-semibold transition-all duration-200">
                Premium Features
              </button>
            </div>
          </div>
        </div>
      </div>
    </PullToRefresh>
  );
};

export default Overview;
