/**
 * Response Interpreter Service
 * Maps scenario question responses (1-5 scale) to DII dimension values (1-10 scale)
 * Considers business model context and company characteristics
 */

import type { DIIDimension, BusinessModelScenarioId } from '@core/types/pain-scenario.types';
import type { BusinessModel } from '@core/types/business-model.types';
import type { CompanyInfo } from '@services/ai/types';

export interface InterpretationContext {
  businessModel: BusinessModel;
  scenarioId: BusinessModelScenarioId;
  company: CompanyInfo;
  criticalInfra: boolean;
}

export interface DimensionInterpretation {
  dimension: DIIDimension;
  rawResponse: number; // 1-5 from user
  metric?: {
    hours?: number;
    percentage?: number;
    ratio?: number;
    multiplier?: number;
  } | undefined;
  interpretedValue: number; // 1-10 for DII
  confidence: number; // 0-1
  reasoning: string;
}

export class ResponseInterpreter {
  /**
   * Interpret a single response into DII dimension value
   * Supports both legacy (1-5 scale only) and metric-based interpretation
   */
  static interpretResponse(
    dimension: DIIDimension,
    response: number, // 1-5 scale
    context: InterpretationContext,
    metric?: DimensionInterpretation['metric']
  ): DimensionInterpretation {
    // Validate response
    if (response < 1 || response > 5) {
      throw new Error(`Invalid response: ${response}. Must be 1-5.`);
    }

    // Get base interpretation - use metric if available, otherwise fall back to generic mapping
    const baseValue = metric 
      ? this.getMetricBasedInterpretation(dimension, response, metric)
      : this.getBaseInterpretation(dimension, response);
    
    // Apply business model adjustments
    const modelAdjusted = this.applyBusinessModelAdjustment(
      dimension,
      baseValue,
      context.businessModel
    );
    
    // Apply company size adjustments
    const sizeAdjusted = this.applyCompanySizeAdjustment(
      dimension,
      modelAdjusted,
      context.company
    );
    
    // Apply critical infrastructure penalty if applicable
    const finalValue = this.applyCriticalInfraAdjustment(
      dimension,
      sizeAdjusted,
      context.criticalInfra
    );

    // Ensure value is within bounds
    const interpretedValue = Math.max(1, Math.min(10, Math.round(finalValue)));
    
    // Calculate confidence based on data completeness
    const confidence = this.calculateConfidence(context);
    
    // Generate reasoning
    const reasoning = this.generateReasoning(
      dimension,
      response,
      interpretedValue,
      context
    );

    return {
      dimension,
      rawResponse: response,
      metric,
      interpretedValue,
      confidence,
      reasoning
    };
  }

  /**
   * Base interpretation mapping (1-5 to 1-10)
   * Different mapping per dimension based on their nature
   */
  private static getBaseInterpretation(dimension: DIIDimension, response: number): number {
    // Mapping arrays: index 0 is unused, 1-5 map to response values
    const mappings: Record<DIIDimension, number[]> = {
      // TRD: Time resilience (higher is better)
      // 1=very poor (1-2), 2=poor (3-4), 3=average (5-6), 4=good (7-8), 5=excellent (9-10)
      TRD: [0, 1.5, 3.5, 5.5, 7.5, 9.5],
      
      // AER: Asset exposure control (higher is better)
      AER: [0, 2, 4, 6, 8, 10],
      
      // HFP: Human failure probability (lower is better, so invert)
      // 1=very poor (9-10), 2=poor (7-8), 3=average (5-6), 4=good (3-4), 5=excellent (1-2)
      HFP: [0, 9, 7, 5, 3, 1],
      
      // BRI: Blast radius (lower is better, so invert)
      BRI: [0, 8.5, 6.5, 4.5, 2.5, 1],
      
      // RRG: Recovery gap (lower is better, so invert)
      RRG: [0, 8, 6, 4, 2, 1]
    };

    const dimensionMapping = mappings[dimension];
    if (!dimensionMapping) return 5; // Default to middle if unknown
    
    return dimensionMapping[response] || 5;
  }

