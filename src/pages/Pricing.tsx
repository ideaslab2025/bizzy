
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/sonner";
import { PlanCard } from "@/components/pricing/PlanCard";
import { pricingPlans } from "@/components/pricing/planData";
import { PricingHeader } from "@/components/pricing/PricingHeader";
import { PricingFooter } from "@/components/pricing/PricingFooter";

const Pricing = () => {
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const handleSelectPlan = (planId: string) => {
    setSelectedPlan(planId);
  };
  
  const handleProceedToPayment = () => {
    if (!selectedPlan) {
      toast.error("Please select a plan to continue.");
      return;
    }
    
    setIsLoading(true);
    // This is a placeholder for Stripe integration
    // Once Supabase and Stripe are connected, replace with actual payment code
    setTimeout(() => {
      toast.success(`Processing ${selectedPlan} plan payment...`);
      setIsLoading(false);
      navigate("/dashboard");
    }, 1500);
  };
  
  return (
    <div className="min-h-screen bg-[#0a192f] py-16">
      <div className="container mx-auto px-4">
        <PricingHeader 
          title="Choose Your Plan" 
          description="Select the package that best suits your business needs. All plans include a one-time payment with no recurring fees."
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {pricingPlans.map((plan) => (
            <PlanCard 
              key={plan.id}
              plan={plan}
              isSelected={selectedPlan === plan.id}
              onSelect={handleSelectPlan}
            />
          ))}
        </div>
        
        <PricingFooter 
          selectedPlan={selectedPlan}
          isLoading={isLoading}
          onProceed={handleProceedToPayment}
        />
      </div>
    </div>
  );
};

export default Pricing;
