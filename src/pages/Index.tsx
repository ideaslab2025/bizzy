import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, ArrowRight, Star, Users, Building, Award, Menu, X, User, LogOut } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import BizzyCharacter from "@/components/BizzyCharacter";
import BizzyChat from "@/components/BizzyChat";
import Testimonials from "@/components/Testimonials";

const Index = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isAccountDropdownOpen, setIsAccountDropdownOpen] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const testimonials = [
    {
      name: "Sarah Thompson",
      title: "Founder, GreenTech Innovations",
      quote: "Bizzy has been a game-changer for our startup. The AI-driven legal guidance is incredibly accurate and has saved us countless hours and legal fees.",
      image: "/placeholder-user.jpg",
      rating: 5
    },
    {
      name: "David Miller",
      title: "CEO, Millennial Marketing",
      quote: "As a fast-growing marketing agency, staying compliant with employment law is critical. Bizzy's HR tools and templates have made it easy to manage our team effectively.",
      image: "/placeholder-user.jpg",
      rating: 4
    },
    {
      name: "Emily Chen",
      title: "Owner, Chen & Co. Accountants",
      quote: "I recommend Bizzy to all my small business clients. The VAT and tax support is top-notch, and the document generation feature is a lifesaver during tax season.",
      image: "/placeholder-user.jpg",
      rating: 5
    }
  ];

  const pricingPlans = [
    {
      name: "Startup",
      price: "£29",
      period: "per month",
      description: "Perfect for new businesses just getting started",
      features: [
        "Business registration guidance",
        "Essential legal documents (10)",
        "Basic tax guidance",
        "Email support",
        "Startup checklist"
      ],
      cta: "Start Free Trial",
      popular: false,
      color: "from-blue-50 to-indigo-50"
    },
    {
      name: "Growth",
      price: "£59",
      period: "per month",
      description: "For growing businesses with expanding needs",
      features: [
        "Everything in Startup",
        "Advanced legal documents (25)",
        "HR policies & templates",
        "VAT registration assistance", 
        "Priority email support",
        "Monthly compliance reminders"
      ],
      cta: "Choose Growth",
      popular: true,
      color: "from-purple-50 to-pink-50"
    },
    {
      name: "Scale",
      price: "£99",
      period: "per month", 
      description: "For established businesses scaling operations",
      features: [
        "Everything in Growth",
        "Unlimited legal documents",
        "Employment law guidance",
        "Contract templates & review",
        "Phone + email support",
        "Quarterly business reviews"
      ],
      cta: "Choose Scale",
      popular: false,
      color: "from-green-50 to-emerald-50"
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "pricing",
      description: "Tailored solutions for large organizations",
      features: [
        "Everything in Scale",
        "Dedicated account manager",
        "Custom legal document creation",
        "Priority phone support",
        "On-site consultations",
        "Custom integrations"
      ],
      cta: "Contact Sales",
      popular: false,
      color: "from-slate-50 to-gray-50"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-[#0a192f]/95 backdrop-blur-sm border-b border-blue-900/20">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <img 
                src="/lovable-uploads/502b3627-55d4-4915-b44e-a2aa01e5751e.png" 
                alt="Bizzy Logo" 
                className="h-12 w-auto"
              />
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <Link to="/pricing" className="text-gray-300 hover:text-white transition-colors">
                Pricing
              </Link>
              
              {user ? (
                <div className="flex items-center gap-4">
                  <Link to="/dashboard">
                    <Button className="bg-[#1d4ed8] hover:bg-[#1e40af] text-white">
                      Dashboard
                    </Button>
                  </Link>
                  
                  {/* Account Dropdown */}
                  <div 
                    className="relative"
                    onMouseEnter={() => setIsAccountDropdownOpen(true)}
                    onMouseLeave={() => setIsAccountDropdownOpen(false)}
                  >
                    <DropdownMenu open={isAccountDropdownOpen} onOpenChange={setIsAccountDropdownOpen}>
                      <DropdownMenuTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="flex items-center gap-2 text-gray-300 hover:text-white hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 font-medium"
                        >
                          <User className="h-4 w-4" />
                          <span>
                            {user?.user_metadata?.company_name || 
                             (user?.user_metadata?.first_name 
                               ? `${user.user_metadata.first_name.charAt(0).toUpperCase() + user.user_metadata.first_name.slice(1)}`
                               : user?.email?.split('@')[0] || 'Account')}
                          </span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48 bg-white border shadow-lg z-50">
                        <DropdownMenuItem asChild>
                          <Link to="/dashboard/settings" className="flex items-center gap-2 w-full text-gray-700 hover:text-gray-900 hover:bg-gray-50 px-2 py-2 cursor-pointer">
                            <User className="h-4 w-4" />
                            Account Settings
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          onClick={handleSignOut}
                          className="flex items-center gap-2 text-red-600 focus:text-red-600 hover:bg-red-50 cursor-pointer px-2 py-2"
                        >
                          <LogOut className="h-4 w-4" />
                          Sign Out
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ) : (
                <div className="flex items-center space-x-4">
                  <Link to="/login" className="text-[#1d4ed8] hover:text-[#1e40af] font-medium">
                    Sign In
                  </Link>
                  <Link to="/register">
                    <Button className="bg-[#1d4ed8] hover:bg-[#1e40af] text-white">
                      Get Started
                    </Button>
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden text-gray-300 hover:text-white"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="h-10 w-10" /> : <Menu className="h-10 w-10" />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden py-4 border-t border-blue-900/20">
              <div className="flex flex-col space-y-4">
                <Link 
                  to="/pricing" 
                  className="text-gray-300 hover:text-white transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Pricing
                </Link>
                
                {user ? (
                  <div className="flex flex-col space-y-4">
                    <Link 
                      to="/dashboard"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Button className="bg-[#1d4ed8] hover:bg-[#1e40af] text-white w-full">
                        Dashboard
                      </Button>
                    </Link>
                    <Button 
                      variant="outline"
                      onClick={() => {
                        handleSignOut();
                        setIsMenuOpen(false);
                      }}
                      className="w-full text-lg py-2 px-4 border-gray-300 text-gray-300 hover:text-white hover:border-white"
                    >
                      Sign Out
                    </Button>
                  </div>
                ) : (
                  <div className="flex flex-col space-y-4">
                    <Link 
                      to="/login" 
                      className="text-[#1d4ed8] hover:text-[#1e40af] font-medium text-lg py-2 px-4"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Sign In
                    </Link>
                    <Link 
                      to="/register"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Button className="bg-[#1d4ed8] hover:bg-[#1e40af] text-white w-full text-lg py-2 px-4">
                        Get Started
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
              Your AI Business{" "}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Assistant
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Meet Bizzy - the AI that helps UK businesses navigate legal requirements, 
              generate documents, and stay compliant. From startup to scale-up.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              {user ? (
                <Link to="/dashboard">
                  <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                    Go to Dashboard
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              ) : (
                <>
                  <Link to="/register">
                    <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                      Get Started Free
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                  <Button 
                    variant="outline" 
                    size="lg" 
                    className="border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white px-8 py-4 text-lg transition-all duration-300 hover:-translate-y-1"
                    onClick={() => setIsChatOpen(true)}
                  >
                    Talk to Bizzy
                  </Button>
                </>
              )}
            </div>
            
            <div className="relative max-w-4xl mx-auto">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-400/20 blur-3xl"></div>
              <img 
                src="/lovable-uploads/502b3627-55d4-4915-b44e-a2aa01e5751e.png"
                alt="Bizzy AI Assistant"
                className="relative hero-image mx-auto max-w-md md:max-w-lg lg:max-w-xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Meet Bizzy Section */}
      <section id="meet-bizzy" className="py-6 px-4 bg-white/50">
        <div className="container max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Meet Bizzy</h2>
          <div className="grid md:grid-cols-2 gap-2 items-center">
            <div className="py-4">
              <BizzyCharacter className="mx-auto" />
            </div>
            <div className="py-2">
              <p className="text-lg text-gray-600 mb-2">
                Bizzy is your AI business assistant, specially trained on UK business law and regulations. 
                Get instant answers, generate documents, and stay compliant - all in plain English.
              </p>
              {!user && (
                <Button 
                  onClick={() => setIsChatOpen(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white my-2"
                >
                  Chat with Bizzy Now
                </Button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Everything You Need Section */}
      <section id="features" className="pt-12 pb-8 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Everything You Need to{" "}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Succeed
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From business registration to ongoing compliance, Bizzy provides comprehensive support 
              for UK businesses at every stage of growth.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {[
              {
                icon: <Building className="h-8 w-8 text-blue-600" />,
                title: "Business Setup",
                description: "Register your company, understand legal structures, and get started the right way with step-by-step guidance.",
                color: "from-blue-50 to-indigo-50"
              },
              {
                icon: <Users className="h-8 w-8 text-purple-600" />,
                title: "HR & Employment",
                description: "Create employment contracts, understand your obligations, and build compliant HR policies for your team.",
                color: "from-purple-50 to-pink-50"
              },
              {
                icon: <Award className="h-8 w-8 text-green-600" />,
                title: "Legal Compliance",
                description: "Stay on top of changing regulations, generate required documents, and avoid costly compliance mistakes.",
                color: "from-green-50 to-emerald-50"
              }
            ].map((feature, index) => (
              <Card key={index} className={`relative overflow-hidden bg-gradient-to-br ${feature.color} border-0 shadow-xl transition-all hover:-translate-y-1 hover:shadow-blue-500/30`}>
                <CardHeader>
                  <div className="flex items-center gap-3 mb-4">
                    {feature.icon}
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-700 text-base leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <Testimonials />

      {/* Pricing Section */}
      <section className="py-20 px-4 bg-white/50">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Simple, Transparent{" "}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Pricing
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Choose the plan that fits your business size and needs. All plans include access to Bizzy AI and core features.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 perspective-1000">
            {pricingPlans.map((plan, index) => (
              <Card 
                key={index} 
                className={`pricing-card relative overflow-hidden bg-gradient-to-br ${plan.color} border-0 shadow-xl ${plan.popular ? 'ring-2 ring-purple-500 scale-105' : ''}`}
              >
                {plan.popular && (
                  <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-center py-2 text-sm font-medium">
                    Most Popular
                  </div>
                )}
                <CardHeader className={plan.popular ? 'pt-8' : ''}>
                  <CardTitle className="text-2xl font-bold text-gray-900">{plan.name}</CardTitle>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                    <span className="text-gray-600">/{plan.period}</span>
                  </div>
                  <CardDescription className="text-gray-700">{plan.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-3">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start gap-3">
                        <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Link to="/pricing">
                    <Button 
                      className={`w-full pricing-button ${
                        plan.popular 
                          ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white' 
                          : 'bg-gray-900 hover:bg-gray-800 text-white'
                      }`}
                    >
                      {plan.cta}
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Transform Your Business?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
            Join thousands of UK businesses that trust Bizzy to handle their legal and compliance needs. 
            Get started today with a free consultation.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {user ? (
              <Link to="/dashboard">
                <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 text-lg shadow-xl">
                  Go to Dashboard
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            ) : (
              <>
                <Link to="/register">
                  <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 text-lg shadow-xl">
                    Start Free Trial
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 text-lg"
                  onClick={() => setIsChatOpen(true)}
                >
                  Talk to Bizzy
                </Button>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0a192f] text-gray-300 py-12 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <img 
                src="/lovable-uploads/502b3627-55d4-4915-b44e-a2aa01e5751e.png" 
                alt="Bizzy Logo" 
                className="h-12 w-auto mb-4"
              />
              <p className="text-gray-400">
                AI-powered business assistant for UK companies. Legal guidance, document generation, and compliance made simple.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-4">Product</h3>
              <ul className="space-y-2">
                <li><Link to="/pricing" className="hover:text-white transition-colors">Pricing</Link></li>
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Integrations</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-4">Support</h3>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-4">Legal</h3>
              <ul className="space-y-2">
                <li><Link to="/disclaimer" className="hover:text-white transition-colors">Disclaimer</Link></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Bizzy AI. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Chat Component */}
      <BizzyChat 
        isOpen={isChatOpen} 
        onClose={() => setIsChatOpen(false)} 
      />
    </div>
  );
};

export default Index;
