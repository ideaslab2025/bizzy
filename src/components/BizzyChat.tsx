
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Drawer, DrawerClose, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { X } from "lucide-react";

type Message = {
  id: number;
  text: string;
  isUser: boolean;
  timestamp: Date;
};

// Predefined responses based on keywords
// *** MODIFY THIS SECTION TO CHANGE CHATBOT RESPONSES ***
const responses = [
  {
    keywords: ["hello", "hi", "hey", "greetings"],
    response: "Hello! I'm Bizzy, your business setup assistant. How can I help you today?"
  },
  {
    keywords: ["company", "formation", "register", "setup", "start"],
    response: "Setting up your company is easy! Our step-by-step guidance will help you complete all the legal requirements and documentation needed."
  },
  {
    keywords: ["document", "template", "paperwork"],
    response: "We have hundreds of document templates ready for you! These can be automatically personalized with your company details."
  },
  {
    keywords: ["price", "pricing", "cost", "fee", "payment", "pay", "subscription"],
    response: "Our plans start from £100 for the Bronze package. All our plans are one-time payments, no hidden fees or subscriptions!"
  },
  {
    keywords: ["help", "support", "assistance", "contact"],
    response: "Need more help? You can reach our support team at support@bizzy.co.uk or browse our comprehensive guides in the Help Center."
  }
];

// Default responses if no keyword matches
// *** MODIFY THESE RESPONSES FOR NON-MATCHING QUERIES ***
const defaultResponses = [
  "I'd be happy to help with that! Could you provide more details?",
  "That's a great question. Our platform is designed to make business admin simple for you.",
  "I can definitely assist with that. Would you like to see our resources on this topic?",
  "Thanks for asking! Let me find the right information for you.",
  "I'm here to make business admin easier. Could you tell me more about what you need?"
];

const BizzyChat = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "How can we help? Just type in what you are looking for.",
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: messages.length + 1,
      text: newMessage,
      isUser: true,
      timestamp: new Date()
    };

    setMessages((prev) => [...prev, userMessage]);
    setNewMessage("");

    // Generate bot response after a short delay
    setTimeout(() => {
      const botMessage: Message = {
        id: messages.length + 2,
        text: generateResponse(newMessage),
        isUser: false,
        timestamp: new Date()
      };
      setMessages((prev) => [...prev, botMessage]);
    }, 600);
  };

  const generateResponse = (userInput: string): string => {
    const input = userInput.toLowerCase();
    
    // Check for keyword matches
    for (const item of responses) {
      if (item.keywords.some(keyword => input.includes(keyword))) {
        return item.response;
      }
    }
    
    // If no matches, return a random default response
    const randomIndex = Math.floor(Math.random() * defaultResponses.length);
    return defaultResponses[randomIndex];
  };

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <Drawer open={isOpen} onOpenChange={onClose}>
      <DrawerContent className="fixed bottom-0 right-0 rounded-tl-xl h-[60vh] w-full max-w-[350px] mr-0 ml-auto">
        <DrawerHeader className="bg-[#0a192f] text-white border-b border-blue-900/30">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <img 
                src="/lovable-uploads/829e09df-4a1a-4e87-b80b-951eb01a8635.png" 
                alt="Bizzy" 
                className="h-8 w-8"
                style={{ filter: "drop-shadow(0 0 5px rgba(59,130,246,0.8))" }}
              />
              <DrawerTitle className="text-[#3b82f6]">Chat with Bizzy</DrawerTitle>
            </div>
            <DrawerClose className="rounded-full h-8 w-8 flex items-center justify-center hover:bg-blue-900/30">
              <X size={18} />
            </DrawerClose>
          </div>
        </DrawerHeader>

        <div className="flex flex-col h-full bg-[#0a192f]/95">
          <div className="flex-1 p-4 overflow-y-auto">
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.isUser ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] rounded-xl px-4 py-2 ${
                      message.isUser
                        ? "bg-[#1d4ed8] text-white"
                        : "bg-blue-900/30 border border-blue-800 text-blue-100"
                    }`}
                  >
                    {message.text}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </div>

          <form onSubmit={handleSendMessage} className="border-t border-blue-900/30 p-4">
            <div className="flex gap-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 bg-blue-900/30 border border-blue-800 text-blue-100 rounded-xl px-4 py-2 focus:outline-none focus:ring-1 focus:ring-[#3b82f6]"
              />
              <Button 
                type="submit" 
                className="bg-[#1d4ed8] hover:bg-[#1d4ed8]/80 rounded-xl"
                disabled={!newMessage.trim()}
              >
                Send
              </Button>
            </div>
          </form>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default BizzyChat;
