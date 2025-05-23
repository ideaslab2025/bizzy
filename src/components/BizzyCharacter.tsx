
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
      </div>
      <BizzyChat isOpen={chatOpen} onClose={() => setChatOpen(false)} />
    </>
  );
};

export default BizzyCharacter;
