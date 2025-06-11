
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { 
  Send, Bot, FileText, Calculator, Users, 
  Shield, Building, Lock, Clock, HelpCircle 
} from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  quickActions?: QuickAction[];
  category?: string;
}

interface QuickAction {
  id: string;
  label: string;
  icon: React.ReactNode;
  action: () => void;
}

interface UKBusinessChatbotProps {
  userProgress?: {
    completedSteps: number[];
    sectionCompletion: Record<number, number>;
  };
  className?: string;
}

const businessCategories = {
  'company-setup': {
    name: 'Company Set-Up',
    icon: <Building className="w-4 h-4" />,
    color: 'bg-blue-100 text-blue-800'
  },
  'tax-vat': {
    name: 'Tax and VAT',
    icon: <Calculator className="w-4 h-4" />,
    color: 'bg-green-100 text-green-800'
  },
  'employment': {
    name: 'Employment',
    icon: <Users className="w-4 h-4" />,
    color: 'bg-purple-100 text-purple-800'
  },
  'legal-compliance': {
    name: 'Legal Compliance',
    icon: <Shield className="w-4 h-4" />,
    color: 'bg-red-100 text-red-800'
  },
  'finance': {
    name: 'Finance',
    icon: <FileText className="w-4 h-4" />,
    color: 'bg-yellow-100 text-yellow-800'
  },
  'data-protection': {
    name: 'Data Protection',
    icon: <Lock className="w-4 h-4" />,
    color: 'bg-indigo-100 text-indigo-800'
  }
};

const predefinedResponses = {
  'vat registration': {
    content: `To register for VAT in the UK:

1. **When to register**: You must register if your taxable turnover exceeds £85,000 in any 12-month period
2. **How to register**: Use HMRC's online VAT registration service
3. **Documents needed**: 
   - Business details
   - Bank account information
   - Expected turnover figures
4. **Timeline**: Register within 30 days of becoming liable

Would you like help with VAT record keeping or understanding VAT rates?`,
    category: 'tax-vat',
    quickActions: [
      { id: 'vat-rates', label: 'VAT Rates Guide', icon: <Calculator className="w-4 h-4" /> },
      { id: 'vat-records', label: 'Record Keeping', icon: <FileText className="w-4 h-4" /> }
    ]
  },
  'company registration': {
    content: `To register a UK company:

1. **Choose company name**: Check availability on Companies House
2. **Company type**: Usually private limited company (Ltd)
3. **Required information**:
   - Company name and address
   - Director details
   - Share structure
   - SIC codes (business activities)
4. **Cost**: £12 online, £40 by post
5. **Timeline**: Usually processed within 24 hours online

Your company will receive a Certificate of Incorporation once approved.`,
    category: 'company-setup',
    quickActions: [
      { id: 'name-check', label: 'Check Company Name', icon: <Building className="w-4 h-4" /> },
      { id: 'sic-codes', label: 'Find SIC Codes', icon: <FileText className="w-4 h-4" /> }
    ]
  },
  'corporation tax': {
    content: `Corporation Tax registration:

1. **When to register**: Within 3 months of starting business activities
2. **Tax rate**: 25% on profits over £250,000, 19% on profits up to £50,000
3. **Annual return**: CT600 form due 12 months after accounting period
4. **Payment**: Due 9 months and 1 day after accounting period ends

You'll need to file even if you make no profit.`,
    category: 'tax-vat',
    quickActions: [
      { id: 'ct-deadline', label: 'Calculate Deadline', icon: <Clock className="w-4 h-4" /> },
      { id: 'ct-allowances', label: 'Tax Allowances', icon: <Calculator className="w-4 h-4" /> }
    ]
  },
  'paye': {
    content: `PAYE (Pay As You Earn) for employers:

1. **When needed**: When you have employees or pay yourself over £12,570
2. **Registration**: Register before first payday
3. **What you handle**:
   - Income tax deductions
   - National Insurance contributions
   - Payroll submissions (RTI)
4. **Deadlines**: Submit by 19th of following month

You'll need payroll software or an accountant to manage this.`,
    category: 'employment',
    quickActions: [
      { id: 'payroll-software', label: 'Payroll Solutions', icon: <Users className="w-4 h-4" /> },
      { id: 'ni-rates', label: 'NI Rates', icon: <Calculator className="w-4 h-4" /> }
    ]
  },
  'data protection': {
    content: `GDPR and Data Protection:

1. **ICO registration**: Required if processing personal data (£40-£2,900 annually)
2. **Privacy policy**: Must have one if collecting personal data
3. **Key requirements**:
   - Lawful basis for processing
   - Data subject rights
   - Breach reporting (72 hours)
   - Data Protection Officer (if applicable)

Most small businesses need basic ICO registration.`,
    category: 'data-protection',
    quickActions: [
      { id: 'ico-check', label: 'ICO Registration Check', icon: <Shield className="w-4 h-4" /> },
      { id: 'privacy-template', label: 'Privacy Policy Template', icon: <FileText className="w-4 h-4" /> }
    ]
  }
};

