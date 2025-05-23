
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
          className="relative cursor-pointer transition-all duration-500 hover:scale-110 animate-pulse" 
          onClick={handleChatWithBizzy} 
          onMouseEnter={() => setIsHovering(true)} 
          onMouseLeave={() => setIsHovering(false)}
          style={{
            animation: 'float 6s ease-in-out infinite',
          }}
        >
          <img 
            src="/lovable-uploads/e33c51f9-ea21-4658-ae6a-bbe28ae76211.png" 
            alt="Bizzy Chat" 
            className="w-[200px]" /* Increased from 160px to 200px */
            style={{ filter: "none" }}
          />
          <style jsx>{`
            @keyframes float {
              0% {
                transform: translatey(0px);
              }
              50% {
                transform: translatey(-20px);
              }
              100% {
                transform: translatey(0px);
              }
            }
          `}</style>
        </div>
      </div>
      <BizzyChat isOpen={chatOpen} onClose={() => setChatOpen(false)} />
    </>;
};

export default BizzyCharacter;
