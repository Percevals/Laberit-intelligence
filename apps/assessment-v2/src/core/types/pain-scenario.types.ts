/**
 * Pain Scenario Types
 * Type definitions for the 8x5 Business Model Pain Discovery Matrix
 */

/**
 * Individual pain scenario for a specific business model and dimension
 */
export interface PainScenario {
  /** The specific pain point this business model faces */
  pain_point: string;
  
  /** Root cause analysis of why this pain exists */
  root_cause: string;
  
  /** Single impactful question for quick assessment */
  light_question: string;
  
  /** Multiple deeper questions for comprehensive assessment */
  premium_questions: string[];
  
  /** How to interpret the answers to reveal understanding */
  interpretation: string;
}

/**
 * Complete set of pain scenarios for all 5 DII dimensions
 */
export interface BusinessModelScenarios {
  /** Threat Resilience & Downtime (TRD) */
  TRD: PainScenario;
  
  /** Asset Exposure Risk (AER) */
  AER: PainScenario;
  
  /** Human Factor Probability (HFP) */
  HFP: PainScenario;
  
  /** Blast Radius Impact (BRI) */
  BRI: PainScenario;
  
  /** Recovery Readiness Gap (RRG) */
  RRG: PainScenario;
}

/**
 * DII Dimension type for type safety
 */
export type DIIDimension = keyof BusinessModelScenarios;

/**
 * Business model scenario IDs from the matrix data
 */
export type BusinessModelScenarioId = 
  | '1_comercio_hibrido'
  | '2_software_critico'
  | '3_servicios_datos'
  | '4_ecosistema_digital'
  | '5_servicios_financieros'
  | '6_infraestructura_heredada'
  | '7_cadena_suministro'
  | '8_informacion_regulada';

/**
 * Complete scenario matrix mapping business models to their scenarios
 */
export interface ScenarioMatrix {
  version: string;
  description: string;
  matrix: Record<BusinessModelScenarioId, BusinessModelScenarios>;
}

/**
 * Service response when retrieving a specific scenario
 */
export interface ScenarioResponse {
  businessModelId: BusinessModelScenarioId;
  dimension: DIIDimension;
  scenario: PainScenario;
}