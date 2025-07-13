/**
 * AI Provider Types
 * Provider-agnostic interfaces for company intelligence
 */

export interface CompanyInfo {
  // Basic Information
  name: string;
  legalName?: string;
  
  // Size & Scale
  employees?: number;
  employeeRange?: string; // e.g., "1000-5000"
  revenue?: number; // Annual revenue in USD
  revenueRange?: string; // e.g., "$10M-$50M"
  
  // Location
  headquarters?: string;
  country?: string;
  region?: string; // e.g., "LATAM", "Europe"
  operatingCountries?: string[];
  
  // Business Context
  industry?: string;
  description?: string;
  website?: string;
  yearFounded?: number;
  
  // Technology & Infrastructure
  techStack?: string[];
  cloudProviders?: string[];
  criticalSystems?: string[];
  
  // Additional Context
  publicCompany?: boolean;
  stockSymbol?: string;
  recentNews?: string[];
  certifications?: string[]; // ISO, SOC2, etc.
  
  // Metadata
  dataSource: 'ai' | 'manual' | 'mixed';
  confidence?: number; // 0-1 confidence score
  lastUpdated?: Date;
}

export interface CompanySearchResult {
  companies: CompanyInfo[];
  query: string;
  provider: string;
  searchTime: number; // milliseconds
}

export interface AIProviderConfig {
  id: string;
  name: string;
  apiKey?: string;
  endpoint?: string;
  model?: string;
  maxTokens?: number;
  temperature?: number;
  timeout?: number; // milliseconds
  rateLimit?: {
    requests: number;
    window: number; // seconds
  };
}

export interface AIProvider {
  id: string;
  name: string;
  
  // Core functionality
  searchCompany(query: string): Promise<CompanyInfo[]>;
  enhanceCompanyData(partial: Partial<CompanyInfo>): Promise<CompanyInfo>;
  suggestBusinessModel?(company: CompanyInfo): Promise<{
    model: string;
    confidence: number;
    reasoning: string;
  }>;
  
  // Health & availability
  isAvailable(): Promise<boolean>;
  checkRateLimit(): Promise<{ available: boolean; resetIn?: number }>;
  estimateCost(operation: 'search' | 'enhance' | 'suggest'): number;
  
  // Configuration
  configure(config: AIProviderConfig): void;
}

export interface AIProviderResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    retryable: boolean;
  };
  usage?: {
    tokensUsed: number;
    cost: number;
  };
}

export type ProviderPriority = 'primary' | 'secondary' | 'fallback';

export interface ProviderRegistry {
  providers: Map<string, AIProvider>;
  priority: Map<ProviderPriority, string[]>;
}