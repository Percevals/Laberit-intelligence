/**
 * Digital Immunity Index (DII) 4.0 Calculator
 * 
 * Core module for calculating the Digital Immunity Index based on the formula:
 * DII Raw = (TRD × AER) / (HFP × BRI × RRG)
 * DII Score = (DII Raw / DII Base del Modelo) × 10
 * 
 * @module @dii/core/calculator
 * @version 4.0.0
 * @author Laberit Intelligence
 */

import { BUSINESS_MODELS, DII_BASE_VALUES, DII_BASE_RANGES } from '../constants';
import { MATURITY_STAGES, PERCENTILE_BENCHMARKS } from '../constants/benchmarks';
import type { DIIDimensions, DIIResults, ValidationResult, MaturityStage } from '@dii/types';

/**
 * Validates input dimensions
 */
export function validateInputs(dimensions: Partial<DIIDimensions>): ValidationResult {
  const errors: string[] = [];
  const requiredDimensions: (keyof DIIDimensions)[] = ['TRD', 'AER', 'HFP', 'BRI', 'RRG'];
  
  // Check for required dimensions
  requiredDimensions.forEach(dim => {
    if (dimensions[dim] === undefined || dimensions[dim] === null) {
      errors.push(`Missing required dimension: ${dim}`);
    }
  });
  
  // Validate dimension ranges (1-10)
  Object.entries(dimensions).forEach(([key, value]) => {
    if (requiredDimensions.includes(key as keyof DIIDimensions)) {
      if (typeof value !== 'number' || isNaN(value)) {
        errors.push(`${key} must be a number`);
      } else if (value < 1 || value > 10) {
        errors.push(`${key} must be between 1 and 10 (got ${value})`);
      }
    }
  });
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Validates business model
 */
export function validateBusinessModel(businessModel: number): ValidationResult {
  if (!businessModel || typeof businessModel !== 'number') {
    return { isValid: false, errors: ['Business model must be a number'] };
  }
  
  if (businessModel < 1 || businessModel > 8) {
    return { isValid: false, errors: ['Business model must be between 1 and 8'] };
  }
  
  if (!DII_BASE_VALUES[businessModel]) {
    return { isValid: false, errors: [`Invalid business model: ${businessModel}`] };
  }
  
  return { isValid: true, errors: [] };
}

/**
 * Calculates the raw DII value
 */
export function calculateDIIRaw(trd: number, aer: number, hfp: number, bri: number, rrg: number): number {
  // Validate inputs
  const validation = validateInputs({ TRD: trd, AER: aer, HFP: hfp, BRI: bri, RRG: rrg });
  if (!validation.isValid) {
    throw new Error(`Invalid inputs: ${validation.errors.join(', ')}`);
  }
  
  // Calculate DII Raw = (TRD × AER) / (HFP × BRI × RRG)
  const numerator = trd * aer;
  const denominator = hfp * bri * rrg;
  
  // Prevent division by zero
  if (denominator === 0) {
    throw new Error('Division by zero: HFP × BRI × RRG cannot be zero');
  }
  
  return numerator / denominator;
}

/**
 * Normalizes the DII raw score based on business model
 */
export function normalizeDIIScore(diiRaw: number, businessModel: number): number {
  // Validate business model
  const modelValidation = validateBusinessModel(businessModel);
  if (!modelValidation.isValid) {
    throw new Error(modelValidation.errors[0]);
  }
  
  // Get base value for the business model
  const diiBase = DII_BASE_VALUES[businessModel];
  
  // Calculate normalized score: (DII Raw / DII Base) × 10
  const normalizedScore = (diiRaw / diiBase) * 10;
  
  // Cap the score at 10
  return Math.min(normalizedScore, 10);
}

/**
 * Determines the maturity stage based on DII score
 */
export function getMaturityStage(diiScore: number): MaturityStage {
  if (typeof diiScore !== 'number' || isNaN(diiScore)) {
    throw new Error('DII score must be a number');
  }
  
  if (diiScore < 0) {
    throw new Error('DII score cannot be negative');
  }
  
  if (diiScore < MATURITY_STAGES.FRAGIL.max) {
    return {
      stage: 'FRAGIL',
      name: MATURITY_STAGES.FRAGIL.name,
      description: MATURITY_STAGES.FRAGIL.description,
      color: '#e74c3c'
    };
  } else if (diiScore < MATURITY_STAGES.ROBUSTO.max) {
    return {
      stage: 'ROBUSTO',
      name: MATURITY_STAGES.ROBUSTO.name,
      description: MATURITY_STAGES.ROBUSTO.description,
      color: '#f39c12'
    };
  } else if (diiScore < MATURITY_STAGES.RESILIENTE.max) {
    return {
      stage: 'RESILIENTE',
      name: MATURITY_STAGES.RESILIENTE.name,
      description: MATURITY_STAGES.RESILIENTE.description,
      color: '#2ecc71'
    };
  } else {
    return {
      stage: 'ADAPTATIVO',
      name: MATURITY_STAGES.ADAPTATIVO.name,
      description: MATURITY_STAGES.ADAPTATIVO.description,
      color: '#3498db'
    };
  }
}

/**
 * Calculates the percentile based on business model and DII score
 */
export function calculatePercentile(businessModel: number, diiScore: number): number {
  const benchmarks = PERCENTILE_BENCHMARKS[businessModel];
  
  if (!benchmarks) {
    console.warn(`No benchmarks found for business model ${businessModel}, using default`);
    return Math.round(diiScore * 10);
  }
  
  // Find the appropriate percentile range
  for (const benchmark of benchmarks) {
    if (diiScore <= benchmark.maxScore) {
      return benchmark.percentile;
    }
  }
  
  // If score exceeds all benchmarks, return 99th percentile
  return 99;
}

/**
 * Main calculation function
 */
export interface CalculationInput {
  businessModel: number;
  dimensions: DIIDimensions;
}

export interface CalculationResult {
  success: boolean;
  error?: string;
  results?: DIIResults;
}

export function calculateDII(input: CalculationInput): CalculationResult {
  try {
    // Validate business model
    const modelValidation = validateBusinessModel(input.businessModel);
    if (!modelValidation.isValid) {
      return {
        success: false,
        error: modelValidation.errors[0]
      };
    }
    
    // Validate dimensions
    const dimensionValidation = validateInputs(input.dimensions);
    if (!dimensionValidation.isValid) {
      return {
        success: false,
        error: dimensionValidation.errors.join(', ')
      };
    }
    
    const { TRD, AER, HFP, BRI, RRG } = input.dimensions;
    
    // Calculate raw DII
    const diiRaw = calculateDIIRaw(TRD, AER, HFP, BRI, RRG);
    
    // Normalize score
    const diiScore = normalizeDIIScore(diiRaw, input.businessModel);
    
    // Round to one decimal place
    const roundedScore = Math.round(diiScore * 10) / 10;
    
    // Get maturity stage
    const stage = getMaturityStage(roundedScore);
    
    // Calculate percentile
    const percentile = calculatePercentile(input.businessModel, roundedScore);
    
    // Get DII base value for the model
    const diiBase = DII_BASE_VALUES[input.businessModel];
    
    return {
      success: true,
      results: {
        diiRaw: Math.round(diiRaw * 1000) / 1000,
        diiScore: roundedScore,
        diiBase,
        stage,
        percentile,
        dimensions: input.dimensions,
        businessModel: input.businessModel
      }
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

/**
 * Calculates improvement impact
 */
export interface ImprovementAnalysis {
  dimension: keyof DIIDimensions;
  currentValue: number;
  newValue: number;
  currentDII: number;
  newDII: number;
  improvement: number;
  percentageGain: number;
}

export function analyzeImprovement(
  businessModel: number,
  currentDimensions: DIIDimensions,
  dimension: keyof DIIDimensions,
  newValue: number
): ImprovementAnalysis | null {
  try {
    // Calculate current DII
    const currentResult = calculateDII({ businessModel, dimensions: currentDimensions });
    if (!currentResult.success || !currentResult.results) {
      return null;
    }
    
    // Create new dimensions with improvement
    const newDimensions = { ...currentDimensions, [dimension]: newValue };
    
    // Calculate new DII
    const newResult = calculateDII({ businessModel, dimensions: newDimensions });
    if (!newResult.success || !newResult.results) {
      return null;
    }
    
    const currentDII = currentResult.results.diiScore;
    const newDII = newResult.results.diiScore;
    const improvement = newDII - currentDII;
    const percentageGain = (improvement / currentDII) * 100;
    
    return {
      dimension,
      currentValue: currentDimensions[dimension],
      newValue,
      currentDII,
      newDII,
      improvement: Math.round(improvement * 10) / 10,
      percentageGain: Math.round(percentageGain * 10) / 10
    };
  } catch (error) {
    console.error('Error analyzing improvement:', error);
    return null;
  }
}

/**
 * Exports all available business models for reference
 */
export { BUSINESS_MODELS } from '../constants';

export default {
  validateInputs,
  validateBusinessModel,
  calculateDIIRaw,
  normalizeDIIScore,
  getMaturityStage,
  calculatePercentile,
  calculateDII,
  analyzeImprovement
};