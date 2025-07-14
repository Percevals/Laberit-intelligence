/**
 * Usage Examples for DII Dimension Converters
 * Shows how to integrate the conversion system with the DII assessment flow
 */

import {
  DimensionConverterFactory,
  convertMultipleDimensions,
  validateDimensionInput,
  type DIIDimension,
  type ConversionResult,
  type BusinessModelId
} from './dimension-converters';

/**
 * Example 1: Single dimension conversion
 */
export function convertSingleResponse(
  dimension: DIIDimension,
  userResponse: number,
  businessModel: BusinessModelId
): ConversionResult {
  // Validate input first
  if (!validateDimensionInput(dimension, userResponse)) {
    throw new Error(`Invalid input for ${dimension}: ${userResponse}`);
  }

  // Convert to DII score
  return DimensionConverterFactory.convert(dimension, userResponse, businessModel);
}

/**
 * Example 2: Assessment integration
 */
export interface AssessmentResponses {
  trdHours?: number;
  aerDollarValue?: number;
  hfpFailurePercent?: number;
  briBlastPercent?: number;
  rrgMultiplier?: number;
}

export interface DIIReadyScores {
  TRD?: number;
  AER?: number;
  HFP?: number;
  BRI?: number;
  RRG?: number;
}

export function convertAssessmentToDII(
  responses: AssessmentResponses,
  businessModel: BusinessModelId
): {
  scores: DIIReadyScores;
  interpretations: Record<string, string>;
  metadata: Record<string, ConversionResult>;
} {
  // Map assessment responses to dimension inputs
  const dimensionInputs: Partial<Record<DIIDimension, number>> = {};
  
  if (responses.trdHours !== undefined) dimensionInputs.TRD = responses.trdHours;
  if (responses.aerDollarValue !== undefined) dimensionInputs.AER = responses.aerDollarValue;
  if (responses.hfpFailurePercent !== undefined) dimensionInputs.HFP = responses.hfpFailurePercent;
  if (responses.briBlastPercent !== undefined) dimensionInputs.BRI = responses.briBlastPercent;
  if (responses.rrgMultiplier !== undefined) dimensionInputs.RRG = responses.rrgMultiplier;

  // Convert all dimensions
  const conversionResults = convertMultipleDimensions(dimensionInputs, businessModel);

  // Extract scores for DII calculation
  const scores: DIIReadyScores = {};
  const interpretations: Record<string, string> = {};
  
  Object.entries(conversionResults).forEach(([dimension, result]) => {
    scores[dimension as DIIDimension] = result.score;
    interpretations[dimension] = result.interpretation;
  });

  return {
    scores,
    interpretations,
    metadata: conversionResults
  };
}

/**
 * Example 3: Real-time conversion with validation
 */
export class AssessmentConverter {
  private businessModel: BusinessModelId;
  private currentResponses: Map<DIIDimension, number> = new Map();

  constructor(businessModel: BusinessModelId) {
    this.businessModel = businessModel;
  }

  addResponse(dimension: DIIDimension, value: number): ConversionResult {
    // Validate input
    if (!validateDimensionInput(dimension, value)) {
      throw new Error(`Invalid ${dimension} input: ${value}`);
    }

    // Store response
    this.currentResponses.set(dimension, value);

    // Convert and return result
    return DimensionConverterFactory.convert(dimension, value, this.businessModel);
  }

  getAllScores(): DIIReadyScores {
    const scores: DIIReadyScores = {};
    
    this.currentResponses.forEach((value, dimension) => {
      const result = DimensionConverterFactory.convert(dimension, value, this.businessModel);
      scores[dimension] = result.score;
    });

    return scores;
  }

  getCompletionStatus(): { completed: DIIDimension[]; missing: DIIDimension[] } {
    const allDimensions = DimensionConverterFactory.getAllDimensions();
    const completed = allDimensions.filter(d => this.currentResponses.has(d));
    const missing = allDimensions.filter(d => !this.currentResponses.has(d));

    return { completed, missing };
  }
}

/**
 * Example 4: Business model comparison
 */
export function compareAcrossBusinessModels(
  dimension: DIIDimension,
  value: number,
  businessModels: BusinessModelId[]
): Array<{ businessModel: BusinessModelId; result: ConversionResult }> {
  return businessModels.map(model => ({
    businessModel: model,
    result: DimensionConverterFactory.convert(dimension, value, model)
  }));
}

/**
 * Example 5: Scenario analysis
 */
export interface ScenarioInput {
  name: string;
  responses: AssessmentResponses;
  businessModel: BusinessModelId;
}

export function analyzeScenarios(scenarios: ScenarioInput[]): Array<{
  scenario: string;
  diiScores: DIIReadyScores;
  riskProfile: string;
  keyWeaknesses: string[];
}> {
  return scenarios.map(scenario => {
    const { scores, interpretations } = convertAssessmentToDII(
      scenario.responses,
      scenario.businessModel
    );

    // Identify key weaknesses (scores < 4)
    const keyWeaknesses = Object.entries(scores)
      .filter(([_, score]) => score && score < 4)
      .map(([dimension, _]) => `${dimension}: ${interpretations[dimension]}`);

    // Determine overall risk profile
    const avgScore = Object.values(scores).reduce((sum, score) => sum + (score || 0), 0) / 
                    Object.keys(scores).length;
    
    let riskProfile = 'Unknown';
    if (avgScore < 3) riskProfile = 'High Risk';
    else if (avgScore < 5) riskProfile = 'Moderate Risk';
    else if (avgScore < 7) riskProfile = 'Low Risk';
    else riskProfile = 'Well Protected';

    return {
      scenario: scenario.name,
      diiScores: scores,
      riskProfile,
      keyWeaknesses
    };
  });
}

