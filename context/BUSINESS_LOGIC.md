# DII Platform - Business Logic Documentation
*Last Updated: 2025-01-14*

## 🎯 Business Model Detection

### Classification Flow
```mermaid
Company Data → Classification Questions → Business Model → DII Assessment
```

### Classification Logic (`/src/core/business-model/classifier.ts`)

#### Input: Two Key Questions

**Q1: Revenue Model** (How do you primarily generate revenue?)
- `recurring_subscriptions` - Regular subscription fees
- `per_transaction` - Fee per transaction/usage
- `project_based` - One-time project fees
- `product_sales` - Direct product sales
- `data_monetization` - Selling data/insights
- `platform_fees` - Marketplace commissions
- `direct_sales` - Direct to consumer sales
- `enterprise_contracts` - Large B2B contracts

**Q2: Operational Dependency** (How dependent are you on physical operations?)
- `purely_digital` - 100% digital operations
- `hybrid` - Mix of digital and physical
- `primarily_physical` - Mostly physical operations

#### Decision Matrix

```typescript
// Simplified decision rules:
if (revenueModel === 'recurring_subscriptions') {
  if (operationalDependency === 'purely_digital') {
    return 'SUBSCRIPTION_BASED' // 95% confidence
  } else {
    return 'SUBSCRIPTION_BASED' // 70% confidence
  }
}

if (revenueModel === 'per_transaction') {
  return 'TRANSACTION_BASED' // 90% confidence
}

if (revenueModel === 'project_based') {
  if (operationalDependency === 'primarily_physical') {
    return 'B2B_ENTERPRISE' // Alternative suggestion
  }
  return 'ASSET_LIGHT' // 85% confidence
}

// ... continues for all 8 combinations
```

### Smart Classification Enhancement

For companies found via AI search, additional heuristics apply:

```typescript
// Industry-based shortcuts:
if (industry.includes('Software')) return 'SUBSCRIPTION_BASED'
if (industry.includes('Financial')) return 'TRANSACTION_BASED'
if (industry.includes('Consulting')) return 'ASSET_LIGHT'
if (industry.includes('Manufacturing')) return 'ASSET_HEAVY'
if (industry.includes('Analytics')) return 'DATA_DRIVEN'
if (industry.includes('Marketplace')) return 'PLATFORM_ECOSYSTEM'
if (industry.includes('Retail')) return 'DIRECT_TO_CONSUMER'
```

## 📊 DII Calculation Flow

### 1. User Input Collection
```
User Response (1-5) + Metric Context → Scenario Response
Example: "4" + "8-24 hours" → {value: 4, metric: {hours: 16}}
```

### 2. Response Interpretation

#### Base Interpretation (`/src/services/assessment/response-interpreter.ts`)

**Metric-Based Scoring (v2.0.0)**:
```typescript
// TRD (Time Resilience) - Hours until 10% revenue loss
if (hours <= 2) return 1.5   // Critical
if (hours <= 4) return 3.5   // Poor
if (hours <= 8) return 5.5   // Average
if (hours <= 24) return 7.5  // Good
return 9.5                    // Excellent

// HFP (Human Factor) - Failure percentage (inverted)
if (percentage >= 80) return 9  // Very bad
if (percentage >= 60) return 7  // Bad
if (percentage >= 40) return 5  // Average
if (percentage >= 20) return 3  // Good
return 1                        // Excellent
```

#### Business Model Adjustments
```typescript
SUBSCRIPTION_BASED: {
  TRD: -0.5,  // More sensitive to downtime
  AER: -0.5,  // High value concentration
  HFP: +0.5   // Often better automation
}

TRANSACTION_BASED: {
  TRD: -1,    // Extreme downtime sensitivity
  BRI: +0.5,  // Better transaction isolation
  RRG: -0.5   // Complex recovery
}
```

#### Company Size Adjustments
```typescript
Small (<100 employees or <$10M revenue): {
  TRD: -0.5,  // Less redundancy
  AER: +0.5,  // Smaller attack surface
  HFP: -0.5,  // Less security training
}

Large (>1000 employees or >$100M revenue): {
  TRD: +0.5,  // Better resources
  AER: -0.5,  // Bigger target
  HFP: +0.5,  // Better processes
}
```

#### Critical Infrastructure Penalty
If `criticalInfra === true`:
```typescript
{
  TRD: -0.5,  // Zero tolerance for downtime
  AER: -1,    // Prime target
  HFP: -0.5,  // Higher insider threat
  BRI: -1,    // Cascading effects
  RRG: -0.5   // Regulatory requirements
}
```

