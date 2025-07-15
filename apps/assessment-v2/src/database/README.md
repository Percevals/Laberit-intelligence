# DII Business Model Database

Simplified 80/20 approach for company business model classification and DII assessment storage.

## Overview

This database system implements the **8 DII Business Model categories** with a focus on practical assessment workflows rather than complex temporal evolution tracking.

## Architecture Principles

### ✅ **80/20 Simplifications Made:**
1. **Static Business Models** - Companies have one stable business model (no temporal evolution)
2. **Direct Classification** - Business model stored directly in companies table
3. **Industry Bridge** - Traditional industries map to DII models via classification rules
4. **Focus on Assessment** - Core workflow is company → classification → assessment → results

### 🎯 **Core Features:**
- **Clear Classification Algorithm** - Industry patterns + Two-question matrix
- **Embedded Business Logic** - SQL validation rules and confidence scoring
- **Real-time Benchmarking** - Automatic percentile calculations
- **Assessment Workflow** - Quick (30min) vs Formal (2-day) assessments

## Database Schema

### Core Tables

```sql
-- Companies with stable business model classification
companies (
    id, name, legal_name, domain,
    industry_traditional,           -- From industries.ts (user-friendly)
    dii_business_model,            -- One of 8 DII models (assessment-focused)
    confidence_score,              -- Classification confidence
    classification_reasoning,      -- Why this model was chosen
    headquarters, country, employees, revenue
)

-- Assessment results over time
assessments (
    id, company_id, assessment_type,
    dii_raw_score, dii_final_score, confidence_level,
    assessed_at, framework_version, calculation_inputs
)

-- The 5 DII dimensions for each assessment
dimension_scores (
    id, assessment_id, dimension,
    raw_value, normalized_value, confidence_score,
    data_source, validation_status, supporting_evidence
)
```

### Configuration Tables

```sql
-- Static business model definitions
dii_model_profiles (
    model_id, model_name,
    dii_base_min, dii_base_max, dii_base_avg, risk_multiplier,
    vulnerability_patterns, example_companies
)

-- Classification algorithm rules
classification_rules (
    industry_pattern, revenue_model, operational_dependency,
    target_dii_model, confidence_level, reasoning_template
)

-- Real-time benchmark data
benchmark_data (
    business_model, region, calculation_date,
    dii_percentiles, dimension_medians, sample_size
)
```

## The 8 DII Business Models

| ID | Model | DII Range | Risk | Description |
|----|-------|-----------|------|-------------|
| 1 | **COMERCIO_HIBRIDO** | 1.5-2.0 | 1.0x | Physical + digital channels |
| 2 | **SOFTWARE_CRITICO** | 0.8-1.2 | 1.5x | SaaS/cloud solutions |
| 3 | **SERVICIOS_DATOS** | 0.5-0.9 | 2.0x | Data monetization |
| 4 | **ECOSISTEMA_DIGITAL** | 0.4-0.8 | 2.5x | Multi-sided platforms |
| 5 | **SERVICIOS_FINANCIEROS** | 0.2-0.6 | 3.5x | Transaction processing |
| 6 | **INFRAESTRUCTURA_HEREDADA** | 0.2-0.5 | 2.8x | Legacy + digital layers |
| 7 | **CADENA_SUMINISTRO** | 0.4-0.8 | 1.8x | Logistics + tracking |
| 8 | **INFORMACION_REGULADA** | 0.4-0.7 | 3.0x | Healthcare, sensitive data |

## Classification Algorithm

### 1. **Industry Pattern Matching** (90%+ confidence)
```typescript
// High confidence industry shortcuts
'banking|banco|bank' → SERVICIOS_FINANCIEROS
'software|saas|cloud' → SOFTWARE_CRITICO  
'retail|comercio' → COMERCIO_HIBRIDO
'health|salud|hospital' → INFORMACION_REGULADA
'logistics|shipping' → CADENA_SUMINISTRO
'manufacturing|oil|energy' → INFRAESTRUCTURA_HEREDADA
'marketplace|platform' → ECOSISTEMA_DIGITAL
'analytics|data|research' → SERVICIOS_DATOS
```

### 2. **Two-Question Matrix** (70-90% confidence)
```typescript
// For unknown industries, ask:
// Q1: Revenue Model (8 options)
// Q2: Operational Dependency (3 options)
// → Maps to specific DII business model
```

### 3. **Default Fallback** (60% confidence)
```typescript
// When no clear match: COMERCIO_HIBRIDO
// (Most common hybrid pattern)
```

## DII Calculation

