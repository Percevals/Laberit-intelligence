/**
 * Assessment Calculator Service
 * Bridges scenario responses with DII calculation engine
 */

import { DIICalculator } from '@core/dii-engine/calculator';
import { ResponseInterpreter } from './response-interpreter';
// import { lightAssessmentAdapter } from '@services/question-adapter'; // Reserved for future use
import type { BusinessModel } from '@core/types/business-model.types';
import type { BusinessModelScenarioId, DIIDimension } from '@core/types/pain-scenario.types';
import type { DIIDimensions, DIIScore } from '@core/types/dii.types';
import type { CompanyInfo } from '@services/ai/types';
import type { ScenarioResponse } from '@/store/assessment-store';

export interface AssessmentContext {
  company: CompanyInfo;
  businessModel: BusinessModel;
  criticalInfra: boolean;
  responses: ScenarioResponse[];
}

export interface AssessmentResult {
  diiScore: DIIScore;
  interpretations: Record<string, any>;
  completeness: number;
}

export class AssessmentCalculator {
  /**
   * Calculate DII score from scenario responses
   */
  static calculateFromResponses(context: AssessmentContext): AssessmentResult {
    // Map business model to scenario ID
    const scenarioId = this.getScenarioId(context.businessModel);
    
    // Create response and metric maps
    const responseMap = new Map<DIIDimension, number>();
    const metricMap = new Map<DIIDimension, any>();
    context.responses.forEach(r => {
      responseMap.set(r.dimension, r.response);
      if (r.metric) {
        metricMap.set(r.dimension, r.metric);
      }
    });

    // For light assessment with only TRD, use defaults for other dimensions
    const dimensions: DIIDimension[] = ['TRD', 'AER', 'HFP', 'BRI', 'RRG'];
    const hasAllDimensions = dimensions.every(d => responseMap.has(d));

    if (!hasAllDimensions) {
      // Use intelligent defaults based on TRD response
      const trdResponse = responseMap.get('TRD') || 3;
      this.fillMissingDimensions(responseMap, trdResponse, context.businessModel);
    }

    // Interpret all responses
    const interpretations = ResponseInterpreter.interpretAllResponses(
      responseMap, 
      {
        businessModel: context.businessModel,
        scenarioId,
        company: context.company,
        criticalInfra: context.criticalInfra
      },
      metricMap
    );

    // Extract dimension values for DII calculation
    const diiDimensions: DIIDimensions = {
      TRD: interpretations.TRD?.interpretedValue || 5,
      AER: interpretations.AER?.interpretedValue || 5,
      HFP: interpretations.HFP?.interpretedValue || 5,
      BRI: interpretations.BRI?.interpretedValue || 5,
      RRG: interpretations.RRG?.interpretedValue || 5
    };

    // Calculate DII score
    const diiScore = DIICalculator.calculate(
      diiDimensions,
      context.businessModel
    );

    // Calculate completeness
    const answeredQuestions = context.responses.length;
    const totalQuestions = 5; // All 5 dimensions
    const completeness = (answeredQuestions / totalQuestions) * 100;

    return {
      diiScore,
      interpretations,
      completeness
    };
  }

  /**
   * Fill missing dimensions with intelligent defaults
   * Based on TRD response and business model characteristics
   */
  private static fillMissingDimensions(
    responseMap: Map<DIIDimension, number>,
    trdResponse: number,
    businessModel: BusinessModel
  ): void {
    // Correlation factors based on our 150+ assessments
    // Companies with good TRD tend to have correlated scores in other dimensions
    const correlations = {
      highPerformers: { // TRD 4-5
        AER: 4,  // Good time resilience usually means good asset protection
        HFP: 4,  // Good processes mean better human controls
        BRI: 3,  // May still have blast radius issues
        RRG: 4   // Good ops usually have good recovery
      },
      average: { // TRD 3
        AER: 3,
        HFP: 3,
        BRI: 3,
        RRG: 3
      },
      lowPerformers: { // TRD 1-2
        AER: 2,  // Poor resilience correlates with poor protection
        HFP: 2,  // Likely poor human factor controls
        BRI: 2,  // Probably poor segmentation
        RRG: 2   // Likely poor recovery capability
      }
    };

    // Determine correlation group
    let group: keyof typeof correlations;
    if (trdResponse >= 4) group = 'highPerformers';
    else if (trdResponse === 3) group = 'average';
    else group = 'lowPerformers';

    const defaults = correlations[group];

    // Apply business model specific adjustments
    const adjustments = this.getBusinessModelAdjustments(businessModel);

    // Fill missing dimensions
    if (!responseMap.has('AER')) {
      responseMap.set('AER', Math.max(1, Math.min(5, defaults.AER + (adjustments.AER || 0))));
    }
    if (!responseMap.has('HFP')) {
      responseMap.set('HFP', Math.max(1, Math.min(5, defaults.HFP + (adjustments.HFP || 0))));
    }
    if (!responseMap.has('BRI')) {
      responseMap.set('BRI', Math.max(1, Math.min(5, defaults.BRI + (adjustments.BRI || 0))));
    }
    if (!responseMap.has('RRG')) {
      responseMap.set('RRG', Math.max(1, Math.min(5, defaults.RRG + (adjustments.RRG || 0))));
    }
  }

