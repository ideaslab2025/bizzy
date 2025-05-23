
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
      <div className="flex flex-col items-center">
        <div className="mb-2 text-[#3b82f6] font-medium text-sm">
          Chat to Bizzy
        </div>
        <div 
          className="relative cursor-pointer transition-all duration-300 hover:scale-110"
          onClick={handleChatWithBizzy}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          <img 
            src="/lovable-uploads/e47628c4-cf40-47c0-b63e-4825b01d4574.png" 
            alt="Bizzy assistant" 
            className="w-[90px] drop-shadow-[0_0_15px_rgba(29,78,216,0.7)]"
          />
        </div>
      </div>
      <BizzyChat isOpen={chatOpen} onClose={() => setChatOpen(false)} />
    </>
  );
};

export default BizzyCharacter;
