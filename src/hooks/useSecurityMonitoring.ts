
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { logSecurityEvent, createRateLimiter } from '@/utils/security';

interface SecurityMetrics {
  failedLoginAttempts: number;
  suspiciousActivity: string[];
  lastSecurityCheck: Date | null;
}

export const useSecurityMonitoring = () => {
  const { user } = useAuth();
  const [metrics, setMetrics] = useState<SecurityMetrics>({
    failedLoginAttempts: 0,
    suspiciousActivity: [],
    lastSecurityCheck: null
  });

  // Rate limiters
  const loginRateLimiter = createRateLimiter(5, 15 * 60 * 1000); // 5 attempts per 15 minutes
  const uploadRateLimiter = createRateLimiter(10, 60 * 1000); // 10 uploads per minute

  const logFailedLogin = useCallback((email: string, reason: string) => {
    logSecurityEvent('failed_login', { email, reason });
    setMetrics(prev => ({
      ...prev,
      failedLoginAttempts: prev.failedLoginAttempts + 1,
      suspiciousActivity: [...prev.suspiciousActivity, `Failed login: ${reason}`]
    }));
  }, []);

  const logSuccessfulLogin = useCallback(() => {
    logSecurityEvent('successful_login', { userId: user?.id });
    setMetrics(prev => ({
      ...prev,
      failedLoginAttempts: 0 // Reset on successful login
    }));
  }, [user?.id]);

  const logSuspiciousActivity = useCallback((activity: string, details: Record<string, any> = {}) => {
    logSecurityEvent('suspicious_activity', { activity, ...details });
    setMetrics(prev => ({
      ...prev,
      suspiciousActivity: [...prev.suspiciousActivity, activity]
    }));
  }, []);

  const checkLoginRateLimit = useCallback((identifier: string): boolean => {
    const allowed = loginRateLimiter(identifier);
    if (!allowed) {
      logSecurityEvent('rate_limit_exceeded', { type: 'login', identifier });
    }
    return allowed;
  }, [loginRateLimiter]);

  const checkUploadRateLimit = useCallback((identifier: string): boolean => {
    const allowed = uploadRateLimiter(identifier);
    if (!allowed) {
      logSecurityEvent('rate_limit_exceeded', { type: 'upload', identifier });
    }
    return allowed;
  }, [uploadRateLimiter]);

  const performSecurityCheck = useCallback(() => {
    // Check for suspicious patterns
    const checks = [
      {
        name: 'Multiple failed logins',
        condition: metrics.failedLoginAttempts > 3,
        action: () => logSuspiciousActivity('Multiple failed login attempts detected')
      },
      {
        name: 'Insecure connection',
        condition: !window.isSecureContext,
        action: () => logSuspiciousActivity('Application running in insecure context')
      },
      {
        name: 'Suspicious user agent',
        condition: /bot|crawler|spider/i.test(navigator.userAgent),
        action: () => logSuspiciousActivity('Suspicious user agent detected')
      }
    ];

    checks.forEach(check => {
      if (check.condition) {
        check.action();
      }
    });

    setMetrics(prev => ({
      ...prev,
      lastSecurityCheck: new Date()
    }));
  }, [metrics.failedLoginAttempts, logSuspiciousActivity]);

  // Perform security check on mount and periodically
  useEffect(() => {
    performSecurityCheck();
    const interval = setInterval(performSecurityCheck, 5 * 60 * 1000); // Every 5 minutes
    return () => clearInterval(interval);
  }, [performSecurityCheck]);

  // Monitor for suspicious DOM manipulation
  useEffect(() => {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              const element = node as Element;
              if (element.tagName === 'SCRIPT' || element.tagName === 'IFRAME') {
                logSuspiciousActivity('Suspicious DOM manipulation detected', {
                  tagName: element.tagName,
                  attributes: Array.from(element.attributes).map(attr => ({
                    name: attr.name,
                    value: attr.value
                  }))
                });
              }
            }
          });
        }
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    return () => observer.disconnect();
  }, [logSuspiciousActivity]);

  return {
    metrics,
    logFailedLogin,
    logSuccessfulLogin,
    logSuspiciousActivity,
    checkLoginRateLimit,
    checkUploadRateLimit,
    performSecurityCheck
  };
};
