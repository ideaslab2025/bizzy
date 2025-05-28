
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Award, Target, Zap } from 'lucide-react';
import { Confetti } from './Confetti';

interface MilestoneReachedProps {
  milestone: {
    type: 'section_complete' | 'first_section' | 'halfway' | 'all_complete' | 'quick_wins';
    title: string;
    description: string;
  };
  onClose: () => void;
}

export const MilestoneReached: React.FC<MilestoneReachedProps> = ({ milestone, onClose }) => {
  const getIcon = () => {
    switch (milestone.type) {
      case 'section_complete':
        return <Trophy className="w-16 h-16 text-yellow-500" />;
      case 'first_section':
        return <Award className="w-16 h-16 text-blue-500" />;
      case 'halfway':
        return <Target className="w-16 h-16 text-green-500" />;
      case 'quick_wins':
        return <Zap className="w-16 h-16 text-purple-500" />;
      default:
        return <Trophy className="w-16 h-16 text-yellow-500" />;
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 flex items-center justify-center z-50 bg-black/50"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          exit={{ scale: 0, rotate: 180 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
          className="bg-white rounded-2xl p-8 shadow-2xl max-w-md mx-4"
          onClick={(e) => e.stopPropagation()}
        >
          <motion.div
            animate={{ 
              scale: [1, 1.2, 1],
              rotate: [0, 10, -10, 0]
            }}
            transition={{ 
              duration: 0.5,
              repeat: 2,
              repeatType: "reverse" 
            }}
            className="flex justify-center mb-6"
          >
            {getIcon()}
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-3xl font-bold text-center mb-3"
          >
            {milestone.title}
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-gray-600 text-center mb-6"
          >
            {milestone.description}
          </motion.p>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClose}
            className="w-full bg-[#0088cc] text-white py-3 rounded-lg font-medium hover:bg-[#0077bb] transition-colors"
          >
            Continue
          </motion.button>
        </motion.div>
        
        <Confetti active={true} duration={5000} />
      </motion.div>
    </AnimatePresence>
  );
};
