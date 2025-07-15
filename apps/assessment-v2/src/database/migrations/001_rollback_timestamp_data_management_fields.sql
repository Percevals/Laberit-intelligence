-- Rollback Migration: Remove timestamp and data management fields from companies table
-- Date: 2025-01-15

-- Drop indexes first
DROP INDEX IF EXISTS idx_companies_last_verified;
DROP INDEX IF EXISTS idx_companies_is_prospect;

-- Remove columns from companies table
ALTER TABLE companies
DROP COLUMN last_verified,
DROP COLUMN verification_source,
DROP COLUMN data_freshness_days,
DROP COLUMN is_prospect;