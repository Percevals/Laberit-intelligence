# Assessment Engine Architecture

## Overview
The assessment engine is built on a modular architecture that separates data, business logic, and presentation layers. It supports both light (single question per dimension) and premium (multiple questions) assessment modes.

## Architecture Diagram

```mermaid
graph TB
    subgraph "Data Layer"
        BSJ[business-model-scenarios.json v2.0.0]
        BSJ --> |"8 models × 5 dimensions"| QM[Question Matrix]
        QM --> LQ[Light Questions<br/>measurement_question]
        QM --> PQ[Premium Questions<br/>premium_questions array]
    end

    subgraph "Business Model Layer"
        BMC[Business Model Classifier]
        BMC --> |"Industry mapping"| BM1[COMERCIO_HIBRIDO]
        BMC --> BM2[SOFTWARE_CRITICO]
        BMC --> BM3[SERVICIOS_DATOS]
        BMC --> BM4[(...5 more models)]
    end

    subgraph "Assessment Engine Core"
        PSS[PainScenarioService]
        QA[QuestionAdapter]
        AC[AssessmentCalculator]
        DII[DIICalculator]
        
        PSS --> |"Retrieves scenarios"| QA
        QA --> |"Personalizes questions"| AC
        AC --> |"Converts responses"| DII
    end

    subgraph "5 DII Dimensions"
        TRD[TRD: Time to Revenue Disruption<br/>Range: 1-10]
        AER[AER: Attack Economics Ratio<br/>Range: 1-10]
        HFP[HFP: Human Failure Probability<br/>Range: 1-10]
        BRI[BRI: Blast Radius Index<br/>Range: 1-10]
        RRG[RRG: Recovery Reality Gap<br/>Range: 1-10]
    end

    subgraph "Assessment Types"
        LA[Light Assessment<br/>1 question per dimension]
        PA[Premium Assessment<br/>5+ questions per dimension]
    end

    subgraph "Output"
        DIIS[DII Score<br/>Formula: TRD×AER / HFP×BRI×RRG]
        MS[Maturity Stage<br/>FRAGIL/ROBUSTO/RESILIENTE/ADAPTATIVO]
        REC[Recommendations<br/>Business value focused]
    end

    %% Connections
    Company --> BMC
    BMC --> PSS
    BSJ --> PSS
    
    LA --> QA
    PA --> QA
    
    DII --> |"Calculates"| DIIS
    DIIS --> MS
    MS --> REC
    
    TRD --> DII
    AER --> DII
    HFP --> DII
    BRI --> DII
    RRG --> DII

    style BSJ fill:#f9f,stroke:#333,stroke-width:2px
    style DII fill:#9ff,stroke:#333,stroke-width:2px
    style DIIS fill:#9f9,stroke:#333,stroke-width:2px
```

## Component Details

### 1. Knowledge Base Structure
```json
{
  "version": "2.0.0",
  "business_models": {
    "COMERCIO_HIBRIDO": {
      "dimensions": {
        "TRD": {
          "pain_point": "System failures directly impact sales",
          "measurement_question": "How quickly do system failures impact revenue?",
          "responses": [
            { "value": 1, "metric": 60, "label": "Within 1 hour" },
            { "value": 2, "metric": 180, "label": "Within 3 hours" },
            // ... more options
          ]
        },
        // ... other dimensions
      }
    }
    // ... other business models
  }
}
```

### 2. Dimension Modularity

Each dimension is:
- **Independent**: Can be assessed separately
- **Configurable**: Questions and metrics stored as data
- **Extensible**: New dimensions can be added
- **Normalized**: All dimensions use 1-10 scale

### 3. Question Selection Logic

```typescript
// Light Assessment
if (assessmentType === 'light') {
  return scenario.measurement_question; // Single question
}

// Premium Assessment (future)
if (assessmentType === 'premium') {
  return scenario.premium_questions; // Multiple questions
}
```

### 4. Key Architectural Decisions

1. **JSON-based Configuration**: Questions and scenarios are data, not code
2. **Type Safety**: Full TypeScript typing throughout
3. **Business Model Driven**: Questions adapt to company type
4. **Formula-based Scoring**: Mathematical model for DII calculation
5. **Extensible Design**: Easy to add new models, dimensions, or question types

## Extension Points

### Adding New Dimensions
1. Update `DimensionId` type
2. Add to formula in `DIICalculator`
3. Add scenarios in JSON for each business model
4. Update UI components

### Adding New Business Models
1. Add to `BusinessModelId` type
2. Create scenarios for all 5 dimensions
3. Add to classifier mapping
4. Update archetype groupings

### Customizing Questions
1. Modify `business-model-scenarios.json`
2. Update `QuestionAdapter` for new personalization
3. Add response interpretation logic

## Current Implementation Status

- ✅ Light Assessment: Fully implemented
- ✅ 8 Business Models: Complete coverage
- ✅ 5 Dimensions: All active
- ✅ DII Calculation: Working
- ⏳ Premium Assessment: Infrastructure ready, not active
- ⏳ AI Enhancement: Partial implementation