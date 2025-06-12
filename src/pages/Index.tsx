
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EnhancedCTAButton } from "@/components/ui/enhanced-cta-button";
import { 
  CheckCircle, 
  ArrowRight, 
  Zap, 
  Shield, 
  Users, 
  FileText,
  Rocket,
  Star,
  TrendingUp,
  Clock,
  Award,
  Target
} from "lucide-react";

const Index = () => {
  const features = [
    {
      title: "Smart Document Templates",
      description: "Professionally crafted templates that adapt to your business needs",
      icon: FileText,
      color: "text-bizzy-blue"
    },
    {
      title: "Step-by-Step Guidance",
      description: "Clear, actionable steps to set up your business correctly",
      icon: Target,
      color: "text-bizzy-blue"
    },
    {
      title: "AI-Powered Assistant",
      description: "Get instant answers and personalized recommendations",
      icon: Zap,
      color: "text-blue-600"
    },
    {
      title: "Compliance Made Easy",
      description: "Stay compliant with UK business regulations effortlessly",
      icon: Shield,
      color: "text-blue-700"
    },
    {
      title: "Progress Tracking",
      description: "Monitor your business setup journey with visual progress indicators",
      icon: TrendingUp,
      color: "text-bizzy-blue"
    },
    {
      title: "Time-Saving Automation",
      description: "Automate repetitive tasks and focus on what matters most",
      icon: Clock,
      color: "text-blue-600"
    }
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Startup Founder",
      content: "Bizzy made setting up my business incredibly straightforward. What would have taken weeks was done in days.",
      rating: 5
    },
    {
      name: "Michael Chen",
      role: "Small Business Owner",
      content: "The step-by-step guidance and templates saved me thousands in legal fees. Highly recommended!",
      rating: 5
    },
    {
      name: "Emma Williams",
      role: "Entrepreneur",
      content: "Finally, a platform that makes business setup simple and stress-free. The AI assistant is brilliant.",
      rating: 5
    }
  ];

  const pricingPlans = [
    {
      name: "Starter",
      price: "Free",
      description: "Perfect for getting started",
      features: [
        "Basic document templates",
        "Step-by-step guidance",
        "Community support",
        "Progress tracking"
      ],
      popular: false
    },
    {
      name: "Professional",
      price: "£29",
      period: "/month",
      description: "Everything you need to succeed",
      features: [
        "All Starter features",
        "Premium templates",
        "AI-powered assistant",
        "Priority support",
        "Advanced analytics",
        "Custom branding"
      ],
      popular: true
    },
    {
      name: "Enterprise",
      price: "Custom",
      description: "For larger organizations",
      features: [
        "All Professional features",
        "Custom integrations",
        "Dedicated support",
        "Team collaboration",
        "Advanced security",
        "Training sessions"
      ],
      popular: false
    }
  ];

  return (
    <div className="rock-textured-bg min-h-screen">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/85 backdrop-blur-md border-b border-blue-100/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center">
              <img 
                src="/lovable-uploads/502b3627-55d4-4915-b44e-a2aa01e5751e.png" 
                alt="Bizzy Logo" 
                className="h-16 w-16 mr-4"
              />
              <span className="text-3xl font-bold text-bizzy-blue font-display">Bizzy</span>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-blue-700 hover:text-bizzy-blue font-semibold text-lg transition-colors">Features</a>
              <a href="#testimonials" className="text-blue-700 hover:text-bizzy-blue font-semibold text-lg transition-colors">Testimonials</a>
              <a href="#pricing" className="text-blue-700 hover:text-bizzy-blue font-semibold text-lg transition-colors">Pricing</a>
              <Link to="/login">
                <Button variant="outline" className="font-semibold text-lg border-blue-300 text-blue-700 hover:bg-blue-50">Login</Button>
              </Link>
              <Link to="/register">
                <EnhancedCTAButton variant="primary" size="lg">
                  Get Started
                </EnhancedCTAButton>
              </Link>
            </div>

            <div className="md:hidden">
              <Button variant="ghost" size="icon">
                <svg className="w-6 h-6 text-blue-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-24 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-charcoal mb-8 font-display leading-tight">
                Business without the{" "}
                <span className="text-bizzy-blue bg-gradient-to-r from-bizzy-blue to-blue-600 bg-clip-text text-transparent">busyness</span>
              </h1>
              <p className="text-2xl md:text-3xl text-blue-800 mb-12 max-w-4xl mx-auto font-semibold leading-relaxed">
                All the steps for helping you after company setup, with personalised document templates, 
                step-by-step process guidance and AI assistance
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                <Link to="/register">
                  <EnhancedCTAButton variant="primary" size="lg" showArrow className="text-xl px-12 py-6">
                    Start Your Journey
                  </EnhancedCTAButton>
                </Link>
                <Link to="/pricing">
                  <Button variant="outline" size="lg" className="text-xl px-12 py-6 border-blue-300 text-blue-700 hover:bg-blue-50 font-semibold">
                    View Pricing
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-charcoal mb-6 font-display">
              Everything You Need to Succeed
            </h2>
            <p className="text-2xl text-blue-800 max-w-3xl mx-auto font-semibold">
              Comprehensive tools and guidance to make your business setup journey smooth and successful
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                >
                  <Card className="card-professional-hover h-full bg-white/90 backdrop-blur-sm border-blue-200/50">
                    <CardHeader>
                      <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-bizzy-blue to-blue-600 flex items-center justify-center mb-6">
                        <Icon className="w-8 h-8 text-white" />
                      </div>
                      <CardTitle className="text-2xl font-bold text-charcoal font-display">{feature.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-blue-800 text-lg font-medium leading-relaxed">{feature.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-charcoal mb-6 font-display">
              Trusted by Entrepreneurs
            </h2>
            <p className="text-2xl text-blue-800 max-w-3xl mx-auto font-semibold">
              See what successful business owners are saying about Bizzy
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
              >
                <Card className="card-professional-hover h-full bg-white/90 backdrop-blur-sm border-blue-200/50">
                  <CardContent className="pt-8">
                    <div className="flex items-center mb-6">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-6 h-6 text-bizzy-blue fill-current" />
                      ))}
                    </div>
                    <p className="text-blue-800 mb-8 italic text-lg font-medium leading-relaxed">"{testimonial.content}"</p>
                    <div>
                      <p className="font-bold text-charcoal text-lg font-display">{testimonial.name}</p>
                      <p className="text-blue-600 font-semibold">{testimonial.role}</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-charcoal mb-6 font-display">
              Simple, Transparent Pricing
            </h2>
            <p className="text-2xl text-blue-800 max-w-3xl mx-auto font-semibold">
              Choose the plan that fits your business needs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {pricingPlans.map((plan, index) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                className="relative"
              >
                {plan.popular && (
                  <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
                    <span className="bg-bizzy-blue text-white px-6 py-2 rounded-full text-lg font-bold">
                      Most Popular
                    </span>
                  </div>
                )}
                <Card className={`card-professional-hover h-full bg-white/90 backdrop-blur-sm ${plan.popular ? 'ring-4 ring-bizzy-blue border-bizzy-blue' : 'border-blue-200/50'}`}>
                  <CardHeader className="text-center">
                    <CardTitle className="text-3xl font-black text-charcoal font-display">{plan.name}</CardTitle>
                    <div className="mt-6">
                      <span className="text-5xl font-black text-bizzy-blue font-display">{plan.price}</span>
                      {plan.period && <span className="text-blue-600 text-xl font-semibold">{plan.period}</span>}
                    </div>
                    <p className="text-blue-800 mt-4 text-lg font-semibold">{plan.description}</p>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-4 mb-10">
                      {plan.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center">
                          <CheckCircle className="w-6 h-6 text-bizzy-blue mr-4 flex-shrink-0" />
                          <span className="text-blue-800 font-medium text-lg">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Link to="/register" className="block">
                      <EnhancedCTAButton 
                        variant={plan.popular ? "primary" : "outline"} 
                        className="w-full text-lg py-4"
                      >
                        {plan.name === "Enterprise" ? "Contact Sales" : "Get Started"}
                      </EnhancedCTAButton>
                    </Link>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Card className="card-professional bg-gradient-to-r from-bizzy-blue to-blue-700 text-white border-0">
            <CardContent className="py-20">
              <h2 className="text-4xl md:text-5xl font-black mb-6 font-display">
                Ready to Transform Your Business Setup?
              </h2>
              <p className="text-2xl mb-12 text-blue-100 font-semibold leading-relaxed">
                Join thousands of entrepreneurs who've simplified their journey with Bizzy
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <Link to="/register">
                  <EnhancedCTAButton variant="secondary" size="lg" showArrow className="text-xl px-12 py-6">
                    Start Free Today
                  </EnhancedCTAButton>
                </Link>
                <Link to="/pricing">
                  <Button variant="outline" size="lg" className="text-xl px-12 py-6 border-white text-white hover:bg-white hover:text-bizzy-blue font-semibold">
                    View Plans
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 border-t border-blue-200/50 bg-white/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-6 md:mb-0">
              <img 
                src="/lovable-uploads/502b3627-55d4-4915-b44e-a2aa01e5751e.png" 
                alt="Bizzy Logo" 
                className="h-12 w-12 mr-4"
              />
              <span className="text-2xl font-bold text-bizzy-blue font-display">Bizzy</span>
            </div>
            <div className="flex space-x-8">
              <a href="#" className="text-blue-700 hover:text-bizzy-blue font-semibold text-lg transition-colors">Privacy</a>
              <a href="#" className="text-blue-700 hover:text-bizzy-blue font-semibold text-lg transition-colors">Terms</a>
              <a href="#" className="text-blue-700 hover:text-bizzy-blue font-semibold text-lg transition-colors">Support</a>
            </div>
          </div>
          <div className="mt-10 pt-10 border-t border-blue-200/50 text-center">
            <p className="text-blue-600 font-medium text-lg">© 2024 Bizzy. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
