
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export interface PlanData {
  id: string;
  title: string;
  price: string;
  gradient: string;
  textColor: string;
  borderColor: string;
  shadowColor: string;
  buttonBg: string;
  buttonHoverBg: string;
  features: string[];
  recommended?: boolean;
}

interface PlanCardProps {
  plan: PlanData;
  isSelected: boolean;
  onSelect: (planId: string) => void;
}

export const PlanCard = ({ plan, isSelected, onSelect }: PlanCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  
  // Dynamic styles for shadows and borders using inline styles
  const cardStyle: React.CSSProperties = {
    border: `2px solid ${isSelected ? '#1d4ed8' : plan.borderColor}`,
    boxShadow: isSelected 
      ? `0 0 0 2px #1d4ed8, 0 25px 50px -12px rgba(29, 78, 216, 0.5)`
      : isHovered 
        ? `0 25px 50px -12px rgba(${plan.shadowColor}, 0.5)`
        : '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
    transform: `translateY(${isSelected ? '-1rem' : isHovered ? '-0.5rem' : '0'}) scale(${isSelected || isHovered ? '1.03' : '1'})`,
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
  };

  const buttonStyle: React.CSSProperties = {
    backgroundColor: isSelected ? '#1d4ed8' : plan.buttonBg,
    color: 'white',
    transform: isHovered ? 'translateY(-2px) scale(1.05)' : 'scale(1)',
    boxShadow: isHovered ? '0 10px 20px -5px rgba(0, 0, 0, 0.3)' : '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    transition: 'all 0.2s ease-out',
    border: 'none'
  };

  const checkIconColor = plan.id === "platinum" ? "#1f2937" : "#60a5fa";

  return (
    <div 
      className="relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Card 
        className={`relative bg-gradient-to-b ${plan.gradient} cursor-pointer backdrop-blur-sm bg-opacity-70 flex flex-col h-full overflow-hidden`}
        onClick={() => onSelect(plan.id)}
        style={cardStyle}
      >
        {plan.recommended && (
          <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-[#1d4ed8] px-6 py-1 text-sm font-bold z-20 shadow-md">
            Recommended
          </Badge>
        )}
        
        <CardHeader className={plan.recommended ? "pt-10" : ""}>
          <CardTitle className={`${plan.id === "platinum" ? "text-gray-800" : plan.recommended ? "text-[#3b82f6]" : plan.textColor} text-xl`}>
            {plan.title}
          </CardTitle>
          <div className={`text-4xl font-bold ${plan.id === "platinum" ? "text-gray-800" : plan.textColor} mt-2`}>
            {plan.price}
          </div>
          <CardDescription className={`${plan.id === "platinum" ? "text-gray-700" : plan.textColor} opacity-90`}>
            One-time payment
          </CardDescription>
        </CardHeader>
        
        <CardContent className="flex-grow">
          <ul className="space-y-3">
            {plan.features.map((feature, i) => (
              <li key={i} className={`flex items-start gap-2 ${plan.id === "platinum" ? "text-gray-700" : plan.textColor}`}>
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="20" 
                  height="20" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke={checkIconColor}
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  className="flex-shrink-0 mt-0.5"
                >
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                <span className="text-sm">{feature}</span>
              </li>
            ))}
          </ul>
        </CardContent>
        
        <CardFooter className="mt-auto">
          <Button 
            className="w-full"
            style={buttonStyle}
            onMouseEnter={(e) => {
              if (!isSelected) {
                (e.currentTarget as HTMLButtonElement).style.backgroundColor = plan.buttonHoverBg;
              }
            }}
            onMouseLeave={(e) => {
              if (!isSelected) {
                (e.currentTarget as HTMLButtonElement).style.backgroundColor = plan.buttonBg;
              }
            }}
          >
            {isSelected ? "Selected" : "Select Plan"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};
