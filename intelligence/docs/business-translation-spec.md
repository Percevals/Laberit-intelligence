# Business Translation Layer - Technical Specification
## Transforming Technical Intelligence into C-Suite Insights

### Executive Summary

This specification defines the Business Translation Layer that sits between our technical intelligence sources (OTX, AlienVault) and the C-suite dashboards. Instead of adding more technical feeds, we translate existing data into business impact metrics mapped to our 8 DII business models.

**Core Innovation**: "That Cobalt Strike campaign cost companies like yours $1.8M on average, and here's the $5K fix that would have stopped it."

---

## Architecture Overview

```
Current Technical Layer          Business Translation Layer           Output
━━━━━━━━━━━━━━━━━━━━━          ━━━━━━━━━━━━━━━━━━━━━━━━━          ━━━━━━━
                                                                    
OTX Indicators      ─────→     Business Model Mapper    ─────→    "Ecosistema Digital 
(IPs, domains, IOCs)           (Technical → Model 1-8)            companies targeted"
                                                                    
AlienVault Threats  ─────→     Cost Estimation Engine   ─────→    "$1.2M average loss
(Campaigns, malware)           (Attack → Regional Cost)           in LATAM region"
                                                                    
Weekly Intel RSS    ─────→     Peer Company Matcher     ─────→    "3 fintech platforms
(Regional incidents)           (Profile → Similar Cases)          hit this month"
                                                                    
MISP Events (opt)   ─────→     Prevention Translator    ─────→    "MFA on legacy auth
(Structured threats)           (IOCs → Simple Fixes)              would have stopped this"
```

---

## Component Specifications

### 1. Business Model Mapper
**Purpose**: Map technical indicators to our 8 business models

```python
class BusinessModelMapper:
    """
    Maps technical threats to DII business models based on attack patterns
    """
    
    def map_threat_to_model(self, threat_data: dict) -> list[int]:
        """
        Returns list of affected business models (1-8)
        
        Example:
        - Ransomware → All models (1-8)
        - POS Malware → Comercio Híbrido (1)
        - API Attack → Software Crítico (2), Ecosistema Digital (4)
        - Supply Chain → Cadena de Suministro (7)
        """
        
    def get_model_exposure(self, iocs: list, model_id: int) -> float:
        """
        Calculate exposure level (0-1) for specific model
        Based on infrastructure patterns typical to that model
        """
```

**Mapping Rules**:
```yaml
attack_patterns:
  ransomware:
    affects: [1,2,3,4,5,6,7,8]  # All models
    primary_impact: [6]         # Infraestructura Heredada
  
  api_exploitation:
    affects: [2,3,4,5]
    primary_impact: [4]         # Ecosistema Digital
  
  supply_chain:
    affects: [1,6,7]
    primary_impact: [7]         # Cadena de Suministro
    
  data_exfiltration:
    affects: [3,5,8]
    primary_impact: [3]         # Servicios de Datos
```

### 2. Cost Estimation Engine
**Purpose**: Convert attacks into regional financial impact

```python
class CostEstimationEngine:
    """
    Estimates financial impact based on attack type, region, and company size
    """
    
    def estimate_cost(self, 
                     attack_type: str,
                     business_model: int,
                     region: str,
                     company_size: str) -> dict:
        """
        Returns cost estimate with confidence level
        
        Example return:
        {
            "min_cost_usd": 500000,
            "avg_cost_usd": 1800000,
            "max_cost_usd": 4500000,
            "downtime_days": 7,
            "recovery_multiplier": 3.2,  # From DII RRG data
            "confidence": 0.75,
            "based_on": "15 similar incidents in LATAM"
        }
        """
```

**Cost Database Structure**:
```json
{
  "ransomware": {
    "LATAM": {
      "avg_ransom": 250000,
      "avg_downtime_cost_per_day": 150000,
      "avg_recovery_cost": 500000,
      "incidents_count": 47
    },
    "by_model": {
      "1": {"multiplier": 0.8, "reason": "Physical backup options"},
      "5": {"multiplier": 1.5, "reason": "Regulatory penalties"},
      "6": {"multiplier": 1.3, "reason": "Legacy system complexity"}
    }
  }
}
```

### 3. Peer Company Matcher
**Purpose**: Find similar companies that were breached

```python
class PeerCompanyMatcher:
    """
    Matches user profile to similar breach victims
    """
    
    def find_similar_breaches(self,
                            business_model: int,
                            company_size: str,
                            region: str,
                            sector: str) -> list[dict]:
        """
        Returns list of similar companies (anonymized) that were breached
        
        Example return:
        [{
            "description": "Colombian fintech, 500 employees",
            "attack": "BEC via O365",
            "impact": "$400K stolen",
            "date": "2024-11",
            "similarity_score": 0.87
        }]
        """
```

### 4. Prevention Translator
**Purpose**: Convert technical IOCs into business-friendly prevention advice

```python
class PreventionTranslator:
    """
    Translates technical indicators into simple prevention steps
    """
    
    def get_prevention_advice(self,
                            attack_pattern: str,
                            business_model: int) -> dict:
        """
        Returns practical prevention advice with cost/complexity
        
        Example return:
        {
            "immediate_actions": [
                {
                    "action": "Disable LLMNR/NetBIOS",
                    "cost": "$0",
                    "time": "1 hour",
                    "reduces_risk_by": "40%"
                }
            ],
            "quick_wins": [
                {
                    "action": "MFA on all admin accounts",
                    "cost": "$50/month",
                    "time": "1 day",
                    "reduces_risk_by": "80%"
                }
            ],
            "strategic_fixes": [
                {
                    "action": "Zero Trust architecture",
                    "cost": "$50K-$200K",
                    "time": "6 months",
                    "reduces_risk_by": "95%"
                }
            ]
        }
        """
```

