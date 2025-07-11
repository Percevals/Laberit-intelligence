# DII v3.0 to v4.0 Business Model Mapping Matrix

## Executive Summary

Analysis of 150 clients from MasterDatabaseV3.1.xlsx reveals clear mapping patterns with 85.6% HIGH confidence mappings.

## 🎯 Key Findings

### Model Distribution (DII 4.0)
1. **Ecosistema Digital (4)**: 65 clients (40.6%) - Dominant model for Platform businesses
2. **Infraestructura Heredada (6)**: 24 clients (15.0%) - Manufacturing with minimal cloud
3. **Cadena de Suministro (7)**: 20 clients (12.5%) - Modern manufacturing
4. **Servicios Financieros (5)**: 19 clients (11.9%) - Financial sector concentration
5. **Software Crítico (2)**: 14 clients (8.8%) - SaaS and XaaS providers
6. **Comercio Híbrido (1)**: 13 clients (8.1%) - Retail sector
7. **Información Regulada (8)**: 5 clients (3.1%) - Healthcare/Pharma

### Confidence Levels
- **HIGH**: 137 clients (85.6%)
- **MEDIUM**: 23 clients (14.4%)
- **LOW**: 0 clients (0%)

## 📊 Detailed Mapping Matrix

### High-Volume Combinations (10+ clients)

| Combination | Clients | DII 4.0 Model | Confidence | Digital Dependency |
|------------|---------|---------------|------------|-------------------|
| Financial\|Platform\|B2B_PLATFORM\|Hybrid | 18 | Ecosistema Digital (4) | HIGH | 50-70% |
| Industrial\|Manufacturing\|MANUFACTURING\|Hybrid | 15 | Cadena de Suministro (7) | HIGH | 50-70% |
| Public\|Platform\|B2G_PLATFORM\|Hybrid | 14 | Ecosistema Digital (4) | HIGH | 50-70% |
| Financial\|Financial Services\|FINANCIAL_SERVICES\|Hybrid | 12 | Servicios Financieros (5) | HIGH | 50-70% |
| Industrial\|Manufacturing\|MANUFACTURING\|Minimal | 11 | Infraestructura Heredada (6) | HIGH | 20-40% |
| Retail\|Traditional Retail\|RETAIL\|Hybrid | 11 | Comercio Híbrido (1) | HIGH | 50-70% |

## 🚨 Critical Review Items

### 1. Public Sector (25 clients total)
- **B2G Platforms**: Currently mapped to Ecosistema Digital (4)
  - Consider: May need Información Regulada (8) for sensitive data
- **Government Financial Services**: Medium confidence mapping
  - Primary: Servicios Financieros (5)
  - Alternative: Información Regulada (8)
- **Government Infrastructure**: Mapped to Infraestructura Heredada (6)

### 2. Technology Sector Ambiguity (10 clients)
- **SaaS providers**: Need archetype analysis
  - B2C/B2G → Software Crítico (2)
  - Data/Analytics focus → Servicios de Datos (3)
  - Default → Software Crítico (2)

### 3. Cloud Adoption Conflicts
- **Retail Marketplace with Cloud First**: Currently Comercio Híbrido (1)
  - Conflict: Cloud First suggests digital-native
  - Consider: Ecosistema Digital (4)

## 🔄 Mapping Decision Tree

```
START
├─ SECTOR = Healthcare? → Información Regulada (8) [ALWAYS]
├─ SECTOR = Financial & MODEL = Financial Services? → Servicios Financieros (5)
├─ MODEL = Platform?
│  ├─ Contains DATA/ANALYTICS? → Ecosistema Digital (4) [Alt: Servicios de Datos (3)]
│  └─ Default → Ecosistema Digital (4)
├─ MODEL = Manufacturing?
│  ├─ CLOUD = Minimal? → Infraestructura Heredada (6)
│  └─ CLOUD = Hybrid/Cloud First? → Cadena de Suministro (7)
├─ SECTOR = Retail OR MODEL = Traditional Retail? → Comercio Híbrido (1)
├─ SECTOR = Technology OR MODEL = SaaS?
│  ├─ ARCHETYPE = B2C/B2G? → Software Crítico (2)
│  ├─ Contains DATA/ANALYTICS? → Servicios de Datos (3)
│  └─ Default → Software Crítico (2) [Alt: Servicios de Datos (3), Ecosistema Digital (4)]
├─ MODEL = XaaS? → Software Crítico (2) [Alt: Ecosistema Digital (4)]
├─ MODEL = Marketplace? → Ecosistema Digital (4)
├─ MODEL = Hybrid? → Comercio Híbrido (1)
└─ SECTOR-BASED DEFAULTS
   ├─ Energy → Infraestructura Heredada (6)
   ├─ Industrial → Infraestructura Heredada (6)
   ├─ Pharma → Información Regulada (8)
   ├─ Education → Servicios de Datos (3)
   └─ Services → Ecosistema Digital (4)
```

## 📈 Digital Dependency Estimation

| Cloud Adoption Level | Digital Dependency | Impact on TRD |
|---------------------|-------------------|---------------|
| Minimal | 20-40% | Higher TRD (slower degradation) |
| Hybrid | 50-70% | Medium TRD |
| Cloud First | 80-95% | Lower TRD (faster degradation) |

## 🔍 Recovery Agility Notes

The analysis attempted to extract Recovery Agility indicators from `Fact_ResponseReadiness` sheet:
- Target: ZT_MATURITY score (ID_SUBCTRL=27)
- Status: Sheet structure needs verification
- Impact: Would refine TRD estimates based on Zero Trust maturity

## 📋 Next Steps

1. **Manual Review Required**:
   - All Public sector mappings (25 clients)
   - Technology sector with MEDIUM confidence (10 clients)
   - Cloud adoption conflicts (1 client)

2. **Data Enhancement**:
   - Extract actual Recovery Agility scores
   - Analyze archetype descriptions for better classification
   - Review company names for sector validation

3. **Validation**:
   - Cross-reference with known client characteristics
   - Test formula conversions on sample clients
   - Validate digital dependency estimates

## 🎯 Migration Formula Mapping

### Core Metric Conversions
```
Protection_Readiness     → TRD (Time to Revenue Degradation)
Protection_Performance   → AER (Attack Economics Ratio)
Response_Readiness      → HFP (Human Failure Probability)
Response_Performance    → BRI (Blast Radius Index)
Response_Agility        → RRG (Recovery Reality Gap)

IMMUNITY_INDEX (0-7.4)  → DII Score (0-10)
```

### Scaling Considerations
- Need to normalize v3.0 scores to DII 4.0 ranges
- Consider business model resilience in calculations
- Factor in digital dependency for accurate TRD