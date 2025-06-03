
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
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
          >
            <Button
              onClick={onClick}
              size="icon"
              className="h-14 w-14 rounded-full bg-white hover:bg-gray-50 text-gray-700 hover:text-gray-900 shadow-lg hover:shadow-xl border border-gray-200 transition-all duration-200"
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
