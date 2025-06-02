
import React, { useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DemoContent, DemoTab, DemoState } from '@/types/demo';
import { FileText, MessageCircle, BarChart3, BookOpen, ChevronLeft, ChevronRight } from 'lucide-react';

interface DemoContainerProps {
  demoData: DemoContent[];
  className?: string;
}

// Simplified animation variants - static design
const containerVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4
    }
  }
};

const contentVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 200 : -200,
    opacity: 0
  }),
  center: {
    x: 0,
    opacity: 1,
    transition: {
      duration: 0.3,
      ease: "easeOut"
    }
  },
  exit: (direction: number) => ({
    x: direction < 0 ? 200 : -200,
    opacity: 0,
    transition: {
      duration: 0.3
    }
  })
};

// Static screenshots from actual Bizzy platform
const demoScreenshots = {
  guidance: "/lovable-uploads/35ad1d99-4078-450d-ac41-27dce4da642c.png", // Using existing guidance image
  documents: "/lovable-uploads/90f74494-efee-4fb1-9e17-f1398ff68008.png", // Using existing documents image
  'ai-chat': "/lovable-uploads/a4589c72-9113-4641-a8bd-1d23e740ac0d.png", // Using existing AI image
  dashboard: "/lovable-uploads/13ddab9c-cf4d-4451-99b7-a0e7c8d24062.png" // Using existing dashboard image
};

