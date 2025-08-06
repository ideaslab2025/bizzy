
import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Menu, X, User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { AuthLoadingSkeleton } from "./AuthLoadingSkeleton";
import { useHapticFeedback } from "@/utils/hapticFeedback";

interface NavigationHeaderProps {
  isScrolled: boolean;
  scrollToSection: (sectionId: string) => void;
  handleSignOut: () => void;
}

export const NavigationHeader = ({ isScrolled, scrollToSection, handleSignOut }: NavigationHeaderProps) => {
  const { user, loading } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { trigger } = useHapticFeedback();
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  const navigationItems = [
    { label: "Features", action: () => scrollToSection('features') },
    { label: "Pricing", action: () => scrollToSection('pricing') },
    { label: "FAQs", href: "#faqs" },
    { label: "About", action: () => scrollToSection('about') }
  ];

  // Handle escape key and click outside
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && mobileMenuOpen) {
        setMobileMenuOpen(false);
        trigger('light');
      }
    };

    const handleClickOutside = (event: MouseEvent) => {
      if (mobileMenuOpen && mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
        setMobileMenuOpen(false);
        trigger('light');
      }
    };

    if (mobileMenuOpen) {
      document.addEventListener('keydown', handleEscape);
      document.addEventListener('mousedown', handleClickOutside);
      // Prevent body scroll when menu is open
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen, trigger]);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
    trigger('light');
  };

  const handleNavigationClick = (item: any) => {
    item.action?.();
    setMobileMenuOpen(false);
    trigger('selection');
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-background/95 backdrop-blur-sm border-b border-border' 
        : 'bg-transparent'
    }`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <span className="text-2xl font-bold text-[#3b82f6]">Bizzy</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {navigationItems.map((item) => (
              <button
                key={item.label}
                onClick={item.action}
                className="text-blue-100/80 hover:text-[#3b82f6] transition-colors"
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Auth Section */}
          <div className="flex items-center gap-4">
            {loading ? (
              <AuthLoadingSkeleton />
            ) : user ? (
              <div className="flex items-center gap-4">
                <Link to="/dashboard">
                  <Button variant="outline" size="sm" className="border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white">
                    Dashboard
                  </Button>
                </Link>
                <Button
                  onClick={handleSignOut}
                  variant="ghost"
                  size="sm"
                  className="text-blue-100 hover:text-red-400"
                >
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link to="/login">
                  <Button variant="ghost" size="sm" className="text-blue-100 hover:text-[#3b82f6]">
                    Log In
                  </Button>
                </Link>
                <Link to="/register">
                  <Button size="sm" className="bg-[#3b82f6] hover:bg-[#2563eb] text-white">
                    Get Started
                  </Button>
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={toggleMobileMenu}
              className="md:hidden p-2 text-blue-100 hover:text-[#3b82f6] transition-all duration-200"
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            >
              <div className="relative w-6 h-6">
                <Menu 
                  className={`w-6 h-6 transition-all duration-300 ${
                    mobileMenuOpen ? 'rotate-180 opacity-0' : 'rotate-0 opacity-100'
                  }`} 
                />
                <X 
                  className={`w-6 h-6 absolute top-0 left-0 transition-all duration-300 ${
                    mobileMenuOpen ? 'rotate-0 opacity-100' : 'rotate-180 opacity-0'
                  }`} 
                />
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div 
          ref={mobileMenuRef}
          className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            mobileMenuOpen 
              ? 'max-h-96 opacity-100' 
              : 'max-h-0 opacity-0'
          }`}
        >
          <div className="bg-background/95 backdrop-blur-sm border-t border-border">
            <div className="py-4 space-y-2">
              {navigationItems.map((item) => (
                <button
                  key={item.label}
                  onClick={() => handleNavigationClick(item)}
                  className="block w-full text-left px-4 py-3 text-blue-100/80 hover:text-[#3b82f6] hover:bg-blue-900/20 transition-all duration-200 rounded-md mx-2"
                >
                  {item.label}
                </button>
              ))}
              {!user && (
                <div className="px-4 pt-4 border-t border-blue-900/30 space-y-2">
                  <Link to="/login" className="block">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="w-full text-blue-100 hover:text-[#3b82f6] justify-start"
                      onClick={() => trigger('selection')}
                    >
                      Log In
                    </Button>
                  </Link>
                  <Link to="/register" className="block">
                    <Button 
                      size="sm" 
                      className="w-full bg-[#3b82f6] hover:bg-[#2563eb] text-white"
                      onClick={() => trigger('selection')}
                    >
                      Get Started
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
