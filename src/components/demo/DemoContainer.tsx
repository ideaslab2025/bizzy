
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

// Simplified animation variants for static demo
const containerVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      staggerChildren: 0.1
    }
  }
};

const contentVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 300 : -300,
    opacity: 0
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 30
    }
  },
  exit: (direction: number) => ({
    zIndex: 0,
    x: direction < 0 ? 300 : -300,
    opacity: 0,
    transition: {
      duration: 0.3
    }
  })
};

// Static demo screenshots mapping
const demoScreenshots = {
  guidance: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=500&fit=crop",
  documents: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=800&h=500&fit=crop", 
  'ai-chat': "https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=800&h=500&fit=crop",
  dashboard: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=500&fit=crop"
};

const DemoContainer: React.FC<DemoContainerProps> = ({ demoData, className = "" }) => {
  const [demoState, setDemoState] = useState<DemoState>({
    activeTab: demoData[0]?.id || '',
    direction: 0,
    isTransitioning: false,
    userProgress: {}
  });

  // Demo tabs configuration with clear, always-visible styling
  const demoTabs: DemoTab[] = useMemo(() => [
    {
      id: 'guidance',
      label: 'Step-by-Step Guidance',
      icon: <BookOpen className="w-5 h-5" />,
      content: demoData.find(d => d.type === 'guidance') || demoData[0]
    },
    {
      id: 'documents',
      label: 'Document Templates',
      icon: <FileText className="w-5 h-5" />,
      content: demoData.find(d => d.type === 'documents') || demoData[0]
    },
    {
      id: 'ai-chat',
      label: 'AI Assistant',
      icon: <MessageCircle className="w-5 h-5" />,
      content: demoData.find(d => d.type === 'ai-chat') || demoData[0]
    },
    {
      id: 'dashboard',
      label: 'Progress Dashboard',
      icon: <BarChart3 className="w-5 h-5" />,
      content: demoData.find(d => d.type === 'dashboard') || demoData[0]
    }
  ], [demoData]);

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
      <div className="text-center mb-12">
        <motion.h2 
          className="text-4xl md:text-5xl font-bold text-gray-900 mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          Experience Bizzy Live
        </motion.h2>
        <motion.p 
          className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          Explore our platform with real content and interactive features designed specifically for UK businesses
        </motion.p>
      </div>

      {/* Tab Navigation - Always visible, clear buttons */}
      <motion.div 
        className="flex flex-wrap justify-center gap-3 md:gap-6 mb-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        {demoTabs.map((tab) => (
          <motion.div key={tab.id}>
            <Button
              variant={demoState.activeTab === tab.id ? "default" : "outline"}
              onClick={() => handleTabChange(tab.id)}
              className={`flex items-center gap-3 px-6 py-4 text-base font-semibold border-2 transition-all duration-200 ${
                demoState.activeTab === tab.id 
                  ? 'bg-blue-600 text-white border-blue-600 shadow-lg' 
                  : 'bg-white text-gray-700 border-gray-300 hover:border-blue-400 hover:text-blue-600'
              }`}
              disabled={demoState.isTransitioning}
            >
              {tab.icon}
              <span className="hidden sm:inline font-medium">{tab.label}</span>
            </Button>
          </motion.div>
        ))}
      </motion.div>

      {/* Navigation Arrows */}
      <div className="flex justify-between items-center mb-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            const prevIndex = activeIndex > 0 ? activeIndex - 1 : demoTabs.length - 1;
            handleTabChange(demoTabs[prevIndex].id);
          }}
          className="text-gray-600 hover:text-gray-900 font-medium"
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          Previous
        </Button>

        <div className="flex gap-2">
          {demoTabs.map((_, index) => (
            <motion.div
              key={index}
              className={`w-3 h-3 rounded-full transition-colors ${
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
          className="text-gray-600 hover:text-gray-900 font-medium"
        >
          Next
          <ChevronRight className="w-4 h-4 ml-1" />
        </Button>
      </div>

      {/* Demo Content Area with Static Screenshots */}
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
              <Card className="h-full p-8 bg-white border-2 border-gray-200 shadow-xl">
                {/* Content Header */}
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-4">
                    <div className="p-4 bg-blue-100 rounded-xl">
                      {activeTab.icon}
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900">{activeTab.content.title}</h3>
                      <p className="text-gray-600 text-lg">{activeTab.content.description}</p>
                    </div>
                  </div>
                  {activeTab.content.isLive && (
                    <Badge className="bg-green-100 text-green-800 border-green-300 px-3 py-1">
                      <motion.div
                        className="w-2 h-2 bg-green-500 rounded-full mr-2"
                        animate={{ opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                      Live Content
                    </Badge>
                  )}
                </div>

                {/* Static Screenshot Display */}
                <div className="h-full pb-16">
                  <div className="relative h-full bg-gray-50 rounded-lg overflow-hidden border-2 border-gray-200">
                    <img
                      src={demoScreenshots[demoState.activeTab as keyof typeof demoScreenshots]}
                      alt={`${activeTab.label} Screenshot`}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4">
                      <div className="bg-white/90 backdrop-blur-sm rounded-lg p-4">
                        <h4 className="font-semibold text-gray-900 mb-2">
                          Professional {activeTab.label}
                        </h4>
                        <p className="text-sm text-gray-600">
                          High-quality business tools designed specifically for UK entrepreneurs
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Demo Call-to-Action */}
      <motion.div
        className="mt-8 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        <p className="text-lg text-gray-600 mb-6">
          Ready to see the full platform in action?
        </p>
        <div className="flex justify-center gap-4">
          <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3">
            Start Your Business Today
          </Button>
          <Button variant="outline" size="lg" className="border-gray-300 text-gray-700 hover:border-blue-400 hover:text-blue-600 px-8 py-3">
            Schedule a Demo
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default DemoContainer;
