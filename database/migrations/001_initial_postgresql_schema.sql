-- =============================================================================
-- Laberit Intelligence - PostgreSQL Schema Migration
-- Converts SQLite schema to cloud-native PostgreSQL
-- =============================================================================

-- Enable required extensions
-- Note: Azure PostgreSQL doesn't allow extensions, use built-in functions instead
-- CREATE EXTENSION IF NOT EXISTS "uuid-ossp"; -- Use gen_random_uuid() instead
-- CREATE EXTENSION IF NOT EXISTS "pg_trgm"; -- Use LIKE for text search instead

-- =============================================================================
-- CUSTOM TYPES AND ENUMS
-- =============================================================================

-- DII Business Model Classification
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
CREATE TYPE validation_status AS ENUM ('valid', 'flagged', 'requires_review', 'invalid');

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

-- Rule Types
CREATE TYPE rule_type AS ENUM (
    'dimension_validation',
    'cross_dimension_check',
    'business_model_validation',
    'data_quality_check'
);

-- =============================================================================
-- CORE TABLES
-- =============================================================================

-- Companies Table
CREATE TABLE companies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    legal_name VARCHAR(255),
    domain VARCHAR(255) UNIQUE,
    
    -- Traditional Industry Classification (for reference and cross-analysis)
    industry_traditional VARCHAR(255) NOT NULL,
    
    -- DII Business Model Classification (for assessment)
    dii_business_model dii_business_model NOT NULL,
    confidence_score DECIMAL(3,2) CHECK (confidence_score >= 0.0 AND confidence_score <= 1.0),
    classification_reasoning TEXT,
    
    -- Company Details
    headquarters VARCHAR(255),
    country VARCHAR(100),
    region VARCHAR(50) DEFAULT 'LATAM',
    employees INTEGER CHECK (employees >= 0),
    revenue BIGINT CHECK (revenue >= 0), -- Annual revenue in USD
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Assessments Table
CREATE TABLE assessments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    
    -- Assessment Details
    assessment_type assessment_type NOT NULL,
    
    -- DII Scores
    dii_raw_score DECIMAL(8,5) CHECK (dii_raw_score >= 0),
    dii_final_score DECIMAL(8,5) CHECK (dii_final_score >= 0),
    confidence_level INTEGER CHECK (confidence_level >= 0 AND confidence_level <= 100),
    
    -- Assessment Context
    assessed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    assessed_by_user_id UUID, -- Future: link to users table
    framework_version VARCHAR(10) DEFAULT 'v4.0',
    
    -- Calculation Inputs (stored as JSONB for flexible querying)
    calculation_inputs JSONB,
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Dimension Scores Table
CREATE TABLE dimension_scores (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
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
    supporting_evidence JSONB, -- Flexible structure for evidence data
    
    -- Metadata  
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Constraints
    UNIQUE(assessment_id, dimension)
);

-- DII Model Profiles Table
CREATE TABLE dii_model_profiles (
    model_id INTEGER PRIMARY KEY CHECK (model_id >= 1 AND model_id <= 8),
    model_name dii_business_model NOT NULL UNIQUE,
    
    -- DII Baseline Ranges
    dii_base_min DECIMAL(8,5) NOT NULL CHECK (dii_base_min >= 0),
    dii_base_max DECIMAL(8,5) NOT NULL CHECK (dii_base_max >= dii_base_min),
    dii_base_avg DECIMAL(8,5) NOT NULL CHECK (dii_base_avg >= dii_base_min AND dii_base_avg <= dii_base_max),
    risk_multiplier DECIMAL(5,2) NOT NULL CHECK (risk_multiplier > 0),
    
    -- Digital Dependency Ranges
    digital_dependency_min INTEGER CHECK (digital_dependency_min >= 0 AND digital_dependency_min <= 100),
    digital_dependency_max INTEGER CHECK (digital_dependency_max >= 0 AND digital_dependency_max <= 100 AND digital_dependency_max >= digital_dependency_min),
    
    -- Typical TRD Ranges (hours)
    typical_trd_hours_min DECIMAL(8,2) CHECK (typical_trd_hours_min >= 0),
    typical_trd_hours_max DECIMAL(8,2) CHECK (typical_trd_hours_max >= typical_trd_hours_min),
    
    -- Business Logic (stored as JSONB for flexibility)
    vulnerability_patterns JSONB,
    example_companies JSONB,
    cyber_risk_explanation TEXT,
    
    -- Metadata
    active_from TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    active_to TIMESTAMP WITH TIME ZONE
);

