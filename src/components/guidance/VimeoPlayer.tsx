
import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Play, ExternalLink } from 'lucide-react';

interface VimeoPlayerProps {
  videoUrl: string;
  title?: string;
}

export const VimeoPlayer: React.FC<VimeoPlayerProps> = ({ videoUrl, title }) => {
  const [showOverlay, setShowOverlay] = useState(true);

  // Extract Vimeo video ID from URL
  const getVimeoId = (url: string): string | null => {
    const match = url.match(/vimeo\.com\/(\d+)/);
    return match ? match[1] : null;
  };

  const videoId = getVimeoId(videoUrl);
  
  if (!videoId) {
    return null;
  }

  // Enhanced embed URL with comprehensive mobile compatibility parameters
  const embedUrl = `https://player.vimeo.com/video/${videoId}?` + new URLSearchParams({
    badge: '0',
    autopause: '0',
    background: '0',
    color: '2962FF',
    title: '0',
    byline: '0',
    portrait: '0',
    playsinline: '1',
    controls: '1',
    muted: '0',
    keyboard: '1',
    transparent: '1',
    responsive: '1',
    dnt: '1',
    app_id: '122963'
  }).toString();

  // Direct Vimeo link as fallback
  const directVimeoUrl = `https://vimeo.com/${videoId}`;

  // Detect if on iOS to handle specific iOS issues
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);

  return (
    <div className="mb-8">
      <div className="flex items-center gap-2 mb-4">
        <Badge variant="secondary" className="bg-blue-100 text-blue-700 gap-1">
          <Play className="w-3 h-3" />
          Video Tutorial
        </Badge>
        {title && (
          <span className="text-sm text-gray-600">{title}</span>
        )}
      </div>
      
      <div className="relative rounded-lg overflow-hidden shadow-lg bg-gray-100">
        <div 
          className="relative w-full"
          style={{ 
            paddingBottom: '56.25%', // 16:9 aspect ratio
            height: 0,
            overflow: 'hidden'
          }}
        >
          {showOverlay && (
            <div 
              className="absolute inset-0 bg-black/20 flex items-center justify-center z-10 cursor-pointer"
              onClick={() => setShowOverlay(false)}
            >
              <div className="bg-white rounded-full p-4 shadow-lg">
                <Play className="w-8 h-8 text-blue-600" />
              </div>
            </div>
          )}
          
          <iframe
            src={embedUrl}
            className={`absolute top-0 left-0 w-full h-full ${showOverlay ? 'pointer-events-none' : ''}`}
            frameBorder="0"
            allow="autoplay; fullscreen; picture-in-picture; accelerometer; gyroscope; encrypted-media"
            allowFullScreen
            sandbox="allow-scripts allow-same-origin allow-presentation allow-popups allow-popups-to-escape-sandbox"
            title={title || "Video Tutorial"}
            loading="lazy"
            referrerPolicy="strict-origin-when-cross-origin"
            style={{ 
              minHeight: '200px',
              WebkitOverflowScrolling: 'touch',
              touchAction: 'manipulation',
              pointerEvents: showOverlay ? 'none' : 'auto',
              position: 'absolute',
              inset: 0
            }}
          />
        </div>
      </div>
      
      <div className="flex items-center justify-between mt-2">
        <p className="text-sm text-gray-600">
          Watch this quick video guide to understand the key concepts
        </p>
        <a
          href={directVimeoUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 hover:underline"
        >
          <ExternalLink className="w-3 h-3" />
          Watch on Vimeo
        </a>
      </div>
    </div>
  );
};
