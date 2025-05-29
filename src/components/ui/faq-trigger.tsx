
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface FAQTriggerProps {
  onClick: () => void;
}

export const FAQTrigger: React.FC<FAQTriggerProps> = ({ onClick }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <motion.div
            className="fixed right-4 bottom-20 z-40"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
          >
            <Button
              onClick={onClick}
              size="icon"
              className="h-12 w-12 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <HelpCircle className="w-6 h-6" />
            </Button>
          </motion.div>
        </TooltipTrigger>
        <TooltipContent side="left">
          <p>Need Help? View FAQs</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
