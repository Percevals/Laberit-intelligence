/**
 * Unit Tests for DII Dimension Converters
 * Tests all conversion logic with real-world scenarios
 */

import {
  DimensionConverterFactory,
  TRDConverter,
  AERConverter,
  HFPConverter,
  BRIConverter,
  RRGConverter,
  convertMultipleDimensions,
  validateDimensionInput,
  ValidationRules,
  type DIIDimension,
  type BusinessModelId
} from './dimension-converters';

describe('DimensionConverters', () => {
  
  describe('TRDConverter', () => {
    const converter = new TRDConverter();

    test('converts hours to TRD scores correctly', () => {
      expect(converter.convertToScore(1, 1)).toBe(2.0); // < 2h = Critical
      expect(converter.convertToScore(4, 1)).toBe(4.0 * 1.2); // 2-6h with COMERCIO_HIBRIDO adjustment
      expect(converter.convertToScore(12, 1)).toBe(6.0 * 1.2); // 6-24h
      expect(converter.convertToScore(48, 1)).toBe(8.0 * 1.2); // 24-72h
      expect(converter.convertToScore(100, 1)).toBe(9.5 * 1.2); // > 72h
    });

    test('applies business model adjustments', () => {
      const baseScore = 6.0; // 12 hours baseline
      expect(converter.convertToScore(12, 1)).toBe(baseScore * 1.2); // COMERCIO_HIBRIDO - physical backup
      expect(converter.convertToScore(12, 2)).toBe(baseScore * 0.8); // SOFTWARE_CRITICO - zero tolerance
      expect(converter.convertToScore(12, 5)).toBe(baseScore * 0.7); // SERVICIOS_FINANCIEROS - critical ops
    });

    test('clamps scores to valid range', () => {
      expect(converter.convertToScore(1, 5)).toBeGreaterThanOrEqual(1.0);
      expect(converter.convertToScore(1000, 1)).toBeLessThanOrEqual(10.0);
    });

    test('provides meaningful interpretations', () => {
      expect(converter.getInterpretation(2.0)).toContain('Critical');
      expect(converter.getInterpretation(5.0)).toContain('Vulnerable');
      expect(converter.getInterpretation(7.0)).toContain('Moderate');
      expect(converter.getInterpretation(8.5)).toContain('Resilient');
      expect(converter.getInterpretation(9.5)).toContain('Exceptional');
    });

    test('reverse conversion provides readable format', () => {
      expect(converter.reverseConvert(2.0)).toContain('hours');
      expect(converter.reverseConvert(9.0)).toContain('week');
    });
  });

  describe('AERConverter', () => {
    const converter = new AERConverter();

    test('converts dollar values to AER scores correctly', () => {
      expect(converter.convertToScore(5000, 1)).toBe(9.0); // < $10K = Unattractive
      expect(converter.convertToScore(30000, 1)).toBe(7.0); // $10K-50K = Low interest
      expect(converter.convertToScore(100000, 1)).toBe(5.0); // $50K-200K = Moderate
      expect(converter.convertToScore(500000, 1)).toBe(3.0); // $200K-1M = High value
      expect(converter.convertToScore(2000000, 1)).toBe(1.5); // > $1M = Prime target
    });

    test('applies business model adjustments for high-value targets', () => {
      const baseScore = 5.0; // $100K baseline
      expect(converter.convertToScore(100000, 3)).toBe(baseScore * 0.8); // SERVICIOS_DATOS - data premium
      expect(converter.convertToScore(100000, 5)).toBe(baseScore * 0.7); // SERVICIOS_FINANCIEROS - financial access
    });

    test('interpretation reflects attacker interest', () => {
      expect(converter.getInterpretation(1.5)).toContain('Prime Target');
      expect(converter.getInterpretation(3.0)).toContain('High Value');
      expect(converter.getInterpretation(9.0)).toContain('Unattractive');
    });
  });

  describe('HFPConverter', () => {
    const converter = new HFPConverter();

    test('converts phishing failure rates to HFP scores correctly', () => {
      expect(converter.convertToScore(3, 2)).toBe(8.5 * 1.1); // < 5% with SOFTWARE_CRITICO adjustment
      expect(converter.convertToScore(10, 1)).toBe(7.0 * 0.9); // 5-15% with COMERCIO_HIBRIDO adjustment
      expect(converter.convertToScore(25, 1)).toBe(5.0 * 0.9); // 15-30%
      expect(converter.convertToScore(40, 1)).toBe(3.0 * 0.9); // 30-50%
      expect(converter.convertToScore(70, 1)).toBe(1.5 * 0.9); // > 50%
    });

    test('business model adjustments reflect workforce sophistication', () => {
      const baseScore = 7.0; // 10% failure rate baseline
      expect(converter.convertToScore(10, 2)).toBe(baseScore * 1.1); // SOFTWARE_CRITICO - technical staff
      expect(converter.convertToScore(10, 6)).toBe(baseScore * 0.8); // INFRAESTRUCTURA_HEREDADA - legacy practices
    });

    test('interpretation reflects security culture maturity', () => {
      expect(converter.getInterpretation(1.5)).toContain('Critical');
      expect(converter.getInterpretation(8.5)).toContain('Excellent');
    });
  });

  describe('BRIConverter', () => {
    const converter = new BRIConverter();

    test('converts blast radius percentages to BRI scores correctly', () => {
      expect(converter.convertToScore(15, 1)).toBe(8.0 * 1.1); // < 20% with COMERCIO_HIBRIDO adjustment
      expect(converter.convertToScore(30, 1)).toBe(6.5 * 1.1); // 20-40%
      expect(converter.convertToScore(50, 1)).toBe(4.5 * 1.1); // 40-60%
      expect(converter.convertToScore(70, 1)).toBe(2.5 * 1.1); // 60-80%
      expect(converter.convertToScore(90, 1)).toBe(1.0 * 1.1); // 80-100%
    });

    test('business model adjustments reflect integration patterns', () => {
      const baseScore = 6.5; // 30% blast radius baseline
      expect(converter.convertToScore(30, 4)).toBe(baseScore * 0.8); // ECOSISTEMA_DIGITAL - broad integration
      expect(converter.convertToScore(30, 7)).toBe(baseScore * 0.8); // CADENA_SUMINISTRO - partner integration
    });

    test('interpretation reflects containment capability', () => {
      expect(converter.getInterpretation(1.0)).toContain('No Isolation');
      expect(converter.getInterpretation(8.0)).toContain('Well Segmented');
    });
  });

  describe('RRGConverter', () => {
    const converter = new RRGConverter();

    test('converts recovery multipliers to RRG scores correctly', () => {
      expect(converter.convertToScore(1.2, 5)).toBe(9.0 * 1.2); // 1x with SERVICIOS_FINANCIEROS adjustment
      expect(converter.convertToScore(1.8, 1)).toBe(7.0); // 1.5-2x
      expect(converter.convertToScore(2.5, 1)).toBe(5.0); // 2-3x
      expect(converter.convertToScore(4.0, 1)).toBe(3.0); // 3-5x
      expect(converter.convertToScore(10.0, 1)).toBe(1.5); // > 5x
    });

    test('business model adjustments reflect recovery capability', () => {
      const baseScore = 7.0; // 1.8x multiplier baseline
      expect(converter.convertToScore(1.8, 5)).toBe(baseScore * 1.2); // SERVICIOS_FINANCIEROS - regulatory DR
      expect(converter.convertToScore(1.8, 6)).toBe(baseScore * 0.8); // INFRAESTRUCTURA_HEREDADA - harder to restore
    });

    test('interpretation reflects recovery reliability', () => {
      expect(converter.getInterpretation(1.5)).toContain('No Real Recovery');
      expect(converter.getInterpretation(9.0)).toContain('Meets Plan');
    });
  });

  describe('DimensionConverterFactory', () => {
    test('provides access to all converters', () => {
      expect(DimensionConverterFactory.get('TRD')).toBeInstanceOf(TRDConverter);
      expect(DimensionConverterFactory.get('AER')).toBeInstanceOf(AERConverter);
      expect(DimensionConverterFactory.get('HFP')).toBeInstanceOf(HFPConverter);
      expect(DimensionConverterFactory.get('BRI')).toBeInstanceOf(BRIConverter);
      expect(DimensionConverterFactory.get('RRG')).toBeInstanceOf(RRGConverter);
    });

    test('throws error for invalid dimension', () => {
      expect(() => DimensionConverterFactory.get('INVALID' as DIIDimension)).toThrow();
    });

    test('convert method returns complete ConversionResult', () => {
      const result = DimensionConverterFactory.convert('TRD', 6, 2);
      expect(result).toHaveProperty('score');
      expect(result).toHaveProperty('interpretation');
      expect(result).toHaveProperty('originalValue', 6);
      expect(result).toHaveProperty('dimension', 'TRD');
      expect(result).toHaveProperty('businessModel', 2);
      expect(result).toHaveProperty('adjustmentApplied');
    });

    test('getAllDimensions returns all dimension types', () => {
      const dimensions = DimensionConverterFactory.getAllDimensions();
      expect(dimensions).toContain('TRD');
      expect(dimensions).toContain('AER');
      expect(dimensions).toContain('HFP');
      expect(dimensions).toContain('BRI');
      expect(dimensions).toContain('RRG');
      expect(dimensions).toHaveLength(5);
    });
  });

  describe('convertMultipleDimensions', () => {
    test('converts multiple dimensions in batch', () => {
      const responses = {
        TRD: 6,
        AER: 100000,
        HFP: 20
      };
      
      const results = convertMultipleDimensions(responses, 2); // SOFTWARE_CRITICO
      
      expect(results.TRD.score).toBe(4.0 * 0.8); // TRD: 6h with adjustment
      expect(results.AER.score).toBe(5.0); // AER: $100K no adjustment for model 2
      expect(results.HFP.score).toBe(5.0 * 1.1); // HFP: 20% with adjustment
    });

    test('handles partial dimension sets', () => {
      const responses = { TRD: 12 };
      const results = convertMultipleDimensions(responses, 1);
      
      expect(results.TRD).toBeDefined();
      expect(results.AER).toBeUndefined();
    });
  });

  describe('Validation', () => {
    test('validateDimensionInput accepts valid ranges', () => {
      expect(validateDimensionInput('TRD', 24)).toBe(true);
      expect(validateDimensionInput('AER', 50000)).toBe(true);
      expect(validateDimensionInput('HFP', 15)).toBe(true);
      expect(validateDimensionInput('BRI', 40)).toBe(true);
      expect(validateDimensionInput('RRG', 2.5)).toBe(true);
    });

    test('validateDimensionInput rejects invalid ranges', () => {
      expect(validateDimensionInput('TRD', -5)).toBe(false);
      expect(validateDimensionInput('TRD', 200)).toBe(false);
      expect(validateDimensionInput('HFP', 150)).toBe(false);
      expect(validateDimensionInput('RRG', 0.5)).toBe(false);
    });

    test('ValidationRules define proper bounds', () => {
      expect(ValidationRules.TRD.max).toBe(168); // 1 week max
      expect(ValidationRules.HFP.max).toBe(100); // 100% max
      expect(ValidationRules.RRG.min).toBe(1); // 1x minimum
    });
  });

  describe('Real-world scenarios', () => {
    test('Critical infrastructure scenario', () => {
      // Utility company: Legacy systems, long recovery, high blast radius
      const responses = {
        TRD: 2, // 2 hours - critical infrastructure
        AER: 500000, // $500K potential impact
        HFP: 35, // 35% phishing failure - legacy training
        BRI: 75, // 75% blast radius - interconnected OT/IT
        RRG: 4 // 4x recovery gap - complex restoration
      };
      
      const results = convertMultipleDimensions(responses, 6); // INFRAESTRUCTURA_HEREDADA
      
      expect(results.TRD.score).toBeLessThan(3); // Critical TRD
      expect(results.BRI.score).toBeLessThan(3); // Poor isolation
      expect(results.RRG.score).toBeLessThan(4); // Major recovery gap
    });

    test('Fintech startup scenario', () => {
      // Modern fintech: Good automation, high value target, decent practices
      const responses = {
        TRD: 4, // 4 hours - some tolerance
        AER: 2000000, // $2M - prime target
        HFP: 8, // 8% - good security culture
        BRI: 25, // 25% - decent segmentation
        RRG: 1.3 // 1.3x - automation helps
      };
      
      const results = convertMultipleDimensions(responses, 5); // SERVICIOS_FINANCIEROS
      
      expect(results.AER.score).toBeLessThan(2); // Prime target with financial adjustment
      expect(results.TRD.score).toBeLessThan(4); // Strict uptime requirements
      expect(results.RRG.score).toBeGreaterThan(8); // Good recovery with regulatory requirements
    });

    test('E-commerce platform scenario', () => {
      // Hybrid commerce: Physical + digital channels
      const responses = {
        TRD: 8, // 8 hours - physical stores provide backup
        AER: 150000, // $150K - moderate target
        HFP: 18, // 18% - mixed workforce
        BRI: 45, // 45% - channel isolation helps
        RRG: 2.2 // 2.2x - some manual processes
      };
      
      const results = convertMultipleDimensions(responses, 1); // COMERCIO_HIBRIDO
      
      expect(results.TRD.score).toBeGreaterThan(6); // Benefits from physical backup
      expect(results.BRI.score).toBeGreaterThan(4); // Natural isolation helps
    });
  });
});

