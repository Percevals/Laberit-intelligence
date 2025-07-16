/**
 * Assessment Question Adapter
 * Provides personalized assessment questions for each DII dimension
 */

import { painScenarioService } from '@services/pain-scenarios';
import { questionAdapter } from './question-adapter';
import type { BusinessModelScenarioId, DIIDimension, ResponseOption } from '@core/types/pain-scenario.types';
import type { CompanyInfo } from '@services/ai/types';
import type { AdaptedQuestion, QuestionContext } from './types';
import { getDimensionQuestions } from '@/core/dii-engine/dimensions-v4';
import type { BusinessModelId } from '@core/types/business-model.types';

export interface AssessmentQuestion {
  dimension: DIIDimension;
  dimensionName: string;
  adaptedQuestion: AdaptedQuestion;
  responseOptions: ResponseOption[];
  contextForUser: string;
  interpretation: string; // Legacy field
  archetypeQuestions?: string[]; // Additional archetype-specific questions
}

export class AssessmentAdapter {
  /**
   * Get all 5 personalized assessment questions for a company
   */
  async getPersonalizedQuestions(
    businessModelId: BusinessModelScenarioId,
    company: CompanyInfo,
    criticalInfra?: boolean
  ): Promise<AssessmentQuestion[]> {
    // Get all assessment questions for this business model
    const scenarios = painScenarioService.getBusinessModelScenarios(businessModelId);
    const dimensions: DIIDimension[] = ['TRD', 'AER', 'HFP', 'BRI', 'RRG'];
    
    // Build context
    const context: QuestionContext = {
      company,
      businessModel: businessModelId,
      criticalInfra
    };
    
    // Adapt each dimension's question
    const numericModelId = this.getNumericBusinessModelId(businessModelId);
    
    const adaptedQuestions = await Promise.all(
      dimensions.map(async (dimension) => {
        const scenario = scenarios[dimension];
        
        const adaptedQuestion = await questionAdapter.adaptQuestion({
          scenario,
          context,
          useAI: false, // Start with template-based adaptation
          questionType: 'light'
        });
        
        // Get archetype-specific questions
        const archetypeQuestions = getDimensionQuestions(dimension, numericModelId as BusinessModelId, 'es');
        
        return {
          dimension,
          dimensionName: scenario.dimension_name || dimension,
          adaptedQuestion,
          responseOptions: scenario.response_options || [],
          contextForUser: scenario.context_for_user || '',
          interpretation: scenario.interpretation || '',
          archetypeQuestions
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
  ): Promise<AssessmentQuestion> {
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
    
    // Get archetype-specific questions for additional context
    const numericModelId = this.getNumericBusinessModelId(businessModelId);
    const archetypeQuestions = getDimensionQuestions(dimension, numericModelId as BusinessModelId, 'es');
    
    return {
      dimension,
      dimensionName: scenario.dimension_name || dimension,
      adaptedQuestion,
      responseOptions: scenario.response_options || [],
      contextForUser: scenario.context_for_user || '',
      interpretation: scenario.interpretation || '',
      // Add archetype questions as additional context
      archetypeQuestions
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
   * Get numeric business model ID from scenario ID
   */
  getNumericBusinessModelId(scenarioId: BusinessModelScenarioId): number {
    const mapping: Record<BusinessModelScenarioId, number> = {
      '1_comercio_hibrido': 1,
      '2_software_critico': 2,
      '3_servicios_datos': 3,
      '4_ecosistema_digital': 4,
      '5_servicios_financieros': 5,
      '6_infraestructura_heredada': 6,
      '7_cadena_suministro': 7,
      '8_informacion_regulada': 8
    };
    
    return mapping[scenarioId] || 1;
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
export const assessmentAdapter = new AssessmentAdapter();