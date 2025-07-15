-- DII Business Model Database Schema
-- Simplified 80/20 approach - Static business models, focus on assessments

-- ===================================================================
-- CORE COMPANY DATABASE
-- ===================================================================

CREATE TABLE companies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    legal_name VARCHAR(255),
    domain VARCHAR(255),
    
    -- Traditional Industry (from industries.ts)
    industry_traditional VARCHAR(100) NOT NULL,
    
    -- DII Business Model Classification (Static)
    dii_business_model VARCHAR(50) NOT NULL CHECK (dii_business_model IN (
        'COMERCIO_HIBRIDO',
        'SOFTWARE_CRITICO', 
        'SERVICIOS_DATOS',
        'ECOSISTEMA_DIGITAL',
        'SERVICIOS_FINANCIEROS',
        'INFRAESTRUCTURA_HEREDADA',
        'CADENA_SUMINISTRO',
        'INFORMACION_REGULADA'
    )),
    confidence_score DECIMAL(3,2) CHECK (confidence_score >= 0.0 AND confidence_score <= 1.0),
    classification_reasoning TEXT,
    
    -- Company Details
    headquarters VARCHAR(255),
    country VARCHAR(100),
    region VARCHAR(100) DEFAULT 'LATAM',
    employees INTEGER,
    revenue BIGINT, -- Annual revenue in USD
    
    -- Data Management
    last_verified TIMESTAMP WITH TIME ZONE,
    verification_source VARCHAR(50) CHECK (verification_source IN ('ai_search', 'manual', 'import')),
    data_freshness_days INTEGER DEFAULT 90,
    is_prospect BOOLEAN DEFAULT false,
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Indexes
    UNIQUE(domain),
    INDEX idx_companies_industry (industry_traditional),
    INDEX idx_companies_dii_model (dii_business_model),
    INDEX idx_companies_country (country),
    INDEX idx_companies_last_verified (last_verified),
    INDEX idx_companies_is_prospect (is_prospect)
);

-- ===================================================================
-- ASSESSMENT ENGINE
-- ===================================================================

CREATE TABLE assessments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    
    -- Assessment Details
    assessment_type VARCHAR(50) NOT NULL CHECK (assessment_type IN (
        'quick_30min',
        'formal_comprehensive', 
        'benchmark_update',
        'follow_up'
    )),
    
    -- DII Scores
    dii_raw_score DECIMAL(5,3),
    dii_final_score DECIMAL(5,3),
    confidence_level INTEGER CHECK (confidence_level >= 0 AND confidence_level <= 100),
    
    -- Assessment Context
    assessed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    assessed_by_user_id UUID, -- Reference to users table when implemented
    framework_version VARCHAR(20) DEFAULT 'v4.0',
    
    -- Calculation Inputs (JSON)
    calculation_inputs JSONB,
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Indexes
    INDEX idx_assessments_company (company_id),
    INDEX idx_assessments_date (assessed_at),
    INDEX idx_assessments_type (assessment_type)
);

-- ===================================================================
-- DII DIMENSIONS
-- ===================================================================

CREATE TABLE dimension_scores (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    assessment_id UUID NOT NULL REFERENCES assessments(id) ON DELETE CASCADE,
    
    -- The 5 DII Dimensions
    dimension VARCHAR(10) NOT NULL CHECK (dimension IN (
        'TRD', -- Time to Revenue Degradation
        'AER', -- Attack Economics Ratio  
        'HFP', -- Human Failure Probability
        'BRI', -- Blast Radius Index
        'RRG'  -- Recovery Reality Gap
    )),
    
    -- Score Values
    raw_value DECIMAL(10,6) NOT NULL,
    normalized_value DECIMAL(5,3),
    confidence_score DECIMAL(3,2) CHECK (confidence_score >= 0.0 AND confidence_score <= 1.0),
    
    -- Data Quality
    data_source VARCHAR(50) CHECK (data_source IN (
        'incident_history',
        'simulation_exercise', 
        'expert_estimate',
        'industry_benchmark',
        'ai_inference'
    )),
    validation_status VARCHAR(20) DEFAULT 'valid' CHECK (validation_status IN (
        'valid',
        'flagged',
        'requires_review',
        'invalid'
    )),
    
    -- Supporting Evidence
    calculation_method VARCHAR(100),
    supporting_evidence JSONB,
    
    -- Metadata  
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Constraints
    UNIQUE(assessment_id, dimension),
    INDEX idx_dimension_scores_assessment (assessment_id),
    INDEX idx_dimension_scores_dimension (dimension)
);

-- ===================================================================
-- BUSINESS MODEL DEFINITIONS (Static Configuration)
-- ===================================================================

