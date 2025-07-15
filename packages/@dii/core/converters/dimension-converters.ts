/**
 * DII Dimension Conversion System
 * Normalizes user responses to 1-10 scale for accurate DII calculation
 * 
 * Each dimension has specific conversion logic based on real-world cyber risk data
 */

export type DIIDimension = 'TRD' | 'AER' | 'HFP' | 'BRI' | 'RRG';
export type BusinessModelId = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

/**
 * Base interface for dimension converters
 */
export interface DimensionConverter {
  dimension: DIIDimension;
  convertToScore(responseValue: number, businessModel: BusinessModelId): number;
  getInterpretation(score: number): string;
  reverseConvert(score: number): string;
}

/**
 * Conversion result with metadata
 */
export interface ConversionResult {
  score: number;
  interpretation: string;
  originalValue: number;
  dimension: DIIDimension;
  businessModel: BusinessModelId;
  adjustmentApplied: boolean;
}

/**
 * Business model adjustment function type
 */
type ModelAdjustment = (score: number) => number;

/**
 * TRD (Time to Revenue Degradation) Converter
 * Input: Hours until 10% revenue loss
 * Scale: Lower hours = Lower score (worse resilience)
 */
export class TRDConverter implements DimensionConverter {
  dimension: DIIDimension = 'TRD';

  private readonly conversionTable = [
    { maxHours: 2, score: 2.0, label: 'Critical' },
    { maxHours: 6, score: 4.0, label: 'Vulnerable' },
    { maxHours: 24, score: 6.0, label: 'Moderate' },
    { maxHours: 72, score: 8.0, label: 'Resilient' },
    { maxHours: Infinity, score: 9.5, label: 'Exceptional' }
  ];

  private readonly modelAdjustments: Partial<Record<BusinessModelId, ModelAdjustment>> = {
    1: (score) => score * 1.2, // COMERCIO_HIBRIDO - Physical backup channels
    2: (score) => score * 0.8, // SOFTWARE_CRITICO - Zero downtime tolerance
    5: (score) => score * 0.7, // SERVICIOS_FINANCIEROS - Critical real-time ops
    6: (score) => score * 0.9, // INFRAESTRUCTURA_HEREDADA - Slower to recover
    8: (score) => score * 0.8  // INFORMACION_REGULADA - Mission critical
  };

  convertToScore(hours: number, businessModel: BusinessModelId): number {
    // Find base score from conversion table
    const entry = this.conversionTable.find(e => hours < e.maxHours);
    let score = entry?.score || 2.0;

    // Apply business model adjustment
    const adjustment = this.modelAdjustments[businessModel];
    if (adjustment) {
      score = adjustment(score);
    }

    // Clamp to valid range
    return Math.max(1.0, Math.min(10.0, score));
  }

  getInterpretation(score: number): string {
    if (score <= 3) return 'Critical - Immediate revenue impact expected';
    if (score <= 5) return 'Vulnerable - Revenue degradation likely within hours';
    if (score <= 7) return 'Moderate - Can sustain short-term disruptions';
    if (score <= 8.5) return 'Resilient - Good tolerance for operational issues';
    return 'Exceptional - Can maintain revenue through extended disruptions';
  }

  reverseConvert(score: number): string {
    if (score <= 3) return '< 6 hours until revenue impact';
    if (score <= 5) return '6-24 hours resilience window';
    if (score <= 7) return '1-3 days operational buffer';
    if (score <= 8.5) return '3+ days resilience capacity';
    return '> 1 week revenue protection';
  }
}

/**
 * AER (Attack Economics Ratio) Converter
 * Input: Value extractable vs attack cost
 * Scale: Higher value = Lower score (more attractive target)
 */
export class AERConverter implements DimensionConverter {
  dimension: DIIDimension = 'AER';

