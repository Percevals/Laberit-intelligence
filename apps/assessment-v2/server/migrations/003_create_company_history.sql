-- Migration: Create company history tracking table
-- Date: 2025-01-16
-- Purpose: Track DII score evolution across framework versions

-- Create company_history table
CREATE TABLE IF NOT EXISTS company_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    framework_version VARCHAR(10) NOT NULL,
    dii_score DECIMAL(3,1) CHECK (dii_score >= 0 AND dii_score <= 10),
    dii_stage VARCHAR(20) CHECK (dii_stage IN ('Frágil', 'Robusto', 'Resiliente', 'Adaptativo')),
    dimensions JSONB NOT NULL DEFAULT '{}',
    assessment_type VARCHAR(20) CHECK (assessment_type IN ('quick', 'comprehensive', 'migrated')),
    recorded_at TIMESTAMP NOT NULL,
    source VARCHAR(50) NOT NULL,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(100)
);

-- Create indexes for performance
CREATE INDEX idx_company_history_company_id ON company_history(company_id);
CREATE INDEX idx_company_history_recorded_at ON company_history(recorded_at DESC);
CREATE INDEX idx_company_history_framework_version ON company_history(framework_version);
CREATE INDEX idx_company_history_dii_score ON company_history(dii_score);

-- Create composite index for common queries
CREATE INDEX idx_company_history_company_framework ON company_history(company_id, framework_version, recorded_at DESC);

-- Add table comments
COMMENT ON TABLE company_history IS 'Historical tracking of company DII scores and assessments across framework versions';
COMMENT ON COLUMN company_history.dimensions IS 'JSON object containing dimension scores: {AER, HFP, BRI, TRD, RRG}';
COMMENT ON COLUMN company_history.metadata IS 'Additional metadata like migration info, confidence levels, etc';
COMMENT ON COLUMN company_history.source IS 'Source of the record: manual, import, assessment, migration';

-- Create view for latest scores per company
CREATE OR REPLACE VIEW company_latest_scores AS
SELECT DISTINCT ON (company_id, framework_version)
    company_id,
    framework_version,
    dii_score,
    dii_stage,
    dimensions,
    recorded_at
FROM company_history
ORDER BY company_id, framework_version, recorded_at DESC;