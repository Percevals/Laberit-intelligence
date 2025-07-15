/**
 * Database Types for DII Business Model Database
 * Simplified 80/20 approach - Static business models, focus on assessments
 */

export type DIIBusinessModel = 
  | 'COMERCIO_HIBRIDO'
  | 'SOFTWARE_CRITICO'
  | 'SERVICIOS_DATOS'
  | 'ECOSISTEMA_DIGITAL'
  | 'SERVICIOS_FINANCIEROS'
  | 'INFRAESTRUCTURA_HEREDADA'
  | 'CADENA_SUMINISTRO'
  | 'INFORMACION_REGULADA';

export type AssessmentType = 
  | 'quick_30min'
  | 'formal_comprehensive'
  | 'benchmark_update'
  | 'follow_up';

export type DiiDimension = 'TRD' | 'AER' | 'HFP' | 'BRI' | 'RRG';

export type DataSource = 
  | 'incident_history'
  | 'simulation_exercise'
  | 'expert_estimate'
  | 'industry_benchmark'
  | 'ai_inference';

export type ValidationStatus = 'valid' | 'flagged' | 'requires_review' | 'invalid';

export type RevenueModel = 
  | 'recurring_subscriptions'
  | 'per_transaction'
  | 'project_based'
  | 'product_sales'
  | 'data_monetization'
  | 'platform_fees'
  | 'direct_sales'
  | 'enterprise_contracts';

export type OperationalDependency = 
  | 'fully_digital'
  | 'hybrid_model'
  | 'physical_critical';

export type RuleSeverity = 'error' | 'warning' | 'info';

export type RuleType = 
  | 'dimension_validation'
  | 'cross_dimension_check'
  | 'business_model_validation'
  | 'data_quality_check';

// ===================================================================
// DATABASE ENTITY INTERFACES
// ===================================================================

export interface Company {
  id: string;
  name: string;
  legal_name?: string;
  domain?: string;
  
  // Classification
  industry_traditional: string;
  dii_business_model: DIIBusinessModel;
  confidence_score: number;
  classification_reasoning: string;
  
  // Company Details
  headquarters?: string;
  country?: string;
  region: string;
  employees?: number;
  revenue?: number;
  
  // Metadata
  created_at: Date;
  updated_at: Date;
}

export interface Assessment {
  id: string;
  company_id: string;
  
  // Assessment Details
  assessment_type: AssessmentType;
  dii_raw_score?: number;
  dii_final_score?: number;
  confidence_level?: number;
  
  // Context
  assessed_at: Date;
  assessed_by_user_id?: string;
  framework_version: string;
  calculation_inputs?: Record<string, any>;
  
  // Metadata
  created_at: Date;
}

export interface DimensionScore {
  id: string;
  assessment_id: string;
  
  // Dimension Data
  dimension: DiiDimension;
  raw_value: number;
  normalized_value?: number;
  confidence_score?: number;
  
  // Data Quality
  data_source?: DataSource;
  validation_status: ValidationStatus;
  calculation_method?: string;
  supporting_evidence?: Record<string, any>;
  
  // Metadata
  created_at: Date;
}

export interface DIIModelProfile {
  model_id: number;
  model_name: DIIBusinessModel;
  
  // DII Baseline Ranges
  dii_base_min: number;
  dii_base_max: number;
  dii_base_avg: number;
  risk_multiplier: number;
  
  // Digital Dependency
  digital_dependency_min?: number;
  digital_dependency_max?: number;
  
  // TRD Ranges
  typical_trd_hours_min?: number;
  typical_trd_hours_max?: number;
  
  // Business Logic
  vulnerability_patterns?: Array<{
    vector: string;
    method: string;
    frequency: string;
    impact: string;
  }>;
  example_companies?: Array<{
    name: string;
    region: string;
    size: string;
  }>;
  cyber_risk_explanation?: string;
  
  // Metadata
  active_from: Date;
  active_to?: Date;
}

export interface ClassificationRule {
  id: string;
  
  // Rule Conditions
  industry_pattern?: string;
  revenue_model?: RevenueModel;
  operational_dependency?: OperationalDependency;
  
  // Rule Output
  target_dii_model: DIIBusinessModel;
  confidence_level: number;
  reasoning_template: string;
  
  // Rule Metadata
  rule_priority: number;
  active: boolean;
  created_at: Date;
}

export interface BenchmarkData {
  id: string;
  
  // Scope
  business_model: DIIBusinessModel;
  region: string;
  sector?: string;
  
