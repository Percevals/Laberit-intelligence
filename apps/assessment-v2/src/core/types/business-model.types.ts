/**
 * Business Model types based on DII Framework
 * 8 distinct models based on revenue generation, not industry
 */

import type { Hours, Percentage } from './brand.types';

export type BusinessModelId = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

// DII-specific business models
export type DIIBusinessModel = 
  | 'COMERCIO_HIBRIDO'        // Model 1: Hybrid Commerce - Physical + digital channels
  | 'SOFTWARE_CRITICO'        // Model 2: Critical Software - SaaS/cloud solutions
  | 'SERVICIOS_DATOS'         // Model 3: Data Services - Data monetization
  | 'ECOSISTEMA_DIGITAL'      // Model 4: Digital Ecosystem - Multi-sided platforms
  | 'SERVICIOS_FINANCIEROS'   // Model 5: Financial Services - Transaction processing
  | 'INFRAESTRUCTURA_HEREDADA' // Model 6: Legacy Infrastructure - Old systems with digital layers
  | 'CADENA_SUMINISTRO'       // Model 7: Supply Chain - Logistics with digital tracking
  | 'INFORMACION_REGULADA';   // Model 8: Regulated Information - Healthcare, sensitive data

// Legacy business models (kept for backwards compatibility)
export type LegacyBusinessModel = 
  | 'SUBSCRIPTION_BASED'      // Legacy: Recurring revenue
  | 'TRANSACTION_BASED'       // Legacy: Per-transaction fees
  | 'ASSET_LIGHT'            // Legacy: Minimal physical assets
  | 'ASSET_HEAVY'            // Legacy: Significant physical infrastructure
  | 'DATA_DRIVEN'            // Legacy: Data as primary value
  | 'PLATFORM_ECOSYSTEM'      // Legacy: Multi-sided platforms
  | 'DIRECT_TO_CONSUMER'      // Legacy: Direct sales
  | 'B2B_ENTERPRISE';         // Legacy: Complex enterprise sales

// Combined type for all business models
export type BusinessModel = DIIBusinessModel | LegacyBusinessModel;

export interface ModelProfile {
  id: BusinessModelId;
  name: BusinessModel;
  description: string;
  
  // DII baseline scores for this model
  diiBase: {
    min: number;
    max: number;
    avg: number;
  };
  
  // Value loss patterns (new in v4.0)
  valueLoss: {
    primaryImpact: 'operations' | 'trust' | 'compliance' | 'competitive';
    typicalLossPerHour: string; // e.g., "$5-20K", "$100K+"
    recoveryDifficulty: 'low' | 'medium' | 'high' | 'terminal';
    worstNightmare: string; // What keeps executives up at night
  };
  
  // Inherent characteristics
  inherentStrengths: string[];
  fatalFlaws: string[];
  
  // Attack patterns specific to this model
  typicalAttacks: AttackPattern[];
  
  // Recovery characteristics
  resilienceWindow: {
    hours: Hours;
    description: string;
  };
  
  // Real-world examples
  exampleCompanies: CompanyExample[];
}

export interface AttackPattern {
  vector: string;
  method: string;
  frequency: 'RARE' | 'OCCASIONAL' | 'COMMON' | 'VERY_COMMON';
  impact: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  sophistication: 'COMMODITY' | 'TARGETED' | 'ADVANCED';
}

export interface CompanyExample {
  name: string;
  region: 'LATAM' | 'US' | 'EU' | 'ASIA' | 'GLOBAL';
  size: CompanySize;
  breachHistory?: {
    year: number;
    impact: string;
    recovered: boolean;
  }[];
}

export type CompanySize = 'STARTUP' | 'SMB' | 'MID_MARKET' | 'ENTERPRISE';

export interface ClassificationAnswers {
  // Question 1: How do you primarily generate revenue?
  revenueModel: 
    | 'recurring_subscriptions'
    | 'per_transaction'
    | 'project_based'
    | 'product_sales'
    | 'data_monetization'
    | 'platform_fees'
    | 'direct_sales'
    | 'enterprise_contracts';
    
  // Question 2: What's your operational dependency?
  operationalDependency:
    | 'fully_digital'      // Can operate 100% remotely
    | 'hybrid_model'       // Mix of digital and physical
    | 'physical_critical'; // Physical presence essential
}

export interface BusinessModelClassification {
  model: BusinessModel;
  confidence: Percentage;
  reasoning: string;
  alternativeModel?: BusinessModel;
}