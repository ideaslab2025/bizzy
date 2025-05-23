
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
        className="bg-[#1d4ed8] hover:bg-[#1d4ed8]/80 hover:-translate-y-1 hover:shadow-lg hover:shadow-blue-700/30 px-8 py-6 text-lg transition-all duration-300"
        size="lg"
      >
        {isLoading ? "Processing..." : "Proceed to Payment"}
      </Button>
      <p className="mt-4 text-sm text-blue-100/70">
        Secure payment powered by Stripe. Your data is encrypted and secure.
      </p>
    </div>
  );
};
