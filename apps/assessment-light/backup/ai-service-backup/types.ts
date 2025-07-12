/**
 * AI Service Type Definitions
 * Modern, type-safe interfaces for AI providers
 */

import type { DIIDimensions } from '@dii/types';

// Core AI Request/Response Types
export interface AIRequest {
  id: string;
  type: 'compromise-analysis' | 'executive-insights' | 'threat-context' | 'scenario-simulation';
  data: AssessmentData;
  options?: AIRequestOptions;
}

export interface AIResponse<T = any> {
  id: string;
  success: boolean;
  data?: T;
  error?: AIError;
  metadata: {
    provider: string;
    timestamp: number;
    processingTime: number;
    version: string;
  };
}

export interface AIError {
  code: string;
  message: string;
  details?: any;
  retryable: boolean;
}

export interface AIRequestOptions {
  timeout?: number;
  retries?: number;
  priority?: 'low' | 'normal' | 'high';
  cache?: boolean;
}

// Assessment Data Types
export interface AssessmentData {
  businessModel: number;
  dimensions: DIIDimensions;
  diiScore: number;
  context?: {
    region?: string;
    industry?: string;
    employeeCount?: number;
  };
}

// Provider Interface
export interface AIProvider {
  readonly name: string;
  readonly version: string;
  readonly capabilities: ProviderCapabilities;
  
  initialize(): Promise<void>;
  isAvailable(): boolean;
  getStatus(): ProviderStatus;
  
  // Core AI operations
  complete(request: AIRequest): Promise<AIResponse>;
  
  // Lifecycle management
  destroy(): Promise<void>;
}

export interface ProviderCapabilities {
  supportedRequestTypes: AIRequest['type'][];
  maxConcurrentRequests: number;
  supportsStreaming: boolean;
  supportsCache: boolean;
  rateLimits: {
    requestsPerMinute: number;
    requestsPerHour: number;
  };
}

export interface ProviderStatus {
  isOnline: boolean;
  lastCheck: number;
  responseTime?: number;
  errorCount: number;
  requestCount: number;
}

// Configuration Types
export interface AIConfig {
  defaultProvider: string;
  fallbackProvider: string;
  providers: Record<string, ProviderConfig>;
  features: FeatureFlags;
  monitoring: MonitoringConfig;
}

export interface ProviderConfig {
  enabled: boolean;
  apiKey?: string;
  baseUrl?: string;
  timeout: number;
  retries: number;
  priority: number;
  options?: Record<string, any>;
}

export interface FeatureFlags {
  compromiseAnalysis: boolean;
  executiveInsights: boolean;
  threatContext: boolean;
  scenarioSimulation: boolean;
  realTimeUpdates: boolean;
}

export interface MonitoringConfig {
  enabled: boolean;
  logLevel: 'debug' | 'info' | 'warn' | 'error';
  metricsEnabled: boolean;
  errorReporting: boolean;
}

// Specific AI Response Types
export interface CompromiseAnalysisResponse {
  riskScore: number;
  confidence: number;
  factors: RiskFactor[];
  recommendations: string[];
  timeline: {
    immediate: string[];
    shortTerm: string[];
    longTerm: string[];
  };
}

export interface RiskFactor {
  category: string;
  impact: 'low' | 'medium' | 'high' | 'critical';
  probability: number;
  description: string;
}

export interface ExecutiveInsightsResponse {
  summary: string;
  keyMetrics: ExecutiveMetric[];
  recommendations: ExecutiveRecommendation[];
  competitiveAnalysis?: {
    industryAverage: number;
    ranking: string;
    gap: number;
  };
}

export interface ExecutiveMetric {
  name: string;
  value: number | string;
  unit?: string;
  trend?: 'up' | 'down' | 'stable';
  significance: 'low' | 'medium' | 'high';
}

export interface ExecutiveRecommendation {
  priority: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  impact: string;
  effort: 'low' | 'medium' | 'high';
  timeline: string;
  roi?: number;
}

// Service State Types
export interface AIServiceState {
  isInitialized: boolean;
  currentProvider: string;
  providers: Record<string, ProviderStatus>;
  requestQueue: number;
  lastError?: AIError;
  config: AIConfig;
}

// Events
export interface AIServiceEvent {
  type: 'provider-changed' | 'request-completed' | 'error-occurred' | 'config-updated';
  data: any;
  timestamp: number;
}

// Hooks Return Types
export interface UseAIResult {
  isLoading: boolean;
  isAvailable: boolean;
  provider: string;
  error?: AIError;
  request: (request: Omit<AIRequest, 'id'>) => Promise<AIResponse>;
}

export interface UseCompromiseAnalysisResult {
  analysis?: CompromiseAnalysisResponse;
  isAnalyzing: boolean;
  error?: AIError;
  refresh: () => void;
}

export interface UseExecutiveInsightsResult {
  insights?: ExecutiveInsightsResponse;
  isLoading: boolean;
  error?: AIError;
  refresh: () => void;
}