
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export interface PlanFeature {
  text: string;
}

export interface PlanData {
  id: string;
  title: string;
  price: string;
  color: string;
  textColor: string;
  borderColor: string;
  shadowClass: string;
  buttonClass: string;
  features: string[];
  recommended?: boolean;
}

interface PlanCardProps {
  plan: PlanData;
  isSelected: boolean;
  onSelect: (planId: string) => void;
}

export const PlanCard = ({ plan, isSelected, onSelect }: PlanCardProps) => {
  // Define button colors for each plan
  const getButtonStyles = () => {
    if (isSelected) {
      return "bg-[#1d4ed8] hover:bg-[#1d4ed8]/90 text-white shadow-lg";
    }
    
    switch (plan.id) {
      case "bronze":
        return "bg-amber-700 hover:bg-amber-800 text-white hover:shadow-amber-700/50";
      case "silver":
        return "bg-slate-500 hover:bg-slate-600 text-white hover:shadow-slate-500/50";
      case "gold":
        return "bg-amber-500 hover:bg-amber-600 text-white hover:shadow-amber-500/50";
      case "platinum":
        return "bg-gray-800 hover:bg-gray-900 text-white hover:shadow-gray-800/50";
      default:
        return "bg-blue-900/50 hover:bg-[#1d4ed8]/60 border border-blue-700";
    }
  };

  // Define shadow colors for hover effect
  const getShadowColor = () => {
    switch (plan.id) {
      case "bronze":
        return "rgba(217, 119, 6, 0.5)";
      case "silver":
        return "rgba(148, 163, 184, 0.5)";
      case "gold":
        return "rgba(245, 158, 11, 0.5)";
      case "platinum":
        return "rgba(71, 85, 105, 0.5)";
      default:
        return "rgba(59, 130, 246, 0.5)";
    }
  };

  return (
    <div className="group relative h-full">
      <Card 
        className={`
          ${isSelected 
            ? "border-[#1d4ed8] ring-2 ring-[#1d4ed8]" 
            : plan.borderColor
          } 
          ${plan.color}
          cursor-pointer relative backdrop-blur-sm bg-opacity-70 flex flex-col h-full
          transition-all duration-300 ease-out
          transform-gpu
          hover:-translate-y-2 hover:scale-[1.03]
          shadow-lg hover:shadow-2xl
        `}
        onClick={() => onSelect(plan.id)}
        style={{
          boxShadow: isSelected 
            ? `0 20px 40px -10px ${getShadowColor()}`
            : 'none',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
        onMouseEnter={(e) => {
          const card = e.currentTarget;
          card.style.boxShadow = `0 25px 50px -12px ${getShadowColor()}`;
          card.style.transform = 'translateY(-8px) scale(1.03)';
        }}
        onMouseLeave={(e) => {
          const card = e.currentTarget;
          if (!isSelected) {
            card.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)';
            card.style.transform = 'translateY(0) scale(1)';
          } else {
            card.style.boxShadow = `0 20px 40px -10px ${getShadowColor()}`;
            card.style.transform = 'translateY(0) scale(1)';
          }
        }}
      >
        {plan.recommended && (
          <Badge className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-[#1d4ed8] px-6 py-1 text-base font-bold z-20 shadow-lg">
            Recommended
          </Badge>
        )}
        <CardHeader className={plan.recommended ? "pt-10" : ""}>
          <CardTitle className={`
            ${plan.textColor === "text-gray-800" ? "text-gray-800" : 
              plan.recommended ? "text-[#3b82f6]" : plan.textColor} 
            transition-all duration-300 text-xl font-bold
          `}>
            {plan.title}
          </CardTitle>
          <div className={`
            text-4xl font-bold 
            ${plan.textColor === "text-gray-800" ? "text-gray-800" : plan.textColor} 
            transition-all duration-300 mt-2
          `}>
            {plan.price}
          </div>
          <CardDescription className={`
            ${plan.textColor === "text-gray-800" ? "text-gray-700" : plan.textColor} 
            opacity-90 transition-all duration-300
          `}>
            One-time payment
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-grow">
          <ul className="space-y-3">
            {plan.features.map((feature, i) => (
              <li key={i} className={`
                flex items-start gap-2 
                ${plan.textColor === "text-gray-800" ? "text-gray-700" : plan.textColor} 
                transition-all duration-300
              `}>
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="20" 
                  height="20" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  className={`
                    ${plan.textColor === "text-gray-800" ? "text-gray-800" : "text-[#60a5fa]"} 
                    transition-all duration-300 flex-shrink-0 mt-0.5
                  `}
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
            className={`
              w-full transform transition-all duration-300 
              ${getButtonStyles()}
              hover:scale-105 hover:shadow-lg
              font-semibold
            `}
            onClick={(e) => {
              e.stopPropagation();
              onSelect(plan.id);
            }}
          >
            {isSelected ? "Selected" : "Select Plan"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};
