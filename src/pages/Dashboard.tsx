
import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { PersonalizedDashboard } from '@/components/dashboard/PersonalizedDashboard';
import { EnhancedSearchCommandPalette } from '@/components/ui/enhanced-search-command-palette';
import { GlobalSearchTrigger } from '@/components/ui/global-search-trigger';
import { useCommandPalette } from '@/hooks/useCommandPalette';

const Dashboard = () => {
  const { user } = useAuth();
  const { isOpen, setIsOpen } = useCommandPalette();

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Global Search Bar */}
      <div className="px-4 lg:px-0">
        <GlobalSearchTrigger 
          onClick={() => setIsOpen(true)}
          className="max-w-md"
        />
      </div>

      {/* Main Dashboard Content */}
      <PersonalizedDashboard />

      {/* Enhanced Search Command Palette */}
      <EnhancedSearchCommandPalette 
        open={isOpen}
        onOpenChange={setIsOpen}
      />
    </div>
  );
};

export default Dashboard;
