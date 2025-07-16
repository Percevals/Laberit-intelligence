/**
 * DII Calculator - Core calculation engine
 * Formula: DII = (TRD × AER) / (HFP × BRI × RRG)
 * 
 * Based on 150+ validated assessments
 */

import type { 
  DIIDimensions, 
  DIIRawScore, 
  DIIScore,
  MaturityStage,
  DIIInterpretation 
} from '@core/types/dii.types';
import type { BusinessModel, BusinessModelId } from '@core/types/business-model.types';
import { Score, Percentage } from '@core/types/brand.types';
import { validateDimension } from '@core/types/dii.types';
import { DII_V4_MODEL_PROFILES } from '@core/business-model/model-profiles-dii-v4';

export class DIICalculator {
  /**
   * Calculate raw DII score from dimensions
   */
  static calculateRaw(dimensions: DIIDimensions): DIIRawScore {
    // Validate all dimensions
    const validated: DIIDimensions = {
      TRD: validateDimension(dimensions.TRD, 'TRD'),
      AER: validateDimension(dimensions.AER, 'AER'),
      HFP: validateDimension(dimensions.HFP, 'HFP'),
      BRI: validateDimension(dimensions.BRI, 'BRI'),
      RRG: validateDimension(dimensions.RRG, 'RRG')
    };
    
    // Apply the formula
    const numerator = validated.TRD * validated.AER;
    const denominator = validated.HFP * validated.BRI * validated.RRG;
    
    // Prevent division by zero (minimum denominator is 1)
    const rawScore = numerator / Math.max(denominator, 1);
    
    return {
      value: rawScore,
      formula: `(${validated.TRD} × ${validated.AER}) / (${validated.HFP} × ${validated.BRI} × ${validated.RRG})`,
      dimensions: validated,
      timestamp: new Date()
    };
  }
  
  /**
   * Normalize raw score to 0-100 scale based on business model
   */
  static normalize(
    raw: DIIRawScore, 
    businessModel: BusinessModel
  ): Score {
    // Get model profile
    const modelId = this.getModelId(businessModel);
    const profile = DII_V4_MODEL_PROFILES[modelId];
    
    if (!profile) {
      throw new Error(`Unknown business model: ${businessModel}`);
    }
    
    // Model-specific normalization ranges
    const modelRanges: Record<string, { min: number; max: number }> = {
      // DII-specific models
      COMERCIO_HIBRIDO: { min: 0.01, max: 9 },
      SOFTWARE_CRITICO: { min: 0.02, max: 12 },
      SERVICIOS_DATOS: { min: 0.01, max: 8 },
      ECOSISTEMA_DIGITAL: { min: 0.02, max: 11 },
      SERVICIOS_FINANCIEROS: { min: 0.03, max: 15 },
      INFRAESTRUCTURA_HEREDADA: { min: 0.01, max: 7 },
      CADENA_SUMINISTRO: { min: 0.02, max: 10 },
      INFORMACION_REGULADA: { min: 0.02, max: 12 },
      // Legacy models (kept for backwards compatibility)
      SUBSCRIPTION_BASED: { min: 0.01, max: 10 },
      TRANSACTION_BASED: { min: 0.02, max: 12 },
      ASSET_LIGHT: { min: 0.005, max: 8 },
      ASSET_HEAVY: { min: 0.01, max: 7 },
      DATA_DRIVEN: { min: 0.01, max: 9 },
      PLATFORM_ECOSYSTEM: { min: 0.02, max: 11 },
      DIRECT_TO_CONSUMER: { min: 0.01, max: 8 },
      B2B_ENTERPRISE: { min: 0.02, max: 10 }
    };
    
    const range = modelRanges[businessModel];
    
    if (!range) {
      // Default range for unknown models
      const defaultRange = { min: 0.01, max: 10 };
      const normalized = ((raw.value - defaultRange.min) / (defaultRange.max - defaultRange.min)) * 100;
      return Score(Math.max(0, Math.min(100, Math.round(normalized))));
    }
    
    // Normalize to 0-100
    const normalized = ((raw.value - range.min) / (range.max - range.min)) * 100;
    
    // Clamp to valid range
    return Score(Math.max(0, Math.min(100, Math.round(normalized))));
  }
  
