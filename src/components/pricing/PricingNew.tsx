
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Star, Users, Building2, Crown, Sparkles, Zap, Shield } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const PricingNew = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);

  const plans = [
    {
      name: "Bronze",
      price: "£97",
      period: "",
      description: "Perfect for solo entrepreneurs and small startups",
      icon: <Users className="w-6 h-6" />,
      badge: null,
      planId: "bronze",
      features: [
        "Basic business setup guidance",
        "Essential document templates",
        "Email support",
        "Basic compliance checking",
        "1 consultation session"
      ],
      color: "border-amber-200 bg-amber-50",
      buttonStyle: "bg-amber-600 hover:bg-amber-700 text-white",
      textColor: "text-amber-700"
    },
    {
      name: "Silver",
      price: "£197",
      period: "",
      description: "Ideal for growing businesses and established companies",
      icon: <Building2 className="w-6 h-6" />,
      badge: <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">Most Popular</Badge>,
      planId: "silver",
      features: [
        "Everything in Bronze",
        "Advanced business tools",
        "Priority email & chat support",
        "Custom document generation",
        "3 consultation sessions",
        "Advanced compliance monitoring",
        "Team collaboration tools"
      ],
      color: "border-gray-200 bg-gray-50 shadow-lg",
      buttonStyle: "bg-gray-600 hover:bg-gray-700 text-white",
      textColor: "text-gray-700"
    },
    {
      name: "Gold",
      price: "£297",
      period: "",
      description: "Advanced solution for established businesses",
      icon: <Crown className="w-6 h-6" />,
      badge: null,
      planId: "gold",
      features: [
        "Everything in Silver",
        "Premium business tools",
        "Priority phone support",
        "Advanced integrations",
        "5 consultation sessions",
        "Custom branding options",
        "Advanced analytics",
        "Dedicated support"
      ],
      color: "border-yellow-200 bg-yellow-50",
      buttonStyle: "bg-yellow-600 hover:bg-yellow-700 text-white",
      textColor: "text-yellow-700"
    },
    {
      name: "Platinum",
      price: "£497",
      period: "",
      description: "Comprehensive solution for large organizations",
      icon: <Crown className="w-6 h-6" />,
      badge: <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-100">Premium</Badge>,
      planId: "platinum",
      features: [
        "Everything in Gold",
        "Unlimited consultations",
        "Dedicated account manager",
        "Custom integrations",
        "White-label options",
        "24/7 phone support",
        "Legal review services",
        "Priority development requests"
      ],
      color: "border-purple-200 bg-purple-50",
      buttonStyle: "bg-purple-600 hover:bg-purple-700 text-white",
      textColor: "text-purple-700"
    }
  ];

  const handleSubscribe = async (planId: string, planName: string) => {
    console.log("Starting payment process for plan:", planName);
    
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to subscribe to a plan.",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoadingPlan(planName);
      console.log("Calling create-payment function...");
      
      // Get the current session to ensure we have a valid token
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !session?.access_token) {
        console.error('Session error:', sessionError);
        throw new Error('Please log in again to continue.');
      }

      console.log('Session found, calling create-payment function');
      
      const { data, error } = await supabase.functions.invoke('create-payment', {
        body: { planId },
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      console.log("Function response:", { data, error });

      if (error) {
        console.error("Function error:", error);
        throw error;
      }

      if (data?.url) {
        console.log("Redirecting to Stripe checkout:", data.url);
        
        // If we're in an iframe, jump the top window
        if (window.self !== window.top) {
          window.top!.location.href = data.url;
        } else {
          window.location.href = data.url;
        }
      } else {
        console.error("No checkout URL received:", data);
        throw new Error('No checkout URL received');
      }
    } catch (error) {
      console.error('Error creating checkout session:', error);
      toast({
        title: "Payment Error",
        description: "Failed to start checkout session. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoadingPlan(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white py-20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="w-8 h-8 text-blue-600" />
            <h1 className="text-4xl font-bold text-gray-900">Choose Your Plan</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Select the perfect plan to accelerate your business journey with Bizzy's comprehensive tools and expert guidance.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-8xl mx-auto">
          {plans.map((plan, index) => (
            <Card key={plan.name} className={`relative overflow-hidden ${plan.color} hover:shadow-xl transition-all duration-300`}>
              {plan.badge && (
                <div className="absolute top-4 right-4">
                  {plan.badge}
                </div>
              )}
              
              <CardHeader className="text-center pb-8">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <div className={plan.textColor}>
                    {plan.icon}
                  </div>
                  <CardTitle className={`text-2xl font-bold ${plan.textColor}`}>{plan.name}</CardTitle>
                </div>
                
                <div className="mb-4">
                  <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                  {plan.period && <span className="text-gray-600">{plan.period}</span>}
                </div>
                
                <CardDescription className="text-gray-600 text-base">
                  {plan.description}
                </CardDescription>
              </CardHeader>

              <CardContent className="pt-0">
                <Button 
                  className={`w-full mb-8 py-6 text-lg font-semibold ${plan.buttonStyle}`}
                  onClick={() => handleSubscribe(plan.planId, plan.name)}
                  disabled={loadingPlan === plan.name}
                >
                  {loadingPlan === plan.name ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Processing...
                    </div>
                  ) : (
                    <>
                      <Zap className="w-5 h-5 mr-2" />
                      Get Started
                    </>
                  )}
                </Button>

                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                    <Shield className="w-4 h-4" />
                    What's included:
                  </h4>
                  <ul className="space-y-3">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Additional Features */}
        <div className="mt-20 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Why Choose Bizzy?</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <Star className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Expert Guidance</h3>
              <p className="text-gray-600">Professional advice from business setup experts</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <Shield className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Compliance Assured</h3>
              <p className="text-gray-600">Stay compliant with UK business regulations</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                <Zap className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Fast Setup</h3>
              <p className="text-gray-600">Get your business running in days, not weeks</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingNew;
