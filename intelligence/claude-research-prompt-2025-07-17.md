# Claude Research Prompt for Weekly DII Intelligence Dashboard
## Week of July 17, 2025

### Context
You are helping generate the weekly Digital Immunity Index (DII) intelligence report for LATAM and Spain. The DII framework measures organizations' ability to maintain business value while under active cyber attack, using the formula: DII = (TRD × AER) / (HFP × BRI × RRG)

### Your Task
Research and compile cybersecurity incidents, threat trends, and business impacts for the week of July 11-17, 2025, focusing on LATAM (Mexico, Colombia, Brazil, Argentina, Chile, Peru, Ecuador, Uruguay, Venezuela, Central America, Caribbean) and Spain.

### Required Research Areas

#### 1. **Major Cyber Incidents This Week** (Find 6-10 incidents)
For each incident, identify:
- **Date** (July 11-17, 2025)
- **Country** 
- **Organization name** (or sector if name not disclosed)
- **Sector** (Financial, Government, Healthcare, Retail, Energy, Technology, etc.)
- **Attack type** (Ransomware, Supply Chain, Data Breach, API Abuse, Phishing, etc.)
- **Business impact** (Critical/High/Medium/Low)
- **Brief summary** (2-3 sentences on what happened)
- **Business model affected** (match to one of these 8 models):
  - SERVICIOS_FINANCIEROS (banks, insurance)
  - INFORMACION_REGULADA (healthcare, education)
  - ECOSISTEMA_DIGITAL (marketplaces, platforms)
  - CADENA_SUMINISTRO (logistics operators)
  - SOFTWARE_CRITICO (SaaS, critical software)
  - SERVICIOS_DATOS (data processors, analytics)
  - COMERCIO_HIBRIDO (retail with online/offline)
  - INFRAESTRUCTURA_HEREDADA (utilities, legacy systems)

#### 2. **Regional Threat Trends**
Identify 3-5 emerging patterns:
- What types of attacks are increasing?
- Which sectors are being targeted most?
- What new techniques or tools are attackers using?
- Include percentage increases where possible

#### 3. **Active Threat Actors**
List 3-4 threat groups active in LATAM:
- Group name
- Activity level (Very High/High/Medium)
- Target sectors
- Recent campaigns or operations

#### 4. **Statistical Overview**
Provide estimates for:
- Total incidents tracked this week
- Most affected sectors (percentages)
- Average detection time
- Primary attack vectors distribution

#### 5. **Business Impact Analysis**
For each business model, assess:
- Current average immunity level (1-10 scale)
- Trend (improving/stable/declining)
- Key vulnerabilities observed this week
- One specific recommendation

### Search Strategy Suggestions

1. **Search Queries to Use**:
   - "ransomware attack july 2025" + [country name]
   - "data breach july 2025 latam"
   - "cyber attack" + [country] + "julio 2025"
   - "ciberataque" + [país] + "esta semana"
   - Site-specific: site:bleepingcomputer.com, site:theregister.com, site:cybersecuritynews.com
   - Regional sources: "incibe españa", "cert colombia", "csirt mexico"

2. **Key Sources to Check**:
   - Regional CERTs/CSIRTs websites
   - Local tech news in Spanish/Portuguese
   - Security vendor blogs (Kaspersky LATAM, ESET LATAM)
   - Social media for breaking incidents
   - Industry-specific news sites

3. **Languages to Search**:
   - Spanish: "ciberataque", "ransomware", "brecha de datos", "esta semana"
   - Portuguese: "ataque cibernético", "vazamento de dados", "esta semana"
   - English: Focus on LATAM/Spain specific incidents

### Output Format Required

Please structure your findings in this JSON format:

```json
{
  "research_date": "2025-07-17",
  "week_summary": {
    "total_incidents_found": "[number]",
    "most_affected_country": "[country]",
    "dominant_attack_type": "[type]",
    "key_finding": "[1-2 sentence insight about the week]"
  },
  "incidents": [
    {
      "date": "2025-07-XX",
      "country": "[Country]",
      "organization": "[Name or 'Undisclosed [sector] company']",
      "sector": "[Sector]",
      "attack_type": "[Type]",
      "business_model": "[One of the 8 models]",
      "impact_level": "[Critical/High/Medium/Low]",
      "summary": "[2-3 sentences]",
      "source": "[URL if available]"
    }
  ],
  "threat_trends": [
    {
      "trend": "[Trend name]",
      "growth": "[+X% or qualitative]",
      "affected_countries": ["List"],
      "business_impact": "[Impact description]"
    }
  ],
  "threat_actors": [
    {
      "name": "[Group name]",
      "activity_level": "[Very High/High/Medium]",
      "target_sectors": ["List"],
      "recent_operation": "[Brief description]"
    }
  ],
  "statistics": {
    "sectors_distribution": {
      "Financial": "X%",
      "Government": "X%",
      "Healthcare": "X%",
      "Other": "X%"
    },
    "attack_types_distribution": {
      "Ransomware": "X%",
      "Data Breach": "X%",
      "Supply Chain": "X%",
      "Other": "X%"
    }
  },
  "business_model_assessment": {
    "SERVICIOS_FINANCIEROS": {
      "current_immunity": "4.2",
      "trend": "improving",
      "key_vulnerability": "[Observed this week]",
      "recommendation": "[Specific action]"
    }
    // ... repeat for all 8 models
  }
}
```

### Important Notes

1. **Prioritize Recent Incidents**: Focus on July 11-17, 2025. If not enough incidents this exact week, include late June/early July.

2. **Business Impact Focus**: Always think about how the incident affects business operations, not just technical details.

3. **Regional Relevance**: Prioritize LATAM and Spain. Include global incidents only if they directly affect these regions.

4. **Verify Business Models**: Match each incident to the most appropriate business model from the 8 provided.

5. **Language**: You can provide summaries in English, but note if original sources were in Spanish/Portuguese.

### Additional Context

The goal is to create actionable intelligence that helps organizations understand:
- What happened this week that affects their business model
- What threats are emerging in their region
- What specific actions they should take

Focus on quality over quantity - 6 well-researched incidents are better than 20 vague ones.

---

Please conduct this research and provide the structured JSON output. If you cannot find specific information, note it as "No data available" rather than making assumptions.