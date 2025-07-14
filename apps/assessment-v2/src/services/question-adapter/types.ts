/**
 * Question Adapter Types
 * Types for adapting scenario questions to company context
 */

import type { CompanyInfo } from '@services/ai/types';
import type { PainScenario } from '@core/types/pain-scenario.types';

/**
 * Context for adapting questions
 */
export interface QuestionContext {
  company: CompanyInfo;
  businessModel?: string | undefined;
  criticalInfra?: boolean | undefined;
}

/**
 * Template variables that can be replaced in questions
 */
export interface TemplateVariables {
  companyName: string;
  revenue?: string | undefined;
  employees?: string | undefined;
  industry?: string | undefined;
  location?: string | undefined;
  // Dynamic thresholds based on company size
  amountThreshold?: string | undefined;
  timeThreshold?: string | undefined;
  percentageThreshold?: string | undefined;
}

/**
 * Adapted question with metadata
 */
export interface AdaptedQuestion {
  /** Original template question */
  original: string;
  
  /** Personalized question with company context */
  adapted: string;
  
  /** Variables used in adaptation */
  variables: TemplateVariables;
  
  /** Whether AI was used for adaptation */
  aiEnhanced: boolean;
  
  /** Confidence in the adaptation (0-1) */
  confidence: number;
}

/**
 * Question adaptation request
 */
export interface AdaptationRequest {
  /** The scenario containing the question to adapt */
  scenario: PainScenario;
  
  /** Company context for personalization */
  context: QuestionContext;
  
  /** Whether to use AI for enhanced adaptation */
  useAI?: boolean;
  
  /** Specific question type to adapt */
  questionType: 'light' | 'premium';
  
  /** For premium questions, which index to adapt */
  questionIndex?: number;
}

/**
 * Batch adaptation response
 */
export interface BatchAdaptationResponse {
  /** All adapted questions */
  questions: AdaptedQuestion[];
  
  /** Total processing time */
  processingTime: number;
  
  /** Whether any questions used AI */
  aiUsed: boolean;
  
  /** Provider used for AI adaptation */
  provider?: string | undefined;
}