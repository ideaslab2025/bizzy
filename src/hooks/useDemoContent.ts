
import { useState, useEffect, useCallback } from 'react';
import { DemoContent } from '@/types/demo';

// Hook for managing dynamic demo content
export const useDemoContent = () => {
  const [demoContent, setDemoContent] = useState<DemoContent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Mock data - in production this would fetch from Supabase
  const mockDemoContent: DemoContent[] = [
    {
      id: 'guidance-demo',
      title: 'Step-by-Step Business Setup',
      description: 'Interactive walkthrough of business registration and compliance',
      type: 'guidance',
      content: {
        currentStep: 'Register for VAT',
        progress: 65,
        totalSteps: 12,
        nextDeadline: '2025-01-15'
      },
      isLive: true
    },
    {
      id: 'documents-demo',
      title: 'Professional Document Templates',
      description: 'Access hundreds of business documents and contracts',
      type: 'documents',
      content: {
        featuredTemplates: [
          'Employment Contract',
          'Privacy Policy',
          'Terms of Service',
          'Invoice Template'
        ],
        totalDocuments: 250,
        recentlyViewed: 3
      },
      isLive: true
    },
    {
      id: 'ai-chat-demo',
      title: 'Bizzy AI Assistant',
      description: 'Get instant help with business questions and guidance',
      type: 'ai-chat',
      content: {
        sampleQuestions: [
          'How do I register for PAYE?',
          'What insurance do I need?',
          'When is my Corporation Tax due?'
        ],
        responseTime: '< 2 seconds',
        accuracy: '95%'
      },
      isLive: false
    },
    {
      id: 'dashboard-demo',
      title: 'Business Progress Dashboard',
      description: 'Track your business setup progress and upcoming deadlines',
      type: 'dashboard',
      content: {
        completionRate: 78,
        tasksCompleted: 15,
        upcomingDeadlines: 3,
        timeSaved: '24 hours'
      },
      isLive: true
    }
  ];

  const fetchDemoContent = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In production, this would be:
      // const { data, error } = await supabase
      //   .from('guidance_steps')
      //   .select('*')
      //   .limit(5);
      
      setDemoContent(mockDemoContent);
    } catch (err) {
      setError('Failed to load demo content');
      console.error('Demo content fetch error:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const refreshContent = useCallback(() => {
    fetchDemoContent();
  }, [fetchDemoContent]);

  const updateContentProgress = useCallback((contentId: string, progress: number) => {
    setDemoContent(prev => 
      prev.map(content => 
        content.id === contentId 
          ? { ...content, content: { ...content.content, progress } }
          : content
      )
    );
  }, []);

  useEffect(() => {
    fetchDemoContent();
  }, [fetchDemoContent]);

  return {
    demoContent,
    isLoading,
    error,
    refreshContent,
    updateContentProgress
  };
};
