/**
 * AI Service Module Exports
 * 
 * Central export point for all AI-related functionality
 */

// Core AI Service
export { AIService, getAIService, resetAIService } from './AIService.js';

// Providers
export { BaseProvider } from './providers/BaseProvider.js';
export { ClaudeProvider } from './providers/ClaudeProvider.js';
export { OfflineProvider } from './providers/OfflineProvider.js';

// React Hooks
export {
  useAIService,
  useCompromiseAnalysis,
  useExecutiveInsights,
  useThreatContext,
  useScenarioSimulation,
  useAIInsight,
  useAIStatus
} from './hooks.js';

// Configuration
export { aiConfig, getEffectiveConfig, validateConfig, getProviderConfig } from '../config/ai.config.js';