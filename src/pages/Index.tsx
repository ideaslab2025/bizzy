
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
      color: "text-blue-600"
    },
    {
      title: "Step-by-Step Guidance",
      description: "Clear, actionable steps to set up your business correctly",
      icon: Target,
      color: "text-green-600"
    },
    {
      title: "AI-Powered Assistant",
      description: "Get instant answers and personalized recommendations",
      icon: Zap,
      color: "text-purple-600"
    },
    {
      title: "Compliance Made Easy",
      description: "Stay compliant with UK business regulations effortlessly",
      icon: Shield,
      color: "text-red-600"
    },
    {
      title: "Progress Tracking",
      description: "Monitor your business setup journey with visual progress indicators",
      icon: TrendingUp,
      color: "text-yellow-600"
    },
    {
      title: "Time-Saving Automation",
      description: "Automate repetitive tasks and focus on what matters most",
      icon: Clock,
      color: "text-indigo-600"
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
    <div className="dashboard-bg-image min-h-screen">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 glass-navbar">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <img 
                src="/lovable-uploads/502b3627-55d4-4915-b44e-a2aa01e5751e.png" 
                alt="Bizzy Logo" 
                className="h-8 w-8 mr-3"
              />
              <span className="text-xl font-bold text-gray-900">Bizzy</span>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="nav-text text-gray-700 hover:text-gray-900">Features</a>
              <a href="#testimonials" className="nav-text text-gray-700 hover:text-gray-900">Testimonials</a>
              <a href="#pricing" className="nav-text text-gray-700 hover:text-gray-900">Pricing</a>
              <Link to="/login">
                <Button variant="ghost" className="nav-text">Login</Button>
              </Link>
              <Link to="/register">
                <EnhancedCTAButton variant="primary" size="sm">
                  Get Started
                </EnhancedCTAButton>
              </Link>
            </div>

            <div className="md:hidden">
              <Button variant="ghost" size="icon">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6">
                Business without the{" "}
                <span className="text-bizzy-blue">busyness</span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
                All the steps for helping you after company setup, with personalised document templates, 
                step-by-step process guidance and AI assistance
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link to="/register">
                  <EnhancedCTAButton variant="primary" size="lg" showArrow>
                    Start Your Journey
                  </EnhancedCTAButton>
                </Link>
                <Link to="/pricing">
                  <Button variant="outline" size="lg" className="btn-text">
                    View Pricing
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Everything You Need to Succeed
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Comprehensive tools and guidance to make your business setup journey smooth and successful
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                >
                  <Card className="card-professional-hover h-full">
                    <CardHeader>
                      <div className={`w-12 h-12 rounded-lg bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center mb-4`}>
                        <Icon className={`w-6 h-6 ${feature.color}`} />
                      </div>
                      <CardTitle className="text-xl font-bold text-gray-900">{feature.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600">{feature.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Trusted by Entrepreneurs
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              See what successful business owners are saying about Bizzy
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
              >
                <Card className="card-professional-hover h-full">
                  <CardContent className="pt-6">
                    <div className="flex items-center mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    <p className="text-gray-600 mb-6 italic">"{testimonial.content}"</p>
                    <div>
                      <p className="font-semibold text-gray-900">{testimonial.name}</p>
                      <p className="text-sm text-gray-500">{testimonial.role}</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Choose the plan that fits your business needs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pricingPlans.map((plan, index) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                className="relative"
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-bizzy-blue text-white px-4 py-1 rounded-full text-sm font-semibold">
                      Most Popular
                    </span>
                  </div>
                )}
                <Card className={`card-professional-hover h-full ${plan.popular ? 'ring-2 ring-bizzy-blue' : ''}`}>
                  <CardHeader className="text-center">
                    <CardTitle className="text-2xl font-bold text-gray-900">{plan.name}</CardTitle>
                    <div className="mt-4">
                      <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                      {plan.period && <span className="text-gray-500">{plan.period}</span>}
                    </div>
                    <p className="text-gray-600 mt-2">{plan.description}</p>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3 mb-8">
                      {plan.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center">
                          <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                          <span className="text-gray-600">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Link to="/register" className="block">
                      <EnhancedCTAButton 
                        variant={plan.popular ? "primary" : "outline"} 
                        className="w-full"
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
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Card className="card-professional bg-gradient-to-r from-bizzy-blue to-blue-700 text-white">
            <CardContent className="py-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Ready to Transform Your Business Setup?
              </h2>
              <p className="text-xl mb-8 text-blue-100">
                Join thousands of entrepreneurs who've simplified their journey with Bizzy
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/register">
                  <EnhancedCTAButton variant="secondary" size="lg" showArrow>
                    Start Free Today
                  </EnhancedCTAButton>
                </Link>
                <Link to="/pricing">
                  <Button variant="outline" size="lg" className="btn-text border-white text-white hover:bg-white hover:text-bizzy-blue">
                    View Plans
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <img 
                src="/lovable-uploads/502b3627-55d4-4915-b44e-a2aa01e5751e.png" 
                alt="Bizzy Logo" 
                className="h-8 w-8 mr-3"
              />
              <span className="text-xl font-bold text-gray-900">Bizzy</span>
            </div>
            <div className="flex space-x-6">
              <a href="#" className="text-gray-600 hover:text-gray-900 nav-text">Privacy</a>
              <a href="#" className="text-gray-600 hover:text-gray-900 nav-text">Terms</a>
              <a href="#" className="text-gray-600 hover:text-gray-900 nav-text">Support</a>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-200 text-center">
            <p className="text-gray-500">© 2024 Bizzy. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
