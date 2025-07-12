/**
 * AI Service Exports
 * Clean public API for AI functionality
 */

// Main service
export { AIService, getAIService, initializeAI } from './AIService';

// Hooks
export {
  useAI,
  useAIStatus,
  useAIFeature,
  useCompromiseAnalysis,
  useExecutiveInsights
} from './hooks';

// Components
export { CompromiseAnalysis } from '../../components/ai/CompromiseAnalysis';

// Types
export type {
  AIProvider,
  AIRequest,
  AIResponse,
  AIError,
  AIConfig,
  AssessmentData,
  CompromiseAnalysisResponse,
  ExecutiveInsightsResponse,
  UseAIResult,
  UseCompromiseAnalysisResult,
  UseExecutiveInsightsResult
} from './types';

// Configuration
export { default as AI_CONFIG, ENV } from './config';