-- Classification Rules Table
CREATE TABLE classification_rules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Rule Conditions
    industry_pattern TEXT, -- Keyword patterns for industry matching (pipe-separated)
    revenue_model revenue_model,
    operational_dependency operational_dependency,
    
    -- Rule Output
    target_dii_model dii_business_model NOT NULL,
    confidence_level DECIMAL(3,2) CHECK (confidence_level >= 0.0 AND confidence_level <= 1.0),
    reasoning_template TEXT NOT NULL,
    
    -- Rule Metadata
    rule_priority INTEGER DEFAULT 100, -- Lower = higher priority
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Benchmark Data Table
CREATE TABLE benchmark_data (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Benchmark Scope
    business_model dii_business_model NOT NULL,
    region VARCHAR(50) DEFAULT 'LATAM',
    sector VARCHAR(100), -- Optional sector filter
    
    -- Sample Data
    calculation_date DATE NOT NULL,
    sample_size INTEGER NOT NULL CHECK (sample_size >= 1),
    
    -- Percentile Data (stored as JSONB for flexible querying)
    dii_percentiles JSONB NOT NULL, -- {"p25": 2.1, "p50": 3.5, "p75": 5.2, "p90": 7.1, "p95": 8.3}
    dimension_medians JSONB,        -- {"TRD": 24, "AER": 0.5, "HFP": 0.15, "BRI": 0.8, "RRG": 2.1}
    
    -- Recalculation Schedule
    next_recalculation_due DATE,
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Constraints
    UNIQUE(business_model, region, sector, calculation_date)
);

-- Validation Rules Table
CREATE TABLE validation_rules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Rule Definition
    rule_name VARCHAR(255) NOT NULL UNIQUE,
    rule_type rule_type NOT NULL,
    
    -- Rule Logic
    applies_to VARCHAR(50), -- Which dimension/model this applies to ('TRD', 'all', etc.)
    condition_sql TEXT NOT NULL, -- SQL condition to check
    severity rule_severity DEFAULT 'warning',
    message_template TEXT NOT NULL,
    
    -- Rule Status
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================================================
-- INDEXES FOR PERFORMANCE
-- =============================================================================

-- Companies indexes
CREATE INDEX idx_companies_industry ON companies(industry_traditional);
CREATE INDEX idx_companies_dii_model ON companies(dii_business_model);
CREATE INDEX idx_companies_country ON companies(country);
CREATE INDEX idx_companies_region ON companies(region);
CREATE INDEX idx_companies_created_at ON companies(created_at);
-- CREATE INDEX idx_companies_name_trgm ON companies USING GIN (name gin_trgm_ops); -- Disabled: Azure doesn't support pg_trgm
-- Use LIKE queries with idx_companies_name instead
CREATE INDEX idx_companies_domain ON companies(domain) WHERE domain IS NOT NULL;

-- Assessments indexes
CREATE INDEX idx_assessments_company ON assessments(company_id);
CREATE INDEX idx_assessments_date ON assessments(assessed_at);
CREATE INDEX idx_assessments_type ON assessments(assessment_type);
CREATE INDEX idx_assessments_created_at ON assessments(created_at);

