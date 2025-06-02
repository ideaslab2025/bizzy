
import React, { useState, useRef } from 'react';
import { Badge } from '@/components/ui/badge';
import { Play, AlertCircle, ExternalLink } from 'lucide-react';

interface BizzyVideoPlayerProps {
  videoUrl: string;
  title?: string;
}

export const BizzyVideoPlayer: React.FC<BizzyVideoPlayerProps> = ({ 
  videoUrl, 
  title 
}) => {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  
  // Check if URL is from B2 or is an MP4
  const isB2Video = videoUrl && (
    videoUrl.includes('backblazeb2.com') || 
    videoUrl.includes('.mp4')
  );
  
  // If it's still a Vimeo URL, show migration message
  if (videoUrl && videoUrl.includes('vimeo.com')) {
    return (
      <div className="mb-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <div className="flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-yellow-600" />
          <div>
            <p className="text-sm font-medium text-yellow-800">Video Migration Needed</p>
            <p className="text-xs text-yellow-700 mt-1">This video needs to be uploaded to B2</p>
          </div>
        </div>
      </div>
    );
  }
  
  // If no valid video URL
  if (!isB2Video || !videoUrl) {
    return (
      <div className="mb-8 p-4 bg-gray-50 border border-gray-200 rounded-lg">
        <div className="flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-gray-500" />
          <span className="text-sm text-gray-600">No video available for this section</span>
        </div>
      </div>
    );
  }
  
  return (
    <div className="mb-8">
      {/* Video Badge */}
      <div className="flex items-center gap-2 mb-4">
        <Badge variant="secondary" className="bg-blue-100 text-blue-700 gap-1">
          <Play className="w-3 h-3" />
          Video Tutorial
        </Badge>
        {title && (
          <span className="text-sm text-gray-600">{title}</span>
        )}
      </div>
      
      {/* Video Player */}
      <div className="relative rounded-lg overflow-hidden shadow-lg bg-black">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
            <div className="text-white">Loading video...</div>
          </div>
        )}
        
        {hasError ? (
          <div className="aspect-video flex items-center justify-center bg-gray-900">
            <div className="text-center p-6">
              <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-white mb-2">Unable to load video</p>
              <a
                href={videoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 text-sm flex items-center gap-1 justify-center"
              >
                <ExternalLink className="w-4 h-4" />
                Try opening directly
              </a>
            </div>
          </div>
        ) : (
          <video
            ref={videoRef}
            controls
            playsInline
            preload="metadata"
            className="w-full h-auto"
            onLoadedMetadata={() => setIsLoading(false)}
            onError={() => {
              setIsLoading(false);
              setHasError(true);
            }}
          >
            <source src={videoUrl} type="video/mp4" />
            <p className="p-4 text-white text-center">
              Your browser doesn't support HTML5 video.
            </p>
          </video>
        )}
      </div>
      
      {/* Description */}
      <p className="text-sm text-gray-600 mt-3">
        30-second guide covering the key concepts
      </p>
    </div>
  );
};
