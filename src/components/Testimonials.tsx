
import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";

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
  const [api, setApi] = useState<any>();

  // Auto-scroll every 5 seconds
  useEffect(() => {
    if (!api) return;
    
    const interval = setInterval(() => {
      api.scrollNext();
    }, 5000);
    
    return () => clearInterval(interval);
  }, [api]);

  return (
    <div className="w-full max-w-4xl mx-auto">
      <Carousel
        setApi={setApi}
        className="w-full"
        opts={{
          align: "start",
          loop: true,
        }}
      >
        <CarouselContent className="-ml-2">
          {testimonials.map((testimonial, index) => (
            <CarouselItem key={index} className="md:basis-1/3 pl-2">
              <div className="flex flex-col items-center">
                <div className="rounded-full bg-blue-900/30 border-blue-800 w-72 h-72 flex flex-col items-center justify-center p-4 relative overflow-hidden">
                  {/* Star rating */}
                  <div className="flex items-center gap-1 mb-2">
                    {Array(testimonial.rating).fill(0).map((_, i) => (
                      <svg key={i} xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="#3b82f6" stroke="#3b82f6" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                      </svg>
                    ))}
                  </div>
                  
                  {/* Updated quotes styling with proper quote marks */}
                  <div className="relative text-center mb-4">
                    <p className="text-blue-100 italic text-base px-7 line-clamp-4">
                      <span className="text-blue-500 text-xl font-serif">"</span>
                      {testimonial.text}
                      <span className="text-blue-500 text-xl font-serif">"</span>
                    </p>
                  </div>
                  
                  {/* Moved up slightly */}
                  <div className="flex flex-col items-center mt-auto mb-3">
                    <Avatar className="h-20 w-20 mb-2 border-2 border-blue-500">
                      <AvatarImage src={testimonial.image} alt={testimonial.name} />
                      <AvatarFallback>{testimonial.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div className="text-center">
                      <p className="font-medium text-[#3b82f6] text-sm">{testimonial.name}</p>
                      <p className="text-xs text-blue-100/70">{testimonial.position}</p>
                    </div>
                  </div>
                </div>
                
                {/* Removed "View on Trustpilot" link */}
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-0 bg-white text-blue-500 border-blue-300 opacity-100" />
        <CarouselNext className="right-0 bg-white text-blue-500 border-blue-300 opacity-100" />
      </Carousel>
      
      {/* Kept the main "See All Reviews" button */}
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
