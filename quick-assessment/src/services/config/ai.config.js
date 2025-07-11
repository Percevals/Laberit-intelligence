/**
 * AI Configuration for DII Quick Assessment
 * 
 * Controls AI provider selection, features, and behavior.
 * Can be overridden by environment variables.
 */

export const aiConfig = {
  // Provider selection: 'auto' | 'claude' | 'openai' | 'offline'
  provider: import.meta.env?.VITE_AI_PROVIDER || 'auto',
  
  // Mode: 'demo' | 'api' | 'offline'
  mode: import.meta.env?.VITE_AI_MODE || 'demo',
  
  // API configuration (only used in 'api' mode)
  api: {
    claudeKey: import.meta.env?.VITE_CLAUDE_KEY,
    openaiKey: import.meta.env?.VITE_OPENAI_KEY,
    azureEndpoint: import.meta.env?.VITE_AZURE_ENDPOINT,
    googleProject: import.meta.env?.VITE_GOOGLE_PROJECT
  },
  
  // Feature flags
  features: {
    compromiseScore: true,      // Show compromise probability score
    executiveInsights: true,    // Generate executive-ready insights
    threatContext: true,        // Show relevant threat intelligence
    scenarioSimulation: true,   // Enable "what-if" scenarios
    peerComparison: false,      // Compare to industry peers (coming soon)
    trendAnalysis: false,       // Historical trend analysis (coming soon)
    exportReports: false        // Export detailed reports (coming soon)
  },
  
  // UI/UX settings
  ui: {
    showAIBadge: true,         // Show which AI provider is being used
    showConfidence: true,      // Show confidence levels in AI responses
    animateInsights: true,     // Animate insight appearance
    streamResponses: false,    // Stream AI responses (when supported)
    debugMode: import.meta.env?.DEV || false
  },
  
  // Performance settings
  performance: {
    cacheResponses: true,      // Cache AI responses for identical inputs
    cacheDuration: 3600000,    // Cache duration in ms (1 hour)
    maxRetries: 3,             // Max retries for failed requests
    timeout: 30000,            // Request timeout in ms
    batchRequests: true        // Batch multiple AI requests when possible
  },
  
  // Prompt engineering settings
  prompts: {
    language: 'es',            // Primary language for responses (Spanish)
    style: 'executive',        // Communication style: 'technical' | 'executive' | 'balanced'
    includeMetrics: true,      // Include quantitative metrics in responses
    includeSources: false,     // Include sources/references (when available)
    maxInsights: 3            // Maximum number of insights per response
  },
  
  // Security settings
  security: {
    sanitizeInputs: true,      // Remove PII from AI inputs
    logRequests: false,        // Log AI requests (never in production)
    encryptCache: false,       // Encrypt cached responses
    allowedDomains: ['*']      // Allowed domains for AI requests
  },
  
  // Fallback behavior
  fallback: {
    useOfflineOnError: true,   // Fall back to offline provider on errors
    offlineDataSource: 'static', // 'static' | 'cached' | 'hybrid'
    showFallbackNotice: true   // Notify user when using fallback
  },
  
  // Demo mode settings (no API keys required)
  demo: {
    simulateDelay: true,       // Simulate realistic AI response times
    delayRange: [500, 2000],   // Delay range in ms
    useRealisticData: true,    // Use realistic demo data
    rotateExamples: true       // Rotate through different example responses
  }
};

/**
 * Get effective configuration considering overrides
 */
export function getEffectiveConfig(overrides = {}) {
  return {
    ...aiConfig,
    ...overrides,
    features: {
      ...aiConfig.features,
      ...overrides.features
    },
    ui: {
      ...aiConfig.ui,
      ...overrides.ui
    },
    performance: {
      ...aiConfig.performance,
      ...overrides.performance
    },
    prompts: {
      ...aiConfig.prompts,
      ...overrides.prompts
    },
    security: {
      ...aiConfig.security,
      ...overrides.security
    },
    fallback: {
      ...aiConfig.fallback,
      ...overrides.fallback
    },
    demo: {
      ...aiConfig.demo,
      ...overrides.demo
    }
  };
}

/**
 * Validate configuration
 */
export function validateConfig(config) {
  const errors = [];
  
  // Check provider
  const validProviders = ['auto', 'claude', 'openai', 'azure', 'google', 'offline'];
  if (!validProviders.includes(config.provider)) {
    errors.push(`Invalid provider: ${config.provider}`);
  }
  
  // Check mode
  const validModes = ['demo', 'api', 'offline'];
  if (!validModes.includes(config.mode)) {
    errors.push(`Invalid mode: ${config.mode}`);
  }
  
  // Check API keys in api mode
  if (config.mode === 'api') {
    const hasAnyKey = config.api.claudeKey || config.api.openaiKey || 
                      config.api.azureEndpoint || config.api.googleProject;
    if (!hasAnyKey) {
      errors.push('API mode requires at least one API key');
    }
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Get provider-specific configuration
 */
export function getProviderConfig(providerName) {
  const configs = {
    claude: {
      model: 'claude-3-haiku-20240307',
      maxTokens: 1024,
      temperature: 0.7
    },
    openai: {
      model: 'gpt-3.5-turbo',
      maxTokens: 1024,
      temperature: 0.7
    },
    azure: {
      apiVersion: '2023-05-15',
      deploymentName: 'gpt-35-turbo'
    },
    google: {
      model: 'gemini-pro',
      maxOutputTokens: 1024
    },
    offline: {
      responseTime: [100, 300],
      dataQuality: 'high'
    }
  };
  
  return configs[providerName] || configs.offline;
}