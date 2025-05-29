
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { useRef } from "react";

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
  const plugin = useRef(
    Autoplay({ delay: 4000, stopOnInteraction: true })
  );

  return (
    <div className="w-full max-w-6xl mx-auto px-4">
      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        plugins={[plugin.current]}
        className="w-full"
        onMouseEnter={plugin.current.stop}
        onMouseLeave={plugin.current.reset}
      >
        <CarouselContent className="-ml-2 md:-ml-4">
          {testimonials.map((testimonial, index) => (
            <CarouselItem key={index} className="pl-2 md:pl-4 md:basis-1/2">
              <Card className="rounded-full bg-blue-900/30 border-blue-800 h-96 w-96 mx-auto">
                <CardContent className="flex flex-col items-center justify-center p-8 h-full">
                  {/* Star rating */}
                  <div className="flex items-center gap-1 mb-4">
                    {Array(testimonial.rating).fill(0).map((_, i) => (
                      <svg key={i} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="#3b82f6" stroke="#3b82f6" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                      </svg>
                    ))}
                  </div>
                  
                  {/* Quote text */}
                  <div className="relative text-center mb-6 flex-1 flex items-center">
                    <p className="text-blue-100 italic text-lg px-6 leading-relaxed">
                      <span className="text-blue-500 text-2xl font-serif">"</span>
                      {testimonial.text}
                      <span className="text-blue-500 text-2xl font-serif">"</span>
                    </p>
                  </div>
                  
                  {/* Avatar and details */}
                  <div className="flex flex-col items-center">
                    <Avatar className="h-20 w-20 mb-3 border-2 border-blue-500">
                      <AvatarImage src={testimonial.image} alt={testimonial.name} />
                      <AvatarFallback>{testimonial.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div className="text-center">
                      <p className="font-medium text-[#3b82f6] text-base">{testimonial.name}</p>
                      <p className="text-sm text-blue-100/70">{testimonial.position}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="bg-white/80 hover:bg-white border-blue-500 text-blue-600" />
        <CarouselNext className="bg-white/80 hover:bg-white border-blue-500 text-blue-600" />
      </Carousel>
      
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
