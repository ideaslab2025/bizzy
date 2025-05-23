
import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { useInterval } from "@/hooks/use-interval";

const testimonials = [
  {
    name: "Sarah Johnson",
    position: "CEO, GrowthTech Ltd",
    image: "/placeholder.svg",
    text: "Bizzy transformed our operations. Setting up all the admin was a breeze, and the document templates saved us countless hours.",
    rating: 5
  },
  {
    name: "Michael Thompson",
    position: "Founder, Innovate Solutions",
    image: "/placeholder.svg",
    text: "The AI guidance was like having a business consultant on demand. Best investment we made for our startup.",
    rating: 5
  },
  {
    name: "Emma Richards",
    position: "Director, Clarity Consulting",
    image: "/placeholder.svg",
    text: "From company formation to compliance documents, Bizzy handled it all. Their Gold plan is worth every penny.",
    rating: 4
  },
  {
    name: "David Wilson",
    position: "CFO, NextStep Digital",
    image: "/placeholder.svg",
    text: "The document templates alone saved us thousands in legal fees. Bizzy is a must-have for any new business.",
    rating: 5
  },
  {
    name: "Jennifer Adams",
    position: "Owner, Bright Ideas Co",
    image: "/placeholder.svg",
    text: "I was worried about compliance issues, but Bizzy guided me through each step perfectly. Excellent platform.",
    rating: 5
  }
];

const Testimonials = () => {
  const [api, setApi] = useState<any>();

  // Auto-scroll every 5 seconds
  useInterval(() => {
    if (api) {
      api.scrollNext();
    }
  }, 5000);

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
        <CarouselContent>
          {testimonials.map((testimonial, index) => (
            <CarouselItem key={index} className="md:basis-1/3 pl-4">
              <Card className="bg-blue-900/30 border-blue-800 h-full">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2 mb-4">
                    {Array(testimonial.rating).fill(0).map((_, i) => (
                      <svg key={i} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="#3b82f6" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                      </svg>
                    ))}
                  </div>
                  
                  <p className="text-blue-100 mb-6 italic">"{testimonial.text}"</p>
                  
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={testimonial.image} alt={testimonial.name} />
                      <AvatarFallback>{testimonial.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-[#3b82f6]">{testimonial.name}</p>
                      <p className="text-sm text-blue-100/70">{testimonial.position}</p>
                    </div>
                  </div>
                </CardContent>
                
                <CardFooter className="border-t border-blue-800/50 pt-4">
                  <a href="https://www.trustpilot.com" target="_blank" rel="noopener noreferrer" className="text-sm text-[#3b82f6] flex items-center">
                    <span>View on Trustpilot</span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-1">
                      <line x1="7" y1="17" x2="17" y2="7"></line>
                      <polyline points="7 7 17 7 17 17"></polyline>
                    </svg>
                  </a>
                </CardFooter>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-0" />
        <CarouselNext className="right-0" />
      </Carousel>
      
      <div className="mt-10 text-center">
        <a href="https://www.trustpilot.com" target="_blank" rel="noopener noreferrer">
          <Button variant="outline" className="border-[#1d4ed8] text-[#3b82f6] hover:bg-blue-900/30">
            See All Reviews on Trustpilot
          </Button>
        </a>
      </div>
    </div>
  );
};

export default Testimonials;
