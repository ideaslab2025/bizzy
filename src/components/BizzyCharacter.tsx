
import { useState } from "react";
import BizzyChat from "./BizzyChat";

const BizzyCharacter = () => {
  const [isHovering, setIsHovering] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);

  const handleChatWithBizzy = () => {
    setChatOpen(true);
  };

  return (
    <>
      <div className="flex flex-col items-center gap-1">
        <div className="mb-0 text-[#3b82f6] font-bold text-xl">
          Chat to Bizzy!
        </div>
        <div 
          className="relative cursor-pointer transition-all duration-300 hover:scale-110"
          onClick={handleChatWithBizzy}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          <img 
            src="/lovable-uploads/829e09df-4a1a-4e87-b80b-951eb01a8635.png" 
            alt="Bizzy assistant" 
            className="w-[110px] drop-shadow-[0_0_15px_rgba(29,78,216,0.7)]"
          />
        </div>
      </div>
      <BizzyChat isOpen={chatOpen} onClose={() => setChatOpen(false)} />
    </>
  );
};

export default BizzyCharacter;
