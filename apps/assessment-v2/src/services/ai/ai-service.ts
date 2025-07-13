/**
 * AI Service Manager
 * Orchestrates multiple AI providers with fallback support
 */

import type { 
  AIProvider, 
  CompanyInfo, 
  CompanySearchResult,
  ProviderPriority 
} from './types';
import { MockProvider } from './providers/mock-provider';
import { OpenAIProvider } from './providers/openai-provider';

export interface AIServiceConfig {
  providers?: {
    openai?: { apiKey: string; model?: string };
    gemini?: { apiKey: string };
    mistral?: { apiKey: string };
    anthropic?: { apiKey: string };
  };
  useMockInDev?: boolean;
  cache?: {
    enabled: boolean;
    ttl: number; // seconds
  };
}

export class AIService {
  private providers: Map<string, AIProvider> = new Map();
  private priority: Map<ProviderPriority, string[]> = new Map([
    ['primary', []],
    ['secondary', []],
    ['fallback', ['mock']]
  ]);
  private cache: Map<string, { data: CompanyInfo[]; expires: number }> = new Map();
  private config: AIServiceConfig;

  constructor(config: AIServiceConfig = {}) {
    this.config = {
      useMockInDev: true,
      cache: { enabled: true, ttl: 3600 }, // 1 hour default
      ...config
    };

    this.initializeProviders();
  }

  private initializeProviders(): void {
    // Always add mock provider
    this.providers.set('mock', new MockProvider());

    // Add configured providers
    if (this.config.providers?.openai?.apiKey) {
      const openai = new OpenAIProvider({
        apiKey: this.config.providers.openai.apiKey,
        ...(this.config.providers.openai.model && { model: this.config.providers.openai.model })
      });
      this.providers.set('openai', openai);
      this.priority.get('primary')!.push('openai');
    }

    // Add other providers as they're implemented
    // if (this.config.providers?.gemini?.apiKey) {
    //   const gemini = new GeminiProvider({ apiKey: this.config.providers.gemini.apiKey });
    //   this.providers.set('gemini', gemini);
    //   this.priority.get('secondary')!.push('gemini');
    // }

    // Use mock in development if no providers configured
    if (this.config.useMockInDev && import.meta.env.DEV) {
      if (this.priority.get('primary')!.length === 0) {
        this.priority.get('primary')!.push('mock');
      }
    }
  }

  async searchCompany(query: string): Promise<CompanySearchResult> {
    const startTime = Date.now();
    
    // Check cache
    if (this.config.cache?.enabled) {
      const cached = this.getFromCache(query);
      if (cached) {
        return {
          companies: cached,
          query,
          provider: 'cache',
          searchTime: Date.now() - startTime
        };
      }
    }

    // Try providers in priority order
    const errors: Record<string, string> = {};
    
    for (const priority of ['primary', 'secondary', 'fallback'] as ProviderPriority[]) {
      const providerIds = this.priority.get(priority) || [];
      
      for (const providerId of providerIds) {
        const provider = this.providers.get(providerId);
        if (!provider) continue;

        try {
          // Check availability
          const available = await provider.isAvailable();
          if (!available) {
            errors[providerId] = 'Provider not available';
            continue;
          }

          // Perform search
          console.log(`Searching with ${provider.name}...`);
          const companies = await provider.searchCompany(query);
          
          if (companies.length > 0) {
            // Cache successful results
            if (this.config.cache?.enabled) {
              this.addToCache(query, companies);
            }

            return {
              companies,
              query,
              provider: provider.name,
              searchTime: Date.now() - startTime
            };
          }
        } catch (error) {
          errors[providerId] = error instanceof Error ? error.message : 'Unknown error';
          console.error(`Provider ${providerId} failed:`, error);
        }
      }
    }

    // All providers failed
    console.error('All providers failed:', errors);
    return {
      companies: [],
      query,
      provider: 'none',
      searchTime: Date.now() - startTime
    };
  }

  async enhanceCompanyData(partial: Partial<CompanyInfo>): Promise<CompanyInfo> {
    // Similar logic to searchCompany but for enhancement
    for (const priority of ['primary', 'secondary', 'fallback'] as ProviderPriority[]) {
      const providerIds = this.priority.get(priority) || [];
      
      for (const providerId of providerIds) {
        const provider = this.providers.get(providerId);
        if (!provider) continue;

        try {
          const available = await provider.isAvailable();
          if (!available) continue;

          return await provider.enhanceCompanyData(partial);
        } catch (error) {
          console.error(`Provider ${providerId} enhancement failed:`, error);
        }
      }
    }

    // Return original if all fail
    return partial as CompanyInfo;
  }

  // Provider management
  addProvider(provider: AIProvider, priority: ProviderPriority = 'secondary'): void {
    this.providers.set(provider.id, provider);
    const priorityList = this.priority.get(priority) || [];
    if (!priorityList.includes(provider.id)) {
      priorityList.push(provider.id);
    }
  }

  removeProvider(providerId: string): void {
    this.providers.delete(providerId);
    for (const priorityList of this.priority.values()) {
      const index = priorityList.indexOf(providerId);
      if (index > -1) {
        priorityList.splice(index, 1);
      }
    }
  }

  // Cache management
  private getFromCache(query: string): CompanyInfo[] | null {
    const cached = this.cache.get(query.toLowerCase());
    if (!cached) return null;
    
    if (Date.now() > cached.expires) {
      this.cache.delete(query.toLowerCase());
      return null;
    }
    
    return cached.data;
  }

  private addToCache(query: string, companies: CompanyInfo[]): void {
    const expires = Date.now() + (this.config.cache!.ttl * 1000);
    this.cache.set(query.toLowerCase(), { data: companies, expires });
  }

  clearCache(): void {
    this.cache.clear();
  }

  // Cost estimation
  async estimateCost(operation: 'search' | 'enhance'): Promise<Record<string, number>> {
    const costs: Record<string, number> = {};
    
    for (const [id, provider] of this.providers) {
      costs[id] = provider.estimateCost(operation);
    }
    
    return costs;
  }

  // Health check
  async checkHealth(): Promise<Record<string, boolean>> {
    const health: Record<string, boolean> = {};
    
    for (const [id, provider] of this.providers) {
      health[id] = await provider.isAvailable();
    }
    
    return health;
  }
}