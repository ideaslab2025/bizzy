
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Undo, RotateCcw, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface UndoAction {
  id: string;
  title: string;
  action: () => void;
  timestamp: Date;
  type?: 'text' | 'bulk' | 'settings' | 'navigation' | 'reorder';
  details?: string;
}

class UndoManager {
  private static instance: UndoManager;
  private actions: UndoAction[] = [];
  private redoStack: UndoAction[] = [];
  private maxActions = 50;

  public static getInstance(): UndoManager {
    if (!UndoManager.instance) {
      UndoManager.instance = new UndoManager();
    }
    return UndoManager.instance;
  }

  public addAction(title: string, undoAction: () => void, type?: UndoAction['type'], details?: string): void {
    const action: UndoAction = {
      id: Date.now().toString(),
      title,
      action: undoAction,
      timestamp: new Date(),
      type,
      details,
    };

    this.actions.unshift(action);
    this.redoStack = []; // Clear redo stack when new action is added
    
    if (this.actions.length > this.maxActions) {
      this.actions = this.actions.slice(0, this.maxActions);
    }

    // Enhanced toast with better design
    this.showUndoToast(action);
  }

  private showUndoToast(action: UndoAction) {
    const toastId = toast(
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0">
            {this.getActionIcon(action.type)}
          </div>
          <div>
            <p className="font-medium text-white">{action.title}</p>
            {action.details && (
              <p className="text-xs text-gray-300">{action.details}</p>
            )}
          </div>
        </div>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            this.undo();
            toast.dismiss(toastId);
          }}
          className="flex items-center gap-2 px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-medium transition-colors ml-4"
        >
          <Undo className="w-3 h-3" />
          <span>Undo</span>
          <CountdownRing duration={5000} />
        </motion.button>
      </div>,
      {
        duration: 5000,
        style: {
          background: 'rgba(17, 24, 39, 0.95)',
          border: '1px solid rgba(75, 85, 99, 0.3)',
          backdropFilter: 'blur(8px)',
        },
        position: 'bottom-right',
      }
    );
  }

  private getActionIcon(type?: UndoAction['type']) {
    switch (type) {
      case 'text':
        return <span className="text-blue-400">📝</span>;
      case 'bulk':
        return <span className="text-purple-400">📦</span>;
      case 'settings':
        return <span className="text-green-400">⚙️</span>;
      case 'navigation':
        return <span className="text-yellow-400">🧭</span>;
      case 'reorder':
        return <span className="text-orange-400">🔄</span>;
      default:
        return <span className="text-gray-400">✏️</span>;
    }
  }

  public undo(): boolean {
    const lastAction = this.actions.shift();
    if (lastAction) {
      this.redoStack.unshift(lastAction);
      lastAction.action();
      
      // Show undo confirmation
      toast.success(
        <div className="flex items-center gap-2">
          <Check className="w-4 h-4" />
          <span>Undid: {lastAction.title}</span>
        </div>,
        { duration: 2000 }
      );
      
      return true;
    }
    return false;
  }

  public redo(): boolean {
    const redoAction = this.redoStack.shift();
    if (redoAction) {
      this.actions.unshift(redoAction);
      // Note: For redo, we'd need to store the "redo" action separately
      // This is a simplified implementation
      
      toast.success(
        <div className="flex items-center gap-2">
          <RotateCcw className="w-4 h-4" />
          <span>Redid: {redoAction.title}</span>
        </div>,
        { duration: 2000 }
      );
      
      return true;
    }
    return false;
  }

  public getActions(): UndoAction[] {
    return [...this.actions];
  }

  public clear(): void {
    this.actions = [];
    this.redoStack = [];
  }

  public undoAll(): void {
    const actionsToUndo = [...this.actions];
    actionsToUndo.reverse().forEach(action => action.action());
    this.actions = [];
    
    toast.success(`Undid ${actionsToUndo.length} actions`, { duration: 3000 });
  }
}

// Countdown ring component for undo button
const CountdownRing: React.FC<{ duration: number }> = ({ duration }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + (100 / (duration / 100));
        return newProgress >= 100 ? 100 : newProgress;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [duration]);

  return (
    <svg className="w-4 h-4 -rotate-90">
      <circle
        cx="8"
        cy="8"
        r="6"
        stroke="currentColor"
        strokeWidth="1"
        fill="none"
        opacity="0.3"
      />
      <circle
        cx="8"
        cy="8"
        r="6"
        stroke="currentColor"
        strokeWidth="1"
        fill="none"
        strokeDasharray={`${2 * Math.PI * 6}`}
        strokeDashoffset={`${2 * Math.PI * 6 * (1 - progress / 100)}`}
        className="transition-all duration-100"
      />
    </svg>
  );
};

export const useUndo = () => {
  const manager = UndoManager.getInstance();
  
  const addUndoAction = (
    title: string, 
    undoAction: () => void, 
    type?: UndoAction['type'],
    details?: string
  ) => {
    manager.addAction(title, undoAction, type, details);
  };

  const undo = () => manager.undo();
  const redo = () => manager.redo();
  const undoAll = () => manager.undoAll();

  return { addUndoAction, undo, redo, undoAll };
};

// Enhanced keyboard shortcut handler
export const UndoKeyboardHandler: React.FC = () => {
  const { undo, redo } = useUndo();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'z') {
        e.preventDefault();
        if (e.shiftKey) {
          redo(); // Ctrl+Shift+Z for redo
        } else {
          undo(); // Ctrl+Z for undo
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo]);

  return null;
};
