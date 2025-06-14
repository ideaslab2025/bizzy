import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Menu, X, User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { AuthLoadingSkeleton } from "./AuthLoadingSkeleton";

interface NavigationHeaderProps {
  isScrolled: boolean;
  scrollToSection: (sectionId: string) => void;
  handleSignOut: () => void;
}

export const NavigationHeader = ({ isScrolled, scrollToSection, handleSignOut }: NavigationHeaderProps) => {
  const { user, loading } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigationItems = [
    { label: "Features", action: () => scrollToSection('features') },
    { label: "Pricing", action: () => scrollToSection('pricing') },
    { label: "FAQs", href: "#faqs" },
    { label: "About", action: () => scrollToSection('about') }
  ];

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-[#0a192f]/95 backdrop-blur-sm border-b border-blue-900/30' 
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
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-blue-100 hover:text-[#3b82f6]"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-[#0a192f]/95 backdrop-blur-sm border-t border-blue-900/30">
            <div className="py-4 space-y-4">
              {navigationItems.map((item) => (
                <button
                  key={item.label}
                  onClick={() => {
                    item.action?.();
                    setMobileMenuOpen(false);
                  }}
                  className="block w-full text-left px-4 py-2 text-blue-100/80 hover:text-[#3b82f6] transition-colors"
                >
                  {item.label}
                </button>
              ))}
              {!user && (
                <div className="px-4 pt-4 border-t border-blue-900/30 space-y-2">
                  <Link to="/login" className="block">
                    <Button variant="ghost" size="sm" className="w-full text-blue-100 hover:text-[#3b82f6]">
                      Log In
                    </Button>
                  </Link>
                  <Link to="/register" className="block">
                    <Button size="sm" className="w-full bg-[#3b82f6] hover:bg-[#2563eb] text-white">
                      Get Started
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
