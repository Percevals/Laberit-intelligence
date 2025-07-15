# DII Business Model Database Schema (Simplified 80/20 Approach)

## Entity Relationship Diagram

```mermaid
erDiagram
    %% Core Entities (Simplified)
    COMPANIES {
        uuid id PK
        string name
        string legal_name
        string domain
        string industry_traditional
        enum dii_business_model
        float confidence_score
        text classification_reasoning
        string headquarters
        string country
        string region
        integer employees
        bigint revenue
        timestamp created_at
        timestamp updated_at
    }

    %% Assessment Results
    ASSESSMENTS {
        uuid id PK
        uuid company_id FK
        enum assessment_type
        float dii_raw_score
        float dii_final_score
        integer confidence_level
        timestamp assessed_at
        string framework_version
        json calculation_inputs
    }

    DIMENSION_SCORES {
        uuid id PK
        uuid assessment_id FK
        enum dimension
        float raw_value
        float normalized_value
        float confidence_score
        enum data_source
        enum validation_status
        string calculation_method
        json supporting_evidence
        timestamp created_at
    }

    %% Business Model Definitions (Static)
    DII_MODEL_PROFILES {
        integer model_id PK
        string model_name
        float dii_base_min
        float dii_base_max
        float dii_base_avg
        float risk_multiplier
        integer digital_dependency_min
        integer digital_dependency_max
        integer typical_trd_hours_min
        integer typical_trd_hours_max
        json vulnerability_patterns
        json example_companies
        text cyber_risk_explanation
        timestamp active_from
        timestamp active_to
    }

    %% Classification Logic (Static)
    CLASSIFICATION_RULES {
        uuid id PK
        string industry_pattern
        string revenue_model
        string operational_dependency
        enum target_dii_model
        float confidence_level
        text reasoning_template
        integer rule_priority
        boolean active
        timestamp created_at
    }

    %% Benchmarking
    BENCHMARK_DATA {
        uuid id PK
        enum business_model
        string region
        string sector
        date calculation_date
        integer sample_size
        json dii_percentiles
        json dimension_medians
        date next_recalculation_due
        timestamp created_at
    }

    %% Business Logic Validation
    VALIDATION_RULES {
        uuid id PK
        string rule_name
        enum rule_type
        string applies_to
        text condition_sql
        enum severity
        text message_template
        boolean active
        timestamp created_at
    }

    %% Relationships (Simplified)
    COMPANIES ||--o{ ASSESSMENTS : "has assessments"
    ASSESSMENTS ||--o{ DIMENSION_SCORES : "contains 5 dimensions"
    COMPANIES }o--|| DII_MODEL_PROFILES : "classified as"
    CLASSIFICATION_RULES }o--|| DII_MODEL_PROFILES : "targets"
    BENCHMARK_DATA }o--|| DII_MODEL_PROFILES : "benchmarks"
```

## Simplified Data Flow (80/20 Approach)

```mermaid
flowchart TD
    %% Input Sources
    A[Company Search Input] --> B{Company Exists?}
    B -->|No| C[AI Provider Search]
    B -->|Yes| D[Retrieve Company Profile]
    C --> E[Create Company + Auto-Classify]
    
    %% Business Model Classification (Static)
    E --> F[Industry Pattern Matching]
    D --> F
    F --> G{Pattern Match Found?}
    G -->|Yes| H[Assign DII Model + Confidence]
    G -->|No| I[Two-Question Classification]
    I --> J[Assign DII Model + Lower Confidence]
    H --> K[Store in Companies Table]
    J --> K
    
    %% Assessment Process
    K --> L[Assessment Type Selection]
    L --> M{Quick or Formal?}
    M -->|Quick| N[5 Key Questions]
    M -->|Formal| O[Comprehensive Data Collection]
    
    %% Calculation Engine
    N --> P[Calculate 5 Dimensions]
    O --> P
    P --> Q[Apply Validation Rules]
    Q --> R{Validation Passed?}
    R -->|No| S[Flag for Review]
    R -->|Yes| T[Calculate DII Score]
    
    %% Results Storage
    T --> U[Store Assessment + Dimensions]
    U --> V[Compare to Benchmarks]
    V --> W[Generate Recommendations]
    W --> X[Present Results]
    
    %% Simplified - No Model Evolution
    X --> Y[Schedule Next Assessment]
    
    style A fill:#e1f5fe
    style F fill:#fff3e0
    style T fill:#e8f5e8
    style V fill:#fce4ec
    style K fill:#e8f5e8
```

## Business Logic Flow