  private readonly conversionTable = [
    { maxValue: 10000, score: 9.0, label: 'Unattractive' },
    { maxValue: 50000, score: 7.0, label: 'Low Interest' },
    { maxValue: 200000, score: 5.0, label: 'Moderate Target' },
    { maxValue: 1000000, score: 3.0, label: 'High Value Target' },
    { maxValue: Infinity, score: 1.5, label: 'Prime Target' }
  ];

  private readonly modelAdjustments: Partial<Record<BusinessModelId, ModelAdjustment>> = {
    3: (score) => score * 0.8, // SERVICIOS_DATOS - High value data concentration
    4: (score) => score * 0.9, // ECOSISTEMA_DIGITAL - Multiple valuable endpoints
    5: (score) => score * 0.7, // SERVICIOS_FINANCIEROS - Direct financial access
    8: (score) => score * 0.8  // INFORMACION_REGULADA - Sensitive data premium
  };

  convertToScore(dollarValue: number, businessModel: BusinessModelId): number {
    const entry = this.conversionTable.find(e => dollarValue < e.maxValue);
    let score = entry?.score || 1.5;

    const adjustment = this.modelAdjustments[businessModel];
    if (adjustment) {
      score = adjustment(score);
    }

    return Math.max(1.0, Math.min(10.0, score));
  }

  getInterpretation(score: number): string {
    if (score <= 2) return 'Prime Target - Extremely attractive to attackers';
    if (score <= 4) return 'High Value - Regular target for sophisticated attacks';
    if (score <= 6) return 'Moderate Target - Opportunistic attacks likely';
    if (score <= 8) return 'Low Interest - Commodity attacks only';
    return 'Unattractive - Not economically viable for most attackers';
  }

  reverseConvert(score: number): string {
    if (score <= 2) return '> $1M potential value extraction';
    if (score <= 4) return '$200K - $1M attack value';
    if (score <= 6) return '$50K - $200K potential extraction';
    if (score <= 8) return '$10K - $50K limited value';
    return '< $10K minimal attack value';
  }
}

/**
 * HFP (Human Failure Probability) Converter
 * Input: Percentage who fail phishing tests
 * Scale: Higher % = Lower score (worse human factor)
 */
export class HFPConverter implements DimensionConverter {
  dimension: DIIDimension = 'HFP';

  private readonly conversionTable = [
    { maxPercent: 5, score: 8.5, label: 'Excellent' },
    { maxPercent: 15, score: 7.0, label: 'Good' },
    { maxPercent: 30, score: 5.0, label: 'Average' },
    { maxPercent: 50, score: 3.0, label: 'Poor' },
    { maxPercent: Infinity, score: 1.5, label: 'Critical' }
  ];

  private readonly modelAdjustments: Partial<Record<BusinessModelId, ModelAdjustment>> = {
    1: (score) => score * 0.9, // COMERCIO_HIBRIDO - Multiple touchpoints increase risk
    2: (score) => score * 1.1, // SOFTWARE_CRITICO - Technical staff, better training
    3: (score) => score * 1.1, // SERVICIOS_DATOS - Data-aware workforce
    6: (score) => score * 0.8, // INFRAESTRUCTURA_HEREDADA - Legacy practices
    8: (score) => score * 1.0  // INFORMACION_REGULADA - Compliance training
  };

  convertToScore(failurePercent: number, businessModel: BusinessModelId): number {
    const entry = this.conversionTable.find(e => failurePercent <= e.maxPercent);
    let score = entry?.score || 1.5;

    const adjustment = this.modelAdjustments[businessModel];
    if (adjustment) {
      score = adjustment(score);
    }

    return Math.max(1.0, Math.min(10.0, score));
  }

  getInterpretation(score: number): string {
    if (score <= 2) return 'Critical - Humans are primary vulnerability';
    if (score <= 4) return 'Poor - Significant social engineering risk';
    if (score <= 6) return 'Average - Standard human factor risk';
    if (score <= 7.5) return 'Good - Above average security awareness';
    return 'Excellent - Strong security culture established';
  }

