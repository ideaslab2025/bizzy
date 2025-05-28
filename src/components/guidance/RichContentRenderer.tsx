
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Lightbulb, 
  ExternalLink, 
  FileText, 
  CheckCircle, 
  AlertTriangle,
  Info
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { RichContentBlock } from '@/types/guidance';

interface RichContentRendererProps {
  content: any;
  stepId: number;
  onChecklistComplete?: (stepId: number, itemId: string, completed: boolean) => void;
}

export const RichContentRenderer: React.FC<RichContentRendererProps> = ({
  content,
  stepId,
  onChecklistComplete
}) => {
  // Parse rich_content JSONB field or fallback to simple text
  const blocks: RichContentBlock[] = content?.rich_content || [
    { type: 'text', content: content?.content || '' }
  ];

  const renderBlock = (block: RichContentBlock, index: number) => {
    switch (block.type) {
      case 'text':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            key={index}
            className="prose prose-lg max-w-none"
          >
            <div 
              className="text-lg leading-relaxed text-gray-700"
              dangerouslySetInnerHTML={{ __html: block.content || '' }}
            />
          </motion.div>
        );
        
      case 'checklist':
        return (
          <ChecklistBlock
            key={index}
            items={block.items || []}
            stepId={stepId}
            onComplete={onChecklistComplete}
          />
        );
        
      case 'alert':
        const AlertIcon = block.variant === 'warning' ? AlertTriangle : Info;
        return (
          <Alert key={index} variant={block.variant as any || 'default'}>
            <AlertIcon className="h-4 w-4" />
            <AlertTitle>{block.title}</AlertTitle>
            <AlertDescription>{block.content}</AlertDescription>
          </Alert>
        );
        
      case 'tip':
        return (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            key={index}
            className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded"
          >
            <p className="flex items-start gap-2">
              <Lightbulb className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
              <span>{block.content}</span>
            </p>
          </motion.div>
        );
        
      case 'action_button':
        return (
          <motion.div
            whileHover={{ scale: 1.02 }}
            key={index}
            className="flex justify-center my-6"
          >
            <Button
              size="lg"
              onClick={() => {
                if (block.action?.type === 'external_link' && block.action.url) {
                  window.open(block.action.url, '_blank');
                }
              }}
              className="gap-2"
            >
              <ExternalLink className="w-4 h-4" />
              {block.label}
            </Button>
          </motion.div>
        );
        
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {blocks.map(renderBlock)}
    </div>
  );
};

// Checklist component
interface ChecklistBlockProps {
  items: Array<{
    id: string;
    label: string;
    helpText?: string;
    completed?: boolean;
  }>;
  stepId: number;
  onComplete?: (stepId: number, itemId: string, completed: boolean) => void;
}

const ChecklistBlock: React.FC<ChecklistBlockProps> = ({
  items,
  stepId,
  onComplete
}) => {
  const [completedItems, setCompletedItems] = useState<Set<string>>(
    new Set(items.filter(item => item.completed).map(item => item.id))
  );

  const handleToggle = (itemId: string, completed: boolean) => {
    const newCompleted = new Set(completedItems);
    if (completed) {
      newCompleted.add(itemId);
    } else {
      newCompleted.delete(itemId);
    }
    setCompletedItems(newCompleted);
    onComplete?.(stepId, itemId, completed);
  };

  return (
    <Card className="bg-gray-50 border-2 border-gray-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <CheckCircle className="w-5 h-5" />
          Action Checklist
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {items.map((item) => {
          const isCompleted = completedItems.has(item.id);
          return (
            <motion.div
              key={item.id}
              whileHover={{ x: 4 }}
              className="bg-white p-4 rounded-lg border flex items-start gap-3"
            >
              <Checkbox
                checked={isCompleted}
                onCheckedChange={(checked) => handleToggle(item.id, !!checked)}
                className="mt-1"
              />
              <div className="flex-1">
                <label className={cn(
                  "font-medium cursor-pointer",
                  isCompleted && "line-through text-gray-500"
                )}>
                  {item.label}
                </label>
                {item.helpText && (
                  <p className="text-sm text-gray-600 mt-1">{item.helpText}</p>
                )}
                {isCompleted && (
                  <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" />
                    Completed
                  </p>
                )}
              </div>
            </motion.div>
          );
        })}
      </CardContent>
    </Card>
  );
};