  // Data
  calculation_date: Date;
  sample_size: number;
  dii_percentiles: {
    p25: number;
    p50: number;
    p75: number;
    p90: number;
    p95?: number;
  };
  dimension_medians?: {
    TRD?: number;
    AER?: number;
    HFP?: number;
    BRI?: number;
    RRG?: number;
  };
  
  // Scheduling
  next_recalculation_due?: Date;
  created_at: Date;
}

export interface ValidationRule {
  id: string;
  
  // Rule Definition
  rule_name: string;
  rule_type: RuleType;
  applies_to?: string;
  condition_sql: string;
  severity: RuleSeverity;
  message_template: string;
  
  // Status
  active: boolean;
  created_at: Date;
}

// ===================================================================
// BUSINESS LOGIC INTERFACES
// ===================================================================

export interface BusinessModelClassificationInput {
  // Company Data
  company_name: string;
  industry_traditional: string;
  
  // Optional Classification Questions
  revenue_model?: RevenueModel;
  operational_dependency?: OperationalDependency;
}

export interface BusinessModelClassificationResult {
  dii_business_model: DIIBusinessModel;
  confidence_score: number;
  reasoning: string;
  alternative_model?: DIIBusinessModel;
  
  // Classification Method Used
  method: 'industry_pattern' | 'two_question_matrix' | 'default_fallback';
  rule_used?: string;
}

export interface DIICalculationInput {
  // The 5 Dimensions
  TRD: {
    value: number;
    data_source: DataSource;
    confidence: number;
    evidence?: Record<string, any>;
  };
  AER: {
    value: number;
    data_source: DataSource;
    confidence: number;
    evidence?: Record<string, any>;
  };
  HFP: {
    value: number;
    data_source: DataSource;
    confidence: number;
    evidence?: Record<string, any>;
  };
  BRI: {
    value: number;
    data_source: DataSource;
    confidence: number;
    evidence?: Record<string, any>;
  };
  RRG: {
    value: number;
    data_source: DataSource;
    confidence: number;
    evidence?: Record<string, any>;
  };
}

export interface DIICalculationResult {
  dii_raw_score: number;
  dii_final_score: number;
  confidence_level: number;
  
  // Validation Results
  validation_errors: Array<{
    dimension?: DiiDimension;
    rule: string;
    severity: RuleSeverity;
    message: string;
  }>;
  
  // Benchmark Comparison
  benchmark_percentile?: number;
  industry_median?: number;
  
  // Recommendations
  recommendations: Array<{
    dimension: DiiDimension;
    current_score: number;
    target_score: number;
    improvement_actions: string[];
  }>;
}

// ===================================================================
// SERVICE INTERFACES
// ===================================================================

export interface CompanyDatabaseService {
  // Company Management
  createCompany(data: Omit<Company, 'id' | 'created_at' | 'updated_at'>): Promise<Company>;
  getCompany(id: string): Promise<Company | null>;
  getCompanyByDomain(domain: string): Promise<Company | null>;
  updateCompany(id: string, data: Partial<Company>): Promise<Company>;
  searchCompanies(query: string): Promise<Company[]>;
  
  // Business Model Classification
  classifyBusinessModel(input: BusinessModelClassificationInput): Promise<BusinessModelClassificationResult>;
  updateBusinessModelClassification(companyId: string, classification: BusinessModelClassificationResult): Promise<void>;
  
  // Assessment Management
  createAssessment(data: Omit<Assessment, 'id' | 'created_at'>): Promise<Assessment>;
  getAssessment(id: string): Promise<Assessment | null>;
  getCompanyAssessments(companyId: string): Promise<Assessment[]>;
  
  // Dimension Scores
  saveDimensionScores(assessmentId: string, scores: DIICalculationInput): Promise<DimensionScore[]>;
  getAssessmentDimensions(assessmentId: string): Promise<DimensionScore[]>;
  
  // DII Calculation
  calculateDII(companyId: string, input: DIICalculationInput): Promise<DIICalculationResult>;
  
  // Benchmarking
  getBenchmarkData(businessModel: DIIBusinessModel, region?: string): Promise<BenchmarkData | null>;
  updateBenchmarks(): Promise<void>;
  
  // Validation
  validateDimensionScores(input: DIICalculationInput): Promise<Array<{
    dimension?: DiiDimension;
    rule: string;
    severity: RuleSeverity;
    message: string;
  }>>;
}

export interface DatabaseMigrationService {
  // Schema Management
  createTables(): Promise<void>;
  dropTables(): Promise<void>;
  seedInitialData(): Promise<void>;
  
  // Migration Management
  runMigrations(): Promise<void>;
  rollbackMigration(version: string): Promise<void>;
  getMigrationStatus(): Promise<Array<{
    version: string;
    applied_at: Date;
    success: boolean;
  }>>;
}