  reverseConvert(score: number): string {
    if (score <= 2) return '> 50% phishing failure rate';
    if (score <= 4) return '30-50% susceptible to social engineering';
    if (score <= 6) return '15-30% average failure rate';
    if (score <= 7.5) return '5-15% good awareness level';
    return '< 5% excellent security culture';
  }
}

/**
 * BRI (Blast Radius Index) Converter  
 * Input: % systems accessible from initial compromise
 * Scale: Higher % = Lower score (worse isolation)
 */
export class BRIConverter implements DimensionConverter {
  dimension: DIIDimension = 'BRI';

  private readonly conversionTable = [
    { maxPercent: 20, score: 8.0, label: 'Well Segmented' },
    { maxPercent: 40, score: 6.5, label: 'Good Isolation' },
    { maxPercent: 60, score: 4.5, label: 'Limited Isolation' },
    { maxPercent: 80, score: 2.5, label: 'Poor Isolation' },
    { maxPercent: 100, score: 1.0, label: 'No Isolation' }
  ];

  private readonly modelAdjustments: Partial<Record<BusinessModelId, ModelAdjustment>> = {
    1: (score) => score * 1.1, // COMERCIO_HIBRIDO - Natural channel isolation
    2: (score) => score * 0.9, // SOFTWARE_CRITICO - Interconnected systems
    4: (score) => score * 0.8, // ECOSISTEMA_DIGITAL - Broad integration
    5: (score) => score * 0.9, // SERVICIOS_FINANCIEROS - Interconnected for real-time
    7: (score) => score * 0.8  // CADENA_SUMINISTRO - Partner integration
  };

  convertToScore(blastPercent: number, businessModel: BusinessModelId): number {
    const entry = this.conversionTable.find(e => blastPercent <= e.maxPercent);
    let score = entry?.score || 1.0;

    const adjustment = this.modelAdjustments[businessModel];
    if (adjustment) {
      score = adjustment(score);
    }

    return Math.max(1.0, Math.min(10.0, score));
  }

  getInterpretation(score: number): string {
    if (score <= 2) return 'No Isolation - Complete network compromise likely';
    if (score <= 4) return 'Poor Isolation - Major systems at risk from single breach';
    if (score <= 6) return 'Limited Isolation - Moderate containment capability';
    if (score <= 7.5) return 'Good Isolation - Can limit blast radius effectively';
    return 'Well Segmented - Excellent breach containment';
  }

  reverseConvert(score: number): string {
    if (score <= 2) return '80-100% systems accessible from breach';
    if (score <= 4) return '60-80% lateral movement possible';
    if (score <= 6) return '40-60% limited segmentation';
    if (score <= 7.5) return '20-40% good isolation boundaries';
    return '< 20% well-segmented environment';
  }
}

/**
 * RRG (Recovery Reality Gap) Converter
 * Input: Actual vs planned recovery time multiplier
 * Scale: Higher gap = Lower score (worse recovery capability)
 */
export class RRGConverter implements DimensionConverter {
  dimension: DIIDimension = 'RRG';

  private readonly conversionTable = [
    { maxMultiplier: 1.5, score: 9.0, label: 'Meets Plan' },
    { maxMultiplier: 2.0, score: 7.0, label: 'Minor Gap' },
    { maxMultiplier: 3.0, score: 5.0, label: 'Moderate Gap' },
    { maxMultiplier: 5.0, score: 3.0, label: 'Major Gap' },
    { maxMultiplier: Infinity, score: 1.5, label: 'No Real Recovery' }
  ];

  private readonly modelAdjustments: Partial<Record<BusinessModelId, ModelAdjustment>> = {
    2: (score) => score * 1.1, // SOFTWARE_CRITICO - Better automation
    5: (score) => score * 1.2, // SERVICIOS_FINANCIEROS - Regulatory DR requirements
    6: (score) => score * 0.8, // INFRAESTRUCTURA_HEREDADA - Harder to restore
    8: (score) => score * 1.1  // INFORMACION_REGULADA - Compliance-driven processes
  };