  /**
   * Calculate complete DII score with interpretation
   */
  static calculate(
    dimensions: DIIDimensions,
    businessModel: BusinessModel,
    benchmarkData?: BenchmarkData
  ): DIIScore {
    const raw = this.calculateRaw(dimensions);
    const normalized = this.normalize(raw, businessModel);
    const percentile = this.calculatePercentile(normalized, businessModel, benchmarkData);
    const interpretation = this.interpret(normalized, businessModel, percentile);
    
    return {
      raw,
      normalized,
      businessModel,
      percentile,
      interpretation
    };
  }
  
  /**
   * Calculate percentile compared to peers
   */
  private static calculatePercentile(
    score: Score,
    businessModel: BusinessModel,
    benchmarkData?: BenchmarkData
  ): Percentage {
    // Use real benchmark data if available
    if (benchmarkData) {
      const peers = benchmarkData.scores.filter(s => s.businessModel === businessModel);
      const betterThan = peers.filter(s => s.score < score).length;
      return Percentage(Math.round((betterThan / peers.length) * 100));
    }
    
    // Otherwise use statistical approximation based on our data
    const modelId = this.getModelId(businessModel);
    const profile = DII_V4_MODEL_PROFILES[modelId];
    
    if (!profile) {
      return Percentage(50); // Default to median
    }
    
    // Approximate using normal distribution
    const mean = profile.diiBase.avg;
    const stdDev = (profile.diiBase.max - profile.diiBase.min) / 4; // Rough approximation
    
    // Calculate z-score
    const zScore = (score - mean) / stdDev;
    
    // Convert to percentile (simplified normal CDF)
    const percentile = this.normalCDF(zScore) * 100;
    
    return Percentage(Math.round(Math.max(1, Math.min(99, percentile))));
  }
  
  /**
   * Interpret DII score into business meaning
   */
  private static interpret(
    score: Score,
    businessModel: BusinessModel,
    percentile: Percentage
  ): DIIInterpretation {
    // Determine maturity stage
    const stage = this.getMaturityStage(score);
    
    // Get operational risk level
    const operationalRisk = this.getOperationalRisk(score);
    
    // Estimate downtime based on score and model
    const modelId = this.getModelId(businessModel);
    const baseDowntime = MODEL_PROFILES[modelId]?.resilienceWindow.hours ?? 24;
    const downtimeMultiplier = this.getDowntimeMultiplier(score);
    const estimatedDowntimeHours = Math.round(baseDowntime * downtimeMultiplier);
    
    // Calculate revenue at risk
    const revenueAtRisk = this.getRevenueAtRisk(score);
    
    // Generate interpretation messages
    const { headline, strengths, vulnerabilities } = this.generateMessages(
      score, 
      stage, 
      businessModel
    );
    
    // Industry benchmark (simplified - in production would use real data)
    const industryBenchmark = {
      average: Score(55),
      top10Percent: Score(80),
      yourScore: score
    };
    
    return {
      stage,
      score,
      operationalRisk,
      estimatedDowntimeHours,
      revenueAtRisk,
      headline,
      strengths,
      vulnerabilities,
      betterThan: percentile,
      industryBenchmark
    };
  }
  
  /**
   * Get maturity stage from score
   */
  private static getMaturityStage(score: Score): MaturityStage {
    if (score <= 25) return 'FRAGIL';
    if (score <= 50) return 'ROBUSTO';
    if (score <= 75) return 'RESILIENTE';
    return 'ADAPTATIVO';
  }
  
  /**
   * Get operational risk level
   */
  private static getOperationalRisk(score: Score): DIIInterpretation['operationalRisk'] {
    if (score <= 30) return 'CRITICAL';
    if (score <= 50) return 'HIGH';
    if (score <= 70) return 'MEDIUM';
    return 'LOW';
  }
  
  /**
   * Get downtime multiplier based on score
   */
  private static getDowntimeMultiplier(score: Score): number {
    // Exponential decay - lower scores mean much longer downtime
    return Math.exp(-score / 25);
  }
  
  /**
   * Get revenue at risk percentage
   */
  private static getRevenueAtRisk(score: Score): Percentage {
    // Inverse relationship - lower score means higher revenue risk
    const risk = 100 - score;
    // Apply business reality factor (even good companies have some risk)
    const adjustedRisk = Math.max(5, risk * 0.8);
    return Percentage(Math.round(adjustedRisk));
  }
  