  /**
   * Metric-based interpretation (v2.0.0)
   * Uses actual metric values to determine DII score
   */
  private static getMetricBasedInterpretation(
    dimension: DIIDimension,
    response: number,
    metric: NonNullable<DimensionInterpretation['metric']>
  ): number {
    // Each dimension has different metric types and scales
    switch (dimension) {
      case 'TRD': {
        // Time Resilience: hours until 10% revenue loss
        const hours = metric.hours || 24;
        // Map hours to 1-10 scale (lower hours = worse score)
        if (hours <= 2) return 1.5;
        if (hours <= 4) return 3.5;
        if (hours <= 8) return 5.5;
        if (hours <= 24) return 7.5;
        return 9.5;
      }
      
      case 'AER': {
        // Asset Exposure: value extraction ratio
        const ratio = metric.ratio || 5;
        // Map ratio to 1-10 scale (higher ratio = worse score)
        if (ratio >= 10) return 2;
        if (ratio >= 5) return 4;
        if (ratio >= 2) return 6;
        if (ratio >= 1) return 8;
        return 10;
      }
      
      case 'HFP': {
        // Human Factor: failure percentage
        const percentage = metric.percentage || 50;
        // Map percentage to 1-10 scale (higher % = worse score)
        if (percentage >= 80) return 9;
        if (percentage >= 60) return 7;
        if (percentage >= 40) return 5;
        if (percentage >= 20) return 3;
        return 1;
      }
      
      case 'BRI': {
        // Blast Radius: impact percentage
        const percentage = metric.percentage || 50;
        // Map percentage to 1-10 scale (higher % = worse score)
        if (percentage >= 80) return 8.5;
        if (percentage >= 60) return 6.5;
        if (percentage >= 40) return 4.5;
        if (percentage >= 20) return 2.5;
        return 1;
      }
      
      case 'RRG': {
        // Recovery Gap: recovery time multiplier
        const multiplier = metric.multiplier || 3;
        // Map multiplier to 1-10 scale (higher multiplier = worse score)
        if (multiplier >= 10) return 8;
        if (multiplier >= 5) return 6;
        if (multiplier >= 3) return 4;
        if (multiplier >= 2) return 2;
        return 1;
      }
      
      default:
        // Fallback to response-based mapping
        return this.getBaseInterpretation(dimension, response);
    }
  }

  /**
   * Adjust based on business model characteristics
   */
  private static applyBusinessModelAdjustment(
    dimension: DIIDimension,
    baseValue: number,
    businessModel: BusinessModel
  ): number {
    // DII model-specific adjustments based on inherent cyber vulnerabilities
    const adjustments: Partial<Record<BusinessModel, Partial<Record<DIIDimension, number>>>> = {
      // DII-specific models
      COMERCIO_HIBRIDO: {
        TRD: -0.5,  // Omnichannel complexity reduces resilience
        BRI: -0.5,  // Physical+digital = wider blast radius
        HFP: -0.5   // More touchpoints = more human risk
      },
      SOFTWARE_CRITICO: {
        TRD: -1,    // Zero tolerance for downtime
        AER: -0.5,  // High concentration of customer data
        HFP: +0.5   // Better automation and controls
      },
      SERVICIOS_DATOS: {
        AER: -1.5,  // Data IS the product - extreme exposure
        HFP: -0.5,  // Insider threat is catastrophic
        RRG: -0.5   // Data breach = permanent damage
      },
      ECOSISTEMA_DIGITAL: {
        HFP: -1,    // Third-party users multiply risk
        BRI: -1.5,  // Platform effects cascade failures
        AER: -1     // Ecosystem = bigger target
      },
      SERVICIOS_FINANCIEROS: {
        TRD: -1.5,  // Real-time ops = no downtime tolerance
        AER: -1,    // Financial data = prime target
        RRG: +0.5   // Regulatory requirements = better DR
      },
      INFRAESTRUCTURA_HEREDADA: {
        TRD: +1,    // Manual fallbacks provide buffer
        HFP: -1,    // Legacy = poor access controls
        RRG: -1.5   // Legacy recovery is complex/slow
      },
      CADENA_SUMINISTRO: {
        BRI: -1,    // Supply chain = cascading failures
        HFP: -0.5,  // Partner access multiplies risk
        AER: +0.5   // Distributed assets = less concentration
      },
      INFORMACION_REGULADA: {
        AER: -1.5,  // Regulated data = high-value target
        TRD: -0.5,  // Healthcare/gov can't have downtime
        HFP: -0.5   // Compliance theater vs real security
      },
      // Legacy models (kept for backwards compatibility)
      SUBSCRIPTION_BASED: {
        TRD: -0.5,
        AER: -0.5,
        HFP: +0.5
      },
      TRANSACTION_BASED: {
        TRD: -1,
        BRI: +0.5,
        RRG: -0.5
      },
      ASSET_HEAVY: {
        TRD: +0.5,
        BRI: +1,
        RRG: -1
      },
      DATA_DRIVEN: {
        AER: -1,
        HFP: +0.5,
        RRG: -0.5
      },
      PLATFORM_ECOSYSTEM: {
        HFP: -1,
        BRI: -1,
        AER: -0.5
      }
    };

    const modelAdjustment = adjustments[businessModel]?.[dimension] || 0;
    return baseValue + modelAdjustment;
  }