  convertToScore(multiplier: number, businessModel: BusinessModelId): number {
    const entry = this.conversionTable.find(e => multiplier <= e.maxMultiplier);
    let score = entry?.score || 1.5;

    const adjustment = this.modelAdjustments[businessModel];
    if (adjustment) {
      score = adjustment(score);
    }

    return Math.max(1.0, Math.min(10.0, score));
  }

  getInterpretation(score: number): string {
    if (score <= 2) return 'No Real Recovery - Plans are theoretical only';
    if (score <= 4) return 'Major Gap - Recovery takes much longer than planned';
    if (score <= 6) return 'Moderate Gap - Some deviation from recovery plans';
    if (score <= 8) return 'Minor Gap - Generally meets recovery objectives';
    return 'Meets Plan - Reliable and tested recovery capability';
  }

  reverseConvert(score: number): string {
    if (score <= 2) return '> 5x longer than planned recovery';
    if (score <= 4) return '3-5x recovery time multiplier';
    if (score <= 6) return '2-3x actual vs planned recovery';
    if (score <= 8) return '1.5-2x minor recovery delays';
    return '~ 1x recovery meets planned timelines';
  }
}

/**
 * Factory for accessing dimension converters
 */
export class DimensionConverterFactory {
  private static converters: Map<DIIDimension, DimensionConverter> = new Map<DIIDimension, DimensionConverter>([
    ['TRD', new TRDConverter()],
    ['AER', new AERConverter()],
    ['HFP', new HFPConverter()],
    ['BRI', new BRIConverter()],
    ['RRG', new RRGConverter()]
  ] as [DIIDimension, DimensionConverter][]);

  static get(dimension: DIIDimension): DimensionConverter {
    const converter = this.converters.get(dimension);
    if (!converter) {
      throw new Error(`No converter found for dimension: ${dimension}`);
    }
    return converter;
  }

  static convert(
    dimension: DIIDimension, 
    value: number, 
    businessModel: BusinessModelId
  ): ConversionResult {
    const converter = this.get(dimension);
    const score = converter.convertToScore(value, businessModel);
    
    return {
      score,
      interpretation: converter.getInterpretation(score),
      originalValue: value,
      dimension,
      businessModel,
      adjustmentApplied: this.hasModelAdjustment(dimension, businessModel)
    };
  }

  static getAllDimensions(): DIIDimension[] {
    return Array.from(this.converters.keys());
  }

  private static hasModelAdjustment(dimension: DIIDimension, businessModel: BusinessModelId): boolean {
    const converter = this.get(dimension) as any;
    return !!(converter.modelAdjustments && converter.modelAdjustments[businessModel]);
  }
}

/**
 * Batch conversion utility for multiple dimensions
 */
export function convertMultipleDimensions(
  responses: Partial<Record<DIIDimension, number>>,
  businessModel: BusinessModelId
): Record<DIIDimension, ConversionResult> {
  const results: Record<string, ConversionResult> = {};
  
  for (const [dimension, value] of Object.entries(responses)) {
    if (value !== undefined) {
      results[dimension] = DimensionConverterFactory.convert(
        dimension as DIIDimension,
        value,
        businessModel
      );
    }
  }
  
  return results as Record<DIIDimension, ConversionResult>;
}

/**
 * Validation utilities
 */
export const ValidationRules = {
  TRD: { min: 0, max: 168, unit: 'hours' }, // Max 1 week
  AER: { min: 0, max: 10000000, unit: 'USD' }, // Max $10M
  HFP: { min: 0, max: 100, unit: 'percentage' },
  BRI: { min: 0, max: 100, unit: 'percentage' },
  RRG: { min: 1, max: 20, unit: 'multiplier' } // Max 20x gap
};

export function validateDimensionInput(dimension: DIIDimension, value: number): boolean {
  const rule = ValidationRules[dimension];
  return value >= rule.min && value <= rule.max;
}