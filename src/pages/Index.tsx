import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import BizzyCharacter from "@/components/BizzyCharacter";
import Testimonials from "@/components/Testimonials";
import StatisticsSection from "@/components/StatisticsSection";
import { useAuth } from "@/hooks/useAuth";
import { NavigationHeader } from "@/components/homepage/NavigationHeader";
import { HeroSection } from "@/components/homepage/HeroSection";
import { FeaturesSection } from "@/components/homepage/FeaturesSection";
import { PricingSection } from "@/components/homepage/PricingSection";
import { FAQSection } from "@/components/homepage/FAQSection";
import { FooterSection } from "@/components/homepage/FooterSection";
import { PageLoadingSkeleton } from "@/components/homepage/PageLoadingSkeleton";
import { EnhancedCTAButton } from "@/components/ui/enhanced-cta-button";
import { Link } from "react-router-dom";

const Index = () => {
  const { user, signOut, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [floatingPosition, setFloatingPosition] = useState({
    x: window.innerWidth - 150,
    y: window.innerHeight - 150
  });
  const [isScrolled, setIsScrolled] = useState(false);
  const [headerHeight, setHeaderHeight] = useState(0);
  const [pageLoading, setPageLoading] = useState(true);

  // Add refs for scroll targets
  const faqsRef = useRef<HTMLElement>(null);
  const featuresRef = useRef<HTMLElement>(null);

  useEffect(() => {
    // Simulate initial page load
    const timer = setTimeout(() => {
      setPageLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setFloatingPosition({
        x: window.innerWidth - 150,
        y: window.innerHeight - 150
      });
      updateHeaderHeight();
    };
    
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    const updateHeaderHeight = () => {
      const header = document.querySelector('header');
      if (header) {
        setHeaderHeight(header.offsetHeight);
      }
    };

    updateHeaderHeight();
    
    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleScroll);
    
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
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const yOffset = -headerHeight - 20;
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
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  if (pageLoading) {
    return <PageLoadingSkeleton />;
  }

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <NavigationHeader 
        isScrolled={isScrolled}
        scrollToSection={scrollToSection}
        handleSignOut={handleSignOut}
      />

      {/* Main Content Container with proper spacing for mobile */}
      <div 
        className="min-h-screen"
        style={{ 
          paddingTop: headerHeight > 0 ? `${headerHeight}px` : '80px'
        }}
      >
        <HeroSection scrollToSection={scrollToSection} />

        {/* Added spacer div for better separation */}
        <div className="h-16 md:h-24"></div>

        <FeaturesSection />

        {/* Testimonials Section */}
        <section className="py-20 bg-gradient-to-br from-blue-900/20 to-blue-800/10">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-12 text-center text-[#3b82f6]">What Our Customers Say</h2>
            <Testimonials />
          </div>
        </section>

        <StatisticsSection />

        <PricingSection />

        {/* CTA Section */}
        <section className="py-16 bg-gradient-to-br from-blue-800/50 to-blue-900/30">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4 text-[#3b82f6]">Helping new business owners get going</h2>
            <p className="text-xl mb-8 text-blue-100/80 max-w-2xl mx-auto">Join thousands of UK startups who are saving time, reducing stress, and ensuring compliance with Bizzy's comprehensive platform.</p>
            <Link to="/register" className="touch-target-cta">
              <EnhancedCTAButton 
                size="lg" 
                variant="primary" 
                showArrow
              >
                Get Started Today
              </EnhancedCTAButton>
            </Link>
          </div>
        </section>

        <FAQSection ref={faqsRef} />

        <FooterSection />
      </div>

      {/* Floating Bizzy character with CSS-based positioning */}
      <div className="fixed z-50" style={{
        left: `${floatingPosition.x}px`,
        top: `${floatingPosition.y}px`,
      }}>
        <BizzyCharacter />
      </div>
    </div>
  );
};

export default Index;
