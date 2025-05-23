
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

const BizzyCharacter = () => {
  const [showDialog, setShowDialog] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  return (
    <>
      <div 
        className="relative cursor-pointer transition-all duration-300 hover:scale-110"
        onClick={() => setShowDialog(true)}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        <img 
          src="/lovable-uploads/502b3627-55d4-4915-b44e-a2aa01e5751e.png"
          alt="Bizzy assistant" 
          className="w-[120px] drop-shadow-[0_0_15px_rgba(29,78,216,0.7)]"
        />
        {isHovering && (
          <Badge className="absolute -top-4 -right-2 animate-bounce bg-[#1d4ed8]">
            Need help?
          </Badge>
        )}
      </div>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="bg-[#0a192f] border border-[#1d4ed8] text-white">
          <DialogHeader>
            <DialogTitle className="text-[#1d4ed8]">Hi, I'm Bizzy!</DialogTitle>
            <DialogDescription className="text-blue-100">
              I can help you navigate the complexities of setting up your business. What would you like help with today?
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <p className="text-blue-100">I can assist with:</p>
            <ul className="space-y-2">
              <li className="flex items-center gap-2 text-blue-100">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#1d4ed8]">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                Company formation documents
              </li>
              <li className="flex items-center gap-2 text-blue-100">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#1d4ed8]">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                Legal requirements and compliance
              </li>
              <li className="flex items-center gap-2 text-blue-100">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#1d4ed8]">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                Financial setup and planning
              </li>
            </ul>
          </div>
          <div className="flex justify-end">
            <Button 
              onClick={() => setShowDialog(false)}
              className="bg-[#1d4ed8] hover:bg-[#1d4ed8]/80 text-white"
            >
              Chat with Bizzy
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default BizzyCharacter;
