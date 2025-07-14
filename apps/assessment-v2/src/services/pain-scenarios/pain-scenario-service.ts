/**
 * Pain Scenario Service
 * Service to retrieve pain scenarios from the 8x5 Business Model Pain Discovery Matrix
 */

import type { 
  ScenarioMatrix, 
  BusinessModelScenarioId, 
  DIIDimension, 
  PainScenario,
  ScenarioResponse 
} from '@core/types/pain-scenario.types';

import scenarioData from '@data/business-model-scenarios.json';

export class PainScenarioService {
  private scenarioMatrix: ScenarioMatrix;

  constructor() {
    // Type assertion since we know the JSON structure matches our types
    this.scenarioMatrix = scenarioData as ScenarioMatrix;
  }

  /**
   * Get a specific pain scenario by business model and dimension
   */
  getScenario(businessModelId: BusinessModelScenarioId, dimension: DIIDimension): ScenarioResponse {
    const businessModelScenarios = this.scenarioMatrix.matrix[businessModelId];
    
    if (!businessModelScenarios) {
      throw new Error(`Invalid business model ID: ${businessModelId}`);
    }

    const scenario = businessModelScenarios[dimension];
    
    if (!scenario) {
      throw new Error(`Invalid dimension: ${dimension}`);
    }

    return {
      businessModelId,
      dimension,
      scenario
    };
  }

  /**
   * Get all scenarios for a specific business model
   */
  getBusinessModelScenarios(businessModelId: BusinessModelScenarioId) {
    const scenarios = this.scenarioMatrix.matrix[businessModelId];
    
    if (!scenarios) {
      throw new Error(`Invalid business model ID: ${businessModelId}`);
    }

    return scenarios;
  }

  /**
   * Get all scenarios for a specific dimension across all business models
   */
  getDimensionScenarios(dimension: DIIDimension): Record<BusinessModelScenarioId, PainScenario> {
    const result = {} as Record<BusinessModelScenarioId, PainScenario>;
    
    Object.entries(this.scenarioMatrix.matrix).forEach(([modelId, scenarios]) => {
      const scenario = scenarios[dimension];
      if (scenario) {
        result[modelId as BusinessModelScenarioId] = scenario;
      }
    });

    return result;
  }

  /**
   * Get metadata about the scenario matrix
   */
  getMatrixInfo() {
    return {
      version: this.scenarioMatrix.version,
      description: this.scenarioMatrix.description,
      businessModels: Object.keys(this.scenarioMatrix.matrix) as BusinessModelScenarioId[],
      dimensions: ['TRD', 'AER', 'HFP', 'BRI', 'RRG'] as DIIDimension[]
    };
  }

  /**
   * Get light questions for a specific business model (all dimensions)
   */
  getLightQuestions(businessModelId: BusinessModelScenarioId): Record<DIIDimension, string> {
    const scenarios = this.getBusinessModelScenarios(businessModelId);
    const questions = {} as Record<DIIDimension, string>;
    
    Object.entries(scenarios).forEach(([dimension, scenario]) => {
      questions[dimension as DIIDimension] = scenario.light_question;
    });

    return questions;
  }

  /**
   * Get premium questions for a specific scenario
   */
  getPremiumQuestions(businessModelId: BusinessModelScenarioId, dimension: DIIDimension): string[] {
    const response = this.getScenario(businessModelId, dimension);
    return response.scenario.premium_questions || [];
  }
}

// Export singleton instance
export const painScenarioService = new PainScenarioService();