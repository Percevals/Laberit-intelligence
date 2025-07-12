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

import { BUSINESS_MODELS, DII_BASE_VALUES, DII_BASE_RANGES } from '../constants/index.js';
import { MATURITY_STAGES, PERCENTILE_BENCHMARKS } from '../constants/benchmarks.js';

/**
 * Validates input dimensions
 * 
 * @param {Object} dimensions - Object containing TRD, AER, HFP, BRI, RRG
 * @returns {Object} Validation result {isValid: boolean, errors: string[]}
 */
export function validateInputs(dimensions) {
  const errors = [];
  const requiredDimensions = ['TRD', 'AER', 'HFP', 'BRI', 'RRG'];
  
  // Check for required dimensions
  requiredDimensions.forEach(dim => {
    if (dimensions[dim] === undefined || dimensions[dim] === null) {
      errors.push(`Missing required dimension: ${dim}`);
    }
  });
  
  // Validate dimension ranges (1-10)
  Object.entries(dimensions).forEach(([key, value]) => {
    if (requiredDimensions.includes(key)) {
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
 * 
 * @param {number} businessModel - Business model identifier (1-8)
 * @returns {Object} Validation result {isValid: boolean, error: string}
 */
export function validateBusinessModel(businessModel) {
  if (!businessModel || typeof businessModel !== 'number') {
    return { isValid: false, error: 'Business model must be a number' };
  }
  
  if (businessModel < 1 || businessModel > 8) {
    return { isValid: false, error: 'Business model must be between 1 and 8' };
  }
  
  if (!DII_BASE_VALUES[businessModel]) {
    return { isValid: false, error: `Invalid business model: ${businessModel}` };
  }
  
  return { isValid: true, error: null };
}

/**
 * Calculates the raw DII value
 * 
 * @param {number} trd - Time to Revenue Degradation (1-10)
 * @param {number} aer - Attack Economics Ratio (1-10)
 * @param {number} hfp - Human Failure Probability (1-10)
 * @param {number} bri - Blast Radius Index (1-10)
 * @param {number} rrg - Recovery Reality Gap (1-10)
 * @returns {number} Raw DII value
 */
export function calculateDIIRaw(trd, aer, hfp, bri, rrg) {
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
 * 
 * @param {number} diiRaw - Raw DII value
 * @param {number} businessModel - Business model identifier (1-8)
 * @returns {number} Normalized DII score (1-10 scale)
 */
export function normalizeDIIScore(diiRaw, businessModel) {
  // Validate business model
  const modelValidation = validateBusinessModel(businessModel);
  if (!modelValidation.isValid) {
    throw new Error(modelValidation.error);
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
 * 
 * @param {number} diiScore - Normalized DII score (1-10)
 * @returns {Object} Maturity stage information
 */
export function getMaturityStage(diiScore) {
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
 * Calculates the percentile ranking for a DII score within a business model
 * 
 * @param {number} diiScore - Normalized DII score (1-10)
 * @param {number} businessModel - Business model identifier (1-8)
 * @returns {number} Percentile (0-100)
 */
export function calculatePercentile(diiScore, businessModel) {
  // Validate inputs
  if (typeof diiScore !== 'number' || isNaN(diiScore) || diiScore < 0) {
    throw new Error('DII score must be a non-negative number');
  }
  
  const modelValidation = validateBusinessModel(businessModel);
  if (!modelValidation.isValid) {
    throw new Error(modelValidation.error);
  }
  
  const benchmarks = PERCENTILE_BENCHMARKS[businessModel];
  
  // Percentiles: 10%, 25%, 40%, 50% (median), 75%, 90%, 95%
  const percentiles = [10, 25, 40, 50, 75, 90, 95];
  
  // Find where the score falls in the benchmarks
  for (let i = 0; i < benchmarks.length; i++) {
    if (diiScore <= benchmarks[i]) {
      if (i === 0) {
        // Below 10th percentile
        return Math.max(1, Math.floor((diiScore / benchmarks[0]) * 10));
      } else {
        // Interpolate between percentiles
        const lowerPercentile = i === 1 ? 10 : percentiles[i - 1];
        const upperPercentile = percentiles[i];
        const lowerScore = i === 1 ? 0 : benchmarks[i - 1];
        const upperScore = benchmarks[i];
        
        const ratio = (diiScore - lowerScore) / (upperScore - lowerScore);
        return Math.floor(lowerPercentile + ratio * (upperPercentile - lowerPercentile));
      }
    }
  }
  
  // Above 95th percentile
  return Math.min(99, 95 + Math.floor((diiScore - benchmarks[benchmarks.length - 1]) * 2));
}

/**
 * Generates human-readable interpretation of results
 * 
 * @private
 * @param {number} diiScore - Normalized DII score
 * @param {Object} maturityStage - Maturity stage information
 * @param {number} percentile - Percentile ranking
 * @returns {Object} Interpretation with executive summary and recommendations
 */
function generateInterpretation(diiScore, maturityStage, percentile) {
  const interpretations = {
    FRAGIL: {
      summary: `Con un DII de ${diiScore}, su organización está en estado Frágil. Durante un incidente, puede perder más del 70% de capacidad operacional.`,
      risk: 'Riesgo existencial ante ataques sofisticados',
      recommendation: 'Inversión urgente en resiliencia operacional requerida'
    },
    ROBUSTO: {
      summary: `Con un DII de ${diiScore}, su organización mantiene capacidad parcial bajo ataque, pero con pérdidas operacionales del 40-70%.`,
      risk: 'Disrupciones significativas esperables',
      recommendation: 'Focalizar en reducir el radio de explosión (BRI) y mejorar recuperación'
    },
    RESILIENTE: {
      summary: `Con un DII de ${diiScore}, su organización demuestra buena capacidad de mantener operaciones críticas, con pérdidas limitadas al 15-40%.`,
      risk: 'Impacto controlado, recuperación predecible',
      recommendation: 'Optimizar tiempo de respuesta y automatización de recuperación'
    },
    ADAPTATIVO: {
      summary: `Con un DII de ${diiScore}, su organización está en el top 1% de resiliencia. Las crisis pueden convertirse en ventajas competitivas.`,
      risk: 'Mínimo, con capacidad de aprovechar disrupciones',
      recommendation: 'Mantener innovación continua y compartir mejores prácticas'
    }
  };
  
  const stageKey = maturityStage.stage;
  const percentileText = percentile > 50 
    ? `mejor que el ${percentile}% de organizaciones similares`
    : `en el ${percentile}% inferior de su categoría`;
  
  return {
    executiveSummary: interpretations[stageKey].summary,
    riskLevel: interpretations[stageKey].risk,
    primaryRecommendation: interpretations[stageKey].recommendation,
    benchmarkPosition: `Su organización está ${percentileText}.`,
    operationalImpact: getOperationalImpact(diiScore),
    recoveryCapability: getRecoveryCapability(diiScore)
  };
}

/**
 * Estimates operational impact based on DII score
 * 
 * @private
 * @param {number} diiScore - Normalized DII score
 * @returns {string} Operational impact description
 */
function getOperationalImpact(diiScore) {
  if (diiScore < 4) {
    return 'Pérdida operacional: >70% durante incidentes';
  } else if (diiScore < 6) {
    return 'Pérdida operacional: 40-70% durante incidentes';
  } else if (diiScore < 8) {
    return 'Pérdida operacional: 15-40% durante incidentes';
  } else {
    return 'Pérdida operacional: <15% durante incidentes';
  }
}

/**
 * Estimates recovery capability based on DII score
 * 
 * @private
 * @param {number} diiScore - Normalized DII score
 * @returns {string} Recovery capability description
 */
function getRecoveryCapability(diiScore) {
  if (diiScore < 4) {
    return 'Recuperación 5-10x más lenta que planificado';
  } else if (diiScore < 6) {
    return 'Recuperación 2-3x más lenta que planificado';
  } else if (diiScore < 8) {
    return 'Recuperación ±20% del tiempo planificado';
  } else {
    return 'Recuperación más rápida que competidores';
  }
}

/**
 * Main calculation function that returns complete DII analysis
 * 
 * @param {Object} input - Input object with businessModel and dimensions
 * @param {number} input.businessModel - Business model identifier (1-8)
 * @param {Object} input.dimensions - Object containing TRD, AER, HFP, BRI, RRG (all 1-10)
 * @returns {Object} Complete DII analysis results
 */
export function calculateDII(input) {
  try {
    // Validate business model
    const modelValidation = validateBusinessModel(input.businessModel);
    if (!modelValidation.isValid) {
      throw new Error(modelValidation.error);
    }
    
    // Validate dimensions
    const dimensionValidation = validateInputs(input.dimensions);
    if (!dimensionValidation.isValid) {
      throw new Error(`Invalid dimensions: ${dimensionValidation.errors.join(', ')}`);
    }
    
    const { TRD, AER, HFP, BRI, RRG } = input.dimensions;
    
    // Calculate raw DII
    const diiRaw = calculateDIIRaw(TRD, AER, HFP, BRI, RRG);
    
    // Normalize to 1-10 scale
    const diiScore = normalizeDIIScore(diiRaw, input.businessModel);
    
    // Get maturity stage
    const maturityStage = getMaturityStage(diiScore);
    
    // Calculate percentile
    const percentile = calculatePercentile(diiScore, input.businessModel);
    
    // Generate interpretation
    const interpretation = generateInterpretation(diiScore, maturityStage, percentile);
    
    return {
      success: true,
      results: {
        diiRaw: Math.round(diiRaw * 1000) / 1000, // 3 decimal places
        diiScore: Math.round(diiScore * 10) / 10, // 1 decimal place
        stage: maturityStage,
        percentile,
        interpretation,
        businessModel: input.businessModel,
        diiBase: DII_BASE_VALUES[input.businessModel],
        dimensions: input.dimensions
      }
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
}