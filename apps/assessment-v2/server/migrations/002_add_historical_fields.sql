-- Migration: Add historical data tracking fields
-- Date: 2025-01-16
-- Purpose: Support DII v4.0 historical data import

-- Add fields to companies table for historical tracking
ALTER TABLE companies 
ADD COLUMN IF NOT EXISTS legacy_dii_id INTEGER,
ADD COLUMN IF NOT EXISTS original_dii_score DECIMAL(3,1),
ADD COLUMN IF NOT EXISTS migration_confidence VARCHAR(20) CHECK (migration_confidence IN ('HIGH', 'MEDIUM', 'LOW')),
ADD COLUMN IF NOT EXISTS framework_version VARCHAR(10) DEFAULT 'v4.0',
ADD COLUMN IF NOT EXISTS migration_date TIMESTAMP,
ADD COLUMN IF NOT EXISTS needs_reassessment BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS data_completeness DECIMAL(3,2) CHECK (data_completeness >= 0 AND data_completeness <= 1),
ADD COLUMN IF NOT EXISTS has_zt_maturity BOOLEAN DEFAULT false;

-- Create index for legacy ID lookups
CREATE INDEX IF NOT EXISTS idx_companies_legacy_dii_id ON companies(legacy_dii_id);

-- Create index for framework version
CREATE INDEX IF NOT EXISTS idx_companies_framework_version ON companies(framework_version);

-- Add comments for documentation
COMMENT ON COLUMN companies.legacy_dii_id IS 'Original ID from DII v3.0/v4.0 migration';
COMMENT ON COLUMN companies.original_dii_score IS 'DII score from historical assessment (0-10 scale)';  
COMMENT ON COLUMN companies.migration_confidence IS 'Confidence level of migrated data';
COMMENT ON COLUMN companies.framework_version IS 'DII framework version used for assessment';
COMMENT ON COLUMN companies.migration_date IS 'Date when data was migrated from previous framework';
COMMENT ON COLUMN companies.needs_reassessment IS 'Flag indicating if company needs updated assessment';
COMMENT ON COLUMN companies.data_completeness IS 'Percentage of complete data (0-1)';
COMMENT ON COLUMN companies.has_zt_maturity IS 'Whether Zero Trust maturity data is available';