const DemoContainer: React.FC<DemoContainerProps> = ({ demoData, className = "" }) => {
  const [demoState, setDemoState] = useState<DemoState>({
    activeTab: demoData[0]?.id || '',
    direction: 0,
    isTransitioning: false,
    userProgress: {}
  });

  // Demo tabs configuration with static content
  const demoTabs: DemoTab[] = useMemo(() => [
    {
      id: 'guidance',
      label: 'Step-by-Step Guidance',
      icon: <BookOpen className="w-5 h-5" />,
      content: {
        id: 'guidance',
        title: 'Step-by-Step Business Setup',
        description: 'Comprehensive guidance for UK business compliance and setup',
        type: 'guidance',
        content: {
          screenshot: demoScreenshots.guidance,
          features: ['VAT Registration', 'Tax Setup', 'Compliance Tracking', 'Deadline Management']
        },
        isLive: true
      }
    },
    {
      id: 'documents',
      label: 'Document Templates',
      icon: <FileText className="w-5 h-5" />,
      content: {
        id: 'documents',
        title: 'Professional Document Library',
        description: 'Access hundreds of business documents and legal templates',
        type: 'documents',
        content: {
          screenshot: demoScreenshots.documents,
          features: ['Employment Contracts', 'Privacy Policies', 'Terms of Service', 'Invoice Templates']
        },
        isLive: true
      }
    },
    {
      id: 'ai-chat',
      label: 'AI Assistant',
      icon: <MessageCircle className="w-5 h-5" />,
      content: {
        id: 'ai-chat',
        title: 'Bizzy AI Assistant',
        description: 'Get instant help with business questions and guidance',
        type: 'ai-chat',
        content: {
          screenshot: demoScreenshots['ai-chat'],
          features: ['Instant Answers', 'Business Guidance', '24/7 Availability', 'UK Law Expertise']
        },
        isLive: true
      }
    },
    {
      id: 'dashboard',
      label: 'Progress Dashboard',
      icon: <BarChart3 className="w-5 h-5" />,
      content: {
        id: 'dashboard',
        title: 'Business Progress Overview',
        description: 'Track your business setup progress and upcoming deadlines',
        type: 'dashboard',
        content: {
          screenshot: demoScreenshots.dashboard,
          features: ['Progress Tracking', 'Deadline Alerts', 'Task Management', 'Completion Analytics']
        },
        isLive: true
      }
    }
  ], []);

  const handleTabChange = useCallback((newTabId: string) => {
    const currentIndex = demoTabs.findIndex(tab => tab.id === demoState.activeTab);
    const newIndex = demoTabs.findIndex(tab => tab.id === newTabId);
    const direction = newIndex > currentIndex ? 1 : -1;

    setDemoState(prev => ({
      ...prev,
      activeTab: newTabId,
      direction,
      isTransitioning: true
    }));

    setTimeout(() => {
      setDemoState(prev => ({ ...prev, isTransitioning: false }));
    }, 300);
  }, [demoTabs, demoState.activeTab]);

  const activeTab = demoTabs.find(tab => tab.id === demoState.activeTab);
  const activeIndex = demoTabs.findIndex(tab => tab.id === demoState.activeTab);

  return (
    <motion.div
      className={`demo-container ${className}`}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Demo Header */}
      <div className="text-center mb-8">
        <motion.h2 
          className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          Experience Bizzy Live
        </motion.h2>
        <motion.p 
          className="text-lg text-gray-600 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          Explore our platform with real content and interactive features
        </motion.p>
      </div>

      {/* Tab Navigation - Always visible, no hover effects */}
      <motion.div 
        className="flex flex-wrap justify-center gap-2 md:gap-4 mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        {demoTabs.map((tab) => (
          <Button
            key={tab.id}
            variant={demoState.activeTab === tab.id ? "default" : "outline"}
            onClick={() => handleTabChange(tab.id)}
            className={`flex items-center gap-2 transition-colors duration-200 font-medium ${
              demoState.activeTab === tab.id 
                ? 'bg-blue-600 text-white shadow-md border-blue-600' 
                : 'bg-white text-gray-700 border-gray-300 hover:bg-blue-50 hover:border-blue-400 hover:text-blue-600'
            }`}
            disabled={demoState.isTransitioning}
          >
            {tab.icon}
            <span className="hidden sm:inline">{tab.label}</span>
          </Button>
        ))}
      </motion.div>

      {/* Navigation Arrows */}
      <div className="flex justify-between items-center mb-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            const prevIndex = activeIndex > 0 ? activeIndex - 1 : demoTabs.length - 1;
            handleTabChange(demoTabs[prevIndex].id);
          }}
          className="text-gray-600 hover:text-gray-900 hover:bg-gray-100"
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          Previous
        </Button>

        <div className="flex gap-2">
          {demoTabs.map((_, index) => (
            <motion.div
              key={index}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === activeIndex ? 'bg-blue-600' : 'bg-gray-300'
              }`}
              animate={{ scale: index === activeIndex ? 1.2 : 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            />
          ))}
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            const nextIndex = activeIndex < demoTabs.length - 1 ? activeIndex + 1 : 0;
            handleTabChange(demoTabs[nextIndex].id);
          }}
          className="text-gray-600 hover:text-gray-900 hover:bg-gray-100"
        >
          Next
          <ChevronRight className="w-4 h-4 ml-1" />
        </Button>
      </div>

      {/* Demo Content Area - Static Screenshots */}
      <div className="relative h-[600px] md:h-[700px] overflow-hidden">
        <AnimatePresence mode="wait" custom={demoState.direction}>
          {activeTab && (
            <motion.div
              key={demoState.activeTab}
              custom={demoState.direction}
              variants={contentVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="absolute inset-0"
            >
              <Card className="h-full p-6 md:p-8 bg-white border-2 border-gray-200 shadow-lg">
                {/* Content Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-blue-100 rounded-lg text-blue-600">
                      {activeTab.icon}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">{activeTab.content.title}</h3>
                      <p className="text-gray-600">{activeTab.content.description}</p>
                    </div>
                  </div>
                  <Badge className="bg-green-100 text-green-800 border-green-300">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2" />
                    Live Platform
                  </Badge>
                </div>

                {/* Static Screenshot Content */}
                <div className="h-full pb-16">
                  <div className="bg-gray-50 rounded-lg h-full p-4 flex flex-col">
                    {/* Screenshot Display */}
                    <div className="flex-1 bg-white rounded border p-4 mb-4 flex items-center justify-center">
                      <img
                        src={activeTab.content.content.screenshot}
                        alt={`${activeTab.content.title} Interface`}
                        className="max-w-full max-h-full object-contain rounded shadow-sm"
                      />
                    </div>
                    
                    {/* Feature List */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      {activeTab.content.content.features.map((feature, index) => (
                        <div key={index} className="bg-blue-50 text-blue-700 px-3 py-2 rounded text-sm font-medium text-center">
                          {feature}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Demo Call-to-Action - Removed Reset Demo button */}
      <motion.div
        className="mt-6 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        <p className="text-sm text-gray-500 mb-4">
          Use navigation to explore different platform features
        </p>
        <div className="flex justify-center gap-4">
          <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
            Try Full Platform
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default DemoContainer;
