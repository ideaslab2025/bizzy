
import { useState } from "react";
import { Badge } from "@/components/ui/badge";

const BizzyCharacter = () => {
  const [isHovering, setIsHovering] = useState(false);

  const handleChatWithBizzy = () => {
    // This would integrate with your actual chatbot functionality
    console.log("Opening chatbot...");
    // For now we'll just open a simple alert since we don't have the actual chatbot integration
    alert("Bizzy chatbot would open here!");
  };

  return (
    <div 
      className="relative cursor-pointer transition-all duration-300 hover:scale-110"
      onClick={handleChatWithBizzy}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <img 
        src="/lovable-uploads/e47628c4-cf40-47c0-b63e-4825b01d4574.png" 
        alt="Bizzy assistant" 
        className="w-[120px] drop-shadow-[0_0_15px_rgba(29,78,216,0.7)]"
      />
      <Badge className="absolute -top-4 -right-2 bg-[#1d4ed8]">
        Need help?
      </Badge>
    </div>
  );
};

export default BizzyCharacter;
