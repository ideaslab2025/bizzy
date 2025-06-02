
import { useState, useEffect, useCallback } from 'react';
import { DemoContent } from '@/types/demo';
import { useLiveGuidanceContent } from './useLiveGuidanceContent';
import { useLiveDocuments } from './useLiveDocuments';
import { useLiveAIContent } from './useLiveAIContent';
import { useLiveDashboard } from './useLiveDashboard';

// Hook for managing dynamic demo content with live platform integration
export const useDemoContent = () => {
  const [demoContent, setDemoContent] = useState<DemoContent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Live content hooks
  const guidance = useLiveGuidanceContent();
  const documents = useLiveDocuments();
  const aiContent = useLiveAIContent();
  const dashboard = useLiveDashboard();

  const buildDemoContent = useCallback(() => {
    const content: DemoContent[] = [
      {
        id: 'guidance-demo',
        title: 'Step-by-Step Business Setup',
        description: 'Interactive walkthrough of business registration and compliance',
        type: 'guidance',
        content: guidance.demoData || {
          currentStep: 'Register for VAT',
          progress: 65,
          totalSteps: 12,
          nextDeadline: '2025-01-15'
        },
        isLive: !guidance.loading && !!guidance.demoData
      },
      {
        id: 'documents-demo',
        title: 'Professional Document Templates',
        description: 'Access hundreds of business documents and contracts',
        type: 'documents',
        content: documents.demoData || {
          featuredTemplates: [
            'Employment Contract',
            'Privacy Policy',
            'Terms of Service',
            'Invoice Template'
          ],
          totalDocuments: 250,
          recentlyViewed: 3
        },
        isLive: !documents.loading && !!documents.demoData
      },
      {
        id: 'ai-chat-demo',
        title: 'Bizzy AI Assistant',
        description: 'Get instant help with business questions and guidance',
        type: 'ai-chat',
        content: aiContent.demoData,
        isLive: true
      },
      {
        id: 'dashboard-demo',
        title: 'Business Progress Dashboard',
        description: 'Track your business setup progress and upcoming deadlines',
        type: 'dashboard',
        content: dashboard.demoData || {
          completionRate: 78,
          tasksCompleted: 15,
          upcomingDeadlines: 3,
          timeSaved: '24 hours'
        },
        isLive: !dashboard.loading && !!dashboard.demoData
      }
    ];

    setDemoContent(content);
    setIsLoading(false);
  }, [guidance.demoData, documents.demoData, aiContent.demoData, dashboard.demoData, guidance.loading, documents.loading, dashboard.loading]);

  const refreshContent = useCallback(() => {
    setIsLoading(true);
    guidance.refreshContent();
    documents.refreshContent();
    dashboard.refreshData();
  }, [guidance.refreshContent, documents.refreshContent, dashboard.refreshData]);

  const updateContentProgress = useCallback((contentId: string, progress: number) => {
    setDemoContent(prev => 
      prev.map(content => 
        content.id === contentId 
          ? { ...content, content: { ...content.content, progress } }
          : content
      )
    );
  }, []);

  // Update demo content when live data changes
  useEffect(() => {
    buildDemoContent();
  }, [buildDemoContent]);

  // Set loading state based on all content loading states
  useEffect(() => {
    const allLoading = guidance.loading || documents.loading || dashboard.loading;
    if (!allLoading && isLoading) {
      setIsLoading(false);
    }
  }, [guidance.loading, documents.loading, dashboard.loading, isLoading]);

  return {
    demoContent,
    isLoading,
    error: error || guidance.error || documents.error,
    refreshContent,
    updateContentProgress,
    liveData: {
      guidance: guidance.demoData,
      documents: documents.demoData,
      aiContent: aiContent.demoData,
      dashboard: dashboard.demoData
    }
  };
};
