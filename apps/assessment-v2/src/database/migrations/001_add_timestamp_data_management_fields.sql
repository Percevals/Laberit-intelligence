-- Migration: Add timestamp and data management fields to companies table
-- Date: 2025-01-15

-- Add new columns to the companies table
ALTER TABLE companies
ADD COLUMN last_verified TIMESTAMP WITH TIME ZONE,
ADD COLUMN verification_source VARCHAR(50) CHECK (verification_source IN ('ai_search', 'manual', 'import')),
ADD COLUMN data_freshness_days INTEGER DEFAULT 90,
ADD COLUMN is_prospect BOOLEAN DEFAULT false;

-- Create index on last_verified for efficient freshness checks
CREATE INDEX idx_companies_last_verified ON companies(last_verified);

-- Create index on is_prospect for filtering prospects
CREATE INDEX idx_companies_is_prospect ON companies(is_prospect);

-- Update existing records to have a default last_verified date
UPDATE companies 
SET last_verified = created_at,
    verification_source = 'import'
WHERE last_verified IS NULL;