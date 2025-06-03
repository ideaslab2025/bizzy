
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, MessageCircle, X } from 'lucide-react';
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
  const [hasError, setHasError] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    setHasError(false);

    // Add user message
    const userMessage: Message = {
      id: Date.now(),
      text: newMessage,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    onMessageSent?.(newMessage);
    setNewMessage("");
    setIsTyping(true);

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 1200));

      // Generate bot response
      const botMessage: Message = {
        id: Date.now() + 1,
        text: generateResponse(userMessage.text),
        isUser: false,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      setHasError(true);
      
      const errorMessage: Message = {
        id: Date.now() + 1,
        text: "Sorry, I encountered an error. Please try again.",
        isUser: false,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
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

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  return (
    <div className={`relative ${className}`}>
      {/* Enhanced Chat Toggle Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="relative bg-blue-600 hover:bg-blue-700 text-white rounded-full p-3 shadow-lg transition-all duration-200 z-10 min-w-[48px] min-h-[48px]"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        animate={!isOpen ? { 
          scale: [1, 1.05, 1],
          transition: { duration: 2, repeat: Infinity }
        } : {}}
        aria-label={isOpen ? "Close chat with Bizzy" : "Chat with Bizzy"}
        title={isOpen ? "Close chat" : "Chat with Bizzy"}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <X className="w-5 h-5" />
            </motion.div>
          ) : (
            <motion.div
              key="chat"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <MessageCircle className="w-5 h-5" />
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Chat label */}
        <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-xs text-gray-600 dark:text-gray-400 font-medium whitespace-nowrap">
          Chat with Bizzy
        </div>
      </motion.button>

      {/* Enhanced Chat Interface */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="absolute -top-96 left-1/2 transform -translate-x-1/2 w-80 h-80 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden z-20"
          >
            {/* Chat Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <MessageCircle className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-semibold">Chat with Bizzy</h3>
                  <p className="text-xs text-blue-100">Your business assistant</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white/80 hover:text-white transition-colors p-1 rounded"
                aria-label="Close chat"
              >
                <X className="w-4 h-4" />
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
                    {/* Enhanced Speech Bubble */}
                    <div
                      className={`max-w-[85%] rounded-2xl px-4 py-3 relative shadow-md ${
                        message.isUser
                          ? 'bg-blue-600 text-white rounded-br-md ml-4'
                          : 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-bl-md mr-4 border border-gray-100 dark:border-gray-600'
                      }`}
                      title={message.timestamp.toLocaleTimeString()}
                    >
                      <p className="text-sm leading-relaxed">{message.text}</p>
                      
                      {/* Speech Bubble Tail */}
                      <div
                        className={`absolute bottom-0 w-0 h-0 ${
                          message.isUser
                            ? 'right-0 border-l-[12px] border-t-[8px] border-l-transparent border-t-blue-600'
                            : 'left-0 border-r-[12px] border-t-[8px] border-r-transparent border-t-white dark:border-t-gray-700'
                        }`}
                      />
                    </div>
                  </motion.div>
                ))}

                {/* Enhanced Typing Indicator */}
                <AnimatePresence>
                  {isTyping && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="flex justify-start mr-4"
                    >
                      <div className="bg-white dark:bg-gray-700 rounded-2xl rounded-bl-md px-4 py-3 relative shadow-md border border-gray-100 dark:border-gray-600">
                        <div className="flex items-center space-x-1">
                          <span className="text-sm text-gray-500 dark:text-gray-400 mr-2">Bizzy is typing</span>
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
                        <div className="absolute bottom-0 left-0 border-r-[12px] border-t-[8px] border-r-transparent border-t-white dark:border-t-gray-700 w-0 h-0" />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div ref={messagesEndRef} />
              </div>

              {/* Enhanced Input Area */}
              <form onSubmit={handleSendMessage} className="p-3 border-t border-gray-200 dark:border-gray-600">
                <div className="relative flex gap-2">
                  <div className="flex-1 relative">
                    <input
                      ref={inputRef}
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Ask Bizzy anything about your business setup..."
                      className={`w-full bg-gray-100 dark:bg-gray-700 border-0 rounded-full pl-4 pr-12 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-gray-100 transition-all ${
                        hasError ? 'ring-2 ring-red-500' : ''
                      }`}
                      disabled={isTyping}
                    />
                    <Button 
                      type="submit" 
                      size="sm"
                      className="absolute right-1 top-1/2 transform -translate-y-1/2 bg-blue-600 hover:bg-blue-700 rounded-full p-2 min-w-[32px] h-8"
                      disabled={!newMessage.trim() || isTyping}
                      aria-label="Send message"
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                
                {/* Error message */}
                {hasError && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-500 text-xs mt-1 text-center"
                  >
                    Message failed to send. Please try again.
                  </motion.p>
                )}
                
                {/* Keyboard shortcut hint */}
                <p className="text-xs text-gray-400 text-center mt-1">
                  Press Enter to send • Esc to close
                </p>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default RobotChatInterface;
