
import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, X } from 'lucide-react';
import type { UserAchievement } from '@/types/guidance';

interface AchievementNotificationProps {
  achievement: UserAchievement & {
    title: string;
    description: string;
  };
  onClose: () => void;
}

export const AchievementNotification: React.FC<AchievementNotificationProps> = ({ 
  achievement, 
  onClose 
}) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ x: 400, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: 400, opacity: 0 }}
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
        className="fixed top-20 right-4 bg-white shadow-2xl rounded-lg p-6 max-w-sm border-2 border-yellow-400 z-50"
      >
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
        >
          <X className="w-4 h-4" />
        </button>
        
        <div className="flex items-start gap-4">
          <motion.div
            animate={{ rotate: [0, -10, 10, -10, 0] }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0"
          >
            <Trophy className="w-8 h-8 text-yellow-600" />
          </motion.div>
          
          <div className="flex-1">
            <h3 className="font-bold text-lg mb-1">Achievement Unlocked!</h3>
            <p className="text-gray-900 font-medium">{achievement.title}</p>
            <p className="text-sm text-gray-600 mt-1">{achievement.description}</p>
            <p className="text-xs text-gray-500 mt-2">
              {new Date(achievement.achieved_at).toLocaleDateString()}
            </p>
          </div>
        </div>
        
        <div className="absolute inset-0 pointer-events-none">
          {/* Sparkle effects */}
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-yellow-400 rounded-full"
              initial={{ 
                x: 150, 
                y: 30,
                opacity: 0 
              }}
              animate={{ 
                x: 150 + Math.cos(i * 60 * Math.PI / 180) * 50,
                y: 30 + Math.sin(i * 60 * Math.PI / 180) * 50,
                opacity: [0, 1, 0]
              }}
              transition={{ 
                duration: 1,
                delay: i * 0.1,
                repeat: Infinity,
                repeatDelay: 2
              }}
            />
          ))}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
