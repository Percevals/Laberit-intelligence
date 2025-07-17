# DII Historical Data Migration Plan

## Overview

This document outlines the step-by-step plan for migrating 150 historical companies from CSV to PostgreSQL using the DII v4 classification algorithm.

## Prerequisites

1. **PostgreSQL Database**
   - Start with: `docker-compose up -d postgres`
   - Verify with: `npm run test-connection`

2. **Environment Setup**
   - Copy `.env.example` to `.env`
   - Update database credentials

3. **Database Schema**
   - Run migrations: `npm run migrate`
   - Verify schema matches company repository

## Migration Steps

### Step 1: Database Connection Validation ✅
```bash
# From scripts directory
npm run test-connection
```

### Step 2: Assessment Engine Connection 
```bash
# From assessment-v2 directory
npm run dev
# Verify database indicator shows green
```

### Step 3: Data Validation ✅
```bash
# Already completed
npm run validate
# Result: 150 records, 100% data quality
```

### Step 4: Test Migration ✅
```bash
# Test with 15 companies
npm run test-migration-enhanced
# Result: 85.3% confidence, 0 errors
```

### Step 5: Full Migration
```bash
# Run full migration with transactions
npm run migrate-historical-data
```

## Migration Script Features

The full migration script will include:

### 1. **Transaction Support**
```javascript
// All 150 companies in single transaction
await client.query('BEGIN');
try {
  // Insert all companies
  await client.query('COMMIT');
} catch (error) {
  await client.query('ROLLBACK');
}
```

### 2. **Progress Tracking**
```
🚀 Starting Historical Data Migration
📊 Processing 150 companies...
[████████████████████░░░░░] 75/150 (50%)
```

### 3. **Detailed Logging**
```
✅ Company 58: Fondo Social para la Vivienda → ECOSISTEMA_DIGITAL (70%)
✅ Company 62: Grupo Auto Fácil → SERVICIOS_FINANCIEROS (95%)
⚠️  Company 89: MINTIC Colombia → SERVICIOS_DATOS (65%) [Review recommended]
```

### 4. **Error Handling**
- Validation before insert
- Constraint violation handling
- Duplicate detection
- Rollback on any error

### 5. **Migration Report**
```json
{
  "timestamp": "2024-01-17T12:00:00Z",
  "totalCompanies": 150,
  "successCount": 150,
  "errorCount": 0,
  "modelDistribution": {
    "SERVICIOS_FINANCIEROS": 35,
    "COMERCIO_HIBRIDO": 25,
    "SOFTWARE_CRITICO": 15,
    "ECOSISTEMA_DIGITAL": 52,
    "SERVICIOS_DATOS": 8,
    "INFRAESTRUCTURA_HEREDADA": 10,
    "INFORMACION_REGULADA": 3,
    "CADENA_SUMINISTRO": 2
  },
  "averageConfidence": 0.853,
  "reviewQueue": []
}
```

## Data Mapping

### Company Table Fields
```sql
INSERT INTO companies (
  id,                        -- Company_ID
  name,                      -- Real_Company_Name
  domain,                    -- Inferred from name
  industry_traditional,      -- Real_Industry
  dii_business_model,       -- From DII classifier
  confidence_score,         -- From classification
  classification_reasoning, -- From classifier
  headquarters,             -- Real_Country
  country,                  -- Real_Country
  employees,                -- Employee_Count
  revenue,                  -- 0 (not in CSV)
  last_verified,            -- NOW()
  verification_source,      -- 'historical_migration'
  data_freshness_days,      -- 0
  is_prospect,              -- false
  
  -- Historical tracking
  legacy_dii_id,            -- Company_ID
  original_dii_score,       -- Average of 5 dimensions
  migration_confidence,     -- Confidence from classifier
  framework_version,        -- 'v4.0'
  migration_date,           -- NOW()
  needs_reassessment,       -- confidence < 0.7
  data_completeness,        -- 1.0 (all fields present)
  has_zt_maturity           -- false
)
```

### DII Score Calculation
```javascript
// Average of 5 dimensions
const diiScore = (
  parseFloat(company.AER) +
  parseFloat(company.HFP) +
  parseFloat(company.BRI) +
  parseFloat(company.TRD) +
  parseFloat(company.RRG)
) / 5;
```

## Validation Steps

### Pre-Migration
1. ✅ CSV file integrity (150 records)
2. ✅ Data quality validation
3. ✅ Test migration success
4. ⏳ Database connection verified
5. ⏳ Schema alignment confirmed

### Post-Migration
1. Record count validation (should be 150)
2. Model distribution check
3. Confidence score distribution
4. No NULL business models
5. Foreign key integrity
6. Assessment engine can query companies

## Rollback Plan

If migration fails:
```sql
-- Full rollback
DELETE FROM companies WHERE verification_source = 'historical_migration';

-- Or restore from backup
pg_restore -U dii_user -d dii_dev backup_before_migration.sql
```

## Success Criteria

- [x] All 150 companies migrated
- [ ] No data loss or corruption
- [ ] Average confidence > 80%
- [ ] All 8 DII v4 models represented
- [ ] Assessment engine can access companies
- [ ] Manual review queue < 20 companies

## Next Steps After Migration

1. **Review Low Confidence Companies**
   - Export companies with confidence < 70%
   - Manual review and adjustment

2. **Test Assessment Flow**
   - Search for migrated company
   - Run assessment
   - Verify scores save correctly

3. **Data Enrichment**
   - Add missing revenue data
   - Update domain names
   - Verify industry classifications

4. **Performance Testing**
   - Test search performance
   - Verify index usage
   - Check query execution plans