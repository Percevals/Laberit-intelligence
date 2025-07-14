# DII Platform - Business Logic Documentation
*Last Updated: 2025-01-14 (Evening)*

## 🎯 Business Model Detection (Updated: DII-Specific)

### 8 DII-Specific Business Models
1. **COMERCIO_HIBRIDO** - Hybrid Commerce (physical + digital channels)
2. **SOFTWARE_CRITICO** - Critical Software (SaaS/cloud solutions)
3. **SERVICIOS_DATOS** - Data Services (data monetization)
4. **ECOSISTEMA_DIGITAL** - Digital Ecosystem (multi-sided platforms)
5. **SERVICIOS_FINANCIEROS** - Financial Services (transaction processing)
6. **INFRAESTRUCTURA_HEREDADA** - Legacy Infrastructure (old systems + digital)
7. **CADENA_SUMINISTRO** - Supply Chain (logistics + digital tracking)
8. **INFORMACION_REGULADA** - Regulated Information (healthcare, sensitive data)

### Classification Flow
```mermaid
Company Data → Classification Questions → DII Business Model → Cyber Risk Assessment
```

### Classification Logic (`/src/core/business-model/dii-classifier.ts`)

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

#### Decision Matrix (DII-Specific Models)

```typescript
// DII-specific decision rules:
if (revenueModel === 'recurring_subscriptions') {
  if (operationalDependency === 'fully_digital') {
    return 'SOFTWARE_CRITICO' // 95% confidence - SaaS platform
  } else if (operationalDependency === 'hybrid_model') {
    return 'SOFTWARE_CRITICO' // 80% confidence - some physical touchpoints
  } else {
    return 'INFRAESTRUCTURA_HEREDADA' // 75% confidence - subscription on legacy
  }
}

if (revenueModel === 'per_transaction') {
  return 'SERVICIOS_FINANCIEROS' // 90% confidence - payment processing
}

if (revenueModel === 'platform_fees') {
  return 'ECOSISTEMA_DIGITAL' // 95% confidence - digital ecosystem
}

if (revenueModel === 'data_monetization') {
  return 'SERVICIOS_DATOS' // 95% confidence - data-centric business
}

// ... continues for all DII model combinations
```

#### Industry-Based Shortcuts (New Feature)

```typescript
// Smart classification bypasses questions for obvious cases:
if (industry.includes('airline') || company.includes('aero')) {
  return 'ECOSISTEMA_DIGITAL' // Airlines = booking platforms
}

if (industry.includes('bank') || company.includes('banco')) {
  return 'SERVICIOS_FINANCIEROS' // Banking = financial services
}

if (industry.includes('retail') || company.includes('walmart')) {
  return 'COMERCIO_HIBRIDO' // Retail = hybrid commerce
}

if (industry.includes('software') || industry.includes('saas')) {
  return 'SOFTWARE_CRITICO' // Software = critical software
}
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

## 🔄 Modular Dimension Conversion System (NEW)

### Architecture (`/packages/@dii/core/converters/`)

The new modular system replaces hardcoded response interpretation with specialized converters:

```typescript
// Old approach (embedded in response-interpreter.ts)
if (dimension === 'TRD') {
  if (hours <= 2) return 1.5;
  // ... hardcoded logic
}

// New approach (modular converters)
const trdConverter = DimensionConverterFactory.get('TRD');
const score = trdConverter.convertToScore(hours, businessModelId);
```

### Conversion Logic Per Dimension

#### TRD (Time to Revenue Degradation)
- **Input**: Hours until 10% revenue loss
- **Scale**: Lower hours = Lower score (worse resilience)
- **Table**: <2h→2.0, 2-6h→4.0, 6-24h→6.0, 24-72h→8.0, >72h→9.5

#### AER (Attack Economics Ratio)  
- **Input**: Dollar value extractable vs attack cost
- **Scale**: Higher value = Lower score (more attractive target)
- **Table**: <$10K→9.0, $10K-50K→7.0, $50K-200K→5.0, $200K-1M→3.0, >$1M→1.5

#### HFP (Human Failure Probability)
- **Input**: Percentage who fail phishing tests
- **Scale**: Higher % = Lower score (worse human factor)  
- **Table**: 0-5%→8.5, 5-15%→7.0, 15-30%→5.0, 30-50%→3.0, >50%→1.5

#### BRI (Blast Radius Index)
- **Input**: % systems accessible from initial compromise
- **Scale**: Higher % = Lower score (worse isolation)
- **Table**: 0-20%→8.0, 20-40%→6.5, 40-60%→4.5, 60-80%→2.5, 80-100%→1.0

#### RRG (Recovery Reality Gap)
- **Input**: Actual vs planned recovery time multiplier
- **Scale**: Higher gap = Lower score (worse recovery)
- **Table**: 1x→9.0, 1.5-2x→7.0, 2-3x→5.0, 3-5x→3.0, >5x→1.5

### Business Model Adjustments (Per Dimension)

```typescript
const modelAdjustments = {
  'COMERCIO_HIBRIDO': {
    TRD: (score) => score * 1.2, // Physical backup channels
    BRI: (score) => score * 1.1, // Natural channel isolation
    HFP: (score) => score * 0.9  // Multiple touchpoints increase risk
  },
  'SOFTWARE_CRITICO': {
    TRD: (score) => score * 0.8, // Zero downtime tolerance
    HFP: (score) => score * 1.1, // Technical staff, better training
    BRI: (score) => score * 0.9, // Interconnected systems
    RRG: (score) => score * 1.1  // Better automation
  },
  'SERVICIOS_FINANCIEROS': {
    TRD: (score) => score * 0.7, // Critical real-time operations
    AER: (score) => score * 0.7, // Prime financial target
    RRG: (score) => score * 1.2  // Regulatory DR requirements
  }
  // ... all 8 DII models have specific adjustments
}
```

### Usage Integration

```typescript
// Batch conversion for full assessment
const responses = {
  TRD: 6,        // 6 hours
  AER: 100000,   // $100K value
  HFP: 15,       // 15% failure rate
  BRI: 30,       // 30% blast radius
  RRG: 2.0       // 2x recovery gap
};

const results = convertMultipleDimensions(responses, 2); // SOFTWARE_CRITICO
// Returns normalized 1-10 scores ready for DII formula
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