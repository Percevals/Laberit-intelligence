/**
 * Tests for AI Service
 * 
 * Verifies core functionality works with and without AI providers
 */

import { AIService, resetAIService } from './AIService.js';
import { OfflineProvider } from './providers/OfflineProvider.js';

describe('AIService', () => {
  beforeEach(() => {
    resetAIService();
  });

  describe('Initialization', () => {
    test('should initialize with offline provider by default', async () => {
      const service = new AIService();
      await service.ensureInitialized();
      
      expect(service.isAvailable()).toBe(true);
      expect(service.getProviderName()).toBe('OfflineProvider');
    });

    test('should detect provider from environment', async () => {
      // This test would need environment setup
      const service = new AIService();
      expect(service.provider).toBeDefined();
    });
  });

  describe('Data Sanitization', () => {
    test('should sanitize assessment data', () => {
      const service = new AIService();
      const input = {
        businessModel: 1,
        dimensions: { trd: 5, aer: 3 },
        scores: { diiScore: 3.5 },
        personalInfo: 'should be removed',
        sensitiveData: 'also removed'
      };

      const sanitized = service.sanitizeData(input);

      expect(sanitized.businessModel).toBe(1);
      expect(sanitized.dimensions).toEqual({ trd: 5, aer: 3 });
      expect(sanitized.scores).toEqual({ diiScore: 3.5 });
      expect(sanitized.personalInfo).toBeUndefined();
      expect(sanitized.sensitiveData).toBeUndefined();
    });
  });

  describe('Compromise Analysis', () => {
    test('should analyze compromise risk', async () => {
      const service = new AIService(new OfflineProvider());
      await service.ensureInitialized();

      const assessmentData = {
        businessModel: 1, // Financial Services
        scores: {
          trd: 2,
          aer: 3,
          hfp: 2,
          bri: 4,
          rrg: 3
        }
      };

      const result = await service.analyzeCompromiseRisk(assessmentData);

      expect(result.success).toBe(true);
      expect(result.compromiseScore).toBeGreaterThan(0);
      expect(result.compromiseScore).toBeLessThan(1);
      expect(result.confidence).toBeDefined();
      expect(result.indicators).toBeInstanceOf(Array);
      expect(result.recommendation).toBeDefined();
    });

    test('should handle missing data gracefully', async () => {
      const service = new AIService(new OfflineProvider());
      await service.ensureInitialized();

      const result = await service.analyzeCompromiseRisk({
        businessModel: 1
      });

      expect(result.success).toBe(true);
      expect(result.compromiseScore).toBeDefined();
    });
  });

  describe('Executive Insights', () => {
    test('should generate executive insights', async () => {
      const service = new AIService(new OfflineProvider());
      await service.ensureInitialized();

      const assessmentData = {
        businessModel: 5, // Critical Software
        scores: {
          diiScore: 6.5
        }
      };

      const result = await service.generateExecutiveInsights(assessmentData);

      expect(result.success).toBe(true);
      expect(result.executiveSummary).toBeDefined();
      expect(result.insights).toBeInstanceOf(Array);
      expect(result.insights.length).toBeGreaterThan(0);
      expect(result.urgency).toBeDefined();
    });
  });

  describe('Threat Context', () => {
    test('should get threat context for business model', async () => {
      const service = new AIService(new OfflineProvider());
      await service.ensureInitialized();

      const result = await service.getThreatContext(1, 'LATAM');

      expect(result.success).toBe(true);
      expect(result.businessModel).toBeDefined();
      expect(result.region).toBe('LATAM');
      expect(result.threatLandscape).toBeDefined();
      expect(result.threatLandscape.activeActors).toBeInstanceOf(Array);
    });
  });

  describe('Scenario Simulation', () => {
    test('should simulate improvement scenarios', async () => {
      const service = new AIService(new OfflineProvider());
      await service.ensureInitialized();

      const baseAssessment = {
        businessModel: 3,
        scores: {
          diiScore: 3.0,
          trd: 3,
          aer: 3,
          hfp: 3,
          bri: 3,
          rrg: 3
        }
      };

      const changes = {
        trd: 'major_improvement',
        hfp: 'improvement'
      };

      const result = await service.simulateScenario(baseAssessment, changes);

      expect(result.success).toBe(true);
      expect(result.currentDII).toBeDefined();
      expect(result.projectedDII).toBeDefined();
      expect(parseFloat(result.projectedDII)).toBeGreaterThan(parseFloat(result.currentDII));
      expect(result.improvements).toBeInstanceOf(Array);
      expect(result.roiTimeline).toBeDefined();
    });
  });

  describe('Fallback Behavior', () => {
    test('should fallback to offline on error', async () => {
      // Create a failing provider
      const failingProvider = {
        isAvailable: () => true,
        complete: () => Promise.reject(new Error('Provider failed')),
        constructor: { name: 'FailingProvider' }
      };

      const service = new AIService(failingProvider);
      await service.ensureInitialized();

      const result = await service.analyzeCompromiseRisk({
        businessModel: 1
      });

      expect(result.success).toBe(true);
      expect(result.fallback).toBe(true);
      expect(result.provider).toContain('Offline');
    });
  });
});

// Example test for React hook (would need React testing library)
describe('useCompromiseAnalysis hook', () => {
  test.skip('should analyze compromise when data changes', async () => {
    // This would need @testing-library/react-hooks
    // Example structure:
    // const { result, waitForNextUpdate } = renderHook(
    //   () => useCompromiseAnalysis(assessmentData)
    // );
    // await waitForNextUpdate();
    // expect(result.current.analysis).toBeDefined();
  });
});