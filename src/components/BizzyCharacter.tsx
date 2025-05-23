
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
            src="/lovable-uploads/0d9fe08c-c696-458d-ac9c-7222b1d84ca7.png" 
            alt="Bizzy assistant" 
            className="w-[120px]" 
          />
        </div>
      </div>
      <BizzyChat isOpen={chatOpen} onClose={() => setChatOpen(false)} />
    </>;
};

export default BizzyCharacter;
