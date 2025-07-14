# @dii/core - DII Dimension Conversion System

A modular dimension conversion system that normalizes user responses to a 1-10 scale for accurate DII (Digital Immunity Index) calculation.

## Overview

The DII assessment collects user responses in various units (hours, dollars, percentages, multipliers) and needs to convert them to normalized 1-10 scores for the core DII formula: `DII = (TRD × AER) / (HFP × BRI × RRG)`

This package provides:
- ✅ Individual converters for each DII dimension
- ✅ Business model-specific adjustments  
- ✅ Validation and error handling
- ✅ Comprehensive test suite
- ✅ TypeScript support with strict types
- ✅ Modular architecture for easy updates

## Quick Start

```typescript
import { DimensionConverterFactory } from '@dii/core';

// Convert 6 hours TRD for a Software Crítico business
const result = DimensionConverterFactory.convert('TRD', 6, 2);
console.log(result.score); // 3.2 (4.0 * 0.8 adjustment)
console.log(result.interpretation); // "Vulnerable - Revenue degradation likely within hours"
```

## Dimension Converters

### TRD (Time to Revenue Degradation)
**Input:** Hours until 10% revenue loss  
**Logic:** Lower hours = Lower score (worse resilience)

```typescript
const trd = DimensionConverterFactory.get('TRD');
trd.convertToScore(2, 1);   // 2.4 (Critical, with COMERCIO_HIBRIDO 1.2x adjustment)
trd.convertToScore(24, 5);  // 4.2 (Moderate, with SERVICIOS_FINANCIEROS 0.7x adjustment)
```

### AER (Attack Economics Ratio)  
**Input:** Dollar value extractable vs attack cost  
**Logic:** Higher value = Lower score (more attractive target)

```typescript
const aer = DimensionConverterFactory.get('AER');
aer.convertToScore(50000, 1);    // 7.0 (Low Interest)
aer.convertToScore(500000, 5);   // 2.1 (High Value, with SERVICIOS_FINANCIEROS 0.7x adjustment)
```

### HFP (Human Failure Probability)
**Input:** Percentage who fail phishing tests  
**Logic:** Higher % = Lower score (worse human factor)

```typescript
const hfp = DimensionConverterFactory.get('HFP');
hfp.convertToScore(15, 2);  // 7.7 (Good, with SOFTWARE_CRITICO 1.1x adjustment)
hfp.convertToScore(35, 6);  // 2.4 (Poor, with INFRAESTRUCTURA_HEREDADA 0.8x adjustment)
```

### BRI (Blast Radius Index)
**Input:** % systems accessible from initial compromise  
**Logic:** Higher % = Lower score (worse isolation)

```typescript
const bri = DimensionConverterFactory.get('BRI');
bri.convertToScore(25, 1);  // 7.15 (Good Isolation, with COMERCIO_HIBRIDO 1.1x adjustment)
bri.convertToScore(70, 4);  // 2.0 (Poor Isolation, with ECOSISTEMA_DIGITAL 0.8x adjustment)
```

### RRG (Recovery Reality Gap)
**Input:** Actual vs planned recovery time multiplier  
**Logic:** Higher gap = Lower score (worse recovery capability)

```typescript
const rrg = DimensionConverterFactory.get('RRG');
rrg.convertToScore(1.5, 5);  // 8.4 (Minor Gap, with SERVICIOS_FINANCIEROS 1.2x adjustment)
rrg.convertToScore(4.0, 6);  // 2.4 (Major Gap, with INFRAESTRUCTURA_HEREDADA 0.8x adjustment)
```

## Business Model Adjustments

Each converter applies model-specific adjustments based on real-world cyber risk patterns:

| Business Model | TRD | AER | HFP | BRI | RRG |
|---|---|---|---|---|---|
| COMERCIO_HIBRIDO (1) | +20% | - | -10% | +10% | - |
| SOFTWARE_CRITICO (2) | -20% | - | +10% | -10% | +10% |
| SERVICIOS_DATOS (3) | - | -20% | +10% | - | - |
| ECOSISTEMA_DIGITAL (4) | - | -10% | - | -20% | - |
| SERVICIOS_FINANCIEROS (5) | -30% | -30% | - | -10% | +20% |
| INFRAESTRUCTURA_HEREDADA (6) | -10% | - | -20% | - | -20% |
| CADENA_SUMINISTRO (7) | - | - | - | -20% | - |
| INFORMACION_REGULADA (8) | -20% | -20% | - | - | +10% |

## Batch Conversion

