
type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  context?: Record<string, any>;
}

class SecureLogger {
  private isDevelopment = import.meta.env.DEV;
  private sensitiveKeys = [
    'password', 'token', 'secret', 'key', 'auth', 'credential',
    'session', 'cookie', 'authorization', 'bearer', 'api_key',
    'access_token', 'refresh_token', 'private_key', 'passphrase'
  ];

  private sanitizeData(data: any): any {
    if (typeof data === 'string') {
      // Don't log entire auth tokens or long strings that might be sensitive
      if (data.length > 100 || this.containsSensitiveInfo(data)) {
        return '[REDACTED]';
      }
      return data;
    }

    if (Array.isArray(data)) {
      return data.map(item => this.sanitizeData(item));
    }

    if (data && typeof data === 'object') {
      const sanitized: Record<string, any> = {};
      for (const [key, value] of Object.entries(data)) {
        if (this.isSensitiveKey(key)) {
          sanitized[key] = '[REDACTED]';
        } else {
          sanitized[key] = this.sanitizeData(value);
        }
      }
      return sanitized;
    }

    return data;
  }

  private isSensitiveKey(key: string): boolean {
    const lowerKey = key.toLowerCase();
    return this.sensitiveKeys.some(sensitive => lowerKey.includes(sensitive));
  }

  private containsSensitiveInfo(str: string): boolean {
    const lowerStr = str.toLowerCase();
    return this.sensitiveKeys.some(sensitive => lowerStr.includes(sensitive)) ||
           /eyJ[A-Za-z0-9-_]+/.test(str) || // JWT pattern
           /sk_[a-zA-Z0-9_]+/.test(str) ||  // Stripe secret key pattern
           /pk_[a-zA-Z0-9_]+/.test(str);    // Stripe public key pattern
  }

  private createLogEntry(level: LogLevel, message: string, context?: Record<string, any>): LogEntry {
    return {
      level,
      message,
      timestamp: new Date().toISOString(),
      context: context ? this.sanitizeData(context) : undefined
    };
  }

  private writeLog(entry: LogEntry): void {
    if (!this.isDevelopment && entry.level === 'debug') {
      return; // Skip debug logs in production
    }

    const logMessage = entry.context 
      ? `[${entry.level.toUpperCase()}] ${entry.message}` 
      : `[${entry.level.toUpperCase()}] ${entry.message}`;

    switch (entry.level) {
      case 'debug':
        console.debug(logMessage, entry.context || '');
        break;
      case 'info':
        console.info(logMessage, entry.context || '');
        break;
      case 'warn':
        console.warn(logMessage, entry.context || '');
        break;
      case 'error':
        console.error(logMessage, entry.context || '');
        break;
    }
  }

  debug(message: string, context?: Record<string, any>): void {
    this.writeLog(this.createLogEntry('debug', message, context));
  }

  info(message: string, context?: Record<string, any>): void {
    this.writeLog(this.createLogEntry('info', message, context));
  }

  warn(message: string, context?: Record<string, any>): void {
    this.writeLog(this.createLogEntry('warn', message, context));
  }

  error(message: string, context?: Record<string, any>): void {
    this.writeLog(this.createLogEntry('error', message, context));
  }

  // Security-specific logging methods
  security(event: string, details?: Record<string, any>): void {
    this.warn(`SECURITY: ${event}`, details);
  }

  audit(action: string, details?: Record<string, any>): void {
    this.info(`AUDIT: ${action}`, details);
  }
}

export const logger = new SecureLogger();

// Backward compatibility - gradually replace console.log with logger
export const secureLog = {
  debug: (message: string, ...args: any[]) => logger.debug(message, { args }),
  info: (message: string, ...args: any[]) => logger.info(message, { args }),
  warn: (message: string, ...args: any[]) => logger.warn(message, { args }),
  error: (message: string, ...args: any[]) => logger.error(message, { args })
};
