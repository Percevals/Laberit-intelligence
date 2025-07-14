# Question Adapter Service

Dynamic question adaptation service that personalizes pain scenario questions based on company context.

## Overview

The Question Adapter takes generic scenario questions and adapts them to be specific to the company being assessed, making questions more relevant and impactful.

## Features

### 1. **Template-Based Adaptation**
- Replaces generic terms with company-specific information
- Calculates dynamic thresholds based on company size
- Maintains question intent while personalizing details

### 2. **Smart Threshold Calculation**
- **Amount Thresholds**: Based on 0.1% of annual revenue
- **Time Thresholds**: Scaled by company size (larger = stricter SLAs)
- **Percentage Thresholds**: Revenue-based sensitivity levels

### 3. **Company Context Integration**
Uses available company data:
- Company name
- Revenue and employee count
- Industry and location
- Critical infrastructure status

## Usage

```typescript
import { lightAssessmentAdapter } from '@services/question-adapter';

// Get personalized questions for all 5 dimensions
const questions = await lightAssessmentAdapter.getPersonalizedQuestions(
  '2_software_critico',  // Business model ID
  companyInfo,           // Company data from AI search
  true                   // Critical infrastructure
);

// Get single personalized question
const question = await lightAssessmentAdapter.getPersonalizedQuestion(
  '5_servicios_financieros',
  'TRD',  // Specific dimension
  companyInfo,
  false
);
```

## Adaptation Examples

### Original Question:
"¿Cuántos empleados pueden aprobar transferencias superiores a $100K?"

### Adapted for Small Company (50 employees, $5M revenue):
"¿Cuántos empleados en MiniMart Express pueden aprobar transferencias superiores a $10K?"

### Adapted for Large Company (2500 employees, $500M revenue):
"¿Cuántos empleados en Banco Digital pueden aprobar transferencias superiores a $500K?"

## Dynamic Replacements

| Pattern | Replacement Logic |
|---------|-------------------|
| `tu empresa` | Company name |
| `$100K` | 0.1% of annual revenue |
| `24 horas` | Based on employee count |
| `50%` | Based on revenue scale |

## Threshold Calculations

### Amount Thresholds
- < $10M revenue: $10K minimum
- $10M-$100M: $50K typical
- $100M-$1B: $100K-$500K
- > $1B: $500K+

### Time Thresholds
- < 100 employees: 48 hours
- 100-1000: 24 hours
- 1000-5000: 8 hours
- > 5000: 4 hours

### Percentage Thresholds
- < $10M: 50% impact threshold
- $10M-$100M: 40%
- $100M-$1B: 25%
- > $1B: 10%

## Testing

Visit `/test/adapter` to see the adaptation in action with sample companies.

## Future Enhancements

1. **AI-Enhanced Adaptation**: Use AI providers for more sophisticated personalization
2. **Industry-Specific Rules**: Custom adaptation logic per industry
3. **Regional Variations**: Adapt currency and regulations by country
4. **Historical Context**: Include breach history in questions