  /**
   * Generate interpretation messages
   */
  private static generateMessages(
    _score: Score,
    stage: MaturityStage,
    _businessModel: BusinessModel
  ): Pick<DIIInterpretation, 'headline' | 'strengths' | 'vulnerabilities'> {
    const messages = {
      FRAGIL: {
        headline: 'Your digital immunity is critically low. Immediate action required.',
        strengths: [
          'Awareness is the first step to improvement',
          'Significant opportunity for quick wins',
          'Can learn from many available best practices'
        ],
        vulnerabilities: [
          'Highly vulnerable to commodity attacks',
          'Lack of basic security hygiene',
          'No resilience to sustained attacks',
          'Recovery will be costly and slow'
        ]
      },
      ROBUSTO: {
        headline: 'Basic defenses in place, but significant gaps remain.',
        strengths: [
          'Foundation security controls implemented',
          'Some incident response capability exists',
          'Can handle basic commodity attacks'
        ],
        vulnerabilities: [
          'Vulnerable to targeted attacks',
          'Limited detection capabilities',
          'Recovery processes untested',
          'Human factor remains high risk'
        ]
      },
      RESILIENTE: {
        headline: 'Good security posture with proven recovery capability.',
        strengths: [
          'Can withstand most common attacks',
          'Proven incident response processes',
          'Good security culture established',
          'Recovery time within business tolerance'
        ],
        vulnerabilities: [
          'Advanced persistent threats still a risk',
          'Supply chain vulnerabilities exist',
          'Some legacy system exposure',
          'Insider threats need attention'
        ]
      },
      ADAPTATIVO: {
        headline: 'Excellent cyber resilience with adaptive defense.',
        strengths: [
          'Proactive threat hunting capability',
          'Rapid detection and response',
          'Strong security culture throughout',
          'Continuous improvement mindset',
          'Can handle advanced threats'
        ],
        vulnerabilities: [
          'Nation-state actors remain a concern',
          'Zero-day exploits before patches',
          'Maintain vigilance against complacency'
        ]
      }
    };
    
    return messages[stage];
  }
  
  /**
   * Helper: Get model ID from business model name
   */
  private static getModelId(model: BusinessModel): BusinessModelId {
    const mapping: Record<BusinessModel, BusinessModelId> = {
      // DII-specific models
      'COMERCIO_HIBRIDO': 1,
      'SOFTWARE_CRITICO': 2,
      'SERVICIOS_DATOS': 3,
      'ECOSISTEMA_DIGITAL': 4,
      'SERVICIOS_FINANCIEROS': 5,
      'INFRAESTRUCTURA_HEREDADA': 6,
      'CADENA_SUMINISTRO': 7,
      'INFORMACION_REGULADA': 8,
      // Legacy models (backwards compatibility)
      'SUBSCRIPTION_BASED': 2,      // maps to SOFTWARE_CRITICO
      'TRANSACTION_BASED': 5,       // maps to SERVICIOS_FINANCIEROS
      'ASSET_LIGHT': 2,            // maps to SOFTWARE_CRITICO
      'ASSET_HEAVY': 6,            // maps to INFRAESTRUCTURA_HEREDADA
      'DATA_DRIVEN': 3,            // maps to SERVICIOS_DATOS
      'PLATFORM_ECOSYSTEM': 4,      // maps to ECOSISTEMA_DIGITAL
      'DIRECT_TO_CONSUMER': 1,      // maps to COMERCIO_HIBRIDO
      'B2B_ENTERPRISE': 6          // maps to INFRAESTRUCTURA_HEREDADA
    };
    
    return mapping[model];
  }
  
  /**
   * Helper: Simplified normal CDF for percentile calculation
   */
  private static normalCDF(z: number): number {
    const a1 = 0.254829592;
    const a2 = -0.284496736;
    const a3 = 1.421413741;
    const a4 = -1.453152027;
    const a5 = 1.061405429;
    const p = 0.3275911;
    
    const sign = z >= 0 ? 1 : -1;
    z = Math.abs(z) / Math.sqrt(2);
    
    const t = 1 / (1 + p * z);
    const y = 1 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-z * z);
    
    return 0.5 * (1 + sign * y);
  }
}

// Type for benchmark data (would come from database in production)
interface BenchmarkData {
  scores: Array<{
    businessModel: BusinessModel;
    score: number;
    company?: string;
    date: Date;
  }>;
}