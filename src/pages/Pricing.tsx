
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
      color: "bg-gradient-to-b from-amber-700/80 to-amber-900/60",
      textColor: "text-white",
      borderColor: "border-amber-600",
      hoverShadow: "hover:shadow-amber-500/50",
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
      color: "bg-gradient-to-b from-slate-300/80 to-slate-500/60",
      textColor: "text-white", 
      borderColor: "border-slate-400",
      hoverShadow: "hover:shadow-slate-400/50",
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
      color: "bg-gradient-to-b from-amber-400/80 to-amber-600/60",
      textColor: "text-white",
      borderColor: "border-amber-500",
      hoverShadow: "hover:shadow-amber-400/50",
      features: [
        "Everything in Silver",
        "Complete document engine",
        "Advanced sector-specific guidance",
        "Priority support"
      ],
      recommended: true
    },
    {
      id: "platinum",
      title: "Platinum",
      price: "£500",
      color: "bg-gradient-to-b from-slate-50 via-slate-200 to-slate-300",
      textColor: "text-gray-800",
      borderColor: "border-slate-400",
      hoverShadow: "hover:shadow-slate-300/50",
      features: [
        "Everything in Gold",
        "Full access to all resources",
        "Video consultations with experts",
        "Custom document customization"
      ]
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
    <div className="min-h-screen bg-[#0a192f] py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h1 className="text-3xl font-bold mb-4 text-[#3b82f6]">Choose Your Plan</h1>
          <p className="text-lg text-blue-100">
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
                  ? "border-[#1d4ed8] ring-2 ring-[#1d4ed8] shadow-2xl shadow-[#1d4ed8]/40" 
                  : plan.borderColor
              } ${plan.color} cursor-pointer relative backdrop-blur-sm bg-opacity-70 flex flex-col
              transform transition-all duration-300 ease-out
              hover:-translate-y-2 hover:scale-105
              hover:shadow-2xl ${plan.hoverShadow}
              hover:brightness-110`}
              onClick={() => handleSelectPlan(plan.id)}
              style={{
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                boxShadow: selectedPlan === plan.id 
                  ? '0 25px 50px -12px rgba(29, 78, 216, 0.4)' 
                  : '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
              }}
              onMouseEnter={(e) => {
                if (selectedPlan !== plan.id) {
                  e.currentTarget.style.boxShadow = '0 25px 50px -12px rgba(59, 130, 246, 0.5)';
                }
              }}
              onMouseLeave={(e) => {
                if (selectedPlan !== plan.id) {
                  e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)';
                }
              }}
            >
              {plan.recommended && (
                <Badge className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-[#1d4ed8] px-6 py-1 text-base font-bold z-20">
                  Recommended
                </Badge>
              )}
              <CardHeader className={plan.recommended ? "pt-10" : ""}>
                <CardTitle className={`${plan.id === "platinum" ? "text-gray-800" : plan.recommended ? "text-[#3b82f6]" : plan.textColor} transition-all duration-300`}>{plan.title}</CardTitle>
                <div className={`text-3xl font-bold ${plan.id === "platinum" ? "text-gray-800" : plan.textColor} transition-all duration-300`}>{plan.price}</div>
                <CardDescription className={`${plan.id === "platinum" ? "text-gray-800" : plan.textColor} opacity-90 transition-all duration-300`}>One-time payment</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <ul className="space-y-2">
                  {plan.features.map((feature, i) => (
                    <li key={i} className={`flex items-center gap-2 ${plan.id === "platinum" ? "text-gray-800" : plan.textColor} transition-all duration-300`}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`${plan.id === "platinum" ? "text-gray-800" : "text-[#3b82f6]"} transition-all duration-300`}>
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter className="mt-auto">
                <Button 
                  className={`w-full ${
                    selectedPlan === plan.id
                      ? "bg-[#1d4ed8] hover:bg-[#1d4ed8]/80" 
                      : plan.id === "platinum"
                        ? "bg-gray-800 hover:bg-gray-700 text-white"
                        : "bg-blue-900/50 hover:bg-[#1d4ed8]/60 border border-blue-700"
                  } transition-all duration-300`}
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
            className="bg-[#1d4ed8] hover:bg-[#1d4ed8]/80 px-8 py-6 text-lg"
            size="lg"
          >
            {isLoading ? "Processing..." : "Proceed to Payment"}
          </Button>
          <p className="mt-4 text-sm text-blue-100/70">
            Secure payment powered by Stripe. Your data is encrypted and secure.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
