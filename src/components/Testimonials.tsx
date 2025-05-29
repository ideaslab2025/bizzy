
import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

const testimonials = [
  {
    name: "Sarah Johnson",
    position: "CEO, GrowthTech Ltd",
    image: "/lovable-uploads/e47628c4-cf40-47c0-b63e-4825b01d4574.png",
    text: "Bizzy transformed our operations. Setting up all the admin was a breeze, and the document templates saved us countless hours.",
    rating: 5
  },
  {
    name: "Michael Thompson",
    position: "Founder, Innovate Solutions",
    image: "/lovable-uploads/7cff5e86-7507-49eb-a840-ee12479e3704.png",
    text: "The AI guidance was like having a business consultant on demand. Best investment we made for our startup.",
    rating: 5
  },
  {
    name: "Emma Richards",
    position: "Director, Clarity Consulting",
    image: "/lovable-uploads/45d4bf2f-78d8-453d-ba15-ea8ee14cd38d.png",
    text: "From company formation to compliance documents, Bizzy handled it all. Their Gold plan is worth every penny.",
    rating: 4
  },
  {
    name: "David Wilson",
    position: "CFO, NextStep Digital",
    image: "/lovable-uploads/6858378c-f597-4de9-abad-831c0c17c14b.png",
    text: "The document templates alone saved us thousands in legal fees. Bizzy is a must-have for any new business.",
    rating: 5
  },
  {
    name: "Jennifer Adams",
    position: "Owner, Bright Ideas Co",
    image: "/lovable-uploads/0fe1641f-b619-4877-9023-1095fd1e0df1.png",
    text: "I was worried about compliance issues, but Bizzy guided me through each step perfectly. Excellent platform.",
    rating: 5
  }
];

const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [dragStartX, setDragStartX] = useState(0);

  // Auto-scroll every 5 seconds when not hovered
  useEffect(() => {
    if (isHovered) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [isHovered]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const handleDragEnd = (event: any, info: any) => {
    const dragThreshold = 50;
    if (info.offset.x > dragThreshold) {
      goToPrevious();
    } else if (info.offset.x < -dragThreshold) {
      goToNext();
    }
  };

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 300 : -300,
      opacity: 0,
    }),
  };

  return (
    <div 
      className="w-full max-w-4xl mx-auto"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative overflow-hidden">
        {/* Navigation Arrows */}
        <button
          onClick={goToPrevious}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg transition-all duration-200 hover:scale-110"
          aria-label="Previous testimonial"
        >
          <ChevronLeft className="w-6 h-6 text-blue-600" />
        </button>
        
        <button
          onClick={goToNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg transition-all duration-200 hover:scale-110"
          aria-label="Next testimonial"
        >
          <ChevronRight className="w-6 h-6 text-blue-600" />
        </button>

        {/* Testimonial Carousel */}
        <div className="relative h-80 flex items-center justify-center">
          <AnimatePresence mode="wait" custom={currentIndex}>
            <motion.div
              key={currentIndex}
              custom={currentIndex}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 },
              }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={1}
              onDragEnd={handleDragEnd}
              className="absolute w-full flex justify-center cursor-grab active:cursor-grabbing"
            >
              <div className="rounded-full bg-blue-900/30 border-blue-800 w-80 h-80 flex flex-col items-center justify-center p-6 relative overflow-hidden">
                {/* Star rating */}
                <div className="flex items-center gap-1 mb-3">
                  {Array(testimonials[currentIndex].rating).fill(0).map((_, i) => (
                    <svg key={i} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="#3b82f6" stroke="#3b82f6" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                    </svg>
                  ))}
                </div>
                
                {/* Quote text */}
                <div className="relative text-center mb-6">
                  <p className="text-blue-100 italic text-lg px-6 leading-relaxed">
                    <span className="text-blue-500 text-2xl font-serif">"</span>
                    {testimonials[currentIndex].text}
                    <span className="text-blue-500 text-2xl font-serif">"</span>
                  </p>
                </div>
                
                {/* Avatar and details */}
                <div className="flex flex-col items-center mt-auto">
                  <Avatar className="h-24 w-24 mb-3 border-2 border-blue-500">
                    <AvatarImage src={testimonials[currentIndex].image} alt={testimonials[currentIndex].name} />
                    <AvatarFallback>{testimonials[currentIndex].name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <div className="text-center">
                    <p className="font-medium text-[#3b82f6] text-base">{testimonials[currentIndex].name}</p>
                    <p className="text-sm text-blue-100/70">{testimonials[currentIndex].position}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Dot Navigation */}
      <div className="flex justify-center mt-8 gap-2">
        {testimonials.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-200 ${
              index === currentIndex
                ? 'bg-blue-500 scale-125'
                : 'bg-blue-500/30 hover:bg-blue-500/50'
            }`}
            aria-label={`Go to testimonial ${index + 1}`}
          />
        ))}
      </div>
      
      {/* See All Reviews Button */}
      <div className="mt-10 text-center">
        <a href="https://www.trustpilot.com" target="_blank" rel="noopener noreferrer">
          <Button variant="outline" className="border-[#1d4ed8] text-[#3b82f6] hover:bg-blue-900/30 hover:text-white font-medium">
            See All Reviews on Trustpilot
          </Button>
        </a>
      </div>
    </div>
  );
};

export default Testimonials;
