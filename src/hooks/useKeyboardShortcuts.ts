
import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

interface UseKeyboardShortcutsOptions {
  onToggleChat?: () => void;
  onFocusSearch?: () => void;
  onSave?: () => void;
  onNew?: () => void;
}

export const useKeyboardShortcuts = (options: UseKeyboardShortcutsOptions = {}) => {
  const [showShortcuts, setShowShortcuts] = useState(false);
  const navigate = useNavigate();
  
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    // Don't trigger shortcuts when user is typing in input fields
    if (
      event.target instanceof HTMLInputElement ||
      event.target instanceof HTMLTextAreaElement ||
      event.target instanceof HTMLSelectElement ||
      (event.target as HTMLElement)?.contentEditable === 'true'
    ) {
      return;
    }

    const { key, metaKey, ctrlKey, altKey, shiftKey } = event;
    const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
    const isCmd = isMac ? metaKey : ctrlKey;

    // Help modal toggle
    if (key === '?' && !isCmd && !altKey && !shiftKey) {
      event.preventDefault();
      setShowShortcuts(true);
      return;
    }

    // Close modal with Escape
    if (key === 'Escape') {
      setShowShortcuts(false);
      return;
    }

    // Command/Ctrl + key shortcuts
    if (isCmd && !altKey && !shiftKey) {
      switch (key.toLowerCase()) {
        case 'k':
          event.preventDefault();
          // TODO: Open command palette when implemented
          console.log('Command palette shortcut triggered');
          break;
        case 's':
          event.preventDefault();
          options.onSave?.();
          break;
        case 'n':
          event.preventDefault();
          options.onNew?.();
          break;
        case 'i':
          event.preventDefault();
          options.onToggleChat?.();
          break;
        case 'd':
          event.preventDefault();
          // TODO: Download selected document when context available
          console.log('Download shortcut triggered');
          break;
        case 'r':
          // Allow default browser refresh
          break;
      }
      return;
    }

    // Alt + arrow navigation (browser back/forward)
    if (altKey && !isCmd && !shiftKey) {
      switch (key) {
        case 'ArrowLeft':
          event.preventDefault();
          window.history.back();
          break;
        case 'ArrowRight':
          event.preventDefault();
          window.history.forward();
          break;
      }
      return;
    }

    // Single key shortcuts (when no modifiers are pressed)
    if (!isCmd && !altKey && !shiftKey) {
      switch (key.toLowerCase()) {
        case 'g':
          // Start navigation mode - wait for next key
          event.preventDefault();
          handleNavigationMode();
          break;
        case 'd':
          event.preventDefault();
          navigate('/dashboard/documents');
          break;
        case 'f':
          event.preventDefault();
          // TODO: Focus document filters when on documents page
          options.onFocusSearch?.();
          break;
        case 'c':
          event.preventDefault();
          options.onToggleChat?.();
          break;
      }
    }
  }, [navigate, options]);

  const handleNavigationMode = useCallback(() => {
    // Set up a temporary listener for the next key press
    const navigationHandler = (event: KeyboardEvent) => {
      event.preventDefault();
      
      switch (event.key.toLowerCase()) {
        case 'd':
          navigate('/dashboard');
          break;
        case 'o':
          navigate('/dashboard/documents');
          break;
        case 'h':
          navigate('/guided-help');
          break;
        case 's':
          options.onFocusSearch?.();
          break;
        case ',':
          navigate('/dashboard/settings');
          break;
      }
      
      // Remove the temporary listener
      document.removeEventListener('keydown', navigationHandler);
    };

    // Add temporary listener and remove it after 3 seconds
    document.addEventListener('keydown', navigationHandler);
    setTimeout(() => {
      document.removeEventListener('keydown', navigationHandler);
    }, 3000);
  }, [navigate, options]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const openShortcuts = useCallback(() => setShowShortcuts(true), []);
  const closeShortcuts = useCallback(() => setShowShortcuts(false), []);

  return {
    showShortcuts,
    openShortcuts,
    closeShortcuts,
    setShowShortcuts
  };
};
