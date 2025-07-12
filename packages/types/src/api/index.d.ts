/**
 * API type definitions
 * @module @dii/types/api
 */

/**
 * API response wrapper
 */
export interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: APIError;
  metadata?: ResponseMetadata;
}

/**
 * API error structure
 */
export interface APIError {
  code: string;
  message: string;
  details?: any;
  timestamp?: Date;
}

/**
 * Response metadata
 */
export interface ResponseMetadata {
  timestamp: Date;
  version: string;
  requestId?: string;
  processingTime?: number;
}

/**
 * AI feature configuration
 */
export interface AIFeatureConfig {
  enabled: boolean;
  provider?: 'claude' | 'openai' | 'offline';
  maxTokens?: number;
  temperature?: number;
}

/**
 * User tier configuration
 */
export interface UserTier {
  tier: 'light' | 'premium';
  features: FeatureFlags;
  limits: UsageLimits;
}

/**
 * Feature flags
 */
export interface FeatureFlags {
  compromiseScore: {
    basic: boolean;
    advanced: boolean;
    forensics?: boolean;
  };
  oracle: {
    enabled: boolean;
    maxInteractions: number;
    memory?: boolean;
  };
  insights: {
    executive: boolean;
    financial: boolean;
    threatActors?: boolean;
  };
  export: {
    pdf: boolean;
    image: boolean;
    api?: boolean;
  };
}

/**
 * Usage limits
 */
export interface UsageLimits {
  daily: number;
  monthly?: number;
  requiresEmail: boolean;
  rateLimit?: {
    requests: number;
    window: number; // in seconds
  };
}