/**
 * Tests for Enhanced Business Model Classifier
 * Validates classification accuracy for known company patterns
 */

import { EnhancedBusinessModelClassifier, classifyBusinessModel } from '../enhanced-classifier';
import { BUSINESS_MODEL_DEFINITIONS, getModelDefinition } from '../business-model-definitions';
import type { ClassificationInput } from '../enhanced-classifier';

describe('Enhanced Business Model Classifier', () => {
  describe('Industry Shortcuts', () => {
    it('should classify banks as SERVICIOS_FINANCIEROS', () => {
      const inputs: ClassificationInput[] = [
        { name: 'BBVA México', industry: 'Banking' },
        { name: 'Banorte', industry: 'Financial Services' },
        { name: 'Nu Mexico', industry: 'Fintech' }
      ];

      inputs.forEach(input => {
        const result = classifyBusinessModel(input);
        expect(result.model).toBe('SERVICIOS_FINANCIEROS');
        expect(result.confidence).toBeGreaterThan(0.8);
      });
    });

    it('should classify airlines as ECOSISTEMA_DIGITAL', () => {
      const inputs: ClassificationInput[] = [
        { name: 'Aeroméxico', industry: 'Airlines' },
        { name: 'Volaris', industry: 'Aviation' },
        { name: 'Viva Aerobus', industry: 'Airline Transportation' }
      ];

      inputs.forEach(input => {
        const result = classifyBusinessModel(input);
        expect(result.model).toBe('ECOSISTEMA_DIGITAL');
        expect(result.confidence).toBeGreaterThan(0.8);
        expect(result.reasoning).toContain('booking platform');
      });
    });

    it('should classify healthcare as INFORMACION_REGULADA', () => {
      const inputs: ClassificationInput[] = [
        { name: 'Hospital Angeles', industry: 'Healthcare' },
        { name: 'IMSS', industry: 'Public Health' },
        { name: 'Médica Sur', industry: 'Medical Services' }
      ];

      inputs.forEach(input => {
        const result = classifyBusinessModel(input);
        expect(result.model).toBe('INFORMACION_REGULADA');
        expect(result.confidence).toBeGreaterThan(0.85);
      });
    });
  });

  describe('Signal-Based Classification', () => {
    it('should classify SaaS B2B companies as SOFTWARE_CRITICO', () => {
      const input: ClassificationInput = {
        name: 'ContPAQi',
        industry: 'Software',
        description: 'Enterprise resource planning SaaS platform for Mexican businesses',
        isB2B: true,
        isSaaS: true,
        employees: 500
      };

      const result = classifyBusinessModel(input);
      expect(result.model).toBe('SOFTWARE_CRITICO');
      expect(result.signals.matched).toContain('modelo_saas_b2b');
    });

    it('should classify retail with stores as COMERCIO_HIBRIDO', () => {
      const input: ClassificationInput = {
        name: 'Liverpool',
        industry: 'Retail',
        description: 'Department store chain with e-commerce presence',
        hasPhysicalStores: true,
        hasEcommerce: true,
        employees: 50000
      };

      const result = classifyBusinessModel(input);
      expect(result.model).toBe('COMERCIO_HIBRIDO');
      expect(result.signals.matched).toContain('tiendas_fisicas');
    });

    it('should classify marketplaces as ECOSISTEMA_DIGITAL', () => {
      const input: ClassificationInput = {
        name: 'MercadoLibre México',
        industry: 'E-commerce',
        description: 'Online marketplace connecting buyers and sellers',
        hasPhysicalStores: false,
        employees: 30000
      };

      const result = classifyBusinessModel(input);
      expect(result.model).toBe('ECOSISTEMA_DIGITAL');
      expect(result.signals.matched.some(s => s.includes('marketplace') || s.includes('dos_o_mas_lados'))).toBe(true);
    });
  });

  describe('Risk Profile Calculation', () => {
    it('should provide accurate risk profiles for each model', () => {
      const testCases = [
        { 
          input: { name: 'Test Bank', industry: 'Banking' },
          expectedModel: 'SERVICIOS_FINANCIEROS',
          minImpact: 100000, // $100K per hour minimum
          maxTolerance: 2 // 2 hours max
        },
        {
          input: { name: 'Test Retailer', industry: 'Retail', hasPhysicalStores: true },
          expectedModel: 'COMERCIO_HIBRIDO',
          minImpact: 5000, // $5K per hour minimum
          minTolerance: 24 // 24 hours minimum
        }
      ];

      testCases.forEach(({ input, expectedModel, minImpact, maxTolerance, minTolerance }) => {
        const result = classifyBusinessModel(input);
        expect(result.model).toBe(expectedModel);
        expect(result.riskProfile.estimatedImpactPerHour).toBeGreaterThanOrEqual(minImpact);
        
        if (maxTolerance) {
          expect(result.riskProfile.interruptionToleranceHours).toBeLessThanOrEqual(maxTolerance);
        }
        if (minTolerance) {
          expect(result.riskProfile.interruptionToleranceHours).toBeGreaterThanOrEqual(minTolerance);
        }
      });
    });
  });

  describe('Confidence Scoring', () => {
    it('should have high confidence for clear matches', () => {
      const clearMatches = [
        { name: 'Banco Santander', industry: 'Banking' },
        { name: 'DHL Express', industry: 'Logistics' },
        { name: 'Pemex', industry: 'Government Oil Company' }
      ];

      clearMatches.forEach(input => {
        const result = classifyBusinessModel(input);
        expect(result.confidence).toBeGreaterThan(0.8);
      });
    });

    it('should have lower confidence for ambiguous cases', () => {
      const ambiguousCases = [
        { name: 'Generic Company', industry: 'Services' },
        { name: 'XYZ Corp', industry: 'Other' }
      ];

      ambiguousCases.forEach(input => {
        const result = classifyBusinessModel(input);
        expect(result.confidence).toBeLessThan(0.7);
      });
    });
  });

  describe('Alternative Models', () => {
    it('should suggest alternatives for hybrid cases', () => {
      const input: ClassificationInput = {
        name: 'Fintech Analytics Co',
        industry: 'Financial Technology',
        description: 'Data analytics platform for financial institutions',
        isB2B: true
      };

      const result = classifyBusinessModel(input);
      expect(result.alternativeModels).toBeDefined();
      expect(result.alternativeModels!.length).toBeGreaterThan(0);
      
      // Should consider both SERVICIOS_FINANCIEROS and SERVICIOS_DATOS
      const modelIds = [result.model, ...result.alternativeModels!.map(a => a.model)];
      expect(modelIds).toContain('SERVICIOS_FINANCIEROS');
      expect(modelIds).toContain('SERVICIOS_DATOS');
    });
  });

  describe('Validation', () => {
    it('should validate classifications make sense', () => {
      const testCases = [
        {
          input: { name: 'Software Store', industry: 'Software', hasPhysicalStores: true },
          suggestedModel: 'SOFTWARE_CRITICO' as const,
          shouldBeValid: false
        },
        {
          input: { name: 'Online Bank', industry: 'Banking', isRegulated: true },
          suggestedModel: 'SERVICIOS_FINANCIEROS' as const,
          shouldBeValid: true
        }
      ];

      testCases.forEach(({ input, suggestedModel, shouldBeValid }) => {
        const validation = EnhancedBusinessModelClassifier.validateClassification(input, suggestedModel);
        expect(validation.isValid).toBe(shouldBeValid);
        if (!shouldBeValid) {
          expect(validation.issues.length).toBeGreaterThan(0);
          expect(validation.suggestions.length).toBeGreaterThan(0);
        }
      });
    });
  });

  describe('Edge Cases', () => {
    it('should handle missing data gracefully', () => {
      const minimal: ClassificationInput = {
        name: 'Unknown Company'
      };

      const result = classifyBusinessModel(minimal);
      expect(result.model).toBeDefined();
      expect(result.confidence).toBeGreaterThan(0);
      expect(result.reasoning).toBeDefined();
    });

    it('should handle government entities correctly', () => {
      const govEntities = [
        { name: 'SAT', industry: 'Government Tax Authority' },
        { name: 'CFE', industry: 'State-owned Electricity' },
        { name: 'IMSS', industry: 'Government Healthcare' }
      ];

      govEntities.forEach(input => {
        const result = classifyBusinessModel(input);
        // Government entities should be either INFRAESTRUCTURA_HEREDADA or INFORMACION_REGULADA
        expect(['INFRAESTRUCTURA_HEREDADA', 'INFORMACION_REGULADA']).toContain(result.model);
      });
    });
  });
});

// Export test utilities for use in other tests
export const testClassificationAccuracy = (
  inputs: Array<{ input: ClassificationInput; expected: string }>,
  minAccuracy = 0.8
): boolean => {
  let correct = 0;
  
  inputs.forEach(({ input, expected }) => {
    const result = classifyBusinessModel(input);
    if (result.model === expected) {
      correct++;
    }
  });
  
  const accuracy = correct / inputs.length;
  return accuracy >= minAccuracy;
};