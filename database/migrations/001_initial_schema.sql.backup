-- =============================================================================
-- DII Assessment PostgreSQL Schema
-- Migration: 001_initial_schema.sql
-- =============================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================================================
-- ENUM TYPES
-- =============================================================================

-- DII Business Model Types
CREATE TYPE dii_business_model AS ENUM (
    'COMERCIO_HIBRIDO',
    'SOFTWARE_CRITICO',
    'SERVICIOS_DATOS',
    'ECOSISTEMA_DIGITAL',
    'SERVICIOS_FINANCIEROS',
    'INFRAESTRUCTURA_HEREDADA',
    'CADENA_SUMINISTRO',
    'INFORMACION_REGULADA'
);

-- Assessment Types
CREATE TYPE assessment_type AS ENUM (
    'quick_30min',
    'formal_comprehensive',
    'benchmark_update',
    'follow_up'
);

-- DII Dimensions
CREATE TYPE dii_dimension AS ENUM ('TRD', 'AER', 'HFP', 'BRI', 'RRG');

-- Data Sources
CREATE TYPE data_source AS ENUM (
    'incident_history',
    'simulation_exercise',
    'expert_estimate',
    'industry_benchmark',
    'ai_inference'
);

-- Validation Status
CREATE TYPE validation_status AS ENUM (
    'valid',
    'flagged',
    'requires_review',
    'invalid'
);

-- Revenue Models
CREATE TYPE revenue_model AS ENUM (
    'recurring_subscriptions',
    'per_transaction',
    'project_based',
    'product_sales',
    'data_monetization',
    'platform_fees',
    'direct_sales',
    'enterprise_contracts'
);

-- Operational Dependency
CREATE TYPE operational_dependency AS ENUM (
    'fully_digital',
    'hybrid_model',
    'physical_critical'
);

-- Rule Severity
CREATE TYPE rule_severity AS ENUM ('error', 'warning', 'info');

-- Rule Type
CREATE TYPE rule_type AS ENUM (
    'dimension_validation',
    'cross_dimension_check',
    'business_model_validation',
    'data_quality_check'
);

-- =============================================================================
-- TABLES
-- =============================================================================

-- Companies table
CREATE TABLE companies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    legal_name VARCHAR(255),
    domain VARCHAR(255) UNIQUE,
    
    -- Traditional Industry (from industries.ts)
    industry_traditional VARCHAR(255) NOT NULL,
    
    -- DII Business Model Classification
    dii_business_model dii_business_model NOT NULL,
    confidence_score DECIMAL(3,2) CHECK (confidence_score >= 0.0 AND confidence_score <= 1.0),
    classification_reasoning TEXT,
    
    -- Company Details
    headquarters VARCHAR(255),
    country VARCHAR(100),
    region VARCHAR(50) DEFAULT 'LATAM',
    employees INTEGER,
    revenue BIGINT, -- Annual revenue in USD
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Assessments table
CREATE TABLE assessments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    
    -- Assessment Details
    assessment_type assessment_type NOT NULL,
    
    -- DII Scores
    dii_raw_score DECIMAL(10,5),
    dii_final_score DECIMAL(10,5),
    confidence_level INTEGER CHECK (confidence_level >= 0 AND confidence_level <= 100),
    
    -- Assessment Context
    assessed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    assessed_by_user_id UUID,
    framework_version VARCHAR(10) DEFAULT 'v4.0',
    
    -- Calculation Inputs (JSON)
    calculation_inputs JSONB,
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Dimension Scores table
CREATE TABLE dimension_scores (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    assessment_id UUID NOT NULL REFERENCES assessments(id) ON DELETE CASCADE,
    
    -- The 5 DII Dimensions
    dimension dii_dimension NOT NULL,
    
    -- Score Values
    raw_value DECIMAL(10,5) NOT NULL,
    normalized_value DECIMAL(10,5),
    confidence_score DECIMAL(3,2) CHECK (confidence_score >= 0.0 AND confidence_score <= 1.0),
    
    -- Data Quality
    data_source data_source,
    validation_status validation_status DEFAULT 'valid',
    
    -- Supporting Evidence
    calculation_method TEXT,
    supporting_evidence JSONB,
    
    -- Metadata  
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- Constraints
    UNIQUE(assessment_id, dimension)
);

