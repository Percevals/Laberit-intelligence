/**
 * Modern AI Service
 * Provider-agnostic service with robust error handling and monitoring
 */

import { OfflineProvider } from './providers/OfflineProvider';
import AI_CONFIG, { validateConfig, ENV } from './config';
import type { 
  AIProvider, 
  AIRequest, 
  AIResponse, 
  AIConfig, 
  AIServiceState,
  AIServiceEvent,
  ProviderStatus,
  AIError
} from './types';

export class AIService {
  private static instance: AIService | null = null;
  
  private providers: Map<string, AIProvider> = new Map();
  private currentProvider: string;
  private config: AIConfig;
  private state: AIServiceState;
  private eventListeners: ((event: AIServiceEvent) => void)[] = [];
  private requestQueue = 0;
  private isInitialized = false;

  private constructor() {
    this.config = AI_CONFIG;
    this.currentProvider = this.config.defaultProvider;
    
    this.state = {
      isInitialized: false,
      currentProvider: this.currentProvider,
      providers: {},
      requestQueue: 0,
      config: this.config
    };
    
    this.log('info', 'AI Service created');
  }

  // Singleton pattern
  public static getInstance(): AIService {
    if (!AIService.instance) {
      AIService.instance = new AIService();
    }
    return AIService.instance;
  }

  // Initialize the service
  public async initialize(): Promise<void> {
    if (this.isInitialized) {
      this.log('debug', 'AI Service already initialized');
      return;
    }

    this.log('info', 'Initializing AI Service');
    
    try {
      // Validate configuration
      const validation = validateConfig(this.config);
      if (!validation.isValid) {
        throw new Error(`Configuration validation failed: ${validation.errors.join(', ')}`);
      }

      // Initialize providers
      await this.initializeProviders();
      
      // Set up the primary provider
      await this.setProvider(this.currentProvider);
      
      this.isInitialized = true;
      this.state.isInitialized = true;
      
      this.log('info', 'AI Service initialized successfully');
      this.emitEvent('config-updated', { config: this.config });
      
    } catch (error) {
      this.log('error', 'Failed to initialize AI Service:', error);
      
      // Fallback to offline mode
      await this.fallbackToOffline();
      throw error;
    }
  }

  // Initialize all enabled providers
  private async initializeProviders(): Promise<void> {
    const enabledProviders = Object.entries(this.config.providers)
      .filter(([_, config]) => config.enabled)
      .sort(([_, a], [__, b]) => a.priority - b.priority);

    for (const [name, config] of enabledProviders) {
      try {
        let provider: AIProvider;
        
        switch (name) {
          case 'offline':
            provider = new OfflineProvider(config);
            break;
          default:
            this.log('warn', `Unknown provider type: ${name}`);
            continue;
        }
        
        await provider.initialize();
        this.providers.set(name, provider);
        this.state.providers[name] = provider.getStatus();
        
        this.log('info', `Provider '${name}' initialized successfully`);
        
      } catch (error) {
        this.log('error', `Failed to initialize provider '${name}':`, error);
        this.state.providers[name] = {
          isOnline: false,
          lastCheck: Date.now(),
          errorCount: 1,
          requestCount: 0
        };
      }
    }
  }

  // Set the active provider
  public async setProvider(providerName: string): Promise<void> {
    const provider = this.providers.get(providerName);
    
    if (!provider) {
      throw new Error(`Provider '${providerName}' not found`);
    }
    
    if (!provider.isAvailable()) {
      throw new Error(`Provider '${providerName}' is not available`);
    }
    
    this.currentProvider = providerName;
    this.state.currentProvider = providerName;
    
    this.log('info', `Switched to provider: ${providerName}`);
    this.emitEvent('provider-changed', { provider: providerName });
  }

  // Make an AI request
  public async request(request: Omit<AIRequest, 'id'>): Promise<AIResponse> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    // Generate request ID
    const requestId = this.generateRequestId();
    const fullRequest: AIRequest = { ...request, id: requestId };
    
    this.requestQueue++;
    this.state.requestQueue = this.requestQueue;
    
    this.log('debug', `Processing request ${requestId} of type ${request.type}`);
    
