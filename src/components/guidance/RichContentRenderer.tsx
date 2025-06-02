
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import { ExternalLink, Play } from "lucide-react";
import type { EnhancedGuidanceStep } from "@/types/guidance";

interface RichContentRendererProps {
  content: EnhancedGuidanceStep;
  stepId: number;
}

interface RichContentBlock {
  type: 'text' | 'video' | 'link' | 'list' | 'heading';
  content: string;
  url?: string;
  title?: string;
  items?: string[];
  level?: number;
}

const RichContentRenderer: React.FC<RichContentRendererProps> = React.memo(({ content, stepId }) => {
  const renderId = React.useRef(Math.random().toString(36).substr(2, 9));
  
  console.log(`[RichContentRenderer-${renderId.current}] Rendering for step ${stepId}`);

  const parseRichContent = (richContent: any): RichContentBlock[] => {
    console.log(`[RichContentRenderer-${renderId.current}] Parsing rich content:`, richContent);
    
    if (!richContent) return [];
    
    try {
      let parsedContent = richContent;
      if (typeof richContent === 'string') {
        parsedContent = JSON.parse(richContent);
      }
      
      const blocks: RichContentBlock[] = [];
      const processedVideoUrls = new Set<string>();
      
      if (Array.isArray(parsedContent)) {
        parsedContent.forEach((block, index) => {
          console.log(`[RichContentRenderer-${renderId.current}] Processing block ${index}:`, block);
          
          if (block.type === 'video' && block.url) {
            if (processedVideoUrls.has(block.url)) {
              console.log(`[RichContentRenderer-${renderId.current}] Skipping duplicate video:`, block.url);
              return;
            }
            processedVideoUrls.add(block.url);
          }
          
          blocks.push(block);
        });
      } else if (parsedContent.blocks && Array.isArray(parsedContent.blocks)) {
        parsedContent.blocks.forEach((block: any, index: number) => {
          console.log(`[RichContentRenderer-${renderId.current}] Processing nested block ${index}:`, block);
          
          if (block.type === 'video' && block.url) {
            if (processedVideoUrls.has(block.url)) {
              console.log(`[RichContentRenderer-${renderId.current}] Skipping duplicate video:`, block.url);
              return;
            }
            processedVideoUrls.add(block.url);
          }
          
          blocks.push(block);
        });
      }
      
      // Add video from video_url field if it exists and wasn't already added
      if (content.video_url && !processedVideoUrls.has(content.video_url)) {
        console.log(`[RichContentRenderer-${renderId.current}] Adding video from video_url field:`, content.video_url);
        blocks.unshift({
          type: 'video',
          url: content.video_url,
          title: 'Bizzy Video Tutorial',
          content: 'Watch this tutorial to learn more'
        });
      }
      
      console.log(`[RichContentRenderer-${renderId.current}] Final parsed blocks:`, blocks);
      return blocks;
    } catch (error) {
      console.error(`[RichContentRenderer-${renderId.current}] Error parsing rich content:`, error);
      return [];
    }
  };

  const extractVimeoId = (url: string): string | null => {
    const match = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
    return match ? match[1] : null;
  };

  const renderBlock = (block: RichContentBlock, index: number) => {
    const blockKey = `${stepId}-${block.type}-${index}-${renderId.current}`;
    
    switch (block.type) {
      case 'video':
        if (!block.url) return null;
        
        const vimeoId = extractVimeoId(block.url);
        if (!vimeoId) return null;

        console.log(`[RichContentRenderer-${renderId.current}] Rendering video block with ID:`, vimeoId);
        
        return (
          <div key={blockKey} className="mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Play className="w-5 h-5" />
                  {block.title || 'Bizzy Video Tutorial'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <AspectRatio ratio={16/9}>
                  <iframe
                    id={`vimeo-${vimeoId}-${renderId.current}`}
                    src={`https://player.vimeo.com/video/${vimeoId}?badge=0&autopause=0&player_id=vimeo-${vimeoId}-${renderId.current}&app_id=58479`}
                    frameBorder="0"
                    allow="autoplay; fullscreen; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full rounded"
                    title={block.title || 'Bizzy Video Tutorial'}
                    onLoad={() => console.log(`[${vimeoId}-${renderId.current}] Video iframe loaded successfully`)}
                  ></iframe>
                </AspectRatio>
                {block.content && (
                  <p className="mt-4 text-gray-600">{block.content}</p>
                )}
              </CardContent>
            </Card>
          </div>
        );

      case 'heading':
        const headingLevel = Math.min(block.level || 3, 6);
        const HeadingComponent = `h${headingLevel}` as keyof JSX.IntrinsicElements;
        return (
          <HeadingComponent key={blockKey} className="text-xl font-semibold mb-4 mt-6">
            {block.content}
          </HeadingComponent>
        );

      case 'text':
        return (
          <p key={blockKey} className="mb-4 text-gray-700 leading-relaxed">
            {block.content}
          </p>
        );

      case 'list':
        return (
          <ul key={blockKey} className="list-disc list-inside mb-4 space-y-2">
            {block.items?.map((item, itemIndex) => (
              <li key={`${blockKey}-item-${itemIndex}`} className="text-gray-700">
                {item}
              </li>
            ))}
          </ul>
        );

      case 'link':
        return (
          <div key={blockKey} className="mb-4">
            <a
              href={block.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-[#0088cc] hover:underline"
            >
              <ExternalLink className="w-4 h-4" />
              {block.title || block.content}
            </a>
          </div>
        );

      default:
        return null;
    }
  };

  const blocks = parseRichContent(content.rich_content);
  
  console.log(`[RichContentRenderer-${renderId.current}] Rendering ${blocks.length} blocks`);

  if (blocks.length === 0) {
    // Fallback to basic content
    return (
      <div className="prose max-w-none">
        <p className="text-base sm:text-lg leading-relaxed text-gray-700">
          {content.content}
        </p>
      </div>
    );
  }

  return (
    <div className="rich-content">
      {blocks.map((block, index) => renderBlock(block, index))}
    </div>
  );
});

RichContentRenderer.displayName = 'RichContentRenderer';

export { RichContentRenderer };
