
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle, X, Search, Play, MessageCircle, ChevronRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  relevanceScore: number;
  hasDemo?: boolean;
  hasVideo?: boolean;
  tags: string[];
}

interface ContextualFAQProps {
  currentPage: string;
  userBehavior: {
    dwellTime: number;
    errorOccurred: boolean;
    repetitiveClicks: boolean;
    navigationLoops: boolean;
    hoveredFeatures: string[];
  };
  onContactSupport?: () => void;
  onDismiss?: (context: string) => void;
}

const mockFAQs: FAQ[] = [
  {
    id: '1',
    question: 'What\'s the difference between advice and guidance?',
    answer: 'Advice tells you what to do, while guidance shows you how to think through decisions. Bizzy provides guidance - we help you understand your options and make informed choices.',
    category: 'general',
    relevanceScore: 0.9,
    tags: ['advice', 'guidance', 'approach']
  },
  {
    id: '2',
    question: 'How do I complete my business setup?',
    answer: 'Follow our step-by-step guidance section. Each step includes templates, examples, and checkpoints to ensure you\'re on track.',
    category: 'setup',
    relevanceScore: 0.8,
    hasDemo: true,
    tags: ['setup', 'business', 'getting-started']
  },
  {
    id: '3',
    question: 'Why won\'t my document save?',
    answer: 'Check your internet connection and ensure all required fields are filled. Documents auto-save every 30 seconds when connected.',
    category: 'technical',
    relevanceScore: 0.95,
    tags: ['documents', 'saving', 'troubleshooting']
  }
];

export const ContextualFAQ: React.FC<ContextualFAQProps> = ({
  currentPage,
  userBehavior,
  onContactSupport,
  onDismiss
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFAQ, setSelectedFAQ] = useState<string | null>(null);

  // Behavioral trigger logic
  useEffect(() => {
    const shouldShow = 
      userBehavior.dwellTime > 30000 || // 30 seconds dwell time
      userBehavior.errorOccurred ||
      userBehavior.repetitiveClicks ||
      userBehavior.navigationLoops;

    if (shouldShow && !isVisible) {
      // Show the panel directly without notification dot
      setIsVisible(true);
    }
  }, [userBehavior, isVisible]);

  // Filter and rank FAQs based on context
  const getRelevantFAQs = () => {
    let faqs = mockFAQs;

    // Filter by search query
    if (searchQuery) {
      faqs = faqs.filter(faq => 
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Boost relevance based on user behavior
    faqs = faqs.map(faq => {
      let score = faq.relevanceScore;
      
      if (userBehavior.errorOccurred && faq.category === 'technical') {
        score += 0.3;
      }
      
      if (currentPage.includes('guidance') && faq.tags.includes('guidance')) {
        score += 0.2;
      }

      return { ...faq, relevanceScore: score };
    });

    return faqs.sort((a, b) => b.relevanceScore - a.relevanceScore).slice(0, 5);
  };

  const handleDismiss = () => {
    setIsVisible(false);
    onDismiss?.(currentPage);
  };

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ x: 400, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: 400, opacity: 0 }}
        className="fixed right-4 top-1/2 -translate-y-1/2 z-50 w-96"
      >
        {/* FAQ panel - no notification dot */}
        <Card className="glass-card shadow-2xl">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Need Help?</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDismiss}
                className="h-6 w-6 p-0"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search FAQs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardHeader>

          <CardContent className="space-y-3 max-h-96 overflow-y-auto">
            {getRelevantFAQs().map((faq) => (
              <motion.div
                key={faq.id}
                className="border rounded-lg p-3 cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => setSelectedFAQ(selectedFAQ === faq.id ? null : faq.id)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-sm">{faq.question}</h4>
                  <div className="flex items-center gap-2">
                    {faq.hasDemo && (
                      <Badge variant="outline" className="text-xs">
                        <Play className="w-3 h-3 mr-1" />
                        Demo
                      </Badge>
                    )}
                    <ChevronRight 
                      className={cn(
                        "w-4 h-4 transition-transform",
                        selectedFAQ === faq.id && "rotate-90"
                      )}
                    />
                  </div>
                </div>
                
                <AnimatePresence>
                  {selectedFAQ === faq.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="mt-3 text-sm text-gray-600"
                    >
                      <p>{faq.answer}</p>
                      
                      <div className="flex gap-2 mt-3">
                        {faq.hasDemo && (
                          <Button size="sm" variant="outline">
                            <Play className="w-3 h-3 mr-1" />
                            Show me how
                          </Button>
                        )}
                        <Button size="sm" variant="ghost">
                          Helpful?
                        </Button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}

            {getRelevantFAQs().length === 0 && (
              <div className="text-center py-6 text-gray-500">
                <HelpCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>No FAQs found for "{searchQuery}"</p>
              </div>
            )}

            <div className="pt-3 border-t">
              <Button
                variant="outline"
                className="w-full"
                onClick={onContactSupport}
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                Contact Support
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
};
