import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, FileText, Building, Users, Crown } from "lucide-react";
import { PricingSkeleton } from "./PricingSkeleton";
import { ErrorRetry } from "@/components/ui/error-retry";
import { NetworkError } from "@/components/ui/network-error";
import { Link } from "react-router-dom";

export const PricingSection = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isNetworkError, setIsNetworkError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  const fetchPricingData = async () => {
    try {
      setLoading(true);
      setError(null);
      setIsNetworkError(false);
      
      // Simulate API call - replace with actual pricing data fetch
      await new Promise((resolve, reject) => {
        setTimeout(() => {
          // Simulate occasional failures for demonstration
          if (Math.random() < 0.1 && retryCount === 0) {
            reject(new Error('Failed to load pricing'));
          } else {
            resolve(null);
          }
        }, Math.random() * 1000 + 500);
      });
      
    } catch (err) {
      console.error('Pricing fetch error:', err);
      if (!navigator.onLine) {
        setIsNetworkError(true);
      } else {
        setError('Unable to load pricing information');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPricingData();
  }, []);

  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
    fetchPricingData();
  };

  const tiers = [
    {
      name: "Essential Start",
      price: "£49",
      description: "Perfect for solo entrepreneurs just getting started",
      icon: FileText,
      popular: false,
      features: [
        "Complete business setup checklist",
        "20+ essential document templates", 
        "Step-by-step guidance videos",
        "Tax registration walkthrough",
        "Banking setup assistance",
        "Basic compliance calendar",
        "Email support"
      ]
    },
    {
      name: "Business Builder",
      price: "£99",
      description: "Ideal for growing businesses with employees",
      icon: Building,
      popular: true,
      features: [
        "Everything in Essential Start",
        "50+ advanced document templates",
        "Employment law compliance pack",
        "HR policies & procedures",
        "Health & safety templates",
        "GDPR compliance toolkit",
        "Quarterly legal updates",
        "Priority email support"
      ]
    },
    {
      name: "Scale & Succeed",
      price: "£199",
      description: "For established businesses ready to scale",
      icon: Users,
      popular: false,
      features: [
        "Everything in Business Builder",
        "100+ premium templates",
        "Advanced compliance monitoring",
        "Custom policy generator",
        "Multi-location setup guidance",
        "Partnership & shareholder docs",
        "Monthly compliance reviews",
        "Phone & email support"
      ]
    },
    {
      name: "Enterprise Ready",
      price: "£399",
      description: "Comprehensive solution for complex businesses",
      icon: Crown,
      popular: false,
      features: [
        "Everything in Scale & Succeed",
        "Unlimited document generation",
        "Dedicated account manager",
        "Custom legal document review",
        "Priority compliance alerts",
        "Advanced reporting dashboard",
        "White-label options",
        "24/7 priority support"
      ]
    }
  ];

  if (loading) {
    return (
      <section id="pricing" className="py-20 bg-gradient-to-br from-blue-900/20 to-blue-800/10">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 text-[#3b82f6]">Choose Your Business Journey</h2>
            <p className="text-xl text-blue-100/80 max-w-3xl mx-auto">One-time payment, lifetime access. No subscriptions, no hidden fees.</p>
          </div>
          <PricingSkeleton />
        </div>
      </section>
    );
  }

  if (error || isNetworkError) {
    return (
      <section id="pricing" className="py-20 bg-gradient-to-br from-blue-900/20 to-blue-800/10">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 text-[#3b82f6]">Choose Your Business Journey</h2>
            <p className="text-xl text-blue-100/80 max-w-3xl mx-auto">One-time payment, lifetime access. No subscriptions, no hidden fees.</p>
          </div>
          <div className="max-w-2xl mx-auto">
            {isNetworkError ? (
              <NetworkError onRetry={handleRetry} isOffline={!navigator.onLine} />
            ) : (
              <ErrorRetry 
                message={error || "Failed to load pricing information"}
                onRetry={handleRetry}
              />
            )}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="pricing" className="py-20 bg-gradient-to-br from-blue-900/20 to-blue-800/10">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4 text-[#3b82f6]">Choose Your Business Journey</h2>
          <p className="text-xl text-blue-100/80 max-w-3xl mx-auto">One-time payment, lifetime access. No subscriptions, no hidden fees.</p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 max-w-8xl mx-auto touch-interaction-spacing">
          {tiers.map((tier, index) => {
            const Icon = tier.icon;
            return (
              <Card key={index} className={`relative overflow-hidden bg-white hover:shadow-xl transition-all duration-300 touch-target-card ${
                tier.popular ? 'ring-2 ring-[#3b82f6] scale-105' : ''
              }`}>
                {tier.popular && (
                  <div className="absolute top-0 left-0 right-0">
                    <div className="bg-[#3b82f6] text-white text-center py-2 text-sm font-medium">
                      Most Popular
                    </div>
                  </div>
                )}
                
                <CardHeader className={`text-center ${tier.popular ? 'pt-12' : 'pt-8'} pb-8`}>
                  <div className="flex items-center justify-center gap-3 mb-4">
                    <Icon className="w-6 h-6 text-[#3b82f6]" />
                    <h3 className="text-2xl font-bold text-gray-900">{tier.name}</h3>
                  </div>
                  
                  <div className="mb-4">
                    <span className="text-4xl font-bold text-[#3b82f6]">{tier.price}</span>
                    <span className="text-gray-600 ml-1">one-time</span>
                  </div>
                  
                  <p className="text-gray-600 text-sm">{tier.description}</p>
                </CardHeader>

                <CardContent className="pt-0">
                  <Link to="/register">
                    <Button 
                      className={`w-full mb-8 touch-target-cta ${
                        tier.popular 
                          ? 'bg-[#3b82f6] hover:bg-[#2563eb] text-white' 
                          : 'bg-white border-2 border-[#3b82f6] text-[#3b82f6] hover:bg-[#3b82f6] hover:text-white'
                      }`}
                    >
                      Get Started
                    </Button>
                  </Link>

                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-sm font-semibold text-gray-900">
                      <Check className="w-4 h-4 text-[#3b82f6]" />
                      <span>What's included:</span>
                    </div>
                    <div className="space-y-3">
                      {tier.features.map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-start gap-3">
                          <Check className="w-5 h-5 text-[#3b82f6] mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700 text-sm">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="text-center mt-12">
          <p className="text-blue-100/60 text-sm mb-4">
            All plans include 12 months of updates • 30-day money-back guarantee
          </p>
          <div className="flex flex-wrap justify-center gap-6 text-sm text-blue-100/80">
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-[#3b82f6]" />
              <span>Instant access</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-[#3b82f6]" />
              <span>UK-specific content</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-[#3b82f6]" />
              <span>No ongoing fees</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
