/**
 * Assessment type definitions
 * @module @dii/types/assessment
 */

/**
 * DII Dimensions
 */
export interface DIIDimensions {
  TRD: number; // Time to Revenue Degradation (1-10)
  AER: number; // Attack Economics Ratio (1-10)
  HFP: number; // Human Failure Probability (1-10)
  BRI: number; // Blast Radius Index (1-10)
  RRG: number; // Recovery Reality Gap (1-10)
}

/**
 * Dimension metadata
 */
export interface DimensionInfo {
  name: string;
  shortName: string;
  description: string;
  min: number;
  max: number;
}

/**
 * Assessment input
 */
export interface AssessmentInput {
  businessModel: number;
  dimensions: DIIDimensions;
  metadata?: AssessmentMetadata;
}

/**
 * Assessment metadata
 */
export interface AssessmentMetadata {
  timestamp?: Date;
  userId?: string;
  organizationName?: string;
  sector?: string;
  country?: string;
  assessmentType?: 'light' | 'premium';
}

/**
 * Maturity stage information
 */
export interface MaturityStage {
  stage: 'FRAGIL' | 'ROBUSTO' | 'RESILIENTE' | 'ADAPTATIVO';
  name: string;
  description: string;
  color: string;
}

/**
 * Interpretation of results
 */
export interface DIIInterpretation {
  executiveSummary: string;
  riskLevel: string;
  primaryRecommendation: string;
  benchmarkPosition: string;
  operationalImpact: string;
  recoveryCapability: string;
}

/**
 * DII calculation results
 */
export interface DIIResults {
  diiRaw: number;
  diiScore: number;
  stage: MaturityStage;
  percentile: number;
  interpretation: DIIInterpretation;
  businessModel: number;
  diiBase: number;
  dimensions: DIIDimensions;
}

/**
 * Complete assessment result
 */
export interface AssessmentResult {
  success: boolean;
  results?: DIIResults;
  error?: string;
}

/**
 * Validation result
 */
export interface ValidationResult {
  isValid: boolean;
  errors?: string[];
  error?: string;
}