-- Dimension scores indexes
CREATE INDEX idx_dimension_scores_assessment ON dimension_scores(assessment_id);
CREATE INDEX idx_dimension_scores_dimension ON dimension_scores(dimension);
CREATE INDEX idx_dimension_scores_created_at ON dimension_scores(created_at);

-- Classification rules indexes
CREATE INDEX idx_classification_rules_priority ON classification_rules(rule_priority) WHERE active = true;
CREATE INDEX idx_classification_rules_revenue ON classification_rules(revenue_model) WHERE active = true;
CREATE INDEX idx_classification_rules_dependency ON classification_rules(operational_dependency) WHERE active = true;

-- Benchmark data indexes
CREATE INDEX idx_benchmark_data_model_region ON benchmark_data(business_model, region);
CREATE INDEX idx_benchmark_data_date ON benchmark_data(calculation_date);

-- Validation rules indexes
CREATE INDEX idx_validation_rules_type ON validation_rules(rule_type) WHERE active = true;
CREATE INDEX idx_validation_rules_applies_to ON validation_rules(applies_to) WHERE active = true;

-- =============================================================================
-- TRIGGERS FOR AUTOMATIC TIMESTAMP UPDATES
-- =============================================================================

-- Function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for companies table
CREATE TRIGGER trigger_companies_updated_at
    BEFORE UPDATE ON companies
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- =============================================================================
-- VIEWS FOR COMMON QUERIES
-- =============================================================================

-- View for company assessments with latest scores
CREATE VIEW company_latest_assessments AS
SELECT DISTINCT ON (c.id) 
    c.id as company_id,
    c.name as company_name,
    c.dii_business_model,
    a.id as assessment_id,
    a.dii_final_score,
    a.confidence_level,
    a.assessed_at,
    a.framework_version
FROM companies c
LEFT JOIN assessments a ON c.id = a.company_id
ORDER BY c.id, a.assessed_at DESC;

-- View for dimension score analysis
CREATE VIEW dimension_score_summary AS
SELECT 
    a.company_id,
    ds.dimension,
    AVG(ds.raw_value) as avg_raw_value,
    MIN(ds.raw_value) as min_raw_value,
    MAX(ds.raw_value) as max_raw_value,
    AVG(ds.confidence_score) as avg_confidence,
    COUNT(*) as assessment_count
FROM dimension_scores ds
JOIN assessments a ON ds.assessment_id = a.id
GROUP BY a.company_id, ds.dimension;

-- =============================================================================
-- COMMENTS FOR DOCUMENTATION
-- =============================================================================

COMMENT ON TABLE companies IS 'Master company registry with DII business model classification';
COMMENT ON TABLE assessments IS 'DII assessment results and calculation history';
COMMENT ON TABLE dimension_scores IS 'Individual dimension scores for the 5 DII components';
COMMENT ON TABLE dii_model_profiles IS 'Static definitions and parameters for 8 DII business models';
COMMENT ON TABLE classification_rules IS 'Pattern matching rules for automatic business model classification';
COMMENT ON TABLE benchmark_data IS 'Regional and sector benchmark percentiles for DII scores';
COMMENT ON TABLE validation_rules IS 'Business logic validation rules for data quality assurance';

COMMENT ON TYPE dii_business_model IS '8 DII business models representing different cyber risk profiles';
COMMENT ON TYPE assessment_type IS 'Types of DII assessments based on time investment and depth';
COMMENT ON TYPE dii_dimension IS 'The 5 core DII dimensions: TRD, AER, HFP, BRI, RRG';

-- =============================================================================
-- INITIAL DATA SEEDING
-- =============================================================================

-- Note: Initial data should be inserted via separate migration files
-- This keeps the schema definition clean and allows for easier rollbacks

-- Example:
-- INSERT INTO dii_model_profiles (model_id, model_name, dii_base_min, dii_base_max, dii_base_avg, risk_multiplier, ...)
-- VALUES (1, 'COMERCIO_HIBRIDO', 1.5, 2.0, 1.75, 1.0, ...);