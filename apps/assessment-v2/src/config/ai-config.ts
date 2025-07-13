/**
 * AI Configuration
 * Handles environment variables and fallbacks for different deployment environments
 */

interface AIConfig {
  mistral?: {
    apiKey: string;
  };
  openai?: {
    apiKey: string;
    model?: string;
  };
  useMockInDev: boolean;
  cache: {
    enabled: boolean;
    ttl: number;
  };
}

// Helper to get environment variable with fallbacks
function getEnvVar(key: string): string {
  // Try Vite environment variables first
  const viteValue = import.meta.env[key];
  if (viteValue) return viteValue;

  // Try global window object (for runtime configuration)
  if (typeof window !== 'undefined') {
    const globalConfig = (window as any).__AI_CONFIG__;
    if (globalConfig && globalConfig[key]) {
      return globalConfig[key];
    }
  }

  return '';
}

export function getAIConfig(): AIConfig {
  const config: AIConfig = {
    useMockInDev: true,
    cache: {
      enabled: true,
      ttl: 3600 // 1 hour
    }
  };

  // Get API keys
  const mistralKey = getEnvVar('VITE_MISTRAL_API_KEY');
  const openaiKey = getEnvVar('VITE_OPENAI_API_KEY');

  if (mistralKey) {
    config.mistral = { apiKey: mistralKey };
  }

  if (openaiKey) {
    config.openai = { 
      apiKey: openaiKey,
      model: 'gpt-3.5-turbo'
    };
  }

  // In production, don't use mock if we have real providers
  if (import.meta.env.PROD && (mistralKey || openaiKey)) {
    config.useMockInDev = false;
  }

  return config;
}

// Export for debugging
export function getConfigDebugInfo() {
  return {
    env: import.meta.env.MODE,
    hasMistral: !!getEnvVar('VITE_MISTRAL_API_KEY'),
    hasOpenAI: !!getEnvVar('VITE_OPENAI_API_KEY'),
    useMock: getAIConfig().useMockInDev
  };
}