-- DII Model Profiles table
CREATE TABLE dii_model_profiles (
    model_id INTEGER PRIMARY KEY CHECK (model_id >= 1 AND model_id <= 8),
    model_name dii_business_model NOT NULL UNIQUE,
    
    -- DII Baseline Ranges
    dii_base_min DECIMAL(10,5) NOT NULL,
    dii_base_max DECIMAL(10,5) NOT NULL, 
    dii_base_avg DECIMAL(10,5) NOT NULL,
    risk_multiplier DECIMAL(5,2) NOT NULL,
    
    -- Digital Dependency Ranges
    digital_dependency_min INTEGER CHECK (digital_dependency_min >= 0 AND digital_dependency_min <= 100),
    digital_dependency_max INTEGER CHECK (digital_dependency_max >= 0 AND digital_dependency_max <= 100),
    
    -- Typical TRD Ranges (hours)
    typical_trd_hours_min DECIMAL(10,2),
    typical_trd_hours_max DECIMAL(10,2),
    
    -- Business Logic
    vulnerability_patterns JSONB,
    example_companies JSONB,
    cyber_risk_explanation TEXT,
    
    -- Metadata
    active_from TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    active_to TIMESTAMP WITH TIME ZONE,
    
    -- Constraints
    CHECK (dii_base_min <= dii_base_avg),
    CHECK (dii_base_avg <= dii_base_max),
    CHECK (digital_dependency_min <= digital_dependency_max),
    CHECK (typical_trd_hours_min <= typical_trd_hours_max)
);

-- Classification Rules table
CREATE TABLE classification_rules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Rule Conditions
    industry_pattern TEXT, -- Keyword patterns for industry matching
    revenue_model revenue_model,
    operational_dependency operational_dependency,
    
    -- Rule Output
    target_dii_model dii_business_model NOT NULL,
    confidence_level DECIMAL(3,2) CHECK (confidence_level >= 0.0 AND confidence_level <= 1.0),
    reasoning_template TEXT NOT NULL,
    
    -- Rule Metadata
    rule_priority INTEGER DEFAULT 100, -- Lower = higher priority
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Benchmark Data table
CREATE TABLE benchmark_data (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Benchmark Scope
    business_model dii_business_model NOT NULL,
    region VARCHAR(50) DEFAULT 'LATAM',
    sector VARCHAR(100), -- Optional sector filter
    
    -- Sample Data
    calculation_date DATE NOT NULL,
    sample_size INTEGER NOT NULL CHECK (sample_size >= 1),
    
    -- Percentile Data (JSON)
    dii_percentiles JSONB NOT NULL, -- {"p25": 2.1, "p50": 3.5, ...}
    dimension_medians JSONB,        -- {"TRD": 24, "AER": 0.5, ...}
    
    -- Recalculation Schedule
    next_recalculation_due DATE,
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- Constraints
    UNIQUE(business_model, region, sector, calculation_date)
);

-- Validation Rules table
CREATE TABLE validation_rules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Rule Definition
    rule_name VARCHAR(255) NOT NULL UNIQUE,
    rule_type rule_type NOT NULL,
    
    -- Rule Logic
    applies_to VARCHAR(50), -- Which dimension/model this applies to
    condition_sql TEXT NOT NULL, -- SQL condition to check
    severity rule_severity DEFAULT 'warning',
    message_template TEXT NOT NULL,
    
    -- Rule Status
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- =============================================================================
-- INDEXES FOR PERFORMANCE
-- =============================================================================

-- Companies indexes
CREATE INDEX idx_companies_industry ON companies(industry_traditional);
CREATE INDEX idx_companies_dii_model ON companies(dii_business_model);
CREATE INDEX idx_companies_country ON companies(country);
CREATE INDEX idx_companies_created_at ON companies(created_at DESC);
CREATE INDEX idx_companies_name_lower ON companies(LOWER(name));

-- Assessments indexes
CREATE INDEX idx_assessments_company ON assessments(company_id);
CREATE INDEX idx_assessments_date ON assessments(assessed_at DESC);
CREATE INDEX idx_assessments_type ON assessments(assessment_type);

-- Dimension scores indexes
CREATE INDEX idx_dimension_scores_assessment ON dimension_scores(assessment_id);
CREATE INDEX idx_dimension_scores_dimension ON dimension_scores(dimension);

-- Classification rules indexes
CREATE INDEX idx_classification_rules_priority ON classification_rules(rule_priority) 
    WHERE active = true;

-- Benchmark data indexes
CREATE INDEX idx_benchmark_data_model_region ON benchmark_data(business_model, region);
CREATE INDEX idx_benchmark_data_date ON benchmark_data(calculation_date DESC);

-- Validation rules indexes
CREATE INDEX idx_validation_rules_type ON validation_rules(rule_type) 
    WHERE active = true;

-- =============================================================================
-- TRIGGERS FOR UPDATED_AT
-- =============================================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger for companies table
CREATE TRIGGER update_companies_updated_at BEFORE UPDATE
    ON companies FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =============================================================================
-- INITIAL DATA - DII Model Profiles
-- =============================================================================

