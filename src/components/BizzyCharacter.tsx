
import { useState } from "react";

const BizzyCharacter = () => {
  const [isHovering, setIsHovering] = useState(false);
  
  const handleChatWithBizzy = () => {
    // Navigate to progress companion instead of opening separate chat
    window.location.href = '/progress-companion';
  };
  
  return (
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
          className="w-[200px]" 
          style={{ filter: "none" }}
        />
        <style>{`
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
  );
};

export default BizzyCharacter;
