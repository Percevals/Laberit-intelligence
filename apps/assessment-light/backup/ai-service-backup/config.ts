/**
 * AI Service Configuration
 * Centralized, validated configuration with environment detection
 */

import type { AIConfig, ProviderConfig } from './types';

// Environment detection
const isClaudeArtifact = () => {
  try {
    return typeof window !== 'undefined' && 
           (window.location.hostname.includes('claude.ai') || 
            window.location.hostname.includes('anthropic.com') ||
            window.navigator.userAgent.includes('Claude'));
  } catch {
    return false;
  }
};

const isDevelopment = () => {
  try {
    return typeof window !== 'undefined' && 
           (window.location.hostname === 'localhost' || 
            window.location.hostname === '127.0.0.1' ||
            window.location.port !== '');
  } catch {
    return false;
  }
};

const isProduction = () => {
  try {
    return typeof window !== 'undefined' && 
           window.location.hostname.includes('github.io');
  } catch {
    return false;
  }
};

// Default provider configurations
const createProviderConfig = (overrides: Partial<ProviderConfig> = {}): ProviderConfig => ({
  enabled: true,
  timeout: 30000,
  retries: 2,
  priority: 1,
  ...overrides
});

// Provider-specific configurations
const PROVIDER_CONFIGS: Record<string, ProviderConfig> = {
  claude: createProviderConfig({
    enabled: isClaudeArtifact(),
    baseUrl: 'https://api.anthropic.com/v1',
    timeout: 45000,
    priority: 1,
    options: {
      model: 'claude-3-sonnet-20240229',
      maxTokens: 2000,
      temperature: 0.3
    }
  }),
  
  offline: createProviderConfig({
    enabled: true,
    priority: 3,
    timeout: 1000,
    options: {
      fallbackMode: true,
      staticResponses: true
    }
  }),
  
  mock: createProviderConfig({
    enabled: isDevelopment(),
    priority: 2,
    timeout: 2000,
    options: {
      simulateDelay: true,
      randomErrors: false
    }
  })
};

// Feature flags based on environment
const createFeatureFlags = () => {
  if (isClaudeArtifact()) {
    return {
      compromiseAnalysis: true,
      executiveInsights: true,
      threatContext: true,
      scenarioSimulation: true,
      realTimeUpdates: true
    };
  }
  
  if (isDevelopment()) {
    return {
      compromiseAnalysis: true,
      executiveInsights: true,
      threatContext: false,
      scenarioSimulation: false,
      realTimeUpdates: false
    };
  }
  
  // Production (GitHub Pages) - limited features
  return {
    compromiseAnalysis: false,
    executiveInsights: false,
    threatContext: false,
    scenarioSimulation: false,
    realTimeUpdates: false
  };
};

// Main configuration
export const AI_CONFIG: AIConfig = {
  defaultProvider: isClaudeArtifact() ? 'claude' : 'offline',
  fallbackProvider: 'offline',
  providers: PROVIDER_CONFIGS,
  features: createFeatureFlags(),
  monitoring: {
    enabled: isDevelopment() || isClaudeArtifact(),
    logLevel: isDevelopment() ? 'debug' : 'warn',
    metricsEnabled: true,
    errorReporting: isProduction()
  }
};

// Configuration validation
export interface ConfigValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export function validateConfig(config: AIConfig): ConfigValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  // Validate providers
  if (!config.providers || Object.keys(config.providers).length === 0) {
    errors.push('At least one provider must be configured');
  }
  
  // Validate default provider exists
  if (!config.providers[config.defaultProvider]) {
    errors.push(`Default provider '${config.defaultProvider}' is not configured`);
  }
  
  // Validate fallback provider exists
  if (!config.providers[config.fallbackProvider]) {
    errors.push(`Fallback provider '${config.fallbackProvider}' is not configured`);
  }
  
  // Check for enabled providers
  const enabledProviders = Object.entries(config.providers)
    .filter(([_, provider]) => provider.enabled);
    
  if (enabledProviders.length === 0) {
    warnings.push('No providers are enabled');
  }
  
  // Validate timeouts
  Object.entries(config.providers).forEach(([name, provider]) => {
    if (provider.timeout < 1000) {
      warnings.push(`Provider '${name}' has very short timeout (${provider.timeout}ms)`);
    }
    if (provider.timeout > 60000) {
      warnings.push(`Provider '${name}' has very long timeout (${provider.timeout}ms)`);
    }
  });
  
  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
}

// Environment helpers
export const ENV = {
  isClaudeArtifact: isClaudeArtifact(),
  isDevelopment: isDevelopment(),
  isProduction: isProduction(),
  
  // Feature detection
  hasClaudeAPI: isClaudeArtifact(),
  hasLocalStorage: typeof localStorage !== 'undefined',
  hasWebWorkers: typeof Worker !== 'undefined',
  
  // Performance hints
  shouldUseOfflineMode: isProduction() && !isClaudeArtifact(),
  shouldEnableDebugMode: isDevelopment(),
  shouldCacheResponses: isProduction()
};

// Configuration updates
export function updateConfig(updates: Partial<AIConfig>): AIConfig {
  const newConfig = { ...AI_CONFIG, ...updates };
  
  // Validate the updated configuration
  const validation = validateConfig(newConfig);
  if (!validation.isValid) {
    console.error('Invalid AI configuration:', validation.errors);
    throw new Error(`Configuration validation failed: ${validation.errors.join(', ')}`);
  }
  
  if (validation.warnings.length > 0) {
    console.warn('AI configuration warnings:', validation.warnings);
  }
  
  return newConfig;
}

// Export validated configuration
const validation = validateConfig(AI_CONFIG);
if (!validation.isValid) {
  console.error('Invalid default AI configuration:', validation.errors);
  // In production, we should still work with offline mode
  if (isProduction()) {
    console.warn('Falling back to offline-only mode');
  }
}

if (validation.warnings.length > 0 && isDevelopment()) {
  console.warn('AI configuration warnings:', validation.warnings);
}

export default AI_CONFIG;