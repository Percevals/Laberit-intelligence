# DII Intelligence Platform - Weekly Report Generation Guide

## Quick Start for Next Weekly Report

### 📅 Weekly Report Checklist

1. **Create week folder**: `research/2025/week-XX/` (use current ISO week number)
2. **Collect intelligence data** and save as `weekly-intelligence.json`
3. **Run generator**: `python3 immunity_dashboard_generator_v4.py`
4. **Output**: `outputs/dashboards/immunity-dashboard-YYYY-MM-DD.html`

### 🔑 Critical Requirements

- **Spain incidents are mandatory** - Dashboard will warn if missing
- **Minimum 2-3 incidents per week** - Mix of Spain + LATAM
- **Business lessons in Spanish** - Executive-focused insights
- **All incident descriptions in Spanish** - Generator includes translation helper

### 📋 Data Template

Save as `research/2025/week-XX/weekly-intelligence.json`:

```json
{
  "week_date": "2025-MM-DD",
  "week_summary": {
    "immunity_avg": "X.X",
    "attacks_week": "X,XXX",
    "top_threat_pct": "+XX%",
    "top_threat_type": "Threat Name",
    "victims_low_immunity_pct": "XX%",
    "key_insight": "Spain-specific insight + LATAM trend"
  },
  "dii_dimensions": {
    "TRD": {"value": "XX", "trend": "stable|improving|declining"},
    "AER": {"value": "XX", "trend": "stable|improving|declining"},
    "HFP": {"value": "XX", "trend": "stable|improving|declining"},
    "BRI": {"value": "XX", "trend": "stable|improving|declining"},
    "RRG": {"value": "X.X", "trend": "stable|improving|declining"}
  },
  "incidents": [
    {
      "date": "2025-MM-DD",
      "country": "España",  // At least one Spain incident required
      "sector": "Sector Name",
      "org_name": "Organization Name",
      "attack_type": "Ransomware|Data Breach|API Attack|etc",
      "business_model": "SERVICIOS_FINANCIEROS|INFORMACION_REGULADA|etc",
      "impact": "Critical|High|Medium",
      "summary": "Incident description in English (will be translated)",
      "business_lesson": "Lección ejecutiva en español"
    }
  ],
  "recommendations": [
    {
      "priority": "CRÍTICA|ALTA|MEDIA",
      "recommendation": "Acción específica en español",
      "business_models": ["MODEL1", "MODEL2"],
      "expected_impact": "Resultado esperado con métricas"
    }
  ]
}
```

### 🚀 Dashboard Features

- **Interactive incident filtering**: Spain / LATAM / Critical
- **Risk position matrix**: Visual business model analysis
- **Attack economics scale**: €1 attacker vs €XX organization loss
- **Mobile responsive**: Works on all devices
- **Executive tooltips**: Hover for additional context

## Current Status (Updated: July 18, 2025)

### Latest Dashboard
- **File**: `outputs/dashboards/immunity-dashboard-2025-07-18.html`
- **Framework**: `immunity-framework-v2.html` (updated with latest dashboard link)
- **Template**: `templates/immunity_dashboard_template_v4.html`

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

## 🏢 Business Model Reference

Use these exact model names in incident data:

- `SERVICIOS_FINANCIEROS` - Banks, insurance, fintech
- `INFORMACION_REGULADA` - Healthcare, education, government
- `ECOSISTEMA_DIGITAL` - Marketplaces, platforms, APIs
- `CADENA_SUMINISTRO` - Logistics, supply chain, distribution
- `SOFTWARE_CRITICO` - SaaS, critical software providers
- `SERVICIOS_DATOS` - Data processors, analytics companies
- `COMERCIO_HIBRIDO` - Retail with physical + digital
- `INFRAESTRUCTURA_HEREDADA` - Utilities, manufacturing, legacy

## 📞 Support

- **Generator issues**: Check `immunity_dashboard_generator_v4.py`
- **Template updates**: Edit `templates/immunity_dashboard_template_v4.html`
- **Historical data**: See `archive/` directory

---

**Next Report Due**: Week 30 (July 25, 2025) - Remember Spain incidents!