/**
 * Integration tests for full conversion pipeline
 */
describe('Integration Tests', () => {
  test('end-to-end conversion matches expected DII input format', () => {
    const responses = {
      TRD: 6,
      AER: 100000,
      HFP: 15,
      BRI: 30,
      RRG: 2.0
    };
    
    const results = convertMultipleDimensions(responses, 2); // SOFTWARE_CRITICO
    
    // Verify all scores are in valid 1-10 range for DII calculation
    Object.values(results).forEach(result => {
      expect(result.score).toBeGreaterThanOrEqual(1.0);
      expect(result.score).toBeLessThanOrEqual(10.0);
    });
    
    // Verify metadata is complete
    Object.values(results).forEach(result => {
      expect(result.interpretation).toBeTruthy();
      expect(result.originalValue).toBeDefined();
      expect(result.businessModel).toBe(2);
    });
  });

  test('business model adjustments create meaningful differentiation', () => {
    const trdHours = 6;
    
    // Same input, different business models should yield different scores
    const comercioResult = DimensionConverterFactory.convert('TRD', trdHours, 1);
    const softwareResult = DimensionConverterFactory.convert('TRD', trdHours, 2);
    const financialResult = DimensionConverterFactory.convert('TRD', trdHours, 5);
    
    expect(comercioResult.score).toBeGreaterThan(softwareResult.score);
    expect(softwareResult.score).toBeGreaterThan(financialResult.score);
    
    // Adjustments should be flagged
    expect(comercioResult.adjustmentApplied).toBe(true);
    expect(softwareResult.adjustmentApplied).toBe(true);
    expect(financialResult.adjustmentApplied).toBe(true);
  });
});