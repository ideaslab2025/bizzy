
import React from 'react';
import { CopyButton } from './copy-button';
import { cn } from '@/lib/utils';

interface CodeBlockProps {
  children: React.ReactNode;
  language?: string;
  className?: string;
  copyable?: boolean;
}

export const CodeBlock: React.FC<CodeBlockProps> = ({
  children,
  language,
  className,
  copyable = true
}) => {
  const textContent = typeof children === 'string' ? children : 
    React.Children.toArray(children).join('');

  return (
    <div className={cn('group relative', className)}>
      <pre className={cn(
        'bg-gray-50 border rounded-lg p-4 overflow-x-auto text-sm',
        'font-mono text-gray-800'
      )}>
        <code className={language ? `language-${language}` : ''}>
          {children}
        </code>
      </pre>
      
      {copyable && (
        <div className="absolute top-2 right-2">
          <CopyButton 
            text={textContent}
            showOnHover={true}
            className="bg-white/80 backdrop-blur-sm hover:bg-white"
          />
        </div>
      )}
    </div>
  );
};
