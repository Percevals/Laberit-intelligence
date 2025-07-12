# DII Calculator Module

## Overview

The Digital Immunity Index (DII) Calculator is the core module for computing the DII 4.0 score based on the formula:

```
DII Raw = (TRD × AER) / (HFP × BRI × RRG)
DII Score = (DII Raw / DII Base del Modelo) × 10
```

## Installation

```javascript
import { calculateDII, BUSINESS_MODELS } from './core/dii-calculator.js';
```

## Usage

### Basic Usage

```javascript
const result = calculateDII({
  businessModel: BUSINESS_MODELS.COMERCIO_HIBRIDO,
  dimensions: {
    TRD: 7,  // Time to Revenue Degradation (1-10)
    AER: 6,  // Attack Economics Ratio (1-10)
    HFP: 3,  // Human Failure Probability (1-10)
    BRI: 4,  // Blast Radius Index (1-10)
    RRG: 3   // Recovery Reality Gap (1-10)
  }
});

if (result.success) {
  console.log(`DII Score: ${result.results.diiScore}/10`);
  console.log(`Stage: ${result.results.stage.name}`);
  console.log(`Percentile: ${result.results.percentile}th`);
}
```

### Business Models

The module supports 8 business models, each with its own DII Base value:

| Model | Constant | DII Base | Range |
|-------|----------|----------|-------|
| Comercio Híbrido | `BUSINESS_MODELS.COMERCIO_HIBRIDO` | 1.75 | 1.5-2.0 |
| Software Crítico | `BUSINESS_MODELS.SOFTWARE_CRITICO` | 1.00 | 0.8-1.2 |
| Servicios de Datos | `BUSINESS_MODELS.SERVICIOS_DATOS` | 0.70 | 0.5-0.9 |
| Ecosistema Digital | `BUSINESS_MODELS.ECOSISTEMA_DIGITAL` | 0.60 | 0.4-0.8 |
| Servicios Financieros | `BUSINESS_MODELS.SERVICIOS_FINANCIEROS` | 0.40 | 0.2-0.6 |
| Infraestructura Heredada | `BUSINESS_MODELS.INFRAESTRUCTURA_HEREDADA` | 0.35 | 0.2-0.5 |
| Cadena de Suministro | `BUSINESS_MODELS.CADENA_SUMINISTRO` | 0.60 | 0.4-0.8 |
| Información Regulada | `BUSINESS_MODELS.INFORMACION_REGULADA` | 0.55 | 0.4-0.7 |

### Dimensions

All dimensions must be provided on a 1-10 scale:

- **TRD (Time to Revenue Degradation)**: Hours until 10% operational loss (higher is better)
- **AER (Attack Economics Ratio)**: Cost-benefit ratio for attackers (higher is better)
- **HFP (Human Failure Probability)**: Monthly probability of human compromise (lower is better)
- **BRI (Blast Radius Index)**: % of critical operations affected (lower is better)
- **RRG (Recovery Reality Gap)**: Multiplier of actual vs planned recovery (lower is better)

### Maturity Stages

The calculator classifies organizations into four maturity stages:

| Stage | DII Score Range | Description |
|-------|----------------|-------------|
| Frágil | < 4.0 | 70%+ operational loss during incidents |
| Robusto | 4.0-6.0 | 40-70% operational loss during incidents |
| Resiliente | 6.0-8.0 | 15-40% operational loss during incidents |
| Adaptativo | > 8.0 | <15% operational loss, faster recovery than competitors |

## API Reference

### Main Function

#### `calculateDII(input)`

Main calculation function that returns complete DII analysis.

**Parameters:**
- `input.businessModel` (number): Business model identifier (1-8)
- `input.dimensions` (object): Object with TRD, AER, HFP, BRI, RRG (all 1-10)

**Returns:**
```javascript
{
  success: true,
  results: {
    diiRaw: number,          // Raw DII value
    diiScore: number,        // Normalized score (1-10)
    stage: {                 // Maturity stage info
      stage: string,
      name: string,
      description: string,
      color: string
    },
    percentile: number,      // Percentile ranking (0-100)
    interpretation: {        // Human-readable interpretation
      executiveSummary: string,
      riskLevel: string,
      primaryRecommendation: string,
      benchmarkPosition: string,
      operationalImpact: string,
      recoveryCapability: string
    },
    businessModel: number,
    diiBase: number,
    dimensions: object
  }
}
```

### Utility Functions

#### `calculateDIIRaw(trd, aer, hfp, bri, rrg)`
Calculates the raw DII value using the core formula.

#### `normalizeDIIScore(diiRaw, businessModel)`
Normalizes the raw score to a 1-10 scale based on business model.

#### `getMaturityStage(diiScore)`
Determines the maturity stage based on DII score.

#### `calculatePercentile(diiScore, businessModel)`
Calculates percentile ranking within the business model category.

#### `validateInputs(dimensions)`
Validates that all dimensions are present and within 1-10 range.

## Testing

Run the test suite:

```bash
node dii-calculator.test.js
```

Or set the environment variable:

```bash
NODE_ENV=test node dii-calculator.js
```

## Examples

See `dii-calculator.example.js` for comprehensive usage examples including:
- High-performing retail chain
- Struggling fintech
- Average software company
- Cross-model comparison
- Error handling

## Error Handling

The calculator provides comprehensive error handling:

```javascript
const result = calculateDII({
  businessModel: 99,  // Invalid
  dimensions: { TRD: 5, AER: 5, HFP: 5, BRI: 5, RRG: 5 }
});

if (!result.success) {
  console.error(result.error);  // "Business model must be between 1 and 8"
}
```

Common errors:
- Invalid business model (not 1-8)
- Missing dimensions
- Dimension values out of range (not 1-10)
- Non-numeric values

## Integration

This module is designed to be integrated into:
- Quick assessment tools
- Executive dashboards
- Risk analysis systems
- Benchmarking platforms

## License

© 2025 Lãberit Intelligence. All rights reserved.