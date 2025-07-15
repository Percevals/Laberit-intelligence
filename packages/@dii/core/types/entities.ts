/**
 * Entity Types
 * TypeScript interfaces for database entities
 */

// Enum types matching PostgreSQL
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

export type DIIDimension = 'TRD' | 'AER' | 'HFP' | 'BRI' | 'RRG';

export type DataSource = 
  | 'incident_history'
  | 'simulation_exercise'
  | 'expert_estimate'
  | 'industry_benchmark'
  | 'ai_inference';

export type ValidationStatus = 'valid' | 'flagged' | 'requires_review' | 'invalid';

// Entity interfaces
export interface Company {
  id: string;
  name: string;
  legal_name?: string;
  domain?: string;
  industry_traditional: string;
  dii_business_model: DIIBusinessModel;
  confidence_score?: number;
  classification_reasoning?: string;
  headquarters?: string;
  country?: string;
  region: string;
  employees?: number;
  revenue?: number;
  created_at: Date;
  updated_at: Date;
}

export interface Assessment {
  id: string;
  company_id: string;
  assessment_type: AssessmentType;
  dii_raw_score?: number;
  dii_final_score?: number;
  confidence_level?: number;
  assessed_at: Date;
  assessed_by_user_id?: string;
  framework_version: string;
  calculation_inputs?: Record<string, any>;
  created_at: Date;
}

export interface DimensionScore {
  id: string;
  assessment_id: string;
  dimension: DIIDimension;
  raw_value: number;
  normalized_value?: number;
  confidence_score?: number;
  data_source?: DataSource;
  validation_status: ValidationStatus;
  calculation_method?: string;
  supporting_evidence?: Record<string, any>;
  created_at: Date;
}

// DTO interfaces for creation/updates
export interface CreateCompanyDto {
  name: string;
  legal_name?: string;
  domain?: string;
  industry_traditional: string;
  dii_business_model?: DIIBusinessModel;
  confidence_score?: number;
  classification_reasoning?: string;
  headquarters?: string;
  country?: string;
  region?: string;
  employees?: number;
  revenue?: number;
}

export interface UpdateCompanyDto {
  name?: string;
  legal_name?: string;
  domain?: string;
  industry_traditional?: string;
  dii_business_model?: DIIBusinessModel;
  confidence_score?: number;
  classification_reasoning?: string;
  headquarters?: string;
  country?: string;
  region?: string;
  employees?: number;
  revenue?: number;
}

export interface CreateAssessmentDto {
  company_id: string;
  assessment_type: AssessmentType;
  dii_raw_score?: number;
  dii_final_score?: number;
  confidence_level?: number;
  assessed_by_user_id?: string;
  framework_version?: string;
  calculation_inputs?: Record<string, any>;
}

export interface CreateDimensionScoreDto {
  assessment_id: string;
  dimension: DIIDimension;
  raw_value: number;
  normalized_value?: number;
  confidence_score?: number;
  data_source?: DataSource;
  validation_status?: ValidationStatus;
  calculation_method?: string;
  supporting_evidence?: Record<string, any>;
}

// Query interfaces
export interface CompanySearchCriteria {
  name?: string;
  industry?: string;
  dii_business_model?: DIIBusinessModel;
  country?: string;
  region?: string;
}

export interface AssessmentSearchCriteria {
  company_id?: string;
  assessment_type?: AssessmentType;
  from_date?: Date;
  to_date?: Date;
  min_score?: number;
  max_score?: number;
}