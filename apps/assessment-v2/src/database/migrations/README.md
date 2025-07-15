# Database Migrations

This directory contains database migration files for the assessment platform.

## Migration Files

### 001_add_timestamp_data_management_fields.sql
- **Date**: 2025-01-15
- **Description**: Adds timestamp and data management fields to the companies table
- **New Fields**:
  - `last_verified` (TIMESTAMP WITH TIME ZONE): When the company data was last verified
  - `verification_source` (VARCHAR): Source of verification ('ai_search', 'manual', 'import')
  - `data_freshness_days` (INTEGER): Number of days before data is considered stale (default: 90)
  - `is_prospect` (BOOLEAN): Whether the company is a prospect (default: false)
- **New Indexes**:
  - `idx_companies_last_verified`: For efficient freshness checks
  - `idx_companies_is_prospect`: For filtering prospects

### 001_rollback_timestamp_data_management_fields.sql
- **Date**: 2025-01-15
- **Description**: Rollback script to remove timestamp and data management fields

## Running Migrations

### PostgreSQL
```bash
# Apply migration
psql -U your_user -d your_database -f 001_add_timestamp_data_management_fields.sql

# Rollback migration
psql -U your_user -d your_database -f 001_rollback_timestamp_data_management_fields.sql
```

### Notes
- Always backup your database before running migrations
- Test migrations on a development database first
- The mock database service automatically includes these fields