
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Play } from 'lucide-react';

interface VimeoPlayerProps {
  videoUrl: string;
  title?: string;
}

export const VimeoPlayer: React.FC<VimeoPlayerProps> = ({ videoUrl, title }) => {
  // Determine video source
  let videoSource = videoUrl;
  let isB2Ready = false;
  
  if (videoUrl && videoUrl.includes('vimeo.com')) {
    // For Vimeo URLs, show message about migration needed
    videoSource = null;
  } else if (videoUrl && (videoUrl.includes('backblazeb2.com') || videoUrl.includes('.mp4'))) {
    // B2 URL - ready to play
    isB2Ready = true;
  }

  return (
    <div className="mb-8">
      <div className="flex items-center gap-2 mb-4">
        <Badge variant="secondary" className="bg-blue-100 text-blue-700 gap-1">
          <Play className="w-3 h-3" />
          Video Tutorial
        </Badge>
        {title && <span className="text-sm text-gray-600">{title}</span>}
      </div>
      
      <div className="relative rounded-lg overflow-hidden shadow-lg bg-gray-100">
        <div className="aspect-video">
          {isB2Ready ? (
            <video
              controls
              className="absolute top-0 left-0 w-full h-full"
              playsInline
              preload="metadata"
            >
              <source src={videoSource} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center p-6">
                <Play className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600">Video coming soon</p>
                <p className="text-sm text-gray-500 mt-2">
                  Upload video to B2 and update URL
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
