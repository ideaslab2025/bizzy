import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { 
  Send, FileText, Clock, Zap, AlertCircle, 
  CheckCircle, Calendar, TrendingUp, MessageCircle, Bot 
} from 'lucide-react';
import type { EnhancedGuidanceStep, EnhancedGuidanceSection } from '@/types/guidance';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  quickActions?: QuickAction[];
}

interface QuickAction {
  id: string;
  label: string;
  icon: React.ReactNode;
  action: () => void;
  variant?: 'default' | 'destructive' | 'outline';
}

interface EnhancedBizzyAssistantProps {
  isOpen: boolean;
  onClose: () => void;
  currentStep?: EnhancedGuidanceStep;
  currentSection?: EnhancedGuidanceSection;
  userProgress: {
    completedSteps: number[];
    sectionCompletion: Record<number, number>;
    recentSteps: EnhancedGuidanceStep[];
  };
  onNavigateToStep: (sectionId: number, stepNumber: number) => void;
}

export const EnhancedBizzyAssistant: React.FC<EnhancedBizzyAssistantProps> = ({
  isOpen,
  onClose,
  currentStep,
  currentSection,
  userProgress,
  onNavigateToStep
}) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [quickWins, setQuickWins] = useState<EnhancedGuidanceStep[]>([]);
  const [upcomingDeadlines, setUpcomingDeadlines] = useState<EnhancedGuidanceStep[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      initializeChat();
      fetchContextData();
    }
  }, [isOpen, currentStep]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const initializeChat = async () => {
    const greeting = getContextualGreeting();
    const quickActions = await generateQuickActions();
    
    addMessage('assistant', greeting, quickActions);
  };

  const fetchContextData = async () => {
    if (!user) return;

    try {
      // Fetch quick wins with proper type casting
      const { data: quickWinData } = await supabase
        .from('guidance_steps')
        .select('*, guidance_sections(*)')
        .eq('quick_win', true)
        .not('id', 'in', `(${userProgress.completedSteps.join(',') || '0'})`)
        .limit(3);

      if (quickWinData) {
        // Transform the data to match our interface
        const transformedQuickWins: EnhancedGuidanceStep[] = quickWinData.map(step => ({
          id: step.id,
          section_id: step.section_id,
          title: step.title,
          content: step.content || '',
          video_url: step.video_url,
          external_links: step.external_links,
          order_number: step.order_number,
          estimated_time_minutes: step.estimated_time_minutes,
          difficulty_level: step.difficulty_level as 'easy' | 'medium' | 'complex' | null,
          step_type: step.step_type as 'action' | 'information' | 'decision' | 'external' | null,
          rich_content: step.rich_content,
          prerequisites: step.prerequisites,
          deadline_info: step.deadline_info,
          quick_win: step.quick_win,
          created_at: step.created_at
        }));
        setQuickWins(transformedQuickWins);
      }

      // Fetch upcoming deadlines with proper type casting
      const { data: deadlineData } = await supabase
        .from('guidance_steps')
        .select('*, guidance_sections(*)')
        .not('deadline_info', 'is', null)
        .not('id', 'in', `(${userProgress.completedSteps.join(',') || '0'})`)
        .limit(5);

      if (deadlineData) {
        // Transform the data to match our interface
        const transformedDeadlines: EnhancedGuidanceStep[] = deadlineData.map(step => ({
          id: step.id,
          section_id: step.section_id,
          title: step.title,
          content: step.content || '',
          video_url: step.video_url,
          external_links: step.external_links,
          order_number: step.order_number,
          estimated_time_minutes: step.estimated_time_minutes,
          difficulty_level: step.difficulty_level as 'easy' | 'medium' | 'complex' | null,
          step_type: step.step_type as 'action' | 'information' | 'decision' | 'external' | null,
          rich_content: step.rich_content,
          prerequisites: step.prerequisites,
          deadline_info: step.deadline_info,
          quick_win: step.quick_win,
          created_at: step.created_at
        }));
        setUpcomingDeadlines(transformedDeadlines);
      }
    } catch (error) {
      console.error('Error fetching context data:', error);
    }
  };

  const getContextualGreeting = () => {
    const hour = new Date().getHours();
    const timeGreeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
    
    if (!currentStep || !currentSection) {
      return `${timeGreeting}! I'm Bizzy, your business setup assistant. How can I help you today?`;
    }

    const completionRate = userProgress.sectionCompletion[currentSection.id] || 0;
    
    if (completionRate === 0) {
      return `${timeGreeting}! Ready to start "${currentSection.title}"? This section typically takes about ${currentSection.estimated_time_minutes} minutes. What questions do you have?`;
    } else if (completionRate < 50) {
      return `${timeGreeting}! You're making good progress on "${currentSection.title}" (${Math.round(completionRate)}% complete). Need help with "${currentStep.title}"?`;
    } else if (completionRate < 100) {
      return `${timeGreeting}! You're almost done with "${currentSection.title}" (${Math.round(completionRate)}% complete)! How can I help you finish strong?`;
    } else {
      return `${timeGreeting}! Congratulations on completing "${currentSection.title}"! Ready to tackle the next section?`;
    }
  };

  const generateQuickActions = async (): Promise<QuickAction[]> => {
    const actions: QuickAction[] = [];

    // Context-specific actions
    if (currentStep) {
      actions.push({
        id: 'step-documents',
        label: 'Show required documents',
        icon: <FileText className="w-4 h-4" />,
        action: () => handleQuickAction('documents')
      });

      if (currentStep.estimated_time_minutes) {
        actions.push({
          id: 'time-estimate',
          label: `Time needed: ${currentStep.estimated_time_minutes} min`,
          icon: <Clock className="w-4 h-4" />,
          action: () => handleQuickAction('time-estimate')
        });
      }
    }

    // Quick wins
    if (quickWins.length > 0) {
      actions.push({
        id: 'quick-wins',
        label: `${quickWins.length} quick wins available`,
        icon: <Zap className="w-4 h-4" />,
        action: () => handleQuickAction('quick-wins')
      });
    }

    // Deadlines
    if (upcomingDeadlines.length > 0) {
      actions.push({
        id: 'deadlines',
        label: 'Show upcoming deadlines',
        icon: <AlertCircle className="w-4 h-4" />,
        action: () => handleQuickAction('deadlines')
      });
    }

    // Progress overview
    const totalCompletion = Object.values(userProgress.sectionCompletion).reduce((a, b) => a + b, 0) / Object.keys(userProgress.sectionCompletion).length;
    actions.push({
      id: 'progress',
      label: `Overall progress: ${Math.round(totalCompletion)}%`,
      icon: <TrendingUp className="w-4 h-4" />,
      action: () => handleQuickAction('progress')
    });

    return actions.slice(0, 4); // Limit to 4 actions
  };

  const handleQuickAction = async (actionType: string) => {
    setIsTyping(true);

    let response = '';
    let newQuickActions: QuickAction[] = [];

    switch (actionType) {
      case 'documents':
        if (currentStep) {
          const { data: documents } = await supabase
            .from('guidance_step_documents')
            .select('*, documents(*)')
            .eq('guidance_step_id', currentStep.id);

          if (documents && documents.length > 0) {
            response = `For "${currentStep.title}", you'll need these documents:\n\n${documents.map((doc: any) => 
              `• ${doc.documents.title} - ${doc.context}`
            ).join('\n')}`;
          } else {
            response = `No specific documents are required for "${currentStep.title}". You can proceed with the step as described.`;
          }
        }
        break;

      case 'quick-wins':
        response = `Here are some quick wins you can complete right now:\n\n${quickWins.map((step, index) => 
          `${index + 1}. ${step.title} (${step.estimated_time_minutes} min)`
        ).join('\n')}`;
        
        newQuickActions = quickWins.map((step, index) => ({
          id: `qw-${step.id}`,
          label: `Start: ${step.title}`,
          icon: <Zap className="w-4 h-4" />,
          action: () => onNavigateToStep(step.section_id || 0, step.order_number)
        }));
        break;

      case 'deadlines':
        response = `Here are your upcoming deadlines:\n\n${upcomingDeadlines.map((step) => 
          `• ${step.title}: ${step.deadline_info}`
        ).join('\n')}`;
        break;

      case 'progress':
        const sections = Object.keys(userProgress.sectionCompletion);
        response = `Your progress summary:\n\n${sections.map((sectionId: any) => {
          const completion = userProgress.sectionCompletion[sectionId];
          return `• Section ${sectionId}: ${Math.round(completion)}% complete`;
        }).join('\n')}\n\nTotal completed steps: ${userProgress.completedSteps.length}`;
        break;

      case 'time-estimate':
        if (currentStep) {
          response = `"${currentStep.title}" typically takes about ${currentStep.estimated_time_minutes} minutes to complete. ${
            currentStep.difficulty_level === 'easy' ? 'This is a straightforward task.' :
            currentStep.difficulty_level === 'medium' ? 'This requires some preparation.' :
            'This is a complex task that may need professional help.'
          }`;
        }
        break;

      default:
        response = "I'm not sure how to help with that. Try asking me a specific question!";
    }

    setTimeout(() => {
      addMessage('assistant', response, newQuickActions);
      setIsTyping(false);
    }, 1000);
  };

  const addMessage = (role: 'user' | 'assistant', content: string, quickActions?: QuickAction[]) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      role,
      content,
      timestamp: new Date(),
      quickActions
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = inputMessage.trim();
    setInputMessage('');
    addMessage('user', userMessage);

    setIsTyping(true);
    
    // Simulate AI response with context
    setTimeout(() => {
      const response = generateContextualResponse(userMessage);
      addMessage('assistant', response);
      setIsTyping(false);
    }, 1500);
  };

  const generateContextualResponse = (message: string): string => {
    const lowerMessage = message.toLowerCase();

    // Context-aware responses
    if (lowerMessage.includes('document') || lowerMessage.includes('paperwork')) {
      if (currentStep) {
        return `For "${currentStep.title}", you'll typically need your incorporation documents and any specific forms mentioned in the step. Would you like me to show you the exact documents required?`;
      }
      return "Documents vary by step, but you'll always need your Certificate of Incorporation as a foundation. What specific step are you asking about?";
    }

    if (lowerMessage.includes('time') || lowerMessage.includes('long')) {
      if (currentStep) {
        return `"${currentStep.title}" typically takes about ${currentStep.estimated_time_minutes || 30} minutes. ${
          currentStep.difficulty_level === 'easy' ? "It's pretty straightforward!" :
          currentStep.difficulty_level === 'medium' ? "You might need to gather some information first." :
          "This one's complex - consider getting professional help if needed."
        }`;
      }
      return "Time varies by task complexity. Quick wins take 15-30 minutes, while complex tasks like PAYE setup can take 90+ minutes.";
    }

    if (lowerMessage.includes('next') || lowerMessage.includes('what should')) {
      const completion = currentSection ? userProgress.sectionCompletion[currentSection.id] : 0;
      if (completion < 100) {
        return `Continue with your current section "${currentSection?.title}". You're ${Math.round(completion)}% complete! After this, I'd recommend checking your quick wins.`;
      }
      return "Great progress! I'd suggest looking at your quick wins or moving to the next priority section. Would you like me to show your options?";
    }

    if (lowerMessage.includes('help') || lowerMessage.includes('stuck')) {
      return `I'm here to help! For "${currentStep?.title || 'your current task'}", try breaking it into smaller steps. Need specific guidance on any part? I can also show you required documents or connect you with relevant resources.`;
    }

    if (lowerMessage.includes('deadline') || lowerMessage.includes('urgent')) {
      return `The most time-sensitive tasks are usually Corporation Tax registration (3-month deadline) and PAYE setup (before first employee starts). Want me to show your current deadlines?`;
    }

    // Default helpful response
    return `That's a great question! Based on where you are in "${currentSection?.title || 'your business setup'}", I'd suggest focusing on completing your current step first. Need specific help with anything? I can show documents, time estimates, or your next recommended actions.`;
  };

  if (!isOpen) return null;

  return (
    <div className="w-full h-[70vh] bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
      {/* Header */}
      <CardHeader className="bg-[#0088cc] text-white rounded-t-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
            <Bot className="w-6 h-6 text-[#0088cc]" strokeWidth={1.5} />
          </div>
          <div>
            <h3 className="font-semibold">Bizzy Assistant</h3>
            <p className="text-xs text-white/80">
              {currentSection ? `Help with ${currentSection.title}` : 'Business Setup Guide'}
            </p>
          </div>
        </div>
      </CardHeader>

      {/* Messages */}
      <CardContent className="p-0 h-full flex flex-col">
        <ScrollArea className="flex-1 p-4 h-[calc(70vh-200px)]">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.role === 'user'
                      ? 'bg-[#0088cc] text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100'
                  }`}
                >
                  <p className="text-sm whitespace-pre-line">{message.content}</p>
                  
                  {/* Quick Actions */}
                  {message.quickActions && message.quickActions.length > 0 && (
                    <div className="mt-3 space-y-2">
                      {message.quickActions.map((action) => (
                        <Button
                          key={action.id}
                          variant={action.variant || "outline"}
                          size="sm"
                          onClick={action.action}
                          className="w-full justify-start text-xs"
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
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
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
              placeholder="Ask me anything..."
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              className="flex-1"
            />
            <Button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isTyping}
              size="sm"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </div>
  );
};