  /**
   * Get business model specific adjustments for defaults
   */
  private static getBusinessModelAdjustments(
    businessModel: BusinessModel
  ): Partial<Record<DIIDimension, number>> {
    const adjustments: Record<BusinessModel, Partial<Record<DIIDimension, number>>> = {
      SUBSCRIPTION_BASED: {
        AER: +1,  // Usually better at protecting recurring revenue
        HFP: +1   // Better automation
      },
      TRANSACTION_BASED: {
        BRI: -1,  // Transaction systems have wide impact
        RRG: -1   // Complex recovery
      },
      ASSET_LIGHT: {
        BRI: +1,  // Simpler systems
        RRG: +1   // Easier recovery
      },
      ASSET_HEAVY: {
        BRI: -1,  // Physical + digital complexity
        RRG: -1   // Harder recovery
      },
      DATA_DRIVEN: {
        AER: -1,  // Data is attractive target
        HFP: -1   // Many data access points
      },
      PLATFORM_ECOSYSTEM: {
        HFP: -1,  // Many external users
        BRI: -1   // Wide ecosystem impact
      },
      DIRECT_TO_CONSUMER: {
        AER: 0,   // Average
        HFP: 0    // Average
      },
      B2B_ENTERPRISE: {
        AER: +1,  // Better enterprise security
        RRG: +1   // Better DR planning
      }
    };

    return adjustments[businessModel] || {};
  }

  /**
   * Map business model to scenario ID
   */
  private static getScenarioId(businessModel: BusinessModel): BusinessModelScenarioId {
    const mapping: Record<BusinessModel, BusinessModelScenarioId> = {
      'SUBSCRIPTION_BASED': '2_software_critico',
      'TRANSACTION_BASED': '5_servicios_financieros',
      'ASSET_LIGHT': '2_software_critico',
      'ASSET_HEAVY': '6_infraestructura_heredada',
      'DATA_DRIVEN': '3_servicios_datos',
      'PLATFORM_ECOSYSTEM': '4_ecosistema_digital',
      'DIRECT_TO_CONSUMER': '1_comercio_hibrido',
      'B2B_ENTERPRISE': '5_servicios_financieros'
    };

    return mapping[businessModel] || '1_comercio_hibrido';
  }

  /**
   * Get detailed interpretation for a specific dimension
   */
  static getDimensionInsight(
    dimension: DIIDimension,
    interpretation: any,
    businessModel: BusinessModel
  ): string {
    const insights: Record<DIIDimension, Record<string, string>> = {
      TRD: {
        good: `Su capacidad de mantener operaciones durante incidentes es sólida para un modelo ${businessModel}.`,
        poor: `Su tiempo de resistencia ante interrupciones es preocupante para un modelo ${businessModel}.`
      },
      AER: {
        good: `Sus activos digitales están bien protegidos considerando su exposición como ${businessModel}.`,
        poor: `La exposición de sus activos representa un riesgo significativo para su modelo ${businessModel}.`
      },
      HFP: {
        good: `El factor humano está bien controlado en su organización.`,
        poor: `El factor humano representa una vulnerabilidad crítica que necesita atención inmediata.`
      },
      BRI: {
        good: `El radio de impacto de incidentes está bien contenido.`,
        poor: `Un incidente puede propagarse ampliamente a través de sus sistemas.`
      },
      RRG: {
        good: `Su capacidad de recuperación está alineada con las necesidades del negocio.`,
        poor: `La brecha entre sus planes de recuperación y la realidad operativa es preocupante.`
      }
    };

    const isGood = interpretation.interpretedValue >= 6;
    const insightType = isGood ? 'good' : 'poor';
    
    return insights[dimension]?.[insightType] || 'Evaluación en proceso.';
  }
}