INSERT INTO dii_model_profiles (
    model_id, model_name, dii_base_min, dii_base_max, dii_base_avg,
    risk_multiplier, digital_dependency_min, digital_dependency_max,
    typical_trd_hours_min, typical_trd_hours_max, cyber_risk_explanation
) VALUES
(1, 'COMERCIO_HIBRIDO', 1.5, 2.0, 1.75, 1.0, 30, 60, 24, 48,
    'Omnichannel operations create multiple attack vectors across physical and digital channels'),
(2, 'SOFTWARE_CRITICO', 0.8, 1.2, 1.0, 1.5, 70, 90, 2, 6,
    'SaaS platforms require 24/7 availability with customer data protection'),
(3, 'SERVICIOS_DATOS', 0.5, 0.9, 0.7, 2.0, 80, 95, 4, 12,
    'Data concentration makes companies high-value targets for sophisticated attacks'),
(4, 'ECOSISTEMA_DIGITAL', 0.4, 0.8, 0.6, 2.5, 95, 100, 0.5, 2,
    'Multi-sided platforms create complex attack surfaces across entire ecosystems'),
(5, 'SERVICIOS_FINANCIEROS', 0.2, 0.6, 0.4, 3.5, 95, 100, 0.5, 2,
    'Financial services have zero tolerance for downtime and attract criminal organizations'),
(6, 'INFRAESTRUCTURA_HEREDADA', 0.2, 0.5, 0.35, 2.8, 20, 50, 48, 168,
    'Legacy systems with known vulnerabilities create hybrid attack surfaces'),
(7, 'CADENA_SUMINISTRO', 0.4, 0.8, 0.6, 1.8, 40, 70, 8, 24,
    'Supply chain integrations multiply potential entry points and cascade failures'),
(8, 'INFORMACION_REGULADA', 0.4, 0.7, 0.55, 3.0, 60, 80, 6, 18,
    'Regulated data attracts nation-state actors and has severe compliance penalties');

-- =============================================================================
-- INITIAL DATA - Classification Rules
-- =============================================================================

INSERT INTO classification_rules (
    industry_pattern, target_dii_model, confidence_level, 
    reasoning_template, rule_priority
) VALUES
('banking|banco|bank', 'SERVICIOS_FINANCIEROS', 0.95,
    'Banking operations require real-time transaction processing with zero downtime tolerance', 10),
('software|saas|cloud', 'SOFTWARE_CRITICO', 0.90,
    'SaaS platforms require 24/7 availability with customer data protection', 10),
('retail|comercio|store|shop', 'COMERCIO_HIBRIDO', 0.90,
    'Retail operations span physical stores and digital channels requiring omnichannel security', 10),
('health|salud|hospital|clinic', 'INFORMACION_REGULADA', 0.95,
    'Healthcare data requires strict compliance with patient privacy regulations', 10),
('logistics|shipping|delivery', 'CADENA_SUMINISTRO', 0.90,
    'Logistics operations depend on real-time tracking and partner integrations', 10),
('manufacturing|oil|energy|mining', 'INFRAESTRUCTURA_HEREDADA', 0.85,
    'Traditional infrastructure with digital transformation creates hybrid vulnerabilities', 10),
('marketplace|platform|ecosystem', 'ECOSISTEMA_DIGITAL', 0.90,
    'Multi-sided platform connecting multiple participants and service providers', 10),
('analytics|data|research|intelligence', 'SERVICIOS_DATOS', 0.90,
    'Business model depends on data collection, processing, and monetization', 10);

-- =============================================================================
-- INITIAL DATA - Validation Rules
-- =============================================================================

INSERT INTO validation_rules (
    rule_name, rule_type, applies_to, condition_sql, 
    severity, message_template
) VALUES
('RRG_minimum_validation', 'dimension_validation', 'RRG',
    'raw_value < 1.0', 'error',
    'RRG cannot be less than 1.0 - recovery cannot be faster than documented'),
('HFP_range_validation', 'dimension_validation', 'HFP',
    'raw_value < 0.05 OR raw_value > 0.95', 'warning',
    'HFP outside normal range (5%-95%) - please verify data source'),
('TRD_minimum_validation', 'dimension_validation', 'TRD',
    'raw_value < 0.5', 'warning',
    'TRD less than 30 minutes is extremely rare - please verify'),
('AER_extreme_validation', 'dimension_validation', 'AER',
    'raw_value > 50.0', 'warning',
    'AER above 50 indicates very expensive attacks - please verify calculation'),
('BRI_maximum_validation', 'dimension_validation', 'BRI',
    'raw_value > 1.0', 'error',
    'BRI cannot exceed 100% (1.0) - blast radius cannot be more than complete');

-- =============================================================================
-- MIGRATION TRACKING TABLE
-- =============================================================================

CREATE TABLE IF NOT EXISTS schema_migrations (
    migration_name VARCHAR(255) PRIMARY KEY,
    executed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Record this migration
INSERT INTO schema_migrations (migration_name) VALUES ('001_initial_schema.sql');