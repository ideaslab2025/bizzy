
import { useState } from "react";
import BizzyChat from "./BizzyChat";

const BizzyCharacter = () => {
  const [isHovering, setIsHovering] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  
  const handleChatWithBizzy = () => {
    setChatOpen(true);
  };
  
  return <>
      <div className="flex flex-col items-center">
        <div 
          className="relative cursor-pointer transition-all duration-300 hover:scale-110" 
          onClick={handleChatWithBizzy} 
          onMouseEnter={() => setIsHovering(true)} 
          onMouseLeave={() => setIsHovering(false)}
        >
          <img 
            src="/lovable-uploads/e33c51f9-ea21-4658-ae6a-bbe28ae76211.png" 
            alt="Bizzy Chat" 
            className="w-[120px]" 
            style={{ filter: "none" }}
          />
        </div>
      </div>
      <BizzyChat isOpen={chatOpen} onClose={() => setChatOpen(false)} />
    </>;
};

export default BizzyCharacter;
