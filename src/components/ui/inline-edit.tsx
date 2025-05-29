
import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Pencil, Check, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface InlineEditProps {
  value: string;
  onSave: (value: string) => Promise<boolean> | boolean;
  className?: string;
  placeholder?: string;
  variant?: 'text' | 'heading' | 'number';
  validation?: (value: string) => string | null;
  maxLength?: number;
  autoSave?: boolean;
  saveDelay?: number;
}

export const InlineEdit: React.FC<InlineEditProps> = ({
  value,
  onSave,
  className,
  placeholder = "Click to edit",
  variant = 'text',
  validation,
  maxLength,
  autoSave = true,
  saveDelay = 2000
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);
  const [isHovered, setIsHovered] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const saveTimeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    setEditValue(value);
  }, [value]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  // Auto-save functionality
  useEffect(() => {
    if (autoSave && isEditing && editValue !== value) {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
      
      saveTimeoutRef.current = setTimeout(() => {
        handleSave();
      }, saveDelay);
    }

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [editValue, isEditing, autoSave, saveDelay]);

  const handleEdit = () => {
    if (variant === 'heading') return; // Require double-click for headings
    setIsEditing(true);
    setError(null);
  };

  const handleDoubleClick = () => {
    if (variant === 'heading') {
      setIsEditing(true);
      setError(null);
    }
  };

  const handleSave = async () => {
    if (editValue === value) {
      setIsEditing(false);
      return;
    }

    // Validation
    if (validation) {
      const validationError = validation(editValue);
      if (validationError) {
        setError(validationError);
        return;
      }
    }

    setIsSaving(true);
    setError(null);

    try {
      const success = await onSave(editValue);
      if (success) {
        setIsEditing(false);
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 1000);
      } else {
        setError('Failed to save');
      }
    } catch (err) {
      setError('Failed to save');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setEditValue(value);
    setIsEditing(false);
    setError(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSave();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      handleCancel();
    } else if (e.key === 'Tab') {
      handleSave();
    }
  };

  const handleClickOutside = () => {
    if (isEditing && !autoSave) {
      handleSave();
    }
  };

  const getDisplayClass = () => {
    switch (variant) {
      case 'heading':
        return 'text-xl font-semibold';
      case 'number':
        return 'font-mono';
      default:
        return '';
    }
  };

  if (isEditing) {
    return (
      <div className={cn("relative", className)}>
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Input
              ref={inputRef}
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onKeyDown={handleKeyDown}
              onBlur={handleClickOutside}
              placeholder={placeholder}
              maxLength={maxLength}
              className={cn(
                "transition-all duration-200",
                isSaving && "border-blue-300",
                error && "border-red-300"
              )}
              type={variant === 'number' ? 'number' : 'text'}
            />
            
            {/* Character counter */}
            {maxLength && (
              <div className="absolute -bottom-5 right-0 text-xs text-gray-400">
                {editValue.length}/{maxLength}
              </div>
            )}

            {/* Saving indicator */}
            {isSaving && (
              <div className="absolute right-2 top-1/2 -translate-y-1/2">
                <div className="w-4 h-4 border-2 border-blue-300 border-t-blue-600 rounded-full animate-spin" />
              </div>
            )}
          </div>

          {!autoSave && (
            <div className="flex gap-1">
              <Button
                size="sm"
                onClick={handleSave}
                disabled={isSaving}
                className="h-8 w-8 p-0"
              >
                <Check className="w-3 h-3" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={handleCancel}
                className="h-8 w-8 p-0"
              >
                <X className="w-3 h-3" />
              </Button>
            </div>
          )}
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute -bottom-6 left-0 text-xs text-red-500"
          >
            {error}
          </motion.div>
        )}
      </div>
    );
  }

  return (
    <motion.div
      className={cn(
        "relative cursor-pointer transition-all duration-200 group",
        "hover:bg-gray-50 rounded px-2 py-1 -mx-2 -my-1",
        getDisplayClass(),
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleEdit}
      onDoubleClick={handleDoubleClick}
      whileHover={{ scale: 1.01 }}
    >
      <span className={cn(
        isHovered && "border-b border-dotted border-gray-400"
      )}>
        {value || placeholder}
      </span>

      {/* Edit icon */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ 
          opacity: isHovered ? 1 : 0,
          scale: isHovered ? 1 : 0.8
        }}
        className="absolute -right-6 top-1/2 -translate-y-1/2"
      >
        <Pencil className="w-3 h-3 text-gray-400" />
      </motion.div>

      {/* Success indicator */}
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ 
          opacity: showSuccess ? 1 : 0,
          scale: showSuccess ? 1 : 0
        }}
        className="absolute -right-6 top-1/2 -translate-y-1/2"
      >
        <Check className="w-3 h-3 text-green-500" />
      </motion.div>
    </motion.div>
  );
};
