
import React, { useState, useEffect } from 'react';

interface BackgroundImageHandlerProps {
  imageUrl: string;
  fallbackGradient?: string;
  children: React.ReactNode;
  className?: string;
}

export const BackgroundImageHandler: React.FC<BackgroundImageHandlerProps> = ({
  imageUrl,
  fallbackGradient = 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 50%, #cbd5e1 100%)',
  children,
  className = ''
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    const img = new Image();
    
    img.onload = () => {
      setImageLoaded(true);
      setImageError(false);
    };
    
    img.onerror = () => {
      setImageError(true);
      setImageLoaded(false);
      console.warn('Background image failed to load:', imageUrl);
    };
    
    img.src = imageUrl;
    
    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [imageUrl]);

  const backgroundStyle = imageError ? 
    { background: fallbackGradient } : 
    {
      background: fallbackGradient,
      backgroundImage: imageLoaded ? `url(${imageUrl})` : undefined,
      backgroundSize: '600px',
      backgroundPosition: 'center',
      backgroundRepeat: 'repeat',
      backgroundAttachment: 'scroll'
    };

  return (
    <div 
      className={`${className} dashboard-bg-image`}
      style={backgroundStyle}
    >
      {children}
    </div>
  );
};
