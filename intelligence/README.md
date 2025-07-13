# DII Intelligence Platform - Architecture & Vision

## Overview

The DII Intelligence Platform combines historical vulnerability assessments with real-time breach intelligence to deliver actionable cyber risk insights. Unlike predictive models, we show actual breaches happening to similar companies and compare them against assessed vulnerabilities.

**Core Value**: "See how vulnerable companies like yours are, what's hitting them now, and whether you're stronger or weaker than the victims."

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

### Breach Evidence Structure
```json
{
  "breach_id": "BEL-2024-W45-001",
  "date": "2024-11-15",
  "victim_profile": {
    "size": "1000-5000 employees",
    "region": "Colombia",
    "sector": "Financial Services"
  },
  "business_model_match": 5, // Servicios Financieros
  "attack": {
    "vector": "Business Email Compromise",
    "method": "Azure AD legacy protocol bypass",
    "duration_days": 3
  },
  "impact": {
    "financial_loss_usd": 400000,
    "downtime_hours": 72,
    "data_compromised": "customer_records"
  },
  "defenses": {
    "failed": ["MFA on legacy protocols", "Email filtering"],
    "succeeded": ["Behavioral analytics", "Incident response plan"]
  },
  "recovery": {
    "planned_hours": 24,
    "actual_hours": 72,
    "key_delays": ["Backup corruption", "Forensics requirements"]
  }
}
```

## Intelligence Flow

```
Weekly Intelligence → Breach Structuring → Model Mapping → Evidence Library
                                                               ↓
User Profile → Model Selection → Peer Comparison ← Risk Matching Engine
                                        ↓
                              Personalized Risk Report
```

## Business Model Mapping

| ID | Model | Key Vulnerabilities | Common Attacks |
|----|-------|-------------------|----------------|
| 1 | Comercio Híbrido | POS systems, supplier access | POS malware, supply chain |
| 2 | Software Crítico | API security, tenant isolation | API abuse, data leaks |
| 3 | Servicios de Datos | Data exfiltration, insider threat | Data theft, ransomware |
| 4 | Ecosistema Digital | Platform complexity, third parties | API attacks, account takeover |
| 5 | Servicios Financieros | Financial fraud, compliance | BEC, ransomware, fraud |
| 6 | Infraestructura Heredada | Legacy systems, patching delays | Ransomware, exploitation |
| 7 | Cadena de Suministro | Supplier access, tracking systems | Supply chain, ransomware |
| 8 | Información Regulada | Compliance, data privacy | Data theft, ransomware |

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

## Implementation Priorities

### Phase 1: Breach Evidence Collection
- Structure weekly intelligence into breach cases
- Verify costs and recovery times
- Map each breach to business models
- Build initial library (50+ cases)

### Phase 2: Vulnerability Analytics
- Analyze 150 historical assessments
- Create peer group benchmarks
- Identify vulnerability patterns
- Generate model risk profiles

### Phase 3: Matching Engine
- Develop similarity algorithms
- Create risk comparison logic
- Build personalized reporting
- Enable continuous updates

## API Endpoints (Planned)

```
GET /api/intelligence/models/{id}/breaches
  → Recent breaches for specific business model

GET /api/intelligence/models/{id}/vulnerabilities  
  → Peer vulnerability statistics

POST /api/intelligence/match
  → Match user profile to relevant breaches

GET /api/intelligence/breach/{id}
  → Detailed breach information
```

## Success Metrics

1. **Evidence Coverage**: Breaches documented per business model
2. **Match Accuracy**: Users confirming "this could be us"
3. **Action Rate**: Users implementing recommended fixes
4. **Update Frequency**: New breaches added weekly

## Technical Requirements

- **Data Storage**: JSON files for static deployment
- **Processing**: Client-side JavaScript for matching
- **Updates**: Weekly manual updates (automated later)
- **Security**: No storage of client identifying data

## Directory Structure

```
/intelligence/
├── README.md                 # This file
├── breach-evidence/         
│   ├── index.json           # Breach catalog
│   ├── 2024/               
│   │   └── week-45/        # Weekly breach cases
│   └── by-model/           # Filtered views
├── vulnerability-baseline/  
│   ├── model-stats.json    # Aggregated from 150 assessments
│   └── peer-benchmarks.json
├── weekly-reports/         # Current format (legacy)
└── api/                    # Future API specs
```

## For Developers

This intelligence platform serves as the evidence engine for the DII Assessment Platform. It provides:

1. **Context**: Why certain questions matter (backed by breaches)
2. **Urgency**: What's happening right now to similar companies
3. **Validation**: Proof that our vulnerability assessments predict real risk
4. **Action**: What actually works to prevent/mitigate attacks

The architecture is designed to be static-first (JSON files) for the MVP, with a clear path to API-based dynamic updates as we scale.

---

**Remember**: Every breach we document should answer "Would our assessment have caught this?" - creating a feedback loop that continuously improves our framework.