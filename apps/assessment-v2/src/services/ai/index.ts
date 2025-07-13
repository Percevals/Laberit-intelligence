export { AIService } from './ai-service';
export type { AIServiceConfig } from './ai-service';
export type { 
  CompanyInfo, 
  CompanySearchResult,
  AIProvider,
  AIProviderConfig 
} from './types';

// Export providers for direct use if needed
export { OpenAIProvider } from './providers/openai-provider';
export { MockProvider } from './providers/mock-provider';