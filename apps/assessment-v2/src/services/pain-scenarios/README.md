# Pain Scenario Service

This service provides access to the 8x5 Business Model Pain Discovery Matrix, containing 40 specific scenarios that map pain points for each business model across the 5 DII dimensions.

## Overview

The Pain Scenario Service retrieves targeted questions and insights based on:
- **8 Business Models**: Each with unique vulnerabilities
- **5 DII Dimensions**: TRD, AER, HFP, BRI, RRG
- **40 Total Scenarios**: Specific pain points for each combination

## Usage

```typescript
import { painScenarioService } from '@services/pain-scenarios';

// Get a specific scenario
const scenario = painScenarioService.getScenario('1_comercio_hibrido', 'TRD');
console.log(scenario.scenario.light_question); // Quick assessment question

// Get all scenarios for a business model
const modelScenarios = painScenarioService.getBusinessModelScenarios('2_software_critico');

// Get light questions for assessment
const questions = painScenarioService.getLightQuestions('5_servicios_financieros');
```

## Business Model IDs

- `1_comercio_hibrido` - Hybrid Commerce (online + physical)
- `2_software_critico` - Critical Software/SaaS
- `3_servicios_datos` - Data Services
- `4_ecosistema_digital` - Digital Ecosystem/Platform
- `5_servicios_financieros` - Financial Services
- `6_infraestructura_heredada` - Legacy Infrastructure
- `7_cadena_suministro` - Supply Chain
- `8_informacion_regulada` - Regulated Information (Healthcare, etc.)

## Scenario Structure

Each scenario contains:
- **pain_point**: The specific vulnerability this model faces
- **root_cause**: Why this pain exists
- **light_question**: Single impactful question for quick assessment
- **premium_questions**: Deeper questions for comprehensive analysis
- **interpretation**: How to interpret responses

## Testing

Visit `/test/scenarios` in development to interact with the service through a visual interface.

## Integration with Assessment Flow

This service will be used in the Questions page to:
1. Retrieve relevant questions based on detected business model
2. Customize questions with company context
3. Calculate more accurate DII scores based on specific vulnerabilities