# Weekly Intelligence Report - July 17, 2025

## Executive Summary

This week's threat landscape shows a **23% increase in supply chain attacks** targeting LATAM organizations, with financial and government sectors showing improved immunity scores while retail and manufacturing remain vulnerable.

### Key Metrics
- **Average Digital Immunity**: 3.6/5.0 (↑ 0.2 from last week)
- **Weekly Attacks Tracked**: 3,142 (↑ 10.3%)
- **Primary Threat Vector**: Ransomware & Supply Chain (58%)
- **Low Immunity Victims**: 72% of affected organizations

## Business Model Analysis

### High Performers (DII > 4.0)
1. **INFORMACION_REGULADA** (4.5) - Stable
   - Strong compliance frameworks paying dividends
   - Advanced threat detection capabilities
   - Recommended focus: Continuous compliance automation

2. **SERVICIOS_FINANCIEROS** (4.2) - Improving
   - 37 companies in our database (avg confidence: 94.5%)
   - Key threats: AI-powered fraud, API attacks
   - Notable: Brazilian bank stopped deepfake attack in 12 minutes

### Medium Risk (DII 3.0-4.0)
1. **SOFTWARE_CRITICO** (3.9) - Improving
   - 10 companies tracked (avg confidence: 76.4%)
   - Focus needed on SBOM implementation
   - Zero-day exploit concerns rising

2. **ECOSISTEMA_DIGITAL** (3.4) - Stable
   - 15 companies monitored (avg confidence: 81.9%)
   - API abuse incidents up 34%
   - Peruvian fintech suffered 2M malicious API requests

3. **SERVICIOS_DATOS** (3.1) - Declining ⚠️
   - 23 companies tracked (avg confidence: 69.8%)
   - Colombian MinTIC ransomware: 48-hour outage
   - Data exfiltration primary concern

### High Risk (DII < 3.0)
1. **CADENA_SUMINISTRO** (2.9) - Declining ⚠️
   - Third-party breaches cascading
   - Urgent need for TPRM programs

2. **COMERCIO_HIBRIDO** (2.8) - Stable
   - 46 companies tracked (avg confidence: 83.8%)
   - Mexican retailer: 50,000 cards compromised
   - Magecart attacks during Hot Sale season

3. **INFRAESTRUCTURA_HEREDADA** (2.2) - Declining ⚠️
   - 13 companies monitored (avg confidence: 78.1%)
   - Argentine energy sector: SCADA compromise
   - Legacy system vulnerabilities critical

## Regional Incident Highlights

### Critical Incidents This Week

| Date | Country | Sector | Impact | Business Model | Key Learning |
|------|---------|--------|--------|----------------|--------------|
| Jul 16 | Colombia | Government | High | SERVICIOS_DATOS | Ransomware disrupted digital citizen services for 48h |
| Jul 15 | Brazil | Financial | Medium | SERVICIOS_FINANCIEROS | AI-powered fraud detected within 12 minutes |
| Jul 14 | Mexico | Retail | High | COMERCIO_HIBRIDO | 50K cards compromised during Hot Sale |
| Jul 13 | Argentina | Energy | Critical | INFRAESTRUCTURA_HEREDADA | Supply chain compromise → SCADA access |
| Jul 12 | Chile | Healthcare | High | INFORMACION_REGULADA | 200K medical records exfiltrated |

## Threat Actor Activity

### Active Groups
1. **FIN7 LATAM Division** - Very High Activity
   - Operation "Verano Caliente" targeting retailers
   - Focus: POS malware, supply chain compromise

2. **Lapsus$ Affiliates** - High Activity
   - Social engineering campaigns in Brazil/Mexico
   - Insider recruitment attempts detected

3. **Vice Society** - Medium Activity
   - University attacks in Colombia/Argentina
   - Exploiting unpatched VPNs

## Actionable Recommendations

### For Companies in Our Database

#### Immediate Actions (This Week)
1. **17 Low-Confidence Companies** (Review Queue)
   - Prioritize reassessment of DII classifications
   - Focus on: MINTIC Colombia, government entities
   - Update threat profiles based on recent incidents

2. **Supply Chain Risk (All Models)**
   - Implement emergency vendor assessment
   - Map critical third-party dependencies
   - Deploy supply chain monitoring

#### 30-Day Initiatives
1. **API Security (ECOSISTEMA_DIGITAL, SERVICIOS_FINANCIEROS)**
   - Deploy API gateways with rate limiting
   - Implement behavioral analysis
   - Regular API inventory updates

2. **Zero Trust Architecture (SERVICIOS_DATOS, INFORMACION_REGULADA)**
   - Identity-centric security model
   - Microsegmentation priorities
   - Continuous verification protocols

3. **Legacy Modernization (INFRAESTRUCTURA_HEREDADA)**
   - OT/IT convergence roadmap
   - Network isolation for critical systems
   - Compensating controls implementation

## Market Intelligence Integration

### Portfolio Companies at Risk
Based on our 150 migrated companies:
- **28 Colombian companies**: High exposure to government sector attacks
- **37 Financial services**: Leading in defense but facing AI threats
- **46 Hybrid commerce**: Urgent e-commerce security needed

### Sector-Specific Alerts
1. **Financial Services** (37 companies)
   - Deploy anti-deepfake measures immediately
   - API security assessment critical
   
2. **Government/Public** (25 companies)
   - Ransomware preparedness drills
   - Backup verification procedures

3. **Retail/Commerce** (46 companies)
   - Payment security audit before peak season
   - Third-party script monitoring

## Technical Indicators

### Emerging TTPs
- **T1566.001**: Spearphishing with AI-generated content
- **T1195.002**: Supply chain software compromise
- **T1552.001**: Credentials in cloud metadata
- **T1040**: Network sniffing on hybrid work networks

### Detection Opportunities
```
# API Abuse Detection
- Threshold: >1000 requests/minute from single source
- Pattern: Sequential ID enumeration
- Indicator: Unusual geographic dispersion

# Supply Chain Indicators
- New executables from vendor updates
- Unexpected network connections post-update
- Certificate anomalies in signed code
```

## Weekly Forecast

### Next 7 Days
- **High Probability**: Continued ransomware targeting government
- **Medium Probability**: API abuse in financial services
- **Emerging Risk**: AI-powered social engineering

### Preparedness Checklist
- [ ] Verify backup integrity and recovery procedures
- [ ] Update API rate limiting rules
- [ ] Review vendor access permissions
- [ ] Conduct phishing simulation
- [ ] Test incident response runbooks

## Dashboard Access

- **Interactive Dashboard**: [View Weekly Dashboard](./outputs/dashboards/immunity-dashboard-2025-07-17.html)
- **Company Review Queue**: [17 companies requiring reassessment](../data/review_queue.csv)
- **Full Migration Report**: [150 companies analyzed](../data/migration_report.json)

---

*Generated: July 17, 2025 | Next Report: July 24, 2025*  
*Data Sources: OTX, Regional CERTs, Perplexity Research, Internal Company Database*