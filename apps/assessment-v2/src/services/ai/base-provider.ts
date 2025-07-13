/**
 * Base AI Provider
 * Abstract class for all AI provider implementations
 */

import type { 
  AIProvider, 
  AIProviderConfig, 
  CompanyInfo,
  AIProviderResponse 
} from './types';

export abstract class BaseAIProvider implements AIProvider {
  protected config: AIProviderConfig;
  protected rateLimitState: {
    requests: number;
    windowStart: number;
  };

  constructor(config: AIProviderConfig) {
    this.config = config;
    this.rateLimitState = {
      requests: 0,
      windowStart: Date.now()
    };
  }

  get id(): string {
    return this.config.id;
  }

  get name(): string {
    return this.config.name;
  }

  abstract searchCompany(query: string): Promise<CompanyInfo[]>;
  abstract enhanceCompanyData(partial: Partial<CompanyInfo>): Promise<CompanyInfo>;

  async isAvailable(): Promise<boolean> {
    try {
      // Simple health check - override for specific providers
      const rateLimit = await this.checkRateLimit();
      return rateLimit.available;
    } catch {
      return false;
    }
  }

  async checkRateLimit(): Promise<{ available: boolean; resetIn?: number }> {
    if (!this.config.rateLimit) {
      return { available: true };
    }

    const now = Date.now();
    const windowAge = now - this.rateLimitState.windowStart;
    
    // Reset window if expired
    if (windowAge > this.config.rateLimit.window * 1000) {
      this.rateLimitState = {
        requests: 0,
        windowStart: now
      };
    }

    const available = this.rateLimitState.requests < this.config.rateLimit.requests;
    
    if (available) {
      return { available };
    } else {
      const resetIn = Math.ceil((this.config.rateLimit.window * 1000 - windowAge) / 1000);
      return { available, resetIn };
    }
  }

  estimateCost(operation: 'search' | 'enhance'): number {
    // Override in specific providers
    // Default rough estimates
    const costs = {
      search: 0.002, // $0.002 per search
      enhance: 0.001 // $0.001 per enhancement
    };
    return costs[operation] || 0;
  }

  configure(config: AIProviderConfig): void {
    this.config = { ...this.config, ...config };
  }

  // Helper methods for implementations
  protected async makeRequest<T>(
    operation: () => Promise<T>
  ): Promise<AIProviderResponse<T>> {
    try {
      // Check rate limit
      const rateLimit = await this.checkRateLimit();
      if (!rateLimit.available) {
        return {
          success: false,
          error: {
            code: 'RATE_LIMITED',
            message: `Rate limit exceeded. Reset in ${rateLimit.resetIn}s`,
            retryable: true
          }
        };
      }

      // Increment request count
      this.rateLimitState.requests++;

      // Execute with timeout
      const result = await this.withTimeout(operation());
      
      return {
        success: true,
        data: result
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  protected async withTimeout<T>(promise: Promise<T>): Promise<T> {
    const timeout = this.config.timeout || 30000; // 30s default
    
    return Promise.race([
      promise,
      new Promise<T>((_, reject) => 
        setTimeout(() => reject(new Error('Request timeout')), timeout)
      )
    ]);
  }

  protected handleError(error: any): AIProviderResponse<any> {
    // Common error handling
    if (error.message === 'Request timeout') {
      return {
        success: false,
        error: {
          code: 'TIMEOUT',
          message: 'Request timed out',
          retryable: true
        }
      };
    }

    // Provider-specific error handling in implementations
    return {
      success: false,
      error: {
        code: 'UNKNOWN',
        message: error.message || 'Unknown error',
        retryable: false
      }
    };
  }

  // Company data validation
  protected validateCompanyInfo(info: Partial<CompanyInfo>): CompanyInfo {
    // Ensure required fields
    if (!info.name) {
      throw new Error('Company name is required');
    }

    // Clean and validate data
    const validated: CompanyInfo = {
      name: info.name.trim(),
      dataSource: 'ai',
      confidence: info.confidence || 0.8,
      lastUpdated: new Date()
    };

    // Add optional fields if they exist
    if (info.employees && info.employees > 0) validated.employees = info.employees;
    if (info.revenue && info.revenue > 0) validated.revenue = info.revenue;
    if (info.headquarters?.trim()) validated.headquarters = info.headquarters.trim();
    if (info.country?.trim()) validated.country = info.country.trim();
    if (info.industry?.trim()) validated.industry = info.industry.trim();
    if (info.description?.trim()) validated.description = info.description.trim();
    
    const website = this.normalizeWebsite(info.website);
    if (website) validated.website = website;

    // Spread remaining properties
    return { ...info, ...validated };
  }

  private normalizeWebsite(url?: string): string | undefined {
    if (!url) return undefined;
    
    url = url.trim().toLowerCase();
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url;
    }
    
    try {
      const parsed = new URL(url);
      return parsed.href;
    } catch {
      return undefined;
    }
  }
}