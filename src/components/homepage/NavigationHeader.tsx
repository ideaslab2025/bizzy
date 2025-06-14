
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { User, LogOut, X } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/useAuth";

interface NavigationHeaderProps {
  isScrolled: boolean;
  scrollToSection: (sectionId: string) => void;
  handleSignOut: () => Promise<void>;
}

export const NavigationHeader = ({ isScrolled, scrollToSection, handleSignOut }: NavigationHeaderProps) => {
  const { user } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const HamburgerIcon = ({ isOpen }: { isOpen: boolean }) => (
    <div className="w-6 h-6 flex flex-col justify-around">
      <span className={`w-full h-0.5 bg-[#3b82f6] transition-all duration-300 ${
        isOpen ? 'rotate-45 translate-y-2' : ''
      }`} />
      <span className={`w-full h-0.5 bg-[#3b82f6] transition-all duration-300 ${
        isOpen ? 'opacity-0' : ''
      }`} />
      <span className={`w-full h-0.5 bg-[#3b82f6] transition-all duration-300 ${
        isOpen ? '-rotate-45 -translate-y-2' : ''
      }`} />
    </div>
  );

  return (
    <header className={`
      border-b border-blue-900/30 fixed top-0 z-50 w-full transition-all duration-300
      ${isScrolled 
        ? 'bg-[#0a192f] bg-opacity-95 backdrop-blur-md shadow-lg' 
        : 'bg-[#0a192f] bg-opacity-100'
      }
    `}>
      <div className="container mx-auto py-0 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2 md:touch-target-none touch-target-large">
          <img src="/lovable-uploads/502b3627-55d4-4915-b44e-a2aa01e5751e.png" alt="Bizzy Logo" className="h-40" />
        </Link>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex gap-6">
          <a href="#about" className="text-[#3b82f6] hover:text-[#60a5fa] transition text-xl font-bold touch-target-standard">About</a>
          <a href="#features" className="text-[#3b82f6] hover:text-[#60a5fa] transition text-xl font-bold touch-target-standard">Features</a>
          <a href="#pricing" className="text-[#3b82f6] hover:text-[#60a5fa] transition text-xl font-bold touch-target-standard">Pricing</a>
          <a href="#faqs" className="text-[#3b82f6] hover:text-[#60a5fa] transition text-xl font-bold touch-target-standard">FAQs</a>
        </nav>
        
        <div className="flex gap-2 items-center">
          {/* Show user account if logged in */}
          {user ? (
            <>
              {/* Desktop Account Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild className="hidden md:flex">
                  <Button variant="ghost" className="flex items-center gap-2 text-[#1d4ed8] hover:text-[#3b82f6] hover:bg-blue-900/30 focus:outline-none focus:ring-2 focus:ring-blue-500 data-[state=open]:bg-blue-900/30 touch-target-large">
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
                    <Link to="/dashboard" className="flex items-center gap-2 w-full text-gray-700 hover:text-gray-900 hover:bg-gray-50 px-2 py-2 cursor-pointer touch-target-standard">
                      <User className="h-4 w-4" />
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut} className="flex items-center gap-2 text-red-600 focus:text-red-600 hover:bg-red-50 cursor-pointer px-2 py-2 touch-target-standard">
                    <LogOut className="h-4 w-4" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              {/* Desktop Auth Buttons */}
              <Link to="/login" className="hidden md:block">
                <Button variant="ghost" className="text-[#1d4ed8] hover:text-[#3b82f6] hover:bg-blue-900/30 touch-target-large">Log in</Button>
              </Link>
              <Link to="/register" className="hidden md:block">
                <Button className="bg-[#1d4ed8] hover:bg-[#1d4ed8]/80 touch-target-large">Get Started</Button>
              </Link>
            </>
          )}
          
          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-3 rounded-md hover:bg-blue-900/30 transition-colors touch-target-large"
            aria-label="Toggle navigation menu"
          >
            <HamburgerIcon isOpen={isMobileMenuOpen} />
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          
          <div className={`
            fixed top-0 right-0 h-full w-80 bg-[#0a192f] shadow-2xl border-l border-blue-900/30
            transform transition-transform duration-300 ease-out
            ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}
          `}>
            <div className="flex items-center justify-between p-6 border-b border-blue-900/30">
              <img src="/lovable-uploads/502b3627-55d4-4915-b44e-a2aa01e5751e.png" alt="Bizzy Logo" className="h-16" />
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-3 rounded-md hover:bg-blue-900/30 transition-colors touch-target-large"
                aria-label="Close menu"
              >
                <X className="w-6 h-6 text-[#3b82f6]" />
              </button>
            </div>

            <nav className="flex flex-col p-6 space-y-2">
              <button 
                onClick={() => { scrollToSection('about'); setIsMobileMenuOpen(false); }}
                className="text-left text-xl font-bold text-[#3b82f6] hover:text-[#60a5fa] transition-colors py-3 px-2 touch-target-large"
              >
                About
              </button>
              <button 
                onClick={() => { scrollToSection('features'); setIsMobileMenuOpen(false); }}
                className="text-left text-xl font-bold text-[#3b82f6] hover:text-[#60a5fa] transition-colors py-3 px-2 touch-target-large"
              >
                Features
              </button>
              <button 
                onClick={() => { scrollToSection('pricing'); setIsMobileMenuOpen(false); }}
                className="text-left text-xl font-bold text-[#3b82f6] hover:text-[#60a5fa] transition-colors py-3 px-2 touch-target-large"
              >
                Pricing
              </button>
              <button 
                onClick={() => { scrollToSection('faqs'); setIsMobileMenuOpen(false); }}
                className="text-left text-xl font-bold text-[#3b82f6] hover:text-[#60a5fa] transition-colors py-3 px-2 touch-target-large"
              >
                FAQs
              </button>

              {/* User-specific navigation */}
              {user ? (
                <>
                  <div className="border-t border-blue-900/30 pt-6 mt-4">
                    <div className="flex items-center gap-3 mb-6 p-3 rounded-lg bg-blue-900/20">
                      <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-sm font-medium text-white">
                        {user?.user_metadata?.company_name?.charAt(0)?.toUpperCase() || user?.user_metadata?.first_name?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || 'U'}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-white">
                          {user?.user_metadata?.company_name || (user?.user_metadata?.first_name ? `${user.user_metadata.first_name.charAt(0).toUpperCase() + user.user_metadata.first_name.slice(1)}` : user?.email?.split('@')[0] || 'Account')}
                        </div>
                        <div className="text-xs text-blue-300">{user?.email}</div>
                      </div>
                    </div>
                  </div>
                  <Link 
                    to="/dashboard" 
                    className="text-xl font-bold text-white hover:text-[#60a5fa] transition-colors py-3 px-2 block touch-target-large"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <button 
                    onClick={() => { handleSignOut(); setIsMobileMenuOpen(false); }}
                    className="text-left text-xl font-bold text-red-400 hover:text-red-300 transition-colors py-3 px-2 touch-target-large"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <div className="border-t border-blue-900/30 pt-6 mt-4 space-y-3">
                  <Link 
                    to="/login" 
                    className="block text-xl font-bold text-[#1d4ed8] hover:text-[#3b82f6] transition-colors py-3 px-2 touch-target-large"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Log In
                  </Link>
                  <Link 
                    to="/register" 
                    className="block"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Button className="w-full bg-[#1d4ed8] hover:bg-[#1d4ed8]/80 text-lg py-4 touch-target-large">
                      Get Started
                    </Button>
                  </Link>
                </div>
              )}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};
