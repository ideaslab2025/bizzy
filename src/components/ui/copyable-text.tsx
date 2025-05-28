
import React from 'react';
import { CopyButton } from './copy-button';
import { cn } from '@/lib/utils';

interface CopyableTextProps {
  children: React.ReactNode;
  textToCopy: string;
  className?: string;
  copyButtonClassName?: string;
  showCopyButton?: boolean;
  inline?: boolean;
}

export const CopyableText: React.FC<CopyableTextProps> = ({
  children,
  textToCopy,
  className,
  copyButtonClassName,
  showCopyButton = true,
  inline = true
}) => {
  const WrapperComponent = inline ? 'span' : 'div';
  
  return (
    <WrapperComponent 
      className={cn(
        'group relative',
        inline ? 'inline-flex items-center gap-1' : 'flex items-center gap-2',
        className
      )}
    >
      {children}
      {showCopyButton && (
        <CopyButton 
          text={textToCopy}
          className={copyButtonClassName}
          showOnHover={true}
        />
      )}
    </WrapperComponent>
  );
};
