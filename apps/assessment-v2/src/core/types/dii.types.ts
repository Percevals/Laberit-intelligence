/**
 * Digital Immunity Index (DII) type definitions
 * Core formula: DII = (TRD × AER) / (HFP × BRI × RRG)
 */

import type { Score, Percentage } from './brand.types';
import type { BusinessModel } from './business-model.types';

// Re-export Score for components that need it
export type { Score };

// DII Dimensions - each scored 1-10
export interface DIIDimensions {
  TRD: number; // Time to Revenue Degradation (1-10) - Higher is better
  AER: number; // Attack Economics Ratio (1-10) - Higher is better  
  HFP: number; // Human Failure Probability (1-10) - Lower is better
  BRI: number; // Blast Radius Index (1-10) - Lower is better
  RRG: number; // Recovery Reality Gap (1-10) - Lower is better
}

// Validate dimension values
export function validateDimension(value: number, name: string): number {
  if (value < 1 || value > 10) {
    throw new Error(`${name} must be between 1 and 10`);
  }
  return value;
}

// Raw DII score before normalization
export interface DIIRawScore {
  value: number;
  formula: string;
  dimensions: DIIDimensions;
  timestamp: Date;
}

// Normalized DII score (0-100)
export interface DIIScore {
  raw: DIIRawScore;
  normalized: Score;
  businessModel: BusinessModel;
  percentile: Percentage; // Compared to peers
  interpretation: DIIInterpretation;
}

// Maturity stages based on DII score
export type MaturityStage = 
  | 'FRAGIL'      // 0-25: Fragile - High risk, minimal resilience
  | 'ROBUSTO'     // 26-50: Robust - Basic defenses, but vulnerable
  | 'RESILIENTE'  // 51-75: Resilient - Good recovery capability
  | 'ADAPTATIVO'; // 76-100: Adaptive - Excellent, learns from attacks

export interface DIIInterpretation {
  stage: MaturityStage;
  score: Score;
  
  // Business impact
  operationalRisk: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  estimatedDowntimeHours: number;
  revenueAtRisk: Percentage;
  
  // Key messages
  headline: string;
  strengths: string[];
  vulnerabilities: string[];
  
  // Comparison
  betterThan: Percentage; // "Better than X% of similar companies"
  industryBenchmark: {
    average: Score;
    top10Percent: Score;
    yourScore: Score;
  };
}

// Question impact on DII dimensions
export interface QuestionImpact {
  dimension: keyof DIIDimensions;
  weight: number; // 0.1 to 2.0 multiplier
  direction: 'positive' | 'negative';
  explanation: string;
}

// Partial score during assessment
export interface PartialDIIScore {
  completedQuestions: number;
  totalQuestions: number;
  currentDimensions: Partial<DIIDimensions>;
  estimatedRange: {
    min: Score;
    max: Score;
  };
}