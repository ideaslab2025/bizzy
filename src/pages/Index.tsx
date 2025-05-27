import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Menu, Star } from "lucide-react";
import { Drawer, DrawerClose, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import BizzyCharacter from "@/components/BizzyCharacter";
import Testimonials from "@/components/Testimonials";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";

// Plan data from PricingNew
const pricingPlans = [
  {
    id: "bronze",
    title: "Bronze",
    price: "£100",
    gradient: "linear-gradient(to bottom, rgba(217, 119, 6, 0.8), rgba(180, 83, 9, 0.6))",
    textColor: "#ffffff",
    borderColor: "#d97706",
    shadowColor: "217, 119, 6",
    buttonBg: "#d97706",
    buttonHoverBg: "#b45309",
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
    gradient: "linear-gradient(to bottom, rgba(203, 213, 225, 0.8), rgba(100, 116, 139, 0.6))",
    textColor: "#ffffff",
    borderColor: "#94a3b8",
    shadowColor: "148, 163, 184",
    buttonBg: "#64748b",
    buttonHoverBg: "#475569",
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
    gradient: "linear-gradient(to bottom, rgba(251, 191, 36, 0.8), rgba(217, 119, 6, 0.6))",
    textColor: "#ffffff",
    borderColor: "#f59e0b",
    shadowColor: "245, 158, 11",
    buttonBg: "#f59e0b",
    buttonHoverBg: "#d97706",
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
    gradient: "linear-gradient(to bottom, #f8fafc, #e2e8f0, #cbd5e1)",
    textColor: "#1f2937",
    borderColor: "#94a3b8",
    shadowColor: "71, 85, 105",
    buttonBg: "#1f2937",
    buttonHoverBg: "#111827",
    features: [
      "Everything in Gold",
      "Full access to all resources",
      "Video consultations with experts",
      "Custom document customization"
    ]
  }
];

interface PlanCardProps {
  plan: typeof pricingPlans[0];
  isSelected: boolean;
  onSelect: (planId: string) => void;
}

const PlanCard: React.FC<PlanCardProps> = ({ plan, isSelected, onSelect }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  // Card styles
  const cardStyle: React.CSSProperties = {
    position: 'relative' as const,
    border: `2px solid ${isSelected ? '#1d4ed8' : plan.borderColor}`,
    borderRadius: '12px',
    padding: '0',
    background: plan.gradient,
    boxShadow: isSelected 
      ? `0 0 0 2px #1d4ed8, 0 25px 50px -12px rgba(29, 78, 216, 0.5)`
      : isHovered 
        ? `0 25px 50px -12px rgba(${plan.shadowColor}, 0.5)`
        : '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
    transform: `translateY(${isSelected ? '-16px' : isHovered ? '-8px' : '0'}) scale(${isSelected || isHovered ? '1.03' : '1'})`,
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    cursor: 'pointer',
    height: '100%',
    display: 'flex',
    flexDirection: 'column' as const,
    overflow: 'hidden'
  };

  const buttonStyle: React.CSSProperties = {
    width: '100%',
    padding: '12px 24px',
    backgroundColor: isSelected ? '#1d4ed8' : plan.buttonBg,
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transform: isHovered ? 'translateY(-2px) scale(1.05)' : 'scale(1)',
    boxShadow: isHovered ? '0 10px 20px -5px rgba(0, 0, 0, 0.3)' : '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    transition: 'all 0.2s ease-out'
  };

  const headerStyle: React.CSSProperties = {
    padding: plan.recommended ? '40px 24px 24px' : '24px',
    textAlign: 'center' as const
  };

  const titleStyle: React.CSSProperties = {
    fontSize: '24px',
    fontWeight: 'bold',
    color: plan.id === "platinum" ? "#1f2937" : plan.recommended ? "#3b82f6" : plan.textColor,
    marginBottom: '8px'
  };

  const priceStyle: React.CSSProperties = {
    fontSize: '40px',
    fontWeight: 'bold',
    color: plan.id === "platinum" ? "#1f2937" : plan.textColor,
    marginBottom: '4px'
  };

  const descriptionStyle: React.CSSProperties = {
    color: plan.id === "platinum" ? "#4b5563" : plan.textColor,
    opacity: 0.9,
    fontSize: '14px'
  };

  const contentStyle: React.CSSProperties = {
    padding: '0 24px 24px',
    flex: 1
  };

  const featureListStyle: React.CSSProperties = {
    listStyle: 'none',
    padding: 0,
    margin: 0
  };

  const featureItemStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '8px',
    marginBottom: '12px',
    color: plan.id === "platinum" ? "#4b5563" : plan.textColor,
    fontSize: '14px'
  };

  const checkIconColor = plan.id === "platinum" ? "#1f2937" : "#60a5fa";

  const badgeStyle: React.CSSProperties = {
    position: 'absolute' as const,
    top: '-8px',
    left: '50%',
    transform: 'translateX(-50%)',
    backgroundColor: '#1d4ed8',
    color: 'white',
    padding: '6px 28px',
    borderRadius: '9999px',
    fontSize: '15px',
    fontWeight: 'bold',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    zIndex: 20
  };

  const footerStyle: React.CSSProperties = {
    padding: '24px',
    marginTop: 'auto'
  };

  return (
    <div 
      style={{ position: 'relative', height: '100%' }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onSelect(plan.id)}
    >
      <div style={cardStyle}>
        {plan.recommended && (
          <div style={badgeStyle}>
            Recommended
          </div>
        )}
        
        <div style={headerStyle}>
          <h3 style={titleStyle}>{plan.title}</h3>
          <div style={priceStyle}>{plan.price}</div>
          <p style={descriptionStyle}>One-time payment</p>
        </div>
        
        <div style={contentStyle}>
          <ul style={featureListStyle}>
            {plan.features.map((feature, i) => (
              <li key={i} style={featureItemStyle}>
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="20" 
                  height="20" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke={checkIconColor}
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  style={{ flexShrink: 0, marginTop: '2px' }}
                >
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>
        
        <div style={footerStyle}>
          <button 
            style={buttonStyle}
            onMouseOver={(e) => {
              if (!isSelected) {
                e.currentTarget.style.backgroundColor = plan.buttonHoverBg;
              }
            }}
            onMouseOut={(e) => {
              if (!isSelected) {
                e.currentTarget.style.backgroundColor = isSelected ? '#1d4ed8' : plan.buttonBg;
              }
            }}
            onClick={(e) => {
              e.stopPropagation();
              onSelect(plan.id);
            }}
          >
            {isSelected ? "Selected" : "Select Plan"}
          </button>
        </div>
      </div>
    </div>
  );
};

const Index = () => {
  const [floatingPosition, setFloatingPosition] = useState({
    x: window.innerWidth - 150,
    y: window.innerHeight - 150
  });

  // Pricing state - Modified to allow deselection
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Add refs for scroll targets
  const faqsRef = useRef<HTMLElement>(null);
  const featuresRef = useRef<HTMLElement>(null);
  
  // ... keep existing code (useEffect for floating animation and scroll handling)
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

  // Modified pricing handlers to allow deselection
  const handleSelectPlan = (planId: string) => {
    if (selectedPlan === planId) {
      setSelectedPlan(null); // Deselect if already selected
    } else {
      setSelectedPlan(planId);
    }
  };
  
  const handleProceedToPayment = () => {
    if (!selectedPlan) {
      return;
    }
    
    setIsLoading(true);
    setTimeout(() => {
      alert(`Processing ${selectedPlan} plan payment...`);
      setIsLoading(false);
    }, 1500);
  };

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
            {/* Mobile Login Button - NEW ADDITION */}
            <Link to="/login" className="md:hidden">
              <Button variant="ghost" className="text-[#1d4ed8] hover:text-[#3b82f6] hover:bg-blue-900/30">
                Log in
              </Button>
            </Link>
            
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
                    <Link to="/login" className="w-full">
                      <Button variant="ghost" className="w-full text-[#1d4ed8] hover:text-[#3b82f6] hover:bg-blue-900/30">Log in</Button>
                    </Link>
                    <Link to="/register" className="w-full">
                      <Button className="w-full bg-[#1d4ed8] hover:bg-[#1d4ed8]/80">Get Started</Button>
                    </Link>
                  </div>
                </div>
              </DrawerContent>
            </Drawer>
            
            <Link to="/login" className="hidden md:block">
              <Button variant="ghost" className="text-[#1d4ed8] hover:text-[#3b82f6] hover:bg-blue-900/30">Log in</Button>
            </Link>
            <Link to="/register" className="hidden md:block">
              <Button className="bg-[#1d4ed8] hover:bg-[#1d4ed8]/80">Get Started</Button>
            </Link>
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
            {/* Feature 1 - Step-by-Step Guidance - Updated positioning and sizing */}
            <div className="relative overflow-hidden rounded-xl bg-gradient-radial from-blue-500/30 via-blue-700/30 to-blue-900/40 border border-blue-700/50 shadow-lg transform transition-all hover:scale-105 hover:shadow-blue-500/20 hover:shadow-xl group">
              {/* Professionally Assured Badge */}
              <div className="absolute top-3 right-3 z-10">
                <div className="bg-yellow-500 text-black px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                  <Star className="w-3 h-3" fill="currentColor" />
                  <span>Professionally Assured</span>
                </div>
              </div>
              
              <div className="absolute top-0 right-0 w-28 h-28 bg-blue-500/10 rounded-bl-full"></div>
              <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-blue-500/5 rounded-full"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-blue-400/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              
              <div className="p-3 z-10 relative flex flex-col h-full">
                <div className="w-full h-[200px] mx-auto flex items-end justify-center pt-12">
                  <img 
                    src="/lovable-uploads/35ad1d99-4078-450d-ac41-27dce4da642c.png" 
                    alt="Step-by-Step Guidance" 
                    className="h-[190px] object-contain scale-125 translate-y-1" 
                    style={{ maxWidth: '90%' }}
                  />
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
              <div className="absolute top-3 right-3 z-10">
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

      {/* New Interactive Pricing Section */}
      <section id="pricing" className="py-16" style={{ backgroundColor: '#0a192f' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 16px' }}>
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <h1 style={{ fontSize: '40px', fontWeight: 'bold', color: 'white', marginBottom: '16px' }}>
              Choose Your Plan
            </h1>
            <p style={{ fontSize: '18px', color: '#e5e7eb', maxWidth: '768px', margin: '0 auto' }}>
              Select the package that best suits your business needs. All plans include a one-time payment with no recurring fees.
            </p>
          </div>
          
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
            gap: '24px', 
            maxWidth: '1200px', 
            margin: '0 auto' 
          }}>
            {pricingPlans.map((plan) => (
              <PlanCard 
                key={plan.id}
                plan={plan}
                isSelected={selectedPlan === plan.id}
                onSelect={handleSelectPlan}
              />
            ))}
          </div>
          
          <div style={{ marginTop: '48px', textAlign: 'center' }}>
            <button 
              style={{
                padding: '12px 32px',
                fontSize: '18px',
                backgroundColor: selectedPlan ? '#2563eb' : '#6b7280',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: selectedPlan ? 'pointer' : 'not-allowed',
                opacity: selectedPlan ? 1 : 0.5,
                transition: 'all 0.2s',
                transform: selectedPlan ? 'scale(1)' : 'scale(1)',
              }}
              onClick={handleProceedToPayment}
              disabled={!selectedPlan || isLoading}
              onMouseOver={(e) => {
                if (selectedPlan && !isLoading) {
                  e.currentTarget.style.backgroundColor = '#1d4ed8';
                  e.currentTarget.style.transform = 'scale(1.05)';
                }
              }}
              onMouseOut={(e) => {
                if (selectedPlan && !isLoading) {
                  e.currentTarget.style.backgroundColor = '#2563eb';
                  e.currentTarget.style.transform = 'scale(1)';
                }
              }}
            >
              {isLoading ? "Processing..." : "Proceed to Payment"}
            </button>
            {!selectedPlan && (
              <p style={{ color: '#f87171', marginTop: '16px', fontSize: '16px' }}>
                Please select a plan to continue
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-16 bg-blue-900/10">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-10 text-center text-[#3b82f6]">What Our Customers Say</h2>
          <Testimonials />
        </div>
      </section>

      {/* About Section with Bizzy character - Smaller on mobile */}
      <section id="about" className="py-6 bg-blue-900/20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="md:w-1/2">
              <h2 className="text-3xl font-bold mb-4 text-[#3b82f6]">Meet Bizzy</h2>
              <p className="text-blue-100 mb-3 text-sm md:text-base">Your AI-powered assistant for navigating the complexities of starting a UK business. Bizzy transforms business startup administration from a chore into a breeze.</p>
              <p className="text-blue-100 mb-3 text-sm md:text-base">Clear, up-to-date guidance on exactly what to do, every step of the way. Short video clips and a document library to boot. Chat to Bizzy if you get stuck!</p>
              <Button className="bg-[#1d4ed8] hover:bg-[#1d4ed8]/80 text-sm md:text-base">
                Learn More About Bizzy
              </Button>
            </div>
            <div className="md:w-1/2 flex justify-center">
              <div className="relative scale-75 md:scale-100">
                <div className="absolute inset-0 bg-[#1d4ed8]/30 blur-3xl rounded-full"></div>
                <img src="/lovable-uploads/829e09df-4a1a-4e87-b80b-951eb01a8635.png" alt="Bizzy Character" className="w-[600px] relative drop-shadow-[0_0_25px_rgba(59,130,246,0.8)]" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section - Using the ref for better scroll targeting */}
      <section id="faqs" ref={faqsRef} className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-6 text-center text-[#3b82f6]">Frequently Asked Questions</h2>
          <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="space-y-4">
              <AccordionItem value="item-1" className="bg-blue-900/30 border border-blue-800 rounded-lg px-6">
                <AccordionTrigger className="text-xl font-semibold text-[#3b82f6] py-4">
                  How does Bizzy help with my company post-formation?
                </AccordionTrigger>
                <AccordionContent className="pb-4 text-blue-100">
                  Bizzy provides step-by-step professional guidance through the post-company formation process, offering our guided help for everything you need to do across every department once starting, a full document library, and AI assistance to ensure you complete all required steps correctly.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2" className="bg-blue-900/30 border border-blue-800 rounded-lg px-6">
                <AccordionTrigger className="text-xl font-semibold text-[#3b82f6] py-4">
                  Is there a recurring subscription?
                </AccordionTrigger>
                <AccordionContent className="pb-4 text-blue-100">
                  No, Bizzy operates on a one-time payment model. You pay once for the plan of your choice and get lifetime access to the features included in that plan.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3" className="bg-blue-900/30 border border-blue-800 rounded-lg px-6">
                <AccordionTrigger className="text-xl font-semibold text-[#3b82f6] py-4">
                  Can I upgrade my plan later?
                </AccordionTrigger>
                <AccordionContent className="pb-4 text-blue-100">
                  Yes, you can upgrade to a higher-tier plan at any time by paying the difference between your current plan and the new one.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-4" className="bg-blue-900/30 border border-blue-800 rounded-lg px-6">
                <AccordionTrigger className="text-xl font-semibold text-[#3b82f6] py-4">
                  How does the AI assistant work?
                </AccordionTrigger>
                <AccordionContent className="pb-4 text-blue-100">
                  Bizzy's AI assistant uses advanced natural language processing to understand your questions and provide relevant guidance, document suggestions, and compliance advice specific to your business needs.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-5" className="bg-blue-900/30 border border-blue-800 rounded-lg px-6">
                <AccordionTrigger className="text-xl font-semibold text-[#3b82f6] py-4">
                  Is my data secure with Bizzy?
                </AccordionTrigger>
                <AccordionContent className="pb-4 text-blue-100">
                  Absolutely. We employ enterprise-grade encryption and follow strict data protection protocols to ensure your business information remains completely secure and confidential.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-6" className="bg-blue-900/30 border border-blue-800 rounded-lg px-6">
                <AccordionTrigger className="text-xl font-semibold text-[#3b82f6] py-4">
                  Is Bizzy Guidance or Advice and can I trust the information?
                </AccordionTrigger>
                <AccordionContent className="pb-4 text-blue-100">
                  Your Business Guidance, Professionally Assured: Bizzy provides comprehensive step-by-step guidance across every aspect of getting your new UK business started (post formation), telling you everything you need to do across finance, payroll, tax, HR, Gov.UK services, paperwork and beyond. It has been professionally pre-checked / assured and updated, but it is guidance not advice. Please see our full disclaimer{' '}
                  <a href="/disclaimer" className="text-[#3b82f6] hover:text-[#60a5fa] underline">
                    here
                  </a>.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
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
