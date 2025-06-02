
import React, { useState } from 'react';
import { BizzyVideoPlayer } from '@/components/guidance/BizzyVideoPlayer';

const VideoTest = () => {
  // Test with a sample B2 URL structure
  const testVideoUrl = "https://bizzy-videos.s3.us-west-002.backblazeb2.com/test-video.mp4";
  
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">B2 Video Test</h1>
      
      <div className="bg-gray-50 p-4 rounded-lg mb-6">
        <h2 className="font-semibold mb-2">Test B2 Video URL:</h2>
        <p className="text-sm text-gray-600 break-all">{testVideoUrl}</p>
        <p className="text-xs text-gray-500 mt-2">
          Note: Upload a video named "test-video.mp4" to your B2 bucket to test
        </p>
      </div>
      
      <div className="border rounded-lg p-6">
        <BizzyVideoPlayer 
          videoUrl={testVideoUrl}
          title="Test Video from B2"
        />
      </div>
    </div>
  );
};

export default VideoTest;
