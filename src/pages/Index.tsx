
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header/Navigation */}
      <header className="border-b sticky top-0 z-10 bg-background">
        <div className="container mx-auto py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <img src="/lovable-uploads/0fe1641f-b619-4877-9023-1095fd1e0df1.png" alt="Bizzy Logo" className="h-12" />
          </div>
          <nav className="hidden md:flex gap-6">
            <a href="#features" className="text-foreground/80 hover:text-foreground transition">Features</a>
            <a href="#pricing" className="text-foreground/80 hover:text-foreground transition">Pricing</a>
            <a href="#about" className="text-foreground/80 hover:text-foreground transition">About</a>
          </nav>
          <div className="flex gap-2">
            <Link to="/login">
              <Button variant="outline">Log in</Button>
            </Link>
            <Link to="/register">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-[#0088cc]/10 to-background">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">Business Without the Busyness</h1>
          <p className="text-xl md:text-2xl mb-8 text-foreground/80 max-w-2xl mx-auto">
            The all-in-one platform for UK startups to handle administration, compliance, and paperwork with ease.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/register">
              <Button size="lg" className="bg-[#0088cc] hover:bg-[#0088cc]/90">Start Your Journey</Button>
            </Link>
            <Button size="lg" variant="outline">
              See How It Works
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">Everything You Need After Forming Your Company</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Step-by-Step Guidance</CardTitle>
                <CardDescription>Interactive process for every stage of your business</CardDescription>
              </CardHeader>
              <CardContent>
                Comprehensive guidance across HR, Finance, Accounting, Payroll, Compliance and more, with skippable sections and interactive learning.
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Document Engine</CardTitle>
                <CardDescription>All templates automatically personalized</CardDescription>
              </CardHeader>
              <CardContent>
                Access hundreds of pre-approved templates for every business need, automatically populated with your company details.
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Bizzy AI Assistant</CardTitle>
                <CardDescription>Your friendly guide through your business journey</CardDescription>
              </CardHeader>
              <CardContent>
                Get real-time help from our AI assistant, pointing you to resources and answering your questions instantly.
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-4 text-center">Simple, Transparent Pricing</h2>
          <p className="text-xl text-center mb-12 text-foreground/80">
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
              <Card key={index} className={plan.highlight ? "border-[#0088cc] shadow-lg" : ""}>
                <CardHeader>
                  <CardTitle>{plan.title}</CardTitle>
                  <div className="text-3xl font-bold">{plan.price}</div>
                  <CardDescription>One-time payment</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#0088cc]">
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Link to="/register" className="w-full">
                    <Button className="w-full" variant={plan.highlight ? "default" : "outline"}>
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
      <section id="about" className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="md:w-1/2">
              <h2 className="text-3xl font-bold mb-4">Meet Bizzy</h2>
              <p className="text-lg mb-4">
                Your AI-powered assistant for navigating the complexities of running a UK business. 
                Bizzy transforms business administration from a chore into a breeze.
              </p>
              <p className="text-lg mb-4">
                We're like what challenger banks were to banking - a modern, digital solution 
                to startup administration and support.
              </p>
              <Button className="bg-[#0088cc] hover:bg-[#0088cc]/90">
                Learn More About Bizzy
              </Button>
            </div>
            <div className="md:w-1/2">
              <AspectRatio ratio={1/1} className="bg-black rounded-full overflow-hidden max-w-[300px] mx-auto">
                <img 
                  src="/lovable-uploads/0fe1641f-b619-4877-9023-1095fd1e0df1.png" 
                  alt="Bizzy Character" 
                  className="object-contain"
                />
              </AspectRatio>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-[#0088cc]/10">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Make Business Easy?</h2>
          <p className="text-xl mb-8 text-foreground/80 max-w-2xl mx-auto">
            Join thousands of UK startups who are saving time, reducing stress, and ensuring
            compliance with Bizzy's comprehensive platform.
          </p>
          <Link to="/register">
            <Button size="lg" className="bg-[#0088cc] hover:bg-[#0088cc]/90">
              Get Started Today
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-background border-t py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-bold mb-4">Product</h3>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-[#0088cc]">Features</a></li>
                <li><a href="#" className="hover:text-[#0088cc]">Pricing</a></li>
                <li><a href="#" className="hover:text-[#0088cc]">FAQ</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4">Resources</h3>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-[#0088cc]">Blog</a></li>
                <li><a href="#" className="hover:text-[#0088cc]">Guides</a></li>
                <li><a href="#" className="hover:text-[#0088cc]">Support</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4">Company</h3>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-[#0088cc]">About Us</a></li>
                <li><a href="#" className="hover:text-[#0088cc]">Careers</a></li>
                <li><a href="#" className="hover:text-[#0088cc]">Contact</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-[#0088cc]">Terms</a></li>
                <li><a href="#" className="hover:text-[#0088cc]">Privacy</a></li>
                <li><a href="#" className="hover:text-[#0088cc]">Cookies</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t mt-12 pt-8 flex justify-between items-center">
            <p>© 2025 Bizzy. All rights reserved.</p>
            <div className="flex gap-4">
              <a href="#" aria-label="Twitter">
                <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
                </svg>
              </a>
              <a href="#" aria-label="LinkedIn">
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
