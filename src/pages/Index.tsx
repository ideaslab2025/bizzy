import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Menu, Star, User, LogOut, Check, Sparkles, Zap, Shield, Users, Building2, Crown } from "lucide-react";
import { Drawer, DrawerClose, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import BizzyCharacter from "@/components/BizzyCharacter";
import Testimonials from "@/components/Testimonials";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";
const Index = () => {
  const {
    user,
    signOut
  } = useAuth();
  const navigate = useNavigate();
  const [floatingPosition, setFloatingPosition] = useState({
    x: window.innerWidth - 150,
    y: window.innerHeight - 150
  });

  // Add refs for scroll targets
  const faqsRef = useRef<HTMLElement>(null);
  const featuresRef = useRef<HTMLElement>(null);
  useEffect(() => {
    const floatingAnimation = () => {
      setFloatingPosition(prev => ({
        x: window.innerWidth - 150 + Math.sin(Date.now() / 1000) * 10,
        y: window.innerHeight - 150 + Math.cos(Date.now() / 1200) * 15
      }));
      requestAnimationFrame(floatingAnimation);
    };
    const animation = requestAnimationFrame(floatingAnimation);
    const handleResize = () => {
      setFloatingPosition({
        x: window.innerWidth - 150,
        y: window.innerHeight - 150
      });
    };
    window.addEventListener('resize', handleResize);
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash === '#faqs' && faqsRef.current) {
        const yOffset = -100;
        const element = faqsRef.current;
        const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({
          top: y,
          behavior: 'smooth'
        });
      }
    };
    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => {
      cancelAnimationFrame(animation);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  // Function to handle scroll to sections
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const yOffset = -100;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({
        top: y,
        behavior: 'smooth'
      });
    }
  };
  const handleSignOut = async () => {
    try {
      await signOut();
      // Redirect will be handled by the auth state change
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  // Pricing plans for homepage display only
  const plans = [{
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
  }, {
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
  }, {
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
  }, {
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
  }];
  return <div className="flex flex-col min-h-screen bg-[#0a192f] text-white">
      {/* Header/Navigation */}
      <header className="border-b border-blue-900/30 sticky top-0 z-50 bg-[#0a192f] bg-opacity-100 backdrop-blur-md shadow-md">
        <div className="container mx-auto py-0 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2">
            <img src="/lovable-uploads/502b3627-55d4-4915-b44e-a2aa01e5751e.png" alt="Bizzy Logo" className="h-40" />
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex gap-6">
            <a href="#about" className="text-[#3b82f6] hover:text-[#60a5fa] transition text-xl font-bold">About</a>
            <a href="#features" className="text-[#3b82f6] hover:text-[#60a5fa] transition text-xl font-bold">Features</a>
            <a href="#pricing" className="text-[#3b82f6] hover:text-[#60a5fa] transition text-xl font-bold">Pricing</a>
            <a href="#faqs" className="text-[#3b82f6] hover:text-[#60a5fa] transition text-xl font-bold">FAQs</a>
          </nav>
          
          <div className="flex gap-2 items-center">
            {/* Show user account if logged in */}
            {user ? <>
                {/* Mobile Dashboard Button */}
                <Link to="/dashboard" className="md:hidden">
                  <Button variant="ghost" className="text-[#1d4ed8] hover:text-[#3b82f6] hover:bg-blue-900/30">
                    Dashboard
                  </Button>
                </Link>
                
                {/* Desktop Account Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild className="hidden md:flex">
                    <Button variant="ghost" className="flex items-center gap-2 text-[#1d4ed8] hover:text-[#3b82f6] hover:bg-blue-900/30 focus:outline-none focus:ring-2 focus:ring-blue-500 data-[state=open]:bg-blue-900/30">
                      <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-sm font-medium text-white">
                        {user?.user_metadata?.company_name?.charAt(0)?.toUpperCase() || user?.user_metadata?.first_name?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || 'U'}
                      </div>
                      <span className="hidden lg:inline">
                        {user?.user_metadata?.company_name || (user?.user_metadata?.first_name ? `${user.user_metadata.first_name.charAt(0).toUpperCase() + user.user_metadata.first_name.slice(1)}` : user?.email?.split('@')[0] || 'Account')}
                      </span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48 bg-white border shadow-lg z-50">
                    <DropdownMenuItem asChild>
                      <Link to="/dashboard" className="flex items-center gap-2 w-full text-gray-700 hover:text-gray-900 hover:bg-gray-50 px-2 py-2 cursor-pointer">
                        <User className="h-4 w-4" />
                        Dashboard
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleSignOut} className="flex items-center gap-2 text-red-600 focus:text-red-600 hover:bg-red-50 cursor-pointer px-2 py-2">
                      <LogOut className="h-4 w-4" />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </> : <>
                {/* Mobile Login Button */}
                <Link to="/login" className="md:hidden">
                  <Button variant="ghost" className="text-[#1d4ed8] hover:text-[#3b82f6] hover:bg-blue-900/30">
                    Log in
                  </Button>
                </Link>
                
                {/* Desktop Auth Buttons */}
                <Link to="/login" className="hidden md:block">
                  <Button variant="ghost" className="text-[#1d4ed8] hover:text-[#3b82f6] hover:bg-blue-900/30">Log in</Button>
                </Link>
                <Link to="/register" className="hidden md:block">
                  <Button className="bg-[#1d4ed8] hover:bg-[#1d4ed8]/80">Get Started</Button>
                </Link>
              </>}
            
            {/* Mobile Menu */}
            <Drawer>
              <DrawerTrigger asChild className="md:hidden mr-2">
                <Button variant="ghost" size="icon" className="text-[#3b82f6]">
                  <Menu size={24} />
                  <span className="sr-only">Menu</span>
                </Button>
              </DrawerTrigger>
              <DrawerContent className="bg-[#0a192f] border-t border-blue-900/30">
                <div className="flex flex-col p-4 space-y-4">
                  <DrawerClose asChild>
                    <Button variant="ghost" className="w-full justify-start text-[#3b82f6] hover:text-[#60a5fa] hover:bg-blue-900/30 text-xl font-bold" onClick={() => scrollToSection('about')}>
                      About
                    </Button>
                  </DrawerClose>
                  <DrawerClose asChild>
                    <Button variant="ghost" className="w-full justify-start text-[#3b82f6] hover:text-[#60a5fa] hover:bg-blue-900/30 text-xl font-bold" onClick={() => scrollToSection('features')}>
                      Features
                    </Button>
                  </DrawerClose>
                  <DrawerClose asChild>
                    <Button variant="ghost" className="w-full justify-start text-[#3b82f6] hover:text-[#60a5fa] hover:bg-blue-900/30 text-xl font-bold" onClick={() => scrollToSection('pricing')}>
                      Pricing
                    </Button>
                  </DrawerClose>
                  <DrawerClose asChild>
                    <Button variant="ghost" className="w-full justify-start text-[#3b82f6] hover:text-[#60a5fa] hover:bg-blue-900/30 text-xl font-bold" onClick={() => scrollToSection('faqs')}>
                      FAQs
                    </Button>
                  </DrawerClose>
                  <div className="border-t border-blue-900/30 pt-4 flex flex-col space-y-2">
                    {user ? <>
                        <Link to="/dashboard" className="w-full">
                          <Button variant="ghost" className="w-full text-[#1d4ed8] hover:text-[#3b82f6] hover:bg-blue-900/30">Dashboard</Button>
                        </Link>
                        <Button variant="ghost" className="w-full text-red-600 hover:text-red-500 hover:bg-red-900/30" onClick={handleSignOut}>
                          Sign Out
                        </Button>
                      </> : <>
                        <Link to="/login" className="w-full">
                          <Button variant="ghost" className="w-full text-[#1d4ed8] hover:text-[#3b82f6] hover:bg-blue-900/30">Log in</Button>
                        </Link>
                        <Link to="/register" className="w-full">
                          <Button className="w-full bg-[#1d4ed8] hover:bg-[#1d4ed8]/80">Get Started</Button>
                        </Link>
                      </>}
                  </div>
                </div>
              </DrawerContent>
            </Drawer>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-2 md:py-6 pb-40 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#1d4ed8]/10 to-transparent z-0"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="text-left">
              <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                Business without the<br />
                <span className="text-[#3b82f6]">busyness</span>
              </h1>
              <p className="text-xl mb-8 text-blue-100/80 max-w-2xl">All the steps for helping you after company setup, with personalised document templates, step-by-step process guidance and AI assistance</p>
              <div className="flex flex-wrap gap-4">
                <Link to="/register">
                  <Button size="lg" className="bg-[#1d4ed8] hover:bg-[#1d4ed8]/80">Start Your Journey</Button>
                </Link>
                <Button size="lg" variant="outline" className="border-[#1d4ed8] text-[#3b82f6] hover:bg-blue-900/50 hover:text-[#60a5fa] hover:border-[#60a5fa]" onClick={() => scrollToSection('features')}>
                  See How It Works
                </Button>
              </div>
            </div>
            <div className="relative h-[500px] md:h-[600px] flex items-center justify-center -mt-32 overflow-visible">
              <img src="/lovable-uploads/642ffc5f-5961-48bc-84b1-0546760e70a3.png" alt="Business owners with paperwork" className="w-[160%] h-full object-contain hero-image" />
            </div>
          </div>
        </div>
      </section>

      {/* Added spacer div for better separation */}
      <div className="h-16 md:h-24"></div>

      {/* Features Section */}
      <section id="features" ref={featuresRef} className="pt-24 pb-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-6 text-center text-[#3b82f6]">Everything You Need After Forming Your Company</h2>
          <p className="text-xl mb-10 text-center text-blue-100/80 max-w-3xl mx-auto">Bizzy provides all the tools and guidance you need to navigate the complex world of business set-up administration</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 max-w-5xl mx-auto">
            {/* Feature 1 - Step-by-Step Guidance - Fixed image positioning */}
            <div className="relative overflow-hidden rounded-xl bg-gradient-radial from-blue-500/30 via-blue-700/30 to-blue-900/40 border border-blue-700/50 shadow-lg transform transition-all hover:scale-105 hover:shadow-blue-500/20 hover:shadow-xl group">
              {/* Professionally Assured Badge */}
              <div className="absolute top-3 right-3 z-20">
                <div className="bg-yellow-500 text-black px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                  <Star className="w-3 h-3" fill="currentColor" />
                  <span>Professionally Assured</span>
                </div>
              </div>
              
              <div className="absolute top-0 right-0 w-28 h-28 bg-blue-500/10 rounded-bl-full"></div>
              <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-blue-500/5 rounded-full"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-blue-400/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              
              <div className="p-3 z-10 relative flex flex-col h-full">
                <div className="w-full h-[200px] mx-auto flex items-end justify-center pt-16">
                  <img src="/lovable-uploads/35ad1d99-4078-450d-ac41-27dce4da642c.png" alt="Step-by-Step Guidance" className="h-[170px] object-contain scale-125 translate-y-3" style={{
                  maxWidth: '90%'
                }} />
                </div>
                <div className="mt-6 mb-4">
                  <h3 className="text-lg font-bold text-[#3b82f6] mb-2 text-center">Step-by-Step Guidance</h3>
                  <p className="text-blue-100 text-center text-sm">Comprehensive step by step guidance across HR, Finance, Accounting, Payroll, Compliance and more, with skippable sections </p>
                </div>
              </div>
            </div>
            
            {/* Feature 2 - Document Engine */}
            <div className="relative overflow-hidden rounded-xl bg-gradient-radial from-blue-400/30 via-blue-600/30 to-blue-800/40 border border-blue-600/50 shadow-lg transform transition-all hover:scale-105 hover:shadow-blue-500/20 hover:shadow-xl group">
              {/* Professionally Assured Badge */}
              <div className="absolute top-3 right-3 z-20">
                <div className="bg-yellow-500 text-black px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                  <Star className="w-3 h-3" fill="currentColor" />
                  <span>Professionally Assured</span>
                </div>
              </div>
              
              <div className="absolute top-0 right-0 w-28 h-28 bg-blue-500/10 rounded-bl-full"></div>
              <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-blue-500/5 rounded-full"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-blue-400/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              
              <div className="p-3 z-10 relative flex flex-col h-full">
                <div className="w-full h-[240px] mx-auto flex items-center justify-center translate-y-4">
                  <img src="/lovable-uploads/90f74494-efee-4fb1-9e17-f1398ff68008.png" alt="Document Engine" className="max-w-full max-h-[230px] object-contain" />
                </div>
                <h3 className="text-lg font-bold text-[#3b82f6] mb-1 text-center">Document Engine</h3>
                <p className="text-blue-100 text-center text-sm">
                  Access hundreds of pre-approved templates for every business need, automatically populated with your company details.
                </p>
              </div>
            </div>
            
            {/* Feature 3 - Bizzy AI Assistant */}
            <div className="relative overflow-hidden rounded-xl bg-gradient-radial from-blue-500/30 via-blue-700/30 to-blue-900/40 border border-blue-700/50 shadow-lg transform transition-all hover:scale-105 hover:shadow-blue-500/20 hover:shadow-xl group">
              <div className="absolute top-0 right-0 w-28 h-28 bg-blue-500/10 rounded-bl-full"></div>
              <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-blue-500/5 rounded-full"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-blue-400/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              
              <div className="p-3 z-10 relative flex flex-col h-full">
                <div className="w-full h-[240px] mx-auto flex items-center justify-center">
                  <img src="/lovable-uploads/a4589c72-9113-4641-a8bd-1d23e740ac0d.png" alt="Bizzy AI Assistant" className="max-w-full max-h-[230px] object-contain" />
                </div>
                <h3 className="text-lg font-bold text-[#3b82f6] mb-1 text-center">Bizzy AI Assistant</h3>
                <p className="text-blue-100 text-center text-sm">
                  Get real-time help from our AI assistant, pointing you to resources and answering your questions instantly.
                </p>
              </div>
            </div>
            
            {/* Feature 4 - Video Explainers */}
            <div className="relative overflow-hidden rounded-xl bg-gradient-radial from-blue-400/30 via-blue-600/30 to-blue-800/40 border border-blue-600/50 shadow-lg transform transition-all hover:scale-105 hover:shadow-blue-500/20 hover:shadow-xl group">
              <div className="absolute top-0 right-0 w-28 h-28 bg-blue-500/10 rounded-bl-full"></div>
              <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-blue-500/5 rounded-full"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-blue-400/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              
              <div className="p-3 z-10 relative flex flex-col h-full">
                <div className="w-full h-[240px] mx-auto flex items-center justify-center">
                  <img src="/lovable-uploads/13ddab9c-cf4d-4451-99b7-a0e7c8d24062.png" alt="Video Explainers" className="max-w-full max-h-[230px] object-contain" />
                </div>
                <h3 className="text-lg font-bold text-[#3b82f6] mb-1 text-center">Video Explainers</h3>
                <p className="text-blue-100 text-center text-sm">
                  Watch short 30-60 second video explainers on key process steps to quickly understand complex business procedures.
                </p>
              </div>
            </div>
          </div>
          
          {/* Disclaimer Links - Positioned to straddle under first two boxes */}
          <div className="flex justify-start max-w-5xl mx-auto mt-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 w-full">
              <div className="md:col-span-2 lg:col-span-2 flex justify-center">
                <a href="/disclaimer" className="text-blue-300 hover:text-blue-100 text-sm underline">
                  Read our disclaimer
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gradient-to-br from-blue-900/20 to-blue-800/10">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center text-[#3b82f6]">What Our Customers Say</h2>
          <Testimonials />
        </div>
      </section>

      {/* Pricing Section */}
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
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-8xl mx-auto">
            {plans.map((plan, index) => <Card key={plan.name} className={`relative overflow-hidden ${plan.color} hover:shadow-xl transition-all duration-300`}>
                {plan.badge && <div className="absolute top-4 right-4">
                    {plan.badge}
                  </div>}
                
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
                  <Link to={`/pricing?plan=${plan.planId}`}>
                    <Button className={`w-full mb-8 py-6 text-lg font-semibold ${plan.buttonStyle}`}>
                      <Zap className="w-5 h-5 mr-2" />
                      Get Started
                    </Button>
                  </Link>

                  <div className="space-y-4">
                    <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                      <Shield className="w-4 h-4" />
                      What's included:
                    </h4>
                    <ul className="space-y-3">
                      {plan.features.map((feature, featureIndex) => <li key={featureIndex} className="flex items-start gap-3">
                          <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700">{feature}</span>
                        </li>)}
                    </ul>
                  </div>
                </CardContent>
              </Card>)}
          </div>

          {/* Why Choose Bizzy */}
          <div className="mt-20 text-center">
            <h2 className="text-3xl font-bold text-white mb-8">Why Choose Bizzy?</h2>
            <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <Star className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-white">Expert Guidance</h3>
                <p className="text-blue-100/80">Professional guidance, pre-checked from business experts</p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <Shield className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-white">Compliance Assured</h3>
                <p className="text-blue-100/80">Stay compliant with UK business regulations, with our extensive document library </p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                  <Zap className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-white">Fast Setup</h3>
                <p className="text-blue-100/80">Get your business running in days, not weeks, with everything in on</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-br from-blue-800/50 to-blue-900/30">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4 text-[#3b82f6]">Helping new business owners get going</h2>
          <p className="text-xl mb-8 text-blue-100/80 max-w-2xl mx-auto">Join thousands of UK startups who are saving time, reducing stress, and ensuring compliance with Bizzy's comprehensive platform.</p>
          <Link to="/register">
            <Button size="lg" className="bg-[#1d4ed8] hover:bg-[#1d4ed8]/80">
              Get Started Today
            </Button>
          </Link>
        </div>
      </section>

      {/* FAQs Section */}
      <section id="faqs" ref={faqsRef} className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center text-[#3b82f6]">Frequently Asked Questions</h2>
          <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1" className="border-blue-900/30">
                <AccordionTrigger className="text-blue-100 hover:text-[#3b82f6]">What makes Bizzy different from other business setup services?</AccordionTrigger>
                <AccordionContent className="text-blue-100/80">
                  Bizzy focuses on what happens after company formation. While others stop at incorporation, we provide ongoing support with step-by-step guidance, AI assistance, and professionally assured document templates to help you navigate the complex post-setup phase.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2" className="border-blue-900/30">
                <AccordionTrigger className="text-blue-100 hover:text-[#3b82f6]">How does the AI assistant help my business?</AccordionTrigger>
                <AccordionContent className="text-blue-100/80">
                  Our AI assistant provides instant answers to your business questions, guides you to relevant resources, and helps you understand complex procedures through simple explanations. It's like having a business advisor available 24/7.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3" className="border-blue-900/30">
                <AccordionTrigger className="text-blue-100 hover:text-[#3b82f6]">Are the document templates legally compliant?</AccordionTrigger>
                <AccordionContent className="text-blue-100/80">
                  Yes, all our document templates are professionally assured and regularly updated to ensure compliance with current UK business regulations. They're automatically populated with your company details for convenience.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-4" className="border-blue-900/30">
                <AccordionTrigger className="text-blue-100 hover:text-[#3b82f6]">Can I skip sections that don't apply to my business?</AccordionTrigger>
                <AccordionContent className="text-blue-100/80">
                  Absolutely! Our step-by-step guidance includes skippable sections, so you can focus only on what's relevant to your specific business needs and industry requirements.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-5" className="border-blue-900/30">
                <AccordionTrigger className="text-blue-100 hover:text-[#3b82f6]">How quickly can I get my business processes set up?</AccordionTrigger>
                <AccordionContent className="text-blue-100/80">
                  With Bizzy's streamlined approach and pre-built templates, most businesses can complete their essential setup processes in days rather than weeks. The exact time depends on your business complexity and chosen plan.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#071629] border-t border-blue-900/30 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-bold mb-4 text-[#3b82f6] text-2xl">Product</h3>
              <ul className="space-y-2">
                <li><a href="#features" className="text-blue-100/70 hover:text-[#3b82f6] transition-colors text-base">Features</a></li>
                <li><a href="#pricing" className="text-blue-100/70 hover:text-[#3b82f6] transition-colors text-base">Pricing</a></li>
                <li><a href="#faqs" className="text-blue-100/70 hover:text-[#3b82f6] transition-colors text-base">FAQs</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4 text-[#3b82f6] text-2xl">Resources</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-blue-100/70 hover:text-[#3b82f6] transition-colors text-base">Blog</a></li>
                <li><a href="#" className="text-blue-100/70 hover:text-[#3b82f6] transition-colors text-base">Guides</a></li>
                <li><a href="#" className="text-blue-100/70 hover:text-[#3b82f6] transition-colors text-base">Support</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4 text-[#3b82f6] text-2xl">Company</h3>
              <ul className="space-y-2">
                <li><a href="#about" className="text-blue-100/70 hover:text-[#3b82f6] transition-colors text-base">About Us</a></li>
                <li><a href="#" className="text-blue-100/70 hover:text-[#3b82f6] transition-colors text-base">Careers</a></li>
                <li><a href="#" className="text-blue-100/70 hover:text-[#3b82f6] transition-colors text-base">Contact</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4 text-[#3b82f6] text-2xl">Legal</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-blue-100/70 hover:text-[#3b82f6] transition-colors text-base">Terms</a></li>
                <li><a href="#" className="text-blue-100/70 hover:text-[#3b82f6] transition-colors text-base">Privacy</a></li>
                <li><a href="#" className="text-blue-100/70 hover:text-[#3b82f6] transition-colors text-base">Cookies</a></li>
                <li><a href="/disclaimer" className="text-blue-100/70 hover:text-[#3b82f6] transition-colors text-base">Disclaimer</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-blue-900/50 mt-12 pt-8 flex justify-between items-center">
            <p className="text-blue-100/70">© 2025 Bizzy. All rights reserved.</p>
            <div className="flex gap-4">
              <a href="#" aria-label="Twitter" className="text-[#3b82f6] hover:text-[#60a5fa] transition-colors">
                <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
                </svg>
              </a>
              <a href="#" aria-label="LinkedIn" className="text-[#3b82f6] hover:text-[#60a5fa] transition-colors">
                <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M6.5 21.5h-5v-13h5v13zM4 6.5C2.5 6.5 1.5 5.3 1.5 4s1-2.4 2.5-2.4c1.6 0 2.5 1 2.6 2.5 0 1.4-1 2.5-2.6 2.5zm11.5 6c-1 0-2 1-2 2v7h-5v-13h5v1.5c1-1.6 2.7-2.5 4.5-2.5 3.5 0 6 2.5 6 6.5v7.5h-5v-7c0-1-1-2-2-2h-1.5z"></path>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* Floating Bizzy character */}
      <div className="fixed z-50" style={{
      left: `${floatingPosition.x}px`,
      top: `${floatingPosition.y}px`,
      transition: 'all 0.5s ease-out'
    }}>
        <BizzyCharacter />
      </div>
    </div>;
};
export default Index;
