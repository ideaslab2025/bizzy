import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Star, Menu, X, User, LogOut } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/useAuth";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import BizzyCharacter from "@/components/BizzyCharacter";
import Testimonials from "@/components/Testimonials";
import PricingNew from "@/components/pricing/PricingNew";
import BizzyChat from "@/components/BizzyChat";

const Index = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showChat, setShowChat] = useState(false);
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

  useEffect(() => {
    const handleScroll = () => {
      const header = document.querySelector('nav');
      if (header) {
        if (window.scrollY > 50) {
          header.classList.add('sticky');
        } else {
          header.classList.remove('sticky');
        }
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0a192f]/95 backdrop-blur-md border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-2">
              <img 
                src="/lovable-uploads/502b3627-55d4-4915-b44e-a2aa01e5751e.png" 
                alt="Bizzy" 
                className="h-12 w-auto" 
              />
            </Link>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <button 
                onClick={() => scrollToSection('features')} 
                className="text-white hover:text-blue-200 transition-colors"
              >
                Features
              </button>
              <button 
                onClick={() => scrollToSection('meet-bizzy')} 
                className="text-white hover:text-blue-200 transition-colors"
              >
                Meet Bizzy
              </button>
              <button 
                onClick={() => scrollToSection('testimonials')} 
                className="text-white hover:text-blue-200 transition-colors"
              >
                Testimonials
              </button>
              <button 
                onClick={() => scrollToSection('pricing')} 
                className="text-white hover:text-blue-200 transition-colors"
              >
                Pricing
              </button>
              
              {user ? (
                <div className="flex items-center gap-4">
                  <Link 
                    to="/dashboard" 
                    className="bg-[#1d4ed8] text-white px-6 py-2 rounded-lg hover:bg-[#1e40af] transition-colors"
                  >
                    Dashboard
                  </Link>
                  
                  {/* Account Dropdown with hover */}
                  <div 
                    className="relative"
                    onMouseEnter={() => setIsAccountDropdownOpen(true)}
                    onMouseLeave={() => setIsAccountDropdownOpen(false)}
                  >
                    <DropdownMenu open={isAccountDropdownOpen}>
                      <DropdownMenuTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="flex items-center gap-2 text-white hover:text-blue-200 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 font-medium"
                        >
                          <User className="h-4 w-4" />
                          <span className="hidden sm:inline">
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
                  <Link 
                    to="/login" 
                    className="text-[#1d4ed8] bg-white px-6 py-2 rounded-lg hover:bg-gray-50 transition-colors border border-[#1d4ed8]"
                  >
                    Login
                  </Link>
                  <Link 
                    to="/register" 
                    className="bg-[#1d4ed8] text-white px-6 py-2 rounded-lg hover:bg-[#1e40af] transition-colors"
                  >
                    Get Started
                  </Link>
                </div>
              )}
            </div>
            
            {/* Mobile menu button */}
            <button
              className="md:hidden text-white"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="w-10 h-10" /> : <Menu className="w-10 h-10" />}
            </button>
          </div>
          
          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden mt-4 pb-4 border-t border-gray-200">
              <div className="flex flex-col space-y-4 pt-4">
                <button 
                  onClick={() => { scrollToSection('features'); setIsMenuOpen(false); }} 
                  className="text-white hover:text-blue-200 text-left"
                >
                  Features
                </button>
                <button 
                  onClick={() => { scrollToSection('meet-bizzy'); setIsMenuOpen(false); }} 
                  className="text-white hover:text-blue-200 text-left"
                >
                  Meet Bizzy
                </button>
                <button 
                  onClick={() => { scrollToSection('testimonials'); setIsMenuOpen(false); }} 
                  className="text-white hover:text-blue-200 text-left"
                >
                  Testimonials
                </button>
                <button 
                  onClick={() => { scrollToSection('pricing'); setIsMenuOpen(false); }} 
                  className="text-white hover:text-blue-200 text-left"
                >
                  Pricing
                </button>
                {user ? (
                  <>
                    <Link 
                      to="/dashboard" 
                      className="text-[#1d4ed8] bg-white px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors text-lg"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Dashboard
                    </Link>
                    <button 
                      onClick={() => { handleSignOut(); setIsMenuOpen(false); }}
                      className="text-red-600 hover:text-red-700 text-left"
                    >
                      Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <Link 
                      to="/login" 
                      className="text-[#1d4ed8] bg-white px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors text-lg"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Login
                    </Link>
                    <Link 
                      to="/register" 
                      className="bg-[#1d4ed8] text-white px-4 py-2 rounded-lg hover:bg-[#1e40af] transition-colors text-lg"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Get Started
                    </Link>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section id="hero" className="py-24 md:py-36">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="text-center md:text-left">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Unlock Your Business Potential with Bizzy
              </h1>
              <p className="text-lg text-gray-700 mb-8">
                Your all-in-one platform for business guidance, document creation, and expert consultations.
              </p>
              <div className="space-x-4">
                <Link to="/register">
                  <Button className="bg-[#1d4ed8] text-white hover:bg-[#1e40af] transition-colors">
                    Get Started
                  </Button>
                </Link>
                <Link to="/guided-help">
                  <Button variant="outline">Explore Services</Button>
                </Link>
              </div>
            </div>
            <div className="relative">
              <AspectRatio ratio={16 / 9}>
                <img
                  src="/hero-image-bizzy.png"
                  alt="Bizzy Platform"
                  className="hero-image rounded-lg"
                />
              </AspectRatio>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="pt-12 pb-8">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-semibold text-center text-gray-900 mb-8">
            Everything You Need to Start, Run, and Grow Your Business
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <div className="relative overflow-hidden rounded-lg">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-blue-600 opacity-20"></div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  AI-Powered Business Guidance
                </h3>
                <p className="text-gray-700">
                  Get personalized recommendations and insights to make informed decisions.
                </p>
                <Badge className="mt-4 bg-blue-100 text-blue-600 border-blue-200">
                  AI-Driven
                </Badge>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="relative overflow-hidden rounded-lg">
              <div className="absolute inset-0 bg-gradient-to-br from-green-400 to-green-600 opacity-20"></div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Automated Document Creation
                </h3>
                <p className="text-gray-700">
                  Generate legal documents, contracts, and HR policies in minutes.
                </p>
                <Badge className="mt-4 bg-green-100 text-green-600 border-green-200">
                  Save Time
                </Badge>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="relative overflow-hidden rounded-lg">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-400 to-purple-600 opacity-20"></div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Expert Business Consultations
                </h3>
                <p className="text-gray-700">
                  Connect with experienced consultants for personalized advice and support.
                </p>
                <Badge className="mt-4 bg-purple-100 text-purple-600 border-purple-200">
                  Get Advice
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Meet Bizzy Section */}
      <section id="meet-bizzy" className="bg-white py-6">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-2 items-center">
            <div>
              <BizzyCharacter />
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                Meet Bizzy - Your AI Business Assistant
              </h2>
              <p className="text-gray-700 py-2">
                Bizzy is designed to help you navigate the complexities of starting and running a business.
                From answering your questions to providing tailored guidance, Bizzy is here to support you every step of the way.
              </p>
              <div className="py-4">
                <Button onClick={() => setShowChat(true)}>Chat with Bizzy</Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-12 bg-gradient-to-br from-blue-50 to-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-semibold text-center text-gray-900 mb-8">
            What Our Users Are Saying
          </h2>
          <Testimonials />
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-semibold text-center text-gray-900 mb-12">
            Flexible Pricing Plans for Every Business
          </h2>
          <PricingNew />
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0a192f] py-8">
        <div className="container mx-auto px-4">
          <p className="text-center text-gray-400">
            &copy; {new Date().getFullYear()} Bizzy. All rights reserved.
          </p>
        </div>
      </footer>

      {/* Bizzy Chat */}
      {showChat && <BizzyChat onClose={() => setShowChat(false)} />}
    </div>
  );
};

export default Index;
