
// Haptic feedback utility for mobile interactions
export type HapticPattern = 'light' | 'medium' | 'heavy' | 'success' | 'error' | 'warning' | 'selection';

export class HapticFeedback {
  private static isSupported = typeof navigator !== 'undefined' && 'vibrate' in navigator;
  private static isEnabled = true;

  private static patterns: Record<HapticPattern, number | number[]> = {
    light: 10,
    medium: 20,
    heavy: 50,
    success: 50,
    error: [50, 100, 50],
    warning: [30, 30, 30],
    selection: 20,
  };

  static init() {
    // Load user preference from localStorage
    const savedPreference = localStorage.getItem('haptic-enabled');
    if (savedPreference !== null) {
      this.isEnabled = savedPreference === 'true';
    }
  }

  static setEnabled(enabled: boolean) {
    this.isEnabled = enabled;
    localStorage.setItem('haptic-enabled', enabled.toString());
  }

  static getEnabled(): boolean {
    return this.isEnabled;
  }

  static trigger(pattern: HapticPattern) {
    if (!this.isSupported || !this.isEnabled) {
      return;
    }

    try {
      const vibrationPattern = this.patterns[pattern];
      navigator.vibrate(vibrationPattern);
    } catch (error) {
      // Fail silently if vibration API fails
      console.debug('Haptic feedback failed:', error);
    }
  }

  static isDeviceSupported(): boolean {
    return this.isSupported;
  }
}

// Initialize on module load
HapticFeedback.init();

// React hook for haptic feedback
import { useCallback } from 'react';

export const useHapticFeedback = () => {
  const trigger = useCallback((pattern: HapticPattern) => {
    HapticFeedback.trigger(pattern);
  }, []);

  return {
    trigger,
    isSupported: HapticFeedback.isDeviceSupported(),
    isEnabled: HapticFeedback.getEnabled(),
    setEnabled: HapticFeedback.setEnabled,
  };
};
