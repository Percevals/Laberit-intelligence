# DII Intelligence Platform - Architecture & Vision

## Overview

The DII Intelligence Platform combines historical vulnerability assessments with real-time breach intelligence to deliver actionable cyber risk insights. Unlike predictive models, we show actual breaches happening to similar companies and compare them against assessed vulnerabilities.

**Core Value**: "See how vulnerable companies like yours are, what's hitting them now, and whether you're stronger or weaker than the victims."

## Current Status (Updated: July 18, 2025)

### 🚀 Active Development
- **Weekly Intelligence Dashboard Generation**: Using `immunity_dashboard_generator_v4.py`
- **Data Collection**: Weekly intelligence reports with Spain + LATAM focus
- **Dashboard Template**: QA-approved template with interactive features

### ⚠️ Deprecated Items
- **Directory**: `weekly-reports/` - Deprecated until August 11, 2025
- **File**: `dii_dashboard_generator.py` - Use V4 generator instead
- See `.deprecated` file for complete list

### 📁 Current Directory Structure

```
/intelligence/
├── README.md                          # This file
├── immunity_dashboard_generator_v4.py # Active dashboard generator
├── .deprecated                        # List of deprecated items
├── archive/                          # Historical/deprecated files
│   ├── generators/                   # Old generator versions
│   ├── prompts/                      # Date-specific prompts
│   └── test-files/                   # Test files
├── research/                         
│   └── 2025/                        # Weekly research data
│       └── week-XX/                 
│           ├── weekly-intelligence.json
│           └── intelligence-data.json  # V4 generator format
├── src/
│   └── generators/                   # Data transformation tools
│       ├── weekly_data_adapter.py
│       └── weekly_data_adapter_v4.py
├── outputs/
│   ├── dashboards/                   # Generated dashboards
│   │   ├── immunity-dashboard-YYYY-MM-DD.html
│   │   └── qa/                      # QA documentation
│   └── reports/                      # Historical reports
├── docs/                             # Core documentation
│   ├── business-model-mapper-implementation.md
│   └── business-translation-spec.md
└── templates/                        # Dashboard templates
    └── immunity_dashboard_template_v4.html
```

## Active Workflows

### 1. Weekly Intelligence Dashboard Generation

```bash
# Step 1: Ensure research data exists
# Location: research/2025/week-XX/weekly-intelligence.json

# Step 2: Transform data for V4 generator (if needed)
python3 src/generators/weekly_data_adapter_v4.py

# Step 3: Generate dashboard
python3 immunity_dashboard_generator_v4.py

# Output: outputs/dashboards/immunity-dashboard-YYYY-MM-DD.html
```

### 2. Key Features of V4 Dashboard
- Spain-first focus with LATAM coverage
- Executive-friendly dimension meanings
- Interactive incident timeline with filters
- Attack Economics (AER) visualization
- Recommendation impact calculators
- Mobile-responsive design

## Architecture Components

### 1. Historical Vulnerability Baseline
- **Source**: 150 companies assessed with DII v4.0
- **Data**: Digital Immunity Index, dimensions (AER, HFP, BRI, TRD, RRG), business models
- **Purpose**: Establish vulnerability patterns per business model
- **Key Insight**: We know WHO is vulnerable and WHY

### 2. Breach Evidence Library
- **Source**: Weekly intelligence reports (structured)
- **Data**: Verified breaches with costs, timelines, attack vectors
- **Purpose**: Show what's actually happening in the market
- **Key Insight**: Real attacks mapped to our 8 business models

### 3. Risk Reality Matching Engine
- **Function**: Connects user profile to peer vulnerabilities + relevant breaches
- **Output**: Personalized risk assessment based on evidence
- **Purpose**: Transform abstract risk into concrete examples
- **Key Insight**: "3 companies like yours got hit this month"

## Data Structure

### Historical Assessment Data
```json
{
  "company_id": "anonymous_001",
  "business_model": "Ecosistema Digital",
  "dii_score": 4.7,
  "maturity_stage": "Robusto",
  "dimensions": {
    "AER": 3.5,  // Attack Economics Ratio
    "HFP": 0.4,  // Human Failure Probability
    "BRI": 0.72, // Blast Radius Index
    "TRD": 8.5,  // Time to Revenue Degradation
    "RRG": 3.2   // Recovery Reality Gap
  }
}
```

