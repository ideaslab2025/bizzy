
import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { PersonalizedDashboard } from '@/components/dashboard/PersonalizedDashboard';
import { EnhancedSearchCommandPalette } from '@/components/ui/enhanced-search-command-palette';
import { GlobalSearchTrigger } from '@/components/ui/global-search-trigger';
import { NotificationBell } from '@/components/ui/notification-bell';
import { QuickActionsFab } from '@/components/ui/quick-actions-fab';
import { useCommandPalette } from '@/hooks/useCommandPalette';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { user } = useAuth();
  const { isOpen, setIsOpen } = useCommandPalette();
  const navigate = useNavigate();

  if (!user) {
    return <div>Loading...</div>;
  }

  // Mock data for now - these would typically come from your progress tracking hooks
  const completedStepIds: number[] = [];
  const currentSectionCategory = 'business-setup';
  const companyAge = 30; // days

  const handleNavigateToStep = (sectionId: number, stepNumber: number) => {
    navigate(`/guided-help?section=${sectionId}&step=${stepNumber}`);
  };

  const handleNavigateToGuidedHelp = () => {
    navigate('/guided-help');
  };

  return (
    <div className="space-y-6 relative">
      {/* Dashboard Header with Search and Notifications */}
      <div className="flex items-center justify-between px-4 lg:px-0">
        <div className="flex items-center gap-4">
          <GlobalSearchTrigger 
            onClick={() => setIsOpen(true)}
            className="max-w-md"
          />
        </div>
        <div className="flex items-center gap-2">
          <NotificationBell />
        </div>
      </div>

      {/* Main Dashboard Content */}
      <PersonalizedDashboard 
        userId={user.id}
        completedStepIds={completedStepIds}
        currentSectionCategory={currentSectionCategory}
        companyAge={companyAge}
        onNavigateToStep={handleNavigateToStep}
        onNavigateToGuidedHelp={handleNavigateToGuidedHelp}
      />

      {/* Enhanced Search Command Palette */}
      <EnhancedSearchCommandPalette 
        open={isOpen}
        onOpenChange={setIsOpen}
      />

      {/* Quick Actions FAB - Mobile Only */}
      <QuickActionsFab
        onSearchClick={() => setIsOpen(true)}
        onDocumentsClick={() => navigate('/dashboard/documents')}
        onHelpClick={handleNavigateToGuidedHelp}
        className="md:hidden"
      />
    </div>
  );
};

export default Dashboard;
