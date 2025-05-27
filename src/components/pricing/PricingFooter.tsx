
import React from 'react';
import { Button } from "@/components/ui/button";

interface PricingFooterProps {
  selectedPlan: string | null;
  isLoading: boolean;
  onProceed: () => void;
}

export const PricingFooter = ({ selectedPlan, isLoading, onProceed }: PricingFooterProps) => {
  return (
    <div className="mt-12 text-center">
      <Button 
        onClick={onProceed}
        disabled={!selectedPlan || isLoading}
        className="px-8 py-3 text-lg bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105"
      >
        {isLoading ? "Processing..." : "Proceed to Payment"}
      </Button>
      {!selectedPlan && (
        <p className="text-red-400 mt-4">Please select a plan to continue</p>
      )}
    </div>
  );
};