### Weekly Intelligence Structure (V4 Format)
```json
{
  "week_date": "2025-07-17",
  "week_summary": {
    "immunity_avg": "2.8",
    "attacks_week": "2,569",
    "top_threat_pct": "+15%",
    "top_threat_type": "Ransomware Surge",
    "victims_low_immunity_pct": "50%",
    "key_insight": "Brazil suffered largest financial cybercrime..."
  },
  "dii_dimensions": {
    "TRD": {"value": "12", "trend": "declining"},
    "AER": {"value": "75", "trend": "declining"},
    "HFP": {"value": "72", "trend": "stable"},
    "BRI": {"value": "65", "trend": "stable"},
    "RRG": {"value": "3.8", "trend": "stable"}
  },
  "business_model_insights": {...},
  "incidents": [...],
  "spain_specific": {...},
  "recommendations": [...]
}
```

## Business Model Mapping

| ID | Model | Spanish Name | Key Vulnerabilities | Common Attacks |
|----|-------|--------------|-------------------|----------------|
| 1 | COMERCIO_HIBRIDO | Comercio Híbrido | POS systems, supplier access | POS malware, supply chain |
| 2 | SOFTWARE_CRITICO | Software Crítico | API security, tenant isolation | API abuse, data leaks |
| 3 | SERVICIOS_DATOS | Servicios de Datos | Data exfiltration, insider threat | Data theft, ransomware |
| 4 | ECOSISTEMA_DIGITAL | Ecosistema Digital | Platform complexity, third parties | API attacks, account takeover |
| 5 | SERVICIOS_FINANCIEROS | Servicios Financieros | Financial fraud, compliance | BEC, ransomware, fraud |
| 6 | INFRAESTRUCTURA_HEREDADA | Infraestructura Heredada | Legacy systems, patching delays | Ransomware, exploitation |
| 7 | CADENA_SUMINISTRO | Cadena de Suministro | Supplier access, tracking systems | Supply chain, ransomware |
| 8 | INFORMACION_REGULADA | Información Regulada | Compliance, data privacy | Data theft, ransomware |

## Key Differentiators

### What We Don't Do
- ❌ Predict future attacks with "AI magic"
- ❌ Generate fear with hypothetical scenarios
- ❌ Provide generic industry statistics
- ❌ Make probabilistic claims without evidence

### What We Actually Do
- ✅ Show real breaches with verified costs
- ✅ Compare user vulnerabilities to actual victims
- ✅ Identify patterns from 150 real assessments
- ✅ Provide evidence-based recommendations

## Development Guidelines

### Adding New Features
1. Check `.deprecated` file before modifying old code
2. Use `immunity_dashboard_generator_v4.py` as the base
3. Follow the V4 data format for consistency
4. Test with QA dashboard template

### Updating Weekly Intelligence
1. Create new week folder: `research/2025/week-XX/`
2. Add `weekly-intelligence.json` with required structure
3. Run V4 adapter if format transformation needed
4. Generate dashboard using V4 generator

### Important Files
- **Current Generator**: `immunity_dashboard_generator_v4.py`
- **Template**: `templates/immunity_dashboard_template_v4.html`
- **Data Adapter**: `src/generators/weekly_data_adapter_v4.py`
- **QA Guide**: `outputs/dashboards/qa/qa-review-guide.md`

## Success Metrics

1. **Evidence Coverage**: Breaches documented per business model
2. **Match Accuracy**: Users confirming "this could be us"
3. **Action Rate**: Users implementing recommended fixes
4. **Update Frequency**: New breaches added weekly

## For Developers

This intelligence platform serves as the evidence engine for the DII Assessment Platform. It provides:

1. **Context**: Why certain questions matter (backed by breaches)
2. **Urgency**: What's happening right now to similar companies
3. **Validation**: Proof that our vulnerability assessments predict real risk
4. **Action**: What actually works to prevent/mitigate attacks

The architecture is designed to be static-first (JSON files) for the MVP, with a clear path to API-based dynamic updates as we scale.

## Migration Notes

As of July 18, 2025, we've completed a major cleanup:
- Archived old generator versions (v1, v2, v3)
- Removed duplicate files and test files
- Consolidated to V4 generator with Spain-first focus
- Established clear deprecation timeline for legacy systems

---

**Remember**: Every breach we document should answer "Would our assessment have caught this?" - creating a feedback loop that continuously improves our framework.