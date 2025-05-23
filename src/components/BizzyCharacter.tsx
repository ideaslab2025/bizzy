import { useState } from "react";
import BizzyChat from "./BizzyChat";
const BizzyCharacter = () => {
  const [isHovering, setIsHovering] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const handleChatWithBizzy = () => {
    setChatOpen(true);
  };
  return <>
      <div className="flex flex-col items-center gap-0">
        <div className="mb-0 text-[#3b82f6] font-bold text-2xl">Say Hello!</div>
        <div className="relative cursor-pointer transition-all duration-300 hover:scale-110 -mt-1" onClick={handleChatWithBizzy} onMouseEnter={() => setIsHovering(true)} onMouseLeave={() => setIsHovering(false)}>
          <img src="/lovable-uploads/829e09df-4a1a-4e87-b80b-951eb01a8635.png" alt="Bizzy assistant" className="w-[120px] drop-shadow-[0_0_15px_rgba(29,78,216,0.7)]" style={{
          filter: "drop-shadow(0 0 10px rgba(59,130,246,0.8))"
        }} />
        </div>
      </div>
      <BizzyChat isOpen={chatOpen} onClose={() => setChatOpen(false)} />
    </>;
};
export default BizzyCharacter;