### Formula
```
DII Raw = (TRD × AER) / (HFP × BRI × RRG)
DII Score = (DII Raw / Model Base) × 10
```

### The 5 Dimensions
- **TRD** - Time to Revenue Degradation (hours)
- **AER** - Attack Economics Ratio (cost/value)
- **HFP** - Human Failure Probability (monthly %)
- **BRI** - Blast Radius Index (% of systems reachable)
- **RRG** - Recovery Reality Gap (multiplier vs documented)

### Validation Rules
```sql
-- Embedded business logic
RRG ≥ 1.0                    -- Cannot recover faster than documented
HFP between 5%-95%           -- Realistic failure rates
TRD ≥ 0.5 hours             -- Minimum realistic degradation time
AER ≤ 50.0                  -- Maximum realistic attack cost ratio
BRI ≤ 100%                  -- Cannot exceed complete blast radius
```

## Service Implementation

### Core Service Methods
```typescript
interface CompanyDatabaseService {
  // Company Management
  createCompany(data) → Company
  getCompany(id) → Company
  searchCompanies(query) → Company[]
  
  // Business Model Classification
  classifyBusinessModel(input) → BusinessModelClassificationResult
  updateBusinessModelClassification(companyId, classification)
  
  // Assessment Workflow
  createAssessment(data) → Assessment
  saveDimensionScores(assessmentId, scores) → DimensionScore[]
  calculateDII(companyId, input) → DIICalculationResult
  
  // Intelligence
  getBenchmarkData(businessModel, region) → BenchmarkData
  validateDimensionScores(input) → ValidationError[]
}
```

## Usage Examples

### 1. **Create Company with Auto-Classification**
```typescript
const company = await db.createCompany({
  name: "Banco Santander México",
  industry_traditional: "Financial Services",
  employees: 15000,
  country: "Mexico"
});

// Auto-classified as:
// dii_business_model: "SERVICIOS_FINANCIEROS"
// confidence_score: 0.95
// reasoning: "Banking operations require real-time transaction processing..."
```

### 2. **Run DII Assessment**
```typescript
const result = await db.calculateDII(companyId, {
  TRD: { value: 1.5, data_source: 'expert_estimate', confidence: 0.8 },
  AER: { value: 0.1, data_source: 'incident_history', confidence: 0.9 },
  HFP: { value: 0.75, data_source: 'simulation_exercise', confidence: 0.85 },
  BRI: { value: 0.6, data_source: 'expert_estimate', confidence: 0.7 },
  RRG: { value: 2.5, data_source: 'industry_benchmark', confidence: 0.6 }
});

// Returns:
// dii_final_score: 3.2
// benchmark_percentile: 45
// validation_errors: []
// recommendations: [...]
```

### 3. **Get Benchmark Comparison**
```typescript
const benchmark = await db.getBenchmarkData('SERVICIOS_FINANCIEROS', 'LATAM');
// Returns regional percentiles for financial services companies
```

## Files Structure

```
src/database/
├── schema.sql                     # Complete database schema
├── types.ts                       # TypeScript interfaces  
├── company-database.service.ts    # Main service implementation
├── README.md                      # This documentation
└── migrations/                    # Database migrations (future)
    ├── 001_initial_schema.sql
    ├── 002_add_validation_rules.sql
    └── 003_populate_model_profiles.sql
```

## Migration Path

### Phase 1: Core Database (Current)
- ✅ Schema definition
- ✅ Service implementation 
- ✅ Classification algorithm
- ⏳ Database integration

### Phase 2: Integration
- Connect to assessment workflow
- Replace mock provider with database
- Add real benchmark calculations
- Performance optimization

### Phase 3: Intelligence
- Advanced analytics
- ML-based classification improvements
- Predictive scoring
- Industry trend analysis

## Key Design Decisions

### ✅ **Decisions Made (80/20)**
1. **No temporal business model evolution** - Static classification
2. **Direct storage in companies table** - No separate classification table
3. **Industry bridge approach** - Traditional industries → DII models
4. **Embedded validation rules** - SQL-based business logic
5. **Real-time benchmarking** - Automatic percentile updates

### 🔄 **Future Considerations (20%)**
1. **Advanced ML classification** - Beyond pattern matching
2. **Multi-model companies** - Conglomerates with multiple models
3. **Model evolution tracking** - For adaptive organizations
4. **Advanced analytics** - Predictive modeling and trends
5. **External data integration** - Breach intelligence, market data

This simplified approach captures **80% of the business value** with **20% of the complexity**, focusing on the core assessment workflow while maintaining flexibility for future enhancements.