### 3. DII Formula Calculation

```typescript
// Raw calculation
const rawDII = (TRD * AER) / (HFP * BRI * RRG)

// Business model normalization
const normalizedDII = normalizeByBusinessModel(rawDII, businessModel)

// Percentile within cohort
const percentile = calculatePercentile(normalizedDII, businessModel)

// Maturity stage
const stage = getMaturityStage(normalizedDII)
```

### 4. Normalization Ranges by Business Model

```typescript
SUBSCRIPTION_BASED: { min: 8, max: 45, avg: 22 }
TRANSACTION_BASED: { min: 5, max: 35, avg: 18 }
ASSET_LIGHT: { min: 12, max: 55, avg: 28 }
ASSET_HEAVY: { min: 3, max: 25, avg: 12 }
DATA_DRIVEN: { min: 6, max: 40, avg: 20 }
PLATFORM_ECOSYSTEM: { min: 4, max: 30, avg: 15 }
DIRECT_TO_CONSUMER: { min: 10, max: 50, avg: 25 }
B2B_ENTERPRISE: { min: 15, max: 60, avg: 32 }
```

## 🔄 Question Selection & Adaptation

### Light Assessment Path
1. Only TRD dimension asked
2. Other dimensions filled with intelligent defaults based on TRD response:
   ```typescript
   if (TRD >= 4) { // High performers
     AER: 4, HFP: 4, BRI: 3, RRG: 4
   } else if (TRD === 3) { // Average
     AER: 3, HFP: 3, BRI: 3, RRG: 3
   } else { // Low performers
     AER: 2, HFP: 2, BRI: 2, RRG: 2
   }
   ```

### Question Personalization

**Template Variables** calculated from company data:
```typescript
{
  companyName: "Microsoft",
  amountThreshold: "$500K",  // Based on 0.1% of revenue
  timeThreshold: "4 hours",   // Based on company size
  percentageThreshold: "10%"  // Based on revenue scale
}
```

**Dynamic Thresholds**:
- Amount: 0.1% of annual revenue (min $10K)
- Time: Larger companies = stricter SLAs
- Percentage: Higher revenue = more sensitive

## 🚨 Hardcoded Rules & Exceptions

### Business Model to Scenario Mapping
```typescript
// Fixed mapping in multiple files - TECH DEBT
const mapping = {
  'SUBSCRIPTION_BASED': '2_software_critico',
  'TRANSACTION_BASED': '5_servicios_financieros',
  'ASSET_LIGHT': '2_software_critico',
  'ASSET_HEAVY': '6_infraestructura_heredada',
  'DATA_DRIVEN': '3_servicios_datos',
  'PLATFORM_ECOSYSTEM': '4_ecosistema_digital',
  'DIRECT_TO_CONSUMER': '1_comercio_hibrido',
  'B2B_ENTERPRISE': '5_servicios_financieros'
}
```

### Special Cases

1. **Missing Company Data**
   - Defaults to medium-sized company assumptions
   - Revenue: $10M, Employees: 100

2. **AI Service Fallback**
   - If AI fails, uses template-based adaptation only
   - Confidence reduced from 0.9 to 0.8

3. **Dimension Dependencies**
   - If only TRD answered, others correlate with TRD performance
   - High TRD (4-5) assumes decent other dimensions
   - Low TRD (1-2) assumes poor other dimensions

### Maturity Stages
```typescript
if (score >= 40) return 'RESILIENT'
if (score >= 30) return 'MANAGED'  
if (score >= 20) return 'DEVELOPING'
if (score >= 10) return 'REACTIVE'
return 'VULNERABLE'
```

## 📈 Score Interpretation

### DII Score Ranges
- **50-100**: Exceptional digital immunity
- **30-50**: Strong resilience
- **20-30**: Adequate protection
- **10-20**: Significant vulnerabilities
- **0-10**: Critical risk exposure

### Percentile Context
- Calculated within business model cohort
- Based on normalized scores
- Updates as more assessments completed

## 🔧 Configuration Points

### Environment Variables
- `VITE_OPENAI_API_KEY` - For company AI search
- `VITE_ANTHROPIC_API_KEY` - Alternative AI provider

### Feature Flags (Implicit)
- Smart classification enabled when AI keys present
- Premium features ready but not exposed in UI

### Adjustable Parameters
All adjustment values (+0.5, -1, etc.) are hardcoded but could be made configurable in:
- `/src/services/assessment/response-interpreter.ts`
- `/src/core/dii-engine/calculator.ts`