```mermaid
flowchart LR
    %% The 8 DII Business Models
    subgraph "8 DII Business Models"
        BM1[1. Comercio Híbrido<br/>DII: 1.5-2.0<br/>Risk: 1.0x]
        BM2[2. Software Crítico<br/>DII: 0.8-1.2<br/>Risk: 1.5x]
        BM3[3. Servicios Datos<br/>DII: 0.5-0.9<br/>Risk: 2.0x]
        BM4[4. Ecosistema Digital<br/>DII: 0.4-0.8<br/>Risk: 2.5x]
        BM5[5. Servicios Financieros<br/>DII: 0.2-0.6<br/>Risk: 3.5x]
        BM6[6. Infraestructura Heredada<br/>DII: 0.2-0.5<br/>Risk: 2.8x]
        BM7[7. Cadena Suministro<br/>DII: 0.4-0.8<br/>Risk: 1.8x]
        BM8[8. Información Regulada<br/>DII: 0.4-0.7<br/>Risk: 3.0x]
    end
    
    %% The 5 Dimensions
    subgraph "5 DII Dimensions"
        TRD[TRD: Time to Revenue Degradation<br/>Range: 0.5-168 hours]
        AER[AER: Attack Economics Ratio<br/>Range: 0.01-50.0]
        HFP[HFP: Human Failure Probability<br/>Range: 5%-95% monthly]
        BRI[BRI: Blast Radius Index<br/>Range: 0%-100%]
        RRG[RRG: Recovery Reality Gap<br/>Range: 1.0x-15.0x]
    end
    
    %% Calculation Process
    subgraph "DII Calculation"
        CALC[DII Raw = TRD × AER / HFP × BRI × RRG<br/>DII Score = DII Raw / Model Base × 10]
        VALID[Business Logic Validation<br/>• RRG ≥ 1.0<br/>• HFP 5%-95%<br/>• Cross-dimension checks]
        BENCH[Benchmark Comparison<br/>• Regional percentiles<br/>• Industry medians<br/>• Confidence scoring]
    end
    
    %% Traditional Industry Mapping
    subgraph "Traditional Industries"
        IND1[Software/SaaS]
        IND2[Financial Services]
        IND3[Retail/E-commerce]
        IND4[Manufacturing]
        IND5[Healthcare]
        IND6[Logistics]
        IND7[Energy]
        IND8[Other Industries]
    end
    
    %% Connections
    IND1 --> BM2
    IND2 --> BM5
    IND3 --> BM1
    IND4 --> BM6
    IND5 --> BM8
    IND6 --> BM7
    IND7 --> BM6
    IND8 --> BM1
    
    BM1 --> CALC
    BM2 --> CALC
    BM3 --> CALC
    BM4 --> CALC
    BM5 --> CALC
    BM6 --> CALC
    BM7 --> CALC
    BM8 --> CALC
    
    TRD --> CALC
    AER --> CALC
    HFP --> CALC
    BRI --> CALC
    RRG --> CALC
    
    CALC --> VALID
    VALID --> BENCH
    
    style BM5 fill:#ffcdd2
    style BM4 fill:#ffcdd2
    style BM3 fill:#ffe0b2
    style CALC fill:#e8f5e8
    style VALID fill:#fff3e0
```

## Simplified Schema Key Features (80/20)

```mermaid
mindmap
  root((DII Database Schema - Simplified))
    Static Business Models
      No Temporal Evolution
      Direct Storage in Companies
      Industry Pattern Classification
      Confidence Scoring
    
    Assessment Focused
      Quick vs Formal Workflow
      5 Dimensions Tracking
      DII Score Calculation
      Validation Rules Engine
    
    Real-time Intelligence
      Benchmark Calculations
      Percentile Comparisons
      Recommendation Engine
      Performance Tracking
    
    Clear Algorithm
      Industry Keywords
      Two-Question Matrix
      Fallback Logic
      90%+ Accuracy
    
    Business Logic
      SQL Validation Rules
      Cross-Dimension Checks
      Confidence Propagation
      Error Detection
```

## Key Simplifications Made

### ✅ **Removed Complex Features (20% that was 80% complexity):**
1. **❌ Temporal Business Model Evolution** - Companies have stable models
2. **❌ Separate Classification History Table** - Stored directly in companies
3. **❌ Complex User Permission System** - Simplified user tracking
4. **❌ Advanced Analytics Engine** - Focus on core assessment
5. **❌ Multi-Model Companies** - One model per company

### ✅ **Kept Essential Features (80% business value):**
1. **✅ Clear Classification Algorithm** - Industry patterns + Two questions
2. **✅ The 8 DII Business Models** - Complete framework support
3. **✅ Assessment Workflow** - Quick and formal assessments
4. **✅ Real-time Benchmarking** - Regional and model-based comparisons
5. **✅ Validation Engine** - Business logic enforcement
6. **✅ Confidence Scoring** - Data quality tracking
7. **✅ Cross-Analysis Bridge** - Traditional industries ↔ DII models

### 🎯 **Core Database Tables (7 total):**
1. **`companies`** - Master company registry with DII classification
2. **`assessments`** - Assessment results over time
3. **`dimension_scores`** - The 5 DII dimensions for each assessment
4. **`dii_model_profiles`** - Static business model definitions
5. **`classification_rules`** - Algorithm pattern matching rules
6. **`benchmark_data`** - Real-time percentile calculations
7. **`validation_rules`** - Business logic validation checks

This approach delivers **the complete DII assessment capability** with **minimal complexity**, focusing on the workflow that matters most: **Company → Classification → Assessment → Results → Benchmarks**.