  /**
   * Adjust based on company size and resources
   */
  private static applyCompanySizeAdjustment(
    dimension: DIIDimension,
    currentValue: number,
    company: CompanyInfo
  ): number {
    const employees = company.employees || 100;
    const revenue = company.revenue || 10000000; // $10M default

    // Size categories
    let sizeCategory: 'small' | 'medium' | 'large';
    if (employees < 100 || revenue < 10000000) {
      sizeCategory = 'small';
    } else if (employees < 1000 || revenue < 100000000) {
      sizeCategory = 'medium';
    } else {
      sizeCategory = 'large';
    }

    // Size adjustments per dimension
    const sizeAdjustments: Record<typeof sizeCategory, Partial<Record<DIIDimension, number>>> = {
      small: {
        TRD: -0.5, // Less resources for redundancy
        AER: +0.5, // Smaller attack surface
        HFP: -0.5, // Less security training
        BRI: +0.5, // Simpler systems
        RRG: -0.5  // Less DR capability
      },
      medium: {
        // Balanced, no adjustments
      },
      large: {
        TRD: +0.5, // Better resources
        AER: -0.5, // Bigger target
        HFP: +0.5, // Better processes
        BRI: -0.5, // Complex systems
        RRG: +0.5  // Better DR capability
      }
    };

    const adjustment = sizeAdjustments[sizeCategory][dimension] || 0;
    return currentValue + adjustment;
  }

  /**
   * Apply critical infrastructure penalty
   */
  private static applyCriticalInfraAdjustment(
    dimension: DIIDimension,
    currentValue: number,
    isCritical: boolean
  ): number {
    if (!isCritical) return currentValue;

    // Critical infrastructure faces higher standards
    const criticalPenalties: Partial<Record<DIIDimension, number>> = {
      TRD: -0.5, // Zero tolerance for downtime
      AER: -1,   // Prime target
      HFP: -0.5, // Higher insider threat risk
      BRI: -1,   // Cascading effects
      RRG: -0.5  // Regulatory requirements
    };

    const penalty = criticalPenalties[dimension] || 0;
    return currentValue + penalty;
  }

  /**
   * Calculate confidence in interpretation
   */
  private static calculateConfidence(context: InterpretationContext): number {
    let confidence = 0.7; // Base confidence

    // Increase confidence with more company data
    if (context.company.employees) confidence += 0.1;
    if (context.company.revenue) confidence += 0.1;
    if (context.company.industry) confidence += 0.05;
    if (context.company.dataSource === 'ai') confidence += 0.05;

    return Math.min(1, confidence);
  }

  /**
   * Generate human-readable reasoning
   */
  private static generateReasoning(
    dimension: DIIDimension,
    response: number,
    interpreted: number,
    context: InterpretationContext
  ): string {
    const responseLabels = ['muy deficiente', 'deficiente', 'regular', 'bueno', 'muy bueno'];
    const responseLabel = responseLabels[response - 1];

    const sizeLabel = context.company.employees 
      ? context.company.employees > 1000 ? 'gran empresa' 
      : context.company.employees > 100 ? 'empresa mediana'
      : 'empresa pequeña'
      : 'empresa';

    const criticalNote = context.criticalInfra 
      ? ' Como infraestructura crítica, se aplican estándares más estrictos.'
      : '';

    return `Respuesta "${responseLabel}" interpretada como ${interpreted}/10 para ${dimension}. ` +
           `Ajustado para ${sizeLabel} en sector ${context.businessModel}.${criticalNote}`;
  }

  /**
   * Interpret all responses for complete DII calculation
   */
  static interpretAllResponses(
    responses: Map<DIIDimension, number>,
    context: InterpretationContext,
    metrics?: Map<DIIDimension, DimensionInterpretation['metric']>
  ): Record<DIIDimension, DimensionInterpretation> {
    const dimensions: DIIDimension[] = ['TRD', 'AER', 'HFP', 'BRI', 'RRG'];
    const interpretations: Record<string, DimensionInterpretation> = {};

    for (const dimension of dimensions) {
      const response = responses.get(dimension);
      if (response) {
        const metric = metrics?.get(dimension);
        interpretations[dimension] = this.interpretResponse(dimension, response, context, metric);
      }
    }

    return interpretations as Record<DIIDimension, DimensionInterpretation>;
  }
}