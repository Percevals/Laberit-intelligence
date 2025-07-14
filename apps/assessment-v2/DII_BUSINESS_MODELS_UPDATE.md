# DII Business Models Update
## Implementation of 8 DII-Specific Cyber Risk Models

**Date:** 2025-01-14  
**Status:** Implementation Complete ✓

---

## 🎯 Executive Summary

Successfully replaced generic business models (SUBSCRIPTION_BASED, TRANSACTION_BASED, etc.) with 8 DII-specific models designed for cyber risk assessment in the Latin American context. The new models better reflect real-world cyber risk patterns and enable more accurate DII scoring.

---

## 📊 The 8 DII Business Models

### 1. COMERCIO_HIBRIDO (Hybrid Commerce)
- **Description:** Physical stores + digital channels
- **Examples:** Liverpool, Walmart México, Coppel
- **Key Risks:** POS malware, e-commerce skimming
- **Cyber Characteristics:** Omnichannel complexity, seasonal peaks

### 2. SOFTWARE_CRITICO (Critical Software)
- **Description:** SaaS/cloud solutions essential for operations
- **Examples:** Kavak platform, Kueski, ContPAQi
- **Key Risks:** API exploitation, supply chain attacks
- **Cyber Characteristics:** Zero downtime tolerance, multi-tenant risks

### 3. SERVICIOS_DATOS (Data Services)
- **Description:** Companies monetizing data collection/analysis
- **Examples:** Dun & Bradstreet, Nielsen México, Buró de Crédito
- **Key Risks:** Data exfiltration, insider threats
- **Cyber Characteristics:** Honeypot effect, privacy law exposure

### 4. ECOSISTEMA_DIGITAL (Digital Ecosystem)
- **Description:** Multi-sided platforms connecting users/services
- **Examples:** Aeroméxico (booking), Rappi, MercadoLibre
- **Key Risks:** Third-party vulnerabilities, OAuth abuse
- **Cyber Characteristics:** Network effects, reputation contagion

### 5. SERVICIOS_FINANCIEROS (Financial Services)
- **Description:** Transaction processing and financial operations
- **Examples:** BBVA México, Banorte, OXXO Pay
- **Key Risks:** Transaction fraud, DDoS attacks
- **Cyber Characteristics:** Real-time requirements, regulatory scrutiny

### 6. INFRAESTRUCTURA_HEREDADA (Legacy Infrastructure)
- **Description:** Traditional systems with digital transformation layers
- **Examples:** Pemex, CFE, Telmex
- **Key Risks:** Ransomware, unpatched systems
- **Cyber Characteristics:** Air-gapped systems, difficult recovery

### 7. CADENA_SUMINISTRO (Supply Chain)
- **Description:** Logistics with digital tracking/optimization
- **Examples:** DHL México, Grupo TMM, FEMSA Logística
- **Key Risks:** GPS manipulation, partner compromise
- **Cyber Characteristics:** Cascading failures, IoT vulnerabilities

### 8. INFORMACION_REGULADA (Regulated Information)
- **Description:** Healthcare, government, sensitive data handlers
- **Examples:** IMSS, Hospital Angeles, SAT
- **Key Risks:** Ransomware, nation-state APTs
- **Cyber Characteristics:** Compliance theater, existential penalties

---

## 🔄 Classification Improvements

### Industry-Based Shortcuts
The new `DIIBusinessModelClassifier` includes smart industry detection:

```typescript
// Airlines → Digital Ecosystem (not subscription-based)
if (industry.includes('airline') || name.includes('aero')) {
  return 'ECOSISTEMA_DIGITAL' // Booking platforms, partner networks
}

// Banks → Financial Services
if (industry.includes('bank')) {
  return 'SERVICIOS_FINANCIEROS' // Transaction processing
}

// Healthcare → Regulated Information
if (industry.includes('health') || name.includes('imss')) {
  return 'INFORMACION_REGULADA' // Patient data, compliance
}
```

### Two-Question Fallback
When industry detection isn't conclusive:
1. **Revenue Model** → Initial classification
2. **Operational Dependency** → Refinement

Example: `platform_fees` → `ECOSISTEMA_DIGITAL` (95% confidence)

---

## 🛡️ Cyber Risk Adjustments

Each model has specific DII dimension adjustments:

### COMERCIO_HIBRIDO
- TRD: -0.5 (omnichannel complexity)
- BRI: -0.5 (physical+digital blast radius)
- HFP: -0.5 (multiple touchpoints)

### SOFTWARE_CRITICO
- TRD: -1.0 (zero downtime tolerance)
- AER: -0.5 (customer data concentration)
- HFP: +0.5 (better automation)

### SERVICIOS_FINANCIEROS
- TRD: -1.5 (real-time operations)
- AER: -1.0 (prime target)
- RRG: +0.5 (regulatory DR requirements)

---

## 🔧 Technical Implementation

### Type System
```typescript
// New types maintain backwards compatibility
export type DIIBusinessModel = 
  | 'COMERCIO_HIBRIDO' | 'SOFTWARE_CRITICO' | ...

export type LegacyBusinessModel = 
  | 'SUBSCRIPTION_BASED' | 'TRANSACTION_BASED' | ...

export type BusinessModel = DIIBusinessModel | LegacyBusinessModel;
```

### Key Files Created/Modified
1. `/src/core/business-model/dii-classifier.ts` - Smart classification logic
2. `/src/core/business-model/model-profiles-dii.ts` - Detailed model profiles
3. All pages updated to use `DIIBusinessModelClassifier`
4. Response interpreters include model-specific adjustments

### Backwards Compatibility
Legacy models automatically map to DII equivalents:
- SUBSCRIPTION_BASED → SOFTWARE_CRITICO
- PLATFORM_ECOSYSTEM → ECOSISTEMA_DIGITAL
- DIRECT_TO_CONSUMER → COMERCIO_HIBRIDO

---

## 📈 Impact on DII Scoring

1. **More Accurate Risk Assessment**
   - Models reflect actual cyber attack patterns
   - Latin American context considered
   - Industry-specific vulnerabilities captured

2. **Better Question Targeting**
   - Each model maps to specific scenario questions
   - Pain points align with real-world experiences
   - Response interpretation considers model context

3. **Improved Normalization**
   - Model-specific score ranges
   - Percentiles calculated within peer groups
   - More meaningful comparisons

---

## ✅ Testing & Validation

- ✓ TypeScript compilation successful
- ✓ All model mappings verified
- ✓ Industry detection tested with examples
- ✓ Backwards compatibility maintained
- ✓ AeroMéxico correctly classified as ECOSISTEMA_DIGITAL

---

## 🚀 Next Steps

1. **Expand Industry Mappings**
   - Add more Latin American specific industries
   - Handle edge cases and ambiguous classifications
   - Consider company size in classification

2. **Refine Model Adjustments**
   - Calibrate based on real assessment data
   - Add regional variations
   - Consider regulatory differences

3. **Documentation**
   - Create visual model selection flowchart
   - Document classification confidence thresholds
   - Add more real-world examples

---

**Location:** `/apps/assessment-v2/DII_BUSINESS_MODELS_UPDATE.md`  
**Related:** See `/context/BUSINESS_LOGIC.md` for complete classification rules