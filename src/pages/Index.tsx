
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="flex flex-col min-h-screen bg-[#0a192f] text-white">
      {/* Header/Navigation */}
      <header className="border-b border-blue-900/30 sticky top-0 z-10 bg-[#0a192f]/90 backdrop-blur-sm">
        <div className="container mx-auto py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <img src="/lovable-uploads/502b3627-55d4-4915-b44e-a2aa01e5751e.png" alt="Bizzy Logo" className="h-12" />
          </div>
          <nav className="hidden md:flex gap-6">
            <a href="#features" className="text-blue-300 hover:text-blue-200 transition">Features</a>
            <a href="#pricing" className="text-blue-300 hover:text-blue-200 transition">Pricing</a>
            <a href="#about" className="text-blue-300 hover:text-blue-200 transition">About</a>
          </nav>
          <div className="flex gap-2">
            <Link to="/login">
              <Button variant="ghost" className="text-blue-300 hover:text-blue-200 hover:bg-blue-900/30">Log in</Button>
            </Link>
            <Link to="/register">
              <Button className="bg-blue-500 hover:bg-blue-600">Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 md:py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-500/10 to-transparent z-0"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="text-left">
              <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                Helping New Business Owners<br/>
                <span className="text-blue-400">Start Off Right</span>
              </h1>
              <p className="text-xl mb-8 text-blue-100/80 max-w-2xl">
                All the steps for company setup with document templates and AI guidance
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/register">
                  <Button size="lg" className="bg-blue-500 hover:bg-blue-600">Start Your Journey</Button>
                </Link>
                <Button size="lg" variant="outline" className="border-blue-500 text-blue-300 hover:bg-blue-900/30">
                  See How It Works
                </Button>
              </div>
            </div>
            <div className="relative h-[400px] md:h-[500px]">
              <img 
                src="/lovable-uploads/451c5886-b36b-4e91-a5e0-9b61612c8f5b.png" 
                alt="Business startup with Bizzy" 
                className="rounded-lg shadow-2xl w-full h-full object-cover"
              />
              <div className="absolute bottom-[-30px] right-[-30px] w-[180px] animate-bounce">
                <img 
                  src="/lovable-uploads/502b3627-55d4-4915-b44e-a2aa01e5751e.png"
                  alt="Bizzy character" 
                  className="drop-shadow-[0_0_15px_rgba(59,130,246,0.7)]"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section with Carousel */}
      <section id="features" className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-6 text-center text-blue-300">Everything You Need After Forming Your Company</h2>
          <p className="text-xl mb-12 text-center text-blue-100/80 max-w-3xl mx-auto">
            Bizzy provides all the tools and guidance you need to navigate the complex world of business administration
          </p>
          
          <div className="relative max-w-4xl mx-auto px-12">
            <Carousel className="w-full">
              <CarouselContent>
                <CarouselItem>
                  <div className="p-4">
                    <Card className="bg-blue-900/30 border-blue-800">
                      <CardHeader>
                        <CardTitle className="text-blue-300">Step-by-Step Guidance</CardTitle>
                        <CardDescription className="text-blue-100/70">Interactive process for every stage of your business</CardDescription>
                      </CardHeader>
                      <CardContent className="text-blue-100">
                        Comprehensive guidance across HR, Finance, Accounting, Payroll, Compliance and more, with skippable sections and interactive learning.
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
                
                <CarouselItem>
                  <div className="p-4">
                    <Card className="bg-blue-900/30 border-blue-800">
                      <CardHeader>
                        <CardTitle className="text-blue-300">Document Engine</CardTitle>
                        <CardDescription className="text-blue-100/70">All templates automatically personalized</CardDescription>
                      </CardHeader>
                      <CardContent className="text-blue-100">
                        Access hundreds of pre-approved templates for every business need, automatically populated with your company details.
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
                
                <CarouselItem>
                  <div className="p-4">
                    <Card className="bg-blue-900/30 border-blue-800">
                      <CardHeader>
                        <CardTitle className="text-blue-300">Bizzy AI Assistant</CardTitle>
                        <CardDescription className="text-blue-100/70">Your friendly guide through your business journey</CardDescription>
                      </CardHeader>
                      <CardContent className="text-blue-100">
                        Get real-time help from our AI assistant, pointing you to resources and answering your questions instantly.
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
              </CarouselContent>
              <CarouselPrevious className="left-0 border-blue-500 text-blue-300 hover:bg-blue-900/50" />
              <CarouselNext className="right-0 border-blue-500 text-blue-300 hover:bg-blue-900/50" />
            </Carousel>
          </div>
        </div>
      </section>

      {/* Core Features Grid */}
      <section className="py-16 bg-blue-900/20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
            <div className="bg-gradient-to-br from-blue-800/50 to-blue-900/30 p-8 rounded-xl border border-blue-700/30 flex flex-col">
              <h3 className="text-2xl font-bold mb-4 text-blue-300">What to Do Next</h3>
              <p className="text-blue-100 flex-grow mb-6">
                Learn about the actions to take to set your business up for success with our structured guides and resources.
              </p>
              <Button className="bg-blue-600 hover:bg-blue-700 w-full">Start Learning</Button>
            </div>
            
            <div className="bg-gradient-to-br from-blue-800/50 to-blue-900/30 p-8 rounded-xl border border-blue-700/30 flex flex-col relative">
              <h3 className="text-2xl font-bold mb-4 text-blue-300">Get Help from Bizzy</h3>
              <p className="text-blue-100 flex-grow mb-6">
                Follow step-by-step instructions from the Bizzy assistant to guide you through each part of your business journey.
              </p>
              <Button className="bg-blue-600 hover:bg-blue-700 w-full">Get Guidance</Button>
              <div className="absolute bottom-[-20px] right-[-20px] w-[100px]">
                <img 
                  src="/lovable-uploads/502b3627-55d4-4915-b44e-a2aa01e5751e.png"
                  alt="Bizzy character" 
                  className="drop-shadow-[0_0_10px_rgba(59,130,246,0.6)] animate-pulse"
                />
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-blue-800/50 to-blue-900/30 p-8 rounded-xl border border-blue-700/30 flex flex-col">
              <h3 className="text-2xl font-bold mb-4 text-blue-300">Download Documents</h3>
              <p className="text-blue-100 flex-grow mb-6">
                Find and access important documents for your business, all customized with your company information.
              </p>
              <Button className="bg-blue-600 hover:bg-blue-700 w-full">Access Documents</Button>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-4 text-center text-blue-300">Simple, Transparent Pricing</h2>
          <p className="text-xl text-center mb-12 text-blue-100/80 max-w-3xl mx-auto">
            One-time payment, lifetime access. No hidden fees or subscriptions.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: "Bronze",
                price: "£100",
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
                features: [
                  "Everything in Silver",
                  "Complete document engine",
                  "Advanced sector-specific guidance",
                  "Priority support"
                ]
              },
              {
                title: "Platinum",
                price: "£500",
                features: [
                  "Everything in Gold",
                  "Full access to all resources",
                  "Video consultations with experts",
                  "Custom document customization"
                ],
                highlight: true
              }
            ].map((plan, index) => (
              <Card key={index} className={plan.highlight ? 
                "bg-gradient-to-b from-blue-800/40 to-blue-900/20 border-blue-500 shadow-lg shadow-blue-500/20" : 
                "bg-blue-900/20 border-blue-800/30"
              }>
                <CardHeader>
                  <CardTitle className={plan.highlight ? "text-blue-300" : "text-blue-100"}>{plan.title}</CardTitle>
                  <div className="text-3xl font-bold text-white">{plan.price}</div>
                  <CardDescription className="text-blue-100/70">One-time payment</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-2 text-blue-100">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-400">
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Link to="/register" className="w-full">
                    <Button className={`w-full ${plan.highlight ? 
                      "bg-blue-500 hover:bg-blue-600" : 
                      "bg-blue-900/50 hover:bg-blue-800/70 border border-blue-700"}`}>
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
              <h2 className="text-3xl font-bold mb-4 text-blue-300">Meet Bizzy</h2>
              <p className="text-blue-100 mb-4">
                Your AI-powered assistant for navigating the complexities of running a UK business. 
                Bizzy transforms business administration from a chore into a breeze.
              </p>
              <p className="text-blue-100 mb-4">
                We're like what challenger banks were to banking - a modern, digital solution 
                to startup administration and support.
              </p>
              <Button className="bg-blue-500 hover:bg-blue-600">
                Learn More About Bizzy
              </Button>
            </div>
            <div className="md:w-1/2 flex justify-center">
              <div className="relative">
                <div className="absolute inset-0 bg-blue-500/30 blur-3xl rounded-full"></div>
                <AspectRatio ratio={1/1} className="overflow-hidden max-w-[300px] relative">
                  <img 
                    src="/lovable-uploads/502b3627-55d4-4915-b44e-a2aa01e5751e.png" 
                    alt="Bizzy Character" 
                    className="object-contain drop-shadow-[0_0_25px_rgba(59,130,246,0.8)] animate-pulse"
                  />
                </AspectRatio>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-br from-blue-800/50 to-blue-900/30">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4 text-blue-300">Ready to Make Business Easy?</h2>
          <p className="text-xl mb-8 text-blue-100/80 max-w-2xl mx-auto">
            Join thousands of UK startups who are saving time, reducing stress, and ensuring
            compliance with Bizzy's comprehensive platform.
          </p>
          <Link to="/register">
            <Button size="lg" className="bg-blue-500 hover:bg-blue-600">
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
              <h3 className="font-bold mb-4 text-blue-300">Product</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-blue-100/70 hover:text-blue-300 transition-colors">Features</a></li>
                <li><a href="#" className="text-blue-100/70 hover:text-blue-300 transition-colors">Pricing</a></li>
                <li><a href="#" className="text-blue-100/70 hover:text-blue-300 transition-colors">FAQ</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4 text-blue-300">Resources</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-blue-100/70 hover:text-blue-300 transition-colors">Blog</a></li>
                <li><a href="#" className="text-blue-100/70 hover:text-blue-300 transition-colors">Guides</a></li>
                <li><a href="#" className="text-blue-100/70 hover:text-blue-300 transition-colors">Support</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4 text-blue-300">Company</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-blue-100/70 hover:text-blue-300 transition-colors">About Us</a></li>
                <li><a href="#" className="text-blue-100/70 hover:text-blue-300 transition-colors">Careers</a></li>
                <li><a href="#" className="text-blue-100/70 hover:text-blue-300 transition-colors">Contact</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4 text-blue-300">Legal</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-blue-100/70 hover:text-blue-300 transition-colors">Terms</a></li>
                <li><a href="#" className="text-blue-100/70 hover:text-blue-300 transition-colors">Privacy</a></li>
                <li><a href="#" className="text-blue-100/70 hover:text-blue-300 transition-colors">Cookies</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-blue-900/50 mt-12 pt-8 flex justify-between items-center">
            <p className="text-blue-100/70">© 2025 Bizzy. All rights reserved.</p>
            <div className="flex gap-4">
              <a href="#" aria-label="Twitter" className="text-blue-300 hover:text-blue-200 transition-colors">
                <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
                </svg>
              </a>
              <a href="#" aria-label="LinkedIn" className="text-blue-300 hover:text-blue-200 transition-colors">
                <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M6.5 21.5h-5v-13h5v13zM4 6.5C2.5 6.5 1.5 5.3 1.5 4s1-2.4 2.5-2.4c1.6 0 2.5 1 2.6 2.5 0 1.4-1 2.5-2.6 2.5zm11.5 6c-1 0-2 1-2 2v7h-5v-13h5v1.5c1-1.6 2.7-2.5 4.5-2.5 3.5 0 6 2.5 6 6.5v7.5h-5v-7c0-1-1-2-2-2h-1.5z"></path>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;

