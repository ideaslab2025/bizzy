
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
        className="relative cursor-pointer transition-all duration-500 hover:scale-110 bizzy-float" 
        onClick={handleChatWithBizzy} 
        onMouseEnter={() => setIsHovering(true)} 
        onMouseLeave={() => setIsHovering(false)}
      >
        <img 
          src="/lovable-uploads/e33c51f9-ea21-4658-ae6a-bbe28ae76211.png" 
          alt="Bizzy Chat" 
          className="w-[200px]" 
          style={{ filter: "none" }}
        />
        <style>{`
          .bizzy-float {
            animation: bizzyFloat 6s ease-in-out infinite;
          }
          
          @keyframes bizzyFloat {
            0%, 100% {
              transform: translateY(0px);
            }
            50% {
              transform: translateY(-20px);
            }
          }
        `}</style>
      </div>
    </div>
  );
};

export default BizzyCharacter;
