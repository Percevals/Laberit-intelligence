# AER Premium Assessment - Implementation Context

## Executive Summary

This document provides the complete context for implementing the Premium AER (Attack Economics Ratio) assessment using Comprehensive Scenario-Based Economic Modeling. This method uses 3 tailored attack scenarios with 3-5 questions each to provide a detailed analysis of an organization's attack economics.

## Background Context

### What is AER?
- **Definition**: Attack Economics Ratio measures "For every $1 an attacker spends, how many dollars of value can they destroy/extract from your business?"
- **Formula Position**: AER is one of 5 dimensions in the DII formula: `DII = (TRD × AER) / (HFP × BRI × RRG)`
- **Current Implementation**: Light assessment with single question
- **Goal**: Premium assessment for deeper analysis and actionable insights

### Framework Architecture
- **Location**: `/apps/assessment-v2/`
- **Main Data File**: `/data/business-model-scenarios.json`
- **8 Business Models**: Each with unique risk profiles
- **4 Archetypes**: Custodios, Conectores, Procesadores, Redundantes
- **Assessment Types**: Light (5-10 min) and Premium (30-45 min)

## Premium Method Design: Comprehensive Scenario-Based Economic Modeling

### Core Concept
Present 3 specific attack scenarios relevant to their business model, calculating potential attacker ROI for each scenario to derive overall AER.

### The 3 Universal Scenarios

#### Scenario 1: Ransomware Attack
- **Attacker Investment**: $5,000-15,000
- **Focus Areas**: 
  - Ransom willingness to pay
  - Operational downtime costs
  - Recovery time without paying
- **Key Insight**: Tests business continuity readiness

#### Scenario 2: Data Breach & Exfiltration
- **Attacker Investment**: $8,000-20,000
- **Focus Areas**:
  - Volume of accessible records
  - Black market value per record
  - Regulatory fine exposure
- **Key Insight**: Tests data protection and compliance

#### Scenario 3: Supply Chain/Ecosystem Attack
- **Attacker Investment**: $25,000-50,000
- **Focus Areas**:
  - Operational dependency on partners
  - Customer trust impact
  - Detection capabilities for insider threats
- **Key Insight**: Tests third-party risk management

### Customization by Business Model

Each scenario adapts to the business model's specific vulnerabilities:

#### CUSTODIOS (Financial, Healthcare)
- Emphasize regulatory fines and compliance costs
- Focus on trust loss and license to operate
- Higher baseline attack investment (more security to bypass)

#### CONECTORES (Marketplaces, Supply Chain)
- Emphasize ecosystem/network effects
- Focus on user exodus and viral trust loss
- Medium attack investment (platform vulnerabilities)

#### PROCESADORES (Software, Data Services)
- Emphasize IP theft and competitive advantage loss
- Focus on algorithm/process replication
- Variable attack investment (depends on IP value)

#### REDUNDANTES (Hybrid Commerce, Legacy Infrastructure)
- Emphasize operational disruption tolerance
- Focus on manual fallback capabilities
- Lower attack investment (easier targets)

## Implementation Architecture

### Data Structure Enhancement

```javascript
// Addition to business-model-scenarios.json structure
{
  "business_models": {
    "COMERCIO_HIBRIDO": {
      "dimensions": {
        "AER": {
          "light_assessment": { /* existing */ },
          "premium_assessment": {
            "method": "scenario_based_economic_modeling",
            "scenarios": [
              {
                "id": "ransomware",
                "name": "Ransomware Attack",
                "attacker_investment": {
                  "min": 5000,
                  "max": 15000,
                  "typical": 10000
                },
                "questions": [
                  {
                    "id": "ransom_amount",
                    "text": {
                      "es": "¿Qué rescate consideraría pagar realistamente?",
                      "en": "What ransom would you realistically consider paying?"
                    },
                    "options": [
                      {"value": 0, "label": "No pagaríamos", "amount": 0},
                      {"value": 1, "label": "Hasta $50K", "amount": 50000},
                      // ... more options
                    ]
                  }
                  // ... more questions
                ]
              }
              // ... more scenarios
            ]
          }
        }
      }
    }
  }
}
```

### Calculation Engine Requirements

```typescript
interface ScenarioResult {
  scenarioName: string;
  attackerInvestment: number;
  potentialGain: number;
  ratio: number;
  likelihood: number; // Based on company maturity
  weightedRatio: number;
}

interface AERPremiumResult {
  overallScore: number; // 1-10 normalized
  scenarioResults: ScenarioResult[];
  primaryVulnerability: string;
  recommendations: string[];
  industryComparison: {
    yourRatio: number;
    industryAverage: number;
    percentile: number;
  };
}
```

### UI/UX Considerations

1. **Progressive Disclosure**: Show one scenario at a time
2. **Visual Progress**: Scenario 1 of 3, 2 of 3, etc.
3. **Contextual Help**: Tooltips explaining each metric
4. **Real-time Calculation**: Show impact as they answer
5. **Educational Elements**: Explain why each scenario matters

### Integration Points

1. **With Existing Light Assessment**:
   - Premium button/upgrade path from light results
   - Use light assessment as baseline for comparison

2. **With Other Dimensions**:
   - AER influences TRD (higher AER = faster impact)
   - Maturity stage affects scenario likelihood

3. **With Reporting**:
   - Detailed breakdown by scenario
   - Specific mitigation recommendations
   - ROI calculations for security investments

## Implementation Roadmap

### Phase 1: Data Structure (Week 1)
- Enhance business-model-scenarios.json with premium structure
- Create scenario templates for each business model
- Define question banks and response options

### Phase 2: Calculation Engine (Week 2)
- Build scenario calculation functions
- Implement weighting by likelihood/maturity
- Create normalization to 1-10 scale

### Phase 3: UI Components (Week 3)
- Design scenario presentation flow
- Build question components
- Implement progress tracking

### Phase 4: Integration & Testing (Week 4)
- Connect to existing assessment flow
- Test with each business model
- Validate calculations against real incidents

## Key Decisions Needed

1. **Scenario Customization Depth**: How much should scenarios vary by business model?
2. **Question Complexity**: Balance between accuracy and user experience
3. **Calculation Transparency**: How much to show vs. keep as "black box"?
4. **Update Frequency**: How often to refresh scenarios based on threat landscape?

## Success Metrics

- **Completion Rate**: >80% of users who start finish all scenarios
- **Time to Complete**: 20-30 minutes average
- **Actionability Score**: Users rate recommendations >4/5
- **Accuracy**: Predictions align with actual incident costs ±30%

## Next Steps for Deep Dive

1. Detail the calculation algorithms for each scenario
2. Design the question adaptation logic by business model
3. Create mockups of the UI flow
4. Define the reporting template structure
5. Build prototype with one business model

## References and Dependencies

- Current codebase: `/apps/assessment-v2/`
- DII Framework docs: `/framework/`
- Business model definitions: `DII-4.0-Module-1-BusinessModels.md`
- Assessment architecture: `assessment-architecture.md`

---

*This context document provides everything needed to continue the premium AER implementation in a fresh conversation. Focus areas for next session: detailed calculation engine, UI/UX mockups, and integration strategy.*