CREATE TABLE dii_model_profiles (
    model_id INTEGER PRIMARY KEY CHECK (model_id >= 1 AND model_id <= 8),
    model_name VARCHAR(50) NOT NULL UNIQUE,
    
    -- DII Baseline Ranges
    dii_base_min DECIMAL(3,2) NOT NULL,
    dii_base_max DECIMAL(3,2) NOT NULL, 
    dii_base_avg DECIMAL(3,2) NOT NULL,
    risk_multiplier DECIMAL(3,2) NOT NULL,
    
    -- Digital Dependency Ranges
    digital_dependency_min INTEGER CHECK (digital_dependency_min >= 0 AND digital_dependency_min <= 100),
    digital_dependency_max INTEGER CHECK (digital_dependency_max >= 0 AND digital_dependency_max <= 100),
    
    -- Typical TRD Ranges (hours)
    typical_trd_hours_min DECIMAL(5,2),
    typical_trd_hours_max DECIMAL(5,2),
    
    -- Business Logic
    vulnerability_patterns JSONB, -- Array of common attack patterns
    example_companies JSONB,      -- Array of example companies
    cyber_risk_explanation TEXT,  -- Why this model has specific risks
    
    -- Metadata
    active_from TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    active_to TIMESTAMP WITH TIME ZONE,
    
    -- Constraints
    CHECK (dii_base_min <= dii_base_avg),
    CHECK (dii_base_avg <= dii_base_max),
    CHECK (digital_dependency_min <= digital_dependency_max),
    CHECK (typical_trd_hours_min <= typical_trd_hours_max)
);

-- ===================================================================
-- CLASSIFICATION ALGORITHM (Static Rules)
-- ===================================================================

CREATE TABLE classification_rules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Rule Conditions
    industry_pattern VARCHAR(255), -- Keyword patterns for industry matching
    revenue_model VARCHAR(50) CHECK (revenue_model IN (
        'recurring_subscriptions',
        'per_transaction', 
        'project_based',
        'product_sales',
        'data_monetization',
        'platform_fees',
        'direct_sales',
        'enterprise_contracts'
    )),
    operational_dependency VARCHAR(20) CHECK (operational_dependency IN (
        'fully_digital',
        'hybrid_model',
        'physical_critical'
    )),
    
    -- Rule Output
    target_dii_model VARCHAR(50) NOT NULL REFERENCES dii_model_profiles(model_name),
    confidence_level DECIMAL(3,2) CHECK (confidence_level >= 0.0 AND confidence_level <= 1.0),
    reasoning_template TEXT NOT NULL,
    
    -- Rule Metadata
    rule_priority INTEGER DEFAULT 100, -- Lower = higher priority
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Indexes
    INDEX idx_classification_rules_industry (industry_pattern),
    INDEX idx_classification_rules_priority (rule_priority)
);

-- ===================================================================
-- BENCHMARK DATA (Simplified)
-- ===================================================================

CREATE TABLE benchmark_data (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Benchmark Scope
    business_model VARCHAR(50) NOT NULL REFERENCES dii_model_profiles(model_name),
    region VARCHAR(100) DEFAULT 'LATAM',
    sector VARCHAR(100), -- Optional sector filter
    
    -- Sample Data
    calculation_date DATE NOT NULL,
    sample_size INTEGER NOT NULL CHECK (sample_size >= 1),
    
    -- Percentile Data
    dii_percentiles JSONB NOT NULL, -- {"p25": 2.1, "p50": 3.5, "p75": 5.2, "p90": 7.1}
    dimension_medians JSONB,        -- {"TRD": 24, "AER": 0.5, "HFP": 0.65, "BRI": 0.4, "RRG": 2.8}
    
    -- Recalculation Schedule
    next_recalculation_due DATE,
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Constraints
    UNIQUE(business_model, region, sector, calculation_date),
    INDEX idx_benchmark_data_model (business_model),
    INDEX idx_benchmark_data_date (calculation_date)
);

-- ===================================================================
-- BUSINESS LOGIC VALIDATION RULES
-- ===================================================================

CREATE TABLE validation_rules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Rule Definition
    rule_name VARCHAR(100) NOT NULL UNIQUE,
    rule_type VARCHAR(50) NOT NULL CHECK (rule_type IN (
        'dimension_validation',
        'cross_dimension_check',
        'business_model_validation',
        'data_quality_check'
    )),
    
    -- Rule Logic
    applies_to VARCHAR(100), -- Which dimension/model this applies to
    condition_sql TEXT NOT NULL, -- SQL condition to check
    severity VARCHAR(20) DEFAULT 'warning' CHECK (severity IN (
        'error',
        'warning', 
        'info'
    )),
    message_template TEXT NOT NULL,
    
    -- Rule Status
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    INDEX idx_validation_rules_type (rule_type)
);

