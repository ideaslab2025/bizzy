
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/components/ui/sonner";

const Pricing = () => {
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const plans = [
    {
      id: "bronze",
      title: "Bronze",
      price: "£100",
      features: [
        "Basic company setup guidance",
        "Essential document templates",
        "Standard support",
        "Basic AI assistant access"
      ]
    },
    {
      id: "silver",
      title: "Silver",
      price: "£200",
      features: [
        "Everything in Bronze",
        "Extended document library",
        "Tax & compliance guidance",
        "Full AI assistant access"
      ]
    },
    {
      id: "gold",
      title: "Gold",
      price: "£300",
      features: [
        "Everything in Silver",
        "Complete document engine",
        "Advanced sector-specific guidance",
        "Priority support"
      ]
    },
    {
      id: "platinum",
      title: "Platinum",
      price: "£500",
      features: [
        "Everything in Gold",
        "Full access to all resources",
        "Video consultations with experts",
        "Custom document customization"
      ],
      highlight: true
    }
  ];
  
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
    <div className="min-h-screen bg-muted/30 py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h1 className="text-3xl font-bold mb-4">Choose Your Plan</h1>
          <p className="text-lg text-muted-foreground">
            Select the package that best suits your business needs.
            All plans include a one-time payment with no recurring fees.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {plans.map((plan) => (
            <Card 
              key={plan.id} 
              className={`${
                selectedPlan === plan.id 
                  ? "border-[#0088cc] ring-2 ring-[#0088cc]" 
                  : plan.highlight 
                    ? "border-[#0088cc]" 
                    : ""
              } cursor-pointer transition-all`}
              onClick={() => handleSelectPlan(plan.id)}
            >
              <CardHeader>
                <CardTitle>{plan.title}</CardTitle>
                <div className="text-3xl font-bold">{plan.price}</div>
                <CardDescription>One-time payment</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#0088cc]">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button 
                  className={`w-full ${
                    selectedPlan === plan.id || plan.highlight 
                      ? "bg-[#0088cc] hover:bg-[#0088cc]/90" 
                      : "variant-outline"
                  }`}
                  variant={selectedPlan === plan.id || plan.highlight ? "default" : "outline"}
                >
                  {selectedPlan === plan.id ? "Selected" : "Select Plan"}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <Button 
            onClick={handleProceedToPayment}
            disabled={!selectedPlan || isLoading}
            className="bg-[#0088cc] hover:bg-[#0088cc]/90 px-8 py-6 text-lg"
            size="lg"
          >
            {isLoading ? "Processing..." : "Proceed to Payment"}
          </Button>
          <p className="mt-4 text-sm text-muted-foreground">
            Secure payment powered by Stripe. Your data is encrypted and secure.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