Convert multiple dimensions at once:

```typescript
import { convertMultipleDimensions } from '@dii/core';

const responses = {
  TRD: 6,        // 6 hours
  AER: 100000,   // $100K
  HFP: 20,       // 20% failure rate
  BRI: 40,       // 40% blast radius
  RRG: 2.5       // 2.5x recovery gap
};

const results = convertMultipleDimensions(responses, 2); // SOFTWARE_CRITICO
// Returns: { TRD: ConversionResult, AER: ConversionResult, ... }
```

## Assessment Integration

Complete example for assessment integration:

```typescript
import { convertAssessmentToDII } from '@dii/core/examples';

const userResponses = {
  trdHours: 6,
  aerDollarValue: 100000,
  hfpFailurePercent: 15,
  briBlastPercent: 30,
  rrgMultiplier: 2.0
};

const { scores, interpretations } = convertAssessmentToDII(userResponses, 2);

// Ready for DII calculation
const diiResult = calculateDII(scores.TRD, scores.AER, scores.HFP, scores.BRI, scores.RRG);
```

## Validation

Input validation with proper error handling:

```typescript
import { validateDimensionInput, ValidationRules } from '@dii/core';

// Check if input is within valid range
if (validateDimensionInput('TRD', 25)) {
  // Process valid input
} else {
  // Handle invalid input
  console.log(`TRD must be between ${ValidationRules.TRD.min} and ${ValidationRules.TRD.max} hours`);
}
```

## Real-World Scenarios

The package includes pre-built scenarios for testing:

```typescript
import { analyzeScenarios, SAMPLE_SCENARIOS } from '@dii/core/examples';

const results = analyzeScenarios([
  {
    name: 'Healthcare System',
    businessModel: 8, // INFORMACION_REGULADA
    responses: {
      trdHours: 2,
      aerDollarValue: 800000,
      hfpFailurePercent: 25,
      briBlastPercent: 60,
      rrgMultiplier: 3.5
    }
  }
]);

console.log(results[0].riskProfile); // "High Risk"
console.log(results[0].keyWeaknesses); // ["TRD: Critical - Immediate revenue impact expected"]
```

## Advanced Usage

### Custom Converter Class

```typescript
import { AssessmentConverter } from '@dii/core/examples';

const converter = new AssessmentConverter(5); // SERVICIOS_FINANCIEROS

// Add responses progressively
const trdResult = converter.addResponse('TRD', 4);
const aerResult = converter.addResponse('AER', 500000);

// Get completion status
const { completed, missing } = converter.getCompletionStatus();
console.log(`Completed: ${completed.join(', ')}`); // "TRD, AER"
console.log(`Missing: ${missing.join(', ')}`);     // "HFP, BRI, RRG"

// Get all scores
const allScores = converter.getAllScores();
```

### Business Model Comparison

```typescript
import { compareAcrossBusinessModels } from '@dii/core/examples';

// Compare same TRD input across different business models
const comparison = compareAcrossBusinessModels('TRD', 6, [1, 2, 5]);

comparison.forEach(({ businessModel, result }) => {
  console.log(`Model ${businessModel}: Score ${result.score}, ${result.interpretation}`);
});
```

## API Reference

### DimensionConverter Interface

```typescript
interface DimensionConverter {
  dimension: 'TRD' | 'AER' | 'HFP' | 'BRI' | 'RRG';
  convertToScore(responseValue: number, businessModel: BusinessModelId): number;
  getInterpretation(score: number): string;
  reverseConvert(score: number): string;
}
```

### ConversionResult Interface

```typescript
interface ConversionResult {
  score: number;                    // 1-10 normalized score
  interpretation: string;           // Human-readable interpretation
  originalValue: number;           // Original user input
  dimension: DIIDimension;         // Which dimension was converted
  businessModel: BusinessModelId; // Business model used
  adjustmentApplied: boolean;      // Whether model adjustment was applied
}
```

## Testing

Run the comprehensive test suite:

```bash
cd packages/@dii/core
npm test
```

The package includes 90%+ test coverage with:
- Unit tests for all converters
- Business model adjustment tests  
- Real-world scenario validation
- Integration tests for batch conversion
- Edge case and error handling tests

## Contributing

The modular design allows easy updates without breaking the core DII formula:

1. Update conversion logic in individual converter classes
2. Add new business model adjustments in `modelAdjustments` 
3. Extend validation rules in `ValidationRules`
4. Add new scenarios in `usage-examples.ts`

## License

MIT - See LICENSE file for details.