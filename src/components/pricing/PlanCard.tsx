
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
  // Get shadow color for hover effect based on plan type
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

  // Get button color based on plan and selection state
  const getButtonClass = () => {
    if (isSelected) {
      return "bg-[#1d4ed8] hover:bg-[#1d4ed8]/90 text-white";
    }
    
    switch (plan.id) {
      case "bronze":
        return "bg-amber-700 hover:bg-amber-800 text-white";
      case "silver":
        return "bg-slate-500 hover:bg-slate-600 text-white";
      case "gold":
        return "bg-amber-500 hover:bg-amber-600 text-white";
      case "platinum":
        return "bg-gray-800 hover:bg-gray-900 text-white";
      default:
        return plan.buttonClass;
    }
  };
  
  return (
    <div className="group perspective-1000">
      <div 
        className={`
          relative transition-all duration-500 ease-out transform-gpu
          group-hover:-translate-y-4 group-hover:scale-[1.03]
          ${isSelected ? "translate-y-[-1rem] scale-[1.03]" : ""}
        `}
      >
        <Card 
          className={`
            ${isSelected 
              ? `border-[#1d4ed8] ring-2 ring-[#1d4ed8] shadow-xl shadow-[#1d4ed8]/40` 
              : `${plan.borderColor} shadow-md`
            } 
            group-hover:shadow-xl group-hover:shadow-${getShadowColor()}
            bg-gradient-to-b ${plan.color}
            cursor-pointer relative backdrop-blur-sm bg-opacity-70 flex flex-col h-full
            transition-all duration-300
          `}
          onClick={() => onSelect(plan.id)}
          style={{
            boxShadow: isSelected 
              ? `0 20px 25px -5px ${getShadowColor()}, 0 8px 10px -6px ${getShadowColor()}`
              : '',
          }}
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
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    className={`${plan.id === "platinum" ? "text-gray-800" : "text-[#60a5fa]"} flex-shrink-0 mt-0.5`}
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
              className={`w-full transition-all duration-300 hover:scale-105 hover:-translate-y-1 hover:shadow-lg ${getButtonClass()}`}
            >
              {isSelected ? "Selected" : "Select Plan"}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};