/**
 * Example 6: Integration with existing DII calculator
 */
export function integrateWithDIICalculator(
  responses: AssessmentResponses,
  businessModel: BusinessModelId
): {
  diiInputs: { TRD: number; AER: number; HFP: number; BRI: number; RRG: number };
  conversionMetadata: Record<string, ConversionResult>;
} {
  const { scores, metadata } = convertAssessmentToDII(responses, businessModel);

  // Ensure all dimensions have values (use defaults if missing)
  const diiInputs = {
    TRD: scores.TRD || 5.0, // Default to moderate if missing
    AER: scores.AER || 5.0,
    HFP: scores.HFP || 5.0,
    BRI: scores.BRI || 5.0,
    RRG: scores.RRG || 5.0
  };

  return {
    diiInputs,
    conversionMetadata: metadata
  };
}

/**
 * Example 7: Benchmarking helper
 */
export function createBenchmarkData(
  businessModel: BusinessModelId,
  sampleResponses: AssessmentResponses[]
): {
  model: BusinessModelId;
  sampleSize: number;
  averageScores: DIIReadyScores;
  scoreDistributions: Record<DIIDimension, number[]>;
} {
  const allScores: Record<DIIDimension, number[]> = {
    TRD: [],
    AER: [],
    HFP: [],
    BRI: [],
    RRG: []
  };

  // Convert all sample responses
  sampleResponses.forEach(responses => {
    const { scores } = convertAssessmentToDII(responses, businessModel);
    
    Object.entries(scores).forEach(([dimension, score]) => {
      if (score !== undefined) {
        allScores[dimension as DIIDimension].push(score);
      }
    });
  });

  // Calculate averages
  const averageScores: DIIReadyScores = {};
  Object.entries(allScores).forEach(([dimension, scores]) => {
    if (scores.length > 0) {
      averageScores[dimension as DIIDimension] = 
        scores.reduce((sum, score) => sum + score, 0) / scores.length;
    }
  });

  return {
    model: businessModel,
    sampleSize: sampleResponses.length,
    averageScores,
    scoreDistributions: allScores
  };
}

/**
 * Example 8: Real-world scenario tests
 */
export const SAMPLE_SCENARIOS: ScenarioInput[] = [
  {
    name: 'Healthcare System',
    businessModel: 8, // INFORMACION_REGULADA
    responses: {
      trdHours: 2, // Critical - patient care impact
      aerDollarValue: 800000, // High value PHI data
      hfpFailurePercent: 25, // Average healthcare training
      briBlastPercent: 60, // Interconnected systems
      rrgMultiplier: 3.5 // Complex compliance recovery
    }
  },
  {
    name: 'Fintech Startup',
    businessModel: 5, // SERVICIOS_FINANCIEROS
    responses: {
      trdHours: 4, // Real-time financial ops
      aerDollarValue: 1500000, // Prime target for financial fraud
      hfpFailurePercent: 8, // Well-trained tech workforce
      briBlastPercent: 30, // Good modern segmentation
      rrgMultiplier: 1.4 // Automated recovery processes
    }
  },
  {
    name: 'Manufacturing Plant',
    businessModel: 6, // INFRAESTRUCTURA_HEREDADA
    responses: {
      trdHours: 12, // Can operate on backup systems
      aerDollarValue: 200000, // Industrial espionage value
      hfpFailurePercent: 40, // Mixed IT/OT workforce
      briBlastPercent: 80, // Legacy interconnected systems
      rrgMultiplier: 5.0 // Physical restoration required
    }
  },
  {
    name: 'E-commerce Platform',
    businessModel: 1, // COMERCIO_HIBRIDO
    responses: {
      trdHours: 8, // Physical stores provide backup
      aerDollarValue: 250000, // Customer PII and payment data
      hfpFailurePercent: 20, // Mixed workforce training
      briBlastPercent: 45, // Some channel isolation
      rrgMultiplier: 2.0 // Moderate recovery complexity
    }
  }
];

// Run sample analysis
export function runSampleAnalysis(): void {
  console.log('DII Dimension Converter Analysis');
  console.log('================================');
  
  const results = analyzeScenarios(SAMPLE_SCENARIOS);
  
  results.forEach(result => {
    console.log(`\n${result.scenario}:`);
    console.log(`Risk Profile: ${result.riskProfile}`);
    console.log('DII Scores:', result.diiScores);
    if (result.keyWeaknesses.length > 0) {
      console.log('Key Weaknesses:');
      result.keyWeaknesses.forEach(weakness => console.log(`  - ${weakness}`));
    }
  });
}

// Export for easy testing
export { SAMPLE_SCENARIOS as scenarios };