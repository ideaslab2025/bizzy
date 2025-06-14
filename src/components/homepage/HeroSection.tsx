
import { Link } from "react-router-dom";
import { EnhancedCTAButton } from "@/components/ui/enhanced-cta-button";

interface HeroSectionProps {
  scrollToSection: (sectionId: string) => void;
}

export const HeroSection = ({ scrollToSection }: HeroSectionProps) => {
  return (
    <section className="py-2 md:py-6 pb-40 relative overflow-hidden">
      {/* Animated Gradient Mesh Background */}
      <div className="gradient-mesh-animated">
        <div className="gradient-orb"></div>
      </div>
      
      <div className="absolute inset-0 bg-gradient-to-b from-[#1d4ed8]/10 to-transparent z-0"></div>
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="text-left">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Business without the<br />
              <span className="text-[#3b82f6]">busyness</span>
            </h1>
            <p className="text-xl mb-8 text-blue-100/80 max-w-2xl">All the steps for helping you after company setup, with personalised document templates, step-by-step process guidance and AI assistance</p>
            <div className="flex flex-col md:flex-row flex-wrap gap-4 touch-interaction-spacing">
              <Link to="/register" className="touch-target-cta">
                <EnhancedCTAButton size="lg" variant="primary" showArrow arrowDirection="right" className="w-full md:w-auto">
                  Start Your Journey
                </EnhancedCTAButton>
              </Link>
              <EnhancedCTAButton 
                size="lg" 
                variant="secondary" 
                onClick={() => scrollToSection('features')}
                showArrow 
                arrowDirection="down"
                className="w-full md:w-auto touch-target-cta"
              >
                See How It Works
              </EnhancedCTAButton>
            </div>
          </div>
          <div className="relative h-[500px] md:h-[600px] flex items-center justify-center -mt-32 overflow-visible z-20">
            <img src="/lovable-uploads/642ffc5f-5961-48bc-84b1-0546760e70a3.png" alt="Business owners with paperwork" className="w-[160%] h-full object-contain hero-image" />
          </div>
        </div>
      </div>
    </section>
  );
};
