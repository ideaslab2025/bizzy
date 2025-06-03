
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

type Message = {
  id: number;
  text: string;
  isUser: boolean;
  timestamp: Date;
};

interface RobotChatInterfaceProps {
  onMessageSent?: (message: string) => void;
  className?: string;
}

// Enhanced response system with more contextual replies
const responses = [
  {
    keywords: ["hello", "hi", "hey", "greetings", "start"],
    response: "Hi there! I'm Bizzy, your business setup companion! 🤖 What can I help you with today?"
  },
  {
    keywords: ["company", "formation", "register", "setup", "start", "business"],
    response: "Great question! Setting up your company is my specialty. I can guide you through legal requirements, documentation, and all the steps needed to get your business running! 📋"
  },
  {
    keywords: ["document", "template", "paperwork", "forms"],
    response: "I have access to hundreds of document templates! I can help you generate personalized contracts, agreements, and legal forms. What type of document do you need? 📄"
  },
  {
    keywords: ["price", "pricing", "cost", "fee", "payment", "pay", "subscription", "money"],
    response: "Our plans start from £100 for the Bronze package - that's a one-time payment with no hidden fees or subscriptions! Would you like to see what's included? 💰"
  },
  {
    keywords: ["help", "support", "assistance", "contact", "stuck"],
    response: "I'm here to help! You can ask me anything about business setup, or reach our support team at support@bizzy.co.uk. What specific area do you need guidance on? 🤝"
  },
  {
    keywords: ["progress", "track", "status", "how am i doing"],
    response: "Let me check your progress! You're doing great so far. I can see your completed tasks and suggest what to tackle next. Want me to show you your progress overview? 📊"
  },
  {
    keywords: ["tax", "taxes", "vat", "hmrc"],
    response: "Tax matters can be tricky! I can help you understand VAT registration, tax deadlines, and what records you need to keep. What specific tax question do you have? 🧾"
  }
];

const defaultResponses = [
  "That's an interesting question! I'd love to help you with that. Could you tell me a bit more? 🤔",
  "Great question! Business setup can seem complex, but I'm here to make it simple for you. What specifically would you like to know? ✨",
  "I'm designed to help with all aspects of business administration. Could you provide more details so I can give you the best guidance? 💡",
  "Thanks for asking! Let me help you navigate this. What particular area of business setup are you focusing on? 🎯",
  "I love helping entrepreneurs like you! Can you share more details about what you're trying to achieve? 🚀"
];

export const RobotChatInterface: React.FC<RobotChatInterfaceProps> = ({ 
  onMessageSent, 
  className = "" 
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hello! I'm Bizzy, your business setup assistant. Ask me anything about starting your business! 🚀",
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: messages.length + 1,
      text: newMessage,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    onMessageSent?.(newMessage);
    setNewMessage("");
    setIsTyping(true);

    // Simulate robot thinking time
    await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 1200));

    // Generate bot response
    const botMessage: Message = {
      id: messages.length + 2,
      text: generateResponse(userMessage.text),
      isUser: false,
      timestamp: new Date()
    };

    setIsTyping(false);
    setMessages(prev => [...prev, botMessage]);
  };

  const generateResponse = (userInput: string): string => {
    const input = userInput.toLowerCase();
    
    // Check for keyword matches
    for (const item of responses) {
      if (item.keywords.some(keyword => input.includes(keyword))) {
        return item.response;
      }
    }
    
    // Return random default response
    const randomIndex = Math.floor(Math.random() * defaultResponses.length);
    return defaultResponses[randomIndex];
  };

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  return (
    <div className={`relative ${className}`}>
      {/* Chat Toggle Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="absolute -top-12 right-4 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-3 shadow-lg transition-all duration-200 z-10"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Toggle chat with Bizzy"
      >
        <MessageCircle className="w-5 h-5" />
      </motion.button>

      {/* Chat Interface */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute -top-96 left-1/2 transform -translate-x-1/2 w-80 h-80 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden z-20"
          >
            {/* Chat Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <MessageCircle className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-medium">Chat with Bizzy</h3>
                  <p className="text-xs text-blue-100">Your business assistant</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white/80 hover:text-white transition-colors"
                aria-label="Close chat"
              >
                ✕
              </button>
            </div>

            {/* Messages Area */}
            <div className="flex flex-col h-64">
              <div className="flex-1 p-4 overflow-y-auto space-y-3">
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                  >
                    {/* Speech Bubble */}
                    <div
                      className={`max-w-[80%] rounded-2xl px-3 py-2 relative ${
                        message.isUser
                          ? 'bg-blue-600 text-white rounded-br-md'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-bl-md'
                      }`}
                    >
                      <p className="text-sm leading-relaxed">{message.text}</p>
                      
                      {/* Speech Bubble Tail */}
                      <div
                        className={`absolute bottom-0 w-0 h-0 ${
                          message.isUser
                            ? 'right-0 border-l-[12px] border-t-[8px] border-l-transparent border-t-blue-600'
                            : 'left-0 border-r-[12px] border-t-[8px] border-r-transparent border-t-gray-100 dark:border-t-gray-700'
                        }`}
                      />
                    </div>
                  </motion.div>
                ))}

                {/* Typing Indicator */}
                <AnimatePresence>
                  {isTyping && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="flex justify-start"
                    >
                      <div className="bg-gray-100 dark:bg-gray-700 rounded-2xl rounded-bl-md px-4 py-3 relative">
                        <div className="flex space-x-1">
                          <motion.div
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                            className="w-2 h-2 bg-gray-400 rounded-full"
                          />
                          <motion.div
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                            className="w-2 h-2 bg-gray-400 rounded-full"
                          />
                          <motion.div
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                            className="w-2 h-2 bg-gray-400 rounded-full"
                          />
                        </div>
                        
                        {/* Typing Bubble Tail */}
                        <div className="absolute bottom-0 left-0 border-r-[12px] border-t-[8px] border-r-transparent border-t-gray-100 dark:border-t-gray-700 w-0 h-0" />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <form onSubmit={handleSendMessage} className="p-3 border-t border-gray-200 dark:border-gray-600">
                <div className="flex gap-2">
                  <input
                    ref={inputRef}
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Ask Bizzy anything..."
                    className="flex-1 bg-gray-100 dark:bg-gray-700 border-0 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-gray-100"
                    disabled={isTyping}
                  />
                  <Button 
                    type="submit" 
                    size="sm"
                    className="bg-blue-600 hover:bg-blue-700 rounded-full p-2 min-w-[36px]"
                    disabled={!newMessage.trim() || isTyping}
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default RobotChatInterface;
