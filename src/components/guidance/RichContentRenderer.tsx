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
  Info,
  Play
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { RichContentBlock } from '@/types/guidance';

interface RichContentRendererProps {
  content: any;
  stepId: number;
  onChecklistComplete?: (stepId: number, itemId: string, completed: boolean) => void;
}

// Enhanced parsing function to handle video_url at root level
const parseRichContent = (content: any): RichContentBlock[] => {
  console.log('RichContentRenderer received content:', content);
  
  const blocks: RichContentBlock[] = [];
  
  try {
    // First, check if there's a video_url at the root level
    if (content.video_url) {
      console.log('Found video_url at root level:', content.video_url);
      
      blocks.push({
        type: 'video',
        content: content.video_url,
        title: 'Starting your Company Documents'
      });
    }
    
    // Then parse the regular rich_content blocks if they exist
    if (content.rich_content) {
      const richContent = typeof content.rich_content === 'string' 
        ? JSON.parse(content.rich_content) 
        : content.rich_content;
      
      if (richContent?.blocks && Array.isArray(richContent.blocks)) {
        console.log('Parsing rich_content blocks:', richContent.blocks.length);
        // Only add blocks that are not videos (to avoid duplicates)
        richContent.blocks.forEach((block: any) => {
          if (block.type !== 'video') {
            blocks.push(block);
          }
        });
      } else if (Array.isArray(richContent)) {
        console.log('Rich content is directly an array');
        richContent.forEach((block: any) => {
          if (block.type !== 'video') {
            blocks.push(block);
          }
        });
      }
    }
    
    // Fallback: if no blocks were found and no video_url, create a text block from content
    if (blocks.length === 0 && content.content) {
      console.log('No rich content found, falling back to text content');
      blocks.push({ 
        type: 'text', 
        content: content.content 
      });
    }
    
    console.log('Final parsed blocks:', blocks);
    return blocks;
    
  } catch (error) {
    console.error('Error parsing rich content:', error);
    return [{ type: 'text', content: 'Error loading content' }];
  }
};

export const RichContentRenderer: React.FC<RichContentRendererProps> = ({
  content,
  stepId,
  onChecklistComplete
}) => {
  const blocks = parseRichContent(content);

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
              className="text-base sm:text-lg leading-relaxed text-gray-700"
              dangerouslySetInnerHTML={{ __html: block.content || '' }}
            />
          </motion.div>
        );

      case 'video':
        console.log('Rendering video block with content:', block.content);
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            key={index}
            className="my-4 sm:my-6"
          >
            <div className="flex items-center gap-2 mb-3 sm:mb-4">
              <Badge variant="secondary" className="bg-blue-100 text-blue-700 gap-1 text-xs sm:text-sm">
                <Play className="w-3 h-3" />
                Video Tutorial
              </Badge>
              <span className="text-xs sm:text-sm text-gray-600">{block.title || 'Starting your Company Documents'}</span>
            </div>
            
            <div className="relative w-full overflow-hidden rounded-lg bg-gray-100 shadow-lg" 
                 style={{ paddingBottom: '56.25%' }}>
              {block.content && block.content.includes('synthesia.io') ? (
                <iframe
                  src={block.content}
                  className="absolute inset-0 w-full h-full"
                  frameBorder="0"
                  allow="autoplay; fullscreen; picture-in-picture; clipboard-write"
                  allowFullScreen
                  loading="lazy"
                  title="Starting your Company Documents"
                  onLoad={() => console.log('Video iframe loaded successfully')}
                  onError={(e) => {
                    console.error('Failed to load video iframe:', block.content, e);
                  }}
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center p-4 sm:p-6">
                    <Play className="w-8 h-8 sm:w-12 sm:h-12 text-gray-400 mx-auto mb-2 sm:mb-3" />
                    <p className="text-sm sm:text-base text-gray-600">Video not available</p>
                    <p className="text-xs sm:text-sm text-gray-500 mt-1 sm:mt-2">
                      URL: {block.content ? block.content.substring(0, 30) + '...' : 'No URL provided'}
                    </p>
                  </div>
                </div>
              )}
            </div>
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
          <Alert key={index} variant={block.variant as any || 'default'} className="my-4">
            <AlertIcon className="h-4 w-4" />
            <AlertTitle className="text-sm sm:text-base">{block.title}</AlertTitle>
            <AlertDescription className="text-sm">{block.content}</AlertDescription>
          </Alert>
        );
        
      case 'tip':
        return (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            key={index}
            className="bg-blue-50 border-l-4 border-blue-500 p-3 sm:p-4 rounded my-4"
          >
            <p className="flex items-start gap-2 text-sm sm:text-base">
              <Lightbulb className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500 mt-0.5 flex-shrink-0" />
              <span>{block.content}</span>
            </p>
          </motion.div>
        );
        
      case 'action_button':
        return (
          <motion.div
            whileHover={{ scale: 1.02 }}
            key={index}
            className="flex justify-center my-4 sm:my-6"
          >
            <Button
              size="lg"
              onClick={() => {
                if (block.action?.type === 'external_link' && block.action.url) {
                  window.open(block.action.url, '_blank');
                }
              }}
              className="gap-2 text-sm sm:text-base"
            >
              <ExternalLink className="w-4 h-4" />
              {block.label}
            </Button>
          </motion.div>
        );
        
      default:
        return (
          <div key={index} className="text-gray-500 italic text-sm">
            Unknown content type: {block.type}
          </div>
        );
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {Array.isArray(blocks) && blocks.length > 0 ? (
        blocks.map(renderBlock)
      ) : (
        <div className="text-gray-500 italic text-sm">No content blocks found</div>
      )}
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
    <Card className="bg-gray-50 border-2 border-gray-200 my-4">
      <CardHeader className="pb-3 sm:pb-4">
        <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
          <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" />
          Action Checklist
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 sm:space-y-3">
        {Array.isArray(items) && items.length > 0 ? (
          items.map((item) => {
            const isCompleted = completedItems.has(item.id);
            return (
              <motion.div
                key={item.id}
                whileHover={{ x: 4 }}
                className="bg-white p-3 sm:p-4 rounded-lg border flex items-start gap-2 sm:gap-3"
              >
                <Checkbox
                  checked={isCompleted}
                  onCheckedChange={(checked) => handleToggle(item.id, !!checked)}
                  className="mt-1"
                />
                <div className="flex-1">
                  <label className={cn(
                    "font-medium cursor-pointer text-sm sm:text-base",
                    isCompleted && "line-through text-gray-500"
                  )}>
                    {item.label}
                  </label>
                  {item.helpText && (
                    <p className="text-xs sm:text-sm text-gray-600 mt-1">{item.helpText}</p>
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
          })
        ) : (
          <p className="text-gray-500 text-xs sm:text-sm">No checklist items available</p>
        )}
      </CardContent>
    </Card>
  );
};