export const UKBusinessChatbot: React.FC<UKBusinessChatbotProps> = ({ 
  userProgress, 
  className = "" 
}) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    initializeChat();
    if (user) {
      loadChatHistory();
    }
  }, [user]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const initializeChat = () => {
    const welcomeMessage: Message = {
      id: 'welcome',
      role: 'assistant',
      content: `Hello! I'm Bizzy, your UK business setup assistant. I can help you with:

• Company registration and setup
• VAT and Corporation Tax
• Employment and PAYE
• Legal compliance requirements
• Financial planning
• Data protection (GDPR)

What would you like to know about setting up your UK business?`,
      timestamp: new Date(),
      quickActions: generateWelcomeActions()
    };
    
    setMessages([welcomeMessage]);
  };

  const loadChatHistory = async () => {
    if (!user) return;

    // TODO: Load chat history from Supabase
    // For now, we'll start with the welcome message
  };

  const saveChatMessage = async (message: Message) => {
    if (!user) return;

    try {
      // TODO: Save to Supabase chat_history table
      console.log('Saving message:', message);
    } catch (error) {
      console.error('Error saving message:', error);
    }
  };

  const generateWelcomeActions = (): QuickAction[] => [
    {
      id: 'company-reg',
      label: 'Register Company',
      icon: <Building className="w-4 h-4" />,
      action: () => handleQuickAction('company registration')
    },
    {
      id: 'vat-info',
      label: 'VAT Registration', 
      icon: <Calculator className="w-4 h-4" />,
      action: () => handleQuickAction('vat registration')
    },
    {
      id: 'tax-setup',
      label: 'Corporation Tax',
      icon: <FileText className="w-4 h-4" />,
      action: () => handleQuickAction('corporation tax')
    },
    {
      id: 'employment',
      label: 'PAYE Setup',
      icon: <Users className="w-4 h-4" />,
      action: () => handleQuickAction('paye')
    }
  ];

  const handleQuickAction = (topic: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: `Tell me about ${topic}`,
      timestamp: new Date()
    };

    addMessage(userMessage);
    setTimeout(() => {
      generateResponse(topic);
    }, 500);
  };

  const addMessage = (message: Message) => {
    setMessages(prev => [...prev, message]);
    if (user) {
      saveChatMessage(message);
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputMessage.trim(),
      timestamp: new Date()
    };

    addMessage(userMessage);
    setInputMessage('');
    setIsTyping(true);

    setTimeout(() => {
      generateResponse(inputMessage.trim());
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
  };

  const generateResponse = (userInput: string) => {
    const input = userInput.toLowerCase();
    let response: Message;

    // Find matching predefined response
    const matchedTopic = Object.keys(predefinedResponses).find(topic => 
      input.includes(topic) || input.includes(topic.replace(/\s+/g, ''))
    );

    if (matchedTopic && predefinedResponses[matchedTopic]) {
      const responseData = predefinedResponses[matchedTopic];
      response = {
        id: Date.now().toString(),
        role: 'assistant',
        content: responseData.content,
        timestamp: new Date(),
        category: responseData.category,
        quickActions: responseData.quickActions?.map(qa => ({
          ...qa,
          action: () => handleQuickAction(qa.id)
        }))
      };
    } else {
      // Generic helpful response
      response = {
        id: Date.now().toString(),
        role: 'assistant',
        content: `That's a great question about UK business setup! While I don't have a specific answer for that right now, I can help you with:

• Company registration process
• VAT and tax registration
• Employment requirements
• Legal compliance
• Financial planning
• Data protection

Could you try rephrasing your question or select one of these topics?`,
        timestamp: new Date(),
        quickActions: generateWelcomeActions()
      };
    }

    addMessage(response);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className={`w-full h-[80vh] bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 ${className}`}>
      {/* Header with Blue Branding */}
      <CardHeader className="bg-[#2563eb] text-white rounded-t-xl">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
            <Bot className="w-8 h-8 text-[#2563eb]" strokeWidth={1.5} />
          </div>
          <div>
            <h3 className="text-lg font-semibold">Bizzy - UK Business Assistant</h3>
            <p className="text-sm text-white/80">
              Get help with your UK business setup
            </p>
          </div>
        </div>
      </CardHeader>

      {/* Messages */}
      <CardContent className="p-0 h-full flex flex-col">
        <ScrollArea className="flex-1 p-4 h-[calc(80vh-180px)]">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-lg p-3 ${
                    message.role === 'user'
                      ? 'bg-[#2563eb] text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100'
                  }`}
                >
                  <p className="text-sm whitespace-pre-line">{message.content}</p>
                  
                  {/* Category Badge */}
                  {message.category && businessCategories[message.category] && (
                    <div className="mt-2">
                      <Badge className={`${businessCategories[message.category].color} text-xs`}>
                        {businessCategories[message.category].icon}
                        <span className="ml-1">{businessCategories[message.category].name}</span>
                      </Badge>
                    </div>
                  )}
                  
                  {/* Quick Actions */}
                  {message.quickActions && message.quickActions.length > 0 && (
                    <div className="mt-3 space-y-2">
                      {message.quickActions.map((action) => (
                        <Button
                          key={action.id}
                          variant="outline"
                          size="sm"
                          onClick={action.action}
                          className="w-full justify-start text-xs bg-white dark:bg-gray-600 hover:bg-gray-50 dark:hover:bg-gray-500"
                        >
                          {action.icon}
                          <span className="ml-2">{action.label}</span>
                        </Button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            {/* Typing indicator */}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-3">
                  <div className="flex items-center space-x-1">
                    <span className="text-sm text-gray-500 dark:text-gray-400">Bizzy is typing</span>
                    <div className="flex space-x-1 ml-2">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div ref={messagesEndRef} />
        </ScrollArea>

        {/* Input */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-600">
          <div className="flex gap-2">
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Ask about UK business setup..."
              onKeyPress={handleKeyPress}
              className="flex-1"
              disabled={isTyping}
            />
            <Button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isTyping}
              size="sm"
              className="bg-[#2563eb] hover:bg-[#1d4ed8]"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
          <p className="text-xs text-gray-500 text-center mt-2">
            Ask about company registration, VAT, tax, employment, or compliance
          </p>
        </div>
      </CardContent>
    </div>
  );
};
