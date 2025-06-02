
import React, { useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DemoContent, DemoTab, DemoState } from '@/types/demo';
import { FileText, MessageCircle, BarChart3, BookOpen, ChevronLeft, ChevronRight } from 'lucide-react';

interface DemoContainerProps {
  demoData: DemoContent[];
  className?: string;
}

// Advanced animation variants for sophisticated transitions
const containerVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      staggerChildren: 0.1
    }
  }
};

const tabVariants = {
  inactive: {
    scale: 0.95,
    opacity: 0.7,
    y: 5,
    filter: "blur(1px)"
  },
  active: {
    scale: 1,
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 25
    }
  }
};

const contentVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 400 : -400,
    opacity: 0,
    scale: 0.9,
    rotateY: direction > 0 ? 15 : -15,
    filter: "blur(4px)"
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
    scale: 1,
    rotateY: 0,
    filter: "blur(0px)",
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 30,
      opacity: { duration: 0.2 }
    }
  },
  exit: (direction: number) => ({
    zIndex: 0,
    x: direction < 0 ? 400 : -400,
    opacity: 0,
    scale: 0.9,
    rotateY: direction < 0 ? 15 : -15,
    filter: "blur(4px)",
    transition: {
      duration: 0.3
    }
  })
};

const DemoContainer: React.FC<DemoContainerProps> = ({ demoData, className = "" }) => {
  const [demoState, setDemoState] = useState<DemoState>({
    activeTab: demoData[0]?.id || '',
    direction: 0,
    isTransitioning: false,
    userProgress: {}
  });

  // Motion values for advanced interactions
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useTransform(mouseY, [-300, 300], [5, -5]);
  const rotateY = useTransform(mouseX, [-300, 300], [-5, 5]);

  // Demo tabs configuration
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

    // Reset transition state after animation
    setTimeout(() => {
      setDemoState(prev => ({ ...prev, isTransitioning: false }));
    }, 300);
  }, [demoTabs, demoState.activeTab]);

  const activeTab = demoTabs.find(tab => tab.id === demoState.activeTab);
  const activeIndex = demoTabs.findIndex(tab => tab.id === demoState.activeTab);

  const handleMouseMove = (event: React.MouseEvent) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    mouseX.set(event.clientX - centerX);
    mouseY.set(event.clientY - centerY);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <motion.div
      className={`demo-container ${className}`}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
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

      {/* Tab Navigation */}
      <motion.div 
        className="flex flex-wrap justify-center gap-2 md:gap-4 mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        {demoTabs.map((tab, index) => (
          <motion.div
            key={tab.id}
            variants={tabVariants}
            animate={demoState.activeTab === tab.id ? "active" : "inactive"}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              variant={demoState.activeTab === tab.id ? "default" : "outline"}
              onClick={() => handleTabChange(tab.id)}
              className={`flex items-center gap-2 transition-all duration-300 ${
                demoState.activeTab === tab.id 
                  ? 'bg-blue-600 text-white shadow-lg' 
                  : 'hover:bg-blue-50 hover:border-blue-300'
              }`}
              disabled={demoState.isTransitioning}
            >
              {tab.icon}
              <span className="hidden sm:inline">{tab.label}</span>
            </Button>
          </motion.div>
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
          className="opacity-60 hover:opacity-100 transition-opacity"
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
          className="opacity-60 hover:opacity-100 transition-opacity"
        >
          Next
          <ChevronRight className="w-4 h-4 ml-1" />
        </Button>
      </div>

      {/* Demo Content Area */}
      <div className="relative h-[600px] md:h-[700px] overflow-hidden">
        <motion.div
          className="demo-viewport h-full"
          style={{
            perspective: 1000,
            rotateX,
            rotateY
          }}
        >
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
                <Card className="h-full p-6 md:p-8 bg-white/80 backdrop-blur-sm border-2 border-gray-200 shadow-2xl">
                  {/* Content Header */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <motion.div
                        className="p-3 bg-blue-100 rounded-lg"
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        transition={{ type: "spring", stiffness: 400, damping: 10 }}
                      >
                        {activeTab.icon}
                      </motion.div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">{activeTab.content.title}</h3>
                        <p className="text-gray-600">{activeTab.content.description}</p>
                      </div>
                    </div>
                    {activeTab.content.isLive && (
                      <Badge className="bg-green-100 text-green-800 border-green-300">
                        <motion.div
                          className="w-2 h-2 bg-green-500 rounded-full mr-2"
                          animate={{ opacity: [0.5, 1, 0.5] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        />
                        Live Content
                      </Badge>
                    )}
                  </div>

                  {/* Placeholder for Demo Content */}
                  <motion.div
                    className="h-full bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg flex items-center justify-center"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    <div className="text-center">
                      <motion.div
                        className="text-6xl mb-4"
                        animate={{ 
                          scale: [1, 1.1, 1],
                          rotate: [0, 5, -5, 0]
                        }}
                        transition={{ 
                          duration: 4, 
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                      >
                        🚀
                      </motion.div>
                      <p className="text-lg text-gray-600">
                        Interactive {activeTab.label} Demo
                      </p>
                      <p className="text-sm text-gray-500 mt-2">
                        Sophisticated demo content coming soon
                      </p>
                    </div>
                  </motion.div>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Demo Controls */}
      <motion.div
        className="mt-6 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        <p className="text-sm text-gray-500 mb-4">
          Use navigation or swipe to explore different features
        </p>
        <div className="flex justify-center gap-4">
          <Button variant="outline" size="sm" className="opacity-75">
            Reset Demo
          </Button>
          <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
            Try Full Platform
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default DemoContainer;
