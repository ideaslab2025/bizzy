import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Sparkles, Zap, Shield, Check, Users, Building2, Crown } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EnhancedCTAButton } from "@/components/ui/enhanced-cta-button";
import { PricingSkeleton } from "./PricingSkeleton";

export const PricingSection = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time for pricing data
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const plans = [
    {
      name: "Bronze",
      price: "£100",
      description: "Perfect for solo entrepreneurs and small startups",
      icon: <Users className="w-6 h-6" />,
      badge: null,
      planId: "bronze",
      features: ["Basic business setup guidance", "Essential document templates", "Email support", "Basic compliance checking", "1 consultation session"],
      color: "border-amber-200 bg-amber-50",
      buttonStyle: "bg-amber-600 hover:bg-amber-700 text-white",
      textColor: "text-amber-700"
    },
    {
      name: "Silver",
      price: "£200",
      description: "Ideal for growing businesses and established companies",
      icon: <Building2 className="w-6 h-6" />,
      badge: <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">Most Popular</Badge>,
      planId: "silver",
      features: ["Everything in Bronze", "Advanced business tools", "Priority email & chat support", "Custom document generation", "3 consultation sessions", "Advanced compliance monitoring", "Team collaboration tools"],
      color: "border-gray-200 bg-gray-50 shadow-lg",
      buttonStyle: "bg-gray-600 hover:bg-gray-700 text-white",
      textColor: "text-gray-700"
    },
    {
      name: "Gold",
      price: "£350",
      description: "Advanced solution for established businesses",
      icon: <Crown className="w-6 h-6" />,
      badge: null,
      planId: "gold",
      features: ["Everything in Silver", "Premium business tools", "Priority phone support", "Advanced integrations", "5 consultation sessions", "Custom branding options", "Advanced analytics", "Dedicated support"],
      color: "border-yellow-200 bg-yellow-50",
      buttonStyle: "bg-yellow-600 hover:bg-yellow-700 text-white",
      textColor: "text-yellow-700"
    },
    {
      name: "Platinum",
      price: "£500",
      description: "Comprehensive solution for large organizations",
      icon: <Crown className="w-6 h-6" />,
      badge: <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-100">Premium</Badge>,
      planId: "platinum",
      features: ["Everything in Gold", "Unlimited consultations", "Dedicated account manager", "Custom integrations", "White-label options", "24/7 phone support", "Legal review services", "Priority development requests"],
      color: "border-purple-200 bg-purple-50",
      buttonStyle: "bg-purple-600 hover:bg-purple-700 text-white",
      textColor: "text-purple-700"
    }
  ];

  return (
    <section id="pricing" className="py-20 bg-gradient-to-br from-blue-800/50 to-blue-900/30">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="w-8 h-8 text-blue-600" />
            <h1 className="text-4xl font-bold text-white">Choose Your Plan</h1>
          </div>
          <p className="text-xl text-blue-100/80 max-w-3xl mx-auto">Select the perfect one-off plan (no subscriptions!) to accelerate your business journey with Bizzy's comprehensive tools and expert guidance.</p>
        </div>

        {/* Pricing Cards */}
        {isLoading ? (
          <PricingSkeleton />
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 max-w-8xl mx-auto touch-interaction-spacing">
            {plans.map((plan) => (
              <Card key={plan.name} className={`relative overflow-hidden ${plan.color} hover:shadow-xl transition-all duration-300 touch-target-card`}>
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
                  </div>
                  
                  <CardDescription className="text-gray-600 text-base">
                    {plan.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="pt-0">
                  <Link to={`/pricing?plan=${plan.planId}`} className="touch-target-cta">
                    <EnhancedCTAButton 
                      variant="primary" 
                      size="lg" 
                      className="w-full mb-8"
                      showArrow
                    >
                      <Zap className="w-5 h-5 mr-2" />
                      Get Started
                    </EnhancedCTAButton>
                  </Link>

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
        )}
      </div>
    </section>
  );
};