-- ===================================================================
-- INITIAL DATA POPULATION
-- ===================================================================

-- Insert the 8 DII Business Model Profiles
INSERT INTO dii_model_profiles (model_id, model_name, dii_base_min, dii_base_max, dii_base_avg, risk_multiplier, digital_dependency_min, digital_dependency_max, typical_trd_hours_min, typical_trd_hours_max, cyber_risk_explanation) VALUES
(1, 'COMERCIO_HIBRIDO', 1.5, 2.0, 1.75, 1.0, 30, 60, 24, 48, 'Omnichannel operations create multiple attack vectors across physical and digital channels'),
(2, 'SOFTWARE_CRITICO', 0.8, 1.2, 1.0, 1.5, 70, 90, 2, 6, 'SaaS platforms require 24/7 availability with customer data protection'),
(3, 'SERVICIOS_DATOS', 0.5, 0.9, 0.7, 2.0, 80, 95, 4, 12, 'Data concentration makes companies high-value targets for sophisticated attacks'),
(4, 'ECOSISTEMA_DIGITAL', 0.4, 0.8, 0.6, 2.5, 95, 100, 0.5, 2, 'Multi-sided platforms create complex attack surfaces across entire ecosystems'),
(5, 'SERVICIOS_FINANCIEROS', 0.2, 0.6, 0.4, 3.5, 95, 100, 0.5, 2, 'Financial services have zero tolerance for downtime and attract criminal organizations'),
(6, 'INFRAESTRUCTURA_HEREDADA', 0.2, 0.5, 0.35, 2.8, 20, 50, 48, 168, 'Legacy systems with known vulnerabilities create hybrid attack surfaces'),
(7, 'CADENA_SUMINISTRO', 0.4, 0.8, 0.6, 1.8, 40, 70, 8, 24, 'Supply chain integrations multiply potential entry points and cascade failures'),
(8, 'INFORMACION_REGULADA', 0.4, 0.7, 0.55, 3.0, 60, 80, 6, 18, 'Regulated data attracts nation-state actors and has severe compliance penalties');

-- Insert Core Validation Rules
INSERT INTO validation_rules (rule_name, rule_type, applies_to, condition_sql, severity, message_template) VALUES
('RRG_minimum_validation', 'dimension_validation', 'RRG', 'raw_value < 1.0', 'error', 'RRG cannot be less than 1.0 - recovery cannot be faster than documented'),
('HFP_range_validation', 'dimension_validation', 'HFP', 'raw_value < 0.05 OR raw_value > 0.95', 'warning', 'HFP outside normal range (5%-95%) - please verify data source'),
('TRD_minimum_validation', 'dimension_validation', 'TRD', 'raw_value < 0.5', 'warning', 'TRD less than 30 minutes is extremely rare - please verify'),
('AER_extreme_validation', 'dimension_validation', 'AER', 'raw_value > 50.0', 'warning', 'AER above 50 indicates very expensive attacks - please verify calculation'),
('BRI_maximum_validation', 'dimension_validation', 'BRI', 'raw_value > 1.0', 'error', 'BRI cannot exceed 100% (1.0) - blast radius cannot be more than complete');

-- Insert Industry Classification Rules (High Confidence)
INSERT INTO classification_rules (industry_pattern, target_dii_model, confidence_level, reasoning_template, rule_priority) VALUES
('banking|banco|bank', 'SERVICIOS_FINANCIEROS', 0.95, 'Banking operations require real-time transaction processing with zero downtime tolerance', 10),
('software|saas|cloud', 'SOFTWARE_CRITICO', 0.90, 'SaaS platforms require 24/7 availability with customer data protection', 10),
('retail|comercio|store|shop', 'COMERCIO_HIBRIDO', 0.90, 'Retail operations span physical stores and digital channels requiring omnichannel security', 10),
('health|salud|hospital|clinic', 'INFORMACION_REGULADA', 0.95, 'Healthcare data requires strict compliance with patient privacy regulations', 10),
('logistics|shipping|delivery', 'CADENA_SUMINISTRO', 0.90, 'Logistics operations depend on real-time tracking and partner integrations', 10),
('manufacturing|oil|energy|mining', 'INFRAESTRUCTURA_HEREDADA', 0.85, 'Traditional infrastructure with digital transformation creates hybrid vulnerabilities', 10),
('marketplace|platform|ecosystem', 'ECOSISTEMA_DIGITAL', 0.90, 'Multi-sided platform connecting multiple participants and service providers', 10),
('analytics|data|research|intelligence', 'SERVICIOS_DATOS', 0.90, 'Business model depends on data collection, processing, and monetization', 10);