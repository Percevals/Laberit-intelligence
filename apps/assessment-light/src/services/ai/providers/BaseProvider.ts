/**
 * Base AI Provider
 * Abstract base class with common functionality
 */

import type { 
  AIProvider, 
  AIRequest, 
  AIResponse, 
  ProviderCapabilities, 
  ProviderStatus,
  ProviderConfig,
  AIError
} from '../types';

export abstract class BaseProvider implements AIProvider {
  public readonly name: string;
  public readonly version: string;
  public readonly capabilities: ProviderCapabilities;
  
  protected config: ProviderConfig;
  protected status: ProviderStatus;
  protected requestCount = 0;
  protected errorCount = 0;

  constructor(name: string, version: string, config: ProviderConfig, capabilities: ProviderCapabilities) {
    this.name = name;
    this.version = version;
    this.config = config;
    this.capabilities = capabilities;
    
    this.status = {
      isOnline: false,
      lastCheck: 0,
      errorCount: 0,
      requestCount: 0
    };
  }

  // Abstract methods that must be implemented by providers
  abstract initialize(): Promise<void>;
  abstract complete(request: AIRequest): Promise<AIResponse>;
  abstract destroy(): Promise<void>;

  // Common functionality
  public isAvailable(): boolean {
    return this.config.enabled && this.status.isOnline;
  }

  public getStatus(): ProviderStatus {
    return { ...this.status };
  }

  // Request wrapper with common error handling, timing, and logging
  protected async executeRequest<T>(
    requestId: string,
    operation: () => Promise<T>
  ): Promise<AIResponse<T>> {
    const startTime = Date.now();
    this.requestCount++;
    this.status.requestCount++;

    try {
      const data = await this.withTimeout(operation(), this.config.timeout);
      const processingTime = Date.now() - startTime;
      
      this.status.responseTime = processingTime;
      this.log('debug', `Request ${requestId} completed in ${processingTime}ms`);

      return {
        id: requestId,
        success: true,
        data,
        metadata: {
          provider: this.name,
          timestamp: Date.now(),
          processingTime,
          version: this.version
        }
      };
    } catch (error) {
      this.errorCount++;
      this.status.errorCount++;
      
      const aiError = this.normalizeError(error);
      this.log('error', `Request ${requestId} failed:`, aiError);

      return {
        id: requestId,
        success: false,
        error: aiError,
        metadata: {
          provider: this.name,
          timestamp: Date.now(),
          processingTime: Date.now() - startTime,
          version: this.version
        }
      };
    }
  }

  // Timeout wrapper
  protected async withTimeout<T>(promise: Promise<T>, timeoutMs: number): Promise<T> {
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        reject(new Error(`Request timeout after ${timeoutMs}ms`));
      }, timeoutMs);

      promise
        .then(resolve)
        .catch(reject)
        .finally(() => clearTimeout(timer));
    });
  }

  // Error normalization
  protected normalizeError(error: any): AIError {
    if (error && typeof error === 'object' && 'code' in error) {
      return error as AIError;
    }

    // Network errors
    if (error instanceof TypeError && error.message.includes('fetch')) {
      return {
        code: 'NETWORK_ERROR',
        message: 'Network connection failed',
        details: error.message,
        retryable: true
      };
    }

    // Timeout errors
    if (error.message?.includes('timeout')) {
      return {
        code: 'TIMEOUT_ERROR',
        message: 'Request timed out',
        details: error.message,
        retryable: true
      };
    }

    // Rate limit errors
    if (error.status === 429 || error.message?.includes('rate limit')) {
      return {
        code: 'RATE_LIMIT_ERROR',
        message: 'Rate limit exceeded',
        details: error.message,
        retryable: true
      };
    }

    // API errors
    if (error.status >= 400 && error.status < 500) {
      return {
        code: 'API_ERROR',
        message: error.message || 'API request failed',
        details: { status: error.status, response: error.response },
        retryable: false
      };
    }

    // Server errors
    if (error.status >= 500) {
      return {
        code: 'SERVER_ERROR',
        message: 'Server error occurred',
        details: { status: error.status, response: error.response },
        retryable: true
      };
    }

    // Generic errors
    return {
      code: 'UNKNOWN_ERROR',
      message: error.message || 'An unknown error occurred',
      details: error,
      retryable: false
    };
  }

  // Health check
  protected async performHealthCheck(): Promise<boolean> {
    try {
      await this.healthCheck();
      this.status.isOnline = true;
      this.status.lastCheck = Date.now();
      return true;
    } catch (error) {
      this.status.isOnline = false;
      this.status.lastCheck = Date.now();
      this.log('warn', 'Health check failed:', error);
      return false;
    }
  }

  // Abstract health check method
  protected abstract healthCheck(): Promise<void>;

  // Logging with provider context
  protected log(level: 'debug' | 'info' | 'warn' | 'error', message: string, ...args: any[]): void {
    const prefix = `[AI:${this.name}]`;
    
    switch (level) {
      case 'debug':
        console.debug(prefix, message, ...args);
        break;
      case 'info':
        console.info(prefix, message, ...args);
        break;
      case 'warn':
        console.warn(prefix, message, ...args);
        break;
      case 'error':
        console.error(prefix, message, ...args);
        break;
    }
  }

  // Configuration updates
  protected updateConfig(updates: Partial<ProviderConfig>): void {
    this.config = { ...this.config, ...updates };
    this.log('info', 'Configuration updated:', updates);
  }

  // Metrics
  public getMetrics() {
    return {
      name: this.name,
      requestCount: this.requestCount,
      errorCount: this.errorCount,
      errorRate: this.requestCount > 0 ? this.errorCount / this.requestCount : 0,
      status: this.status,
      capabilities: this.capabilities
    };
  }
}