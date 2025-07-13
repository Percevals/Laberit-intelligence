/**
 * Business Model types based on DII Framework
 * 8 distinct models based on revenue generation, not industry
 */

import type { Currency, Hours, Percentage } from './brand.types';

export type BusinessModelId = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

export type BusinessModel = 
  | 'SUBSCRIPTION_BASED'      // Model 1: Recurring revenue (SaaS, streaming)
  | 'TRANSACTION_BASED'       // Model 2: Per-transaction fees (payments, marketplaces)
  | 'ASSET_LIGHT'            // Model 3: Minimal physical assets (consulting, software)
  | 'ASSET_HEAVY'            // Model 4: Significant physical infrastructure (manufacturing)
  | 'DATA_DRIVEN'            // Model 5: Data as primary value (analytics, advertising)
  | 'PLATFORM_ECOSYSTEM'      // Model 6: Multi-sided platforms (app stores, social)
  | 'DIRECT_TO_CONSUMER'      // Model 7: Direct sales to end users (e-commerce, retail)
  | 'B2B_ENTERPRISE';         // Model 8: Complex enterprise sales

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