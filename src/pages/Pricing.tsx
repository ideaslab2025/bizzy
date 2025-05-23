
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
      color: "from-amber-700/80 to-amber-900/60",
      textColor: "text-white",
      borderColor: "border-amber-600",
      shadowClass: "shadow-amber-600/50",
      buttonClass: "bg-amber-700 hover:bg-amber-800 border border-amber-600",
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
      color: "from-slate-300/80 to-slate-500/60",
      textColor: "text-white", 
      borderColor: "border-slate-400",
      shadowClass: "shadow-slate-400/50",
      buttonClass: "bg-slate-600 hover:bg-slate-700 border border-slate-500",
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
      color: "from-amber-400/80 to-amber-600/60",
      textColor: "text-white",
      borderColor: "border-amber-500",
      shadowClass: "shadow-amber-500/50",
      buttonClass: "bg-blue-900/50 hover:bg-[#1d4ed8]/60 border border-blue-700",
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
      color: "from-slate-50 via-slate-200 to-slate-300",
      textColor: "text-gray-800",
      borderColor: "border-slate-400",
      shadowClass: "shadow-slate-300/80",
      buttonClass: "bg-gray-800 hover:bg-gray-700 text-white",
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
            <div key={plan.id} className="group perspective-1000">
              <div 
                className={`
                  relative transition-all duration-500 ease-out transform-gpu
                  group-hover:-translate-y-4 group-hover:scale-[1.03]
                  ${selectedPlan === plan.id ? "translate-y-[-1rem] scale-[1.03]" : ""}
                `}
              >
                <Card 
                  className={`
                    ${selectedPlan === plan.id 
                      ? `border-[#1d4ed8] ring-2 ring-[#1d4ed8] shadow-xl shadow-[#1d4ed8]/40` 
                      : `${plan.borderColor} shadow-md`
                    } 
                    group-hover:shadow-xl ${plan.shadowClass} group-hover:brightness-110
                    bg-gradient-to-b ${plan.color}
                    cursor-pointer relative backdrop-blur-sm bg-opacity-70 flex flex-col h-full
                    transition-all duration-300
                  `}
                  onClick={() => handleSelectPlan(plan.id)}
                >
                  {plan.recommended && (
                    <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-[#1d4ed8] px-6 py-1 text-sm font-bold z-20 shadow-md">
                      Recommended
                    </Badge>
                  )}
                  <CardHeader className={plan.recommended ? "pt-10" : ""}>
                    <CardTitle className={`${plan.id === "platinum" ? "text-gray-800" : plan.recommended ? "text-[#3b82f6]" : plan.textColor} text-xl`}>
                      {plan.title}
                    </CardTitle>
                    <div className={`text-4xl font-bold ${plan.id === "platinum" ? "text-gray-800" : plan.textColor} mt-2`}>
                      {plan.price}
                    </div>
                    <CardDescription className={`${plan.id === "platinum" ? "text-gray-700" : plan.textColor} opacity-90`}>
                      One-time payment
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <ul className="space-y-3">
                      {plan.features.map((feature, i) => (
                        <li key={i} className={`flex items-start gap-2 ${plan.id === "platinum" ? "text-gray-700" : plan.textColor}`}>
                          <svg 
                            xmlns="http://www.w3.org/2000/svg" 
                            width="20" 
                            height="20" 
                            viewBox="0 0 24 24" 
                            fill="none" 
                            stroke="currentColor" 
                            strokeWidth="2" 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            className={`${plan.id === "platinum" ? "text-gray-800" : "text-[#60a5fa]"} flex-shrink-0 mt-0.5`}
                          >
                            <polyline points="20 6 9 17 4 12"></polyline>
                          </svg>
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  <CardFooter className="mt-auto">
                    <Button 
                      className={`w-full transition-all duration-300 ${
                        selectedPlan === plan.id
                          ? "bg-[#1d4ed8] hover:bg-[#1d4ed8]/90 scale-105" 
                          : plan.buttonClass
                      }`}
                    >
                      {selectedPlan === plan.id ? "Selected" : "Select Plan"}
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <Button 
            onClick={handleProceedToPayment}
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
      </div>
    </div>
  );
};

export default Pricing;
