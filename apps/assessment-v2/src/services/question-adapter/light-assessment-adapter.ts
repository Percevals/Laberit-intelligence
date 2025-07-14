/**
 * Light Assessment Question Adapter
 * Provides personalized light questions for each DII dimension
 */

import { painScenarioService } from '@services/pain-scenarios';
import { questionAdapter } from './question-adapter';
import type { BusinessModelScenarioId, DIIDimension } from '@core/types/pain-scenario.types';
import type { CompanyInfo } from '@services/ai/types';
import type { AdaptedQuestion, QuestionContext } from './types';

export interface LightAssessmentQuestion {
  dimension: DIIDimension;
  adaptedQuestion: AdaptedQuestion;
  interpretation: string;
}

export class LightAssessmentAdapter {
  /**
   * Get all 5 personalized light questions for a company
   */
  async getPersonalizedQuestions(
    businessModelId: BusinessModelScenarioId,
    company: CompanyInfo,
    criticalInfra?: boolean
  ): Promise<LightAssessmentQuestion[]> {
    // Get all light questions for this business model
    const scenarios = painScenarioService.getBusinessModelScenarios(businessModelId);
    const dimensions: DIIDimension[] = ['TRD', 'AER', 'HFP', 'BRI', 'RRG'];
    
    // Build context
    const context: QuestionContext = {
      company,
      businessModel: businessModelId,
      criticalInfra
    };
    
    // Adapt each dimension's question
    const adaptedQuestions = await Promise.all(
      dimensions.map(async (dimension) => {
        const scenario = scenarios[dimension];
        
        const adaptedQuestion = await questionAdapter.adaptQuestion({
          scenario,
          context,
          useAI: false, // Start with template-based adaptation
          questionType: 'light'
        });
        
        return {
          dimension,
          adaptedQuestion,
          interpretation: scenario.interpretation
        };
      })
    );
    
    return adaptedQuestions;
  }

  /**
   * Get a single personalized question for a specific dimension
   */
  async getPersonalizedQuestion(
    businessModelId: BusinessModelScenarioId,
    dimension: DIIDimension,
    company: CompanyInfo,
    criticalInfra?: boolean
  ): Promise<LightAssessmentQuestion> {
    const scenario = painScenarioService.getScenario(businessModelId, dimension).scenario;
    
    const context: QuestionContext = {
      company,
      businessModel: businessModelId,
      criticalInfra
    };
    
    const adaptedQuestion = await questionAdapter.adaptQuestion({
      scenario,
      context,
      useAI: false,
      questionType: 'light'
    });
    
    return {
      dimension,
      adaptedQuestion,
      interpretation: scenario.interpretation
    };
  }

  /**
   * Map numeric business model ID to scenario ID
   */
  mapBusinessModelToScenarioId(modelId: number): BusinessModelScenarioId {
    const mapping: Record<number, BusinessModelScenarioId> = {
      1: '1_comercio_hibrido',
      2: '2_software_critico',
      3: '3_servicios_datos',
      4: '4_ecosistema_digital',
      5: '5_servicios_financieros',
      6: '6_infraestructura_heredada',
      7: '7_cadena_suministro',
      8: '8_informacion_regulada'
    };
    
    return mapping[modelId] || '1_comercio_hibrido';
  }

  /**
   * Get example adaptations for testing
   */
  getExampleAdaptations(): Record<string, { original: string; adapted: string }> {
    return {
      employees: {
        original: "¿Cuántos empleados pueden aprobar transferencias superiores a $100K?",
        adapted: "¿Cuántos empleados en Microsoft pueden aprobar transferencias superiores a $500K?"
      },
      downtime: {
        original: "Si tu servicio falla ahora, ¿cuántos clientes empezarían a buscar alternativas después de 2 horas?",
        adapted: "Si el servicio de Spotify falla ahora, ¿cuántos clientes empezarían a buscar alternativas después de 30 minutos?"
      },
      revenue: {
        original: "¿Qué % de tus ingresos viene del canal digital?",
        adapted: "¿Qué % de los ingresos de Amazon ($500B) viene del canal digital?"
      }
    };
  }
}

// Export singleton instance
export const lightAssessmentAdapter = new LightAssessmentAdapter();