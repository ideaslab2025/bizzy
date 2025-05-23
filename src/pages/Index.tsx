
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import BizzyCharacter from "@/components/BizzyCharacter";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";

const Index = () => {
  const [floatingPosition, setFloatingPosition] = useState({ x: window.innerWidth - 150, y: window.innerHeight - 150 });
  
  useEffect(() => {
    const floatingAnimation = () => {
      // Keep in bottom left area, but with some gentle floating movement
      setFloatingPosition(prev => ({
        x: window.innerWidth - 150 + Math.sin(Date.now() / 1000) * 10,
        y: window.innerHeight - 150 + Math.cos(Date.now() / 1200) * 15,
      }));
      
      requestAnimationFrame(floatingAnimation);
    };
    
    const animation = requestAnimationFrame(floatingAnimation);
    
    // Handle window resize
    const handleResize = () => {
      setFloatingPosition({
        x: window.innerWidth - 150,
        y: window.innerHeight - 150,
      });
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      cancelAnimationFrame(animation);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-[#0a192f] text-white">
      {/* Header/Navigation */}
      <header className="border-b border-blue-900/30 sticky top-0 z-10 bg-[#0a192f]/90 backdrop-blur-sm">
        <div className="container mx-auto py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <img src="/lovable-uploads/502b3627-55d4-4915-b44e-a2aa01e5751e.png" alt="Bizzy Logo" className="h-36" />
          </div>
          <nav className="hidden md:flex gap-6">
            <a href="#features" className="text-[#1d4ed8] hover:text-[#3b82f6] transition">Features</a>
            <a href="#pricing" className="text-[#1d4ed8] hover:text-[#3b82f6] transition">Pricing</a>
            <a href="#about" className="text-[#1d4ed8] hover:text-[#3b82f6] transition">About</a>
            <a href="#faq" className="text-[#1d4ed8] hover:text-[#3b82f6] transition">FAQ</a>
          </nav>
          <div className="flex gap-2">
            <Link to="/login">
              <Button variant="ghost" className="text-[#1d4ed8] hover:text-[#3b82f6] hover:bg-blue-900/30">Log in</Button>
            </Link>
            <Link to="/register">
              <Button className="bg-[#1d4ed8] hover:bg-[#1d4ed8]/80">Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 md:py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#1d4ed8]/10 to-transparent z-0"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="text-left">
              <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                Helping New Business Owners<br/>
                <span className="text-[#3b82f6]">Start Off Right</span>
              </h1>
              <p className="text-xl mb-8 text-blue-100/80 max-w-2xl">
                All the steps for company setup with document templates and AI guidance
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/register">
                  <Button size="lg" className="bg-[#1d4ed8] hover:bg-[#1d4ed8]/80">Start Your Journey</Button>
                </Link>
                <Button size="lg" variant="outline" className="border-[#1d4ed8] text-[#3b82f6] hover:bg-blue-900/30">
                  See How It Works
                </Button>
              </div>
            </div>
            <div className="relative h-[400px] md:h-[500px] flex items-center justify-center">
              <img 
                src="/lovable-uploads/502b3627-55d4-4915-b44e-a2aa01e5751e.png" 
                alt="Bizzy character" 
                className="w-full h-full object-contain drop-shadow-[0_0_35px_rgba(59,130,246,0.8)]"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section - moved up with less gap */}
      <section id="features" className="py-4">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-6 text-center text-[#3b82f6]">Everything You Need After Forming Your Company</h2>
          <p className="text-xl mb-8 text-center text-blue-100/80 max-w-3xl mx-auto">
            Bizzy provides all the tools and guidance you need to navigate the complex world of business administration
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            <Card className="bg-blue-900/30 border-blue-800 h-full">
              <CardHeader>
                <CardTitle className="text-[#3b82f6]">Step-by-Step Guidance</CardTitle>
                <CardDescription className="text-blue-100/70">Interactive process for every stage</CardDescription>
              </CardHeader>
              <CardContent className="text-blue-100">
                Comprehensive guidance across HR, Finance, Accounting, Payroll, Compliance and more, with skippable sections and interactive learning.
              </CardContent>
            </Card>
            
            <Card className="bg-blue-900/30 border-blue-800 h-full">
              <CardHeader>
                <CardTitle className="text-[#3b82f6]">Document Engine</CardTitle>
                <CardDescription className="text-blue-100/70">All templates automatically personalized</CardDescription>
              </CardHeader>
              <CardContent className="text-blue-100">
                Access hundreds of pre-approved templates for every business need, automatically populated with your company details.
              </CardContent>
            </Card>
            
            <Card className="bg-blue-900/30 border-blue-800 h-full">
              <CardHeader>
                <CardTitle className="text-[#3b82f6]">Bizzy AI Assistant</CardTitle>
                <CardDescription className="text-blue-100/70">Your friendly guide through your journey</CardDescription>
              </CardHeader>
              <CardContent className="text-blue-100">
                Get real-time help from our AI assistant, pointing you to resources and answering your questions instantly.
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing Section - Updated colors to be more metalllic and readable text */}
      <section id="pricing" className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-4 text-center text-[#3b82f6]">Simple, Transparent Pricing</h2>
          <p className="text-xl text-center mb-12 text-blue-100/80 max-w-3xl mx-auto">
            One-time payment, lifetime access. No hidden fees or subscriptions.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: "Bronze",
                price: "£100",
                color: "bg-gradient-to-b from-amber-700/50 to-amber-900/30",
                textColor: "text-amber-100",
                borderColor: "border-amber-600",
                features: [
                  "Basic company setup guidance",
                  "Essential document templates",
                  "Standard support",
                  "Basic AI assistant access"
                ]
              },
              {
                title: "Silver",
                price: "£200",
                color: "bg-gradient-to-b from-slate-300/50 to-slate-500/30",
                textColor: "text-slate-100", 
                borderColor: "border-slate-400",
                features: [
                  "Everything in Bronze",
                  "Extended document library",
                  "Tax & compliance guidance",
                  "Full AI assistant access"
                ]
              },
              {
                title: "Gold",
                price: "£300",
                color: "bg-gradient-to-b from-amber-400/50 to-amber-600/30",
                textColor: "text-amber-100",
                borderColor: "border-amber-500",
                features: [
                  "Everything in Silver",
                  "Complete document engine",
                  "Advanced sector-specific guidance",
                  "Priority support"
                ],
                recommended: true
              },
              {
                title: "Platinum",
                price: "£500",
                color: "bg-gradient-to-b from-slate-200/50 to-slate-400/30",
                textColor: "text-slate-100",
                borderColor: "border-slate-300",
                features: [
                  "Everything in Gold",
                  "Full access to all resources",
                  "Video consultations with experts",
                  "Custom document customization"
                ]
              }
            ].map((plan, index) => (
              <Card key={index} className={`${plan.color} ${plan.borderColor} shadow-lg relative`}>
                {plan.recommended && (
                  <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-[#1d4ed8] px-6 py-2 text-base font-bold">
                    Recommended
                  </Badge>
                )}
                <CardHeader className={plan.recommended ? "pt-6" : ""}>
                  <CardTitle className={plan.recommended ? "text-[#3b82f6]" : plan.textColor}>{plan.title}</CardTitle>
                  <div className="text-3xl font-bold text-white">{plan.price}</div>
                  <CardDescription className={`${plan.textColor} opacity-90`}>One-time payment</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {plan.features.map((feature, i) => (
                      <li key={i} className={`flex items-center gap-2 ${plan.textColor}`}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#3b82f6]">
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Link to="/register" className="w-full">
                    <Button className={`w-full bg-[#1d4ed8] hover:bg-[#1d4ed8]/80`}>
                      Choose Plan
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* About Section with Bizzy character */}
      <section id="about" className="py-16 bg-blue-900/20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="md:w-1/2">
              <h2 className="text-3xl font-bold mb-4 text-[#3b82f6]">Meet Bizzy</h2>
              <p className="text-blue-100 mb-4">
                Your AI-powered assistant for navigating the complexities of running a UK business. 
                Bizzy transforms business administration from a chore into a breeze.
              </p>
              <p className="text-blue-100 mb-4">
                We're like what challenger banks were to banking - a modern, digital solution 
                to startup administration and support.
              </p>
              <Button className="bg-[#1d4ed8] hover:bg-[#1d4ed8]/80">
                Learn More About Bizzy
              </Button>
            </div>
            <div className="md:w-1/2 flex justify-center">
              <div className="relative">
                <div className="absolute inset-0 bg-[#1d4ed8]/30 blur-3xl rounded-full"></div>
                <AspectRatio ratio={1/1} className="overflow-hidden max-w-[300px] relative">
                  <img 
                    src="/lovable-uploads/502b3627-55d4-4915-b44e-a2aa01e5751e.png" 
                    alt="Bizzy Character" 
                    className="object-contain drop-shadow-[0_0_25px_rgba(59,130,246,0.8)]"
                  />
                </AspectRatio>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-6 text-center text-[#3b82f6]">Frequently Asked Questions</h2>
          <div className="max-w-3xl mx-auto space-y-6">
            {[
              {
                question: "How does Bizzy help with company formation?",
                answer: "Bizzy provides step-by-step guidance through the company formation process, offering document templates and AI assistance to ensure you complete all required legal steps correctly."
              },
              {
                question: "Is there a recurring subscription?",
                answer: "No, Bizzy operates on a one-time payment model. You pay once for the plan of your choice and get lifetime access to the features included in that plan."
              },
              {
                question: "Can I upgrade my plan later?",
                answer: "Yes, you can upgrade to a higher-tier plan at any time by paying the difference between your current plan and the new one."
              },
              {
                question: "How does the AI assistant work?",
                answer: "Bizzy's AI assistant uses advanced natural language processing to understand your questions and provide relevant guidance, document suggestions, and compliance advice specific to your business needs."
              },
              {
                question: "Is my data secure with Bizzy?",
                answer: "Absolutely. We employ enterprise-grade encryption and follow strict data protection protocols to ensure your business information remains completely secure and confidential."
              }
            ].map((faq, index) => (
              <div key={index} className="bg-blue-900/30 border border-blue-800 rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-2 text-[#3b82f6]">{faq.question}</h3>
                <p className="text-blue-100">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-br from-blue-800/50 to-blue-900/30">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4 text-[#3b82f6]">Ready to Make Business Easy?</h2>
          <p className="text-xl mb-8 text-blue-100/80 max-w-2xl mx-auto">
            Join thousands of UK startups who are saving time, reducing stress, and ensuring
            compliance with Bizzy's comprehensive platform.
          </p>
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
              <h3 className="font-bold mb-4 text-[#3b82f6]">Product</h3>
              <ul className="space-y-2">
                <li><a href="#features" className="text-blue-100/70 hover:text-[#3b82f6] transition-colors">Features</a></li>
                <li><a href="#pricing" className="text-blue-100/70 hover:text-[#3b82f6] transition-colors">Pricing</a></li>
                <li><a href="#faq" className="text-blue-100/70 hover:text-[#3b82f6] transition-colors">FAQ</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4 text-[#3b82f6]">Resources</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-blue-100/70 hover:text-[#3b82f6] transition-colors">Blog</a></li>
                <li><a href="#" className="text-blue-100/70 hover:text-[#3b82f6] transition-colors">Guides</a></li>
                <li><a href="#" className="text-blue-100/70 hover:text-[#3b82f6] transition-colors">Support</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4 text-[#3b82f6]">Company</h3>
              <ul className="space-y-2">
                <li><a href="#about" className="text-blue-100/70 hover:text-[#3b82f6] transition-colors">About Us</a></li>
                <li><a href="#" className="text-blue-100/70 hover:text-[#3b82f6] transition-colors">Careers</a></li>
                <li><a href="#" className="text-blue-100/70 hover:text-[#3b82f6] transition-colors">Contact</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4 text-[#3b82f6]">Legal</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-blue-100/70 hover:text-[#3b82f6] transition-colors">Terms</a></li>
                <li><a href="#" className="text-blue-100/70 hover:text-[#3b82f6] transition-colors">Privacy</a></li>
                <li><a href="#" className="text-blue-100/70 hover:text-[#3b82f6] transition-colors">Cookies</a></li>
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

      {/* Floating Bizzy character - only one, bottom right */}
      <div className="fixed z-50" style={{ 
        left: `${floatingPosition.x}px`, 
        top: `${floatingPosition.y}px`,
        transition: 'all 0.5s ease-out'
      }}>
        <BizzyCharacter />
      </div>
    </div>
  );
};

export default Index;
