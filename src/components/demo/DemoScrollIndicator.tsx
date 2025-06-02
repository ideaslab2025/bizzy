
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
      className={`flex flex-col items-center gap-3 ${className}`}
    >
      <span className="text-base text-blue-600 font-semibold">
        Interactive Demo Below
      </span>
      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ 
          duration: 2, 
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 border-2 border-blue-300"
      >
        <ChevronDown className="w-5 h-5 text-blue-600" />
      </motion.div>
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: 0.8, duration: 0.6 }}
        className="w-16 h-1 bg-gradient-to-r from-transparent via-blue-400 to-transparent rounded-full"
      />
    </motion.div>
  );
};

export default DemoScrollIndicator;