    try {
      const response = await this.executeRequest(fullRequest);
      
      this.emitEvent('request-completed', { request: fullRequest, response });
      return response;
      
    } catch (error) {
      const aiError = this.normalizeError(error);
      this.state.lastError = aiError;
      
      this.log('error', `Request ${requestId} failed:`, aiError);
      this.emitEvent('error-occurred', { request: fullRequest, error: aiError });
      
      // Try fallback if current provider failed
      if (this.currentProvider !== this.config.fallbackProvider) {
        this.log('info', `Attempting fallback to ${this.config.fallbackProvider}`);
        return this.executeWithFallback(fullRequest);
      }
      
      throw aiError;
    } finally {
      this.requestQueue--;
      this.state.requestQueue = this.requestQueue;
    }
  }

  // Execute request with current provider
  private async executeRequest(request: AIRequest): Promise<AIResponse> {
    const provider = this.providers.get(this.currentProvider);
    
    if (!provider) {
      throw new Error(`Current provider '${this.currentProvider}' not available`);
    }
    
    if (!provider.isAvailable()) {
      throw new Error(`Provider '${this.currentProvider}' is offline`);
    }
    
    // Check if provider supports the request type
    if (!provider.capabilities.supportedRequestTypes.includes(request.type)) {
      throw new Error(`Provider '${this.currentProvider}' doesn't support request type '${request.type}'`);
    }
    
    const response = await provider.complete(request);
    
    // Update provider status
    this.state.providers[this.currentProvider] = provider.getStatus();
    
    return response;
  }

  // Execute with fallback provider
  private async executeWithFallback(request: AIRequest): Promise<AIResponse> {
    try {
      await this.setProvider(this.config.fallbackProvider);
      return this.executeRequest(request);
    } catch (error) {
      this.log('error', 'Fallback provider also failed:', error);
      throw this.normalizeError(error);
    }
  }

  // Fallback to offline mode
  private async fallbackToOffline(): Promise<void> {
    this.log('warn', 'Falling back to offline mode');
    
    try {
      const offlineProvider = new OfflineProvider(this.config.providers.offline);
      await offlineProvider.initialize();
      
      this.providers.set('offline', offlineProvider);
      this.currentProvider = 'offline';
      this.state.currentProvider = 'offline';
      this.state.providers.offline = offlineProvider.getStatus();
      
      this.isInitialized = true;
      this.state.isInitialized = true;
      
    } catch (error) {
      this.log('error', 'Failed to initialize offline provider:', error);
      throw new Error('AI Service completely unavailable');
    }
  }

  // Public getters
  public isServiceAvailable(): boolean {
    return this.isInitialized && this.providers.size > 0;
  }

  public getCurrentProvider(): string {
    return this.currentProvider;
  }

  public getState(): AIServiceState {
    return { ...this.state };
  }

  public getProviderStatus(providerName?: string): ProviderStatus | Record<string, ProviderStatus> {
    if (providerName) {
      return this.state.providers[providerName] || {
        isOnline: false,
        lastCheck: 0,
        errorCount: 0,
        requestCount: 0
      };
    }
    return { ...this.state.providers };
  }

  // Event handling
  public addEventListener(listener: (event: AIServiceEvent) => void): void {
    this.eventListeners.push(listener);
  }

  public removeEventListener(listener: (event: AIServiceEvent) => void): void {
    const index = this.eventListeners.indexOf(listener);
    if (index > -1) {
      this.eventListeners.splice(index, 1);
    }
  }

  private emitEvent(type: AIServiceEvent['type'], data: any): void {
    const event: AIServiceEvent = {
      type,
      data,
      timestamp: Date.now()
    };
    
    this.eventListeners.forEach(listener => {
      try {
        listener(event);
      } catch (error) {
        this.log('error', 'Event listener error:', error);
      }
    });
  }

  // Configuration updates
  public updateConfig(updates: Partial<AIConfig>): void {
    this.config = { ...this.config, ...updates };
    this.state.config = this.config;
    
    this.log('info', 'Configuration updated');
    this.emitEvent('config-updated', { config: this.config });
  }

  // Utility methods
  private generateRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private normalizeError(error: any): AIError {
    if (error && typeof error === 'object' && 'code' in error) {
      return error as AIError;
    }

    return {
      code: 'SERVICE_ERROR',
      message: error.message || 'AI service error',
      details: error,
      retryable: true
    };
  }

  private log(level: 'debug' | 'info' | 'warn' | 'error', message: string, ...args: any[]): void {
    if (!this.config.monitoring.enabled) return;
    
    const logLevel = this.config.monitoring.logLevel;
    const levels = { debug: 0, info: 1, warn: 2, error: 3 };
    
    if (levels[level] >= levels[logLevel]) {
      const prefix = '[AIService]';
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
  }

  // Cleanup
  public async destroy(): Promise<void> {
    this.log('info', 'Destroying AI Service');
    
    // Destroy all providers
    for (const [name, provider] of this.providers) {
      try {
        await provider.destroy();
        this.log('debug', `Provider '${name}' destroyed`);
      } catch (error) {
        this.log('error', `Error destroying provider '${name}':`, error);
      }
    }
    
    this.providers.clear();
    this.eventListeners = [];
    this.isInitialized = false;
    
    AIService.instance = null;
  }
}

// Export convenience functions
export function getAIService(): AIService {
  return AIService.getInstance();
}

export async function initializeAI(): Promise<AIService> {
  const service = getAIService();
  await service.initialize();
  return service;
}

export default AIService;