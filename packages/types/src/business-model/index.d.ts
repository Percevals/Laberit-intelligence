/**
 * Business model type definitions
 * @module @dii/types/business-model
 */

/**
 * DII base configuration
 */
export interface DIIBaseConfig {
  min: number;
  max: number;
  average: number;
  range: string;
}

/**
 * Business model characteristics
 */
export interface BusinessModelCharacteristics {
  digitalDependency: string;
  naturalRedundancy: string;
  manualFallback: string;
  customerChannels: string[];
  criticalFactor: string;
}

/**
 * Resilience window configuration
 */
export interface ResilienceWindow {
  minHours: number;
  maxHours: number;
  typical: number;
  description: string;
}

/**
 * Company example
 */
export interface CompanyExample {
  company: string;
  country: string;
  sector: string;
}

/**
 * Regional examples
 */
export interface RegionalExamples {
  latam: CompanyExample[];
  spain: CompanyExample[];
}

/**
 * Sector adjustments map
 */
export interface SectorAdjustments {
  [sector: string]: number;
}

/**
 * Complete business model definition
 */
export interface BusinessModel {
  id: number;
  key: string;
  name: string;
  nameEn: string;
  description: string;
  diiBase: DIIBaseConfig;
  characteristics: BusinessModelCharacteristics;
  resilienceWindow: ResilienceWindow;
  riskMultiplier: number;
  examples: RegionalExamples;
  sectorAdjustments: SectorAdjustments;
}

/**
 * Business model option for selection
 */
export interface BusinessModelOption {
  id: number;
  name: string;
  nameEn: string;
  description: string;
}

/**
 * Business models collection
 */
export interface BusinessModelsCollection {
  [id: number]: BusinessModel;
}