---

## Data Sources & Enrichment

### Primary Sources (Existing)
- **OTX**: Technical indicators
- **AlienVault**: Threat intelligence
- **Weekly RSS**: Regional incidents

### Business Context Sources (New)
```yaml
cost_sources:
  - source: "IBM Cost of Breach Report"
    type: "annual_report"
    regions: ["LATAM", "Global"]
    
  - source: "Ponemon Institute"
    type: "research"
    focus: "Industry costs"
    
  - source: "Cyber Insurance Claims"
    type: "aggregated_data"
    update: "quarterly"

breach_databases:
  - source: "HaveIBeenPwned Business"
    type: "api"
    use: "Company breach history"
    
  - source: "Regional CERT Reports"
    type: "public_data"
    countries: ["CO", "MX", "BR", "AR", "CL"]
```

### Enrichment Pipeline
```
Technical Incident → Extract Key Attributes → Match Business Model
                                            → Estimate Costs
                                            → Find Similar Cases
                                            → Generate Advice
                                            → Create C-Suite Summary
```

---

## Implementation Phases

### Phase 1: Model Mapping (Week 1)
- Implement BusinessModelMapper
- Create attack pattern rules
- Test with historical OTX data
- Validate with 150 DII assessments

### Phase 2: Cost Engine (Week 2)
- Build cost database structure
- Import regional cost data
- Create estimation algorithms
- Add confidence scoring

### Phase 3: Integration (Week 3)
- Connect to existing pipeline
- Enhance JSON output format
- Update dashboard visualizations
- Add C-suite summaries

### Phase 4: Validation (Week 4)
- Test with real incidents
- Refine cost estimates
- Improve matching accuracy
- Gather user feedback

---

## Output Examples

### Technical Input (Current)
```json
{
  "indicator": "malicious.domain.com",
  "type": "c2_server",
  "malware": "Cobalt Strike",
  "first_seen": "2024-11-01",
  "targets": ["finance", "retail"]
}
```

### Business Translation (New)
```json
{
  "executive_summary": "Cobalt Strike campaign targeting Latin American financial platforms",
  "affected_models": [
    {
      "id": 5,
      "name": "Servicios Financieros",
      "risk_level": "CRITICAL"
    }
  ],
  "business_impact": {
    "estimated_loss_range": "$800K - $2.5M USD",
    "downtime_estimate": "3-7 days",
    "similar_incidents": 3,
    "regional_frequency": "2 per month"
  },
  "peer_examples": [
    {
      "profile": "Mexican fintech, 300 employees",
      "impact": "$1.2M loss + 5 days downtime",
      "root_cause": "Phishing → RDP → Lateral movement"
    }
  ],
  "prevention": {
    "would_have_stopped": "MFA on RDP (Cost: $0)",
    "quick_wins": [
      "Disable RDP from internet ($0, 1 hour)",
      "Implement PAM solution ($5K/year)"
    ]
  },
  "cfo_metrics": {
    "cost_to_prevent": "$5,000",
    "cost_if_hit": "$1,200,000",
    "roi": "240x",
    "implementation_time": "1 week"
  }
}
```

---

## Success Metrics

### Technical Metrics
- Attack → Model mapping accuracy: >85%
- Cost estimation confidence: >70%
- Similar company matches: 3+ per incident

### Business Metrics
- C-suite engagement rate: >60%
- "This could be us" recognition: >80%
- Prevention implementation: >40%
- Time to insight: <5 minutes

---

## Integration Points

### With Existing Systems
1. Extends current `weekly_intelligence.json` format
2. Enhances dashboard with business context
3. Feeds into DII assessment questions
4. Provides evidence for recommendations

### With Future Systems
1. Real-time alerting for model-specific threats
2. Automated client notifications
3. Prevention ROI calculator
4. Peer benchmarking service

---

## Development Guidelines

### Key Principles
1. **Evidence over speculation**: Only claim what we can prove
2. **Simple over complex**: If CEOs don't understand, we failed
3. **Regional over global**: LATAM/Spain context matters
4. **Practical over perfect**: $5K fix beats $500K solution

### Code Standards
```python
# Every translation must be traceable
def translate_incident(technical_data: dict) -> dict:
    """
    Translates technical incident to business impact
    
    Args:
        technical_data: Raw threat intelligence
        
    Returns:
        Business context with:
        - affected_models: List of DII models at risk
        - estimated_cost: Regional cost estimate
        - peer_examples: Similar anonymized cases
        - prevention: What would have stopped this
        
    Traces:
        - source_indicators: Original IOCs
        - confidence_score: 0-1
        - data_sources: Where estimates come from
    """
```

---

## Next Steps

1. **Validate concept** with 5 recent incidents
2. **Build Phase 1** (Model Mapper) 
3. **Test with existing** OTX/AlienVault data
4. **Iterate based on** actual translations
5. **Deploy incrementally** to production

Remember: We're not building another threat intel platform. We're building the world's first threat-to-business-impact translator.