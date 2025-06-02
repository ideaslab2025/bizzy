
import React from 'react';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

interface DemoScrollIndicatorProps {
  className?: string;
}

const DemoScrollIndicator: React.FC<DemoScrollIndicatorProps> = ({ className = "" }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5 }}
      className={`flex flex-col items-center gap-2 ${className}`}
    >
      <span className="text-sm text-blue-300 font-medium">
        Interactive Demo Below
      </span>
      <motion.div
        animate={{ y: [0, 5, 0] }}
        transition={{ 
          duration: 1.5, 
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-500/20 border border-blue-400/30"
      >
        <ChevronDown className="w-4 h-4 text-blue-400" />
      </motion.div>
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: 0.8, duration: 0.6 }}
        className="w-12 h-0.5 bg-gradient-to-r from-transparent via-blue-400 to-transparent"
      />
    </motion.div>
  );
};

export default DemoScrollIndicator;
