
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Undo } from 'lucide-react';

interface UndoAction {
  id: string;
  title: string;
  action: () => void;
  timestamp: Date;
}

class UndoManager {
  private static instance: UndoManager;
  private actions: UndoAction[] = [];
  private maxActions = 20;

  public static getInstance(): UndoManager {
    if (!UndoManager.instance) {
      UndoManager.instance = new UndoManager();
    }
    return UndoManager.instance;
  }

  public addAction(title: string, undoAction: () => void): void {
    const action: UndoAction = {
      id: Date.now().toString(),
      title,
      action: undoAction,
      timestamp: new Date(),
    };

    this.actions.unshift(action);
    if (this.actions.length > this.maxActions) {
      this.actions = this.actions.slice(0, this.maxActions);
    }

    // Show toast with undo option
    toast(title, {
      action: {
        label: 'Undo',
        onClick: () => {
          undoAction();
          this.removeAction(action.id);
        },
      },
      duration: 5000,
    });
  }

  public undo(): void {
    const lastAction = this.actions[0];
    if (lastAction) {
      lastAction.action();
      this.removeAction(lastAction.id);
    }
  }

  private removeAction(id: string): void {
    this.actions = this.actions.filter(action => action.id !== id);
  }

  public getActions(): UndoAction[] {
    return [...this.actions];
  }

  public clear(): void {
    this.actions = [];
  }
}

export const useUndo = () => {
  const manager = UndoManager.getInstance();
  
  const addUndoAction = (title: string, undoAction: () => void) => {
    manager.addAction(title, undoAction);
  };

  const undo = () => {
    manager.undo();
  };

  return { addUndoAction, undo };
};

// Keyboard shortcut handler
export const UndoKeyboardHandler: React.FC = () => {
  const { undo } = useUndo();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        undo();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [undo]);

  return null;
};
